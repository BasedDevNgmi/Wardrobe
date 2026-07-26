export const locales = ['nl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'nl';

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

/**
 * Route segments are Dutch in both locales.
 *
 * A deliberate trade. Translated segments read better in English, but they
 * double every generated route, split the link equity of the programmatic
 * families across two URL trees, and make hreflang pairing fragile. The site
 * launches Dutch-first, the segments follow the brief, and the locale prefix
 * carries the language. Revisit if English traffic ever overtakes Dutch.
 */
export const pathnames = {
  home: '/',
  recipes: '/recepten',
  flours: '/meel',
  substitute: '/vervangen',
  convert: '/omrekenen',
  hydration: '/hydratatie',
  problems: '/problemen',
  technique: '/techniek',
  tools: '/gereedschap',
  calibration: '/kalibratie',
  rescue: '/reddingsboei',
} as const;

export type PathKey = keyof typeof pathnames;

export function path(key: PathKey, locale: Locale, ...segments: string[]): string {
  const base = pathnames[key];
  const tail = segments.filter(Boolean).join('/');
  const joined = base === '/' ? '' : base;
  return `/${locale}${joined}${tail ? `/${tail}` : ''}` || `/${locale}`;
}
