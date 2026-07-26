import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { RECIPES, FORMAT_LABELS } from '@/data/recipes';
import { locales, path, type Locale } from '@/i18n/routing';
import { Scroller, SectionHead } from '@/components/ui';

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
      ? 'Tien desembroden, elk opgeslagen als formule en omgerekend naar het meel dat jij in huis hebt.'
      : 'Ten sourdough breads, each stored as a formula and recalculated for the flour you own.',
    alternates: { canonical: `/${locale}/recepten`, languages: { nl: '/nl/recepten', en: '/en/recepten' } },
  };
}

export default async function RecipesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Recepten' : 'Recipes'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Tien broden, gekozen op echte breedte: drie ovenveerbroden, een stokbrood, een open slab, een panbrood, een pizza, een busbrood, een rogge en een verrijkt deeg. Elk recept is een formule, geen vaste gewichten — kies je eigen meel en alle getallen schuiven mee.'
          : 'Ten breads, chosen for genuine breadth: three oven-spring loaves, a baguette, an open-crumb slab, a pan bread, a pizza, a tin loaf, a rye and an enriched dough. Every recipe is a formula rather than fixed weights — pick your own flour and every number moves with it.'}
      </p>

      <SectionHead title={nl ? 'De tien' : 'The ten'} />
      <Scroller>
        <table className="datatable min-w-[46rem]">
          <thead>
            <tr>
              <th>{nl ? 'Recept' : 'Recipe'}</th>
              <th>{nl ? 'Vorm' : 'Format'}</th>
              <th className="text-right">{nl ? 'Hydratatie' : 'Hydration'}</th>
              <th className="text-right">{nl ? 'Zout' : 'Salt'}</th>
              <th className="text-right">{nl ? 'Voorferment' : 'Preferment'}</th>
              <th className="text-right">{nl ? 'Uren' : 'Hours'}</th>
              <th className="text-right">{nl ? 'Moeilijk' : 'Difficulty'}</th>
            </tr>
          </thead>
          <tbody>
            {RECIPES.map((r) => (
              <tr key={r.slug}>
                <td>
                  <Link href={path('recipes', locale, r.slug)} className="text-accent hover:underline">
                    {r.title[locale]}
                  </Link>
                  <div className="text-[0.8rem] text-soft mt-0.5 max-w-[36ch]">{r.summary[locale]}</div>
                </td>
                <td className="font-mono text-[0.78rem]">{FORMAT_LABELS[r.format][locale]}</td>
                <td className="text-right font-mono tnum">{r.hydration}%</td>
                <td className="text-right font-mono tnum">{r.salt}%</td>
                <td className="text-right font-mono tnum">{r.prefermentedFlour}%</td>
                <td className="text-right font-mono tnum">{r.totalHours}</td>
                <td className="text-right font-mono tnum">{r.difficulty}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroller>

      <p className="mt-6 text-sm text-soft prose-measure">
        {nl
          ? 'De hydratatiekolom hierboven is die van de oorspronkelijke auteur. Open een recept en kies je eigen meel: de motor rekent het getal om, laat zien hoeveel van het verschil uit de graansoort komt, hoeveel uit de maling, en hoeveel uit je eigen veiligheidsmarge.'
          : 'The hydration column above is the original author\'s. Open a recipe and choose your own flour: the engine converts the number and shows how much of the difference comes from species, how much from milling, and how much from your own safety margin.'}
      </p>
    </div>
  );
}
