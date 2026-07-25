export function round(n: number, digits = 1): number {
  if (!Number.isFinite(n)) return 0;
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function sum(ns: number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}

/** Guard every division in the engine: a NaN on a slider path is a shipped bug. */
export function safeDiv(a: number, b: number, fallback = 0): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return fallback;
  return a / b;
}

/** Format minutes as a human duration: 95 -> "1 u 35 m" / "1 h 35 m". */
export function formatDuration(minutes: number, locale: 'nl' | 'en' = 'nl'): string {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  const hourLabel = locale === 'nl' ? 'u' : 'h';
  if (h === 0) return `${rem} min`;
  if (rem === 0) return `${h} ${hourLabel}`;
  return `${h} ${hourLabel} ${rem} min`;
}

/** Add minutes to a Date without mutating it. */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function formatClock(date: Date, locale: 'nl' | 'en' = 'nl'): string {
  return new Intl.DateTimeFormat(locale === 'nl' ? 'nl-NL' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  }).format(date);
}
