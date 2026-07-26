/**
 * Recipes 26–35 — flatbreads and crisp breads.
 *
 * Pita, naan, flatbread, grissini, crackers, simit, manakish, pan pizza, pizza
 * bianca, crumpets. All original formulas and prose. Cooking steps that are not
 * an oven bake (the griddle, the puff, the crisp) carry bespoke prose.
 */

import type { Recipe } from '@/engine/types';
import {
  bakeStep, bulkStep, coldProofStep, coolStep, foldStep, levainStep, mixStep,
  proofStep, shapeStep,
} from './_steps';

export const pita: Recipe = {
  slug: 'desempita',
  title: { nl: 'Desempita', en: 'Sourdough pita' },
  summary: {
    nl: 'Een hete oven blaast deze platbroden in seconden op tot een holle zak. Meer techniek dan het lijkt: alles draait om de hitte en een gladde, ontspannen bol.',
    en: 'A hot oven puffs these flatbreads into a hollow pocket in seconds. More technique than it looks: it is all about the heat and a smooth, relaxed round.',
  },
  difficulty: 3,
  format: 'rolls',
  totalHours: 14,
  activeMinutes: 35,
  flourBlend: [{ role: 'white', pct: 90 }, { role: 'wholegrain', pct: 10 }],
  hydration: 65,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [{ key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 3, type: 'fat' }],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Bollen en uitrollen', en: 'Ball and roll' },
      body: {
        nl: 'Draai gladde bollen en laat ze een half uur ontspannen — een gespannen bol veert terug en scheurt. Rol elk uit tot een schijf van een halve centimeter, gelijkmatig dik: een dunne plek scheurt en dan puft de pita niet.',
        en: 'Roll smooth balls and let them relax for half an hour — a tense ball springs back and tears. Roll each into a disc half a centimetre thick, evenly: a thin spot splits and then the pita will not puff.',
      },
    }),
    proofStep({ baseMinutes: 45 }),
    {
      id: 'bake-pita',
      kind: 'bake',
      title: { nl: 'Bakken op hoge hitte', en: 'Bake on high heat' },
      baseMinutes: 5,
      body: {
        nl: 'Zo heet mogelijk, op een gloeiend hete steen of gietijzeren pan. Binnen dertig tot zestig seconden vormt zich stoom in de kern en blaast de pita op tot een zak. Draai hem één keer en haal hem er bleek uit — een pita mag niet knapperig worden.',
        en: 'As hot as it goes, on a scorching stone or cast-iron pan. Within thirty to sixty seconds steam forms in the core and inflates the pita into a pocket. Turn it once and take it out pale — a pita should not go crisp.',
      },
    },
    coolStep({ baseMinutes: 10 }),
  ],
  yield: { pieces: 8, gramsEach: 90 },
  bake: { temp: 260, lidMin: 0, openMin: 5, coreTemp: [96, 99], vessel: ['stone-steam', 'deck'] },
  authorContext: {
    roleFlours: { white: 'fr-t65', wholegrain: 'fr-t150' },
    note: {
      nl: 'Geschreven voor Franse T65. De hitte is alles: een oven die niet heet genoeg is, geeft platte pita zonder zak.',
      en: 'Written for French T65. The heat is everything: an oven that is not hot enough gives flat pita with no pocket.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['flatbread', 'rolls', 'high-heat'],
};

export const naan: Recipe = {
  slug: 'desemnaan',
  title: { nl: 'Desemnaan', en: 'Sourdough naan' },
  summary: {
    nl: 'Zacht, luchtig en licht verrijkt met yoghurt en boter, gebakken in een gloeiend hete pan tot geblakerde blaren. Het meest bevredigende platbrood om thuis te maken.',
    en: 'Soft, airy and lightly enriched with yoghurt and butter, cooked in a scorching pan to blistered char. The most satisfying flatbread to make at home.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 14,
  activeMinutes: 35,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 60,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'yoghurt', name: { nl: 'Yoghurt', en: 'Yoghurt' }, pct: 20, type: 'dairy' },
    { key: 'butter', name: { nl: 'Gesmolten boter', en: 'Melted butter' }, pct: 6, type: 'fat' },
    { key: 'sugar', name: { nl: 'Suiker', en: 'Sugar' }, pct: 3, type: 'sugar' },
  ],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Uitrekken tot traan', en: 'Stretch into teardrops' },
      body: {
        nl: 'Verdeel en trek elk stuk met de handen uit tot een traanvorm, dikker aan één kant. Niet uitrollen — met de hand uitgetrokken naan houdt de luchtbellen die de blaren geven.',
        en: 'Divide and stretch each piece by hand into a teardrop, thicker at one end. Do not roll it — hand-stretched naan keeps the bubbles that give the blisters.',
      },
    }),
    proofStep({ baseMinutes: 45 }),
    {
      id: 'griddle-naan',
      kind: 'bake',
      title: { nl: 'In de hete pan', en: 'In the hot pan' },
      baseMinutes: 8,
      body: {
        nl: 'Bak op een droge, gloeiend hete gietijzeren pan. Als er blaren opkomen en de onderkant zwarte plekken krijgt, draaien. Twee tot drie minuten in totaal — naan bakt snel en wil juist die geblakerde plekken. Meteen met knoflookboter bestrijken.',
        en: 'Cook on a dry, scorching cast-iron pan. When blisters rise and the underside spots black, turn it. Two to three minutes total — naan cooks fast and wants those charred spots. Brush with garlic butter at once.',
      },
    },
    coolStep({ baseMinutes: 5 }),
  ],
  yield: { pieces: 6, gramsEach: 110 },
  bake: { temp: 0, lidMin: 0, openMin: 8, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { white: 'us-ap-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse all-purpose. De yoghurt maakt de kruim zacht en geeft een lichte zuurtoon bovenop de desem.',
      en: 'Written for American all-purpose. The yoghurt keeps the crumb soft and adds a light tang on top of the levain.',
    },
    doughTemp: 25,
  },
  attribution: {},
  tags: ['flatbread', 'griddle', 'enriched'],
};

