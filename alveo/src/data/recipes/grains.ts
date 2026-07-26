/**
 * Recipes 36–50 — grain-forward and specialty.
 *
 * Spelt, einkorn, khorasan, emmer, whole wheat, graham, deli rye, Vollkornbrot,
 * pumpernickel, a seeded tin, walnut-raisin, olive-rosemary, malthouse, durum
 * semolina and a potato bread. All original formulas and prose, on the shared
 * step library, with bespoke steps only where a grain changes the technique.
 *
 * A note on the ancient grains: they carry protein but form a weak, extensible
 * gluten, so the formulas lean on a wheat backbone and lower hydration than the
 * protein number alone would suggest. The engine knows this — the species term
 * is a quality multiplier, not a ceiling — so on your own flour the water and
 * the folding advice move to match.
 */

import type { Recipe } from '@/engine/types';
import {
  autolyseStep, bakeStep, benchStep, bulkStep, coldProofStep, coolStep,
  foldStep, levainStep, mixStep, preshapeStep, proofStep, scoreStep,
  shapeStep, soakerStep,
} from './_steps';

export const speltTin: Recipe = {
  slug: 'spelt-busbrood',
  title: { nl: 'Speltbusbrood', en: 'Spelt tin loaf' },
  summary: {
    nl: 'Een zacht, zoet-nootachtig speltbrood in een busvorm. De vorm draagt het deeg dat spelt zelf niet strak kan houden, zodat je alle smaak krijgt zonder het risico.',
    en: 'A soft, sweet-nutty spelt loaf in a tin. The tin carries the dough that spelt cannot hold tightly on its own, so you get all the flavour without the risk.',
  },
  difficulty: 2,
  format: 'tin',
  totalHours: 18,
  activeMinutes: 35,
  flourBlend: [
    { role: 'white', pct: 50, note: {
      nl: 'Half spelt, half lichtere speltbloem: de bloem geeft net genoeg structuur om een strakke bus te vullen.',
      en: 'Half wholemeal spelt, half lighter spelt flour: the flour gives just enough structure to fill a clean tin.',
    } },
    { role: 'ancient', pct: 50 },
  ],
  hydration: 68,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 30, body: {
      default: {
        nl: 'Meng meel en water kort en laat maar dertig minuten staan — spelt heeft geen lange autolyse nodig en verzwakt juist als je het te lang laat weken. Kort en licht is hier het parool.',
        en: 'Mix flour and water briefly and rest just thirty minutes — spelt needs no long autolyse and in fact weakens if you soak it too long. Short and light is the rule here.',
      },
    } }),
    mixStep(),
    foldStep({ body: {
      default: {
        nl: 'Wees zachtaardig: spelt scheurt waar tarwe zou rekken. Vouw met natte handen en stop zodra je weerstand voelt. Twee of drie rustige coil folds zijn genoeg — meer bewerken breekt het vel dat je net hebt opgebouwd.',
        en: 'Be gentle: spelt tears where wheat would stretch. Fold with wet hands and stop the moment you feel resistance. Two or three calm coil folds are enough — more handling breaks the sheet you have just built.',
      },
    } }),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Vorm zonder te veel spanning een rol en leg hem met de naad onder in een ingevette busvorm. Spelt verdraagt geen strakke oppervlaktespanning zoals tarwe — forceer het niet, want dan scheurt het vel. De bus doet de rest.',
        en: 'Shape a loose roll without too much tension and set it seam down in a greased tin. Spelt will not take tight surface tension the way wheat does — do not force it, or the skin tears. The tin does the rest.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 120 }),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 220, lidMin: 0, openMin: 40, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { white: 'de-dinkel-630', ancient: 'de-dinkel-1050' },
    note: {
      nl: 'Geschreven voor Duitse Dinkel 630 en 1050. Spelt neemt sneller water op en overfermenteert eerder dan tarwe — houd de bulk korter aan dan je gewend bent.',
      en: 'Written for German Dinkel 630 and 1050. Spelt takes up water faster and over-ferments sooner than wheat — keep the bulk shorter than you are used to.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['spelt', 'tin', 'ancient'],
};

