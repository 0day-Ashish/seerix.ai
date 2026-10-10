"use client";

import { useMemo, useState } from "react";

import {
  daily,
  fmt,
  insights,
  pct,
  shortDate,
  summary,
  wins,
} from "@/components/dashboard/data";
import {
  BtnLink,
  Card,
  DataTable,
  Delta,
  Kpi,
  PageTitle,
} from "@/components/dashboard/kit";
import TrafficChart from "@/components/dashboard/traffic-chart";

const WINDOWS = [7, 28, 90] as const;

const change = (cur: number, prev: number) =>
  prev > 0 ? (cur - prev) / prev : null;

/** A 0-100 score as a number over a short bar. */
function Score({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex w-16 flex-col items-end gap-1">
      <span className="font-mono text-[12.5px] text-black">{value}</span>
      <span className="h-1 w-full bg-black/[0.08]">
        <span
          className="block h-full bg-[#141416]"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </span>
    </span>
  );
}

export default function Overview() {
  const [win, setWin] = useState<(typeof WINDOWS)[number]>(28);
  const s = useMemo(() => summary(win), [win]);
  const days = useMemo(() => daily.slice(-win), [win]);

  return (
    <div>
      <PageTitle
        title="Overview"
        description="Search Console for arddev.in, compared with the period before."
        action={
          <div
            role="radiogroup"
            aria-label="Window"
            className="flex border border-black/[0.14] bg-white"
          >
            {WINDOWS.map((w) => (
              <button
                key={w}
                type="button"
                role="radio"
                aria-checked={w === win}
                onClick={() => setWin(w)}
                className={`h-9 px-3.5 font-mono text-[12.5px] transition-colors ${
                  w === win
                    ? "bg-[#141416] text-white"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {w}d
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi
          label="Clicks"
          value={fmt(s.clicks)}
          delta={<Delta value={change(s.clicks, s.clicks_prev)} />}
        />
        <Kpi
          label="Impressions"
          value={fmt(s.impressions)}
          delta={<Delta value={change(s.impressions, s.impressions_prev)} />}
        />
        <Kpi
          label="Avg position"
          value={s.average_position.toFixed(1)}
          delta={
            <Delta
              value={s.average_position - s.average_position_prev}
              invert
              suffix=""
            />
          }
        />
        <Kpi
          label="CTR"
          value={pct(s.ctr)}
          delta={<Delta value={change(s.ctr, s.ctr_prev)} />}
        />
        <div className="col-span-2 lg:col-span-1">
          <Kpi
            label="Verified wins"
            value={String(wins.tally.wins)}
            sub={`of ${wins.tally.verified_total} measured fixes`}
          />
        </div>
      </div>

      <div className="mt-4">
        <Card>
          {/* Keyed by window, so switching it draws the chart in again. */}
          <TrafficChart key={win} days={days} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card
          title="Active findings"
          hint="What the latest diagnosis found, highest priority first."
          action={<BtnLink href="/app/fix-list">Open fix list</BtnLink>}
          flush
        >
          <DataTable
            head={["Finding", "Priority", "Confidence"]}
            align={["left", "right", "right"]}
            minWidth={520}
            rows={insights.map((i) => [
              <span key="t" className="text-black">
                {i.insight_title}
              </span>,
              <Score key="p" value={i.priority_score} />,
              <span key="c">{Math.round(i.confidence_score * 100)}%</span>,
            ])}
          />
        </Card>

        <Card
          title="Proof it's working"
          hint={`${wins.tally.wins} of ${wins.tally.verified_total} completed fixes measurably improved. The honest ledger.`}
        >
          <ul className="flex flex-col">
            {wins.wins.map((w) => (
              <li
                key={w.title}
                className="flex gap-3 border-b border-black/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center bg-[#e5f3ea] text-[10px] text-[#1f6b3a]">
                  ✓
                </span>
                <div className="min-w-0">
                  <p className="font-body text-[13.5px] leading-[1.45] text-black">
                    {w.title}
                  </p>
                  <p className="mt-1 font-mono text-[11.5px] text-zinc-500">
                    clicks{" "}
                    <span className="text-[#1f6b3a]">
                      +{Math.round(w.clicks_delta_pct * 100)}%
                    </span>{" "}
                    · verified {shortDate(w.verified_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
