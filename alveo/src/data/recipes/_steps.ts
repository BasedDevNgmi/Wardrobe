/**
 * The shared step library.
 *
 * Every word of method prose on this site is written originally. Formulas —
 * percentages, times, temperatures — are facts and are not copyrightable; the
 * instructional prose around them is, so none of it is paraphrased from a
 * published source. See LEGAL.md.
 *
 * Writing the common steps once, properly, and specialising them per bread is
 * also the only way per-method prose stays maintainable: a stand mixer changes
 * what you *do*, not just how long it takes, so the mixing and folding steps
 * carry real variants rather than a swapped verb.
 */

import type { IngredientKey, RecipeStep } from '@/engine/types';

type Prose = { nl: string; en: string };

export interface StepOverrides {
  title?: Prose;
  body?: RecipeStep['body'];
  baseMinutes?: number;
  reveals?: IngredientKey[];
}

function step(base: RecipeStep, o?: StepOverrides): RecipeStep {
  return { ...base, ...o };
}

/* ------------------------------------------------------------------ */
/* Levain                                                              */
/* ------------------------------------------------------------------ */

export const levainStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'levain',
      kind: 'levain',
      title: { nl: 'Desem opbouwen', en: 'Build the levain' },
      reveals: ['levain'],
      body: {
        nl: 'Meng de starter, het meel en het water in een pot met rechte wanden en zet er een elastiekje omheen op het beginniveau. Je hebt de desem nodig op het moment dat hij op zijn hoogst staat en net begint af te vlakken — koepelvormig bovenop, luchtbellen zichtbaar langs de zijkant, en een geur die scherp is maar nog niet azijnachtig. Een desem die alweer is ingezakt werkt ook, maar geeft een zuurder brood en minder lift.',
        en: 'Mix the starter, flour and water in a straight-sided jar and put an elastic band round it at the starting level. You want the levain at its peak, just as the rise begins to flatten — domed on top, bubbles visible down the side, and a smell that is sharp but not yet vinegary. A levain that has already collapsed still works, but gives a sourer loaf and less lift.',
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Soaker                                                              */
/* ------------------------------------------------------------------ */

export const soakerStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'soaker',
      kind: 'soaker',
      title: { nl: 'Weekmassa aanzetten', en: 'Start the soaker' },
      baseMinutes: 10,
      body: {
        nl: 'Overgiet de granen met kokend water, roer één keer door en dek af. Laat staan tot ze koud zijn — minstens vier uur, een nacht is beter. Dit is geen optionele stap: droge granen die je rechtstreeks in het deeg gooit trekken hun water later alsnog, en dan uit je kruim.',
        en: 'Pour boiling water over the grains, stir once and cover. Leave until cold — four hours minimum, overnight is better. This is not an optional step: dry grains thrown straight into the dough take their water later regardless, and they take it from your crumb.',
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Autolyse                                                            */
/* ------------------------------------------------------------------ */

export const autolyseStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'autolyse',
      kind: 'autolyse',
      title: { nl: 'Autolyse', en: 'Autolyse' },
      baseMinutes: 45,
      reveals: ['flourTotal', 'waterMix'],
      body: {
        default: {
          nl: 'Meng het meel en het water tot er geen droog poeder meer over is. Meer hoef je niet te doen: kneden is hier zinloos, want het enige wat moet gebeuren is dat de eiwitten water opnemen. Dek af en laat staan. Het deeg is daarna zichtbaar gladder en rekt verder voordat het scheurt.',
          en: 'Mix the flour and water until no dry powder remains. That is all: kneading here achieves nothing, because the only thing that needs to happen is the proteins taking up water. Cover and leave. Afterwards the dough is visibly smoother and stretches further before it tears.',
        },
        'stand-mixer': {
          nl: 'Meng meel en water op de laagste stand tot er geen droog poeder meer is — dertig tot zestig seconden, niet langer. Zet de machine daarna uit en laat de kom staan. De autolyse doet zijn werk in rust; blijven draaien voegt hier niets toe en warmt het deeg alleen op.',
          en: 'Mix flour and water on the lowest setting until no dry powder remains — thirty to sixty seconds, no longer. Then switch off and leave the bowl. The autolyse does its work at rest; running on adds nothing here and only warms the dough.',
        },
        'food-processor': {
          nl: 'Twee of drie korte pulsen tot alles nat is, dan de kom eruit en laten rusten. Een keukenmachine werkt zo snel dat je de autolyse eerder voorbij bent dan begonnen — pulsen, niet draaien.',
          en: 'Two or three short pulses until everything is wet, then take the bowl out and let it rest. A food processor works so fast you will be past the autolyse before you have started it — pulse, do not run.',
        },
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Mix                                                                 */
/* ------------------------------------------------------------------ */

export const mixStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'mix',
      kind: 'mix',
      title: { nl: 'Eindmix', en: 'Final mix' },
      baseMinutes: 10,
      reveals: ['levain', 'salt', 'waterMix'],
      body: {
        default: {
          nl: 'Voeg de desem toe en knijp hem met natte handen door het deeg tot je geen strengen meer ziet. Strooi dan het zout erover, knijp opnieuw door en vouw het deeg een paar keer over zichzelf. Het voelt eerst rommelig en gescheurd; binnen een minuut of twee komt het samen.',
          en: 'Add the levain and pinch it through the dough with wet hands until you can no longer see streaks. Then scatter the salt over, pinch through again and fold the dough over itself a few times. It feels ragged and torn at first; within a minute or two it comes together.',
        },
        'stand-mixer': {
          nl: 'Desem en zout erbij, dan stand 1 tot alles is opgenomen en daarna stand 2. Stop zodra het deeg van de wand loslaat en een vliesje trekt dat je tegen het licht kunt houden. Dat moment komt eerder dan de klok zegt — kijk naar het deeg, niet naar de timer, en zet de machine uit zodra het glanst en samenhangt.',
          en: 'Levain and salt in, then speed 1 until everything is taken up, and speed 2 after that. Stop the moment the dough clears the side of the bowl and pulls a windowpane you can hold up to the light. That moment arrives sooner than the clock says — watch the dough, not the timer, and switch off as soon as it turns glossy and holds together.',
        },
        spiral: {
          nl: 'Desem en zout erbij op de eerste versnelling. Een spiraalkneder werkt veel efficiënter dan een standmixer, dus reken op minder tijd en houd de deegtemperatuur in de gaten: deze machines voegen zes tot negen graden toe.',
          en: 'Levain and salt in on first gear. A spiral mixer works far more efficiently than a planetary one, so expect less time and keep an eye on the dough temperature: these machines add six to nine degrees.',
        },
        'food-processor': {
          nl: 'Desem en zout erbij, dan pulsen van vijf seconden met pauzes ertussen. Een keukenmachine kneedt agressief en warmt snel op; voel na elke puls of het deeg nog koel is. Bij twijfel stop je te vroeg in plaats van te laat.',
          en: 'Levain and salt in, then five-second pulses with pauses between. A food processor kneads aggressively and heats fast; feel after each pulse whether the dough is still cool. When in doubt, stop early rather than late.',
        },
        'bread-machine': {
          nl: 'Alles in de kuip, deegprogramma starten en het na de kneedfase afbreken — de rijsfase van de machine wil je niet, want die is voor gist en niet voor desem. Haal het deeg eruit zodra het glad is.',
          en: 'Everything into the pan, start the dough programme and stop it after the kneading phase — you do not want the machine\'s rise, which is built for yeast and not for levain. Take the dough out as soon as it is smooth.',
        },
        'no-knead': {
          nl: 'Desem en zout erbij en meng met een lepel tot alles nat is. Verder niets. Bij deze methode doet de tijd het werk dat je handen anders zouden doen, en elke extra bewerking is verspilde moeite.',
          en: 'Levain and salt in, and mix with a spoon until everything is wet. Nothing further. With this method time does the work your hands would otherwise do, and every extra manipulation is wasted effort.',
        },
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Bassinage                                                           */
/* ------------------------------------------------------------------ */

export const bassinageStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'bassinage',
      kind: 'bassinage',
      title: { nl: 'Bassinage', en: 'Bassinage' },
      baseMinutes: 5,
      reveals: ['waterBassinage'],
      body: {
        default: {
          nl: 'Giet het achtergehouden water erbij en knijp het erdoor. Het deeg valt uit elkaar en ziet er even hopeloos uit; blijf knijpen en vouwen tot het weer één geheel is. Komt het niet terug, stop dan en houd de rest van het water achter — dat is geen mislukking maar informatie over jouw meel.',
          en: 'Pour in the held-back water and pinch it through. The dough falls apart and looks briefly hopeless; keep pinching and folding until it is one mass again. If it does not come back, stop and keep the rest of the water — that is not a failure, it is information about your flour.',
        },
        'stand-mixer': {
          nl: 'Water er in een dun straaltje bij op stand 1, terwijl de machine draait. In één keer erbij gooien laat het deeg uit elkaar vallen en het duurt dan lang voordat het weer sluit.',
          en: 'Add the water in a thin stream on speed 1 while the machine runs. Tipping it in at once breaks the dough apart and it takes a long time to come back together.',
        },
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Bulk and folds                                                      */
/* ------------------------------------------------------------------ */

export const bulkStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'bulk',
      kind: 'bulk',
      title: { nl: 'Bulkrijs', en: 'Bulk fermentation' },
      body: {
        nl: 'Dit is de stap die het brood maakt, en de enige waarbij de klok minder waard is dan je ogen. Zoek naar een deeg dat merkbaar in volume is toegenomen, dat koepelt in plaats van vlak te liggen, met bellen aan de rand en een oppervlak dat glanst. Het moet trillen als je de bak beweegt. Ruikt het scherp zuur en zakt het in als je het aanraakt, dan ben je te ver — bak het toch, en houd de volgende keer een uur eerder op.',
        en: 'This is the step that makes the bread, and the only one where the clock is worth less than your eyes. Look for a dough that has visibly grown, that domes rather than lying flat, with bubbles at the edge and a surface that shines. It should wobble when you move the tub. If it smells sharply sour and sinks when you touch it, you have gone too far — bake it anyway, and stop an hour earlier next time.',
      },
    },
    o,
  );

export const foldStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'folds',
      kind: 'fold',
      title: { nl: 'Vouwen', en: 'Folds' },
      skipForMethods: ['bread-machine'],
      body: {
        default: {
          nl: 'Het schema hierboven zegt hoeveel vouwsets je doet en op welk moment. Het type vouw is bepaald door de sterkte van jouw meelmix, niet door gewoonte: een sterk deeg verdraagt slap-and-fold, een middelmatig deeg wil coil folds, en een zwak deeg krijgt alleen bowl folds. Vouw met natte handen en stop zodra je weerstand voelt — spanning opbouwen is het doel, scheuren is het tegenovergestelde.',
          en: 'The schedule above says how many fold sets to do and when. The type of fold is set by the strength of your blend, not by habit: a strong dough survives slap-and-fold, a middling one wants coil folds, and a weak one gets bowl folds only. Fold with wet hands and stop as soon as you feel resistance — building tension is the aim, tearing is its opposite.',
        },
        'stand-mixer': {
          nl: 'Fors minder vouwen dan bij handmatig mengen: de machine heeft het glutenwerk al gedaan. Wat overblijft is één of twee rondes om het deeg te ontgassen en de temperatuur gelijk te trekken, niet om structuur op te bouwen die er al is.',
          en: 'Far fewer folds than with hand mixing: the machine has already done the gluten work. What remains is one or two rounds to degas the dough and even out its temperature, not to build structure that already exists.',
        },
        spiral: {
          nl: 'Eén vouwset is meestal genoeg. Een spiraalkneder ontwikkelt het deeg volledig, dus vouwen dient hier alleen nog om de bulk gelijkmatig te houden.',
          en: 'One fold set is usually enough. A spiral mixer develops the dough fully, so folding now serves only to keep the bulk even.',
        },
        'no-knead': {
          nl: 'Bij deze methode zijn de vouwen het enige moment waarop je het deeg aanraakt, dus doe ze rustig en volledig. Vier kanten optillen en overvouwen is één set.',
          en: 'With this method the folds are the only time you touch the dough, so do them calmly and completely. Lifting and folding over all four sides is one set.',
        },
      },
    },
    o,
  );

export const laminationStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'lamination',
      kind: 'lamination',
      title: { nl: 'Lamineren', en: 'Laminate' },
      baseMinutes: 10,
      body: {
        nl: 'Maak het werkblad nat — nat, niet bebloemd — en trek het deeg voorzichtig uit tot een rechthoek die je bijna doorzichtig kunt zien. Verdeel de toevoegingen gelijkmatig en rol het op als een brief. Eén keer goed doen is beter dan drie keer voorzichtig: hoe langer je eraan trekt, hoe meer je het vel beschadigt.',
        en: 'Wet the bench — wet, not floured — and gently stretch the dough into a rectangle you can almost see through. Spread the additions evenly and roll it up like a letter. Doing it once, properly, beats three careful attempts: the longer you pull at it, the more you damage the sheet.',
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Shaping                                                             */
/* ------------------------------------------------------------------ */

export const preshapeStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'preshape',
      kind: 'preshape',
      title: { nl: 'Voorvormen', en: 'Preshape' },
      baseMinutes: 8,
      body: {
        nl: 'Kiep het deeg op een licht bebloemd werkblad en verdeel het. Trek elk stuk met een deegsteker naar je toe over het blad zodat het oppervlak zich strak trekt, zonder het te kneden. Je maakt hier nog geen brood — je maakt een ronde vorm met een gladde bovenkant, zodat het echte vormen straks voorspelbaar verloopt.',
        en: 'Tip the dough onto a lightly floured bench and divide it. Drag each piece towards you with a scraper so the surface tightens, without kneading it. You are not making a loaf yet — you are making a round with a smooth top, so that the real shaping goes predictably.',
      },
    },
    o,
  );

