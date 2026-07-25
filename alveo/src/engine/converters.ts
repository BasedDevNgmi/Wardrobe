/**
 * Converters and utilities.
 *
 * The theme running through all of these: state the error bar. A cup of flour
 * varies by ±20% depending on whether you scooped or spooned it, and any
 * converter that hides that is lying to make itself look precise.
 */

import { clamp, round } from './util';

/* ------------------------------------------------------------------ */
/* Volume ↔ weight                                                     */
/* ------------------------------------------------------------------ */

export interface CupDensity {
  key: string;
  label: { nl: string; en: string };
  /** Grams per US cup, spooned and levelled. */
  gramsPerCup: number;
  /** Realistic spread between a scooped and a spooned cup, as a fraction. */
  spread: number;
}

export const CUP_DENSITIES: CupDensity[] = [
  { key: 'ap-flour', label: { nl: 'Patentbloem / all-purpose', en: 'All-purpose flour' }, gramsPerCup: 125, spread: 0.2 },
  { key: 'bread-flour', label: { nl: 'Sterke tarwebloem', en: 'Bread flour' }, gramsPerCup: 130, spread: 0.2 },
  { key: 'whole-wheat', label: { nl: 'Volkorenmeel', en: 'Whole wheat flour' }, gramsPerCup: 120, spread: 0.18 },
  { key: 'rye', label: { nl: 'Roggemeel', en: 'Rye flour' }, gramsPerCup: 102, spread: 0.18 },
  { key: 'water', label: { nl: 'Water', en: 'Water' }, gramsPerCup: 236, spread: 0.02 },
  { key: 'milk', label: { nl: 'Melk', en: 'Milk' }, gramsPerCup: 242, spread: 0.02 },
  { key: 'sugar', label: { nl: 'Kristalsuiker', en: 'Granulated sugar' }, gramsPerCup: 200, spread: 0.05 },
  { key: 'butter', label: { nl: 'Boter', en: 'Butter' }, gramsPerCup: 227, spread: 0.02 },
  { key: 'salt-fine', label: { nl: 'Fijn zeezout', en: 'Fine sea salt' }, gramsPerCup: 288, spread: 0.1 },
  { key: 'starter', label: { nl: 'Desem (100% hydratatie)', en: 'Starter (100% hydration)' }, gramsPerCup: 227, spread: 0.12 },
];

export interface CupConversion {
  grams: number;
  low: number;
  high: number;
  caveat: { nl: string; en: string };
}

export function cupsToGrams(cups: number, densityKey: string): CupConversion {
  const d = CUP_DENSITIES.find((x) => x.key === densityKey) ?? CUP_DENSITIES[0]!;
  const grams = cups * d.gramsPerCup;
  return {
    grams: round(grams, 0),
    low: round(grams * (1 - d.spread), 0),
    high: round(grams * (1 + d.spread), 0),
    caveat:
      d.spread > 0.1
        ? {
            nl: `Een kop ${d.label.nl.toLowerCase()} weegt tussen ${round(d.gramsPerCup * (1 - d.spread), 0)} en ${round(d.gramsPerCup * (1 + d.spread), 0)} g, afhankelijk van hoe je hem vult. Dat is ±${Math.round(d.spread * 100)}% — genoeg om een recept te laten mislukken.`,
            en: `A cup of ${d.label.en.toLowerCase()} weighs between ${round(d.gramsPerCup * (1 - d.spread), 0)} and ${round(d.gramsPerCup * (1 + d.spread), 0)} g depending on how you fill it. That is ±${Math.round(d.spread * 100)}% — enough to break a formula.`,
          }
        : {
            nl: 'Vloeistoffen zijn betrouwbaar in volume; hier is de omrekening bijna exact.',
            en: 'Liquids are reliable by volume; this conversion is close to exact.',
          },
  };
}

/* ------------------------------------------------------------------ */
/* Banneton and tin sizing                                             */
/* ------------------------------------------------------------------ */

