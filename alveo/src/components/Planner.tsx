'use client';

/**
 * The timeline planner.
 *
 * "Bread out of the oven at 09:00 on Saturday" → a wall-clock schedule for
 * every step, worked backwards — with the part that actually matters: naming
 * the steps that land at antisocial hours and offering a real fix (a stiffer
 * levain, a cooler bulk, a halved inoculation) instead of an alarm at 02:40.
 */

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  formatClock, formatDuration, isAntisocial, planBackwards, planForwards, toIcs,
} from '@/engine';
import type { BakeResult } from '@/engine/types';
import type { Locale } from '@/i18n/routing';

function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nextSaturdayNine(): Date {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  d.setHours(9, 0, 0, 0);
  return d;
}

export function Planner({ result, locale }: { result: BakeResult; locale: Locale }) {
  const nl = locale === 'nl';
  const [mode, setMode] = useState<'backwards' | 'forwards'>('backwards');
  const [anchor, setAnchor] = useState(() => toLocalInputValue(nextSaturdayNine()));

  const plan = useMemo(() => {
    const date = new Date(anchor);
    if (Number.isNaN(date.getTime())) return null;
    return mode === 'backwards' ? planBackwards(result, date) : planForwards(result, date);
  }, [result, anchor, mode]);

  if (!plan) return null;

  const downloadIcs = () => {
    const ics = toIcs(plan, {
      title: result.recipe.title[locale],
      locale,
      uidPrefix: result.recipe.slug,
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.recipe.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="grid gap-4" aria-label={nl ? 'Tijdlijnplanner' : 'Timeline planner'}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1">
          <span className="label">
            {mode === 'backwards'
              ? nl ? 'Brood uit de oven om' : 'Bread out of the oven at'
              : nl ? 'Beginnen om' : 'Start at'}
          </span>
          <input
            type="datetime-local"
            className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm font-mono"
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
          />
        </div>
        <div className="flex border border-rule">
          {(['backwards', 'forwards'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                'px-3 py-2 text-sm',
                mode === m ? 'bg-accentSoft text-accent' : 'text-soft hover:bg-raised',
              )}
            >
              {m === 'backwards' ? (nl ? 'Terugrekenen' : 'Work backwards') : (nl ? 'Vooruit' : 'Forwards')}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={downloadIcs}
          className="border border-accent text-accent px-3 py-2 text-sm hover:bg-accentSoft"
        >
          {nl ? 'Agenda-export (.ics)' : 'Calendar export (.ics)'}
        </button>
      </div>

      {plan.antisocialCount > 0 ? (
        <div className="bg-raised border-l-[3px] border-warn px-4 py-3">
          <p className="text-sm font-medium">
            {nl
              ? `${plan.antisocialCount} stap${plan.antisocialCount === 1 ? ' valt' : 'pen vallen'} tussen 23:00 en 06:00.`
              : `${plan.antisocialCount} step${plan.antisocialCount === 1 ? ' lands' : 's land'} between 23:00 and 06:00.`}
          </p>
          <ul className="mt-2 grid gap-2">
            {plan.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-soft prose-measure">{s[locale]}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-ok">
          {nl
            ? 'Alle actieve stappen vallen op menselijke tijden.'
            : 'Every hands-on step lands at a humane hour.'}
        </p>
      )}

      <ol className="grid gap-0">
        {plan.steps.map((p, i) => (
          <li
            key={p.step.id + i}
            className={clsx(
              'grid grid-cols-[8.5rem_1fr] gap-3 border-b border-rule py-2.5',
              !p.handsOn && 'opacity-60',
            )}
          >
            <div className="font-mono text-[0.78rem] tnum">
              <span className={clsx(p.antisocial ? 'text-warn font-medium' : 'text-ink')}>
                {formatClock(p.start, locale)}
              </span>
              {p.step.minutes > 0 ? (
                <span className="block text-faint">{formatDuration(p.step.minutes, locale)}</span>
              ) : null}
            </div>
            <div>
              <span className="font-medium">{p.step.title[locale]}</span>
              {p.handsOn ? (
                <span className="ml-2 chip text-accent">{nl ? 'handwerk' : 'hands-on'}</span>
              ) : (
                <span className="ml-2 chip text-faint">{nl ? 'wachten' : 'waiting'}</span>
              )}
              {p.antisocial ? (
                <span className="ml-2 chip text-warn">{isAntisocial(p.start) ? '23:00–06:00' : ''}</span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="font-mono text-[0.72rem] text-faint tnum">
        {nl ? 'Totaal' : 'Total'}: {formatDuration(plan.totalMinutes, locale)} ·{' '}
        {formatClock(plan.start, locale)} → {formatClock(plan.finish, locale)}
      </p>
    </section>
  );
}
