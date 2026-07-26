import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  COUNTRY_NAMES, FLOURS, SPECIES_NAMES, getFlour, nearestFlours, roleScore,
} from '@/data/flours';
import { RECIPES } from '@/data/recipes';
import { SYSTEM_EXPLAINERS, bandFor } from '@/data/content';
import {
  absorptionBreakdown, branFraction, computeBlend, damagedStarch,
  hydrationHeadroom, maxSensibleHydration, proteinAsSold, proteinDryBasis,
} from '@/engine';
import { locales, path, type Locale } from '@/i18n/routing';
import { Callout, ConfidenceBadge, Scroller, SectionHead, Stat } from '@/components/ui';
import { AbsorptionCurve } from '@/components/AbsorptionCurve';

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.flatMap((locale) => FLOURS.map((f) => ({ locale, slug: f.slug })));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const f = getFlour(slug);
  if (!f) return {};
  const nl = locale === 'nl';
  return {
    title: `${f.name} (${f.country})`,
    description: nl
      ? `${f.name}: berekende wateropname ${f.absorption}%, sterkte ${f.strength}/100, fermentatiesnelheid ${f.fermentSpeed}×. Welke recepten erbij passen en waarmee je het kunt vervangen.`
      : `${f.name}: computed absorption ${f.absorption}%, strength ${f.strength}/100, fermentation speed ${f.fermentSpeed}×. Which recipes suit it and what you can substitute.`,
    alternates: {
      canonical: `/${locale}/meel/${slug}`,
      languages: { nl: `/nl/meel/${slug}`, en: `/en/meel/${slug}` },
    },
  };
}

