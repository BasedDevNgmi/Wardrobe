/**
 * Sourness as a dial.
 *
 * After "why is my loaf flat", the most-asked question in sourdough — and the
 * answers online are folklore. It is genuinely well-suited to a formula engine,
 * because every lever is already a field the recipe holds: levain hydration,
 * retard length and temperature, rye percentage, inoculation rate, dough
 * temperature, starter maintenance ratio.
 *
 * The dial does not just predict sourness; it *reconfigures the recipe* to hit
 * a target — same bread, different acid profile — and shows the lactic/acetic
 * split so "more sour" can mean the right kind of sour.
 */

import type { LocalisedText } from './stages';
import type { BlendProfile, Recipe } from './types';
import type { StarterProfile } from './starter';
import { clamp, round } from './util';

export type SournessTarget = 'mild' | 'balanced' | 'tangy' | 'sour' | 'very-sour';

export const SOURNESS_TARGETS: SournessTarget[] = ['mild', 'balanced', 'tangy', 'sour', 'very-sour'];

export const SOURNESS_LABELS: Record<SournessTarget, LocalisedText> = {
  mild: { nl: 'Mild', en: 'Mild' },
  balanced: { nl: 'Gebalanceerd', en: 'Balanced' },
  tangy: { nl: 'Friszuur', en: 'Tangy' },
  sour: { nl: 'Zuur', en: 'Sour' },
  'very-sour': { nl: 'Uitgesproken zuur', en: 'Pronounced sour' },
};

/** Target intensity on the 0–100 scale the starter model also speaks. */
const TARGET_INTENSITY: Record<SournessTarget, number> = {
  mild: 25,
  balanced: 45,
  tangy: 58,
  sour: 72,
  'very-sour': 88,
};

export interface AcidityProfile {
  /** 0–100, how much total acid the finished loaf will carry. */
  intensity: number;
  /** 0–1, share that is acetic (sharp) rather than lactic (round). */
  aceticShare: number;
}

export interface SournessAdjustment {
  key: string;
  label: LocalisedText;
  /** What to change, in prose the baker can act on. */
  action: LocalisedText;
  /** Direction, for the UI to render an arrow. */
  direction: 'up' | 'down';
}

export interface SournessPlan {
  target: SournessTarget;
  /** Where the recipe as written currently sits. */
  current: AcidityProfile;
  /** Where the target sits. */
  desired: AcidityProfile;
  adjustments: SournessAdjustment[];
  /** Prose explaining the lactic/acetic distinction for this plan. */
  explanation: LocalisedText;
}

/**
 * Predict the acidity of a recipe as written, given the blend and (optionally)
 * the reader's starter. This is the "current" reading the dial adjusts from.
 */
export function predictAcidity(
  recipe: Recipe,
  blend: BlendProfile,
  opts: { doughTemp: number; coldProofHours: number; starter?: StarterProfile },
): AcidityProfile {
  // Base intensity climbs with time (inoculation and retard) and with the
  // fermentation-friendly parts of the flour (rye, wholegrain).
  const inoculation = clamp(recipe.prefermentedFlour / 10, 0.3, 4);
  const retard = clamp(opts.coldProofHours / 14, 0, 2.5);

  let intensity = 30 + inoculation * 8 + retard * 10;
  intensity += blend.glutenPoorFraction * 20; // rye
  intensity += blend.branFraction * 60; // wholegrain
  if (opts.starter) intensity = intensity * 0.6 + opts.starter.acidIntensity * 0.4;
  intensity = round(clamp(intensity, 0, 100), 0);

  // Acetic share: stiff levain, cold retard and rye push acetic; warm bulk and
  // liquid levain push lactic.
  let acetic = 0.4;
  acetic += clamp((70 - recipe.levain.hydration) / 100, -0.2, 0.3);
  acetic += clamp((14 - opts.doughTemp) / 20, -0.2, 0.3) * 0.5;
  acetic += clamp(retard - 1, -0.3, 1) * 0.12;
  acetic += blend.glutenPoorFraction * 0.15;
  if (opts.starter) acetic = acetic * 0.6 + opts.starter.aceticShare * 0.4;
  const aceticShare = round(clamp(acetic, 0.1, 0.85), 3);

  return { intensity, aceticShare };
}

/**
 * Given a target, return the concrete changes that move the recipe there. The
 * adjustments are ordered by how much leverage each has, so a baker who only
 * changes one thing changes the most effective one.
 */
