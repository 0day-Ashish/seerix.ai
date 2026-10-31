"use client";

import { useEffect, useState, type ReactNode } from "react";

import FitWidth from "@/components/new-landing/fit-width";
import GradientWash from "@/components/new-landing/gradient-wash";

/* -------------------------------------------------------------------------
 * The hero's product window: a row of job pills over an app window that
 * runs off the right edge of the band. Each job is a conversation on the
 * left -- the ask, a clarifying question, the finding, the artifact it made,
 * the follow-up -- and on the right the report that artifact opens.
 *
 * Picking a pill clears the window, then the chat lands and the report
 * slides in from the right, with the panel toggle flipping from Workflows
 * to Preview as it settles. Under reduced motion the global rule makes the
 * keyframes instant.
 * ---------------------------------------------------------------------- */

type Msg =
  | { k: "user"; text: string }
  | { k: "ai"; text: ReactNode }
  | { k: "step"; text: string }
  | { k: "artifact"; title: string };

type Table = { title: string; head: string[]; rows: ReactNode[][] };

type Job = {
  pill: string;
  window: string;
  chat: Msg[];
  report: {
    title: string;
    meta: string;
    metric: { label: string; value: string; delta?: string };
    tables: Table[];
  };
};

const mono = "font-mono text-[12.5px]";

/** A page path, set in mono like every path in the product. */
const P = ({ children }: { children: string }) => (
  <span className={`${mono} text-zinc-900`}>{children}</span>
);
const Down = ({ children }: { children: string }) => (
  <span className={`${mono} text-signal-deep`}>{children}</span>
);
const Up = ({ children }: { children: string }) => (
  <span className={`${mono} text-good-deep`}>{children}</span>
);
const N = ({ children }: { children: string }) => (
  <span className={`${mono} text-zinc-700`}>{children}</span>
);

/** A site, with a lettered disc standing in for its favicon. */
function Site({ name, tint }: { name: string; tint: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold uppercase text-white"
        style={{ background: tint }}
      >
        {name[0]}
      </span>
      <span className="text-zinc-900">{name}</span>
    </span>
  );
}

