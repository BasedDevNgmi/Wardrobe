/**
 * Flour-vs-flour comparison. Powers `/vervangen/[a]-vs-[b]`, and every number
 * on those pages has to be computed — a side-by-side spec table alone is thin
 * content and Google is right to treat it that way.
 */

import { absorptionBreakdown, damagedStarch, branFraction, proteinAsSold, proteinDryBasis } from './absorption';
import { computeBlend } from './blend';
import { explainGap, explainGapProse } from './explain';
import type { Flour, GapExplanation } from './types';
import { round } from './util';

export interface FlourComparison {
  a: Flour;
  b: Flour;
  /** Hydration points b wants relative to a. Negative = b is thirstier... no: positive = b drinks more. */
  hydrationDelta: number;
  /** Grams of water to add or remove on a 1 kg flour formula. */
  gramsPerKilo: number;
  strengthDelta: number;
  fermentSpeedRatio: number;
  /** How much shorter/longer bulk becomes, as a percentage. */
  bulkTimeDelta: number;
  explanation: GapExplanation;
  prose: { nl: string; en: string };
  methodChanges: { nl: string; en: string }[];
  /** Normalised spec rows, ready to render. */
  specs: SpecRow[];
  substitutable: 'drop-in' | 'adjust' | 'different-bread';
}

export interface SpecRow {
  key: string;
  label: { nl: string; en: string };
  a: string;
  b: string;
  /** Signed numeric difference where one is meaningful. */
  delta?: number;
  note?: { nl: string; en: string };
}

export function compareFlours(a: Flour, b: Flour): FlourComparison {
  const blendA = computeBlend([{ flour: a, fraction: 1 }]);
  const blendB = computeBlend([{ flour: b, fraction: 1 }]);

  const hydrationDelta = round(blendB.absorption - blendA.absorption, 1);
  const strengthDelta = round(b.strength - a.strength, 1);
  const fermentSpeedRatio = round(b.fermentSpeed / a.fermentSpeed, 3);
  const bulkTimeDelta = round((1 / fermentSpeedRatio - 1) * 100, 1);

  const explanation = explainGap(blendA, blendB, 0);

  return {
    a,
    b,
    hydrationDelta,
    gramsPerKilo: round(hydrationDelta * 10, 0),
    strengthDelta,
    fermentSpeedRatio,
    bulkTimeDelta,
    explanation,
    prose: {
      nl: explainGapProse(explanation, 'nl'),
      en: explainGapProse(explanation, 'en'),
    },
    methodChanges: methodChanges(a, b, hydrationDelta, strengthDelta, fermentSpeedRatio),
    specs: specRows(a, b),
    substitutable: classify(hydrationDelta, strengthDelta, a, b),
  };
}

function classify(
  hydrationDelta: number,
  strengthDelta: number,
  a: Flour,
  b: Flour,
): FlourComparison['substitutable'] {
  if (a.species !== b.species && (a.species === 'rye' || b.species === 'rye')) return 'different-bread';
  if (Math.abs(hydrationDelta) <= 1.5 && Math.abs(strengthDelta) <= 8) return 'drop-in';
  if (Math.abs(hydrationDelta) <= 6 && Math.abs(strengthDelta) <= 25) return 'adjust';
  return 'different-bread';
}

