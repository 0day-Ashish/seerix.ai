"use client";

import { useEffect, useRef, useState } from "react";

import { fmt, pct, shortDate, type Day } from "@/components/dashboard/data";

const W = 1000;
const H = 300;
const DRAW_MS = 1400;

const SERIES = {
  clicks: { label: "Clicks", color: "#ff5a1f" },
  impressions: { label: "Impressions", color: "#9a96a0" },
} as const;
type Key = keyof typeof SERIES;

/** Rounds up to 1, 2, 2.5 or 5 × 10ⁿ, so the four gridlines land on even numbers. */
function niceMax(v: number) {
  const exp = 10 ** Math.floor(Math.log10(Math.max(v, 1)));
  const f = v / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * exp;
}

const compact = (n: number) =>
  n >= 1000 ? `${Math.round((n / 1000) * 10) / 10}K` : String(Math.round(n));

/**
 * A monotone cubic curve through the points (Fritsch–Carlson): smooth, but
 * it never overshoots, so a dip never draws below zero or above a peak.
 */
function smooth(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const m = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
  const t = pts.map((_, i) =>
    i === 0
      ? m[0]
      : i === n - 1
        ? m[n - 2]
        : m[i - 1] * m[i] <= 0
          ? 0
          : (m[i - 1] + m[i]) / 2,
  );
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i][0] + h).toFixed(1)} ${(pts[i][1] + t[i] * h).toFixed(1)} ${(
      pts[i + 1][0] - h
    ).toFixed(1)} ${(pts[i + 1][1] - t[i + 1] * h).toFixed(1)} ${pts[
      i + 1
    ][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
}

/** 0 → 1 over DRAW_MS with an ease-out, once per mount; instant for reduced motion. */
function useDrawIn() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let start: number | null = null;
    let id = 0;
    const tick = (now: number) => {
      start ??= now;
      const k = reduce ? 1 : Math.min(1, (now - start) / DRAW_MS);
      setP(1 - (1 - k) ** 3);
      if (k < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return p;
}

/**
 * Clicks over impressions, each on its own scale (clicks left, impressions
 * right). Draws in left to right on open, behind a signal scan line; the
 * legend toggles a series; hover reads out the day.
 */
export default function TrafficChart({ days }: { days: Day[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [off, setOff] = useState<Key[]>([]);
  const p = useDrawIn();

  const max = {
    clicks: niceMax(Math.max(...days.map((d) => d.clicks)) * 1.08),
    impressions: niceMax(Math.max(...days.map((d) => d.impressions)) * 1.08),
  };
  const x = (i: number) => (i / (days.length - 1)) * W;
  const y = (k: Key, v: number) => H - (v / max[k]) * H;
  const line = (k: Key) => smooth(days.map((d, i) => [x(i), y(k, d[k])]));
  const totals = {
    clicks: days.reduce((n, d) => n + d.clicks, 0),
    impressions: days.reduce((n, d) => n + d.impressions, 0),
  };
  const shown = (Object.keys(SERIES) as Key[]).filter((k) => !off.includes(k));

  const step = Math.max(1, Math.floor(days.length / 6));
  const ticks = days
    .map((d, i) => ({ d, i }))
    .filter(({ i }) => i % step === 0);
  const grid = [0, 0.25, 0.5, 0.75, 1];

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || p < 1) return;
    const f = (e.clientX - rect.left) / rect.width;
    setHover(
      Math.max(0, Math.min(days.length - 1, Math.round(f * (days.length - 1)))),
    );
  };
  const h = hover == null ? null : days[hover];
  const hx = hover == null ? 0 : (hover / (days.length - 1)) * 100;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(SERIES) as Key[]).map((k) => {
          const on = !off.includes(k);
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() =>
                setOff((o) =>
                  on
                    ? // Keep at least one line on the chart.
                      o.length === 1
                      ? o
                      : [...o, k]
                    : o.filter((x) => x !== k),
                )
              }
              className={`flex items-center gap-2.5 border px-3 py-1.5 text-left transition-colors ${
                on
                  ? "border-black/[0.12] bg-white"
                  : "border-dashed border-black/[0.12] bg-transparent opacity-50"
              }`}
            >
              <span
                className="h-2 w-2"
                style={{ background: SERIES[k].color }}
              />
              <span className="font-body text-[12.5px] text-zinc-600">
                {SERIES[k].label}
              </span>
              <span className="font-mono text-[12.5px] text-black">
                {fmt(totals[k])}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-[34px_minmax(0,1fr)_40px] gap-x-2 sm:grid-cols-[40px_minmax(0,1fr)_46px] sm:gap-x-3">
        {/* Clicks scale */}
        <div className="relative h-[240px] font-mono text-[10.5px] text-zinc-400 sm:h-[280px]">
          {!off.includes("clicks") &&
            grid.map((g) => (
              <span
                key={g}
                className="absolute right-0 -translate-y-1/2"
                style={{ top: `${(1 - g) * 100}%` }}
              >
                {compact(max.clicks * g)}
              </span>
            ))}
        </div>

        <div
          ref={ref}
          className="relative h-[240px] cursor-crosshair touch-none sm:h-[280px]"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label="Daily clicks and impressions"
          >
            <defs>
              {shown.map((k) => (
                <linearGradient
                  key={k}
                  id={`fill-${k}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={SERIES[k].color}
                    stopOpacity={k === "clicks" ? 0.2 : 0.16}
                  />
                  <stop
                    offset="100%"
                    stopColor={SERIES[k].color}
                    stopOpacity="0"
                  />
                </linearGradient>
              ))}
              <clipPath id="draw-in">
                <rect x="0" y="-10" width={W * p} height={H + 20} />
              </clipPath>
            </defs>

            {grid.map((g) => (
              <line
                key={g}
                x1="0"
                x2={W}
                y1={H * (1 - g)}
                y2={H * (1 - g)}
                stroke={g === 0 ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.06)"}
                strokeDasharray={g === 0 ? undefined : "3 4"}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <g clipPath="url(#draw-in)">
              {/* Impressions behind, clicks on top. */}
              {(["impressions", "clicks"] as Key[])
                .filter((k) => shown.includes(k))
                .map((k) => (
                  <g key={k}>
                    <path
                      d={`${line(k)} L${W} ${H} L0 ${H} Z`}
                      fill={`url(#fill-${k})`}
                      style={{ opacity: p }}
                    />
                    <path
                      d={line(k)}
                      fill="none"
                      stroke={SERIES[k].color}
                      strokeWidth={k === "clicks" ? 2.25 : 1.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                ))}
            </g>

            {/* The scan line that leads the draw-in. */}
            {p < 1 && (
              <line
                x1={W * p}
                x2={W * p}
                y1="0"
                y2={H}
                stroke="#ff5a1f"
                strokeOpacity={0.55 * (1 - p) + 0.15}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {h && (
            <>
              <span
                className="pointer-events-none absolute inset-y-0 w-px bg-black/25"
                style={{ left: `${hx}%` }}
              />
              {shown.map((k) => (
                <span
                  key={k}
                  className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                  style={{
                    left: `${hx}%`,
                    top: `${(y(k, h[k]) / H) * 100}%`,
                    background: SERIES[k].color,
                  }}
                />
              ))}
              <div
                className="pointer-events-none absolute top-0 z-10 w-[164px] bg-[#141416] px-3 py-2.5 font-body text-[12px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                style={{
                  left:
                    hx > 55 ? `calc(${hx}% - 176px)` : `calc(${hx}% + 12px)`,
                }}
              >
                <p className="font-mono text-[11px] text-white/60">
                  {new Date(h.date + "T00:00:00Z").toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </p>
                {(Object.keys(SERIES) as Key[]).map((k) => (
                  <p
                    key={k}
                    className="mt-1.5 flex items-center justify-between gap-4"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2"
                        style={{ background: SERIES[k].color }}
                      />
                      {SERIES[k].label}
                    </span>
                    <span className="font-mono">{fmt(h[k])}</span>
                  </p>
                ))}
                <p className="mt-1.5 flex items-center justify-between gap-4 border-t border-white/10 pt-1.5 text-white/70">
                  CTR
                  <span className="font-mono text-white">
                    {pct(h.clicks / Math.max(h.impressions, 1))}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Impressions scale */}
        <div className="relative h-[240px] font-mono text-[10.5px] text-zinc-400 sm:h-[280px]">
          {!off.includes("impressions") &&
            grid.map((g) => (
              <span
                key={g}
                className="absolute left-0 -translate-y-1/2"
                style={{ top: `${(1 - g) * 100}%` }}
              >
                {compact(max.impressions * g)}
              </span>
            ))}
        </div>

        <div />
        <div className="relative mt-3 h-4 font-mono text-[10.5px] text-zinc-400">
          {ticks.map(({ d, i }, k) => (
            <span
              key={d.date}
              // Every other label on phones, so the dates never collide.
              className={`absolute -translate-x-1/2 whitespace-nowrap first:translate-x-0 ${
                k % 2 ? "hidden sm:inline" : ""
              }`}
              style={{ left: `${(i / (days.length - 1)) * 100}%` }}
            >
              {shortDate(d.date)}
            </span>
          ))}
        </div>
        <div />
      </div>
    </div>
  );
}
