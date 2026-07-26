'use client';

/**
 * The recipe browser.
 *
 * Fifty breads is past the point where a flat grid is navigation. The job here
 * is to let a reader cut the list down along the axes they actually think in —
 * what am I baking it in, how long have I got, how hard is it, how wet is it —
 * and then hand back a grouped, scannable answer.
 *
 * Everything filters client-side over a compact projection of the corpus (see
 * `RecipeCardData`); shipping fifty complete recipes with every step's prose to
 * the browser to power a search box would be several hundred kilobytes for no
 * reason. The server builds the index, the client filters it.
 */

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { RecipeFamily } from '@/data/recipes';
import type { Locale } from '@/i18n/routing';

export interface RecipeCardData {
  slug: string;
  href: string;
  title: string;
  summary: string;
  family: RecipeFamily;
  difficulty: number;
  hydration: number;
  salt: number;
  totalHours: number;
  /** Lowercased haystack the search box matches against, built server-side. */
  search: string;
}

export interface FamilyMeta {
  key: RecipeFamily;
  label: string;
  blurb: string;
}

type TimeBand = 'quick' | 'overnight' | 'long';
type WetBand = 'stiff' | 'medium' | 'wet' | 'very-wet';

const TIME_BANDS: { key: TimeBand; nl: string; en: string; test: (h: number) => boolean }[] = [
  { key: 'quick', nl: 'Zelfde dag', en: 'Same day', test: (h) => h <= 12 },
  { key: 'overnight', nl: 'Overnacht', en: 'Overnight', test: (h) => h > 12 && h <= 24 },
  { key: 'long', nl: 'Twee dagen', en: 'Two days', test: (h) => h > 24 },
];

const WET_BANDS: { key: WetBand; nl: string; en: string; test: (x: number) => boolean }[] = [
  { key: 'stiff', nl: 'Stevig · tot 65%', en: 'Stiff · to 65%', test: (x) => x < 65 },
  { key: 'medium', nl: 'Middel · 65–74%', en: 'Medium · 65–74%', test: (x) => x >= 65 && x < 75 },
  { key: 'wet', nl: 'Nat · 75–84%', en: 'Wet · 75–84%', test: (x) => x >= 75 && x < 85 },
  { key: 'very-wet', nl: 'Zeer nat · 85%+', en: 'Very wet · 85%+', test: (x) => x >= 85 },
];

const DIFFICULTY_LABELS: Record<number, { nl: string; en: string }> = {
  1: { nl: 'Beginner', en: 'Beginner' },
  2: { nl: 'Makkelijk', en: 'Easy' },
  3: { nl: 'Gemiddeld', en: 'Moderate' },
  4: { nl: 'Lastig', en: 'Hard' },
  5: { nl: 'Vergevorderd', en: 'Advanced' },
};

/** A filter toggle. Square, hairline, mono — the site's instrument language. */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'font-mono text-[0.68rem] uppercase tracking-[0.07em] px-2 py-[0.3rem]',
        'border transition-colors duration-100',
        active
          ? 'bg-accent text-paper border-accent'
          : 'bg-paper text-soft border-rule hover:border-ruleStrong hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <span className="label w-full sm:w-28 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Card({ r, nl }: { r: RecipeCardData; nl: boolean }) {
  return (
    <li className="border-b border-r border-rule bg-paper">
      <Link href={r.href} className="group block h-full p-4 hover:bg-raised transition-colors duration-100">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-accent transition-colors duration-100">
            {r.title}
          </h3>
          <span
            className="font-mono text-[0.68rem] text-faint tnum shrink-0"
            title={`${nl ? 'Moeilijkheid' : 'Difficulty'}: ${r.difficulty}/5`}
          >
            {'●'.repeat(r.difficulty)}
            <span className="text-rule">{'●'.repeat(5 - r.difficulty)}</span>
          </span>
        </div>
        <p className="mt-1.5 text-sm text-soft">{r.summary}</p>
        <p className="mt-2 font-mono text-[0.68rem] text-faint tnum">
          {r.hydration}% · {r.salt}% {nl ? 'zout' : 'salt'} · {r.totalHours} {nl ? 'uur' : 'h'}
        </p>
      </Link>
    </li>
  );
}

/**
 * The hairline grid.
 *
 * Each cell owns its bottom and right border and the container owns top and
 * left, so the lattice closes exactly once regardless of how many cards land
 * in the final row. The older `gap-px` over a coloured container was a cell
 * shorter than a full row away from rendering a grey block, which is precisely
 * what happened when the corpus went from eighteen to fifty.
 */
export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </ul>
  );
}