export const einkornPan: Recipe = {
  slug: 'einkorn-busbrood',
  title: { nl: 'Einkorn-busbrood', en: 'Einkorn pan loaf' },
  summary: {
    nl: 'Einkorn is het oudste graan dat we bakken en het zwakste — daarom draagt sterke tarwe hier de last en gaat de rest als smaak. Goudgeel van kruim, met een diepe graansmaak.',
    en: 'Einkorn is the oldest grain we bake and the weakest — so strong wheat carries the load here and the rest goes in for flavour. Golden crumb, with a deep grain taste.',
  },
  difficulty: 3,
  format: 'tin',
  totalHours: 18,
  activeMinutes: 35,
  flourBlend: [
    { role: 'white', pct: 60, note: {
      nl: 'Sterke tarwe is hier geen concessie maar noodzaak: einkorn vormt nauwelijks een netwerk, dus zonder deze ruggengraat krijg je een cake, geen brood.',
      en: 'Strong wheat here is not a concession but a necessity: einkorn forms barely any network, so without this backbone you get cake, not bread.',
    } },
    { role: 'ancient', pct: 40 },
  ],
  hydration: 62,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    mixStep({ body: {
      default: {
        nl: 'Meng alles tot een samenhangend, vrij stevig deeg. Kneed einkorn niet zoals tarwe: langdurig kneden breekt het zwakke netwerk in plaats van het op te bouwen. Zodra het glad is, stop je.',
        en: 'Mix everything into a coherent, fairly firm dough. Do not knead einkorn like wheat: prolonged kneading breaks the weak network instead of building it. As soon as it is smooth, stop.',
      },
      'stand-mixer': {
        nl: 'Kort op stand 1, net tot het samenkomt. Een machine is hier gevaarlijk: einkorn gaat van deeg naar plakkerige pap voordat je het doorhebt. Draai zo min mogelijk.',
        en: 'Briefly on speed 1, just until it comes together. A machine is dangerous here: einkorn goes from dough to sticky paste before you notice. Run it as little as possible.',
      },
    } }),
    foldStep({ body: {
      default: {
        nl: 'Eén, hooguit twee zachte vouwsets. Einkorndeeg voelt slap en een beetje kleverig en dat blijft zo — dat is geen teken dat je meer moet vouwen, het is de aard van het graan.',
        en: 'One, at most two gentle fold sets. Einkorn dough feels slack and a little tacky and stays that way — that is not a sign to fold more, it is the nature of the grain.',
      },
    } }),
    bulkStep({ body: {
      nl: 'Houd de bulk aan de korte kant en oordeel op het oog: einkorn overfermenteert snel en zakt dan onherstelbaar in. Stop bij een merkbare, luchtige toename, niet bij verdubbeling. Bij twijfel eerder dan later.',
      en: 'Keep the bulk on the short side and judge by eye: einkorn over-ferments fast and then collapses beyond rescue. Stop at a clear, airy increase, not at doubling. When in doubt, sooner rather than later.',
    } }),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Met natte handen een losse rol vormen en in de ingevette bus leggen. Verwacht geen strakke spanning — die krijg je niet, en dat hoeft ook niet. De bus geeft de vorm die het deeg zelf niet kan houden.',
        en: 'With wet hands shape a loose roll and set it in the greased tin. Do not expect tight tension — you will not get it, and you do not need it. The tin gives the shape the dough cannot hold itself.',
      },
    }),
    proofStep({ baseMinutes: 90 }),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 850 },
  bake: { temp: 210, lidMin: 0, openMin: 42, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', ancient: 'us-einkorn' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour met einkorn. Einkorn is het zwakste graan in de database — de motor verlaagt hydratatie en vervangt slap-and-fold door zachte vouwen zodra het aandeel stijgt.',
      en: 'Written for American bread flour with einkorn. Einkorn is the weakest grain in the database — the engine lowers hydration and swaps slap-and-fold for gentle folds as its share rises.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['einkorn', 'tin', 'ancient', 'advanced'],
};

export const khorasanLoaf: Recipe = {
  slug: 'khorasan-landbrood',
  title: { nl: 'Khorasan-landbrood', en: 'Khorasan country loaf' },
  summary: {
    nl: 'Khorasan — ook bekend als kamut — geeft een botergele kruim en een volle, bijna zoete smaak. Met een tarweruggengraat wordt het een echt vrijstaand brood.',
    en: 'Khorasan — also known as kamut — gives a butter-yellow crumb and a full, almost sweet flavour. With a wheat backbone it becomes a genuine free-standing loaf.',
  },
  difficulty: 3,
  format: 'batard',
  totalHours: 24,
  activeMinutes: 45,
  flourBlend: [
    { role: 'white', pct: 55 },
    { role: 'ancient', pct: 45, note: {
      nl: 'Khorasan draagt veel eiwit maar vormt een extensibel, zwak gluten — het rekt makkelijk maar houdt weinig spanning.',
      en: 'Khorasan carries plenty of protein but forms an extensible, weak gluten — it stretches easily but holds little tension.',
    } },
  ],
  hydration: 70,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 100, ratio: '1:5:5', hours: 9, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45 }),
    mixStep(),
    foldStep(),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep({ body: {
      nl: 'Vorm een strakke bâtard, maar bouw de spanning geleidelijk op: khorasandeeg rekt gewillig mee en scheurt dan plotseling. Draai het over het blad tot het vel strak staat en leg het met de naad naar boven in een langwerpig mandje.',
      en: 'Shape a tight bâtard, but build the tension gradually: khorasan dough stretches along willingly and then tears all at once. Drag it across the bench until the skin is taut and set it seam up in an oval banneton.',
    } }),
    coldProofStep(),
    scoreStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 245, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 225 },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', ancient: 'us-khorasan' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour met khorasan. Het hoge eiwit misleidt: reken op een zwakker deeg dan het getal doet vermoeden en houd de hydratatie in toom.',
      en: 'Written for American bread flour with khorasan. The high protein misleads: expect a weaker dough than the number suggests and keep the hydration in check.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['khorasan', 'kamut', 'batard', 'ancient'],
};

