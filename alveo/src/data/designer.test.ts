import { describe, expect, it } from 'vitest';
import { bake, DEFAULT_OPTIONS } from '@/engine/bake';
import { maxSensibleHydration, computeBlend } from '@/engine/blend';
import { requireFlour } from './flours';
import { chooseFormat, customFlour, designRecipe } from './designer';

const strongWhite = requireFlour('us-bread-flour');
const wholemeal = requireFlour('us-whole-wheat');
const rye = requireFlour('de-roggenvollkorn');
const spelt = requireFlour('de-dinkelvollkorn');

describe('DIY designer', () => {
  it('designs a coherent recipe from a single strong flour', () => {
    const { recipe, roleFlours } = designRecipe([{ flour: strongWhite, fraction: 1 }]);
    expect(recipe.flourBlend.reduce((s, b) => s + b.pct, 0)).toBeCloseTo(100, 0);
    expect(recipe.hydration).toBeGreaterThanOrEqual(50);
    expect(recipe.hydration).toBeLessThanOrEqual(100);
    expect(recipe.steps.length).toBeGreaterThanOrEqual(6);
    expect(Object.keys(roleFlours).length).toBe(1);
  });

  it('steers a rye-heavy blend to a tin, not a free-standing loaf', () => {
    const { recipe } = designRecipe([
      { flour: rye, fraction: 0.7 },
      { flour: wholemeal, fraction: 0.3 },
    ]);
    expect(recipe.format).toBe('tin');
  });

  it('steers weak spelt away from a batard', () => {
    const blend = computeBlend([{ flour: spelt, fraction: 1 }]);
    expect(chooseFormat(blend)).not.toBe('batard');
  });

  it('keeps a strong white blend as a free-standing shape', () => {
    const { recipe } = designRecipe([{ flour: strongWhite, fraction: 1 }], { format: 'auto' });
    expect(['boule', 'batard']).toContain(recipe.format);
  });

  it('ambition moves the hydration and never exceeds the ceiling', () => {
    const blend = computeBlend([{ flour: strongWhite, fraction: 1 }]);
    const ceiling = maxSensibleHydration(blend);
    const safe = designRecipe([{ flour: strongWhite, fraction: 1 }], { ambition: 'safe' }).recipe.hydration;
    const open = designRecipe([{ flour: strongWhite, fraction: 1 }], { ambition: 'open' }).recipe.hydration;
    expect(open).toBeGreaterThan(safe);
    expect(open).toBeLessThanOrEqual(ceiling + 0.5);
  });

  it('sourness moves the inoculation', () => {
    const mild = designRecipe([{ flour: strongWhite, fraction: 1 }], { sourness: 'mild' }).recipe.prefermentedFlour;
    const sour = designRecipe([{ flour: strongWhite, fraction: 1 }], { sourness: 'sour' }).recipe.prefermentedFlour;
    expect(sour).toBeGreaterThan(mild);
  });

  it('the designed recipe bakes cleanly, with the designed hydration reproduced', () => {
    const { recipe, roleFlours } = designRecipe([
      { flour: strongWhite, fraction: 0.8 },
      { flour: wholemeal, fraction: 0.2 },
    ], { ambition: 'balanced' });
    const result = bake({
      recipe,
      authorFlours: roleFlours,
      roleFlours,
      options: { ...DEFAULT_OPTIONS, doughTemp: recipe.authorContext.doughTemp },
    });
    // The design's own flour reproduces its own hydration (identity holds).
    expect(Math.abs(result.hydration - recipe.hydration)).toBeLessThanOrEqual(1.5);
    expect(Number.isFinite(result.totalDoughWeight)).toBe(true);
    for (const step of result.steps) expect(step.body.en.length).toBeGreaterThan(0);
  });

  it('assigns each flour a distinct role', () => {
    const { recipe } = designRecipe([
      { flour: strongWhite, fraction: 0.5 },
      { flour: wholemeal, fraction: 0.3 },
      { flour: rye, fraction: 0.2 },
    ]);
    const roles = recipe.flourBlend.map((b) => b.role);
    expect(new Set(roles).size).toBe(roles.length);
  });
});

describe('custom flour entry', () => {
  it('derives a full record from a hand-entered bag', () => {
    const f = customFlour({ name: 'My local strong white', protein: 13, hardness: 'hard' });
    expect(f.confidence).toBe('estimated');
    expect(f.absorption).toBeGreaterThan(45);
    expect(f.strength).toBeGreaterThan(0);
    expect(f.slug.startsWith('custom-')).toBe(true);
  });

  it('a higher declared protein yields more strength', () => {
    const weak = customFlour({ name: 'a', protein: 9 });
    const strong = customFlour({ name: 'b', protein: 14 });
    expect(strong.strength).toBeGreaterThan(weak.strength);
  });

  it('can design a recipe entirely from a custom flour', () => {
    const f = customFlour({ name: 'Home spelt', protein: 13, species: 'spelt', wholegrain: 1, mill: 'stone' });
    const { recipe } = designRecipe([{ flour: f, fraction: 1 }]);
    expect(recipe.format).toBeDefined();
    expect(recipe.hydration).toBeGreaterThanOrEqual(50);
  });
});
