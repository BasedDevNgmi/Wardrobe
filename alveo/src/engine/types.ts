/**
 * Core type definitions for the Alveo flour engine.
 *
 * Everything in `src/engine` is pure TypeScript with zero runtime dependencies.
 * It must run identically in a React client component, in a Node script and in
 * a Vitest process. Do not import React, Next, or any I/O from this directory.
 */

export type Country =
  | 'US' | 'FR' | 'DE' | 'IT' | 'UK' | 'NL' | 'BE'
  | 'CA' | 'AU' | 'DK' | 'SE' | 'PL' | 'ES';

export type FlourSystem =
  | 'us-type'
  | 'french-T'
  | 'german-Type'
  | 'italian-tipo'
  | 'uk-strength'
  | 'dutch'
  | 'nordic';

export type Species =
  | 'wheat' | 'spelt' | 'emmer' | 'einkorn' | 'khorasan'
  | 'rye' | 'durum' | 'barley' | 'oat' | 'buckwheat';

export type Mill = 'roller' | 'stone' | 'home-stone' | 'home-impact';

export type Hardness = 'soft' | 'medium' | 'hard' | 'very-hard';

export type Additive =
  | 'vital-gluten' | 'ascorbic-acid' | 'enzymes'
  | 'malted-barley' | 'fava' | 'soy' | 'none';

export type Confidence = 'measured' | 'spec-sheet' | 'estimated';

/**
 * A flour as it exists in the database.
 *
 * `absorption`, `strength` and `fermentSpeed` are *derived* — they are computed
 * from the measured fields by `deriveFlour()`. They are stored on the record so
 * that page generation and the client calculator agree byte-for-byte, but they
 * are never hand-authored. `npm run check:data` re-derives every flour and fails
 * if a stored value has drifted from the model.
 */
export interface Flour {
  slug: string;
  name: string;
  brand?: string;
  country: Country;
  system: FlourSystem;
  designation?: string;

  /* ---- measured / declared ---- */
  protein: number;
  proteinBasis: 'as-sold' | 'dry';
  ash?: number;
  extraction?: number;
  W?: number;
  PL?: number;
  fallingNumber?: number;

  /* ---- classified ---- */
  species: Species;
  wholegrain: number;
  mill: Mill;
  hardness: Hardness;
  damagedStarch?: number;
  additives: Additive[];

  /* ---- derived (computed, cached) ---- */
  absorption: number;
  strength: number;
  fermentSpeed: number;
  confidence: Confidence;

  /* ---- provenance & commerce ---- */
  /** Where the declared numbers came from. Shown in the UI next to `confidence`. */
  sourceNote?: string;
  /** Countries where this flour is realistically buyable. Drives geo-aware links. */
  availableIn?: Country[];
  notes?: { nl: string; en: string };
}

/** The measured/classified subset needed to derive a flour. */
export type FlourInput = Omit<
  Flour,
  'absorption' | 'strength' | 'fermentSpeed'
> & {
  absorption?: number;
  strength?: number;
  fermentSpeed?: number;
};

/* ------------------------------------------------------------------ */
/* Blends                                                              */
/* ------------------------------------------------------------------ */

export interface BlendComponent {
  flour: Flour;
  /** Fraction of total flour weight, 0–1. Components must sum to 1. */
  fraction: number;
  /** UI concern, carried here so the redistribute helper can honour it. */
  locked?: boolean;
}

export interface BlendProfile {
  components: BlendComponent[];
  /** Weighted absorption after the strength correction, in %. */
  absorption: number;
  /** 0–100 dough-carrying capacity. */
  strength: number;
  /** 1.0 = white wheat baseline. */
  fermentSpeed: number;
  /** 0–100. How wide the "done" window is. Higher = more forgiving. */
  tolerance: number;
  /** Fraction of the blend that is whole kernel, 0–1. */
  wholegrain: number;
  /** Fraction of the blend that is bran/aleurone by mass, 0–~0.16. */
  branFraction: number;
  /** Fraction of the blend that is non-wheat, gluten-poor grain, 0–1. */
  glutenPoorFraction: number;
  /** Weighted enzyme load proxy; drives over-fermentation warnings. */
  enzymeLoad: number;
  /** Worst confidence across the components — never claim more than you have. */
  confidence: Confidence;
  /** ± hydration points implied by the confidence level. */
  uncertainty: number;
}

/* ------------------------------------------------------------------ */
/* Recipes                                                             */
/* ------------------------------------------------------------------ */

export type FlourRole =
  | 'strong-white'
  | 'white'
  | 'wholegrain'
  | 'rye'
  | 'durum'
  | 'ancient';

export type RecipeFormat =
  | 'boule' | 'batard' | 'baguette' | 'ciabatta' | 'focaccia'
  | 'pizza' | 'tin' | 'rolls' | 'enriched';

export type StepKind =
  | 'levain' | 'autolyse' | 'mix' | 'bassinage' | 'fold' | 'bulk'
  | 'preshape' | 'bench' | 'shape' | 'proof' | 'cold-proof'
  | 'score' | 'bake' | 'cool' | 'soaker' | 'rest' | 'lamination';