export const emmerLoaf: Recipe = {
  slug: 'emmer-landbrood',
  title: { nl: 'Emmer-landbrood', en: 'Emmer country loaf' },
  summary: {
    nl: 'Emmer is oertarwe met een rustieke, aardse smaak en een korrelige kruim. Een brood dat naar het veld smaakt, gedragen door een aandeel moderne tarwe.',
    en: 'Emmer is an ancient wheat with a rustic, earthy flavour and a coarse crumb. A loaf that tastes of the field, carried by a share of modern wheat.',
  },
  difficulty: 3,
  format: 'boule',
  totalHours: 24,
  activeMinutes: 45,
  flourBlend: [
    { role: 'white', pct: 60 },
    { role: 'ancient', pct: 40 },
  ],
  hydration: 72,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 100, ratio: '1:5:5', hours: 9, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45, body: {
      default: {
        nl: 'Meng meel en water en geef de volkoren emmer drie kwartier om zich vol te zuigen. Volkoren oergraan neemt zijn water traag op — een autolyse is hier geen luxe maar de manier waarop de zemelen zacht worden en het deeg zijn uiteindelijke stevigheid vindt.',
        en: 'Mix flour and water and give the wholemeal emmer three quarters of an hour to drink. Wholemeal ancient grain takes its water up slowly — an autolyse here is not a luxury but how the bran softens and the dough finds its final firmness.',
      },
    } }),
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
  yield: { pieces: 1, gramsEach: 950 },
  bake: { temp: 245, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 225 },
  authorContext: {
    roleFlours: { white: 'de-manitoba-550', ancient: 'de-emmer-vollkorn' },
    note: {
      nl: 'Geschreven voor sterke Duitse Manitoba 550 met volkoren emmer. De sterke bloem is de ruggengraat; de emmer levert de smaak en een deel van het water dat de zemelen vasthouden.',
      en: 'Written for strong German Manitoba 550 with wholemeal emmer. The strong flour is the backbone; the emmer brings the flavour and part of the water the bran holds.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['emmer', 'boule', 'ancient', 'wholegrain'],
};

export const wholeWheatTin: Recipe = {
  slug: 'volkoren-busbrood',
  title: { nl: 'Volkoren busbrood', en: 'Whole wheat tin loaf' },
  summary: {
    nl: 'Honderd procent volkoren in een bus: dicht, voedzaam en diep van smaak, met een lange autolyse die de zemelen temt. Het dagelijkse brood in zijn eerlijkste vorm.',
    en: 'A hundred per cent wholemeal in a tin: dense, nourishing and deep in flavour, with a long autolyse that tames the bran. The daily loaf in its most honest form.',
  },
  difficulty: 2,
  format: 'tin',
  totalHours: 22,
  activeMinutes: 35,
  flourBlend: [{ role: 'wholegrain', pct: 100 }],
  hydration: 78,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 60, body: {
      default: {
        nl: 'Meng meel en water en laat een vol uur staan. Bij honderd procent volkoren is dit de belangrijkste stap: de zemelen moeten verzadigd raken, anders trekken ze hun water later uit de kruim en krijg je een droog, kruimelig brood. Na een uur voelt het deeg soepeler en minder korrelig.',
        en: 'Mix flour and water and leave it a full hour. At a hundred per cent wholemeal this is the most important step: the bran must saturate, or it takes its water from the crumb later and you get a dry, crumbly loaf. After an hour the dough feels suppler and less gritty.',
      },
    } }),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Vorm een strakke rol op de lengte van je busvorm en leg hem met de naad onder in de ingevette bus. Volkorendeeg is minder elastisch, dus druk het rustig in de hoeken zodat het brood gelijkmatig rijst.',
        en: 'Shape a tight roll the length of your tin and set it seam down in the greased tin. Wholemeal dough is less elastic, so press it gently into the corners so the loaf rises evenly.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 120 }),
    bakeStep(),
    coolStep({ baseMinutes: 180 }),
  ],
  yield: { pieces: 1, gramsEach: 950 },
  bake: { temp: 225, lidMin: 0, openMin: 42, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { wholegrain: 'us-whole-wheat' },
    note: {
      nl: 'Geschreven voor Amerikaanse volkoren tarwe. Volkoren drinkt fors meer water dan witte bloem — op fijner gemalen of Europees volkoren verlaagt de motor het getal.',
      en: 'Written for American whole wheat. Wholemeal drinks far more water than white flour — on finer-milled or European wholemeal the engine lowers the number.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['wholegrain', 'tin', 'everyday'],
};

export const grahamTin: Recipe = {
  slug: 'graham-busbrood',
  title: { nl: 'Grahambusbrood', en: 'Graham tin loaf' },
  summary: {
    nl: 'Een zachter halfvolkoren busbrood met de zoete, nootachtige toon van grofgemalen witte volkorentarwe. Toegankelijker dan vol volkoren, met bijna evenveel smaak.',
    en: 'A softer half-wholemeal tin loaf with the sweet, nutty note of coarse-ground white whole wheat. More approachable than full wholemeal, with nearly as much flavour.',
  },
  difficulty: 1,
  format: 'tin',
  totalHours: 18,
  activeMinutes: 30,
  flourBlend: [
    { role: 'white', pct: 50 },
    { role: 'wholegrain', pct: 50 },
  ],
  hydration: 74,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45 }),
    mixStep(),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Vorm een gladde rol en leg hem met de naad onder in de ingevette busvorm. Dit is een van de vergevingsgezindste broden op de site — de bus vangt kleine vormfouten op.',
        en: 'Shape a smooth roll and set it seam down in the greased tin. This is one of the most forgiving loaves on the site — the tin catches small shaping mistakes.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 105 }),
    bakeStep(),
    coolStep({ baseMinutes: 150 }),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 220, lidMin: 0, openMin: 40, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { white: 'us-ap-flour', wholegrain: 'us-white-whole-wheat' },
    note: {
      nl: 'Geschreven voor Amerikaanse all-purpose en witte volkorentarwe. Witte volkoren is milder dan gewone volkoren maar drinkt bijna evenveel water.',
      en: 'Written for American all-purpose and white whole wheat. White whole wheat is milder than ordinary wholemeal but drinks nearly as much water.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['wholegrain', 'tin', 'beginner'],
};

export const deliRye: Recipe = {
  slug: 'deli-rogge',
  title: { nl: 'Deli-rogge met karwij', en: 'Deli rye with caraway' },
  summary: {
    nl: 'Een Amerikaans-Joods delibrood: overwegend tarwe met een stevig aandeel rogge en karwijzaad, met een taaie kruim en een dunne, glanzende korst. Gemaakt voor pastrami.',
    en: 'An American-Jewish deli loaf: mostly wheat with a firm share of rye and caraway seed, with a chewy crumb and a thin, glossy crust. Made for pastrami.',
  },
  difficulty: 3,
  format: 'batard',
  totalHours: 22,
  activeMinutes: 40,
  flourBlend: [
    { role: 'white', pct: 70 },
    { role: 'rye', pct: 30, note: {
      nl: 'Dertig procent rogge geeft smaak en taaiheid maar verzwakt het deeg — de tarwe houdt de vorm overeind.',
      en: 'Thirty per cent rye gives flavour and chew but weakens the dough — the wheat holds the shape up.',
    } },
  ],
  hydration: 72,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'caraway', name: { nl: 'Karwijzaad', en: 'Caraway seed' }, pct: 2, type: 'dry' },
  ],
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 40 }),
    mixStep({ body: {
      default: {
        nl: 'Meng alles, desem en zout, en werk het karwijzaad er tijdens het mengen doorheen zodat het gelijkmatig verdeeld raakt. Het deeg voelt door de rogge plakkeriger dan een puur tarwedeeg — dat is normaal, gebruik natte handen.',
        en: 'Mix everything, levain and salt, and work the caraway through as you mix so it distributes evenly. The dough feels stickier than a pure wheat one because of the rye — that is normal, use wet hands.',
      },
    } }),
    foldStep(),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep(),
    coldProofStep(),
    scoreStep(),
    bakeStep({ body: {
      nl: 'Bak met stoom en bestrijk het brood halverwege met een dun laagje zetmeelgel (maïzena met water, even opgekookt) voor de kenmerkende glans. Bak tot een stevige, donkere korst — een delibrood mag niet bleek zijn.',
      en: 'Bake with steam and brush the loaf halfway through with a thin starch glaze (cornflour boiled briefly with water) for the characteristic shine. Bake to a firm, dark crust — a deli loaf should not be pale.',
    } }),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 240, lidMin: 20, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 220 },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', rye: 'us-medium-rye' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour met medium rogge. De rogge verzwakt het deeg merkbaar — de motor kiest een voorzichtiger vouwtechniek naarmate het roggeaandeel stijgt.',
      en: 'Written for American bread flour with medium rye. The rye weakens the dough noticeably — the engine chooses a more cautious fold as the rye share rises.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['rye', 'caraway', 'batard', 'deli'],
};

