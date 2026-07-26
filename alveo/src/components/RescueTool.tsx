'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  rescue, SITUATION_LABELS, STAGE_LABELS,
  type BakeStage, type Situation,
} from '@/engine';
import type { Locale } from '@/i18n/routing';

const SITUATIONS: Situation[] = [
  'must-sleep', 'must-leave', 'levain-not-ready', 'over-proofed', 'under-proofed', 'too-slack',
];
const STAGES: BakeStage[] = [
  'levain-building', 'bulk', 'shaped-waiting', 'cold-proofing', 'ready-to-bake',
];

export function RescueTool({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [situation, setSituation] = useState<Situation | null>(null);
  const [stage, setStage] = useState<BakeStage>('bulk');

  const advice = useMemo(
    () => (situation ? rescue(situation, stage) : null),
    [situation, stage],
  );

  return (
    <div className="grid gap-6">
      <fieldset>
        <legend className="label mb-2">{nl ? 'Wat is er aan de hand?' : 'What is going on?'}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SITUATIONS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={situation === s}
              onClick={() => setSituation(s)}
              className={clsx(
                'border px-3 py-3 text-left text-sm',
                situation === s ? 'border-accent bg-accentSoft text-accent' : 'border-rule hover:border-ruleStrong',
              )}
            >
              {SITUATION_LABELS[s][locale]}
            </button>
          ))}
        </div>
      </fieldset>

      {situation ? (
        <fieldset>
          <legend className="label mb-2">{nl ? 'Waar in het proces zit je?' : 'Where are you in the process?'}</legend>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((st) => (
              <button
                key={st}
                type="button"
                aria-pressed={stage === st}
                onClick={() => setStage(st)}
                className={clsx(
                  'border px-3 py-2 text-sm',
                  stage === st ? 'border-accent bg-accentSoft text-accent' : 'border-rule hover:border-ruleStrong',
                )}
              >
                {STAGE_LABELS[st][locale]}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {advice ? (
        <div className="grid gap-3">
          {advice.options.map((o, i) => (
            <div
              key={i}
              className={clsx(
                'border p-4',
                o.recommended ? 'border-accent bg-accentSoft' : 'border-rule bg-raised',
              )}
            >
              <div className="flex items-baseline gap-2">
                {o.recommended ? <span className="chip text-accent">{nl ? 'aanbevolen' : 'recommended'}</span> : null}
                <h3 className="font-display text-lg font-semibold">{o.headline[locale]}</h3>
              </div>
              <p className="mt-2 text-sm prose-measure">{o.action[locale]}</p>
              <p className="mt-2 text-[0.82rem] text-soft prose-measure">
                <span className="label mr-1">{nl ? 'Wat het kost' : 'What it costs'}</span>
                {o.cost[locale]}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-soft text-sm">
          {nl ? 'Kies hierboven wat er speelt, dan krijg je de volgende beste stap.' : 'Pick what is happening above, and you get the next best move.'}
        </p>
      )}
    </div>
  );
}
