import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FAMILIES, FORMAT_LABELS, RECIPES, familyOf } from '@/data/recipes';
import { locales, path, type Locale } from '@/i18n/routing';
import {
  RecipeBrowser,
  type FamilyMeta,
  type RecipeCardData,
} from '@/components/RecipeBrowser';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Recepten' : 'Recipes',
    description: nl
      ? `${RECIPES.length} desemrecepten, elk opgeslagen als formule en omgerekend naar het meel dat jij in huis hebt.`
      : `${RECIPES.length} sourdough recipes, each stored as a formula and recalculated for the flour you own.`,
    alternates: {
      canonical: `/${locale}/recepten`,
      languages: { nl: '/nl/recepten', en: '/en/recepten' },
    },
  };
}

export default async function RecipesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  // The client gets a compact projection, not the corpus: fifty recipes with
  // every step's prose in both languages is a payload no filter box justifies.
  const cards: RecipeCardData[] = RECIPES.map((r) => {
    const family = familyOf(r.slug);
    const formatLabel = FORMAT_LABELS[r.format][locale];
    return {
      slug: r.slug,
      href: path('recipes', locale, r.slug),
      title: r.title[locale],
      summary: r.summary[locale],
      family,
      difficulty: r.difficulty,
      hydration: r.hydration,
      salt: r.salt,
      totalHours: r.totalHours,
      search: [
        r.title[locale],
        r.summary[locale],
        formatLabel,
        ...(r.tags ?? []),
        // Both languages in the haystack: readers search in the words they
        // know, and half the audience knows this bread by its Dutch name.
        r.title[locale === 'nl' ? 'en' : 'nl'],
      ]
        .join(' ')
        .toLowerCase(),
    };
  });

  const families: FamilyMeta[] = FAMILIES.map((f) => ({
    key: f.key,
    label: f.label[locale],
    blurb: f.blurb[locale],
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Recepten' : 'Recipes'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? `${RECIPES.length} broden, van een pita die in dertig seconden opblaast tot een pumpernickel die vier uur bakt. Elk recept is een formule en geen vaste gewichten — kies je eigen meel en alle getallen schuiven mee.`
          : `${RECIPES.length} breads, from a pita that inflates in thirty seconds to a pumpernickel that bakes for four hours. Every recipe is a formula rather than fixed weights — pick your own flour and every number moves with it.`}
      </p>

      <div className="mt-8">
        <RecipeBrowser recipes={cards} families={families} locale={locale} />
      </div>

      <p className="mt-10 text-sm text-soft prose-measure">
        {nl
          ? 'De hydratatie die je hierboven ziet is die van de oorspronkelijke auteur. Open een recept en kies je eigen meel: de motor rekent het getal om en laat zien hoeveel van het verschil uit de graansoort komt, hoeveel uit de maling, en hoeveel uit je eigen veiligheidsmarge.'
          : "The hydration you see above is the original author's. Open a recipe and choose your own flour: the engine converts the number and shows how much of the difference comes from species, how much from milling, and how much from your own safety margin."}
      </p>
    </div>
  );
}
