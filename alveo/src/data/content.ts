/**
 * Editorial datasets behind the programmatic page families.
 *
 * Every entry here has to carry something a template cannot generate. The
 * thin-content guard in `scripts/check-thin-content.ts` enforces that: a
 * generated page ships only if it has at least two data points no sibling page
 * has, at least one computed insight from the engine, and 250 words of
 * non-templated prose. Google is right to punish programmatic sameness, and
 * this rule is what keeps the long tail alive.
 */

import type { FlourSystem } from '@/engine/types';

export type Prose = { nl: string; en: string };

/* ------------------------------------------------------------------ */
/* Flour system equivalence — the link magnet                          */
/* ------------------------------------------------------------------ */

export interface EquivalenceRow {
  /** What this grade actually is, in kernel terms. */
  key: string;
  label: Prose;
  ashBand: [number, number];
  typicalExtraction: number;
  us: string;
  fr: string;
  de: string;
  it: string;
  uk: string;
  nl: string;
  pl: string;
  nordic: string;
}

export const EQUIVALENCE: EquivalenceRow[] = [
  {
    key: 'pastry',
    label: { nl: 'Patisserie / zacht', en: 'Pastry / soft' },
    ashBand: [0.35, 0.5],
    typicalExtraction: 65,
    us: 'Pastry Flour', fr: 'T45', de: '405', it: '00 (debole)',
    uk: 'Plain flour', nl: 'Patentbloem', pl: 'typ 450', nordic: 'Vetemjöl / hvedemel',
  },
  {
    key: 'white-bread',
    label: { nl: 'Wit broodmeel', en: 'White bread flour' },
    ashBand: [0.5, 0.63],
    typicalExtraction: 72,
    us: 'All-Purpose / Bread Flour', fr: 'T55', de: '550', it: '0',
    uk: 'Strong white', nl: 'Tarwebloem', pl: 'typ 550', nordic: 'Vetemjöl special',
  },
  {
    key: 'light-extraction',
    label: { nl: 'Licht uitgemalen', en: 'Lightly extracted' },
    ashBand: [0.62, 0.75],
    typicalExtraction: 78,
    us: '(no equivalent)', fr: 'T65', de: '650–812', it: '0–1',
    uk: '(no equivalent)', nl: '(geen equivalent)', pl: 'typ 650', nordic: '—',
  },
  {
    key: 'half-wholemeal',
    label: { nl: 'Halfvolkoren', en: 'Half-wholemeal' },
    ashBand: [0.75, 1.0],
    typicalExtraction: 85,
    us: 'Type 85 / high-extraction', fr: 'T80', de: '812–1050', it: '1',
    uk: '85% extraction / light brown', nl: 'Tarwemeel', pl: 'typ 750', nordic: '—',
  },
  {
    key: 'dark',
    label: { nl: 'Donker', en: 'Dark' },
    ashBand: [1.0, 1.4],
    typicalExtraction: 90,
    us: '(rare)', fr: 'T110', de: '1050–1600', it: '2',
    uk: '(rare)', nl: '(zeldzaam)', pl: 'typ 1400', nordic: '—',
  },
  {
    key: 'wholemeal',
    label: { nl: 'Volkoren', en: 'Wholemeal' },
    ashBand: [1.4, 2.0],
    typicalExtraction: 100,
    us: 'Whole Wheat', fr: 'T150', de: 'Vollkorn', it: 'Integrale',
    uk: 'Wholemeal', nl: 'Volkorenmeel', pl: 'typ 1850–2000', nordic: 'Grahamsmjöl',
  },
];

export const EQUIVALENCE_CAVEAT: Prose = {
  nl: 'Franse, Duitse, Italiaanse en Poolse getallen meten as: hoeveel van de buitenkant van de korrel er in de zak zit. Ze zeggen niets over eiwit en niets over kracht. Britse en Spaanse etiketten meten juist kracht en zeggen niets over uitmaling. Amerikaanse namen meten geen van beide, maar beschrijven een gebruiksdoel. Deze tabel legt de drie assen naast elkaar; hij zet ze niet gelijk. Een T65 en een strong white staan hier in dezelfde rij en gedragen zich in de kom volstrekt verschillend.',
  en: 'French, German, Italian and Polish numbers measure ash: how much of the outside of the kernel is in the bag. They say nothing about protein and nothing about strength. British and Spanish labels measure strength instead, and say nothing about extraction. American names measure neither and describe a use. This table lays the three axes side by side; it does not equate them. A T65 and a strong white sit in the same row here and behave completely differently in the bowl.',
};

export const SYSTEM_EXPLAINERS: Record<FlourSystem, Prose> = {
  'french-T': {
    nl: 'Het T-getal is milligram as per 100 g droge stof. T65 betekent 0,62–0,75% as. Het beschrijft hoeveel van de korrel er in de zak zit, en dus hoeveel zemelen, mineralen en enzymen. Het zegt niets over het eiwitgehalte en helemaal niets over hoeveel deeg die bloem kan dragen.',
    en: 'The T number is milligrams of ash per 100 g of dry matter. T65 means 0.62–0.75% ash. It describes how much of the kernel is in the bag, and therefore how much bran, mineral and enzyme. It says nothing about protein and nothing whatsoever about how much dough the flour can carry.',
  },
  'german-Type': {
    nl: 'Het Duitse Type-getal gebruikt dezelfde asdefinitie als het Franse T-getal — Type 550 en T55 meten hetzelfde. In de praktijk wordt Duitse 550 uit sterkere tarwe gemalen dan Franse T55 en gedraagt hij zich dichter bij een T65. Dezelfde meting, ander graan.',
    en: 'The German Type number uses the same ash definition as the French T number — Type 550 and T55 measure the same thing. In practice German 550 is milled from stronger wheat than French T55 and behaves closer to a T65. Same measurement, different grain.',
  },
  'italian-tipo': {
    nl: 'Het Italiaanse tipo-getal loopt andersom: 00 is het meest geraffineerd, integrale het minst. Italië is ook het enige land waar de W-waarde routinematig op de zak staat, en dat maakt Italiaanse bloem de makkelijkste van Europa om nauwkeurig te modelleren.',
    en: 'The Italian tipo number runs the other way: 00 is the most refined, integrale the least. Italy is also the only country where the alveograph W value is routinely printed on the bag, which makes Italian flour the easiest in Europe to model accurately.',
  },
  'uk-strength': {
    nl: 'De Britse indeling noemt kracht: plain, strong, very strong. Dat is de enige Europese indeling die de eigenschap benoemt waar een bakker daadwerkelijk om geeft — en tegelijk de enige die niets zegt over uitmaling.',
    en: 'The British system names strength: plain, strong, very strong. It is the only European system that names the property a baker actually cares about — and simultaneously the only one that says nothing about extraction.',
  },
  'us-type': {
    nl: 'Amerikaanse namen beschrijven een gebruiksdoel, geen meting. "Bread flour" is een belofte, geen specificatie. Wat de Amerikaanse bloem echt onderscheidt is het graan: harder, dus meer beschadigd zetmeel bij het walsen, dus meer wateropname.',
    en: 'American names describe a use, not a measurement. "Bread flour" is a promise, not a specification. What really distinguishes American flour is the grain: harder, so more damaged starch on the roller mill, so more water uptake.',
  },
  dutch: {
    nl: 'Nederland deelt in op uitmaling in gewone taal: bloem is wit, meel bevat de zemelen. Er is geen getal, dus geen manier om twee zakken te vergelijken zonder ze te bakken — een van de redenen dat deze site in het Nederlands begint.',
    en: 'The Netherlands classifies by extraction in plain language: bloem is white, meel contains the bran. There is no number, so no way to compare two bags without baking them — one of the reasons this site starts in Dutch.',
  },
  nordic: {
    nl: 'De Noordse landen delen in op maalgraad en graansoort, met het fijnmazigste roggevocabulaire buiten Duitsland. Dat is geen toeval: Noords roggebrood gebruikt veel hogere roggepercentages dan waar dan ook.',
    en: 'The Nordic countries classify by grind and by grain, with the finest-grained rye vocabulary outside Germany. That is no accident: Nordic rye baking uses far higher rye percentages than anywhere else.',
  },
};

