/**
 * Contextual warnings.
 *
 * Every warning must (a) name the physical problem, (b) say what will actually
 * happen, and (c) give one concrete fix. A warning that just says "careful!" is
 * noise and gets deleted.
 */

import { hydrationHeadroom, maxSensibleHydration } from './blend';
import { HYDRATION_MAX, HYDRATION_MIN, PAN_ONLY_STRENGTH } from './constants';
import { enrichment } from './formula';
import { isOutsideModelledRange } from './temperature';
import type { BlendProfile, EngineOptions, Recipe, Warning } from './types';
import { round } from './util';

export interface WarningInput {
  blend: BlendProfile;
  recipe: Recipe;
  hydration: number;
  authorHydration: number;
  options: EngineOptions;
  bulkMinutes: number;
}

export function collectWarnings(input: WarningInput): Warning[] {
  const { blend, recipe, hydration, options } = input;
  const out: Warning[] = [];

  /* ---- structure ---- */
  const structural = blend.components
    .filter((c) => c.flour.strength >= 55 && c.flour.species === 'wheat')
    .reduce((s, c) => s + c.fraction, 0);

  if (blend.strength < PAN_ONLY_STRENGTH && recipe.format !== 'tin' && recipe.format !== 'focaccia') {
    out.push({
      code: 'no-structure',
      level: 'danger',
      message: {
        nl: `Sterkte ${blend.strength} van 100. Dit deeg heeft geen glutennetwerk dat een vrijstaand brood kan dragen.`,
        en: `Strength ${blend.strength} out of 100. This dough has no gluten network capable of carrying a free-standing loaf.`,
      },
      fix: {
        nl: 'Bak in een busvorm, of vervang minstens 20% door een sterke tarwebloem.',
        en: 'Bake in a tin, or swap at least 20% for a strong wheat flour.',
      },
    });
  } else if (structural < 0.3 && blend.glutenPoorFraction > 0.4) {
    out.push({
      code: 'low-structure-flour',
      level: 'caution',
      message: {
        nl: `Slechts ${Math.round(structural * 100)}% van je mix is structuurmeel, terwijl ${Math.round(blend.glutenPoorFraction * 100)}% glutenarm is.`,
        en: `Only ${Math.round(structural * 100)}% of your blend is structural flour, while ${Math.round(blend.glutenPoorFraction * 100)}% is gluten-poor.`,
      },
      fix: {
        nl: 'Reken op een dichtere kruim en een platter brood. Dat is niet fout — het is wat deze mix is.',
        en: 'Expect a denser crumb and a flatter loaf. That is not a failure — it is what this blend is.',
      },
    });
  }

  /* ---- hydration ---- */
  const ceiling = maxSensibleHydration(blend);
  if (hydration > ceiling) {
    out.push({
      code: 'over-wet',
      level: 'danger',
      message: {
        nl: `${hydration}% is ${round(hydration - ceiling, 1)} punten boven wat deze mix kan dragen (max ≈ ${ceiling}%). Het deeg vloeit uit bij het vormen.`,
        en: `${hydration}% is ${round(hydration - ceiling, 1)} points above what this blend can carry (max ≈ ${ceiling}%). The dough will flow when you shape it.`,
      },
      fix: {
        nl: `Zet de veiligheidsmarge op "extra veilig", of ga naar ${ceiling}%.`,
        en: `Switch the safety tier to "super safe", or drop to ${ceiling}%.`,
      },
    });
  } else if (hydration > ceiling - 2) {
    out.push({
      code: 'near-ceiling',
      level: 'caution',
      message: {
        nl: `Je zit binnen 2 punten van het plafond van deze mix (${ceiling}%). Werkbaar, maar er is geen marge voor fouten.`,
        en: `You are within 2 points of this blend's ceiling (${ceiling}%). Workable, but there is no margin for error.`,
      },
      fix: {
        nl: 'Houd 3% van het water achter als bassinage en voeg het pas toe als het deeg het aankan.',
        en: 'Hold 3% of the water back as bassinage and only add it once the dough can take it.',
      },
    });
  }

  if (hydration < blend.absorption - 8) {
    out.push({
      code: 'under-wet',
      level: 'info',
      message: {
        nl: `${hydration}% ligt ver onder wat dit meel aankan (${blend.absorption}%). Het deeg wordt stevig en de kruim dicht.`,
        en: `${hydration}% is well below what this flour can take (${blend.absorption}%). The dough will be stiff and the crumb tight.`,
      },
      fix: {
        nl: 'Prima voor pizza of busbrood; voor een open kruim mag er water bij.',
        en: 'Fine for pizza or a tin loaf; for an open crumb, add water.',
      },
    });
  }

  if (hydration < HYDRATION_MIN || hydration > HYDRATION_MAX) {
    out.push({
      code: 'out-of-range',
      level: 'danger',
      message: {
        nl: `${hydration}% valt buiten het bereik waar dit model iets zinnigs over kan zeggen (${HYDRATION_MIN}–${HYDRATION_MAX}%).`,
        en: `${hydration}% falls outside the range this model can say anything sensible about (${HYDRATION_MIN}–${HYDRATION_MAX}%).`,
      },
    });
  }

  /* ---- enzymes and speed ---- */
  if (blend.enzymeLoad > 0.6) {
    out.push({
      code: 'enzyme-overload',
      level: 'caution',
      message: {
        nl: `Hoge enzymbelasting (${Math.round(blend.enzymeLoad * 100)}%). Dit deeg gaat van perfect naar plakkerig in een half uur en de kruim kan gommig worden.`,
        en: `High enzyme load (${Math.round(blend.enzymeLoad * 100)}%). This dough goes from perfect to slack in half an hour, and the crumb can turn gummy.`,
      },
      fix: {
        nl: 'Kort de bulk in, koel eerder, en bak donkerder dan je gewend bent.',
        en: 'Shorten the bulk, chill earlier, and bake it darker than you are used to.',
      },
    });
  }

  if (blend.tolerance < 30) {
    out.push({
      code: 'narrow-window',
      level: 'caution',
      message: {
        nl: `Tolerantie ${blend.tolerance}/100: het "klaar"-venster van deze mix is smal. Twintig minuten te laat is zichtbaar in de kruim.`,
        en: `Tolerance ${blend.tolerance}/100: this blend's "done" window is narrow. Twenty minutes late shows up in the crumb.`,
      },
      fix: {
        nl: 'Zet een timer op elk vouwmoment en beoordeel het deeg, niet de klok.',
        en: 'Set a timer at every fold and judge the dough, not the clock.',
      },
    });
  }

  /* ---- fragility ---- */
  if (blend.glutenPoorFraction > 0.5 && input.recipe.format !== 'tin') {
    out.push({
      code: 'fragile-blend',
      level: 'caution',
      message: {
        nl: `${Math.round(blend.glutenPoorFraction * 100)}% van deze mix vormt geen gluten. Vouwen doet hier weinig; de structuur komt van de zetmeelgel.`,
        en: `${Math.round(blend.glutenPoorFraction * 100)}% of this blend forms no gluten. Folding achieves little here; the structure comes from the starch gel.`,
      },
      fix: {
        nl: 'Behandel het als roggedeeg: nat, in de vorm, glad strijken en laten rijzen.',
        en: 'Treat it like rye dough: wet, into the tin, smoothed flat and left to rise.',
      },
    });
  }

  /* ---- ancient grains ---- */
  const ancient = blend.components.filter((c) =>
    ['spelt', 'einkorn', 'emmer', 'khorasan'].includes(c.flour.species),
  );
  const ancientFraction = ancient.reduce((s, c) => s + c.fraction, 0);
  if (ancientFraction > 0.3) {
    out.push({
      code: 'ancient-grain',
      level: 'info',
      message: {
        nl: `${Math.round(ancientFraction * 100)}% oergraan. Het gluten is oplosbaarder: overkneden en overrijzen gebeuren allebei eerder dan bij tarwe.`,
        en: `${Math.round(ancientFraction * 100)}% ancient grain. The gluten is more soluble: both over-mixing and over-proofing arrive sooner than with wheat.`,
      },
      fix: {
        nl: 'Minder vouwen, kortere bulk, en stop bij 60–70% volumetoename in plaats van verdubbeling.',
        en: 'Fewer folds, shorter bulk, and stop at 60–70% volume increase rather than doubling.',
      },
    });
  }

  /* ---- temperature ---- */
  if (isOutsideModelledRange(options.doughTemp)) {
    out.push({
      code: 'temp-out-of-band',
      level: 'caution',
      message: {
        nl: `${options.doughTemp} °C ligt buiten de band (16–32 °C) waar het Q10-model betrouwbaar is. De tijden hieronder zijn een extrapolatie.`,
        en: `${options.doughTemp} °C is outside the band (16–32 °C) where the Q10 model is reliable. The times below are an extrapolation.`,
      },
      fix: {
        nl: 'Beoordeel het deeg op volume en gasbelletjes, niet op de klok.',
        en: 'Judge the dough by volume and bubbles, not by the clock.',
      },
    });
  }

  if (options.doughTemp >= 27 && blend.fermentSpeed > 1.2) {
    out.push({
      code: 'hot-and-fast',
      level: 'caution',
      message: {
        nl: `${options.doughTemp} °C met snel meel (${blend.fermentSpeed}×): de bulk is ${input.bulkMinutes} minuten en dat is geen typefout.`,
        en: `${options.doughTemp} °C with fast flour (${blend.fermentSpeed}×): bulk comes out at ${input.bulkMinutes} minutes, and that is not a typo.`,
      },
      fix: {
        nl: 'Gebruik ijswater bij het mixen of verlaag de desemhoeveelheid naar de helft.',
        en: 'Mix with iced water, or halve the amount of levain.',
      },
    });
  }

  /* ---- enrichment ---- */
  const rich = enrichment(recipe);
  if (rich.fat > 8 && blend.strength < 60) {
    out.push({
      code: 'fat-vs-strength',
      level: 'caution',
      message: {
        nl: `${rich.fat}% vet op een deeg met sterkte ${blend.strength}. Vet coat de gluten — je verliest structuur die je hier niet kunt missen.`,
        en: `${rich.fat}% fat on a dough at strength ${blend.strength}. Fat coats the gluten — you lose structure you cannot spare here.`,
      },
      fix: {
        nl: 'Voeg het vet pas toe nadat het glutennetwerk staat, of kies een sterkere bloem.',
        en: 'Add the fat only after the gluten network is built, or pick a stronger flour.',
      },
    });
  }

  /* ---- substitution distance ---- */
  const delta = round(hydration - input.authorHydration, 1);
  if (Math.abs(delta) >= 5) {
    out.push({
      code: 'large-substitution',
      level: 'info',
      message: {
        nl: `Dit is ${Math.abs(delta)} punten ${delta > 0 ? 'natter' : 'droger'} dan het originele recept. Dat is het verschil tussen jouw meel en dat van de auteur, niet een fout.`,
        en: `This is ${Math.abs(delta)} points ${delta > 0 ? 'wetter' : 'drier'} than the original recipe. That is the difference between your flour and the author's, not a mistake.`,
      },
      fix: {
        nl: 'Bekijk "waar komt het verschil vandaan" voor de opsplitsing per oorzaak.',
        en: 'Open "where the difference comes from" for the breakdown by cause.',
      },
    });
  }

  /* ---- honesty ---- */
  if (blend.confidence === 'estimated') {
    out.push({
      code: 'estimated-data',
      level: 'info',
      message: {
        nl: `Minstens één meel in deze mix heeft geschatte waarden. Reken op ±${blend.uncertainty} hydratatiepunten.`,
        en: `At least one flour in this blend has estimated values. Expect ±${blend.uncertainty} hydration points.`,
      },
      fix: {
        nl: 'Doe de kalibratietest (10 minuten, 100 g meel) en het getal wordt van jou.',
        en: 'Run the calibration test (10 minutes, 100 g of flour) and the number becomes yours.',
      },
    });
  }

  const headroom = hydrationHeadroom(blend);
  if (headroom < 4 && recipe.difficulty >= 4) {
    out.push({
      code: 'ambitious-recipe-weak-flour',
      level: 'caution',
      message: {
        nl: `Dit is een recept van moeilijkheid ${recipe.difficulty} en deze mix heeft maar ${headroom} punten speling. Er is weinig ruimte tussen "mooi" en "mislukt".`,
        en: `This is a difficulty-${recipe.difficulty} recipe and this blend has only ${headroom} points of headroom. There is little room between "beautiful" and "failed".`,
      },
      fix: {
        nl: 'Doe dit recept eerst met een sterkere bloem, of accepteer een minder open kruim.',
        en: 'Run this recipe with a stronger flour first, or accept a less open crumb.',
      },
    });
  }

  return out;
}
