/**
 * The three panels the how-it-works steps select between, drawn in plain
 * markup rather than screenshots -- the same treatment as AnswerCard and
 * HeroPanel. Each one shows what its step produces instead of describing it
 * again, and all three are sized to a shared minimum height so swapping
 * between them does not move the section.
 *
 * Decorative: the step copy beside them carries the same meaning in prose.
 */

import Image from "next/image";

import {
  AskVisual,
  ConnectVisual,
  StudyVisual,
} from "@/components/new-landing/step-visuals";

/** A fixed height, not a minimum: the three panels carry different numbers of
    readout rows, so a minimum let the longest one size itself taller and the
    section jumped when the selected step changed. Every panel is now exactly
    the same box, and the readout absorbs the difference internally. */
const frame =
  "relative flex flex-col overflow-hidden rounded-2xl bg-[#1c1c21] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] lg:h-[min(39rem,calc(100dvh-12rem))]";

/**
 * The card shell. The art is declared here rather than in each of the three
 * panels, so they cannot drift apart.
 *
 * The image is flipped vertically, as on the featured pricing card, putting
 * its near-black end at the top. On this dark ground the scrim runs the other
 * way from the pricing card's: it clears the pale end off the readout at the
 * bottom, where the light copy sits.
 */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className={frame}>
      <Image
        src="/assets/pricing.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="pointer-events-none select-none object-cover object-top [transform:scaleY(-1)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1c1c21]/20 via-[#1c1c21]/55 to-[#1c1c21]/95" />

      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}

const header = "border-b border-white/[0.08] px-6 py-4";
const headerText = "font-body text-[13px] text-white/45";

/** The 3D construction sits in its own stage above the readout. Fixed height
    rather than flex-1: stretching it parked the card's spare height as an
    empty band under the scene instead of closing the gap. */
const stage = "relative h-[12rem] shrink-0 overflow-hidden lg:h-[14rem]";

/** Step 01: the read-only Google connection and what it pulls back. */
export function ConnectCard() {
  const scopes = [
    { label: "Search Console", access: "Read-only", granted: true },
    { label: "Basic profile", access: "Read-only", granted: true },
    { label: "Write access", access: "Never requested", granted: false },
  ];

  return (
    <Frame>
      <div className={header}>
        <p className={headerText}>Connect Google Search Console</p>
      </div>

      <div className={stage}>
        <ConnectVisual />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <p className="max-w-md font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-white">
          One sign-in. Sixteen months of history, read-only.
        </p>

        <p className="mt-6 font-body text-[12px] font-medium uppercase tracking-[0.06em] text-white/40">
          Permissions
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.09]">
          {scopes.map((scope, index) => (
            <div
              key={scope.label}
              className={`flex items-center justify-between gap-4 px-3.5 py-2.5 ${
                index > 0 ? "border-t border-white/[0.07]" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    scope.granted ? "bg-[#dcdddd]/60" : "bg-white/[0.14]"
                  }`}
                />
                <span
                  className={`shrink-0 font-body text-[13px] ${
                    scope.granted ? "text-white/85" : "text-white/40"
                  }`}
                >
                  {scope.label}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-white/[0.12] px-2 py-0.5 font-body text-[11px] text-white/50">
                {scope.access}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5 lg:mt-auto">
          <span className="font-body text-[13px] text-white/45">
            History pulled on first sync
          </span>
          <span className="font-mono text-[12px] text-white/60">16 months</span>
        </div>
      </div>
    </Frame>
  );
}

/** Step 02: the background work, and what it has covered so far. */
export function StudyCard() {
  const jobs = [
    { label: "Pages crawled", value: "1,284", done: true },
    { label: "SERPs tracked", value: "312", done: true },
    { label: "Competitors watched", value: "8", done: true },
    { label: "Algorithm updates checked", value: "24", done: false },
  ];

  return (
    <Frame>
      <div className={header}>
        <p className={headerText}>Continuous background analysis</p>
      </div>

      <div className={stage}>
        <StudyVisual />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <p className="max-w-md font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-white">
          It keeps studying your site while you do other work.
        </p>

        <p className="mt-6 font-body text-[12px] font-medium uppercase tracking-[0.06em] text-white/40">
          This week
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.09]">
          {jobs.map((job, index) => (
            <div
              key={job.label}
              className={`flex items-center justify-between gap-4 px-3.5 py-2.5 ${
                index > 0 ? "border-t border-white/[0.07]" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    job.done ? "bg-[#dcdddd]/60" : "bg-white/[0.14]"
                  }`}
                />
                <span className="truncate font-body text-[13px] text-white/85">
                  {job.label}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[12px] text-white/60">
                {job.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5 lg:mt-auto">
          <span className="font-body text-[13px] text-white/45">
            Last run
          </span>
          <span className="font-mono text-[12px] text-white/60">
            14 minutes ago
          </span>
        </div>
      </div>
    </Frame>
  );
}

/** Step 03: the diagnosis, with the evidence and confidence pinned to it. */
export function AskCard() {
  const evidence = [
    { source: "Search Console", detail: "clicks 2,940 → 1,823", confidence: "High" },
    { source: "SERP snapshot", detail: "position 4 → 11", confidence: "High" },
    { source: "Crawl", detail: "title rewritten Apr 2", confidence: "Medium" },
  ];

  return (
    <Frame>
      <div className={header}>
        <p className={headerText}>Why did /pricing lose traffic last week?</p>
      </div>

      <div className={stage}>
        <AskVisual />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <p className="max-w-md font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-white">
          Rankings fell after a title rewrite, not a Google update.
        </p>

        <p className="mt-6 font-body text-[12px] font-medium uppercase tracking-[0.06em] text-white/40">
          Evidence
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.09]">
          {evidence.map((row, index) => (
            <div
              key={row.source}
              className={`flex items-center justify-between gap-4 px-3.5 py-2.5 ${
                index > 0 ? "border-t border-white/[0.07]" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dcdddd]/60" />
                <span className="shrink-0 font-body text-[13px] text-white/85">
                  {row.source}
                </span>
                <span className="truncate font-body text-[13px] text-white/45">
                  {row.detail}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-white/[0.12] px-2 py-0.5 font-body text-[11px] text-white/50">
                {row.confidence}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5 lg:mt-auto">
          <span className="font-body text-[13px] text-white/45">
            Confidence in this diagnosis
          </span>
          <span className="flex items-center gap-2">
            <span className="flex gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 w-4 rounded-full ${
                    index < 4 ? "bg-[#dcdddd]/80" : "bg-white/[0.12]"
                  }`}
                />
              ))}
            </span>
            <span className="font-mono text-[12px] text-white/60">High</span>
          </span>
        </div>
      </div>
    </Frame>
  );
}
