/**
 * Timings, folds and shaping.
 *
 * The rule from the brief: safety tiers change *method*, not just a number. So
 * this file returns fold type, fold count, preshape count and shaping advice
 * alongside the durations.
 */

import {
  BATARD_STRENGTH,
  BOWL_FOLD_STRENGTH,
  FORMAT_BASE_BULK,
  K_ALTITUDE_PROOF,
  K_SALT_SLOWDOWN,
  K_SUGAR_SLOWDOWN,
  PAN_ONLY_STRENGTH,
  SALT_REFERENCE,
  SLAP_AND_FOLD_STRENGTH,
  SUGAR_OSMOTIC_THRESHOLD,
  SUPPORTED_FORMATS,
  TIERS,
} from './constants';
import { tempFactor } from './temperature';
import type {
  BlendProfile,
  FoldPlan,
  FoldType,
  Recipe,
  RecipeFormat,
  SafetyTier,
} from './types';
import { clamp, round } from './util';

export interface ScheduleInput {
  blend: BlendProfile;
  recipe: Recipe;
  hydration: number;
  tier: SafetyTier;
  doughTemp: number;
  altitude?: number;
}

/**
 * Bulk fermentation, in minutes.
 *
 *   bulk = base / fermentSpeed × tempFactor × tierFactor
 *
 * plus corrections for salt (slows), sugar (slows osmotically above ~5%) and
 * inoculation rate (more prefermented flour, shorter bulk).
 */
export function bulkMinutes(input: ScheduleInput): number {
  const { blend, recipe, tier, doughTemp } = input;
  const base = FORMAT_BASE_BULK[recipe.format];

  let minutes = (base / Math.max(blend.fermentSpeed, 0.5)) * tempFactor(doughTemp);

  // Inoculation: the recipe's own prefermented-flour percentage against a 10%
  // reference. Doubling the levain does not halve the bulk — call it 0.72.
  const inoculationRatio = clamp(recipe.prefermentedFlour, 1, 40) / 10;
  minutes *= Math.pow(inoculationRatio, -0.72);

  // Salt.
  minutes *= 1 + (recipe.salt - SALT_REFERENCE) * K_SALT_SLOWDOWN;

  // Sugar, osmotic.
  const sugar = sumAddIns(recipe, 'sugar');
  if (sugar > SUGAR_OSMOTIC_THRESHOLD) {
    minutes *= 1 + (sugar - SUGAR_OSMOTIC_THRESHOLD) * K_SUGAR_SLOWDOWN * 10;
  }

  // Hydration: wetter dough ferments marginally faster (better mobility).
  minutes *= 1 - clamp((input.hydration - blend.absorption) / 100, -0.1, 0.1) * 0.6;

  minutes *= TIERS[tier].bulkMultiplier;

  if (input.altitude && input.altitude > 500) {
    minutes *= 1 - clamp(input.altitude * K_ALTITUDE_PROOF, 0, 0.25);
  }

  return round(clamp(minutes, 45, 1440), 0);
}

/** Cold retard, in hours. Fast, enzyme-loaded flour cannot sit as long. */
export function coldProofHours(input: ScheduleInput): number {
  const { blend, recipe, tier } = input;
  const base = recipe.format === 'pizza' ? 36 : recipe.format === 'baguette' ? 16 : 14;

  let hours = base / Math.max(blend.fermentSpeed, 0.5);
  // Enzymes keep working at 4 °C — slowly, but they do not stop.
  hours *= 1 - blend.enzymeLoad * 0.35;
  hours *= TIERS[tier].coldProofMultiplier;

  return round(clamp(hours, 2, 72), 1);
}

/** Bench rest shortens as the dough gets more fragile. */
export function benchMinutes(blend: BlendProfile): number {
  const fromStrength = 10 + (blend.strength / 100) * 25;
  const fragilityPenalty = blend.glutenPoorFraction * 12;
  return round(clamp(fromStrength - fragilityPenalty, 5, 40), 0);
}

/** Levain build time at the recipe's stated temperature, adjusted for flour. */
export function levainHours(recipe: Recipe, blend: BlendProfile, doughTemp?: number): number {
  const t = doughTemp ?? recipe.levain.temp;
  const hours = (recipe.levain.hours * tempFactor(t, recipe.levain.temp)) /
    Math.max(blend.fermentSpeed * 0.6 + 0.4, 0.5);
  return round(clamp(hours, 2, 24), 1);
}

/**
 * Fold type by strength.
 *   > 55  slap-and-fold survives it
 *   30–55 coil folds only
 *   < 30  bowl folds, and be gentle
 */
export function foldType(blend: BlendProfile, hydration: number): FoldType {
  if (blend.strength < BOWL_FOLD_STRENGTH) return 'bowl';
  if (blend.strength < SLAP_AND_FOLD_STRENGTH) return 'coil';
  // Slap-and-fold on a slack strong dough is the fastest route to structure;
  // on a stiff one it is pointless work.
  return hydration >= blend.absorption ? 'slap-and-fold' : 'stretch-and-fold';
}

/**
 * Fold count rises with hydration and falls with fragility.
 * Every fold is a chance to tear a weak dough, so the two pull against each
 * other rather than simply adding up.
 */
