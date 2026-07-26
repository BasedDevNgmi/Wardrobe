/**
 * The DIY recipe designer.
 *
 * The rest of the site goes recipe → your flour: pick a published formula and
 * re-express it. This goes the other way — flour → recipe. You give it the
 * flour in your cupboard and how ambitious you want to be, and it synthesises a
 * complete, coherent formula: hydration the blend can actually carry, the
 * format it can hold, salt, preferment, a fold plan and a full step list.
 *
 * Nothing here is guessed. Every choice is read off the blend profile the base
 * engine already computes, so a designed recipe behaves exactly like an
 * authored one and flows through bake(), the sourness dial, the planner and
 * kitchen mode unchanged.
 */

import { computeBlend, hydrationHeadroom, maxSensibleHydration } from '@/engine/blend';
import { BATARD_STRENGTH, PAN_ONLY_STRENGTH } from '@/engine/constants';
import { deriveFlour } from '@/engine/flour';
import { recommendAutolyse } from '@/engine/stages';
import {
  autolyseStep, bakeStep, bassinageStep, benchStep, bulkStep, coldProofStep,
  coolStep, foldStep, levainStep, mixStep, preshapeStep, proofStep,
  scoreStep, shapeStep,
} from './recipes/_steps';
import type {
  BlendComponent, Flour, FlourInput, FlourRole, Recipe, RecipeFormat,
} from '@/engine/types';
import { clamp, round } from '@/engine/util';

export type Ambition = 'safe' | 'balanced' | 'open';
export type DesignSourness = 'mild' | 'balanced' | 'sour';

export interface DesignOptions {
  /** 'auto' lets the engine pick the format the blend can hold. */
  format: RecipeFormat | 'auto';
  ambition: Ambition;
  sourness: DesignSourness;
  /** Salt as a percentage of flour. Defaults to 2.0. */
  salt?: number;
  doughTemp?: number;
}

export const DEFAULT_DESIGN: DesignOptions = {
  format: 'auto',
  ambition: 'balanced',
  sourness: 'balanced',
  salt: 2.0,
  doughTemp: 24,
};

export interface DesignedRecipe {
  recipe: Recipe;
  /** The user's flours mapped to roles, so bake() reproduces the design. */
  roleFlours: Partial<Record<FlourRole, Flour>>;
}

/* ------------------------------------------------------------------ */
/* Custom flour entry                                                  */
/* ------------------------------------------------------------------ */

/**
 * Turn a hand-entered bag into a full flour record. For when the reader's flour
 * is not in the database — they know it is "strong white, about 13% protein"
 * and that is enough for the model to work with, marked `estimated` so the
 * uncertainty is honest.
 */
export function customFlour(input: {
  name: string;
  protein: number;
  species?: FlourInput['species'];
  wholegrain?: number;
  mill?: FlourInput['mill'];
  hardness?: FlourInput['hardness'];
  proteinBasis?: FlourInput['proteinBasis'];
  ash?: number;
}): Flour {
  const slug = `custom-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'flour'}`;
  return deriveFlour({
    slug,
    name: input.name,
    country: 'NL',
    system: 'dutch',
    protein: clamp(input.protein, 5, 20),
    proteinBasis: input.proteinBasis ?? 'as-sold',
    ash: input.ash,
    species: input.species ?? 'wheat',
    wholegrain: clamp(input.wholegrain ?? 0, 0, 1),
    mill: input.mill ?? 'roller',
    hardness: input.hardness ?? 'medium',
    additives: ['none'],
    confidence: 'estimated',
    sourceNote: 'Handmatig ingevoerd — waarden door jou opgegeven. / Hand-entered — values you supplied.',
  });
}

/* ------------------------------------------------------------------ */
/* Choices, each read off the blend                                    */
/* ------------------------------------------------------------------ */

/** The format a blend can actually hold, if the reader lets the engine pick. */
export function chooseFormat(blend: ReturnType<typeof computeBlend>): RecipeFormat {
  if (blend.glutenPoorFraction > 0.5) return 'tin'; // rye-heavy: no gluten to shape
  if (blend.strength < PAN_ONLY_STRENGTH) return 'tin';
  if (blend.strength < BATARD_STRENGTH) return 'boule';
  return 'batard';
}

const FREE_STANDING: RecipeFormat[] = ['boule', 'batard', 'baguette'];

/** Hydration from the blend's absorption and how far the reader wants to push. */
export function chooseHydration(
  blend: ReturnType<typeof computeBlend>,
  ambition: Ambition,
): number {
  const ceiling = maxSensibleHydration(blend);
  const headroom = hydrationHeadroom(blend);
  const base = blend.absorption;
  const target =
    ambition === 'safe'
      ? base - 2
      : ambition === 'open'
        ? ceiling
        : base + headroom * 0.4;
  return round(clamp(Math.min(target, ceiling), 50, 100), 0);
}

