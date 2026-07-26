import { decl, type FlourDecl } from './_types';

/**
 * Denmark, Sweden, Poland, Spain and Australia/New Zealand.
 *
 * Poland runs an ash system (typ 550, typ 750) directly parallel to the German
 * one. The Nordics classify by grind and by grain, with the finest-grained rye
 * vocabulary outside Germany — which matters, because Nordic rye baking uses
 * far higher rye percentages than anywhere else and the engine has to handle
 * doughs that form no gluten at all.
 *
 * Spain classifies by strength (fuerza) like the UK. Australia and New Zealand
 * mostly follow the British vocabulary over softer, lower-protein wheat than
 * either Britain or North America.
 */

export const DK_FLOURS: FlourDecl[] = [
  decl({
    slug: 'dk-hvedemel',
    name: 'Hvedemel',
    country: 'DK', system: 'nordic', designation: 'hvedemel',
    protein: 10.5, ash: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: 'Deense standaardtarwebloem; Deense tarwe is zacht en relatief eiwitarm.',
    availableIn: ['DK'],
  }),
  decl({
    slug: 'dk-manitoba',
    name: 'Manitobamel',
    country: 'DK', system: 'nordic', designation: 'manitoba',
    protein: 14.0, ash: 0.6,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'very-hard',
    sourceNote: 'Geïmporteerde Noord-Amerikaanse harde tarwe.',
    availableIn: ['DK', 'SE'],
  }),
  decl({
    slug: 'dk-oland-hvede',
    name: 'Ølandshvedemel',
    country: 'DK', system: 'nordic', designation: 'øland',
    protein: 11.5, ash: 1.5,
    species: 'wheat', wholegrain: 0.85, mill: 'stone', hardness: 'soft',
    sourceNote: 'Scandinavisch historisch ras; veel smaak, zwak gluten.',
    availableIn: ['DK', 'SE'],
    notes: {
      nl: 'Een van de smaakvolste tarwes van Noord-Europa en een van de zwakste. Boven 40% in de mix heb je ondersteuning nodig.',
      en: 'One of northern Europe\'s most flavourful wheats and one of its weakest. Above 40% of the blend you need support.',
    },
  }),
  decl({
    slug: 'dk-sigtemel',
    name: 'Sigtemel (bolted rye)',
    country: 'DK', system: 'nordic', designation: 'sigtemel',
    protein: 8.2, ash: 1.05,
    species: 'rye', wholegrain: 0.4, mill: 'roller', hardness: 'soft',
    sourceNote: 'Gezeefd roggemeel; het Deense equivalent van Type 1150.',
    availableIn: ['DK'],
  }),
  decl({
    slug: 'dk-rugmel',
    name: 'Rugmel (whole rye)',
    country: 'DK', system: 'nordic', designation: 'rugmel',
    protein: 9.0, ash: 1.8, fallingNumber: 195,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['DK', 'SE'],
    notes: {
      nl: 'De basis van rugbrød. Hier is desem geen smaakkeuze maar een technische noodzaak: zonder verzuring verzuipt de kruim in zijn eigen amylase.',
      en: 'The basis of rugbrød. Here sourdough is not a flavour choice but a technical necessity: without acidification the crumb drowns in its own amylase.',
    },
  }),
  decl({
    slug: 'dk-knaekket-rug',
    name: 'Knækket rug (cracked rye)',
    country: 'DK', system: 'nordic', designation: 'knækket rug',
    protein: 9.0, ash: 1.8,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Gebroken roggekorrels voor de weekmassa, niet gemalen tot meel.',
    availableIn: ['DK', 'SE', 'DE'],
  }),
];

