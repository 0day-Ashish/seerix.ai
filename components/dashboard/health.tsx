"use client";

import { useState } from "react";

import { crawl, fmt, issues, type Issue } from "@/components/dashboard/data";
import { Btn, Card, Kpi, PageTitle, Tag } from "@/components/dashboard/kit";

const SEVERITY: Record<
  Issue["severity"],
  { label: string; tone: "signal" | "ink" | "neutral" }
> = {
  error: { label: "Error", tone: "signal" },
  warning: { label: "Warning", tone: "ink" },
  notice: { label: "Notice", tone: "neutral" },
};

const label = (t: string) =>
  t.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/**
 * Technical health: the latest crawl and its issues, grouped by type.
 * Each row opens to say what the issue is and where to look.
 */
export default function Health() {
  const [open, setOpen] = useState<string | null>(issues[0].issue_type);
  const [crawling, setCrawling] = useState(false);
  const errors = issues
    .filter((i) => i.severity === "error")
    .reduce((n, i) => n + i.count, 0);
  const warnings = issues
    .filter((i) => i.severity === "warning")
    .reduce((n, i) => n + i.count, 0);
  const errorTypes = issues.filter((i) => i.severity === "error").length;
  const warningTypes = issues.filter((i) => i.severity === "warning").length;
  // Everything the crawler reached for, including what it could not read.
  const reachable =
    crawl.url_crawled_count + crawl.url_failed_count + crawl.url_blocked_count;
  const blockedPct = (
    ((crawl.url_failed_count + crawl.url_blocked_count) / reachable) *
    100
  ).toFixed(1);
  const when = new Date(crawl.crawl_completed_at).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  return (
    <div>
      <PageTitle
        title="Technical health"
        description="What SeerixBot found on its last pass of the site. Errors first, then what is worth a look."
        action={
          <Btn
            variant="primary"
            disabled={crawling}
            onClick={() => setCrawling(true)}
          >
            {crawling ? "Crawl queued" : "Run a fresh crawl"}
          </Btn>
        }
      />

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Pages crawled"
          value={fmt(crawl.url_crawled_count)}
          sub={`of ${fmt(reachable)} reachable · ${when} UTC`}
        />
        <Kpi
          label="Errors"
          value={String(errors)}
          sub={
            errorTypes
              ? `across ${errorTypes} ${errorTypes === 1 ? "type" : "types"} · fix first`
              : "nothing broken"
          }
        />
        <Kpi
          label="Warnings"
          value={String(warnings)}
          sub={
            warningTypes
              ? `across ${warningTypes} ${warningTypes === 1 ? "type" : "types"} · worth a look`
              : "none outstanding"
          }
        />
        <Kpi
          label="Failed / blocked"
          value={`${crawl.url_failed_count} / ${crawl.url_blocked_count}`}
          sub={`${blockedPct}% of the site unreachable`}
        />
      </div>

      <div className="mt-4">
        <Card
          title="Issues"
          hint="From the latest crawl, most severe first."
          flush
        >
          <ul>
            {issues.map((i) => {
              const on = open === i.issue_type;
              const s = SEVERITY[i.severity];
              return (
                <li
                  key={i.issue_type}
                  className="border-b border-zinc-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i.issue_type)}
                    aria-expanded={on}
                    className="grid w-full grid-cols-[84px_minmax(0,1fr)_auto_20px] items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-zinc-50/80"
                  >
                    <span>
                      <Tag tone={s.tone}>{s.label}</Tag>
                    </span>
                    <span className="truncate font-body text-[14px] text-zinc-900">
                      {label(i.issue_type)}
                    </span>
                    <span className="font-body text-[13.5px] font-medium tabular-nums text-zinc-900">
                      {i.count}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 font-body text-[13px] text-zinc-500">
                      {on ? "−" : "+"}
                    </span>
                  </button>
                  {on && (
                    <div className="px-5 pb-4 sm:pl-[124px]">
                      <p className="font-body text-[13.5px] text-zinc-600">
                        {i.what}
                      </p>
                      <p className="mt-2 break-all rounded-xl bg-zinc-50 px-3.5 py-2.5 font-body text-[13px] text-zinc-800">
                        {i.example}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
