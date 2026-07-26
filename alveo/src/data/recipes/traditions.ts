/**
 * Recipes 16–18 — in the tradition of, not copied from.
 *
 * Three original formulas that sit in the territory three well-known bakers
 * have shaped, credited to them by name with a link. Per LEGAL.md and §12 of
 * the brief: the formula is fact (percentages, times, temperatures are not
 * copyrightable), every word of method prose here is written originally, and
 * the attribution points the reader to the source to support it directly.
 *
 * These are *inspired by* the approach — a beginner-friendly first loaf, a
 * high-extraction country loaf, a large mixed-grain miche. They are not, and do
 * not claim to be, anyone's published recipe.
 */

import type { Recipe } from '@/engine/types';
import {
  autolyseStep, bakeStep, bassinageStep, benchStep, bulkStep, coldProofStep,
  coolStep, foldStep, levainStep, mixStep, preshapeStep, scoreStep, shapeStep,
} from './_steps';

export const beginnersLoaf: Recipe = {
  slug: 'beginners-desembrood',
  title: { nl: 'Beginnersdesembrood', en: "Beginner's sourdough" },
  summary: {
    nl: 'Het meest vergevingsgezinde brood op de site: lagere hydratatie, ruime tijden en veel desem, zodat er weinig fout kan gaan. Het brood om je eerste keer op te leren.',
    en: 'The most forgiving loaf on the site: lower hydration, generous timings and plenty of levain, so little can go wrong. The loaf to learn your first time on.',
  },
  difficulty: 1,
  format: 'boule',
  totalHours: 20,
  activeMinutes: 35,
  flourBlend: [
    { role: 'white', pct: 90 },
    { role: 'wholegrain', pct: 10, note: {
      nl: 'Tien procent volkoren geeft de fermentatie brandstof en het brood smaak, zonder het moeilijker te maken.',
      en: 'Ten per cent wholemeal feeds the fermentation and flavours the loaf, without making it harder.',
    } },
  ],
  hydration: 70,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 30 }),
    mixStep(),
    foldStep(),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep(),
    coldProofStep(),
    scoreStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 240, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 220 },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', wholegrain: 'us-whole-wheat' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour, in de benaderbare, goed uitgelegde stijl die The Perfect Loaf populair maakte. Op zwakker meel valt de hydratatie lager uit — de motor rekent dat om.',
      en: 'Written for American bread flour, in the approachable, well-explained style The Perfect Loaf made popular. On weaker flour the hydration lands lower — the engine converts it.',
    },
    doughTemp: 24,
  },
  attribution: {
    inspiredBy: 'The Perfect Loaf — Maurizio Leo',
    url: 'https://www.theperfectloaf.com',
    author: 'Maurizio Leo',
  },
  tags: ['beginner', 'boule', 'inspired'],
};

export const highExtractionCountry: Recipe = {
  slug: 'hoge-uitmaling-landbrood',
  title: { nl: 'Landbrood met hoge uitmaling', en: 'High-extraction country loaf' },
  summary: {
    nl: 'Een fors aandeel half uitgemalen meel geeft een romige kruim, een diepe smaak en een korst die naar graan smaakt. De smaakvolle dagelijkse variant.',
    en: 'A large share of high-extraction flour gives a creamy crumb, a deep flavour and a crust that tastes of grain. The flavourful everyday version.',
  },
  difficulty: 3,
  format: 'batard',
  totalHours: 26,
  activeMinutes: 45,
  flourBlend: [
    { role: 'white', pct: 70 },
    { role: 'wholegrain', pct: 30, note: {
      nl: 'Half uitgemalen meel, geen volledig volkoren: genoeg zemelen voor smaak, genoeg endosperm om nog een strak brood te dragen.',
      en: 'High-extraction, not full wholemeal: enough bran for flavour, enough endosperm to still carry a tight loaf.',
    } },
  ],
  hydration: 78,
  salt: 2.0,
  prefermentedFlour: 10,
  levain: { hydration: 100, ratio: '1:5:5', hours: 10, temp: 24 },
  bassinage: 5,
  steps: [
    levainStep({
      body: {
        nl: 'Bouw een jonge, levendige desem: gebruik hem op de piek, als hij koepelt en nog zoetzuur ruikt in plaats van scherp. Een jonge desem geeft een mildere, rondere zuurgraad die de graansmaak van dit brood niet overstemt.',
        en: 'Build a young, lively levain: use it at peak, when it domes and still smells sweet-sour rather than sharp. A young levain gives a milder, rounder acidity that does not drown out this loaf\'s grain flavour.',
      },
    }),
    autolyseStep({ baseMinutes: 60 }),
    mixStep(),
    bassinageStep(),
    foldStep(),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep(),
    coldProofStep(),
    scoreStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 2, gramsEach: 900 },
  bake: { temp: 250, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 230 },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', wholegrain: 'us-type-85' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour en Type 85, in de traditie van hoog-hydratatie natuurdesem die Tartine wereldwijd bekend maakte. De lange autolyse is hier geen luxe: half uitgemalen meel neemt traag water op.',
      en: 'Written for American bread flour and Type 85, in the high-hydration natural-leaven tradition Tartine made known worldwide. The long autolyse is not a luxury here: high-extraction flour takes water up slowly.',
    },
    doughTemp: 24,
  },
  attribution: {
    inspiredBy: 'Tartine Bread — Chad Robertson',
    url: 'https://tartinebakery.com',
    author: 'Chad Robertson',
  },
  tags: ['wholegrain', 'flavour', 'batard', 'inspired'],
};

