'use client';

import { useMemo, useState } from 'react';
import {
  altitudeAdvice, bannetonCapacity, calculateWaterTemp, convertStarterHydration,
  CUP_DENSITIES, cupsToGrams, feedForTarget, iceSplit, INCLUSION_ABSORPTION,
  inclusionWater, MIX_METHOD_LABELS, MIX_METHODS, parseRecipeText, starterPeakHours,
  tinCapacity,
} from '@/engine';
import type { MixMethod } from '@/engine/types';
import type { Locale } from '@/i18n/routing';
import { Callout } from './ui';

const PANEL = 'border border-rule bg-raised p-4';
const INPUT = 'bg-paper border border-ruleStrong px-2 py-1.5 text-sm font-mono tnum w-full';
const FIELD = 'grid gap-1';
const LABEL = 'text-[0.78rem] text-soft';

export function Tools({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  return (
    <div className="grid gap-8">
      <DDT locale={locale} />
      <CupConverter locale={locale} />
      <VesselSizer locale={locale} />
      <StarterTools locale={locale} />
      <Inclusions locale={locale} />
      <Altitude locale={locale} />
      <RecipeParser locale={locale} />
      <p className="text-sm text-soft prose-measure">
        {nl
          ? 'Elk hulpmiddel hier draait volledig in je browser. Er gaat niets naar een server, en alles blijft werken zonder verbinding — wat de toestand is waarin een telefoon in een keuken zich meestal bevindt.'
          : 'Every tool here runs entirely in your browser. Nothing goes to a server, and everything keeps working offline — which is the state a phone in a kitchen is usually in.'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DDT({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [ddt, setDdt] = useState(25);
  const [flourTemp, setFlourTemp] = useState(20);
  const [roomTemp, setRoomTemp] = useState(21);
  const [prefermentTemp, setPrefermentTemp] = useState<number | ''>(22);
  const [method, setMethod] = useState<MixMethod>('hand');
  const [waterGrams, setWaterGrams] = useState(750);
  const [tapTemp, setTapTemp] = useState(14);

  const result = useMemo(
    () =>
      calculateWaterTemp({
        ddt, flourTemp, roomTemp, method,
        ...(prefermentTemp === '' ? {} : { prefermentTemp }),
      }),
    [ddt, flourTemp, roomTemp, prefermentTemp, method],
  );

  const ice = useMemo(
    () => iceSplit(waterGrams, result.waterTemp, tapTemp),
    [waterGrams, result.waterTemp, tapTemp],
  );

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">
        {nl ? 'Watertemperatuur berekenen (DDT)' : 'Water temperature (DDT)'}
      </h2>
      <p className="mt-1.5 text-sm text-soft prose-measure">
        {nl
          ? 'De deegtemperatuur is na het meel de grootste knop waar je aan kunt draaien, en de knop die de meeste thuisbakkers nooit meten. Wrijvingswarmte verschilt sterk per methode: handen voegen nauwelijks iets toe, een spiraalkneder zes tot negen graden.'
          : 'Dough temperature is the biggest lever after flour, and the one most home bakers never measure. Friction heat varies sharply by method: hands add almost nothing, a spiral mixer six to nine degrees.'}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Gewenste deegtemperatuur °C' : 'Desired dough temp °C'}</span>
          <input type="number" className={INPUT} value={ddt} onChange={(e) => setDdt(Number(e.target.value))} />
        </label>
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Meel °C' : 'Flour °C'}</span>
          <input type="number" className={INPUT} value={flourTemp} onChange={(e) => setFlourTemp(Number(e.target.value))} />
        </label>
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Kamer °C' : 'Room °C'}</span>
          <input type="number" className={INPUT} value={roomTemp} onChange={(e) => setRoomTemp(Number(e.target.value))} />
        </label>
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Desem °C (leeg = geen)' : 'Levain °C (blank = none)'}</span>
          <input
            type="number" className={INPUT} value={prefermentTemp}
            onChange={(e) => setPrefermentTemp(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Mengmethode' : 'Mixing method'}</span>
          <select
            className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
            value={method}
            onChange={(e) => setMethod(e.target.value as MixMethod)}
          >
            {MIX_METHODS.map((m) => (
              <option key={m} value={m}>{MIX_METHOD_LABELS[m][locale]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 border-t border-rule pt-3">
        <p className="font-mono text-3xl text-accent tnum">{result.waterTemp} °C</p>
        <p className="mt-1 text-sm text-soft prose-measure">
          {nl
            ? `Berekend over ${result.factors} temperatuurtermen, met ${result.friction} °C wrijving (bereik ${result.frictionRange[0]}–${result.frictionRange[1]} °C voor deze methode). Meet je eigen wrijving één keer en gebruik dat getal daarna: het is per machine anders.`
            : `Computed across ${result.factors} temperature terms, with ${result.friction} °C of friction (range ${result.frictionRange[0]}–${result.frictionRange[1]} °C for this method). Measure your own friction once and use that figure thereafter: it differs per machine.`}
        </p>
        {result.needsIce ? (
          <div className="mt-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={FIELD}>
                <span className={LABEL}>{nl ? 'Totaal water (g)' : 'Total water (g)'}</span>
                <input type="number" className={INPUT} value={waterGrams} onChange={(e) => setWaterGrams(Number(e.target.value))} />
              </label>
              <label className={FIELD}>
                <span className={LABEL}>{nl ? 'Kraanwater °C' : 'Tap water °C'}</span>
                <input type="number" className={INPUT} value={tapTemp} onChange={(e) => setTapTemp(Number(e.target.value))} />
              </label>
            </div>
            <Callout label={nl ? 'Dit vraagt om ijs' : 'This calls for ice'}>
              <p>
                {ice.possible
                  ? nl
                    ? `${ice.ice} g ijs en ${ice.water} g kraanwater. Weeg het ijs mee als water — het smelt volledig in het deeg.`
                    : `${ice.ice} g of ice and ${ice.water} g of tap water. Count the ice as water — it melts completely into the dough.`
                  : nl
                    ? 'Zelfs met alleen ijs haal je deze temperatuur niet. Koel je meel voor of accepteer een warmer deeg en een kortere bulk.'
                    : 'Even with all ice you will not reach this temperature. Chill your flour first, or accept a warmer dough and a shorter bulk.'}
              </p>
            </Callout>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CupConverter({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [cups, setCups] = useState(1);
  const [key, setKey] = useState('ap-flour');
  const result = useMemo(() => cupsToGrams(cups, key), [cups, key]);

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">{nl ? 'Koppen naar grammen' : 'Cups to grams'}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Aantal koppen' : 'Cups'}</span>
          <input type="number" step="0.25" className={INPUT} value={cups} onChange={(e) => setCups(Number(e.target.value))} />
        </label>
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Ingrediënt' : 'Ingredient'}</span>
          <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm" value={key} onChange={(e) => setKey(e.target.value)}>
            {CUP_DENSITIES.map((d) => (
              <option key={d.key} value={d.key}>{d.label[locale]}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 font-mono text-3xl text-accent tnum">
        {result.grams} g
        <span className="text-base text-faint"> ({result.low}–{result.high} g)</span>
      </p>
      <p className="mt-1.5 text-sm text-soft prose-measure">{result.caveat[locale]}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function VesselSizer({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [mode, setMode] = useState<'banneton-round' | 'banneton-oval' | 'tin'>('banneton-round');
  const [d, setD] = useState(23);
  const [l, setL] = useState(28);
  const [w, setW] = useState(13);
  const [h, setH] = useState(9);

  const result = useMemo(() => {
    if (mode === 'tin') return tinCapacity({ length: l, width: w, height: h });
    if (mode === 'banneton-oval') return bannetonCapacity('oval', { length: l, width: w, height: h });
    return bannetonCapacity('round', { diameter: d, height: h });
  }, [mode, d, l, w, h]);

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">
        {nl ? 'Rijsmandje of bakvorm naar deeggewicht' : 'Basket or tin to dough weight'}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Type' : 'Type'}</span>
          <select className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option value="banneton-round">{nl ? 'Rond rijsmandje' : 'Round banneton'}</option>
            <option value="banneton-oval">{nl ? 'Ovaal rijsmandje' : 'Oval banneton'}</option>
            <option value="tin">{nl ? 'Bakvorm' : 'Tin'}</option>
          </select>
        </label>
        {mode === 'banneton-round' ? (
          <label className={FIELD}>
            <span className={LABEL}>{nl ? 'Diameter (cm)' : 'Diameter (cm)'}</span>
            <input type="number" className={INPUT} value={d} onChange={(e) => setD(Number(e.target.value))} />
          </label>
        ) : (
          <>
            <label className={FIELD}>
              <span className={LABEL}>{nl ? 'Lengte (cm)' : 'Length (cm)'}</span>
              <input type="number" className={INPUT} value={l} onChange={(e) => setL(Number(e.target.value))} />
            </label>
            <label className={FIELD}>
              <span className={LABEL}>{nl ? 'Breedte (cm)' : 'Width (cm)'}</span>
              <input type="number" className={INPUT} value={w} onChange={(e) => setW(Number(e.target.value))} />
            </label>
          </>
        )}
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Hoogte (cm)' : 'Height (cm)'}</span>
          <input type="number" className={INPUT} value={h} onChange={(e) => setH(Number(e.target.value))} />
        </label>
      </div>
      <p className="mt-4 font-mono text-3xl text-accent tnum">{result.doughGrams} g</p>
      <p className="mt-1.5 text-sm text-soft prose-measure">
        {nl
          ? `Inhoud ongeveer ${result.volumeMl} ml. Bruikbaar bereik ${result.range[0]}–${result.range[1]} g: minder en het brood vult de vorm niet, meer en het loopt over de rand tijdens de koude rijs.`
          : `Roughly ${result.volumeMl} ml. Usable range ${result.range[0]}–${result.range[1]} g: less and the loaf does not fill the shape, more and it climbs over the rim during the cold proof.`}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function StarterTools({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [seed, setSeed] = useState(1);
  const [flourPart, setFlourPart] = useState(5);
  const [waterPart, setWaterPart] = useState(5);
  const [target, setTarget] = useState(200);
  const [temp, setTemp] = useState(24);

  const [convertGrams, setConvertGrams] = useState(100);
  const [fromH, setFromH] = useState(100);
  const [toH, setToH] = useState(60);

  const feed = useMemo(
    () => feedForTarget({ starter: seed, flour: flourPart, water: waterPart }, target),
    [seed, flourPart, waterPart, target],
  );
  const peak = useMemo(
    () => starterPeakHours({ starter: seed, flour: flourPart, water: waterPart }, temp),
    [seed, flourPart, waterPart, temp],
  );
  const conversion = useMemo(
    () => convertStarterHydration(convertGrams, fromH, toH),
    [convertGrams, fromH, toH],
  );

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">{nl ? 'Desem' : 'Starter'}</h2>

      <h3 className="label mt-4 mb-2">{nl ? 'Voedingsverhouding en piektijd' : 'Feeding ratio and peak time'}</h3>
      <div className="grid gap-3 sm:grid-cols-5">
        <label className={FIELD}><span className={LABEL}>{nl ? 'Starter' : 'Starter'}</span>
          <input type="number" className={INPUT} value={seed} onChange={(e) => setSeed(Number(e.target.value))} /></label>
        <label className={FIELD}><span className={LABEL}>{nl ? 'Meel' : 'Flour'}</span>
          <input type="number" className={INPUT} value={flourPart} onChange={(e) => setFlourPart(Number(e.target.value))} /></label>
        <label className={FIELD}><span className={LABEL}>{nl ? 'Water' : 'Water'}</span>
          <input type="number" className={INPUT} value={waterPart} onChange={(e) => setWaterPart(Number(e.target.value))} /></label>
        <label className={FIELD}><span className={LABEL}>{nl ? 'Doel (g)' : 'Target (g)'}</span>
          <input type="number" className={INPUT} value={target} onChange={(e) => setTarget(Number(e.target.value))} /></label>
        <label className={FIELD}><span className={LABEL}>{nl ? 'Temp °C' : 'Temp °C'}</span>
          <input type="number" className={INPUT} value={temp} onChange={(e) => setTemp(Number(e.target.value))} /></label>
      </div>
      <p className="mt-3 font-mono text-sm tnum">
        {feed.starter} g {nl ? 'starter' : 'starter'} + {feed.flour} g {nl ? 'meel' : 'flour'} + {feed.water} g {nl ? 'water' : 'water'}
      </p>
      <p className="mt-1 font-mono text-2xl text-accent tnum">
        {nl ? `piek na ± ${peak} uur` : `peaks in ± ${peak} hours`}
      </p>
      <p className="mt-1.5 text-sm text-soft prose-measure">
        {nl
          ? 'Meer meel per deel starter betekent een langere, duidelijker zichtbare piek. Een 1:1:1 is binnen enkele uren uitgeput en zakt weer in voordat je het ziet — dat is de meest voorkomende reden dat mensen denken dat hun starter niet werkt.'
          : 'More flour per part of starter means a longer, more clearly visible peak. A 1:1:1 exhausts itself within hours and collapses again before you notice — the commonest reason people think their starter is not working.'}
      </p>

      <h3 className="label mt-6 mb-2">{nl ? 'Stijf naar vloeibaar en terug' : 'Stiff to liquid and back'}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className={FIELD}><span className={LABEL}>{nl ? 'Hoeveelheid (g)' : 'Amount (g)'}</span>
          <input type="number" className={INPUT} value={convertGrams} onChange={(e) => setConvertGrams(Number(e.target.value))} /></label>
        <label className={FIELD}><span className={LABEL}>{nl ? 'Van hydratatie %' : 'From hydration %'}</span>
          <input type="number" className={INPUT} value={fromH} onChange={(e) => setFromH(Number(e.target.value))} /></label>
        <label className={FIELD}><span className={LABEL}>{nl ? 'Naar hydratatie %' : 'To hydration %'}</span>
          <input type="number" className={INPUT} value={toH} onChange={(e) => setToH(Number(e.target.value))} /></label>
      </div>
      <p className="mt-3 font-mono text-sm tnum">
        {conversion.flour} g {nl ? 'meel' : 'flour'}, {conversion.waterNow} g {nl ? 'water nu' : 'water now'} →{' '}
        {conversion.addWater > 0
          ? nl ? `${conversion.addWater} g water toevoegen` : `add ${conversion.addWater} g water`
          : nl ? `${conversion.addFlour} g meel toevoegen` : `add ${conversion.addFlour} g flour`}
      </p>
      <p className="mt-1.5 text-sm text-soft prose-measure">
        {nl
          ? 'Een stijve desem produceert meer azijnzuur en minder melkzuur: scherper van smaak, trager van tempo. Dat is precies de knop waarmee je een voeding om 02:40 naar 23:00 verschuift.'
          : 'A stiff levain makes more acetic and less lactic acid: sharper in flavour, slower in pace. It is precisely the lever that moves a 02:40 feed to 23:00.'}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Inclusions({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [flour, setFlour] = useState(1000);
  const [items, setItems] = useState<{ key: string; pct: number }[]>([
    { key: 'rolled-oats', pct: 15 },
  ]);

  const result = useMemo(
    () =>
      inclusionWater(
        flour,
        items.map((i) => ({
          key: i.key, name: i.key, pct: i.pct,
          absorbsWater: INCLUSION_ABSORPTION[i.key] ?? 0,
        })),
      ),
    [flour, items],
  );

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">
        {nl ? 'Toevoegingen en hun waterhonger' : 'Inclusions and their water hunger'}
      </h2>
      <div className="mt-4 grid gap-3">
        <label className={FIELD}>
          <span className={LABEL}>{nl ? 'Totaal bloem (g)' : 'Total flour (g)'}</span>
          <input type="number" className={INPUT} value={flour} onChange={(e) => setFlour(Number(e.target.value))} />
        </label>
        {items.map((item, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
            <select
              className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm"
              value={item.key}
              onChange={(e) =>
                setItems((prev) => prev.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))
              }
            >
              {Object.keys(INCLUSION_ABSORPTION).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <input
              type="number" className={INPUT} value={item.pct}
              onChange={(e) =>
                setItems((prev) => prev.map((x, j) => (j === i ? { ...x, pct: Number(e.target.value) } : x)))
              }
            />
            <button
              type="button"
              className="chip text-faint hover:text-danger"
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
            >
              {nl ? 'weg' : 'remove'}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="chip text-accent w-fit"
          onClick={() => setItems((prev) => [...prev, { key: 'sunflower-seeds', pct: 10 }])}
        >
          + {nl ? 'toevoeging' : 'inclusion'}
        </button>
      </div>
      <p className="mt-4 font-mono text-3xl text-accent tnum">+{result.extraWaterGrams} g</p>
      <p className="mt-1.5 text-sm text-soft prose-measure">{result.note[locale]}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Altitude({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [m, setM] = useState(0);
  const advice = useMemo(() => altitudeAdvice(m), [m]);

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">{nl ? 'Hoogte' : 'Altitude'}</h2>
      <label className={`${FIELD} mt-4 max-w-xs`}>
        <span className={LABEL}>{nl ? 'Meter boven zeeniveau' : 'Metres above sea level'}</span>
        <input type="number" step="50" className={INPUT} value={m} onChange={(e) => setM(Number(e.target.value))} />
      </label>
      <p className="mt-4 font-mono text-sm tnum">
        {nl ? 'Rijstijd' : 'Proof time'} ×{advice.proofMultiplier} ·{' '}
        {nl ? 'oven' : 'oven'} +{advice.bakeTempDelta} °C ·{' '}
        {nl ? 'water' : 'water'} +{advice.hydrationDelta} {nl ? 'punten' : 'points'}
      </p>
      <ul className="mt-2 grid gap-1.5">
        {advice.notes.map((n, i) => (
          <li key={i} className="text-sm text-soft prose-measure">{n[locale]}</li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const SAMPLE = `500 g bread flour
100 g whole wheat flour
430 g water
120 g sourdough starter
12 g salt`;

function RecipeParser({ locale }: { locale: Locale }) {
  const nl = locale === 'nl';
  const [text, setText] = useState(SAMPLE);
  const [starterHydration, setStarterHydration] = useState(100);
  const parsed = useMemo(() => parseRecipeText(text, { starterHydration }), [text, starterHydration]);

  return (
    <section className={PANEL}>
      <h2 className="font-display text-2xl font-semibold">
        {nl ? 'Plak een recept, krijg bakkerspercentages' : 'Paste a recipe, get baker\'s percentages'}
      </h2>
      <p className="mt-1.5 text-sm text-soft prose-measure">
        {nl
          ? 'Plak alleen de ingrediëntenlijst. Hoeveelheden en ingrediëntnamen zijn feiten en die verwerken we; de methodetekst laten we met rust en slaan we niet op.'
          : 'Paste the ingredient list only. Quantities and ingredient names are facts and we process those; the method prose is left alone and never stored.'}
      </p>
      <div className="mt-4 grid gap-3">
        <textarea
          className="bg-paper border border-ruleStrong px-2 py-1.5 text-sm font-mono min-h-[9rem]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={nl ? 'Ingrediëntenlijst' : 'Ingredient list'}
        />
        <label className={`${FIELD} max-w-xs`}>
          <span className={LABEL}>{nl ? 'Hydratatie van de starter %' : 'Starter hydration %'}</span>
          <input
            type="number" className={INPUT} value={starterHydration}
            onChange={(e) => setStarterHydration(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-1 font-mono text-sm tnum">
        <p>{nl ? 'Totaal bloem' : 'Total flour'}: {parsed.totalFlour} g</p>
        <p>{nl ? 'Totaal water' : 'Total water'}: {parsed.totalWater} g</p>
        <p className="text-accent text-2xl">{parsed.hydration}% {nl ? 'hydratatie' : 'hydration'}</p>
        <p>{nl ? 'Zout' : 'Salt'}: {parsed.saltPct}%</p>
        <p>{nl ? 'Voorgefermenteerde bloem' : 'Prefermented flour'}: {parsed.prefermentedFlourPct}%</p>
      </div>

      {parsed.warnings.length > 0 ? (
        <ul className="mt-3 grid gap-1.5">
          {parsed.warnings.map((w, i) => (
            <li key={i} className="text-[0.82rem] text-soft prose-measure">{w[locale]}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
