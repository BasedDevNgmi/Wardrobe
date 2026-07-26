import type { Config } from 'tailwindcss';

/**
 * The palette is drawn from a miller's analysis certificate rather than from a
 * bakery: cool flour-white with a green-grey bias, ink, and one instrument
 * teal. Deliberately not the warm-cream-and-terracotta a bread site defaults
 * to — this is a measuring tool, and it should look like one.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        sunk: 'rgb(var(--sunk) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        soft: 'rgb(var(--soft) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        rule: 'rgb(var(--rule) / <alpha-value>)',
        ruleStrong: 'rgb(var(--rule-strong) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accentSoft: 'rgb(var(--accent-soft) / <alpha-value>)',
        ok: 'rgb(var(--ok) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      maxWidth: {
        measure: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
