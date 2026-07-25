/**
 * Every magic number in the engine lives here, with the reasoning attached.
 *
 * Rule of the house: if a coefficient cannot be justified in one sentence of
 * physics or one citation, it does not belong in the model. Anything tuned by
 * eye is marked TUNED and is fair game for recalibration once real measurements
 * arrive from the calibration protocol (see `calibration.ts`).
 */

import type { Additive, Hardness, Mill, Species, SafetyTier, MixMethod, RecipeFormat } from './types';

/* ------------------------------------------------------------------ */
/* Absorption model                                                    */
/* ------------------------------------------------------------------ */

/**
 * Reference point: a refined soft wheat, ~10% protein as sold, roller milled,
 * ~5% damaged starch, zero bran. Farinograph-adjacent, expressed as the
 * hydration a competent baker would actually mix it at.
 */
export const BASE_ABSORPTION = 58;

/** Protein absorbs roughly twice its own weight in water. */
export const K_PROTEIN = 2.0;
export const PROTEIN_REFERENCE = 10;

/**
 * Pentosans in the bran/aleurone layer absorb up to ~15× their weight. Bran is
 * ~5–7% pentosan, so a flour that is 15% bran gains ~8 points of absorption.
 * Coefficient applies to bran percentage points (branFraction × 100).
 */
export const K_BRAN = 0.55;

/**
 * Undamaged starch granules absorb ~0.3× their weight; mechanically damaged
 * granules absorb up to ~3×. Each extra percentage point of damaged starch adds
 * ~1.8 points of absorption. This is the single largest hidden driver of the
 * US↔Europe hydration gap.
 */
export const K_DAMAGED_STARCH = 1.8;
export const DAMAGED_STARCH_REFERENCE = 5;

export const HARDNESS_BONUS: Record<Hardness, number> = {
  soft: 0,
  medium: 1.5,
  hard: 3.5,
  'very-hard': 5,
};

export const ADDITIVE_BONUS: Record<Additive, number> = {
  'vital-gluten': 2.5,
  enzymes: 0.5,
  'malted-barley': 0.2,
  'ascorbic-acid': 0,
  fava: 0.1,
  soy: 0.3,
  none: 0,
};

/**
 * Ancient grains bind less water: their gluten is more soluble and their
 * protein network holds less. Applied to the whole absorption sum, so the
 * effect scales with how thirsty the flour would otherwise be.
 */
export const SPECIES_MULTIPLIER: Record<Species, number> = {
  wheat: 1.0,
  spelt: 0.96,
  einkorn: 0.88,
  emmer: 0.92,
  khorasan: 0.94,
  durum: 1.02,
  rye: 1.15,
  barley: 0.9,
  oat: 1.1,
  buckwheat: 1.05,
};

/**
 * Damaged starch estimated from mill × hardness when no SDmatic / AACC
 * 76-31.01 figure is available. Harder wheat resists the roller mill, so more
 * granules shatter. Stone milling crushes rather than shears; impact mills
 * (most home mills) damage least of all.
 */
export const DAMAGED_STARCH_TABLE: Record<Mill, Record<Hardness, number>> = {
  roller: { soft: 4.0, medium: 5.5, hard: 7.0, 'very-hard': 8.5 },
  stone: { soft: 3.5, medium: 4.5, hard: 5.0, 'very-hard': 5.5 },
  'home-stone': { soft: 3.0, medium: 3.8, hard: 4.2, 'very-hard': 4.6 },
  'home-impact': { soft: 2.6, medium: 3.0, hard: 3.4, 'very-hard': 3.8 },
};

/**
 * Bran fraction derived from ash. Pure endosperm sits near 0.40% ash; the
 * outer layers (bran + aleurone, which is where nearly all the mineral is)
 * average ~8% ash. A whole kernel is ~15–16% outer layer by mass, which is why
 * the result is capped there.
 */
export const ASH_ENDOSPERM = 0.4;
export const ASH_OUTER_LAYER = 8.0;
export const BRAN_FRACTION_MAX = 0.16;

/** Rye and buckwheat carry mineral through the whole kernel differently. */
export const ASH_ENDOSPERM_BY_SPECIES: Partial<Record<Species, number>> = {
  rye: 0.6,
  durum: 0.6,
  buckwheat: 0.8,
};

/* ------------------------------------------------------------------ */
/* Blend corrections                                                   */
/* ------------------------------------------------------------------ */

