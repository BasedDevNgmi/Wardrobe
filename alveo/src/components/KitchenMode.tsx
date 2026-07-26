'use client';

/**
 * Kitchen mode.
 *
 * Wet hands, flour everywhere, phone propped against the scale. The design
 * constraints are physical: one step at a time, type readable from a metre
 * away, targets big enough to hit with a knuckle, a screen that does not go
 * dark mid-fold, and no dependence on the network — the engine is pure and
 * everything is already in memory.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { formatDuration, roundPreservingTotal } from '@/engine';
import type { BakeResult } from '@/engine/types';
import type { Locale } from '@/i18n/routing';

export function KitchenMode({
  result,
  locale,
  onClose,
}: {
  result: BakeResult;
  locale: Locale;
  onClose: () => void;
}) {
  const nl = locale === 'nl';
  const steps = result.steps;
  const [index, setIndex] = useState(0);
  const step = steps[index];

  /* ---- screen wake lock ------------------------------------------- */
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    let cancelled = false;

    async function acquire() {
      try {
        // Older Safari has no wakeLock; kitchen mode still works, the screen
        // just obeys the system timeout.
        const wl = (navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock;
        if (wl && !cancelled) lock = await wl.request('screen');
      } catch {
        // Denied (low battery, etc.) — non-fatal.
      }
    }

    acquire();
    const revive = () => {
      if (document.visibilityState === 'visible') acquire();
    };
    document.addEventListener('visibilitychange', revive);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', revive);
      lock?.release().catch(() => undefined);
    };
  }, []);

  /* ---- keyboard ----------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length, onClose]);

  if (!step) return null;

  const grams = roundPreservingTotal(step.ingredients.map((i) => i.grams), 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-paper text-ink flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={nl ? 'Keukenmodus' : 'Kitchen mode'}
    >
      {/* progress rail */}
      <div className="flex gap-1 px-4 pt-4" aria-hidden="true">
        {steps.map((s, i) => (
          <div
            key={s.id + i}
            className={clsx(
              'h-1.5 flex-1',
              i < index ? 'bg-accent' : i === index ? 'bg-accent/60' : 'bg-sunk',
            )}
          />
        ))}
      </div>

      <header className="flex items-baseline justify-between px-5 pt-4">
        <p className="font-mono text-sm text-faint tnum">
          {index + 1} / {steps.length}
          {step.minutes > 0 ? ` · ${formatDuration(step.minutes, locale)}` : ''}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-sm uppercase tracking-wider text-faint hover:text-danger px-3 py-2"
        >
          {nl ? 'Sluiten' : 'Close'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
          {step.title[locale]}
        </h1>

        {step.ingredients.length > 0 ? (
          <ul className="mt-6 grid gap-2">
            {step.ingredients.map((ing, i) => (
              <li
                key={ing.key + i}
                className="flex items-baseline justify-between border-b border-rule pb-2"
              >
                <span className="text-xl">{ing.label[locale]}</span>
                <span className="font-mono text-3xl text-accent tnum">{grams[i]} g</span>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-6 text-xl leading-relaxed prose-measure">{step.body[locale]}</p>

        {step.kind === 'fold' && result.folds.count > 0 ? (
          <p className="mt-4 font-mono text-lg text-accent tnum">
            {result.folds.count}× {result.folds.type}:{' '}
            {result.folds.atMinutes.map((m) => formatDuration(m, locale)).join(' · ')}
          </p>
        ) : null}

        {step.minutes >= 5 ? <StepTimer minutes={step.minutes} locale={locale} /> : null}
      </main>

      <nav className="grid grid-cols-2 gap-px bg-rule border-t border-rule">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          className="bg-paper py-6 text-lg font-medium disabled:text-faint hover:bg-raised"
        >
          ← {nl ? 'Vorige' : 'Back'}
        </button>
        <button
          type="button"
          disabled={index === steps.length - 1}
          onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
          className="bg-paper py-6 text-lg font-medium disabled:text-faint hover:bg-raised"
        >
          {nl ? 'Volgende' : 'Next'} →
        </button>
      </nav>
    </div>
  );
}

/**
 * An inline countdown with an audible end. The beep is synthesised with the
 * Web Audio API rather than shipped as an asset — nothing to load, nothing to
 * fail offline.
 */
function StepTimer({ minutes, locale }: { minutes: number; locale: Locale }) {
  const nl = locale === 'nl';
  const total = Math.round(minutes * 60);
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const endRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    setRemaining(total);
    setRunning(false);
    endRef.current = null;
    firedRef.current = false;
  }, [total]);

  const beep = useCallback(() => {
    try {
      type AudioCtor = typeof AudioContext;
      const Ctor: AudioCtor | undefined =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: AudioCtor }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      // Three short tones, spaced — audible over a mixer, not alarming.
      [0, 0.35, 0.7].forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.001, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.28);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.3);
      });
    } catch {
      // No audio — the visual state change still lands.
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (endRef.current === null) return;
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0 && !firedRef.current) {
        firedRef.current = true;
        setRunning(false);
        beep();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, beep]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const done = remaining === 0;

  return (
    <div className="mt-8 border border-rule bg-raised p-4 flex items-center justify-between gap-4">
      <span
        className={clsx('font-mono text-5xl tnum', done ? 'text-ok' : 'text-ink')}
        role="timer"
        aria-live={done ? 'assertive' : 'off'}
      >
        {mm}:{ss}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="border border-accent text-accent px-5 py-3 text-lg font-medium hover:bg-accentSoft"
          onClick={() => {
            if (running) {
              setRunning(false);
            } else {
              endRef.current = Date.now() + remaining * 1000;
              firedRef.current = false;
              setRunning(true);
            }
          }}
        >
          {running ? (nl ? 'Pauze' : 'Pause') : done ? (nl ? 'Klaar' : 'Done') : (nl ? 'Start' : 'Start')}
        </button>
        <button
          type="button"
          className="border border-rule text-soft px-4 py-3 text-lg hover:border-ruleStrong"
          onClick={() => {
            setRunning(false);
            setRemaining(total);
            endRef.current = null;
            firedRef.current = false;
          }}
        >
          {nl ? 'Reset' : 'Reset'}
        </button>
      </div>
    </div>
  );
}