export const benchStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'bench',
      kind: 'bench',
      title: { nl: 'Bankrust', en: 'Bench rest' },
      body: {
        nl: 'Laat de stukken onafgedekt liggen tot ze zijn ontspannen en licht zijn uitgezakt. Te kort en het deeg vecht terug bij het vormen; te lang en het is zo slap dat je de spanning niet meer kunt pakken. Een vel dat een beetje uitdroogt is hier juist handig: het maakt het vormen schoner.',
        en: 'Leave the pieces uncovered until they have relaxed and spread slightly. Too short and the dough fights back when you shape it; too long and it is so slack you can no longer catch any tension. A skin that dries a little is useful here: it makes shaping cleaner.',
      },
    },
    o,
  );

export const shapeStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'shape',
      kind: 'shape',
      title: { nl: 'Vormen', en: 'Shape' },
      baseMinutes: 10,
      body: {
        nl: 'Draai het stuk om zodat de gladde kant onder ligt. Vouw de zijkanten naar het midden, rol op vanaf de bovenkant en sluit de naad met de zijkant van je hand. Draai het geheel om en trek het over het werkblad tot je spanning voelt in het vel. Leg het met de naad naar boven in het rijsmandje. De spanning die je nu maakt is de vorm die je straks uit de oven haalt.',
        en: 'Turn the piece so the smooth side is underneath. Fold the sides to the middle, roll up from the top and seal the seam with the edge of your hand. Turn it over and drag it across the bench until you feel tension in the skin. Into the banneton, seam side up. The tension you build now is the shape you take out of the oven.',
      },
    },
    o,
  );

