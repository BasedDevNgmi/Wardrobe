import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FLOURS } from '@/data/flours';
import { Designer } from '@/components/Designer';
import { locales, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Ontwerp je eigen recept' : 'Design your own recipe',
    description: nl
      ? 'Voer het meel in dat je in huis hebt — uit de database of je eigen zak — en de motor ontwerpt een compleet desemrecept dat erbij past: hydratatie, vorm, timing en alle stappen.'
      : 'Enter the flour you own — from the database or your own bag — and the engine designs a complete sourdough recipe to fit it: hydration, format, timing and every step.',
    alternates: { canonical: `/${locale}/zelf`, languages: { nl: '/nl/zelf', en: '/en/zelf' } },
  };
}

export default async function DesignerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        {nl ? 'Ontwerp je eigen recept' : 'Design your own recipe'}
      </h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'De rest van de site rekent bestaande recepten om naar jouw meel. Deze pagina doet het omgekeerde: je geeft de motor het meel dat je hebt, en hij ontwerpt van de grond af een compleet recept dat erbij past — de hydratatie die deze mix kan dragen, de vorm die het meel kan houden, en elke stap.'
          : 'The rest of the site recalculates existing recipes for your flour. This page does the reverse: you give the engine the flour you have, and it designs a complete recipe from scratch to fit it — the hydration this blend can carry, the shape the flour can hold, and every step.'}
      </p>
      <div className="mt-8">
        <Designer flours={FLOURS} locale={locale} />
      </div>
    </div>
  );
}