/* ------------------------------------------------------------------ */
/* Hydration bands                                                     */
/* ------------------------------------------------------------------ */

export interface HydrationBand {
  from: number;
  to: number;
  label: Prose;
  feel: Prose;
  handling: Prose;
  suits: Prose;
}

export const HYDRATION_BANDS: HydrationBand[] = [
  {
    from: 50, to: 60,
    label: { nl: 'Stevig', en: 'Stiff' },
    feel: {
      nl: 'Het deeg voelt als klei en plakt nauwelijks. Je kunt het op een onbebloemd werkblad kneden zonder dat er iets aan je handen blijft.',
      en: 'The dough feels like clay and barely sticks. You can knead it on an unfloured bench with nothing clinging to your hands.',
    },
    handling: {
      nl: 'Kneden werkt beter dan vouwen: er is te weinig water voor het gluten om zichzelf te ordenen tijdens rust.',
      en: 'Kneading beats folding: there is too little water for the gluten to organise itself during rest.',
    },
    suits: {
      nl: 'Bagels, pretzels, stijve desems en pastadeeg.',
      en: 'Bagels, pretzels, stiff levains and pasta dough.',
    },
  },
  {
    from: 60, to: 70,
    label: { nl: 'Beheerst', en: 'Controlled' },
    feel: {
      nl: 'Samenhangend en licht plakkerig. Het houdt zijn vorm op het werkblad en veert terug als je erin drukt.',
      en: 'Coherent and slightly tacky. It holds its shape on the bench and springs back when you press it.',
    },
    handling: {
      nl: 'Het makkelijkste bereik om in te leren vormen. Alles wat je fout doet is zichtbaar én herstelbaar.',
      en: 'The easiest range in which to learn shaping. Everything you get wrong is both visible and recoverable.',
    },
    suits: {
      nl: 'Pizza, busbrood, stokbrood, en elk eerste desembrood met onbekend meel.',
      en: 'Pizza, tin loaves, baguettes, and any first sourdough with an unfamiliar flour.',
    },
  },
  {
    from: 70, to: 80,
    label: { nl: 'Open', en: 'Open' },
    feel: {
      nl: 'Plakkerig maar werkbaar met natte handen. Het deeg trilt als je de bak beweegt en vloeit langzaam uit als je het loslaat.',
      en: 'Sticky but workable with wet hands. The dough wobbles when you move the tub and slowly flows when you let go.',
    },
    handling: {
      nl: 'Coil folds in plaats van kneden. Vormen vraagt om een gedroogd vel en een snelle, zekere beweging.',
      en: 'Coil folds instead of kneading. Shaping needs a dried skin and one quick, confident movement.',
    },
    suits: {
      nl: 'De meeste landbroden, en het bereik waar de meeste gepubliceerde desemrecepten wonen.',
      en: 'Most country loaves, and the range where most published sourdough recipes live.',
    },
  },
  {
    from: 80, to: 90,
    label: { nl: 'Hoog', en: 'High' },
    feel: {
      nl: 'Het deeg vloeit. Het houdt geen vorm zonder mandje en het plakt aan alles wat niet nat is.',
      en: 'The dough flows. It holds no shape without a basket and sticks to anything that is not wet.',
    },
    handling: {
      nl: 'Alleen haalbaar met sterk meel, bassinage en tijdige koeling. Bij zwak meel is dit geen ambitieus doel maar een garantie op een platte kruim.',
      en: 'Only reachable with strong flour, bassinage and timely chilling. On weak flour this is not an ambitious target but a guarantee of a flat crumb.',
    },
    suits: {
      nl: 'Ciabatta, focaccia, en volkorenbroden waar de zemelen een deel van het water vasthouden.',
      en: 'Ciabatta, focaccia, and wholegrain loaves where the bran holds part of the water.',
    },
  },
  {
    from: 90, to: 100,
    label: { nl: 'Extreem', en: 'Extreme' },
    feel: {
      nl: 'Meer beslag dan deeg. Zonder vorm of pan gaat dit niet.',
      en: 'More batter than dough. Without a tin or a pan this does not work.',
    },
    handling: {
      nl: 'Bijna uitsluitend zinvol bij rogge, waar de structuur toch niet uit gluten komt maar uit de zetmeelgel.',
      en: 'Almost only meaningful with rye, where the structure comes from the starch gel rather than gluten anyway.',
    },
    suits: {
      nl: 'Rugbrød, volkoren roggebrood, en niets met een vrijstaande vorm.',
      en: 'Rugbrød, whole rye loaves, and nothing free-standing.',
    },
  },
];

export function bandFor(pct: number): HydrationBand {
  return HYDRATION_BANDS.find((b) => pct >= b.from && pct < b.to) ?? HYDRATION_BANDS[2]!;
}

/* ------------------------------------------------------------------ */
/* Problems                                                            */
/* ------------------------------------------------------------------ */

export interface Cause {
  cause: Prose;
  /** Rough share of cases, so the list is ranked rather than exhaustive. */
  likelihood: 'most-common' | 'common' | 'occasional' | 'rare';
  fix: Prose;
}

export interface Problem {
  slug: string;
  title: Prose;
  symptom: Prose;
  causes: Cause[];
  /** The one thing to change next time, if you only change one. */
  primaryFix: Prose;
  related?: string[];
}

