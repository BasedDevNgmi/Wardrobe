/**
 * Deriving the three engine outputs — absorption, strength, fermentSpeed —
 * from a flour's measured and classified properties.
 *
 * `deriveFlour()` is the only sanctioned way to produce a `Flour`. The flour
 * database calls it at module load, so a stored record can never drift from the
 * model; `npm run check:data` asserts that invariant in CI.
 */

import { branFraction, proteinAsSold } from './absorption';
import { computeAbsorption } from './absorption';
import {
  FALLING_NUMBER_FLOOR,
  FALLING_NUMBER_REFERENCE,
  FERMENT_ADDITIVE_FACTOR,
  FERMENT_BASE,
  FERMENT_SPECIES_FACTOR,
  FERMENT_WHOLEGRAIN_BONUS,
  K_STRENGTH_BRAN,
  K_STRENGTH_PROTEIN,
  STRENGTH_ADDITIVE_BONUS,
  STRENGTH_BASE,
  STRENGTH_SPECIES_CEILING,
  W_TO_STRENGTH_ANCHOR,
  W_TO_STRENGTH_SLOPE,
  W_TRUST,
} from './constants';
import type { Flour, FlourInput } from './types';
import { clamp, round } from './util';

/**
 * Dough-carrying capacity, 0–100.
 *
 * Protein quantity sets the floor, species sets the ceiling (einkorn at 14%
 * protein still cannot hold a bâtard), bran cuts the strands, and an alveograph
 * W value — when we have one — overrides most of the estimate because it is an
 * actual measurement of the thing we are trying to predict.
 */
export function computeStrength(
  flour: Pick<
    Flour,
    | 'protein' | 'proteinBasis' | 'ash' | 'extraction' | 'wholegrain'
    | 'species' | 'additives' | 'W'
  >,
): number {
  const protein = proteinAsSold(flour);
  const bran = branFraction(flour) * 100;

  let s =
    STRENGTH_BASE +
    K_STRENGTH_PROTEIN * (protein - 10) -
    K_STRENGTH_BRAN * bran;

  for (const a of flour.additives) {
    s += STRENGTH_ADDITIVE_BONUS[a] ?? 0;
  }

  const ceiling = STRENGTH_SPECIES_CEILING[flour.species];
  s = clamp(s, 0, ceiling);

  if (typeof flour.W === 'number' && flour.W > 0) {
    const fromW = clamp(
      W_TO_STRENGTH_ANCHOR.strength + (flour.W - W_TO_STRENGTH_ANCHOR.w) * W_TO_STRENGTH_SLOPE,
      0,
      ceiling,
    );
    s = s * (1 - W_TRUST) + fromW * W_TRUST;
  }

  return round(clamp(s, 0, 100), 1);
}

/**
 * Fermentation speed relative to refined white wheat.
 *
 * The bran layer carries the enzymes, the minerals and most of the wild yeast
 * and lactic bacteria, so wholegrain ferments faster regardless of species. Rye
 * adds amylase on top. A low falling number means the amylase is already
 * winning, which shortens every window on the page.
 */
export function computeFermentSpeed(
  flour: Pick<
    Flour,
    'species' | 'wholegrain' | 'ash' | 'extraction' | 'additives' | 'fallingNumber'
  >,
): number {
  let f = FERMENT_BASE * FERMENT_SPECIES_FACTOR[flour.species];

  // Use the ash-derived bran fraction rather than the declared wholegrain flag:
  // a T110 is not wholegrain but ferments most of the way like one.
  const branShare = branFraction({ ...flour, wholegrain: flour.wholegrain }) / 0.16;
  f += FERMENT_WHOLEGRAIN_BONUS * clamp(branShare, 0, 1);

  for (const a of flour.additives) {
    f *= FERMENT_ADDITIVE_FACTOR[a] ?? 1;
  }

  if (typeof flour.fallingNumber === 'number') {
    const fn = clamp(flour.fallingNumber, FALLING_NUMBER_FLOOR, 450);
    if (fn < FALLING_NUMBER_REFERENCE) {
      // Down to 1.25× at the 180 s floor.
      f *= 1 + ((FALLING_NUMBER_REFERENCE - fn) / (FALLING_NUMBER_REFERENCE - FALLING_NUMBER_FLOOR)) * 0.25;
    }
  }

  return round(clamp(f, 0.6, 2.2), 3);
}

/** Enzyme load proxy, 0–1. Drives the "this will go from perfect to soup" warning. */
export function computeEnzymeLoad(
  flour: Pick<Flour, 'species' | 'wholegrain' | 'additives' | 'fallingNumber' | 'ash' | 'extraction'>,
): number {
  let load = branFraction({ ...flour }) / 0.16 * 0.5;
  if (flour.species === 'rye') load += 0.3;
  if (flour.additives.includes('enzymes')) load += 0.25;
  if (flour.additives.includes('malted-barley')) load += 0.12;
  if (typeof flour.fallingNumber === 'number' && flour.fallingNumber < 250) {
    load += (250 - clamp(flour.fallingNumber, 150, 250)) / 100 * 0.3;
  }
  return round(clamp(load, 0, 1), 3);
}

/**
 * Turn a declared flour into a complete record. Any hand-supplied derived
 * value is ignored — the model is the single source of truth — except when it
 * comes from a `measured` calibration, which is the whole point of §2.6.
 */
export function deriveFlour(input: FlourInput): Flour {
  const absorption =
    input.confidence === 'measured' && typeof input.absorption === 'number'
      ? round(input.absorption, 1)
      : computeAbsorption(input);

  return {
    ...input,
    absorption,
    strength: computeStrength(input),
    fermentSpeed: computeFermentSpeed(input),
  };
}

/**
 * Apply a user's own calibration measurement to a flour, for that user only.
 * Returns a new flour marked `measured`, which then propagates through every
 * downstream calculation on the site.
 */
export function withMeasuredAbsorption(flour: Flour, measured: number): Flour {
  return { ...flour, absorption: round(measured, 1), confidence: 'measured' };
}

/** Human-facing uncertainty band, in hydration points. */
export function uncertaintyFor(confidence: Flour['confidence']): number {
  return confidence === 'measured' ? 1 : confidence === 'spec-sheet' ? 2 : 3;
}
