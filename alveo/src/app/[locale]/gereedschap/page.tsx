import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Tools } from '@/components/Tools';
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
    title: nl ? 'Gereedschap' : 'Tools',
    description: nl
      ? 'Watertemperatuur, koppen naar grammen, rijsmandje naar deeggewicht, desemverhoudingen, toevoegingen en een parser die elk recept omzet naar bakkerspercentages.'
      : 'Water temperature, cups to grams, basket to dough weight, starter ratios, inclusions, and a parser that turns any recipe into baker\'s percentages.',
    alternates: { canonical: `/${locale}/gereedschap`, languages: { nl: '/nl/gereedschap', en: '/en/gereedschap' } },
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Gereedschap' : 'Tools'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'De rekenmachines die je nodig hebt naast de recepten. Elk hulpmiddel noemt zijn eigen foutmarge: een kop bloem varieert twintig procent, en een omrekening die dat verzwijgt doet alsof ze preciezer is dan ze is.'
          : 'The calculators you need alongside the recipes. Each one states its own error bar: a cup of flour varies by twenty per cent, and a converter that hides that is pretending to a precision it does not have.'}
      </p>
      <div className="mt-8">
        <Tools locale={locale} />
      </div>
    </div>
  );
}
