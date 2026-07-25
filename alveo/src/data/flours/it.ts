import { decl, type FlourDecl } from './_types';

/**
 * Italy. The tipo number runs backwards from the French and German systems:
 * tipo 00 is the *most* refined, tipo 2 the least, integrale is wholemeal. It
 * is a grind-and-ash classification and, once again, says nothing about
 * strength — a 00 can be a limp cake flour or a 380 W panettone flour.
 *
 * Italy is also the only country where the alveograph W value is routinely
 * printed on the bag, which makes Italian flour the easiest in Europe to model
 * accurately. Protein is usually quoted on dry matter.
 */

const DPR = 'Aswaarde per DPR 187/2001; eiwit typisch voor de klasse. W waar de molen die publiceert.';

export const IT_FLOURS: FlourDecl[] = [
  decl({
    slug: 'it-00-pizza',
    name: 'Farina tipo 00 per pizza',
    country: 'IT', system: 'italian-tipo', designation: '00',
    protein: 12.5, proteinBasis: 'dry', ash: 0.5, W: 260,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: DPR,
    availableIn: ['IT', 'NL', 'BE', 'DE', 'UK', 'US'],
    notes: {
      nl: 'Fijn gemalen, middelsterk, gemaakt voor lange koude rijs. Niet omdat 00 "zwak" is — dit type is juist zeer verfijnd én sterk genoeg voor 48 uur.',
      en: 'Finely milled, mid-strength, built for a long cold rise. Not because 00 is "weak" — this type is both highly refined and strong enough for 48 hours.',
    },
  }),
  decl({
    slug: 'it-00-pasticceria',
    name: 'Farina tipo 00 per pasticceria',
    country: 'IT', system: 'italian-tipo', designation: '00 debole',
    protein: 9.5, proteinBasis: 'dry', ash: 0.5, W: 150,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: DPR,
    availableIn: ['IT'],
    notes: {
      nl: 'Zelfde tipo-nummer, half de kracht. Dit is precies waarom "00" op zichzelf niets betekent voor brood.',
      en: 'Same tipo number, half the strength. Precisely why "00" on its own tells you nothing about bread.',
    },
  }),
  decl({
    slug: 'it-00-manitoba',
    name: 'Farina Manitoba tipo 0',
    country: 'IT', system: 'italian-tipo', designation: '0 Manitoba',
    protein: 15.0, proteinBasis: 'dry', ash: 0.6, W: 380, PL: 0.55,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'very-hard',
    sourceNote: DPR,
    availableIn: ['IT', 'DE', 'NL', 'BE'],
    notes: {
      nl: 'Noord-Amerikaans graan, Italiaanse maling. Voor panettone en alles wat 24 uur moet blijven staan zonder in te zakken.',
      en: 'North American grain, Italian milling. For panettone and anything that has to stand for 24 hours without collapsing.',
    },
  }),
  decl({
    slug: 'it-0',
    name: 'Farina tipo 0',
    country: 'IT', system: 'italian-tipo', designation: '0',
    protein: 12.0, proteinBasis: 'dry', ash: 0.65, W: 260,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: DPR,
    availableIn: ['IT', 'NL', 'DE'],
  }),
  decl({
    slug: 'it-1',
    name: 'Farina tipo 1',
    country: 'IT', system: 'italian-tipo', designation: '1',
    protein: 12.5, proteinBasis: 'dry', ash: 0.85, W: 240,
    species: 'wheat', wholegrain: 0.3, mill: 'stone', hardness: 'medium',
    sourceNote: DPR,
    availableIn: ['IT', 'NL', 'DE'],
    notes: {
      nl: 'Tipo 1 is de Italiaanse T80: half uitgemalen, vaak op steen, en veruit de smaakvolste enkele keuze voor desem.',
      en: 'Tipo 1 is Italy\'s T80: partly extracted, often stone-milled, and by far the most flavourful single choice for sourdough.',
    },
  }),
  decl({
    slug: 'it-2',
    name: 'Farina tipo 2',
    country: 'IT', system: 'italian-tipo', designation: '2',
    protein: 12.8, proteinBasis: 'dry', ash: 1.0,
    species: 'wheat', wholegrain: 0.55, mill: 'stone', hardness: 'medium',
    sourceNote: DPR,
    availableIn: ['IT'],
  }),
  decl({
    slug: 'it-integrale',
    name: 'Farina integrale',
    country: 'IT', system: 'italian-tipo', designation: 'integrale',
    protein: 13.0, proteinBasis: 'dry', ash: 1.7, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
    sourceNote: DPR,
    availableIn: ['IT', 'NL', 'DE'],
  }),
  decl({
    slug: 'it-semola-rimacinata',
    name: 'Semola di grano duro rimacinata',
    country: 'IT', system: 'italian-tipo', designation: 'rimacinata',
    protein: 13.5, proteinBasis: 'dry', ash: 0.9, W: 230,
    species: 'durum', wholegrain: 0.1, mill: 'roller', hardness: 'very-hard',
    sourceNote: 'Durumgriesmeel, twee keer gemalen. De basis van Pane di Altamura.',
    availableIn: ['IT', 'NL', 'BE', 'DE', 'FR', 'ES'],
    notes: {
      nl: 'Geel, korrelig, en het geeft een kruim die dagenlang zacht blijft. Durum neemt iets meer water op dan zachte tarwe maar rekt minder — verwacht een dichter, elastischer deeg.',
      en: 'Yellow, granular, and it gives a crumb that stays soft for days. Durum takes slightly more water than soft wheat but stretches less — expect a denser, more elastic dough.',
    },
  }),
  decl({
    slug: 'it-semola-integrale',
    name: 'Semola integrale di grano duro',
    country: 'IT', system: 'italian-tipo', designation: 'semola integrale',
    protein: 14.0, proteinBasis: 'dry', ash: 1.75,
    species: 'durum', wholegrain: 1, mill: 'stone', hardness: 'very-hard',
    sourceNote: 'Volkoren durum.',
    availableIn: ['IT'],
  }),
  decl({
    slug: 'it-farro-dicocco',
    name: 'Farina di farro dicocco (emmer)',
    country: 'IT', system: 'italian-tipo', designation: 'farro dicocco',
    protein: 14.5, proteinBasis: 'dry', ash: 1.7,
    species: 'emmer', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Emmer; in Italië verwarrend ook "farro" genoemd, net als spelt.',
    availableIn: ['IT', 'DE'],
  }),
  decl({
    slug: 'it-farro-spelta',
    name: 'Farina di farro spelta (spelt)',
    country: 'IT', system: 'italian-tipo', designation: 'farro spelta',
    protein: 13.5, proteinBasis: 'dry', ash: 0.9,
    species: 'spelt', wholegrain: 0.3, mill: 'stone', hardness: 'soft',
    availableIn: ['IT'],
  }),
  decl({
    slug: 'it-tipo-1-w300',
    name: 'Farina tipo 1 forte (W 300)',
    country: 'IT', system: 'italian-tipo', designation: '1 forte',
    protein: 14.0, proteinBasis: 'dry', ash: 0.85, W: 300, PL: 0.6,
    species: 'wheat', wholegrain: 0.3, mill: 'stone', hardness: 'hard',
    sourceNote: `${DPR} Sterke tipo 1 voor lange rijs met hoog volkorenaandeel.`,
    availableIn: ['IT'],
  }),
  decl({
    slug: 'it-segale-integrale',
    name: 'Farina di segale integrale',
    country: 'IT', system: 'italian-tipo', designation: 'segale integrale',
    protein: 9.0, proteinBasis: 'dry', ash: 1.8, fallingNumber: 200,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    availableIn: ['IT'],
  }),
  decl({
    slug: 'it-00-nuvola',
    name: 'Farina tipo 0 ad alta idratazione',
    country: 'IT', system: 'italian-tipo', designation: '0 alta idratazione',
    protein: 13.0, proteinBasis: 'dry', ash: 0.6, W: 300, PL: 0.5,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    sourceNote: `${DPR} Gericht op pizza's met een hoge, luchtige rand.`,
    availableIn: ['IT', 'NL', 'DE', 'UK'],
    notes: {
      nl: 'Lage P/L: extensibel eerder dan taai. Dat is wat een pizzarand luchtig maakt in plaats van rubberig.',
      en: 'Low P/L: extensible rather than tenacious. That is what makes a pizza rim airy rather than rubbery.',
    },
  }),
];
