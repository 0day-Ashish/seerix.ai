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
    <h3 className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-zinc-500">
      {children}
    </h3>
  );
}

/** The plain-text email, set as a letter. */
function Letter({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap border border-black/[0.08] bg-[#fbfaf9] px-5 py-4 font-body text-[13.5px] leading-[1.7] text-zinc-700">
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
          <p className="mt-2.5 font-display text-[20px] leading-[1.3] tracking-[-0.015em] text-black">
            {i.topFix.title}
          </p>
          <p className="mt-3 border-l-2 border-signal pl-3 font-body text-[13.5px] leading-[1.6] text-zinc-600">
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
                <li key={m.page} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 font-mono text-[13px] ${up ? "text-[#1f6b3a]" : "text-signal-deep"}`}
                  >
                    {up ? "↑" : "↓"}
                  </span>
                  <div className="min-w-0">
                    <p className="break-all font-mono text-[12.5px] text-black">
                      {m.page}
                    </p>
                    <p className="mt-0.5 font-body text-[12.5px] text-zinc-500">
                      {fmt(m.clicksPrev)} → {fmt(m.clicks)} clicks
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
                className="mt-3 flex gap-2.5 font-body text-[13.5px] leading-[1.45] text-black"
              >
                <span className="text-[#1f6b3a]">✓</span>
                <span>
                  {w.title}{" "}
                  <span className="font-mono text-[12px] text-[#1f6b3a]">
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
                className="mt-3 flex gap-2.5 font-body text-[13.5px] text-black"
              >
                <span className="text-signal-deep">⚠</span>
                {a.summary}
              </p>
            ))}
          </Card>
        </div>
      )}

      <div className="mt-4 border border-black/[0.12] bg-white">
        <button
          type="button"
          onClick={() => setEmail((v) => !v)}
          aria-expanded={email}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="font-display text-[17px] text-black">
            Read it as the email
          </span>
          <span className="font-mono text-[13px] text-zinc-500">
            {email ? "−" : "+"}
          </span>
        </button>
        {email && (
          <div className="border-t border-black/[0.08] p-5">
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
                  className="border-b border-black/[0.06] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : r.report_id)}
                    aria-expanded={on}
                    className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-black/[0.015]"
                  >
                    <span className="font-body text-[14px] text-black">
                      Week of {shortDate(r.period_start)} –{" "}
                      {shortDate(r.period_end)}
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[11.5px] text-zinc-500">
                        sent {shortDate(r.sent_at)}
                      </span>
                      <span className="font-body text-[13px] text-signal-deep">
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