export function planSourness(
  target: SournessTarget,
  current: AcidityProfile,
): SournessPlan {
  const desiredIntensity = TARGET_INTENSITY[target];
  const delta = desiredIntensity - current.intensity;
  const wantMore = delta > 4;
  const wantLess = delta < -4;

  const adjustments: SournessAdjustment[] = [];

  if (wantMore) {
    adjustments.push(
      {
        key: 'retard',
        label: { nl: 'Koude rijs verlengen', en: 'Lengthen the cold proof' },
        action: {
          nl: 'Rek de koelkastrijs op naar 18–24 uur. Dit is de krachtigste knop: de bacteriën werken door terwijl de gist afremt, en dat is precies waar het zuur vandaan komt.',
          en: 'Extend the fridge proof to 18–24 hours. This is the most powerful lever: the bacteria keep working while the yeast slows, and that is exactly where the acid comes from.',
        },
        direction: 'up',
      },
      {
        key: 'stiff-levain',
        label: { nl: 'Stijvere desem', en: 'Stiffer levain' },
        action: {
          nl: 'Bouw de desem op 55–60% hydratatie in plaats van 100%. Stijf beperkt het water en stuurt de fermentatie richting azijnzuur — de scherpe kant van zuur.',
          en: 'Build the levain at 55–60% hydration instead of 100%. Stiff restricts water and steers fermentation towards acetic acid — the sharp side of sour.',
        },
        direction: 'up',
      },
      {
        key: 'inoculation',
        label: { nl: 'Meer desem', en: 'More levain' },
        action: {
          nl: 'Verhoog de voorgefermenteerde bloem met een derde. Meer starter betekent meer zuur bij de start en een kortere, intensere fermentatie.',
          en: 'Raise the prefermented flour by a third. More starter means more acid at the outset and a shorter, more intense ferment.',
        },
        direction: 'up',
      },
      {
        key: 'wholegrain',
        label: { nl: 'Meer volkoren of rogge', en: 'More wholegrain or rye' },
        action: {
          nl: 'Vervang 10% van de witte bloem door rogge of volkoren. De zemelen voeden de bacteriën en versnellen de verzuring merkbaar.',
          en: 'Swap 10% of the white flour for rye or wholemeal. The bran feeds the bacteria and speeds acidification noticeably.',
        },
        direction: 'up',
      },
    );
  } else if (wantLess) {
    adjustments.push(
      {
        key: 'short-retard',
        label: { nl: 'Koude rijs inkorten', en: 'Shorten the cold proof' },
        action: {
          nl: 'Beperk de koelkastrijs tot 8–12 uur, of bak op dezelfde dag zonder retard. Minder tijd in de koelkast is minder zuur, zonder aan smaakdiepte in te boeten.',
          en: 'Keep the fridge proof to 8–12 hours, or bake same-day with no retard. Less fridge time is less acid, without giving up flavour depth.',
        },
        direction: 'down',
      },
      {
        key: 'liquid-levain',
        label: { nl: 'Vloeibaardere desem', en: 'Wetter levain' },
        action: {
          nl: 'Houd de desem op 100% hydratatie of natter, en gebruik hem strak op de piek. Nat en jong stuurt richting melkzuur — de zachte, yoghurtachtige kant.',
          en: 'Keep the levain at 100% hydration or wetter, and use it right at peak. Wet and young steers towards lactic acid — the soft, yoghurt-like side.',
        },
        direction: 'down',
      },
      {
        key: 'warm-bulk',
        label: { nl: 'Warmer bulken', en: 'Warmer bulk' },
        action: {
          nl: 'Laat de bulk op 25–26 °C verlopen. Warm bevoordeelt de gist boven de azijnzuurbacteriën, dus je krijgt lift met minder scherpte.',
          en: 'Run the bulk at 25–26 °C. Warmth favours the yeast over the acetic bacteria, so you get lift with less sharpness.',
        },
        direction: 'down',
      },
      {
        key: 'less-inoculation',
        label: { nl: 'Minder desem', en: 'Less levain' },
        action: {
          nl: 'Verlaag de voorgefermenteerde bloem met een derde en verleng de bulk navenant. Minder starter, minder zuur bij de start.',
          en: 'Cut the prefermented flour by a third and lengthen the bulk to match. Less starter, less acid at the outset.',
        },
        direction: 'down',
      },
    );
  }

  const desiredAcetic = wantMore
    ? clamp(current.aceticShare + 0.12, 0.1, 0.85)
    : wantLess
      ? clamp(current.aceticShare - 0.12, 0.1, 0.85)
      : current.aceticShare;

  return {
    target,
    current,
    desired: { intensity: desiredIntensity, aceticShare: round(desiredAcetic, 3) },
    adjustments,
    explanation: explainAcid(target, wantMore, wantLess),
  };
}

function explainAcid(target: SournessTarget, more: boolean, less: boolean): LocalisedText {
  if (!more && !less) {
    return {
      nl: 'Het recept zit al ongeveer op dit niveau — er is weinig aan te passen. De lactische/azijnzuurbalans hieronder laat zien welke kant van "zuur" je krijgt.',
      en: 'The recipe already sits about here — little to adjust. The lactic/acetic balance below shows which side of "sour" you get.',
    };
  }
  return {
    nl: 'Zuur heeft twee smaken. Melkzuur is rond en yoghurtachtig; azijnzuur is scherp en prikkelend. Warm en nat fermenteren geeft melkzuur; koud, stijf en lang geeft azijnzuur. De aanpassingen hierboven verschuiven niet alleen hoevéél zuur je krijgt, maar ook wélk zuur — kies dus op basis van de smaak die je zoekt, niet alleen de intensiteit.',
    en: 'Sour has two flavours. Lactic acid is round and yoghurt-like; acetic acid is sharp and prickling. Warm, wet fermentation makes lactic; cold, stiff and long makes acetic. The adjustments above shift not only how much acid you get but which acid — so choose by the flavour you are after, not intensity alone.',
  };
}
