import type { ReactNode } from 'react';
import clsx from 'clsx';
import type { Confidence, Warning } from '@/engine/types';
import type { Locale } from '@/i18n/routing';

export function Stat({
  label,
  value,
  sub,
  tone = 'accent',
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'accent' | 'ink';
}) {
  return (
    <div className="bg-raised border border-rule px-3 py-2.5">
      <div className="label mb-1">{label}</div>
      <div
        className={clsx(
          'font-mono text-2xl leading-none tnum',
          tone === 'accent' ? 'text-accent' : 'text-ink',
        )}
      >
        {value}
      </div>
      {sub ? <div className="mt-1.5 text-[0.72rem] leading-snug text-soft">{sub}</div> : null}
    </div>
  );
}

const CONFIDENCE_COPY: Record<Confidence, { nl: string; en: string; band: number }> = {
  measured: { nl: 'gemeten', en: 'measured', band: 1 },
  'spec-sheet': { nl: 'specificatieblad', en: 'spec sheet', band: 2 },
  estimated: { nl: 'geschat', en: 'estimated', band: 3 },
};

/**
 * Confidence is a first-class element, not a footnote. "Estimated ±3" builds
 * far more trust than a false decimal place, and it is the invitation that
 * makes the calibration loop work.
 */
export function ConfidenceBadge({
  confidence,
  locale,
  showBand = true,
}: {
  confidence: Confidence;
  locale: Locale;
  showBand?: boolean;
}) {
  const c = CONFIDENCE_COPY[confidence];
  return (
    <span
      className={clsx(
        'chip',
        confidence === 'measured' ? 'text-ok' : confidence === 'spec-sheet' ? 'text-accent' : 'text-faint',
      )}
      title={
        locale === 'nl'
          ? 'Hoe zeker zijn we van dit getal? Geschat betekent: typisch voor deze klasse meel, niet afgelezen van een specificatieblad.'
          : 'How sure are we of this number? Estimated means typical for this class of flour, not read off a spec sheet.'
      }
    >
      {locale === 'nl' ? c.nl : c.en}
      {showBand ? ` ±${c.band}` : ''}
    </span>
  );
}

export function WarningList({ warnings, locale }: { warnings: Warning[]; locale: Locale }) {
  if (warnings.length === 0) return null;
  return (
    <ul className="grid gap-2">
      {warnings.map((w) => (
        <li
          key={w.code}
          className={clsx(
            'border-l-[3px] pl-3 py-2 bg-raised',
            w.level === 'danger'
              ? 'border-danger'
              : w.level === 'caution'
                ? 'border-warn'
                : 'border-rule-strong',
          )}
        >
          <p className="text-sm">{w.message[locale]}</p>
          {w.fix ? <p className="mt-1 text-sm text-soft">{w.fix[locale]}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rule-top pt-4 mb-4">
      {eyebrow ? <div className="label mb-1.5">{eyebrow}</div> : null}
      <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
      {children ? <div className="mt-2 prose-measure text-soft">{children}</div> : null}
    </div>
  );
}

export function Callout({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-accentSoft border-l-[3px] border-accent px-4 py-3">
      {label ? <div className="label text-accent mb-1">{label}</div> : null}
      <div className="text-sm prose-measure">{children}</div>
    </div>
  );
}

export function Scroller({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto -mx-1 px-1">{children}</div>;
}
