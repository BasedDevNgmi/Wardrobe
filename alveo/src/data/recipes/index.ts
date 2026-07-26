import { requireFlour } from '@/data/flours';
import type { Flour, FlourRole, Recipe } from '@/engine/types';

import {
  baguettes, ciabatta, everydayCountry, highHydrationWhite,
  painDeCampagne, wholegrainCountry,
} from './hearth';
import { focaccia, pizza, rugbrod, sandwichTin } from './pan';
import { bagels, pretzels, brioche, englishMuffins, porridgeMultigrain } from './alternates';
import { beginnersLoaf, highExtractionCountry, mixedGrainMiche } from './traditions';

export const RECIPES: Recipe[] = [
  everydayCountry,
  wholegrainCountry,
  highHydrationWhite,
  painDeCampagne,
  ciabatta,
  baguettes,
  focaccia,
  pizza,
  sandwichTin,
  rugbrod,
  bagels,
  pretzels,
  brioche,
  englishMuffins,
  porridgeMultigrain,
  beginnersLoaf,
  highExtractionCountry,
  mixedGrainMiche,
];

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
  beginnersLoaf, highExtractionCountry, mixedGrainMiche };
