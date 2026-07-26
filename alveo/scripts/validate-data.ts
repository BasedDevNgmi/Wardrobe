/**
 * Data integrity, enforced in CI.
 *
 * The central invariant: a stored derived value can never drift from the model.
 * Every flour is re-derived here and compared against what the database holds.
 * If a coefficient changes and a record does not follow, the build fails rather
 * than shipping a page whose numbers disagree with the calculator's.
 */

import { FLOURS } from '../src/data/flours';
import { RECIPES, authorFlours } from '../src/data/recipes';
import { computeAbsorption } from '../src/engine/absorption';
import { computeFermentSpeed, computeStrength } from '../src/engine/flour';

const errors: string[] = [];
const warnings: string[] = [];

/* ---- derived values match the model ------------------------------- */

for (const f of FLOURS) {
  if (f.confidence !== 'measured') {
    const expected = computeAbsorption(f);
    if (Math.abs(expected - f.absorption) > 0.11) {
      errors.push(`${f.slug}: stored absorption ${f.absorption} but model says ${expected}`);
    }
  }
  const strength = computeStrength(f);
  if (Math.abs(strength - f.strength) > 0.11) {
    errors.push(`${f.slug}: stored strength ${f.strength} but model says ${strength}`);
  }
  const speed = computeFermentSpeed(f);
  if (Math.abs(speed - f.fermentSpeed) > 0.002) {
    errors.push(`${f.slug}: stored fermentSpeed ${f.fermentSpeed} but model says ${speed}`);
  }
}

/* ---- slugs and ranges --------------------------------------------- */

const slugs = new Set<string>();
for (const f of FLOURS) {
  if (slugs.has(f.slug)) errors.push(`duplicate flour slug: ${f.slug}`);
  slugs.add(f.slug);

  if (!/^[a-z]{2}-[a-z0-9-]+$/.test(f.slug)) {
    errors.push(`${f.slug}: slug should be country-prefixed and kebab-case`);
  }
  if (f.protein < 5 || f.protein > 20) errors.push(`${f.slug}: implausible protein ${f.protein}`);
  if (f.ash !== undefined && (f.ash < 0.3 || f.ash > 2.5)) {
    errors.push(`${f.slug}: implausible ash ${f.ash}`);
  }
  if (f.wholegrain < 0 || f.wholegrain > 1) errors.push(`${f.slug}: wholegrain out of 0–1`);
  if (f.absorption < 45 || f.absorption > 100) {
    errors.push(`${f.slug}: absorption ${f.absorption} outside plausible band`);
  }
  if (f.strength < 0 || f.strength > 100) errors.push(`${f.slug}: strength out of range`);

  // Honesty check: a spec-sheet claim needs a source on file.
  if (f.confidence === 'spec-sheet' && !f.sourceNote) {
    errors.push(`${f.slug}: marked spec-sheet without a sourceNote naming the source`);
  }
  if (f.confidence === 'estimated' && !f.sourceNote) {
    warnings.push(`${f.slug}: estimated without a sourceNote explaining what the estimate rests on`);
  }
}

/* ---- recipes ------------------------------------------------------- */

const recipeSlugs = new Set<string>();
for (const r of RECIPES) {
  if (recipeSlugs.has(r.slug)) errors.push(`duplicate recipe slug: ${r.slug}`);
  recipeSlugs.add(r.slug);

  const total = r.flourBlend.reduce((s, b) => s + b.pct, 0);
  if (Math.abs(total - 100) > 0.001) {
    errors.push(`${r.slug}: flour blend sums to ${total}, not 100`);
  }

  try {
    const authors = authorFlours(r);
    const needed = new Set(r.flourBlend.map((b) => b.role));
    for (const role of needed) {
      if (!authors[role]) errors.push(`${r.slug}: authorContext has no flour for role "${role}"`);
    }
  } catch (e) {
    errors.push(`${r.slug}: ${(e as Error).message}`);
  }

  if (r.hydration < 50 || r.hydration > 100) errors.push(`${r.slug}: hydration out of range`);
  if (r.salt < 1 || r.salt > 4) errors.push(`${r.slug}: salt ${r.salt}% out of range`);
  if (r.prefermentedFlour <= 0 || r.prefermentedFlour > 50) {
    errors.push(`${r.slug}: prefermented flour out of range`);
  }
  if (r.steps.length < 5) errors.push(`${r.slug}: fewer than five steps`);

  for (const s of r.steps) {
    const body = 'default' in s.body ? s.body.default : s.body;
    if (!body.nl?.trim() || !body.en?.trim()) {
      errors.push(`${r.slug}/${s.id}: missing prose in one language`);
    }
  }
}

/* ---- report -------------------------------------------------------- */

for (const w of warnings) console.warn(`warning: ${w}`);

if (errors.length === 0) {
  console.log(`data validation: ${FLOURS.length} flours and ${RECIPES.length} recipes pass`);
  if (warnings.length > 0) console.log(`  (${warnings.length} warnings)`);
  process.exit(0);
}

console.error(`data validation: ${errors.length} errors\n`);
for (const e of errors.slice(0, 50)) console.error(`  ${e}`);
if (errors.length > 50) console.error(`  … and ${errors.length - 50} more`);
process.exit(1);