export const SE_FLOURS: FlourDecl[] = [
  decl({
    slug: 'se-vetemjol-special',
    name: 'Vetemjöl special',
    country: 'SE', system: 'nordic', designation: 'special',
    protein: 12.0, ash: 0.6,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: 'Zweedse broodbloem; "special" duidt op hoger eiwit dan standaard vetemjöl.',
    availableIn: ['SE'],
  }),
  decl({
    slug: 'se-vetemjol',
    name: 'Vetemjöl (standard)',
    country: 'SE', system: 'nordic', designation: 'vetemjöl',
    protein: 10.2, ash: 0.5,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    availableIn: ['SE'],
  }),
  decl({
    slug: 'se-grahamsmjol',
    name: 'Grahamsmjöl',
    country: 'SE', system: 'nordic', designation: 'graham',
    protein: 11.8, ash: 1.7, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Zweeds volkorenmeel, grof gemalen.',
    availableIn: ['SE'],
  }),
  decl({
    slug: 'se-ragsikt',
    name: 'Rågsikt',
    country: 'SE', system: 'nordic', designation: 'rågsikt',
    protein: 10.0, ash: 0.8,
    species: 'rye', wholegrain: 0.15, mill: 'roller', hardness: 'soft',
    sourceNote: 'Mengsel van gezeefde rogge en tarwebloem — in Zweden als één product verkocht.',
    availableIn: ['SE'],
  }),
  decl({
    slug: 'se-ragmjol-grovt',
    name: 'Rågmjöl grovt',
    country: 'SE', system: 'nordic', designation: 'rågmjöl grovt',
    protein: 8.7, ash: 1.85, fallingNumber: 190,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['SE'],
  }),
  decl({
    slug: 'se-dinkelmjol',
    name: 'Dinkelmjöl fullkorn',
    country: 'SE', system: 'nordic', designation: 'dinkel fullkorn',
    protein: 13.4, ash: 1.72,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['SE', 'DK'],
  }),
];

export const PL_FLOURS: FlourDecl[] = [
  decl({
    slug: 'pl-typ-450',
    name: 'Mąka tortowa typ 450',
    country: 'PL', system: 'german-Type', designation: 'typ 450',
    protein: 9.2, ash: 0.44,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: 'Poolse typ-getallen volgen dezelfde asdefinitie als de Duitse.',
    availableIn: ['PL'],
  }),
  decl({
    slug: 'pl-typ-550',
    name: 'Mąka luksusowa typ 550',
    country: 'PL', system: 'german-Type', designation: 'typ 550',
    protein: 11.0, ash: 0.58,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    availableIn: ['PL'],
  }),
  decl({
    slug: 'pl-typ-650',
    name: 'Mąka chlebowa typ 650',
    country: 'PL', system: 'german-Type', designation: 'typ 650',
    protein: 11.8, ash: 0.68,
    species: 'wheat', wholegrain: 0.05, mill: 'roller', hardness: 'medium',
    availableIn: ['PL'],
  }),
  decl({
    slug: 'pl-typ-750',
    name: 'Mąka chlebowa typ 750',
    country: 'PL', system: 'german-Type', designation: 'typ 750',
    protein: 12.0, ash: 0.78,
    species: 'wheat', wholegrain: 0.2, mill: 'roller', hardness: 'medium',
    availableIn: ['PL'],
  }),
  decl({
    slug: 'pl-typ-1850-razowa',
    name: 'Mąka razowa typ 1850',
    country: 'PL', system: 'german-Type', designation: 'typ 1850',
    protein: 12.1, ash: 1.88, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
    availableIn: ['PL'],
  }),
  decl({
    slug: 'pl-zytnia-720',
    name: 'Mąka żytnia typ 720',
    country: 'PL', system: 'german-Type', designation: 'żytnia 720',
    protein: 8.0, ash: 0.75,
    species: 'rye', wholegrain: 0.15, mill: 'roller', hardness: 'soft',
    availableIn: ['PL'],
  }),
  decl({
    slug: 'pl-zytnia-2000',
    name: 'Mąka żytnia razowa typ 2000',
    country: 'PL', system: 'german-Type', designation: 'żytnia 2000',
    protein: 9.2, ash: 2.0, fallingNumber: 195,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['PL'],
    notes: {
      nl: 'Poolse volkorenrogge voor chleb żytni. Zeer hoog asgehalte, zeer actief — de bulk is korter dan je denkt.',
      en: 'Polish whole rye for chleb żytni. Very high ash, very active — the bulk is shorter than you think.',
    },
  }),
];

