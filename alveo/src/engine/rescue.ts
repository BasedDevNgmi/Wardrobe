/**
 * Rescue mode.
 *
 * "It is 02:00 and my dough is ready and I am going to bed." "My levain did
 * not rise." "I have to leave the house in an hour." This is triage, mid-bake,
 * on a phone, with flour on your hands — distinct from the `/problemen/`
 * diagnosis trees, which are a post-mortem. The input is where you are in the
 * timeline and what went wrong; the output is the next best action and what it
 * costs you.
 */

import type { LocalisedText } from './stages';

export type BakeStage =
  | 'levain-building'
  | 'bulk'
  | 'shaped-waiting'
  | 'cold-proofing'
  | 'ready-to-bake';

export type Situation =
  | 'must-sleep'
  | 'must-leave'
  | 'levain-not-ready'
  | 'over-proofed'
  | 'under-proofed'
  | 'too-slack';

export interface RescueOption {
  headline: LocalisedText;
  action: LocalisedText;
  /** What this move costs you, stated plainly. */
  cost: LocalisedText;
  /** Ranked: the first is the recommended move. */
  recommended: boolean;
}

export interface RescueAdvice {
  situation: Situation;
  stage: BakeStage;
  options: RescueOption[];
}

/**
 * The rescue matrix. Keyed by (situation, stage) where the combination has a
 * genuinely different answer; a single fallback covers the rest.
 */
export function rescue(situation: Situation, stage: BakeStage): RescueAdvice {
  const options = OPTIONS[situation]?.(stage) ?? fallback(situation);
  return { situation, stage, options };
}

type Builder = (stage: BakeStage) => RescueOption[];

