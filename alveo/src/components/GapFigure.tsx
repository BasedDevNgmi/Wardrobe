/**
 * The gap decomposition figure.
 *
 * This is the one claim the whole site rests on, so it is rendered as evidence
 * rather than as a headline: the total hydration difference between two flours,
 * broken into the physical drivers that produce it, computed at build time by
 * the same engine the calculator runs.
 *
 * Design notes, since a figure this load-bearing should not be improvised:
 *
 * - **One linear scale across zero.** Positive and negative contributions share
 *   a single points-per-width ratio, so a bar twice as long is twice the
 *   effect. The zero rule sits proportionally, not at a convenient fraction.
 * - **One hue, direction carries sign.** A second hue for negatives would have
 *   to come from the status palette, and amber reads as "something is wrong"
 *   when it only means "this driver pulls the other way". Instead the bar
 *   crosses the zero rule and the signed number is printed.
 * - **Colour is never the only encoding.** Every row carries its name and its
 *   signed value as text; the bar is redundant and marked aria-hidden.
 */

import type { GapExplanation } from '@/engine/types';
import type { Locale } from '@/i18n/routing';

export function GapFigure({
  explanation,
  locale,
}: {
  explanation: GapExplanation;
  locale: Locale;
}) {
  const rows = explanation.contributions.filter((c) => Math.abs(c.points) >= 0.05);

  const maxPos = Math.max(0, ...rows.map((r) => r.points));
  const maxNeg = Math.max(0, ...rows.map((r) => -r.points));
  const span = maxPos + maxNeg || 1;
  const zeroAt = (maxNeg / span) * 100;

  return (
    <div className="grid gap-1.5">
      {rows.map((c) => {
        const positive = c.points >= 0;
        const width = (Math.abs(c.points) / span) * 100;
        const signed = `${c.points > 0 ? '+' : ''}${c.points.toFixed(2)}`;
        return (
          <div
            key={c.key}
            className="grid grid-cols-[1fr_auto] sm:grid-cols-[11rem_1fr_3.5rem] items-center gap-x-3 gap-y-1"
            title={`${c.label[locale]}: ${signed} ${locale === 'nl' ? 'punten' : 'points'}`}
          >
            <span className="text-[0.82rem] text-soft leading-snug">{c.label[locale]}</span>

            {/* The track. Redundant with the printed value, so hidden from AT. */}
            <span
              aria-hidden="true"
              className="relative h-[9px] hidden sm:block bg-sunk order-2 sm:order-none"
            >
              {/* zero rule */}
              <span
                className="absolute inset-y-[-3px] w-px bg-ruleStrong"
                style={{ left: `${zeroAt}%` }}
              />
              <span
                className={
                  positive
                    ? 'absolute inset-y-0 bg-accent rounded-r-[3px]'
                    : 'absolute inset-y-0 bg-accent/45 rounded-l-[3px]'
                }
                style={
                  positive
                    ? { left: `${zeroAt}%`, width: `${width}%` }
                    : { left: `${zeroAt - width}%`, width: `${width}%` }
                }
              />
            </span>

            <span className="font-mono text-[0.76rem] tnum text-right text-ink">{signed}</span>
          </div>
        );
      })}

      <div className="mt-1.5 pt-2 border-t border-rule grid grid-cols-[1fr_auto] sm:grid-cols-[11rem_1fr_3.5rem] items-baseline gap-x-3">
        <span className="label">{locale === 'nl' ? 'Totaal' : 'Total'}</span>
        <span className="hidden sm:block" />
        <span className="font-mono text-[0.78rem] tnum text-right font-medium text-accent">
          {explanation.totalDelta > 0 ? '+' : ''}
          {explanation.totalDelta.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
