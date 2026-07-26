import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { PROBLEMS } from '@/data/content';
import { locales, path, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Problemen oplossen' : 'Troubleshooting',
    description: nl
      ? 'Diagnosebomen voor de meest voorkomende desemproblemen, met de oorzaken gerangschikt op hoe vaak ze het echt zijn.'
      : 'Diagnosis trees for the commonest sourdough problems, with causes ranked by how often they actually are the cause.',
    alternates: { canonical: `/${locale}/problemen`, languages: { nl: '/nl/problemen', en: '/en/problemen' } },
  };
}

export default async function ProblemsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        {nl ? 'Problemen oplossen' : 'Troubleshooting'}
      </h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Elke pagina rangschikt de oorzaken op hoe vaak ze het in de praktijk zijn, niet op hoe interessant ze zijn. Bij de meeste problemen staat het antwoord bovenaan en hoef je niet verder te lezen.'
          : 'Every page ranks the causes by how often they actually are the cause, not by how interesting they are. For most problems the answer is at the top and you need not read further.'}
      </p>

      <ul className="mt-8 grid gap-px bg-rule border border-rule sm:grid-cols-2">
        {PROBLEMS.map((p) => (
          <li key={p.slug} className="bg-paper">
            <Link href={path('problems', locale, p.slug)} className="block h-full p-4 hover:bg-raised">
              <h2 className="font-display text-lg font-semibold leading-tight">{p.title[locale]}</h2>
              <p className="mt-1.5 text-sm text-soft">{p.symptom[locale]}</p>
              <p className="mt-2 font-mono text-[0.68rem] text-faint">
                {p.causes.length} {nl ? 'mogelijke oorzaken' : 'possible causes'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
