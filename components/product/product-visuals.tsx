"use client";

import { useEffect, useRef, useState } from "react";

import AppFrame from "@/components/product/app-frame";

/**
 * The animated panel at the head of each product page.
 *
 * Each one is a piece of the product's own UI rather than an illustration of
 * it, in the same spirit as trust-visuals and the dashboard's own kit -- real
 * scope names, real figures, every number set in mono. Unlike those, these
 * move: each runs a short loop showing the job being done, because a product
 * page's opener has to show the thing working.
 *
 * Motion is CSS-driven off the `seerix-*` keyframes already in globals.css
 * plus per-panel transitions, so nothing here pulls in a library. Every panel
 * holds its final state under `prefers-reduced-motion`.
 *
 * Decorative: the copy beside each panel carries the same meaning in prose.
 */

const mono = "font-mono text-[11px] tracking-[0.01em]";

/** Steps a loop forward on an interval, holding still for reduced motion. */
function useLoop(length: number, ms: number) {
  const [i, setI] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced.current) {
      setI(length - 1);
      return;
    }
    const id = setInterval(() => setI((n) => (n + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms]);

  return i;
}

/* -------------------------------------------------------------------------
 * Diagnose -- a drop resolving into its causes.
 * The sparkline falls, then the three candidate causes are weighed one by one
 * until the one that explains it is left standing.
 * ---------------------------------------------------------------------- */

