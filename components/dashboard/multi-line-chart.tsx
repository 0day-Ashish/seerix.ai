"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { fmt } from "@/components/dashboard/data";

export type Series = { name: string; color: string; values: number[] };

const H = 260;
const PAD = { top: 16, right: 56, bottom: 28, left: 44 };

/** A round top for the scale, split into four equal steps. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const raw = v / 4;
  const exp = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((c) => c * exp).find((c) => c >= raw) ?? 10 * exp;
  return step * 4;
}

/**
 * Several sites on one set of axes: a line each, the latest value at its
 * end, a shared hover line with every site's number, and a legend that
 * hides or shows a site.
 */
export default function MultiLineChart({
  series,
  labels,
  unit,
}: {
  series: Series[];
  /** One label per point, e.g. "Apr". */
  labels: string[];
  /** What the numbers count, for the tooltip, e.g. "referring domains". */
  unit: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hidden, setHidden] = useState<string[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [p, setP] = useState(0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Draws in from the left once, like the overview graph.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(Math.max((t - t0) / 1000, 0), 1);
      setP(1 - (1 - k) ** 3);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const shown = series.filter((s) => !hidden.includes(s.name));
  const hi = niceMax(Math.max(...shown.flatMap((s) => s.values), 1));
  const ticks = [0, 1, 2, 3, 4].map((i) => (hi * i) / 4);
  const n = labels.length;
  const iw = Math.max(width - PAD.left - PAD.right, 10);
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n > 1 ? (i / (n - 1)) * iw : iw / 2);
  const y = (v: number) => PAD.top + (1 - v / hi) * ih;

  // End labels can't overlap: push them apart by at least 14px.
  const ends = shown
    .map((s) => ({ s, y: y(s.values[n - 1]) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++)
    if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - PAD.left) / iw) * (n - 1));
    setHover(Math.min(Math.max(i, 0), n - 1));
  };

  return (
    <div>
      <div ref={box} className="relative" style={{ height: H }}>
        {width > 0 && (
          <svg
            width={width}
            height={H}
            className="block touch-none select-none"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`${unit} over time for ${series.map((s) => s.name).join(", ")}`}
          >
            <defs>
              <clipPath id="mlc-clip">
                <rect x="0" y="0" width={PAD.left + iw * p + 4} height={H} />
              </clipPath>
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={PAD.left + iw}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="#dfe2e7"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD.left - 10}
                  y={y(t) + 4}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="12"
                  className="font-body"
                >
                  {fmt(t)}
                </text>
              </g>
            ))}
            {labels.map((l, i) => (
              <text
                key={l + i}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                fill="#71717a"
                fontSize="12"
                className="font-body"
              >
                {l}
              </text>
            ))}

            <g clipPath="url(#mlc-clip)">
              {shown.map((s) => (
                <g key={s.name}>
                  <path
                    d={s.values
                      .map(
                        (v, i) =>
                          `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`,
                      )
                      .join("")}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {s.values.map((v, i) => (
                    <circle
                      key={i}
                      cx={x(i)}
                      cy={y(v)}
                      r={hover === i ? 4.5 : 3}
                      fill="white"
                      stroke={s.color}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              ))}
            </g>

            {p === 1 &&
              ends.map(({ s, y: ly }) => (
                <text
                  key={s.name}
                  x={PAD.left + iw + 10}
                  y={ly + 4}
                  fill={s.color}
                  fontSize="12"
                  fontWeight="600"
                  className="font-body"
                >
                  {fmt(s.values[n - 1])}
                </text>
              ))}

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
          </svg>
        )}

        {hover != null && shown.length > 0 && (
          <div
            className="pointer-events-none absolute top-1 z-10 w-56 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 font-body text-[13px] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)]"
            style={{ left: Math.min(Math.max(x(hover) + 12, 0), width - 224) }}
          >
            <p className="text-[12px] text-zinc-500">
              {labels[hover]} · {unit}
            </p>
            {[...shown]
              .sort((a, b) => b.values[hover] - a.values[hover])
              .map((s) => (
                <p
                  key={s.name}
                  className="mt-1.5 flex items-center justify-between gap-3"
                >
                  <span className="flex min-w-0 items-center gap-2 text-zinc-700">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="truncate">{s.name}</span>
                  </span>
                  <span className="font-medium tabular-nums text-zinc-900">
                    {fmt(s.values[hover])}
                  </span>
                </p>
              ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {series.map((s) => {
          const off = hidden.includes(s.name);
          const first = s.values[0];
          const last = s.values[n - 1];
          const growth = first ? (last - first) / first : 0;
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={!off}
              onClick={() =>
                setHidden((h) =>
                  off
                    ? h.filter((x) => x !== s.name)
                    : // Keep at least one site on the chart.
                      h.length < series.length - 1
                      ? [...h, s.name]
                      : h,
                )
              }
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left font-body transition-colors ${
                off
                  ? "border-zinc-200 bg-white opacity-50 hover:opacity-80"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: off ? "#d4d4d8" : s.color }}
              />
              <span className="text-[13px] font-medium text-zinc-900">
                {s.name}
              </span>
              <span className="text-[12.5px] tabular-nums text-zinc-500">
                {fmt(first)} → {fmt(last)}
              </span>
              <span
                className={`text-[12px] font-medium tabular-nums ${growth >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {growth >= 0 ? "↑" : "↓"}
                {Math.abs(Math.round(growth * 100))}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
