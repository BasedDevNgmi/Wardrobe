import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getFlour } from '@/data/flours';
import { compareFlours } from '@/engine/compare';
import { FEATURED_PAIRS, SUBSTITUTION_PAIRS } from '@/lib/pairs';
import { locales, path, type Locale } from '@/i18n/routing';
import { Scroller, SectionHead } from '@/components/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Meel vervangen' : 'Substituting flour',
    description: nl
      ? 'Zij-aan-zij vergelijkingen tussen meelsoorten, met het exacte verschil in gram water per kilo bloem en wat er aan je werkwijze verandert.'
      : 'Side-by-side flour comparisons, with the exact difference in grams of water per kilo of flour and what changes in your method.',
    alternates: { canonical: `/${locale}/vervangen`, languages: { nl: '/nl/vervangen', en: '/en/vervangen' } },
  };
}

export default async function SubstituteIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  const rows = FEATURED_PAIRS.map((pair) => {
    const idx = pair.indexOf('-vs-');
    const a = getFlour(pair.slice(0, idx));
    const b = getFlour(pair.slice(idx + 4));
    if (!a || !b) return null;
    return { pair, a, b, cmp: compareFlours(a, b) };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Meel vervangen' : 'Substituting flour'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Elke vergelijking rekent uit hoeveel water je moet toevoegen of weglaten, hoeveel van dat verschil uit de graansoort komt en hoeveel uit de maling, en wat er aan je vouwen, vormen en timing verandert.'
          : 'Every comparison computes how much water to add or remove, how much of that difference comes from species and how much from milling, and what changes in your folding, shaping and timing.'}
      </p>
      <p className="mt-2 font-mono text-[0.72rem] text-faint">
        {nl
          ? `${SUBSTITUTION_PAIRS.length} vergelijkingen voorberekend; elke andere combinatie werkt ook door hem in de URL te zetten.`
          : `${SUBSTITUTION_PAIRS.length} comparisons precomputed; any other combination works too by putting it in the URL.`}
      </p>

      <SectionHead
        eyebrow={nl ? 'Meest gestelde' : 'Most asked'}
        title={nl ? 'De vergelijkingen die er het meest toe doen' : 'The comparisons that matter most'}
      />
      <Scroller>
        <table className="datatable min-w-[42rem]">
          <thead>
            <tr>
              <th>{nl ? 'Van' : 'From'}</th>
              <th>{nl ? 'Naar' : 'To'}</th>
              <th className="text-right">{nl ? 'Water' : 'Water'}</th>
              <th className="text-right">g/kg</th>
              <th className="text-right">{nl ? 'Sterkte' : 'Strength'}</th>
              <th>{nl ? 'Oordeel' : 'Verdict'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ pair, a, b, cmp }) => (
              <tr key={pair}>
                <td>
                  <Link href={path('substitute', locale, pair)} className="text-accent hover:underline">
                    {a.name}
                  </Link>
                  <span className="text-faint font-mono text-[0.7rem]"> {a.country}</span>
                </td>
                <td>
                  {b.name}
                  <span className="text-faint font-mono text-[0.7rem]"> {b.country}</span>
                </td>
                <td className="text-right font-mono tnum">
                  {cmp.hydrationDelta > 0 ? '+' : ''}{cmp.hydrationDelta}
                </td>
                <td className="text-right font-mono tnum text-accent">
                  {cmp.gramsPerKilo > 0 ? '+' : ''}{cmp.gramsPerKilo}
                </td>
                <td className="text-right font-mono tnum">
                  {cmp.strengthDelta > 0 ? '+' : ''}{cmp.strengthDelta}
                </td>
                <td className="text-[0.8rem]">
                  {cmp.substitutable === 'drop-in'
                    ? nl ? 'direct' : 'drop-in'
                    : cmp.substitutable === 'adjust'
                      ? nl ? 'met aanpassing' : 'with adjustment'
                      : nl ? 'ander brood' : 'different bread'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroller>

      <p className="mt-6 text-sm text-soft prose-measure">
        {nl
          ? 'Let op de asymmetrie: van T65 naar Amerikaanse bread flour is een andere aanpassing dan andersom, omdat de veiligheidsmarge en de methodewijzigingen niet spiegelen. Beide richtingen hebben hun eigen pagina.'
          : 'Note the asymmetry: T65 to American bread flour is a different adjustment from the reverse, because the safety margin and the method changes do not mirror. Both directions have their own page.'}
      </p>
    </div>
  );
}
