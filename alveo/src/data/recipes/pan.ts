/**
 * The supported breads: recipes 7–10.
 *
 * Everything here bakes in a tin, a tray or on a stone, which means the flour's
 * carrying capacity matters far less. That is not a lesser category — it is
 * where sourdough stops being a weekend project and becomes a weekly habit.
 */

import type { Recipe } from '@/engine/types';
import {
  bakeStep, bulkStep, coldProofStep, coolStep, foldStep, laminationStep,
  levainStep, mixStep, proofStep, shapeStep, soakerStep,
} from './_steps';

export const focaccia: Recipe = {
  slug: 'desem-focaccia',
  title: { nl: 'Desemfocaccia', en: 'Sourdough focaccia' },
  summary: {
    nl: 'De hoogste opbrengst per eenheid vaardigheid op de site. Rijst in de bakplaat, kan niet uitzakken, en vergeeft vrijwel alles.',
    en: 'The highest reward-to-skill ratio on the site. Proofs in the tray, cannot spread, and forgives almost everything.',
  },
  difficulty: 1,
  format: 'focaccia',
  totalHours: 18,
  activeMinutes: 20,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 85,
  salt: 2.2,
  prefermentedFlour: 20,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    {
      key: 'olive-oil',
      name: { nl: 'Olijfolie', en: 'Olive oil' },
      pct: 6,
      type: 'fat',
    },
  ],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de plaat', en: 'Into the tray' },
      body: {
        nl: 'Giet een royale laag olie in de plaat en kiep het deeg erin. Trek het voorzichtig naar de hoeken; springt het terug, wacht dan tien minuten en probeer opnieuw. Forceren scheurt het deeg en dat zie je terug als een dichte plek in de kruim.',
        en: 'Pour a generous layer of oil into the tray and tip the dough in. Ease it towards the corners; if it springs back, wait ten minutes and try again. Forcing it tears the dough and you will see that later as a dense patch in the crumb.',
      },
    }),
    coldProofStep(),
    proofStep({
      title: { nl: 'Op temperatuur komen en kuiltjes maken', en: 'Warm up and dimple' },
      baseMinutes: 120,
      body: {
        nl: 'Haal de plaat uit de koelkast en laat hem op temperatuur komen tot het deeg gezwollen en luchtig aanvoelt. Olie je vingers, spreid ze en druk recht naar beneden tot je de bodem van de plaat voelt. Die kuiltjes zijn niet decoratief: ze houden de olie en het zout vast en ze zorgen dat de focaccia gelijkmatig rijst in plaats van in het midden op te bollen.',
        en: 'Take the tray from the fridge and let it come up until the dough feels swollen and airy. Oil your fingers, spread them, and press straight down until you feel the base of the tray. Those dimples are not decorative: they hold the oil and salt, and they make the focaccia rise evenly rather than doming in the middle.',
      },
    }),
    bakeStep(),
    coolStep({ baseMinutes: 20 }),
  ],
  yield: { pieces: 1, gramsEach: 1200 },
  bake: { temp: 230, lidMin: 0, openMin: 25, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'it-00-nuvola' },
    note: {
      nl: 'Geschreven voor Italiaanse tipo 0. Omdat de plaat het deeg draagt, is dit het recept dat het minst gevoelig is voor welk meel je gebruikt — een goede eerste bak met onbekende bloem.',
      en: 'Written for Italian tipo 0. Because the tray carries the dough, this is the recipe least sensitive to which flour you use — a good first bake with an unfamiliar bag.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['beginner', 'no-shaping', 'italian'],
};

