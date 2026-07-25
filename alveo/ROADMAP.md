# Alveo — Roadmap

Living document. The build order from the original brief is preserved in §1;
everything added since sits in §2 onward with the reasoning attached, so a
decision can be re-argued later instead of just inherited.

Status legend: **done** · **in progress** · **next** · **queued** · **parked**

---

## 1. Build order (from the brief)

| # | Item | Status |
|---|---|---|
| 1 | Flour model + absorption engine + golden tests | engine **done**, golden tests **next** |
| 2 | Recipe schema + calculator UI + recipes 1, 2, 7 | **next** |
| 3 | Flour shelf + remaining 7 recipes | queued |
| 4 | Flour database + `/meel/` and `/vervangen/` families | FR file done, 12 countries queued |
| 5 | Timeline planner + kitchen mode + PWA | planner engine done, UI queued |
| 6 | Bake log + calibration | calibration engine done, storage queued |
| 7 | Blog pipeline + admin review queue | queued |
| 8 | Crumb analysis | queued |
| 9 | Remaining SEO families | queued |
| 10 | i18n pass, then launch | queued |

---

## 2. Equipment adaptation — every recipe, every method

**Status: next. Must land before the ten recipes are written.**

Every recipe must be renderable for the equipment the reader actually owns,
chosen by them and remembered. Not a footnote at the bottom of the page — a
first-class switch that rewrites the method.

### 2.1 Why this blocks recipe authoring

`RecipeStep.body` is currently a single `{ nl, en }` string. Mixer method
changes the *prose*, not just a duration: "slap and fold for three minutes"
becomes "speed 2 for six minutes, then check the windowpane". If we write ten
recipes × ~14 steps against the single-body schema and then add methods, we
rewrite ~140 hand-written step bodies in two languages.

So the schema change comes first:

```ts
body: { nl: string; en: string }
// becomes
body: LocalisedProse | Partial<Record<MixMethod, LocalisedProse>> & { default: LocalisedProse }
```

with a resolver that falls back to `default` for any method a step does not
override. Most steps (bulk, shape, bake) never need an override; only the
mixing and folding steps do, which keeps the authoring burden honest.

### 2.2 A stand mixer is not "the same recipe, done by machine"

Four real consequences the engine has to model, or the feature is decoration:

**Bowl capacity caps batch size.** A 4.8 L planetary mixer cannot mix 2 kg of
flour at 85% hydration — the dough climbs the hook and the motor stalls. Needs
a `maxFlourGrams` per machine class, cross-checked against `totalFlour`, with a
warning that offers the largest batch that machine can actually take. This is
the one that saves people a burnt-out motor.

**Friction heat changes the water temperature.** Already modelled in
`FRICTION_FACTOR` (spiral 6–9 °C, planetary 4–6 °C, hand 0–2 °C) and wired into
the DDT calculator — but the recipe pages do not yet surface it. Choosing
"stand mixer" must visibly change the water temperature on the ingredient list,
not just in a separate tool.

**Machine mixing over-develops fragile flour fast.** Spelt, einkorn and emmer
go from developed to soupy in about ninety seconds on a hook. Mixer method
needs to *cut* mix time as `blend.strength` falls, and refuse machine mixing
outright below roughly strength 30 with an explanation. The inverse of the
existing fold logic, and it uses the same number.

**Machine mixing replaces folds.** A dough taken to full development on a hook
needs one or two folds, not four. `foldPlan()` currently keys off hydration and
strength only; it needs `mixMethod` as a third input.

### 2.3 Method matrix to support

| Axis | Options |
|---|---|
| Mixing | hand (Rubaud · slap-and-fold · pincer · bowl-only), planetary/stand mixer, spiral, food processor, bread machine dough cycle, no-knead |
| Oven | Dutch oven, baking steel/stone + steam, tray, combi-steam, deck oven, gas, fan-forced |
| Proofing | banneton, bowl + cloth, proofer box, fridge, retarder |
| Shaping vessel | free-form, tin, tray, pan, couche |

Fan-forced ovens run roughly 15–20 °C hotter than their dial claims, which is
enough to burn a crust before the crumb sets. Oven type has to adjust
`bake.temp` the same way altitude already does.

### 2.4 Fridge temperature is an input, not a constant

Domestic fridges run anywhere from 2 °C to 8 °C. Over a 14-hour retard that is
close to a two-fold difference in fermentation — larger than most of the flour
effects the engine agonises over. `coldProofHours()` currently assumes a single
fridge. Add `fridgeTemp` to `EngineOptions`, default 5 °C, ask once, remember
it, and use the Q10 curve that already exists.

---

## 3. The six that matter most after equipment

Ranked by (defensibility × how badly it is served elsewhere).

### 3.1 Starter state as an engine input

The single largest unmodelled variable. Every timing on the site assumes a
healthy, 100%-hydration, wheat-fed starter used at peak. Reality: young
starters, discard, stiff levains, rye starters, dried-and-revived, fridge-cold,
and starters used two hours past peak. Each shifts `fermentSpeed` and the
acidity of the finished loaf.

Proposed input: `starterState = { hydration, flour, ageWeeks, lastFedHours,
temp, ripeness: 'young' | 'peak' | 'past-peak', vigourScore? }`, feeding into
`fermentSpeed` and a new `acidity` output. `starterPeakHours()` already exists
and is half of this.

### 3.2 Sourness as a dial

After "why is my loaf flat", the most-asked question in sourdough is "how do I
make it more (or less) sour" — and the answers online are folklore. It is
genuinely well-suited to a formula engine, because every lever is already a
field we hold: levain hydration (stiff = more acetic), retard length and
temperature, rye percentage, inoculation rate, dough temperature, starter
maintenance ratio.

