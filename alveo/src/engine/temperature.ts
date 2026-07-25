/**
 * Temperature is the second-biggest lever in sourdough after flour, and it is
 * the one home bakers most often leave unmeasured. Every timing on the site
 * passes through here.
 */

import { FRICTION_FACTOR, FRICTION_RANGE, Q10, REFERENCE_DOUGH_TEMP } from './constants';
import type { MixMethod } from './types';
import { clamp, round } from './util';

/**
 * Multiplier applied to every fermentation duration.
 *
 * Rate roughly doubles per +8–10 °C; Q10 = 2.4 fits the 20–28 °C band that
 * covers virtually every domestic kitchen. Outside 12–35 °C the exponential is
 * no longer honest — yeast and bacteria stop tracking each other — so the
 * factor is clamped and the UI warns instead of extrapolating.
 */
export function tempFactor(doughTemp: number, reference = REFERENCE_DOUGH_TEMP): number {
  const t = clamp(doughTemp, 4, 40);
  return round(Math.pow(Q10, (reference - t) / 10), 4);
}

/** True when we are outside the band where the Q10 model is trustworthy. */
export function isOutsideModelledRange(doughTemp: number): boolean {
  return doughTemp < 16 || doughTemp > 32;
}

export interface DDTInput {
  /** Desired dough temperature, °C. */
  ddt: number;
  flourTemp: number;
  roomTemp: number;
  /** Temperature of the levain/preferment going in. Omit if none. */
  prefermentTemp?: number;
  method: MixMethod;
  /** Override the table's friction factor with your own measured value. */
  frictionOverride?: number;
}

export interface DDTResult {
  waterTemp: number;
  /** Number of temperature terms in the average, for the UI to explain itself. */
  factors: number;
  friction: number;
  frictionRange: [number, number];
  /** Water this cold needs ice; how much, for a given water weight. */
  needsIce: boolean;
  /** Clamped to something a tap can actually produce. */
  clamped: boolean;
}

/**
 * waterTemp = (DDT × factors) − flourTemp − roomTemp − prefermentTemp − friction
 *
 * `factors` counts the temperature terms being averaged: 3 without a
 * preferment, 4 with one. Friction is method-dependent — a spiral mixer adds
 * 6–9 °C, hands add almost nothing.
 */
export function calculateWaterTemp(input: DDTInput): DDTResult {
  const friction = input.frictionOverride ?? FRICTION_FACTOR[input.method];
  const hasPreferment = typeof input.prefermentTemp === 'number';
  const factors = hasPreferment ? 4 : 3;

  const raw =
    input.ddt * factors -
    input.flourTemp -
    input.roomTemp -
    (hasPreferment ? (input.prefermentTemp as number) : 0) -
    friction;

  const waterTemp = clamp(raw, -5, 60);

  return {
    waterTemp: round(waterTemp, 1),
    factors,
    friction,
    frictionRange: FRICTION_RANGE[input.method],
    needsIce: raw < 6,
    clamped: raw !== waterTemp,
  };
}

/**
 * How much of the water should be ice to hit a sub-tap-temperature target.
 * Ice absorbs 334 J/g melting; water is 4.18 J/g·K.
 */
export function iceSplit(
  waterGrams: number,
  targetTemp: number,
  tapTemp: number,
): { ice: number; water: number; possible: boolean } {
  if (targetTemp >= tapTemp) return { ice: 0, water: round(waterGrams, 0), possible: true };
  const latent = 334;
  const cp = 4.18;
  // m_ice * (latent + cp*target) = m_water * cp * (tap - target)
  const ratio = (cp * (tapTemp - targetTemp)) / (latent + cp * targetTemp);
  const ice = clamp((waterGrams * ratio) / (1 + ratio), 0, waterGrams);
  return {
    ice: round(ice, 0),
    water: round(waterGrams - ice, 0),
    possible: ice < waterGrams * 0.95,
  };
}

/**
 * Seasonal prompt. Northern-hemisphere kitchens swing about 6 °C between
 * February and August; the point is not precision, it is getting the baker to
 * actually take the dough's temperature.
 */
export function seasonalHint(
  month: number,
  hemisphere: 'north' | 'south' = 'north',
): { likelyKitchenTemp: number; message: { nl: string; en: string } } {
  const m = hemisphere === 'north' ? month : (month + 6) % 12;
  // 0 = January.
  const summer = m >= 5 && m <= 8;
  const winter = m <= 1 || m === 11;

  if (summer) {
    return {
      likelyKitchenTemp: 25,
      message: {
        nl: 'Zomer: je keuken is waarschijnlijk 24–27 °C. Bulk gaat sneller dan het recept zegt — reken op een kwart tot een derde korter, en gebruik koud water.',
        en: 'Summer: your kitchen is probably 24–27 °C. Bulk runs faster than the recipe says — expect a quarter to a third less time, and mix with cold water.',
      },
    };
  }
  if (winter) {
    return {
      likelyKitchenTemp: 19,
      message: {
        nl: 'Winter: je keuken is waarschijnlijk 18–20 °C. Bulk duurt fors langer en je starter is traag. Zoek een warme plek of accepteer de langere tijden.',
        en: 'Winter: your kitchen is probably 18–20 °C. Bulk takes considerably longer and your starter is sluggish. Find a warm spot or accept the longer times.',
      },
    };
  }
  return {
    likelyKitchenTemp: 21,
    message: {
      nl: 'Tussenseizoen: reken op 20–22 °C in de keuken. Meet je deegtemperatuur na het mixen — dat is het enige getal dat telt.',
      en: 'Shoulder season: expect 20–22 °C in the kitchen. Take the dough temperature after mixing — that is the only number that matters.',
    },
  };
}

/**
 * Predicted time for a starter to peak, at a given feeding ratio and
 * temperature. Doubling the flour in the feed roughly adds one lag phase.
 */
export function starterPeakHours(
  ratio: { starter: number; flour: number; water: number },
  temp: number,
  fermentSpeed = 1,
): number {
  const dilution = ratio.flour / Math.max(ratio.starter, 0.01);
  // 1:1:1 peaks in ~4 h at 24 °C; each doubling of dilution adds ~2.2 h.
  const base = 4 + Math.log2(Math.max(dilution, 0.25)) * 2.2;
  const hours = (base * tempFactor(temp)) / Math.max(fermentSpeed, 0.5);
  return round(clamp(hours, 1, 48), 1);
}
