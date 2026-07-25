/**
 * Formula → grams.
 *
 * Baker's percentages, with two invariants that are property-tested:
 *   1. total dough weight always equals the sum of the parts, exactly;
 *   2. no path through this file can produce NaN.
 *
 * Convention on water: `recipe.hydration` is *plain water* as a percentage of
 * total flour, and it includes the water carried in by the levain. Dairy water
 * and soaker water are tracked separately and surfaced as `effectiveHydration`,
 * because a tin loaf at "55% water plus 15% milk" is not a 55% dough and
 * pretending otherwise is how people end up with a brick.
 */

import { MILK_WATER_FRACTION } from './constants';
import type { AddIn, Ingredient, Recipe, WaterSplit } from './types';
import { round, safeDiv, sum } from './util';

export interface FormulaInput {
  recipe: Recipe;
  /** Total flour weight in grams, including the flour inside the levain. */
  totalFlour: number;
  /** Final hydration after the engine's substitution and tier maths, %. */
  hydration: number;
  /** Fraction of the bassinage water held back until after fold 1, 0–1. */
  bassinageHoldFraction?: number;
}

export interface FormulaResult {
  ingredients: Ingredient[];
  water: WaterSplit;
  totalDoughWeight: number;
  /** Water including dairy, net of what the soaker has locked away, %. */
  effectiveHydration: number;
  levainTotal: number;
  levainFlour: number;
  levainWater: number;
  pieces: number;
  gramsEach: number;
}

export function buildFormula(input: FormulaInput): FormulaResult {
  const { recipe } = input;
  const F = Math.max(0, input.totalFlour);
  const pct = (p: number) => round((F * p) / 100, 1);

  /* ---- levain ---- */
  const levainFlour = pct(recipe.prefermentedFlour);
  const levainWater = round((levainFlour * recipe.levain.hydration) / 100, 1);
  const levainTotal = round(levainFlour + levainWater, 1);

  /* ---- water ---- */
  const waterTotal = pct(input.hydration);
  const bassinageTotal = pct(recipe.bassinage);
  // Never hold back more water than exists after the levain has taken its share.
  const availableForMix = Math.max(waterTotal - levainWater, 0);
  const bassinage = Math.min(bassinageTotal, availableForMix);
  const mixWater = round(availableForMix - bassinage, 1);

  /* ---- add-ins ---- */
  const addIns = recipe.addIns ?? [];
  const addInGrams = new Map<string, number>();
  for (const a of addIns) addInGrams.set(a.key, pct(a.pct));

  const soakerWater = round(
    sum(
      addIns
        .filter((a) => a.type === 'soaker' || typeof a.absorbsWater === 'number')
        .map((a) => (addInGrams.get(a.key) ?? 0) * (a.absorbsWater ?? 0)),
    ),
    1,
  );

  const dairyWater = round(
    sum(
      addIns
        .filter((a) => a.type === 'dairy')
        .map((a) => (addInGrams.get(a.key) ?? 0) * MILK_WATER_FRACTION),
    ),
    1,
  );

  const water: WaterSplit = {
    levain: levainWater,
    mix: mixWater,
    bassinage: round(bassinage, 1),
    soaker: soakerWater,
    dairy: dairyWater,
    total: round(waterTotal + soakerWater, 1),
  };

  /* ---- salt ---- */
  const salt = pct(recipe.salt);

  /* ---- ingredient list ---- */
  const ingredients: Ingredient[] = [];

  ingredients.push({
    key: 'flourTotal',
    label: { nl: 'Bloem totaal', en: 'Total flour' },
    grams: round(F, 1),
    pct: 100,
    group: 'flour',
  });

  ingredients.push({
    key: 'levain',
    label: { nl: 'Desem (rijp)', en: 'Levain (ripe)' },
    grams: levainTotal,
    pct: round(safeDiv(levainTotal * 100, F), 2),
    group: 'levain',
  });

  ingredients.push({
    key: 'waterMix',
    label: { nl: 'Water (mix)', en: 'Water (mix)' },
    grams: mixWater,
    pct: round(safeDiv(mixWater * 100, F), 2),
    group: 'liquid',
  });

  if (bassinage > 0) {
    ingredients.push({
      key: 'waterBassinage',
      label: { nl: 'Water (bassinage)', en: 'Water (bassinage)' },
      grams: round(bassinage, 1),
      pct: round(safeDiv(bassinage * 100, F), 2),
      group: 'liquid',
    });
  }

  ingredients.push({
    key: 'salt',
    label: { nl: 'Zout', en: 'Salt' },
    grams: salt,
    pct: recipe.salt,
    group: 'salt',
  });

  for (const a of addIns) {
    ingredients.push({
      key: `addin:${a.key}`,
      label: a.name,
      grams: addInGrams.get(a.key) ?? 0,
      pct: a.pct,
      group: a.type === 'fat' ? 'fat' : 'addin',
    });
  }

  if (soakerWater > 0) {
    ingredients.push({
      key: 'soakerWater',
      label: { nl: 'Water voor de weekmassa', en: 'Water for the soaker' },
      grams: soakerWater,
      pct: round(safeDiv(soakerWater * 100, F), 2),
      group: 'liquid',
    });
  }

  /* ---- totals ---- */
  const addInTotal = sum([...addInGrams.values()]);
  const totalDoughWeight = round(
    F + waterTotal + soakerWater + salt + addInTotal,
    1,
  );

  const effectiveWater = waterTotal + dairyWater - soakerWater;
  const effectiveHydration = round(safeDiv(effectiveWater * 100, F), 1);

  const pieces = Math.max(1, recipe.yield.pieces);
  const gramsEach = round(safeDiv(totalDoughWeight, pieces), 0);

  return {
    ingredients,
    water,
    totalDoughWeight,
    effectiveHydration,
    levainTotal,
    levainFlour,
    levainWater,
    pieces,
    gramsEach,
  };
}

