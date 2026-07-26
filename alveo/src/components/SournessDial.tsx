'use client';

/**
 * The sourness dial, with the starter-state panel that feeds it.
 *
 * Both run on the pure engine, so the whole thing recalculates client-side
 * with no round-trip. The dial is the second-best demo of the engine after
 * flour substitution: it does not just predict acidity, it reconfigures the
 * recipe to hit a target and shows which *kind* of sour you get.
 */

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  DEFAULT_STARTER, planSourness, predictAcidity, SOURNESS_LABELS,
  SOURNESS_TARGETS, starterProfile,
} from '@/engine';
import type { BlendProfile, Recipe } from '@/engine/types';
import type { AcidityProfile, SournessTarget } from '@/engine/sourness';
import type { Ripeness, StarterGrain } from '@/engine/starter';
import type { Locale } from '@/i18n/routing';

const RIPENESS: { key: Ripeness; nl: string; en: string }[] = [
  { key: 'young', nl: 'jong', en: 'young' },
  { key: 'peak', nl: 'op de piek', en: 'at peak' },
  { key: 'past-peak', nl: 'over de piek', en: 'past peak' },
  { key: 'collapsed', nl: 'ingezakt', en: 'collapsed' },
];

const GRAINS: { key: StarterGrain; nl: string; en: string }[] = [
  { key: 'white', nl: 'wit', en: 'white' },
  { key: 'wholegrain', nl: 'volkoren', en: 'wholegrain' },
  { key: 'rye', nl: 'rogge', en: 'rye' },
];

export function SournessDial({
  recipe,
  blend,
  coldProofHours,
  doughTemp,
  locale,
}: {
  recipe: Recipe;
  blend: BlendProfile;
  coldProofHours: number;
  doughTemp: number;
  locale: Locale;
}) {
  const nl = locale === 'nl';
  const [target, setTarget] = useState<SournessTarget>('balanced');
  const [hydration, setHydration] = useState(DEFAULT_STARTER.hydration);
  const [temp, setTemp] = useState(DEFAULT_STARTER.temp);
  const [ripeness, setRipeness] = useState<Ripeness>('peak');
  const [grain, setGrain] = useState<StarterGrain>('white');
  const [lastFed, setLastFed] = useState(DEFAULT_STARTER.lastFedHours);

  const starter = useMemo(
    () => starterProfile({ ...DEFAULT_STARTER, hydration, temp, ripeness, grain, lastFedHours: lastFed }),
    [hydration, temp, ripeness, grain, lastFed],
  );

  const current = useMemo(
    () => predictAcidity(recipe, blend, { doughTemp, coldProofHours, starter }),
    [recipe, blend, doughTemp, coldProofHours, starter],
  );

  const plan = useMemo(() => planSourness(target, current), [target, current]);

  return (
    <div className="grid gap-5">
      {/* starter state */}
      <fieldset className="border border-rule bg-raised p-4">
        <legend className="label px-1">{nl ? 'Jouw desem' : 'Your starter'}</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-[0.78rem] text-soft">
              {nl ? `Hydratatie — ${hydration}%` : `Hydration — ${hydration}%`}
            </span>
            <input type="range" min={50} max={125} step={5} value={hydration}
              className="w-full accent-accent" onChange={(e) => setHydration(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <span className="text-[0.78rem] text-soft">
              {nl ? `Temperatuur — ${temp} °C` : `Temperature — ${temp} °C`}
            </span>
            <input type="range" min={4} max={28} step={1} value={temp}
              className="w-full accent-accent" onChange={(e) => setTemp(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <span className="text-[0.78rem] text-soft">
              {nl ? `Sinds laatste voeding — ${lastFed} u` : `Since last feed — ${lastFed} h`}
            </span>
            <input type="range" min={2} max={24} step={1} value={lastFed}
              className="w-full accent-accent" onChange={(e) => setLastFed(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <span className="text-[0.78rem] text-soft">{nl ? 'Rijpheid' : 'Ripeness'}</span>
            <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
              value={ripeness} onChange={(e) => setRipeness(e.target.value as Ripeness)}>
              {RIPENESS.map((r) => <option key={r.key} value={r.key}>{nl ? r.nl : r.en}</option>)}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-[0.78rem] text-soft">{nl ? 'Gevoed met' : 'Fed on'}</span>
            <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
              value={grain} onChange={(e) => setGrain(e.target.value as StarterGrain)}>
              {GRAINS.map((g) => <option key={g.key} value={g.key}>{nl ? g.nl : g.en}</option>)}
            </select>
          </label>
        </div>
        <p className={clsx('mt-3 text-[0.82rem] prose-measure', starter.underpowered ? 'text-warn' : 'text-soft')}>
          {starter.note[locale]}
        </p>
      </fieldset>

      {/* the dial */}
      <fieldset className="border border-rule bg-raised p-4">
        <legend className="label px-1">{nl ? 'Zuurgraad' : 'Sourness'}</legend>
        <div className="grid gap-2 sm:grid-cols-5">
          {SOURNESS_TARGETS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={target === t}
              onClick={() => setTarget(t)}
              className={clsx(
                'border px-2 py-2 text-sm',
                target === t ? 'border-accent bg-accentSoft text-accent' : 'border-rule hover:border-ruleStrong',
              )}
            >
              {SOURNESS_LABELS[t][locale]}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3">
          <AcidBar label={nl ? 'Nu' : 'Now'} profile={current} locale={locale} />
          <AcidBar label={nl ? 'Doel' : 'Target'} profile={plan.desired} locale={locale} highlight />
        </div>

        <p className="mt-3 text-[0.82rem] text-soft prose-measure">{plan.explanation[locale]}</p>

        {plan.adjustments.length > 0 ? (
          <ol className="mt-3 grid gap-2">
            {plan.adjustments.map((a) => (
              <li key={a.key} className="border-l-[3px] border-accent pl-3 py-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-accent" aria-hidden="true">{a.direction === 'up' ? '↑' : '↓'}</span>
                  <span className="text-sm font-medium">{a.label[locale]}</span>
                </div>
                <p className="text-[0.82rem] text-soft prose-measure mt-0.5">{a.action[locale]}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-[0.82rem] text-ok">
            {nl ? 'Het recept zit al op dit niveau — niets aan te passen.' : 'The recipe already sits here — nothing to adjust.'}
          </p>
        )}
      </fieldset>
    </div>
  );
}

function AcidBar({
  label, profile, locale, highlight = false,
}: { label: string; profile: AcidityProfile; locale: Locale; highlight?: boolean }) {
  const nl = locale === 'nl';
  const lactic = Math.round((1 - profile.aceticShare) * 100);
  const acetic = 100 - lactic;
  return (
    <div>
      <div className="flex justify-between text-[0.72rem] mb-0.5">
        <span className="label">{label}</span>
        <span className="font-mono tnum text-soft">
          {nl ? 'intensiteit' : 'intensity'} {profile.intensity}/100 · {lactic}% {nl ? 'melk' : 'lactic'} / {acetic}% {nl ? 'azijn' : 'acetic'}
        </span>
      </div>
      <div className={clsx('h-2 bg-sunk border', highlight ? 'border-accent' : 'border-rule')}>
        <div className="h-full bg-accent" style={{ width: `${profile.intensity}%` }} />
      </div>
    </div>
  );
}
