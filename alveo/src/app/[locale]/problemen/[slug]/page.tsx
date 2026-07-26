import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PROBLEMS, getProblem } from '@/data/content';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, SectionHead } from '@/components/ui';
import { faqJsonLd } from '@/lib/jsonld';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((locale) => PROBLEMS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProblem(slug);
  if (!p) return {};
  const l = locale as Locale;
  return {
    title: p.title[l],
    description: p.symptom[l],
    alternates: {
      canonical: `/${locale}/problemen/${slug}`,
      languages: { nl: `/nl/problemen/${slug}`, en: `/en/problemen/${slug}` },
    },
  };
}

const LIKELIHOOD: Record<string, { nl: string; en: string; weight: number }> = {
  'most-common': { nl: 'Meest voorkomend', en: 'Most common', weight: 100 },
  common: { nl: 'Vaak', en: 'Common', weight: 65 },
  occasional: { nl: 'Soms', en: 'Occasional', weight: 35 },
  rare: { nl: 'Zelden', en: 'Rare', weight: 15 },
};

export default async function ProblemPage({
  params,
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const problem = getProblem(slug);
  if (!problem) notFound();
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(problem, locale)) }}
      />

      <nav className="mb-4 no-print">
        <Link href={path('problems', locale)} className="label hover:text-accent">
          ← {nl ? 'Alle problemen' : 'All problems'}
        </Link>
      </nav>

      <h1 className="text-4xl font-semibold tracking-tight leading-tight">{problem.title[locale]}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">{problem.symptom[locale]}</p>

      <section className="mt-6">
        <Callout label={nl ? 'Als je maar één ding verandert' : 'If you change only one thing'}>
          <p>{problem.primaryFix[locale]}</p>
        </Callout>
      </section>

      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Diagnose' : 'Diagnosis'}
          title={nl ? 'Oorzaken, op volgorde van waarschijnlijkheid' : 'Causes, in order of likelihood'}
        >
          <p>
            {nl
              ? 'Gerangschikt zoals ze in de praktijk voorkomen, niet zoals ze in een leerboek staan. Werk van boven naar beneden en stop zodra je de jouwe herkent.'
              : 'Ranked as they actually occur, not as a textbook lists them. Work down from the top and stop when you recognise yours.'}
          </p>
        </SectionHead>

        <ol className="grid gap-5">
          {problem.causes.map((c, i) => {
            const l = LIKELIHOOD[c.likelihood]!;
            return (
              <li key={i} className="rule-top pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="label">{l[locale]}</span>
                  <span className="h-1.5 flex-1 max-w-[7rem] bg-sunk border border-rule">
                    <span className="block h-full bg-accent" style={{ width: `${l.weight}%` }} />
                  </span>
                </div>
                <p className="prose-measure">{c.cause[locale]}</p>
                <p className="mt-2 prose-measure text-soft">
                  <span className="label mr-1">{nl ? 'Oplossing' : 'Fix'}</span>
                  {c.fix[locale]}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {problem.related && problem.related.length > 0 ? (
        <section className="mt-10">
          <SectionHead eyebrow={nl ? 'Verwant' : 'Related'} title={nl ? 'Als dit het niet is' : 'If this is not it'} />
          <ul className="grid gap-1.5">
            {problem.related.map((r) => {
              const rel = getProblem(r);
              if (!rel) return null;
              return (
                <li key={r}>
                  <Link href={path('problems', locale, r)} className="text-accent hover:underline">
                    {rel.title[locale]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
