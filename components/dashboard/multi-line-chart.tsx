"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { fmt } from "@/components/dashboard/data";

export type Series = { name: string; color: string; values: number[] };

const H = 240;
const PAD = { top: 12, right: 12, bottom: 30, left: 44 };

/** A round top for the scale, split into four equal steps. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const raw = v / 4;
  const exp = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((c) => c * exp).find((c) => c >= raw) ?? 10 * exp;
  return step * 4;
}

const sign = (v: number) => (v < 0 ? -1 : 1);

/**
 * A smooth line that never overshoots its points (monotone in x, the same
 * curve recharts calls "monotone"), as cubic Bézier segments.
 */
function monotonePath(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  if (n === 2) return `M${pts[0][0]},${pts[0][1]}L${pts[1][0]},${pts[1][1]}`;
  const h = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const s = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / (h[i] || 1));
  const m = new Array<number>(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const p = (s[i - 1] * h[i] + s[i] * h[i - 1]) / (h[i - 1] + h[i]);
    m[i] =
      (sign(s[i - 1]) + sign(s[i])) *
        Math.min(Math.abs(s[i - 1]), Math.abs(s[i]), 0.5 * Math.abs(p)) || 0;
  }
  m[0] = (3 * s[0] - m[1]) / 2;
  m[n - 1] = (3 * s[n - 2] - m[n - 2]) / 2;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const dx = (x1 - x0) / 3;
    d += `C${(x0 + dx).toFixed(1)},${(y0 + dx * m[i]).toFixed(1)},${(x1 - dx).toFixed(1)},${(y1 - dx * m[i + 1]).toFixed(1)},${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  return d;
}

/**
 * Several sites on one set of axes, drawn the way the reference draws its
 * visibility chart: smooth lines with no point markers, a dashed grid with no
 * axis lines, fading out at the left edge; hovering drops a dashed guide with
 * a dot on every line and a compact tooltip; the legend sits inline below,
 * each site with its latest value and change, and a click hides it.
 */
export default function MultiLineChart({
  series,
  labels,
  unit,
  headline,
  percent = false,
}: {
  series: Series[];
  /** One label per point, e.g. "Apr". */
  labels: string[];
  /** What the numbers count, for the screen-reader label. */
  unit: string;
  /** Optional big figure over the chart, with its change. */
  headline?: { value: string; delta?: string; up?: boolean };
  /** Values are percentages: shown with "%", changes in points ("pp"). */
  percent?: boolean;
}) {
  const f = (v: number) => (percent ? `${Math.round(v)}%` : fmt(v));
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

  // Draws in from the left once.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(Math.max((t - t0) / 1100, 0), 1);
      setP(1 - (1 - k) ** 3);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const shown = series.filter((s) => !hidden.includes(s.name));
  const hi = percent
    ? Math.min(100, niceMax(Math.max(...shown.flatMap((s) => s.values), 1)))
    : niceMax(Math.max(...shown.flatMap((s) => s.values), 1));
  const ticks = [0, 1, 2, 3, 4].map((i) => (hi * i) / 4);
  const n = labels.length;
  const iw = Math.max(width - PAD.left - PAD.right, 10);
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n > 1 ? (i / (n - 1)) * iw : iw / 2);
  const y = (v: number) => PAD.top + (1 - v / hi) * ih;
  // Thin the x labels so neighbours stay about 64px apart.
  const labelStep = Math.max(1, Math.ceil(n / Math.max(iw / 64, 1)));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - PAD.left) / iw) * (n - 1));
    setHover(Math.min(Math.max(i, 0), n - 1));
  };

  // The tooltip sits beside the guide, flipping to its left near the edge.
  const TIP_W = 168;
  const tipLeft =
    hover == null
      ? 0
      : x(hover) + 14 + TIP_W > width
        ? x(hover) - 14 - TIP_W
        : x(hover) + 14;

  return (
    <div>
      {headline && (
        <p className="mb-5 flex items-baseline gap-2.5">
          {/* The figure fades in from the left, as the reference's does. */}
          <span className="bg-gradient-to-r from-zinc-400 via-zinc-900 to-zinc-900 bg-clip-text font-display text-[48px] font-light leading-none tracking-[-0.03em] text-transparent">
            {headline.value}
          </span>
          {headline.delta && (
            <span
              className={`font-body text-[14px] font-medium tabular-nums ${
                headline.up === false ? "text-danger-deep" : "text-good-deep"
              }`}
            >
              {headline.up === false ? "↓" : "↑"}
              {headline.delta}
            </span>
          )}
        </p>
      )}

      <div
        ref={box}
        className="relative [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%)] [mask-image:linear-gradient(to_right,transparent,black_6%)]"
        style={{ height: H }}
      >
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
                  stroke="#e4e4e7"
                  strokeDasharray="3 3"
                />
                <text
                  x={PAD.left - 10}
                  y={y(t) + 4}
                  textAnchor="end"
                  fill="#a1a1aa"
                  fontSize="11"
                  className="font-body"
                >
                  {f(t)}
                </text>
              </g>
            ))}
            {labels.map((l, i) =>
              i % labelStep !== 0 ? null : (
              <text
                key={l + i}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="11"
                className="font-body"
              >
                {l}
              </text>
              ),
            )}

            {hover != null && (
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={PAD.top + ih}
                stroke="#d4d4d8"
                strokeDasharray="3 3"
                pointerEvents="none"
              />
            )}

            <g clipPath="url(#mlc-clip)">
              {shown.map((s) => (
                <path
                  key={s.name}
                  d={monotonePath(s.values.map((v, i) => [x(i), y(v)]))}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {hover != null &&
              shown.map((s) => (
                <circle
                  key={s.name}
                  cx={x(hover)}
                  cy={y(s.values[hover])}
                  r="4"
                  fill={s.color}
                  stroke="white"
                  strokeWidth="2"
                  pointerEvents="none"
                />
              ))}
          </svg>
        )}

        {hover != null && shown.length > 0 && (
          <div
            className="pointer-events-none absolute top-1 z-10 rounded-lg border border-black/[0.06] bg-white/95 px-3 py-2.5 font-body text-[12px] shadow-[0_8px_24px_-10px_rgba(15,23,42,0.25)] backdrop-blur-sm"
            style={{ left: tipLeft, width: TIP_W }}
          >
            <p className="font-medium text-zinc-900">{labels[hover]}</p>
            {[...shown]
              .sort((a, b) => b.values[hover] - a.values[hover])
              .map((s) => (
                <p
                  key={s.name}
                  className="mt-1.5 flex items-center justify-between gap-3"
                >
                  <span className="truncate text-zinc-500">{s.name}</span>
                  <span className="font-medium tabular-nums text-zinc-900">
                    {f(s.values[hover])}
                  </span>
                </p>
              ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
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
              className={`flex items-center gap-2 font-body text-[13px] transition-opacity ${
                off ? "opacity-40 hover:opacity-70" : "hover:opacity-80"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-zinc-600">{s.name}</span>
              <span className="font-medium tabular-nums text-zinc-900">
                {f(last)}
              </span>
              <span
                className={`tabular-nums ${(percent ? last - first : growth) >= 0 ? "text-good-deep" : "text-danger-deep"}`}
              >
                {(percent ? last - first : growth) >= 0 ? "+" : "−"}
                {percent
                  ? `${Math.abs(Math.round(last - first))} pp`
                  : `${Math.abs(Math.round(growth * 100))}%`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
