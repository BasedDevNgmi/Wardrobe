/**
 * The absorption model.
 *
 * `absorption` is the hydration a competent baker would target at 100% of this
 * flour, for a normal open-crumb hearth loaf. It is not a farinograph number
 * and it is not a promise — it is a calibrated starting point with an honest
 * uncertainty band attached.
 *
 *   absorption = ( BASE
 *                + K_PROTEIN        * (protein  - 10)
 *                + K_BRAN           * branPercent
 *                + K_DAMAGED_STARCH * (damagedStarch - 5)
 *                + hardnessBonus
 *                + additiveBonus ) * speciesMultiplier
 *
 * Ordering matters for the "explain the gap" feature, so every term is returned
 * separately and the species multiplier is expressed as an absolute delta that
 * makes the breakdown sum exactly to the total.
 */

import {
  ADDITIVE_BONUS,
  ASH_ENDOSPERM,
  ASH_ENDOSPERM_BY_SPECIES,
  ASH_OUTER_LAYER,
  BASE_ABSORPTION,
  BRAN_FRACTION_MAX,
  DAMAGED_STARCH_REFERENCE,
  DAMAGED_STARCH_TABLE,
  HARDNESS_BONUS,
  K_BRAN,
  K_DAMAGED_STARCH,
  K_PROTEIN,
  PROTEIN_REFERENCE,
  SPECIES_MULTIPLIER,
} from './constants';
import type { AbsorptionBreakdown, Flour, FlourInput } from './types';
import { round } from './util';

/**
 * Protein is quoted on a dry-matter basis in France and Italy and on an
 * as-sold basis almost everywhere else. Comparing the two directly is the most
 * common way people talk themselves into the wrong flour. Flour sits at ~14%
 * moisture, so dry-basis figures run about 1.5 points high.
 */
export const FLOUR_MOISTURE = 0.14;

export function proteinAsSold(flour: Pick<Flour, 'protein' | 'proteinBasis'>): number {
  return flour.proteinBasis === 'dry'
    ? flour.protein * (1 - FLOUR_MOISTURE)
    : flour.protein;
}

export function proteinDryBasis(flour: Pick<Flour, 'protein' | 'proteinBasis'>): number {
  return flour.proteinBasis === 'dry'
    ? flour.protein
    : flour.protein / (1 - FLOUR_MOISTURE);
}

/**
 * Fraction of the flour that is bran/aleurone by mass.
 *
 * Ash is the direct measurement of outer-layer presence, so use it when it
 * exists. Failing that, fall back on the declared extraction rate, then on the
 * wholegrain fraction. A whole kernel is ~15–16% outer layer, hence the cap.
 */
export function branFraction(
  flour: Pick<Flour, 'ash' | 'extraction' | 'wholegrain' | 'species'>,
): number {
  const endospermAsh = ASH_ENDOSPERM_BY_SPECIES[flour.species] ?? ASH_ENDOSPERM;

  if (typeof flour.ash === 'number') {
    const raw = (flour.ash - endospermAsh) / (ASH_OUTER_LAYER - endospermAsh);
    return clamp(raw, 0, BRAN_FRACTION_MAX);
  }

  if (typeof flour.extraction === 'number') {
    // Below ~72% extraction you are still inside the endosperm.
    const raw = (flour.extraction - 72) / (100 - 72);
    return clamp(raw, 0, 1) * BRAN_FRACTION_MAX;
  }

  return clamp(flour.wholegrain, 0, 1) * BRAN_FRACTION_MAX;
}

/**
 * Damaged starch, measured if we have it, estimated from mill × hardness if we
 * do not. This single term is most of the US↔Europe hydration gap: North
 * American wheats are harder, so roller milling shatters more granules, so the
 * flour drinks more water. It is not mainly a protein story.
 */
export function damagedStarch(flour: Pick<Flour, 'damagedStarch' | 'mill' | 'hardness'>): number {
  if (typeof flour.damagedStarch === 'number') return flour.damagedStarch;
  return DAMAGED_STARCH_TABLE[flour.mill][flour.hardness];
}

export function additiveBonus(additives: Flour['additives']): number {
  return additives.reduce((sum, a) => sum + (ADDITIVE_BONUS[a] ?? 0), 0);
}

/**
 * Full absorption breakdown. `total` is the number the UI shows; the individual
 * terms drive the "how much of this gap is species, how much is milling"
 * explanation. The species multiplier is redistributed across the terms so the
 * parts always sum to the whole.
 */
export function absorptionBreakdown(
  flour: Pick<
    Flour,
    | 'protein' | 'proteinBasis' | 'ash' | 'extraction' | 'wholegrain'
    | 'species' | 'mill' | 'hardness' | 'damagedStarch' | 'additives'
  >,
): AbsorptionBreakdown {
  const protein = proteinAsSold(flour);
  const bran = branFraction(flour);
  const ds = damagedStarch(flour);

  const terms = {
    base: BASE_ABSORPTION,
    protein: K_PROTEIN * (protein - PROTEIN_REFERENCE),
    bran: K_BRAN * bran * 100,
    damagedStarch: K_DAMAGED_STARCH * (ds - DAMAGED_STARCH_REFERENCE),
    hardness: HARDNESS_BONUS[flour.hardness],
    additives: additiveBonus(flour.additives),
  };

  const subtotal =
    terms.base + terms.protein + terms.bran + terms.damagedStarch +
    terms.hardness + terms.additives;

  const multiplier = SPECIES_MULTIPLIER[flour.species];
  const total = subtotal * multiplier;

  return {
    base: round(terms.base, 2),
    protein: round(terms.protein, 2),
    bran: round(terms.bran, 2),
    damagedStarch: round(terms.damagedStarch, 2),
    hardness: round(terms.hardness, 2),
    additives: round(terms.additives, 2),
    species: round(total - subtotal, 2),
    total: round(total, 2),
  };
}

export function computeAbsorption(flour: Parameters<typeof absorptionBreakdown>[0]): number {
  return round(absorptionBreakdown(flour).total, 1);
}

/**
 * Absorption of a hypothetical flour that differs from `flour` in exactly one
 * property. Used by the `/vervangen/` pages to answer "how much of this is the
 * milling?" without hand-waving.
 */
export function counterfactualAbsorption<K extends keyof FlourInput>(
  flour: Parameters<typeof absorptionBreakdown>[0],
  key: K,
  value: FlourInput[K],
): number {
  return computeAbsorption({ ...flour, [key]: value } as typeof flour);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
