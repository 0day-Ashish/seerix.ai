"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type { Ranking } from "@/components/dashboard/data";

/* -------------------------------------------------------------------------
 * Eight weeks of the whole tracked set, in one chart.
 *
 * Replaces the per-row sparklines: forty small lines showed how each query
 * moved but never whether the set as a whole was improving, and at 96px wide
 * none of them was readable anyway. Average position carries the line;
 * top-ten count is the dashed second series, as the overview chart draws its
 * comparison period.
 *
 * Position is better when lower, so the axis is inverted -- a line going up
 * means ranking improved.
 * ---------------------------------------------------------------------- */

const SIGNAL = "#5a58d1";
const H = 220;
const PAD = { top: 12, right: 40, bottom: 28, left: 44 };

/** A round top for the scale, split into four equal steps. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const raw = v / 4;
  const exp = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((c) => c * exp).find((c) => c >= raw) ?? 10 * exp;
  return step * 4;
}

export default function RankingsTrend({ rows }: { rows: Ranking[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const weeks = rows[0]?.history.length ?? 0;

  // Per week: the mean position of everything ranking, and how many sit in
  // the top ten. Queries that were not ranking that week are left out of the
  // mean rather than counted as a bad position.
  const series = Array.from({ length: weeks }, (_, w) => {
    const placed = rows
      .map((r) => r.history[w]?.p)
      .filter((p): p is number => p != null);
    return {
      avg: placed.length
        ? placed.reduce((n, p) => n + p, 0) / placed.length
        : null,
      top10: placed.filter((p) => p <= 10).length,
    };
  });

  const avgs = series
    .map((s) => s.avg)
    .filter((v): v is number => v != null);
  if (!avgs.length || !width) {
    return <div ref={box} style={{ height: H }} />;
  }

  // Inverted: the worst position sits at the bottom of the plot.
  const worst = niceMax(Math.max(...avgs));
  const topMax = niceMax(Math.max(...series.map((s) => s.top10), 1));

  const iw = width - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) =>
    weeks > 1 ? PAD.left + (i / (weeks - 1)) * iw : PAD.left + iw / 2;
  /** Position: 1 at the top of the plot, `worst` at the bottom. */
  const yPos = (v: number) => PAD.top + (v / worst) * ih;
  const yTop = (v: number) => PAD.top + (1 - v / topMax) * ih;

  const ticks = [0, 1, 2, 3, 4].map((i) => (worst / 4) * i);

  const line = series
    .map((s, i) =>
      s.avg == null ? "" : `${i ? "L" : "M"}${x(i).toFixed(1)} ${yPos(s.avg).toFixed(1)}`,
    )
    .join("");
  const area = `${line}L${x(weeks - 1).toFixed(1)} ${(PAD.top + ih).toFixed(1)}L${x(0).toFixed(1)} ${(PAD.top + ih).toFixed(1)}Z`;
  const topLine = series
    .map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${yTop(s.top10).toFixed(1)}`)
    .join("");

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - PAD.left) / iw) * (weeks - 1));
    setHover(i >= 0 && i < weeks ? i : null);
  };

  const at = hover != null ? series[hover] : null;

  return (
    <div className="relative" ref={box}>
      {width > 0 && (
        <svg
          width={width}
          height={H}
          className="block touch-none select-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`Average position and top-ten count over the last ${weeks} weeks`}
        >
          <defs>
            <linearGradient id="rt-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={SIGNAL} stopOpacity="0.14" />
              <stop offset="1" stopColor={SIGNAL} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={PAD.left + iw}
                y1={yPos(t)}
                y2={yPos(t)}
                stroke="#dfe2e7"
                strokeDasharray="4 4"
              />
              <text
                x={PAD.left - 10}
                y={yPos(t) + 4}
                textAnchor="end"
                fill="#71717a"
                fontSize="12"
                className="font-body"
              >
                {t === 0 ? 1 : t.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Right axis: the dashed line counts queries, so it cannot share
              the position scale on the left without misreading. */}
          {[0, topMax].map((t) => (
            <text
              key={`r${t}`}
              x={PAD.left + iw + 8}
              y={yTop(t) + 4}
              fill={SIGNAL}
              fillOpacity="0.55"
              fontSize="11"
              className="font-body"
            >
              {t}
            </text>
          ))}

          {series.map((_, i) => (
            <text
              key={i}
              x={x(i)}
              y={H - 8}
              textAnchor={x(i) > PAD.left + iw - 24 ? "end" : "middle"}
              fill="#71717a"
              fontSize="12"
              className="font-body"
            >
              {i === weeks - 1 ? "now" : `${weeks - 1 - i}w`}
            </text>
          ))}

          <path d={area} fill="url(#rt-fill)" stroke="none" />
          <path
            d={topLine}
            fill="none"
            stroke={SIGNAL}
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            strokeLinejoin="round"
          />
          <path
            d={line}
            fill="none"
            stroke={SIGNAL}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {hover != null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={PAD.top + ih}
              stroke="#c7ccd4"
              pointerEvents="none"
            />
          )}
          {at?.avg != null && hover != null && (
            <circle
              cx={x(hover)}
              cy={yPos(at.avg)}
              r="4.5"
              fill="white"
              stroke={SIGNAL}
              strokeWidth="2"
              pointerEvents="none"
            />
          )}
        </svg>
      )}

      {at && hover != null && (
        <div
          className="pointer-events-none absolute top-2 z-10 w-48 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 font-body text-[13px] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)]"
          style={{ left: Math.min(Math.max(x(hover) - 96, 4), width - 196) }}
        >
          <p className="text-[12px] text-zinc-500">
            {hover === weeks - 1 ? "This week" : `${weeks - 1 - hover} weeks ago`}
          </p>
          <p className="mt-1.5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-zinc-600">
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ background: SIGNAL }}
              />
              Average position
            </span>
            <span className="font-medium tabular-nums text-zinc-900">
              {at.avg == null ? "—" : at.avg.toFixed(1)}
            </span>
          </p>
          <p className="mt-1 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-zinc-600">
              <span
                className="w-4 border-t-[1.5px] border-dashed"
                style={{ borderColor: SIGNAL }}
              />
              In the top 10
            </span>
            <span className="tabular-nums text-zinc-600">{at.top10}</span>
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-[12.5px] text-zinc-500">
        <span className="flex items-center gap-2">
          <span
            className="h-0.5 w-4 rounded-full"
            style={{ background: SIGNAL }}
          />
          Average position
        </span>
        <span className="flex items-center gap-2">
          <span
            className="w-4 border-t-[1.5px] border-dashed"
            style={{ borderColor: SIGNAL }}
          />
          In the top 10
        </span>
        <span className="text-zinc-400">Higher is better</span>
      </div>
    </div>
  );
}