/**
 * A blend that cannot carry its water needs less of it. Applied to the
 * flour-fraction-weighted mean absorption, centred on strength 60 (a decent
 * European bread flour). TUNED.
 */
export const K_STRENGTH = 0.06;
export const STRENGTH_REFERENCE = 60;

/* ------------------------------------------------------------------ */
/* Strength model                                                      */
/* ------------------------------------------------------------------ */

/**
 * Strength is a 0–100 dough-carrying capacity, anchored at: spelt white ~25,
 * French T65 ~60, US bread flour ~75, bread flour + vital gluten ~100.
 * Driven by protein quality (species), protein quantity, and bran damage.
 */
export const STRENGTH_SPECIES_CEILING: Record<Species, number> = {
  wheat: 100,
  durum: 78,
  spelt: 45,
  khorasan: 45,
  emmer: 32,
  einkorn: 22,
  rye: 12,
  barley: 8,
  oat: 5,
  buckwheat: 3,
};

/** Points of strength per point of protein above the 10% reference. */
export const K_STRENGTH_PROTEIN = 6.2;
export const STRENGTH_BASE = 22;

/** Bran shreds gluten strands. Points lost per percentage point of bran. */
export const K_STRENGTH_BRAN = 1.1;

export const STRENGTH_ADDITIVE_BONUS: Partial<Record<Additive, number>> = {
  'vital-gluten': 22,
  'ascorbic-acid': 6,
  fava: 3,
};

/** W (alveograph) is a direct strength measurement; blend it in when present. */
export const W_TO_STRENGTH_ANCHOR = { w: 250, strength: 72 };
export const W_TO_STRENGTH_SLOPE = 0.19;
/** How much to trust W over the protein-derived estimate when both exist. */
export const W_TRUST = 0.65;

/* ------------------------------------------------------------------ */
/* Fermentation model                                                  */
/* ------------------------------------------------------------------ */

/** 1.0 = refined white wheat. */
export const FERMENT_BASE = 1.0;

/**
 * Whole grain carries the enzymes, the minerals and the wild yeast population
 * that live in the bran layer. Rye adds amylase on top of that.
 */
export const FERMENT_SPECIES_FACTOR: Record<Species, number> = {
  wheat: 1.0,
  spelt: 1.15,
  einkorn: 1.2,
  emmer: 1.15,
  khorasan: 1.1,
  durum: 1.05,
  rye: 1.35,
  barley: 1.2,
  oat: 1.05,
  buckwheat: 1.1,
};

/** Extra ferment speed at 100% wholegrain, on top of the species factor. */
export const FERMENT_WHOLEGRAIN_BONUS = 0.3;

export const FERMENT_ADDITIVE_FACTOR: Partial<Record<Additive, number>> = {
  enzymes: 1.12,
  'malted-barley': 1.08,
};

/**
 * A low falling number means high alpha-amylase activity: the starch is being
 * eaten before the loaf sets. Below 250 s starts to matter, below 200 s is a
 * gummy-crumb risk.
 */
export const FALLING_NUMBER_REFERENCE = 300;
export const FALLING_NUMBER_FLOOR = 180;

/* ------------------------------------------------------------------ */
/* Temperature                                                         */
/* ------------------------------------------------------------------ */

/** Fermentation rate roughly doubles per +8–10 °C; Q10 = 2.4 over 20–28 °C. */
export const Q10 = 2.4;
export const REFERENCE_DOUGH_TEMP = 24;

/** Friction factor by mixing method, in °C added to the dough. */
export const FRICTION_FACTOR: Record<MixMethod, number> = {
  hand: 1,
  'no-knead': 0,
  'stand-mixer': 5,
  spiral: 7.5,
};

export const FRICTION_RANGE: Record<MixMethod, [number, number]> = {
  hand: [0, 2],
  'no-knead': [0, 1],
  'stand-mixer': [4, 6],
  spiral: [6, 9],
};

/* ------------------------------------------------------------------ */
/* Safety tiers                                                        */
/* ------------------------------------------------------------------ */

export interface TierSpec {
  hydrationDelta: number;
  bulkMultiplier: number;
  coldProofMultiplier: number;
  extraFolds: number;
  doublePreshape: boolean;
  /** Hold this fraction of the bassinage water until after the first fold. */
  bassinageHoldFraction: number;
  extraLidMinutes: number;
}