/**
 * Inverse: how much flour do I need for N pieces of M grams?
 * Solves for F given that dough weight scales linearly with F.
 */
export function flourForYield(
  recipe: Recipe,
  hydration: number,
  pieces: number,
  gramsEach: number,
): number {
  const perGramOfFlour = doughWeightPerFlourGram(recipe, hydration);
  const target = Math.max(0, pieces) * Math.max(0, gramsEach);
  return round(safeDiv(target, perGramOfFlour), 0);
}

/** Grams of finished dough produced by one gram of flour, at this hydration. */
export function doughWeightPerFlourGram(recipe: Recipe, hydration: number): number {
  const addIns = recipe.addIns ?? [];
  const soakerPer = sum(
    addIns
      .filter((a) => a.type === 'soaker' || typeof a.absorbsWater === 'number')
      .map((a) => (a.pct / 100) * (a.absorbsWater ?? 0)),
  );
  const addInPer = sum(addIns.map((a) => a.pct / 100));
  return 1 + hydration / 100 + soakerPer + recipe.salt / 100 + addInPer;
}

/** Which add-ins are soakers, for the step engine to schedule them early. */
export function soakers(recipe: Recipe): AddIn[] {
  return (recipe.addIns ?? []).filter(
    (a) => a.type === 'soaker' || typeof a.absorbsWater === 'number',
  );
}

/**
 * Fat softens gluten and sugar competes for water. Both change how a formula
 * behaves enough that the shaping and fold advice has to know about them.
 */
export function enrichment(recipe: Recipe): { fat: number; sugar: number; dairy: number } {
  const addIns = recipe.addIns ?? [];
  const byType = (t: AddIn['type']) =>
    round(sum(addIns.filter((a) => a.type === t).map((a) => a.pct)), 2);
  return { fat: byType('fat'), sugar: byType('sugar'), dairy: byType('dairy') };
}
