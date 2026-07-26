/**
 * Freshly milled flour — the time axis.
 *
 * The `home-stone` and `home-impact` mill types already carry the correct low
 * damaged-starch figures. What the base model lacks is *time*: flour milled
 * this morning behaves differently from the same flour three weeks later. Fresh
 * flour is more enzymatically active, takes up less water at first (the bran
 * has not had time to hydrate and the starch is intact), and its gluten needs
 * a few days to settle before it performs.
 *
 * Small, underserved, extremely high-intent audience — the people who buy a
 * mill also run the calibration protocol properly and write the blog posts.
 */

import type { LocalisedText } from './stages';
import { clamp, round } from './util';

export interface MillingState {
  /** Days since the flour was milled. 0 = this morning. */
  daysAgo: number;
  /** Fraction sifted out, 0 = whole, 0.15 ≈ a light bolt to ~85% extraction. */
  siftedFraction: number;
}

export interface MillingEffect {
  /** Points to add to absorption (negative for very fresh flour). */
  absorptionDelta: number;
  /** Multiplier on fermentSpeed — fresh flour is more active. */
  fermentFactor: number;
  /** Extraction after sifting, for display. */
  effectiveExtraction: number;
  note: LocalisedText;
}

/**
 * Fresh flour absorbs a couple of points less and ferments a little faster;
 * both effects fade over the first two to three weeks as the flour ages into
 * itself. Sifting removes bran, which lowers absorption and slows fermentation.
 */
export function millingEffect(state: MillingState): MillingEffect {
  const freshness = clamp(1 - state.daysAgo / 21, 0, 1); // 1 at day 0, 0 by day 21

  // Very fresh flour drinks less; by three weeks it has settled to its model value.
  const absorptionFromAge = -freshness * 2.5;
  // Sifting out bran removes water-hungry pentosans.
  const absorptionFromSift = -state.siftedFraction * 30;

  const fermentFromAge = 1 + freshness * 0.12;
  const fermentFromSift = 1 - state.siftedFraction * 0.6;

  return {
    absorptionDelta: round(absorptionFromAge + absorptionFromSift, 1),
    fermentFactor: round(fermentFromAge * fermentFromSift, 3),
    effectiveExtraction: round(100 - state.siftedFraction * 100, 0),
    note: describe(state, freshness),
  };
}

function describe(state: MillingState, freshness: number): LocalisedText {
  if (state.daysAgo <= 2) {
    return {
      nl: `Vers gemalen (${state.daysAgo === 0 ? 'vandaag' : state.daysAgo + ' dagen geleden'}). Tegen de verwachting in neemt vers meel juist mínder water op — de zemelen zijn nog niet gehydrateerd en het zetmeel is intact. Het is ook enzymatisch actiever, dus de bulk gaat sneller. Laat het meel een week rusten voor een lastig recept, of houd hier rekening met minder water en een kortere bulk.`,
      en: `Freshly milled (${state.daysAgo === 0 ? 'today' : state.daysAgo + ' days ago'}). Against expectation, fresh flour takes up *less* water — the bran has not hydrated and the starch is intact. It is also more enzymatically active, so the bulk runs faster. Rest the flour a week before a demanding recipe, or plan here for less water and a shorter bulk.`,
    };
  }
  if (freshness > 0) {
    return {
      nl: `${state.daysAgo} dagen oud: het meel is grotendeels tot rust gekomen maar nog net iets actiever en droger dan volledig gerijpt meel. Over ongeveer drie weken zit het op zijn modelwaarde.`,
      en: `${state.daysAgo} days old: the flour has mostly settled but is still a touch more active and drier than fully matured flour. By about three weeks it reaches its model value.`,
    };
  }
  return {
    nl: 'Gerijpt meel: de vers-gemalen effecten zijn uitgewerkt en de modelwaarden gelden zoals ze staan.',
    en: 'Matured flour: the fresh-milled effects have faded and the model values hold as written.',
  };
}
