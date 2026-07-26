/**
 * The flour database.
 *
 * Every record passes through `deriveFlour()` at module load, so `absorption`,
 * `strength` and `fermentSpeed` can never drift from the model — there is no
 * way to hand-author them. `npm run check:data` asserts the same invariant in
 * CI along with slug uniqueness and range sanity.
 */

import { deriveFlour } from '@/engine/flour';
import type { Country, Flour, FlourRole, Species } from '@/engine/types';

import { FR_FLOURS } from './fr';
import { DE_FLOURS } from './de';
import { IT_FLOURS } from './it';
import { US_FLOURS } from './us';
import { NL_FLOURS, BE_FLOURS, UK_FLOURS } from './nl-be-uk';
import { DK_FLOURS, SE_FLOURS, PL_FLOURS, ES_FLOURS, AU_FLOURS } from './nordic-pl-es-au';
import { FLOUR_NOTES } from './notes';
import { CORE_NOTES } from './notes-core';

const DECLARATIONS = [
  ...FR_FLOURS,
  ...DE_FLOURS,
  ...IT_FLOURS,
  ...US_FLOURS,
  ...NL_FLOURS,
  ...BE_FLOURS,
  ...UK_FLOURS,
  ...DK_FLOURS,
  ...SE_FLOURS,
  ...PL_FLOURS,
  ...ES_FLOURS,
  ...AU_FLOURS,
];

export const FLOURS: Flour[] = DECLARATIONS.map((d) =>
  deriveFlour({ ...d, notes: CORE_NOTES[d.slug] ?? FLOUR_NOTES[d.slug] ?? d.notes }),
);

const BY_SLUG = new Map(FLOURS.map((f) => [f.slug, f]));

export function getFlour(slug: string): Flour | undefined {
  return BY_SLUG.get(slug);
}

/** Throwing variant, for build-time code where a missing flour is a bug. */
export function requireFlour(slug: string): Flour {
  const f = BY_SLUG.get(slug);
  if (!f) throw new Error(`Unknown flour slug: ${slug}`);
  return f;
}

export function floursByCountry(country: Country): Flour[] {
  return FLOURS.filter((f) => f.country === country);
}

export function floursAvailableIn(country: Country): Flour[] {
  return FLOURS.filter(
    (f) => f.country === country || (f.availableIn ?? []).includes(country),
  );
}

export function floursBySpecies(species: Species): Flour[] {
  return FLOURS.filter((f) => f.species === species);
}

export const COUNTRIES: Country[] = [
  'NL', 'BE', 'FR', 'DE', 'IT', 'UK', 'ES', 'PL', 'DK', 'SE', 'US', 'CA', 'AU',
];

export const COUNTRY_NAMES: Record<Country, { nl: string; en: string }> = {
  NL: { nl: 'Nederland', en: 'Netherlands' },
  BE: { nl: 'België', en: 'Belgium' },
  FR: { nl: 'Frankrijk', en: 'France' },
  DE: { nl: 'Duitsland', en: 'Germany' },
  IT: { nl: 'Italië', en: 'Italy' },
  UK: { nl: 'Verenigd Koninkrijk', en: 'United Kingdom' },
  ES: { nl: 'Spanje', en: 'Spain' },
  PL: { nl: 'Polen', en: 'Poland' },
  DK: { nl: 'Denemarken', en: 'Denmark' },
  SE: { nl: 'Zweden', en: 'Sweden' },
  US: { nl: 'Verenigde Staten', en: 'United States' },
  CA: { nl: 'Canada', en: 'Canada' },
  AU: { nl: 'Australië', en: 'Australia' },
};

export const SPECIES_NAMES: Record<Species, { nl: string; en: string }> = {
  wheat: { nl: 'tarwe', en: 'wheat' },
  spelt: { nl: 'spelt', en: 'spelt' },
  emmer: { nl: 'emmer', en: 'emmer' },
  einkorn: { nl: 'eenkoorn', en: 'einkorn' },
  khorasan: { nl: 'khorasan', en: 'khorasan' },
  rye: { nl: 'rogge', en: 'rye' },
  durum: { nl: 'durum', en: 'durum' },
  barley: { nl: 'gerst', en: 'barley' },
  oat: { nl: 'haver', en: 'oat' },
  buckwheat: { nl: 'boekweit', en: 'buckwheat' },
};

/* ------------------------------------------------------------------ */
/* Role mapping                                                        */
/* ------------------------------------------------------------------ */

/**
 * Score how well a flour fits a recipe role. Recipes ask for roles, never for
 * brands — that is what lets one recipe work for a baker in Utrecht, Lyon and
 * Portland — so the shelf has to be mapped onto those roles somehow.
 *
 * Higher is better; -Infinity means the flour cannot serve the role at all.
 */
export function roleScore(flour: Flour, role: FlourRole): number {
  const wg = flour.wholegrain;
  switch (role) {
    case 'strong-white':
      if (flour.species !== 'wheat' || wg > 0.25) return -Infinity;
      return flour.strength - Math.abs(flour.strength - 80) * 0.5;
    case 'white':
      if (wg > 0.35) return -Infinity;
      if (flour.species === 'rye') return -Infinity;
      return 60 - Math.abs(flour.strength - 60);
    case 'wholegrain':
      if (flour.species === 'rye') return -Infinity;
      return wg * 100 - Math.abs(wg - 1) * 20;
    case 'rye':
      return flour.species === 'rye' ? 50 + wg * 50 : -Infinity;
    case 'durum':
      return flour.species === 'durum' ? 100 : -Infinity;
    case 'ancient':
      return ['spelt', 'einkorn', 'emmer', 'khorasan'].includes(flour.species)
        ? 100 - Math.abs(wg - 1) * 20
        : -Infinity;
  }
}

/** Best available flour for a role from a given shelf. */
export function bestForRole(shelf: Flour[], role: FlourRole): Flour | undefined {
  let best: Flour | undefined;
  let bestScore = -Infinity;
  for (const f of shelf) {
    const s = roleScore(f, role);
    if (s > bestScore) {
      bestScore = s;
      best = f;
    }
  }
  return bestScore === -Infinity ? undefined : best;
}

/** Map a whole shelf onto the roles a recipe asks for. */
export function mapShelfToRoles(
  shelf: Flour[],
  roles: FlourRole[],
): Partial<Record<FlourRole, Flour>> {
  const out: Partial<Record<FlourRole, Flour>> = {};
  for (const role of roles) {
    const f = bestForRole(shelf, role);
    if (f) out[role] = f;
  }
  return out;
}

/**
 * Flours whose behaviour is closest to a given one, for the "no X? try Y"
 * module on every flour page. Distance is weighted towards the properties that
 * actually change the bake.
 */
export function nearestFlours(target: Flour, limit = 6, sameCountryFirst = false): Flour[] {
  const scored = FLOURS.filter((f) => f.slug !== target.slug).map((f) => {
    const d =
      Math.abs(f.absorption - target.absorption) * 1.0 +
      Math.abs(f.strength - target.strength) * 0.25 +
      Math.abs(f.fermentSpeed - target.fermentSpeed) * 20 +
      (f.species === target.species ? 0 : 12) +
      (sameCountryFirst && f.country === target.country ? -4 : 0);
    return { flour: f, d };
  });
  scored.sort((a, b) => a.d - b.d);
  return scored.slice(0, limit).map((s) => s.flour);
}
