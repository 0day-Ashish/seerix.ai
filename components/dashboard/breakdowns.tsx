"use client";

import { useEffect, useRef, useState } from "react";

import {
  breakdowns,
  fmt,
  type BreakdownDef,
} from "@/components/dashboard/data";

/* -------------------------------------------------------------------------
 * Breakdown cards under the overview graph: top queries and pages,
 * countries, new rankings and devices. Each row is drawn over a bar sized
 * to its share, with the change against the period before.
 * ---------------------------------------------------------------------- */

type Totals = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type Metric = "clicks" | "impressions" | "ctr" | "position";
type Filter = "all" | "growing" | "decaying";

type Row = {
  key: string;
  label: string;
  icon?: string;
  host?: string;
  cur: Totals;
  prev: Totals | null;
  isNew: boolean;
};

const METRICS: { key: Metric; label: string }[] = [
  { key: "clicks", label: "Clicks" },
  { key: "impressions", label: "Impressions" },
  { key: "ctr", label: "CTR" },
  { key: "position", label: "Position" },
];

/**
 * Turns shares into rows for the period. Countries, devices and pages add
 * up to the total (`whole`); queries don't, as Google hides rare searches.
 */
function buildRows(
  defs: BreakdownDef[],
  cur: Totals,
  prev: Totals | null,
  { whole = false, isNew = false } = {},
): Row[] {
  const w = defs.map((d) => d.share * d.growth);
  const sw = whole ? w.reduce((a, b) => a + b, 0) : 1;
  const sp = whole ? defs.reduce((a, d) => a + d.share, 0) : 1;
  // Pages lower down get seen more for each click.
  const k = defs.map((d) => Math.sqrt(d.pos / 8));
  const sk = whole ? defs.reduce((a, d, i) => a + (w[i] / sw) * k[i], 0) : 1;
  return defs.map((d, i) => {
    const clicks = Math.round(cur.clicks * (w[i] / sw));
    const impressions = Math.max(
      Math.round((cur.impressions * (w[i] / sw) * k[i]) / sk),
      clicks,
    );
    const now: Totals = {
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : 0,
      position: d.pos,
    };
    let before: Totals | null = null;
    if (isNew) {
      before = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    } else if (prev) {
      const pc = Math.round(prev.clicks * (d.share / sp));
      const pi = Math.max(
        Math.round((prev.impressions * (d.share / sp) * k[i]) / sk),
        pc,
      );
      before = {
        clicks: pc,
        impressions: pi,
        ctr: pi ? pc / pi : 0,
        position: Math.round(d.pos * (1 + (d.growth - 1) * 0.2) * 10) / 10,
      };
    }
    return {
      key: d.key,
      label: d.label,
      icon: d.icon,
      host: d.host,
      cur: now,
      prev: before,
      isNew,
    };
  });
}

/** Better (>0), worse (<0) or flat; "new" for rows with nothing before. */
function change(r: Row, m: Metric): number | "new" | null {
  if (!r.prev) return null;
  if (r.isNew) return "new";
  if (m === "position") return r.prev.position - r.cur.position;
  const p = r.prev[m];
  const c = r.cur[m];
  if (!p) return c > 0 ? "new" : 0;
  return (c - p) / p;
}

const show = (v: number, m: Metric) =>
  m === "ctr"
    ? `${(v * 100).toFixed(1)}%`
    : m === "position"
      ? v.toFixed(1)
      : fmt(v);

function Change({ v, m }: { v: number | "new" | null; m: Metric }) {
  if (v == null) return null;
  if (v === "new")
    return (
      <span className="rounded-full bg-good-soft px-1.5 py-px text-[11.5px] font-medium text-good-deep">
        New
      </span>
    );
  if (Math.abs(v) < 0.005)
    return <span className="text-[12px] text-zinc-400">0%</span>;
  const good = v > 0;
  const n =
    m === "position"
      ? Math.abs(v).toFixed(1)
      : `${Math.round(Math.abs(v) * 100)}%`;
  return (
    <span
      className={`text-[12px] font-medium tabular-nums ${good ? "text-good-deep" : "text-danger-deep"}`}
    >
      {good ? "↑" : "↓"}
      {n}
    </span>
  );
}

const DEVICE: Record<string, string> = {
  Desktop: "M2 3.5h12v8H2zM6 14h4M8 11.5V14",
  Mobile: "M4.5 1.5h7v13h-7zM7 12.5h2",
  Tablet: "M3 1.5h10v13H3zM7 12.5h2",
};