export const TIERS: Record<SafetyTier, TierSpec> = {
  'super-safe': {
    hydrationDelta: -6,
    bulkMultiplier: 0.92,
    coldProofMultiplier: 0.85,
    extraFolds: 1,
    doublePreshape: true,
    bassinageHoldFraction: 1,
    extraLidMinutes: 5,
  },
  safe: {
    hydrationDelta: -3,
    bulkMultiplier: 0.96,
    coldProofMultiplier: 0.93,
    extraFolds: 0,
    doublePreshape: false,
    bassinageHoldFraction: 0,
    extraLidMinutes: 0,
  },
  standard: {
    hydrationDelta: 0,
    bulkMultiplier: 1,
    coldProofMultiplier: 1,
    extraFolds: 0,
    doublePreshape: false,
    bassinageHoldFraction: 0,
    extraLidMinutes: 0,
  },
  'as-intended': {
    hydrationDelta: 3,
    bulkMultiplier: 1,
    coldProofMultiplier: 1,
    extraFolds: 0,
    doublePreshape: false,
    bassinageHoldFraction: 0,
    extraLidMinutes: 0,
  },
};

/* ------------------------------------------------------------------ */
/* Technique thresholds                                                */
/* ------------------------------------------------------------------ */

/** Above this strength the dough survives slap-and-fold. */
export const SLAP_AND_FOLD_STRENGTH = 55;
/** Below this strength, only bowl folds — anything else tears it. */
export const BOWL_FOLD_STRENGTH = 30;
/** Below this strength a free-standing bâtard will pancake. */
export const BATARD_STRENGTH = 52;
/** Below this strength, nothing free-standing works. Use a tin. */
export const PAN_ONLY_STRENGTH = 22;

/* ------------------------------------------------------------------ */
/* Hydration guardrails                                                */
/* ------------------------------------------------------------------ */

export const HYDRATION_MIN = 50;
export const HYDRATION_MAX = 100;

/** Hydration headroom a blend can carry above its own absorption, by strength. */
export const HEADROOM_AT_STRENGTH_0 = 2;
export const HEADROOM_AT_STRENGTH_100 = 16;

/* ------------------------------------------------------------------ */
/* Uncertainty                                                         */
/* ------------------------------------------------------------------ */

/** ± hydration points, by the weakest confidence level in the blend. */
export const UNCERTAINTY: Record<'measured' | 'spec-sheet' | 'estimated', number> = {
  measured: 1,
  'spec-sheet': 2,
  estimated: 3,
};

/* ------------------------------------------------------------------ */
/* Format-specific behaviour                                           */
/* ------------------------------------------------------------------ */

/** Baseline bulk fermentation at 24 °C, in minutes, before any scaling. */
export const FORMAT_BASE_BULK: Record<RecipeFormat, number> = {
  boule: 270,
  batard: 270,
  baguette: 240,
  ciabatta: 210,
  focaccia: 240,
  pizza: 180,
  tin: 240,
  rolls: 210,
  enriched: 300,
};

/** Formats that live in a tin or tray and therefore ignore strength warnings. */
export const SUPPORTED_FORMATS: RecipeFormat[] = ['tin', 'focaccia', 'pizza', 'ciabatta'];

/* ------------------------------------------------------------------ */
/* Add-ins                                                             */
/* ------------------------------------------------------------------ */

/** Water content of dairy, as a fraction. */
export const MILK_WATER_FRACTION = 0.87;
export const BUTTER_WATER_FRACTION = 0.16;

/** Fat softens gluten; every 1% fat costs this much strength. */
export const K_FAT_STRENGTH = 1.4;
/** Sugar above ~5% starts to slow fermentation osmotically. */
export const SUGAR_OSMOTIC_THRESHOLD = 5;
export const K_SUGAR_SLOWDOWN = 0.012;
/** Salt slows fermentation. Reference 2.0%. */
export const SALT_REFERENCE = 2.0;
export const K_SALT_SLOWDOWN = 0.08;

/* ------------------------------------------------------------------ */
/* Altitude                                                            */
/* ------------------------------------------------------------------ */

/** Proof time shortens with altitude: less pressure, gas expands more freely. */
export const K_ALTITUDE_PROOF = 0.00006;
/** Bake temperature rises slightly to set the crust before it over-expands. */
export const K_ALTITUDE_BAKE_TEMP = 0.0055;
