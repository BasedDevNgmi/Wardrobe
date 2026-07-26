'use client';

/**
 * The DIY designer surface.
 *
 * Add the flours you own (from the database or hand-entered), set the
 * proportions and how ambitious you want to be, and the engine synthesises a
 * complete recipe — then renders it through the same calculator every authored
 * recipe uses, so you get the stage ledger, schedule, sourness dial, planner
 * and kitchen mode on a bread that did not exist a moment ago.
 */

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { redistribute } from '@/engine';
import type { BlendComponent, Flour } from '@/engine/types';
import {
  customFlour, designRecipe, type Ambition, type DesignSourness,
} from '@/data/designer';
import type { Locale } from '@/i18n/routing';
import { Calculator } from './Calculator';

const AMBITION: { key: Ambition; nl: string; en: string; sub: { nl: string; en: string } }[] = [
  { key: 'safe', nl: 'Veilig', en: 'Safe', sub: { nl: 'droger, vergevingsgezind', en: 'drier, forgiving' } },
  { key: 'balanced', nl: 'Gebalanceerd', en: 'Balanced', sub: { nl: 'de aanbevolen waarde', en: 'the recommended value' } },
  { key: 'open', nl: 'Open kruim', en: 'Open crumb', sub: { nl: 'zo nat als de mix aankan', en: 'as wet as the blend allows' } },
];

const SOURNESS: { key: DesignSourness; nl: string; en: string }[] = [
  { key: 'mild', nl: 'Mild', en: 'Mild' },
  { key: 'balanced', nl: 'Gebalanceerd', en: 'Balanced' },
  { key: 'sour', nl: 'Zuur', en: 'Sour' },
];

