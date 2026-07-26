import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { COUNTRY_NAMES, FLOURS, getFlour, nearestFlours } from '@/data/flours';
import { compareFlours, counterfactuals } from '@/engine/compare';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, Scroller, SectionHead, Stat } from '@/components/ui';
import { SUBSTITUTION_PAIRS } from '@/lib/pairs';

export const revalidate = 86400;
export const dynamicParams = true;

/**
 * Prerendering all 131×130 ordered pairs would be seventeen thousand pages of
 * mostly nobody's question. We prerender the ones people actually ask —
 * cross-system references and each flour's nearest neighbours — and let the
 * long tail render on demand and cache.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) => SUBSTITUTION_PAIRS.map((pair) => ({ locale, pair })));
}

function parsePair(pair: string): [string, string] | null {
  const idx = pair.indexOf('-vs-');
  if (idx < 0) return null;
  return [pair.slice(0, idx), pair.slice(idx + 4)];
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; pair: string }> }): Promise<Metadata> {
  const { locale, pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const a = getFlour(parsed[0]);
  const b = getFlour(parsed[1]);
  if (!a || !b) return {};
  const cmp = compareFlours(a, b);
  const nl = locale === 'nl';
  return {
    title: `${a.name} vs ${b.name}`,
    description: nl
      ? `${b.name} vraagt ${cmp.hydrationDelta > 0 ? '' : ''}${cmp.hydrationDelta} punten water tegenover ${a.name} — ${cmp.gramsPerKilo} gram per kilo bloem. Volledige specificatievergelijking en wat er aan je methode verandert.`
      : `${b.name} wants ${cmp.hydrationDelta} points of water against ${a.name} — ${cmp.gramsPerKilo} grams per kilo of flour. Full spec comparison and what changes in your method.`,
    alternates: {
      canonical: `/${locale}/vervangen/${pair}`,
      languages: { nl: `/nl/vervangen/${pair}`, en: `/en/vervangen/${pair}` },
    },
  };
}

export default async function SubstitutePage({
  params,
}: { params: Promise<{ locale: string; pair: string }> }) {
  const { locale: raw, pair } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const a = getFlour(parsed[0]);
  const b = getFlour(parsed[1]);
  if (!a || !b || a.slug === b.slug) notFound();

  const nl = locale === 'nl';
  const cmp = compareFlours(a, b);
  const cf = counterfactuals(a, b);

  const verdict = {
    'drop-in': { nl: 'Directe vervanging', en: 'Drop-in swap' },
    adjust: { nl: 'Vervangbaar met aanpassing', en: 'Swappable with adjustment' },
    'different-bread': { nl: 'Een ander brood', en: 'A different bread' },
  }[cmp.substitutable];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <nav className="mb-4 no-print">
        <Link href={path('substitute', locale)} className="label hover:text-accent">
          ← {nl ? 'Alle vergelijkingen' : 'All comparisons'}
        </Link>
      </nav>

      <header>
        <p className="label mb-1">{nl ? 'Vervangen' : 'Substitute'}</p>
        <h1 className="text-4xl font-semibold tracking-tight leading-tight">
          {a.name} <span className="text-faint">→</span> {b.name}
        </h1>
        <p className="mt-2 font-mono text-[0.75rem] text-faint">
          {COUNTRY_NAMES[a.country][locale]} → {COUNTRY_NAMES[b.country][locale]}
        </p>
      </header>

      <section className="mt-6 grid gap-px bg-rule border border-rule sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-paper">
          <Stat
            label={nl ? 'Verschil in water' : 'Water difference'}
            value={`${cmp.hydrationDelta > 0 ? '+' : ''}${cmp.hydrationDelta}`}
            sub={nl ? 'hydratatiepunten' : 'hydration points'}
          />
        </div>
        <div className="bg-paper">
          <Stat
            label={nl ? 'Per kilo bloem' : 'Per kilo of flour'}
            value={`${cmp.gramsPerKilo > 0 ? '+' : ''}${cmp.gramsPerKilo} g`}
            tone="ink"
            sub={nl ? 'water toevoegen of weglaten' : 'water to add or remove'}
          />
        </div>
        <div className="bg-paper">
          <Stat
            label={nl ? 'Verschil in sterkte' : 'Strength difference'}
            value={`${cmp.strengthDelta > 0 ? '+' : ''}${cmp.strengthDelta}`}
            tone="ink"
            sub={`${a.strength} → ${b.strength}`}
          />
        </div>
        <div className="bg-paper">
          <Stat
            label={nl ? 'Bulktijd' : 'Bulk time'}
            value={`${cmp.bulkTimeDelta > 0 ? '+' : ''}${cmp.bulkTimeDelta}%`}
            tone="ink"
            sub={nl ? 'langer of korter' : 'longer or shorter'}
          />
        </div>
      </section>

      <section className="mt-6">
        <Callout label={verdict[locale]}>
          <p>{cmp.prose[locale]}</p>
        </Callout>
      </section>

      {/* the exact adjustment */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'De aanpassing' : 'The adjustment'}
          title={nl ? 'Wat je precies verandert op een formule van 1 kg' : 'Exactly what changes on a 1 kg formula'}
        />
        <Scroller>
          <table className="datatable min-w-[30rem]">
            <thead>
              <tr>
                <th>{nl ? 'Bij deze hydratatie' : 'At this hydration'}</th>
                <th className="text-right">{a.name}</th>
                <th className="text-right">{b.name}</th>
                <th className="text-right">{nl ? 'Verschil' : 'Difference'}</th>
              </tr>
            </thead>
            <tbody className="font-mono tnum">
              {[70, 75, 80, 85].map((h) => {
                const adjusted = Math.round((h + cmp.hydrationDelta) * 10) / 10;
                return (
                  <tr key={h}>
                    <td className="font-body">{h}% {nl ? 'in het recept' : 'in the recipe'}</td>
                    <td className="text-right text-faint">{h * 10} g</td>
                    <td className="text-right text-accent">{Math.round(adjusted * 10)} g</td>
                    <td className="text-right">{cmp.gramsPerKilo > 0 ? '+' : ''}{cmp.gramsPerKilo} g</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Scroller>
      </section>

      {/* counterfactual decomposition */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Oorzaken' : 'Causes'}
          title={nl ? 'Hoeveel van het verschil komt waarvandaan' : 'How much of the difference comes from what'}
        >
          <p>
            {nl
              ? 'Elke regel beantwoordt dezelfde vraag: als alléén deze eigenschap zou veranderen, wat zou er dan met de wateropname gebeuren? Zo weet je of je met een ander graan te maken hebt of alleen met een andere molen.'
              : 'Each line answers the same question: if only this property changed, what would happen to the absorption? That tells you whether you are dealing with a different grain or merely a different mill.'}
          </p>
        </SectionHead>
        <ul className="grid gap-1.5">
          {cf.map((c) => {
            const max = Math.max(...cf.map((x) => Math.abs(x.points)), 1);
            const labels: Record<string, { nl: string; en: string }> = {
              protein: { nl: 'Alleen het eiwitgehalte', en: 'Protein content alone' },
              ash: { nl: 'Alleen de uitmaling (as)', en: 'Extraction alone (ash)' },
              mill: { nl: 'Alleen de maling', en: 'Milling alone' },
              hardness: { nl: 'Alleen de hardheid van het graan', en: 'Grain hardness alone' },
              species: { nl: 'Alleen de graansoort', en: 'Species alone' },
              additives: { nl: 'Alleen de toevoegingen', en: 'Additives alone' },
            };
            return (
              <li key={c.key} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div>
                  <div className="text-[0.85rem]">{labels[c.key]?.[locale] ?? c.key}</div>
                  <div className="h-1.5 bg-sunk border border-rule mt-0.5">
                    <div className="h-full bg-accent" style={{ width: `${(Math.abs(c.points) / max) * 100}%` }} />
                  </div>
                </div>
                <span className="font-mono text-sm tnum w-16 text-right">
                  {c.points > 0 ? '+' : ''}{c.points}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* method changes */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Methode' : 'Method'}
          title={nl ? 'Wat er verder verandert' : 'What else changes'}
        />
        <ul className="grid gap-2">
          {cmp.methodChanges.map((m, i) => (
            <li key={i} className="border-l-[3px] border-ruleStrong pl-3 py-1 text-sm prose-measure">
              {m[locale]}
            </li>
          ))}
        </ul>
      </section>

      {/* full spec diff */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Specificaties' : 'Specifications'}
          title={nl ? 'Naast elkaar' : 'Side by side'}
        />
        <Scroller>
          <table className="datatable min-w-[34rem]">
            <thead>
              <tr>
                <th>{nl ? 'Eigenschap' : 'Property'}</th>
                <th className="text-right">{a.name}</th>
                <th className="text-right">{b.name}</th>
                <th className="text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {cmp.specs.map((row) => (
                <tr key={row.key}>
                  <td>
                    {row.label[locale]}
                    {row.note ? (
                      <div className="text-[0.75rem] text-faint mt-0.5 max-w-[38ch]">{row.note[locale]}</div>
                    ) : null}
                  </td>
                  <td className="text-right font-mono tnum text-faint">{row.a}</td>
                  <td className="text-right font-mono tnum">{row.b}</td>
                  <td className="text-right font-mono tnum">
                    {typeof row.delta === 'number' ? `${row.delta > 0 ? '+' : ''}${row.delta}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
      </section>

      <section className="mt-10">
        <SectionHead eyebrow={nl ? 'Verder' : 'More'} title={nl ? 'Andere vervangingen' : 'Other substitutions'} />
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {nearestFlours(a, 5).filter((n) => n.slug !== b.slug).map((n) => (
            <li key={n.slug}>
              <Link
                href={path('substitute', locale, `${a.slug}-vs-${n.slug}`)}
                className="text-accent hover:underline text-sm"
              >
                {a.name} → {n.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href={path('flours', locale, a.slug)} className="text-accent hover:underline">
            {nl ? `Alles over ${a.name}` : `Everything about ${a.name}`}
          </Link>
          {' · '}
          <Link href={path('flours', locale, b.slug)} className="text-accent hover:underline">
            {nl ? `Alles over ${b.name}` : `Everything about ${b.name}`}
          </Link>
        </p>
      </section>
    </div>
  );
}
