import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { FLOURS, requireFlour } from '@/data/flours';
import { RECIPES, requireRecipe } from '@/data/recipes';
import { compareFlours } from '@/engine/compare';
import { locales, path, type Locale } from '@/i18n/routing';
import { SectionHead } from '@/components/ui';
import { GapFigure } from '@/components/GapFigure';
import { CardGrid } from '@/components/RecipeBrowser';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * A dozen breads spanning all five families and the full difficulty range,
 * chosen by hand. The home page's job is to show the shape of the collection,
 * not to be the collection — that is what /recepten is for now.
 */
const FEATURED = [
  'alledaags-landbrood',
  'hoge-hydratatie-wit',
  'desem-stokbrood',
  'pain-de-campagne',
  'desem-busbrood',
  'roggevolkorenbrood',
  'desem-brioche',
  'desem-melkbrood',
  'desem-pizza',
  'desem-focaccia',
  'desem-bagels',
  'desem-pretzels',
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  // A live computation on the home page, not a claim: the gap between the
  // reference American flour and the reference French one, decomposed.
  const t65 = requireFlour('fr-t65');
  const us = requireFlour('us-bread-flour');
  const gap = compareFlours(t65, us);
  const measured = FLOURS.filter((f) => f.confidence === 'measured').length;

  const featured = FEATURED.map(requireRecipe);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <section className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.04] tracking-tight">
          {nl
            ? 'Gepubliceerde desemrecepten gaan stilzwijgend uit van het meel van de auteur.'
            : "Published sourdough recipes silently assume the author's flour."}
        </h1>
        <p className="mt-4 text-lg text-soft prose-measure">
          {nl
            ? 'Een Amerikaans recept op 85% hydratatie gaat uit van harde rode voorjaarstarwe, walsgemalen, met veel beschadigd zetmeel. Draai dat op Franse T65 of Duitse 550 en je krijgt soep. Alveo slaat elk recept op als formule en rekent hydratatie, timing, techniek en waarschuwingen om naar het meel dat jij in je kast hebt staan.'
            : 'An American recipe at 85% hydration assumes hard red spring wheat, roller-milled, with high damaged starch. Run it on French T65 or German 550 and you get soup. Alveo stores every recipe as a formula and recalculates hydration, timing, technique and warnings for the flour you actually own.'}
        </p>
      </section>

      {/* ---- the proof, given the room it deserves ---- */}
      <section className="mt-12 border border-rule bg-raised">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="p-5 sm:p-7 lg:border-r border-rule">
            <div className="label text-accent">
              {nl ? 'Berekend, niet beweerd' : 'Computed, not claimed'}
            </div>

            <p className="mt-3 font-display text-[2.6rem] sm:text-[3.2rem] leading-[0.95] tracking-tight tnum">
              {gap.hydrationDelta > 0 ? '+' : ''}
              {gap.hydrationDelta}
              <span className="text-soft text-[1.4rem] sm:text-[1.7rem] font-normal">
                {' '}
                {nl ? 'punten' : 'points'}
              </span>
            </p>
            <p className="mt-2 text-sm text-soft">
              {nl
                ? `Amerikaanse bread flour draagt ${Math.abs(gap.hydrationDelta)} hydratatiepunten meer water dan Franse T65 — ${Math.abs(gap.gramsPerKilo)} gram per kilo bloem. Datzelfde recept, twee landen, en het verschil tussen een strak brood en een plas op de plaat.`
                : `American bread flour carries ${Math.abs(gap.hydrationDelta)} hydration points more water than French T65 — ${Math.abs(gap.gramsPerKilo)} grams per kilo of flour. The same recipe, two countries, and the difference between a tight loaf and a puddle on the tray.`}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-px bg-rule border border-rule">
              <div className="bg-raised px-3 py-2">
                <dt className="label">{nl ? 'Sterkteverschil' : 'Strength gap'}</dt>
                <dd className="font-mono text-lg tnum text-ink">
                  {gap.strengthDelta > 0 ? '+' : ''}
                  {gap.strengthDelta}
                </dd>
              </div>
              <div className="bg-raised px-3 py-2">
                <dt className="label">{nl ? 'Bulkrijs' : 'Bulk time'}</dt>
                <dd className="font-mono text-lg tnum text-ink">
                  {gap.bulkTimeDelta > 0 ? '+' : ''}
                  {gap.bulkTimeDelta}%
                </dd>
              </div>
            </dl>
          </div>

          <div className="p-5 sm:p-7 border-t lg:border-t-0 border-rule">
            <h2 className="label mb-3">
              {nl ? 'Waar dat verschil vandaan komt' : 'Where that difference comes from'}
            </h2>
            <GapFigure explanation={gap.explanation} locale={locale} />
            <p className="mt-4 text-[0.82rem] text-soft prose-measure">
              {nl
                ? 'In hydratatiepunten, opgeteld tot het totaal. Zemelen trekken hier de andere kant op: T65 heeft er meer van dan Amerikaanse bread flour, en die binden water.'
                : 'In hydration points, summing to the total. Bran pulls the other way here: T65 has more of it than American bread flour, and bran binds water.'}
            </p>
            <p className="mt-3">
              <Link
                href={path('substitute', locale, 'fr-t65-vs-us-bread-flour')}
                className="text-accent underline underline-offset-2 text-sm"
              >
                {nl ? 'Bekijk de volledige opsplitsing' : 'See the full breakdown'}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ---- DIY designer ---- */}
      <section className="mt-10">
        <div className="border border-accent bg-accentSoft p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-measure">
            <h2 className="font-display text-xl font-semibold">
              {nl ? 'Geen recept nodig — geef je meel, krijg een recept' : 'No recipe needed — give your flour, get a recipe'}
            </h2>
            <p className="mt-1 text-sm text-soft">
              {nl
                ? 'Voer in wat je in huis hebt, uit de database of je eigen zak, en de motor ontwerpt van de grond af een compleet recept dat erbij past.'
                : 'Enter what you have, from the database or your own bag, and the engine designs a complete recipe from scratch to fit it.'}
            </p>
          </div>
          <Link href={path('designer', locale)} className="shrink-0 bg-accent text-paper px-4 py-2.5 font-medium hover:opacity-90">
            {nl ? 'Ontwerp je eigen recept' : 'Design your own recipe'}
          </Link>
        </div>
      </section>

      {/* ---- a sample of the recipes, not all of them ---- */}
      <section className="mt-12">
        <SectionHead
          eyebrow={nl ? 'Recepten' : 'Recipes'}
          title={nl ? 'Twaalf om mee te beginnen' : 'Twelve to start with'}
        >
          {nl
            ? `Een dwarsdoorsnede van de ${RECIPES.length}: vrijstaande ovenbroden, busbroden, verrijkte degen, platbrood en pizza, en wat er gekookt of op de plaat gaat.`
            : `A cross-section of the ${RECIPES.length}: hearth loaves, tin loaves, enriched doughs, flatbread and pizza, and the things that get boiled or griddled.`}
        </SectionHead>

        <CardGrid>
          {featured.map((r) => (
            <li key={r.slug} className="border-b border-r border-rule bg-paper">
              <Link
                href={path('recipes', locale, r.slug)}
                className="group block h-full p-4 hover:bg-raised transition-colors duration-100"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-accent transition-colors duration-100">
                    {r.title[locale]}
                  </h3>
                  <span className="font-mono text-[0.68rem] text-faint tnum shrink-0">
                    {'●'.repeat(r.difficulty)}
                    <span className="text-rule">{'●'.repeat(5 - r.difficulty)}</span>
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-soft">{r.summary[locale]}</p>
                <p className="mt-2 font-mono text-[0.68rem] text-faint tnum">
                  {r.hydration}% · {r.salt}% {nl ? 'zout' : 'salt'} · {r.totalHours} {nl ? 'uur' : 'h'}
                </p>
              </Link>
            </li>
          ))}
        </CardGrid>

        <p className="mt-5">
          <Link
            href={path('recipes', locale)}
            className="inline-block border border-rule px-4 py-2.5 font-medium hover:border-accent hover:text-accent transition-colors duration-100"
          >
            {nl ? `Alle ${RECIPES.length} recepten, met filters →` : `All ${RECIPES.length} recipes, with filters →`}
          </Link>
        </p>
      </section>

      {/* ---- the honesty pitch ---- */}
      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div>
          <SectionHead
            eyebrow={nl ? 'De database' : 'The database'}
            title={nl ? `${FLOURS.length} melen, 13 landen` : `${FLOURS.length} flours, 13 countries`}
          />
          <p className="prose-measure text-soft">
            {nl
              ? `Elk record draagt zijn eigen betrouwbaarheid. Op dit moment staan er ${measured} als gemeten en de rest als geschat, met een foutmarge van ±3 hydratatiepunten. Dat is geen bescheidenheid maar nauwkeurigheid: asgetallen zijn wettelijk vastgelegd en dus feiten, terwijl eiwit en maling van een specifieke zak typische waarden zijn voor een klasse.`
              : `Every record carries its own confidence. Right now ${measured} are marked measured and the rest estimated, with an error band of ±3 hydration points. That is not modesty but accuracy: ash bands are defined in law and are facts, while protein and milling for a given bag are typical values for a class.`}
          </p>
          <p className="mt-3">
            <Link href={path('flours', locale)} className="text-accent underline underline-offset-2">
              {nl ? 'Blader door de meelsoorten' : 'Browse the flours'}
            </Link>
          </p>
        </div>
        <div>
          <SectionHead
            eyebrow={nl ? 'Kalibratie' : 'Calibration'}
            title={nl ? 'Tien minuten, 100 gram meel' : 'Ten minutes, 100 grams of flour'}
          />
          <p className="prose-measure text-soft">
            {nl
              ? 'Meet de wateropname van je eigen zak en het model wordt van jou: die meting overschrijft de schatting voor jouw account, en zodra vijf onafhankelijke metingen het eens zijn, wordt het record voor iedereen "gemeten". Dat is het enige wat deze site op termijn onvervangbaar maakt.'
              : 'Measure the absorption of your own bag and the model becomes yours: that measurement overrides the estimate for your account, and once five independent measurements agree, the record becomes "measured" for everyone. It is the only thing that makes this site irreplaceable over time.'}
          </p>
          <p className="mt-3">
            <Link href={path('calibration', locale)} className="text-accent underline underline-offset-2">
              {nl ? 'Zo werkt het protocol' : 'How the protocol works'}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