export const mixedGrainMiche: Recipe = {
  slug: 'meergranen-miche',
  title: { nl: 'Meergranen-miche', en: 'Mixed-grain miche' },
  summary: {
    nl: 'Een groot brood van anderhalve kilo met spelt, volkoren en een lange koude rijs. Dagen houdbaar, en het snijvlak wordt met de dag mooier. Een brood om te delen.',
    en: 'A large kilo-and-a-half loaf of spelt, wholemeal and a long cold ferment. Keeps for days, and the cut face only improves. A loaf to share.',
  },
  difficulty: 4,
  format: 'boule',
  totalHours: 30,
  activeMinutes: 55,
  flourBlend: [
    { role: 'white', pct: 55 },
    { role: 'ancient', pct: 30, note: {
      nl: 'Spelt geeft de zoete, nootachtige smaak, maar verzwakt het deeg — daarom draagt het witte meel de last en blijft de vorm rond.',
      en: 'Spelt gives the sweet, nutty flavour but weakens the dough — which is why the white flour carries the load and the shape stays round.',
    } },
    { role: 'wholegrain', pct: 15 },
  ],
  hydration: 82,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 100, ratio: '1:4:4', hours: 10, temp: 23 },
  bassinage: 6,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45, title: { nl: 'Korte autolyse', en: 'Short autolyse' } }),
    mixStep(),
    bassinageStep(),
    foldStep(),
    bulkStep({
      title: { nl: 'Lange koele bulkrijs', en: 'Long cool bulk' },
      body: {
        nl: 'Een groot deeg fermenteert trager in de kern dan aan de rand, dus geef het de tijd en houd het koeler — rond 23 °C. Spelt gaat bovendien sneller van perfect naar overrezen dan tarwe, dus beoordeel scherp: stop bij zestig tot zeventig procent volumetoename, niet bij verdubbeling.',
        en: 'A large dough ferments more slowly in the core than at the edge, so give it time and keep it cooler — around 23 °C. Spelt also goes from perfect to over-proofed faster than wheat, so judge closely: stop at sixty to seventy per cent volume increase, not at doubling.',
      },
    }),
    preshapeStep(),
    benchStep(),
    shapeStep({
      body: {
        nl: 'Vorm één grote, strakke boule. Bij dit gewicht is spanning alles: een miche die niet strak is gevormd, zakt onder zijn eigen massa uit. Gebruik een groot rijsmandje of een met linnen beklede kom.',
        en: 'Shape one large, tight boule. At this weight tension is everything: a miche that is not tightly shaped spreads under its own mass. Use a large banneton or a linen-lined bowl.',
      },
    }),
    coldProofStep(),
    scoreStep({
      body: {
        nl: 'Snijd een ruim, decoratief patroon — een kruis of een vierkant. Een groot brood heeft een grote snede nodig om gelijkmatig open te gaan; één kleine snee scheurt aan de zijkant.',
        en: 'Score a generous, decorative pattern — a cross or a square. A large loaf needs a large cut to open evenly; one small slash tears at the side.',
      },
    }),
    bakeStep({
      body: {
        nl: 'Bak lang en houd vol: een brood van anderhalve kilo heeft veel meer tijd nodig dan een gewoon brood om door te garen. Reken op vijftig tot zestig minuten en een kerntemperatuur boven 96 °C. Een bleke of ondergebakken miche is zonde van het wachten.',
        en: 'Bake long and commit: a kilo-and-a-half loaf needs far more time than an ordinary one to cook through. Expect fifty to sixty minutes and a core above 96 °C. A pale or underbaked miche wastes all the waiting.',
      },
    }),
    coolStep({ baseMinutes: 240 }),
  ],
  yield: { pieces: 1, gramsEach: 1500 },
  bake: { temp: 250, lidMin: 25, openMin: 35, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 220 },
  authorContext: {
    roleFlours: { white: 'de-manitoba-550', ancient: 'de-dinkel-1050', wholegrain: 'de-1050' },
    note: {
      nl: 'Geschreven voor een sterke witte bloem met spelt en donkere tarwe, in de geest van de grote gemengde broden waar Richard Hart bij Hart Bageri om bekendstaat. De sterke witte bloem is hier onmisbaar: hij draagt het spelt dat de smaak levert.',
      en: 'Written for a strong white flour with spelt and dark wheat, in the spirit of the large mixed loaves Richard Hart is known for at Hart Bageri. The strong white flour is essential here: it carries the spelt that brings the flavour.',
    },
    doughTemp: 23,
  },
  attribution: {
    inspiredBy: 'Richard Hart — Hart Bageri, Kopenhagen',
    url: 'https://hartbageri.com',
    author: 'Richard Hart',
  },
  tags: ['miche', 'spelt', 'large', 'inspired'],
};