export function DiagnoseVisual() {
  const step = useLoop(4, 1600);

  const bars = [62, 68, 71, 66, 74, 70, 58, 44, 31, 28, 33, 30];
  const causes = [
    { label: "Google update", verdict: "ruled out", hit: false },
    { label: "Search demand", verdict: "ruled out", hit: false },
    { label: "Title rewrite", verdict: "the cause", hit: true },
  ];

  return (
    <AppFrame active="chat" title="Why did /pricing lose traffic last week?">
      <div>
        {/* The drop itself. The late bars carry the signal colour once the
            loop reaches them. */}
        <div className="flex h-32 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              style={{
                // Scaled against the tallest bar so the fall is legible
                // rather than eight near-identical blocks.
                height: `${Math.round((h / 74) * 100)}%`,
                transitionDelay: `${i * 30}ms`,
              }}
              className={`w-full flex-1 rounded-[3px] transition-colors duration-500 ${
                step >= 1 && i > 6
                  ? "bg-signal"
                  : // Before the drop the bars are solid enough to read as a
                    // level, so the fall after it has something to fall from.
                    "bg-zinc-300"
              }`}
            />
          ))}
        </div>

        <p className={`mt-5 ${mono} text-zinc-400`}>CANDIDATE CAUSES</p>

        <div className="mt-2.5 overflow-hidden rounded-lg border border-black/[0.07]">
          {causes.map((cause, i) => {
            const tested = step >= i + 1;
            return (
              <div
                key={cause.label}
                className={`flex items-center justify-between gap-4 px-3.5 py-2.5 transition-colors duration-500 ${
                  i > 0 ? "border-t border-black/[0.06]" : ""
                } ${tested && cause.hit ? "bg-signal-soft" : ""}`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500 ${
                      !tested
                        ? "bg-black/[0.12]"
                        : cause.hit
                          ? "bg-signal"
                          : "bg-black/[0.18]"
                    }`}
                  />
                  <span
                    className={`font-body text-[13px] transition-colors duration-500 ${
                      tested && cause.hit ? "text-signal-deep" : "text-black"
                    }`}
                  >
                    {cause.label}
                  </span>
                </span>
                <span
                  className={`shrink-0 ${mono} transition-opacity duration-500 ${
                    tested ? "opacity-100" : "opacity-0"
                  } ${cause.hit ? "text-signal-deep" : "text-zinc-400"}`}
                >
                  {cause.verdict}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AppFrame>
  );
}

/* -------------------------------------------------------------------------
 * Prioritize -- a fix list sorting itself.
 * The rows arrive unscored, then each takes its impact score and the list
 * settles into order.
 * ---------------------------------------------------------------------- */

export function PrioritizeVisual() {
  const step = useLoop(5, 1200);

  const fixes = [
    { label: "/pricing title rewrite", score: 94, effort: "S" },
    { label: "Internal links to /docs", score: 81, effort: "S" },
    { label: "Merge 3 competing pages", score: 67, effort: "M" },
    { label: "Refresh /blog/seo-guide", score: 42, effort: "L" },
  ];

  return (
    <AppFrame active="fix-list" title="Fix list">
      <div>
        <div className="flex flex-col gap-2.5">
          {fixes.map((fix, i) => {
            const scored = step >= i + 1;
            return (
              <div
                key={fix.label}
                className="flex items-center gap-3 rounded-lg border border-black/[0.07] px-3.5 py-2.5"
              >
                <span className={`${mono} w-5 shrink-0 text-zinc-400`}>
                  0{i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-body text-[13px] text-black">
                  {fix.label}
                </span>

                {/* The score bar fills as the row is weighed. */}
                <span className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-black/[0.08] sm:block">
                  <span
                    style={{ width: scored ? `${fix.score}%` : "0%" }}
                    className="block h-full rounded-full bg-signal transition-[width] duration-700 ease-out"
                  />
                </span>

                <span
                  className={`${mono} w-7 shrink-0 text-right transition-opacity duration-500 ${
                    scored ? "text-signal-deep opacity-100" : "opacity-0"
                  }`}
                >
                  {fix.score}
                </span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${mono} ${
                    fix.effort === "S"
                      ? "border-good/30 bg-good-soft text-good-deep"
                      : fix.effort === "M"
                        ? "border-warn/30 bg-warn-soft text-warn-deep"
                        : "border-black/[0.10] text-zinc-400"
                  }`}
                >
                  {fix.effort}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AppFrame>
  );
}

/* -------------------------------------------------------------------------
 * Watch -- a position being tracked, and the alert that fires.
 * The rank line walks across, slips, and an alert arrives on the drop.
 * ---------------------------------------------------------------------- */

export function WatchVisual() {
  const step = useLoop(8, 700);

  // Position 1 is top, so the path is drawn inverted: lower rank sits lower.
  const ranks = [4, 4, 5, 4, 6, 9, 11, 11];
  const x = (i: number) => 8 + (i * 184) / (ranks.length - 1);
  const y = (r: number) => 8 + ((r - 1) * 44) / 12;
  const alerted = step >= 6;

  return (
    <AppFrame active="rankings" title="Tracking &middot; &ldquo;seo audit tool&rdquo;">
      <div>
        <div className="flex items-center justify-between">
          <span className={`${mono} text-zinc-400`}>POSITION</span>
          <span
            className={`${mono} transition-colors duration-500 ${
              alerted ? "text-danger-deep" : "text-zinc-400"
            }`}
          >
            {ranks[step]}
          </span>
        </div>

        <svg
          viewBox="0 0 200 60"
          className="mt-3 h-32 w-full"
          fill="none"
        >
          {[0, 1, 2].map((g) => (
            <line
              key={g}
              x1="0"
              x2="200"
              y1={10 + g * 18}
              y2={10 + g * 18}
              stroke="currentColor"
              strokeWidth="0.4"
              className="text-black/[0.07]"
            />
          ))}

          {/* The track so far: redrawn up to the current step. */}
          <polyline
            points={ranks
              .slice(0, step + 1)
              .map((r, i) => `${x(i)},${y(r)}`)
              .join(" ")}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={
              alerted ? "text-danger transition-colors" : "text-signal"
            }
          />
          <circle
            cx={x(step)}
            cy={y(ranks[step])}
            r="2.4"
            className={`transition-all duration-500 ${
              alerted ? "fill-danger" : "fill-signal"
            }`}
          />
        </svg>

        {/* The alert, arriving on the drop. */}
        <div
          className={`mt-4 flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 transition-all duration-500 ${
            alerted
              ? "translate-y-0 border-danger/30 bg-danger-soft opacity-100"
              : "pointer-events-none translate-y-1 border-transparent opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
          <span className="font-body text-[13px] text-black">
            Dropped 4 → 11 overnight
          </span>
          <span className={`ml-auto shrink-0 ${mono} text-zinc-400`}>
            alert sent
          </span>
        </div>
      </div>
    </AppFrame>
  );
}

/* -------------------------------------------------------------------------
 * Create -- a title being written, with the rule it followed.
 * The variants type themselves in, each citing its guideline.
 * ---------------------------------------------------------------------- */

export function CreateVisual() {
  const step = useLoop(3, 2200);

  const variants = [
    {
      text: "SEO Audit Tool — See Why Rankings Changed | Seerix",
      cite: "Title ≤ 60 chars",
      len: 51,
    },
    {
      text: "Why Did My Rankings Drop? Seerix SEO Audit Tool",
      cite: "Primary keyword first",
      len: 47,
    },
    {
      text: "Seerix — Search Console Audits With Evidence",
      cite: "Brand last on brand terms",
      len: 44,
    },
  ];

  return (
    <AppFrame active="keywords" title="Rewrite title &middot; /seo-audit-tool">
      <div>
        <div className="flex flex-col gap-2.5">
          {variants.map((v, i) => {
            const on = step === i;
            return (
              <div
                key={v.cite}
                className={`rounded-lg border px-3.5 py-3 transition-all duration-500 ${
                  on
                    ? "border-signal/40 bg-signal-soft"
                    : "border-black/[0.07] bg-white"
                }`}
              >
                <p
                  className={`font-body text-[13.5px] leading-snug transition-colors duration-500 ${
                    on ? "text-black" : "text-zinc-400"
                  }`}
                >
                  {v.text}
                </p>
                <p className="mt-2 flex items-center justify-between gap-3">
                  <span
                    className={`${mono} transition-colors duration-500 ${
                      on ? "text-signal-deep" : "text-zinc-400"
                    }`}
                  >
                    {v.cite}
                  </span>
                  <span className={`${mono} text-zinc-400`}>
                    {v.len}/60
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AppFrame>
  );
}
