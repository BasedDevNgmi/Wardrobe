import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { FLOURS } from '@/data/flours';
import { authorFlours, getRecipe, RECIPES } from '@/data/recipes';
import { Calculator } from '@/components/Calculator';
import { SectionHead } from '@/components/ui';
import { locales, path, type Locale } from '@/i18n/routing';
import { recipeJsonLd } from '@/lib/jsonld';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((locale) => RECIPES.map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  const l = locale as Locale;
  return {
    title: recipe.title[l],
    description: recipe.summary[l],
    alternates: {
      canonical: `/${locale}/recepten/${slug}`,
      languages: { nl: `/nl/recepten/${slug}`, en: `/en/recepten/${slug}` },
    },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const authors = authorFlours(recipe);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        // Structured data is generated from the same formula the page renders,
        // so it can never drift from what a reader sees.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd(recipe, locale)) }}
      />

      <nav className="mb-4 no-print">
        <Link href={path('recipes', locale)} className="label hover:text-accent">
          ← {nl ? 'Alle recepten' : 'All recipes'}
        </Link>
      </nav>

      <header>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight">{recipe.title[locale]}</h1>
        <p className="mt-3 text-lg text-soft prose-measure">{recipe.summary[locale]}</p>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.72rem] text-faint tnum">
          <div><dt className="inline">{nl ? 'Moeilijkheid' : 'Difficulty'} </dt><dd className="inline text-ink">{recipe.difficulty}/5</dd></div>
          <div><dt className="inline">{nl ? 'Totaal' : 'Total'} </dt><dd className="inline text-ink">{recipe.totalHours} {nl ? 'uur' : 'h'}</dd></div>
          <div><dt className="inline">{nl ? 'Handwerk' : 'Hands-on'} </dt><dd className="inline text-ink">{recipe.activeMinutes} min</dd></div>
          <div><dt className="inline">{nl ? 'Formule' : 'Formula'} </dt><dd className="inline text-ink">{recipe.hydration}% / {recipe.salt}% / {recipe.prefermentedFlour}%</dd></div>
        </dl>
      </header>

      <section className="mt-6 border border-rule bg-raised p-4">
        <h2 className="label mb-1.5">{nl ? 'Waar dit recept voor geschreven is' : 'What this recipe was written for'}</h2>
        <p className="text-sm prose-measure">{recipe.authorContext.note[locale]}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] text-faint">
          {Object.entries(authors).map(([role, flour]) => (
            <li key={role}>
              {role}: <span className="text-ink">{flour.name}</span> ({flour.country})
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <Calculator recipe={recipe} authorFlours={authors} flours={FLOURS} locale={locale} />
      </div>

      {recipe.attribution.inspiredBy ? (
        <section className="mt-10">
          <SectionHead title={nl ? 'Herkomst' : 'Provenance'} />
          <p className="prose-measure text-soft text-sm">
            {nl ? 'Geïnspireerd door ' : 'Inspired by '}
            {recipe.attribution.url ? (
              <a href={recipe.attribution.url} rel="noopener" className="text-accent underline">
                {recipe.attribution.inspiredBy}
              </a>
            ) : (
              recipe.attribution.inspiredBy
            )}
            {nl
              ? '. De formule is een verzameling feiten; elke regel methodetekst op deze pagina is origineel geschreven.'
              : '. The formula is a set of facts; every line of method text on this page is written originally.'}
          </p>
        </section>
      ) : null}
    </div>
  );
}
