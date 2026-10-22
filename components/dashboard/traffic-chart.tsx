"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { fmt, type Day } from "@/components/dashboard/data";
import type { Grain, Point } from "@/components/dashboard/range";

export type Metric = "clicks" | "impressions" | "ctr" | "position";

/** The chart line: `signal`, as a literal because SVG needs a value. */
const BLUE = "#11854e";
const H = 280;
const PAD = { top: 12, right: 8, bottom: 28, left: 44 };
const DRAW_MS = 1000;

/** Google's announced updates; drawn as a "G" on the baseline when in range. */
const GOOGLE_UPDATES = [
  { date: "2025-06-30", name: "June 2025 core update" },
  { date: "2025-08-26", name: "August 2025 spam update" },
  { date: "2025-12-11", name: "December 2025 core update" },
  { date: "2026-03-13", name: "March 2026 core update" },
  { date: "2026-06-11", name: "June 2026 core update" },
  { date: "2026-08-19", name: "August 2026 core update" },
  { date: "2026-09-24", name: "September 2026 spam update" },
];

export const metricValue = (d: Day, m: Metric) =>
  m === "ctr"
    ? d.impressions
      ? d.clicks / d.impressions
      : 0
    : m === "position"
      ? d.position
      : d[m];

export const formatMetric = (v: number, m: Metric) =>
  m === "ctr"
    ? `${(v * 100).toFixed(1)}%`
    : m === "position"
      ? v.toFixed(1)
      : fmt(Math.round(v));

const axisLabel = (v: number, m: Metric) =>
  m === "ctr"
    ? `${+(v * 100).toFixed(1)}%`
    : v >= 1000
      ? `${+(v / 1000).toFixed(1)}K`
      : String(+v.toFixed(1));

/** A round top for the scale, split into four equal steps. */
function niceMax(v: number) {
  if (v <= 0) return 1;
  const raw = v / 4;
  const exp = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((c) => c * exp).find((c) => c >= raw) ?? 10 * exp;
  return step * 4;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** 0 → 1 once per mount, so the line draws in from the left. */
function useDrawIn() {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(Math.max((t - t0) / DRAW_MS, 0), 1);
      setP(1 - (1 - k) ** 3);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return p;
}

function IconBtn({
  label,
  onClick,
  d,
}: {
  label: string;
  onClick: () => void;
  d: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
    >
      <svg
        className="h-[18px] w-[18px]"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    </button>
  );
}

function download(name: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const at = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    ...o,
    timeZone: "UTC",
  });

/** Axis labels: months once the span runs past ~4 months, else days. */
const axisDate = (iso: string, grain: Grain, long: boolean) =>
  grain === "month" || long
    ? at(iso, { month: "short", year: "2-digit" }).replace(" ", " ’")
    : at(iso, { month: "short", day: "numeric" });