export const vollkornbrot: Recipe = {
  slug: 'roggevolkorenbrood',
  title: { nl: 'Roggevolkorenbrood (Vollkornbrot)', en: 'Rye Vollkornbrot' },
  summary: {
    nl: 'Een Duits volkoren roggebrood met roggekorrels en een weekmassa, dicht en donker en dagenlang houdbaar. Geen kneden, geen vormspanning — rogge werkt anders dan tarwe.',
    en: 'A German wholemeal rye loaf with rye berries and a soaker, dense and dark and keeping for days. No kneading, no shaping tension — rye works differently from wheat.',
  },
  difficulty: 3,
  format: 'tin',
  totalHours: 24,
  activeMinutes: 30,
  flourBlend: [{ role: 'rye', pct: 100 }],
  hydration: 80,
  salt: 2.0,
  prefermentedFlour: 20,
  levain: { hydration: 100, ratio: '1:4:4', hours: 10, temp: 26 },
  bassinage: 0,
  addIns: [
    { key: 'rye-berries', name: { nl: 'Geweekte roggekorrels', en: 'Soaked rye berries' }, pct: 30, type: 'soaker', absorbsWater: 0.8 },
  ],
  steps: [
    soakerStep({
      title: { nl: 'Roggekorrels weken', en: 'Soak the rye berries' },
      body: {
        nl: 'Overgiet de roggekorrels met kokend water en laat ze een nacht staan tot ze zacht en gezwollen zijn. Ongeweekte korrels blijven hard en trekken water uit het brood — dit weken is niet optioneel. Giet af voordat ze in het deeg gaan.',
        en: 'Pour boiling water over the rye berries and leave them overnight until soft and swollen. Unsoaked berries stay hard and pull water from the bread — this soak is not optional. Drain before they go into the dough.',
      },
    }),
    levainStep({ body: {
      nl: 'Bouw een warme, actieve roggedesem bij zo\'n 26 °C. Rogge fermenteert snel en de zuurgraad is hier functioneel, niet alleen smaak: het zuur remt de enzymen die de kruim anders klef zouden maken. Gebruik de desem als hij vol bellen staat en scherp ruikt.',
      en: 'Build a warm, active rye levain at around 26 °C. Rye ferments fast and the acidity here is functional, not just flavour: the acid restrains the enzymes that would otherwise leave the crumb gummy. Use the levain when it is full of bubbles and smells sharp.',
    } }),
    mixStep({
      title: { nl: 'Roeren, niet kneden', en: 'Stir, do not knead' },
      body: {
        nl: 'Meng het roggemeel, water, desem, zout en de geweekte korrels tot een dik, plakkerig beslag met een lepel — rogge vormt geen gluten, dus kneden heeft geen zin. Het moet aanvoelen als natte klei, niet als deeg. Schep het meteen in de ingevette bus.',
        en: 'Mix the rye flour, water, levain, salt and soaked berries into a thick, sticky batter with a spoon — rye forms no gluten, so kneading is pointless. It should feel like wet clay, not dough. Scoop it straight into the greased tin.',
      },
    }),
    bulkStep({
      title: { nl: 'Rijs in de bus', en: 'Rise in the tin' },
      body: {
        nl: 'Strijk de bovenkant glad met een natte lepel en laat het in de bus rijzen tot er kleine barstjes in het oppervlak verschijnen. Bij rogge beoordeel je op die barstjes, niet op volume — het beslag verdubbelt niet zoals tarwedeeg.',
        en: 'Smooth the top with a wet spoon and let it rise in the tin until small cracks appear across the surface. With rye you judge by those cracks, not by volume — the batter does not double like wheat dough.',
      },
    }),
    bakeStep({
      title: { nl: 'Lang en donker bakken', en: 'Bake long and dark' },
      body: {
        nl: 'Bak lang op dalende hitte tot een dikke, donkere korst. Roggebrood heeft veel meer tijd nodig dan tarwe om door te garen — reken op een uur of langer. Uit de oven in een doek wikkelen en minstens een dag laten rusten voor je aansnijdt; verse rogge is klef, gerijpte rogge is perfect.',
        en: 'Bake long on falling heat to a thick, dark crust. Rye bread needs far more time than wheat to cook through — expect an hour or more. Wrap it in a cloth out of the oven and rest at least a day before cutting; fresh rye is gummy, matured rye is perfect.',
      },
    }),
    coolStep({ baseMinutes: 240 }),
  ],
  yield: { pieces: 1, gramsEach: 1000 },
  bake: { temp: 220, lidMin: 0, openMin: 60, coreTemp: [96, 99], vessel: ['tin'], openTemp: 190 },
  authorContext: {
    roleFlours: { rye: 'de-roggenvollkorn' },
    note: {
      nl: 'Geschreven voor Duitse roggevolkoren. Rogge vormt geen glutennetwerk — de motor kiest automatisch de vorm en behandeling die daarbij hoort en waarschuwt tegen kneden.',
      en: 'Written for German wholemeal rye. Rye forms no gluten network — the engine automatically chooses the shape and handling that suits it and warns against kneading.',
    },
    doughTemp: 26,
  },
  attribution: {},
  tags: ['rye', 'wholegrain', 'tin', 'german', 'long-keeping'],
};

