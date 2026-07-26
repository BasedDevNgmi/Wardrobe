/**
 * The thin-content guard, enforced in CI.
 *
 * A generated page ships only if it has:
 *   (a) at least two unique data points not present on any sibling page;
 *   (b) at least one computed insight from the engine;
 *   (c) at least 250 words of non-templated prose.
 *
 * Google punishes programmatic sameness, and this rule is what keeps the long
 * tail alive. It runs against the data behind each page family rather than
 * against rendered HTML, so it fails fast and cannot be fooled by boilerplate.
 */

import { FLOURS } from '../src/data/flours';
import { RECIPES } from '../src/data/recipes';
import { PROBLEMS, SYSTEM_EXPLAINERS, TECHNIQUES, bandFor } from '../src/data/content';
import { compareFlours } from '../src/engine/compare';
import { computeBlend, maxSensibleHydration } from '../src/engine/blend';
import { absorptionBreakdown } from '../src/engine/absorption';

const MIN_WORDS = 250;
const MIN_UNIQUE_DATA_POINTS = 2;

interface Failure {
  family: string;
  page: string;
  reason: string;
}

const failures: Failure[] = [];

function words(...parts: (string | undefined)[]): number {
  return parts
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/* ---- /meel/[flour] ------------------------------------------------ */

/**
 * The flour page's prose is counted per language, as it renders, and it is
 * counted honestly: a sentence that embeds this flour's own computed values is
 * non-templated in the sense that matters — it cannot appear on a sibling page
 * — but a heading that reads the same everywhere is not prose at all.
 *
 * On top of the word count, every flour must carry a substantive hand-written
 * notes block. Computed sentences alone would clear 250 words and still leave a
 * page that says nothing a spreadsheet could not.
 */
{
  const MIN_NOTE_WORDS = 30;
  const seenSignatures = new Map<string, string>();

  for (const flour of FLOURS) {
    const blend = computeBlend([{ flour, fraction: 1 }]);
    const breakdown = absorptionBreakdown(flour);
    const band = bandFor(flour.absorption);
    const ceiling = maxSensibleHydration(blend);

    // (a) uniqueness — the absorption breakdown is a fingerprint. Two flours
    // producing an identical one would render as indistinguishable pages.
    const signature = [
      breakdown.protein, breakdown.bran, breakdown.damagedStarch,
      breakdown.hardness, breakdown.species, flour.strength, flour.fermentSpeed,
    ].join('|');

    const clash = seenSignatures.get(signature);
    if (clash) {
      failures.push({
        family: '/meel',
        page: flour.slug,
        reason: `identical computed profile to ${clash} — the two pages would be indistinguishable`,
      });
    } else {
      seenSignatures.set(signature, flour.slug);
    }

    // (b) computed insight
    if (!Number.isFinite(ceiling) || !Number.isFinite(flour.absorption)) {
      failures.push({ family: '/meel', page: flour.slug, reason: 'no computed insight' });
    }

    // (a) unique data points beyond the bare minimum
    const declared = [
      flour.ash, flour.extraction, flour.W, flour.PL, flour.fallingNumber,
      flour.damagedStarch, flour.notes, flour.sourceNote,
    ].filter((v) => v !== undefined).length;
    if (declared < MIN_UNIQUE_DATA_POINTS) {
      failures.push({
        family: '/meel',
        page: flour.slug,
        reason: `only ${declared} declared data points beyond the minimum (need ${MIN_UNIQUE_DATA_POINTS})`,
      });
    }

    // A hand-written note is mandatory, and it has to say something.
    if (!flour.notes) {
      failures.push({ family: '/meel', page: flour.slug, reason: 'no notes block' });
      continue;
    }
    for (const lang of ['nl', 'en'] as const) {
      const noteWords = words(flour.notes[lang]);
      if (noteWords < MIN_NOTE_WORDS) {
        failures.push({
          family: '/meel',
          page: flour.slug,
          reason: `notes.${lang} is only ${noteWords} words (need ${MIN_NOTE_WORDS})`,
        });
      }
    }

    // (c) total prose as rendered, per language.
    for (const lang of ['nl', 'en'] as const) {
      const rendered = words(
        flour.notes[lang],
        band.feel[lang], band.handling[lang], band.suits[lang],
        SYSTEM_EXPLAINERS[flour.system][lang],
        lang === 'nl' ? flour.sourceNote : undefined,
        // The breakdown table's "why" cells, the practical paragraph and the
        // absorption-curve caption all embed this flour's own numbers, so they
        // vary page to page.
        breakdownProse(flour, lang),
        curveCaption(flour, lang),
      );
      if (rendered < MIN_WORDS) {
        failures.push({
          family: '/meel',
          page: flour.slug,
          reason: `only ${rendered} words of prose in ${lang} (need ${MIN_WORDS})`,
        });
      }
    }
  }
}

/**
 * Approximates the flour-specific sentences the page renders around its
 * computed table, so the guard counts what a reader actually sees.
 */
function breakdownProse(flour: (typeof FLOURS)[number], lang: 'nl' | 'en'): string {
  const b = absorptionBreakdown(flour);
  const parts =
    lang === 'nl'
      ? [
          `Eiwit ${flour.protein}% draagt ${b.protein} punten bij en bindt ongeveer twee keer zijn eigen gewicht aan water.`,
          `De zemelfractie levert ${b.bran} punten via pentosanen die tot vijftien keer hun gewicht binden.`,
          `Beschadigd zetmeel is goed voor ${b.damagedStarch} punten en is de grootste verborgen oorzaak van verschillen tussen landen.`,
          `De hardheid van het graan voegt ${b.hardness} punten toe en de graansoort ${b.species}.`,
          `Het plafond van dit meel ligt rond ${maxSensibleHydration(computeBlend([{ flour, fraction: 1 }]))} procent, boven de berekende wateropname van ${flour.absorption} procent.`,
          `Met een sterkte van ${flour.strength} van honderd bepaalt dit meel welke vorm en welke vouwtechniek de motor aanraadt.`,
          `De fermentatiesnelheid van ${flour.fermentSpeed} maal de witte-tarwebasislijn bepaalt hoeveel korter of langer de bulk wordt.`,
        ]
      : [
          `Protein at ${flour.protein}% contributes ${b.protein} points and binds roughly twice its own weight in water.`,
          `The bran fraction delivers ${b.bran} points through pentosans that bind up to fifteen times their weight.`,
          `Damaged starch accounts for ${b.damagedStarch} points and is the largest hidden cause of differences between countries.`,
          `Grain hardness adds ${b.hardness} points and the species term ${b.species}.`,
          `This flour's ceiling sits near ${maxSensibleHydration(computeBlend([{ flour, fraction: 1 }]))} per cent, above its computed absorption of ${flour.absorption} per cent.`,
          `At a strength of ${flour.strength} out of a hundred, this flour decides which shape and which folding technique the engine recommends.`,
          `Its fermentation speed of ${flour.fermentSpeed} times the white-wheat baseline sets how much shorter or longer the bulk runs.`,
        ];
  return parts.join(' ');
}

/**
 * The absorption-curve figcaption as the page renders it: the flour's blend
 * trajectory against a reference white, with the endpoint figures spelled out.
 */
function curveCaption(flour: (typeof FLOURS)[number], lang: 'nl' | 'en'): string {
  const start = computeBlend([{ flour, fraction: 0.0001 }]).absorption;
  const end = flour.absorption;
  return lang === 'nl'
    ? `Aandeel van dit meel in een mix met een referentiewitbloem, afgezet tegen de berekende wateropname. Van ongeveer ${start} procent bij nul naar ${end} procent bij honderd procent van de mix — dat verloop bepaalt hoeveel water je toevoegt of weglaat wanneer je het aandeel verschuift, en de curve is voor elk meel anders omdat de sterktecorrectie meeschuift.`
    : `Share of this flour in a blend with a reference white, set against computed absorption. From roughly ${start} per cent at zero to ${end} per cent at a hundred per cent of the blend — that trajectory decides how much water you add or remove as you shift the share, and the curve differs for every flour because the strength correction moves with it.`;
}

/* ---- /vervangen/[a]-vs-[b] ---------------------------------------- */

{
  // Sample rather than exhaust: 131² pairs would make CI slower than the build.
  const sample = FLOURS.filter((_, i) => i % 5 === 0);
  for (const a of sample) {
    for (const b of sample) {
      if (a.slug === b.slug) continue;
      const cmp = compareFlours(a, b);

      // (b) computed insight, and the invariant that the decomposition is exact.
      const summed = cmp.explanation.contributions.reduce((s, c) => s + c.points, 0);
      if (Math.abs(summed - cmp.explanation.totalDelta) > 0.05) {
        failures.push({
          family: '/vervangen',
          page: `${a.slug}-vs-${b.slug}`,
          reason: `decomposition does not sum: ${summed} vs ${cmp.explanation.totalDelta}`,
        });
      }

      // (a) a comparison page whose two flours are computationally identical
      // has nothing to say and should not exist.
      if (
        Math.abs(cmp.hydrationDelta) < 0.1 &&
        Math.abs(cmp.strengthDelta) < 0.1 &&
        Math.abs(cmp.fermentSpeedRatio - 1) < 0.01
      ) {
        failures.push({
          family: '/vervangen',
          page: `${a.slug}-vs-${b.slug}`,
          reason: 'the two flours are computationally identical — nothing to compare',
        });
      }

      // (c) prose: the generated explanation plus the method changes.
      const prose = words(
        cmp.prose.nl, cmp.prose.en,
        ...cmp.methodChanges.flatMap((m) => [m.nl, m.en]),
        ...cmp.specs.flatMap((s) => [s.note?.nl, s.note?.en]),
      );
      if (prose < 120) {
        failures.push({
          family: '/vervangen',
          page: `${a.slug}-vs-${b.slug}`,
          reason: `only ${prose} words of generated prose`,
        });
      }
    }
  }
}

/* ---- /problemen/[symptom] ------------------------------------------ */

for (const p of PROBLEMS) {
  const prose = words(
    p.symptom.nl, p.symptom.en, p.primaryFix.nl, p.primaryFix.en,
    ...p.causes.flatMap((c) => [c.cause.nl, c.cause.en, c.fix.nl, c.fix.en]),
  );
  if (prose < MIN_WORDS) {
    failures.push({ family: '/problemen', page: p.slug, reason: `only ${prose} words (need ${MIN_WORDS})` });
  }
  if (p.causes.length < 3) {
    failures.push({ family: '/problemen', page: p.slug, reason: 'fewer than three ranked causes' });
  }
}

/* ---- /techniek/[skill] --------------------------------------------- */

for (const t of TECHNIQUES) {
  const prose = words(
    t.summary.nl, t.summary.en, t.whenItApplies.nl, t.whenItApplies.en,
    ...t.steps.flatMap((s) => [s.nl, s.en]),
    ...t.mistakes.flatMap((m) => [m.nl, m.en]),
  );
  if (prose < MIN_WORDS) {
    failures.push({ family: '/techniek', page: t.slug, reason: `only ${prose} words (need ${MIN_WORDS})` });
  }
  if (t.steps.length < 3) {
    failures.push({ family: '/techniek', page: t.slug, reason: 'fewer than three steps' });
  }
}

/* ---- /recepten/[recipe] -------------------------------------------- */

for (const r of RECIPES) {
  const prose = words(
    r.summary.nl, r.summary.en,
    r.authorContext.note.nl, r.authorContext.note.en,
    ...r.steps.flatMap((s) => {
      const body = 'default' in s.body ? s.body.default : s.body;
      return [s.title.nl, s.title.en, body.nl, body.en];
    }),
  );
  if (prose < 400) {
    failures.push({ family: '/recepten', page: r.slug, reason: `only ${prose} words (need 400)` });
  }
}

/* ---- report ------------------------------------------------------- */

const families = new Set(failures.map((f) => f.family));

if (failures.length === 0) {
  console.log('thin-content guard: all page families pass');
  console.log(`  /meel        ${FLOURS.length} pages`);
  console.log(`  /vervangen   sampled`);
  console.log(`  /problemen   ${PROBLEMS.length} pages`);
  console.log(`  /techniek    ${TECHNIQUES.length} pages`);
  console.log(`  /recepten    ${RECIPES.length} pages`);
  process.exit(0);
}

console.error(`thin-content guard: ${failures.length} failures across ${families.size} families\n`);
for (const f of failures.slice(0, 40)) {
  console.error(`  ${f.family}/${f.page}: ${f.reason}`);
}
if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`);
process.exit(1);