export const PROBLEMS: Problem[] = [
  {
    slug: 'plat-brood',
    title: { nl: 'Mijn brood is plat uitgelopen', en: 'My loaf spread out flat' },
    symptom: {
      nl: 'Het brood komt uit de oven als een schijf in plaats van een bol. De kruim is er wel, maar het geheel is twee tot drie centimeter hoog.',
      en: 'The loaf comes out as a disc rather than a dome. There is a crumb, but the whole thing is two or three centimetres tall.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: {
          nl: 'Te ver doorgerezen tijdens de bulk. Het glutennetwerk is door de zuurgraad en de tijd afgebroken en kan het gas niet meer vasthouden.',
          en: 'Over-fermented during bulk. Acid and time have degraded the gluten network past the point where it can hold gas.',
        },
        fix: {
          nl: 'Stop de bulk eerder. Beoordeel op volume — ongeveer 50–75% toename bij tarwe — en niet op de klok, en meet de deegtemperatuur.',
          en: 'End the bulk sooner. Judge by volume — roughly a 50–75% increase for wheat — rather than the clock, and take the dough temperature.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'De hydratatie ligt boven wat dit meel kan dragen. Dat is geen fout in het recept maar een verschil tussen jouw meel en dat van de auteur.',
          en: 'The hydration is above what this flour can carry. That is not a fault in the recipe but a difference between your flour and the author\'s.',
        },
        fix: {
          nl: 'Voer je meel in bij het recept en gebruik het berekende getal, of zet de veiligheidsmarge op "veilig".',
          en: 'Enter your flour on the recipe and use the computed number, or set the safety margin to "safe".',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Te weinig spanning bij het vormen. Het vel is niet strak genoeg om de vorm vast te houden tijdens de laatste rijs.',
          en: 'Not enough tension at shaping. The skin is not tight enough to hold the shape through the final proof.',
        },
        fix: {
          nl: 'Voorvormen, tien minuten laten rusten, en dan pas echt vormen. Trek het deeg over het werkblad tot je weerstand voelt.',
          en: 'Preshape, rest ten minutes, then shape properly. Drag the dough across the bench until you feel resistance.',
        },
      },
      {
        likelihood: 'occasional',
        cause: {
          nl: 'Het meel is te zwak voor een vrijstaand brood — spelt, eenkoorn of een groot aandeel rogge.',
          en: 'The flour is too weak for a free-standing loaf — spelt, einkorn, or a large rye fraction.',
        },
        fix: {
          nl: 'Bak in een busvorm. Dat is geen compromis maar het juiste gereedschap voor dit meel.',
          en: 'Bake it in a tin. That is not a compromise but the right tool for this flour.',
        },
      },
    ],
    primaryFix: {
      nl: 'Kort de bulk met een uur in en meet de deegtemperatuur. Negen van de tien platte broden zijn overgerezen, niet ondergekneed.',
      en: 'Cut an hour off the bulk and take the dough temperature. Nine flat loaves out of ten are over-proofed, not under-kneaded.',
    },
    related: ['dichte-kruim', 'plakkerig-deeg'],
  },
  {
    slug: 'dichte-kruim',
    title: { nl: 'De kruim is dicht en zwaar', en: 'The crumb is dense and heavy' },
    symptom: {
      nl: 'Kleine, gelijkmatige gaatjes of helemaal geen gaten, een zware plak, en het brood is nauwelijks gerezen in de oven.',
      en: 'Small, even holes or none at all, a heavy slice, and almost no rise in the oven.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: {
          nl: 'Niet lang genoeg gerezen. De desem was niet rijp genoeg, of het was simpelweg te koud in de keuken.',
          en: 'Under-fermented. The levain was not ripe, or the kitchen was simply too cold.',
        },
        fix: {
          nl: 'Gebruik de desem op zijn hoogtepunt en verleng de bulk bij lage keukentemperatuur — bij 19 °C duurt hij ruim anderhalf keer zo lang als bij 24 °C.',
          en: 'Use the levain at its peak, and extend the bulk in a cold kitchen — at 19 °C it takes well over half as long again as at 24 °C.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Te weinig water voor dit meel. Volkoren en rogge nemen fors meer op dan witte bloem, en een recept dat voor wit is geschreven is dan te droog.',
          en: 'Too little water for this flour. Wholegrain and rye take up far more than white, so a recipe written for white runs dry.',
        },
        fix: {
          nl: 'Laat de motor de hydratatie omrekenen naar jouw meel in plaats van het recept letterlijk te volgen.',
          en: 'Let the engine convert the hydration for your flour rather than following the recipe literally.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Het deeg is ontgast tijdens het vormen. Alle lucht die je eruit drukt komt er niet vanzelf weer in.',
          en: 'The dough was degassed during shaping. Any air you press out does not come back on its own.',
        },
        fix: {
          nl: 'Vorm met minder druk en meer beweging. Spanning bouw je op aan het oppervlak, niet door de kern plat te duwen.',
          en: 'Shape with less pressure and more movement. Tension is built at the surface, not by flattening the core.',
        },
      },
    ],
    primaryFix: {
      nl: 'Meet de deegtemperatuur. Een keuken van 19 °C in plaats van 24 °C verandert de benodigde bulktijd met meer dan de helft, en dat is de meest onderschatte oorzaak van een dichte kruim.',
      en: 'Take the dough temperature. A 19 °C kitchen instead of a 24 °C one changes the bulk time needed by more than half, and it is the most underestimated cause of a dense crumb.',
    },
    related: ['plat-brood', 'starter-rijst-niet'],
  },
  {
    slug: 'plakkerig-deeg',
    title: { nl: 'Het deeg blijft plakken en is onwerkbaar', en: 'The dough stays sticky and unworkable' },
    symptom: {
      nl: 'Het deeg plakt aan je handen, aan het werkblad en aan de deegsteker, en komt nooit samen tot een gladde bal.',
      en: 'The dough sticks to your hands, the bench and the scraper, and never comes together into a smooth ball.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: {
          nl: 'De hydratatie ligt boven het draagvermogen van dit meel — meestal omdat het recept voor Amerikaanse bloem is geschreven en jij Europese bloem gebruikt.',
          en: 'Hydration above this flour\'s carrying capacity — usually because the recipe was written for American flour and you are using European.',
        },
        fix: {
          nl: 'Reken het om. Amerikaanse broodbloem draagt zeven tot tien punten meer water dan Franse T65 bij hetzelfde eiwitgehalte.',
          en: 'Convert it. American bread flour carries seven to ten points more water than French T65 at the same protein content.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Overgerezen. Een deeg dat te ver is, wordt plakkerig en scheurt in plaats van te rekken — dat voelt als te veel water maar is te veel tijd.',
          en: 'Over-fermented. A dough taken too far turns sticky and tears rather than stretching — it feels like too much water but it is too much time.',
        },
        fix: {
          nl: 'Kort de bulk in en koel het deeg een half uur voordat je gaat vormen.',
          en: 'Shorten the bulk and chill the dough for half an hour before shaping.',
        },
      },
      {
        likelihood: 'occasional',
        cause: {
          nl: 'Droge handen. Nat deeg plakt aan droge dingen en niet aan natte.',
          en: 'Dry hands. Wet dough sticks to dry things and not to wet ones.',
        },
        fix: {
          nl: 'Maak je handen en je deegsteker nat in plaats van ze te bebloemen. Bloem verandert de formule; water niet.',
          en: 'Wet your hands and your scraper rather than flouring them. Flour changes the formula; water does not.',
        },
      },
    ],
    primaryFix: {
      nl: 'Voer je eigen meel in en gebruik het berekende getal. Als je meel zeven punten minder water draagt dan dat van de auteur, bak je met de gepubliceerde hydratatie effectief boven het plafond van je mix.',
      en: 'Enter your own flour and use the computed number. If your flour carries seven points less water than the author\'s, baking at the published hydration puts you above your blend\'s ceiling.',
    },
    related: ['plat-brood'],
  },
  {
    slug: 'starter-rijst-niet',
    title: { nl: 'Mijn starter rijst niet meer', en: 'My starter has stopped rising' },
    symptom: {
      nl: 'Belletjes maar geen volume, of helemaal niets. De starter ruikt scherp, naar aceton, of naar niets.',
      en: 'Bubbles but no volume, or nothing at all. The starter smells sharp, of acetone, or of nothing.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: {
          nl: 'Te koud. Onder de 20 °C werkt een starter zo traag dat hij lijkt te zijn gestopt.',
          en: 'Too cold. Below 20 °C a starter works so slowly it looks like it has stopped.',
        },
        fix: {
          nl: 'Zet hem warmer — 24 tot 26 °C — en voer twee dagen twee keer per dag voordat je conclusies trekt.',
          en: 'Keep it warmer — 24 to 26 °C — and feed twice a day for two days before drawing conclusions.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Te weinig gevoerd. Een verhouding van 1:1:1 raakt binnen enkele uren uitgeput en zakt daarna weer in voordat je het ziet.',
          en: 'Underfed. A 1:1:1 ratio exhausts itself within hours and collapses again before you notice.',
        },
        fix: {
          nl: 'Ga naar 1:5:5 of 1:10:10. Meer voedsel betekent een langere, zichtbaardere piek.',
          en: 'Move to 1:5:5 or 1:10:10. More food means a longer, more visible peak.',
        },
      },
      {
        likelihood: 'occasional',
        cause: {
          nl: 'Chloor of chlooramine in het leidingwater. Chloor verdampt als je het water laat staan; chlooramine niet.',
          en: 'Chlorine or chloramine in the tap water. Chlorine off-gasses if you let the water stand; chloramine does not.',
        },
        fix: {
          nl: 'Probeer twee weken flessenwater of gefilterd water. Werkt dat wel, dan weet je het.',
          en: 'Try bottled or filtered water for two weeks. If that works, you have your answer.',
        },
      },
      {
        likelihood: 'rare',
        cause: {
          nl: 'Schimmel: donzige plekken in roze, oranje of zwart, en niet alleen verkleuring aan de rand.',
          en: 'Mould: fuzzy patches in pink, orange or black, not merely discolouration at the edge.',
        },
        fix: {
          nl: 'Weggooien en opnieuw beginnen. Er is geen veilige manier om schimmel uit een starter te redden, en de moeite is een week.',
          en: 'Throw it away and start again. There is no safe way to rescue mould from a starter, and starting over costs a week.',
        },
      },
    ],
    primaryFix: {
      nl: 'Zet hem warmer en voer hem meer. Negen van de tien "dode" starters zijn koude, ondervoede starters.',
      en: 'Keep it warmer and feed it more. Nine "dead" starters out of ten are cold, underfed starters.',
    },
  },
  {
    slug: 'gommige-kruim',
    title: { nl: 'De kruim is gommig en plakt aan het mes', en: 'The crumb is gummy and sticks to the knife' },
    symptom: {
      nl: 'Het brood ziet er goed uit maar de kruim voelt nat en plakkerig aan, en verdicht zich onder het mes.',
      en: 'The loaf looks right but the crumb feels wet and tacky, and compresses under the knife.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: {
          nl: 'Te vroeg aangesneden. De kruim is pas af als hij volledig is afgekoeld en het zetmeel zich heeft gezet.',
          en: 'Cut too early. The crumb is not finished until it has cooled completely and the starch has set.',
        },
        fix: {
          nl: 'Twee uur wachten bij een gewoon brood, een etmaal bij volkoren rogge. Dit is de goedkoopste verbetering op de hele site.',
          en: 'Two hours for an ordinary loaf, a full day for whole rye. This is the cheapest improvement on the entire site.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Te kort gebakken. Een kerntemperatuur onder 96 °C laat het midden nat.',
          en: 'Underbaked. A core below 96 °C leaves the middle wet.',
        },
        fix: {
          nl: 'Meet de kerntemperatuur. Bij dichte of roggerijke broden mag hij tegen de 98 °C aan zitten.',
          en: 'Measure the core. On dense or rye-heavy loaves it can go towards 98 °C.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Hoge enzymactiviteit: veel rogge, gemout meel of een laag valgetal. Het amylase breekt het zetmeel af voordat het brood zet.',
          en: 'High enzyme activity: a lot of rye, malted flour, or a low falling number. The amylase breaks the starch down before the loaf sets.',
        },
        fix: {
          nl: 'Verzuur meer en bak langer en donkerder. Bij rogge is een zure desem geen smaakkeuze maar precies hiervoor bedoeld.',
          en: 'Acidify more and bake longer and darker. With rye a sour levain is not a flavour choice but exactly the remedy for this.',
        },
      },
    ],
    primaryFix: {
      nl: 'Laat het afkoelen. Volledig. Als dat niet helpt, meet dan de kerntemperatuur voordat je aan je fermentatie gaat sleutelen.',
      en: 'Let it cool. Completely. If that does not fix it, measure the core temperature before you go rearranging your fermentation.',
    },
    related: ['dichte-kruim'],
  },
  {
    slug: 'geen-oven-spring',
    title: { nl: 'Geen oven spring, de snede blijft dicht', en: 'No oven spring, the score stays shut' },
    symptom: {
      nl: 'Het brood komt er ongeveer even groot uit als het erin ging, en de insnijding is niet opengegaan.',
      en: 'The loaf comes out about the size it went in, and the score has not opened.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: {
          nl: 'Te ver gerezen voordat het de oven in ging. Er zat geen gasreserve meer in om uit te zetten.',
          en: 'Over-proofed before it went in. There was no gas reserve left to expand.',
        },
        fix: {
          nl: 'Bak eerder. Bij twijfel: de vingertest — een kuiltje dat langzaam half terugkomt is precies goed.',
          en: 'Bake sooner. When in doubt: the poke test — a dimple that comes back slowly and halfway is exactly right.',
        },
      },
      {
        likelihood: 'common',
        cause: {
          nl: 'Te weinig stoom of een niet-voorverwarmde pan. Zonder vocht zet de korst binnen twee minuten en dan is uitzetten voorbij.',
          en: 'Too little steam or an unheated pot. Without moisture the crust sets within two minutes and expansion is over.',
        },
        fix: {
          nl: 'Verwarm de pan minstens 45 minuten mee en bak de eerste 20 minuten met deksel.',
          en: 'Preheat the pot for at least 45 minutes and bake the first 20 minutes lidded.',
        },
      },
      {
        likelihood: 'occasional',
        cause: {
          nl: 'Te ondiep of te aarzelend ingesneden. Een ondiepe snede scheurt elders open, meestal aan de zijkant.',
          en: 'Scored too shallow or too hesitantly. A shallow cut tears open somewhere else, usually at the side.',
        },
        fix: {
          nl: 'Een halve centimeter diep, in één beweging, met het mes onder een hoek van dertig graden.',
          en: 'Half a centimetre deep, in one movement, with the blade at thirty degrees.',
        },
      },
    ],
    primaryFix: {
      nl: 'Bak een uur eerder dan je van plan was. Overrijzen kost oven spring als eerste, ruim voordat het de smaak raakt.',
      en: 'Bake an hour earlier than you planned. Over-proofing costs oven spring first, well before it touches flavour.',
    },
    related: ['plat-brood'],
  },
  {
    slug: 'te-zuur',
    title: { nl: 'Mijn brood is te zuur', en: 'My bread is too sour' },
    symptom: {
      nl: 'Een scherpe, bijna azijnachtige smaak die de rest van het brood overheerst.',
      en: 'A sharp, almost vinegary taste that overwhelms the rest of the loaf.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: { nl: 'Te lange koude rijs. De bacteriën werken door in de koelkast en bouwen zuur op terwijl de gist stilligt.', en: 'Too long a cold proof. The bacteria keep working in the fridge, building acid while the yeast sits still.' },
        fix: { nl: 'Kort de koelkastrijs in naar 8–12 uur, of bak op dezelfde dag zonder retard.', en: 'Shorten the fridge proof to 8–12 hours, or bake same-day with no retard.' },
      },
      {
        likelihood: 'common',
        cause: { nl: 'Een stijve of oude desem, of een desem die ver over de piek is gebruikt.', en: 'A stiff or old levain, or one used well past its peak.' },
        fix: { nl: 'Gebruik een desem op 100% hydratatie, strak op de piek. Nat en jong stuurt richting het zachtere melkzuur.', en: 'Use a 100%-hydration levain right at peak. Wet and young steers towards the softer lactic acid.' },
      },
      {
        likelihood: 'common',
        cause: { nl: 'Te veel desem. Een hoge inoculatie geeft veel zuur bij de start.', en: 'Too much levain. A high inoculation gives a lot of acid at the outset.' },
        fix: { nl: 'Verlaag de voorgefermenteerde bloem met een derde en verleng de bulk.', en: 'Cut the prefermented flour by a third and lengthen the bulk.' },
      },
      {
        likelihood: 'occasional',
        cause: { nl: 'Een koude, trage fermentatie in een koele keuken. Koud bevoordeelt de azijnzuurbacteriën boven de gist, wat de scherpe kant van zuur oplevert.', en: 'A cold, slow ferment in a cool kitchen. Cold favours the acetic bacteria over the yeast, which gives the sharp side of sour.' },
        fix: { nl: 'Laat de bulk warmer verlopen, rond 25 °C, zodat de gist het wint van de azijnzuurbacteriën.', en: 'Run the bulk warmer, around 25 °C, so the yeast wins out over the acetic bacteria.' },
      },
    ],
    primaryFix: { nl: 'Kort de koude rijs in en bak warmer. Gebruik de zuurgraad-schuif op elk recept om precies te zien welke knop welk effect heeft, en welke kant van zuur je krijgt.', en: 'Shorten the cold proof and bake warmer. Use the sourness dial on any recipe to see exactly which lever does what, and which side of sour you get.' },
    related: ['gommige-kruim'],
  },
  {
    slug: 'te-flauw',
    title: { nl: 'Mijn brood smaakt flauw', en: 'My bread tastes bland' },
    symptom: {
      nl: 'Het brood is goed gerezen en luchtig, maar mist smaak — het smaakt naar niet veel.',
      en: 'The loaf has risen well and is airy, but lacks flavour — it tastes of not much.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: { nl: 'Te snel gefermenteerd. Warm en snel geeft lift maar weinig tijd voor smaakontwikkeling.', en: 'Fermented too fast. Warm and quick gives lift but little time for flavour to develop.' },
        fix: { nl: 'Voeg een koude rijs van een nacht toe. De trage fermentatie is waar bijna alle smaak vandaan komt.', en: 'Add an overnight cold proof. The slow fermentation is where nearly all the flavour comes from.' },
      },
      {
        likelihood: 'common',
        cause: { nl: 'Alleen witte bloem. Zonder zemelen mist het brood de aardse diepte die volkoren en rogge geven.', en: 'White flour only. Without bran the loaf misses the earthy depth wholegrain and rye bring.' },
        fix: { nl: 'Vervang 10–20% door volkoren of een snufje rogge. Dat verandert de smaak volledig.', en: 'Swap 10–20% for wholemeal or a touch of rye. It changes the flavour completely.' },
      },
      {
        likelihood: 'occasional',
        cause: { nl: 'Te weinig zout. Zout maakt geen smaak maar tilt alle andere smaken op.', en: 'Too little salt. Salt makes no flavour but lifts all the others.' },
        fix: { nl: 'Ga naar 2,0–2,2% zout op het bloemgewicht en proef het verschil.', en: 'Go to 2.0–2.2% salt on the flour weight and taste the difference.' },
      },
      {
        likelihood: 'occasional',
        cause: { nl: 'Te bleek gebakken. De korst is waar de meeste smaak zit; een lichtgebakken brood laat die smaak op tafel liggen.', en: 'Baked too pale. The crust is where most of the flavour lives; a lightly baked loaf leaves that flavour on the table.' },
        fix: { nl: 'Bak donkerder dan je durft — de laatste tien minuten karamelliseren de korst en maken het verschil.', en: 'Bake it darker than you dare — the last ten minutes caramelise the crust and make the difference.' },
      },
    ],
    primaryFix: { nl: 'Geef het een koude rijs van een nacht en bak de korst donkerder. Tijd en kleur zijn samen de goedkoopste smaakmakers die er zijn.', en: 'Give it an overnight cold proof and bake the crust darker. Time and colour together are the cheapest flavourings there are.' },
    related: ['te-zuur'],
  },
  {
    slug: 'grote-gaten',
    title: { nl: 'Eén groot gat onder de korst', en: 'One big hole under the crust' },
    symptom: {
      nl: 'De kruim is redelijk gelijkmatig, maar net onder de bovenkorst zit een grote holte — een tunnel.',
      en: 'The crumb is reasonably even, but just under the top crust sits a large cavity — a tunnel.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: { nl: 'Te los gevormd. Er zat lucht tussen het vel en de kern die tijdens het bakken uitzette.', en: 'Shaped too loosely. Air was trapped between the skin and the core and expanded during baking.' },
        fix: { nl: 'Vorm strakker en ontgas het deeg lichtjes voor het vormen, zodat er geen grote bel achterblijft.', en: 'Shape tighter and degas the dough lightly before shaping, so no large bubble is left behind.' },
      },
      {
        likelihood: 'common',
        cause: { nl: 'Ondergerezen het brood ingegaan. De laatste gasproductie kwam pas in de oven op gang en verzamelde zich onder de zettende korst.', en: 'Went in under-proofed. The last of the gas production only got going in the oven and gathered under the setting crust.' },
        fix: { nl: 'Laat iets langer narijzen tot de vingertest langzaam half terugveert.', en: 'Proof a little longer, until the poke test comes back slowly and halfway.' },
      },
      {
        likelihood: 'occasional',
        cause: { nl: 'Te ondiep ingesneden. De snede stuurt waar het gas ontsnapt; een ondiepe snede laat het zich onder de korst ophopen.', en: 'Scored too shallow. The cut directs where gas escapes; a shallow one lets it pool under the crust.' },
        fix: { nl: 'Snijd een halve centimeter diep in één zekere beweging.', en: 'Cut half a centimetre deep in one confident movement.' },
      },
    ],
    primaryFix: { nl: 'Vorm strakker en ontgas net iets meer. De tunnel zit bijna altijd in het vormen, niet in de fermentatie.', en: 'Shape tighter and degas a touch more. The tunnel is almost always in the shaping, not the fermentation.' },
    related: ['plat-brood'],
  },
  {
    slug: 'bleke-korst',
    title: { nl: 'De korst blijft bleek', en: 'The crust stays pale' },
    symptom: {
      nl: 'Het brood is gaar maar de korst is licht en mat in plaats van diep goudbruin en glanzend.',
      en: 'The loaf is cooked but the crust is light and matte rather than deep gold-brown and glossy.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: { nl: 'Te vroeg uit de oven. De kleur en het grootste deel van de smaak zitten in de laatste vijf tot tien minuten.', en: 'Out of the oven too early. The colour and most of the flavour are in the last five to ten minutes.' },
        fix: { nl: 'Bak donkerder dan je durft. Een bleke korst is de meest voorkomende fout bij thuisbakkers.', en: 'Bake it darker than you dare. A pale crust is the commonest fault in home baking.' },
      },
      {
        likelihood: 'common',
        cause: { nl: 'Te lang met deksel of stoom. Vocht houdt de korst zacht en voorkomt kleuring.', en: 'Lidded or steamed too long. Moisture keeps the crust soft and prevents colouring.' },
        fix: { nl: 'Haal het deksel er eerder af en maak de tweede helft van de bak droog en heet.', en: 'Take the lid off earlier and make the second half of the bake dry and hot.' },
      },
      {
        likelihood: 'occasional',
        cause: { nl: 'Overgerezen deeg. De gist heeft de suikers opgemaakt die anders zouden karamelliseren.', en: 'Over-proofed dough. The yeast has used up the sugars that would otherwise caramelise.' },
        fix: { nl: 'Bak een uur eerder; dan is er nog restsuiker over voor de korstkleur.', en: 'Bake an hour earlier; there is then residual sugar left for crust colour.' },
      },
    ],
    primaryFix: { nl: 'Bak langer en droger. Een fan-oven bakt bovendien heter dan de knop zegt — voer je oventype in bij het recept.', en: 'Bake longer and drier. A fan oven also bakes hotter than the dial says — set your oven type on the recipe.' },
    related: ['geen-oven-spring'],
  },
  {
    slug: 'plakt-aan-rijsmandje',
    title: { nl: 'Het deeg plakt aan het rijsmandje', en: 'The dough sticks to the banneton' },
    symptom: {
      nl: 'Bij het kiepen blijft het deeg hangen, scheurt of vervormt, en de mooie ronde vorm is weg.',
      en: 'When you tip it out the dough clings, tears or deforms, and the clean round shape is gone.',
    },
    causes: [
      {
        likelihood: 'most-common',
        cause: { nl: 'Te weinig bloem in het mandje, of de verkeerde bloem. Rijstebloem plakt veel minder dan tarwebloem.', en: 'Too little flour in the basket, or the wrong flour. Rice flour sticks far less than wheat flour.' },
        fix: { nl: 'Bebloem het mandje royaal met een mengsel van rijstebloem en tarwebloem, vooral in de naden.', en: 'Flour the basket generously with a mix of rice flour and wheat flour, especially into the seams.' },
      },
      {
        likelihood: 'common',
        cause: { nl: 'Een te nat deeg voor de bloemlaag die je gebruikt. Nat deeg trekt de bloem in zich op tijdens de rijs.', en: 'A dough too wet for the flour layer you used. Wet dough draws the flour into itself during the proof.' },
        fix: { nl: 'Verlaag de hydratatie een paar punten, of bebloem zwaarder en gebruik een linnen doek in het mandje.', en: 'Lower the hydration a couple of points, or flour more heavily and line the basket with linen.' },
      },
      {
        likelihood: 'occasional',
        cause: { nl: 'Te lang gerezen. Overgerezen deeg wordt plakkerig en verliest de spanning die het van het mandje losmaakt.', en: 'Proofed too long. Over-proofed dough turns sticky and loses the tension that releases it from the basket.' },
        fix: { nl: 'Bak eerder, en koel het gevormde brood goed door voordat je het kiept.', en: 'Bake earlier, and chill the shaped loaf thoroughly before tipping it out.' },
      },
    ],
    primaryFix: { nl: 'Gebruik rijstebloem in het mandje en kiep het brood koud. Die twee lossen negen van de tien plakproblemen op.', en: 'Use rice flour in the basket and tip the loaf out cold. Those two fix nine sticking problems out of ten.' },
    related: ['plakkerig-deeg'],
  },
];

