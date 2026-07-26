# Legal — read before publishing anything

**Recipe formulas — ingredient lists, percentages, times, temperatures — are
facts and are not copyrightable. The instructional prose around them is.**

The rules this repository holds itself to:

1. **Formulas are stored as data.** Percentages, temperatures and durations in
   `src/data/recipes/` are facts and carry no authorship.
2. **Every word of method text is written originally.** Nothing in
   `src/data/recipes/_steps.ts` or the per-recipe overrides paraphrases a
   book's steps. It is written from the bake, not from the shelf.
3. **Inspiration is attributed by name and link** via `recipe.attribution`,
   and the rendered page says so. Linking to buy the book is honest and good
   relations with authors.
4. **No reproduction of headnotes, sidebars or troubleshooting prose** from
   any published source, anywhere on the site.
5. **The content pipeline carries the same rule as a hard constraint**: never
   reproduce more than a short quoted phrase, always paraphrase, always cite.
   Claims without a captured source URL do not publish (`post_sources` table,
   enforced by the review queue).
6. **The recipe parser processes ingredient lists only** — quantities and
   ingredient names are facts. Method prose is neither stored nor processed.

Also required before launch: cookie consent (GDPR), a privacy policy, the
allergen note on recipes (present in the site footer and recipe pages), and
the disclaimer that fermentation timings are guidance (present in the footer).