function methodChanges(
  a: Flour,
  b: Flour,
  hydrationDelta: number,
  strengthDelta: number,
  fermentRatio: number,
): { nl: string; en: string }[] {
  const out: { nl: string; en: string }[] = [];

  if (Math.abs(hydrationDelta) >= 1.5) {
    const g = Math.abs(round(hydrationDelta * 10, 0));
    out.push(
      hydrationDelta > 0
        ? {
            nl: `Voeg ${g} g water per kilo bloem toe. Doe dat als bassinage, na het eerste vouwmoment, niet in één keer bij de mix.`,
            en: `Add ${g} g of water per kilo of flour. Do it as bassinage, after the first fold, not all at once in the mix.`,
          }
        : {
            nl: `Haal ${g} g water per kilo bloem weg. Houd het achter in plaats van het later te moeten compenseren met bloem.`,
            en: `Take ${g} g of water per kilo of flour out. Hold it back rather than compensating with extra flour later.`,
          },
    );
  }

  if (strengthDelta <= -15) {
    out.push({
      nl: 'Minder vouwen en zachter vouwen: coil folds in plaats van slap-and-fold. Dit deeg scheurt eerder dan het rekt.',
      en: 'Fold less and fold softer: coil folds instead of slap-and-fold. This dough tears before it stretches.',
    });
    out.push({
      nl: 'Vorm als boule in plaats van bâtard, en gebruik een rijsmandje in plaats van vrij op een plaat.',
      en: 'Shape as a boule rather than a bâtard, and use a banneton rather than free-standing on a tray.',
    });
  } else if (strengthDelta >= 15) {
    out.push({
      nl: 'Je kunt strakker vormen en langer bulken; dit deeg heeft meer marge dan waar je aan gewend bent.',
      en: 'You can shape tighter and bulk longer; this dough has more margin than you are used to.',
    });
  }

  if (fermentRatio >= 1.15) {
    out.push({
      nl: `De bulk gaat ongeveer ${Math.round((1 - 1 / fermentRatio) * 100)}% sneller. Stel je timers opnieuw in en beoordeel op volume.`,
      en: `Bulk runs about ${Math.round((1 - 1 / fermentRatio) * 100)}% faster. Reset your timers and judge by volume.`,
    });
  } else if (fermentRatio <= 0.88) {
    out.push({
      nl: `De bulk duurt ongeveer ${Math.round((1 / fermentRatio - 1) * 100)}% langer. Plan de dag opnieuw of zet het deeg warmer.`,
      en: `Bulk takes about ${Math.round((1 / fermentRatio - 1) * 100)}% longer. Replan the day or keep the dough warmer.`,
    });
  }

  if (a.species !== b.species) {
    out.push({
      nl: `Andere graansoort (${a.species} → ${b.species}): het gluten gedraagt zich anders, niet alleen minder. Stop de bulk bij 60–70% volumetoename in plaats van bij verdubbeling.`,
      en: `Different species (${a.species} → ${b.species}): the gluten behaves differently, not merely less. End bulk at 60–70% volume increase rather than at doubling.`,
    });
  }

  if (a.mill !== b.mill) {
    out.push({
      nl: `Andere maling (${a.mill} → ${b.mill}). Dat verandert het beschadigde zetmeel en dus de wateropname én de kleur van de kruim.`,
      en: `Different milling (${a.mill} → ${b.mill}). That changes damaged starch, and therefore both water uptake and crumb colour.`,
    });
  }

  if (out.length === 0) {
    out.push({
      nl: 'Geen methodewijziging nodig — dit is een echte één-op-één vervanging.',
      en: 'No method change needed — this is a genuine one-for-one swap.',
    });
  }

  return out;
}

