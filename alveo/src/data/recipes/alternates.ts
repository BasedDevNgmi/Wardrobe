/**
 * The alternates: recipes 11–15.
 *
 * Breadth beyond the core ten — the breads people search for by name. Each is a
 * formula with an authorContext like the rest, so substitution, the sourness
 * dial and the fermentation modes all work on them unchanged. Method prose is
 * original and leans on the shared step library; only genuinely distinct steps
 * (the boil, the lye bath, the griddle, the scald) carry bespoke prose.
 */

import type { Recipe } from '@/engine/types';
import {
  bakeStep, benchStep, bulkStep, coldProofStep, coolStep, foldStep,
  levainStep, mixStep, preshapeStep, proofStep, shapeStep, soakerStep,
} from './_steps';

export const bagels: Recipe = {
  slug: 'desem-bagels',
  title: { nl: 'Desembagels', en: 'Sourdough bagels' },
  summary: {
    nl: 'Laag hydratatie, hoog eiwit, en de kokende-waterstap die niets anders op de site heeft. Taai, glanzend en dicht — precies zoals een bagel hoort.',
    en: 'Low hydration, high protein, and the boiling-water step nothing else on the site has. Chewy, glossy and dense — exactly what a bagel should be.',
  },
  difficulty: 3,
  format: 'rolls',
  totalHours: 18,
  activeMinutes: 50,
  flourBlend: [{ role: 'strong-white', pct: 100, note: {
    nl: 'Bagels vragen om de sterkste bloem die je hebt. Hoe hoger het eiwit, hoe taaier de beet.',
    en: 'Bagels want the strongest flour you have. The higher the protein, the chewier the bite.',
  } }],
  hydration: 55,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'malt', name: { nl: 'Gerstemoutstroop', en: 'Barley malt syrup' }, pct: 3, type: 'sugar' },
  ],
  steps: [
    levainStep(),
    mixStep({
      body: {
        nl: 'Meng alles tot een stevig, bijna stug deeg. Dit is het droogste deeg op de site: het voelt als klei en dat hoort. Kneed het tot het glad is — bij zo weinig water bouwt kneden de structuur op, niet vouwen.',
        en: 'Mix everything into a firm, almost stiff dough. This is the driest dough on the site: it feels like clay and it should. Knead it smooth — at this little water, kneading builds the structure, not folding.',
      },
    }),
    bulkStep(),
    shapeStep({
      title: { nl: 'Ringen vormen', en: 'Shape the rings' },
      body: {
        nl: 'Verdeel in stukken, rol elk tot een streng en sluit tot een ring door de uiteinden over elkaar te rollen. Of: rol tot een bal, duw je duim door het midden en rek het gat op tot een derde van de diameter — het gat sluit tijdens het koken.',
        en: 'Divide, roll each into a rope and close into a ring by rolling the ends over each other. Or: roll a ball, push your thumb through the middle and stretch the hole to a third of the diameter — it closes during boiling.',
      },
    }),
    coldProofStep(),
    {
      id: 'boil',
      kind: 'rest',
      title: { nl: 'Koken', en: 'Boil' },
      baseMinutes: 15,
      body: {
        nl: 'Breng een brede pan water aan de kook met een eetlepel moutstroop of honing erin. Kook elke bagel 45 seconden per kant — langer geeft een dikkere, taaiere korst. Ze drijven als ze klaar zijn om te koken. Dit is de stap die een bagel een bagel maakt in plaats van een rond broodje.',
        en: 'Bring a wide pan of water to the boil with a tablespoon of malt syrup or honey in it. Boil each bagel 45 seconds a side — longer gives a thicker, chewier crust. They float when they are ready to boil. This is the step that makes a bagel a bagel rather than a round roll.',
      },
    },
    bakeStep({
      body: {
        nl: 'Direct na het koken bestrooien en meteen bakken, heet. De vochtige buitenkant van het koken wordt in de oven glanzend en taai. Bak tot diep goudbruin.',
        en: 'Top straight after boiling and bake at once, hot. The wet exterior from the boil turns glossy and chewy in the oven. Bake to a deep gold-brown.',
      },
    }),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 8, gramsEach: 110 },
  bake: { temp: 230, lidMin: 0, openMin: 20, coreTemp: [96, 99], vessel: ['tray', 'stone-steam'] },
  authorContext: {
    roleFlours: { 'strong-white': 'us-high-gluten' },
    note: {
      nl: 'Geschreven voor Amerikaanse high-gluten bloem. Op zwakkere bloem wordt de beet zachter — nog steeds lekker, maar minder taai.',
      en: 'Written for American high-gluten flour. On weaker flour the bite softens — still good, just less chewy.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['enriched', 'boiled', 'rolls'],
};

export const pretzels: Recipe = {
  slug: 'desem-pretzels',
  title: { nl: 'Desempretzels', en: 'Sourdough pretzels' },
  summary: {
    nl: 'Het loogbad geeft de mahoniekleurige korst en de onmiskenbare smaak. Met een veilige bicarbonaat-variant voor thuis.',
    en: 'The lye bath gives the mahogany crust and the unmistakable flavour. With a safe baking-soda variant for home.',
  },
  difficulty: 4,
  format: 'rolls',
  totalHours: 14,
  activeMinutes: 55,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 58,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 4, type: 'fat' },
  ],
  steps: [
    levainStep(),
    mixStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Knopen draaien', en: 'Twist the knots' },
      body: {
        nl: 'Rol elk stuk tot een lange streng, dik in het midden en dun aan de uiteinden. Vorm een U, draai de uiteinden twee keer om elkaar en druk ze op de dikke onderkant. Laat kort narijzen, dan de koelkast in — koud deeg is steviger in het loogbad.',
        en: 'Roll each piece into a long rope, thick in the middle and thin at the ends. Form a U, twist the ends around each other twice and press them onto the thick bottom. Proof briefly, then into the fridge — cold dough is firmer in the bath.',
      },
    }),
    coldProofStep(),
    {
      id: 'bath',
      kind: 'rest',
      title: { nl: 'Loogbad (of bicarbonaat)', en: 'Lye bath (or baking soda)' },
      baseMinutes: 15,
      body: {
        nl: 'De echte manier: een 4%-oplossing van voedselveilig natriumhydroxide (loog). Draag handschoenen en een bril; loog is bijtend, maar geeft de klassieke korst. De veilige thuisvariant: bak een pak bicarbonaat 45 minuten op 120 °C in de oven — dat verhoogt de pH genoeg voor tachtig procent van het effect zonder het risico. Dompel elke pretzel tien seconden.',
        en: 'The real way: a 4% solution of food-safe sodium hydroxide (lye). Wear gloves and goggles; lye is caustic but gives the classic crust. The safe home variant: bake a box of baking soda for 45 minutes at 120 °C — that raises its pH enough for eighty per cent of the effect without the risk. Dip each pretzel for ten seconds.',
      },
    },
    scoreStepPretzel(),
    bakeStep({
      body: {
        nl: 'Bestrooi met grof zout en bak heet tot diep mahoniebruin. De loog reageert met de korst tot die kenmerkende kleur en glans — bleek gebakken pretzels missen de halve smaak.',
        en: 'Scatter with coarse salt and bake hot to a deep mahogany. The lye reacts with the crust to that signature colour and shine — pale-baked pretzels miss half the flavour.',
      },
    }),
    coolStep({ baseMinutes: 20 }),
  ],
  yield: { pieces: 8, gramsEach: 100 },
  bake: { temp: 220, lidMin: 0, openMin: 16, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'de-550' },
    note: {
      nl: 'Geschreven voor Duitse Type 550, de traditionele pretzelbloem. De boter houdt de korst net zacht genoeg om te buigen zonder te breken.',
      en: 'Written for German Type 550, the traditional pretzel flour. The butter keeps the crust just soft enough to bend without snapping.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['enriched', 'lye', 'rolls'],
};