/** Preferment percentage from the desired sourness. More levain, more acid. */
function chooseInoculation(sourness: DesignSourness): number {
  return sourness === 'mild' ? 8 : sourness === 'sour' ? 20 : 12;
}

/* ------------------------------------------------------------------ */
/* The synthesiser                                                     */
/* ------------------------------------------------------------------ */

/**
 * Assign each component a distinct role, so the generated recipe expresses its
 * blend through the same role system authored recipes use. Greedy by best fit,
 * never reusing a role — with typically two or three flours, collisions are
 * rare and resolved by taking the next-best role.
 */
export function assignRoles(components: BlendComponent[]): {
  flour: Flour;
  role: FlourRole;
  pct: number;
}[] {
  const ROLE_ORDER: FlourRole[] = ['strong-white', 'white', 'wholegrain', 'rye', 'durum', 'ancient'];
  const used = new Set<FlourRole>();
  const out: { flour: Flour; role: FlourRole; pct: number }[] = [];

  // Sort components strongest-first so the load-bearing flour claims its role.
  const sorted = [...components].sort((a, b) => b.flour.strength - a.flour.strength);

  for (const c of sorted) {
    const ranked = ROLE_ORDER
      .map((role) => ({ role, score: roleAffinity(c.flour, role) }))
      .filter((r) => r.score > -Infinity && !used.has(r.role))
      .sort((a, b) => b.score - a.score);
    const role = ranked[0]?.role ?? ROLE_ORDER.find((r) => !used.has(r)) ?? 'white';
    used.add(role);
    out.push({ flour: c.flour, role, pct: round(c.fraction * 100, 1) });
  }
  return out;
}

function roleAffinity(flour: Flour, role: FlourRole): number {
  const wg = flour.wholegrain;
  switch (role) {
    case 'strong-white':
      return flour.species === 'wheat' && wg <= 0.25 ? flour.strength : -Infinity;
    case 'white':
      return flour.species === 'wheat' && wg <= 0.35 ? 60 - Math.abs(flour.strength - 55) : -Infinity;
    case 'wholegrain':
      return flour.species !== 'rye' && wg > 0.35 ? wg * 100 : -Infinity;
    case 'rye':
      return flour.species === 'rye' ? 100 : -Infinity;
    case 'durum':
      return flour.species === 'durum' ? 100 : -Infinity;
    case 'ancient':
      return ['spelt', 'einkorn', 'emmer', 'khorasan'].includes(flour.species) ? 100 : -Infinity;
  }
}

