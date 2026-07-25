/**
 * Golden tests.
 *
 * Two families, doing genuinely different jobs.
 *
 * **Identity** — given the author's own flour, the engine must reproduce the
 * published hydration within ±1.5 points, and the whole ingredient ledger must
 * reconcile. This catches drift and double-counting in the plumbing: tier
 * deltas applied twice, bassinage subtracted from the wrong total, soaker
 * water leaking into the nominal hydration.
 *
 * **Model validation** — falsifiable claims about the physics, stated as
 * orderings and ranges rather than magic numbers. These are the tests that
 * would have caught the strength-calibration bug, and they are what stops the
 * identity tests from being tautological.
 */

import { describe, expect, it } from 'vitest';
import { bake, DEFAULT_OPTIONS } from '@/engine/bake';
import { computeBlend } from '@/engine/blend';
import { buildStageLedger } from '@/engine/stages';
import { compareFlours } from '@/engine/compare';
import { requireFlour, FLOURS } from './flours';
import { authorFlours, RECIPES, requireRecipe } from './recipes';
import type { Recipe } from '@/engine/types';

const TOLERANCE = 1.5;

function bakeWithAuthorFlour(recipe: Recipe, over: Partial<typeof DEFAULT_OPTIONS> = {}) {
  const flours = authorFlours(recipe);
  return bake({
    recipe,
    authorFlours: flours,
    roleFlours: flours,
    options: {
      ...DEFAULT_OPTIONS,
      doughTemp: recipe.authorContext.doughTemp,
      ...over,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

describe('golden: the author\'s flour reproduces the published formula', () => {
  for (const recipe of RECIPES) {
    it(`${recipe.slug} returns ${recipe.hydration}% hydration`, () => {
      const result = bakeWithAuthorFlour(recipe);
      expect(Math.abs(result.hydration - recipe.hydration)).toBeLessThanOrEqual(TOLERANCE);
    });
  }

  it('holds for every recipe at every safety tier, offset by exactly the tier delta', () => {
    const deltas = { 'super-safe': -6, safe: -3, standard: 0, 'as-intended': 3 } as const;
    for (const recipe of RECIPES) {
      for (const [tier, delta] of Object.entries(deltas)) {
        const r = bakeWithAuthorFlour(recipe, { tier: tier as keyof typeof deltas });
        expect(Math.abs(r.hydration - (recipe.hydration + delta))).toBeLessThanOrEqual(TOLERANCE);
      }
    }
  });
});

describe('golden: the ledger reconciles for every recipe', () => {
  for (const recipe of RECIPES) {
    it(`${recipe.slug} — parts sum to the whole`, () => {
      const result = bakeWithAuthorFlour(recipe);
      const ledger = buildStageLedger({
        recipe,
        blend: result.blend,
        totalFlour: 1000,
        hydration: result.hydration,
        tier: 'standard',
      });
      expect(ledger.final.totalWeight).toBeCloseTo(result.totalDoughWeight, 0);
      const internal = ledger.warnings.filter((w) => w.en.startsWith('Internal check'));
      expect(internal).toHaveLength(0);
    });
  }
});

describe('golden: no NaN anywhere, on any recipe, under any equipment', () => {
  const methods = ['hand', 'stand-mixer', 'spiral', 'food-processor', 'bread-machine', 'no-knead'] as const;

  for (const recipe of RECIPES) {
    it(`${recipe.slug} survives every mixing method`, () => {
      for (const mixMethod of methods) {
        const r = bakeWithAuthorFlour(recipe, { mixMethod });
        expect(Number.isFinite(r.hydration)).toBe(true);
        expect(Number.isFinite(r.bulkMinutes)).toBe(true);
        expect(Number.isFinite(r.totalDoughWeight)).toBe(true);
        expect(Number.isFinite(r.coldProofHours)).toBe(true);
        for (const ing of r.ingredients) expect(Number.isFinite(ing.grams)).toBe(true);
        for (const step of r.steps) {
          expect(Number.isFinite(step.minutes)).toBe(true);
          expect(typeof step.body.nl).toBe('string');
          expect(step.body.nl.length).toBeGreaterThan(0);
        }
      }
    });
  }
});

/* ------------------------------------------------------------------ */
/* Model validation — falsifiable claims about the physics             */
/* ------------------------------------------------------------------ */

describe('model: absorption ordering', () => {
  const abs = (slug: string) => requireFlour(slug).absorption;

  it('American bread flour drinks more than French T65 — the product\'s whole thesis', () => {
    const gap = abs('us-bread-flour') - abs('fr-t65');
    expect(gap).toBeGreaterThan(5);
    expect(gap).toBeLessThan(12);
  });

  it('the gap is mostly milling and hardness, not protein', () => {
    const cmp = compareFlours(requireFlour('fr-t65'), requireFlour('us-bread-flour'));
    const byKey = new Map(cmp.explanation.contributions.map((c) => [c.key, c.points]));
    const milling = (byKey.get('damagedStarch') ?? 0) + (byKey.get('hardness') ?? 0);
    const protein = byKey.get('protein') ?? 0;
    expect(milling).toBeGreaterThan(protein);
  });

  it('ranks white < high-extraction < wholemeal < rye', () => {
    expect(abs('fr-t55')).toBeLessThan(abs('fr-t80'));
    expect(abs('fr-t80')).toBeLessThan(abs('fr-t150'));
    expect(abs('de-1050')).toBeLessThan(abs('de-weizenvollkorn'));
    expect(abs('de-weizenvollkorn')).toBeLessThan(abs('de-roggenvollkorn'));
  });

  it('stone milling lowers absorption against the same grain roller-milled', () => {
    expect(abs('nl-volkoren-steengemalen')).toBeLessThan(abs('nl-volkorenmeel'));
  });

  it('ancient grains take up less water than wheat of similar extraction', () => {
    expect(abs('de-dinkelvollkorn')).toBeLessThan(abs('de-weizenvollkorn'));
    expect(abs('us-einkorn')).toBeLessThan(abs('us-whole-wheat'));
  });

  it('keeps every flour inside a physically plausible band', () => {
    for (const f of FLOURS) {
      expect(f.absorption).toBeGreaterThan(45);
      expect(f.absorption).toBeLessThan(100);
    }
  });
});

describe('model: strength', () => {
  const str = (slug: string) => requireFlour(slug).strength;

  it('holds its anchors', () => {
    expect(str('fr-t65')).toBeGreaterThan(52);
    expect(str('fr-t65')).toBeLessThan(68);
    expect(str('us-bread-flour')).toBeGreaterThan(70);
    expect(str('us-bread-flour')).toBeLessThan(82);
  });

  it('rates spelt far below wheat despite spelt carrying more protein', () => {
    const spelt = requireFlour('de-dinkelvollkorn');
    const wheat = requireFlour('fr-t65');
    expect(spelt.protein).toBeGreaterThan(wheat.protein);
    expect(spelt.strength).toBeLessThan(wheat.strength * 0.6);
  });

  it('puts rye near the floor — it forms no gluten network', () => {
    expect(str('de-roggenvollkorn')).toBeLessThan(12);
  });

  it('ranks Canadian strong above American bread above Dutch patent', () => {
    expect(str('ca-strong-bakers')).toBeGreaterThan(str('us-bread-flour'));
    expect(str('us-bread-flour')).toBeGreaterThan(str('nl-patentbloem'));
  });

  it('keeps every flour in range', () => {
    for (const f of FLOURS) {
      expect(f.strength).toBeGreaterThanOrEqual(0);
      expect(f.strength).toBeLessThanOrEqual(100);
    }
  });
});

describe('model: fermentation speed', () => {
  const fs = (slug: string) => requireFlour(slug).fermentSpeed;

  it('ranks white < wholemeal < rye', () => {
    expect(fs('fr-t55')).toBeLessThan(fs('fr-t150'));
    expect(fs('fr-t150')).toBeLessThan(fs('de-roggenvollkorn'));
  });

  it('keeps white wheat at the 1.0 baseline, within a small band', () => {
    expect(fs('fr-t55')).toBeGreaterThan(0.95);
    expect(fs('fr-t55')).toBeLessThan(1.1);
  });
});

/* ------------------------------------------------------------------ */
/* Substitution behaviour                                              */
/* ------------------------------------------------------------------ */

describe('substitution: swapping flour moves the numbers the right way', () => {
  it('running a US recipe on French T65 lowers the hydration', () => {
    const recipe = requireRecipe('hoge-hydratatie-wit');
    const authors = authorFlours(recipe);
    const original = bake({ recipe, authorFlours: authors, roleFlours: authors, options: DEFAULT_OPTIONS });
    const onT65 = bake({
      recipe,
      authorFlours: authors,
      roleFlours: { 'strong-white': requireFlour('fr-t65'), wholegrain: requireFlour('fr-t150') },
      options: DEFAULT_OPTIONS,
    });
    expect(onT65.hydration).toBeLessThan(original.hydration);
    expect(original.hydration - onT65.hydration).toBeGreaterThan(4);
  });

  it('running a French recipe on Canadian flour raises it', () => {
    const recipe = requireRecipe('desem-stokbrood');
    const authors = authorFlours(recipe);
    const original = bake({ recipe, authorFlours: authors, roleFlours: authors, options: DEFAULT_OPTIONS });
    const onCanadian = bake({
      recipe,
      authorFlours: authors,
      roleFlours: { white: requireFlour('ca-strong-bakers') },
      options: DEFAULT_OPTIONS,
    });
    expect(onCanadian.hydration).toBeGreaterThan(original.hydration);
  });

  it('substituting spelt weakens the dough enough to change the shaping advice', () => {
    const recipe = requireRecipe('hoge-hydratatie-wit');
    const authors = authorFlours(recipe);
    const onSpelt = bake({
      recipe,
      authorFlours: authors,
      roleFlours: {
        'strong-white': requireFlour('de-dinkel-630'),
        wholegrain: requireFlour('de-dinkelvollkorn'),
      },
      options: DEFAULT_OPTIONS,
    });
    expect(onSpelt.blend.strength).toBeLessThan(45);
    expect(onSpelt.shaping.recommended).not.toBe('batard');
    expect(onSpelt.folds.type).not.toBe('slap-and-fold');
  });

  it('the gap explanation always sums to the delta it claims', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const r = bake({
      recipe,
      authorFlours: authors,
      roleFlours: { white: requireFlour('fr-t65'), wholegrain: requireFlour('fr-t150') },
      options: DEFAULT_OPTIONS,
    });
    const summed = r.explanation.contributions.reduce((s, c) => s + c.points, 0);
    expect(Math.abs(summed - r.explanation.totalDelta)).toBeLessThan
      ? expect(Math.abs(summed - r.explanation.totalDelta)).toBeLessThan(0.05)
      : undefined;
    // And the delta must match the hydration move the engine actually made.
    expect(Math.abs(r.explanation.totalDelta - (r.hydration - recipe.hydration))).toBeLessThan(0.6);
  });
});

/* ------------------------------------------------------------------ */
/* Equipment                                                           */
/* ------------------------------------------------------------------ */

describe('equipment changes method, not just numbers', () => {
  it('a stand mixer cuts the fold count', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const byHand = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, mixMethod: 'hand' } });
    const byMixer = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, mixMethod: 'stand-mixer' } });
    expect(byMixer.folds.count).toBeLessThan(byHand.folds.count);
  });

  it('a stand mixer changes the prose of the mixing step', () => {
    const recipe = requireRecipe('desem-busbrood');
    const authors = authorFlours(recipe);
    const byHand = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, mixMethod: 'hand' } });
    const byMixer = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, mixMethod: 'stand-mixer' } });
    const mixHand = byHand.steps.find((s) => s.kind === 'mix');
    const mixMachine = byMixer.steps.find((s) => s.kind === 'mix');
    expect(mixHand?.body.en).not.toBe(mixMachine?.body.en);
  });

  it('refuses machine mixing on a blend too weak to survive it', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const r = bake({
      recipe,
      authorFlours: authors,
      roleFlours: { white: requireFlour('us-einkorn'), wholegrain: requireFlour('us-einkorn') },
      options: { ...DEFAULT_OPTIONS, mixMethod: 'stand-mixer' },
    });
    expect(r.equipment.mix.advisable).toBe(false);
    expect(r.warnings.some((w) => w.code === 'machine-too-aggressive')).toBe(true);
  });

  it('caps the batch at what the mixer bowl can hold', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const r = bake({
      recipe, authorFlours: authors, roleFlours: authors,
      options: { ...DEFAULT_OPTIONS, totalFlour: 2000, mixMethod: 'stand-mixer', mixerBowlLitres: 4.8 },
    });
    expect(r.equipment.capacity?.fits).toBe(false);
    expect(r.warnings.some((w) => w.code === 'bowl-too-small')).toBe(true);
  });

  it('a warm fridge shortens the cold proof', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const cold = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, fridgeTemp: 3 } });
    const warm = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, fridgeTemp: 8 } });
    expect(warm.coldProofHours).toBeLessThan(cold.coldProofHours);
  });

  it('a fan oven bakes cooler than the recipe states', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const fan = bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, ovenType: 'fan' } });
    expect(fan.bake.temp).toBeLessThan(recipe.bake.temp);
  });
});

