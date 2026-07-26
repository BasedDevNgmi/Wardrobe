/**
 * Yeast-hybrid and same-day modes.
 *
 * A large slice of the audience wants sourdough flavour on a weeknight, or is
 * starterless and not ready to commit. Both variants generate from parameters
 * the engine already holds — inoculation rate and timing — so a single recipe
 * yields three schedules: pure levain, hybrid (levain + a little instant
 * yeast), and same-day (a preferment plus yeast).
 *
 * The honesty rule applies here as everywhere: each mode states the trade in
 * flavour and keeping quality rather than pretending they are equivalent.
 */

import type { LocalisedText } from './stages';
import type { Recipe } from './types';
import { round } from './util';

export type FermentationMode = 'pure-levain' | 'hybrid' | 'same-day';

export const FERMENTATION_MODES: FermentationMode[] = ['pure-levain', 'hybrid', 'same-day'];

export const MODE_LABELS: Record<FermentationMode, LocalisedText> = {
  'pure-levain': { nl: 'Pure desem', en: 'Pure levain' },
  hybrid: { nl: 'Hybride (desem + gist)', en: 'Hybrid (levain + yeast)' },
  'same-day': { nl: 'Zelfde dag', en: 'Same day' },
};

export interface ModePlan {
  mode: FermentationMode;
  /** Instant yeast as a percentage of total flour. Zero for pure levain. */
  instantYeastPct: number;
  /** Multiplier on the recipe's total time. */
  timeFactor: number;
  /** Approximate total hours, from the recipe's own figure. */
  totalHours: number;
  summary: LocalisedText;
  tradeoff: LocalisedText;
}

/**
 * The three modes for a given recipe.
 *
 * Instant-yeast doses are deliberately small in the hybrid — the levain still
 * does most of the flavour work, the yeast just guarantees lift and compresses
 * the timeline. The same-day mode leans harder on yeast because there is no
 * overnight window for the bacteria to develop acid.
 */
export function fermentationModes(recipe: Recipe): ModePlan[] {
  const base = recipe.totalHours;

  return [
    {
      mode: 'pure-levain',
      instantYeastPct: 0,
      timeFactor: 1,
      totalHours: base,
      summary: {
        nl: 'Het recept zoals bedoeld: alleen wilde gist en bacteriën uit je desem. De volledige tijd, de volledige smaak.',
        en: 'The recipe as intended: only the wild yeast and bacteria from your levain. The full time, the full flavour.',
      },
      tradeoff: {
        nl: 'Geen compromis — dit is de referentie. Wel de langste weg en het meest afhankelijk van een gezonde desem.',
        en: 'No compromise — this is the reference. Also the longest route and the most dependent on a healthy levain.',
      },
    },
    {
      mode: 'hybrid',
      instantYeastPct: 0.2,
      timeFactor: 0.62,
      totalHours: round(base * 0.62, 0),
      summary: {
        nl: 'Je desem plus een klein beetje instantgist (0,2% van de bloem). De desem doet het smaakwerk, de gist garandeert de lift en kort de bulk fors in.',
        en: 'Your levain plus a little instant yeast (0.2% of the flour). The levain does the flavour work, the yeast guarantees lift and cuts the bulk considerably.',
      },
      tradeoff: {
        nl: 'Iets minder complexe smaak en iets kortere houdbaarheid dan pure desem, maar betrouwbaar en fors sneller. De weekavond-oplossing.',
        en: 'A little less complex flavour and slightly shorter keeping than pure levain, but reliable and much faster. The weeknight answer.',
      },
    },
    {
      mode: 'same-day',
      instantYeastPct: 0.6,
      timeFactor: 0.3,
      totalHours: round(base * 0.3, 0),
      summary: {
        nl: 'Van meel naar brood in één dag. Een voorferment op basis van gist vervangt de overnachtdesem; reken op vier tot zes uur in plaats van een etmaal.',
        en: 'Flour to bread in a single day. A yeast-based preferment stands in for the overnight levain; expect four to six hours instead of a full day.',
      },
      tradeoff: {
        nl: 'Merkbaar minder zuurontwikkeling en een brood dat sneller oudbakken wordt — er is geen nacht waarin de bacteriën smaak konden opbouwen. Voor als je vandaag brood nodig hebt en geen rijpe desem hebt.',
        en: 'Noticeably less acid development and a loaf that stales faster — there is no night in which the bacteria could build flavour. For when you need bread today and have no ripe levain.',
      },
    },
  ];
}

/**
 * Instant-yeast dose adjusted for temperature. Yeast activity roughly doubles
 * per 8–10 °C, so a cold kitchen needs a touch more to hit the same timeline.
 */
export function yeastDoseGrams(
  plan: ModePlan,
  totalFlourGrams: number,
  doughTemp: number,
): number {
  if (plan.instantYeastPct === 0) return 0;
  const tempAdjust = Math.pow(2, (22 - doughTemp) / 9);
  return round((totalFlourGrams * plan.instantYeastPct / 100) * tempAdjust, 2);
}
