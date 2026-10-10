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
        description={`${fmt(crawl.url_crawled_count)} pages crawled · ${crawl.url_failed_count} failed · ${crawl.url_blocked_count} blocked · ${when} UTC`}
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
        <Kpi label="Pages crawled" value={fmt(crawl.url_crawled_count)} />
        <Kpi label="Errors" value={String(errors)} />
        <Kpi label="Warnings" value={String(warnings)} />
        <Kpi
          label="Failed / blocked"
          value={`${crawl.url_failed_count} / ${crawl.url_blocked_count}`}
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
                  className="border-b border-black/[0.06] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i.issue_type)}
                    aria-expanded={on}
                    className="grid w-full grid-cols-[84px_minmax(0,1fr)_auto_16px] items-center gap-4 px-5 py-3.5 text-left hover:bg-black/[0.015]"
                  >
                    <span>
                      <Tag tone={s.tone}>{s.label}</Tag>
                    </span>
                    <span className="truncate font-body text-[14px] text-black">
                      {label(i.issue_type)}
                    </span>
                    <span className="font-mono text-[13px] text-black">
                      {i.count}
                    </span>
                    <span className="font-mono text-[13px] text-zinc-400">
                      {on ? "−" : "+"}
                    </span>
                  </button>
                  {on && (
                    <div className="px-5 pb-4 sm:pl-[124px]">
                      <p className="font-body text-[13.5px] text-zinc-600">
                        {i.what}
                      </p>
                      <p className="mt-2 break-all border-l-2 border-signal pl-3 font-mono text-[12px] text-black">
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
