import { requireFlour } from '@/data/flours';
import type { Flour, FlourRole, Recipe } from '@/engine/types';

import {
  baguettes, ciabatta, everydayCountry, highHydrationWhite,
  painDeCampagne, wholegrainCountry,
} from './hearth';
import { focaccia, pizza, rugbrod, sandwichTin } from './pan';
import { bagels, pretzels, brioche, englishMuffins, porridgeMultigrain } from './alternates';
import { beginnersLoaf, highExtractionCountry, mixedGrainMiche } from './traditions';
import {
  dinnerRolls, burgerBuns, milkBread, cinnamonRolls, chocolateBabka,
  currantBuns, softSubRolls,
} from './enriched2';
import {
  pita, naan, flatbread, grissini, crackers, simit, manakish, panPizza,
  pizzaBianca, crumpets,
} from './flatbreads';
import {
  speltTin, einkornPan, khorasanLoaf, emmerLoaf, wholeWheatTin, grahamTin,
  deliRye, vollkornbrot, pumpernickel, seededTin, walnutRaisin, oliveRosemary,
  malthouseLoaf, durumLoaf, potatoBread,
} from './grains';

/**
 * Families are how a reader navigates fifty breads.
 *
 * The grouping is by *what you do and what you bake it in*, not by grain —
 * grain is already a filter, and a reader looking for something to bake on a
 * Tuesday is choosing between "a loaf in a tin" and "something on a griddle"
 * long before they are choosing between spelt and emmer.
 *
 * This array is the single source of truth: `RECIPES` is its flattening, so a
 * recipe cannot exist without a family and cannot sit in two.
 */
export type RecipeFamily = 'hearth' | 'tin' | 'enriched' | 'flat' | 'griddle';

export interface FamilyGroup {
  key: RecipeFamily;
  label: { nl: string; en: string };
  blurb: { nl: string; en: string };
  recipes: Recipe[];
}

export const FAMILIES: FamilyGroup[] = [
  {
    key: 'hearth',
    label: { nl: 'Vrijstaande ovenbroden', en: 'Hearth loaves' },
    blurb: {
      nl: 'Broden die hun eigen vorm dragen: boules, bâtards, stokbrood. Hier bepaalt de sterkte van je meel of het brood omhoog gaat of uitzakt — de kern van waar deze site voor gemaakt is.',
      en: 'Loaves that carry their own shape: boules, bâtards, baguettes. Here the strength of your flour decides whether the bread rises or spreads — the heart of what this site is for.',
    },
    recipes: [
      everydayCountry, wholegrainCountry, highHydrationWhite, painDeCampagne,
      ciabatta, baguettes, beginnersLoaf, highExtractionCountry, mixedGrainMiche,
      porridgeMultigrain, khorasanLoaf, emmerLoaf, deliRye, walnutRaisin,
      oliveRosemary, durumLoaf,
    ],
  },
  {
    key: 'tin',
    label: { nl: 'Busbroden', en: 'Tin loaves' },
    blurb: {
      nl: 'De bus draagt wat het deeg zelf niet kan houden, en dat maakt deze broden het vergevingsgezindst met onbekend meel. Ook waar de dichte roggen thuishoren.',
      en: 'The tin carries what the dough cannot hold by itself, which makes these the most forgiving breads on unfamiliar flour. Also where the dense ryes live.',
    },
    recipes: [
      sandwichTin, rugbrod, speltTin, einkornPan, wholeWheatTin, grahamTin,
      vollkornbrot, pumpernickel, seededTin, malthouseLoaf, potatoBread,
    ],
  },
  {
    key: 'enriched',
    label: { nl: 'Verrijkte degen', en: 'Enriched doughs' },
    blurb: {
      nl: 'Boter, ei, melk en suiker. Vet remt de gluten en suiker remt de gist, dus deze degen vragen om sterker meel en meer geduld dan hun zachte resultaat doet vermoeden.',
      en: 'Butter, egg, milk and sugar. Fat restrains the gluten and sugar restrains the yeast, so these doughs want stronger flour and more patience than their soft results suggest.',
    },
    recipes: [
      brioche, dinnerRolls, burgerBuns, milkBread, cinnamonRolls, chocolateBabka,
      currantBuns, softSubRolls,
    ],
  },
  {
    key: 'flat',
    label: { nl: 'Platbroden en pizza', en: 'Flatbreads and pizza' },
    blurb: {
      nl: 'Van pita die in seconden opblaast tot crackers die dagen knapperig blijven. Het snelste deel van de site: veel van deze broden zijn dezelfde dag klaar.',
      en: 'From pita that inflates in seconds to crackers that stay crisp for days. The fastest part of the site: many of these are ready the same day.',
    },
    recipes: [
      focaccia, pizza, pita, naan, flatbread, grissini, crackers, simit,
      manakish, panPizza, pizzaBianca,
    ],
  },
  {
    key: 'griddle',
    label: { nl: 'Gekookt en op de plaat', en: 'Boiled and griddled' },
    blurb: {
      nl: 'Broden die de oven overslaan of er pas na een bad in gaan. De korst ontstaat hier in water of op gietijzer, niet in droge hitte.',
      en: 'Breads that skip the oven, or only meet it after a bath. The crust forms here in water or on cast iron, not in dry heat.',
    },
    recipes: [bagels, pretzels, englishMuffins, crumpets],
  },
];