export function RecipeBrowser({
  recipes,
  families,
  locale,
}: {
  recipes: RecipeCardData[];
  families: FamilyMeta[];
  locale: Locale;
}) {
  const nl = locale === 'nl';

  const [query, setQuery] = useState('');
  const [fam, setFam] = useState<Set<RecipeFamily>>(new Set());
  const [time, setTime] = useState<Set<TimeBand>>(new Set());
  const [wet, setWet] = useState<Set<WetBand>>(new Set());
  const [diff, setDiff] = useState<Set<number>>(new Set());

  // Typing stays responsive even when the filter pass is the expensive part.
  const deferredQuery = useDeferredValue(query);

  function toggle<T>(set: Set<T>, value: T, apply: (next: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    apply(next);
  }

  const active =
    query.trim().length > 0 || fam.size > 0 || time.size > 0 || wet.size > 0 || diff.size > 0;

  function reset() {
    setQuery('');
    setFam(new Set());
    setTime(new Set());
    setWet(new Set());
    setDiff(new Set());
  }

  const matches = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const terms = q.length > 0 ? q.split(/\s+/) : [];
    return recipes.filter((r) => {
      if (fam.size > 0 && !fam.has(r.family)) return false;
      if (diff.size > 0 && !diff.has(r.difficulty)) return false;
      if (time.size > 0) {
        const band = TIME_BANDS.find((b) => b.test(r.totalHours));
        if (!band || !time.has(band.key)) return false;
      }
      if (wet.size > 0) {
        const band = WET_BANDS.find((b) => b.test(r.hydration));
        if (!band || !wet.has(band.key)) return false;
      }
      // Every term must appear somewhere: "spelt tin" should narrow, not widen.
      return terms.every((t) => r.search.includes(t));
    });
  }, [recipes, deferredQuery, fam, time, wet, diff]);

  const grouped = useMemo(
    () =>
      families
        .map((f) => ({ family: f, items: matches.filter((r) => r.family === f.key) }))
        .filter((g) => g.items.length > 0),
    [families, matches],
  );

  return (
    <div>
      {/* ---- controls ---- */}
      <div className="no-print border border-rule bg-raised p-4 sm:p-5">
        <div className="grid gap-3.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <label htmlFor="recipe-search" className="label w-full sm:w-28 shrink-0">
              {nl ? 'Zoeken' : 'Search'}
            </label>
            <input
              id="recipe-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={nl ? 'spelt, pizza, rogge, snel…' : 'spelt, pizza, rye, quick…'}
              className="flex-1 min-w-[12rem] bg-paper border border-rule px-2.5 py-1.5 text-sm
                         placeholder:text-faint focus:border-accent focus:outline-none"
            />
          </div>

          <FilterRow label={nl ? 'Soort' : 'Kind'}>
            {families.map((f) => (
              <Chip key={f.key} active={fam.has(f.key)} onClick={() => toggle(fam, f.key, setFam)}>
                {f.label}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label={nl ? 'Tijd' : 'Time'}>
            {TIME_BANDS.map((b) => (
              <Chip key={b.key} active={time.has(b.key)} onClick={() => toggle(time, b.key, setTime)}>
                {nl ? b.nl : b.en}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label={nl ? 'Hydratatie' : 'Hydration'}>
            {WET_BANDS.map((b) => (
              <Chip key={b.key} active={wet.has(b.key)} onClick={() => toggle(wet, b.key, setWet)}>
                {nl ? b.nl : b.en}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label={nl ? 'Niveau' : 'Level'}>
            {[1, 2, 3, 4, 5].map((d) => (
              <Chip key={d} active={diff.has(d)} onClick={() => toggle(diff, d, setDiff)}>
                {DIFFICULTY_LABELS[d]?.[locale]}
              </Chip>
            ))}
          </FilterRow>
        </div>

        <div className="mt-4 pt-3 border-t border-rule flex items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="font-mono text-[0.7rem] text-soft tnum">
            {matches.length === recipes.length
              ? nl
                ? `Alle ${recipes.length} recepten`
                : `All ${recipes.length} recipes`
              : nl
                ? `${matches.length} van ${recipes.length} recepten`
                : `${matches.length} of ${recipes.length} recipes`}
          </p>
          {active ? (
            <button
              type="button"
              onClick={reset}
              className="font-mono text-[0.68rem] uppercase tracking-[0.07em] text-accent hover:underline underline-offset-2"
            >
              {nl ? 'Filters wissen' : 'Clear filters'}
            </button>
          ) : null}
        </div>
      </div>

      {/* ---- results ---- */}
      {grouped.length === 0 ? (
        <div className="mt-8 border border-rule border-dashed p-8 text-center">
          <p className="text-soft">
            {nl
              ? 'Geen enkel recept voldoet aan al deze filters tegelijk.'
              : 'No recipe satisfies all of these filters at once.'}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.07em] text-accent hover:underline underline-offset-2"
          >
            {nl ? 'Begin opnieuw' : 'Start over'}
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10">
          {grouped.map(({ family, items }) => (
            <section key={family.key} aria-labelledby={`fam-${family.key}`}>
              <div className="rule-top pt-4 mb-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 id={`fam-${family.key}`} className="font-display text-2xl font-semibold leading-tight">
                    {family.label}
                  </h2>
                  <span className="font-mono text-[0.7rem] text-faint tnum shrink-0">
                    {items.length}
                  </span>
                </div>
                <p className="mt-2 prose-measure text-soft text-sm">{family.blurb}</p>
              </div>
              <CardGrid>
                {items.map((r) => (
                  <Card key={r.slug} r={r} nl={nl} />
                ))}
              </CardGrid>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
