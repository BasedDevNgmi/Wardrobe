'use client';

/**
 * The calculator.
 *
 * Runs entirely client-side: the engine is pure TypeScript with no I/O, so
 * every slider move recalculates locally with no server round-trip and no
 * layout shift. It also means the whole thing keeps working offline, which is
 * the state a phone in a kitchen is usually in.
 */

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  bake,
  buildStageLedger,
  componentsFromRoles,
  DEFAULT_OPTIONS,
  formatDuration,
  MIX_METHOD_LABELS,
  MIX_METHODS,
  OVEN_LABELS,
  redistribute,
  roundPreservingTotal,
  solve,
  TIERS,
} from '@/engine';
import type {
  BlendComponent, Flour, FlourRole, MixMethod, OvenType, Recipe, SafetyTier,
} from '@/engine/types';
import type { Locale } from '@/i18n/routing';
import { ConfidenceBadge, Scroller, Stat, WarningList } from './ui';
import { KitchenMode } from './KitchenMode';
import { Planner } from './Planner';

const TIER_ORDER: SafetyTier[] = ['super-safe', 'safe', 'standard', 'as-intended'];

const TIER_LABELS: Record<SafetyTier, { nl: string; en: string }> = {
  'super-safe': { nl: 'Extra veilig', en: 'Super safe' },
  safe: { nl: 'Veilig', en: 'Safe' },
  standard: { nl: 'Standaard', en: 'Standard' },
  'as-intended': { nl: 'Zoals bedoeld', en: 'As intended' },
};

const TIER_HELP: Record<SafetyTier, { nl: string; en: string }> = {
  'super-safe': {
    nl: 'Zes punten droger, een extra vouwset, dubbel voorvormen en het bassinagewater pas na de eerste vouw. Voor onbekend meel of een eerste poging.',
    en: 'Six points drier, an extra fold set, a double preshape, and the bassinage held until after the first fold. For unfamiliar flour or a first attempt.',
  },
  safe: {
    nl: 'Drie punten droger en iets kortere rijstijden. Werkbaar deeg met marge.',
    en: 'Three points drier and slightly shorter proofs. Workable dough with margin.',
  },
  standard: {
    nl: 'De waarde die de motor berekent voor jouw meel, zonder aanpassing.',
    en: 'The value the engine computes for your flour, unadjusted.',
  },
  'as-intended': {
    nl: 'Drie punten natter: het doel van de oorspronkelijke auteur. Alleen als je het deeg kent.',
    en: 'Three points wetter: the original author\'s target. Only if you know the dough.',
  },
};

export interface CalculatorProps {
  recipe: Recipe;
  authorFlours: Partial<Record<FlourRole, Flour>>;
  /** Everything the reader could plausibly select. */
  flours: Flour[];
  locale: Locale;
}