/* ------------------------------------------------------------------ */
/* Proof and bake                                                      */
/* ------------------------------------------------------------------ */

export const coldProofStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'cold-proof',
      kind: 'cold-proof',
      title: { nl: 'Koude rijs', en: 'Cold proof' },
      body: {
        nl: 'In de koelkast, afgedekt. De koude rijs doet twee dingen tegelijk: hij maakt de smaak complexer doordat de bacteriën doorwerken terwijl de gist afremt, en hij maakt het deeg stevig genoeg om schoon in te snijden. De temperatuur van jouw koelkast doet er meer toe dan de meeste mensen denken — twee graden verschil verandert de tijd merkbaar.',
        en: 'Into the fridge, covered. The cold proof does two things at once: it deepens the flavour, because the bacteria keep working while the yeast slows, and it firms the dough enough to score cleanly. Your fridge\'s temperature matters more than most people think — two degrees changes the timing noticeably.',
      },
    },
    o,
  );

export const proofStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'proof',
      kind: 'proof',
      title: { nl: 'Narijzen', en: 'Final proof' },
      baseMinutes: 90,
      body: {
        nl: 'Druk met een natte vinger een kuiltje in de zijkant. Veert het meteen helemaal terug, dan heeft het nog tijd nodig. Komt het langzaam half terug, dan is het klaar. Blijft het kuiltje staan, dan ben je erover — bak dan meteen en accepteer een plattere vorm.',
        en: 'Press a dimple into the side with a wet finger. If it springs all the way back at once, it needs more time. If it comes back slowly and only halfway, it is ready. If the dimple stays, you are past it — bake straight away and accept a flatter loaf.',
      },
    },
    o,
  );