export type LocalisedProse = { nl: string; en: string };

/**
 * Step prose, optionally varying by mixing method.
 *
 * A stand mixer is not the same recipe performed by a machine: "slap and fold
 * for three minutes" becomes "speed 2 for six minutes, then check the
 * windowpane". Only the mixing and folding steps need overrides; bulk, shaping
 * and baking read the same whatever mixed them, so they stay a bare
 * `LocalisedProse` and the resolver falls through to it.
 */
export type StepBody =
  | LocalisedProse
  | ({ default: LocalisedProse } & Partial<Record<MixMethod, LocalisedProse>>);

export interface RecipeStep {
  id: string;
  kind: StepKind;
  title: LocalisedProse;
  /** Original, human-written method prose. Never sourced from a book. See LEGAL.md. */
  body: StepBody;
  /** Steps that only exist for certain methods — a machine has no bench work. */
  onlyForMethods?: MixMethod[];
  /** Steps a given method makes redundant. */
  skipForMethods?: MixMethod[];
  /** Nominal duration in minutes at the reference temperature (24 °C). */
  baseMinutes?: number;
  /** If set, the engine scales this step by fermentSpeed and temperature. */
  fermentScaled?: boolean;
  /** If set, the engine scales this step by the safety tier's bulk multiplier. */
  tierScaled?: boolean;
  /** Ingredient keys revealed at this step, so kitchen mode can show weights. */
  reveals?: IngredientKey[];
}

export type IngredientKey =
  | 'levain'
  | 'flourTotal'
  | 'waterTotal'
  | 'waterMix'
  | 'waterBassinage'
  | 'salt'
  | 'oil'
  | 'milk'
  | 'butter'
  | 'sugar'
  | 'soakerWater'
  | `flour:${string}`
  | `addin:${string}`;

export interface AddIn {
  key: string;
  name: { nl: string; en: string };
  /** % of total flour weight. */
  pct: number;
  type: 'dry' | 'soaker' | 'fat' | 'sugar' | 'dairy';
  /** Grams of water bound per gram of add-in. Soakers and dried fruit steal water. */
  absorbsWater?: number;
}

export interface Recipe {
  slug: string;
  title: { nl: string; en: string };
  summary: { nl: string; en: string };
  difficulty: 1 | 2 | 3 | 4 | 5;
  format: RecipeFormat;
  totalHours: number;
  activeMinutes: number;

  flourBlend: { role: FlourRole; pct: number; note?: { nl: string; en: string } }[];

  hydration: number;
  salt: number;
  prefermentedFlour: number;
  levain: { hydration: number; ratio: string; hours: number; temp: number };
  bassinage: number;

  addIns?: AddIn[];

  steps: RecipeStep[];
  yield: { pieces: number; gramsEach: number };
  bake: {
    temp: number;
    lidMin: number;
    openMin: number;
    coreTemp: [number, number];
    vessel: string[];
    /** Optional drop-down temperature after the lid comes off. */
    openTemp?: number;
  };

  /**
   * The flour the author was standing in front of when they wrote the number.
   * This is what makes substitution meaningful: hydration is stored relative to
   * this blend's absorption, not as an absolute truth.
   */
  authorContext: {
    /** Slugs of the flours assumed by the published formula, per role. */
    roleFlours: Partial<Record<FlourRole, string>>;
    /** Free-text note for the UI: "written for US bread flour at 24 °C". */
    note: { nl: string; en: string };
    /** Dough temperature the published timings assume, °C. */
    doughTemp: number;
  };

  attribution: { inspiredBy?: string; url?: string; author?: string };
  tags?: string[];

  /**
   * One honest photograph of the crumb, if we have one.
   *
   * The index pages stay deliberately text-only — a wall of styled food
   * photography is what every other recipe site looks like, and it says
   * nothing a reader can act on. On the recipe page itself the calculus is
   * different: people judge bread by its crumb, and refusing to show it is
   * dogma rather than design.
   *
   * The rule for anything that goes in here: a real bake of *this* formula,
   * shot as it came out, crumb visible. Not a stock loaf, not a styled set,
   * not a picture of a different bread that happens to look good. `alt` must
   * describe the crumb (open, tight, even), because that is the information
   * the picture is carrying; it is required, not optional.
   */
  image?: {
    /** Path under /public, e.g. "/recipes/alledaags-landbrood.jpg". */
    src: string;
    /** Describes the crumb, not the mood. Required — this image is data. */
    alt: { nl: string; en: string };
    /** Intrinsic pixel dimensions, so the layout never jumps. */
    width: number;
    height: number;
    /** Who baked and shot it. */
    credit?: string;
  };
}

/* ------------------------------------------------------------------ */
/* Engine inputs & outputs                                             */
/* ------------------------------------------------------------------ */

export type SafetyTier = 'super-safe' | 'safe' | 'standard' | 'as-intended';

