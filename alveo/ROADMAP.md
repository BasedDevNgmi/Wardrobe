# Alveo — Full Roadmap

The complete plan, from what is shipped and tested to the most complete
sourdough resource anywhere. The presentation version of this document lives
as an artifact; this file is the working copy and the two are kept in step.

Status legend: **built** (passing tests) · **active** (partially built or a
decision pending) · **queued** (not started) · **parked** (deliberately not
doing).

Current state, verified by CI: 3,140 static pages, 117 tests, 15 recipes,
131 flour records across 13 countries, ~6k lines of pure engine, engine
v1.0.0. **All six Horizon 2 differentiators are now built and tested** (§3).

---

## §0 Thesis and standing rules

Published sourdough recipes silently assume the author's flour. Alveo stores
every recipe as a formula and re-expresses it against the flour the reader
owns. The defensible asset is honesty about the engine — "estimated, ±3, here
is why" — because that is what makes bakers trust it enough to feed it their
own measurements, and that loop is the product.

Non-negotiable: (1) the engine stays physically grounded, golden-tested
against published formulas; (2) no generated page ships without unique
computed data — enforced in CI; (3) content is AI-drafted, human-approved,
and the database CHECK constraint refuses publication without a named
reviewer; (4) no copyrighted recipe prose, ever (LEGAL.md).

---

## §1 Shipped

### Engine (pure TypeScript, zero deps, offline-capable, versioned)
- Absorption model with exact per-cause breakdown (protein, bran via ash,
  damaged starch from mill × hardness, additives, species); parts sum to the
  whole, powering "where does the difference come from".
- Strength anchored at real flours (T65 ≈ 60, US bread ≈ 77, spelt ≈ 25
  despite higher protein); fermentation with Q10 = 2.4; tolerance as the
  done-window width.
- Stage ledger: every gram assigned to soaker / levain / autolyse / mix /
  bassinage / inclusions, with running in-the-bowl hydration; reconciles
  against the formula total or the build fails.
- Autolyse decided from the flour: mode (autolyse / fermentolyse / none),
  duration range, reasoning — bran hydration vs protease damage.
- Multi-directional solver: total flour, dough weight, yield, starter on hand
  (scale-to-it vs use-all-of-it), limiting flour, banneton/tin.
- Equipment: six mixing methods with per-method step prose, bowl capacity
  capping, machine refusal below strength 30, machine mixing replacing folds,
  seven oven types, fridge temperature input.
- Safety tiers that change method, not just numbers.
- Calibration: submission validation with method correction, median consensus
  with outlier rejection, promotion at five agreeing submissions.
- Planner: backwards from oven-out, antisocial-hour fixes, .ics export.
- Converters (DDT + friction + ice split, cups ±20%, banneton/tin, starter
  maths, inclusions, altitude) and the any-recipe parser.

### Site (3,114 pages, nl + en)
- Ten recipes, each a live client-side calculator: flour swap per role,
  sum-to-100 sliders, tiers, equipment, stage ledger, book-vs-yours per kilo,
  gap decomposition, per-method schedule.
- Kitchen mode: full-screen, wake lock, huge type, sum-preserving rounding,
  synthesised timer tones.
- Timeline planner on every recipe with .ics export.
- 131 flour pages (computed breakdown, SVG absorption curve, ceiling, recipe
  fit, substitutes); 2,700+ substitution pages prerendered with the long tail
  on demand; equivalence table; 36 hydration bands; 6 diagnosis trees;
  6 techniques; tools page.
- JSON-LD (Recipe with computed nutrition, HowTo, FAQ) generated from the same
  formulas the pages render; sitemap with full hreflang; PWA manifest.

### Guardrails
- Golden identity tests (±1.5 points, every recipe, every tier) and
  model-validation tests encoding falsifiable physics.
- Thin-content guard: per-language rendered word counts, mandatory
  hand-written notes, duplicate computed profiles rejected.
- Postgres CHECK constraint blocking publication without a named reviewer.
- CI on every push: typecheck, tests, data validation, guard, full build.
- Three real model bugs caught and regression-tested: strength calibration,
  bran double-count, FR protein basis.

---

## §2 Horizon 1 — Go live

