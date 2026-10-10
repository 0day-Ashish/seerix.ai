"use client";

import { useMemo, useState } from "react";

import {
  domains,
  keywordRows,
  keywordTab,
  type KeywordRow,
  type KeywordTab,
} from "@/components/gap/data";
import {
  Dot,
  DomainBar,
  Pager,
  SortHeader,
  Tabs,
  domainColor,
} from "@/components/gap/kit";

const TABS = [
  "Shared",
  "Missing",
  "Weak",
  "Strong",
  "Untapped",
  "Unique",
  "All",
] as const;
const PAGE = 12;

const intentStyle: Record<string, string> = {
  I: "bg-[#e7eefb] text-[#2a55a8]",
  N: "bg-[#efe9f7] text-[#6a3fa0]",
  C: "bg-[#fbf1dc] text-[#8a5a00]",
  T: "bg-[#e5f3ea] text-[#1f6b3a]",
};
const intentName: Record<string, string> = {
  I: "Informational",
  N: "Navigational",
  C: "Commercial",
  T: "Transactional",
};

type SortKey =
  | "keyword"
  | "volume"
  | "kd"
  | "cpc"
  | "arddev.in"
  | "pixelforge.dev"
  | "buildstack.io";

function compact(n: number) {
  return n >= 1_000_000
    ? `${Math.round(n / 1_000_000)}M`
    : n >= 1000
      ? `${(n / 1000).toFixed(1)}K`
      : `${n}`;
}

/** KD as Semrush shows it: a number with a difficulty-coloured dot. */
function Kd({ kd }: { kd: number }) {
  const c =
    kd >= 70
      ? "#c2410c"
      : kd >= 50
        ? "#ff5a1f"
        : kd >= 30
          ? "#f2b84b"
          : "#4caf7a";
  return (
    <span className="inline-flex items-center gap-1.5">
      {kd}
      <span className="h-2 w-2 rounded-full" style={{ background: c }} />
    </span>
  );
}

/* --- Top opportunities and the overlap diagram ------------------------- */