export const pizza: Recipe = {
  slug: 'desem-pizza',
  title: { nl: 'Desempizza', en: 'Sourdough pizza' },
  summary: {
    nl: 'Vierentwintig tot achtenveertig uur koud. Een volledig andere meelogica: laag water, hoog zout, rekbaarheid boven kracht.',
    en: 'Twenty-four to forty-eight hours cold. Entirely different flour logic: low water, high salt, extensibility over strength.',
  },
  difficulty: 3,
  format: 'pizza',
  totalHours: 48,
  activeMinutes: 35,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 65,
  salt: 2.8,
  prefermentedFlour: 10,
  levain: { hydration: 100, ratio: '1:10:10', hours: 12, temp: 21 },
  bassinage: 0,
  steps: [
    levainStep(),
    mixStep(),
    bulkStep({ title: { nl: 'Korte bulk', en: 'Short bulk' } }),
    shapeStep({
      title: { nl: 'Bollen draaien', en: 'Ball up' },
      body: {
        nl: 'Verdeel het deeg en draai strakke bollen: leg elk stuk met de naad onder en draai het rond onder je holle hand tot het oppervlak spant. Leg de bollen los van elkaar in een afgesloten bak — ze zetten uit en aan elkaar geplakte bollen scheur je kapot bij het uitrekken.',
        en: 'Divide the dough and ball it tightly: set each piece seam side down and turn it under a cupped hand until the surface tightens. Set the balls apart in a sealed box — they expand, and balls stuck together tear when you open them out.',
      },
    }),
    coldProofStep({
      title: { nl: 'Koud, 24 tot 48 uur', en: 'Cold, 24 to 48 hours' },
      body: {
        nl: 'Vierentwintig uur is genoeg, achtenveertig is beter. De lange koude rijs is niet alleen smaak: hij ontspant het gluten zo ver dat je de bol met je vingertoppen kunt uitduwen zonder deegroller. Een pizzadeeg dat terugveert heeft simpelweg nog niet lang genoeg gestaan.',
        en: 'Twenty-four hours is enough, forty-eight is better. The long cold rise is not only flavour: it relaxes the gluten far enough that you can push the ball out with your fingertips and no rolling pin. A pizza dough that springs back has simply not sat long enough.',
      },
    }),
    proofStep({
      title: { nl: 'Op temperatuur komen', en: 'Come up to temperature' },
      baseMinutes: 180,
      body: {
        nl: 'Haal de bollen ruim van tevoren uit de koelkast. Koud deeg rekt niet, het scheurt — en een gescheurde bodem repareer je niet meer.',
        en: 'Take the balls out well in advance. Cold dough does not stretch, it tears — and a torn base cannot be repaired.',
      },
    }),
    bakeStep({
      title: { nl: 'Bakken, zo heet als je oven kan', en: 'Bake, as hot as your oven goes' },
      baseMinutes: 8,
      body: {
        nl: 'Zo heet mogelijk, op een goed voorverwarmde steen of staalplaat. Een huisoven op 250 °C doet er zes tot negen minuten over; een pizzaoven op 450 °C negentig seconden. Beide werken — maar in een huisoven bak je een dunnere bodem droger, dus houd hem iets dikker en beleg hem lichter.',
        en: 'As hot as it goes, on a thoroughly preheated stone or steel. A domestic oven at 250 °C takes six to nine minutes; a pizza oven at 450 °C takes ninety seconds. Both work — but a domestic oven dries a thin base out, so keep it slightly thicker and top it more lightly.',
      },
    }),
  ],
  yield: { pieces: 4, gramsEach: 260 },
  bake: { temp: 250, lidMin: 0, openMin: 8, coreTemp: [96, 99], vessel: ['stone-steam', 'deck'] },
  authorContext: {
    roleFlours: { white: 'it-00-pizza' },
    note: {
      nl: 'Geschreven voor Italiaanse 00 met W 260. Let op: 00 zegt niets over kracht — een 00 voor patisserie heeft de helft van deze W en houdt achtenveertig uur nooit vol.',
      en: 'Written for Italian 00 at W 260. Note: 00 says nothing about strength — a pastry 00 has half this W and will never survive forty-eight hours.',
    },
    doughTemp: 22,
  },
  attribution: {},
  tags: ['pizza', 'cold-ferment', 'italian'],
};

