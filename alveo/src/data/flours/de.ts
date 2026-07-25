import { decl, type FlourDecl } from './_types';

/**
 * Germany. The Type number is milligrams of ash per 100 g of dry matter, so
 * Type 550 means 0.51–0.63% ash — the same measurement France calls T55. The
 * systems are parallel, not identical: German 550 is typically milled from
 * stronger wheat than French T55 and behaves closer to a T65.
 *
 * Germany also runs the most complete rye classification in Europe, which is
 * why the rye entries below are finer-grained than any other country's.
 */

const DIN = 'Ash band per DIN 10355; protein is a typical value for the class.';

export const DE_FLOURS: FlourDecl[] = [
  decl({
    slug: 'de-405',
    name: 'Weizenmehl Type 405',
    country: 'DE', system: 'german-Type', designation: '405',
    protein: 10.0, ash: 0.45, extraction: 68,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE', 'NL', 'BE', 'PL'],
    notes: {
      nl: 'De huis-, tuin- en keukenbloem van Duitsland. Voor cake en saus, niet voor brood.',
      en: 'Germany\'s everyday household flour. For cake and sauce, not for bread.',
    },
  }),
  decl({
    slug: 'de-550',
    name: 'Weizenmehl Type 550',
    country: 'DE', system: 'german-Type', designation: '550',
    protein: 11.5, ash: 0.58, extraction: 73,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: DIN,
    availableIn: ['DE', 'NL', 'BE', 'PL', 'DK'],
    notes: {
      nl: 'Het Duitse broodmeel. Sterker dan de Franse T55 waar het qua as mee overeenkomt — een goed voorbeeld van waarom asgetallen niets over kracht zeggen.',
      en: 'Germany\'s bread flour. Stronger than the French T55 it matches on ash — a good illustration of why ash numbers say nothing about strength.',
    },
  }),
  decl({
    slug: 'de-812',
    name: 'Weizenmehl Type 812',
    country: 'DE', system: 'german-Type', designation: '812',
    protein: 11.8, ash: 0.85, extraction: 82,
    species: 'wheat', wholegrain: 0.25, mill: 'roller', hardness: 'medium',
    sourceNote: DIN,
    availableIn: ['DE', 'NL'],
  }),
  decl({
    slug: 'de-1050',
    name: 'Weizenmehl Type 1050',
    country: 'DE', system: 'german-Type', designation: '1050',
    protein: 12.0, ash: 1.1, extraction: 87,
    species: 'wheat', wholegrain: 0.55, mill: 'roller', hardness: 'medium',
    sourceNote: DIN,
    availableIn: ['DE', 'NL', 'BE', 'PL'],
    notes: {
      nl: 'Donkere tarwebloem, de ruggengraat van het Duitse Mischbrot. Halfvolkoren in gedrag.',
      en: 'Dark wheat flour, the backbone of German Mischbrot. Behaves as a half-wholemeal.',
    },
  }),
  decl({
    slug: 'de-1600',
    name: 'Weizenmehl Type 1600',
    country: 'DE', system: 'german-Type', designation: '1600',
    protein: 12.3, ash: 1.6, extraction: 95,
    species: 'wheat', wholegrain: 0.85, mill: 'roller', hardness: 'medium',
    sourceNote: DIN,
    availableIn: ['DE'],
  }),
  decl({
    slug: 'de-weizenvollkorn',
    name: 'Weizenvollkornmehl',
    country: 'DE', system: 'german-Type', designation: 'Vollkorn',
    protein: 12.5, ash: 1.7, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
    sourceNote: 'Volkoren per definitie 100% uitmaling; as varieert met het graan.',
    availableIn: ['DE', 'NL', 'BE', 'PL'],
  }),
  decl({
    slug: 'de-dinkel-630',
    name: 'Dinkelmehl Type 630',
    country: 'DE', system: 'german-Type', designation: '630 Dinkel',
    protein: 12.5, ash: 0.65,
    species: 'spelt', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: `${DIN} Spelt-specifieke Type-nummers wijken af van tarwe.`,
    availableIn: ['DE', 'NL', 'BE', 'DK'],
    notes: {
      nl: 'De speltbloem die het dichtst bij witte tarwebloem komt. Nog steeds: minder water, minder vouwen, korter bulken.',
      en: 'The spelt flour that comes closest to white wheat flour. Still: less water, fewer folds, shorter bulk.',
    },
  }),
  decl({
    slug: 'de-dinkel-812',
    name: 'Dinkelmehl Type 812',
    country: 'DE', system: 'german-Type', designation: '812 Dinkel',
    protein: 13.0, ash: 0.85,
    species: 'spelt', wholegrain: 0.3, mill: 'roller', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE', 'NL'],
  }),
  decl({
    slug: 'de-dinkel-1050',
    name: 'Dinkelmehl Type 1050',
    country: 'DE', system: 'german-Type', designation: '1050 Dinkel',
    protein: 13.2, ash: 1.1,
    species: 'spelt', wholegrain: 0.6, mill: 'stone', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE', 'NL'],
  }),
  decl({
    slug: 'de-dinkelvollkorn',
    name: 'Dinkelvollkornmehl',
    country: 'DE', system: 'german-Type', designation: 'Dinkel Vollkorn',
    protein: 14.0, ash: 1.75,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Volkorenspelt; hoog eiwit, laag draagvermogen.',
    availableIn: ['DE', 'NL', 'BE'],
    notes: {
      nl: 'Veertien procent eiwit en toch geen structuur. Dit is het duidelijkste bewijs dat eiwitgehalte en sterkte twee verschillende dingen zijn.',
      en: 'Fourteen per cent protein and still no structure. This is the clearest proof that protein content and strength are two different things.',
    },
  }),
  decl({
    slug: 'de-roggen-815',
    name: 'Roggenmehl Type 815',
    country: 'DE', system: 'german-Type', designation: '815 Roggen',
    protein: 7.5, ash: 0.85,
    species: 'rye', wholegrain: 0.2, mill: 'roller', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE', 'PL', 'DK'],
  }),
  decl({
    slug: 'de-roggen-997',
    name: 'Roggenmehl Type 997',
    country: 'DE', system: 'german-Type', designation: '997 Roggen',
    protein: 8.0, ash: 1.0,
    species: 'rye', wholegrain: 0.35, mill: 'roller', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE', 'PL'],
  }),
  decl({
    slug: 'de-roggen-1150',
    name: 'Roggenmehl Type 1150',
    country: 'DE', system: 'german-Type', designation: '1150 Roggen',
    protein: 8.5, ash: 1.2, fallingNumber: 240,
    species: 'rye', wholegrain: 0.5, mill: 'roller', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE', 'NL', 'PL', 'DK'],
    notes: {
      nl: 'De standaardrogge voor Mischbrot. Onder de 20% in de mix merk je vooral de smaak; daarboven verandert de hele techniek.',
      en: 'The standard rye for Mischbrot. Below 20% of the blend you mostly taste it; above that, the whole technique changes.',
    },
  }),
  decl({
    slug: 'de-roggen-1370',
    name: 'Roggenmehl Type 1370',
    country: 'DE', system: 'german-Type', designation: '1370 Roggen',
    protein: 8.8, ash: 1.4, fallingNumber: 220,
    species: 'rye', wholegrain: 0.7, mill: 'roller', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE'],
  }),
  decl({
    slug: 'de-roggen-1740',
    name: 'Roggenmehl Type 1740',
    country: 'DE', system: 'german-Type', designation: '1740 Roggen',
    protein: 9.0, ash: 1.75, fallingNumber: 200,
    species: 'rye', wholegrain: 0.9, mill: 'stone', hardness: 'soft',
    sourceNote: DIN,
    availableIn: ['DE'],
  }),
  decl({
    slug: 'de-roggenvollkorn',
    name: 'Roggenvollkornmehl',
    country: 'DE', system: 'german-Type', designation: 'Roggen Vollkorn',
    protein: 9.5, ash: 1.85, fallingNumber: 190,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Volkorenrogge; lage valgetallen zijn normaal en vragen om verzuring.',
    availableIn: ['DE', 'NL', 'DK', 'SE', 'PL'],
    notes: {
      nl: 'Hier komt de verzuring niet uit smaakoverwegingen maar uit noodzaak: zuur remt het amylase dat anders je kruim tot pap maakt.',
      en: 'Here the souring is not a flavour choice but a necessity: acid restrains the amylase that would otherwise reduce your crumb to paste.',
    },
  }),
  decl({
    slug: 'de-emmer-vollkorn',
    name: 'Emmervollkornmehl',
    country: 'DE', system: 'german-Type', designation: 'Emmer Vollkorn',
    protein: 14.0, ash: 1.8,
    species: 'emmer', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Emmer; zeer hoog eiwit, zeer laag draagvermogen.',
    availableIn: ['DE', 'IT', 'NL'],
  }),
  decl({
    slug: 'de-manitoba-550',
    name: 'Weizenmehl Type 550 Manitoba',
    country: 'DE', system: 'german-Type', designation: '550 Manitoba',
    protein: 14.5, ash: 0.58, W: 350,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'very-hard',
    sourceNote: 'Uit Noord-Amerikaanse harde tarwe geïmporteerd naar EU-normen; W typisch 330–380.',
    availableIn: ['DE', 'IT', 'NL', 'BE'],
    notes: {
      nl: 'Noord-Amerikaans graan in een Europese verpakking. Dit is het meel dat het gat tussen de continenten dicht — en het drinkt navenant.',
      en: 'North American grain in European packaging. This is the flour that closes the gap between the continents — and it drinks accordingly.',
    },
  }),
];
