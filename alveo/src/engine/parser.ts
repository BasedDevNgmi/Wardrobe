/**
 * Any-recipe hydration parser.
 *
 * Paste the ingredient list of any recipe on the internet and get baker's
 * percentages back. Deliberately conservative: it flags what it could not
 * understand rather than guessing, because a parser that silently mislabels
 * 200 g of starter as flour produces a confidently wrong hydration figure.
 *
 * We parse only the ingredient list — quantities and ingredient names are
 * facts. We do not store, reproduce or process the method prose. See LEGAL.md.
 */

import { CUP_DENSITIES } from './converters';
import { round } from './util';

export type ParsedRole = 'flour' | 'water' | 'starter' | 'salt' | 'fat' | 'sugar' | 'dairy' | 'other';

export interface ParsedIngredient {
  raw: string;
  name: string;
  grams: number;
  role: ParsedRole;
  /** How the quantity was obtained. Volume conversions carry real error. */
  unit: 'g' | 'kg' | 'ml' | 'cup' | 'tbsp' | 'tsp' | 'oz' | 'lb' | 'unknown';
  confident: boolean;
}

export interface ParsedRecipe {
  ingredients: ParsedIngredient[];
  totalFlour: number;
  totalWater: number;
  hydration: number;
  saltPct: number;
  prefermentedFlourPct: number;
  /** Assumed starter hydration when the text does not say. */
  assumedStarterHydration: number;
  unparsed: string[];
  warnings: { nl: string; en: string }[];
}

const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1, gram: 1, grams: 1, gr: 1,
  kg: 1000, kilo: 1000, kilos: 1000,
  ml: 1, milliliter: 1, millilitre: 1,
  l: 1000, liter: 1000, litre: 1000,
  oz: 28.35, ounce: 28.35, ounces: 28.35,
  lb: 453.6, lbs: 453.6, pound: 453.6, pounds: 453.6,
};

const TBSP_GRAMS: Record<ParsedRole, number> = {
  flour: 8, water: 15, starter: 16, salt: 18, fat: 14, sugar: 12.5, dairy: 15, other: 10,
};
const TSP_GRAMS: Record<ParsedRole, number> = {
  flour: 2.6, water: 5, starter: 5.3, salt: 6, fat: 4.7, sugar: 4.2, dairy: 5, other: 3.3,
};

const ROLE_PATTERNS: { role: ParsedRole; patterns: RegExp[] }[] = [
  {
    role: 'starter',
    patterns: [/\b(starter|levain|desem|zuurdesem|poolish|biga|sourdough starter|moederdeeg|lievito)\b/i],
  },
  {
    role: 'flour',
    patterns: [
      /\b(flour|meel|bloem|farine|mehl|farina|harina|semola|semolina|rye|rogge|seigle|roggen|spelt|dinkel|épeautre|einkorn|emmer|khorasan|kamut|durum|volkoren|wholemeal|wholewheat|whole wheat|patentbloem|tarwebloem|tipo|manitoba)\b/i,
    ],
  },
  { role: 'water', patterns: [/\b(water|eau|wasser|acqua|agua)\b/i] },
  { role: 'salt', patterns: [/\b(salt|zout|sel|salz|sale|sal)\b/i] },
  { role: 'fat', patterns: [/\b(oil|olie|olive oil|butter|boter|beurre|burro|lard|shortening)\b/i] },
  { role: 'sugar', patterns: [/\b(sugar|suiker|honey|honing|molasses|malt|syrup|stroop|zucchero|azúcar)\b/i] },
  { role: 'dairy', patterns: [/\b(milk|melk|lait|milch|latte|yog|yoghurt|yogurt|buttermilk|karnemelk|cream|room|slagroom)\b/i] },
];

function classify(name: string): ParsedRole {
  for (const { role, patterns } of ROLE_PATTERNS) {
    if (patterns.some((p) => p.test(name))) return role;
  }
  return 'other';
}

