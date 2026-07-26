/**
 * Recipes 19–25 — enriched and sweet.
 *
 * Buns, rolls and sweet doughs. All original formulas and prose, built on the
 * shared step library with bespoke steps only where the technique is distinct
 * (the tangzhong scald, the roll-and-cut, the lamination-of-filling).
 */

import type { Recipe } from '@/engine/types';
import {
  bakeStep, bulkStep, coldProofStep, coolStep, foldStep, levainStep, mixStep,
  proofStep, shapeStep,
} from './_steps';

const enrichedMix = mixStep({
  body: {
    default: {
      nl: 'Meng alles behalve het vet tot een samenhangend deeg. Voeg het vet pas toe als het gluten er is, in kleine porties, en werk elke portie volledig in voordat de volgende erbij gaat. Vet dat je te vroeg toevoegt coat de glutenstrengen en dan bouw je geen structuur meer op.',
      en: 'Mix everything except the fat into a coherent dough. Add the fat only once the gluten exists, in small pieces, working each fully in before the next. Fat added too early coats the gluten strands and you build no more structure.',
    },
    'stand-mixer': {
      nl: 'Alles behalve het vet op stand 2 tot het deeg van de wand loslaat, dan het vet klontje voor klontje op stand 1. Voor verrijkt deeg maakt een standmixer het meeste verschil — met de hand kost dit geduld.',
      en: 'Everything except the fat on speed 2 until the dough clears the bowl, then the fat a lump at a time on speed 1. For enriched dough a stand mixer helps most — by hand this takes patience.',
    },
  },
});

