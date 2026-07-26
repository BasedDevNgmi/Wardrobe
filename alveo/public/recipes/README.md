# Recipe photographs

This directory is empty on purpose. The slot exists; the pictures do not.

## Why there are no images yet

Every photograph on this site has to be a real bake of the formula it sits next
to. Stock bread, a styled set, or a good-looking loaf from a different recipe
would all make the page prettier and make it lie, and the entire premise of this
project is that the numbers and the claims are honest. So the rendering, the
type, and the structured data are all in place, and the files get added as
actual bakes get shot.

## What to add

One image per recipe, named after the recipe slug:

    public/recipes/alledaags-landbrood.jpg

Then reference it from the recipe record:

```ts
image: {
  src: '/recipes/alledaags-landbrood.jpg',
  alt: {
    nl: 'Doorsnede met een onregelmatige, open kruim en grote bellen bij de korst.',
    en: 'Cut face showing an irregular, open crumb with large bubbles near the crust.',
  },
  width: 1600,
  height: 1200,
  credit: 'Name of whoever baked and shot it',
},
```

## The rules

- **A real bake of this formula.** Not a similar bread, not a different
  hydration, not someone else's loaf.
- **Show the crumb.** A cut face is worth more than a glamour shot of a whole
  loaf, because the crumb is the thing the reader is trying to predict.
- **Shoot it as it came out.** No propping, no crumb arranged with tweezers, no
  loaf baked darker than the recipe says just because it photographs better.
- **`alt` describes the crumb, not the mood.** "Open, irregular crumb, slightly
  dense at the base" is useful; "rustic homemade sourdough on a wooden board" is
  not. The alt text is data, which is why the type makes it required and
  bilingual.
- **Set `width` and `height`** to the file's real pixel dimensions so the page
  reserves the space and never jumps while loading.
- **Landscape, roughly 4:3**, at least 1200px wide. Larger than about 1900px
  wide is wasted bytes at the rendered size.

## What stays text-only

The recipe index and the home page. A wall of food photography is what every
other sourdough site looks like, it pushes the actual information below the
fold, and it tells a reader nothing they can act on. Pictures belong on the
recipe page, where someone has already chosen the bread and wants to know what
they are aiming at.
