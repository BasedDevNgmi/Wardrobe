import { decl, type FlourDecl } from './_types';

/**
 * The Netherlands, Belgium and the United Kingdom.
 *
 * None of these countries uses an ash-number system. The Dutch and Belgians
 * classify by degree of extraction in plain language — bloem is white, meel
 * contains the bran — and the British classify by *strength*, which is the only
 * European system that names the property bakers actually care about, and the
 * only one that says nothing about extraction.
 *
 * So a British "strong white" and a French T65 are classified along completely
 * perpendicular axes. Any conversion table between them is an approximation,
 * and we say so on the page rather than pretending otherwise.
 */

export const NL_FLOURS: FlourDecl[] = [
  decl({
    slug: 'nl-patentbloem',
    name: 'Patentbloem',
    country: 'NL', system: 'dutch', designation: 'patentbloem',
    protein: 9.8, ash: 0.45, extraction: 68,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: 'Nederlandse klassering op uitmaling, niet op as of eiwit; waarden typisch voor de klasse.',
    availableIn: ['NL', 'BE'],
    notes: {
      nl: 'De witte bloem uit de supermarkt: laag in eiwit en zacht gemalen. Bruikbaar voor desem, maar reken op een dichtere kruim en minder oven spring dan met bakkersbloem.',
      en: 'The white flour from the supermarket: low in protein and softly milled. Usable for sourdough, but expect a tighter crumb and less oven spring than with baker\'s flour.',
    },
  }),
  decl({
    slug: 'nl-tarwebloem',
    name: 'Tarwebloem',
    country: 'NL', system: 'dutch', designation: 'tarwebloem',
    protein: 11.8, ash: 0.55, extraction: 74,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: 'Bakkersbloem; iets hoger eiwit dan patentbloem.',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-bakkersbloem',
    name: 'Bakkersbloem (sterk)',
    country: 'NL', system: 'dutch', designation: 'bakkersbloem',
    protein: 12.8, ash: 0.58,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    additives: ['ascorbic-acid'],
    sourceNote: 'Professionele bakkersbloem; vaak met ascorbinezuur als verbetermiddel.',
    availableIn: ['NL', 'BE'],
    notes: {
      nl: 'De sterkste bloem die je in Nederland zonder moeite koopt. Het dichtst bij Amerikaanse bread flour, maar met minder beschadigd zetmeel — dus nog steeds enkele punten minder water.',
      en: 'The strongest flour you can buy easily in the Netherlands. Closest to American bread flour, but with less damaged starch — so still several points less water.',
    },
  }),
  decl({
    slug: 'nl-tarwemeel',
    name: 'Tarwemeel (halfvolkoren)',
    country: 'NL', system: 'dutch', designation: 'tarwemeel',
    protein: 12.0, ash: 1.0, extraction: 85,
    species: 'wheat', wholegrain: 0.5, mill: 'roller', hardness: 'medium',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-volkorenmeel',
    name: 'Volkorenmeel',
    country: 'NL', system: 'dutch', designation: 'volkoren',
    protein: 12.5, ash: 1.65, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'medium',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-volkoren-steengemalen',
    name: 'Volkorenmeel, steengemalen',
    country: 'NL', system: 'dutch', designation: 'volkoren steen',
    protein: 12.3, ash: 1.7, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
    sourceNote: 'Ambachtelijke molen; steenmaling beschadigt minder zetmeel dan walsmaling.',
    availableIn: ['NL', 'BE'],
    notes: {
      nl: 'Hetzelfde graan als industrieel volkoren, maar op steen gemalen: minder beschadigd zetmeel, dus een paar punten minder water en een tragere hydratatie.',
      en: 'The same grain as industrial wholemeal, but stone-milled: less damaged starch, so a couple of points less water and slower hydration.',
    },
  }),
  decl({
    slug: 'nl-roggebloem',
    name: 'Roggebloem',
    country: 'NL', system: 'dutch', designation: 'roggebloem',
    protein: 7.5, ash: 0.8,
    species: 'rye', wholegrain: 0.2, mill: 'roller', hardness: 'soft',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-roggemeel',
    name: 'Roggemeel (volkoren)',
    country: 'NL', system: 'dutch', designation: 'roggemeel',
    protein: 9.0, ash: 1.8, fallingNumber: 200,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-speltbloem',
    name: 'Speltbloem',
    country: 'NL', system: 'dutch', designation: 'speltbloem',
    protein: 12.2, ash: 0.68,
    species: 'spelt', wholegrain: 0, mill: 'roller', hardness: 'soft',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-speltmeel',
    name: 'Speltmeel (volkoren)',
    country: 'NL', system: 'dutch', designation: 'speltmeel',
    protein: 13.7, ash: 1.78,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['NL', 'BE'],
  }),
  decl({
    slug: 'nl-boekweitmeel',
    name: 'Boekweitmeel',
    country: 'NL', system: 'dutch', designation: 'boekweit',
    protein: 12.0, ash: 1.8,
    species: 'buckwheat', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Boekweit is geen graan en vormt geen gluten.',
    availableIn: ['NL', 'BE', 'FR'],
  }),
  decl({
    slug: 'nl-zeeuwse-bloem',
    name: 'Zeeuwse tarwebloem',
    country: 'NL', system: 'dutch', designation: 'streekbloem',
    protein: 11.0, ash: 0.6,
    species: 'wheat', wholegrain: 0.05, mill: 'stone', hardness: 'soft',
    sourceNote: 'Nederlandse streektarwe, doorgaans zachter en zwakker dan importtarwe.',
    availableIn: ['NL'],
    notes: {
      nl: 'Nederlandse tarwe is zacht: goede smaak, weinig kracht. Reken op minder water en een dichtere kruim dan bij importbloem.',
      en: 'Dutch wheat is soft: good flavour, little strength. Expect less water and a tighter crumb than with imported flour.',
    },
  }),
];

