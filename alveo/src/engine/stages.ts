/**
 * The stage ledger.
 *
 * Every other sourdough calculator gives you one ingredient list. That list is
 * useless at the bench, because at no point in the bake do you tip all of it
 * into one bowl. What you actually need is: *what goes in right now, and what
 * is the dough in front of me at this moment.*
 *
 * So the ledger assigns every gram to a stage — soaker, levain build, autolyse,
 * mix, bassinage, inclusions — and carries a running state of the main dough
 * through them. The running hydration is the number nobody else shows and the
 * one that explains the most: a dough that finishes at 82% sits at 65% during
 * the autolyse, and autolyse behaviour depends on *that* figure, not on the
 * number printed at the top of the recipe.
 */

import { computeBlend } from './blend';
import { buildFormula } from './formula';
import type {
  AddIn,
  BlendProfile,
  IngredientKey,
  Recipe,
  SafetyTier,
} from './types';
import { TIERS } from './constants';
import { clamp, round, safeDiv, sum } from './util';

export type LocalisedText = { nl: string; en: string };

export type StageKind =
  | 'soaker'
  | 'levain'
  | 'autolyse'
  | 'mix'
  | 'salt'
  | 'bassinage'
  | 'inclusions';

export interface StageAddition {
  key: IngredientKey;
  label: LocalisedText;
  grams: number;
  group: 'flour' | 'liquid' | 'salt' | 'levain' | 'addin' | 'fat' | 'starter';
  /** Ingredients prepared in a separate vessel do not join the dough yet. */
  separateVessel?: boolean;
}

export interface StageState {
  /** Flour in the main dough after this stage, grams. */
  flour: number;
  /** Free water in the main dough after this stage, grams. */
  water: number;
  /** Hydration of the dough actually in the bowl right now, %. */
  hydration: number;
  /** Everything in the bowl, grams. */
  totalWeight: number;
}

export interface Stage {
  id: string;
  kind: StageKind;
  title: LocalisedText;
  /** Minutes relative to the final mix. Negative = before it. */
  offsetMinutes: number;
  additions: StageAddition[];
  /** State of the main dough after this stage's additions. */
  running: StageState;
  note: LocalisedText;
}

export interface StageLedger {
  stages: Stage[];
  /** Final state, which must equal the formula's totals exactly. */
  final: StageState;
  autolyse: AutolyseAdvice;
  warnings: LocalisedText[];
}

/* ------------------------------------------------------------------ */
/* Autolyse                                                            */
/* ------------------------------------------------------------------ */

export type AutolyseMode = 'autolyse' | 'fermentolyse' | 'none';

export interface AutolyseConfig {
  mode: AutolyseMode;
  minutes: number;
  /**
   * Hydration of the autolyse mass itself, %. Left undefined, the engine uses
   * every gram of water that is not spoken for by the levain or the bassinage.
   */
  targetHydration?: number;
  /** Flours held out of the autolyse — usually the rye, sometimes the durum. */
  excludeFlours?: string[];
  /** Salt in the autolyse is not an autolyse. Off by default, on request only. */
  includeSalt?: boolean;
}

export interface AutolyseAdvice extends AutolyseConfig {
  mode: AutolyseMode;
  minutes: number;
  /** The hydration the autolyse mass will actually sit at, %. */
  resultingHydration: number;
  rationale: LocalisedText;
  /** Advisory range rather than a single number, because it is a range. */
  minutesRange: [number, number];
}

const MIN_AUTOLYSE_HYDRATION = 50;

/**
 * How long to autolyse, decided from the flour rather than from tradition.
 *
 * Three competing forces, all of which the engine already holds numbers for:
 *
 * - Bran hydrates slowly, so wholegrain gains the most from a long rest.
 * - Protease degrades gluten during the rest, and enzyme-loaded flour (rye,
 *   malted, low falling number) has plenty of it — so a long autolyse on that
 *   flour costs you the structure it was supposed to build.
 * - Ancient-grain gluten is fragile and protease-sensitive both. Short or not
 *   at all.
 *
 * The received wisdom "always autolyse for an hour" is only right for the
 * middle of that space.
 */
