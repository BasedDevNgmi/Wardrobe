import { describe, expect, it } from 'vitest';
import { computeBlend } from './blend';
import { deriveFlour } from './flour';
import { buildFormula } from './formula';
import { buildStageLedger, parseRatio, recommendAutolyse } from './stages';
import { solve } from './solve';
import { roundPreservingTotal, sum } from './util';
import type { Recipe } from './types';

const white = deriveFlour({
  slug: 'test-white', name: 'Test strong white', country: 'NL', system: 'dutch',
  protein: 12.5, proteinBasis: 'as-sold', ash: 0.5,
  species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
  additives: ['none'], confidence: 'estimated',
});

const wholegrain = deriveFlour({
  slug: 'test-wg', name: 'Test wholemeal', country: 'NL', system: 'dutch',
  protein: 13, proteinBasis: 'as-sold', ash: 1.65,
  species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
  additives: ['none'], confidence: 'estimated',
});

const rye = deriveFlour({
  slug: 'test-rye', name: 'Test whole rye', country: 'NL', system: 'dutch',
  protein: 9, proteinBasis: 'as-sold', ash: 1.8, fallingNumber: 200,
  species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
  additives: ['none'], confidence: 'estimated',
});

const recipe: Recipe = {
  slug: 'test-country',
  title: { nl: 'Test', en: 'Test' },
  summary: { nl: '', en: '' },
  difficulty: 2,
  format: 'boule',
  totalHours: 24,
  activeMinutes: 40,
  flourBlend: [
    { role: 'white', pct: 80 },
    { role: 'wholegrain', pct: 20 },
  ],
  hydration: 75,
  salt: 2,
  prefermentedFlour: 10,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 5,
  steps: [],
  yield: { pieces: 2, gramsEach: 900 },
  bake: { temp: 250, lidMin: 20, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'] },
  authorContext: { roleFlours: {}, note: { nl: '', en: '' }, doughTemp: 24 },
  attribution: {},
};

const blend = computeBlend([
  { flour: white, fraction: 0.8 },
  { flour: wholegrain, fraction: 0.2 },
]);

describe('roundPreservingTotal', () => {
  it('keeps the sum intact where naive rounding would not', () => {
    const values = [33.34, 33.33, 33.33];
    const rounded = roundPreservingTotal(values, 0);
    expect(sum(rounded)).toBe(100);
  });

  it('handles a realistic ingredient list', () => {
    const values = [800.4, 199.6, 750.2, 20.1, 49.7];
    const rounded = roundPreservingTotal(values, 0);
    expect(sum(rounded)).toBe(Math.round(sum(values)));
  });

  it('never emits NaN for degenerate input', () => {
    expect(roundPreservingTotal([]).length).toBe(0);
    expect(roundPreservingTotal([NaN, 1]).every(Number.isFinite)).toBe(true);
  });
});

describe('parseRatio', () => {
  it('parses the usual forms', () => {
    expect(parseRatio('1:5:5')).toEqual({ seed: 1, flour: 5, water: 5 });
    expect(parseRatio('1:10:10')).toEqual({ seed: 1, flour: 10, water: 10 });
  });

  it('falls back rather than emitting NaN', () => {
    const r = parseRatio('nonsense');
    expect(Number.isFinite(r.seed)).toBe(true);
    expect(Number.isFinite(r.flour)).toBe(true);
    expect(Number.isFinite(r.water)).toBe(true);
  });
});

describe('stage ledger', () => {
  it('reconciles exactly with the formula total', () => {
    const ledger = buildStageLedger({
      recipe, blend, totalFlour: 1000, hydration: 75, tier: 'standard',
    });
    const formula = buildFormula({ recipe, totalFlour: 1000, hydration: 75 });
    expect(ledger.final.totalWeight).toBeCloseTo(formula.totalDoughWeight, 0);
    expect(ledger.warnings.map((w) => w.en).join()).not.toContain('Internal check');
  });

  it('ends with every gram of flour and water accounted for', () => {
    const ledger = buildStageLedger({
      recipe, blend, totalFlour: 1000, hydration: 75, tier: 'standard',
    });
    expect(ledger.final.flour).toBeCloseTo(1000, 0);
    expect(ledger.final.water).toBeCloseTo(750, 0);
    expect(ledger.final.hydration).toBeCloseTo(75, 0);
  });

  it('reports the autolyse at its own hydration, not the final one', () => {
    const ledger = buildStageLedger({
      recipe, blend, totalFlour: 1000, hydration: 75, tier: 'standard',
    });
    const autolyse = ledger.stages.find((s) => s.kind === 'autolyse');
    expect(autolyse).toBeDefined();
    // Levain water and bassinage are both still outstanding at this point.
    expect(autolyse!.running.hydration).toBeLessThan(75);
    expect(autolyse!.running.hydration).toBeGreaterThan(50);
  });

  it('never lets running hydration go backwards', () => {
    const ledger = buildStageLedger({
      recipe, blend, totalFlour: 1000, hydration: 82, tier: 'super-safe',
    });
    const inDough = ledger.stages.filter((s) => s.running.flour > 0);
    for (let i = 1; i < inDough.length; i += 1) {
      expect(inDough[i]!.running.totalWeight).toBeGreaterThanOrEqual(
        inDough[i - 1]!.running.totalWeight - 0.5,
      );
    }
  });

  it('produces no NaN on any stage', () => {
    for (const hydration of [55, 65, 75, 85, 95]) {
      for (const tier of ['super-safe', 'safe', 'standard', 'as-intended'] as const) {
        const ledger = buildStageLedger({
          recipe, blend, totalFlour: 1000, hydration, tier,
        });
        for (const stage of ledger.stages) {
          expect(Number.isFinite(stage.running.hydration)).toBe(true);
          expect(Number.isFinite(stage.running.totalWeight)).toBe(true);
          for (const a of stage.additions) expect(Number.isFinite(a.grams)).toBe(true);
        }
      }
    }
  });

  it('scales linearly with batch size', () => {
    const small = buildStageLedger({ recipe, blend, totalFlour: 500, hydration: 75, tier: 'standard' });
    const large = buildStageLedger({ recipe, blend, totalFlour: 1000, hydration: 75, tier: 'standard' });
    expect(large.final.totalWeight).toBeCloseTo(small.final.totalWeight * 2, 0);
  });
});

describe('autolyse advice', () => {
  it('shortens or skips the rest for enzyme-heavy flour', () => {
    const ryeBlend = computeBlend([{ flour: rye, fraction: 1 }]);
    const advice = recommendAutolyse(ryeBlend, recipe);
    expect(advice.minutes).toBeLessThan(25);
  });

  it('extends the rest for high-bran blends', () => {
    const wgBlend = computeBlend([{ flour: wholegrain, fraction: 1 }]);
    const whiteBlend = computeBlend([{ flour: white, fraction: 1 }]);
    expect(recommendAutolyse(wgBlend, recipe).minutes).toBeGreaterThan(
      recommendAutolyse(whiteBlend, recipe).minutes,
    );
  });

  it('switches to fermentolyse at high inoculation', () => {
    const heavy = { ...recipe, prefermentedFlour: 25 };
    const advice = recommendAutolyse(computeBlend([{ flour: white, fraction: 1 }]), heavy);
    expect(advice.mode).toBe('fermentolyse');
  });
});

describe('solve', () => {
  it('round-trips flour to dough weight and back', () => {
    const a = solve(recipe, 75, { kind: 'total-flour', grams: 1000 });
    const b = solve(recipe, 75, { kind: 'dough-weight', grams: a.doughWeight });
    expect(b.totalFlour).toBeCloseTo(1000, -1);
  });

  it('hits the requested yield', () => {
    const r = solve(recipe, 75, { kind: 'yield', pieces: 2, gramsEach: 900 });
    expect(r.doughWeight).toBeCloseTo(1800, -1);
    expect(r.gramsEach).toBeCloseTo(900, -1);
  });

  it('uses all the starter by moving the inoculation, not the batch size', () => {
    const r = solve(recipe, 75, { kind: 'starter-on-hand', grams: 300, useAll: true });
    expect(r.prefermentedFlour).toBeGreaterThan(recipe.prefermentedFlour);
    expect(r.doughWeight).toBeCloseTo(1800, -1);
  });

  it('warns when the batch is too small to weigh salt accurately', () => {
    const r = solve(recipe, 75, { kind: 'total-flour', grams: 100 });
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it('caps the batch at the flour actually on the shelf', () => {
    const r = solve(recipe, 75, { kind: 'limiting-flour', grams: 380, fractionOfBlend: 0.2 });
    expect(r.totalFlour).toBeCloseTo(1900, -2);
  });
});
