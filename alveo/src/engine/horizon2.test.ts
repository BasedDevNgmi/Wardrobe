import { describe, expect, it } from 'vitest';
import { computeBlend } from './blend';
import { deriveFlour } from './flour';
import { starterProfile, DEFAULT_STARTER } from './starter';
import { predictAcidity, planSourness, SOURNESS_TARGETS } from './sourness';
import { rescue } from './rescue';
import { fermentationModes, yeastDoseGrams } from './fermentation-mode';
import { millingEffect } from './milling';
import { requireRecipe } from '@/data/recipes';

const white = deriveFlour({
  slug: 't-white', name: 'x', country: 'NL', system: 'dutch',
  protein: 12, proteinBasis: 'as-sold', ash: 0.5,
  species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
  additives: ['none'], confidence: 'estimated',
});
const blend = computeBlend([{ flour: white, fraction: 1 }]);

describe('starter state', () => {
  it('a peak white starter sits near the 1.0 baseline', () => {
    const p = starterProfile(DEFAULT_STARTER);
    expect(p.speedFactor).toBeGreaterThan(0.9);
    expect(p.speedFactor).toBeLessThanOrEqual(1.1);
    expect(p.underpowered).toBe(false);
  });

  it('a cold young starter is slower and flagged underpowered', () => {
    const p = starterProfile({ ...DEFAULT_STARTER, temp: 6, ageWeeks: 2, ripeness: 'young' });
    expect(p.speedFactor).toBeLessThan(0.85);
    expect(p.underpowered).toBe(true);
  });

  it('a stiff cold starter reads more acetic than a warm liquid one', () => {
    const stiff = starterProfile({ ...DEFAULT_STARTER, hydration: 55, temp: 12 });
    const liquid = starterProfile({ ...DEFAULT_STARTER, hydration: 110, temp: 26 });
    expect(stiff.aceticShare).toBeGreaterThan(liquid.aceticShare);
  });

  it('a rye starter ferments faster than a white one', () => {
    const rye = starterProfile({ ...DEFAULT_STARTER, grain: 'rye' });
    const wht = starterProfile({ ...DEFAULT_STARTER, grain: 'white' });
    expect(rye.speedFactor).toBeGreaterThan(wht.speedFactor);
  });

  it('past-peak carries more acid than peak', () => {
    const past = starterProfile({ ...DEFAULT_STARTER, ripeness: 'past-peak', lastFedHours: 16 });
    const peak = starterProfile({ ...DEFAULT_STARTER, ripeness: 'peak' });
    expect(past.acidIntensity).toBeGreaterThan(peak.acidIntensity);
  });

  it('never emits NaN across the plausible grid', () => {
    for (const h of [50, 75, 100, 125]) {
      for (const t of [4, 12, 20, 28]) {
        for (const r of ['young', 'peak', 'past-peak', 'collapsed'] as const) {
          const p = starterProfile({ ...DEFAULT_STARTER, hydration: h, temp: t, ripeness: r });
          expect(Number.isFinite(p.speedFactor)).toBe(true);
          expect(Number.isFinite(p.acidIntensity)).toBe(true);
          expect(Number.isFinite(p.aceticShare)).toBe(true);
        }
      }
    }
  });
});