/**
 * Dough weight a proofing basket can take. Roughly 0.42 g of dough per mL of
 * basket volume for a standard hearth loaf: enough to fill it without the
 * dough spilling over the rim at the end of the cold proof.
 */
export const DOUGH_PER_ML_BANNETON = 0.42;
/** A tin loaf needs less: the dough has to have room to dome over the rim. */
export const DOUGH_PER_ML_TIN = 0.36;

export function bannetonCapacity(
  shape: 'round' | 'oval',
  dims: { diameter?: number; length?: number; width?: number; height: number },
): { volumeMl: number; doughGrams: number; range: [number, number] } {
  let volume = 0;
  if (shape === 'round' && dims.diameter) {
    // Truncated-cone approximation: bannetons taper.
    const r = dims.diameter / 2;
    const rBottom = r * 0.72;
    volume = (Math.PI * dims.height * (r * r + r * rBottom + rBottom * rBottom)) / 3;
  } else if (dims.length && dims.width) {
    volume = dims.length * dims.width * dims.height * 0.62;
  }
  const ml = round(volume, 0);
  const grams = round(ml * DOUGH_PER_ML_BANNETON, 0);
  return { volumeMl: ml, doughGrams: grams, range: [round(grams * 0.88, 0), round(grams * 1.12, 0)] };
}

export function tinCapacity(dims: {
  length: number;
  width: number;
  height: number;
}): { volumeMl: number; doughGrams: number; range: [number, number] } {
  const ml = round(dims.length * dims.width * dims.height, 0);
  const grams = round(ml * DOUGH_PER_ML_TIN, 0);
  return { volumeMl: ml, doughGrams: grams, range: [round(grams * 0.9, 0), round(grams * 1.1, 0)] };
}

/* ------------------------------------------------------------------ */
/* Altitude                                                            */
/* ------------------------------------------------------------------ */

export interface AltitudeAdvice {
  metres: number;
  proofMultiplier: number;
  bakeTempDelta: number;
  hydrationDelta: number;
  notes: { nl: string; en: string }[];
}

/**
 * Above ~1000 m, gas expands more freely and water boils cooler. Proof shorter,
 * bake slightly hotter, and add a little water because evaporation is faster.
 */
export function altitudeAdvice(metres: number): AltitudeAdvice {
  const m = clamp(metres, 0, 4000);
  const notes: { nl: string; en: string }[] = [];

  const proofMultiplier = round(1 - clamp(m * 0.00006, 0, 0.25), 3);
  const bakeTempDelta = round(clamp(m * 0.0055, 0, 15), 0);
  const hydrationDelta = round(clamp((m - 600) * 0.0025, 0, 4), 1);

  if (m >= 900) {
    notes.push({
      nl: 'Boven ongeveer 900 m rijst deeg merkbaar sneller: de gasbellen hebben minder tegendruk. Rijs korter en beoordeel op volume, niet op de klok.',
      en: 'Above roughly 900 m, dough rises noticeably faster: the gas bubbles meet less resistance. Proof shorter and judge by volume, not the clock.',
    });
  }
  if (m >= 1500) {
    notes.push({
      nl: 'Verhoog de oventemperatuur en bak met deksel om de kruim te laten zetten voordat hij te ver uitzet.',
      en: 'Raise the oven temperature and bake lidded, so the crumb sets before it over-expands.',
    });
    notes.push({
      nl: 'Water verdampt sneller. Reken op iets meer water in het deeg en een kortere open bakfase.',
      en: 'Water evaporates faster. Expect to add a little water to the dough and shorten the uncovered bake.',
    });
  }
  if (m < 600) {
    notes.push({
      nl: 'Onder 600 m hoef je niets aan te passen — hoogte is hier geen factor.',
      en: 'Below 600 m there is nothing to adjust — altitude is not a factor here.',
    });
  }

  return { metres: m, proofMultiplier, bakeTempDelta, hydrationDelta, notes };
}

/* ------------------------------------------------------------------ */
/* Inclusions and soakers                                              */
/* ------------------------------------------------------------------ */