export const scoreStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'score',
      kind: 'score',
      title: { nl: 'Insnijden', en: 'Score' },
      baseMinutes: 2,
      body: {
        nl: 'Kiep het brood op bakpapier en snijd het in één beweging in. Het mes moet scheren, niet zagen: houd het in een hoek van ongeveer dertig graden en ga een halve centimeter diep. Aarzelen is het enige wat echt misgaat — een snede die je twee keer probeert scheurt in plaats van open te gaan.',
        en: 'Tip the loaf onto paper and score it in one movement. The blade should shave, not saw: hold it at about thirty degrees and go half a centimetre deep. Hesitating is the only thing that really goes wrong — a cut you attempt twice tears instead of opening.',
      },
    },
    o,
  );

export const bakeStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'bake',
      kind: 'bake',
      title: { nl: 'Bakken', en: 'Bake' },
      body: {
        nl: 'Eerst afgedekt, zodat het brood in zijn eigen stoom kan uitzetten en de korst nog niet zet. Dan open, zodat de korst kleurt en uitdroogt. Bak donkerder dan je durft: de smaak zit in die laatste vijf minuten en een bleke korst is de meest voorkomende fout bij thuisbakkers.',
        en: 'Covered first, so the loaf expands in its own steam and the crust cannot set yet. Then uncovered, so the crust colours and dries. Bake it darker than you dare: the flavour is in those last five minutes, and a pale crust is the commonest fault in home baking.',
      },
    },
    o,
  );

export const coolStep = (o?: StepOverrides): RecipeStep =>
  step(
    {
      id: 'cool',
      kind: 'cool',
      title: { nl: 'Afkoelen', en: 'Cool' },
      baseMinutes: 120,
      body: {
        nl: 'Op een rooster, en niet aansnijden. De kruim is nog niet af als het brood uit de oven komt: het zetmeel moet zich zetten en het vocht moet zich herverdelen. Snijd je te vroeg, dan is de kruim plakkerig en dat is niet je fermentatie — dat is ongeduld.',
        en: 'On a rack, and do not cut it. The crumb is not finished when the loaf leaves the oven: the starch has to set and the moisture has to redistribute. Cut too early and the crumb is gummy — and that is not your fermentation, that is impatience.',
      },
    },
    o,
  );