export const BE_FLOURS: FlourDecl[] = [
  decl({
    slug: 'be-bloem-t55',
    name: 'Witte bloem (T55-equivalent)',
    country: 'BE', system: 'dutch', designation: 'witte bloem',
    protein: 11.0, ash: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: 'België gebruikt in de praktijk zowel de Nederlandse als de Franse indeling.',
    availableIn: ['BE', 'NL', 'FR'],
  }),
  decl({
    slug: 'be-bruine-bloem',
    name: 'Bruine bloem',
    country: 'BE', system: 'dutch', designation: 'bruine bloem',
    protein: 11.8, ash: 1.0, extraction: 85,
    species: 'wheat', wholegrain: 0.5, mill: 'roller', hardness: 'medium',
    availableIn: ['BE'],
  }),
  decl({
    slug: 'be-volkoren',
    name: 'Volkorenmeel (Belgisch)',
    country: 'BE', system: 'dutch', designation: 'volkoren',
    protein: 12.4, ash: 1.65, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'medium',
    availableIn: ['BE'],
  }),
  decl({
    slug: 'be-spelt-volkoren',
    name: 'Speltmeel volkoren (Belgisch)',
    country: 'BE', system: 'dutch', designation: 'spelt volkoren',
    protein: 14.1, ash: 1.73,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['BE', 'NL'],
  }),
  decl({
    slug: 'be-rogge-volkoren',
    name: 'Roggemeel volkoren (Belgisch)',
    country: 'BE', system: 'dutch', designation: 'rogge volkoren',
    protein: 9.0, ash: 1.8, fallingNumber: 205,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['BE'],
  }),
];

