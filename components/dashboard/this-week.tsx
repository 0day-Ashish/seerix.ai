"use client";

import { useState } from "react";

import { digest, fmt, reports, shortDate } from "@/components/dashboard/data";
import {
  BtnLink,
  Card,
  Delta,
  Kpi,
  PageTitle,
  askHref,
} from "@/components/dashboard/kit";

const change = (cur: number, prev: number) =>
  prev > 0 ? (cur - prev) / prev : null;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-body text-[13px] font-medium text-zinc-500">
      {children}
    </h3>
  );
}

/** The plain-text email, set as a letter. */
function Letter({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 font-body text-[13.5px] leading-[1.7] text-zinc-700">
      {text}
    </div>
  );
}

/**
 * The weekly digest: the same composition as the Monday email, then the
 * reports from past weeks.
 */
export default function ThisWeek() {
  const i = digest.input;
  const [email, setEmail] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const report = reports.find((r) => r.report_id === open);

  return (
    <div>
      <PageTitle
        title="This week"
        description={`${shortDate(i.periodStart)} to ${shortDate(i.periodEnd)}, ending on the last day Search Console has data for. The same digest as Monday's email.`}
        action={
          <BtnLink href={askHref("what changed this week")} variant="primary">
            Ask what changed this week
          </BtnLink>
        }
      />

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Clicks"
          value={fmt(i.clicks)}
          delta={<Delta value={change(i.clicks, i.clicksPrev)} />}
        />
        <Kpi
          label="Impressions"
          value={fmt(i.impressions)}
          delta={<Delta value={change(i.impressions, i.impressionsPrev)} />}
        />
        <Kpi
          label="Referring domains"
          value={`+${i.backlinkDelta.newDomains} / −${i.backlinkDelta.lostDomains}`}
          sub="new / lost"
        />
        <Kpi label="Verified wins" value={String(i.wins.length)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <Label>The one thing to do</Label>
          <p className="mt-2.5 font-body text-[19px] font-semibold leading-[1.35] tracking-[-0.01em] text-zinc-900">
            {i.topFix.title}
          </p>
          <p className="mt-3 rounded-xl bg-zinc-50 px-3.5 py-3 font-body text-[13.5px] leading-[1.6] text-zinc-600">
            {i.topFix.evidence}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <BtnLink href="/app/fix-list">Open fix list</BtnLink>
            <span className="font-body text-[13px] text-zinc-500">
              +{i.moreFixCount} more waiting
            </span>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <Label>Biggest movers</Label>
            <ul className="mt-3 flex flex-col gap-3">
              {[
                { m: i.topGainer, up: true },
                { m: i.topLoser, up: false },
              ].map(({ m, up }) => (
                <li
                  key={m.page}
                  className="flex items-start gap-3 rounded-xl bg-zinc-50 px-3.5 py-3"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-body text-[11px] font-semibold ${up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {up ? "↑" : "↓"}
                  </span>
                  <div className="min-w-0">
                    <p className="break-all font-body text-[13px] font-medium text-zinc-900">
                      {m.page}
                    </p>
                    <p className="mt-0.5 font-body text-[12.5px] text-zinc-500">
                      <span className="tabular-nums">
                        {fmt(m.clicksPrev)} → {fmt(m.clicks)}
                      </span>{" "}
                      clicks
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <Label>Wins</Label>
            {i.wins.map((w) => (
              <p
                key={w.title}
                className="mt-3 flex gap-2.5 font-body text-[13.5px] leading-[1.45] text-zinc-900"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] text-emerald-700">
                  ✓
                </span>
                <span>
                  {w.title}{" "}
                  <span className="font-medium tabular-nums text-emerald-600">
                    +{Math.round(w.deltaPct * 100)}% clicks
                  </span>
                </span>
              </p>
            ))}
          </Card>
        </div>
      </div>

      {i.alerts.length > 0 && (
        <div className="mt-4">
          <Card>
            <Label>Alerts this week</Label>
            {i.alerts.map((a) => (
              <p
                key={a.summary}
                className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#fff1ea] px-3.5 py-3 font-body text-[13.5px] text-zinc-900"
              >
                <span className="text-[#c2410c]">⚠</span>
                {a.summary}
              </p>
            ))}
          </Card>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <button
          type="button"
          onClick={() => setEmail((v) => !v)}
          aria-expanded={email}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-zinc-50/80"
        >
          <span className="font-body text-[15px] font-semibold text-zinc-900">
            Read it as the email
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 font-body text-[14px] text-zinc-500">
            {email ? "−" : "+"}
          </span>
        </button>
        {email && (
          <div className="border-t border-zinc-100 p-5">
            <Letter text={digest.text} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Card
          title="Past weeks"
          hint="Every Monday report, as it was sent."
          flush
        >
          <ul>
            {reports.map((r) => {
              const on = r.report_id === open;
              return (
                <li
                  key={r.report_id}
                  className="border-b border-zinc-100 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : r.report_id)}
                    aria-expanded={on}
                    className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-zinc-50/80"
                  >
                    <span className="font-body text-[14px] text-zinc-900">
                      Week of {shortDate(r.period_start)} –{" "}
                      {shortDate(r.period_end)}
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="font-body text-[12.5px] text-zinc-500">
                        Sent {shortDate(r.sent_at)}
                      </span>
                      <span className="font-body text-[13px] font-medium text-link hover:text-link-deep">
                        {on ? "Close" : "Open"}
                      </span>
                    </span>
                  </button>
                  {on && report && (
                    <div className="px-5 pb-5">
                      <Letter text={report.text} />
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
