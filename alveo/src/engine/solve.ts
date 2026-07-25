/**
 * Solving in any direction.
 *
 * Most calculators are one-directional: you type a flour weight and everything
 * else falls out. Real kitchens do not work that way. You have 143 g of
 * discard you refuse to throw out. You have exactly 380 g of the good flour
 * left. Your banneton is 24 cm. You want two loaves of 900 g.
 *
 * Every one of those reduces to "find the total flour weight", so that is the
 * single quantity this file solves for, from whichever end you happen to know.
 */

import { bannetonCapacity, tinCapacity } from './converters';
import { doughWeightPerFlourGram } from './formula';
import type { BlendProfile, Recipe } from './types';
import { clamp, round, safeDiv } from './util';

export type SolveFrom =
  | { kind: 'total-flour'; grams: number }
  | { kind: 'dough-weight'; grams: number }
  | { kind: 'yield'; pieces: number; gramsEach: number }
  | { kind: 'starter-on-hand'; grams: number; useAll?: boolean }
  | { kind: 'limiting-flour'; grams: number; fractionOfBlend: number }
  | { kind: 'banneton'; shape: 'round' | 'oval'; diameter?: number; length?: number; width?: number; height: number; pieces: number }
  | { kind: 'tin'; length: number; width: number; height: number; pieces: number };

export interface SolveResult {
  totalFlour: number;
  doughWeight: number;
  pieces: number;
  gramsEach: number;
  /** Prefermented flour %, which only moves in `use-all-the-starter` mode. */
  prefermentedFlour: number;
  note?: { nl: string; en: string };
  warnings: { nl: string; en: string }[];
}

/**
 * @param hydration the engine's resolved hydration, not the recipe's published
 *        one — the whole point is that they differ.
 */
