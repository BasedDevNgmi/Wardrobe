import { decl, type FlourDecl } from './_types';

/**
 * United States and Canada.
 *
 * This is the country whose flour causes the trouble. North American bread
 * wheat is hard red spring or hard red winter — genuinely harder grain than
 * most European wheat — and hard grain shatters more starch granules on a
 * roller mill. Damaged starch absorbs up to ten times what intact starch does,
 * so American flour drinks several points more water than a European flour of
 * the same protein content.
 *
 * That is why an American formula at 85% turns to soup on French T65. It is
 * mostly a milling and hardness story, not a protein story, and almost every
 * recipe blog gets that backwards.
 *
 * US millers quote protein as sold, on a 14% moisture basis.
 */

export const US_FLOURS: FlourDecl[] = [
  decl({
    slug: 'us-ap-flour',
    name: 'All-Purpose Flour',
    country: 'US', system: 'us-type', designation: 'All-Purpose',
    protein: 11.7, ash: 0.48,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    additives: ['malted-barley'],
    sourceNote: 'Typische waarde voor Amerikaanse AP-bloem; veel merken malten met gerstemout.',
    availableIn: ['US', 'CA'],
    notes: {
      nl: 'Amerikaanse AP is sterker dan Europese patentbloem met hetzelfde etiket. Vervang niet één op één.',
      en: 'American AP is stronger than European plain flour wearing the same label. Do not substitute one for one.',
    },
  }),
  decl({
    slug: 'us-bread-flour',
    name: 'Bread Flour',
    country: 'US', system: 'us-type', designation: 'Bread Flour',
    protein: 12.5, ash: 0.5,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    additives: ['malted-barley'],
    sourceNote: 'Harde rode voorjaars- of wintertarwe; typisch 12,5–13% eiwit.',
    availableIn: ['US', 'CA'],
    notes: {
      nl: 'De referentiebloem van vrijwel elk Engelstalig desemrecept. Als een recept 80% hydratatie zegt zonder de bloem te noemen, bedoelt het waarschijnlijk dit.',
      en: 'The reference flour behind almost every English-language sourdough recipe. If a recipe says 80% hydration without naming its flour, it probably means this.',
    },
  }),
  decl({
    slug: 'us-high-gluten',
    name: 'High-Gluten Flour',
    country: 'US', system: 'us-type', designation: 'High-Gluten',
    protein: 14.2, ash: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'very-hard',
    additives: ['malted-barley', 'ascorbic-acid'],
    sourceNote: 'Bagel- en pizzabloem uit harde voorjaarstarwe.',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-whole-wheat',
    name: 'Whole Wheat Flour',
    country: 'US', system: 'us-type', designation: 'Whole Wheat',
    protein: 13.5, ash: 1.65, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'hard',
    sourceNote: 'Harde rode tarwe, volledig uitgemalen.',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-white-whole-wheat',
    name: 'White Whole Wheat Flour',
    country: 'US', system: 'us-type', designation: 'White Whole Wheat',
    protein: 13.0, ash: 1.55, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'hard',
    sourceNote: 'Harde witte tarwe: volkoren, maar zonder de bittere tannines van rode tarwe.',
    availableIn: ['US', 'CA'],
    notes: {
      nl: 'Volkoren uit witte tarwe. Zelfde zemelen, mildere smaak — de makkelijkste manier om het volkorenaandeel te verhogen zonder klachten aan tafel.',
      en: 'Wholegrain from white wheat. Same bran, milder flavour — the easiest way to raise the wholegrain share without complaints at the table.',
    },
  }),
  decl({
    slug: 'us-pastry-flour',
    name: 'Pastry Flour',
    country: 'US', system: 'us-type', designation: 'Pastry',
    protein: 8.5, ash: 0.44,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: 'Zachte wintertarwe.',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-type-85',
    name: 'Type 85 / High-Extraction Flour',
    country: 'US', system: 'us-type', designation: 'Type 85',
    protein: 12.5, ash: 0.85, extraction: 85,
    species: 'wheat', wholegrain: 0.3, mill: 'stone', hardness: 'hard',
    sourceNote: 'Amerikaanse ambachtelijke molens die het Franse T80-idee overnemen.',
    availableIn: ['US'],
    notes: {
      nl: 'Amerikaanse molens die de Europese uitmalingsgedachte overnemen. Qua gedrag het dichtst bij een Franse T80, maar uit harder graan.',
      en: 'American mills adopting the European extraction idea. Behaves closest to a French T80, but from harder grain.',
    },
  }),
  decl({
    slug: 'us-artisan-bakers-craft',
    name: 'Artisan Bakers Craft (malted)',
    country: 'US', system: 'us-type', designation: 'ABC',
    protein: 11.5, ash: 0.5,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    additives: ['malted-barley'],
    sourceNote: 'Ambachtelijke bakkersbloem met lager eiwit dan standaard bread flour, gericht op smaak boven kracht.',
    availableIn: ['US'],
  }),
  decl({
    slug: 'us-heritage-red-fife',
    name: 'Red Fife (stone-milled)',
    country: 'US', system: 'us-type', designation: 'Red Fife',
    protein: 12.0, ash: 1.5, extraction: 95,
    species: 'wheat', wholegrain: 0.85, mill: 'stone', hardness: 'hard',
    sourceNote: 'Historisch ras; sterk wisselend per oogst en per molen.',
    availableIn: ['US', 'CA'],
    notes: {
      nl: 'Oud ras, steengemalen. Het eiwitgehalte lijkt op moderne tarwe maar de glutenkwaliteit is zwakker — reken op minder oven spring.',
      en: 'Heritage variety, stone-milled. Protein reads like modern wheat but the gluten quality is weaker — expect less oven spring.',
    },
  }),
  decl({
    slug: 'us-sonora',
    name: 'White Sonora (stone-milled)',
    country: 'US', system: 'us-type', designation: 'Sonora',
    protein: 9.5, ash: 1.4, extraction: 92,
    species: 'wheat', wholegrain: 0.8, mill: 'stone', hardness: 'soft',
    sourceNote: 'Zeer oud zacht ras uit het zuidwesten van de VS.',
    availableIn: ['US'],
  }),
  decl({
    slug: 'us-durum-semolina',
    name: 'Semolina (fine)',
    country: 'US', system: 'us-type', designation: 'Semolina',
    protein: 12.8, ash: 0.85,
    species: 'durum', wholegrain: 0.1, mill: 'roller', hardness: 'very-hard',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-dark-rye',
    name: 'Dark Rye Flour',
    country: 'US', system: 'us-type', designation: 'Dark Rye',
    protein: 9.0, ash: 1.7, fallingNumber: 210,
    species: 'rye', wholegrain: 0.9, mill: 'roller', hardness: 'soft',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-medium-rye',
    name: 'Medium Rye Flour',
    country: 'US', system: 'us-type', designation: 'Medium Rye',
    protein: 8.5, ash: 1.1,
    species: 'rye', wholegrain: 0.45, mill: 'roller', hardness: 'soft',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-spelt',
    name: 'Spelt Flour (whole)',
    country: 'US', system: 'us-type', designation: 'Spelt',
    protein: 13.8, ash: 1.65,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['US', 'CA'],
  }),
  decl({
    slug: 'us-einkorn',
    name: 'Einkorn Flour (whole)',
    country: 'US', system: 'us-type', designation: 'Einkorn',
    protein: 15.0, ash: 1.6,
    species: 'einkorn', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['US', 'CA'],
    notes: {
      nl: 'Vijftien procent eiwit en het houdt nog steeds geen vorm. Boven 30% in de mix: busvorm.',
      en: 'Fifteen per cent protein and it still holds no shape. Above 30% of the blend: use a tin.',
    },
  }),
  decl({
    slug: 'us-khorasan',
    name: 'Khorasan Flour (whole)',
    country: 'US', system: 'us-type', designation: 'Khorasan',
    protein: 14.5, ash: 1.6,
    species: 'khorasan', wholegrain: 1, mill: 'stone', hardness: 'medium',
    availableIn: ['US', 'CA', 'IT'],
  }),
  decl({
    slug: 'us-home-milled-hard-red',
    name: 'Home-milled hard red wheat',
    country: 'US', system: 'us-type', designation: 'home-milled',
    protein: 13.5, ash: 1.65, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'home-impact', hardness: 'hard',
    sourceNote: 'Thuis gemalen op een impactmolen; beschadigd zetmeel fors lager dan industrieel.',
    availableIn: ['US', 'CA', 'AU', 'UK', 'DE', 'NL'],
    notes: {
      nl: 'Zelfde graan, andere molen. Een impactmolen beschadigt veel minder zetmeel dan een industriële walsmolen, en dat scheelt meerdere punten wateropname — vers gemalen meel neemt in het begin juist mínder water op dan je verwacht.',
      en: 'Same grain, different mill. An impact mill damages far less starch than an industrial roller mill, and that is worth several points of water uptake — freshly milled flour takes up *less* water at first than you would expect.',
    },
  }),
  decl({
    slug: 'ca-strong-bakers',
    name: 'Strong Bakers Flour',
    country: 'CA', system: 'us-type', designation: 'Strong Bakers',
    protein: 13.3, ash: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'very-hard',
    additives: ['malted-barley'],
    sourceNote: 'Canadese harde voorjaarstarwe (CWRS); een van de sterkste commerciële bloemen ter wereld.',
    availableIn: ['CA', 'US', 'UK'],
    notes: {
      nl: 'Canadese harde voorjaarstarwe is zo ongeveer het sterkste dat je commercieel kunt kopen. Europese recepten hierop draaien vraagt om fors meer water.',
      en: 'Canadian hard spring wheat is about the strongest thing you can buy commercially. Running European recipes on it calls for considerably more water.',
    },
  }),
  decl({
    slug: 'ca-all-purpose',
    name: 'Canadian All-Purpose Flour',
    country: 'CA', system: 'us-type', designation: 'All-Purpose',
    protein: 13.0, ash: 0.5,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    sourceNote: 'Canadese AP is sterker dan Amerikaanse AP — dichter bij Amerikaanse bread flour.',
    availableIn: ['CA'],
    notes: {
      nl: 'Let op: Canadese "all-purpose" ligt qua kracht dichter bij Amerikaanse bread flour dan bij Amerikaanse all-purpose. Hetzelfde woord, ander product.',
      en: 'Careful: Canadian "all-purpose" sits closer in strength to American bread flour than to American all-purpose. Same word, different product.',
    },
  }),
  decl({
    slug: 'ca-whole-wheat',
    name: 'Canadian Whole Wheat Flour',
    country: 'CA', system: 'us-type', designation: 'Whole Wheat',
    protein: 14.0, ash: 1.7, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'very-hard',
    availableIn: ['CA'],
  }),
  decl({
    slug: 'ca-red-fife',
    name: 'Red Fife (Canadian, stone-milled)',
    country: 'CA', system: 'us-type', designation: 'Red Fife',
    protein: 12.5, ash: 1.55,
    species: 'wheat', wholegrain: 0.9, mill: 'stone', hardness: 'hard',
    availableIn: ['CA'],
  }),
];
