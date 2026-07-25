/**
 * Calibration — the retention feature and, per §13 of the brief, the whole
 * defensible asset.
 *
 * Protocol: 100 g of a single flour, water added in 5 g steps, stopping at the
 * point where the dough stops taking it up. That measurement overrides the
 * model for that user immediately, and once enough independent submissions
 * agree, it upgrades the global record from `estimated` to `measured`.
 */

import type { Confidence, Flour } from './types';
import { clamp, round } from './util';

export interface CalibrationSubmission {
  flourSlug: string;
  userId: string;
  /** Grams of flour used. The protocol says 100 but people improvise. */
  flourGrams: number;
  /** Grams of water absorbed at the stopping point. */
  waterGrams: number;
  doughTemp?: number;
  method: 'pinch' | 'stand-mixer' | 'hand-knead';
  createdAt: string;
  notes?: string;
}

export interface CalibrationResult {
  /** Absorption implied by this measurement, %. */
  absorption: number;
  /** The model's prediction, for comparison. */
  predicted: number;
  delta: number;
  /** Whether the measurement is plausible enough to keep. */
  accepted: boolean;
  rejectReason?: string;
}

/** How many independent, agreeing submissions before we promote a flour. */
export const CONSENSUS_THRESHOLD = 5;
/** Submissions further than this from the median are treated as outliers. */
export const OUTLIER_POINTS = 6;
/** Above this spread we do not claim consensus, however many submissions. */
export const MAX_CONSENSUS_SPREAD = 5;

/**
 * A single submission → an absorption figure.
 *
 * The hand-kneading method reliably reads a few points low: people stop when
 * the dough stops feeling wet, which is before it stops absorbing. Correct for
 * it rather than pretending all protocols are equal.
 */
const METHOD_CORRECTION: Record<CalibrationSubmission['method'], number> = {
  pinch: 0,
  'hand-knead': 1.5,
  'stand-mixer': 0.5,
};

export function evaluateSubmission(
  submission: CalibrationSubmission,
  flour: Flour,
): CalibrationResult {
  const predicted = flour.absorption;

  if (submission.flourGrams < 20) {
    return {
      absorption: 0, predicted, delta: 0, accepted: false,
      rejectReason: 'flour-too-little',
    };
  }

  const raw = (submission.waterGrams / submission.flourGrams) * 100;
  const absorption = round(raw + METHOD_CORRECTION[submission.method], 1);
  const delta = round(absorption - predicted, 1);

  if (absorption < 40 || absorption > 130) {
    return { absorption, predicted, delta, accepted: false, rejectReason: 'implausible-value' };
  }
  if (Math.abs(delta) > 20) {
    return { absorption, predicted, delta, accepted: false, rejectReason: 'far-from-model' };
  }

  return { absorption, predicted, delta, accepted: true };
}

export interface ConsensusResult {
  /** Consensus absorption, or null if there is not enough agreement. */
  absorption: number | null;
  median: number;
  spread: number;
  accepted: number;
  outliers: number;
  confidence: Confidence;
  /** Human-readable statement of what we actually know. */
  statement: { nl: string; en: string };
}

/**
 * Aggregate submissions into a consensus. Median rather than mean: one baker
 * who mistyped 1000 g of water should not move a published number.
 */
export function consensus(values: number[], current: Confidence): ConsensusResult {
  const sorted = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return {
      absorption: null, median: 0, spread: 0, accepted: 0, outliers: 0,
      confidence: current,
      statement: {
        nl: 'Nog geen metingen. De waarde hieronder komt volledig uit het model.',
        en: 'No measurements yet. The value below comes entirely from the model.',
      },
    };
  }

  const median = medianOf(sorted);
  const kept = sorted.filter((v) => Math.abs(v - median) <= OUTLIER_POINTS);
  const outliers = sorted.length - kept.length;
  const spread = kept.length > 1 ? round((kept.at(-1) as number) - (kept[0] as number), 1) : 0;

  const enough = kept.length >= CONSENSUS_THRESHOLD && spread <= MAX_CONSENSUS_SPREAD;
  const absorption = enough ? round(medianOf(kept), 1) : null;

  return {
    absorption,
    median: round(median, 1),
    spread,
    accepted: kept.length,
    outliers,
    confidence: enough ? 'measured' : current,
    statement: enough
      ? {
          nl: `${kept.length} onafhankelijke metingen, spreiding ${spread} punten. Dit getal is gemeten, niet geschat.`,
          en: `${kept.length} independent measurements, spread ${spread} points. This number is measured, not estimated.`,
        }
      : {
          nl: `${kept.length} meting${kept.length === 1 ? '' : 'en'} tot nu toe — we hebben er ${CONSENSUS_THRESHOLD} nodig met minder dan ${MAX_CONSENSUS_SPREAD} punten spreiding voordat we dit "gemeten" durven noemen.`,
          en: `${kept.length} measurement${kept.length === 1 ? '' : 's'} so far — we need ${CONSENSUS_THRESHOLD} within ${MAX_CONSENSUS_SPREAD} points of each other before calling this "measured".`,
        },
  };
}

/** The five-step protocol, rendered by the calibration UI. */
export const CALIBRATION_PROTOCOL: { nl: string; en: string }[] = [
  {
    nl: 'Weeg 100 g van één meelsoort af. Niet mengen — dit meet één zak.',
    en: 'Weigh out 100 g of a single flour. No blending — this measures one bag.',
  },
  {
    nl: 'Voeg 55 g water van kamertemperatuur toe en meng tot er geen droog meel meer over is.',
    en: 'Add 55 g of room-temperature water and mix until no dry flour remains.',
  },
  {
    nl: 'Voeg water toe in stappen van 5 g. Meng na elke stap een halve minuut door.',
    en: 'Add water in 5 g steps. Mix for half a minute after each one.',
  },
  {
    nl: 'Stop op het punt waarop het deeg het water niet meer opneemt: het blijft glimmen en plakt aan de kom in plaats van aan zichzelf.',
    en: 'Stop at the point where the dough no longer takes the water up: it stays glossy and sticks to the bowl rather than to itself.',
  },
  {
    nl: 'Noteer het totale water. Dat getal gedeeld door 100, maal 100, is jouw wateropname voor dit meel.',
    en: 'Note the total water. That figure divided by 100, times 100, is your absorption for this flour.',
  },
];

/**
 * Blend a user's own measurements into their personal copy of a flour. This is
 * what makes the site get better the more you use it.
 */
export function applyPersonalCalibration(flour: Flour, measurements: number[]): Flour {
  const usable = measurements.filter((v) => Number.isFinite(v) && v > 40 && v < 130);
  if (usable.length === 0) return flour;
  const value = round(medianOf([...usable].sort((a, b) => a - b)), 1);
  return {
    ...flour,
    absorption: clamp(value, 40, 130),
    confidence: 'measured',
    sourceNote: `Jouw eigen meting (${usable.length}×)`,
  };
}

function medianOf(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] as number;
  return (((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2);
}