Ship it as a slider that *reconfigures the recipe* — same bread, different acid
profile — with the lactic/acetic split explained. Nobody has built this. It is
the second-best demo of the engine after flour substitution.

### 3.3 Rescue mode

"It is 02:00 and my dough is ready and I am going to bed." "My levain did not
rise." "I have to leave the house in an hour." Distinct from the
`/problemen/` diagnosis tree, which is a post-mortem — this is triage, mid-bake,
in kitchen mode, on a phone, with flour on your hands.

Input: where you are in the timeline and what went wrong. Output: the next best
action and what it costs you. Genuinely novel, and it converts the timeline
planner from a schedule into something that survives contact with real life.

### 3.4 Yeast-hybrid and same-day modes

A large slice of the audience wants sourdough flavour on a weeknight, or is
starterless and not ready to commit. Offering a pâte-fermentée + instant-yeast
variant of every recipe, and a same-day version, is an accessibility win and a
very large search term. The formula engine can generate both from the existing
data — inoculation rate and timing are already parameters.

Must be honest about the trade: less acid development, less keeping quality.

### 3.5 Freshly milled flour

The `home-stone` and `home-impact` mill types are already in the model and
already carry the correct low damaged-starch figures. What is missing is the
*time* axis: flour milled this morning behaves differently from the same flour
three weeks later — higher enzyme activity, lower initial absorption, and it
needs aging before it settles. Add `milledDaysAgo` and a sifting/extraction
input for people who bolt their own flour.

Small, underserved, extremely high-intent audience that buys equipment and
writes blog posts. They are also the people most likely to run the calibration
protocol properly.

### 3.6 Engine versioning

Correctness debt that compounds. When a coefficient changes — and it will,
that is the entire point of the calibration loop — every historical bake log
was computed under the old model, and every golden test silently re-baselines.

Stamp `engineVersion` on every persisted bake, every calibration submission and
every cached comparison. Pin golden tests to a version. Show users when a
recipe's numbers moved and why. Cheap now, very expensive at 10,000 bake logs.

---

## 4. Completeness catalogue

Grouped, not ranked. Each is a real gap, none is urgent.

### Ingredients and inputs
- **Salt type and grind.** Fine sea vs coarse kosher differs ~2× by volume; a
  teaspoon measurement can be 50% off. Also settles the iodised-salt myth.
- **Water chemistry.** Chloramine does not off-gas and does damage starters;
  hardness affects gluten. Under-covered everywhere, good data-post material.
- **Flour age and storage.** Rancidity in wholegrain, weevils, freezer storage.
- **Scalds, tangzhong and yudane.** Materially change water accounting for the
  tin loaf and the enriched breads; popular and poorly explained.
- **Old dough / pâte fermentée** as a preferment option alongside levain.
- **Alternative flours we will *not* claim to handle.** Gluten-free sourdough
  is a different product with different physics. Say so on the page rather than
  producing confident nonsense.

### Outputs and control
- **Crust control.** Thin and crackly vs thick and chewy vs soft-sandwich, as a
  target rather than a fixed instruction. Steam, temperature, cooling.
- **Crumb target.** Open and irregular vs even and sandwich-tight — drives
  shaping, degassing and hydration together.
- **Sensory checkpoints**, not just clock times: what the dough should feel and
  look like at each stage. Kitchen mode needs these more than it needs timers.
- **Nutrition, computed from the actual blend.** Required for the `Recipe`
  JSON-LD anyway; fibre and mineral content move a great deal with wholegrain
  percentage, so a templated figure would be both wrong and detectable.
- **Cost per loaf**, by country, including energy. Unique computed data, feeds
  the affiliate hooks, and "is baking your own bread actually cheaper" is a
  question with real search volume and no honest answer online.
- **Shelf life and storage guidance**, per formula. Ties directly to the tin
  loaf's job of making sourdough a weekly habit.

### Batch and workflow
- **Multi-loaf and large-batch.** Oven recovery between loads, splitting a bulk
  across two bakes, what a home oven can actually do.
- **Scale precision.** At 300 g batches, a 1 g scale cannot weigh 2% salt
  accurately. Warn, and offer a scaled-up batch instead.
- **Unit system.** Metric default, but oz/lb and °F for the US, and bag sizes
  that match what is on the shelf locally.
- **Timezone and DST in the planner.** An `.ics` spanning a DST boundary is an
  hour wrong — a whole bug class, and exactly the kind that destroys trust in a
  scheduling feature.

### Data, community and the moat
- **Community flour submissions** with a moderation queue. Without this the
  database is capped at what we author, and the long tail is the entire SEO
  play.
- **Calibration coverage dashboard.** Which flours are near promotion, which
  countries are thin. Directs both content and the community ask.
- **Per-user model drift.** If someone's measurements sit consistently above
  the model, that is a signal about their method or their kitchen — surface it
  rather than silently averaging it away.
- **Data export.** GDPR requires it; it is also a trust signal worth making
  visible rather than burying in settings.
- **Photo protocol** for the three-flours-side-by-side comparison shots. Same
  light, same vessel, same crop, or the images prove nothing.

### Correctness and accessibility
- **Offline flour shelf.** The engine is pure and runs offline already, but the
  shelf needs the flour records cached client-side to be useful in a kitchen
  with no signal.
- **No-scale fallback** for the calibration protocol, clearly marked as lower
  confidence.
- **Screen-reader passes on the calculator specifically.** Live-updating
  numbers are the hardest part of the site to get right, and the part most
  likely to be silently broken.

---

## 5. Explicitly parked

- Gluten-free sourdough — different physics, would need its own engine.
- Commercial/bakery-scale formulas — different constraints, dilutes the
  audience.
- Video hosting — embed, do not host.
- Mobile apps — the PWA is the answer until it demonstrably is not.