const OPTIONS: Partial<Record<Situation, Builder>> = {
  'must-sleep': (stage) => {
    if (stage === 'bulk') {
      return [
        {
          recommended: true,
          headline: { nl: 'Zet de bulk in de koelkast', en: 'Move the bulk to the fridge' },
          action: {
            nl: 'Dek de bak af en zet hem koud. De fermentatie gaat bijna stil liggen; morgenvroeg haal je hem eruit, laat je hem op temperatuur komen en ga je verder waar je gebleven was. Je verliest niets — je wint smaak.',
            en: 'Cover the tub and chill it. Fermentation nearly stops; in the morning take it out, let it come up to temperature, and pick up where you left off. You lose nothing — you gain flavour.',
          },
          cost: {
            nl: 'Vrijwel geen kosten. Reken op een iets zuurder brood en een half uur extra opwarmtijd.',
            en: 'Almost no cost. Expect a slightly sourer loaf and half an hour of extra warm-up.',
          },
        },
      ];
    }
    if (stage === 'shaped-waiting' || stage === 'cold-proofing') {
      return [
        {
          recommended: true,
          headline: { nl: 'Koude rijs — precies zoals bedoeld', en: 'Cold proof — exactly as intended' },
          action: {
            nl: 'Het gevormde brood hoort nu juist de koelkast in. Dek het af en ga slapen; morgen bak je het direct uit de koelkast, koud snijden gaat zelfs schoner.',
            en: 'The shaped loaf belongs in the fridge now anyway. Cover it and sleep; bake it straight from the fridge tomorrow — scoring is even cleaner cold.',
          },
          cost: {
            nl: 'Geen. Dit is het schema, niet een noodgreep.',
            en: 'None. This is the schedule, not an emergency.',
          },
        },
      ];
    }
    return [
      {
        recommended: true,
        headline: { nl: 'Koel wat je hebt', en: 'Chill what you have' },
        action: {
          nl: 'Zet het deeg in de huidige toestand in de koelkast. Koude vertraagt alles, dus je kunt vrijwel elk moment in het proces een nacht overbruggen door koud te zetten.',
          en: 'Put the dough in the fridge in its current state. Cold slows everything, so almost any point in the process can bridge a night by chilling.',
        },
        cost: {
          nl: 'Meestal weinig; bij een al ver gerezen deeg reken op iets meer zuur.',
          en: 'Usually little; on an already-advanced dough, expect a touch more sour.',
        },
      },
    ];
  },

  'must-leave': (stage) => {
    if (stage === 'bulk' || stage === 'shaped-waiting') {
      return [
        {
          recommended: true,
          headline: { nl: 'Koelkast in, nu', en: 'Into the fridge, now' },
          action: {
            nl: 'Onderbreek waar je bent en zet koud. De koelkast is de pauzeknop van desem: je kunt tot een dag later verdergaan.',
            en: 'Interrupt wherever you are and chill. The fridge is sourdough\'s pause button: you can resume up to a day later.',
          },
          cost: {
            nl: 'Een iets zuurder, iets tragere tweede helft. Ruim de moeite waard.',
            en: 'A slightly sourer, slightly slower second half. Well worth it.',
          },
        },
        {
          recommended: false,
          headline: { nl: 'Of: afbakken als het klaar is', en: 'Or: bake it out if it is ready' },
          action: {
            nl: 'Als het deeg al goed gerezen is en je nog twintig minuten hebt, vorm en bak dan meteen — een iets ondergerezen brood is beter dan een overgerezen.',
            en: 'If the dough is already well risen and you have twenty minutes, shape and bake now — a slightly under-proofed loaf beats an over-proofed one.',
          },
          cost: {
            nl: 'Minder oven spring, iets dichtere kruim.',
            en: 'Less oven spring, a slightly tighter crumb.',
          },
        },
      ];
    }
    return fallback('must-leave');
  },

  'levain-not-ready': () => [
    {
      recommended: true,
      headline: { nl: 'Geef hem warmte en tijd', en: 'Give it warmth and time' },
      action: {
        nl: 'Zet de desem op een warme plek (24–26 °C) en wacht. Negen van de tien "dode" desems zijn koude, ondervoede desems. Verschuif je bakplan een paar uur in plaats van door te zetten met een onrijpe desem.',
        en: 'Put the levain somewhere warm (24–26 °C) and wait. Nine "dead" levains out of ten are cold, underfed ones. Shift your bake a few hours rather than pushing on with an unripe levain.',
      },
      cost: { nl: 'Alleen tijd.', en: 'Only time.' },
    },
    {
      recommended: false,
      headline: { nl: 'Of: bak vandaag met een snufje gist', en: 'Or: bake today with a pinch of yeast' },
      action: {
        nl: 'Heb je haast en moet het vandaag? Voeg een half gram instantgist toe aan het deeg. Je mist wat smaakdiepte, maar je krijgt een goed brood in plaats van geen brood.',
        en: 'In a hurry and it has to be today? Add half a gram of instant yeast to the dough. You miss some flavour depth, but you get a good loaf instead of no loaf.',
      },
      cost: {
        nl: 'Minder complexe smaak; het is dan technisch een hybride, geen pure desem.',
        en: 'Less complex flavour; it is then technically a hybrid, not a pure sourdough.',
      },
    },
  ],

  'over-proofed': () => [
    {
      recommended: true,
      headline: { nl: 'Bak het nu, plat en al', en: 'Bake it now, flat and all' },
      action: {
        nl: 'Een overgerezen deeg wordt niet beter door wachten. Vorm zo strak als je kunt, gebruik een busvorm of rijsmandje voor steun, en bak meteen. Het wordt platter, maar het is eetbaar en vaak verrassend smaakvol.',
        en: 'An over-proofed dough does not improve by waiting. Shape it as tightly as you can, use a tin or banneton for support, and bake at once. It comes out flatter, but it is edible and often surprisingly tasty.',
      },
      cost: {
        nl: 'Een platter brood met een dichtere kruim. Volgende keer een uur eerder stoppen.',
        en: 'A flatter loaf with a tighter crumb. Next time, stop an hour earlier.',
      },
    },
    {
      recommended: false,
      headline: { nl: 'Of: maak er focaccia van', en: 'Or: turn it into focaccia' },
      action: {
        nl: 'Te ver voor een brood is prima voor focaccia. Giet het in een geoliede plaat, maak kuiltjes, laat kort narijzen en bak. De platte vorm is hier geen probleem maar het doel.',
        en: 'Too far for a loaf is fine for focaccia. Pour it into an oiled tray, dimple it, proof briefly and bake. The flat shape is not a problem here but the goal.',
      },
      cost: { nl: 'Je bakt iets anders dan gepland — maar iets goeds.', en: 'You bake something other than planned — but something good.' },
    },
  ],

  'under-proofed': () => [
    {
      recommended: true,
      headline: { nl: 'Geef het meer tijd, warmer', en: 'Give it more time, warmer' },
      action: {
        nl: 'Een ondergerezen deeg heeft simpelweg meer tijd nodig. Zet het warmer (25 °C) en wacht tot het merkbaar is gegroeid, koepelt en trilt. Beoordeel het deeg, niet de klok.',
        en: 'An under-proofed dough simply needs more time. Move it somewhere warmer (25 °C) and wait until it has visibly grown, domes and wobbles. Judge the dough, not the clock.',
      },
      cost: { nl: 'Alleen geduld.', en: 'Only patience.' },
    },
  ],

  'too-slack': () => [
    {
      recommended: true,
      headline: { nl: 'Bak in een vorm', en: 'Bake in a tin' },
      action: {
        nl: 'Te nat om vrij te staan? Gebruik een busvorm. Dat is geen mislukking maar het juiste gereedschap voor dit deeg — de vorm draagt de structuur die het meel niet levert.',
        en: 'Too slack to stand free? Use a tin. That is not a failure but the right tool for this dough — the tin carries the structure the flour does not.',
      },
      cost: { nl: 'Een busbrood in plaats van een vrijstaand brood.', en: 'A tin loaf instead of a free-standing one.' },
    },
    {
      recommended: false,
      headline: { nl: 'Of: voeg voorzichtig bloem toe', en: 'Or: add flour, carefully' },
      action: {
        nl: 'Kneed er in kleine porties bloem doorheen tot het deeg net hanteerbaar wordt. Dit verlaagt de hydratatie en verandert de formule, dus doe het met mate.',
        en: 'Knead in flour a little at a time until the dough is just workable. This lowers the hydration and changes the formula, so do it sparingly.',
      },
      cost: {
        nl: 'Een dichtere kruim; je bakt effectief een droger recept.',
        en: 'A tighter crumb; you are effectively baking a drier recipe.',
      },
    },
  ],
};

