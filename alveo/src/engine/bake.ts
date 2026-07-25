/**
 * The orchestrator: recipe + the flour you actually own → every number on the
 * page.
 *
 * The central move is in `resolveHydration`. A published hydration is not a
 * universal truth, it is a measurement of the author's flour. So we store it
 * *relative to that flour's absorption* and re-express it against yours:
 *
 *     yourHydration = authorHydration + (yourAbsorption − authorAbsorption) + tier
 *
 * When your flour is the author's flour, the identity holds exactly and you get
 * the published number back. That is what the golden tests assert.
 */

import { computeBlend } from './blend';
import {
  checkBowlCapacity,
  fridgeAdvice,
  machineMixPlan,
  ovenAdvice,
  resolveStepBody,
  stepAppliesTo,
  type CapacityCheck,
  type FridgeAdvice,
  type MachineMixPlan,
  type OvenAdvice,
} from './equipment';
import { HYDRATION_MAX, HYDRATION_MIN, TIERS } from './constants';
import { explainGap } from './explain';
import { buildFormula, doughWeightPerFlourGram } from './formula';
import {
  bakeTemp,
  benchMinutes,
  bulkMinutes,
  coldProofHours,
  foldPlan,
  levainHours,
  shapingAdvice,
} from './schedule';
import { tempFactor } from './temperature';
import { collectWarnings } from './warnings';
import type {
  BakeResult,
  BlendComponent,
  EngineOptions,
  Flour,
  FlourRole,
  Ingredient,
  MixMethod,
  Recipe,
  TimedStep,
} from './types';
import { clamp, round } from './util';

export type RoleFlours = Partial<Record<FlourRole, Flour>>;

export interface BakeInput {
  recipe: Recipe;
  /**
   * The flour the reader owns, mapped onto the recipe's roles. Any role left
   * unmapped falls back to the author's flour for that role, so a partially
   * stocked shelf still produces a complete answer.
   */
  roleFlours?: RoleFlours;
  /** Fully explicit blend, for the free-form calculator. Overrides roleFlours. */
  components?: BlendComponent[];
  /** The author's flours, resolved from `recipe.authorContext.roleFlours`. */
  authorFlours: RoleFlours;
  options: EngineOptions;
}

export const DEFAULT_OPTIONS: EngineOptions = {
  tier: 'standard',
  doughTemp: 24,
  totalFlour: 1000,
  mixMethod: 'hand',
};

/** Build blend components from a recipe's role percentages and a flour map. */
export function componentsFromRoles(recipe: Recipe, flours: RoleFlours, fallback: RoleFlours = {}): BlendComponent[] {
  const out: BlendComponent[] = [];
  for (const entry of recipe.flourBlend) {
    const flour = flours[entry.role] ?? fallback[entry.role];
    if (!flour) continue;
    out.push({ flour, fraction: entry.pct / 100 });
  }
  // Merge duplicate flours so a shelf with one bag mapped to two roles behaves.
  const merged = new Map<string, BlendComponent>();
  for (const c of out) {
    const existing = merged.get(c.flour.slug);
    if (existing) existing.fraction += c.fraction;
    else merged.set(c.flour.slug, { ...c });
  }
  return [...merged.values()];
}

export function resolveHydration(
  recipe: Recipe,
  userAbsorption: number,
  authorAbsorption: number,
  tier: EngineOptions['tier'],
  override?: number,
): number {
  if (typeof override === 'number' && Number.isFinite(override)) {
    return round(clamp(override, HYDRATION_MIN, HYDRATION_MAX), 1);
  }
  const shifted = recipe.hydration + (userAbsorption - authorAbsorption) + TIERS[tier].hydrationDelta;
  return round(clamp(shifted, HYDRATION_MIN, HYDRATION_MAX), 1);
}

