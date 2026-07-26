import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { bandFor } from '@/data/content';
import { FLOURS } from '@/data/flours';
import { RECIPES } from '@/data/recipes';
import { computeBlend, hydrationHeadroom, maxSensibleHydration } from '@/engine';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, Scroller, SectionHead, Stat } from '@/components/ui';

export const revalidate = 86400;

const PERCENTAGES = Array.from({ length: 36 }, (_, i) => 55 + i * 1);

export function generateStaticParams() {
  return locales.flatMap((locale) => PERCENTAGES.map((pct) => ({ locale, pct: String(pct) })));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; pct: string }> }): Promise<Metadata> {
  const { locale, pct } = await params;
  const n = Number(pct);
  if (!Number.isFinite(n)) return {};
  const nl = locale === 'nl';
  const band = bandFor(n);
  return {
    title: nl ? `${n}% hydratatie` : `${n}% hydration`,
    description: nl
      ? `Wat ${n}% hydratatie betekent per meelsoort: welke melen het dragen, hoe het deeg aanvoelt en welke recepten daar wonen.`
      : `What ${n}% hydration means per flour: which flours carry it, how the dough feels, and which recipes live there.`,
    alternates: {
      canonical: `/${locale}/hydratatie/${pct}`,
      languages: { nl: `/nl/hydratatie/${pct}`, en: `/en/hydratatie/${pct}` },
    },
  };
}