export function Designer({ flours, locale }: { flours: Flour[]; locale: Locale }) {
  const nl = locale === 'nl';

  const [customs, setCustoms] = useState<Flour[]>([]);
  const allFlours = useMemo(() => [...customs, ...flours], [customs, flours]);

  const [components, setComponents] = useState<BlendComponent[]>([
    { flour: flours.find((f) => f.slug === 'nl-bakkersbloem') ?? flours[0]!, fraction: 1 },
  ]);
  const [ambition, setAmbition] = useState<Ambition>('balanced');
  const [sourness, setSourness] = useState<DesignSourness>('balanced');
  const [generated, setGenerated] = useState<ReturnType<typeof designRecipe> | null>(null);

  const design = () => setGenerated(designRecipe(components, { ambition, sourness }));

  return (
    <div className="grid gap-8">
      {/* ---- flour builder ------------------------------------------- */}
      <section className="grid gap-4">
        <fieldset className="border border-rule bg-raised p-4">
          <legend className="label px-1">{nl ? 'Jouw meel' : 'Your flour'}</legend>
          <div className="grid gap-3">
            {components.map((c, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_auto] items-end">
                <label className="grid gap-1">
                  <span className="text-[0.78rem] text-soft">{nl ? 'Meelsoort' : 'Flour'}</span>
                  <select
                    className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
                    value={c.flour.slug}
                    onChange={(e) => {
                      const f = allFlours.find((x) => x.slug === e.target.value);
                      if (!f) return;
                      setComponents((prev) => prev.map((x, j) => (j === i ? { ...x, flour: f } : x)));
                    }}
                  >
                    {customs.length > 0 ? (
                      <optgroup label={nl ? 'Eigen invoer' : 'Custom'}>
                        {customs.map((f) => <option key={f.slug} value={f.slug}>{f.name}</option>)}
                      </optgroup>
                    ) : null}
                    <optgroup label={nl ? 'Database' : 'Database'}>
                      {flours.map((f) => <option key={f.slug} value={f.slug}>{f.country} · {f.name}</option>)}
                    </optgroup>
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="text-[0.78rem] text-soft">
                    {nl ? 'Aandeel' : 'Share'} — {Math.round(c.fraction * 100)}%
                  </span>
                  <input
                    type="range" min={0} max={100} step={5}
                    value={Math.round(c.fraction * 100)}
                    className="w-full accent-accent"
                    disabled={components.length === 1}
                    onChange={(e) => setComponents((prev) => redistribute(prev, i, Number(e.target.value) / 100))}
                  />
                </label>
                <button
                  type="button"
                  className="chip text-faint hover:text-danger disabled:opacity-40"
                  disabled={components.length === 1}
                  onClick={() => setComponents((prev) => {
                    const next = prev.filter((_, j) => j !== i);
                    const total = next.reduce((s, x) => s + x.fraction, 0);
                    return next.map((x) => ({ ...x, fraction: total > 0 ? x.fraction / total : 1 / next.length }));
                  })}
                >
                  {nl ? 'weg' : 'remove'}
                </button>
                <p className="sm:col-span-3 -mt-1 font-mono text-[0.68rem] text-faint tnum">
                  {nl ? 'opname' : 'absorption'} {c.flour.absorption}% · {nl ? 'sterkte' : 'strength'} {c.flour.strength} · {c.flour.fermentSpeed}×
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="chip text-accent"
              onClick={() => setComponents((prev) => {
                const share = 1 / (prev.length + 1);
                const scaled = prev.map((x) => ({ ...x, fraction: x.fraction * (1 - share) }));
                return [...scaled, { flour: allFlours[0]!, fraction: share }];
              })}
            >
              + {nl ? 'meel toevoegen' : 'add a flour'}
            </button>
          </div>
        </fieldset>

        <CustomFlourForm
          locale={locale}
          onAdd={(f) => {
            setCustoms((prev) => [f, ...prev]);
            setComponents((prev) => {
              const share = 1 / (prev.length + 1);
              const scaled = prev.map((x) => ({ ...x, fraction: x.fraction * (1 - share) }));
              return [...scaled, { flour: f, fraction: share }];
            });
          }}
        />

        {/* ambition + sourness */}
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="border border-rule bg-raised p-4">
            <legend className="label px-1">{nl ? 'Ambitie' : 'Ambition'}</legend>
            <div className="grid gap-2">
              {AMBITION.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  aria-pressed={ambition === a.key}
                  onClick={() => setAmbition(a.key)}
                  className={clsx('border px-3 py-2 text-left', ambition === a.key ? 'border-accent bg-accentSoft' : 'border-rule hover:border-ruleStrong')}
                >
                  <span className="block text-sm font-medium">{nl ? a.nl : a.en}</span>
                  <span className="block text-[0.72rem] text-faint">{a.sub[locale]}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="border border-rule bg-raised p-4">
            <legend className="label px-1">{nl ? 'Zuurgraad' : 'Sourness'}</legend>
            <div className="grid gap-2">
              {SOURNESS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={sourness === s.key}
                  onClick={() => setSourness(s.key)}
                  className={clsx('border px-3 py-2 text-left text-sm', sourness === s.key ? 'border-accent bg-accentSoft text-accent' : 'border-rule hover:border-ruleStrong')}
                >
                  {nl ? s.nl : s.en}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          onClick={design}
          className="justify-self-start bg-accent text-paper px-5 py-3 font-medium hover:opacity-90"
        >
          {nl ? 'Ontwerp mijn recept' : 'Design my recipe'}
        </button>
      </section>

      {/* ---- generated recipe ---------------------------------------- */}
      {generated ? (
        <section className="rule-top pt-6">
          <div className="mb-4">
            <h2 className="font-display text-2xl font-semibold">{generated.recipe.title[locale]}</h2>
            <p className="mt-1 text-soft prose-measure">{generated.recipe.summary[locale]}</p>
            <p className="mt-2 font-mono text-[0.72rem] text-faint tnum">
              {generated.recipe.hydration}% · {generated.recipe.salt}% {nl ? 'zout' : 'salt'} ·{' '}
              {generated.recipe.prefermentedFlour}% {nl ? 'voorferment' : 'preferment'} ·{' '}
              {nl ? 'moeilijkheid' : 'difficulty'} {generated.recipe.difficulty}/5
            </p>
          </div>
          <Calculator
            key={JSON.stringify(components.map((c) => [c.flour.slug, c.fraction]))}
            recipe={generated.recipe}
            authorFlours={generated.roleFlours}
            flours={allFlours}
            locale={locale}
          />
        </section>
      ) : (
        <p className="text-soft text-sm rule-top pt-6">
          {nl
            ? 'Stel je meel en voorkeuren in en druk op ontwerpen. De motor berekent een volledig recept dat past bij precies wat jij in huis hebt.'
            : 'Set your flour and preferences and press design. The engine computes a complete recipe fitted to exactly what you have.'}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function CustomFlourForm({ locale, onAdd }: { locale: Locale; onAdd: (f: Flour) => void }) {
  const nl = locale === 'nl';
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [protein, setProtein] = useState(12.5);
  const [species, setSpecies] = useState<'wheat' | 'spelt' | 'rye' | 'durum'>('wheat');
  const [wholegrain, setWholegrain] = useState(0);
  const [mill, setMill] = useState<'roller' | 'stone'>('roller');
  const [hardness, setHardness] = useState<'soft' | 'medium' | 'hard'>('medium');

  if (!open) {
    return (
      <button type="button" className="justify-self-start chip text-accent" onClick={() => setOpen(true)}>
        + {nl ? 'Mijn zak staat er niet bij — zelf invoeren' : 'My bag is not listed — enter it myself'}
      </button>
    );
  }

  return (
    <fieldset className="border border-accent bg-accentSoft p-4">
      <legend className="label px-1 text-accent">{nl ? 'Eigen meel invoeren' : 'Enter your own flour'}</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-[0.78rem] text-soft">{nl ? 'Naam' : 'Name'}</span>
          <input className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm" value={name}
            placeholder={nl ? 'bijv. molen om de hoek' : 'e.g. local mill'} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-[0.78rem] text-soft">{nl ? `Eiwit — ${protein}%` : `Protein — ${protein}%`}</span>
          <input type="range" min={7} max={16} step={0.5} value={protein} className="w-full accent-accent"
            onChange={(e) => setProtein(Number(e.target.value))} />
        </label>
        <label className="grid gap-1">
          <span className="text-[0.78rem] text-soft">{nl ? 'Graansoort' : 'Species'}</span>
          <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm" value={species}
            onChange={(e) => setSpecies(e.target.value as typeof species)}>
            <option value="wheat">{nl ? 'tarwe' : 'wheat'}</option>
            <option value="spelt">{nl ? 'spelt' : 'spelt'}</option>
            <option value="rye">{nl ? 'rogge' : 'rye'}</option>
            <option value="durum">{nl ? 'durum' : 'durum'}</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-[0.78rem] text-soft">{nl ? `Volkoren — ${Math.round(wholegrain * 100)}%` : `Wholegrain — ${Math.round(wholegrain * 100)}%`}</span>
          <input type="range" min={0} max={100} step={5} value={Math.round(wholegrain * 100)} className="w-full accent-accent"
            onChange={(e) => setWholegrain(Number(e.target.value) / 100)} />
        </label>
        <label className="grid gap-1">
          <span className="text-[0.78rem] text-soft">{nl ? 'Maling' : 'Mill'}</span>
          <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm" value={mill}
            onChange={(e) => setMill(e.target.value as typeof mill)}>
            <option value="roller">{nl ? 'walsen (industrieel)' : 'roller (industrial)'}</option>
            <option value="stone">{nl ? 'steen' : 'stone'}</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-[0.78rem] text-soft">{nl ? 'Hardheid' : 'Hardness'}</span>
          <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm" value={hardness}
            onChange={(e) => setHardness(e.target.value as typeof hardness)}>
            <option value="soft">{nl ? 'zacht' : 'soft'}</option>
            <option value="medium">{nl ? 'gemiddeld' : 'medium'}</option>
            <option value="hard">{nl ? 'hard' : 'hard'}</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="bg-accent text-paper px-4 py-2 text-sm font-medium disabled:opacity-40"
          disabled={!name.trim()}
          onClick={() => {
            onAdd(customFlour({ name: name.trim(), protein, species, wholegrain, mill, hardness }));
            setOpen(false); setName('');
          }}
        >
          {nl ? 'Toevoegen' : 'Add'}
        </button>
        <button type="button" className="chip text-faint" onClick={() => setOpen(false)}>
          {nl ? 'annuleren' : 'cancel'}
        </button>
      </div>
      <p className="mt-2 text-[0.78rem] text-soft prose-measure">
        {nl
          ? 'Weet je het eiwitgehalte niet? Het staat op de zak, of kies "gemiddeld" — het model markeert de uitkomst als geschat, ±3 punten.'
          : 'Do not know the protein? It is on the bag, or pick "medium" — the model marks the result estimated, ±3 points.'}
      </p>
    </fieldset>
  );
}
