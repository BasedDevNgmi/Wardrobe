import { FLOURS, nearestFlours } from '@/data/flours';

/**
 * Which substitution pages to prerender.
 *
 * All 131 × 130 ordered pairs would be seventeen thousand pages, most of them
 * nobody's question, and a build that long is its own kind of bug. We prerender
 * the pairs people actually search for:
 *
 *   1. every flour against its five nearest behavioural neighbours — the
 *      "what can I use instead" question;
 *   2. every cross-system pairing between the reference grades — the
 *      "what is the German equivalent of T65" question, which is where the
 *      links come from.
 *
 * Everything else renders on demand and caches.
 */

/** The grade in each system that people actually reach for. */
const REFERENCE_GRADES = [
  'fr-t55', 'fr-t65', 'fr-t80', 'fr-t150',
  'de-550', 'de-1050', 'de-weizenvollkorn', 'de-roggenvollkorn',
  'it-00-pizza', 'it-1', 'it-semola-rimacinata',
  'us-ap-flour', 'us-bread-flour', 'us-whole-wheat',
  'ca-strong-bakers',
  'uk-strong-white', 'uk-plain-flour', 'uk-stoneground-wholemeal',
  'nl-patentbloem', 'nl-tarwebloem', 'nl-bakkersbloem', 'nl-volkorenmeel',
  'es-harina-fuerza', 'pl-typ-650', 'dk-rugmel', 'se-vetemjol-special',
  'au-bakers-flour', 'be-bloem-t55',
];

function build(): string[] {
  const pairs = new Set<string>();

  // Cross-system reference grid.
  for (const a of REFERENCE_GRADES) {
    for (const b of REFERENCE_GRADES) {
      if (a !== b) pairs.add(`${a}-vs-${b}`);
    }
  }

  // Each flour against its nearest neighbours.
  for (const f of FLOURS) {
    for (const n of nearestFlours(f, 5)) {
      pairs.add(`${f.slug}-vs-${n.slug}`);
    }
  }

  return [...pairs];
}

export const SUBSTITUTION_PAIRS = build();

/** A curated shortlist for the index page, highest-intent first. */
export const FEATURED_PAIRS = [
  'fr-t65-vs-us-bread-flour',
  'us-bread-flour-vs-fr-t65',
  'de-550-vs-fr-t55',
  'us-ap-flour-vs-nl-patentbloem',
  'uk-strong-white-vs-fr-t65',
  'it-00-pizza-vs-fr-t55',
  'us-whole-wheat-vs-de-weizenvollkorn',
  'nl-volkorenmeel-vs-nl-volkoren-steengemalen',
  'de-weizenvollkorn-vs-de-dinkelvollkorn',
  'ca-strong-bakers-vs-au-bakers-flour',
  'fr-t65-vs-de-550',
  'us-bread-flour-vs-nl-bakkersbloem',
];
