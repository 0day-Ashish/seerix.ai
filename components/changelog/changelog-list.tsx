"use client";

import { useState } from "react";

import {
  entries,
  type ChangeKind,
  type Entry,
} from "@/components/changelog/entries";

const filters: ("All" | ChangeKind)[] = ["All", "New", "Improved", "Fixed"];

/** New gets the signal; the other kinds stay quiet. */
const tagStyle: Record<ChangeKind, string> = {
  New: "bg-signal text-white",
  Improved: "bg-[#141416] text-white",
  Fixed: "border border-black/[0.18] text-zinc-700",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Check() {
  return (
    <svg
      className="mt-[5px] h-3.5 w-3.5 shrink-0 text-black"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

/* Small product sketches for the bigger releases, drawn in plain markup. */

function Sketch({ kind }: { kind: NonNullable<Entry["sketch"]> }) {
  if (kind === "diagnosis") {
    return (
      <div className="bg-white p-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]">
        <p className="font-mono text-[11px] tracking-[0.08em] text-zinc-500">
          FIX VERIFIED &middot; /PRICING
        </p>
        <div className="mt-3 flex h-16 items-end gap-[3px]">
          {[78, 80, 76, 50, 44, 42, 46, 58, 66, 72, 76, 79].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 ${i === 5 ? "bg-signal" : i > 5 ? "bg-black/30" : "bg-black/[0.12]"}`}
            />
          ))}
        </div>
        <p className="mt-3 font-body text-[13px] text-black">
          Back to position 5, +1,020 clicks a week
        </p>
      </div>
    );
  }
  if (kind === "alerts") {
    return (
      <div className="flex flex-col gap-1.5">
        {[
          ["rivalseo.io moved 7 → 3", true],
          ["New page ranking for “seo audit”", false],
          ["Weekly report ready", false],
        ].map(([t, fresh]) => (
          <div
            key={String(t)}
            className={`flex items-center gap-3 bg-white px-3.5 py-2.5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.4)] ${
              fresh ? "ring-1 ring-signal/50" : ""
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 ${fresh ? "bg-signal" : "bg-black/[0.15]"}`}
            />
            <span className="truncate font-body text-[13px] text-black">
              {t}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      {[
        ["Seerix Pricing – SEO Answers From $39/mo", 42, true],
        ["Plans & Pricing | Seerix SEO Analyst", 36, false],
        ["Seerix Pricing: Search Console Diagnoses", 41, false],
      ].map(([t, n, pick]) => (
        <div
          key={String(t)}
          className={`flex items-center justify-between gap-3 px-3.5 py-2.5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.4)] ${
            pick ? "bg-signal-soft ring-1 ring-signal/50" : "bg-white"
          }`}
        >
          <span className="truncate font-body text-[13px] text-black">{t}</span>
          <span className="shrink-0 font-mono text-[11px] text-zinc-500">
            {n}/60
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The releases, newest first, as one ruled list: date and version in a
 * sticky column on the left, the release on the right. The chips above
 * filter by kind.
 */
export default function ChangelogList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const shown =
    filter === "All" ? entries : entries.filter((e) => e.kind === filter);

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter releases"
        className="flex flex-wrap items-center gap-2"
      >
        <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500">
          Show
        </span>
        {filters.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(f)}
              className={`border px-2.5 py-1.5 font-mono text-[12px] transition-colors ${
                on
                  ? "border-[#141416] bg-[#141416] text-white"
                  : "border-black/[0.12] text-zinc-700 hover:border-black/40 hover:text-black"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ol className="mt-12 border-t border-black/[0.12]">
        {shown.map((e) => (
          <li
            key={e.version}
            className="grid grid-cols-1 gap-6 border-b border-black/[0.12] py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12"
          >
            {/* Date and version, parked while the release scrolls past. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <time
                dateTime={e.date}
                className="font-body text-[15px] text-black"
              >
                {formatDate(e.date)}
              </time>
              <p className="mt-1 font-mono text-[12px] tracking-[0.04em] text-zinc-500">
                v{e.version}
              </p>
            </div>

            <article
              className={`grid min-w-0 grid-cols-1 gap-8 ${e.sketch ? "xl:grid-cols-[minmax(0,1fr)_22rem]" : ""}`}
            >
              <div className="min-w-0">
                <span
                  className={`inline-block px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] ${tagStyle[e.kind]}`}
                >
                  {e.kind}
                </span>
                <h2 className="mt-4 font-display text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-black sm:text-[32px]">
                  {e.title}
                </h2>
                <p className="mt-3 max-w-2xl font-body text-[17px] leading-[1.6] text-zinc-600">
                  {e.summary}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {e.changes.map((c) => (
                    <li key={c} className="flex gap-3">
                      <Check />
                      <span className="font-body text-[16px] leading-[1.5] text-black">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {e.sketch && (
                <div aria-hidden="true" className="self-start bg-[#f3f2ef] p-5">
                  <Sketch kind={e.sketch} />
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>
    </>
  );
}