const FRACTIONS: Record<string, number> = {
  '½': 0.5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 0.25, '¾': 0.75,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

function parseQuantity(text: string): number | null {
  // "1 1/2", "1½", "0.75", "1,5"
  const cleaned = text.replace(/[½⅓⅔¼¾⅛⅜⅝⅞]/g, (m) => ` ${FRACTIONS[m]}`);
  const mixed = cleaned.match(/(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = cleaned.match(/(\d+)\s*\/\s*(\d+)/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const decimals = cleaned.match(/(\d+(?:[.,]\d+)?)(?:\s+(\d*\.?\d+))?/);
  if (!decimals) return null;
  const first = Number(String(decimals[1]).replace(',', '.'));
  const second = decimals[2] ? Number(decimals[2]) : 0;
  const total = first + (second < 1 ? second : 0);
  return Number.isFinite(total) ? total : null;
}

function cupGramsFor(role: ParsedRole, name: string): number {
  const lower = name.toLowerCase();
  if (role === 'flour') {
    if (/whole|volkoren|wholemeal/.test(lower)) return 120;
    if (/rye|rogge|seigle/.test(lower)) return 102;
    if (/bread|strong|sterke/.test(lower)) return 130;
    return 125;
  }
  const d = CUP_DENSITIES.find((c) =>
    role === 'water' ? c.key === 'water'
      : role === 'sugar' ? c.key === 'sugar'
      : role === 'dairy' ? c.key === 'milk'
      : role === 'starter' ? c.key === 'starter'
      : role === 'salt' ? c.key === 'salt-fine'
      : role === 'fat' ? c.key === 'butter'
      : false,
  );
  return d?.gramsPerCup ?? 200;
}

export function parseIngredientLine(line: string): ParsedIngredient | null {
  const raw = line.trim();
  if (raw.length < 2) return null;
  // Strip leading list markers.
  const text = raw.replace(/^[-*••\d.)\s]+/, '').trim();
  if (!text) return null;

  const qty = parseQuantity(text);
  if (qty === null) return null;

  const unitMatch = text.match(
    /\b(kg|kilo(?:s)?|g|gr|gram(?:s)?|ml|milli(?:liter|litre)|l|liter|litre|cups?|c\b|tablespoons?|tbsp|el\b|tablespoon|teaspoons?|tsp|tl\b|oz|ounces?|lbs?|pounds?)\b/i,
  );
  const unitRaw = (unitMatch?.[1] ?? '').toLowerCase();

  const name = text
    .replace(/\d+(?:[.,]\d+)?/g, ' ')
    .replace(/[½⅓⅔¼¾⅛⅜⅝⅞]/g, ' ')
    .replace(
      /\b(kg|kilo(?:s)?|g|gr|gram(?:s)?|ml|milli(?:liter|litre)|l|liter|litre|cups?|c|tablespoons?|tbsp|el|teaspoons?|tsp|tl|oz|ounces?|lbs?|pounds?)\b/gi,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.\-–—/]+|[\s,.\-–—/]+$/g, '')
    .trim();

  if (!name) return null;
  const role = classify(name);

  let grams: number;
  let unit: ParsedIngredient['unit'] = 'unknown';
  let confident = true;

  if (unitRaw in UNIT_TO_GRAMS) {
    grams = qty * (UNIT_TO_GRAMS[unitRaw] as number);
    unit = unitRaw.startsWith('kg') || unitRaw.startsWith('kilo') ? 'kg'
      : unitRaw.startsWith('ml') || unitRaw === 'l' ? 'ml'
      : unitRaw.startsWith('oz') || unitRaw.startsWith('ounce') ? 'oz'
      : unitRaw.startsWith('lb') || unitRaw.startsWith('pound') ? 'lb'
      : 'g';
  } else if (/^cups?$|^c$/.test(unitRaw)) {
    grams = qty * cupGramsFor(role, name);
    unit = 'cup';
    confident = false;
  } else if (/tbsp|tablespoon|^el$/.test(unitRaw)) {
    grams = qty * TBSP_GRAMS[role];
    unit = 'tbsp';
    confident = false;
  } else if (/tsp|teaspoon|^tl$/.test(unitRaw)) {
    grams = qty * TSP_GRAMS[role];
    unit = 'tsp';
    confident = false;
  } else {
    // A bare number next to a flour name is almost always grams.
    grams = qty;
    unit = 'unknown';
    confident = qty >= 10;
  }

  return { raw, name, grams: round(grams, 1), role, unit, confident };
}

export function parseRecipeText(
  text: string,
  opts: { starterHydration?: number } = {},
): ParsedRecipe {
  const assumedStarterHydration = opts.starterHydration ?? 100;
  const lines = text.split(/\r?\n/);
  const ingredients: ParsedIngredient[] = [];
  const unparsed: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parsed = parseIngredientLine(trimmed);
    if (parsed && parsed.grams > 0) ingredients.push(parsed);
    else if (/\d/.test(trimmed)) unparsed.push(trimmed);
  }

  const flourDirect = ingredients
    .filter((i) => i.role === 'flour')
    .reduce((s, i) => s + i.grams, 0);
  const waterDirect = ingredients
    .filter((i) => i.role === 'water')
    .reduce((s, i) => s + i.grams, 0);
  const starterTotal = ingredients
    .filter((i) => i.role === 'starter')
    .reduce((s, i) => s + i.grams, 0);
  const saltTotal = ingredients
    .filter((i) => i.role === 'salt')
    .reduce((s, i) => s + i.grams, 0);

  const starterFlour = starterTotal / (1 + assumedStarterHydration / 100);
  const starterWater = starterTotal - starterFlour;

  const totalFlour = round(flourDirect + starterFlour, 1);
  const totalWater = round(waterDirect + starterWater, 1);

  const warnings: { nl: string; en: string }[] = [];

  if (totalFlour <= 0) {
    warnings.push({
      nl: 'Geen bloem herkend. Zonder bloemgewicht is er geen bakkerspercentage te berekenen.',
      en: 'No flour recognised. Without a flour weight there is no baker’s percentage to compute.',
    });
  }
  if (starterTotal > 0) {
    warnings.push({
      nl: `Er is aangenomen dat de desem op ${assumedStarterHydration}% hydratatie zit. Klopt dat niet, dan schuift de hydratatie ongeveer een punt per 20% verschil.`,
      en: `The starter was assumed to be at ${assumedStarterHydration}% hydration. If that is wrong, the hydration shifts roughly one point per 20% of difference.`,
    });
  }
  if (ingredients.some((i) => i.unit === 'cup')) {
    warnings.push({
      nl: 'Er staan koppen in dit recept. Een kop bloem varieert ±20% — het percentage hieronder heeft dus een echte foutmarge, geen decimale precisie.',
      en: 'This recipe uses cups. A cup of flour varies by ±20% — the percentage below carries a real error bar, not decimal precision.',
    });
  }
  if (unparsed.length > 0) {
    warnings.push({
      nl: `${unparsed.length} regel${unparsed.length === 1 ? '' : 's'} met een getal is niet herkend en is genegeerd in plaats van geraden.`,
      en: `${unparsed.length} line${unparsed.length === 1 ? '' : 's'} containing a number could not be recognised and was ignored rather than guessed at.`,
    });
  }

  return {
    ingredients,
    totalFlour,
    totalWater,
    hydration: totalFlour > 0 ? round((totalWater / totalFlour) * 100, 1) : 0,
    saltPct: totalFlour > 0 ? round((saltTotal / totalFlour) * 100, 2) : 0,
    prefermentedFlourPct: totalFlour > 0 ? round((starterFlour / totalFlour) * 100, 2) : 0,
    assumedStarterHydration,
    unparsed,
    warnings,
  };
}
