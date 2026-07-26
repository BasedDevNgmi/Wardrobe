'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { fermentationModes, MODE_LABELS, yeastDoseGrams } from '@/engine';
import type { Recipe } from '@/engine/types';
import type { FermentationMode } from '@/engine/fermentation-mode';
import type { Locale } from '@/i18n/routing';

export function FermentationModes({
  recipe,
  totalFlour,
  doughTemp,
  locale,
}: {
  recipe: Recipe;
  totalFlour: number;
  doughTemp: number;
  locale: Locale;
}) {
  const nl = locale === 'nl';
  const modes = useMemo(() => fermentationModes(recipe), [recipe]);
  const [active, setActive] = useState<FermentationMode>('pure-levain');
  const plan = modes.find((m) => m.mode === active) ?? modes[0]!;
  const yeast = yeastDoseGrams(plan, totalFlour, doughTemp);

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {modes.map((m) => (
          <button
            key={m.mode}
            type="button"
            aria-pressed={active === m.mode}
            onClick={() => setActive(m.mode)}
            className={clsx(
              'border px-3 py-2.5 text-left',
              active === m.mode ? 'border-accent bg-accentSoft' : 'border-rule hover:border-ruleStrong',
            )}
          >
            <span className="block text-sm font-medium">{MODE_LABELS[m.mode][locale]}</span>
            <span className="block font-mono text-[0.68rem] text-faint tnum">
              ~{m.totalHours} {nl ? 'uur' : 'h'}
              {m.instantYeastPct > 0 ? ` · ${m.instantYeastPct}% ${nl ? 'gist' : 'yeast'}` : ''}
            </span>
          </button>
        ))}
      </div>

      <div className="border border-rule bg-raised p-4">
        <p className="text-sm prose-measure">{plan.summary[locale]}</p>
        {yeast > 0 ? (
          <p className="mt-2 font-mono text-sm tnum text-accent">
            {nl ? 'Instantgist' : 'Instant yeast'}: {yeast} g
            <span className="text-faint"> ({nl ? `bij ${doughTemp} °C, voor ${totalFlour} g bloem` : `at ${doughTemp} °C, for ${totalFlour} g flour`})</span>
          </p>
        ) : null}
        <p className="mt-2 text-[0.82rem] text-soft prose-measure">
          <span className="label mr-1">{nl ? 'Afweging' : 'Trade-off'}</span>
          {plan.tradeoff[locale]}
        </p>
      </div>
    </div>
  );
}
