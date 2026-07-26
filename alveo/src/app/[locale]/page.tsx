import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { FLOURS, requireFlour } from '@/data/flours';
import { RECIPES } from '@/data/recipes';
import { compareFlours } from '@/engine/compare';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, SectionHead } from '@/components/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  // A live computation on the home page, not a claim: the gap between the
  // reference American flour and the reference French one.
  const gap = compareFlours(requireFlour('fr-t65'), requireFlour('us-bread-flour'));
  const measured = FLOURS.filter((f) => f.confidence === 'measured').length;

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
            ? `Een Amerikaans recept op 85% hydratatie gaat uit van harde rode voorjaarstarwe, walsgemalen, met veel beschadigd zetmeel. Draai dat op Franse T65 of Duitse 550 en je krijgt soep. Alveo slaat elk recept op als formule en rekent hydratatie, timing, techniek en waarschuwingen om naar het meel dat jij in je kast hebt staan.`
            : `An American recipe at 85% hydration assumes hard red spring wheat, roller-milled, with high damaged starch. Run it on French T65 or German 550 and you get soup. Alveo stores every recipe as a formula and recalculates hydration, timing, technique and warnings for the flour you actually own.`}
        </p>
      </section>

      {/* live computed proof */}
      <section className="mt-10">
        <Callout label={nl ? 'Berekend, niet beweerd' : 'Computed, not claimed'}>
          <p>
            {nl
              ? `Amerikaanse bread flour draagt ${Math.abs(gap.hydrationDelta)} punten meer water dan Franse T65 — ${Math.abs(gap.gramsPerKilo)} gram per kilo bloem. `
              : `American bread flour carries ${Math.abs(gap.hydrationDelta)} points more water than French T65 — ${Math.abs(gap.gramsPerKilo)} grams per kilo of flour. `}
            {gap.prose[locale]}
          </p>
          <p className="mt-2">
            <Link
              href={path('substitute', locale, 'fr-t65-vs-us-bread-flour')}
              className="text-accent underline underline-offset-2"
            >
              {nl ? 'Bekijk de volledige opsplitsing' : 'See the full breakdown'}
            </Link>
          </p>
        </Callout>
      </section>

      {/* DIY designer */}
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

      {/* recipes */}
      <section className="mt-12">
        <SectionHead
          eyebrow={nl ? 'Recepten' : 'Recipes'}
          title={nl ? `${RECIPES.length} broden, elk in jouw meel` : `${RECIPES.length} breads, each in your flour`}
        />
        <ul className="grid gap-px bg-rule border border-rule sm:grid-cols-2 lg:grid-cols-3">
          {RECIPES.map((r) => (
            <li key={r.slug} className="bg-paper">
              <Link
                href={path('recipes', locale, r.slug)}
                className="block h-full p-4 hover:bg-raised"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold leading-tight">
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
        </ul>
      </section>

      {/* the honesty pitch */}
      <section className="mt-12 grid gap-8 md:grid-cols-2">
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
