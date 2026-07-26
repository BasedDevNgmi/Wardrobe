import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/i18n/routing';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    metadataBase: new URL('https://alveo.bread'),
    title: {
      default: nl
        ? 'Alveo — elk desemrecept omgerekend naar jouw meel'
        : 'Alveo — every sourdough recipe recalculated for your flour',
      template: '%s · Alveo',
    },
    description: nl
      ? 'Gepubliceerde desemrecepten gaan stilzwijgend uit van het meel van de auteur. Alveo slaat elk recept op als formule en rekent hydratatie, timing en techniek om naar het meel dat jij in huis hebt.'
      : 'Published sourdough recipes silently assume the author\'s flour. Alveo stores every recipe as a formula and recalculates hydration, timing and technique for the flour you actually own.',
    alternates: {
      canonical: `/${locale}`,
      languages: { nl: '/nl', en: '/en' },
    },
    openGraph: {
      type: 'website',
      locale: nl ? 'nl_NL' : 'en_GB',
      siteName: 'Alveo',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:bg-accent focus:px-3 focus:py-2 focus:text-paper"
          >
            {locale === 'nl' ? 'Naar de inhoud' : 'Skip to content'}
          </a>
          <div className="min-h-screen flex flex-col">
            <SiteHeader locale={locale as Locale} />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
