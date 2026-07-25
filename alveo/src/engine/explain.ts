/**
 * "Where does the difference come from?"
 *
 * The engine tells you your dough wants 6 points less water than the book. That
 * is only useful if it can also tell you that 3.4 points of it are the milling,
 * 1.8 the species and 0.8 your own safety margin. The decomposition below is
 * exact: the contributions always sum to the total delta.
 */

import { absorptionBreakdown } from './absorption';
import { K_STRENGTH, STRENGTH_REFERENCE } from './constants';
import type { AbsorptionBreakdown, BlendProfile, GapExplanation } from './types';
import { round, sum } from './util';

type TermKey = keyof Omit<AbsorptionBreakdown, 'total'>;

const TERM_KEYS: TermKey[] = ['base', 'protein', 'bran', 'damagedStarch', 'hardness', 'additives', 'species'];

const LABELS: Record<TermKey | 'strength' | 'tier', { nl: string; en: string }> = {
  base: { nl: 'Basislijn', en: 'Baseline' },
  protein: { nl: 'Eiwitgehalte', en: 'Protein content' },
  bran: { nl: 'Zemelen en pentosanen', en: 'Bran and pentosans' },
  damagedStarch: { nl: 'Beschadigd zetmeel (maling)', en: 'Damaged starch (milling)' },
  hardness: { nl: 'Hardheid van de tarwe', en: 'Wheat hardness' },
  additives: { nl: 'Toevoegingen', en: 'Additives' },
  species: { nl: 'Graansoort', en: 'Grain species' },
  strength: { nl: 'Draagvermogen van de mix', en: "Blend's carrying capacity" },
  tier: { nl: 'Jouw veiligheidsmarge', en: 'Your safety margin' },
};

/** Flour-fraction-weighted absorption breakdown for a whole blend. */
export function blendBreakdown(blend: BlendProfile): AbsorptionBreakdown {
  const acc: AbsorptionBreakdown = {
    base: 0, protein: 0, bran: 0, damagedStarch: 0,
    hardness: 0, additives: 0, species: 0, total: 0,
  };

  for (const c of blend.components) {
    const b = absorptionBreakdown(c.flour);
    for (const k of TERM_KEYS) acc[k] += c.fraction * b[k];
    acc.total += c.fraction * b.total;
  }

  for (const k of TERM_KEYS) acc[k] = round(acc[k], 3);
  acc.total = round(acc.total, 3);
  return acc;
}

/**
 * Decompose the hydration delta between the author's flour and the user's.
 *
 * `tierPoints` is deliberately kept out of the physics list: the user chose it,
 * and conflating a choice with a measurement is exactly the kind of dishonesty
 * this product exists to avoid.
 */
export function explainGap(
  authorBlend: BlendProfile,
  userBlend: BlendProfile,
  tierPoints: number,
): GapExplanation {
  const a = blendBreakdown(authorBlend);
  const u = blendBreakdown(userBlend);

  const contributions: GapExplanation['contributions'] = [];

  for (const k of TERM_KEYS) {
    const points = round(u[k] - a[k], 2);
    if (Math.abs(points) < 0.05) continue;
    contributions.push({ key: k, points, label: LABELS[k] });
  }

  // The strength correction lives at blend level, not flour level.
  const strengthDelta = round(
    K_STRENGTH * (userBlend.strength - STRENGTH_REFERENCE) -
      K_STRENGTH * (authorBlend.strength - STRENGTH_REFERENCE),
    2,
  );
  if (Math.abs(strengthDelta) >= 0.05) {
    contributions.push({ key: 'strength', points: strengthDelta, label: LABELS.strength });
  }

  if (Math.abs(tierPoints) >= 0.05) {
    contributions.push({ key: 'tier', points: round(tierPoints, 2), label: LABELS.tier });
  }

  contributions.sort((x, y) => Math.abs(y.points) - Math.abs(x.points));

  return {
    totalDelta: round(sum(contributions.map((c) => c.points)), 2),
    contributions,
    tierPoints: round(tierPoints, 2),
  };
}

/**
 * Prose version, generated from the numbers rather than templated around them.
 * Used on `/vervangen/` pages, which is precisely where a thin-content guard
 * would otherwise catch us.
 */
export function explainGapProse(
  explanation: GapExplanation,
  locale: 'nl' | 'en',
): string {
  const physics = explanation.contributions.filter((c) => c.key !== 'tier');
  if (physics.length === 0) {
    return locale === 'nl'
      ? 'Deze twee melen gedragen zich vrijwel identiek: het verschil in wateropname is kleiner dan de meetonzekerheid.'
      : 'These two flours behave almost identically: the difference in water uptake is smaller than the measurement uncertainty.';
  }

  const total = round(sum(physics.map((c) => c.points)), 1);
  const first = physics[0];
  if (!first) return '';
  const second = physics[1];

  const dir = (n: number) =>
    locale === 'nl' ? (n > 0 ? 'meer' : 'minder') : n > 0 ? 'more' : 'less';

  const parts: string[] = [];

  if (locale === 'nl') {
    parts.push(
      `Onder de streep vraagt deze mix ${Math.abs(total)} punt${Math.abs(total) === 1 ? '' : 'en'} ${dir(total)} water.`,
    );
    parts.push(
      `De grootste oorzaak is ${first.label.nl.toLowerCase()}: goed voor ${Math.abs(first.points)} punt${Math.abs(first.points) === 1 ? '' : 'en'} ${dir(first.points)}.`,
    );
    if (second) {
      parts.push(
        `Daarna komt ${second.label.nl.toLowerCase()} met ${Math.abs(second.points)} punt${Math.abs(second.points) === 1 ? '' : 'en'} ${dir(second.points)}.`,
      );
    }
    if (explanation.tierPoints !== 0) {
      parts.push(
        `Daar bovenop komt ${Math.abs(explanation.tierPoints)} punt aan zelfgekozen veiligheidsmarge — dat is een keuze, geen eigenschap van het meel.`,
      );
    }
  } else {
    parts.push(
      `On balance this blend wants ${Math.abs(total)} point${Math.abs(total) === 1 ? '' : 's'} ${dir(total)} water.`,
    );
    parts.push(
      `The largest single cause is ${first.label.en.toLowerCase()}, worth ${Math.abs(first.points)} point${Math.abs(first.points) === 1 ? '' : 's'} ${dir(first.points)}.`,
    );
    if (second) {
      parts.push(
        `Next comes ${second.label.en.toLowerCase()} at ${Math.abs(second.points)} point${Math.abs(second.points) === 1 ? '' : 's'} ${dir(second.points)}.`,
      );
    }
    if (explanation.tierPoints !== 0) {
      parts.push(
        `On top of that sits ${Math.abs(explanation.tierPoints)} point${Math.abs(explanation.tierPoints) === 1 ? '' : 's'} of safety margin you chose yourself — a decision, not a property of the flour.`,
      );
    }
  }

  return parts.join(' ');
}