function RowIcon({ icon }: { icon?: string }) {
  if (!icon) return null;
  if (DEVICE[icon])
    return (
      <svg
        className="h-4 w-4 shrink-0 text-zinc-500"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={DEVICE[icon]} />
      </svg>
    );
  return (
    <span
      className="w-4 shrink-0 text-center text-[15px] leading-none"
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  dots = [],
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  /** Options to mark with a dot: there is something under them. */
  dots?: T[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex rounded-lg bg-zinc-100 p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={o.key === value}
          onClick={() => onChange(o.key)}
          className={`relative h-7 rounded-md px-2.5 font-body text-[12.5px] transition-colors ${
            o.key === value
              ? "bg-white font-medium text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {o.label}
          {dots.includes(o.key) && o.key !== value && (
            <span
              className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-signal-bright"
              aria-label="has items"
            />
          )}
        </button>
      ))}
    </div>
  );
}

function MetricPicker({
  value,
  onChange,
}: {
  value: Metric;
  onChange: (m: Metric) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) =>
      !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);
  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-7 items-center gap-1 rounded-md px-1.5 font-body text-[13px] font-medium text-signal hover:bg-signal-soft"
      >
        {METRICS.find((m) => m.key === value)!.label}
        <svg
          className="h-3 w-3"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-zinc-200 bg-white p-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)]"
        >
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="menuitemradio"
              aria-checked={m.key === value}
              onClick={() => {
                onChange(m.key);
                setOpen(false);
              }}
              className={`block w-full rounded-lg px-2.5 py-1.5 text-left font-body text-[13px] hover:bg-zinc-100 ${
                m.key === value ? "font-medium text-signal-deep" : "text-zinc-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "growing", label: "Growing" },
  { key: "decaying", label: "Decaying" },
];

const LIMIT = 8;

function BreakdownCard({
  title,
  tabs,
  rowsFor,
  filterable = true,
  note,
  starKey,
  starred: starDefault = [],
}: {
  title: string;
  /** Lets rows be starred; the stars are kept per viewer under this key. */
  starKey?: string;
  starred?: string[];
  /** Optional dimension switch, e.g. Queries / Pages. */
  tabs?: { key: string; label: string }[];
  rowsFor: (tab: string) => Row[];
  filterable?: boolean;
  note?: string;
}) {
  const [tab, setTab] = useState(tabs?.[0].key ?? "");
  const [filter, setFilter] = useState<Filter>("all");
  const [metric, setMetric] = useState<Metric>("clicks");
  const [expanded, setExpanded] = useState(false);
  const [stars, setStars] = useState<string[]>(starDefault);

  // Stars are a per-viewer convenience, so browser storage is enough.
  useEffect(() => {
    if (!starKey) return;
    try {
      const saved = localStorage.getItem(`seerix-stars-${starKey}`);
      if (saved) setStars(JSON.parse(saved));
    } catch {}
  }, [starKey]);

  const toggleStar = (k: string) =>
    setStars((cur) => {
      const next = cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k];
      try {
        localStorage.setItem(`seerix-stars-${starKey}`, JSON.stringify(next));
      } catch {}
      return next;
    });

  const all = rowsFor(tab);
  const matches = (r: Row, f: Filter) => {
    if (f === "all") return true;
    const c = change(r, metric);
    if (c == null) return false;
    if (c === "new") return f === "growing";
    return f === "growing" ? c > 0.005 : c < -0.005;
  };
  const dots = (["growing", "decaying"] as Filter[]).filter((f) =>
    all.some((r) => matches(r, f)),
  );
  const rows = all
    .filter((r) => matches(r, filter))
    .sort((a, b) =>
      metric === "position"
        ? a.cur.position - b.cur.position
        : b.cur[metric] - a.cur[metric],
    );
  const shown = expanded ? rows : rows.slice(0, LIMIT);
  const vals = rows.map((r) => r.cur[metric]);
  const top = Math.max(...vals, 0);
  const best = Math.min(...vals);
  const bar = (v: number) =>
    metric === "position" ? (v ? best / v : 0) : top ? v / top : 0;

  const csv = () => {
    const head =
      "name,clicks,impressions,ctr,position,prev_clicks,prev_impressions";
    const body = rows.map((r) =>
      [
        `"${r.label}"`,
        r.cur.clicks,
        r.cur.impressions,
        r.cur.ctr.toFixed(4),
        r.cur.position,
        r.prev?.clicks ?? "",
        r.prev?.impressions ?? "",
      ].join(","),
    );
    const url = URL.createObjectURL(
      new Blob([[head, ...body].join("\n")], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `seerix-${(tab || title).toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-zinc-200/80 bg-ghost shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pb-3 pt-4">
        <h2 className="flex items-center gap-1.5 font-body text-[15px] font-semibold text-zinc-900">
          {title}
          {note && (
            <span className="group/note relative flex">
              <span
                tabIndex={0}
                aria-label={note}
                className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-zinc-300 text-[10px] font-semibold text-zinc-400"
              >
                i
              </span>
              <span
                role="tooltip"
                className="pointer-events-none absolute -left-2 top-6 z-20 w-60 rounded-lg bg-zinc-900 px-3 py-2 font-body text-[12px] font-normal leading-[1.5] text-white opacity-0 shadow-lg transition-opacity group-hover/note:opacity-100 group-focus-within/note:opacity-100"
              >
                {note}
              </span>
            </span>
          )}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {tabs && (
            <Segmented
              label={`${title} by`}
              value={tab}
              options={tabs}
              onChange={(v) => {
                setTab(v);
                setExpanded(false);
              }}
            />
          )}
          {filterable && (
            <Segmented
              label="Show"
              value={filter}
              options={FILTERS}
              dots={dots}
              onChange={(v) => {
                setFilter(v);
                setExpanded(false);
              }}
            />
          )}
          <MetricPicker value={metric} onChange={setMetric} />
        </div>
      </div>

      {/* Always eight rows tall, so cards side by side line up; "Show all"
          scrolls inside it instead of growing the card. */}
      <ul
        className={`mb-3 flex h-[316px] flex-col gap-1 px-3 ${
          expanded ? "overflow-y-auto overscroll-contain" : "overflow-hidden"
        }`}
      >
        {shown.length === 0 && (
          <li className="px-2 py-6 text-center font-body text-[13px] text-zinc-400">
            Nothing {filter === "growing" ? "growing" : "decaying"} in this
            range.
          </li>
        )}
        {shown.map((r) => (
          <li
            key={r.key}
            className="group relative flex h-9 shrink-0 items-center gap-3 rounded-lg px-2 hover:bg-zinc-50"
          >
            {/* The bar runs up to the numbers, never under them. */}
            <span
              className="absolute inset-y-0 left-0 right-[7rem]"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-lg bg-signal-soft transition-[width] duration-500 group-hover:bg-signal-soft"
                style={{
                  width: `${Math.max(bar(r.cur[metric]), 0.02) * 100}%`,
                }}
              />
            </span>
            <span className="relative flex min-w-0 flex-1 items-center gap-2.5">
              <RowIcon icon={r.icon} />
              <span className="truncate font-body text-[13.5px] text-zinc-800">
                {r.host && <span className="text-zinc-400">{r.host} · </span>}
                {r.label}
              </span>
              {starKey && (
                <button
                  type="button"
                  onClick={() => toggleStar(r.key)}
                  aria-pressed={stars.includes(r.key)}
                  aria-label={
                    stars.includes(r.key)
                      ? `Unstar ${r.label}`
                      : `Star ${r.label}`
                  }
                  className={`-m-1 shrink-0 rounded-md p-1 transition-colors ${
                    stars.includes(r.key)
                      ? "text-warn hover:text-warn"
                      : "text-zinc-300 opacity-0 hover:text-warn focus-visible:opacity-100 group-hover:opacity-100"
                  }`}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill={stars.includes(r.key) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
                  </svg>
                </button>
              )}
            </span>
            <span className="relative flex w-[6.25rem] shrink-0 items-baseline justify-end gap-2">
              <span className="font-body text-[13.5px] font-medium tabular-nums text-zinc-900">
                {show(r.cur[metric], metric)}
              </span>
              <span className="w-12 text-right">
                <Change v={change(r, metric)} m={metric} />
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 px-3 py-2">
        {rows.length > LIMIT ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 font-body text-[12.5px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path
                d={
                  expanded
                    ? "M6 2v4H2M10 14v-4h4M14 6h-4V2M2 10h4v4"
                    : "M2 6V2h4M14 10v4h-4M10 2h4v4M6 14H2v-4"
                }
              />
            </svg>
            {expanded ? "Show less" : `Show all ${rows.length}`}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={csv}
          title="Download CSV"
          aria-label="Download CSV"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
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
            <path d="M6 14.5H5a3.5 3.5 0 0 1-.4-7A5 5 0 0 1 14.3 6a3.5 3.5 0 0 1 .7 6.9M10 10v7M7.5 14.5L10 17l2.5-2.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/** The four cards, for the period's totals and the period before. */
export default function Breakdowns({
  cur,
  prev,
}: {
  cur: Totals;
  prev: Totals | null;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard
        title="Pages"
        starKey="pages"
        starred={["/", "www/pricing", "www/services/nextjs-development"]}
        rowsFor={() => buildRows(breakdowns.pages, cur, prev, { whole: true })}
        note="Star the pages you care about most."
      />
      <BreakdownCard
        title="Content groups"
        starKey="groups"
        starred={["Homepage", "Services"]}
        rowsFor={() => buildRows(breakdowns.groups, cur, prev, { whole: true })}
      />
      <BreakdownCard
        title="Queries"
        rowsFor={() => buildRows(breakdowns.queries, cur, prev)}
        note="Queries don't add up to your total clicks: Google hides rare searches for privacy."
      />
      <BreakdownCard
        title="Countries"
        rowsFor={() =>
          buildRows(breakdowns.countries, cur, prev, { whole: true })
        }
      />
      <BreakdownCard
        title="New rankings"
        filterable={false}
        tabs={[
          { key: "queries", label: "Queries" },
          { key: "pages", label: "Pages" },
        ]}
        rowsFor={(t) =>
          buildRows(
            t === "pages" ? breakdowns.newPages : breakdowns.newQueries,
            cur,
            prev,
            {
              isNew: true,
            },
          )
        }
        note="Searches and pages that started showing on Google in this range."
      />
      <BreakdownCard
        title="Devices"
        rowsFor={() =>
          buildRows(breakdowns.devices, cur, prev, { whole: true })
        }
      />
    </div>
  );
}