describe('sourness dial', () => {
  const recipe = requireRecipe('alledaags-landbrood');

  it('a higher target proposes upward adjustments', () => {
    const current = predictAcidity(recipe, blend, { doughTemp: 24, coldProofHours: 12 });
    const plan = planSourness('very-sour', { intensity: 30, aceticShare: 0.4 });
    expect(plan.desired.intensity).toBeGreaterThan(current.intensity - 100); // sane
    expect(plan.adjustments.length).toBeGreaterThan(0);
    expect(plan.adjustments.every((a) => a.direction === 'up')).toBe(true);
  });

  it('a lower target proposes downward adjustments', () => {
    const plan = planSourness('mild', { intensity: 80, aceticShare: 0.6 });
    expect(plan.adjustments.every((a) => a.direction === 'down')).toBe(true);
  });

  it('every target produces a finite prediction and desired profile', () => {
    for (const target of SOURNESS_TARGETS) {
      const current = predictAcidity(recipe, blend, { doughTemp: 24, coldProofHours: 14 });
      const plan = planSourness(target, current);
      expect(Number.isFinite(plan.desired.intensity)).toBe(true);
      expect(plan.desired.aceticShare).toBeGreaterThanOrEqual(0.1);
      expect(plan.desired.aceticShare).toBeLessThanOrEqual(0.85);
    }
  });

  it('a longer retard predicts more acid', () => {
    const short = predictAcidity(recipe, blend, { doughTemp: 24, coldProofHours: 4 });
    const long = predictAcidity(recipe, blend, { doughTemp: 24, coldProofHours: 24 });
    expect(long.intensity).toBeGreaterThan(short.intensity);
  });
});

describe('rescue mode', () => {
  it('sleeping during bulk recommends chilling with near-zero cost', () => {
    const advice = rescue('must-sleep', 'bulk');
    expect(advice.options[0]!.recommended).toBe(true);
    expect(advice.options[0]!.headline.en.toLowerCase()).toContain('fridge');
    expect(advice.options[0]!.action.en.toLowerCase()).toContain('chill');
  });

  it('every situation/stage pair yields at least one recommended option', () => {
    const situations = ['must-sleep', 'must-leave', 'levain-not-ready', 'over-proofed', 'under-proofed', 'too-slack'] as const;
    const stages = ['levain-building', 'bulk', 'shaped-waiting', 'cold-proofing', 'ready-to-bake'] as const;
    for (const s of situations) {
      for (const st of stages) {
        const advice = rescue(s, st);
        expect(advice.options.length).toBeGreaterThan(0);
        expect(advice.options.some((o) => o.recommended)).toBe(true);
        for (const o of advice.options) {
          expect(o.headline.nl.length).toBeGreaterThan(0);
          expect(o.cost.en.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('fermentation modes', () => {
  const recipe = requireRecipe('alledaags-landbrood');

  it('offers three modes, only pure levain yeast-free', () => {
    const modes = fermentationModes(recipe);
    expect(modes).toHaveLength(3);
    expect(modes[0]!.instantYeastPct).toBe(0);
    expect(modes[1]!.instantYeastPct).toBeGreaterThan(0);
    expect(modes[2]!.instantYeastPct).toBeGreaterThan(modes[1]!.instantYeastPct);
  });

  it('faster modes take less total time', () => {
    const modes = fermentationModes(recipe);
    expect(modes[1]!.totalHours).toBeLessThan(modes[0]!.totalHours);
    expect(modes[2]!.totalHours).toBeLessThan(modes[1]!.totalHours);
  });

  it('a colder kitchen needs a larger yeast dose', () => {
    const hybrid = fermentationModes(recipe)[1]!;
    const cold = yeastDoseGrams(hybrid, 1000, 18);
    const warm = yeastDoseGrams(hybrid, 1000, 26);
    expect(cold).toBeGreaterThan(warm);
  });
});

describe('freshly milled flour', () => {
  it('fresh flour drinks less and ferments faster', () => {
    const fresh = millingEffect({ daysAgo: 0, siftedFraction: 0 });
    expect(fresh.absorptionDelta).toBeLessThan(0);
    expect(fresh.fermentFactor).toBeGreaterThan(1);
  });

  it('matured flour returns to the model value', () => {
    const matured = millingEffect({ daysAgo: 30, siftedFraction: 0 });
    expect(matured.absorptionDelta).toBeCloseTo(0, 1);
    expect(matured.fermentFactor).toBeCloseTo(1, 2);
  });

  it('sifting lowers absorption and extraction', () => {
    const sifted = millingEffect({ daysAgo: 21, siftedFraction: 0.15 });
    expect(sifted.absorptionDelta).toBeLessThan(0);
    expect(sifted.effectiveExtraction).toBeCloseTo(85, 0);
  });
});