export type MixMethod =
  | 'hand'
  | 'stand-mixer'
  | 'spiral'
  | 'food-processor'
  | 'bread-machine'
  | 'no-knead';

export type OvenType =
  | 'dutch-oven'
  | 'stone-steam'
  | 'tray'
  | 'combi-steam'
  | 'deck'
  | 'fan'
  | 'gas';

export type ProofVessel = 'banneton' | 'bowl-cloth' | 'proofer' | 'fridge' | 'couche' | 'tin';

export interface EngineOptions {
  tier: SafetyTier;
  /** Actual dough temperature in °C. */
  doughTemp: number;
  /** Total flour weight in grams. */
  totalFlour: number;
  /** Overrides the recipe's hydration entirely (user slider). */
  hydrationOverride?: number;
  mixMethod: MixMethod;
  /** Metres above sea level; adjusts proof time and bake. */
  altitude?: number;
  ovenType?: OvenType;
  proofVessel?: ProofVessel;
  /**
   * Actual fridge temperature in °C. Domestic fridges run 2–8 °C, and across a
   * 14-hour retard that spread is a larger effect than most of the flour
   * properties this engine models. Default 5.
   */
  fridgeTemp?: number;
  /** Capacity of the reader's mixer bowl, litres. Caps the batch size. */
  mixerBowlLitres?: number;
}

export interface WaterSplit {
  /** Water carried in by the levain. */
  levain: number;
  /** Water in the initial mix / autolyse. */
  mix: number;
  /** Water held back for bassinage. */
  bassinage: number;
  /** Water bound by soakers before it ever reaches the dough. */
  soaker: number;
  /** Water contributed by dairy (milk is ~87% water). */
  dairy: number;
  total: number;
}

export interface Ingredient {
  key: IngredientKey;
  label: { nl: string; en: string };
  grams: number;
  /** Baker's percentage of total flour. */
  pct: number;
  group: 'flour' | 'liquid' | 'salt' | 'levain' | 'addin' | 'fat';
}

export type FoldType = 'slap-and-fold' | 'coil' | 'bowl' | 'stretch-and-fold' | 'lamination';

export interface FoldPlan {
  count: number;
  type: FoldType;
  /** Minutes after the start of bulk for each fold. */
  atMinutes: number[];
  note: { nl: string; en: string };
}

export type WarningLevel = 'info' | 'caution' | 'danger';

export interface Warning {
  code: string;
  level: WarningLevel;
  message: { nl: string; en: string };
  /** What to actually do about it. */
  fix?: { nl: string; en: string };
}

export interface TimedStep extends Omit<RecipeStep, 'body'> {
  /** Prose already resolved for the chosen mixing method. */
  body: LocalisedProse;
  /** Resolved duration in minutes after ferment/temp/tier scaling. */
  minutes: number;
  /** Cumulative minutes from t=0 (levain build start). */
  offsetMinutes: number;
  ingredients: Ingredient[];
}

export interface AbsorptionBreakdown {
  base: number;
  protein: number;
  bran: number;
  damagedStarch: number;
  hardness: number;
  additives: number;
  /** The species multiplier expressed as an absolute point delta. */
  species: number;
  total: number;
}

export interface GapExplanation {
  /** Total hydration delta between the author's flour and the user's, in points. */
  totalDelta: number;
  /** Points attributable to each physical driver. Sums to `totalDelta`. */
  contributions: {
    key: keyof Omit<AbsorptionBreakdown, 'total'> | 'strength' | 'tier';
    points: number;
    label: { nl: string; en: string };
  }[];
  /** Points the user chose via the safety tier, kept separate from physics. */
  tierPoints: number;
}

export interface BakeResult {
  recipe: Recipe;
  blend: BlendProfile;
  options: EngineOptions;

  /** Final target hydration, %. */
  hydration: number;
  /** Hydration the author published, %. */
  authorHydration: number;
  /** The author's blend, resolved to real flours. */
  authorBlend: BlendProfile;

  water: WaterSplit;
  ingredients: Ingredient[];
  totalDoughWeight: number;

  bulkMinutes: number;
  coldProofHours: number;
  benchMinutes: number;
  levainHours: number;
  folds: FoldPlan;

  shaping: {
    format: RecipeFormat;
    /** May differ from the recipe's format if the blend can't hold it. */
    recommended: 'boule' | 'batard' | 'pan' | 'free-form';
    note: { nl: string; en: string };
    preshapes: 1 | 2;
  };

  bake: Recipe['bake'];
  /** Everything that changes because of the reader's equipment. */
  equipment: {
    mix: import('./equipment').MachineMixPlan;
    oven: import('./equipment').OvenAdvice;
    fridge: import('./equipment').FridgeAdvice;
    capacity?: import('./equipment').CapacityCheck;
  };
  steps: TimedStep[];
  warnings: Warning[];
  explanation: GapExplanation;
  tempFactor: number;
  /** ± hydration points of honest uncertainty. */
  uncertainty: number;
  confidence: Confidence;
}
