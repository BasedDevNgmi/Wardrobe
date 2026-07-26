/**
 * Starter state as an engine input.
 *
 * The single largest variable the base engine leaves unmodelled. Every timing
 * elsewhere assumes a healthy, 100%-hydration, wheat-fed starter used at its
 * peak. Reality is a spectrum: young starters that have not hit stride, stiff
 * levains, rye starters, fridge-cold cultures, and starters used two hours
 * past peak because life happened.
 *
 * This module turns that spectrum into two outputs the rest of the engine
 * already knows how to consume: a multiplier on fermentSpeed, and an acidity
 * profile (how much total acid, and the lactic/acetic split that decides
 * whether "sour" means yoghurt-tangy or vinegar-sharp).
 */

import type { LocalisedText } from './stages';
import { clamp, round } from './util';

export type Ripeness = 'young' | 'peak' | 'past-peak' | 'collapsed';
export type StarterGrain = 'white' | 'wholegrain' | 'rye';

export interface StarterState {
  /** Hydration of the starter as maintained, %. Stiff ≈ 50–60, liquid ≈ 100+. */
  hydration: number;
  /** How many weeks since the culture was first established. Under ~4 is young. */
  ageWeeks: number;
  /** Hours since the last feed at the time of use. */
  lastFedHours: number;
  /** Temperature the starter has been kept at, °C. */
  temp: number;
  /** Where in its cycle it is used. */
  ripeness: Ripeness;
  /** What it is fed. Rye and wholegrain carry more of everything. */
  grain: StarterGrain;
}

export const DEFAULT_STARTER: StarterState = {
  hydration: 100,
  ageWeeks: 12,
  lastFedHours: 8,
  temp: 24,
  ripeness: 'peak',
  grain: 'white',
};

/* ------------------------------------------------------------------ */
/* Coefficients                                                        */
/* ------------------------------------------------------------------ */

/**
 * Speed multiplier by ripeness. A young levain (not yet peaked) seeds the
 * dough with fewer organisms and lengthens the lag; a collapsed one has spent
 * its sugars and drives a slow, sour, weak ferment.
 */
const RIPENESS_SPEED: Record<Ripeness, number> = {
  young: 0.82,
  peak: 1.0,
  'past-peak': 0.94,
  collapsed: 0.8,
};

/** Acid already present in the levain at the moment it goes in, 0–1. */
const RIPENESS_ACID: Record<Ripeness, number> = {
  young: 0.25,
  peak: 0.5,
  'past-peak': 0.78,
  collapsed: 1.0,
};

/**
 * Grain factor. Wholegrain and rye carry more wild yeast, more mineral and
 * more enzyme in the bran, so they ferment faster and sour harder.
 */
const GRAIN_SPEED: Record<StarterGrain, number> = {
  white: 1.0,
  wholegrain: 1.12,
  rye: 1.2,
};

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

export interface StarterProfile {
  /** Multiply the recipe's fermentSpeed by this. */
  speedFactor: number;
  /** 0–100. How much acid this levain brings to the finished loaf. */
  acidIntensity: number;
  /**
   * 0–1. Share of the acid that is acetic (sharp, vinegary) rather than lactic
   * (round, yoghurt-tangy). Stiff, cold, long-fed and rye starters push acetic.
   */
  aceticShare: number;
  /** True when the culture is too young or cold to be relied on. */
  underpowered: boolean;
  note: LocalisedText;
}