export const pumpernickel: Recipe = {
  slug: 'pumpernickel',
  title: { nl: 'Pumpernickel', en: 'Pumpernickel' },
  summary: {
    nl: 'Een zeer donker, dicht roggebrood dat urenlang op lage temperatuur bakt tot het bijna zwart en zoet is van gekaramelliseerd zetmeel. Geduld in broodvorm.',
    en: 'A very dark, dense rye that bakes for hours at low heat until it is almost black and sweet with caramelised starch. Patience in the shape of a loaf.',
  },
  difficulty: 4,
  format: 'tin',
  totalHours: 30,
  activeMinutes: 35,
  flourBlend: [{ role: 'rye', pct: 100 }],
  hydration: 82,
  salt: 2.0,
  prefermentedFlour: 20,
  levain: { hydration: 100, ratio: '1:4:4', hours: 10, temp: 26 },
  bassinage: 0,
  addIns: [
    { key: 'old-bread', name: { nl: 'Geweekt oud roggebrood (Altbrot)', en: 'Soaked old rye bread (Altbrot)' }, pct: 15, type: 'soaker', absorbsWater: 1.2 },
  ],
  steps: [
    soakerStep({
      title: { nl: 'Oud brood weken', en: 'Soak the old bread' },
      body: {
        nl: 'Verkruimel oud roggebrood en overgiet het met kokend water tot een dikke brij; laat volledig afkoelen. Dit geweekte oude brood — Altbrot — geeft vocht, smaak en een donkere kleur, en is de traditionele manier om niets te verspillen. Zonder oud brood kun je dezelfde hoeveelheid volkoren roggemeel scalden.',
        en: 'Crumble old rye bread and pour boiling water over it into a thick mush; cool completely. This soaked old bread — Altbrot — adds moisture, flavour and dark colour, and is the traditional way of wasting nothing. Without old bread you can scald the same weight of wholemeal rye flour instead.',
      },
    }),
    levainStep(),
    mixStep({
      title: { nl: 'Roeren tot beslag', en: 'Stir into a batter' },
      body: {
        nl: 'Roer het roggemeel, water, desem, zout en de geweekte brij tot een dik, glanzend beslag. Er is niets te kneden — rogge werkt door tijd en zuur, niet door gluten. Schep het in een goed ingevette, smalle busvorm en druk luchtbellen eruit met een natte lepel.',
        en: 'Stir the rye flour, water, levain, salt and soaked mush into a thick, glossy batter. There is nothing to knead — rye works through time and acid, not gluten. Scoop it into a well-greased, narrow tin and press out air pockets with a wet spoon.',
      },
    }),
    bulkStep({
      title: { nl: 'Lange rijs in de bus', en: 'Long rise in the tin' },
      body: {
        nl: 'Laat het beslag in de afgedekte bus rijzen tot het merkbaar is opgekomen en het oppervlak begint te barsten. Neem hier de tijd — een goed doorgerezen pumpernickel voor het bakken is de helft van het werk.',
        en: 'Let the batter rise in the covered tin until it has visibly come up and the surface begins to crack. Take your time here — a well-risen pumpernickel before baking is half the work.',
      },
    }),
    bakeStep({
      title: { nl: 'Uren laag bakken', en: 'Bake low for hours' },
      body: {
        nl: 'Dek de bus af en bak op zeer lage temperatuur, urenlang. Dit is geen gewone bak: bij lage hitte karamelliseren de suikers langzaam en wordt het brood diep bruinzwart en zoet, zonder te verbranden. Reken op vier uur of meer. Volledig laten afkoelen en een dag laten rusten voor je aansnijdt.',
        en: 'Cover the tin and bake at very low temperature for hours. This is no ordinary bake: at low heat the sugars caramelise slowly and the bread turns deep brown-black and sweet without burning. Expect four hours or more. Cool completely and rest a day before slicing.',
      },
    }),
    coolStep({ baseMinutes: 300 }),
  ],
  yield: { pieces: 1, gramsEach: 1000 },
  bake: { temp: 120, lidMin: 240, openMin: 30, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { rye: 'de-roggen-1370' },
    note: {
      nl: 'Geschreven voor Duitse rogge 1370. De lange, lage bak is techniek, geen smaakkeuze: alleen zo karamelliseert het zetmeel zonder dat de korst verbrandt.',
      en: 'Written for German rye 1370. The long, low bake is a technique, not a flavour choice: only this way does the starch caramelise without the crust burning.',
    },
    doughTemp: 26,
  },
  attribution: {},
  tags: ['rye', 'wholegrain', 'tin', 'german', 'advanced'],
};