export default async function HydrationPage({
  params,
}: { params: Promise<{ locale: string; pct: string }> }) {
  const { locale: raw, pct } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const target = Number(pct);
  if (!Number.isFinite(target) || target < 50 || target > 100) notFound();
  const nl = locale === 'nl';
  const band = bandFor(target);

  // Which flours can actually carry this hydration, computed per flour.
  const assessed = FLOURS.map((f) => {
    const blend = computeBlend([{ flour: f, fraction: 1 }]);
    const ceiling = maxSensibleHydration(blend);
    return {
      flour: f,
      ceiling,
      headroom: hydrationHeadroom(blend),
      margin: Math.round((ceiling - target) * 10) / 10,
    };
  });

  const comfortable = assessed.filter((a) => a.margin >= 3).sort((a, b) => a.margin - b.margin);
  const marginal = assessed.filter((a) => a.margin >= 0 && a.margin < 3);
  const tooWeak = assessed.filter((a) => a.margin < 0).sort((a, b) => b.margin - a.margin);

  const recipesHere = RECIPES.filter((r) => Math.abs(r.hydration - target) <= 3);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <nav className="mb-4 no-print">
        <Link href={`/${locale}`} className="label hover:text-accent">← Alveo</Link>
      </nav>

      <header>
        <p className="label mb-1">{nl ? 'Hydratatie' : 'Hydration'}</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {target}% — {band.label[locale]}
        </h1>
      </header>

      <section className="mt-6 grid gap-px bg-rule border border-rule sm:grid-cols-3">
        <div className="bg-paper">
          <Stat
            label={nl ? 'Melen die dit dragen' : 'Flours that carry it'}
            value={comfortable.length}
            sub={nl ? `van de ${FLOURS.length} in de database` : `of the ${FLOURS.length} in the database`}
          />
        </div>
        <div className="bg-paper">
          <Stat
            label={nl ? 'Krap' : 'Marginal'} value={marginal.length} tone="ink"
            sub={nl ? 'minder dan 3 punten speling' : 'less than 3 points of headroom'}
          />
        </div>
        <div className="bg-paper">
          <Stat
            label={nl ? 'Te zwak' : 'Too weak'} value={tooWeak.length} tone="ink"
            sub={nl ? 'boven hun plafond' : 'above their ceiling'}
          />
        </div>
      </section>

      <section className="mt-8">
        <Callout label={nl ? 'Hoe dit aanvoelt' : 'How this feels'}>
          <p>{band.feel[locale]}</p>
        </Callout>
      </section>

      <section className="mt-8">
        <SectionHead
          eyebrow={nl ? 'Behandeling' : 'Handling'}
          title={nl ? 'Wat je anders doet op dit niveau' : 'What you do differently at this level'}
        />
        <div className="prose-measure grid gap-3 text-soft">
          <p>{band.handling[locale]}</p>
          <p>{band.suits[locale]}</p>
        </div>
      </section>

      {tooWeak.length > 0 ? (
        <section className="mt-10">
          <SectionHead
            eyebrow={nl ? 'Waarschuwing' : 'Warning'}
            title={
              nl
                ? `${tooWeak.length} melen in de database kunnen ${target}% niet dragen`
                : `${tooWeak.length} flours in the database cannot carry ${target}%`
            }
          >
            <p>
              {nl
                ? 'Bij deze melen ligt de hydratatie boven het berekende plafond. Dat betekent niet dat het brood mislukt, maar wel dat het deeg uitvloeit bij het vormen en dat je een busvorm of een rijsmandje nodig hebt.'
                : 'On these flours the hydration sits above the computed ceiling. That does not mean the loaf fails, but it does mean the dough flows when you shape it and you will need a tin or a basket.'}
            </p>
          </SectionHead>
          <Scroller>
            <table className="datatable min-w-[30rem]">
              <thead>
                <tr>
                  <th>{nl ? 'Meel' : 'Flour'}</th>
                  <th className="text-right">{nl ? 'Opname' : 'Absorption'}</th>
                  <th className="text-right">{nl ? 'Plafond' : 'Ceiling'}</th>
                  <th className="text-right">{nl ? 'Tekort' : 'Short by'}</th>
                </tr>
              </thead>
              <tbody>
                {tooWeak.slice(0, 12).map((a) => (
                  <tr key={a.flour.slug}>
                    <td>
                      <Link href={path('flours', locale, a.flour.slug)} className="text-accent hover:underline">
                        {a.flour.name}
                      </Link>
                      <span className="font-mono text-[0.7rem] text-faint"> {a.flour.country}</span>
                    </td>
                    <td className="text-right font-mono tnum">{a.flour.absorption}%</td>
                    <td className="text-right font-mono tnum">{a.ceiling}%</td>
                    <td className="text-right font-mono tnum text-warn">{a.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        </section>
      ) : null}

      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Comfortabel' : 'Comfortable'}
          title={nl ? 'Melen met echte marge op dit niveau' : 'Flours with real margin at this level'}
        />
        <Scroller>
          <table className="datatable min-w-[30rem]">
            <thead>
              <tr>
                <th>{nl ? 'Meel' : 'Flour'}</th>
                <th className="text-right">{nl ? 'Opname' : 'Absorption'}</th>
                <th className="text-right">{nl ? 'Sterkte' : 'Strength'}</th>
                <th className="text-right">{nl ? 'Marge' : 'Margin'}</th>
              </tr>
            </thead>
            <tbody>
              {comfortable.slice(-12).reverse().map((a) => (
                <tr key={a.flour.slug}>
                  <td>
                    <Link href={path('flours', locale, a.flour.slug)} className="text-accent hover:underline">
                      {a.flour.name}
                    </Link>
                    <span className="font-mono text-[0.7rem] text-faint"> {a.flour.country}</span>
                  </td>
                  <td className="text-right font-mono tnum">{a.flour.absorption}%</td>
                  <td className="text-right font-mono tnum">{a.flour.strength}</td>
                  <td className="text-right font-mono tnum text-accent">+{a.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
      </section>

      {recipesHere.length > 0 ? (
        <section className="mt-10">
          <SectionHead
            eyebrow={nl ? 'Recepten' : 'Recipes'}
            title={nl ? 'Wat er op dit niveau woont' : 'What lives at this level'}
          />
          <ul className="grid gap-2">
            {recipesHere.map((r) => (
              <li key={r.slug} className="flex justify-between gap-3 border-b border-rule pb-2">
                <Link href={path('recipes', locale, r.slug)} className="text-accent hover:underline">
                  {r.title[locale]}
                </Link>
                <span className="font-mono text-[0.72rem] tnum text-faint">{r.hydration}%</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="mt-10 flex flex-wrap gap-2 no-print">
        {[target - 5, target - 1, target + 1, target + 5]
          .filter((n) => n >= 55 && n <= 90)
          .map((n) => (
            <Link key={n} href={path('hydration', locale, String(n))} className="chip text-accent hover:bg-accentSoft">
              {n}%
            </Link>
          ))}
      </nav>
    </div>
  );
}
