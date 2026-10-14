import { daily, LAST_DATE, type Day } from "@/components/dashboard/data";

/* -------------------------------------------------------------------------
 * Date ranges for the traffic chart: the presets in the picker, the period
 * before each one, and grouping days into weeks or months. Everything is
 * measured from the last day Search Console has, not from today.
 * ---------------------------------------------------------------------- */

export type Grain = "day" | "week" | "month";

export type Preset =
  | "day"
  | "7d"
  | "14d"
  | "28d"
  | "last-week"
  | "this-month"
  | "last-month"
  | "this-quarter"
  | "last-quarter"
  | "ytd"
  | "3m"
  | "6m"
  | "8m"
  | "12m"
  | "16m";

/** A bucket on the chart: a day, a week or a month, summed. */
export type Point = Day & { end: string };

const DAY = 86_400_000;
const toMs = (iso: string) => Date.parse(iso + "T00:00:00Z");
const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => toIso(toMs(iso) + n * DAY);
const ymd = (y: number, m: number, d: number) => toIso(Date.UTC(y, m, d));

const L = LAST_DATE;
const ly = +L.slice(0, 4);
const lm = +L.slice(5, 7) - 1;
const FIRST = daily[0].date;

function computeRange(p: Preset): [string, string] {
  const q = Math.floor(lm / 3) * 3;
  switch (p) {
    case "day":
      return [L, L];
    case "7d":
    case "14d":
    case "28d":
      return [addDays(L, -parseInt(p) + 1), L];
    case "last-week": {
      // Monday to Sunday, the full week before the one L falls in.
      const dow = (new Date(toMs(L)).getUTCDay() + 6) % 7;
      const mon = addDays(L, -dow - 7);
      return [mon, addDays(mon, 6)];
    }
    case "this-month":
      return [ymd(ly, lm, 1), L];
    case "last-month":
      return [ymd(ly, lm - 1, 1), ymd(ly, lm, 0)];
    case "this-quarter":
      return [ymd(ly, q, 1), L];
    case "last-quarter":
      return [ymd(ly, q - 3, 1), ymd(ly, q, 0)];
    case "ytd":
      return [ymd(ly, 0, 1), L];
    default: {
      const n = parseInt(p);
      const start = addDays(ymd(ly, lm - n, +L.slice(8, 10)), 1);
      return [start < FIRST ? FIRST : start, L];
    }
  }
}

const fmtDay = (iso: string, year = true) =>
  new Date(toMs(iso)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(year ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });

export const rangeText = ([a, b]: [string, string]) =>
  a === b ? fmtDay(a) : `${fmtDay(a)} – ${fmtDay(b)}`;

export const PRESET_GROUPS: { key: Preset; label: string }[][] = [
  [
    {
      key: "day",
      label: new Date(toMs(L)).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
    },
    { key: "7d", label: "7 days" },
    { key: "14d", label: "14 days" },
    { key: "28d", label: "28 days" },
  ],
  [
    { key: "last-week", label: "Last week" },
    { key: "this-month", label: "This month" },
    { key: "last-month", label: "Last month" },
  ],
  [
    { key: "this-quarter", label: "This quarter" },
    { key: "last-quarter", label: "Last quarter" },
    { key: "ytd", label: "Year to date" },
  ],
  [
    { key: "3m", label: "3 months" },
    { key: "6m", label: "6 months" },
    { key: "8m", label: "8 months" },
    { key: "12m", label: "12 months" },
    { key: "16m", label: "16 months" },
  ],
];

export const presetLabel = (p: Preset) =>
  PRESET_GROUPS.flat().find((x) => x.key === p)!.label;

export const presetRange = computeRange;

const byDate = new Map(daily.map((d) => [d.date, d]));

/**
 * The days in a preset, and the same number of days just before it, lined
 * up index by index. A day before the history starts is null.
 */
export function periods(p: Preset) {
  const [a, b] = computeRange(p);
  const n = Math.round((toMs(b) - toMs(a)) / DAY) + 1;
  const cur: Day[] = [];
  const prev: (Day | null)[] = [];
  for (let i = 0; i < n; i++) {
    const d = byDate.get(addDays(a, i));
    if (d) cur.push(d);
    prev.push(byDate.get(addDays(a, i - n)) ?? null);
  }
  return { range: [a, b] as [string, string], cur, prev };
}

/** The key a day groups under: itself, its Monday, or its month. */
function bucketKey(iso: string, g: Grain) {
  if (g === "day") return iso;
  if (g === "month") return iso.slice(0, 7);
  return addDays(iso, -((new Date(toMs(iso)).getUTCDay() + 6) % 7));
}

function sum(days: Day[], end: string): Point {
  const clicks = days.reduce((n, d) => n + d.clicks, 0);
  const impressions = days.reduce((n, d) => n + d.impressions, 0);
  const position = impressions
    ? days.reduce((n, d) => n + d.position * d.impressions, 0) / impressions
    : days.reduce((n, d) => n + d.position, 0) / days.length;
  return {
    date: days[0].date,
    end,
    clicks,
    impressions,
    position: Math.round(position * 10) / 10,
  };
}

/**
 * Groups the current days by grain, and groups the previous days by the
 * same index runs, so bucket k of each period covers matching days.
 */
export function bucket(cur: Day[], prev: (Day | null)[], g: Grain) {
  const runs: [number, number][] = [];
  cur.forEach((d, i) => {
    const k = bucketKey(d.date, g);
    const last = runs[runs.length - 1];
    if (last && bucketKey(cur[last[0]].date, g) === k) last[1] = i;
    else runs.push([i, i]);
  });
  const points = runs.map(([a, b]) => sum(cur.slice(a, b + 1), cur[b].date));
  const before = runs.map(([a, b]) => {
    const run = prev.slice(a, b + 1);
    return run.every(Boolean) && run.length
      ? sum(run as Day[], (run[run.length - 1] as Day).date)
      : null;
  });
  return { points, before };
}