export const seededTin: Recipe = {
  slug: 'meerzaden-busbrood',
  title: { nl: 'Meerzaden-busbrood', en: 'Multiseed tin loaf' },
  summary: {
    nl: 'Een halfvolkoren busbrood boordevol geweekte zaden — zonnebloem, lijnzaad, sesam en pompoen. Vochtig, voedzaam en knapperig van korst.',
    en: 'A half-wholemeal tin loaf packed with soaked seeds — sunflower, linseed, sesame and pumpkin. Moist, nourishing and crisp of crust.',
  },
  difficulty: 2,
  format: 'tin',
  totalHours: 20,
  activeMinutes: 35,
  flourBlend: [
    { role: 'white', pct: 55 },
    { role: 'wholegrain', pct: 45 },
  ],
  hydration: 74,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'seeds', name: { nl: 'Gemengde zaden (geweekt)', en: 'Mixed seeds (soaked)' }, pct: 30, type: 'soaker', absorbsWater: 0.7 },
  ],
  steps: [
    soakerStep({
      title: { nl: 'Zaden weken', en: 'Soak the seeds' },
      body: {
        nl: 'Overgiet de gemengde zaden met kokend water en laat ze een paar uur staan tot ze het water hebben opgenomen en zacht zijn. Lijnzaad vormt een gel die het brood extra vochtig maakt. Droge zaden rechtstreeks in het deeg trekken hun water uit de kruim — daarom weken.',
        en: 'Pour boiling water over the mixed seeds and leave them a few hours until they have taken up the water and softened. Linseed forms a gel that makes the bread extra moist. Dry seeds added straight to the dough take their water from the crumb — hence the soak.',
      },
    }),
    levainStep(),
    autolyseStep({ baseMinutes: 45 }),
    mixStep({ body: {
      default: {
        nl: 'Meng bloem, water en desem, voeg het zout toe en werk dan de geweekte zaden erdoor. Verdeel ze goed — klonten zaden geven een brood dat langs die plekken breekt. Het deeg voelt vochtig en zwaar van de zaden.',
        en: 'Mix flour, water and levain, add the salt, then work the soaked seeds through. Distribute them well — clumps of seed give a loaf that breaks along those spots. The dough feels moist and heavy with the seeds.',
      },
    } }),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Vorm een rol en rol de natte bovenkant door een bord met extra zaden voor een knapperige, bezaaide korst. Leg hem met de naad onder in de ingevette bus.',
        en: 'Shape a roll and roll the wet top through a plate of extra seeds for a crisp, seeded crust. Set it seam down in the greased tin.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 105 }),
    bakeStep(),
    coolStep({ baseMinutes: 150 }),
  ],
  yield: { pieces: 1, gramsEach: 950 },
  bake: { temp: 225, lidMin: 0, openMin: 40, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', wholegrain: 'uk-heritage-wholemeal' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour en Brits volkoren. De geweekte zaden binden water dat niet in de 74% zit — het deeg zit effectief vochtiger dan het getal.',
      en: 'Written for American bread flour and British wholemeal. The soaked seeds bind water that is not in the 74% — the dough sits effectively moister than the number.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['multiseed', 'tin', 'wholegrain', 'seeded'],
};

