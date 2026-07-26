import type { MetadataRoute } from 'next';
import { FLOURS } from '@/data/flours';
import { RECIPES } from '@/data/recipes';
import { PROBLEMS, TECHNIQUES } from '@/data/content';
import { SUBSTITUTION_PAIRS } from '@/lib/pairs';
import { locales } from '@/i18n/routing';

const SITE = 'https://alveo.bread';

/**
 * Every URL is emitted once per locale with a full hreflang set, so the two
 * language trees are paired explicitly rather than left to Google's guess.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '', priority: 1, freq: 'weekly' },
    { path: '/recepten', priority: 0.9, freq: 'weekly' },
    { path: '/meel', priority: 0.9, freq: 'weekly' },
    { path: '/vervangen', priority: 0.8, freq: 'weekly' },
    { path: '/omrekenen', priority: 0.8, freq: 'monthly' },
    { path: '/problemen', priority: 0.7, freq: 'monthly' },
    { path: '/techniek', priority: 0.7, freq: 'monthly' },
    { path: '/gereedschap', priority: 0.7, freq: 'monthly' },
    { path: '/kalibratie', priority: 0.8, freq: 'monthly' },
    { path: '/reddingsboei', priority: 0.7, freq: 'monthly' },
    ...RECIPES.map((r) => ({ path: `/recepten/${r.slug}`, priority: 0.9, freq: 'monthly' as const })),
    ...FLOURS.map((f) => ({ path: `/meel/${f.slug}`, priority: 0.7, freq: 'monthly' as const })),
    ...PROBLEMS.map((p) => ({ path: `/problemen/${p.slug}`, priority: 0.6, freq: 'monthly' as const })),
    ...TECHNIQUES.map((t) => ({ path: `/techniek/${t.slug}`, priority: 0.6, freq: 'monthly' as const })),
    ...Array.from({ length: 36 }, (_, i) => ({
      path: `/hydratatie/${55 + i}`, priority: 0.5, freq: 'monthly' as const,
    })),
    // The long tail is large; the sitemap carries the curated set, and the rest
    // is reachable through internal links from each flour page.
    ...SUBSTITUTION_PAIRS.slice(0, 800).map((p) => ({
      path: `/vervangen/${p}`, priority: 0.5, freq: 'monthly' as const,
    })),
  ];

  const now = new Date();

  return paths.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${SITE}/${locale}${entry.path}`,
      lastModified: now,
      changeFrequency: entry.freq,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE}/${l}${entry.path}`]),
        ),
      },
    })),
  );
}