export function foldPlan(input: ScheduleInput, bulk: number): FoldPlan {
  const { blend, hydration, tier } = input;

  const wetness = clamp((hydration - blend.absorption) / 10, -1, 2);
  const fragility = 1 - clamp(blend.strength / 100, 0, 1);

  let count = Math.round(3 + wetness * 1.5 - fragility * 1.5 + TIERS[tier].extraFolds);
  count = clamp(count, 0, 6);

  const type = foldType(blend, hydration);

  // Folds live in the first ~60% of bulk; the dough needs undisturbed time to
  // build gas at the end.
  const window = bulk * 0.6;
  const atMinutes: number[] = [];
  for (let i = 0; i < count; i += 1) {
    // Front-loaded: the early folds do the structural work.
    const t = (window * (i + 1)) / (count + 0.6);
    atMinutes.push(Math.round(t / 5) * 5);
  }

  return { count, type, atMinutes, note: foldNote(type, count) };
}

function foldNote(type: FoldType, count: number): { nl: string; en: string } {
  const notes: Record<FoldType, { nl: string; en: string }> = {
    'slap-and-fold': {
      nl: 'Dit deeg is sterk genoeg voor slap-and-fold. Twee tot drie minuten op het werkblad na het mixen, daarna coil folds in de bak.',
      en: 'This dough is strong enough for slap-and-fold. Two or three minutes on the bench after mixing, then coil folds in the tub.',
    },
    coil: {
      nl: 'Alleen coil folds. Natte handen, til het deeg in het midden op, laat de uiteinden onder zichzelf vouwen. Niet uitrekken tot het scheurt.',
      en: 'Coil folds only. Wet hands, lift the dough from the middle, let the ends fold under themselves. Do not stretch until it tears.',
    },
    bowl: {
      nl: 'Bowl folds: haal met een natte hand langs de rand van de kom en vouw naar het midden. Dit deeg heeft te weinig gluten voor meer.',
      en: 'Bowl folds: run a wet hand down the side of the bowl and fold to the centre. This dough has too little gluten for anything more.',
    },
    'stretch-and-fold': {
      nl: 'Klassieke stretch-and-fold: pak een kant, trek omhoog tot je weerstand voelt, vouw over. Vier kanten is één set.',
      en: 'Classic stretch-and-fold: take one side, pull up until you feel resistance, fold over. Four sides is one set.',
    },
    lamination: {
      nl: 'Lamineren: één keer volledig uitrekken op een nat werkblad, dan opvouwen. Vervangt de eerste twee vouwsets.',
      en: 'Lamination: stretch out fully once on a wet bench, then fold up. Replaces the first two fold sets.',
    },
  };
  const note = notes[type];
  if (count === 0) {
    return {
      nl: 'Geen vouwen nodig — dit deeg bouwt zijn structuur op een andere manier.',
      en: 'No folds needed — this dough builds its structure another way.',
    };
  }
  return note;
}

export interface ShapingAdvice {
  format: RecipeFormat;
  recommended: 'boule' | 'batard' | 'pan' | 'free-form';
  note: { nl: string; en: string };
  preshapes: 1 | 2;
}

/**
 * Shaping advice. A bâtard needs a dough that can hold a seam under tension;
 * below that, a boule spreads the load. Below the pan threshold, nothing
 * free-standing works and we say so rather than letting someone waste 20 hours.
 */
export function shapingAdvice(
  blend: BlendProfile,
  recipe: Recipe,
  tier: SafetyTier,
): ShapingAdvice {
  const preshapes: 1 | 2 = TIERS[tier].doublePreshape ? 2 : 1;
  const format = recipe.format;

  if (SUPPORTED_FORMATS.includes(format)) {
    return {
      format,
      recommended: format === 'tin' ? 'pan' : 'free-form',
      note: {
        nl: 'Dit brood wordt ondersteund door de vorm of de bakplaat, dus de sterkte van je meel is hier veel minder kritisch.',
        en: 'This bread is supported by its tin or tray, so the strength of your flour matters much less here.',
      },
      preshapes,
    };
  }

  if (blend.strength < PAN_ONLY_STRENGTH) {
    return {
      format,
      recommended: 'pan',
      note: {
        nl: `Met sterkte ${blend.strength} houdt dit deeg geen vrijstaande vorm. Bak het in een busvorm — dat is geen compromis, dat is het juiste gereedschap.`,
        en: `At strength ${blend.strength} this dough will not hold a free-standing shape. Bake it in a tin — that is not a compromise, it is the right tool.`,
      },
      preshapes: 1,
    };
  }

  if (blend.strength < BATARD_STRENGTH && (format === 'batard' || format === 'baguette')) {
    return {
      format,
      recommended: 'boule',
      note: {
        nl: `Het recept vraagt om een ${format}, maar met sterkte ${blend.strength} zakt die uit. Maak er een boule van: rond spreidt de spanning gelijkmatiger.`,
        en: `The recipe calls for a ${format}, but at strength ${blend.strength} it will spread. Make a boule instead: round distributes the tension more evenly.`,
      },
      preshapes,
    };
  }

  return {
    format,
    recommended: format === 'batard' ? 'batard' : 'boule',
    note: {
      nl: `Sterkte ${blend.strength} is ruim genoeg voor een strak gevormd brood. Vorm met spanning maar zonder het vel te scheuren.`,
      en: `Strength ${blend.strength} is ample for a tightly shaped loaf. Shape with tension but without tearing the skin.`,
    },
    preshapes,
  };
}

/** Bake temperature adjusted for altitude. */
export function bakeTemp(recipe: Recipe, altitude = 0): number {
  if (altitude <= 500) return recipe.bake.temp;
  return round(recipe.bake.temp + Math.min(altitude * 0.0055, 15), 0);
}

function sumAddIns(recipe: Recipe, type: 'sugar' | 'fat' | 'dairy' | 'dry' | 'soaker'): number {
  return (recipe.addIns ?? [])
    .filter((a) => a.type === type)
    .reduce((s, a) => s + a.pct, 0);
}