/* ------------------------------------------------------------------ */
/* Techniques                                                          */
/* ------------------------------------------------------------------ */

export interface Technique {
  slug: string;
  title: Prose;
  summary: Prose;
  /** Ordered, because these genuinely are sequences. */
  steps: Prose[];
  /** What the engine can say about when this technique applies. */
  whenItApplies: Prose;
  mistakes: Prose[];
}

export const TECHNIQUES: Technique[] = [
  {
    slug: 'coil-fold',
    title: { nl: 'Coil fold', en: 'Coil fold' },
    summary: {
      nl: 'De vouw voor deeg dat te slap of te fragiel is om op te tillen en over te slaan. Je tilt in het midden op en laat de zwaartekracht het werk doen.',
      en: 'The fold for dough too slack or too fragile to lift and throw. You lift from the middle and let gravity do the work.',
    },
    steps: [
      { nl: 'Maak beide handen goed nat. Droge handen scheuren het vel.', en: 'Wet both hands thoroughly. Dry hands tear the skin.' },
      { nl: 'Schuif je handen onder het midden van het deeg, aan weerszijden.', en: 'Slide your hands under the middle of the dough, one on each side.' },
      { nl: 'Til recht omhoog tot de uiteinden loskomen van de bak.', en: 'Lift straight up until the ends come away from the tub.' },
      { nl: 'Laat het deeg onder zichzelf doorvouwen en leg het neer.', en: 'Let the dough fold under itself and set it down.' },
      { nl: 'Draai de bak een kwartslag en herhaal, tot vier keer. Dat is één set.', en: 'Turn the tub a quarter and repeat, up to four times. That is one set.' },
    ],
    whenItApplies: {
      nl: 'De motor kiest coil folds bij een mixsterkte tussen ongeveer 30 en 55. Daaronder is zelfs optillen te veel en blijft alleen de bowl fold over; daarboven mag je slap-and-fold gebruiken.',
      en: 'The engine picks coil folds at a blend strength between roughly 30 and 55. Below that even lifting is too much and only the bowl fold remains; above it, slap-and-fold is available.',
    },
    mistakes: [
      { nl: 'Te hoog tillen, waardoor het deeg scheurt onder zijn eigen gewicht.', en: 'Lifting too high, so the dough tears under its own weight.' },
      { nl: 'Met droge handen werken en het vel kapottrekken.', en: 'Working with dry hands and tearing the skin.' },
      { nl: 'Doorgaan als het deeg niet meer wil — vier vouwen is een set, niet een doel.', en: 'Carrying on when the dough resists — four folds is a set, not a target.' },
    ],
  },
  {
    slug: 'slap-and-fold',
    title: { nl: 'Slap-and-fold', en: 'Slap-and-fold' },
    summary: {
      nl: 'De snelste manier om met de hand structuur op te bouwen in een slap maar sterk deeg. Alleen voor deeg dat het aankan.',
      en: 'The fastest way to build structure by hand in a slack but strong dough. Only for dough that can take it.',
    },
    steps: [
      { nl: 'Til het deeg met beide handen aan de zijkanten op, zonder te knijpen.', en: 'Lift the dough by its sides with both hands, without gripping.' },
      { nl: 'Sla de onderkant op het werkblad terwijl je de bovenkant vasthoudt.', en: 'Slap the bottom onto the bench while holding the top.' },
      { nl: 'Vouw het vastgehouden deel over het neergeslagen deel heen.', en: 'Fold the held part over the slapped part.' },
      { nl: 'Draai een kwartslag en herhaal, twee tot vier minuten.', en: 'Turn a quarter and repeat, for two to four minutes.' },
      { nl: 'Stop als het deeg samenhangt en van het werkblad loskomt.', en: 'Stop when the dough holds together and comes free of the bench.' },
    ],
    whenItApplies: {
      nl: 'Boven mixsterkte 55, en alleen als de hydratatie op of boven de wateropname van de mix ligt. Op een stevig deeg is slap-and-fold nutteloze arbeid.',
      en: 'Above blend strength 55, and only when hydration is at or above the blend\'s absorption. On a stiff dough, slap-and-fold is pointless labour.',
    },
    mistakes: [
      { nl: 'Het proberen op spelt of eenkoorn. Dat gluten scheurt in plaats van te rekken.', en: 'Trying it on spelt or einkorn. That gluten tears rather than stretching.' },
      { nl: 'Bloem op het werkblad. Dat verandert de formule en het deeg glijdt weg.', en: 'Flour on the bench. It changes the formula and the dough slides away.' },
      { nl: 'Te lang doorgaan: acht minuten slaan warmt het deeg vier graden op.', en: 'Going too long: eight minutes of slapping warms the dough by four degrees.' },
    ],
  },
  {
    slug: 'bassinage',
    title: { nl: 'Bassinage', en: 'Bassinage' },
    summary: {
      nl: 'Water achterhouden en pas toevoegen als het glutennetwerk staat. De enige veilige manier om op hoge hydratatie te werken met meel dat je niet kent.',
      en: 'Holding water back and adding it once the gluten network exists. The only safe way to work at high hydration with a flour you do not know.',
    },
    steps: [
      { nl: 'Meng het deeg met vijf tot tien procent minder water dan de formule zegt.', en: 'Mix the dough with five to ten per cent less water than the formula says.' },
      { nl: 'Werk tot het deeg samenhangt en glad is.', en: 'Work until the dough is coherent and smooth.' },
      { nl: 'Voeg het achtergehouden water toe in twee porties, met een vouwset ertussen.', en: 'Add the held water in two goes, with a fold set between them.' },
      { nl: 'Knijp elke portie er volledig door voordat de volgende erbij gaat.', en: 'Pinch each portion fully through before the next goes in.' },
      { nl: 'Stopt het deeg met opnemen, houd de rest dan achter. Dat is informatie, geen mislukking.', en: 'If the dough stops taking it up, keep the rest. That is information, not failure.' },
    ],
    whenItApplies: {
      nl: 'De motor stelt bassinage voor zodra je binnen twee punten van het plafond van je mix zit, en de veiligste veiligheidsmarge houdt al het bassinagewater achter tot na de eerste vouwset.',
      en: 'The engine suggests bassinage as soon as you are within two points of your blend\'s ceiling, and the safest tier holds all of the bassinage water until after the first fold set.',
    },
    mistakes: [
      { nl: 'Het water in één keer toevoegen, waardoor het deeg uit elkaar valt en niet meer sluit.', en: 'Adding the water all at once, so the dough breaks apart and never closes again.' },
      { nl: 'Doorgaan tot de laatste druppel omdat het recept dat zegt.', en: 'Pushing to the last drop because the recipe says so.' },
    ],
  },
  {
    slug: 'insnijden',
    title: { nl: 'Insnijden', en: 'Scoring' },
    summary: {
      nl: 'Eén beweging, één diepte, één hoek. Insnijden is niet decoratief: het bepaalt waar het brood opengaat, en zonder snede scheurt het waar jij het niet wilt.',
      en: 'One movement, one depth, one angle. Scoring is not decorative: it decides where the loaf opens, and without a cut it tears where you did not want it to.',
    },
    steps: [
      { nl: 'Kiep het brood koud uit het mandje. Koud deeg snijdt schoon, warm deeg sleept.', en: 'Tip the loaf out cold. Cold dough cuts cleanly; warm dough drags.' },
      { nl: 'Houd het mesje onder ongeveer dertig graden, niet loodrecht.', en: 'Hold the blade at about thirty degrees, not vertical.' },
      { nl: 'Snijd een halve centimeter diep, in één ononderbroken beweging.', en: 'Cut half a centimetre deep, in one uninterrupted movement.' },
      { nl: 'Voor een oor: één lange snede langs de lengte, niet drie korte kriskras.', en: 'For an ear: one long cut along the length, not three short criss-crossed ones.' },
    ],
    whenItApplies: {
      nl: 'Bij elk vrijstaand brood. Broden in een bus of plaat hoeven niet: die worden door de vorm gestuurd.',
      en: 'On every free-standing loaf. Tin and tray breads do not need it: the vessel directs them.',
    },
    mistakes: [
      { nl: 'Aarzelen halverwege. Een snede die je twee keer probeert scheurt.', en: 'Hesitating halfway. A cut you attempt twice tears.' },
      { nl: 'Loodrecht snijden op een brood waar je een oor wilt.', en: 'Cutting vertically on a loaf where you want an ear.' },
      { nl: 'Een bot mes. Een scheermesje kost niets en lost dit volledig op.', en: 'A blunt knife. A razor blade costs nothing and solves this completely.' },
      { nl: 'Insnijden op een overgerezen deeg en dan de snede de schuld geven. Zonder gasreserve gaat geen enkele snede open, hoe mooi hij ook is.', en: 'Scoring an over-proofed dough and then blaming the cut. Without a gas reserve no score opens, however handsome it is.' },
    ],
  },
  {
    slug: 'vormen-boule',
    title: { nl: 'Een boule vormen', en: 'Shaping a boule' },
    summary: {
      nl: 'Rond spreidt de spanning gelijkmatiger dan elke andere vorm, en daarom is het de vorm die het minst van je meel vraagt.',
      en: 'Round distributes tension more evenly than any other shape, which is why it asks least of your flour.',
    },
    steps: [
      { nl: 'Leg het voorgevormde stuk met de gladde kant naar beneden.', en: 'Set the preshaped piece smooth side down.' },
      { nl: 'Vouw de vier kanten naar het midden, licht overlappend.', en: 'Fold the four sides to the middle, slightly overlapping.' },
      { nl: 'Draai het geheel om, naad naar beneden.', en: 'Turn the whole thing over, seam down.' },
      { nl: 'Trek het met beide handen of een deegsteker over het werkblad naar je toe, tot je spanning voelt in het vel.', en: 'Drag it towards you across the bench with both hands or a scraper, until you feel tension in the skin.' },
      { nl: 'Til het op en leg het met de naad naar boven in het mandje.', en: 'Lift it and set it seam side up in the basket.' },
    ],
    whenItApplies: {
      nl: 'De motor beveelt een boule aan zodra de mixsterkte onder 52 zakt, ook als het recept om een bâtard vraagt. Onder sterkte 22 raadt hij zelfs een boule af en stuurt hij je naar een busvorm.',
      en: 'The engine recommends a boule as soon as blend strength falls below 52, even when the recipe asks for a bâtard. Below strength 22 it advises against a boule too and sends you to a tin.',
    },
    mistakes: [
      { nl: 'Te veel bloem op het werkblad: het deeg glijdt en je bouwt geen spanning op.', en: 'Too much flour on the bench: the dough slides and you build no tension.' },
      { nl: 'Doortrekken tot het vel scheurt. Zodra het openscheurt, is de spanning weg.', en: 'Dragging until the skin tears. The moment it splits, the tension is gone.' },
    ],
  },
  {
    slug: 'desem-onderhouden',
    title: { nl: 'Een desem onderhouden', en: 'Maintaining a starter' },
    summary: {
      nl: 'Minder werk dan iedereen denkt, mits je de verhouding aan je ritme aanpast in plaats van andersom.',
      en: 'Less work than everyone thinks, provided you match the ratio to your rhythm rather than the other way round.',
    },
    steps: [
      { nl: 'Bak je wekelijks: bewaar de starter in de koelkast en voer één keer per week.', en: 'Baking weekly: keep the starter in the fridge and feed once a week.' },
      { nl: 'Bak je dagelijks: op het aanrecht, één of twee keer per dag op 1:5:5.', en: 'Baking daily: on the counter, once or twice a day at 1:5:5.' },
      { nl: 'Ga je een maand weg: droog een dun laagje op bakpapier en bewaar het in een pot.', en: 'Away for a month: dry a thin layer on paper and keep the flakes in a jar.' },
      { nl: 'Voor het bakken: twee voedingen op kamertemperatuur, en gebruik hem op zijn piek.', en: 'Before baking: two feeds at room temperature, and use it at its peak.' },
    ],
    whenItApplies: {
      nl: 'De voedingsverhouding bepaalt wanneer je desem piekt, en dus of je om 23:00 of om 02:40 moet voeren. De tijdlijnplanner rekent dat om en stelt een stijvere desem voor als je schema anders onmenselijk wordt.',
      en: 'The feeding ratio sets when your levain peaks, and therefore whether you feed at 23:00 or at 02:40. The timeline planner converts that and proposes a stiffer levain when your schedule would otherwise turn inhuman.',
    },
    mistakes: [
      { nl: 'Weggooien omdat er hooch op staat. Dat is alcohol en betekent alleen: honger.', en: 'Throwing it out because there is hooch on top. That is alcohol and means only: hungry.' },
      { nl: 'Elke dag 1:1:1 voeren en je afvragen waarom de piek zo kort is.', en: 'Feeding 1:1:1 every day and wondering why the peak is so brief.' },
    ],
  },
  {
    slug: 'lamineren',
    title: { nl: 'Lamineren', en: 'Lamination' },
    summary: {
      nl: 'Het deeg één keer volledig uitrekken tot een dun vel en weer opvouwen. Vervangt de eerste vouwsets en is de schoonste manier om toevoegingen gelijkmatig te verdelen.',
      en: 'Stretching the dough out once into a thin sheet and folding it back up. Replaces the early fold sets and is the cleanest way to distribute inclusions evenly.',
    },
    steps: [
      { nl: 'Maak het werkblad royaal nat — nat, niet bebloemd. Bloem laat het deeg glijden en verstoort de formule.', en: 'Wet the bench generously — wet, not floured. Flour lets the dough slide and disturbs the formula.' },
      { nl: 'Kiep het deeg erop en trek het voorzichtig vanuit het midden naar de randen uit, tot je het werkblad er doorheen ziet schemeren.', en: 'Tip the dough out and gently draw it from the middle to the edges, until you can almost see the bench through it.' },
      { nl: 'Verdeel eventuele toevoegingen gelijkmatig over het vel.', en: 'Spread any inclusions evenly across the sheet.' },
      { nl: 'Vouw het als een brief op: onderste derde omhoog, bovenste derde omlaag, dan de zijkanten naar binnen en oprollen.', en: 'Fold it like a letter: bottom third up, top third down, then the sides in and roll it up.' },
    ],
    whenItApplies: {
      nl: 'De motor stelt lamineren voor bij hoge hydratatie met sterke bloem, waar het één keer goed uitrekken meer structuur geeft dan drie voorzichtige vouwsets. Bij zwak of fragiel deeg juist niet: dan scheurt het vel en verlies je meer dan je opbouwt.',
      en: 'The engine suggests lamination at high hydration with strong flour, where one good stretch builds more structure than three careful fold sets. Not for weak or fragile dough: the sheet tears and you lose more than you build.',
    },
    mistakes: [
      { nl: 'Bloem op het werkblad gebruiken, waardoor het deeg glijdt en niet dun wordt.', en: 'Using flour on the bench, so the dough slides and will not thin out.' },
      { nl: 'Te lang blijven trekken tot het vel scheurt — één keer goed is beter dan tien keer bijwerken.', en: 'Pulling too long until the sheet tears — once, properly, beats ten touch-ups.' },
      { nl: 'Warm deeg lamineren: het plakt overal aan. Koel het eerst kort als het te slap is.', en: 'Laminating warm dough: it sticks to everything. Chill it briefly first if it is too slack.' },
    ],
  },
  {
    slug: 'stomen',
    title: { nl: 'Stoom in de oven', en: 'Steam in the oven' },
    summary: {
      nl: 'De eerste tien minuten vocht in de oven houden de korst zacht zodat het brood maximaal kan uitzetten. Zonder stoom zet de korst te vroeg en blijft de snede dicht.',
      en: 'Keeping moisture in the oven for the first ten minutes holds the crust soft so the loaf can expand fully. Without steam the crust sets too early and the score stays shut.',
    },
    steps: [
      { nl: 'De betrouwbaarste manier thuis: bak in een voorverwarmde gietijzeren pan met deksel. Het brood maakt zijn eigen stoom en die kan nergens heen.', en: 'The most reliable way at home: bake in a preheated cast-iron pot with the lid on. The loaf makes its own steam and it has nowhere to go.' },
      { nl: 'Op een steen of staalplaat: giet kokend water in een voorverwarmde bakplaat onderin de oven, direct nadat het brood erin gaat.', en: 'On a stone or steel: pour boiling water into a preheated tray at the bottom of the oven, right after the loaf goes in.' },
      { nl: 'Houd de ovendeur de eerste tien minuten dicht — elke keer openen laat de stoom ontsnappen.', en: 'Keep the oven door shut for the first ten minutes — opening it each time lets the steam escape.' },
      { nl: 'Haal daarna het deksel eraf of laat de stoom weg. Vanaf nu moet de oven juist droog worden om de korst te laten kleuren.', en: 'Then take the lid off or vent the steam. From now the oven needs to go dry so the crust can colour.' },
    ],
    whenItApplies: {
      nl: 'Bij elk vrijstaand hearth-brood. Busbroden en verrijkte degen willen juist geen stoom — die willen een zachte korst, en stoom werkt dan tegen je. De motor kiest de gietijzeren pan als standaard omdat die thuis het betrouwbaarst is.',
      en: 'On every free-standing hearth loaf. Tin loaves and enriched doughs do not want steam — they want a soft crust, and steam works against you there. The engine picks the Dutch oven by default because it is the most reliable at home.',
    },
    mistakes: [
      { nl: 'De pan niet mee voorverwarmen. Een koude pan geeft geen stoomstoot en geen goede oven spring.', en: 'Not preheating the pot. A cold pot gives no steam burst and no oven spring.' },
      { nl: 'De hele baktijd stomen. Na de eerste fase moet het droog, anders wordt de korst taai en bleek.', en: 'Steaming the whole bake. After the first phase it must go dry, or the crust turns leathery and pale.' },
    ],
  },
];

export function getProblem(slug: string) {
  return PROBLEMS.find((p) => p.slug === slug);
}

export function getTechnique(slug: string) {
  return TECHNIQUES.find((t) => t.slug === slug);
}
