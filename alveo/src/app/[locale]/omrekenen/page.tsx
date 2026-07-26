import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { EQUIVALENCE, EQUIVALENCE_CAVEAT, SYSTEM_EXPLAINERS } from '@/data/content';
import { FLOURS, requireFlour } from '@/data/flours';
import { compareFlours } from '@/engine/compare';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, Scroller, SectionHead } from '@/components/ui';
import type { FlourSystem } from '@/engine/types';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Meelsystemen omrekenen' : 'Converting flour systems',
    description: nl
      ? 'De volledige equivalentietabel tussen het Franse T-, Duitse Type-, Italiaanse tipo-, Britse, Nederlandse, Poolse en Amerikaanse systeem — met de kanttekening dat as geen eiwit is.'
      : 'The complete equivalence table between the French T, German Type, Italian tipo, British, Dutch, Polish and American systems — with the caveat that ash is not protein.',
    alternates: { canonical: `/${locale}/omrekenen`, languages: { nl: '/nl/omrekenen', en: '/en/omrekenen' } },
  };
}

const SYSTEMS: FlourSystem[] = ['french-T', 'german-Type', 'italian-tipo', 'uk-strength', 'us-type', 'dutch', 'nordic'];

export default async function ConvertPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  // The proof that the table is an approximation, computed rather than asserted.
  const sameRow = compareFlours(requireFlour('fr-t65'), requireFlour('uk-strong-white'));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        {nl ? 'Meelsystemen omrekenen' : 'Converting flour systems'}
      </h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Zeven landen, drie volstrekt verschillende manieren om meel te classificeren. Deze tabel legt ze naast elkaar. Hij zet ze niet gelijk, en dat verschil is precies waar de meeste mislukte broden vandaan komen.'
          : 'Seven countries, three completely different ways of classifying flour. This table lays them side by side. It does not equate them, and that distinction is exactly where most failed loaves come from.'}
      </p>

      <section className="mt-6">
        <Callout label={nl ? 'Lees dit eerst' : 'Read this first'}>
          <p>{EQUIVALENCE_CAVEAT[locale]}</p>
        </Callout>
      </section>

      <SectionHead
        eyebrow={nl ? 'De tabel' : 'The table'}
        title={nl ? 'Equivalenties op uitmaling' : 'Equivalences by extraction'}
      />
      <Scroller>
        <table className="datatable min-w-[54rem]">
          <thead>
            <tr>
              <th>{nl ? 'Wat het is' : 'What it is'}</th>
              <th className="text-right">{nl ? 'As %' : 'Ash %'}</th>
              <th className="text-right">{nl ? 'Uitmaling' : 'Extraction'}</th>
              <th>FR</th><th>DE</th><th>IT</th><th>PL</th>
              <th>UK</th><th>NL</th><th>US</th>
            </tr>
          </thead>
          <tbody>
            {EQUIVALENCE.map((row) => (
              <tr key={row.key}>
                <td className="font-medium">{row.label[locale]}</td>
                <td className="text-right font-mono tnum">{row.ashBand[0]}–{row.ashBand[1]}</td>
                <td className="text-right font-mono tnum">~{row.typicalExtraction}%</td>
                <td className="font-mono text-[0.8rem]">{row.fr}</td>
                <td className="font-mono text-[0.8rem]">{row.de}</td>
                <td className="font-mono text-[0.8rem]">{row.it}</td>
                <td className="font-mono text-[0.8rem]">{row.pl}</td>
                <td className="font-mono text-[0.8rem]">{row.uk}</td>
                <td className="font-mono text-[0.8rem]">{row.nl}</td>
                <td className="font-mono text-[0.8rem]">{row.us}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroller>

      <section className="mt-8">
        <SectionHead
          eyebrow={nl ? 'Bewijs' : 'Proof'}
          title={nl ? 'Waarom dezelfde rij niet hetzelfde meel betekent' : 'Why the same row does not mean the same flour'}
        />
        <p className="prose-measure text-soft">
          {nl
            ? `Neem de Franse T65 en de Britse strong white. Ze staan in een equivalentietabel makkelijk in dezelfde buurt, maar de motor rekent een verschil van ${Math.abs(sameRow.hydrationDelta)} hydratatiepunten uit — ${Math.abs(sameRow.gramsPerKilo)} gram water per kilo bloem — en een verschil in sterkte van ${Math.abs(sameRow.strengthDelta)} punten. `
            : `Take French T65 and British strong white. Any equivalence table will put them near each other, but the engine computes a difference of ${Math.abs(sameRow.hydrationDelta)} hydration points — ${Math.abs(sameRow.gramsPerKilo)} grams of water per kilo of flour — and a strength difference of ${Math.abs(sameRow.strengthDelta)} points. `}
          {sameRow.prose[locale]}
        </p>
        <p className="mt-3">
          <Link
            href={path('substitute', locale, 'fr-t65-vs-uk-strong-white')}
            className="text-accent underline underline-offset-2"
          >
            {nl ? 'De volledige vergelijking' : 'The full comparison'}
          </Link>
        </p>
      </section>

      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'De systemen' : 'The systems'}
          title={nl ? 'Wat elk land eigenlijk meet' : 'What each country is actually measuring'}
        />
        <div className="grid gap-5 md:grid-cols-2">
          {SYSTEMS.map((s) => (
            <div key={s}>
              <h3 className="label mb-1">{s}</h3>
              <p className="text-sm text-soft prose-measure">{SYSTEM_EXPLAINERS[s][locale]}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-faint">
                {FLOURS.filter((f) => f.system === s).length} {nl ? 'melen in de database' : 'flours in the database'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