function Opportunities({
  title,
  rows,
  note,
}: {
  title: string;
  rows: KeywordRow[];
  note: string;
}) {
  return (
    <div className="flex flex-col border border-black/[0.12] bg-white">
      <div className="border-b border-black/[0.08] px-5 py-4">
        <p className="font-display text-[16px] text-black">{title}</p>
        <p className="mt-0.5 font-body text-[12px] text-zinc-500">{note}</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400">
        <span>Keyword</span>
        <span>Volume</span>
      </div>
      {rows.slice(0, 5).map((r) => (
        <div
          key={r.keyword}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-t border-black/[0.05] px-5 py-2.5"
        >
          <span className="truncate font-body text-[13px] text-signal-deep">
            {r.keyword}
          </span>
          <span className="font-mono text-[12px] text-zinc-600">
            {compact(r.volume)}
          </span>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="px-5 py-6 font-body text-[13px] text-zinc-400">
          None in this set.
        </p>
      )}
    </div>
  );
}

/** Three-circle overlap, with each domain's keyword count in its legend. */
function Overlap() {
  const counts = domains.map(
    (d) => keywordRows.filter((r) => r.positions[d] > 0).length,
  );
  const shared = keywordRows.filter((r) => keywordTab(r, "Shared")).length;
  return (
    <div className="flex flex-col border border-black/[0.12] bg-white">
      <div className="border-b border-black/[0.08] px-5 py-4">
        <p className="font-display text-[16px] text-black">Keyword overlap</p>
        <p className="mt-0.5 font-body text-[12px] text-zinc-500">
          {shared} keywords all three rank for
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <svg viewBox="0 0 220 180" className="h-40 w-auto" aria-hidden="true">
          {[
            [85, 72, "arddev.in"],
            [135, 72, "pixelforge.dev"],
            [110, 112, "buildstack.io"],
          ].map(([cx, cy, d]) => (
            <circle
              key={d as string}
              cx={cx as number}
              cy={cy as number}
              r="52"
              fill={domainColor[d as string]}
              fillOpacity="0.16"
              stroke={domainColor[d as string]}
              strokeWidth="1.5"
            />
          ))}
          <text
            x="110"
            y="88"
            textAnchor="middle"
            className="fill-black font-mono text-[13px]"
          >
            {shared}
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-black/[0.08] px-5 py-3">
        {domains.map((d, i) => (
          <span
            key={d}
            className="flex items-center gap-2 font-body text-[12px] text-zinc-600"
          >
            <Dot domain={d} />
            {d}
            <span className="font-mono text-black">{counts[i]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- The page --------------------------------------------------------- */

export default function KeywordGap() {
  const [tab, setTab] = useState<KeywordTab>("Missing");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "volume",
    dir: "desc",
  });
  const [page, setPage] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const counts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((t) => [
          t,
          keywordRows.filter((r) => keywordTab(r, t)).length,
        ]),
      ) as Record<KeywordTab, number>,
    [],
  );

  const rows = useMemo(() => {
    const val = (r: KeywordRow) => {
      if (sort.key === "keyword") return r.keyword;
      if (sort.key in r.positions) {
        const p = r.positions[sort.key as keyof KeywordRow["positions"]];
        return p === 0 ? 999 : p;
      }
      return r[sort.key as "volume" | "kd" | "cpc"];
    };
    return keywordRows
      .filter(
        (r) =>
          keywordTab(r, tab) && r.keyword.includes(query.toLowerCase().trim()),
      )
      .sort((a, b) => {
        const x = val(a),
          y = val(b);
        const c =
          typeof x === "string"
            ? x.localeCompare(y as string)
            : (x as number) - (y as number);
        return sort.dir === "asc" ? c : -c;
      });
  }, [tab, query, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice(page * PAGE, page * PAGE + PAGE);
  const by = (key: SortKey) => () => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "desc" ? "asc" : "desc",
    }));
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <DomainBar
        title="Keyword Gap"
        description="Compare the keywords you rank for against your competitors, and find the ones you're missing."
        extra={
          <>
            <span className="h-3 w-px bg-black/[0.12]" />
            <span>
              Keywords: <span className="text-black">Organic</span>
            </span>
          </>
        }
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <Opportunities
          title="Missing"
          note="Competitors all rank; you don't"
          rows={keywordRows
            .filter((r) => keywordTab(r, "Missing"))
            .sort((a, b) => b.volume - a.volume)}
        />
        <Opportunities
          title="Weak"
          note="You rank, but below every competitor"
          rows={keywordRows
            .filter((r) => keywordTab(r, "Weak"))
            .sort((a, b) => b.volume - a.volume)}
        />
        <Overlap />
      </section>

      <section className="mt-8 border border-black/[0.12] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
          <p className="font-display text-[18px] text-black">
            All keyword details
          </p>
          <button
            type="button"
            className="border border-black/[0.14] px-3 py-1.5 font-body text-[13px] text-black hover:border-black/40"
          >
            Export
          </button>
        </div>
        <div className="mt-3">
          <Tabs
            tabs={TABS}
            counts={counts}
            value={tab}
            onChange={(t) => {
              setTab(t);
              setPage(0);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.08] p-4">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by keyword"
            className="w-full border border-black/[0.14] px-3 py-2 font-body text-[13px] outline-none focus:border-black sm:w-64"
          />
          {["Positions", "Volume", "KD", "Intent"].map((f) => (
            <span
              key={f}
              className="border border-black/[0.14] px-3 py-2 font-body text-[13px] text-zinc-600"
            >
              {f} ▾
            </span>
          ))}
          {picked.size > 0 && (
            <span className="ml-auto font-body text-[13px] text-zinc-600">
              {picked.size} selected ·{" "}
              <button
                type="button"
                className="text-signal-deep hover:underline"
              >
                Add to fix list
              </button>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="border-b border-black/[0.08] bg-[#f7f6f4]">
                <th className="w-10 px-4 py-3" />
                <th className="px-3 py-3 text-left">
                  <SortHeader
                    label="Keyword"
                    active={sort.key === "keyword"}
                    dir={sort.dir}
                    onClick={by("keyword")}
                  />
                </th>
                <th className="px-3 py-3 text-left font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-zinc-500">
                  Intent
                </th>
                {domains.map((d) => (
                  <th key={d} className="px-3 py-3">
                    <SortHeader
                      label={d}
                      active={sort.key === d}
                      dir={sort.dir}
                      onClick={by(d)}
                      align="right"
                    />
                  </th>
                ))}
                <th className="px-3 py-3">
                  <SortHeader
                    label="Volume"
                    active={sort.key === "volume"}
                    dir={sort.dir}
                    onClick={by("volume")}
                    align="right"
                  />
                </th>
                <th className="px-3 py-3">
                  <SortHeader
                    label="KD %"
                    active={sort.key === "kd"}
                    dir={sort.dir}
                    onClick={by("kd")}
                    align="right"
                  />
                </th>
                <th className="px-3 py-3">
                  <SortHeader
                    label="CPC"
                    active={sort.key === "cpc"}
                    dir={sort.dir}
                    onClick={by("cpc")}
                    align="right"
                  />
                </th>
                <th className="px-4 py-3 text-right font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-zinc-500">
                  Results
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const on = picked.has(r.keyword);
                return (
                  <tr
                    key={r.keyword}
                    className={`border-b border-black/[0.05] ${on ? "bg-signal-soft/60" : "hover:bg-black/[0.015]"}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setPicked((s) => {
                            const n = new Set(s);
                            if (n.has(r.keyword)) n.delete(r.keyword);
                            else n.add(r.keyword);
                            return n;
                          })
                        }
                        aria-label={`Select ${r.keyword}`}
                        className="h-4 w-4 accent-[#ff5a1f]"
                      />
                    </td>
                    <td className="px-3 py-3 font-body text-[13.5px] text-signal-deep">
                      {r.keyword}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        title={intentName[r.intent]}
                        className={`inline-block w-6 py-0.5 text-center font-mono text-[11px] ${intentStyle[r.intent]}`}
                      >
                        {r.intent}
                      </span>
                    </td>
                    {domains.map((d) => (
                      <td
                        key={d}
                        className="px-3 py-3 text-right font-mono text-[13px] text-black"
                      >
                        {r.positions[d] || (
                          <span className="text-zinc-300">0</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right font-mono text-[13px] text-black">
                      {r.volume.toLocaleString("en-US")}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[13px] text-black">
                      <Kd kd={r.kd} />
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[13px] text-zinc-700">
                      ${r.cpc.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] text-zinc-500">
                      {compact(r.results)}
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center font-body text-[14px] text-zinc-400"
                  >
                    No keywords match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pager
          page={page}
          pages={pages}
          total={rows.length}
          size={PAGE}
          onPage={setPage}
        />
      </section>
    </div>
  );
}
