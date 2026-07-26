import { computeBlend } from '@/engine/blend';
import { requireFlour } from '@/data/flours';
import type { Flour } from '@/engine/types';
import type { Locale } from '@/i18n/routing';

/**
 * How a blend's absorption moves as this flour's share rises, against a
 * reference white flour. Rendered server-side as inline SVG — no chart library,
 * no client JavaScript, no layout shift.
 *
 * The reference is chosen to be an honest comparison rather than a flattering
 * one: a plain European white, which is what most readers actually have.
 */
export function AbsorptionCurve({ flour, locale }: { flour: Flour; locale: Locale }) {
  const nl = locale === 'nl';
  const reference = requireFlour(flour.slug === 'de-550' ? 'fr-t55' : 'de-550');

  const points = Array.from({ length: 11 }, (_, i) => {
    const share = i / 10;
    const blend = computeBlend(
      share === 1
        ? [{ flour, fraction: 1 }]
        : share === 0
          ? [{ flour: reference, fraction: 1 }]
          : [
              { flour, fraction: share },
              { flour: reference, fraction: 1 - share },
            ],
    );
    return { share, absorption: blend.absorption, strength: blend.strength };
  });

  const values = points.map((p) => p.absorption);
  const min = Math.floor(Math.min(...values) - 2);
  const max = Math.ceil(Math.max(...values) + 2);
  const span = Math.max(max - min, 1);

  const W = 640;
  const H = 200;
  const padL = 44;
  const padB = 28;
  const padT = 12;
  const padR = 12;

  const x = (share: number) => padL + share * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / span) * (H - padT - padB);

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.share).toFixed(1)},${y(p.absorption).toFixed(1)}`).join(' ');
  const area = `${line} L${x(1).toFixed(1)},${(H - padB).toFixed(1)} L${x(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;

  const gridValues = [min, min + span / 2, max];

  return (
    <figure className="border border-rule bg-raised p-3">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[20rem] h-auto"
          role="img"
          aria-label={
            nl
              ? `Wateropname loopt van ${points[0]!.absorption}% bij 0% ${flour.name} naar ${points[10]!.absorption}% bij 100%.`
              : `Absorption runs from ${points[0]!.absorption}% at 0% ${flour.name} to ${points[10]!.absorption}% at 100%.`
          }
        >
          {gridValues.map((v) => (
            <g key={v}>
              <line
                x1={padL} x2={W - padR} y1={y(v)} y2={y(v)}
                stroke="rgb(var(--rule))" strokeWidth="1"
              />
              <text
                x={padL - 6} y={y(v) + 4} textAnchor="end"
                fill="rgb(var(--faint))" fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {Math.round(v)}%
              </text>
            </g>
          ))}

          <path d={area} fill="rgb(var(--accent))" fillOpacity="0.09" />
          <path d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth="2" />

          {points.filter((_, i) => i % 5 === 0).map((p) => (
            <g key={p.share}>
              <circle cx={x(p.share)} cy={y(p.absorption)} r="3.5" fill="rgb(var(--accent))" />
              <text
                x={x(p.share)} y={H - padB + 15} textAnchor="middle"
                fill="rgb(var(--faint))" fontSize="11" fontFamily="var(--font-mono)"
              >
                {Math.round(p.share * 100)}%
              </text>
            </g>
          ))}

          {/* emphasised endpoint */}
          <circle cx={x(1)} cy={y(points[10]!.absorption)} r="5" fill="none"
            stroke="rgb(var(--accent))" strokeWidth="2" />
        </svg>
      </div>
      <figcaption className="mt-2 text-[0.78rem] text-soft">
        {nl
          ? `Aandeel ${flour.name} in een mix met ${reference.name}, tegen de berekende wateropname. Van ${points[0]!.absorption}% bij nul procent naar ${points[10]!.absorption}% bij honderd — een verschil van ${Math.round((points[10]!.absorption - points[0]!.absorption) * 10) / 10} punten, ofwel ${Math.round((points[10]!.absorption - points[0]!.absorption) * 10)} gram water per kilo bloem.`
          : `Share of ${flour.name} in a blend with ${reference.name}, against computed absorption. From ${points[0]!.absorption}% at zero per cent to ${points[10]!.absorption}% at a hundred — a difference of ${Math.round((points[10]!.absorption - points[0]!.absorption) * 10) / 10} points, or ${Math.round((points[10]!.absorption - points[0]!.absorption) * 10)} grams of water per kilo of flour.`}
      </figcaption>
    </figure>
  );
}