export const RECIPES: Recipe[] = FAMILIES.flatMap((f) => f.recipes);

const FAMILY_BY_SLUG = new Map<string, RecipeFamily>(
  FAMILIES.flatMap((f) => f.recipes.map((r) => [r.slug, f.key] as const)),
);

/** The family a recipe belongs to. Total by construction — RECIPES is derived. */
export function familyOf(slug: string): RecipeFamily {
  const f = FAMILY_BY_SLUG.get(slug);
  if (!f) throw new Error(`Recipe has no family: ${slug}`);
  return f;
}

export const FAMILY_LABELS: Record<RecipeFamily, { nl: string; en: string }> =
  Object.fromEntries(FAMILIES.map((f) => [f.key, f.label])) as Record<
    RecipeFamily,
    { nl: string; en: string }
  >;

const BY_SLUG = new Map(RECIPES.map((r) => [r.slug, r]));

export function getRecipe(slug: string): Recipe | undefined {
  return BY_SLUG.get(slug);
}

export function requireRecipe(slug: string): Recipe {
  const r = BY_SLUG.get(slug);
  if (!r) throw new Error(`Unknown recipe slug: ${slug}`);
  return r;
}

/** The author's flours, resolved from slugs to real records. */
export function authorFlours(recipe: Recipe): Partial<Record<FlourRole, Flour>> {
  const out: Partial<Record<FlourRole, Flour>> = {};
  for (const [role, slug] of Object.entries(recipe.authorContext.roleFlours)) {
    if (typeof slug === 'string') out[role as FlourRole] = requireFlour(slug);
  }
  return out;
}

/** Roles a recipe needs filled, in the order they appear in the formula. */
export function recipeRoles(recipe: Recipe): FlourRole[] {
  return recipe.flourBlend.map((b) => b.role);
}

export const ROLE_LABELS: Record<FlourRole, { nl: string; en: string }> = {
  'strong-white': { nl: 'sterke witte bloem', en: 'strong white flour' },
  white: { nl: 'witte bloem', en: 'white flour' },
  wholegrain: { nl: 'volkorenmeel', en: 'wholemeal flour' },
  rye: { nl: 'roggemeel', en: 'rye flour' },
  durum: { nl: 'durum', en: 'durum' },
  ancient: { nl: 'oergraan', en: 'ancient grain' },
};

export const FORMAT_LABELS: Record<Recipe['format'], { nl: string; en: string }> = {
  boule: { nl: 'boule', en: 'boule' },
  batard: { nl: 'bâtard', en: 'bâtard' },
  baguette: { nl: 'stokbrood', en: 'baguette' },
  ciabatta: { nl: 'ciabatta', en: 'ciabatta' },
  focaccia: { nl: 'focaccia', en: 'focaccia' },
  pizza: { nl: 'pizza', en: 'pizza' },
  tin: { nl: 'busbrood', en: 'tin loaf' },
  rolls: { nl: 'broodjes', en: 'rolls' },
  enriched: { nl: 'verrijkt deeg', en: 'enriched dough' },
};

export { everydayCountry, wholegrainCountry, highHydrationWhite, painDeCampagne,
  ciabatta, baguettes, focaccia, pizza, sandwichTin, rugbrod,
  bagels, pretzels, brioche, englishMuffins, porridgeMultigrain,
  beginnersLoaf, highExtractionCountry, mixedGrainMiche,
  dinnerRolls, burgerBuns, milkBread, cinnamonRolls, chocolateBabka,
  currantBuns, softSubRolls,
  pita, naan, flatbread, grissini, crackers, simit, manakish, panPizza,
  pizzaBianca, crumpets,
  speltTin, einkornPan, khorasanLoaf, emmerLoaf, wholeWheatTin, grahamTin,
  deliRye, vollkornbrot, pumpernickel, seededTin, walnutRaisin, oliveRosemary,
  malthouseLoaf, durumLoaf, potatoBread };