export function solve(
  recipe: Recipe,
  hydration: number,
  from: SolveFrom,
): SolveResult {
  const perGram = doughWeightPerFlourGram(recipe, hydration);
  const warnings: { nl: string; en: string }[] = [];
  let totalFlour = 0;
  let prefermentedFlour = recipe.prefermentedFlour;
  let note: SolveResult['note'];
  let pieces = recipe.yield.pieces;

  switch (from.kind) {
    case 'total-flour':
      totalFlour = Math.max(0, from.grams);
      break;

    case 'dough-weight':
      totalFlour = safeDiv(Math.max(0, from.grams), perGram);
      break;

    case 'yield':
      pieces = Math.max(1, Math.round(from.pieces));
      totalFlour = safeDiv(pieces * Math.max(0, from.gramsEach), perGram);
      break;

    case 'starter-on-hand': {
      // The levain is prefermentedFlour% of total flour, plus its own water.
      const levainPerFlourGram = (recipe.prefermentedFlour / 100) * (1 + recipe.levain.hydration / 100);
      if (from.useAll) {
        // Keep the batch at the recipe's own size and move the inoculation
        // instead — this is "I refuse to throw this away", not "scale for me".
        const base = recipe.yield.pieces * recipe.yield.gramsEach;
        totalFlour = safeDiv(base, perGram);
        const levainFlour = Math.max(0, from.grams) / (1 + recipe.levain.hydration / 100);
        prefermentedFlour = round(clamp(safeDiv(levainFlour * 100, totalFlour), 0.5, 50), 2);
        note = {
          nl: `Alle ${round(from.grams, 0)} g desem gaat erin. Dat brengt je op ${prefermentedFlour}% voorgefermenteerde bloem in plaats van ${recipe.prefermentedFlour}% — de bulk wordt navenant korter en dat is hieronder al verrekend.`,
          en: `All ${round(from.grams, 0)} g of levain goes in. That puts you at ${prefermentedFlour}% prefermented flour instead of ${recipe.prefermentedFlour}% — bulk shortens accordingly and that is already accounted for below.`,
        };
        if (prefermentedFlour > 30) {
          warnings.push({
            nl: `${prefermentedFlour}% voorgefermenteerde bloem is veel. Reken op een uitgesproken zure smaak en een bulk die eerder klaar is dan je verwacht.`,
            en: `${prefermentedFlour}% prefermented flour is a lot. Expect a pronounced sour note and a bulk that finishes sooner than you expect.`,
          });
        }
      } else {
        totalFlour = safeDiv(Math.max(0, from.grams), levainPerFlourGram);
        note = {
          nl: `Geschaald op je ${round(from.grams, 0)} g desem, met de verhoudingen van het recept intact.`,
          en: `Scaled to your ${round(from.grams, 0)} g of levain, with the recipe's ratios left intact.`,
        };
      }
      break;
    }

    case 'limiting-flour': {
      const fraction = clamp(from.fractionOfBlend, 0.01, 1);
      totalFlour = safeDiv(Math.max(0, from.grams), fraction);
      note = {
        nl: `Je hebt ${round(from.grams, 0)} g van een bloem die ${Math.round(fraction * 100)}% van de mix is. Dat is de bovengrens: maximaal ${round(totalFlour, 0)} g bloem in totaal.`,
        en: `You have ${round(from.grams, 0)} g of a flour that makes up ${Math.round(fraction * 100)}% of the blend. That is the ceiling: ${round(totalFlour, 0)} g of flour in total, at most.`,
      };
      break;
    }

    case 'banneton': {
      pieces = Math.max(1, Math.round(from.pieces));
      const cap = bannetonCapacity(from.shape, {
        diameter: from.diameter,
        length: from.length,
        width: from.width,
        height: from.height,
      });
      totalFlour = safeDiv(cap.doughGrams * pieces, perGram);
      note = {
        nl: `Dit rijsmandje houdt ongeveer ${cap.volumeMl} ml, goed voor ${cap.doughGrams} g deeg (bruikbaar bereik ${cap.range[0]}–${cap.range[1]} g).`,
        en: `This banneton holds roughly ${cap.volumeMl} ml, good for ${cap.doughGrams} g of dough (usable range ${cap.range[0]}–${cap.range[1]} g).`,
      };
      break;
    }

    case 'tin': {
      pieces = Math.max(1, Math.round(from.pieces));
      const cap = tinCapacity({ length: from.length, width: from.width, height: from.height });
      totalFlour = safeDiv(cap.doughGrams * pieces, perGram);
      note = {
        nl: `Deze bakvorm is ${cap.volumeMl} ml, goed voor ${cap.doughGrams} g deeg. Meer erin betekent dat het over de rand loopt in de oven.`,
        en: `This tin is ${cap.volumeMl} ml, good for ${cap.doughGrams} g of dough. More than that and it climbs over the rim in the oven.`,
      };
      break;
    }
  }

  totalFlour = round(clamp(totalFlour, 0, 100_000), 0);
  const doughWeight = round(totalFlour * perGram, 0);

  if (totalFlour > 0 && totalFlour < 150) {
    warnings.push({
      nl: `Bij ${totalFlour} g bloem weegt het zout ${round((totalFlour * recipe.salt) / 100, 1)} g. Een keukenweegschaal met stappen van 1 g kan dat niet nauwkeurig af — gebruik een fijnere weegschaal of maak een grotere batch.`,
      en: `At ${totalFlour} g of flour the salt comes to ${round((totalFlour * recipe.salt) / 100, 1)} g. A 1 g kitchen scale cannot weigh that accurately — use a finer scale or make a bigger batch.`,
    });
  }

  return {
    totalFlour,
    doughWeight,
    pieces,
    gramsEach: round(safeDiv(doughWeight, pieces), 0),
    prefermentedFlour,
    note,
    warnings,
  };
}

/**
 * The largest batch a blend allows given what is physically on the shelf.
 * Returns the binding constraint, so the UI can say *which* bag runs out first
 * rather than just refusing.
 */
export function maxBatchFromShelf(
  blend: BlendProfile,
  available: Record<string, number>,
): { totalFlour: number; limitedBy: string | null } {
  let limit = Infinity;
  let limitedBy: string | null = null;

  for (const c of blend.components) {
    const have = available[c.flour.slug];
    if (typeof have !== 'number' || c.fraction <= 0) continue;
    const implied = have / c.fraction;
    if (implied < limit) {
      limit = implied;
      limitedBy = c.flour.slug;
    }
  }

  return {
    totalFlour: Number.isFinite(limit) ? round(limit, 0) : 0,
    limitedBy,
  };
}
