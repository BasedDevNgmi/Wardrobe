/**
 * The hearth loaves: recipes 1–6.
 *
 * Every formula is stored relative to the flour its author was standing in
 * front of (`authorContext`). That is what makes substitution meaningful — a
 * published hydration is a measurement of one flour, not a universal truth.
 */

import type { Recipe } from '@/engine/types';
import {
  autolyseStep, bakeStep, bassinageStep, benchStep, bulkStep, coldProofStep,
  coolStep, foldStep, levainStep, mixStep, preshapeStep, proofStep,
  scoreStep, shapeStep,
} from './_steps';

export const everydayCountry: Recipe = {
  slug: 'alledaags-landbrood',
  title: { nl: 'Alledaags landbrood', en: 'Everyday country loaf' },
  summary: {
    nl: 'Het brood waarmee je begint en waar je op terugkomt. Vergevingsgezind genoeg om te leren, goed genoeg om elke week te bakken.',
    en: 'The loaf you start with and the one you come back to. Forgiving enough to learn on, good enough to bake every week.',
  },
  difficulty: 2,
  format: 'boule',
  totalHours: 24,
  activeMinutes: 40,
  flourBlend: [
    { role: 'white', pct: 80 },
    { role: 'wholegrain', pct: 20 },
  ],
  hydration: 75,
  salt: 2.0,
  prefermentedFlour: 10,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep(),
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
  yield: { pieces: 2, gramsEach: 900 },
  bake: { temp: 250, lidMin: 20, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 230 },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', wholegrain: 'us-whole-wheat' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour op 24 °C. Op Europees meel valt de hydratatie merkbaar lager uit — dat is het meel, niet het recept.',
      en: 'Written for American bread flour at 24 °C. On European flour the hydration lands noticeably lower — that is the flour, not the recipe.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['beginner', 'weekly', 'boule'],
};

