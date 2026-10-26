"use client";

import Link from "next/link";
import { useState } from "react";

import { fixList, type Fix } from "@/components/dashboard/data";
import { Btn, PageTitle, Tag, askHref } from "@/components/dashboard/kit";

function FixRow({
  fix,
  done,
  onDone,
}: {
  fix: Fix;
  done: boolean;
  onDone: () => void;
}) {
  return (
    <li
      className={`grid gap-4 border-b border-zinc-100 px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] ${
        done ? "bg-good-soft/40" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="break-all font-body text-[12.5px] text-zinc-500">
            {fix.page}
          </span>
          <Tag>{fix.effort}</Tag>
        </div>
        <p
          className={`mt-1.5 font-body text-[16px] font-semibold leading-[1.4] tracking-[-0.01em] ${
            done
              ? "text-zinc-500 line-through decoration-zinc-300"
              : "text-zinc-900"
          }`}
        >
          {fix.title}
        </p>
        <p className="mt-2.5 rounded-xl bg-zinc-50 px-3.5 py-3 font-body text-[13.5px] leading-[1.6] text-zinc-600">
          {fix.evidence}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-body text-[12.5px] text-zinc-500">
          <span className="flex items-center gap-2">
            Priority
            <span className="h-1.5 w-12 overflow-hidden rounded-full bg-zinc-100">
              <span
                className="block h-full rounded-full bg-signal-bright"
                style={{ width: `${fix.priority_score}%` }}
              />
            </span>
            <span className="font-medium tabular-nums text-zinc-900">
              {fix.priority_score}
            </span>
          </span>
          <span>
            Confidence{" "}
            <span className="font-medium tabular-nums text-zinc-900">
              {Math.round(fix.confidence_score * 100)}%
            </span>
          </span>
          <Link
            href={askHref(`why is this on my fix list: ${fix.title}`)}
            className="font-body text-[12.5px] font-medium text-signal hover:text-signal-deep"
          >
            Ask why
          </Link>
        </div>
      </div>
      <div className="sm:pt-5">
        {done ? (
          <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-good-soft px-3.5 font-body text-[13px] font-medium text-good-deep">
            ✓ Done · measuring
          </span>
        ) : (
          <Btn onClick={onDone}>Mark done</Btn>
        )}
      </div>
    </li>
  );
}

/**
 * The fix list: what to do now and what to watch. Marking a fix done starts
 * its measurement; verified results show up on the Overview as wins.
 */
export default function FixList() {
  const [done, setDone] = useState<string[]>([]);
  const all = [...fixList.do_now, ...fixList.monitor];
  // What each count is actually made of, so the cells say something beyond
  // the number: the best score waiting, the quickest win, how much of the
  // list is measured.
  const topScore = fixList.do_now.reduce(
    (n, f) => Math.max(n, f.priority_score),
    0,
  );
  const quickest =
    all.find((f) => f.effort === "Minutes")?.effort ??
    all.find((f) => f.effort === "An hour")?.effort ??
    "A day";
  const doNowPages = new Set(fixList.do_now.map((f) => f.page)).size;
  const lowScore = fixList.monitor.length
    ? Math.min(...fixList.monitor.map((f) => f.priority_score))
    : 0;
  const avgConfidence = all.length
    ? Math.round(
        (all.reduce((n, f) => n + (f.confidence_score ?? 0), 0) / all.length) *
          100,
      )
    : 0;
  const cells = [
    {
      label: "Do now",
      value: String(fixList.do_now.length),
      unit: fixList.do_now.length === 1 ? "fix" : "fixes",
      sub: "Highest expected impact, backed by your data.",
      dot: "bg-signal-bright",
      bar: "bg-signal-bright",
      share: all.length
        ? Math.round((fixList.do_now.length / all.length) * 100)
        : 0,
      facts: [
        { k: "Top priority", v: `${topScore}/100` },
        { k: "Quickest", v: quickest },
        { k: "Pages", v: String(doNowPages) },
      ],
    },
    {
      label: "Monitor",
      value: String(fixList.monitor.length),
      unit: fixList.monitor.length === 1 ? "fix" : "fixes",
      sub: "Worth doing; lower impact or still building evidence.",
      dot: "bg-zinc-300",
      bar: "bg-zinc-300",
      share: all.length
        ? Math.round((fixList.monitor.length / all.length) * 100)
        : 0,
      facts: [
        { k: "Avg confidence", v: `${avgConfidence}%` },
        { k: "Lowest priority", v: `${lowScore}/100` },
        { k: "In total", v: String(all.length) },
      ],
    },
    {
      label: "Measuring",
      value: String(done.length),
      unit: done.length === 1 ? "fix" : "fixes",
      sub: done.length
        ? "Marked done. Seerix is watching for the result."
        : "Mark a fix done and Seerix measures whether it worked.",
      dot: done.length ? "bg-warn" : "bg-zinc-200",
      bar: "bg-warn",
      share: all.length ? Math.round((done.length / all.length) * 100) : 0,
      facts: [
        { k: "Verified", v: "0" },
        { k: "Awaiting proof", v: String(done.length) },
        { k: "Remaining", v: String(all.length - done.length) },
      ],
    },
  ];

  const groups = [
    {
      key: "do_now",
      label: "Do now",
      hint: "Highest expected impact, backed by your data.",
      items: fixList.do_now,
    },
    {
      key: "monitor",
      label: "Monitor",
      hint: "Worth doing; lower impact or still building evidence.",
      items: fixList.monitor,
    },
  ];

  return (
    <div>
      <PageTitle
        title="Fix list"
        description="Every fix comes with the evidence behind it. Mark it done and Seerix measures whether it worked."
      />

      {/* Notion-style grid: each cell is a row of its own rather than a
          number floating in a card. The figure leads, a line of context
          follows, and the foot carries what the number is actually made of,
          so the three read as a summary instead of three loose counts. */}
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-body text-[13.5px] text-zinc-500">{c.label}</p>
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
            </div>

            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-body text-[30px] font-medium tabular-nums tracking-[-0.02em] text-zinc-900">
                {c.value}
              </span>
              {c.unit && (
                <span className="font-body text-[13px] text-zinc-400">
                  {c.unit}
                </span>
              )}
            </p>

            <p className="mt-1 font-body text-[13px] leading-[1.5] text-zinc-500">
              {c.sub}
            </p>

            {/* Share of the whole list, so the three cards read against
                each other rather than as isolated counts. */}
            <div className="mt-4 flex items-center gap-2.5">
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <span
                  className={`block h-full rounded-full ${c.bar}`}
                  style={{ width: `${c.share}%` }}
                />
              </span>
              <span className="font-body text-[12px] tabular-nums text-zinc-400">
                {c.share}%
              </span>
            </div>

            <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-100 pt-3">
              {c.facts.map((f) => (
                <div key={f.k} className="flex items-baseline gap-1.5">
                  <dt className="font-body text-[12.5px] text-zinc-400">
                    {f.k}
                  </dt>
                  <dd className="font-body text-[12.5px] font-medium tabular-nums text-zinc-700">
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {groups.map((g) => (
        <section
          key={g.key}
          className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-ghost shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="flex items-baseline justify-between gap-3 border-b border-zinc-100 px-5 py-4">
            <div>
              <h2 className="font-body text-[15px] font-semibold text-zinc-900">
                {g.label}
              </h2>
              <p className="mt-0.5 font-body text-[12.5px] text-zinc-500">
                {g.hint}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 font-body text-[12px] font-medium tabular-nums text-zinc-700">
              {
                g.items.filter((f) => !done.includes(f.recommendation_id))
                  .length
              }{" "}
              open
            </span>
          </div>
          <ul>
            {g.items.map((f) => (
              <FixRow
                key={f.recommendation_id}
                fix={f}
                done={done.includes(f.recommendation_id)}
                onDone={() => setDone((d) => [...d, f.recommendation_id])}
              />
            ))}
          </ul>
        </section>
      ))}

      {done.length === all.length && (
        <p className="mt-6 font-body text-[14px] text-zinc-500">
          Everything is done. New fixes appear after the next diagnosis.
        </p>
      )}
    </div>
  );
}