/** The tooltip's heading for one bucket. */
const bucketDate = (pt: Point, grain: Grain) =>
  grain === "day"
    ? at(pt.date, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : // Weeks and months show their exact days: the first and last can be part ones.
      `${at(pt.date, { month: "short", day: "numeric" })} – ${at(pt.end, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;

/**
 * One metric over the window: a solid line for this period and a dashed one
 * for the period before, on dashed gridlines, with Google's updates marked
 * on the baseline. Straight segments, so each day reads as itself.
 */
export default function TrafficChart({
  days,
  prev,
  metric,
  grain,
  label,
}: {
  days: Point[];
  prev: (Point | null)[];
  metric: Metric;
  grain: Grain;
  /** The period's name in the legend, e.g. "28 days". */
  label: string;
}) {
  const [box, width] = useWidth<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const p = useDrawIn();
  const [hover, setHover] = useState<number | null>(null);

  const cur = days.map((d) => metricValue(d, metric));
  const old = prev.map((d) => (d ? metricValue(d, metric) : null));
  const all = [...cur, ...old.filter((v): v is number => v != null)];
  const invert = metric === "position";
  const lo = invert ? Math.max(Math.floor(Math.min(...all)) - 1, 0) : 0;
  const hi = invert
    ? lo + niceMax(Math.max(...all) - lo)
    : niceMax(Math.max(...all));
  const ticks = [0, 1, 2, 3, 4].map((i) => lo + ((hi - lo) * i) / 4);

  const iw = Math.max(width - PAD.left - PAD.right, 10);
  const ih = H - PAD.top - PAD.bottom;
  const n = days.length;
  const x = (i: number) => PAD.left + (n > 1 ? (i / (n - 1)) * iw : iw / 2);
  const y = (v: number) => {
    const f = (v - lo) / (hi - lo || 1);
    return PAD.top + (invert ? f : 1 - f) * ih;
  };
  // A null breaks the line: the period before can run past the history.
  const line = (vals: (number | null)[]) =>
    vals
      .map((v, i) =>
        v == null
          ? ""
          : `${i && vals[i - 1] != null ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`,
      )
      .join("");
  const long =
    n > 1 &&
    Date.parse(days[n - 1].date) - Date.parse(days[0].date) > 120 * 86_400_000;
  const curPath = line(cur);
  const base = PAD.top + ih;
  const area = `${curPath}L${x(n - 1)} ${base}L${x(0)} ${base}Z`;

  // Which buckets get a date under them: on long ranges, month starts only,
  // thinned evenly to fit; otherwise every k-th bucket.
  const room = Math.max(3, Math.floor(iw / 80));
  const ticksX = (() => {
    if (!long) {
      const k = Math.max(1, Math.ceil(n / room));
      return new Set(days.map((_, i) => i).filter((i) => i % k === 0));
    }
    const starts = days
      .map((d, i) => i)
      .filter(
        (i) =>
          i === 0 || days[i].date.slice(0, 7) !== days[i - 1].date.slice(0, 7),
      );
    const k = Math.max(1, Math.ceil(starts.length / room));
    return new Set(starts.filter((_, j) => j % k === 0));
  })();
  const updates = GOOGLE_UPDATES.map((u) => ({
    ...u,
    i: days.findIndex((d) => d.date <= u.date && u.date <= d.end),
  })).filter((u) => u.i >= 0);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - PAD.left) / iw) * (n - 1));
    setHover(Math.min(Math.max(i, 0), n - 1));
  };

  const hv = hover != null ? cur[hover] : null;
  const ho = hover != null ? old[hover] : null;

  return (
    <div>
      <div ref={box} className="relative" style={{ height: H }}>
        {width > 0 && (
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={H}
            className="block touch-none select-none"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`${metric}, ${label}, by ${grain}`}
          >
            <defs>
              <linearGradient id="tc-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={BLUE} stopOpacity="0.14" />
                <stop offset="1" stopColor={BLUE} stopOpacity="0.01" />
              </linearGradient>
              <clipPath id="tc-clip">
                <rect x="0" y="0" width={PAD.left + iw * p + 2} height={H} />
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
                  {axisLabel(t, metric)}
                </text>
              </g>
            ))}

            {days.map((d, i) =>
              ticksX.has(i) ? (
                <text
                  key={d.date}
                  x={x(i)}
                  y={H - 8}
                  textAnchor={x(i) > PAD.left + iw - 24 ? "end" : "middle"}
                  fill="#71717a"
                  fontSize="12"
                  className="font-body"
                >
                  {axisDate(d.date, grain, long)}
                </text>
              ) : null,
            )}

            <g clipPath="url(#tc-clip)">
              <path d={area} fill="url(#tc-fill)" />
              <path
                d={line(old)}
                fill="none"
                stroke={BLUE}
                strokeOpacity="0.75"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <path
                d={curPath}
                fill="none"
                stroke={BLUE}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Few points: mark each, so a single day still shows. */}
              {n <= 14 &&
                cur.map((v, i) => (
                  <circle
                    key={i}
                    cx={x(i)}
                    cy={y(v)}
                    r="3"
                    fill="white"
                    stroke={BLUE}
                    strokeWidth="1.75"
                  />
                ))}
            </g>

            {updates.map((u) => (
              <g key={u.date} transform={`translate(${x(u.i)} ${base})`}>
                <title>{u.name}</title>
                <circle r="8.5" fill="white" stroke="#dfe2e7" />
                <text
                  y="3.8"
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill="#4285F4"
                  className="font-body"
                >
                  G
                </text>
              </g>
            ))}

            {hover != null && (
              <g pointerEvents="none">
                <line
                  x1={x(hover)}
                  x2={x(hover)}
                  y1={PAD.top}
                  y2={base}
                  stroke="#c7ccd4"
                />
                <circle
                  cx={x(hover)}
                  cy={y(cur[hover])}
                  r="4"
                  fill="white"
                  stroke={BLUE}
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        )}

        {hover != null && hv != null && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-52 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 font-body text-[13px] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)]"
            style={{ left: Math.min(Math.max(x(hover) - 104, 0), width - 208) }}
          >
            <p className="text-[12px] text-zinc-500">
              {bucketDate(days[hover], grain)}
            </p>
            <p className="mt-1.5 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-zinc-600">
                <span
                  className="h-0.5 w-3 rounded-full"
                  style={{ background: BLUE }}
                />
                This period
              </span>
              <span className="font-medium tabular-nums text-zinc-900">
                {formatMetric(hv, metric)}
              </span>
            </p>
            {ho != null && prev[hover] && (
              <p className="mt-1 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-zinc-600">
                  <span
                    className="w-3 border-t-[1.5px] border-dashed"
                    style={{ borderColor: BLUE }}
                  />
                  {grain === "month"
                    ? at(prev[hover]!.date, { month: "short", year: "numeric" })
                    : at(prev[hover]!.date, { month: "short", day: "numeric" })}
                </span>
                <span className="tabular-nums text-zinc-600">
                  {formatMetric(ho, metric)}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-body text-[12.5px] text-zinc-500">
          <span className="flex items-center gap-2">
            <span
              className="h-0.5 w-4 rounded-full"
              style={{ background: BLUE }}
            />
            {label}
          </span>
          <span className="flex items-center gap-2">
            <span
              className="w-4 border-t-[1.5px] border-dashed"
              style={{ borderColor: BLUE }}
            />
            Period before
          </span>
          {updates.length > 0 && (
            <span className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-zinc-300 bg-white text-[9px] font-bold text-[#4285F4]">
                G
              </span>
              Google update
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <IconBtn
            label="Save chart as image"
            d="M3.5 4.5h13v11h-13zM3.5 13l4-4 3 3 2-2 4 4M12.5 7.5h.01"
            onClick={() => {
              if (svgRef.current)
                download(
                  `seerix-${metric}.svg`,
                  "image/svg+xml",
                  new XMLSerializer().serializeToString(svgRef.current),
                );
            }}
          />
          <IconBtn
            label="Download CSV"
            d="M6 14.5H5a3.5 3.5 0 0 1-.4-7A5 5 0 0 1 14.3 6a3.5 3.5 0 0 1 .7 6.9M10 10v7M7.5 14.5L10 17l2.5-2.5"
            onClick={() =>
              download(
                `seerix-${metric}.csv`,
                "text/csv",
                ["from,to,clicks,impressions,position"]
                  .concat(
                    days.map(
                      (d) =>
                        `${d.date},${d.end},${d.clicks},${d.impressions},${d.position}`,
                    ),
                  )
                  .join("\n"),
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