export function Calculator({ recipe, authorFlours, flours, locale }: CalculatorProps) {
  const nl = locale === 'nl';

  const [roleFlours, setRoleFlours] = useState<Partial<Record<FlourRole, Flour>>>(authorFlours);
  const [components, setComponents] = useState<BlendComponent[] | null>(null);
  const [tier, setTier] = useState<SafetyTier>('standard');
  const [doughTemp, setDoughTemp] = useState(recipe.authorContext.doughTemp);
  const [fridgeTemp, setFridgeTemp] = useState(5);
  const [mixMethod, setMixMethod] = useState<MixMethod>('hand');
  const [ovenType, setOvenType] = useState<OvenType>('dutch-oven');
  const [bowlLitres, setBowlLitres] = useState<number | undefined>(undefined);
  const [totalFlour, setTotalFlour] = useState(1000);
  const [showOriginal, setShowOriginal] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  const activeRoleFlours = showOriginal ? authorFlours : roleFlours;

  const effectiveComponents = useMemo(
    () => components ?? componentsFromRoles(recipe, activeRoleFlours, authorFlours),
    [components, recipe, activeRoleFlours, authorFlours],
  );

  const result = useMemo(
    () =>
      bake({
        recipe,
        authorFlours,
        components: showOriginal ? undefined : effectiveComponents,
        roleFlours: activeRoleFlours,
        options: {
          ...DEFAULT_OPTIONS,
          tier: showOriginal ? 'standard' : tier,
          doughTemp,
          fridgeTemp,
          mixMethod,
          ovenType,
          totalFlour,
          ...(bowlLitres ? { mixerBowlLitres: bowlLitres } : {}),
        },
      }),
    [recipe, authorFlours, effectiveComponents, activeRoleFlours, tier, doughTemp,
     fridgeTemp, mixMethod, ovenType, totalFlour, bowlLitres, showOriginal],
  );

  const ledger = useMemo(
    () =>
      buildStageLedger({
        recipe,
        blend: result.blend,
        totalFlour,
        hydration: result.hydration,
        tier: showOriginal ? 'standard' : tier,
      }),
    [recipe, result.blend, result.hydration, totalFlour, tier, showOriginal],
  );

  const yieldSolve = useMemo(
    () => solve(recipe, result.hydration, { kind: 'total-flour', grams: totalFlour }),
    [recipe, result.hydration, totalFlour],
  );

  const delta = Math.round((result.hydration - recipe.hydration) * 10) / 10;

  return (
    <div className="grid gap-8">
      {kitchen ? (
        <KitchenMode result={result} locale={locale} onClose={() => setKitchen(false)} />
      ) : null}

      {/* ---- readout ------------------------------------------------ */}
      <section aria-label={nl ? 'Uitkomst' : 'Result'}>
        <div className="grid gap-px bg-rule border border-rule sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-paper">
            <Stat
              label={nl ? 'Hydratatie' : 'Hydration'}
              value={`${result.hydration}%`}
              sub={
                <>
                  {delta === 0
                    ? nl ? 'gelijk aan het origineel' : 'same as the original'
                    : `${delta > 0 ? '+' : ''}${delta} ${nl ? 'tegenover het recept' : 'against the recipe'}`}
                  {' · ±'}
                  {result.uncertainty}
                </>
              }
            />
          </div>
          <div className="bg-paper">
            <Stat
              label={nl ? 'Sterkte van de mix' : 'Blend strength'}
              value={result.blend.strength}
              tone="ink"
              sub={
                nl
                  ? `tolerantie ${result.blend.tolerance}/100 — hoe breed het "klaar"-venster is`
                  : `tolerance ${result.blend.tolerance}/100 — how wide the "done" window is`
              }
            />
          </div>
          <div className="bg-paper">
            <Stat
              label={nl ? 'Bulkrijs' : 'Bulk'}
              value={formatDuration(result.bulkMinutes, locale)}
              tone="ink"
              sub={
                nl
                  ? `bij ${doughTemp} °C · ${result.folds.count} vouwset${result.folds.count === 1 ? '' : 'ten'}`
                  : `at ${doughTemp} °C · ${result.folds.count} fold set${result.folds.count === 1 ? '' : 's'}`
              }
            />
          </div>
          <div className="bg-paper">
            <Stat
              label={nl ? 'Totaal deeg' : 'Total dough'}
              value={`${Math.round(result.totalDoughWeight)} g`}
              tone="ink"
              sub={`${yieldSolve.pieces} × ${yieldSolve.gramsEach} g`}
            />
          </div>
        </div>

        <p className="mt-2 text-[0.78rem] text-faint flex flex-wrap items-center gap-2">
          <ConfidenceBadge confidence={result.confidence} locale={locale} />
          <span>
            {nl
              ? `De onzekerheid komt van het minst goed bekende meel in je mix. Doe de kalibratietest en dit getal wordt van jou.`
              : `The uncertainty comes from the least well-known flour in your blend. Run the calibration test and this number becomes yours.`}
          </span>
        </p>
      </section>

      {/* ---- controls ----------------------------------------------- */}
      <section className="no-print grid gap-5" aria-label={nl ? 'Instellingen' : 'Settings'}>
        {/* flour selection */}
        <fieldset className="border border-rule bg-raised p-4">
          <legend className="label px-1">{nl ? 'Jouw meel' : 'Your flour'}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {recipe.flourBlend.map((entry) => {
              const current = activeRoleFlours[entry.role];
              return (
                <label key={entry.role} className="grid gap-1">
                  <span className="text-[0.78rem] text-soft">
                    {entry.pct}% — {roleLabel(entry.role, locale)}
                  </span>
                  <select
                    className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm font-mono"
                    value={current?.slug ?? ''}
                    disabled={showOriginal}
                    onChange={(e) => {
                      const f = flours.find((x) => x.slug === e.target.value);
                      if (!f) return;
                      setComponents(null);
                      setRoleFlours((prev) => ({ ...prev, [entry.role]: f }));
                    }}
                  >
                    {flours.map((f) => (
                      <option key={f.slug} value={f.slug}>
                        {f.country} · {f.name}
                      </option>
                    ))}
                  </select>
                  {current ? (
                    <span className="font-mono text-[0.68rem] text-faint tnum">
                      {nl ? 'opname' : 'absorption'} {current.absorption}% ·{' '}
                      {nl ? 'sterkte' : 'strength'} {current.strength} ·{' '}
                      {current.fermentSpeed}×
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOriginal}
              onChange={(e) => setShowOriginal(e.target.checked)}
            />
            <span>
              {nl
                ? 'Toon het originele recept, met het meel van de auteur'
                : "Show the original recipe, with the author's flour"}
            </span>
          </label>
        </fieldset>

        {/* blend sliders */}
        {effectiveComponents.length > 1 && !showOriginal ? (
          <fieldset className="border border-rule bg-raised p-4">
            <legend className="label px-1">
              {nl ? 'Verhouding (telt altijd op tot 100%)' : 'Proportions (always sum to 100%)'}
            </legend>
            <div className="grid gap-3">
              {effectiveComponents.map((c, i) => (
                <div key={c.flour.slug} className="grid gap-1">
                  <div className="flex justify-between items-baseline gap-2 text-[0.78rem]">
                    <span className="truncate">{c.flour.name}</span>
                    <span className="font-mono tnum text-accent">
                      {Math.round(c.fraction * 1000) / 10}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(c.fraction * 100)}
                    className="w-full accent-accent"
                    aria-label={`${c.flour.name} ${Math.round(c.fraction * 100)}%`}
                    onChange={(e) =>
                      setComponents(
                        redistribute(effectiveComponents, i, Number(e.target.value) / 100),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* tier */}
        <fieldset className="border border-rule bg-raised p-4">
          <legend className="label px-1">{nl ? 'Veiligheidsmarge' : 'Safety margin'}</legend>
          <div className="grid gap-2 sm:grid-cols-4">
            {TIER_ORDER.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tier === t}
                onClick={() => setTier(t)}
                disabled={showOriginal}
                className={clsx(
                  'border px-2 py-2 text-left disabled:opacity-50',
                  tier === t
                    ? 'border-accent bg-accentSoft'
                    : 'border-rule hover:border-ruleStrong',
                )}
              >
                <span className="block text-sm font-medium">{TIER_LABELS[t][locale]}</span>
                <span className="block font-mono text-[0.68rem] text-faint tnum">
                  {TIERS[t].hydrationDelta > 0 ? '+' : ''}
                  {TIERS[t].hydrationDelta} {nl ? 'punten' : 'points'}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.8rem] text-soft prose-measure">{TIER_HELP[tier][locale]}</p>
        </fieldset>

        {/* equipment */}
        <fieldset className="border border-rule bg-raised p-4">
          <legend className="label px-1">{nl ? 'Jouw gereedschap' : 'Your equipment'}</legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-[0.78rem] text-soft">{nl ? 'Hoe meng je?' : 'How are you mixing?'}</span>
              <select
                className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
                value={mixMethod}
                onChange={(e) => setMixMethod(e.target.value as MixMethod)}
              >
                {MIX_METHODS.map((m) => (
                  <option key={m} value={m}>{MIX_METHOD_LABELS[m][locale]}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-[0.78rem] text-soft">{nl ? 'Oven' : 'Oven'}</span>
              <select
                className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
                value={ovenType}
                onChange={(e) => setOvenType(e.target.value as OvenType)}
              >
                {(Object.keys(OVEN_LABELS) as OvenType[]).map((o) => (
                  <option key={o} value={o}>{OVEN_LABELS[o][locale]}</option>
                ))}
              </select>
            </label>

            {isMachine(mixMethod) ? (
              <label className="grid gap-1">
                <span className="text-[0.78rem] text-soft">
                  {nl ? 'Kominhoud (liter)' : 'Bowl capacity (litres)'}
                </span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  step={0.1}
                  className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm font-mono tnum"
                  value={bowlLitres ?? ''}
                  placeholder="4.8"
                  onChange={(e) =>
                    setBowlLitres(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </label>
            ) : null}

            <label className="grid gap-1">
              <span className="text-[0.78rem] text-soft">
                {nl ? `Deegtemperatuur — ${doughTemp} °C` : `Dough temperature — ${doughTemp} °C`}
              </span>
              <input
                type="range"
                min={16} max={32} step={1}
                value={doughTemp}
                className="w-full accent-accent"
                onChange={(e) => setDoughTemp(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[0.78rem] text-soft">
                {nl ? `Koelkast — ${fridgeTemp} °C` : `Fridge — ${fridgeTemp} °C`}
              </span>
              <input
                type="range"
                min={2} max={8} step={1}
                value={fridgeTemp}
                className="w-full accent-accent"
                onChange={(e) => setFridgeTemp(Number(e.target.value))}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[0.78rem] text-soft">{nl ? 'Totaal bloem (g)' : 'Total flour (g)'}</span>
              <input
                type="number"
                min={100} max={10000} step={50}
                className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm font-mono tnum"
                value={totalFlour}
                onChange={(e) => setTotalFlour(Math.max(50, Number(e.target.value) || 0))}
              />
            </label>
          </div>

          <p className="mt-3 text-[0.8rem] text-soft prose-measure">
            {result.equipment.mix.note[locale]}
          </p>
          <p className="mt-1 text-[0.8rem] text-soft prose-measure">
            {result.equipment.oven.note[locale]}
          </p>
          <p className="mt-1 text-[0.8rem] text-soft prose-measure">
            {result.equipment.fridge.note[locale]}
          </p>
        </fieldset>
      </section>

      {/* ---- warnings ------------------------------------------------ */}
      {result.warnings.length > 0 ? (
        <section aria-label={nl ? 'Waarschuwingen' : 'Warnings'}>
          <h3 className="label mb-2">{nl ? 'Let op' : 'Watch out'}</h3>
          <WarningList warnings={result.warnings} locale={locale} />
        </section>
      ) : null}

      {/* ---- stage ledger -------------------------------------------- */}
      <section aria-label={nl ? 'Stappen' : 'Stages'}>
        <h3 className="label mb-2">
          {nl ? 'Wat gaat er wanneer in de kom?' : 'What goes in, and when?'}
        </h3>
        <p className="mb-3 text-sm text-soft prose-measure">
          {nl
            ? 'Op geen enkel moment kiep je de hele ingrediëntenlijst in één kom. Hieronder staat per stap wat erin gaat — en, belangrijker, op welke hydratatie het deeg op dát moment staat.'
            : 'At no point do you tip the whole ingredient list into one bowl. Below is what goes in at each stage — and, more usefully, what hydration the dough is actually at right then.'}
        </p>
        <div className="grid gap-3">
          {ledger.stages.map((stage) => {
            const grams = roundPreservingTotal(stage.additions.map((a) => a.grams), 0);
            return (
              <div key={stage.id} className="border border-rule bg-raised">
                <div className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2 border-b border-rule">
                  <h4 className="font-display text-lg font-semibold">{stage.title[locale]}</h4>
                  {stage.running.flour > 0 ? (
                    <span className="font-mono text-[0.72rem] tnum text-accent">
                      {nl ? 'in de kom' : 'in the bowl'}: {Math.round(stage.running.totalWeight)} g ·{' '}
                      {stage.running.hydration}% {nl ? 'hydratatie' : 'hydration'}
                    </span>
                  ) : (
                    <span className="font-mono text-[0.72rem] text-faint">
                      {nl ? 'aparte kom' : 'separate bowl'}
                    </span>
                  )}
                </div>
                <ul className="px-3 py-2 grid gap-0.5">
                  {stage.additions.map((a, i) => (
                    <li key={`${a.key}-${i}`} className="flex justify-between gap-3 text-sm">
                      <span className="text-soft">{a.label[locale]}</span>
                      <span className="font-mono tnum">{grams[i]} g</span>
                    </li>
                  ))}
                </ul>
                <p className="px-3 pb-3 text-[0.8rem] text-soft prose-measure">{stage.note[locale]}</p>
              </div>
            );
          })}
        </div>
        {ledger.warnings.length > 0 ? (
          <ul className="mt-3 grid gap-1">
            {ledger.warnings.map((w, i) => (
              <li key={i} className="text-[0.8rem] text-warn">{w[locale]}</li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* ---- book vs yours ------------------------------------------- */}
      <section aria-label={nl ? 'Vergelijking' : 'Comparison'}>
        <h3 className="label mb-2">{nl ? 'Boek versus jouw meel' : 'The book versus your flour'}</h3>
        <p className="mb-3 text-sm text-soft prose-measure">
          {nl
            ? 'Genormaliseerd per kilo bloem. Zonder die normalisatie liegt de vergelijking, want twee recepten met verschillende batchgroottes zijn niet vergelijkbaar in grammen.'
            : 'Normalised per kilo of flour. Without that normalisation the comparison lies, because two recipes at different batch sizes are not comparable in grams.'}
        </p>
        <Scroller>
          <table className="datatable min-w-[30rem]">
            <thead>
              <tr>
                <th>{nl ? 'Per kilo bloem' : 'Per kilo of flour'}</th>
                <th className="text-right">{nl ? 'Origineel' : 'Original'}</th>
                <th className="text-right">{nl ? 'Jouw meel' : 'Your flour'}</th>
                <th className="text-right">{nl ? 'Verschil' : 'Difference'}</th>
              </tr>
            </thead>
            <tbody className="font-mono tnum">
              <ComparisonRow
                label={nl ? 'Water' : 'Water'}
                a={recipe.hydration * 10}
                b={result.hydration * 10}
                unit=" g"
              />
              <ComparisonRow
                label={nl ? 'Hydratatie' : 'Hydration'}
                a={recipe.hydration}
                b={result.hydration}
                unit="%"
              />
              <ComparisonRow
                label={nl ? 'Wateropname van de mix' : 'Blend absorption'}
                a={result.authorBlend.absorption}
                b={result.blend.absorption}
                unit="%"
              />
              <ComparisonRow
                label={nl ? 'Sterkte' : 'Strength'}
                a={result.authorBlend.strength}
                b={result.blend.strength}
                unit=""
              />
              <ComparisonRow
                label={nl ? 'Fermentatiesnelheid' : 'Fermentation speed'}
                a={result.authorBlend.fermentSpeed}
                b={result.blend.fermentSpeed}
                unit="×"
                digits={2}
              />
            </tbody>
          </table>
        </Scroller>
      </section>

      {/* ---- explain the gap ----------------------------------------- */}
      {result.explanation.contributions.length > 0 ? (
        <section aria-label={nl ? 'Verklaring' : 'Explanation'}>
          <h3 className="label mb-2">
            {nl ? 'Waar komt het verschil vandaan?' : 'Where does the difference come from?'}
          </h3>
          <div className="grid gap-1.5">
            {result.explanation.contributions.map((c) => {
              const max = Math.max(
                ...result.explanation.contributions.map((x) => Math.abs(x.points)),
                1,
              );
              const width = (Math.abs(c.points) / max) * 100;
              return (
                <div key={c.key} className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <div>
                    <div className="flex justify-between gap-2 text-[0.8rem]">
                      <span className={c.key === 'tier' ? 'text-warn' : ''}>{c.label[locale]}</span>
                    </div>
                    <div className="h-1.5 bg-sunk border border-rule mt-0.5">
                      <div
                        className={clsx('h-full', c.key === 'tier' ? 'bg-warn' : 'bg-accent')}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-sm tnum w-16 text-right">
                    {c.points > 0 ? '+' : ''}{c.points}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-soft prose-measure">
            {nl
              ? 'De veiligheidsmarge staat bewust apart van de natuurkunde: die heb je zelf gekozen, en een keuze verwarren met een meting is precies waar dit product tegen bestaat.'
              : 'The safety margin is deliberately kept apart from the physics: you chose it, and confusing a choice with a measurement is exactly what this product exists to avoid.'}
          </p>
        </section>
      ) : null}

      {/* ---- schedule ------------------------------------------------- */}
      <section aria-label={nl ? 'Tijdlijn' : 'Schedule'}>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="label">{nl ? 'Werkwijze' : 'Method'}</h3>
          <button
            type="button"
            onClick={() => setKitchen(true)}
            className="no-print border border-accent text-accent px-3 py-1.5 text-sm hover:bg-accentSoft"
          >
            {nl ? 'Keukenmodus — stap voor stap' : 'Kitchen mode — step by step'}
          </button>
        </div>
        <ol className="grid gap-3">
          {result.steps.map((step, i) => (
            <li key={step.id} className="grid sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-1 rule-top pt-3">
              <div className="font-mono text-[0.72rem] text-faint tnum">
                <div>{String(i + 1).padStart(2, '0')}</div>
                <div>{formatDuration(step.minutes, locale)}</div>
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold">{step.title[locale]}</h4>
                <p className="mt-1 text-sm prose-measure text-soft">{step.body[locale]}</p>
                {step.kind === 'fold' && result.folds.count > 0 ? (
                  <p className="mt-1.5 font-mono text-[0.72rem] text-accent tnum">
                    {result.folds.count}× {result.folds.type} —{' '}
                    {result.folds.atMinutes.map((m) => formatDuration(m, locale)).join(' · ')}
                  </p>
                ) : null}
                {step.kind === 'shape' ? (
                  <p className="mt-1.5 text-[0.8rem] text-soft">{result.shaping.note[locale]}</p>
                ) : null}
                {step.ingredients.length > 0 ? (
                  <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-[0.72rem] tnum text-faint">
                    {step.ingredients.map((ing) => (
                      <li key={ing.key}>
                        {ing.label[locale]} {Math.round(ing.grams)} g
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- planner --------------------------------------------------- */}
      <section className="no-print">
        <h3 className="label mb-2">{nl ? 'Plan de bak' : 'Plan the bake'}</h3>
        <p className="mb-3 text-sm text-soft prose-measure">
          {nl
            ? 'Kies wanneer het brood uit de oven moet komen en krijg elke stap op de klok — inclusief een eerlijke waarschuwing als je desem om 02:40 gevoerd wil worden, met de aanpassing die dat naar een menselijk uur verschuift.'
            : 'Pick when the bread should leave the oven and get every step on the clock — including an honest warning when your levain wants feeding at 02:40, with the adjustment that moves it to a humane hour.'}
        </p>
        <Planner result={result} locale={locale} />
      </section>
    </div>
  );
}

function ComparisonRow({
  label, a, b, unit, digits = 1,
}: { label: string; a: number; b: number; unit: string; digits?: number }) {
  const d = Math.round((b - a) * 10 ** digits) / 10 ** digits;
  return (
    <tr>
      <td className="font-body">{label}</td>
      <td className="text-right text-faint">{round(a, digits)}{unit}</td>
      <td className="text-right">{round(b, digits)}{unit}</td>
      <td className={clsx('text-right', d === 0 ? 'text-faint' : d > 0 ? 'text-accent' : 'text-warn')}>
        {d > 0 ? '+' : ''}{d}{unit}
      </td>
    </tr>
  );
}

function round(n: number, digits: number) {
  return Math.round(n * 10 ** digits) / 10 ** digits;
}

function isMachine(m: MixMethod) {
  return m === 'stand-mixer' || m === 'spiral' || m === 'food-processor' || m === 'bread-machine';
}

function roleLabel(role: FlourRole, locale: Locale) {
  const labels: Record<FlourRole, { nl: string; en: string }> = {
    'strong-white': { nl: 'sterke witte bloem', en: 'strong white flour' },
    white: { nl: 'witte bloem', en: 'white flour' },
    wholegrain: { nl: 'volkorenmeel', en: 'wholemeal flour' },
    rye: { nl: 'roggemeel', en: 'rye flour' },
    durum: { nl: 'durum', en: 'durum' },
    ancient: { nl: 'oergraan', en: 'ancient grain' },
  };
  return labels[role][locale];
}
