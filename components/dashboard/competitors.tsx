"use client";

import { useState } from "react";

import {
  competitorCap,
  competitors as initial,
  fmt,
  intel,
  shortDate,
  suggestions,
} from "@/components/dashboard/data";
import {
  BtnLink,
  Card,
  DataTable,
  PageTitle,
  Spark,
  askHref,
} from "@/components/dashboard/kit";
import { domainColor } from "@/components/gap/kit";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-black/[0.06] px-5 py-3.5 last:border-r-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-display text-[22px] font-medium tracking-[-0.02em] text-black">
        {value}
      </p>
    </div>
  );
}

const pos = (p: number | null) =>
  p == null ? <span className="text-zinc-400">not ranking</span> : p;

/**
 * Competitors: who you track (within the plan's cap), suggestions from your
 * own results pages, and what each profile pull stored.
 */
export default function Competitors() {
  const [tracked, setTracked] = useState(initial);
  const [note, setNote] = useState("");
  const full = tracked.length >= competitorCap;

  const track = (domain: string) => {
    if (full) {
      setNote(`Plan limit: ${competitorCap} competitors. Remove one to swap.`);
      return;
    }
    setTracked((t) => [
      ...t,
      {
        competitor_id: domain,
        competitor_domain: domain,
        created_at: "2026-10-10",
      },
    ]);
    setNote(`Tracking ${domain}. Its profile pull has started.`);
  };

  const history = Object.entries(
    intel.backlink_history.reduce<Record<string, number[]>>((m, h) => {
      (m[h.target_domain] ??= []).push(h.referring_domains);
      return m;
    }, {}),
  );

  return (
    <div>
      <PageTitle
        title="Competitors"
        description={`${tracked.length} of ${competitorCap} tracked on your plan. Link profiles refresh fortnightly.`}
        action={
          <div className="flex flex-wrap gap-2">
            <BtnLink href="/gap/keywords">Keyword Gap</BtnLink>
            <BtnLink href="/gap/backlinks">Backlink Gap</BtnLink>
          </div>
        }
      />

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <Card title="Tracked" flush>
          <ul>
            {tracked.map((c) => (
              <li
                key={c.competitor_id}
                className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-3 last:border-b-0"
              >
                <span className="flex items-center gap-2.5 font-body text-[14px] text-black">
                  <span
                    className="h-2 w-2"
                    style={{
                      background: domainColor[c.competitor_domain] ?? "#c9c6cc",
                    }}
                  />
                  {c.competitor_domain}
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-mono text-[11.5px] text-zinc-500">
                    added {shortDate(c.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTracked((t) =>
                        t.filter((x) => x.competitor_id !== c.competitor_id),
                      );
                      setNote("");
                    }}
                    className="font-body text-[12.5px] text-zinc-500 hover:text-signal-deep"
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
            {tracked.length === 0 && (
              <li className="px-5 py-6 font-body text-[13.5px] text-zinc-500">
                None tracked yet. Pick from the suggestions.
              </li>
            )}
          </ul>
        </Card>

        <Card
          title="Suggestions"
          hint="Domains that share page one with you, from your own results pages."
        >
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => {
              const on = tracked.some((t) => t.competitor_domain === s.domain);
              return (
                <button
                  key={s.domain}
                  type="button"
                  disabled={on}
                  onClick={() => track(s.domain)}
                  className="border border-black/[0.14] bg-white px-3 py-1.5 text-left font-body text-[13px] text-black transition-colors hover:border-signal disabled:border-[#1f6b3a]/30 disabled:bg-[#e5f3ea] disabled:text-[#1f6b3a]"
                >
                  {on ? "✓ " : "+ "}
                  {s.domain}
                  <span className="ml-2 font-mono text-[11px] text-zinc-500">
                    page one on {s.queries_seen} queries
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 min-h-[1.25rem] font-body text-[12.5px] text-zinc-500">
            {note ||
              "Confirming a competitor pulls its keyword and link profile automatically."}
          </p>
        </Card>
      </div>

      {intel.competitors.map((cp) => (
        <section
          key={cp.domain}
          className="mt-4 border border-black/[0.12] bg-white"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] px-5 py-4">
            <h2 className="flex items-center gap-2.5 font-display text-[18px] text-black">
              <span
                className="h-2.5 w-2.5"
                style={{ background: domainColor[cp.domain] }}
              />
              {cp.domain}
            </h2>
            <span className="font-mono text-[11.5px] text-zinc-500">
              captured {shortDate(cp.snapshot.captured_date)}
            </span>
          </div>
          <div className="grid grid-cols-2 border-b border-black/[0.08] sm:grid-cols-4">
            <Stat
              label="Domain rank"
              value={String(cp.snapshot.provider_rank)}
            />
            <Stat
              label="Referring domains"
              value={fmt(cp.snapshot.referring_domains)}
            />
            <Stat label="Backlinks" value={fmt(cp.snapshot.backlinks_total)} />
            <Stat
              label="Ranked keywords"
              value={fmt(cp.snapshot.ranked_keywords)}
            />
          </div>
          <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-black/[0.08]">
            <div className="min-w-0">
              <p className="px-5 pb-2 pt-4 font-body text-[13.5px] font-medium text-black">
                They rank, you don&apos;t (or lower)
              </p>
              <DataTable
                minWidth={420}
                head={["Keyword", "Volume", "Them", "You"]}
                align={["left", "right", "right", "right"]}
                rows={cp.keyword_gap.map((g) => [
                  <span key="k" className="text-black">
                    {g.keyword_text}
                  </span>,
                  fmt(g.search_volume),
                  g.their_position,
                  pos(g.our_position),
                ])}
              />
            </div>
            <div className="min-w-0 border-t border-black/[0.08] lg:border-t-0">
              <p className="px-5 pb-2 pt-4 font-body text-[13.5px] font-medium text-black">
                Their top keywords
              </p>
              <DataTable
                minWidth={420}
                head={["Keyword", "Pos", "Volume", "Page"]}
                align={["left", "right", "right", "left"]}
                rows={cp.top_keywords.map((k) => [
                  <span key="k" className="text-black">
                    {k.keyword_text}
                  </span>,
                  k.position,
                  fmt(k.search_volume),
                  <span key="u" className="font-mono text-[12px]">
                    {k.ranking_url}
                  </span>,
                ])}
              />
            </div>
          </div>
        </section>
      ))}

      <div className="mt-4">
        <Card
          title="Link prospects"
          hint="Sites that link to your competitors but not to you."
          action={
            <BtnLink
              href={askHref(
                "draft an outreach email for the best link prospect",
              )}
              variant="primary"
            >
              Draft outreach for these
            </BtnLink>
          }
          flush
        >
          <DataTable
            head={["Domain", "Rank", "Links to", "Total links", "Spam"]}
            align={["left", "right", "left", "right", "right"]}
            rows={intel.link_gap.map((d) => [
              <span key="d" className="text-signal-deep">
                {d.source_domain}
              </span>,
              d.domain_rank,
              `${d.competitors_linked} competitor${d.competitors_linked === 1 ? "" : "s"}`,
              fmt(d.total_backlinks),
              `${d.spam_score}%`,
            ])}
          />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card
          title="Broken competitor pages you could replace"
          hint="Dead pages that still collect links. Publish a better version and ask for the link."
          flush
        >
          <DataTable
            minWidth={480}
            head={["Dead page", "Links", "Domains", "Example source"]}
            align={["left", "right", "right", "left"]}
            rows={intel.broken_targets.map((b) => [
              <div key="p">
                <p className="font-mono text-[12px] text-black">
                  {b.target_url}
                </p>
                <p className="mt-0.5 font-body text-[12px] text-zinc-500">
                  {b.competitor_domain}
                </p>
              </div>,
              b.links,
              b.domains,
              b.example_source,
            ])}
          />
        </Card>
        <Card title="Their pages that rank for the most keywords" flush>
          <DataTable
            minWidth={480}
            head={["Page", "Keywords", "Volume", "Best"]}
            align={["left", "right", "right", "right"]}
            rows={intel.top_pages.map((t) => [
              <div key="p">
                <p className="font-mono text-[12px] text-black">
                  {t.ranking_url}
                </p>
                <p className="mt-0.5 font-body text-[12px] text-zinc-500">
                  {t.competitor_domain}
                </p>
              </div>,
              t.keywords_count,
              fmt(t.total_volume),
              t.best_position,
            ])}
          />
        </Card>
      </div>

      <div className="mt-4">
        <Card
          title="Referring domains over time"
          hint="You against them, April to September."
        >
          <ul className="flex flex-col">
            {history.map(([dom, vals]) => (
              <li
                key={dom}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-black/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[180px_auto_minmax(0,1fr)]"
              >
                <span className="flex items-center gap-2.5 font-body text-[14px] text-black">
                  <span
                    className="h-2 w-2"
                    style={{ background: domainColor[dom] }}
                  />
                  {dom}
                </span>
                <Spark
                  points={vals}
                  higherIsBetter
                  color={domainColor[dom]}
                  width={120}
                />
                <span className="col-span-2 font-mono text-[12px] text-zinc-500 sm:col-span-1">
                  {fmt(vals[0])} →{" "}
                  <span className="text-black">
                    {fmt(vals[vals.length - 1])}
                  </span>{" "}
                  referring domains
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