const jobs: Job[] = [
  {
    pill: "Explain a drop",
    window: "Traffic Drop Diagnosis",
    chat: [
      { k: "user", text: "My clicks dropped last week and I can't tell why." },
      { k: "ai", text: "I can look into that. Which property should I check?" },
      { k: "user", text: "arddev.in" },
      {
        k: "ai",
        text: "I compared the last 7 days with the 7 before. Five pages account for 91% of the 1,284 lost clicks, and four of them had their titles rewritten by Google on 2 Apr. It isn't the core update, and demand for your topics didn't fall. Here's the full breakdown.",
      },
      { k: "step", text: "Search Console synced" },
      { k: "artifact", title: "Traffic Drop Report" },
      { k: "user", text: "Can you fix the titles?" },
      {
        k: "ai",
        text: "Yes. I've drafted new titles for all four pages and added them to your fix list. Once Google re-reads them I'll check the rankings again and tell you which ones worked.",
      },
    ],
    report: {
      title: "Traffic Drop Report",
      meta: "arddev.in · last 7 days vs the 7 before · checked 3 Apr, 4:00 PM",
      metric: { label: "Clicks lost", value: "1,284", delta: "−24%" },
      tables: [
        {
          title: "Pages that lost clicks",
          head: ["", "Page", "Clicks", "Position", "Why"],
          rows: [
            ["/pricing", "−38%", "4 → 11", "Title rewritten by Google"],
            ["/features", "−29%", "3 → 7", "Title rewritten by Google"],
            ["/integrations", "−22%", "6 → 9", "Title rewritten by Google"],
            ["/blog/seo-audit", "−18%", "5 → 8", "Title rewritten by Google"],
            ["/docs/setup", "−12%", "8 → 10", "Canonical points elsewhere"],
          ].map(([p, c, pos, why], i) => [
            <N key="n">{`${i + 1}.`}</N>,
            <P key="p">{p}</P>,
            <Down key="c">{c}</Down>,
            <N key="pos">{pos}</N>,
            why,
          ]),
        },
        {
          title: "What was ruled out",
          head: ["Check", "Result", "Evidence"],
          rows: [
            ["Core update", "Not the cause", "Rivals on the same queries held"],
            ["Search demand", "Flat", "Impressions for your topics −1%"],
            ["Crawl errors", "None", "All five pages return 200"],
          ].map(([a, b, c]) => [a, <N key="b">{b}</N>, c]),
        },
      ],
    },
  },
  {
    pill: "Find quick wins",
    window: "Quick Win Finder",
    chat: [
      { k: "user", text: "Which pages could reach page one fastest?" },
      {
        k: "ai",
        text: "Should I weigh them by traffic potential, or by how little work each one needs?",
      },
      { k: "user", text: "Least work first." },
      {
        k: "ai",
        text: "Six pages sit at positions 7–14 with impressions rising. /integrations is the easiest: it's at 8 and needs internal links more than new content. Together they could bring roughly 2,100 extra clicks a month.",
      },
      { k: "step", text: "Rankings and impressions compared" },
      { k: "artifact", title: "Quick Wins Report" },
      { k: "user", text: "Add the top three to my fix list." },
      {
        k: "ai",
        text: "Done. Each one has the exact change attached, and I'll measure the result two weeks after you mark it shipped.",
      },
    ],
    report: {
      title: "Quick Wins Report",
      meta: "arddev.in · positions 6–15 · checked 3 Apr, 4:00 PM",
      metric: { label: "Extra clicks / month", value: "~2,100", delta: "6 pages" },
      tables: [
        {
          title: "Pages close to page one",
          head: ["", "Page", "Position", "Impressions", "Next step"],
          rows: [
            ["/integrations", "8", "+38%", "Add 3 internal links"],
            ["/blog/nextjs-seo", "7", "+24%", "Refresh the 2024 examples"],
            ["/compare/ahrefs", "9", "+51%", "Answer “is it cheaper” up top"],
            ["/templates", "11", "+17%", "Write a clearer title"],
            ["/docs/api", "14", "+9%", "Add an FAQ section"],
          ].map(([p, pos, imp, next], i) => [
            <N key="n">{`${i + 1}.`}</N>,
            <P key="p">{p}</P>,
            <N key="pos">{pos}</N>,
            <Up key="i">{imp}</Up>,
            next,
          ]),
        },
        {
          title: "Effort",
          head: ["Change", "Pages", "Typical time"],
          rows: [
            ["Internal links", "2", "15 min"],
            ["Title and intro", "2", "30 min"],
            ["New section", "2", "1 hr"],
          ].map(([a, b, c]) => [a, <N key="b">{b}</N>, <N key="c">{c}</N>]),
        },
      ],
    },
  },
  {
    pill: "Check a fix",
    window: "Fix Verification",
    chat: [
      { k: "user", text: "Did last month's fixes actually work?" },
      { k: "ai", text: "All five, or only the ones Google has re-read?" },
      { k: "user", text: "All of them." },
      {
        k: "ai",
        text: "Three of five worked. The /pricing title fix brought clicks back up 41%. Two are too early to call: Google re-read those pages only nine days ago.",
      },
      { k: "step", text: "Before and after compared" },
      { k: "artifact", title: "Fix Results" },
      { k: "user", text: "Remind me when the other two are ready." },
      {
        k: "ai",
        text: "I will. I'll check them again next Monday and post the verdict in your weekly report.",
      },
    ],
    report: {
      title: "Fix Results",
      meta: "arddev.in · fixes shipped in March · checked 3 Apr, 4:00 PM",
      metric: { label: "Clicks won back", value: "+912", delta: "3 of 5 worked" },
      tables: [
        {
          title: "What changed after each fix",
          head: ["", "Fix", "Page", "Clicks", "Verdict"],
          rows: [
            ["Rewrote the title", "/pricing", "+41%", "Worked"],
            ["Added internal links", "/features", "+28%", "Worked"],
            ["Fixed the canonical", "/docs/setup", "+16%", "Worked"],
            ["New meta description", "/templates", "+2%", "Too early"],
            ["Merged two posts", "/blog/seo", "0%", "Too early"],
          ].map(([fix, p, c, v], i) => [
            <N key="n">{`${i + 1}.`}</N>,
            fix,
            <P key="p">{p}</P>,
            v === "Worked" ? <Up key="c">{c}</Up> : <N key="c">{c}</N>,
            <span
              key="v"
              className={v === "Worked" ? "text-good-deep" : "text-zinc-500"}
            >
              {v}
            </span>,
          ]),
        },
      ],
    },
  },
  {
    pill: "Watch competitors",
    window: "Competitor Watch",
    chat: [
      { k: "user", text: "Who is taking my clicks?" },
      { k: "ai", text: "Over the last 28 days, or since you started tracking?" },
      { k: "user", text: "Last 28 days." },
      {
        k: "ai",
        text: "pixelforge.dev overtook you on 9 keywords, mostly with fresher guides. Two of their new pages target the same searches as your /pricing.",
      },
      { k: "step", text: "SERP snapshots compared" },
      { k: "artifact", title: "Competitor Report" },
      { k: "user", text: "Watch them for me." },
      {
        k: "ai",
        text: "Set. I'll flag any page of theirs that starts ranking for your keywords, the day it happens.",
      },
    ],
    report: {
      title: "Competitor Report",
      meta: "arddev.in · last 28 days · checked 3 Apr, 4:00 PM",
      metric: { label: "Keywords lost", value: "14", delta: "6 sites tracked" },
      tables: [
        {
          title: "Sites ranking for your keywords",
          head: ["", "Site", "Shared", "Beat you on", "Latest move"],
          rows: [
            ["pixelforge.dev", "#5b4fd8", "212", "9", "Published 4 new guides"],
            ["buildstack.io", "#e0763a", "164", "3", "Rewrote their pricing page"],
            ["devcraft.co", "#2f7d5b", "121", "2", "Gained 30 referring sites"],
            ["shipfast.app", "#3b6fd8", "88", "0", "No change"],
            ["launchkit.dev", "#b0478f", "57", "0", "Started a comparison series"],
          ].map(([d, tint, sh, beat, move], i) => [
            <N key="n">{`${i + 1}.`}</N>,
            <Site key="d" name={d} tint={tint} />,
            <N key="sh">{sh}</N>,
            beat === "0" ? <N key="b">0</N> : <Down key="b">{beat}</Down>,
            move,
          ]),
        },
      ],
    },
  },
];