export function bake(input: BakeInput): BakeResult {
  const { recipe, authorFlours, options } = input;

  const authorComponents = componentsFromRoles(recipe, authorFlours);
  const authorBlend = computeBlend(authorComponents);

  const userComponents =
    input.components && input.components.length > 0
      ? input.components
      : componentsFromRoles(recipe, input.roleFlours ?? {}, authorFlours);

  const blend = computeBlend(userComponents.length > 0 ? userComponents : authorComponents);

  const hydration = resolveHydration(
    recipe,
    blend.absorption,
    authorBlend.absorption,
    options.tier,
    options.hydrationOverride,
  );

  const formula = buildFormula({
    recipe,
    totalFlour: options.totalFlour,
    hydration,
    bassinageHoldFraction: TIERS[options.tier].bassinageHoldFraction,
  });

  const scheduleInput = {
    blend,
    recipe,
    hydration,
    tier: options.tier,
    doughTemp: options.doughTemp,
    altitude: options.altitude,
  };

  const bulk = bulkMinutes(scheduleInput);
  const fridge = fridgeAdvice(options.fridgeTemp ?? 5);
  const cold = round(coldProofHours(scheduleInput) * fridge.multiplier, 1);
  const bench = benchMinutes(blend);
  const levain = levainHours(recipe, blend, recipe.levain.temp);
  const mixPlan = machineMixPlan(options.mixMethod, blend, hydration);
  let folds = foldPlan(scheduleInput, bulk);
  // A dough taken to full development on a hook needs one or two folds, not
  // four. -1 means "leave the hand schedule alone".
  if (mixPlan.foldsAfter >= 0 && mixPlan.foldsAfter < folds.count) {
    const count = mixPlan.foldsAfter;
    folds = {
      ...folds,
      count,
      atMinutes: folds.atMinutes.slice(0, count),
      note: mixPlan.note,
    };
  }
  const shaping = shapingAdvice(blend, recipe, options.tier);

  const oven = ovenAdvice(options.ovenType ?? 'dutch-oven', recipe.bake.temp, recipe.bake.lidMin);

  const capacity = options.mixerBowlLitres
    ? checkBowlCapacity(
        options.mixerBowlLitres,
        formula.totalDoughWeight,
        hydration,
        doughWeightPerFlourGram(recipe, hydration),
      )
    : undefined;

  const steps = resolveSteps({
    recipe,
    ingredients: formula.ingredients,
    bulk,
    coldHours: cold,
    bench,
    levainHrs: levain,
    doughTemp: options.doughTemp,
    fermentSpeed: blend.fermentSpeed,
    tierBulk: TIERS[options.tier].bulkMultiplier,
    extraLid: TIERS[options.tier].extraLidMinutes,
    mixMethod: options.mixMethod,
    machineMinutes: mixPlan.minutes,
  });

  const warnings = collectWarnings({
    blend,
    recipe,
    hydration,
    authorHydration: recipe.hydration,
    options,
    bulkMinutes: bulk,
  });

  const explanation = explainGap(authorBlend, blend, TIERS[options.tier].hydrationDelta);

  if (capacity?.warning) warnings.unshift(capacity.warning);
  if (mixPlan.warning) warnings.unshift(mixPlan.warning);

  return {
    recipe,
    blend,
    options,
    hydration,
    authorHydration: recipe.hydration,
    authorBlend,
    water: formula.water,
    ingredients: formula.ingredients,
    totalDoughWeight: formula.totalDoughWeight,
    bulkMinutes: bulk,
    coldProofHours: cold,
    benchMinutes: bench,
    levainHours: levain,
    folds,
    shaping,
    bake: {
      ...recipe.bake,
      temp: bakeTemp({ ...recipe, bake: { ...recipe.bake, temp: oven.temp } }, options.altitude ?? 0),
      lidMin: oven.lidMinutes + TIERS[options.tier].extraLidMinutes,
    },
    equipment: { mix: mixPlan, oven, fridge, capacity },
    steps,
    warnings,
    explanation,
    tempFactor: tempFactor(options.doughTemp),
    uncertainty: blend.uncertainty,
    confidence: blend.confidence,
  };
}

interface StepResolveInput {
  recipe: Recipe;
  ingredients: Ingredient[];
  bulk: number;
  coldHours: number;
  bench: number;
  levainHrs: number;
  doughTemp: number;
  fermentSpeed: number;
  tierBulk: number;
  extraLid: number;
  mixMethod: MixMethod;
  machineMinutes: number;
}

/**
 * Authored steps carry the prose; the engine fills in the durations. Steps
 * whose duration is a fermentation get the engine's computed value; everything
 * else is scaled only if the recipe asked for it.
 */
export function resolveSteps(input: StepResolveInput): TimedStep[] {
  const { recipe } = input;
  const byKey = new Map(input.ingredients.map((i) => [i.key, i]));
  let offset = 0;

  return recipe.steps
    .filter((step) => stepAppliesTo(step, input.mixMethod))
    .map((step) => {
    let minutes = step.baseMinutes ?? 0;

    switch (step.kind) {
      case 'levain':
        minutes = input.levainHrs * 60;
        break;
      case 'bulk':
        minutes = input.bulk;
        break;
      case 'cold-proof':
        minutes = input.coldHours * 60;
        break;
      case 'bench':
        minutes = input.bench;
        break;
      case 'proof':
        // Final warm proof tracks bulk speed but is much shorter.
        minutes = round((step.baseMinutes ?? 60) * tempFactor(input.doughTemp) / Math.max(input.fermentSpeed, 0.5), 0);
        break;
      case 'bake':
        minutes = (step.baseMinutes ?? recipe.bake.lidMin + recipe.bake.openMin) + input.extraLid;
        break;
      case 'mix':
        // Machine mixing takes real time that hand mixing spends on folds.
        minutes = input.machineMinutes > 0 ? Math.ceil(input.machineMinutes) + 3 : (step.baseMinutes ?? 10);
        break;
      default:
        if (step.fermentScaled) {
          minutes = round(
            (step.baseMinutes ?? 0) * tempFactor(input.doughTemp) / Math.max(input.fermentSpeed, 0.5),
            0,
          );
        }
        if (step.tierScaled) minutes = round(minutes * input.tierBulk, 0);
    }

    minutes = round(clamp(minutes, 0, 4320), 0);

    const timed: TimedStep = {
      ...step,
      body: resolveStepBody(step.body, input.mixMethod),
      minutes,
      offsetMinutes: round(offset, 0),
      ingredients: (step.reveals ?? [])
        .map((k) => byKey.get(k))
        .filter((i): i is Ingredient => Boolean(i)),
    };
    offset += minutes;
    return timed;
  });
}

/** Total wall-clock time for a resolved bake, in minutes. */
export function totalMinutes(steps: TimedStep[]): number {
  return steps.reduce((s, step) => s + step.minutes, 0);
}