export const ES_FLOURS: FlourDecl[] = [
  decl({
    slug: 'es-harina-floja',
    name: 'Harina floja',
    country: 'ES', system: 'uk-strength', designation: 'floja',
    protein: 9.0, ash: 0.5, W: 100,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: 'Spaanse indeling op kracht (W); floja = zwak.',
    availableIn: ['ES'],
  }),
  decl({
    slug: 'es-harina-media-fuerza',
    name: 'Harina de media fuerza',
    country: 'ES', system: 'uk-strength', designation: 'media fuerza',
    protein: 11.5, ash: 0.55, W: 200,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    availableIn: ['ES'],
  }),
  decl({
    slug: 'es-harina-fuerza',
    name: 'Harina de fuerza',
    country: 'ES', system: 'uk-strength', designation: 'fuerza',
    protein: 13.0, ash: 0.6, W: 300,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    sourceNote: 'W typisch 280–330; de Spaanse indeling noemt de kracht direct.',
    availableIn: ['ES'],
    notes: {
      nl: 'Spanje classificeert op W-waarde, wat eerlijker is dan een asgetal: het meet precies de eigenschap waar een bakker om geeft.',
      en: 'Spain classifies by W value, which is more honest than an ash number: it measures precisely the property a baker cares about.',
    },
  }),
  decl({
    slug: 'es-harina-integral',
    name: 'Harina integral',
    country: 'ES', system: 'uk-strength', designation: 'integral',
    protein: 11.6, ash: 1.62, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['ES'],
  }),
  decl({
    slug: 'es-harina-centeno-integral',
    name: 'Harina de centeno integral',
    country: 'ES', system: 'uk-strength', designation: 'centeno integral',
    protein: 8.8, ash: 1.78, fallingNumber: 215,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['ES'],
  }),
  decl({
    slug: 'es-harina-espelta',
    name: 'Harina de espelta integral',
    country: 'ES', system: 'uk-strength', designation: 'espelta',
    protein: 13.6, ash: 1.68,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['ES'],
  }),
];

export const AU_FLOURS: FlourDecl[] = [
  decl({
    slug: 'au-bakers-flour',
    name: "Baker's Flour",
    country: 'AU', system: 'uk-strength', designation: "Baker's",
    protein: 11.6, ash: 0.52,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: 'Australische tarwe is doorgaans zachter en eiwitarmer dan Noord-Amerikaanse.',
    availableIn: ['AU'],
    notes: {
      nl: 'Australische bakkersbloem is merkbaar zwakker dan Amerikaanse bread flour. Amerikaanse recepten hierop draaien vraagt om minder water, niet meer.',
      en: 'Australian baker\'s flour is noticeably weaker than American bread flour. Running American recipes on it calls for less water, not more.',
    },
  }),
  decl({
    slug: 'au-plain-flour',
    name: 'Plain Flour (AU)',
    country: 'AU', system: 'uk-strength', designation: 'Plain',
    protein: 10.0, ash: 0.48,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    availableIn: ['AU'],
  }),
  decl({
    slug: 'au-wholemeal',
    name: 'Wholemeal Flour (AU)',
    country: 'AU', system: 'uk-strength', designation: 'Wholemeal',
    protein: 12.5, ash: 1.6, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'roller', hardness: 'medium',
    availableIn: ['AU'],
  }),
  decl({
    slug: 'au-stoneground-wholemeal',
    name: 'Stoneground Wholemeal (AU)',
    country: 'AU', system: 'uk-strength', designation: 'Stoneground Wholemeal',
    protein: 12.0, ash: 1.7, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['AU'],
  }),
  decl({
    slug: 'au-rye-wholemeal',
    name: 'Wholemeal Rye (AU)',
    country: 'AU', system: 'uk-strength', designation: 'Wholemeal Rye',
    protein: 9.0, ash: 1.75, fallingNumber: 215,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['AU'],
  }),
  decl({
    slug: 'au-spelt-wholemeal',
    name: 'Wholemeal Spelt (AU)',
    country: 'AU', system: 'uk-strength', designation: 'Wholemeal Spelt',
    protein: 13.5, ash: 1.7,
    species: 'spelt', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['AU'],
  }),
];
