import type { MetadataRoute } from 'next';

/**
 * PWA manifest. The engine runs entirely client-side, so once a recipe page is
 * loaded the calculator, kitchen mode and every converter keep working with no
 * connection — which is the state a phone in a kitchen is usually in.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alveo',
    short_name: 'Alveo',
    description:
      'Elk desemrecept omgerekend naar het meel in jouw kast. Every sourdough recipe recalculated for the flour in your cupboard.',
    start_url: '/nl',
    display: 'standalone',
    background_color: '#EDEFEA',
    theme_color: '#1D5C66',
    orientation: 'portrait',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