export const UK_FLOURS: FlourDecl[] = [
  decl({
    slug: 'uk-strong-white',
    name: 'Strong White Bread Flour',
    country: 'UK', system: 'uk-strength', designation: 'Strong White',
    protein: 12.5, ash: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    sourceNote: 'Britse indeling is op kracht, niet op as; eiwit typisch 12–13%.',
    availableIn: ['UK'],
    notes: {
      nl: 'Britse "strong" zegt iets over eiwit, niets over uitmaling — precies het spiegelbeeld van het Franse T-systeem, dat over uitmaling gaat en niets over kracht zegt.',
      en: 'British "strong" speaks to protein and says nothing about extraction — the exact mirror of the French T system, which speaks to extraction and says nothing about strength.',
    },
  }),
  decl({
    slug: 'uk-very-strong-canadian',
    name: 'Very Strong Canadian White',
    country: 'UK', system: 'uk-strength', designation: 'Very Strong',
    protein: 14.0, ash: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'very-hard',
    sourceNote: 'Geïmporteerde Canadese harde voorjaarstarwe, in het VK op kracht verkocht.',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-plain-flour',
    name: 'Plain Flour',
    country: 'UK', system: 'uk-strength', designation: 'Plain',
    protein: 9.5, ash: 0.45,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: 'Zachte Britse wintertarwe.',
    availableIn: ['UK'],
    notes: {
      nl: 'Britse plain flour is duidelijk zwakker dan Amerikaanse all-purpose, ondanks de vergelijkbare rol in de keuken. Niet inwisselbaar in broodrecepten.',
      en: 'British plain flour is distinctly weaker than American all-purpose despite filling the same role in the kitchen. Not interchangeable in bread recipes.',
    },
  }),
  decl({
    slug: 'uk-wholemeal-strong',
    name: 'Strong Wholemeal Flour',
    country: 'UK', system: 'uk-strength', designation: 'Strong Wholemeal',
    protein: 13.0, ash: 1.6, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'hard',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-stoneground-wholemeal',
    name: 'Stoneground Wholemeal Flour',
    country: 'UK', system: 'uk-strength', designation: 'Stoneground Wholemeal',
    protein: 12.7, ash: 1.68, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-white-type-85',
    name: 'Light Brown / 85% Extraction Flour',
    country: 'UK', system: 'uk-strength', designation: '85% extraction',
    protein: 12.3, ash: 0.9, extraction: 85,
    species: 'wheat', wholegrain: 0.35, mill: 'stone', hardness: 'medium',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-heritage-wholemeal',
    name: 'Heritage Wheat Wholemeal',
    country: 'UK', system: 'uk-strength', designation: 'Heritage Wholemeal',
    protein: 11.0, ash: 1.65, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Historische Britse rassen; laag eiwit en zwakker gluten dan modern graan.',
    availableIn: ['UK'],
    notes: {
      nl: 'Oude Britse rassen geven veel smaak en weinig structuur. Onder 30% in de mix houden, tenzij je een busvorm gebruikt.',
      en: 'Heritage British varieties give a great deal of flavour and very little structure. Keep below 30% of the blend unless you are using a tin.',
    },
  }),
  decl({
    slug: 'uk-dark-rye',
    name: 'Dark Rye Flour (UK)',
    country: 'UK', system: 'uk-strength', designation: 'Dark Rye',
    protein: 9.0, ash: 1.75, fallingNumber: 210,
    species: 'rye', wholegrain: 0.95, mill: 'roller', hardness: 'soft',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-light-rye',
    name: 'Light Rye Flour (UK)',
    country: 'UK', system: 'uk-strength', designation: 'Light Rye',
    protein: 8.0, ash: 0.9,
    species: 'rye', wholegrain: 0.25, mill: 'roller', hardness: 'soft',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-spelt-white',
    name: 'White Spelt Flour (UK)',
    country: 'UK', system: 'uk-strength', designation: 'White Spelt',
    protein: 12.8, ash: 0.7,
    species: 'spelt', wholegrain: 0, mill: 'roller', hardness: 'soft',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-spelt-wholemeal',
    name: 'Wholemeal Spelt Flour (UK)',
    country: 'UK', system: 'uk-strength', designation: 'Wholemeal Spelt',
    protein: 14.2, ash: 1.75,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['UK'],
  }),
  decl({
    slug: 'uk-malthouse',
    name: 'Malted Grain Bread Flour',
    country: 'UK', system: 'uk-strength', designation: 'Malted Grain',
    protein: 12.4, ash: 1.1,
    species: 'wheat', wholegrain: 0.4, mill: 'roller', hardness: 'hard',
    additives: ['malted-barley'],
    sourceNote: 'Meelmengsel met gemoute vlokken; het moutaandeel verhoogt de enzymactiviteit.',
    availableIn: ['UK'],
    notes: {
      nl: 'De moutvlokken voegen enzymen toe. Dat versnelt de fermentatie en verkort het venster waarin het deeg goed is — hou de bulk korter dan je gewend bent.',
      en: 'The malted flakes add enzymes. That speeds fermentation and narrows the window in which the dough is right — keep the bulk shorter than you are used to.',
    },
  }),
];
