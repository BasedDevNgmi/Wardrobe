/**
 * Equipment adaptation.
 *
 * A stand mixer is not the same recipe performed by a machine. Four things
 * actually change, and all four are computable from numbers the engine already
 * holds:
 *
 *   1. the bowl caps the batch size;
 *   2. friction heat moves the water temperature;
 *   3. machine mixing over-develops fragile flour fast;
 *   4. machine mixing replaces folds.
 *
 * Anything less than that is a text swap dressed up as a feature.
 */

import {
  DOUGH_GRAMS_PER_BOWL_LITRE,
  FRICTION_FACTOR,
  FRICTION_RANGE,
  MACHINE_MIX_BASE_MINUTES,
  MACHINE_MIX_MIN_STRENGTH,
  OVEN_TEMP_DELTA,
  Q10,
  REFERENCE_FRIDGE_TEMP,
} from './constants';
import type {
  BlendProfile,
  LocalisedProse,
  MixMethod,
  OvenType,
  RecipeStep,
  StepBody,
  Warning,
} from './types';
import { clamp, round } from './util';

export const MIX_METHODS: MixMethod[] = [
  'hand', 'stand-mixer', 'spiral', 'food-processor', 'bread-machine', 'no-knead',
];

export const MIX_METHOD_LABELS: Record<MixMethod, LocalisedProse> = {
  hand: { nl: 'Met de hand', en: 'By hand' },
  'stand-mixer': { nl: 'Standmixer', en: 'Stand mixer' },
  spiral: { nl: 'Spiraalkneder', en: 'Spiral mixer' },
  'food-processor': { nl: 'Keukenmachine', en: 'Food processor' },
  'bread-machine': { nl: 'Broodbakmachine (deegstand)', en: 'Bread machine (dough cycle)' },
  'no-knead': { nl: 'Niet kneden', en: 'No-knead' },
};

export const MACHINE_METHODS = new Set<MixMethod>([
  'stand-mixer', 'spiral', 'food-processor', 'bread-machine',
]);

/**
 * Resolve step prose for the chosen method, falling through to the default.
 * Most steps never need an override — bulk, shaping and baking read the same
 * whatever mixed them — so the fallthrough is the common path.
 */
export function resolveStepBody(body: StepBody, method: MixMethod): LocalisedProse {
  if ('default' in body) {
    const specific = (body as Record<string, LocalisedProse | undefined>)[method];
    return specific ?? body.default;
  }
  return body;
}

