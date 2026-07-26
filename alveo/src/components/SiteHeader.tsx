import Link from 'next/link';
import { path, type Locale } from '@/i18n/routing';

const NAV: { key: Parameters<typeof path>[0]; nl: string; en: string }[] = [
  { key: 'recipes', nl: 'Recepten', en: 'Recipes' },
  { key: 'flours', nl: 'Meelsoorten', en: 'Flours' },
  { key: 'substitute', nl: 'Vervangen', en: 'Substitute' },
  { key: 'convert', nl: 'Omrekenen', en: 'Convert' },
  { key: 'problems', nl: 'Problemen', en: 'Problems' },
  { key: 'technique', nl: 'Techniek', en: 'Technique' },
  { key: 'tools', nl: 'Gereedschap', en: 'Tools' },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const other: Locale = locale === 'nl' ? 'en' : 'nl';

  return (
    <header className="border-b-2 border-ink no-print">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-4 pt-5 pb-3">
          <Link href={`/${locale}`} className="font-display text-2xl font-semibold tracking-tight">
            Alveo<span className="text-accent">.</span>
          </Link>
          <div className="flex items-baseline gap-3">
            <p className="hidden md:block font-display italic text-sm text-soft max-w-[42ch] text-right">
              {locale === 'nl'
                ? 'Elk desemrecept, omgerekend naar het meel in jouw kast.'
                : 'Every sourdough recipe, recalculated for the flour in your cupboard.'}
            </p>
            <Link
              href={`/${other}`}
              className="label hover:text-accent"
              hrefLang={other}
              aria-label={locale === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
            >
              {other.toUpperCase()}
            </Link>
          </div>
        </div>
        <nav aria-label={locale === 'nl' ? 'Hoofdmenu' : 'Main'}>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 pb-2.5">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={path(item.key, locale)}
                  className="font-mono text-[0.72rem] uppercase tracking-[0.07em] text-soft hover:text-accent"
                >
                  {locale === 'nl' ? item.nl : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
