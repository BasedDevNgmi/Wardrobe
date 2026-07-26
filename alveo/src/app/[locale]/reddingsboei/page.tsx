import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { RescueTool } from '@/components/RescueTool';
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
    title: nl ? 'Reddingsboei — hulp midden in het bakken' : 'Rescue — help mid-bake',
    description: nl
      ? 'Het is 02:00 en je deeg is klaar? Je moet weg? Je desem rijst niet? Kies wat er speelt en waar je zit, en krijg de volgende beste stap — en wat die kost.'
      : "It's 02:00 and your dough is ready? You have to leave? Your levain will not rise? Pick what is happening and where you are, and get the next best move — and what it costs.",
    alternates: { canonical: `/${locale}/reddingsboei`, languages: { nl: '/nl/reddingsboei', en: '/en/reddingsboei' } },
  };
}

export default async function RescuePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        {nl ? 'Reddingsboei' : 'Rescue'}
      </h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Geen naslagwerk voor achteraf, maar hulp op het moment zelf: midden in het bakken, op je telefoon, met bloem aan je handen. Kies wat er speelt en waar je zit.'
          : 'Not a reference for afterwards, but help in the moment: mid-bake, on your phone, with flour on your hands. Pick what is happening and where you are.'}
      </p>
      <div className="mt-8">
        <RescueTool locale={locale} />
      </div>
    </div>
  );
}