function specRows(a: Flour, b: Flour): SpecRow[] {
  const rows: SpecRow[] = [];
  const fmt = (n: number | undefined, unit = '', digits = 1) =>
    typeof n === 'number' ? `${round(n, digits)}${unit}` : '—';

  rows.push({
    key: 'protein-as-sold',
    label: { nl: 'Eiwit (zoals verkocht)', en: 'Protein (as sold)' },
    a: fmt(proteinAsSold(a), '%'),
    b: fmt(proteinAsSold(b), '%'),
    delta: round(proteinAsSold(b) - proteinAsSold(a), 1),
    note:
      a.proteinBasis !== b.proteinBasis
        ? {
            nl: 'Let op: deze twee worden op een andere basis opgegeven (droge stof vs. zoals verkocht). Hier zijn ze naar dezelfde basis omgerekend.',
            en: 'Note: these two are declared on different bases (dry matter vs as sold). They have been normalised here.',
          }
        : undefined,
  });

  rows.push({
    key: 'protein-dry',
    label: { nl: 'Eiwit (droge stof)', en: 'Protein (dry basis)' },
    a: fmt(proteinDryBasis(a), '%'),
    b: fmt(proteinDryBasis(b), '%'),
    delta: round(proteinDryBasis(b) - proteinDryBasis(a), 1),
  });

  rows.push({
    key: 'ash',
    label: { nl: 'As (droge stof)', en: 'Ash (dry matter)' },
    a: fmt(a.ash, '%', 2),
    b: fmt(b.ash, '%', 2),
    note: {
      nl: 'As zegt iets over uitmaling, niet over sterkte. Een T65 is niet sterker dan een T55 omdat het getal hoger is.',
      en: 'Ash speaks to extraction, not to strength. A T65 is not stronger than a T55 because the number is bigger.',
    },
  });

  rows.push({
    key: 'damaged-starch',
    label: { nl: 'Beschadigd zetmeel', en: 'Damaged starch' },
    a: `${round(damagedStarch(a), 1)}%${a.damagedStarch === undefined ? '*' : ''}`,
    b: `${round(damagedStarch(b), 1)}%${b.damagedStarch === undefined ? '*' : ''}`,
    delta: round(damagedStarch(b) - damagedStarch(a), 1),
    note: {
      nl: '* geschat uit maling × hardheid. Dit is de grootste verborgen oorzaak van het verschil tussen Amerikaanse en Europese recepten.',
      en: '* estimated from mill × hardness. This is the single largest hidden cause of the gap between American and European recipes.',
    },
  });

  rows.push({
    key: 'bran',
    label: { nl: 'Zemelfractie', en: 'Bran fraction' },
    a: `${round(branFraction(a) * 100, 1)}%`,
    b: `${round(branFraction(b) * 100, 1)}%`,
    delta: round((branFraction(b) - branFraction(a)) * 100, 1),
  });

  rows.push({
    key: 'absorption',
    label: { nl: 'Berekende wateropname', en: 'Computed absorption' },
    a: fmt(a.absorption, '%'),
    b: fmt(b.absorption, '%'),
    delta: round(b.absorption - a.absorption, 1),
  });

  rows.push({
    key: 'strength',
    label: { nl: 'Sterkte (0–100)', en: 'Strength (0–100)' },
    a: fmt(a.strength, ''),
    b: fmt(b.strength, ''),
    delta: round(b.strength - a.strength, 1),
  });

  rows.push({
    key: 'ferment',
    label: { nl: 'Fermentatiesnelheid', en: 'Fermentation speed' },
    a: `${round(a.fermentSpeed, 2)}×`,
    b: `${round(b.fermentSpeed, 2)}×`,
    delta: round(b.fermentSpeed - a.fermentSpeed, 2),
  });

  rows.push({
    key: 'W',
    label: { nl: 'W (alveograaf)', en: 'W (alveograph)' },
    a: fmt(a.W, '', 0),
    b: fmt(b.W, '', 0),
  });

  rows.push({
    key: 'confidence',
    label: { nl: 'Betrouwbaarheid', en: 'Confidence' },
    a: a.confidence,
    b: b.confidence,
  });

  return rows;
}

/**
 * The counterfactual breakdown behind "how much of this is the milling?".
 * Each entry answers: if only this property changed from a to b, what would
 * happen to absorption?
 */
export function counterfactuals(a: Flour, b: Flour): { key: string; points: number }[] {
  const base = absorptionBreakdown(a).total;
  const swap = <K extends keyof Flour>(key: K) =>
    round(absorptionBreakdown({ ...a, [key]: b[key] } as Flour).total - base, 2);

  return [
    { key: 'protein', points: swap('protein') },
    { key: 'ash', points: swap('ash') },
    { key: 'mill', points: swap('mill') },
    { key: 'hardness', points: swap('hardness') },
    { key: 'species', points: swap('species') },
    { key: 'additives', points: swap('additives') },
  ].filter((c) => Math.abs(c.points) >= 0.05);
}