/** Whether a step applies at all under this method. */
export function stepAppliesTo(step: RecipeStep, method: MixMethod): boolean {
  if (step.onlyForMethods && !step.onlyForMethods.includes(method)) return false;
  if (step.skipForMethods && step.skipForMethods.includes(method)) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/* Bowl capacity                                                       */
/* ------------------------------------------------------------------ */

export interface CapacityCheck {
  /** Largest dough weight this bowl can actually mix, grams. */
  maxDoughGrams: number;
  /** The same expressed as flour, at the current hydration. */
  maxFlourGrams: number;
  fits: boolean;
  warning?: Warning;
}

/**
 * A mixer bowl runs about a third full of dough before the hook stops folding
 * it and starts shoving it round the rim. Slack dough climbs the hook sooner
 * than stiff dough, so hydration tightens the limit further.
 */
export function checkBowlCapacity(
  bowlLitres: number,
  doughGrams: number,
  hydration: number,
  doughWeightPerFlourGram: number,
): CapacityCheck {
  const slackPenalty = 1 - clamp((hydration - 70) / 100, 0, 0.25);
  const maxDough = round(bowlLitres * DOUGH_GRAMS_PER_BOWL_LITRE * slackPenalty, 0);
  const maxFlour = round(maxDough / Math.max(doughWeightPerFlourGram, 0.5), 0);
  const fits = doughGrams <= maxDough;

  return {
    maxDoughGrams: maxDough,
    maxFlourGrams: maxFlour,
    fits,
    warning: fits
      ? undefined
      : {
          code: 'bowl-too-small',
          level: 'danger',
          message: {
            nl: `${round(doughGrams, 0)} g deeg in een kom van ${bowlLitres} liter gaat niet. Bij deze hydratatie klimt het deeg langs de haak omhoog in plaats van gevouwen te worden, en dat is hoe motoren doorbranden.`,
            en: `${round(doughGrams, 0)} g of dough in a ${bowlLitres} litre bowl will not work. At this hydration the dough climbs the hook instead of being folded, and that is how motors burn out.`,
          },
          fix: {
            nl: `Maximaal ${maxFlour} g bloem (${maxDough} g deeg) in deze kom. Maak een kleinere batch of meng met de hand.`,
            en: `Cap it at ${maxFlour} g of flour (${maxDough} g of dough) in this bowl. Make a smaller batch, or mix by hand.`,
          },
        },
  };
}

/* ------------------------------------------------------------------ */
/* Machine mixing time                                                 */
/* ------------------------------------------------------------------ */

export interface MachineMixPlan {
  method: MixMethod;
  /** Minutes on the machine. Zero when the method is hand or no-knead. */
  minutes: number;
  /** Suggested speed setting, in the machine's own vocabulary. */
  speed: LocalisedProse;
  /** Fold sets still needed after the machine has done its work. */
  foldsAfter: number;
  advisable: boolean;
  note: LocalisedProse;
  warning?: Warning;
}

/**
 * Mix time falls as blend strength falls. Spelt and einkorn go from developed
 * to destroyed in about ninety seconds on a hook, and no amount of "watch it
 * carefully" makes that a safe default — so below the threshold the engine
 * refuses rather than advising.
 */
export function machineMixPlan(
  method: MixMethod,
  blend: BlendProfile,
  hydration: number,
): MachineMixPlan {
  if (!MACHINE_METHODS.has(method)) {
    return {
      method,
      minutes: 0,
      speed: { nl: '—', en: '—' },
      foldsAfter: -1, // signals "use the recipe's fold plan unchanged"
      advisable: true,
      note:
        method === 'no-knead'
          ? {
              nl: 'Geen kneden: tijd doet het werk dat je handen anders zouden doen. Meng alleen tot er geen droge bloem meer is.',
              en: 'No kneading: time does the work your hands would otherwise do. Mix only until no dry flour remains.',
            }
          : {
              nl: 'Met de hand. De vouwschema hieronder bouwt de structuur op.',
              en: 'By hand. The fold schedule below builds the structure.',
            },
    };
  }

  const base = MACHINE_MIX_BASE_MINUTES[method] ?? 8;

  if (blend.strength < MACHINE_MIX_MIN_STRENGTH) {
    return {
      method,
      minutes: 0,
      speed: { nl: 'niet gebruiken', en: 'do not use' },
      foldsAfter: -1,
      advisable: false,
      note: {
        nl: `Sterkte ${blend.strength}: gebruik de machine hier niet. Dit gluten breekt sneller af dan het zich opbouwt en je hebt geen manier om te zien wanneer dat gebeurt.`,
        en: `Strength ${blend.strength}: do not use the machine here. This gluten breaks down faster than it builds and you have no way to see the moment it happens.`,
      },
      warning: {
        code: 'machine-too-aggressive',
        level: 'danger',
        message: {
          nl: `Deze mix (sterkte ${blend.strength}) verdraagt geen machinaal kneden. Op een haak gaat het in anderhalve minuut van ontwikkeld naar kapot.`,
          en: `This blend (strength ${blend.strength}) will not survive machine kneading. On a hook it goes from developed to destroyed in about ninety seconds.`,
        },
        fix: {
          nl: 'Meng met de hand tot alles nat is en laat de vouwsets het werk doen.',
          en: 'Mix by hand until everything is wet and let the fold sets do the work.',
        },
      },
    };
  }

  // Scale from the strong-white baseline. At strength 40 you get roughly half
  // the time; at 100, a little more than the baseline.
  const scale = clamp(0.25 + (blend.strength / 100) * 0.95, 0.3, 1.2);
  // Slack dough takes longer to come together on a hook.
  const wetness = 1 + clamp((hydration - blend.absorption) / 40, -0.1, 0.25);
  const minutes = round(base * scale * wetness, 1);

  // A dough taken to full development needs one or two folds, not four.
  const foldsAfter = blend.strength > 70 ? 1 : 2;

  return {
    method,
    minutes,
    speed: speedFor(method),
    foldsAfter,
    advisable: true,
    note: {
      nl: `${minutes} minuten op de machine, dan nog ${foldsAfter} vouwset${foldsAfter === 1 ? '' : 'ten'}. Dat is fors minder vouwen dan het handmatige schema: de machine heeft het glutenwerk al gedaan. Stop zodra het deeg van de kom loslaat en een vliesje trekt.`,
      en: `${minutes} minutes on the machine, then ${foldsAfter} fold set${foldsAfter === 1 ? '' : 's'}. That is far fewer folds than the hand schedule: the machine has already done the gluten work. Stop as soon as the dough clears the bowl and pulls a windowpane.`,
    },
    warning:
      blend.strength < 45
        ? {
            code: 'machine-marginal',
            level: 'caution',
            message: {
              nl: `Sterkte ${blend.strength} is aan de lage kant voor een machine. Blijf erbij staan en stop een minuut eerder dan je denkt.`,
              en: `Strength ${blend.strength} is on the low side for a machine. Stay with it and stop a minute sooner than you think.`,
            },
            fix: {
              nl: 'Kneed op de laagste stand en controleer elke minuut.',
              en: 'Knead on the lowest setting and check every minute.',
            },
          }
        : undefined,
  };
}

function speedFor(method: MixMethod): LocalisedProse {
  switch (method) {
    case 'stand-mixer':
      return { nl: 'stand 1 om te mengen, dan stand 2', en: 'speed 1 to combine, then speed 2' };
    case 'spiral':
      return { nl: 'eerste versnelling, kort tweede aan het eind', en: 'first gear, briefly second at the end' };
    case 'food-processor':
      return { nl: 'deegmes, korte pulsen', en: 'dough blade, short pulses' };
    case 'bread-machine':
      return { nl: 'deegprogramma, zonder de rijsfase', en: 'dough programme, stopping before the rise' };
    default:
      return { nl: '—', en: '—' };
  }
}

/* ------------------------------------------------------------------ */
/* Oven                                                                */
/* ------------------------------------------------------------------ */

export const OVEN_LABELS: Record<OvenType, LocalisedProse> = {
  'dutch-oven': { nl: 'Gietijzeren pan', en: 'Dutch oven' },
  'stone-steam': { nl: 'Baksteen of -staal met stoom', en: 'Baking stone or steel with steam' },
  tray: { nl: 'Bakplaat', en: 'Baking tray' },
  'combi-steam': { nl: 'Stoomoven', en: 'Combi-steam oven' },
  deck: { nl: 'Dekoven', en: 'Deck oven' },
  fan: { nl: 'Heteluchtoven', en: 'Fan oven' },
  gas: { nl: 'Gasoven', en: 'Gas oven' },
};

export interface OvenAdvice {
  temp: number;
  delta: number;
  lidMinutes: number;
  note: LocalisedProse;
}

/**
 * A fan oven moves far more hot air across the crust than its dial implies, so
 * the crust sets before the crumb has finished expanding. A tray with no
 * enclosure loses its steam immediately and needs the opposite correction.
 */
export function ovenAdvice(
  ovenType: OvenType,
  recipeTemp: number,
  recipeLidMin: number,
): OvenAdvice {
  const delta = OVEN_TEMP_DELTA[ovenType];
  const notes: Record<OvenType, LocalisedProse> = {
    'dutch-oven': {
      nl: 'De pan houdt het vocht van het deeg zelf vast — dat is de betrouwbaarste stoom die je thuis krijgt. Voorverwarmen met deksel erop.',
      en: 'The pot traps the dough\'s own moisture — the most reliable steam you can get at home. Preheat it with the lid on.',
    },
    'stone-steam': {
      nl: 'Steen of staal minstens 45 minuten voorverwarmen. Stoom in de eerste tien minuten; daarna moet het juist droog worden.',
      en: 'Preheat the stone or steel for at least 45 minutes. Steam for the first ten minutes; after that it needs to go dry.',
    },
    tray: {
      nl: 'Een kale plaat verliest zijn stoom meteen en geleidt slecht. Zet er een tweede omgekeerde bak overheen voor de eerste helft van de baktijd.',
      en: 'A bare tray loses its steam at once and conducts poorly. Invert a second dish over the loaf for the first half of the bake.',
    },
    'combi-steam': {
      nl: 'Met echte stoom kun je lager bakken: de korst zet later en het brood kan verder uitzetten.',
      en: 'With real steam you can bake lower: the crust sets later and the loaf gets further to expand.',
    },
    deck: {
      nl: 'Onderwarmte van steen is precies waar dit brood voor gemaakt is. Geen aanpassing nodig.',
      en: 'Bottom heat from stone is exactly what this bread was built for. No adjustment needed.',
    },
    fan: {
      nl: `Heteluchtovens bakken merkbaar heter dan de knop zegt. ${Math.abs(delta)} °C lager, en zet de ventilator uit als dat kan — de luchtstroom droogt de korst voordat de kruim klaar is.`,
      en: `Fan ovens bake noticeably hotter than the dial says. ${Math.abs(delta)} °C lower, and switch the fan off if you can — the airflow dries the crust before the crumb is done.`,
    },
    gas: {
      nl: 'Gasovens hebben een grote temperatuurschommeling en een vochtiger atmosfeer. Draai het brood halverwege.',
      en: 'Gas ovens swing widely in temperature and run a wetter atmosphere. Turn the loaf halfway.',
    },
  };

  return {
    temp: round(recipeTemp + delta, 0),
    delta,
    lidMinutes: ovenType === 'tray' ? Math.max(recipeLidMin - 5, 0) : recipeLidMin,
    note: notes[ovenType],
  };
}

/* ------------------------------------------------------------------ */
/* Fridge                                                              */
/* ------------------------------------------------------------------ */

export interface FridgeAdvice {
  temp: number;
  /** Multiplier on cold proof duration relative to the 5 °C reference. */
  multiplier: number;
  note: LocalisedProse;
}

/**
 * Domestic fridges run 2–8 °C. Across a fourteen-hour retard that spread
 * approaches a two-fold difference in fermentation — larger than most of the
 * flour properties this engine agonises over, and almost always unmeasured.
 */
export function fridgeAdvice(fridgeTemp: number): FridgeAdvice {
  const t = clamp(fridgeTemp, 0, 12);
  const multiplier = round(Math.pow(Q10, (t - REFERENCE_FRIDGE_TEMP) / -10), 3);

  let note: LocalisedProse;
  if (t <= 3) {
    note = {
      nl: `${t} °C is een koude koelkast. De rijs staat vrijwel stil, dus je kunt veilig langer retarderen — en je hebt langer nodig voordat het brood bakklaar is.`,
      en: `${t} °C is a cold fridge. Proofing all but stops, so you can safely retard for longer — and you will need longer before the loaf is ready to bake.`,
    };
  } else if (t >= 7) {
    note = {
      nl: `${t} °C is warm voor een koelkast. Het deeg fermenteert daar nog merkbaar door: reken op ongeveer ${Math.round((1 / multiplier - 1) * 100)}% minder tijd dan het recept zegt, anders is het overrezen tegen de ochtend.`,
      en: `${t} °C is warm for a fridge. The dough keeps fermenting appreciably: expect roughly ${Math.round((1 / multiplier - 1) * 100)}% less time than the recipe states, or it will be over-proofed by morning.`,
    };
  } else {
    note = {
      nl: `${t} °C is een normale koelkast en de tijden van het recept kloppen zoals ze staan.`,
      en: `${t} °C is an ordinary fridge and the recipe's times hold as written.`,
    };
  }

  return { temp: t, multiplier, note };
}

/** Friction heat for the DDT calculation, with its honest range. */
export function frictionFor(method: MixMethod): { value: number; range: [number, number] } {
  return { value: FRICTION_FACTOR[method], range: FRICTION_RANGE[method] };
}