export function starterProfile(s: StarterState): StarterProfile {
  const ripenessSpeed = RIPENESS_SPEED[s.ripeness];
  const grainSpeed = GRAIN_SPEED[s.grain];

  // A young culture is genuinely slower and less predictable until it matures.
  const maturity = clamp(s.ageWeeks / 4, 0.6, 1);

  // Cold storage suppresses activity going in; a starter used straight from a
  // 5 °C fridge starts the dough cold and sluggish.
  const tempFactor = clamp(0.7 + (s.temp - 8) / 40, 0.7, 1.15);

  const speedFactor = round(ripenessSpeed * grainSpeed * maturity * tempFactor, 3);

  /* ---- acidity ---- */
  // Base intensity from ripeness, amplified by how long it has been fermenting
  // since the feed relative to a nominal 8-hour peak.
  const overrun = clamp((s.lastFedHours - 8) / 16, 0, 1);
  let intensity = RIPENESS_ACID[s.ripeness] * 100 + overrun * 20;
  if (s.grain === 'rye') intensity += 8;
  if (s.grain === 'wholegrain') intensity += 4;
  intensity = round(clamp(intensity, 0, 100), 0);

  // Acetic share: stiff starters restrict water and favour the heterofermentative
  // bacteria that make acetic acid; cold and long fermentation do the same.
  let acetic = 0.35;
  acetic += clamp((100 - s.hydration) / 100, -0.2, 0.5) * 0.6; // stiff → acetic
  acetic += clamp((16 - s.temp) / 16, -0.3, 0.4) * 0.35; // cold → acetic
  acetic += overrun * 0.15;
  if (s.grain === 'rye') acetic += 0.05;
  const aceticShare = round(clamp(acetic, 0.1, 0.85), 3);

  const underpowered = speedFactor < 0.8 || (s.ageWeeks < 3 && s.ripeness === 'young');

  return {
    speedFactor,
    acidIntensity: intensity,
    aceticShare,
    underpowered,
    note: describe(s, { speedFactor, acidIntensity: intensity, aceticShare, underpowered }),
  };
}

function describe(
  s: StarterState,
  p: Omit<StarterProfile, 'note'>,
): LocalisedText {
  const slowPct = Math.round((1 - p.speedFactor) * 100);
  const fastPct = Math.round((p.speedFactor - 1) * 100);
  const acidWord = p.aceticShare > 0.6
    ? { nl: 'scherp en azijnachtig', en: 'sharp and vinegary' }
    : p.aceticShare < 0.4
      ? { nl: 'rond en yoghurtachtig', en: 'round and yoghurt-like' }
      : { nl: 'gebalanceerd', en: 'balanced' };

  if (p.underpowered) {
    return {
      nl: `Deze desem is aan de zwakke kant — te jong of te koud. Reken op een bulk die ongeveer ${slowPct}% langer duurt dan het recept zegt, en beoordeel op volume in plaats van op de klok. Voer hem twee dagen op kamertemperatuur voordat je een lastig recept probeert.`,
      en: `This levain is on the weak side — too young or too cold. Expect a bulk roughly ${slowPct}% longer than the recipe says, and judge by volume rather than the clock. Feed it twice a day at room temperature for two days before attempting a demanding recipe.`,
    };
  }

  const speedClause = p.speedFactor >= 1.02
    ? { nl: `De bulk gaat ongeveer ${fastPct}% sneller dan de basis.`, en: `Bulk runs about ${fastPct}% faster than baseline.` }
    : p.speedFactor <= 0.98
      ? { nl: `De bulk duurt ongeveer ${slowPct}% langer dan de basis.`, en: `Bulk takes about ${slowPct}% longer than baseline.` }
      : { nl: 'De bulk verloopt ongeveer op de tijden van het recept.', en: 'Bulk runs roughly on the recipe\'s times.' };

  return {
    nl: `${speedClause.nl} De zuurgraad wordt ${acidWord.nl}: een ${s.hydration < 70 ? 'stijve' : 'vloeibare'} desem op ${s.temp} °C, gebruikt ${s.ripeness === 'peak' ? 'op de piek' : s.ripeness === 'past-peak' ? 'net over de piek' : s.ripeness}.`,
    en: `${speedClause.en} The acidity comes out ${acidWord.en}: a ${s.hydration < 70 ? 'stiff' : 'liquid'} levain at ${s.temp} °C, used ${s.ripeness === 'peak' ? 'at peak' : s.ripeness === 'past-peak' ? 'just past peak' : s.ripeness}.`,
  };
}
