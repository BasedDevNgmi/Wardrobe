import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { TECHNIQUES, getTechnique } from '@/data/content';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, SectionHead } from '@/components/ui';
import { howToJsonLd } from '@/lib/jsonld';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((locale) => TECHNIQUES.map((t) => ({ locale, slug: t.slug })));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getTechnique(slug);
  if (!t) return {};
  const l = locale as Locale;
  return {
    title: t.title[l],
    description: t.summary[l],
    alternates: {
      canonical: `/${locale}/techniek/${slug}`,
      languages: { nl: `/nl/techniek/${slug}`, en: `/en/techniek/${slug}` },
    },
  };
}

export default async function TechniquePage({
  params,
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const t = getTechnique(slug);
  if (!t) notFound();
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd(t, locale)) }}
      />

      <nav className="mb-4 no-print">
        <Link href={path('technique', locale)} className="label hover:text-accent">
          ← {nl ? 'Alle technieken' : 'All techniques'}
        </Link>
      </nav>

      <h1 className="text-4xl font-semibold tracking-tight">{t.title[locale]}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">{t.summary[locale]}</p>

      <section className="mt-8">
        <SectionHead eyebrow={nl ? 'Stap voor stap' : 'Step by step'} title={nl ? 'Hoe je het doet' : 'How to do it'} />
        <ol className="grid gap-3">
          {t.steps.map((s, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-mono text-sm text-accent tnum pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="prose-measure">{s[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <Callout label={nl ? 'Wanneer de motor dit kiest' : 'When the engine picks this'}>
          <p>{t.whenItApplies[locale]}</p>
        </Callout>
      </section>

      <section className="mt-8">
        <SectionHead
          eyebrow={nl ? 'Valkuilen' : 'Pitfalls'}
          title={nl ? 'Wat er meestal misgaat' : 'What usually goes wrong'}
        />
        <ul className="grid gap-2">
          {t.mistakes.map((m, i) => (
            <li key={i} className="border-l-[3px] border-warn pl-3 py-1 text-sm prose-measure">
              {m[locale]}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
