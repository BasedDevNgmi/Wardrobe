import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { COUNTRIES, COUNTRY_NAMES, FLOURS, floursByCountry } from '@/data/flours';
import { locales, path, type Locale } from '@/i18n/routing';
import { ConfidenceBadge, Scroller, SectionHead } from '@/components/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Meelsoorten' : 'Flours',
    description: nl
      ? `${FLOURS.length} meelsoorten uit 13 landen, met berekende wateropname, sterkte en fermentatiesnelheid — en een eerlijke betrouwbaarheid bij elk getal.`
      : `${FLOURS.length} flours from 13 countries, with computed absorption, strength and fermentation speed — and an honest confidence on every number.`,
    alternates: { canonical: `/${locale}/meel`, languages: { nl: '/nl/meel', en: '/en/meel' } },
  };
}

export default async function FloursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Meelsoorten' : 'Flours'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? `${FLOURS.length} melen uit dertien landen. Bij elk staat wat het model ervan maakt: wateropname, draagvermogen en fermentatiesnelheid — en hoe zeker we daarvan zijn.`
          : `${FLOURS.length} flours from thirteen countries. Each one carries what the model makes of it: absorption, carrying capacity and fermentation speed — and how sure we are.`}
      </p>

      {COUNTRIES.map((country) => {
        const list = floursByCountry(country);
        if (list.length === 0) return null;
        return (
          <section key={country} className="mt-8">
            <SectionHead
              eyebrow={country}
              title={COUNTRY_NAMES[country][locale]}
            />
            <Scroller>
              <table className="datatable min-w-[44rem]">
                <thead>
                  <tr>
                    <th>{nl ? 'Meel' : 'Flour'}</th>
                    <th className="text-right">{nl ? 'Eiwit' : 'Protein'}</th>
                    <th className="text-right">{nl ? 'As' : 'Ash'}</th>
                    <th className="text-right">{nl ? 'Opname' : 'Absorption'}</th>
                    <th className="text-right">{nl ? 'Sterkte' : 'Strength'}</th>
                    <th className="text-right">{nl ? 'Snelheid' : 'Speed'}</th>
                    <th>{nl ? 'Zekerheid' : 'Confidence'}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((f) => (
                    <tr key={f.slug}>
                      <td>
                        <Link href={path('flours', locale, f.slug)} className="text-accent hover:underline">
                          {f.name}
                        </Link>
                      </td>
                      <td className="text-right font-mono tnum">
                        {f.protein}%{f.proteinBasis === 'dry' ? '*' : ''}
                      </td>
                      <td className="text-right font-mono tnum">{f.ash ?? '—'}</td>
                      <td className="text-right font-mono tnum text-accent">{f.absorption}%</td>
                      <td className="text-right font-mono tnum">{f.strength}</td>
                      <td className="text-right font-mono tnum">{f.fermentSpeed}×</td>
                      <td><ConfidenceBadge confidence={f.confidence} locale={locale} showBand={false} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>
            <p className="mt-1.5 font-mono text-[0.68rem] text-faint">
              {nl
                ? '* opgegeven op droge stof; het model rekent alles om naar "zoals verkocht" voordat het vergelijkt.'
                : '* declared on dry matter; the model normalises everything to "as sold" before comparing.'}
            </p>
          </section>
        );
      })}
    </div>
  );
}