export const flatbread: Recipe = {
  slug: 'desem-platbrood',
  title: { nl: 'Desemplatbrood', en: 'Sourdough flatbread' },
  summary: {
    nl: 'Een dun, soepel platbrood van de koekenpan, klaar in minuten — ideaal voor desemresten. Om te wikkelen, te scheuren en te dippen.',
    en: 'A thin, supple flatbread from the frying pan, ready in minutes — ideal for using up levain. To wrap, tear and dip.',
  },
  difficulty: 1,
  format: 'rolls',
  totalHours: 8,
  activeMinutes: 25,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 62,
  salt: 2.0,
  prefermentedFlour: 20,
  levain: { hydration: 100, ratio: '1:3:3', hours: 6, temp: 24 },
  bassinage: 0,
  addIns: [{ key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 5, type: 'fat' }],
  steps: [
    levainStep(),
    mixStep(),
    bulkStep({ title: { nl: 'Korte bulk', en: 'Short bulk' } }),
    shapeStep({
      title: { nl: 'Bollen en uitrollen', en: 'Ball and roll' },
      body: {
        nl: 'Verdeel, draai bolletjes en rol elk dun uit — hoe dunner, hoe soepeler het platbrood. Laat ze even ontspannen zodat ze niet terugveren.',
        en: 'Divide, roll balls and roll each out thin — the thinner, the more supple the flatbread. Let them relax briefly so they do not spring back.',
      },
    }),
    {
      id: 'griddle-flat',
      kind: 'bake',
      title: { nl: 'In de pan bakken', en: 'Cook in the pan' },
      baseMinutes: 8,
      body: {
        nl: 'Bak op een matig hete, droge of licht geoliede pan, een minuut per kant, tot er lichte bruine plekken komen en het brood soepel blijft. Onder een doek houden ze warm en zacht.',
        en: 'Cook on a moderately hot, dry or lightly oiled pan, a minute a side, until light brown spots appear and the bread stays supple. Kept under a cloth they stay warm and soft.',
      },
    },
    coolStep({ baseMinutes: 5 }),
  ],
  yield: { pieces: 8, gramsEach: 80 },
  bake: { temp: 0, lidMin: 0, openMin: 8, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { white: 'us-ap-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse all-purpose. Een snel recept met veel desem, perfect om overtollige starter te gebruiken.',
      en: 'Written for American all-purpose. A quick, high-levain recipe, perfect for using up excess starter.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['flatbread', 'griddle', 'quick', 'discard'],
};

export const grissini: Recipe = {
  slug: 'desem-grissini',
  title: { nl: 'Desemgrissini', en: 'Sourdough grissini' },
  summary: {
    nl: 'Dunne, knapperige broodstengels die dagenlang goed blijven. Laag hydratatie, veel olie, en het meest kindvriendelijke recept om samen te rollen.',
    en: 'Thin, crisp breadsticks that keep for days. Low hydration, plenty of oil, and the most child-friendly recipe to roll together.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 12,
  activeMinutes: 40,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 55,
  salt: 2.2,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [{ key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 8, type: 'fat' }],
  steps: [
    levainStep(),
    mixStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Stengels rollen', en: 'Roll the sticks' },
      baseMinutes: 20,
      body: {
        nl: 'Rol het deeg uit tot een lap, snijd in dunne repen en rol elke reep tussen je handen uit tot een lange, dunne stengel. Leg ze op een plaat; bestrooi eventueel met sesam of grof zout.',
        en: 'Roll the dough into a slab, cut into thin strips and roll each strip between your hands into a long, thin stick. Set them on a tray; top with sesame or coarse salt if you like.',
      },
    }),
    proofStep({ baseMinutes: 40 }),
    bakeStep({
      title: { nl: 'Droog en knapperig bakken', en: 'Bake dry and crisp' },
      body: {
        nl: 'Bak lang en niet te heet tot ze door en door droog en lichtgoud zijn — grissini moet knappen, niet buigen. Laten afkoelen op de plaat; ze worden nog knapperiger.',
        en: 'Bake long and not too hot until dry through and light gold — grissini should snap, not bend. Cool on the tray; they crisp up further.',
      },
    }),
    coolStep({ baseMinutes: 20 }),
  ],
  yield: { pieces: 20, gramsEach: 25 },
  bake: { temp: 180, lidMin: 0, openMin: 25, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { white: 'it-00-pizza' },
    note: {
      nl: 'Geschreven voor Italiaanse 00. De olie en het lange, droge bakken maken de stengels knapperig en houdbaar.',
      en: 'Written for Italian 00. The oil and the long, dry bake make the sticks crisp and long-keeping.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['crisp', 'snack', 'italian'],
};

export const crackers: Recipe = {
  slug: 'desemcrackers',
  title: { nl: 'Desemcrackers', en: 'Sourdough crackers' },
  summary: {
    nl: 'Flinterdunne, knapperige crackers van desemresten — de beste manier om overtollige starter te gebruiken in plaats van weg te gooien.',
    en: 'Wafer-thin, crisp crackers from levain discard — the best way to use up excess starter instead of throwing it out.',
  },
  difficulty: 1,
  format: 'rolls',
  totalHours: 6,
  activeMinutes: 30,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 55,
  salt: 2.2,
  prefermentedFlour: 30,
  levain: { hydration: 100, ratio: '1:2:2', hours: 4, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 10, type: 'fat' },
    { key: 'seeds', name: { nl: 'Zaden en kruiden', en: 'Seeds and herbs' }, pct: 10, type: 'dry' },
  ],
  steps: [
    levainStep({
      title: { nl: 'Desem of restjes', en: 'Levain or discard' },
      body: {
        nl: 'Hier hoeft de desem niet op de piek te zijn — juist restjes uit de koelkast werken uitstekend. Dit is een recept dat afval in iets goeds verandert.',
        en: 'The levain need not be at peak here — cold discard from the fridge works perfectly. This is a recipe that turns waste into something good.',
      },
    }),
    mixStep({
      body: {
        nl: 'Meng alles tot een stevig, kort deeg. Geen kneden, geen structuur nodig — crackers willen juist geen glutenontwikkeling, maar bros.',
        en: 'Mix everything into a firm, short dough. No kneading, no structure needed — crackers want no gluten development, but brittleness.',
      },
    }),
    bulkStep({ title: { nl: 'Korte rust', en: 'Short rest' }, baseMinutes: 60 }),
    shapeStep({
      title: { nl: 'Flinterdun uitrollen', en: 'Roll wafer-thin' },
      baseMinutes: 15,
      body: {
        nl: 'Rol het deeg zo dun mogelijk uit, direct op bakpapier — hoe dunner, hoe knapperiger. Prik overal gaatjes met een vork zodat het niet opbolt, en snijd in ruiten of laat het na het bakken breken.',
        en: 'Roll the dough as thin as you can, straight onto paper — the thinner, the crisper. Prick all over with a fork so it does not balloon, and cut into diamonds or let it snap after baking.',
      },
    }),
    bakeStep({
      title: { nl: 'Droog bakken', en: 'Bake dry' },
      body: {
        nl: 'Bak op matige hitte tot goudbruin en door en door droog. Houd de randen in de gaten — die kleuren eerder. Volledig laten afkoelen voordat je ze breekt.',
        en: 'Bake at moderate heat to gold and dry through. Watch the edges — they colour first. Cool completely before you break them.',
      },
    }),
    coolStep({ baseMinutes: 20 }),
  ],
  yield: { pieces: 1, gramsEach: 400 },
  bake: { temp: 175, lidMin: 0, openMin: 20, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { white: 'us-ap-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse all-purpose. Hoge desemhoeveelheid en een korte rijs — bedoeld om restjes te gebruiken, niet om te fermenteren voor smaak.',
      en: 'Written for American all-purpose. High levain and a short proof — meant to use discard, not to ferment for flavour.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['crisp', 'discard', 'snack'],
};

export const simit: Recipe = {
  slug: 'desemsimit',
  title: { nl: 'Desemsimit', en: 'Sourdough simit' },
  summary: {
    nl: 'Een Turkse sesamring: gedompeld in druivenmelasse en dik bedekt met sesam, met een taaie kruim en een knapperige, geroosterde korst.',
    en: 'A Turkish sesame ring: dipped in grape molasses and thickly coated in sesame, with a chewy crumb and a crisp, toasted crust.',
  },
  difficulty: 3,
  format: 'rolls',
  totalHours: 14,
  activeMinutes: 45,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 60,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Ringen draaien', en: 'Twist the rings' },
      baseMinutes: 20,
      body: {
        nl: 'Rol elk stuk tot een lange streng, vouw dubbel en draai de twee helften om elkaar, sluit dan tot een ring. Dompel elke ring in verdunde druivenmelasse (of honing met water) en rol hem daarna door een bord vol sesamzaad, tot hij helemaal bedekt is.',
        en: 'Roll each piece into a long rope, fold it double and twist the two halves around each other, then close into a ring. Dip each ring in diluted grape molasses (or honey and water) and roll it through a plate of sesame seeds until fully coated.',
      },
    }),
    proofStep({ baseMinutes: 60 }),
    bakeStep({
      body: {
        nl: 'Bak heet tot diep goudbruin: de sesam moet roosteren en de melasse karamelliseren. Dat is waar de smaak zit — een bleke simit mist de helft.',
        en: 'Bake hot to a deep gold-brown: the sesame should toast and the molasses caramelise. That is where the flavour is — a pale simit misses half of it.',
      },
    }),
    coolStep({ baseMinutes: 20 }),
  ],
  yield: { pieces: 6, gramsEach: 120 },
  bake: { temp: 230, lidMin: 0, openMin: 20, coreTemp: [96, 99], vessel: ['tray', 'stone-steam'] },
  authorContext: {
    roleFlours: { 'strong-white': 'de-manitoba-550' },
    note: {
      nl: 'Geschreven voor een sterke witte bloem. De taaie kruim vraagt om hoog eiwit; de melasse en sesam doen de rest.',
      en: 'Written for a strong white flour. The chewy crumb wants high protein; the molasses and sesame do the rest.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['sesame', 'rolls', 'turkish'],
};

export const manakish: Recipe = {
  slug: 'desem-manakish',
  title: { nl: 'Desem-manakish', en: 'Sourdough manakish' },
  summary: {
    nl: 'Een Levantijns platbrood, bedekt met za\'atar en olijfolie en heet gebakken tot de randen kleuren. Ontbijt, lunch of meze.',
    en: 'A Levantine flatbread, topped with za\'atar and olive oil and baked hot until the edges colour. Breakfast, lunch or meze.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 14,
  activeMinutes: 35,
  flourBlend: [{ role: 'white', pct: 90 }, { role: 'wholegrain', pct: 10 }],
  hydration: 62,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [{ key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 4, type: 'fat' }],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'Uitrollen en beleggen', en: 'Roll out and top' },
      body: {
        nl: 'Verdeel, rol elk stuk uit tot een schijf en druk met je vingers kuiltjes in het oppervlak. Meng za\'atar met royaal olijfolie tot een pasta en strijk die over elke schijf, tot vlak bij de rand.',
        en: 'Divide, roll each piece into a disc and press dimples into the surface with your fingers. Mix za\'atar with generous olive oil into a paste and spread it over each disc, almost to the edge.',
      },
    }),
    proofStep({ baseMinutes: 45 }),
    {
      id: 'bake-manakish',
      kind: 'bake',
      title: { nl: 'Heet bakken', en: 'Bake hot' },
      baseMinutes: 8,
      body: {
        nl: 'Bak op een hete steen of plaat tot de bodem lichtgoud is en de randen kleuren — vijf tot acht minuten. De za\'atar mag geuren maar niet verbranden. Warm serveren.',
        en: 'Bake on a hot stone or tray until the base is light gold and the edges colour — five to eight minutes. The za\'atar should become fragrant but not burn. Serve warm.',
      },
    },
    coolStep({ baseMinutes: 5 }),
  ],
  yield: { pieces: 6, gramsEach: 110 },
  bake: { temp: 240, lidMin: 0, openMin: 8, coreTemp: [96, 99], vessel: ['stone-steam', 'tray'] },
  authorContext: {
    roleFlours: { white: 'fr-t65', wholegrain: 'fr-t150' },
    note: {
      nl: 'Geschreven voor Franse T65. Een eenvoudig, snel platbrood — de za\'atar en olie zijn de ster, het deeg is de drager.',
      en: 'Written for French T65. A simple, quick flatbread — the za\'atar and oil are the star, the dough is the carrier.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['flatbread', 'levantine', 'za\'atar'],
};

export const panPizza: Recipe = {
  slug: 'desem-panpizza',
  title: { nl: 'Desem-panpizza', en: 'Sourdough pan pizza' },
  summary: {
    nl: 'Dik, luchtig en knapperig aan de onderkant, gebakken in een geoliede plaat. Meer brood dan de dunne pizza, en veel vergevingsgezinder om te maken.',
    en: 'Thick, airy and crisp on the bottom, baked in an oiled tray. More bread than the thin pizza, and far more forgiving to make.',
  },
  difficulty: 2,
  format: 'focaccia',
  totalHours: 24,
  activeMinutes: 25,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 75,
  salt: 2.2,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [{ key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 4, type: 'fat' }],
  steps: [
    levainStep(),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de plaat drukken', en: 'Press into the tray' },
      body: {
        nl: 'Giet olie in de plaat en kiep het deeg erin. Druk het voorzichtig naar de hoeken; springt het terug, wacht tien minuten. Forceren scheurt het deeg en geeft een dichte plek.',
        en: 'Pour oil into the tray and tip the dough in. Press it gently towards the corners; if it springs back, wait ten minutes. Forcing it tears the dough and gives a dense patch.',
      },
    }),
    coldProofStep(),
    proofStep({
      title: { nl: 'Op temperatuur komen', en: 'Come up to temperature' },
      baseMinutes: 120,
      body: {
        nl: 'Laat de plaat op temperatuur komen tot het deeg gezwollen en luchtig is. Beleg pas net voor het bakken — beleg dat te lang op rauw deeg ligt, maakt het nat.',
        en: 'Let the tray come up until the dough is swollen and airy. Top only just before baking — toppings sitting too long on raw dough make it soggy.',
      },
    }),
    bakeStep({
      body: {
        nl: 'Bak heet, onderin de oven, tot de bodem knapperig en goudbruin is. Til een hoek op om te controleren — de onderkant is waar een panpizza staat of valt.',
        en: 'Bake hot, low in the oven, until the base is crisp and gold-brown. Lift a corner to check — the bottom is where a pan pizza is made or lost.',
      },
    }),
    coolStep({ baseMinutes: 10 }),
  ],
  yield: { pieces: 1, gramsEach: 700 },
  bake: { temp: 250, lidMin: 0, openMin: 18, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { 'strong-white': 'it-00-nuvola' },
    note: {
      nl: 'Geschreven voor Italiaanse tipo 0. De plaat draagt het deeg, dus dit is een van de vergevingsgezindste recepten met onbekend meel.',
      en: 'Written for Italian tipo 0. The tray carries the dough, so this is one of the most forgiving recipes with an unfamiliar flour.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['pizza', 'pan', 'italian'],
};

export const pizzaBianca: Recipe = {
  slug: 'desem-pizza-bianca',
  title: { nl: 'Desem-pizza-bianca', en: 'Sourdough pizza bianca' },
  summary: {
    nl: 'Een Romeins wit platbrood: lang, dun, luchtig en alleen belegd met olijfolie en zout. Simpel tot het punt van perfectie.',
    en: 'A Roman white flatbread: long, thin, airy and topped with nothing but olive oil and salt. Simple to the point of perfection.',
  },
  difficulty: 3,
  format: 'focaccia',
  totalHours: 24,
  activeMinutes: 25,
  flourBlend: [{ role: 'strong-white', pct: 100 }],
  hydration: 80,
  salt: 2.2,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 5,
  addIns: [{ key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 5, type: 'fat' }],
  steps: [
    levainStep(),
    mixStep(),
    {
      id: 'bassinage',
      kind: 'bassinage',
      title: { nl: 'Bassinage', en: 'Bassinage' },
      baseMinutes: 5,
      body: {
        nl: 'Voeg het achtergehouden water toe zodra het deeg samenhangt en knijp het erdoor. Bij deze hoge hydratatie is bassinage de veiligste weg — in één keer erbij laat het deeg uit elkaar vallen.',
        en: 'Add the held-back water once the dough holds together and pinch it through. At this high hydration bassinage is the safest route — all at once breaks the dough apart.',
      },
    },
    foldStep(),
    bulkStep(),
    coldProofStep(),
    shapeStep({
      title: { nl: 'Uitrekken tot een lange lap', en: 'Stretch into a long slab' },
      body: {
        nl: 'Kiep het deeg voorzichtig op een royaal met griesmeel bestrooid werkblad en rek het met je vingertoppen uit tot een lange, dunne rechthoek — ontgas het zo min mogelijk. Op bakpapier of een schep leggen, besprenkelen met olie en zout.',
        en: 'Tip the dough gently onto a bench dusted with semolina and stretch it with your fingertips into a long, thin rectangle — degas it as little as possible. Onto paper or a peel, drizzle with oil and salt.',
      },
    }),
    bakeStep({
      body: {
        nl: 'Bak zo heet als je oven kan op een voorverwarmde steen, tot de bianca opbolt en goudbruine blaren krijgt. Warm scheuren en dippen.',
        en: 'Bake as hot as your oven goes on a preheated stone, until the bianca puffs and blisters gold-brown. Tear and dip warm.',
      },
    }),
    coolStep({ baseMinutes: 10 }),
  ],
  yield: { pieces: 1, gramsEach: 600 },
  bake: { temp: 260, lidMin: 0, openMin: 12, coreTemp: [96, 99], vessel: ['stone-steam', 'deck'] },
  authorContext: {
    roleFlours: { 'strong-white': 'it-00-nuvola' },
    note: {
      nl: 'Geschreven voor Italiaanse tipo 0 met W 300. Bij 80% hydratatie draagt alleen sterk meel dit deeg — op zwakker meel verlaagt de motor het getal.',
      en: 'Written for Italian tipo 0 at W 300. At 80% hydration only strong flour carries this dough — on weaker flour the engine lowers the number.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['pizza', 'roman', 'italian', 'open-crumb'],
};

export const crumpets: Recipe = {
  slug: 'desemcrumpets',
  title: { nl: 'Desemcrumpets', en: 'Sourdough crumpets' },
  summary: {
    nl: 'Op de plaat gebakken in ringen, met de kenmerkende gaatjes waar de boter in wegzakt. Een beslag, geen deeg — en het perfecte gebruik voor desemresten.',
    en: 'Cooked on the griddle in rings, with the characteristic holes that soak up butter. A batter, not a dough — and the perfect use for levain discard.',
  },
  difficulty: 2,
  format: 'rolls',
  totalHours: 6,
  activeMinutes: 30,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 95,
  salt: 1.8,
  prefermentedFlour: 30,
  levain: { hydration: 100, ratio: '1:2:2', hours: 4, temp: 24 },
  bassinage: 0,
  addIns: [{ key: 'milk', name: { nl: 'Melk', en: 'Milk' }, pct: 20, type: 'dairy' }],
  steps: [
    levainStep({ title: { nl: 'Desem of restjes', en: 'Levain or discard' } }),
    mixStep({
      title: { nl: 'Beslag roeren', en: 'Whisk the batter' },
      body: {
        nl: 'Klop alles tot een glad, lopend beslag — dit is geen deeg. Laat het een uur staan tot het bubbelt en luchtig wordt; die bellen worden straks de gaatjes.',
        en: 'Whisk everything into a smooth, pourable batter — this is not a dough. Let it stand an hour until it bubbles and turns airy; those bubbles become the holes.',
      },
    }),
    bulkStep({ title: { nl: 'Laten bubbelen', en: 'Let it bubble' }, baseMinutes: 90 }),
    {
      id: 'griddle-crumpet',
      kind: 'bake',
      title: { nl: 'In ringen bakken', en: 'Cook in rings' },
      baseMinutes: 12,
      body: {
        nl: 'Zet ingevette ringen op een matig hete, licht geoliede pan en giet elke ring voor de helft vol beslag. Bak op laag vuur tot de bovenkant vol gaatjes staat en droog aanvoelt — dat duurt enkele minuten. Draai kort om de bovenkant te zetten. Te heet en de gaatjes vormen zich niet.',
        en: 'Set greased rings on a moderately hot, lightly oiled pan and half-fill each with batter. Cook on low heat until the top is covered in holes and feels dry — that takes several minutes. Turn briefly to set the top. Too hot and the holes will not form.',
      },
    },
    coolStep({ baseMinutes: 10 }),
  ],
  yield: { pieces: 8, gramsEach: 75 },
  bake: { temp: 0, lidMin: 0, openMin: 12, coreTemp: [96, 99], vessel: ['tray'] },
  authorContext: {
    roleFlours: { white: 'uk-plain-flour' },
    note: {
      nl: 'Geschreven voor Britse plain flour. Het zeer natte beslag en de lage hitte zijn wat de gaatjes maken — dit is een beslag om te schenken, niet te vormen.',
      en: 'Written for British plain flour. The very wet batter and the low heat are what make the holes — this is a batter to pour, not to shape.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['griddle', 'discard', 'british', 'breakfast'],
};
