"use client";

import Link from "next/link";
import { useState } from "react";

import { fixList, type Fix } from "@/components/dashboard/data";
import { Btn, Kpi, PageTitle, Tag, askHref } from "@/components/dashboard/kit";

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
      className={`grid gap-4 border-b border-black/[0.06] px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] ${
        done ? "bg-[#f7faf8]" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="break-all font-mono text-[12px] text-zinc-500">
            {fix.page}
          </span>
          <Tag>{fix.effort}</Tag>
        </div>
        <p
          className={`mt-1.5 font-display text-[17px] leading-[1.35] tracking-[-0.01em] ${
            done
              ? "text-zinc-500 line-through decoration-black/20"
              : "text-black"
          }`}
        >
          {fix.title}
        </p>
        <p className="mt-2 border-l-2 border-signal pl-3 font-body text-[13.5px] leading-[1.6] text-zinc-600">
          {fix.evidence}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11.5px] text-zinc-500">
          <span className="flex items-center gap-2">
            priority
            <span className="h-1 w-12 bg-black/[0.08]">
              <span
                className="block h-full bg-[#141416]"
                style={{ width: `${fix.priority_score}%` }}
              />
            </span>
            <span className="text-black">{fix.priority_score}</span>
          </span>
          <span>
            confidence{" "}
            <span className="text-black">
              {Math.round(fix.confidence_score * 100)}%
            </span>
          </span>
          <Link
            href={askHref(`why is this on my fix list: ${fix.title}`)}
            className="font-body text-[12.5px] text-signal-deep hover:underline"
          >
            Ask why
          </Link>
        </div>
      </div>
      <div className="sm:pt-5">
        {done ? (
          <span className="inline-flex h-9 items-center gap-2 bg-[#e5f3ea] px-3.5 font-body text-[13px] text-[#1f6b3a]">
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

      <div className="mt-7 grid grid-cols-3 gap-3">
        <Kpi label="Do now" value={String(fixList.do_now.length)} />
        <Kpi label="Monitor" value={String(fixList.monitor.length)} />
        <Kpi label="Measuring" value={String(done.length)} sub="marked done" />
      </div>

      {groups.map((g) => (
        <section
          key={g.key}
          className="mt-6 border border-black/[0.12] bg-white"
        >
          <div className="flex items-baseline justify-between gap-3 border-b border-black/[0.08] px-5 py-4">
            <div>
              <h2 className="font-display text-[17px] text-black">{g.label}</h2>
              <p className="mt-0.5 font-body text-[12.5px] text-zinc-500">
                {g.hint}
              </p>
            </div>
            <span className="font-mono text-[12px] text-zinc-500">
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