| # | Item | State |
|---|---|---|
| 1 | Real domain (placeholder `alveo.bread` in metadata) | **decision** |
| 2 | Supabase project + apply checked-in migration | **schema ready** |
| 3 | Vercel deployment (ISR already configured) | queued |
| 4 | Auth; anonymous use stays fully functional | queued |
| 5 | Flour shelf UI (role-mapping helpers built) | **engine built** |
| 6 | Bake log UI (schema stores full engine I/O, versioned) | **schema built** |
| 7 | Calibration submission flow (protocol page live) | **engine built** |
| 8 | Cookie consent, privacy policy, data export | required |
| 9 | Photography incl. the three-flours side-by-side shots | human work |
| 10 | Recalibrate coefficients against ≥10 real bakes | open question |

## §3 Horizon 2 — The six differentiators — ALL BUILT

1. **Starter state** (`starter.ts`) — ripeness/hydration/age/temp/grain →
   fermentSpeed multiplier + acidity profile. **built**
2. **Sourness dial** (`sourness.ts`, `SournessDial`) — predicts then
   reconfigures toward a target with ranked adjustments and the lactic/acetic
   split. **built**
3. **Rescue mode** (`rescue.ts`, `/reddingsboei`) — (situation × stage) →
   ranked options with what each costs. **built**
4. **Yeast-hybrid and same-day** (`fermentation-mode.ts`) — three modes per
   recipe with temperature-adjusted yeast dosing and the honest trade. **built**
5. **Freshly milled flour** (`milling.ts`) — days-since-milling fade curve +
   sifting. **built**
6. **Engine versioning** — `ENGINE_VERSION` stamped in schema *and* golden
   tests pinned to three model anchors, so a coefficient change fails CI until
   the version is bumped. **built**

Remaining under this horizon: user-visible "the numbers moved" change notes and
the consensus-recompute migration story — both need the live database (§2).

## §4 Horizon 3 — Content engine

- Blog pipeline: topic queue → research with captured sources → outline →
  draft → fact-check pass → **engine-data pass injecting real computed
  tables** → editor pass → human review queue (DB-enforced) → publish.
  Data posts first — they earn the links. Dutch written natively, never
  translated. Quarterly staleness scan. Real byline.
- Crumb analysis: fixed rubric, JSON schema, never freestyles; feeds bake-log
  trends.
- Community: flour submissions with moderation, calibration coverage
  dashboard, per-user model drift surfaced, shareable bake cards.

## §5 Completeness ledger

**Inputs:** salt type/grind; water chemistry; scalds/tangzhong/yudane; old
dough; flour age and storage; two-stage levain builds; salt timing.
**Outputs as targets:** crust control; crumb target; sensory checkpoints;
cost per loaf by country; shelf life per formula; pin-and-compare; every
number tappable to its causes.
**Batch/workflow:** multi-loaf with oven recovery; scale-precision batch
suggestions; oz/lb/°F; DST-safe .ics.
**Correctness/access:** offline flour shelf; no-scale calibration fallback;
screen-reader pass on the calculator; LCP < 1.8 s / CLS < 0.05.

## §6 Growth

Families live vs ceiling: /meel 131→500+, /vervangen 2,712→17k on demand,
/problemen 6→60, /techniek 8→25 (video-led), /recepten 15→40 (shipped: bagels, pretzels,
brioche, English muffins, porridge multigrain; still queued: cinnamon buns,
discard crackers, panettone), /problemen 11→60. Next locales: de, fr — their flour data
is already the deepest. Video embedded, never hosted. The three-flours photo
is worth more than any backlink campaign.

## §7 Monetisation — hooks now, switches later

Geo-aware affiliate links (`availableIn` already on every record); Pro tier
(bake log, calibration history, crumb analysis, exports — the free calculator
stays complete or the calibration loop dies); print-on-demand recipe cards in
the buyer's flour. Never: interstitials, autoplay, preamble above the recipe,
or selling calibration data.

## §8 Launch gate (in order, none optional)

1. Real domain in metadata/sitemap/JSON-LD — decision
2. Deploy + migration, RLS verified with a second account
3. Cookie consent, privacy policy, data export
4. Allergen notes on all ten recipes (footer disclaimer done) — partial
5. Coefficients validated against ≥10 real bakes, version bumped if moved
6. Photography: hero + crumb per recipe; three-flours for recipes 1, 2, 7
7. Screen-reader pass; Lighthouse ≥ 95 accessibility on recipe pages
8. Named human byline for E-E-A-T

## §9 Parked (revisit only with a reason)

Gluten-free sourdough (different physics — the site says so rather than
producing confident nonsense) · bakery-scale formulas · video hosting ·
native apps (PWA until demonstrably insufficient) · translated URL segments
(documented trade; revisit if English overtakes Dutch).