export interface InclusionInput {
  key: string;
  name: string;
  /** % of total flour. */
  pct: number;
  /** Grams of water bound per gram. */
  absorbsWater: number;
}

/** Typical water uptake of common inclusions, grams of water per gram. */
export const INCLUSION_ABSORPTION: Record<string, number> = {
  'rolled-oats': 1.6,
  'cracked-rye': 1.2,
  'cracked-wheat': 1.1,
  'sunflower-seeds': 0.35,
  'pumpkin-seeds': 0.3,
  'sesame-seeds': 0.25,
  'flax-seeds': 2.2,
  'chia-seeds': 5.0,
  raisins: 0.4,
  walnuts: 0.1,
  'dried-figs': 0.5,
  'dried-apricots': 0.45,
  'cooked-porridge': 0,
  'potato-cooked': 0,
};

export interface InclusionResult {
  totalInclusionGrams: number;
  extraWaterGrams: number;
  /** Hydration you must add on top of the formula to stay level. */
  extraHydrationPoints: number;
  perItem: { key: string; grams: number; water: number }[];
  note: { nl: string; en: string };
}

export function inclusionWater(
  totalFlour: number,
  inclusions: InclusionInput[],
): InclusionResult {
  const perItem = inclusions.map((i) => {
    const grams = round((totalFlour * i.pct) / 100, 1);
    return { key: i.key, grams, water: round(grams * i.absorbsWater, 1) };
  });

  const totalInclusionGrams = round(perItem.reduce((s, p) => s + p.grams, 0), 1);
  const extraWaterGrams = round(perItem.reduce((s, p) => s + p.water, 0), 1);
  const extraHydrationPoints = round(
    totalFlour > 0 ? (extraWaterGrams / totalFlour) * 100 : 0,
    1,
  );

  return {
    totalInclusionGrams,
    extraWaterGrams,
    extraHydrationPoints,
    perItem,
    note: {
      nl: `Deze toevoegingen binden ${extraWaterGrams} g water. Als je dat niet compenseert, bak je effectief op ${extraHydrationPoints} punten lagere hydratatie dan het recept zegt — dat is precies waarom brood met noten en vruchten zo vaak droog uitvalt.`,
      en: `These inclusions bind ${extraWaterGrams} g of water. Without compensating, you are effectively baking ${extraHydrationPoints} points below the recipe's hydration — which is exactly why nut and fruit loaves so often come out dry.`,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Starter maths                                                       */
/* ------------------------------------------------------------------ */

export interface StarterFeed {
  starter: number;
  flour: number;
  water: number;
}

/** Convert a feeding ratio into actual grams for a target amount of levain. */
export function feedForTarget(
  ratio: StarterFeed,
  targetGrams: number,
  hydration = 100,
): { starter: number; flour: number; water: number; total: number } {
  const parts = ratio.starter + ratio.flour + ratio.water;
  if (parts <= 0) return { starter: 0, flour: 0, water: 0, total: 0 };
  const unit = targetGrams / parts;
  const flour = round(ratio.flour * unit, 1);
  return {
    starter: round(ratio.starter * unit, 1),
    flour,
    water: round(flour * (hydration / 100), 1),
    total: round(targetGrams, 1),
  };
}

/** Stiff ↔ liquid starter conversion, preserving the amount of flour. */
export function convertStarterHydration(
  grams: number,
  fromHydration: number,
  toHydration: number,
): { flour: number; waterNow: number; waterNeeded: number; addWater: number; addFlour: number } {
  const flour = round(grams / (1 + fromHydration / 100), 1);
  const waterNow = round(grams - flour, 1);
  const waterNeeded = round((flour * toHydration) / 100, 1);
  const diff = round(waterNeeded - waterNow, 1);
  return {
    flour,
    waterNow,
    waterNeeded,
    addWater: diff > 0 ? diff : 0,
    // Going drier: add flour rather than removing water, and rebalance.
    addFlour: diff < 0 ? round(-diff / (toHydration / 100 || 1), 1) : 0,
  };
}
