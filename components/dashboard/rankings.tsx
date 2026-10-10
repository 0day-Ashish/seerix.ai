"use client";

import { useMemo, useState } from "react";

import { rankings, type Ranking } from "@/components/dashboard/data";
import {
  BtnLink,
  Card,
  DataTable,
  Kpi,
  PageTitle,
  Spark,
  Tag,
  askHref,
} from "@/components/dashboard/kit";

const FILTERS = [
  "All",
  "Top 10",
  "Moved",
  "AI Overview",
  "Not ranking",
] as const;
type Filter = (typeof FILTERS)[number];

function pass(r: Ranking, f: Filter) {
  switch (f) {
    case "All":
      return true;
    case "Top 10":
      return r.latest_position != null && r.latest_position <= 10;
    case "Moved":
      return r.change != null && r.change !== 0;
    case "AI Overview":
      return r.ai_overview;
    case "Not ranking":
      return r.latest_position == null;
  }
}

function Change({ value }: { value: number | null }) {
  if (value == null) return <span className="text-zinc-400">—</span>;
  if (value === 0) return <span className="text-zinc-400">=</span>;
  return (
    <span className={value > 0 ? "text-[#1f6b3a]" : "text-signal-deep"}>
      {value > 0 ? "▲" : "▼"} {Math.abs(value)}
    </span>
  );
}

/**
 * The rank tracker: weekly results-page captures for your top queries and
 * seed topics, with the latest position, change, best and an eight-week line.
 */
export default function Rankings() {
  const [filter, setFilter] = useState<Filter>("All");
  const rows = useMemo(
    () =>
      rankings
        .filter((r) => pass(r, filter))
        .sort(
          (a, b) => (a.latest_position ?? 999) - (b.latest_position ?? 999),
        ),
    [filter],
  );
  const ranking = rankings.filter((r) => r.latest_position != null).length;
  const top10 = rankings.filter(
    (r) => r.latest_position != null && r.latest_position <= 10,
  ).length;
  const ai = rankings.filter((r) => r.ai_overview).length;

  return (
    <div>
      <PageTitle
        title="Rankings"
        description="Captured weekly from the live results page for your top queries and seed topics. United States, desktop."
        action={
          <BtnLink
            href={askHref(
              "which of my keywords moved the most this week and why",
            )}
          >
            Ask about a ranking
          </BtnLink>
        }
      />

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Tracked queries" value={String(rankings.length)} />
        <Kpi label="Ranking anywhere" value={String(ranking)} />
        <Kpi label="In the top 10" value={String(top10)} />
        <Kpi label="With an AI Overview" value={String(ai)} />
      </div>

      <div className="mt-4">
        <Card flush>
          <div className="flex gap-1 overflow-x-auto border-b border-black/[0.08] px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => {
              const n = rankings.filter((r) => pass(r, f)).length;
              const on = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-2 px-3 py-1.5 font-body text-[13px] transition-colors ${
                    on
                      ? "bg-[#141416] text-white"
                      : "text-zinc-600 hover:bg-black/[0.04] hover:text-black"
                  }`}
                >
                  {f}
                  <span
                    className={`font-mono text-[11px] ${on ? "text-white/60" : "text-zinc-400"}`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
          <DataTable
            minWidth={960}
            head={[
              "Keyword",
              "Position",
              "Change",
              "Best",
              "Trend · 8w",
              "Page",
              "Features",
            ]}
            align={["left", "right", "right", "right", "left", "left", "left"]}
            rows={rows.map((r) => [
              <div key="k" className="flex flex-col items-start gap-1">
                <span className="text-black">{r.keyword}</span>
                <Tag>{r.query_class}</Tag>
              </div>,
              <span
                key="p"
                className={
                  r.latest_position == null ? "text-zinc-400" : "text-black"
                }
              >
                {r.latest_position ?? "not ranking"}
              </span>,
              <Change key="c" value={r.change} />,
              <span key="b">{r.best_position ?? "—"}</span>,
              <Spark key="s" points={r.history.map((h) => h.p)} />,
              <span
                key="u"
                className="whitespace-nowrap font-mono text-[12px] text-zinc-600"
              >
                {r.ranking_url ?? "—"}
              </span>,
              <div key="f" className="flex flex-wrap gap-1">
                {r.ai_overview && <Tag tone="signal">AI Overview</Tag>}
                {r.features.slice(0, 2).map((f) => (
                  <Tag key={f}>{f.replace(/_/g, " ")}</Tag>
                ))}
              </div>,
            ])}
          />
          {rows.length === 0 && (
            <p className="px-5 py-8 text-center font-body text-[14px] text-zinc-400">
              Nothing in this view.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
