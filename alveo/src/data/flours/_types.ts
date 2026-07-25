import type { FlourInput } from '@/engine/types';

/**
 * Declaration helper for the flour database.
 *
 * A note on honesty, because it is the whole product (§13 of the brief):
 *
 * Almost every record here is marked `estimated`. That is deliberate. Ash bands
 * for the French T-, German Type-, Italian tipo- and Polish typ- systems are
 * defined in law and are therefore facts; protein, hardness and milling for a
 * specific bag are *typical values for that class of flour*, not readings off a
 * spec sheet we hold. Marking those `spec-sheet` would be claiming a precision
 * we have not earned, and the moment a baker catches us at it we lose the one
 * thing that makes the calibration loop work.
 *
 * A record moves to `spec-sheet` when a miller's published data sheet is on
 * file with a URL in `sourceNote`, and to `measured` when five independent
 * calibration submissions agree within five points.
 */
export type FlourDecl = Omit<FlourInput, 'absorption' | 'strength' | 'fermentSpeed'>;

export const DEFAULTS = {
  proteinBasis: 'as-sold' as const,
  additives: ['none' as const],
  confidence: 'estimated' as const,
};

/** Terse declaration with sane defaults so the country files stay readable. */
export function decl(x: Partial<FlourDecl> & Pick<FlourDecl, 'slug' | 'name' | 'country' | 'system' | 'protein' | 'species' | 'wholegrain' | 'mill' | 'hardness'>): FlourDecl {
  return {
    proteinBasis: DEFAULTS.proteinBasis,
    additives: DEFAULTS.additives,
    confidence: DEFAULTS.confidence,
    ...x,
  } as FlourDecl;
}