export const wholegrainCountry: Recipe = {
  slug: 'volkoren-landbrood-50',
  title: { nl: '50% volkoren landbrood', en: '50% wholegrain country loaf' },
  summary: {
    nl: 'De smaakbak. Ook het beste bewijs van wat de motor doet: dezelfde formule met spelt in plaats van tarwe is een volledig ander brood.',
    en: 'The flavour bake. Also the best proof of what the engine does: the same formula with spelt instead of wheat is a completely different loaf.',
  },
  difficulty: 3,
  format: 'boule',
  totalHours: 26,
  activeMinutes: 45,
  flourBlend: [
    { role: 'wholegrain', pct: 50 },
    { role: 'white', pct: 25 },
    { role: 'strong-white', pct: 25, note: {
      nl: 'Dit kwart draagt het hele brood. Bezuinig hier niet op sterkte.',
      en: 'This quarter carries the whole loaf. Do not economise on strength here.',
    } },
  ],
  hydration: 82,
  salt: 1.9,
  prefermentedFlour: 5,
  levain: { hydration: 100, ratio: '1:8:8', hours: 10, temp: 24 },
  bassinage: 5,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 60, title: { nl: 'Autolyse (lang)', en: 'Autolyse (long)' } }),
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
  yield: { pieces: 2, gramsEach: 950 },
  bake: { temp: 250, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 225 },
  authorContext: {
    roleFlours: {
      wholegrain: 'us-whole-wheat',
      white: 'us-ap-flour',
      'strong-white': 'us-bread-flour',
    },
    note: {
      nl: 'Geschreven voor Amerikaans volkoren en bread flour. Zemelen nemen traag water op, dus de lange autolyse is hier geen luxe.',
      en: 'Written for American wholemeal and bread flour. Bran takes water up slowly, so the long autolyse is not a luxury here.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['wholegrain', 'flavour', 'boule'],
};

export const highHydrationWhite: Recipe = {
  slug: 'hoge-hydratatie-wit',
  title: { nl: 'Wit brood met hoge hydratatie', en: 'High-hydration white' },
  summary: {
    nl: 'Dunne, knappende korst en een open blonde kruim. Het brood waar iedereen naartoe werkt, en het brood dat het minst vergeeft.',
    en: 'A thin, crackling crust and an open blond crumb. The loaf everyone works towards, and the one that forgives least.',
  },
  difficulty: 5,
  format: 'batard',
  totalHours: 26,
  activeMinutes: 55,
  flourBlend: [
    { role: 'strong-white', pct: 90 },
    { role: 'wholegrain', pct: 10, note: {
      nl: 'Tien procent volkoren is hier geen smaakkeuze maar brandstof: het geeft de fermentatie iets om aan te werken.',
      en: 'Ten per cent wholemeal here is not a flavour choice but fuel: it gives the fermentation something to work on.',
    } },
  ],
  hydration: 85,
  salt: 1.8,
  prefermentedFlour: 6.3,
  levain: { hydration: 100, ratio: '1:10:10', hours: 12, temp: 22 },
  bassinage: 8,
  steps: [
    levainStep(),
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
  bake: { temp: 260, lidMin: 20, openMin: 22, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 235 },
  authorContext: {
    roleFlours: { 'strong-white': 'us-bread-flour', wholegrain: 'us-whole-wheat' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour, die door zijn hardere graan en walsmaling fors meer water draagt dan Europese bloem van hetzelfde eiwitgehalte. Dit is precies het recept dat op T65 verandert in soep.',
      en: 'Written for American bread flour, which carries far more water than European flour of the same protein because of its harder grain and roller milling. This is precisely the recipe that turns to soup on T65.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['advanced', 'open-crumb', 'batard'],
};

export const painDeCampagne: Recipe = {
  slug: 'pain-de-campagne',
  title: { nl: 'Pain de campagne', en: 'Pain de campagne' },
  summary: {
    nl: 'Rogge en een lange koele bulk. Bijna dezelfde moeite als het alledaagse landbrood en een volstrekt ander brood.',
    en: 'Rye and a long cool bulk. Almost the same effort as the everyday loaf, and a completely different bread.',
  },
  difficulty: 3,
  format: 'boule',
  totalHours: 30,
  activeMinutes: 45,
  flourBlend: [
    { role: 'white', pct: 75 },
    { role: 'wholegrain', pct: 15 },
    { role: 'rye', pct: 10, note: {
      nl: 'Tien procent rogge is genoeg om de smaak volledig om te gooien zonder de techniek te veranderen. Boven de twintig procent verandert allebei.',
      en: 'Ten per cent rye is enough to change the flavour completely without changing the technique. Above twenty per cent, both change.',
    } },
  ],
  hydration: 78,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 60, ratio: '1:4:2.4', hours: 12, temp: 21 },
  bassinage: 3,
  steps: [
    levainStep({
      title: { nl: 'Stijve desem opbouwen', en: 'Build the stiff levain' },
      body: {
        nl: 'Een stijve desem op 60% hydratatie: kneed hem tot een bal in plaats van hem te roeren. Stijf gaat trager en produceert meer azijnzuur dan melkzuur, wat het brood die scherpere, langer aanhoudende smaak geeft. Hij is rijp als de bal duidelijk is gezwollen en licht gebarsten aan de bovenkant.',
        en: 'A stiff levain at 60% hydration: knead it into a ball rather than stirring it. Stiff goes slower and makes more acetic than lactic acid, which is what gives this loaf its sharper, longer-lasting flavour. It is ripe when the ball has clearly swollen and cracked slightly on top.',
      },
    }),
    autolyseStep(),
    mixStep(),
    bassinageStep(),
    foldStep(),
    bulkStep({
      title: { nl: 'Lange koele bulkrijs', en: 'Long cool bulk' },
      body: {
        nl: 'Zet dit deeg koeler weg dan je gewend bent — rond de 21 °C. Het duurt langer en dat is de bedoeling: de trage fermentatie is waar de smaak vandaan komt, en rogge fermenteert snel genoeg dat je die rem nodig hebt.',
        en: 'Keep this dough cooler than you are used to — around 21 °C. It takes longer and that is the point: the slow fermentation is where the flavour comes from, and rye ferments fast enough that you need the brake.',
      },
    }),
    preshapeStep(),
    benchStep(),
    shapeStep(),
    coldProofStep(),
    scoreStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 2, gramsEach: 900 },
  bake: { temp: 250, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 230 },
  authorContext: {
    roleFlours: { white: 'fr-t65', wholegrain: 'fr-t150', rye: 'fr-seigle-t130' },
    note: {
      nl: 'Geschreven voor Franse T65 op 21 °C. Op Amerikaanse bread flour vraagt dit recept juist méér water, niet minder — de motor rekent dat om.',
      en: 'Written for French T65 at 21 °C. On American bread flour this recipe wants *more* water, not less — the engine converts it.',
    },
    doughTemp: 21,
  },
  attribution: {},
  tags: ['rye', 'flavour', 'french'],
};

export const ciabatta: Recipe = {
  slug: 'desem-ciabatta',
  title: { nl: 'Desemciabatta', en: 'Sourdough ciabatta' },
  summary: {
    nl: 'Geen vormen, alleen snijden en uitrekken. De grootste opbrengst voor de minste handvaardigheid op de hele site.',
    en: 'No shaping, just cut and stretch. The largest reward for the least handling skill on the whole site.',
  },
  difficulty: 4,
  format: 'ciabatta',
  totalHours: 20,
  activeMinutes: 30,
  flourBlend: [
    { role: 'strong-white', pct: 90 },
    { role: 'durum', pct: 10, note: {
      nl: 'Durum geeft de gele kleur en een kruim die dagenlang zacht blijft.',
      en: 'Durum gives the yellow colour and a crumb that stays soft for days.',
    } },
  ],
  hydration: 85,
  salt: 2.2,
  prefermentedFlour: 20,
  levain: { hydration: 60, ratio: '1:4:2.4', hours: 10, temp: 22 },
  bassinage: 10,
  steps: [
    levainStep({ title: { nl: 'Stijve desem opbouwen', en: 'Build the stiff levain' } }),
    mixStep(),
    bassinageStep(),
    foldStep(),
    bulkStep(),
    proofStep({
      title: { nl: 'Rijzen in de bak', en: 'Proof in the tub' },
      body: {
        nl: 'Laat het deeg in de bak rijzen, niet in een mandje. Dit brood wordt nooit gevormd, dus alle structuur die het heeft komt uit de bulk en de vouwen.',
        en: 'Let the dough proof in the tub, not in a basket. This bread is never shaped, so all the structure it has comes from the bulk and the folds.',
      },
    }),
    shapeStep({
      title: { nl: 'Snijden en uitrekken', en: 'Cut and stretch' },
      body: {
        nl: 'Kiep het deeg voorzichtig op een royaal bebloemd werkblad — je wilt het zo min mogelijk ontgassen. Snijd het met een deegsteker in rechthoeken, pak elke rechthoek aan de uiteinden en rek hem lang. Draai hem één keer om zodat de bebloemde kant boven ligt en leg hem op bakpapier. Meer niet.',
        en: 'Tip the dough gently onto a generously floured bench — you want to degas it as little as possible. Cut it into rectangles with a scraper, pick each one up by the ends and stretch it long. Turn it once so the floured side is up and set it on paper. Nothing more.',
      },
    }),
    bakeStep(),
    coolStep({ baseMinutes: 45 }),
  ],
  yield: { pieces: 4, gramsEach: 450 },
  bake: { temp: 250, lidMin: 0, openMin: 25, coreTemp: [96, 99], vessel: ['stone-steam', 'tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'it-00-nuvola', durum: 'it-semola-rimacinata' },
    note: {
      nl: 'Geschreven voor Italiaanse tipo 0 met W 300. Een zwakkere bloem draagt deze hydratatie niet — de motor verlaagt hem dan, en dat is geen compromis maar de juiste waarde.',
      en: 'Written for Italian tipo 0 at W 300. A weaker flour will not carry this hydration — the engine lowers it, and that is not a compromise but the right number.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['no-shaping', 'open-crumb', 'italian'],
};

export const baguettes: Recipe = {
  slug: 'desem-stokbrood',
  title: { nl: 'Desemstokbroden', en: 'Sourdough baguettes' },
  summary: {
    nl: 'De vorm- en insnijschool. Weinig desem, lange koude bulk, en geen enkele plek om een slordige beweging te verstoppen.',
    en: 'Shaping and scoring school. Low inoculation, long cold bulk, and nowhere to hide a sloppy movement.',
  },
  difficulty: 5,
  format: 'baguette',
  totalHours: 28,
  activeMinutes: 60,
  flourBlend: [
    { role: 'white', pct: 100, note: {
      nl: 'Eén bloem, geen mengsel. Een stokbrood is een test van techniek, en elke toevoeging geeft je iets om je achter te verschuilen.',
      en: 'One flour, no blend. A baguette is a test of technique, and every addition gives you something to hide behind.',
    } },
  ],
  hydration: 72,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:9:9', hours: 12, temp: 21 },
  bassinage: 0,
  steps: [
    levainStep({ title: { nl: 'Vloeibare desem opbouwen', en: 'Build the liquid levain' } }),
    autolyseStep({ baseMinutes: 60 }),
    mixStep(),
    foldStep(),
    bulkStep(),
    coldProofStep({
      title: { nl: 'Koude bulk', en: 'Cold bulk' },
      body: {
        nl: 'Bij dit brood gaat het déég de koelkast in, niet het gevormde brood. Dat maakt het deeg stevig genoeg om strak te rollen en geeft de smaak de tijd die een stokbrood met weinig desem nodig heeft.',
        en: 'With this bread the *dough* goes into the fridge, not the shaped loaf. That firms it enough to roll tightly and gives the flavour the time a low-inoculation baguette needs.',
      },
    }),
    preshapeStep(),
    benchStep(),
    shapeStep({
      title: { nl: 'Stokbroden rollen', en: 'Roll the baguettes' },
      body: {
        nl: 'Plat het stuk voorzichtig uit tot een rechthoek, vouw het bovenste derde omlaag en druk de naad aan met je duim. Herhaal, en rol dan de laatste keer helemaal dicht. Rol vanuit het midden naar buiten tot de gewenste lengte, met lichte druk aan de uiteinden zodat ze spits worden. Leg ze met de naad naar boven in de plooien van een couche of een theedoek.',
        en: 'Flatten the piece gently into a rectangle, fold the top third down and press the seam with your thumb. Repeat, then roll it fully closed on the last pass. Roll from the middle outwards to length, easing off at the ends so they taper. Lay them seam side up in the folds of a couche or a tea towel.',
      },
    }),
    proofStep({ baseMinutes: 60 }),
    scoreStep({
      body: {
        nl: 'Drie tot vijf sneden, elk ongeveer evenwijdig aan de lengte van het brood en elk overlappend met een derde van de vorige. Het mes bijna plat houden. Dit is de moeilijkste beweging op de site en er is geen manier om hem te leren behalve door hem vaak fout te doen.',
        en: 'Three to five cuts, each running nearly along the length of the loaf and each overlapping a third of the last. Hold the blade almost flat. This is the hardest movement on the site and there is no way to learn it except by getting it wrong often.',
      },
    }),
    bakeStep(),
    coolStep({ baseMinutes: 30 }),
  ],
  yield: { pieces: 4, gramsEach: 320 },
  bake: { temp: 250, lidMin: 0, openMin: 22, coreTemp: [96, 99], vessel: ['stone-steam'] },
  authorContext: {
    roleFlours: { white: 'fr-t65-tradition' },
    note: {
      nl: 'Geschreven voor Franse tradition-T65 op 21 °C. Dit is het recept waar het verschil tussen continenten het duidelijkst is: dezelfde 72% op Canadese bloem geeft een deeg dat aanvoelt als 62%.',
      en: 'Written for French tradition T65 at 21 °C. This is the recipe where the difference between continents shows most plainly: the same 72% on Canadian flour gives a dough that feels like 62%.',
    },
    doughTemp: 21,
  },
  attribution: {},
  tags: ['advanced', 'shaping', 'french'],
};