export function recommendAutolyse(
  blend: BlendProfile,
  recipe: Recipe,
): AutolyseAdvice {
  const ancient = blend.components
    .filter((c) => ['spelt', 'einkorn', 'emmer', 'khorasan'].includes(c.flour.species))
    .reduce((s, c) => s + c.fraction, 0);

  const branShare = clamp(blend.branFraction / 0.16, 0, 1);

  /**
   * `enzymeLoad` already counts bran, and bran is handled by its own term
   * below. Subtracting the bran share leaves the *excess* enzyme activity —
   * rye, malt, added amylase, a low falling number — which is the part that
   * actually argues for a shorter rest. Without this, plain wholemeal gets
   * penalised twice for the same property and comes out shorter than white,
   * which is backwards.
   */
  const enzymeExcess = clamp(blend.enzymeLoad - branShare * 0.5, 0, 1);

  // Start from a white-wheat default and push it around.
  let minutes = 40;
  minutes += branShare * 35;      // bran hydrates slowly and wants the time
  minutes -= enzymeExcess * 45;   // protease degrades what the rest builds
  minutes -= ancient * 30;        // fragile, protease-sensitive gluten
  minutes = clamp(minutes, 0, 120);

  let mode: AutolyseMode = 'autolyse';
  let rationale: LocalisedText;

  if (enzymeExcess > 0.35 || blend.glutenPoorFraction > 0.5) {
    mode = 'none';
    minutes = 0;
    rationale = {
      nl: `Sla de autolyse over. Met een enzymbelasting van ${Math.round(blend.enzymeLoad * 100)}% breekt protease het gluten sneller af dan de rust het opbouwt — je levert structuur in voor niets.`,
      en: `Skip the autolyse. At an enzyme load of ${Math.round(blend.enzymeLoad * 100)}%, protease breaks gluten down faster than the rest builds it up — you trade away structure for nothing.`,
    };
  } else if (ancient > 0.4) {
    mode = 'fermentolyse';
    minutes = clamp(minutes, 15, 25);
    rationale = {
      nl: `${Math.round(ancient * 100)}% oergraan: kort en met de desem erbij (fermentolyse). Het gluten van spelt en einkorn is oplosbaarder en verdraagt een lange rust slecht.`,
      en: `${Math.round(ancient * 100)}% ancient grain: keep it short and include the levain (fermentolyse). Spelt and einkorn gluten is more soluble and tolerates a long rest badly.`,
    };
  } else if (branShare > 0.6) {
    rationale = {
      nl: `${Math.round(blend.branFraction * 100)}% zemelen in de mix. Zemelen nemen water traag op, dus een lange autolyse betaalt zich hier echt terug: het deeg voelt na afloop merkbaar minder nat aan bij hetzelfde watergehalte.`,
      en: `${Math.round(blend.branFraction * 100)}% bran in the blend. Bran takes water up slowly, so a long autolyse genuinely pays here: the dough feels markedly less wet afterwards at the same water content.`,
    };
  } else if (blend.strength > 75) {
    // A tolerance, not a need: strong flour survives a long rest and gains
    // extensibility from it, but it is bran that makes the rest necessary.
    minutes = clamp(minutes + 10, 30, 120);
    rationale = {
      nl: `Sterkte ${blend.strength}: deze bloem heeft de marge voor een lange autolyse en wordt er soepeler van. Boven de twee uur wint niemand nog iets.`,
      en: `Strength ${blend.strength}: this flour has the margin for a long autolyse and becomes more extensible for it. Past two hours, nobody gains anything.`,
    };
  } else {
    rationale = {
      nl: 'Een standaard autolyse van drie kwartier: lang genoeg om de bloem volledig te hydrateren, kort genoeg om het gluten niet af te breken.',
      en: 'A standard three-quarter-hour autolyse: long enough to hydrate the flour fully, short enough not to degrade the gluten.',
    };
  }

  // Recipes with a very high inoculation ferment during the rest whether you
  // meant them to or not, so call it what it is.
  // At 20%+ inoculation, any rest longer than about half an hour is a
  // fermentolyse in all but name.
  if (mode === 'autolyse' && recipe.prefermentedFlour >= 20 && minutes >= 30) {
    mode = 'fermentolyse';
    rationale = {
      nl: `Met ${recipe.prefermentedFlour}% voorgefermenteerde bloem fermenteert dit deeg tijdens de rust hoe dan ook. Doe de desem er dan meteen bij en noem het fermentolyse — dan klopt je tijdlijn tenminste.`,
      en: `At ${recipe.prefermentedFlour}% prefermented flour this dough ferments during the rest whether you intended it to or not. Add the levain up front and call it fermentolyse — at least then your timeline is honest.`,
    };
  }

  const rounded = Math.round(minutes / 5) * 5;

  return {
    mode,
    minutes: rounded,
    minutesRange: [Math.max(0, Math.round((rounded * 0.7) / 5) * 5), Math.round((rounded * 1.4) / 5) * 5],
    resultingHydration: 0, // filled in by buildStages, which knows the water split
    rationale,
    includeSalt: false,
  };
}

