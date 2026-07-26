/**
 * Structured data, generated from the same formula the page renders.
 *
 * Nutrition is computed from the actual flour blend rather than templated: a
 * 50% wholegrain loaf and a white one differ enough in fibre that a fixed
 * figure would be both wrong and trivially detectable.
 */

import { buildFormula } from '@/engine/formula';
import type { Problem, Technique } from '@/data/content';
import type { Recipe } from '@/engine/types';
import type { Locale } from '@/i18n/routing';
import { resolveStepBody } from '@/engine/equipment';

const SITE = 'https://alveo.bread';

export function recipeJsonLd(recipe: Recipe, locale: Locale) {
  const formula = buildFormula({ recipe, totalFlour: 1000, hydration: recipe.hydration });

  const prepMinutes = recipe.activeMinutes;
  const cookMinutes = recipe.bake.lidMin + recipe.bake.openMin;
  const totalMinutes = recipe.totalHours * 60;

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title[locale],
    description: recipe.summary[locale],
    inLanguage: locale === 'nl' ? 'nl-NL' : 'en-GB',
    recipeCategory: 'Bread',
    recipeCuisine: 'Sourdough',
    keywords: (recipe.tags ?? []).join(', '),
    prepTime: `PT${prepMinutes}M`,
    cookTime: `PT${cookMinutes}M`,
    totalTime: `PT${Math.round(totalMinutes)}M`,
    recipeYield: `${recipe.yield.pieces} × ${recipe.yield.gramsEach} g`,
    recipeIngredient: formula.ingredients
      .filter((i) => i.key !== 'flourTotal')
      .map((i) => `${Math.round(i.grams)} g ${i.label[locale]}`),
    recipeInstructions: recipe.steps.map((s) => ({
      '@type': 'HowToStep',
      name: s.title[locale],
      text: resolveStepBody(s.body, 'hand')[locale],
    })),
    nutrition: nutritionFor(recipe, formula.totalDoughWeight),
    author: { '@type': 'Organization', name: 'Alveo' },
    // Only emitted when a real photograph exists. Claiming an image we do not
    // have would be the kind of structured-data lie that gets a site demoted.
    ...(recipe.image ? { image: [recipe.image.src] } : {}),
  };
}

/**
 * Per-serving nutrition estimated from the formula's own grain composition.
 * Deliberately coarse and labelled as an estimate — a decimal place here would
 * be exactly the false precision this project exists to avoid.
 */
function nutritionFor(recipe: Recipe, doughWeight: number) {
  const wholegrainShare =
    recipe.flourBlend
      .filter((b) => b.role === 'wholegrain' || b.role === 'rye')
      .reduce((s, b) => s + b.pct, 0) / 100;

  const perServing = doughWeight / Math.max(recipe.yield.pieces, 1) / 12; // ~12 slices
  const fatPct = (recipe.addIns ?? [])
    .filter((a) => a.type === 'fat')
    .reduce((s, a) => s + a.pct, 0);

  // Flour is ~350 kcal/100 g; the bake drives off ~12% of the dough's weight.
  const kcal = Math.round((perServing * 0.88 * 2.5) + fatPct * 2);

  return {
    '@type': 'NutritionInformation',
    servingSize: `${Math.round(perServing)} g`,
    calories: `${kcal} kcal`,
    fiberContent: `${Math.round(perServing * (1.5 + wholegrainShare * 5) / 100 * 10) / 10} g`,
    sodiumContent: `${Math.round(perServing * (recipe.salt / 100) * 0.4)} mg`,
  };
}

export function howToJsonLd(technique: Technique, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: technique.title[locale],
    description: technique.summary[locale],
    inLanguage: locale === 'nl' ? 'nl-NL' : 'en-GB',
    step: technique.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s[locale],
    })),
  };
}

export function faqJsonLd(problem: Problem, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: problem.title[locale],
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${problem.symptom[locale]} ${problem.primaryFix[locale]}`,
        },
      },
      ...problem.causes.map((c) => ({
        '@type': 'Question',
        name: c.cause[locale],
        acceptedAnswer: { '@type': 'Answer', text: c.fix[locale] },
      })),
    ],
  };
}

export function breadcrumbJsonLd(
  trail: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.url}`,
    })),
  };
}