export const dinnerRolls: Recipe = {
  slug: 'desem-tafelbroodjes',
  title: { nl: 'Desemtafelbroodjes', en: 'Sourdough dinner rolls' },
  summary: {
    nl: 'Zachte, pluizige broodjes die aan elkaar bakken en uit elkaar te trekken zijn. Licht verrijkt met melk en boter, perfect bij de maaltijd.',
    en: 'Soft, fluffy rolls that bake together and pull apart. Lightly enriched with milk and butter, perfect alongside a meal.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 16,
  activeMinutes: 35,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 62,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 15, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 8, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 5, type: 'sugar' },
  ],
  steps: [
    levainStep(),
    enrichedMix,
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Bollen draaien en schikken', en: 'Ball up and arrange' },
      body: {
        nl: 'Verdeel in gelijke stukken en draai strakke bolletjes: leg elk met de naad onder en draai het rond onder je holle hand. Schik ze net van elkaar in een ingevette vorm — tijdens de rijs en het bakken groeien ze naar elkaar toe en bakken ze aan elkaar.',
        en: 'Divide into equal pieces and roll tight balls: set each seam down and turn it under a cupped hand. Arrange them just apart in a greased tin — during proof and bake they grow together and bake as one.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 120 }),
    bakeStep({
      body: {
        nl: 'Bestrijk met melk of ei en bak zacht en niet te heet: deze broodjes willen een dunne, goudbruine korst en een pluizig kruim. Uit de oven meteen met boter bestrijken voor glans.',
        en: 'Brush with milk or egg and bake gentle, not too hot: these rolls want a thin, golden crust and a fluffy crumb. Brush with butter straight from the oven for shine.',
      },
    }),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 9, gramsEach: 70 },
  bake: { temp: 190, lidMin: 0, openMin: 22, coreTemp: [92, 96], vessel: ['tin', 'tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour. De 62% is alleen water; met de melk erbij zit het deeg effectief hoger en blijft het zacht.',
      en: 'Written for American bread flour. The 62% is water alone; with the milk the dough sits effectively higher and stays soft.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['enriched', 'rolls', 'soft'],
};

export const burgerBuns: Recipe = {
  slug: 'desem-hamburgerbroodjes',
  title: { nl: 'Desemhamburgerbroodjes', en: 'Sourdough burger buns' },
  summary: {
    nl: 'Zacht maar stevig genoeg om een sappige burger te dragen zonder uiteen te vallen. Bestrooid met sesam, met een glanzende korst.',
    en: 'Soft but sturdy enough to carry a juicy burger without falling apart. Topped with sesame, with a glossy crust.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 16,
  activeMinutes: 35,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 60,
  salt: 1.9,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 12, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 8, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 6, type: 'sugar' },
    { key: 'egg', name: { nl: 'Ei', en: 'Egg' }, pct: 15, type: 'dairy' },
  ],
  steps: [
    levainStep(),
    enrichedMix,
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Bollen en platdrukken', en: 'Ball and flatten' },
      body: {
        nl: 'Draai strakke bollen en druk ze daarna licht plat tot schijven — een burgerbroodje moet breder zijn dan hoog. Leg ze ruim van elkaar zodat ze los blijven.',
        en: 'Roll tight balls, then press them lightly into discs — a burger bun should be wider than it is tall. Set them well apart so they stay separate.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 120 }),
    bakeStep({
      body: {
        nl: 'Bestrijk met ei, bestrooi met sesam en bak tot goudbruin. Niet te heet — de kruim moet zacht blijven en de korst dun.',
        en: 'Brush with egg, scatter with sesame and bake to gold-brown. Not too hot — the crumb should stay soft and the crust thin.',
      },
    }),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 8, gramsEach: 90 },
  bake: { temp: 200, lidMin: 0, openMin: 18, coreTemp: [92, 96], vessel: ['tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour. Ei en melk maken het broodje zacht; de sterke bloem houdt het stevig genoeg voor een burger.',
      en: 'Written for American bread flour. Egg and milk keep the bun soft; the strong flour keeps it sturdy enough for a burger.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['enriched', 'rolls', 'sesame'],
};

export const milkBread: Recipe = {
  slug: 'desem-melkbrood',
  title: { nl: 'Desemmelkbrood (shokupan)', en: 'Sourdough milk bread (shokupan)' },
  summary: {
    nl: 'Wolkzacht, pluizig en dagenlang houdbaar dankzij een tangzhong: een gekookte bloempap die extra water in de kruim vasthoudt. Het zachtste brood op de site.',
    en: 'Cloud-soft, fluffy and long-keeping thanks to a tangzhong: a cooked flour paste that locks extra water into the crumb. The softest bread on the site.',
  },
  difficulty: 3,
  format: 'tin',
  totalHours: 18,
  activeMinutes: 45,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 58,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'tangzhong', name: { nl: 'Tangzhong (gekookte bloempap)', en: 'Tangzhong (cooked flour paste)' }, pct: 8, type: 'soaker', absorbsWater: 4 },
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 18, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 8, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 8, type: 'sugar' },
  ],
  steps: [
    {
      id: 'tangzhong',
      kind: 'soaker',
      title: { nl: 'Tangzhong koken', en: 'Cook the tangzhong' },
      baseMinutes: 10,
      body: {
        nl: 'Roer een deel van de bloem met vijf keer zoveel melk of water en verwarm al roerend tot het een dikke pudding wordt — rond de 65 °C, als de garde sporen achterlaat. Laat volledig afkoelen. Deze gekookte pap houdt water vast dat de gist niet meer kan verdrijven, en dat is het geheim achter de zachte, houdbare kruim.',
        en: 'Whisk a portion of the flour with five times its weight in milk or water and heat, stirring, until it thickens to a pudding — around 65 °C, when the whisk leaves trails. Cool completely. This cooked paste holds water the yeast can no longer drive off, and that is the secret to the soft, keeping crumb.',
      },
    },
    levainStep(),
    enrichedMix,
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Rollen en in de vorm', en: 'Roll and into the tin' },
      body: {
        nl: 'Verdeel in drie of vier stukken, rol elk uit en weer strak op, en leg ze naast elkaar in een ingevette busvorm. Het opgerolde deeg rijst als aparte lobben omhoog — dat geeft de kenmerkende pluk-vorm van shokupan.',
        en: 'Divide into three or four pieces, roll each out and up again tightly, and set them side by side in a greased tin. The rolled dough rises as separate lobes — that gives shokupan its characteristic pull-apart shape.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 150 }),
    bakeStep({
      body: {
        nl: 'Bestrijk met melk en bak zacht: shokupan wil een dunne, bleekgouden korst en een uiterst zachte kruim. Uit de vorm halen zodra het uit de oven komt.',
        en: 'Brush with milk and bake gentle: shokupan wants a thin, pale-gold crust and an extremely soft crumb. Turn it out of the tin the moment it leaves the oven.',
      },
    }),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 850 },
  bake: { temp: 180, lidMin: 0, openMin: 35, coreTemp: [90, 94], vessel: ['tin'] },
  authorContext: {
    roleFlours: { 'strong-white': 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour. De tangzhong telt niet mee in de 58% water — met het vastgehouden vocht erbij zit de kruim veel zachter dan het getal doet vermoeden.',
      en: 'Written for American bread flour. The tangzhong is not counted in the 58% water — with the moisture it holds, the crumb is far softer than the number suggests.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['enriched', 'tangzhong', 'tin', 'soft'],
};

export const cinnamonRolls: Recipe = {
  slug: 'desem-kaneelbroodjes',
  title: { nl: 'Desemkaneelbroodjes', en: 'Sourdough cinnamon rolls' },
  summary: {
    nl: 'Een verrijkt deeg, uitgerold, ingesmeerd met kaneelsuiker en opgerold. Een nacht koude rijs maakt ze luchtig en geeft ze een lichte desemtoon onder de zoetheid.',
    en: 'An enriched dough, rolled out, spread with cinnamon sugar and rolled up. An overnight cold proof makes them airy and gives a light sourdough note under the sweetness.',
  },
  difficulty: 3,
  format: 'enriched',
  totalHours: 18,
  activeMinutes: 50,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 55,
  salt: 1.6,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 20, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 12, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 10, type: 'sugar' },
    { key: 'egg', name: { nl: 'Ei', en: 'Egg' }, pct: 15, type: 'dairy' },
  ],
  steps: [
    levainStep(),
    enrichedMix,
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Uitrollen, vullen en oprollen', en: 'Roll out, fill and roll up' },
      baseMinutes: 20,
      body: {
        nl: 'Rol het deeg uit tot een rechthoek van een halve centimeter dik. Smeer het in met zachte boter en bestrooi royaal met kaneelsuiker, tot vlak bij de randen. Rol strak op vanaf de lange kant, snijd in gelijke plakken met een stuk draad of een scherp mes, en leg ze met de snijkant omhoog in een ingevette vorm.',
        en: 'Roll the dough into a rectangle half a centimetre thick. Spread it with soft butter and scatter generously with cinnamon sugar, almost to the edges. Roll up tightly from the long side, cut into equal slices with a length of thread or a sharp knife, and set them cut-side up in a greased dish.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 150 }),
    bakeStep({
      body: {
        nl: 'Bak zacht tot goudbruin en net gaar — te lang en de kaneelsuiker verbrandt. Laat iets afkoelen en bestrijk dan met een glazuur van roomkaas of poedersuiker.',
        en: 'Bake gentle to golden and just cooked — too long and the cinnamon sugar burns. Cool a little, then spread with a cream-cheese or icing-sugar glaze.',
      },
    }),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 9, gramsEach: 110 },
  bake: { temp: 180, lidMin: 0, openMin: 28, coreTemp: [90, 94], vessel: ['tin'] },
  authorContext: {
    roleFlours: { 'strong-white': 'fr-gruau-t45' },
    note: {
      nl: 'Geschreven voor Franse gruau — sterke bloem met lage as die vet en suiker draagt. De koude rijs geeft de broodjes tijd om luchtig te worden en een lichte zuurtoon te ontwikkelen.',
      en: 'Written for French gruau — strong, low-ash flour that carries fat and sugar. The cold proof gives the rolls time to grow airy and develop a light sour note.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['enriched', 'sweet', 'cinnamon'],
};

export const chocolateBabka: Recipe = {
  slug: 'desem-chocoladebabka',
  title: { nl: 'Desemchocoladebabka', en: 'Sourdough chocolate babka' },
  summary: {
    nl: 'Een gevlochten, verrijkt brood met lagen chocolade die door het deeg gedraaid zitten. Bewerkelijk, spectaculair, en het bewijs dat desem ook kan patisseren.',
    en: 'A twisted, enriched loaf with layers of chocolate wound through the dough. Involved, spectacular, and proof that sourdough can do patisserie too.',
  },
  difficulty: 5,
  format: 'enriched',
  totalHours: 20,
  activeMinutes: 70,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 55,
  salt: 1.6,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 18, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 15, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 12, type: 'sugar' },
    { key: 'egg', name: { nl: 'Ei', en: 'Egg' }, pct: 20, type: 'dairy' },
  ],
  steps: [
    levainStep(),
    enrichedMix,
    foldStep(),
    bulkStep(),
    coldProofStep({
      title: { nl: 'Koude rijs (verplicht)', en: 'Cold proof (required)' },
      body: {
        nl: 'Bij babka gaat het deeg vóór het vormen de koelkast in, een nacht lang. Koud, stevig deeg laat zich uitrollen en vullen zonder te scheuren; warm babkadeeg is onwerkbaar plakkerig.',
        en: 'With babka the dough goes into the fridge before shaping, overnight. Cold, firm dough rolls out and fills without tearing; warm babka dough is unworkably sticky.',
      },
    }),
    shapeStep({
      title: { nl: 'Vullen, snijden en vlechten', en: 'Fill, cut and twist' },
      baseMinutes: 25,
      body: {
        nl: 'Rol het koude deeg uit tot een dunne rechthoek en smeer het in met een chocolade-boterpasta. Rol strak op tot een cilinder, snijd die overlangs door zodat de lagen zichtbaar worden, en vlecht de twee helften met de snijkant naar boven om elkaar. Leg de vlecht in een ingevette busvorm.',
        en: 'Roll the cold dough into a thin rectangle and spread it with a chocolate-butter paste. Roll up tightly into a cylinder, cut it lengthwise so the layers show, and twist the two halves around each other cut-side up. Lay the twist in a greased tin.',
      },
    }),
    proofStep({ baseMinutes: 150 }),
    bakeStep({
      body: {
        nl: 'Bak tot diep goudbruin en gaar — babka mag donkerder dan je denkt. Bestrijk warm met suikersiroop voor glans en om het vochtig te houden.',
        en: 'Bake to a deep gold-brown and cooked through — babka can go darker than you think. Brush warm with sugar syrup for shine and to keep it moist.',
      },
    }),
    coolStep({ baseMinutes: 45 }),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 180, lidMin: 0, openMin: 40, coreTemp: [90, 94], vessel: ['tin'] },
  authorContext: {
    roleFlours: { 'strong-white': 'fr-gruau-t45' },
    note: {
      nl: 'Geschreven voor Franse gruau. De verplichte koude rijs is hier techniek, geen smaakkeuze: alleen koud deeg laat zich vullen en vlechten.',
      en: 'Written for French gruau. The required cold proof is a technique here, not a flavour choice: only cold dough can be filled and twisted.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['enriched', 'sweet', 'chocolate', 'advanced'],
};

export const currantBuns: Recipe = {
  slug: 'desem-krentenbollen',
  title: { nl: 'Desemkrentenbollen', en: 'Sourdough currant buns' },
  summary: {
    nl: 'Zachte, licht verrijkte broodjes vol geweekte krenten en rozijnen. Een Nederlandse klassieker, met desem in plaats van gist voor meer diepte.',
    en: 'Soft, lightly enriched buns full of soaked currants and raisins. A Dutch classic, with levain instead of yeast for more depth.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 16,
  activeMinutes: 35,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 60,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 15, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 8, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 8, type: 'sugar' },
    { key: 'fruit', name: { nl: 'Krenten en rozijnen (geweekt)', en: 'Currants and raisins (soaked)' }, pct: 50, type: 'dry', absorbsWater: 0.3 },
  ],
  steps: [
    levainStep(),
    enrichedMix,
    foldStep(),
    bulkStep({
      body: {
        nl: 'Werk de geweekte, goed uitgelekte vruchten er tijdens de eerste vouw doorheen — te vroeg en ze scheuren het deeg, te laat en ze zitten in klonten. Verdeel ze door te lamineren: rek het deeg uit, strooi de vruchten erover en rol op.',
        en: 'Work the soaked, well-drained fruit through during the first fold — too early and they tear the dough, too late and they clump. Distribute them by laminating: stretch the dough out, scatter the fruit over and roll up.',
      },
    }),
    shapeStep({
      title: { nl: 'Bollen draaien', en: 'Ball up' },
      body: {
        nl: 'Draai strakke bollen; duw uitstekende vruchten terug naar binnen, want krenten aan het oppervlak verbranden in de oven. Leg ze net van elkaar op een plaat.',
        en: 'Roll tight balls; push any protruding fruit back in, because currants on the surface burn in the oven. Set them just apart on a tray.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 120 }),
    bakeStep(),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 9, gramsEach: 90 },
  bake: { temp: 200, lidMin: 0, openMin: 20, coreTemp: [92, 96], vessel: ['tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'nl-bakkersbloem' },
    note: {
      nl: 'Geschreven voor Nederlandse bakkersbloem. De geweekte vruchten binden water — reken op een deeg dat iets natter aanvoelt dan de 60% doet vermoeden.',
      en: 'Written for Dutch baker\'s flour. The soaked fruit binds water — expect a dough that feels a little wetter than the 60% suggests.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['enriched', 'rolls', 'fruit', 'dutch'],
};

export const softSubRolls: Recipe = {
  slug: 'desem-puntbroodjes',
  title: { nl: 'Desempuntbroodjes', en: 'Sourdough sub rolls' },
  summary: {
    nl: 'Langwerpige, zachte broodjes met een dunne korst, gemaakt om te vullen. Stevig genoeg om beleg te dragen, zacht genoeg om makkelijk te bijten.',
    en: 'Long, soft rolls with a thin crust, made to be filled. Sturdy enough to hold a filling, soft enough to bite through easily.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 16,
  activeMinutes: 40,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 66,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 4, type: 'fat' },
  ],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Rollen tot puntbroodjes', en: 'Roll into subs' },
      body: {
        nl: 'Verdeel, plat elk stuk uit tot een rechthoek, rol strak op vanaf de lange kant en rol de uiteinden iets dunner. Leg ze met de naad onder op een plaat of in de plooien van een theedoek.',
        en: 'Divide, flatten each piece into a rectangle, roll up tightly from the long side and taper the ends slightly. Set them seam down on a tray or in the folds of a tea towel.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 90 }),
    {
      id: 'score',
      kind: 'score',
      title: { nl: 'Insnijden', en: 'Score' },
      baseMinutes: 2,
      body: {
        nl: 'Eén lange, ondiepe snee over de lengte. Bij een zacht broodje hoeft de snede niet diep — hij stuurt alleen waar het brood opent.',
        en: 'One long, shallow cut down the length. On a soft roll the score need not be deep — it only directs where the loaf opens.',
      },
    },
    bakeStep({
      body: {
        nl: 'Bak met wat stoom tot lichtgoud — puntbroodjes willen een dunne, zachte korst, geen knapperige. Niet te donker.',
        en: 'Bake with a little steam to light gold — sub rolls want a thin, soft crust, not a crackling one. Do not go too dark.',
      },
    }),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 6, gramsEach: 130 },
  bake: { temp: 220, lidMin: 0, openMin: 18, coreTemp: [94, 97], vessel: ['tray', 'stone-steam'] },
  authorContext: {
    roleFlours: { 'strong-white': 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour. De olie houdt de korst zacht; de sterke bloem houdt het broodje stevig genoeg om beleg te dragen.',
      en: 'Written for American bread flour. The oil keeps the crust soft; the strong flour keeps the roll sturdy enough to hold a filling.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['rolls', 'soft', 'sandwich'],
};
