"use client";

import { useEffect, useMemo, useState } from "react";

import {
  account,
  fmt,
  insights,
  pct,
  shortDate,
  summarize,
  wins,
} from "@/components/dashboard/data";
import { BtnLink, Card, DataTable, Delta } from "@/components/dashboard/kit";
import {
  bucket,
  periods,
  presetLabel,
  type Grain,
  type Preset,
} from "@/components/dashboard/range";
import Breakdowns from "@/components/dashboard/breakdowns";
import RangePicker from "@/components/dashboard/range-picker";
import TrafficChart, {
  type Metric,
} from "@/components/dashboard/traffic-chart";

const change = (cur: number, prev: number | undefined) =>
  prev ? (cur - prev) / prev : null;

/** One icon per metric, drawn on a 20px grid. */
const ICONS: Record<Metric, string> = {
  clicks:
    "M8 8l7.5 3-3 1.5L11 16zM4 4l1.5 1.5M8 2v2M2 8h2M4 12l1.5-1.5M12 4l-1.5 1.5",
  impressions:
    "M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10zM10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  ctr: "M4 16L16 4M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  position: "M3 16V9M8 16V4M13 16v-5M18 16H2",
};

/** A 0-100 score as a number over a short bar. */
function Score({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex w-20 items-center justify-end gap-2.5">
      <span className="h-1.5 w-10 overflow-hidden rounded-full bg-zinc-100">
        <span
          className="block h-full rounded-full bg-signal"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </span>
      <span className="w-6 text-right tabular-nums text-zinc-900">{value}</span>
    </span>
  );
}

export default function Overview() {
  const [preset, setPreset] = useState<Preset>("28d");
  const [grain, setGrain] = useState<Grain>("day");
  const [metric, setMetric] = useState<Metric>("clicks");
  const [hello, setHello] = useState<{ date: string; greet: string } | null>(
    null,
  );

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    setHello({
      date: now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      greet:
        h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening",
    });
  }, []);
  const per = useMemo(() => periods(preset), [preset]);
  const { cur: s, prev: sp } = useMemo(
    () => summarize(per.cur, per.prev),
    [per],
  );
  const chart = useMemo(() => bucket(per.cur, per.prev, grain), [per, grain]);

  const tiles: {
    key: Metric;
    label: string;
    value: string;
    delta: React.ReactNode;
    was: string | null;
  }[] = [
    {
      key: "clicks",
      label: "Clicks",
      value: fmt(s.clicks),
      delta: <Delta value={change(s.clicks, sp?.clicks)} />,
      was: sp ? fmt(sp.clicks) : null,
    },
    {
      key: "impressions",
      label: "Impressions",
      value: fmt(s.impressions),
      delta: <Delta value={change(s.impressions, sp?.impressions)} />,
      was: sp ? fmt(sp.impressions) : null,
    },
    {
      key: "ctr",
      label: "Click-through rate",
      value: pct(s.ctr, 1),
      delta: <Delta value={change(s.ctr, sp?.ctr)} />,
      was: sp ? pct(sp.ctr, 1) : null,
    },
    {
      key: "position",
      label: "Average position",
      value: s.position.toFixed(1),
      delta: (
        <Delta value={sp ? s.position - sp.position : null} invert suffix="" />
      ),
      was: sp ? sp.position.toFixed(1) : null,
    },
  ];

  return (
    <div>
      {/* Date and greeting, as Suresign opens. Set after mount, so the
          server and the browser agree on the hour. */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="min-h-5 font-body text-[14px] text-zinc-500">
            {hello?.date}
          </p>
          <h1 className="mt-1.5 font-body text-[32px] font-medium tracking-[-0.025em] text-zinc-900 sm:text-[36px]">
            {hello ? `${hello.greet}, ${account.first_name}` : "Overview"}
          </h1>
          <p className="mt-1 font-body text-[15px] text-zinc-500">
            How arddev.in is doing on Google, compared with the period before.
          </p>
        </div>
        <RangePicker
          preset={preset}
          grain={grain}
          onPreset={(p) => {
            setPreset(p);
            // A long range by day is a blur; switch to weeks for it.
            if (["6m", "8m", "12m", "16m"].includes(p) && grain === "day")
              setGrain("week");
            if (["day", "7d", "14d"].includes(p) && grain !== "day")
              setGrain("day");
          }}
          onGrain={setGrain}
        />
      </div>

      <div
        role="tablist"
        aria-label="Metric"
        className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {tiles.map((t) => {
          const on = t.key === metric;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setMetric(t.key)}
              className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
                on
                  ? "border-zinc-200 bg-zinc-100/80"
                  : "border-zinc-200/80 bg-white hover:bg-zinc-50"
              }`}
            >
              <span className="flex items-center gap-2 font-body text-[14px] text-zinc-600">
                <svg
                  className={`h-4 w-4 ${on ? "text-signal" : "text-zinc-400"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={ICONS[t.key]} />
                </svg>
                {t.label}
              </span>
              <span className="mt-1 flex items-baseline gap-2">
                <span className="font-body text-[30px] font-medium tabular-nums tracking-[-0.02em] text-zinc-900 sm:text-[34px]">
                  {t.value}
                </span>
                {t.delta}
              </span>
              <span className="mt-0.5 block font-body text-[13px] text-zinc-500">
                {t.was ? `${t.was} the period before` : "No earlier data"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <Card flush>
          <div className="px-3 pb-3 pt-5 sm:px-5">
            {/* Keyed so a new range, grain or metric draws the line in again. */}
            <TrafficChart
              key={`${preset}-${grain}-${metric}`}
              days={chart.points}
              prev={chart.before}
              metric={metric}
              grain={grain}
              label={presetLabel(preset)}
            />
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Breakdowns cur={s} prev={sp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card
          title="Active findings"
          hint="What the latest check found, most important first."
          action={<BtnLink href="/app/fix-list">Open fix list</BtnLink>}
          flush
        >
          <DataTable
            head={["Finding", "Priority", "Confidence"]}
            align={["left", "right", "right"]}
            minWidth={520}
            rows={insights.map((i) => [
              <span key="t" className="text-zinc-900">
                {i.insight_title}
              </span>,
              <Score key="p" value={i.priority_score} />,
              <span key="c">{Math.round(i.confidence_score * 100)}%</span>,
            ])}
          />
        </Card>

        <Card
          title="Proof it's working"
          hint={`${wins.tally.wins} of ${wins.tally.verified_total} finished fixes measurably improved traffic.`}
        >
          <ul className="flex flex-col gap-2.5">
            {wins.wins.map((w) => (
              <li
                key={w.title}
                className="flex gap-3 rounded-xl bg-zinc-50 px-3.5 py-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-good-soft text-[11px] text-good-deep">
                  ✓
                </span>
                <div className="min-w-0">
                  <p className="font-body text-[13.5px] leading-[1.45] text-zinc-900">
                    {w.title}
                  </p>
                  <p className="mt-1 font-body text-[12.5px] text-zinc-500">
                    Clicks{" "}
                    <span className="font-medium text-good-deep">
                      ↑{Math.round(w.clicks_delta_pct * 100)}%
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
