import { decl, type FlourDecl } from './_types';

/**
 * France. The T-number is the ash content in mg per 100 g of dry matter: T65
 * means 0.62–0.75% ash. It says how much of the kernel is in the bag. It says
 * nothing whatsoever about protein or strength, which is the single most
 * expensive misunderstanding in the English-language baking internet.
 *
 * French millers quote protein on a dry-matter basis. Every figure below is
 * stored on that basis and normalised by the engine.
 */

const STANDARD = 'Aswaarde wettelijk vastgelegd (décret 63-720); eiwit is een typische waarde voor deze klasse.';

export const FR_FLOURS: FlourDecl[] = [
  decl({
    slug: 'fr-t45',
    name: 'Farine T45',
    country: 'FR', system: 'french-T', designation: 'T45',
    protein: 11.2, proteinBasis: 'dry', ash: 0.45, extraction: 67,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'soft',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE', 'NL'],
    notes: {
      nl: 'Patisseriebloem. Fijn gemalen, weinig as, zacht. Voor brood te slap tenzij je hem mengt.',
      en: 'Pastry flour. Finely milled, low ash, soft. Too slack for bread unless you blend it.',
    },
  }),
  decl({
    slug: 'fr-t55',
    name: 'Farine T55',
    country: 'FR', system: 'french-T', designation: 'T55',
    protein: 11.7, proteinBasis: 'dry', ash: 0.55, extraction: 72,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'medium',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE', 'NL', 'ES'],
    notes: {
      nl: 'De standaard witte bloem van Frankrijk. Voor pizza, croissants en licht brood.',
      en: 'The default white flour of France. For pizza, croissants and light bread.',
    },
  }),
  decl({
    slug: 'fr-t65',
    name: 'Farine T65',
    country: 'FR', system: 'french-T', designation: 'T65',
    protein: 12.2, proteinBasis: 'dry', ash: 0.68, extraction: 78,
    species: 'wheat', wholegrain: 0.05, mill: 'roller', hardness: 'medium',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE', 'NL', 'DE'],
    notes: {
      nl: 'Het broodmeel van Frankrijk en de referentie voor stokbrood. Merkbaar zwakker dan Amerikaanse bread flour — dat is geen gebrek, dat is het punt.',
      en: 'France\'s bread flour and the reference for baguettes. Noticeably weaker than American bread flour — not a defect, that is the point.',
    },
  }),
  decl({
    slug: 'fr-t65-tradition',
    name: 'Farine de tradition française T65',
    country: 'FR', system: 'french-T', designation: 'T65 tradition',
    protein: 12.0, proteinBasis: 'dry', ash: 0.68, extraction: 78,
    species: 'wheat', wholegrain: 0.05, mill: 'roller', hardness: 'medium',
    additives: ['fava', 'malted-barley'],
    sourceNote: 'Décret pain de tradition française: geen toegestane additieven behalve bonenmeel, sojameel en gluten binnen limieten; geen ascorbinezuur.',
    availableIn: ['FR', 'BE'],
    notes: {
      nl: 'Wettelijk beschermd: geen ascorbinezuur, geen enzymen buiten de toegestane lijst. Fermenteert trager en smaakt meer.',
      en: 'Legally protected: no ascorbic acid, no enzymes beyond the permitted list. Ferments slower and tastes of more.',
    },
  }),
  decl({
    slug: 'fr-t80',
    name: 'Farine T80 (bise)',
    country: 'FR', system: 'french-T', designation: 'T80',
    protein: 12.5, proteinBasis: 'dry', ash: 0.85, extraction: 82,
    species: 'wheat', wholegrain: 0.25, mill: 'stone', hardness: 'medium',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE', 'NL'],
    notes: {
      nl: 'Halfvolkoren, vaak op steen gemalen. De beste enkele bloem als je maar één zak wilt kopen.',
      en: 'Semi-wholemeal, often stone-milled. The best single flour if you only want to buy one bag.',
    },
  }),
  decl({
    slug: 'fr-t110',
    name: 'Farine T110 (semi-complète)',
    country: 'FR', system: 'french-T', designation: 'T110',
    protein: 12.7, proteinBasis: 'dry', ash: 1.15, extraction: 88,
    species: 'wheat', wholegrain: 0.6, mill: 'stone', hardness: 'medium',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE'],
  }),
  decl({
    slug: 'fr-t150',
    name: 'Farine T150 (intégrale)',
    country: 'FR', system: 'french-T', designation: 'T150',
    protein: 13.2, proteinBasis: 'dry', ash: 1.6, extraction: 100,
    species: 'wheat', wholegrain: 1, mill: 'stone', hardness: 'medium',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE', 'NL'],
  }),
  decl({
    slug: 'fr-meule-t80',
    name: 'Farine de meule T80',
    country: 'FR', system: 'french-T', designation: 'T80 meule',
    protein: 12.2, proteinBasis: 'dry', ash: 0.88, extraction: 83,
    species: 'wheat', wholegrain: 0.3, mill: 'stone', hardness: 'soft',
    sourceNote: 'Steengemalen boerenmeel; waarden variëren sterk per molen en oogst.',
    availableIn: ['FR'],
    notes: {
      nl: 'Steenmaling beschadigt veel minder zetmeel dan een walsmolen. Dat scheelt makkelijk drie punten hydratatie ten opzichte van hetzelfde graan industrieel gemalen.',
      en: 'Stone milling damages far less starch than a roller mill. That is easily three hydration points against the same grain milled industrially.',
    },
  }),
  decl({
    slug: 'fr-gruau-t45',
    name: 'Farine de gruau T45',
    country: 'FR', system: 'french-T', designation: 'T45 gruau',
    protein: 13.0, proteinBasis: 'dry', ash: 0.45, extraction: 67, W: 300,
    species: 'wheat', wholegrain: 0, mill: 'roller', hardness: 'hard',
    sourceNote: 'Gruau = uit harde tarwe, hoger eiwit bij lage as. W-waarde typisch 280–330.',
    availableIn: ['FR', 'BE'],
    notes: {
      nl: 'Sterke bloem met lage as: voor brioche, croissants en alles wat vet en suiker moet dragen.',
      en: 'Strong flour at low ash: for brioche, croissants and anything that has to carry fat and sugar.',
    },
  }),
  decl({
    slug: 'fr-seigle-t85',
    name: 'Farine de seigle T85',
    country: 'FR', system: 'french-T', designation: 'T85 seigle',
    protein: 8.5, proteinBasis: 'dry', ash: 0.9,
    species: 'rye', wholegrain: 0.3, mill: 'roller', hardness: 'soft',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE'],
  }),
  decl({
    slug: 'fr-seigle-t130',
    name: 'Farine de seigle T130',
    country: 'FR', system: 'french-T', designation: 'T130 seigle',
    protein: 9.0, proteinBasis: 'dry', ash: 1.35,
    species: 'rye', wholegrain: 0.7, mill: 'stone', hardness: 'soft',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE'],
    notes: {
      nl: 'De klassieke rogge voor pain de campagne. 10–20% is genoeg om het brood volledig te veranderen.',
      en: 'The classic rye for pain de campagne. 10–20% is enough to change the loaf completely.',
    },
  }),
  decl({
    slug: 'fr-seigle-t170',
    name: 'Farine de seigle T170 (intégrale)',
    country: 'FR', system: 'french-T', designation: 'T170 seigle',
    protein: 9.5, proteinBasis: 'dry', ash: 1.8, fallingNumber: 200,
    species: 'rye', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: STANDARD,
    availableIn: ['FR', 'BE'],
  }),
  decl({
    slug: 'fr-grand-epeautre',
    name: 'Farine de grand épeautre T80',
    country: 'FR', system: 'french-T', designation: 'T80 épeautre',
    protein: 13.0, proteinBasis: 'dry', ash: 0.85,
    species: 'spelt', wholegrain: 0.25, mill: 'stone', hardness: 'soft',
    sourceNote: 'Spelt; eiwitgehalte is hoog maar het gluten is oplosbaarder dan bij tarwe.',
    availableIn: ['FR', 'BE', 'DE'],
    notes: {
      nl: 'Hoog eiwit, lage sterkte. Dat lijkt tegenstrijdig tot je het deeg voelt: spelt rekt en scheurt in plaats van terug te veren.',
      en: 'High protein, low strength. That looks contradictory until you feel the dough: spelt stretches and tears rather than springing back.',
    },
  }),
  decl({
    slug: 'fr-petit-epeautre',
    name: 'Farine de petit épeautre (engrain)',
    country: 'FR', system: 'french-T', designation: 'engrain',
    protein: 14.5, proteinBasis: 'dry', ash: 1.4,
    species: 'einkorn', wholegrain: 0.9, mill: 'stone', hardness: 'soft',
    sourceNote: 'Einkorn uit de Haute-Provence; eiwit hoog, glutenkwaliteit zeer laag.',
    availableIn: ['FR'],
    notes: {
      nl: 'Einkorn neemt fors minder water op en houdt bijna geen vorm. Boven 30% in de mix heb je een busvorm nodig.',
      en: 'Einkorn takes up markedly less water and holds almost no shape. Above 30% of the blend you need a tin.',
    },
  }),
  decl({
    slug: 'fr-sarrasin',
    name: 'Farine de sarrasin',
    country: 'FR', system: 'french-T', designation: 'sarrasin',
    protein: 12.0, proteinBasis: 'dry', ash: 1.8,
    species: 'buckwheat', wholegrain: 1, mill: 'stone', hardness: 'soft',
    sourceNote: 'Boekweit is geen graan en vormt geen gluten.',
    availableIn: ['FR', 'BE', 'NL'],
  }),
  decl({
    slug: 'fr-t55-bio-moulin',
    name: 'Farine T55 bio (moulin artisanal)',
    country: 'FR', system: 'french-T', designation: 'T55 bio',
    protein: 11.2, proteinBasis: 'dry', ash: 0.55, extraction: 72,
    species: 'wheat', wholegrain: 0, mill: 'stone', hardness: 'soft',
    sourceNote: 'Ambachtelijke biologische molen; geen additieven toegestaan onder EU-bio.',
    availableIn: ['FR'],
  }),
  decl({
    slug: 'fr-t65-bio-meule',
    name: 'Farine T65 bio de meule',
    country: 'FR', system: 'french-T', designation: 'T65 bio meule',
    protein: 11.7, proteinBasis: 'dry', ash: 0.7, extraction: 79,
    species: 'wheat', wholegrain: 0.08, mill: 'stone', hardness: 'soft',
    sourceNote: 'Biologisch, steengemalen. Lager beschadigd zetmeel dan de industriële T65.',
    availableIn: ['FR', 'BE'],
  }),
  decl({
    slug: 'fr-blé-dur-semoule',
    name: 'Semoule de blé dur fine',
    country: 'FR', system: 'french-T', designation: 'semoule fine',
    protein: 13.0, proteinBasis: 'dry', ash: 0.9,
    species: 'durum', wholegrain: 0.1, mill: 'roller', hardness: 'very-hard',
    sourceNote: 'Durumgriesmeel; zeer hard graan, grover gemalen.',
    availableIn: ['FR', 'IT', 'ES'],
  }),
];
