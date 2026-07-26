import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { CALIBRATION_PROTOCOL, CONSENSUS_THRESHOLD, MAX_CONSENSUS_SPREAD } from '@/engine/calibration';
import { FLOURS } from '@/data/flours';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, SectionHead, Stat } from '@/components/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const nl = locale === 'nl';
  return {
    title: nl ? 'Kalibratie' : 'Calibration',
    description: nl
      ? 'Meet de wateropname van je eigen zak meel in tien minuten. Die meting overschrijft het model voor jou, en met genoeg overeenstemming voor iedereen.'
      : 'Measure your own bag\'s absorption in ten minutes. That measurement overrides the model for you, and with enough agreement, for everyone.',
    alternates: { canonical: `/${locale}/kalibratie`, languages: { nl: '/nl/kalibratie', en: '/en/kalibratie' } },
  };
}

export default async function CalibrationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const nl = locale === 'nl';

  const measured = FLOURS.filter((f) => f.confidence === 'measured').length;
  const estimated = FLOURS.filter((f) => f.confidence === 'estimated').length;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{nl ? 'Kalibratie' : 'Calibration'}</h1>
      <p className="mt-3 text-lg text-soft prose-measure">
        {nl
          ? 'Tien minuten, honderd gram meel en een weegschaal. Daarna weet je wat jouw zak echt opneemt, en weten wij het ook.'
          : 'Ten minutes, a hundred grams of flour and a scale. After that you know what your bag really takes up, and so do we.'}
      </p>

      <section className="mt-6 grid gap-px bg-rule border border-rule sm:grid-cols-3">
        <div className="bg-paper">
          <Stat label={nl ? 'Gemeten' : 'Measured'} value={measured}
            sub={nl ? 'melen met echte metingen' : 'flours with real measurements'} />
        </div>
        <div className="bg-paper">
          <Stat label={nl ? 'Geschat' : 'Estimated'} value={estimated} tone="ink"
            sub={nl ? 'wachtend op metingen, ±3 punten' : 'awaiting measurement, ±3 points'} />
        </div>
        <div className="bg-paper">
          <Stat label={nl ? 'Nodig per meel' : 'Needed per flour'} value={CONSENSUS_THRESHOLD} tone="ink"
            sub={nl ? `binnen ${MAX_CONSENSUS_SPREAD} punten van elkaar` : `within ${MAX_CONSENSUS_SPREAD} points of each other`} />
        </div>
      </section>

      <section className="mt-8">
        <Callout label={nl ? 'Waarom dit ertoe doet' : 'Why this matters'}>
          <p>
            {nl
              ? 'Als het model zegt "geschat, ±3, en hier is waarom" in plaats van een decimaal te doen alsof, kunnen bakkers het vertrouwen — en als ze het vertrouwen, voeren ze het hun eigen metingen. Die terugkoppeling is het enige wat deze site op termijn onvervangbaar maakt. Alles anders is een functie; dit is het product.'
              : 'When the model says "estimated, ±3, and here is why" instead of faking a decimal place, bakers can trust it — and when they trust it, they feed it their own measurements. That loop is the only thing that makes this site irreplaceable over time. Everything else is a feature; this is the product.'}
          </p>
        </Callout>
      </section>

      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Protocol' : 'Protocol'}
          title={nl ? 'Het experiment' : 'The experiment'}
        >
          <p>
            {nl
              ? 'Werk met één meelsoort tegelijk. Een mix meet niets bruikbaars, want je weet daarna niet welk bestanddeel het water nam.'
              : 'Work with one flour at a time. A blend measures nothing useful, because afterwards you cannot say which component took the water.'}
          </p>
        </SectionHead>
        <ol className="grid gap-3">
          {CALIBRATION_PROTOCOL.map((s, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-mono text-sm text-accent tnum pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="prose-measure">{s[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Wat er daarna gebeurt' : 'What happens next'}
          title={nl ? 'Van jouw meting naar het model' : 'From your measurement to the model'}
        />
        <div className="prose-measure grid gap-3 text-soft">
          <p>
            {nl
              ? 'Jouw meting overschrijft het modelgetal onmiddellijk, maar alleen voor jou: elk recept op de site rekent daarna met jouw waarde voor dat meel, en de betrouwbaarheid wordt "gemeten ±1".'
              : 'Your measurement overrides the model figure immediately, but only for you: every recipe on the site then computes with your value for that flour, and the confidence becomes "measured ±1".'}
          </p>
          <p>
            {nl
              ? `Voor het publieke record ligt de lat hoger. Pas als ${CONSENSUS_THRESHOLD} onafhankelijke metingen binnen ${MAX_CONSENSUS_SPREAD} punten van elkaar liggen, gaat het meel van "geschat" naar "gemeten" voor iedereen. De mediaan telt, niet het gemiddelde: één bakker die zich vertypt in het watergewicht mag een gepubliceerd getal niet verschuiven.`
              : `The public record has a higher bar. Only when ${CONSENSUS_THRESHOLD} independent measurements fall within ${MAX_CONSENSUS_SPREAD} points of each other does a flour move from "estimated" to "measured" for everyone. The median counts, not the mean: one baker who mistypes a water weight should not move a published number.`}
          </p>
          <p>
            {nl
              ? 'Metingen die meer dan zes punten van de mediaan afliggen worden als uitschieter behandeld en tellen niet mee. Dat is geen oordeel over jouw bakwerk — het is hoe je een dataset opbouwt waar iemand anders op kan bouwen.'
              : 'Measurements more than six points from the median are treated as outliers and do not count. That is not a judgement on your baking — it is how you build a dataset someone else can build on.'}
          </p>
          <p>
            {nl
              ? 'De methode wordt meegewogen. Met de hand kneden leest structureel een paar punten laag, omdat mensen stoppen wanneer het deeg niet meer nát aanvoelt en dat eerder is dan wanneer het stopt met opnemen. Dat verschil corrigeren we in plaats van te doen alsof elk protocol gelijk is.'
              : 'The method is accounted for. Hand-kneading reads a couple of points low, because people stop when the dough stops feeling wet and that comes before it stops absorbing. We correct for that rather than pretending every protocol is equal.'}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Bijdragen' : 'Contribute'}
          title={nl ? 'Welke melen we het hardst nodig hebben' : 'The flours we need most'}
        />
        <p className="prose-measure text-soft">
          {nl
            ? `Op dit moment staan er ${estimated} melen als geschat. De grootste winst zit bij melen die veel gebruikt worden en waar het model het minst zeker is: ambachtelijk gemalen volkoren, streekmelen en alles wat op steen is gemalen — daar varieert het beschadigde zetmeel het sterkst per molen.`
            : `Right now ${estimated} flours are marked estimated. The biggest gains are on flours that get used a lot and where the model is least sure: artisan wholemeal, regional flours, and anything stone-milled — that is where damaged starch varies most from mill to mill.`}
        </p>
        <p className="mt-3">
          <Link href={path('flours', locale)} className="text-accent underline underline-offset-2">
            {nl ? 'Bekijk de meelsoorten' : 'Browse the flours'}
          </Link>
        </p>
      </section>
    </div>
  );
}
