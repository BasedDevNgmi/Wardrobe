/**
 * Blend mathematics.
 *
 * Everything downstream — hydration, timings, fold type, shaping, warnings —
 * derives from three numbers: absorption, strength and fermentSpeed. This file
 * produces them, plus the supporting fractions the warning engine needs.
 */

import { branFraction } from './absorption';
import { computeEnzymeLoad } from './flour';
import {
  BRAN_FRACTION_MAX,
  HEADROOM_AT_STRENGTH_0,
  HEADROOM_AT_STRENGTH_100,
  K_STRENGTH,
  STRENGTH_REFERENCE,
  UNCERTAINTY,
} from './constants';
import type { BlendComponent, BlendProfile, Confidence, Flour } from './types';
import { clamp, round, sum } from './util';

const CONFIDENCE_ORDER: Confidence[] = ['measured', 'spec-sheet', 'estimated'];

const GLUTEN_POOR = new Set(['rye', 'barley', 'oat', 'buckwheat']);

/** Normalise fractions so they sum to exactly 1. An empty blend is not a blend. */
export function normaliseComponents(components: BlendComponent[]): BlendComponent[] {
  const total = sum(components.map((c) => c.fraction));
  if (total <= 0) {
    // Degenerate input: fall back to an even split rather than emitting NaN.
    const even = components.length > 0 ? 1 / components.length : 0;
    return components.map((c) => ({ ...c, fraction: even }));
  }
  return components.map((c) => ({ ...c, fraction: c.fraction / total }));
}

export function computeBlend(componentsIn: BlendComponent[]): BlendProfile {
  const components = normaliseComponents(componentsIn.filter((c) => c.fraction > 0));

  if (components.length === 0) {
    return emptyBlend();
  }

  const weighted = (pick: (f: Flour) => number) =>
    sum(components.map((c) => c.fraction * pick(c.flour)));

  const meanAbsorption = weighted((f) => f.absorption);
  const strength = round(clamp(weighted((f) => f.strength), 0, 100), 1);
  const fermentSpeed = round(weighted((f) => f.fermentSpeed), 3);

  // A blend that cannot carry its water needs less of it.
  const absorption = round(
    meanAbsorption + K_STRENGTH * (strength - STRENGTH_REFERENCE),
    1,
  );

  const wholegrain = round(weighted((f) => f.wholegrain), 3);
  const bran = round(sum(components.map((c) => c.fraction * branFraction(c.flour))), 4);
  const glutenPoorFraction = round(
    sum(components.filter((c) => GLUTEN_POOR.has(c.flour.species)).map((c) => c.fraction)),
    3,
  );
  const enzymeLoad = round(
    sum(components.map((c) => c.fraction * computeEnzymeLoad(c.flour))),
    3,
  );

  const confidence = worstConfidence(components.map((c) => c.flour.confidence));

  return {
    components,
    absorption,
    strength,
    fermentSpeed,
    tolerance: computeTolerance(strength, fermentSpeed, enzymeLoad),
    wholegrain,
    branFraction: bran,
    glutenPoorFraction,
    enzymeLoad,
    confidence,
    uncertainty: UNCERTAINTY[confidence],
  };
}

/**
 * How wide the "done" window is, 0–100.
 *
 * Strong dough forgives an extra hour. Fast, enzyme-loaded dough goes from
 * perfect to soup in twenty minutes. This number decides how loudly the UI
 * nags you about timing.
 */
export function computeTolerance(
  strength: number,
  fermentSpeed: number,
  enzymeLoad: number,
): number {
  const fromStrength = strength * 0.8;
  const speedPenalty = (fermentSpeed - 1) * 55;
  const enzymePenalty = enzymeLoad * 25;
  return round(clamp(fromStrength - speedPenalty - enzymePenalty + 20, 0, 100), 1);
}

/**
 * How far above its own absorption a blend can be pushed before it stops being
 * bread and starts being a puddle. Strong dough has real headroom; a rye-heavy
 * or ancient-grain blend has almost none.
 */
export function hydrationHeadroom(blend: BlendProfile): number {
  const t = clamp(blend.strength / 100, 0, 1);
  const base = HEADROOM_AT_STRENGTH_0 + (HEADROOM_AT_STRENGTH_100 - HEADROOM_AT_STRENGTH_0) * t;
  // Bran keeps drinking long after mixing, so wholegrain earns extra headroom.
  return round(base + (blend.branFraction / BRAN_FRACTION_MAX) * 6, 1);
}

/** The maximum hydration the engine will endorse for this blend. */
export function maxSensibleHydration(blend: BlendProfile): number {
  return round(blend.absorption + hydrationHeadroom(blend), 1);
}

export function worstConfidence(list: Confidence[]): Confidence {
  let worst: Confidence = 'measured';
  for (const c of list) {
    if (CONFIDENCE_ORDER.indexOf(c) > CONFIDENCE_ORDER.indexOf(worst)) worst = c;
  }
  return worst;
}

/**
 * Redistribute slider movement across the unlocked components so the blend
 * always sums to 100%. Locked components hold their value; if everything else
 * is locked, the move is refused rather than silently breaking the invariant.
 */
export function redistribute(
  components: BlendComponent[],
  changedIndex: number,
  nextFraction: number,
): BlendComponent[] {
  if (components.length === 0) return components;
  if (changedIndex < 0 || changedIndex >= components.length) return components;

  const target = clamp(nextFraction, 0, 1);
  const movable = components
    .map((c, i) => ({ c, i }))
    .filter(({ c, i }) => i !== changedIndex && !c.locked);

  if (movable.length === 0) return components;

  const lockedTotal = sum(
    components.filter((c, i) => i !== changedIndex && c.locked).map((c) => c.fraction),
  );

  const available = clamp(1 - lockedTotal, 0, 1);
  const applied = clamp(target, 0, available);
  const remainder = available - applied;
  const movableTotal = sum(movable.map(({ c }) => c.fraction));

  return components.map((c, i) => {
    if (i === changedIndex) return { ...c, fraction: applied };
    if (c.locked) return c;
    const share = movableTotal > 0 ? c.fraction / movableTotal : 1 / movable.length;
    return { ...c, fraction: remainder * share };
  });
}

function emptyBlend(): BlendProfile {
  return {
    components: [],
    absorption: 0,
    strength: 0,
    fermentSpeed: 1,
    tolerance: 0,
    wholegrain: 0,
    branFraction: 0,
    glutenPoorFraction: 0,
    enzymeLoad: 0,
    confidence: 'estimated',
    uncertainty: UNCERTAINTY.estimated,
  };
}