/** How far the window runs past the band's right edge, in design px. */
const OVER = 108;

function Icon({ d, className = "h-4 w-4" }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Message({ m }: { m: Msg }) {
  if (m.k === "user")
    return (
      <p className="ml-auto max-w-[82%] rounded-2xl bg-black/[0.055] px-4 py-2.5 text-[15px] leading-[1.5] text-zinc-900">
        {m.text}
      </p>
    );
  if (m.k === "ai")
    return <p className="text-[15px] leading-[1.65] text-zinc-900">{m.text}</p>;
  if (m.k === "step")
    return (
      <p className="flex items-center gap-2.5 text-[14px] text-zinc-500">
        <Icon d="M3.5 8.5l3 3 6-6.5" className="h-3.5 w-3.5" />
        {m.text}
      </p>
    );
  return (
    <div>
      <div className="flex items-center justify-between overflow-hidden rounded-xl bg-black/[0.04] py-3 pl-4 pr-6">
        <div>
          <p className="text-[14px] text-zinc-900">{m.title}</p>
          <p className="mt-0.5 text-[12.5px] text-zinc-500">Interactive artifact</p>
        </div>
        {/* A document tile, tipped slightly, peeking out of the card. */}
        <span className="-mb-6 flex h-14 w-12 rotate-[4deg] items-start justify-center rounded-md border border-black/[0.08] bg-white pt-3 text-zinc-700 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.25)]">
          <Icon d="M4.5 2h5l2.5 2.5V14h-7.5zM6.5 7h4M6.5 9.5h4M6.5 12h2.5" />
        </span>
      </div>
      <div className="mt-3 flex gap-4 text-zinc-500">
        <Icon d="M5 7l2.5-5c1 0 1.7.8 1.5 1.8L8.6 6H12a1.3 1.3 0 011.3 1.5l-.8 5A1.3 1.3 0 0111.2 14H5zM2.5 7H5v7H2.5z" />
        <Icon d="M11 9l-2.5 5c-1 0-1.7-.8-1.5-1.8l.4-2.2H4a1.3 1.3 0 01-1.3-1.5l.8-5A1.3 1.3 0 014.8 2H11zM13.5 9H11V2h2.5z" />
        <Icon d="M5.5 5.5V3h7.5v7.5h-2.5M3 5.5h7.5V13H3z" />
      </div>
    </div>
  );
}

function Report({ r }: { r: Job["report"] }) {
  return (
    <div className="pt-12" style={{ paddingRight: OVER }}>
      <div className="border-b border-black/[0.07] px-6 pb-6">
        <h3 className="text-[22px] font-light tracking-[-0.01em] text-zinc-900">
          {r.title}
        </h3>
        <p className="mt-1.5 text-[13px] text-zinc-500">{r.meta}</p>
      </div>
      <div className="px-6 pt-5">
        <p className="inline-block border-b border-dashed border-zinc-400 text-[13px] text-zinc-600">
          {r.metric.label}
        </p>
        <p className="mt-2 flex items-baseline gap-3">
          <span className="text-[28px] font-light tracking-[-0.02em] text-zinc-900">
            {r.metric.value}
          </span>
          {r.metric.delta && (
            <span className={`${mono} text-zinc-500`}>{r.metric.delta}</span>
          )}
        </p>
        {r.tables.map((t) => (
          <div key={t.title} className="mt-7">
            <p className="text-[13px] text-zinc-500">{t.title}</p>
            <table className="mt-2 w-full border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-black/[0.07]">
                  {t.head.map((h, i) => (
                    <th
                      key={i}
                      className={`py-2.5 font-normal text-zinc-500 ${i === 0 && !h ? "w-10" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={i} className="border-b border-black/[0.06]">
                    {row.map((c, j) => (
                      <td key={j} className="py-3 pr-4 text-zinc-700">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AgentWindow() {
  const [active, setActive] = useState(0);
  // The toggle reads Workflows while a job loads, then Preview once the
  // report has slid in, as the reference does.
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    if (settled) return;
    const t = setTimeout(() => setSettled(true), 260);
    return () => clearTimeout(t);
  }, [settled]);

  const job = jobs[active];

  return (
    <div className="relative overflow-hidden">
      {/* The band's ground: the brand wash, where the reference has a
          painting. */}
      <GradientWash />

      <div className="relative">
        <div
          role="tablist"
          aria-label="What Seerix does"
          className="flex gap-2 overflow-x-auto px-4 pt-5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {jobs.map((j, i) => (
            <button
              key={j.pill}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => {
                if (i === active) return;
                setActive(i);
                setSettled(false);
              }}
              className={`h-[38px] shrink-0 rounded-full border px-4 font-body text-[14px] transition-colors ${
                i === active
                  ? "border-transparent bg-signal-ink text-white"
                  : "border-black/[0.08] bg-white/80 text-zinc-800 backdrop-blur-sm hover:bg-white"
              }`}
            >
              {j.pill}
            </button>
          ))}
        </div>

        {/* The window runs OVER px past the band's right edge and stops just
            short of its bottom; below the design width it zooms down whole. */}
        <div className="mt-4 pb-4 pl-4">
          <FitWidth width={1180}>
            <div
              className="flex h-[698px] flex-col overflow-hidden rounded-[14px] border border-black/[0.08] bg-[#fdfcfa] font-body shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]"
              style={{ width: `calc(100% + ${OVER}px)` }}
            >
              <div className="relative flex h-[46px] shrink-0 items-center border-b border-black/[0.07] px-4">
                <span className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </span>
                <p
                  className="absolute inset-x-0 text-center text-[14px] text-zinc-500"
                  style={{ paddingRight: OVER }}
                >
                  {job.window}
                </p>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[476px_minmax(0,1fr)]">
                {/* The conversation, pinned to its latest message. */}
                <div className="flex min-h-0 flex-col">
                  <div className="flex h-12 shrink-0 items-center justify-between pl-16 pr-4">
                    <span className="flex items-center gap-2 text-[14.5px] text-zinc-900">
                      {job.pill}
                      <Icon d="M4.5 6.5L8 10l3.5-3.5" className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-zinc-700">
                      <Icon d="M2.5 3h11v10h-11zM10 3v10" />
                    </span>
                  </div>
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <div
                      key={active}
                      className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-6 pb-4 opacity-0 [animation:seerix-fade-in_0.18s_ease-out_0.08s_forwards]"
                    >
                      {job.chat.map((m, i) => (
                        <Message key={i} m={m} />
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#fdfcfa] to-transparent" />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white py-3 pl-4 pr-3 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] text-zinc-500">
                        <Icon d="M2.5 3.5h11v9h-11zM2.5 10.5l3.5-3 3 2.5 2-1.5 2.5 2M10.5 6.5h.01" />
                      </span>
                      <span className="flex-1 text-[15px] text-zinc-400">
                        Join the waitlist to ask Seerix
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-400 text-white">
                        <Icon d="M8 12.5v-9M4 7.5l4-4 4 4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* The report the artifact opens. */}
                <div className="flex min-h-0 flex-col border-l border-black/[0.07] bg-white">
                  <div
                    className="flex h-12 shrink-0 items-center justify-center gap-1 text-[13px]"
                    style={{ paddingRight: OVER }}
                  >
                    {["Preview", "Workflows"].map((t) => {
                      const on = (t === "Preview") === settled;
                      return (
                        <span
                          key={t}
                          className={`rounded-md px-3 py-1.5 ${
                            on ? "bg-black/[0.05] text-zinc-900" : "text-zinc-500"
                          }`}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <div
                      key={active}
                      className="[animation:seerix-slide-in_0.3s_cubic-bezier(0.2,0.8,0.2,1)_0.06s_both]"
                    >
                      <Report r={job.report} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FitWidth>
        </div>
      </div>
    </div>
  );
}
