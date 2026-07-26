import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { TECHNIQUES } from '@/data/content';
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
    title: nl ? 'Techniek' : 'Technique',
    description: nl
      ? 'Vouwen, vormen, insnijden en desemonderhoud — met per techniek wanneer de motor hem daadwerkelijk voor jouw meel kiest.'
      : 'Folding, shaping, scoring and starter maintenance — each with the conditions under which the engine actually picks it for your flour.',
    alternates: { canonical: `/${locale}/techniek`, languages: { nl: '/nl/techniek', en: '/en/techniek' } },
  };
}

export default async function TechniqueIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Techniek' : 'Technique'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Geen techniek is universeel goed. Elke pagina zegt er daarom bij onder welke omstandigheden de motor hem voor jouw meel kiest — en wanneer hij hem juist afraadt.'
          : 'No technique is universally right. So each page states the conditions under which the engine picks it for your flour — and when it advises against.'}
      </p>

      <ul className="mt-8 grid border-t border-l border-rule sm:grid-cols-2">
        {TECHNIQUES.map((t) => (
          <li key={t.slug} className="border-b border-r border-rule bg-paper">
            <Link href={path('technique', locale, t.slug)} className="block h-full p-4 hover:bg-raised">
              <h2 className="font-display text-lg font-semibold leading-tight">{t.title[locale]}</h2>
              <p className="mt-1.5 text-sm text-soft">{t.summary[locale]}</p>
              <p className="mt-2 font-mono text-[0.68rem] text-faint">
                {t.steps.length} {nl ? 'stappen' : 'steps'} · {t.mistakes.length} {nl ? 'valkuilen' : 'pitfalls'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