export default async function FlourPage({
  params,
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);

  const flour = getFlour(slug);
  if (!flour) notFound();
  const nl = locale === 'nl';

  const blend = computeBlend([{ flour, fraction: 1 }]);
  const breakdown = absorptionBreakdown(flour);
  const ceiling = maxSensibleHydration(blend);
  const headroom = hydrationHeadroom(blend);
  const band = bandFor(flour.absorption);
  const neighbours = nearestFlours(flour, 6);

  // Which of the ten recipes this flour can actually carry, and in what role.
  const suitable = RECIPES.map((r) => {
    const best = Math.max(...r.flourBlend.map((b) => roleScore(flour, b.role)));
    const roles = r.flourBlend.filter((b) => roleScore(flour, b.role) > -Infinity);
    return { recipe: r, score: best, roles };
  })
    .filter((x) => Number.isFinite(x.score) && x.roles.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <nav className="mb-4 no-print">
        <Link href={path('flours', locale)} className="label hover:text-accent">
          ← {nl ? 'Alle meelsoorten' : 'All flours'}
        </Link>
      </nav>

      <header>
        <p className="label mb-1">
          {COUNTRY_NAMES[flour.country][locale]}
          {flour.designation ? ` · ${flour.designation}` : ''}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{flour.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ConfidenceBadge confidence={flour.confidence} locale={locale} />
          <span className="chip text-faint">{SPECIES_NAMES[flour.species][locale]}</span>
          <span className="chip text-faint">{flour.mill}</span>
          <span className="chip text-faint">
            {Math.round(flour.wholegrain * 100)}% {nl ? 'volkoren' : 'wholegrain'}
          </span>
        </div>
      </header>

      <section className="mt-6 grid gap-px bg-rule border border-rule sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-paper">
          <Stat
            label={nl ? 'Wateropname' : 'Absorption'}
            value={`${flour.absorption}%`}
            sub={nl ? `±${blend.uncertainty} punten` : `±${blend.uncertainty} points`}
          />
        </div>
        <div className="bg-paper">
          <Stat label={nl ? 'Sterkte' : 'Strength'} value={flour.strength} tone="ink"
            sub={nl ? 'van 100' : 'out of 100'} />
        </div>
        <div className="bg-paper">
          <Stat label={nl ? 'Fermentatiesnelheid' : 'Fermentation speed'} value={`${flour.fermentSpeed}×`} tone="ink"
            sub={nl ? '1,0 = witte tarwe' : '1.0 = white wheat'} />
        </div>
        <div className="bg-paper">
          <Stat label={nl ? 'Plafond' : 'Ceiling'} value={`${ceiling}%`} tone="ink"
            sub={nl ? `${headroom} punten speling boven de opname` : `${headroom} points of headroom above absorption`} />
        </div>
      </section>

      {flour.notes ? (
        <section className="mt-6">
          <Callout>{flour.notes[locale]}</Callout>
        </section>
      ) : null}

      {/* absorption curve — unique computed payload */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Berekend' : 'Computed'}
          title={nl ? 'Waar de wateropname vandaan komt' : 'Where the absorption comes from'}
        >
          <p>
            {nl
              ? 'Elke term hieronder is een aparte natuurkundige oorzaak, en ze tellen exact op tot het eindgetal. Dat is wat deze site kan zeggen en een specificatieblad niet: niet alleen hoeveel water dit meel neemt, maar waarom.'
              : 'Each term below is a separate physical cause, and they sum exactly to the final figure. That is what this site can say and a spec sheet cannot: not only how much water this flour takes, but why.'}
          </p>
        </SectionHead>

        <Scroller>
          <table className="datatable min-w-[28rem]">
            <thead>
              <tr>
                <th>{nl ? 'Term' : 'Term'}</th>
                <th className="text-right">{nl ? 'Punten' : 'Points'}</th>
                <th>{nl ? 'Waarom' : 'Why'}</th>
              </tr>
            </thead>
            <tbody>
              <BreakdownRow
                label={nl ? 'Basislijn' : 'Baseline'} value={breakdown.base}
                why={nl ? 'Verfijnde zachte tarwe, 10% eiwit, 5% beschadigd zetmeel.' : 'Refined soft wheat, 10% protein, 5% damaged starch.'} />
              <BreakdownRow
                label={nl ? 'Eiwit' : 'Protein'} value={breakdown.protein}
                why={nl
                  ? `${Math.round(proteinAsSold(flour) * 10) / 10}% zoals verkocht (${Math.round(proteinDryBasis(flour) * 10) / 10}% droge stof); eiwit bindt ongeveer twee keer zijn eigen gewicht.`
                  : `${Math.round(proteinAsSold(flour) * 10) / 10}% as sold (${Math.round(proteinDryBasis(flour) * 10) / 10}% dry); protein binds about twice its own weight.`} />
              <BreakdownRow
                label={nl ? 'Zemelen en pentosanen' : 'Bran and pentosans'} value={breakdown.bran}
                why={nl
                  ? `${Math.round(branFraction(flour) * 1000) / 10}% zemelfractie; pentosanen binden tot vijftien keer hun gewicht.`
                  : `${Math.round(branFraction(flour) * 1000) / 10}% bran fraction; pentosans bind up to fifteen times their weight.`} />
              <BreakdownRow
                label={nl ? 'Beschadigd zetmeel' : 'Damaged starch'} value={breakdown.damagedStarch}
                why={nl
                  ? `${Math.round(damagedStarch(flour) * 10) / 10}%${flour.damagedStarch === undefined ? ' (geschat uit maling × hardheid)' : ''}; beschadigde korrels binden tot tien keer zoveel als hele.`
                  : `${Math.round(damagedStarch(flour) * 10) / 10}%${flour.damagedStarch === undefined ? ' (estimated from mill × hardness)' : ''}; damaged granules bind up to ten times what intact ones do.`} />
              <BreakdownRow
                label={nl ? 'Hardheid' : 'Hardness'} value={breakdown.hardness}
                why={nl ? `Geclassificeerd als ${flour.hardness}.` : `Classified as ${flour.hardness}.`} />
              {breakdown.additives !== 0 ? (
                <BreakdownRow label={nl ? 'Toevoegingen' : 'Additives'} value={breakdown.additives}
                  why={flour.additives.join(', ')} />
              ) : null}
              {breakdown.species !== 0 ? (
                <BreakdownRow
                  label={nl ? 'Graansoort' : 'Species'} value={breakdown.species}
                  why={nl
                    ? `${SPECIES_NAMES[flour.species].nl}: het gluten is oplosbaarder en houdt minder water vast dan tarwe.`
                    : `${SPECIES_NAMES[flour.species].en}: the gluten is more soluble and holds less water than wheat.`} />
              ) : null}
              <tr className="border-t-2 border-ruleStrong">
                <td className="font-medium">{nl ? 'Totaal' : 'Total'}</td>
                <td className="text-right font-mono tnum text-accent font-medium">{flour.absorption}%</td>
                <td className="text-[0.8rem] text-soft">
                  {nl ? `Bandbreedte ±${blend.uncertainty} punten.` : `Band ±${blend.uncertainty} points.`}
                </td>
              </tr>
            </tbody>
          </table>
        </Scroller>

        <div className="mt-6">
          <h3 className="label mb-2">
            {nl ? 'Hydratatiecurve: hoe dit meel zich gedraagt bij een aandeel in de mix' : 'Absorption curve: how this flour behaves as a share of the blend'}
          </h3>
          <AbsorptionCurve flour={flour} locale={locale} />
        </div>
      </section>

      {/* what this means in practice */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'In de praktijk' : 'In practice'}
          title={
            nl
              ? `Op 100% van dit meel zit je in het bereik "${band.label.nl.toLowerCase()}"`
              : `At 100% of this flour you are in the "${band.label.en.toLowerCase()}" range`
          }
        />
        <div className="prose-measure grid gap-3 text-soft">
          <p>{band.feel[locale]}</p>
          <p>{band.handling[locale]}</p>
          <p>
            {nl
              ? `Het plafond van dit meel ligt rond ${ceiling}%: ${headroom} punten boven de berekende opname. Daarboven vloeit het deeg bij het vormen in plaats van zijn vorm te houden. Bij een sterkte van ${flour.strength} `
              : `This flour's ceiling sits near ${ceiling}%: ${headroom} points above its computed absorption. Above that the dough flows when you shape it rather than holding form. At strength ${flour.strength}, `}
            {flour.strength < 22
              ? nl ? 'houdt het geen vrijstaande vorm — gebruik een busvorm.' : 'it will not hold a free-standing shape — use a tin.'
              : flour.strength < 52
                ? nl ? 'kun je een boule vormen maar geen bâtard.' : 'you can shape a boule but not a bâtard.'
                : nl ? 'kun je strak vormen en verdraagt het deeg slap-and-fold.' : 'you can shape tightly and the dough will take slap-and-fold.'}
          </p>
          <p>{SYSTEM_EXPLAINERS[flour.system][locale]}</p>
          {flour.sourceNote ? (
            <p className="text-[0.85rem]">
              <span className="label">{nl ? 'Herkomst van de cijfers' : 'Provenance'}: </span>
              {flour.sourceNote}
            </p>
          ) : null}
        </div>
      </section>

      {/* recipes */}
      {suitable.length > 0 ? (
        <section className="mt-10">
          <SectionHead
            eyebrow={nl ? 'Recepten' : 'Recipes'}
            title={nl ? 'Wat je hiermee kunt bakken' : 'What you can bake with it'}
          />
          <ul className="grid gap-2">
            {suitable.map(({ recipe, roles }) => (
              <li key={recipe.slug} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
                <Link href={path('recipes', locale, recipe.slug)} className="text-accent hover:underline">
                  {recipe.title[locale]}
                </Link>
                <span className="font-mono text-[0.7rem] text-faint">
                  {nl ? 'als ' : 'as '}
                  {roles.map((r) => `${r.pct}% ${r.role}`).join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* substitutes */}
      <section className="mt-10">
        <SectionHead
          eyebrow={nl ? 'Vervangen' : 'Substitute'}
          title={nl ? 'Waarmee je dit kunt vervangen' : 'What you can swap it for'}
        >
          <p>
            {nl
              ? 'Gerangschikt op hoe dicht het gedrag ligt, niet op hoe het heet. Het verschil in wateropname staat erbij, en dat is het getal dat je moet aanpassen.'
              : 'Ranked by how close the behaviour is, not by what it is called. The absorption difference is shown, and that is the number you have to adjust.'}
          </p>
        </SectionHead>
        <ul className="grid gap-2">
          {neighbours.map((n) => {
            const d = Math.round((n.absorption - flour.absorption) * 10) / 10;
            return (
              <li key={n.slug} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
                <Link
                  href={path('substitute', locale, `${flour.slug}-vs-${n.slug}`)}
                  className="text-accent hover:underline"
                >
                  {n.name} <span className="text-faint">({n.country})</span>
                </Link>
                <span className="font-mono text-[0.72rem] tnum text-faint">
                  {d > 0 ? '+' : ''}{d} {nl ? 'punten water' : 'points of water'} ·{' '}
                  {d > 0 ? '+' : ''}{Math.round(d * 10)} g/kg
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {(flour.availableIn ?? []).length > 0 ? (
        <section className="mt-10">
          <SectionHead eyebrow={nl ? 'Verkrijgbaarheid' : 'Availability'} title={nl ? 'Waar te koop' : 'Where to buy'} />
          <p className="prose-measure text-soft">
            {nl ? 'Realistisch verkrijgbaar in: ' : 'Realistically available in: '}
            {(flour.availableIn ?? []).map((c) => COUNTRY_NAMES[c][locale]).join(', ')}.
          </p>
        </section>
      ) : null}
    </div>
  );
}

function BreakdownRow({ label, value, why }: { label: string; value: number; why: string }) {
  return (
    <tr>
      <td>{label}</td>
      <td className="text-right font-mono tnum">
        {value > 0 ? '+' : ''}{Math.round(value * 10) / 10}
      </td>
      <td className="text-[0.8rem] text-soft">{why}</td>
    </tr>
  );
}