export const sandwichTin: Recipe = {
  slug: 'desem-busbrood',
  title: { nl: 'Desembusbrood', en: 'Sourdough sandwich tin loaf' },
  summary: {
    nl: 'Het brood dat desem van een weekendproject in een wekelijkse gewoonte verandert. Zacht, rechthoekig, en het houdt zich drie dagen.',
    en: 'The loaf that turns sourdough from a weekend project into a weekly habit. Soft, square, and it keeps for three days.',
  },
  difficulty: 2,
  format: 'tin',
  totalHours: 20,
  activeMinutes: 35,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 55,
  salt: 2.0,
  prefermentedFlour: 20,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'milk', name: { nl: 'Volle melk', en: 'Whole milk' }, pct: 15, type: 'dairy' },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 8, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 4, type: 'sugar' },
  ],
  steps: [
    levainStep(),
    mixStep({
      body: {
        default: {
          nl: 'Meng alles behalve de boter tot een samenhangend deeg. Voeg de boter pas toe als het gluten er al is — in klontjes tegelijk, en blijf doorwerken tot elk klontje is verdwenen voordat het volgende erbij gaat. Vet dat je te vroeg toevoegt gaat om de glutenstrengen heen zitten en dan bouw je nooit meer structuur op.',
          en: 'Mix everything except the butter into a coherent dough. Add the butter only once the gluten exists — a lump at a time, working each one fully in before the next. Fat added too early coats the gluten strands, and after that you will never build structure.',
        },
        'stand-mixer': {
          nl: 'Alles behalve de boter op stand 1, daarna stand 2 tot het deeg van de wand loslaat. Dan de boter, klontje voor klontje, op stand 1. Het deeg valt even uit elkaar en komt terug — dat hoort. Klaar als het glanst en van de kom loslaat. Dit is het recept waarvoor een standmixer het meeste verschil maakt.',
          en: 'Everything except the butter on speed 1, then speed 2 until the dough clears the bowl. Then the butter, a lump at a time, on speed 1. The dough falls apart briefly and comes back — that is expected. Done when it is glossy and leaves the sides. This is the recipe a stand mixer helps with most.',
        },
      },
    }),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Rollen en in de vorm', en: 'Roll and into the tin' },
      body: {
        nl: 'Plat het deeg uit tot een rechthoek zo breed als je bakvorm, rol het strak op vanaf de korte kant en leg het met de naad naar beneden in de ingevette vorm. Strak oprollen is hier belangrijker dan bij een vrijstaand brood: elke luchtbel die je erin rolt wordt een gat in je boterham.',
        en: 'Flatten the dough into a rectangle as wide as your tin, roll it up tightly from the short end and set it seam side down in the greased tin. Rolling tightly matters more here than on a free-standing loaf: every air pocket you roll in becomes a hole in your sandwich.',
      },
    }),
    coldProofStep(),
    proofStep({
      baseMinutes: 120,
      body: {
        nl: 'Laat het rijzen tot het deeg net boven de rand van de vorm uitkomt en koepelt. Bij een busbrood is te ver rijzen minder erg dan bij een vrijstaand brood — de vorm vangt het op — maar een deeg dat over de rand hangt zakt alsnog in tijdens het bakken.',
        en: 'Proof until the dough just clears the rim of the tin and domes. Over-proofing matters less in a tin than free-standing — the tin catches it — but a dough hanging over the rim will still collapse in the oven.',
      },
    }),
    bakeStep({
      body: {
        nl: 'Lager en langer dan een hardgebakken brood. Een busbrood wil een zachte korst, dus geen stoom en geen extreme hitte. Uit de vorm halen zodra het uit de oven komt, anders zweet de zijkant week.',
        en: 'Lower and longer than a hearth loaf. A tin loaf wants a soft crust, so no steam and no extreme heat. Turn it out of the tin the moment it leaves the oven, or the sides sweat and go soggy.',
      },
    }),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 200, lidMin: 0, openMin: 40, coreTemp: [93, 96], vessel: ['tin'] },
  authorContext: {
    roleFlours: { 'strong-white': 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour. Let op: de 55% in de formule is alléén water — met de melk erbij zit dit deeg effectief rond de 68%, en dat is het getal dat telt voor hoe het aanvoelt.',
      en: 'Written for American bread flour. Note: the 55% in the formula is water alone — with the milk it sits effectively near 68%, and that is the figure that governs how it feels.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['beginner', 'enriched', 'tin', 'weekly'],
};

export const rugbrod: Recipe = {
  slug: 'rugbrood',
  title: { nl: 'Rugbrød (volkorenrogge)', en: 'Rugbrød (whole rye)' },
  summary: {
    nl: 'Geen glutenontwikkeling, geen vormen, negentig minuten bakken en dan een etmaal wachten. Het bewijs dat de motor ook niet-tarwelogica aankan.',
    en: 'No gluten development, no shaping, a ninety-minute bake and then a full day of waiting. Proof that the engine handles non-wheat logic too.',
  },
  difficulty: 3,
  format: 'tin',
  totalHours: 48,
  activeMinutes: 30,
  flourBlend: [
    { role: 'rye', pct: 87.5, note: {
      nl: 'Percentages zijn van de gemalen bloem. Met de gebroken rogge uit de weekmassa erbij is dit brood 70% roggemeel, 20% gebroken rogge en 10% volkoren tarwe van het totale graan.',
      en: 'Percentages are of the milled flour. Counting the cracked rye in the soaker, this loaf is 70% rye flour, 20% cracked rye and 10% wholemeal wheat of total grain.',
    } },
    { role: 'wholegrain', pct: 12.5 },
  ],
  hydration: 88,
  salt: 2.0,
  prefermentedFlour: 25,
  levain: { hydration: 100, ratio: '1:4:4', hours: 14, temp: 24 },
  bassinage: 0,
  addIns: [
    {
      key: 'cracked-rye',
      name: { nl: 'Gebroken rogge', en: 'Cracked rye' },
      pct: 25,
      type: 'soaker',
      absorbsWater: 1.2,
    },
  ],
  steps: [
    soakerStep(),
    levainStep({
      title: { nl: 'Roggezuurdesem opbouwen', en: 'Build the rye sour' },
      body: {
        nl: 'Een roggezuurdesem, niet je gewone tarwestarter. Rogge fermenteert sneller en zuurder, en dat zuur is hier geen smaakkeuze maar techniek: het remt het amylase dat anders je kruim tot pap zou afbreken. Rijp als het oppervlak vol scheuren zit en het geheel duidelijk is gezwollen.',
        en: 'A rye sour, not your usual wheat starter. Rye ferments faster and sourer, and that acid is not a flavour choice here but a technique: it restrains the amylase that would otherwise break your crumb down to paste. Ripe when the surface is covered in cracks and the whole thing has clearly swollen.',
      },
    }),
    mixStep({
      title: { nl: 'Mengen (geen kneden)', en: 'Mix (no kneading)' },
      body: {
        nl: 'Meng alles tot een gelijkmatige, plakkerige massa — meer een dik beslag dan een deeg. Er valt hier niets te kneden: rogge vormt geen glutennetwerk, en de structuur van dit brood komt uit de zetmeelgel en de pentosanen. Blijven roeren maakt het alleen taaier.',
        en: 'Mix everything into an even, sticky mass — closer to a thick batter than a dough. There is nothing to knead here: rye forms no gluten network, and this loaf\'s structure comes from the starch gel and the pentosans. Working it longer only makes it gluier.',
      },
    }),
    bulkStep({
      title: { nl: 'Rijzen in de vorm', en: 'Proof in the tin' },
      body: {
        nl: 'Schep het beslag in een goed ingevette vorm en strijk de bovenkant glad met een natte spatel. Laat rijzen tot je kleine scheurtjes ziet aan het oppervlak en het geheel een derde is gegroeid. Verder laten rijzen levert niets op en zorgt alleen dat het instort in de oven.',
        en: 'Scoop the batter into a well-greased tin and smooth the top with a wet spatula. Leave until you see small cracks across the surface and the whole thing has grown by a third. Proofing further gains nothing and only makes it collapse in the oven.',
      },
    }),
    bakeStep({
      title: { nl: 'Lang en laag bakken', en: 'Long, low bake' },
      body: {
        nl: 'Begin heet om het brood te laten zetten en zak dan ver terug. Negentig minuten is geen typefout: de dichte kruim heeft die tijd nodig om helemaal door te garen. De kerntemperatuur moet boven 96 °C komen, anders blijft het midden nat.',
        en: 'Start hot to set the loaf, then drop back a long way. Ninety minutes is not a typo: the dense crumb needs that time to cook all the way through. The core must pass 96 °C or the middle stays wet.',
      },
    }),
    coolStep({
      title: { nl: 'Vierentwintig uur rusten', en: 'Rest for twenty-four hours' },
      baseMinutes: 1440,
      body: {
        nl: 'Wikkel het afgekoelde brood in een doek en laat het een etmaal liggen voordat je het aansnijdt. Dit is niet overdreven: de zetmeelgel moet zich zetten, en rugbrød dat je op de dag zelf aansnijdt is plakkerig en kruimelt uit elkaar. Daarna houdt het zich een week.',
        en: 'Wrap the cooled loaf in a cloth and leave it a full day before cutting. This is not fussiness: the starch gel has to set, and rugbrød cut on the day is gummy and falls apart. After that it keeps for a week.',
      },
    }),
  ],
  yield: { pieces: 1, gramsEach: 1600 },
  bake: { temp: 220, lidMin: 0, openMin: 90, coreTemp: [96, 99], vessel: ['tin'], openTemp: 170 },
  authorContext: {
    roleFlours: { rye: 'dk-rugmel', wholegrain: 'nl-volkorenmeel' },
    note: {
      nl: 'Geschreven voor Deens volkoren roggemeel. Dit is het recept waarbij de motor het meest afwijkt van tarwe-logica: geen vouwen, geen vormadvies, en een tolerantie die zo laag is dat de waarschuwingen luider klinken dan elders.',
      en: 'Written for Danish whole rye. This is the recipe where the engine departs furthest from wheat logic: no folds, no shaping advice, and a tolerance so low the warnings speak louder than elsewhere.',
    },
    doughTemp: 26,
  },
  attribution: {},
  tags: ['rye', 'nordic', 'tin', 'no-gluten-development'],
};