export const walnutRaisin: Recipe = {
  slug: 'walnoot-rozijn',
  title: { nl: 'Walnoot-rozijnbrood', en: 'Walnut-raisin loaf' },
  summary: {
    nl: 'Een halfvolkoren brood vol walnoten en geweekte rozijnen — hartig en zoet tegelijk, perfect bij kaas. De walnoten kleuren de kruim licht paars, dat hoort zo.',
    en: 'A half-wholemeal loaf full of walnuts and soaked raisins — savoury and sweet at once, perfect with cheese. The walnuts tint the crumb faintly purple, which is as it should be.',
  },
  difficulty: 3,
  format: 'boule',
  totalHours: 24,
  activeMinutes: 45,
  flourBlend: [
    { role: 'white', pct: 70 },
    { role: 'wholegrain', pct: 30 },
  ],
  hydration: 74,
  salt: 2.0,
  prefermentedFlour: 12,
  levain: { hydration: 100, ratio: '1:5:5', hours: 9, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'walnuts', name: { nl: 'Walnoten', en: 'Walnuts' }, pct: 20, type: 'dry' },
    { key: 'raisins', name: { nl: 'Rozijnen (geweekt)', en: 'Raisins (soaked)' }, pct: 25, type: 'dry', absorbsWater: 0.3 },
  ],
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45 }),
    mixStep(),
    foldStep({ body: {
      default: {
        nl: 'Werk de walnoten en de geweekte, uitgelekte rozijnen er tijdens de eerste vouwset doorheen door te lamineren: rek het deeg uit tot een lap, verdeel de vulling en rol op. Te vroeg toevoegen scheurt het deeg met de scherpe notenstukken; te laat en de vulling zit in nesten.',
        en: 'Work the walnuts and the soaked, drained raisins through during the first fold by laminating: stretch the dough into a sheet, scatter the filling and roll up. Adding them too early tears the dough on the sharp nut pieces; too late and the filling sits in pockets.',
      },
    } }),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep({ body: {
      nl: 'Vorm een strakke boule en duw uitstekende noten en rozijnen terug naar binnen — wat aan het oppervlak zit, verbrandt. Leg het met de naad naar boven in een bebloemd mandje.',
      en: 'Shape a tight boule and push any protruding nuts and raisins back in — anything on the surface burns. Set it seam up in a floured banneton.',
    } }),
    coldProofStep(),
    scoreStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 950 },
  bake: { temp: 240, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven'], openTemp: 220 },
  authorContext: {
    roleFlours: { white: 'fr-t65', wholegrain: 'fr-t150' },
    note: {
      nl: 'Geschreven voor Franse T65 en T150. De geweekte rozijnen binden wat water; de noten voegen niets aan de hydratatie toe maar verzwaren het deeg.',
      en: 'Written for French T65 and T150. The soaked raisins bind a little water; the nuts add nothing to the hydration but weigh the dough down.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['walnut', 'raisin', 'boule', 'flavour'],
};

export const oliveRosemary: Recipe = {
  slug: 'olijf-rozemarijn',
  title: { nl: 'Olijf-rozemarijnbrood', en: 'Olive-rosemary loaf' },
  summary: {
    nl: 'Een mediterraan wit brood vol ontpitte olijven en verse rozemarijn, met olijfolie in het deeg. Het brood van de zomertafel, bij tapenade en een glas wijn.',
    en: 'A Mediterranean white loaf full of pitted olives and fresh rosemary, with olive oil in the dough. The bread of the summer table, with tapenade and a glass of wine.',
  },
  difficulty: 3,
  format: 'batard',
  totalHours: 22,
  activeMinutes: 40,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 72,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'oil', name: { nl: 'Olijfolie', en: 'Olive oil' }, pct: 4, type: 'fat' },
    { key: 'olives', name: { nl: 'Ontpitte olijven', en: 'Pitted olives' }, pct: 25, type: 'dry' },
    { key: 'rosemary', name: { nl: 'Verse rozemarijn', en: 'Fresh rosemary' }, pct: 2, type: 'dry' },
  ],
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 40 }),
    mixStep({ body: {
      default: {
        nl: 'Meng bloem, water, desem en olijfolie, voeg het zout toe — voorzichtig, want de olijven brengen zelf al zout mee. Houd de olijven en rozemarijn nog even apart; die gaan er bij het vouwen doorheen.',
        en: 'Mix flour, water, levain and olive oil, add the salt — carefully, because the olives bring their own salt. Keep the olives and rosemary aside for now; they go in during the folds.',
      },
    } }),
    foldStep({ body: {
      default: {
        nl: 'Dep de gehalveerde olijven droog — nat oppervlak laat ze uit het deeg glijden — en werk ze met de gehakte rozemarijn erdoor tijdens de eerste vouw, door te lamineren. Natte olijven maken gaten in de kruim, dus droog is beter dan snel.',
        en: 'Pat the halved olives dry — a wet surface makes them slide out of the dough — and work them with the chopped rosemary through during the first fold, by laminating. Wet olives make holes in the crumb, so dry beats fast.',
      },
    } }),
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
  bake: { temp: 240, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 220 },
  authorContext: {
    roleFlours: { white: 'fr-t65' },
    note: {
      nl: 'Geschreven voor Franse T65. Verlaag het zout in het deeg iets, want olijven brengen hun eigen zout mee — de 1,8% houdt daar rekening mee.',
      en: 'Written for French T65. Lower the dough salt a little, because olives bring their own — the 1.8% already accounts for it.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['olive', 'rosemary', 'batard', 'mediterranean'],
};

export const malthouseLoaf: Recipe = {
  slug: 'moutbrood',
  title: { nl: 'Moutbrood', en: 'Malthouse loaf' },
  summary: {
    nl: 'Een Brits moutbrood met gebroken tarwe en moutvlokken: zoet, kleverig en diep van smaak, met hele graankorrels door de kruim. Zwaar en bevredigend.',
    en: 'A British malted loaf with kibbled wheat and malt flakes: sweet, chewy and deep in flavour, with whole grains studded through the crumb. Hearty and satisfying.',
  },
  difficulty: 2,
  format: 'tin',
  totalHours: 20,
  activeMinutes: 35,
  flourBlend: [
    { role: 'white', pct: 60 },
    { role: 'wholegrain', pct: 40, note: {
      nl: 'Een moutmelange met gebroken tarwekorrels: de mout brengt zoetheid en enzymen die de fermentatie versnellen.',
      en: 'A malted blend with kibbled wheat grains: the malt brings sweetness and enzymes that speed the fermentation.',
    } },
  ],
  hydration: 72,
  salt: 1.8,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'malt', name: { nl: 'Moutextract', en: 'Malt extract' }, pct: 4, type: 'sugar' },
  ],
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45 }),
    mixStep({ body: {
      default: {
        nl: 'Meng alles met het moutextract erbij — dat is dik en plakkerig, dus los het eerst op in het water. De mout brengt enzymen mee die de fermentatie versnellen, dus houd de tijden aan de korte kant en beoordeel op het oog.',
        en: 'Mix everything with the malt extract — it is thick and sticky, so dissolve it in the water first. The malt brings enzymes that speed the fermentation, so keep the timings on the short side and judge by eye.',
      },
    } }),
    foldStep(),
    bulkStep({ body: {
      nl: 'Let op: de moutenzymen versnellen de rijs en verzwakken het deeg naar het einde toe. Houd de bulk korter aan dan bij een gewoon volkorenbrood en stop zodra het merkbaar luchtig is — een moutdeeg dat te ver gaat, wordt slap en klef.',
      en: 'Watch closely: the malt enzymes speed the rise and weaken the dough towards the end. Keep the bulk shorter than for an ordinary wholemeal and stop as soon as it is clearly airy — a malt dough taken too far turns slack and gummy.',
    } }),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Vorm een rol en leg hem met de naad onder in de ingevette bus. Het deeg is door de mout kleveriger dan gewoon — natte handen en een lichte hand helpen.',
        en: 'Shape a roll and set it seam down in the greased tin. The dough is stickier than usual because of the malt — wet hands and a light touch help.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 90 }),
    bakeStep(),
    coolStep({ baseMinutes: 150 }),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 220, lidMin: 0, openMin: 40, coreTemp: [96, 99], vessel: ['tin'] },
  authorContext: {
    roleFlours: { white: 'us-bread-flour', wholegrain: 'uk-malthouse' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour met Britse moutmelange. De mout brengt enzymen mee — de motor waarschuwt eerder voor overfermentatie bij dit meel.',
      en: 'Written for American bread flour with a British malthouse blend. The malt brings enzymes — the engine warns sooner for over-fermentation on this flour.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['malt', 'tin', 'british', 'wholegrain'],
};

export const durumLoaf: Recipe = {
  slug: 'durum-semola',
  title: { nl: 'Durumbrood (pane di semola)', en: 'Durum semolina loaf' },
  summary: {
    nl: 'Een Zuid-Italiaans brood van fijngemalen durum: botergele kruim, sesambestrooide korst en een dichte, taaie textuur die dagen goed blijft. Het brood van Altamura.',
    en: 'A southern Italian loaf of finely milled durum: butter-yellow crumb, sesame-strewn crust and a dense, chewy texture that keeps for days. The bread of Altamura.',
  },
  difficulty: 3,
  format: 'boule',
  totalHours: 22,
  activeMinutes: 45,
  flourBlend: [{ role: 'durum', pct: 100 }],
  hydration: 70,
  salt: 2.0,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  steps: [
    levainStep(),
    autolyseStep({ baseMinutes: 45, body: {
      default: {
        nl: 'Meng de fijngemalen durum met het water en laat drie kwartier staan. Durum voelt korrelig en neemt langzamer water op dan gewone tarwe — de autolyse hydrateert de griesmeeldeeltjes en maakt het deeg soepel genoeg om te vormen.',
        en: 'Mix the finely milled durum with the water and rest three quarters of an hour. Durum feels gritty and takes up water more slowly than ordinary wheat — the autolyse hydrates the semolina particles and makes the dough supple enough to shape.',
      },
    } }),
    mixStep(),
    foldStep(),
    bulkStep(),
    preshapeStep(),
    benchStep(),
    shapeStep({ body: {
      nl: 'Vorm een strakke boule of de traditionele hoge vorm en rol de bevochtigde bovenkant door sesamzaad. Durumdeeg is minder elastisch dan tarwe maar houdt zijn vorm goed — bouw de spanning rustig op.',
      en: 'Shape a tight boule or the traditional high folded form and roll the dampened top through sesame seed. Durum dough is less elastic than wheat but holds its shape well — build the tension calmly.',
    } }),
    coldProofStep(),
    scoreStep(),
    bakeStep(),
    coolStep(),
  ],
  yield: { pieces: 1, gramsEach: 950 },
  bake: { temp: 240, lidMin: 22, openMin: 25, coreTemp: [96, 99], vessel: ['dutch-oven', 'stone-steam'], openTemp: 220 },
  authorContext: {
    roleFlours: { durum: 'it-semola-rimacinata' },
    note: {
      nl: 'Geschreven voor Italiaanse semola rimacinata (dubbelgemalen durum). Durum vormt een sterk maar minder elastisch gluten — de motor rekent daar de vorm en het water op af.',
      en: 'Written for Italian semola rimacinata (twice-milled durum). Durum forms a strong but less elastic gluten — the engine adjusts the shape and the water for it.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['durum', 'semolina', 'boule', 'italian'],
};

export const potatoBread: Recipe = {
  slug: 'aardappelbrood',
  title: { nl: 'Aardappelbrood', en: 'Potato bread' },
  summary: {
    nl: 'Gekookte aardappel in het deeg maakt de kruim ongelooflijk zacht en houdbaar. Een busbrood dat dagen vers blijft, met een dunne, goudbruine korst.',
    en: 'Cooked potato in the dough makes the crumb incredibly soft and long-keeping. A tin loaf that stays fresh for days, with a thin, gold-brown crust.',
  },
  difficulty: 2,
  format: 'tin',
  totalHours: 18,
  activeMinutes: 35,
  flourBlend: [{ role: 'white', pct: 100 }],
  hydration: 62,
  salt: 1.9,
  prefermentedFlour: 15,
  levain: { hydration: 100, ratio: '1:5:5', hours: 8, temp: 24 },
  bassinage: 0,
  addIns: [
    { key: 'potato', name: { nl: 'Gekookte, gepureerde aardappel', en: 'Cooked, mashed potato' }, pct: 25, type: 'soaker', absorbsWater: 0.2 },
    { key: 'butter', name: { nl: 'Zachte boter', en: 'Soft butter' }, pct: 5, type: 'fat' },
  ],
  steps: [
    levainStep(),
    mixStep({ body: {
      default: {
        nl: 'Meng bloem, water, desem en de koude aardappelpuree tot een zacht deeg, voeg dan het zout en de boter toe. De aardappel maakt het deeg zijdezacht en een tikje plakkerig — voeg geen extra bloem toe om dat te corrigeren, want juist dat maakt de kruim zo zacht.',
        en: 'Mix flour, water, levain and the cold mashed potato into a soft dough, then add the salt and butter. The potato makes the dough silky and a touch tacky — do not add extra flour to correct it, because that very softness is what makes the crumb.',
      },
      'stand-mixer': {
        nl: 'Alles behalve de boter op stand 2 tot het samenkomt, dan de boter erbij op stand 1. De aardappel maakt een zacht deeg dat aan de kom blijft plakken — dat hoort zo, forceer het niet met meer bloem.',
        en: 'Everything except the butter on speed 2 until it comes together, then the butter on speed 1. The potato makes a soft dough that clings to the bowl — that is right, do not force it with more flour.',
      },
    } }),
    foldStep(),
    bulkStep(),
    shapeStep({
      title: { nl: 'In de bus vormen', en: 'Shape into the tin' },
      body: {
        nl: 'Vorm met natte handen een gladde rol en leg hem met de naad onder in de ingevette busvorm. Het zachte aardappeldeeg laat zich makkelijk vormen maar houdt weinig spanning — de bus vangt dat op.',
        en: 'With wet hands shape a smooth roll and set it seam down in the greased tin. The soft potato dough shapes easily but holds little tension — the tin catches that.',
      },
    }),
    coldProofStep(),
    proofStep({ baseMinutes: 105 }),
    bakeStep({ body: {
      nl: 'Bestrijk met melk of ei en bak zacht tot goudbruin. Aardappelbrood wil geen dikke, harde korst — de zachtheid van de kruim is het hele punt. Uit de bus halen zodra het uit de oven komt.',
      en: 'Brush with milk or egg and bake gentle to gold-brown. Potato bread wants no thick, hard crust — the softness of the crumb is the whole point. Turn it out of the tin the moment it leaves the oven.',
    } }),
    coolStep({ baseMinutes: 60 }),
  ],
  yield: { pieces: 1, gramsEach: 900 },
  bake: { temp: 200, lidMin: 0, openMin: 38, coreTemp: [94, 97], vessel: ['tin'] },
  authorContext: {
    roleFlours: { white: 'us-bread-flour' },
    note: {
      nl: 'Geschreven voor Amerikaanse bread flour. De aardappel brengt eigen vocht en zetmeel mee — de 62% is alleen het toegevoegde water, het deeg zit effectief zachter.',
      en: 'Written for American bread flour. The potato brings its own moisture and starch — the 62% is the added water alone, the dough sits effectively softer.',
    },
    doughTemp: 24,
  },
  attribution: {},
  tags: ['potato', 'tin', 'soft', 'long-keeping'],
};