function fallback(situation: Situation): RescueOption[] {
  return [
    {
      recommended: true,
      headline: { nl: 'Koel het deeg', en: 'Chill the dough' },
      action: {
        nl: 'Bij twijfel is de koelkast bijna altijd het veilige antwoord: hij vertraagt alles en geeft je tijd om na te denken zonder het deeg te verliezen.',
        en: 'When in doubt, the fridge is almost always the safe answer: it slows everything and buys you time to think without losing the dough.',
      },
      cost: { nl: 'Meestal weinig tot niets.', en: 'Usually little to nothing.' },
    },
  ];
}

export const SITUATION_LABELS: Record<Situation, LocalisedText> = {
  'must-sleep': { nl: 'Ik moet slapen', en: 'I need to sleep' },
  'must-leave': { nl: 'Ik moet weg', en: 'I have to leave' },
  'levain-not-ready': { nl: 'Mijn desem is niet rijp', en: 'My levain is not ready' },
  'over-proofed': { nl: 'Het deeg is overgerezen', en: 'The dough is over-proofed' },
  'under-proofed': { nl: 'Het deeg rijst niet', en: 'The dough will not rise' },
  'too-slack': { nl: 'Het deeg is te nat', en: 'The dough is too slack' },
};

export const STAGE_LABELS: Record<BakeStage, LocalisedText> = {
  'levain-building': { nl: 'Desem staat te rijpen', en: 'Levain is ripening' },
  bulk: { nl: 'Bulkrijs', en: 'Bulk fermentation' },
  'shaped-waiting': { nl: 'Gevormd, wacht op de rijs', en: 'Shaped, waiting to proof' },
  'cold-proofing': { nl: 'In de koude rijs', en: 'In the cold proof' },
  'ready-to-bake': { nl: 'Klaar om te bakken', en: 'Ready to bake' },
};
