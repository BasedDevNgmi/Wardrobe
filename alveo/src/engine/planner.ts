/**
 * Timeline planner.
 *
 * "Bread out of the oven at 09:00 on Saturday" → a wall-clock schedule for
 * every step, worked backwards. Plus the bit that actually matters: flagging
 * the steps that land at antisocial hours, and offering a real fix rather than
 * telling you to set an alarm for 02:40.
 */

import type { BakeResult, TimedStep } from './types';
import { addMinutes, round } from './util';

export interface PlannedStep {
  step: TimedStep;
  start: Date;
  end: Date;
  /** True when this step needs you awake and present. */
  handsOn: boolean;
  antisocial: boolean;
}

export interface Plan {
  steps: PlannedStep[];
  start: Date;
  finish: Date;
  totalMinutes: number;
  antisocialCount: number;
  suggestions: { nl: string; en: string }[];
}

const HANDS_ON_KINDS = new Set([
  'levain', 'mix', 'bassinage', 'fold', 'preshape', 'shape',
  'score', 'bake', 'lamination', 'soaker',
]);

/** Anything that wakes you between these hours is a problem, not a schedule. */
export const ANTISOCIAL_START = 23;
export const ANTISOCIAL_END = 6;

export function isAntisocial(d: Date): boolean {
  const h = d.getHours();
  return h >= ANTISOCIAL_START || h < ANTISOCIAL_END;
}

/** Plan backwards from the moment the bread comes out of the oven. */
export function planBackwards(result: BakeResult, outOfOven: Date): Plan {
  const total = result.steps.reduce((s, x) => s + x.minutes, 0);
  const start = addMinutes(outOfOven, -total);
  return planForwards(result, start);
}

/** Plan forwards from the moment you start feeding the levain. */
export function planForwards(result: BakeResult, startAt: Date): Plan {
  let cursor = new Date(startAt.getTime());
  const steps: PlannedStep[] = [];

  for (const step of result.steps) {
    const stepStart = new Date(cursor.getTime());
    const stepEnd = addMinutes(stepStart, step.minutes);
    const handsOn = HANDS_ON_KINDS.has(step.kind);
    steps.push({
      step,
      start: stepStart,
      end: stepEnd,
      handsOn,
      antisocial: handsOn && isAntisocial(stepStart),
    });
    cursor = stepEnd;
  }

  const antisocialCount = steps.filter((s) => s.antisocial).length;

  return {
    steps,
    start: startAt,
    finish: cursor,
    totalMinutes: round(
      (cursor.getTime() - startAt.getTime()) / 60_000,
      0,
    ),
    antisocialCount,
    suggestions: suggestionsFor(steps, result),
  };
}

/**
 * The fixes. Each one is a real change to the bake, not a euphemism for
 * "get up at three".
 */
function suggestionsFor(steps: PlannedStep[], result: BakeResult): { nl: string; en: string }[] {
  const out: { nl: string; en: string }[] = [];
  const bad = steps.filter((s) => s.antisocial);
  if (bad.length === 0) return out;

  const levain = bad.find((s) => s.step.kind === 'levain');
  if (levain) {
    const hh = String(levain.start.getHours()).padStart(2, '0');
    const mm = String(levain.start.getMinutes()).padStart(2, '0');
    out.push({
      nl: `Je desem wil gevoerd worden om ${hh}:${mm}. Gebruik een stijve desem (50–60% hydratatie) op 1:5:2,5 — die doet er ongeveer vier uur langer over en schuift dit moment naar de vorige avond.`,
      en: `Your levain wants feeding at ${hh}:${mm}. Use a stiff levain (50–60% hydration) at 1:5:2.5 — it takes roughly four hours longer and shifts this to the previous evening.`,
    });
  }

  const shaping = bad.find((s) => s.step.kind === 'shape' || s.step.kind === 'preshape');
  if (shaping) {
    out.push({
      nl: 'Vorm de avond ervoor en zet het brood direct in de koelkast. Een langere koude rijs (tot 18 uur) kost je hier niets en levert meer smaak op.',
      en: 'Shape the evening before and put the loaf straight into the fridge. A longer cold proof (up to 18 hours) costs you nothing here and buys you more flavour.',
    });
  }

  const bulkAtNight = bad.find((s) => s.step.kind === 'fold' || s.step.kind === 'mix');
  if (bulkAtNight) {
    out.push({
      nl: `Verlaag de deegtemperatuur naar 20 °C: de bulk wordt dan ongeveer ${Math.round((Math.pow(2.4, 4 / 10) - 1) * 100)}% langer en past wél in je avond.`,
      en: `Drop the dough temperature to 20 °C: bulk stretches by roughly ${Math.round((Math.pow(2.4, 4 / 10) - 1) * 100)}% and then does fit into your evening.`,
    });
  }

  if (result.recipe.prefermentedFlour > 8) {
    out.push({
      nl: `Halveer de desem naar ${round(result.recipe.prefermentedFlour / 2, 1)}% voorgefermenteerde bloem. Dat verlengt de bulk met ongeveer 60% en verplaatst het hele schema naar een normaal uur.`,
      en: `Halve the levain to ${round(result.recipe.prefermentedFlour / 2, 1)}% prefermented flour. That lengthens bulk by roughly 60% and moves the whole schedule into normal hours.`,
    });
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* Calendar export                                                     */
/* ------------------------------------------------------------------ */

function icsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours(),
  )}${pad(d.getUTCMinutes())}00Z`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * `.ics` export. Only hands-on steps become events — nobody wants a four-hour
 * "waiting" block on their calendar.
 */
export function toIcs(
  plan: Plan,
  opts: { title: string; locale: 'nl' | 'en'; uidPrefix?: string; includeWaits?: boolean },
): string {
  const prefix = opts.uidPrefix ?? 'alveo';
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alveo//Sourdough Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  plan.steps.forEach((p, i) => {
    if (!p.handsOn && !opts.includeWaits) return;
    const title = p.step.title[opts.locale];
    lines.push(
      'BEGIN:VEVENT',
      `UID:${prefix}-${i}-${p.start.getTime()}@alveo`,
      `DTSTAMP:${icsDate(plan.start)}`,
      `DTSTART:${icsDate(p.start)}`,
      `DTEND:${icsDate(addMinutes(p.start, Math.max(p.step.minutes, 10)))}`,
      `SUMMARY:${escapeIcs(`${opts.title} — ${title}`)}`,
      `DESCRIPTION:${escapeIcs(p.step.body[opts.locale])}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT5M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcs(title)}`,
      'END:VALARM',
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');
  // RFC 5545 wants CRLF.
  return lines.join('\r\n');
}