export function designRecipe(
  componentsIn: BlendComponent[],
  optionsIn: Partial<DesignOptions> = {},
): DesignedRecipe {
  const options = { ...DEFAULT_DESIGN, ...optionsIn };
  const components = componentsIn.filter((c) => c.fraction > 0);
  const blend = computeBlend(components);

  const format = options.format === 'auto' ? chooseFormat(blend) : options.format;
  const hydration = chooseHydration(blend, options.ambition);
  const prefermentedFlour = chooseInoculation(options.sourness);
  const salt = options.salt ?? 2.0;
  const doughTemp = options.doughTemp ?? 24;

  // Bassinage only where it helps: a slack, strong-enough dough benefits from
  // holding water back; a stiff or weak one does not.
  const bassinage = hydration >= blend.absorption && blend.strength >= 45 ? 5 : 0;

  const assigned = assignRoles(components);
  const roleFlours: Partial<Record<FlourRole, Flour>> = {};
  for (const a of assigned) roleFlours[a.role] = a.flour;

  // recommendAutolyse only reads prefermentedFlour off the recipe.
  const autolyse = recommendAutolyse(blend, { prefermentedFlour } as Recipe);

  const freeStanding = FREE_STANDING.includes(format);

  const steps: Recipe['steps'] = [levainStep()];
  if (autolyse.mode !== 'none') {
    steps.push(
      autolyseStep({
        baseMinutes: autolyse.minutes,
        title:
          autolyse.mode === 'fermentolyse'
            ? { nl: 'Fermentolyse', en: 'Fermentolyse' }
            : { nl: 'Autolyse', en: 'Autolyse' },
      }),
    );
  }
  steps.push(mixStep());
  if (bassinage > 0) steps.push(bassinageStep());
  steps.push(foldStep(), bulkStep());
  if (freeStanding) {
    steps.push(preshapeStep(), benchStep(), shapeStep(), coldProofStep(), scoreStep(), bakeStep(), coolStep());
  } else {
    steps.push(shapeStep(), coldProofStep(), proofStep({ baseMinutes: 90 }), bakeStep(), coolStep());
  }

  const recipe: Recipe = {
    slug: 'zelfontworpen',
    title: {
      nl: 'Zelfontworpen brood',
      en: 'Your designed loaf',
    },
    summary: {
      nl: describeBlend(blend, format, 'nl'),
      en: describeBlend(blend, format, 'en'),
    },
    difficulty: difficultyFor(blend, hydration, format),
    format,
    totalHours: estimateHours(blend, prefermentedFlour, freeStanding),
    activeMinutes: freeStanding ? 45 : 35,
    flourBlend: assigned.map((a) => ({ role: a.role, pct: a.pct })),
    hydration,
    salt,
    prefermentedFlour,
    levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
    bassinage,
    steps,
    yield: freeStanding ? { pieces: 2, gramsEach: 900 } : { pieces: 1, gramsEach: 900 },
    bake: freeStanding
      ? { temp: 250, lidMin: 20, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 230 }
      : { temp: 220, lidMin: 0, openMin: 40, coreTemp: [96, 99], vessel: ['tin'] },
    authorContext: {
      roleFlours: Object.fromEntries(assigned.map((a) => [a.role, a.flour.slug])) as Partial<Record<FlourRole, string>>,
      note: {
        nl: `Ontworpen rond jouw meel op ${doughTemp} °C. De hydratatie van ${hydration}% is berekend uit de wateropname van deze mix, niet uit een bestaand recept — pas de ambitie aan als je natter of droger wilt.`,
        en: `Designed around your flour at ${doughTemp} °C. The ${hydration}% hydration is computed from this blend's absorption, not borrowed from an existing recipe — change the ambition if you want it wetter or drier.`,
      },
      doughTemp,
    },
    attribution: {},
    tags: ['designed', format],
  };

  return { recipe, roleFlours };
}

/* ------------------------------------------------------------------ */
/* Prose helpers                                                       */
/* ------------------------------------------------------------------ */

function describeBlend(
  blend: ReturnType<typeof computeBlend>,
  format: RecipeFormat,
  locale: 'nl' | 'en',
): string {
  const strengthWord =
    blend.strength >= 70
      ? { nl: 'sterke', en: 'strong' }
      : blend.strength >= 45
        ? { nl: 'middelsterke', en: 'medium-strength' }
        : { nl: 'zwakke', en: 'weak' };
  const shape: Record<RecipeFormat, { nl: string; en: string }> = {
    boule: { nl: 'een boule', en: 'a boule' },
    batard: { nl: 'een bâtard', en: 'a bâtard' },
    baguette: { nl: 'stokbroden', en: 'baguettes' },
    tin: { nl: 'een busbrood', en: 'a tin loaf' },
    ciabatta: { nl: 'ciabatta', en: 'ciabatta' },
    focaccia: { nl: 'focaccia', en: 'focaccia' },
    pizza: { nl: 'pizza', en: 'pizza' },
    rolls: { nl: 'broodjes', en: 'rolls' },
    enriched: { nl: 'een verrijkt brood', en: 'an enriched loaf' },
  };
  if (locale === 'nl') {
    return `Een op maat ontworpen recept voor jouw ${strengthWord.nl} mix (sterkte ${blend.strength}, wateropname ${blend.absorption}%). De motor stelt ${shape[format].nl} voor als de vorm die dit meel kan dragen.`;
  }
  return `A recipe designed for your ${strengthWord.en} blend (strength ${blend.strength}, absorption ${blend.absorption}%). The engine proposes ${shape[format].en} as the shape this flour can hold.`;
}

function difficultyFor(
  blend: ReturnType<typeof computeBlend>,
  hydration: number,
  format: RecipeFormat,
): Recipe['difficulty'] {
  let d = 2;
  if (hydration - blend.absorption > 4) d += 1;
  if (blend.tolerance < 40) d += 1;
  if (format === 'baguette') d += 1;
  if (format === 'tin') d -= 1;
  return clamp(d, 1, 5) as Recipe['difficulty'];
}

function estimateHours(
  blend: ReturnType<typeof computeBlend>,
  prefermentedFlour: number,
  freeStanding: boolean,
): number {
  // Base ~24 h with an overnight retard, shorter with more levain and faster flour.
  const base = freeStanding ? 24 : 20;
  const inoculationFactor = 10 / clamp(prefermentedFlour, 4, 40);
  return round(clamp(base * (0.6 + inoculationFactor * 0.4) / Math.max(blend.fermentSpeed, 0.6), 8, 40), 0);
}