/* ------------------------------------------------------------------ */
/* Temperature                                                         */
/* ------------------------------------------------------------------ */

describe('temperature', () => {
  it('a warmer kitchen shortens bulk, monotonically', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const at = (t: number) =>
      bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, doughTemp: t } }).bulkMinutes;
    expect(at(20)).toBeGreaterThan(at(24));
    expect(at(24)).toBeGreaterThan(at(28));
  });

  it('roughly doubles the rate per 10 °C, as Q10 = 2.4 implies', () => {
    const recipe = requireRecipe('alledaags-landbrood');
    const authors = authorFlours(recipe);
    const at = (t: number) =>
      bake({ recipe, authorFlours: authors, roleFlours: authors, options: { ...DEFAULT_OPTIONS, doughTemp: t } }).bulkMinutes;
    const ratio = at(18) / at(28);
    expect(ratio).toBeGreaterThan(1.9);
    expect(ratio).toBeLessThan(3.2);
  });
});

/* ------------------------------------------------------------------ */
/* Recipe data integrity                                               */
/* ------------------------------------------------------------------ */

describe('recipe data', () => {
  it('every flour blend sums to 100%', () => {
    for (const r of RECIPES) {
      const total = r.flourBlend.reduce((s, b) => s + b.pct, 0);
      expect(Math.abs(total - 100)).toBeLessThan(0.001);
    }
  });

  it('every author flour slug resolves', () => {
    for (const r of RECIPES) {
      expect(() => authorFlours(r)).not.toThrow();
      expect(Object.keys(authorFlours(r)).length).toBe(
        new Set(r.flourBlend.map((b) => b.role)).size,
      );
    }
  });

  it('every recipe has bilingual prose on every step', () => {
    for (const r of RECIPES) {
      for (const s of r.steps) {
        expect(s.title.nl.length).toBeGreaterThan(0);
        expect(s.title.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('every hydration is inside the modelled range', () => {
    for (const r of RECIPES) {
      expect(r.hydration).toBeGreaterThanOrEqual(50);
      expect(r.hydration).toBeLessThanOrEqual(100);
      expect(r.salt).toBeGreaterThan(1);
      expect(r.salt).toBeLessThan(4);
    }
  });

  it('slugs are unique', () => {
    expect(new Set(RECIPES.map((r) => r.slug)).size).toBe(RECIPES.length);
  });
});

describe('flour data', () => {
  it('slugs are unique', () => {
    expect(new Set(FLOURS.map((f) => f.slug)).size).toBe(FLOURS.length);
  });

  it('every blend of every pair produces finite numbers', () => {
    const sample = FLOURS.filter((_, i) => i % 7 === 0);
    for (const a of sample) {
      for (const b of sample) {
        const blend = computeBlend([
          { flour: a, fraction: 0.5 },
          { flour: b, fraction: 0.5 },
        ]);
        expect(Number.isFinite(blend.absorption)).toBe(true);
        expect(Number.isFinite(blend.strength)).toBe(true);
        expect(Number.isFinite(blend.fermentSpeed)).toBe(true);
        expect(Number.isFinite(blend.tolerance)).toBe(true);
      }
    }
  });
});