/* ------------------------------------------------------------------ */
/* The ledger                                                          */
/* ------------------------------------------------------------------ */

export interface LedgerInput {
  recipe: Recipe;
  blend: BlendProfile;
  totalFlour: number;
  hydration: number;
  tier: SafetyTier;
  /** Omit to let the engine choose. */
  autolyse?: Partial<AutolyseConfig>;
  /** Starter hydration the baker actually keeps, if it differs from the recipe. */
  starterHydration?: number;
}

export function buildStageLedger(input: LedgerInput): StageLedger {
  const { recipe, blend } = input;
  const F = Math.max(0, input.totalFlour);

  const formula = buildFormula({
    recipe,
    totalFlour: F,
    hydration: input.hydration,
    bassinageHoldFraction: TIERS[input.tier].bassinageHoldFraction,
  });

  const advice = recommendAutolyse(blend, recipe);
  const cfg: AutolyseConfig = {
    mode: input.autolyse?.mode ?? advice.mode,
    minutes: input.autolyse?.minutes ?? advice.minutes,
    targetHydration: input.autolyse?.targetHydration,
    excludeFlours: input.autolyse?.excludeFlours ?? [],
    includeSalt: input.autolyse?.includeSalt ?? false,
  };

  const warnings: LocalisedText[] = [];
  const stages: Stage[] = [];

  /* ---- running state of the main dough ---- */
  let flour = 0;
  let water = 0;
  let extras = 0; // salt, fat, sugar, inclusions — weight that is neither

  const state = (): StageState => ({
    flour: round(flour, 1),
    water: round(water, 1),
    hydration: round(safeDiv(water * 100, flour), 1),
    totalWeight: round(flour + water + extras, 1),
  });

  /* ---- flour split by role ---- */
  const excluded = new Set(cfg.excludeFlours ?? []);
  const perFlour = blend.components.map((c) => ({
    slug: c.flour.slug,
    name: c.flour.name,
    grams: round(F * c.fraction, 1),
    excluded: excluded.has(c.flour.slug),
  }));

  const levainFlour = formula.levainFlour;
  const levainWater = formula.levainWater;
  const bassinage = formula.water.bassinage;

  /* ---- 1. soaker ---- */
  const soakerAddIns = (recipe.addIns ?? []).filter(
    (a) => a.type === 'soaker' || typeof a.absorbsWater === 'number',
  );
  if (soakerAddIns.length > 0) {
    const additions: StageAddition[] = soakerAddIns.map((a) => ({
      key: `addin:${a.key}` as IngredientKey,
      label: a.name,
      grams: round((F * a.pct) / 100, 1),
      group: 'addin' as const,
      separateVessel: true,
    }));
    additions.push({
      key: 'soakerWater',
      label: { nl: 'Kokend water voor de weekmassa', en: 'Boiling water for the soaker' },
      grams: formula.water.soaker,
      group: 'liquid',
      separateVessel: true,
    });
    stages.push({
      id: 'soaker',
      kind: 'soaker',
      title: { nl: 'Weekmassa aanzetten', en: 'Start the soaker' },
      offsetMinutes: -12 * 60,
      additions,
      running: state(),
      note: {
        nl: 'Aparte kom. Deze granen binden hun water voordat ze in het deeg gaan — doe je dat niet, dan trekken ze het later uit je kruim en bak je effectief droger dan het recept zegt.',
        en: 'Separate bowl. These grains bind their water before they meet the dough — skip this and they pull it out of your crumb later, so you bake effectively drier than the recipe says.',
      },
    });
  }

  /* ---- 2. levain build ---- */
  const starterHydration = input.starterHydration ?? recipe.levain.hydration;
  const seedParts = parseRatio(recipe.levain.ratio);
  const seed = round(levainFlour * safeDiv(seedParts.seed, seedParts.flour, 0.2), 1);

  if (Math.abs(starterHydration - recipe.levain.hydration) > 5) {
    warnings.push({
      nl: `Je desem staat op ${starterHydration}% en het recept rekent met ${recipe.levain.hydration}%. Het waterverschil is verrekend in de mix, dus de einddeeg-hydratatie klopt nog steeds.`,
      en: `Your starter is at ${starterHydration}% and the recipe assumes ${recipe.levain.hydration}%. The water difference is settled up in the mix, so the final dough hydration still holds.`,
    });
  }

  stages.push({
    id: 'levain',
    kind: 'levain',
    title: { nl: 'Desem opbouwen', en: 'Build the levain' },
    offsetMinutes: -Math.round(recipe.levain.hours * 60),
    additions: [
      {
        key: 'levain',
        label: { nl: 'Rijpe starter (uit je pot)', en: 'Ripe starter (from your jar)' },
        grams: seed,
        group: 'starter',
        separateVessel: true,
      },
      {
        key: 'flourTotal',
        label: { nl: 'Bloem voor de desem', en: 'Flour for the levain' },
        grams: levainFlour,
        group: 'flour',
        separateVessel: true,
      },
      {
        key: 'levain',
        label: { nl: 'Water voor de desem', en: 'Water for the levain' },
        grams: levainWater,
        group: 'liquid',
        separateVessel: true,
      },
    ],
    running: state(),
    note: {
      nl: `Aparte kom, ${recipe.levain.hours} uur op ${recipe.levain.temp} °C. Deze bloem en dit water tellen mee in het totaal — ze zijn hieronder al van de mix afgetrokken.`,
      en: `Separate bowl, ${recipe.levain.hours} hours at ${recipe.levain.temp} °C. This flour and water count towards the totals — they are already deducted from the mix below.`,
    },
  });

  /* ---- 3. autolyse ---- */
  const autolyseFlourGrams = round(
    sum(perFlour.filter((p) => !p.excluded).map((p) => p.grams)) - levainFlour,
    1,
  );

  // Water not spoken for by the levain or held back as bassinage.
  const freeWater = round(formula.water.mix, 1);
  const requested = cfg.targetHydration
    ? round((autolyseFlourGrams * cfg.targetHydration) / 100, 1)
    : freeWater;
  const autolyseWater = round(clamp(requested, 0, freeWater), 1);
  const heldFromAutolyse = round(freeWater - autolyseWater, 1);

  if (cfg.mode !== 'none' && autolyseFlourGrams > 0) {
    const resulting = round(safeDiv(
      (autolyseWater + (cfg.mode === 'fermentolyse' ? levainWater : 0)) * 100,
      autolyseFlourGrams + (cfg.mode === 'fermentolyse' ? levainFlour : 0),
    ), 1);

    advice.resultingHydration = resulting;

    if (resulting < MIN_AUTOLYSE_HYDRATION) {
      warnings.push({
        nl: `De autolyse zou op ${resulting}% uitkomen. Onder ${MIN_AUTOLYSE_HYDRATION}% hydrateert de bloem niet volledig en heeft de rust weinig zin — verklein de bassinage of voeg water toe aan deze stap.`,
        en: `The autolyse would land at ${resulting}%. Below ${MIN_AUTOLYSE_HYDRATION}% the flour does not fully hydrate and the rest achieves little — reduce the bassinage or move water into this step.`,
      });
    }

    const additions: StageAddition[] = perFlour
      .filter((p) => !p.excluded)
      .map((p) => ({
        key: `flour:${p.slug}` as IngredientKey,
        label: { nl: p.name, en: p.name },
        // The levain has already taken its share of flour, pro rata.
        grams: round(p.grams * safeDiv(autolyseFlourGrams, autolyseFlourGrams + levainFlour, 1), 1),
        group: 'flour' as const,
      }));

    additions.push({
      key: 'waterMix',
      label: { nl: 'Water', en: 'Water' },
      grams: autolyseWater,
      group: 'liquid',
    });

    if (cfg.mode === 'fermentolyse') {
      additions.push({
        key: 'levain',
        label: { nl: 'Desem (rijp)', en: 'Levain (ripe)' },
        grams: formula.levainTotal,
        group: 'levain',
      });
    }
    if (cfg.includeSalt) {
      additions.push({
        key: 'salt',
        label: { nl: 'Zout', en: 'Salt' },
        grams: round((F * recipe.salt) / 100, 1),
        group: 'salt',
      });
    }

    flour += autolyseFlourGrams + (cfg.mode === 'fermentolyse' ? levainFlour : 0);
    water += autolyseWater + (cfg.mode === 'fermentolyse' ? levainWater : 0);
    if (cfg.includeSalt) extras += (F * recipe.salt) / 100;

    stages.push({
      id: 'autolyse',
      kind: 'autolyse',
      title:
        cfg.mode === 'fermentolyse'
          ? { nl: 'Fermentolyse', en: 'Fermentolyse' }
          : { nl: 'Autolyse', en: 'Autolyse' },
      offsetMinutes: -cfg.minutes,
      additions,
      running: state(),
      note: {
        nl: `${cfg.minutes} minuten rust. Het deeg in je kom staat nu op ${resulting}% — niet op ${input.hydration}%. Dat is het getal dat bepaalt hoe deze stap aanvoelt.`,
        en: `${cfg.minutes} minutes of rest. The dough in your bowl is at ${resulting}% right now — not ${input.hydration}%. That is the figure that governs how this step feels.`,
      },
    });
  } else {
    advice.resultingHydration = 0;
  }

  /* ---- 4. mix ---- */
  const mixAdditions: StageAddition[] = [];

  if (cfg.mode === 'none') {
    for (const p of perFlour.filter((x) => !x.excluded)) {
      mixAdditions.push({
        key: `flour:${p.slug}` as IngredientKey,
        label: { nl: p.name, en: p.name },
        grams: round(p.grams * safeDiv(autolyseFlourGrams, autolyseFlourGrams + levainFlour, 1), 1),
        group: 'flour',
      });
    }
    mixAdditions.push({
      key: 'waterMix',
      label: { nl: 'Water', en: 'Water' },
      grams: autolyseWater,
      group: 'liquid',
    });
    flour += autolyseFlourGrams;
    water += autolyseWater;
  }

  // Flours deliberately kept out of the autolyse join here.
  for (const p of perFlour.filter((x) => x.excluded)) {
    mixAdditions.push({
      key: `flour:${p.slug}` as IngredientKey,
      label: { nl: p.name, en: p.name },
      grams: p.grams,
      group: 'flour',
    });
    flour += p.grams;
  }

  if (cfg.mode !== 'fermentolyse') {
    mixAdditions.push({
      key: 'levain',
      label: { nl: 'Desem (rijp)', en: 'Levain (ripe)' },
      grams: formula.levainTotal,
      group: 'levain',
    });
    flour += levainFlour;
    water += levainWater;
  }

  if (!cfg.includeSalt) {
    const saltGrams = round((F * recipe.salt) / 100, 1);
    mixAdditions.push({
      key: 'salt',
      label: { nl: 'Zout', en: 'Salt' },
      grams: saltGrams,
      group: 'salt',
    });
    extras += saltGrams;
  }

  if (heldFromAutolyse > 0) {
    mixAdditions.push({
      key: 'waterMix',
      label: { nl: 'Resterend water', en: 'Remaining water' },
      grams: heldFromAutolyse,
      group: 'liquid',
    });
    water += heldFromAutolyse;
  }

  // Fats, sugars and dairy go in at the mix unless the dough is weak, in which
  // case they wait until the gluten exists to be coated.
  const enrichments = (recipe.addIns ?? []).filter((a) =>
    ['fat', 'sugar', 'dairy'].includes(a.type),
  );
  const lateEnrichment = blend.strength < 60;
  if (!lateEnrichment) {
    for (const a of enrichments) {
      const grams = round((F * a.pct) / 100, 1);
      mixAdditions.push({
        key: `addin:${a.key}` as IngredientKey,
        label: a.name,
        grams,
        group: a.type === 'fat' ? 'fat' : 'addin',
      });
      extras += grams;
    }
  }

  stages.push({
    id: 'mix',
    kind: 'mix',
    title: { nl: 'Eindmix', en: 'Final mix' },
    offsetMinutes: 0,
    additions: mixAdditions,
    running: state(),
    note: {
      nl: 'Alles bij elkaar behalve wat hierna nog komt. Meng tot er geen droge bloem meer zichtbaar is; ontwikkeling komt later.',
      en: 'Everything together except what still follows. Mix until no dry flour is visible; development comes later.',
    },
  });

  /* ---- 5. bassinage ---- */
  if (bassinage > 0) {
    const hold = TIERS[input.tier].bassinageHoldFraction;
    water += bassinage;
    stages.push({
      id: 'bassinage',
      kind: 'bassinage',
      title: { nl: 'Bassinage', en: 'Bassinage' },
      offsetMinutes: 30,
      additions: [
        {
          key: 'waterBassinage',
          label: { nl: 'Achtergehouden water', en: 'Held-back water' },
          grams: bassinage,
          group: 'liquid',
        },
      ],
      running: state(),
      note:
        hold >= 1
          ? {
              nl: `Wacht met dit water tot ná de eerste vouwset. Voeg het in twee porties toe en knijp het erdoor — het deeg valt even uit elkaar en komt terug. Gaat het niet terug, stop dan en houd de rest achter.`,
              en: `Hold this water until after the first fold set. Add it in two goes and pinch it through — the dough falls apart briefly and comes back. If it does not come back, stop and keep the rest.`,
            }
          : {
              nl: 'Voeg dit water toe zodra het deeg samenhangt. In één keer erbij is sneller maar geeft je geen kans om te stoppen als het te veel wordt.',
              en: 'Add this water once the dough holds together. All at once is faster but gives you no chance to stop if it turns out to be too much.',
            },
    });
  }

  /* ---- 6. inclusions and late enrichment ---- */
  // A dry add-in that binds water (soaked fruit, say) is accounted for by the
  // soaker path below; counting it here as well would double its weight.
  const dryAddIns = (recipe.addIns ?? []).filter(
    (a) => a.type === 'dry' && typeof a.absorbsWater !== 'number',
  );
  const lateItems: StageAddition[] = [];

  for (const a of dryAddIns) {
    const grams = round((F * a.pct) / 100, 1);
    lateItems.push({
      key: `addin:${a.key}` as IngredientKey,
      label: a.name,
      grams,
      group: 'addin',
    });
    extras += grams;
  }
  for (const a of soakerAddIns) {
    const grams = round((F * a.pct) / 100, 1);
    lateItems.push({
      key: `addin:${a.key}` as IngredientKey,
      label: { nl: `${a.name.nl} (geweekt)`, en: `${a.name.en} (soaked)` },
      grams: round(grams + grams * (a.absorbsWater ?? 0), 1),
      group: 'addin',
    });
    extras += grams;
    water += grams * (a.absorbsWater ?? 0);
  }
  if (lateEnrichment) {
    for (const a of enrichments) {
      const grams = round((F * a.pct) / 100, 1);
      lateItems.push({
        key: `addin:${a.key}` as IngredientKey,
        label: a.name,
        grams,
        group: a.type === 'fat' ? 'fat' : 'addin',
      });
      extras += grams;
    }
  }

  if (lateItems.length > 0) {
    stages.push({
      id: 'inclusions',
      kind: 'inclusions',
      title: { nl: 'Toevoegingen inwerken', en: 'Work in the additions' },
      offsetMinutes: 60,
      additions: lateItems,
      running: state(),
      note: lateEnrichment
        ? {
            nl: `Sterkte ${blend.strength}: voeg het vet pas nu toe. Vet coat de glutenstrengen, en dit deeg heeft geen structuur over om weg te geven.`,
            en: `Strength ${blend.strength}: add the fat only now. Fat coats the gluten strands, and this dough has no structure to spare.`,
          }
        : {
            nl: 'Lamineer het deeg op een nat werkblad, verdeel de toevoegingen en rol op. Eén keer goed is beter dan drie keer voorzichtig.',
            en: 'Laminate the dough on a wet bench, spread the additions and roll it up. Once, properly, beats three careful attempts.',
          },
    });
  }

  /* ---- reconciliation ---- */
  const final = state();
  const expectedWeight = formula.totalDoughWeight;
  if (Math.abs(final.totalWeight - expectedWeight) > 1) {
    warnings.push({
      nl: `Interne controle: de stappen tellen op tot ${final.totalWeight} g terwijl het recept ${expectedWeight} g zegt. Meld dit — dit hoort niet te kunnen.`,
      en: `Internal check: the stages sum to ${final.totalWeight} g while the formula says ${expectedWeight} g. Please report this — it should not be possible.`,
    });
  }

  return { stages, final, autolyse: { ...advice, ...cfg, resultingHydration: advice.resultingHydration }, warnings };
}

/** "1:5:5" → { seed: 1, flour: 5, water: 5 }. Tolerates "1:5" and junk. */
export function parseRatio(ratio: string): { seed: number; flour: number; water: number } {
  const parts = String(ratio)
    .split(/[:\s]+/)
    .map((p) => Number(p.replace(',', '.')))
    .filter((n) => Number.isFinite(n) && n >= 0);
  const [seed = 1, flour = 5, water = flour] = parts;
  return { seed: seed || 1, flour: flour || 5, water: water || flour || 5 };
}