export const brioche: Recipe = {
  slug: 'desem-brioche',
  title: { nl: 'Desembrioche', en: 'Sourdough brioche' },
  summary: {
    nl: 'Boter, ei en een lange koude rijs. Het rijkste deeg op de site, en het geduldigste — de desem doet zijn werk terwijl jij slaapt.',
    en: 'Butter, egg and a long cold proof. The richest dough on the site, and the most patient — the levain does its work while you sleep.',
  },
  difficulty: 4,
  format: 'enriched',
  totalHours: 20,
  activeMinutes: 45,
  flourBlend: [{ role: 'strong-white', pct: 100, note: {
    nl: 'Sterke bloem is hier geen luxe: het gluten moet vet, ei en suiker dragen en toch rijzen.',
    en: 'Strong flour is not a luxury here: the gluten has to carry fat, egg and sugar and still rise.',
  } }],
  hydration: 56,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'egg', name: { nl: 'Ei', en: 'Egg' }, pct: 28, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 40, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 12, type: 'sugar' },
  ],
  steps: [
    levainStep(),
    mixStep({
      body: {
        default: {
          nl: 'Meng bloem, desem, ei, suiker en zout tot een deeg. Voeg dan de boter toe — klontje voor klontje, en wacht tot elk klontje volledig is opgenomen. Dit duurt lang met de hand en test je geduld; het deeg gaat door een plakkerige, hopeloze fase en komt er glad en glanzend uit.',
          en: 'Mix flour, levain, egg, sugar and salt into a dough. Then add the butter — a lump at a time, waiting until each is fully worked in. This takes a while by hand and tests your patience; the dough passes through a sticky, hopeless phase and comes out smooth and glossy.',
        },
        'stand-mixer': {
          nl: 'Dit is het recept waarvoor een standmixer echt verschil maakt. Alles behalve de boter op stand 2 tot het deeg van de wand loslaat, dan de boter klontje voor klontje op stand 1. Vijftien minuten machinewerk vervangt drie kwartier handwerk.',
          en: 'This is the recipe a stand mixer genuinely earns its place on. Everything except the butter on speed 2 until the dough clears the bowl, then the butter a lump at a time on speed 1. Fifteen minutes of machine work replaces three-quarters of an hour by hand.',
        },
      },
    }),
    foldStep(),
    bulkStep(),
    shapeStep({
      body: {
        nl: 'Verdeel in stukken, rol strakke bollen en leg ze in een ingevette busvorm of briochevorm. Strak rollen is belangrijk: elke luchtbel wordt een gat in de fijne kruim die brioche hoort te hebben.',
        en: 'Divide into pieces, roll tight balls and set them in a greased tin or brioche mould. Rolling tight matters: every air pocket becomes a hole in the fine crumb brioche should have.',
      },
    }),
    coldProofStep(),
    proofStep({
      baseMinutes: 150,
      body: {
        nl: 'Laat op kamertemperatuur narijzen tot bijna verdubbeld en luchtig. Verrijkt deeg rijst trager dan mager deeg — het vet en de suiker remmen de gist — dus reken op meer tijd dan je gewend bent.',
        en: 'Proof at room temperature until nearly doubled and airy. Enriched dough rises more slowly than lean dough — the fat and sugar hold the yeast back — so allow more time than you are used to.',
      },
    }),
    bakeStep({
      body: {
        nl: 'Bestrijk met losgeklopt ei en bak zacht en niet te heet: brioche wil een dunne, glanzende, goudbruine korst en een boterzachte kruim, niet de knapperige korst van een landbrood.',
        en: 'Brush with beaten egg and bake gentle, not too hot: brioche wants a thin, glossy, golden crust and a butter-soft crumb, not the crackling crust of a country loaf.',
      },
    }),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 800 },
  bake: { temp: 180, lidMin: 0, openMin: 35, coreTemp: [88, 92], vessel: ['tin'] },
  authorContext: {
    roleFlours: { 'strong-white': 'fr-gruau-t45' },
    note: {
      nl: 'Geschreven voor Franse gruau — sterke bloem met lage as, precies voor verrijkt deeg gemaakt. Het deeg is zacht en soepel; het wordt pas stevig na de lange koude rijs, dus laat je niet verleiden om bloem toe te voegen.',
      en: 'Written for French gruau — strong, low-ash flour built for enriched dough. The dough is soft and slack; it only firms after the long cold proof, so do not be tempted to add flour.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['enriched', 'butter', 'tin', 'sweet'],
};

export const englishMuffins: Recipe = {
  slug: 'desem-english-muffins',
  title: { nl: 'Desem-English-muffins', en: 'Sourdough English muffins' },
  summary: {
    nl: 'Op de koekenplaat gebakken in plaats van in de oven, met de karakteristieke holtes van binnen. Geen oven nodig, en klaar voor het ontbijt.',
    en: 'Cooked on a griddle rather than in the oven, with the characteristic nooks and crannies inside. No oven needed, and ready for breakfast.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 14,
  activeMinutes: 40,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 78,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 20, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 5, type: 'fat' },
  ],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Uitsteken en in de griesmeel', en: 'Cut and coat in semolina' },
      body: {
        nl: 'Rol het deeg uit tot twee centimeter dik en steek rondjes uit, of verdeel en vorm platte schijfjes. Bestrooi royaal met fijne griesmeel of maïsmeel aan beide kanten — dat geeft de karakteristieke korrelige buitenkant en voorkomt plakken op de plaat.',
        en: 'Roll the dough to two centimetres thick and cut rounds, or divide and shape flat discs. Coat generously with fine semolina or cornmeal on both sides — that gives the characteristic gritty exterior and stops them sticking to the griddle.',
      },
    }),
    proofStep({ baseMinutes: 90 }),
    {
      id: 'griddle',
      kind: 'bake',
      title: { nl: 'Op de plaat bakken', en: 'Cook on the griddle' },
      baseMinutes: 16,
      body: {
        nl: 'Bak op een droge, matig hete koekenplaat of gietijzeren pan — geen olie, de griesmeel doet het werk. Zeven tot acht minuten per kant op laag vuur: te heet en de buitenkant verbrandt voordat de binnenkant gaar is. Ze zijn klaar als beide kanten diep goudbruin zijn en de zijkant droog aanvoelt. Split ze met een vork, niet met een mes, om de holtes te bewaren.',
        en: 'Cook on a dry, moderately hot griddle or cast-iron pan — no oil, the semolina does the work. Seven to eight minutes a side on low heat: too hot and the outside burns before the inside cooks. They are done when both sides are deep gold and the edge feels dry. Split them with a fork, not a knife, to keep the nooks and crannies.',
      },
    },
    coolStep({ baseMinutes: 20 }),
  ],
  yield: { pieces: 8, gramsEach: 95 },
  bake: { temp: 0, lidMin: 0, openMin: 16, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { white: 'uk-plain-flour' },
    note: {
      nl: 'Geschreven voor Britse plain flour — niet te sterk, want English muffins willen een malse, niet taaie kruim. De melk maakt ze zacht.',
      en: 'Written for British plain flour — not too strong, because English muffins want a tender rather than chewy crumb. The milk keeps them soft.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['griddle', 'breakfast', 'rolls'],
};

export const porridgeMultigrain: Recipe = {
  slug: 'porridge-meergranenbrood',
  title: { nl: 'Porridge-meergranenbrood', en: 'Porridge multigrain' },
  summary: {
    nl: 'Een havermoutpap in het deeg maakt de kruim vochtig en houdbaar en de smaak diep en zoet. Het brood dat het langst goed blijft.',
    en: 'An oat porridge worked into the dough makes the crumb moist and long-keeping and the flavour deep and sweet. The loaf that stays good the longest.',
  },
  difficulty: 3,
  format: 'boule',
  totalHours: 26,
  activeMinutes: 45,
  flourBlend: [
    { role: 'white', pct: 60 },
    { role: 'wholegrain', pct: 25 },
    { role: 'strong-white', pct: 15 },
  ],
  hydration: 80,
  salt: 2.0,
  prefermentedFlour: 10,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 5,
  addIns: [
    { key: 'oat-porridge', name: { nl: 'Havermoutpap (gekookt)', en: 'Oat porridge (cooked)' }, pct: 20, type: 'soaker', absorbsWater: 1.6 },
  ],
  steps: [
    soakerStep({
      title: { nl: 'Havermoutpap koken', en: 'Cook the oat porridge' },
      body: {
        nl: 'Kook de havermout met water tot een dikke pap en laat volledig afkoelen. Warme pap doodt je desem en maakt het deeg plakkerig, dus dit moet koud zijn voor het erin gaat. De pap houdt water vast dat langzaam aan de kruim wordt afgegeven — dat is waarom dit brood dagen zacht blijft.',
        en: 'Cook the oats with water into a thick porridge and let it cool completely. Warm porridge kills your levain and makes the dough sticky, so this must be cold before it goes in. The porridge holds water that is slowly released to the crumb — which is why this loaf stays soft for days.',
      },
    }),
    levainStep(),
    mixStep({
      body: {
        nl: 'Meng de bloem, het water en de desem, en werk dan de koude pap erdoor. Het deeg wordt zacht en een beetje plakkerig van de pap — dat is goed. Het zout gaat er als laatste bij.',
        en: 'Mix the flour, water and levain, then work the cold porridge through. The dough turns soft and a little sticky from the porridge — that is right. The salt goes in last.',
      },
    }),
    foldStep(),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep(),
    coldProofStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 2, gramsEach: 950 },
  bake: { temp: 240, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 220 },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', wholegrain: 'us-whole-wheat', 'strong-white': 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour en volkoren. De pap telt niet mee in de 80% hydratatie — met het water dat de pap vasthoudt zit het effectief hoger, en dat is precies de bedoeling.',
      en: 'Written for American bread flour and wholemeal. The porridge is not counted in the 80% hydration — with the water it holds, the dough sits effectively higher, which is exactly the point.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['porridge', 'multigrain', 'long-keeping', 'boule'],
};

/* Pretzel-specific score step, kept local since only pretzels slash this way. */
function scoreStepPretzel(): Recipe['steps'][number] {
  return {
    id: 'score',
    kind: 'score',
    title: { nl: 'Insnijden', en: 'Score' },
    baseMinutes: 2,
    body: {
      nl: 'Snijd één diepe snee door de dikke onderkant van de knoop. Die snee gaat open in de oven en geeft de pretzel zijn karakteristieke gespleten buik.',
      en: 'Cut one deep slash through the thick belly of the knot. It opens in the oven and gives the pretzel its characteristic split belly.',
    },
  };
}
