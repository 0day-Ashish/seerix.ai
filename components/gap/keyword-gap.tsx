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
  C: "bg-warn-soft text-warn-deep",
  T: "bg-good-soft text-good-deep",
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
      ? "#be3a36"
      : kd >= 50
        ? "#c2622a"
        : kd >= 30
          ? "#b06a1f"
          : "#2f7d5b";
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <div className="px-5 pb-3 pt-4">
        <p className="font-body text-[15px] font-semibold text-zinc-900">
          {title}
        </p>
        <p className="mt-0.5 font-body text-[12.5px] leading-[1.5] text-zinc-500">
          {note}
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-y border-zinc-100 bg-zinc-50/70 px-5 py-2 font-body text-[12.5px] font-medium text-zinc-500">
        <span>Keyword</span>
        <span>Volume</span>
      </div>
      {rows.slice(0, 5).map((r) => (
        <div
          key={r.keyword}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b border-zinc-100 px-5 py-2.5 last:border-b-0"
        >
          <span className="truncate font-body text-[13px] text-signal">
            {r.keyword}
          </span>
          <span className="font-body text-[13px] tabular-nums text-zinc-700">
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

/**
 * A three-circle Venn: one circle per site, each named beside it, with the
 * number of keywords written in every region -- only one site, any two, or
 * all three.
 */
function Overlap() {
  const [a, b, c] = domains;
  const count = (has: [boolean, boolean, boolean]) =>
    keywordRows.filter((r) =>
      domains.every((d, i) => r.positions[d] > 0 === has[i]),
    ).length;
  const shared = count([true, true, true]);

  // Circle centres and radius on a 300 x 230 canvas.
  const R = 64;
  const circles: [string, number, number][] = [
    [a, 116, 92],
    [b, 184, 92],
    [c, 150, 150],
  ];
  // Where each region's number sits.
  const regions: [[boolean, boolean, boolean], number, number, string][] = [
    [[true, false, false], 86, 80, `Only ${a}`],
    [[false, true, false], 214, 80, `Only ${b}`],
    [[false, false, true], 150, 192, `Only ${c}`],
    [[true, true, false], 150, 68, `${a} and ${b}`],
    [[true, false, true], 116, 138, `${a} and ${c}`],
    [[false, true, true], 184, 138, `${b} and ${c}`],
    [[true, true, true], 150, 112, "All three"],
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
      <div className="px-5 pb-1 pt-4">
        <p className="font-body text-[15px] font-semibold text-zinc-900">
          Keyword overlap
        </p>
        <p className="mt-0.5 font-body text-[12.5px] leading-[1.5] text-zinc-500">
          {shared} keywords all three rank for
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center px-2 py-2">
        <svg
          viewBox="0 0 300 230"
          className="h-52 w-full max-w-[300px]"
          role="img"
          aria-label={`Keyword overlap. ${regions
            .map(([has, , , name]) => `${name}: ${count(has)}`)
            .join(". ")}.`}
        >
          {circles.map(([d, cx, cy]) => (
            <circle
              key={d}
              cx={cx}
              cy={cy}
              r={R}
              fill={domainColor[d]}
              fillOpacity="0.12"
              stroke={domainColor[d]}
              strokeWidth={d === a ? 2 : 1.5}
            />
          ))}
          {regions.map(([has, x, y, name]) => (
            <text
              key={name}
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize={name === "All three" ? 17 : 14}
              fontWeight={name === "All three" ? 700 : 600}
              fill="#18181b"
              className="font-body"
            >
              <title>{`${name}: ${count(has)} keywords`}</title>
              {count(has)}
            </text>
          ))}
          {/* Site names, outside their circles. */}
          <text
            x="52"
            y="22"
            fontSize="12"
            fill={domainColor[a]}
            className="font-body"
            fontWeight="600"
          >
            {a}
          </text>
          <text
            x="248"
            y="22"
            textAnchor="end"
            fontSize="12"
            fill={domainColor[b]}
            className="font-body"
            fontWeight="600"
          >
            {b}
          </text>
          <text
            x="150"
            y="226"
            textAnchor="middle"
            fontSize="12"
            fill={domainColor[c]}
            className="font-body"
            fontWeight="600"
          >
            {c}
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-zinc-100 px-5 py-3">
        {domains.map((d) => (
          <span
            key={d}
            className="flex items-center gap-2 font-body text-[12px] text-zinc-600"
          >
            <Dot domain={d} />
            {d}
            <span className="font-medium tabular-nums text-zinc-900">
              {keywordRows.filter((r) => r.positions[d] > 0).length}
            </span>
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
            <span className="h-3 w-px bg-zinc-200" />
            <span>
              Keywords:{" "}
              <span className="font-medium text-zinc-900">Organic</span>
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

      <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-ghost">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
          <p className="font-body text-[15px] font-semibold text-zinc-900">
            All keyword details
          </p>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3.5 font-body text-[13px] font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
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

        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by keyword"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-body text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-signal-bright focus:outline-none sm:w-64"
          />
          {["Positions", "Volume", "KD", "Intent"].map((f) => (
            <span
              key={f}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 font-body text-[13px] text-zinc-700"
            >
              {f} ▾
            </span>
          ))}
          {picked.size > 0 && (
            <span className="ml-auto font-body text-[13px] text-zinc-600">
              {picked.size} selected ·{" "}
              <button
                type="button"
                className="text-signal hover:text-signal-deep hover:underline hover:underline-offset-[3px]"
              >
                Add to fix list
              </button>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="border-y border-zinc-100 bg-zinc-50/70">
                <th className="w-10 px-4 py-3" />
                <th className="px-3 py-3 text-left">
                  <SortHeader
                    label="Keyword"
                    active={sort.key === "keyword"}
                    dir={sort.dir}
                    onClick={by("keyword")}
                  />
                </th>
                <th className="px-3 py-3 text-left font-body text-[12.5px] font-medium text-zinc-500">
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
                <th className="px-4 py-3 text-right font-body text-[12.5px] font-medium text-zinc-500">
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
                    className={`border-b border-zinc-100 last:border-b-0 ${on ? "bg-signal-soft/50" : "hover:bg-zinc-50/80"}`}
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
                        className="h-4 w-4 rounded accent-signal-bright"
                      />
                    </td>
                    <td className="px-3 py-3 font-body text-[13.5px] text-signal">
                      {r.keyword}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        title={intentName[r.intent]}
                        className={`inline-block w-6 rounded-md py-0.5 text-center font-body text-[11.5px] font-semibold ${intentStyle[r.intent]}`}
                      >
                        {r.intent}
                      </span>
                    </td>
                    {domains.map((d) => (
                      <td
                        key={d}
                        className="px-3 py-3 text-right font-body text-[13.5px] tabular-nums text-zinc-900"
                      >
                        {r.positions[d] || (
                          <span className="text-zinc-300">0</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right font-body text-[13.5px] tabular-nums text-zinc-900">
                      {r.volume.toLocaleString("en-US")}
                    </td>
                    <td className="px-3 py-3 text-right font-body text-[13.5px] tabular-nums text-zinc-900">
                      <Kd kd={r.kd} />
                    </td>
                    <td className="px-3 py-3 text-right font-body text-[13.5px] tabular-nums text-zinc-700">
                      ${r.cpc.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-body text-[13.5px] tabular-nums text-zinc-500">
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
