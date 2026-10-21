"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import SeerixMark from "@/components/new-landing/seerix-mark";

/**
 * The product, shown working: a row of tabs over an app window. Each tab is
 * one job -- the question on the left, the answer under it, and on the right
 * the table it was built from, its rows arriving one by one.
 *
 * The tabs step forward on their own while the window is on screen; the
 * underline fills to show when the next one is due. Hovering holds it, a
 * click jumps to that tab, and with reduced motion it stays where it is.
 */

type Cell = ReactNode;

type Demo = {
  tab: string;
  crumb: string;
  question: string;
  answer: ReactNode;
  sheet: string;
  title: string;
  filters: string[];
  stats: [string, string][];
  head: string[];
  rows: Cell[][];
};

/** A score as a tinted square and its number, like a heat cell. */
function Score({ value, tone = "signal" }: { value: number; tone?: string }) {
  const bg =
    tone === "good"
      ? "#2f8a4f"
      : tone === "flat"
        ? "#a1a1aa"
        : `rgba(90,88,209,${0.25 + (value / 100) * 0.75})`;
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-[4px]"
        style={{ background: bg }}
      />
      <span className="font-mono text-[12.5px] text-black">{value}</span>
    </span>
  );
}

const Path = ({ children }: { children: string }) => (
  <span className="font-mono text-[12px] text-black">{children}</span>
);

const Down = ({ children }: { children: string }) => (
  <span className="font-mono text-[12px] text-signal-deep">{children}</span>
);

const Up = ({ children }: { children: string }) => (
  <span className="font-mono text-[12px] text-[#1f6b3a]">{children}</span>
);

const demos: Demo[] = [
  {
    tab: "Explain a drop",
    crumb: "Traffic drop · last 7 days",
    question: "Why did my traffic drop last week?",
    answer: (
      <>
        Clicks fell 24% across five pages. Four of them had their titles
        rewritten by Google on 2 Apr, which pushed them off the top five.
        It&apos;s <strong className="font-semibold text-black">not</strong> the
        core update, and searches for your topics didn&apos;t fall.
      </>
    ),
    sheet: "Pages",
    title: "Pages that lost clicks",
    filters: ["Last 7 days", "Clicks down > 10%"],
    stats: [
      ["Clicks lost", "1,284"],
      ["Pages hit", "5"],
    ],
    head: ["Impact", "Page", "Clicks", "Position", "Why"],
    rows: [
      [96, "/pricing", "−38%", "4 → 11", "Title rewritten by Google"],
      [88, "/features", "−29%", "3 → 7", "Title rewritten by Google"],
      [74, "/integrations", "−22%", "6 → 9", "Title rewritten by Google"],
      [61, "/blog/seo-audit", "−18%", "5 → 8", "Title rewritten by Google"],
      [42, "/docs/setup", "−12%", "8 → 10", "Canonical points elsewhere"],
      [18, "/about", "−4%", "2 → 2", "Normal week-to-week noise"],
      [12, "/careers", "−3%", "7 → 7", "Normal week-to-week noise"],
    ].map(([s, p, c, pos, why]) => [
      <Score key="s" value={s as number} />,
      <Path key="p">{p as string}</Path>,
      <Down key="c">{c as string}</Down>,
      <span key="pos" className="font-mono text-[12px]">
        {pos}
      </span>,
      why,
    ]),
  },
  {
    tab: "Find quick wins",
    crumb: "Quick wins",
    question: "Which pages are close to page one?",
    answer: (
      <>
        Six pages sit just off page one with rising impressions. Start with{" "}
        <strong className="font-semibold text-black">/integrations</strong>:
        it&apos;s at position 8 and needs internal links more than new content.
      </>
    ),
    sheet: "Opportunities",
    title: "Pages close to page one",
    filters: ["Position 6–15", "Impressions rising"],
    stats: [
      ["Extra clicks / mo", "~2,100"],
      ["Pages", "6"],
    ],
    head: ["Chance", "Page", "Position", "Impressions", "Next step"],
    rows: [
      [94, "/integrations", "8", "+38%", "Add 3 internal links"],
      [89, "/blog/nextjs-seo", "7", "+24%", "Refresh the 2024 examples"],
      [83, "/compare/ahrefs", "9", "+51%", "Answer “is it cheaper” up top"],
      [77, "/templates", "11", "+17%", "Write a clearer title"],
      [70, "/blog/core-vitals", "12", "+12%", "Merge with the older post"],
      [64, "/docs/api", "14", "+9%", "Add an FAQ section"],
    ].map(([s, p, pos, imp, next]) => [
      <Score key="s" value={s as number} />,
      <Path key="p">{p as string}</Path>,
      <span key="pos" className="font-mono text-[12px]">
        {pos}
      </span>,
      <Up key="i">{imp as string}</Up>,
      next,
    ]),
  },
  {
    tab: "Check a fix",
    crumb: "Fix results",
    question: "Did last month’s fixes actually work?",
    answer: (
      <>
        Three of five worked. The /pricing title fix brought clicks back up 41%.
        Two are too early to call: Google re-read those pages only nine days
        ago, so check again next week.
      </>
    ),
    sheet: "Fixes",
    title: "What changed after each fix",
    filters: ["Done in March", "Measured"],
    stats: [
      ["Worked", "3 of 5"],
      ["Clicks won back", "+912"],
    ],
    head: ["Result", "Fix", "Page", "Clicks", "Verdict"],
    rows: [
      ["good", 41, "Rewrote the title", "/pricing", "+41%", "Worked"],
      ["good", 28, "Added internal links", "/features", "+28%", "Worked"],
      ["good", 16, "Fixed the canonical", "/docs/setup", "+16%", "Worked"],
      ["flat", 2, "New meta description", "/templates", "+2%", "Too early"],
      ["flat", 0, "Merged two posts", "/blog/seo", "0%", "Too early"],
    ].map(([tone, s, fix, p, c, v]) => [
      <Score key="s" value={s as number} tone={tone as string} />,
      fix,
      <Path key="p">{p as string}</Path>,
      tone === "good" ? (
        <Up key="c">{c as string}</Up>
      ) : (
        <span key="c" className="font-mono text-[12px] text-zinc-500">
          {c}
        </span>
      ),
      <span
        key="v"
        className={tone === "good" ? "text-[#1f6b3a]" : "text-zinc-500"}
      >
        {v}
      </span>,
    ]),
  },
  {
    tab: "Watch competitors",
    crumb: "Competitors",
    question: "Who is taking my clicks?",
    answer: (
      <>
        <strong className="font-semibold text-black">pixelforge.dev</strong>{" "}
        overtook you on 9 keywords this month, mostly with fresher guides. Two
        of their new pages target the same searches as your /pricing.
      </>
    ),
    sheet: "Competitors",
    title: "Sites ranking for your keywords",
    filters: ["Last 28 days", "Shared keywords > 20"],
    stats: [
      ["Keywords lost", "14"],
      ["Sites tracked", "6"],
    ],
    head: ["Overlap", "Site", "Shared", "Beat you on", "Their latest move"],
    rows: [
      [86, "pixelforge.dev", "212", "9", "Published 4 new guides"],
      [71, "buildstack.io", "164", "3", "Rewrote their pricing page"],
      [58, "devcraft.co", "121", "2", "Gained 30 referring sites"],
      [44, "shipfast.app", "88", "0", "No change"],
      [31, "launchkit.dev", "57", "0", "Started a comparison series"],
      [22, "stackhq.io", "40", "0", "No change"],
    ].map(([s, d, sh, beat, move]) => [
      <Score key="s" value={s as number} />,
      <span key="d" className="text-link">
        {d}
      </span>,
      <span key="sh" className="font-mono text-[12px]">
        {sh}
      </span>,
      beat === "0" ? (
        <span key="b" className="font-mono text-[12px] text-zinc-400">
          0
        </span>
      ) : (
        <Down key="b">{beat as string}</Down>
      ),
      move,
    ]),
  },
];

/** How long each tab holds before the next, in ms. */
const HOLD = 7000;

/** The rail's icons, drawn on a 16px grid. */
const RAIL = [
  "M2.5 7L8 2.5 13.5 7v6.5h-4v-4h-3v4h-4z",
  "M2.5 13.5V9M6.2 13.5V5.5M9.8 13.5V8M13.5 13.5V3",
  "M3 3.5h10M3 8h10M3 12.5h6",
  "M8 2.5v11M2.5 8h11",
  "M5.5 6a2 2 0 104 0 2 2 0 00-4 0zM2.5 13.5c.5-2.3 2.6-3.5 5-3.5s4.5 1.2 5 3.5",
];

function Icon({ d }: { d: string }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/** Arrives after `delay` seconds with the shared short rise. */
const rise = (delay: number) => ({
  animation: `seerix-fade-in 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
});

export default function ProductDemo() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const demo = demos[active];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(mq.matches);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = visible && !held && !still;
  const next = () => setActive((a) => (a + 1) % demos.length);

  return (
    <div
      ref={root}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      {/* Tabs: an underline under each, the active one filling over HOLD. */}
      <div
        role="tablist"
        aria-label="What Seerix does"
        className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {demos.map((d, i) => {
          const on = i === active;
          return (
            <button
              key={d.tab}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="product-demo-panel"
              onClick={() => setActive(i)}
              className={`relative min-w-[150px] flex-1 px-4 pb-4 pt-2 text-center font-body text-[14px] transition-colors sm:text-[16px] ${
                on ? "text-black" : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {d.tab}
              <span className="absolute inset-x-0 bottom-0 h-px bg-black/[0.08]" />
              {on && (
                <span
                  key={active}
                  onAnimationEnd={next}
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left rounded-full bg-[#141416]"
                  // Longhands only: React warns when the shorthand and the
                  // play state are mixed on the same element.
                  style={{
                    animationName: still ? "none" : "seerix-tab-fill",
                    animationDuration: `${HOLD}ms`,
                    animationTimingFunction: "linear",
                    animationFillMode: "both",
                    animationPlayState: playing ? "running" : "paused",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* The window. Fixed height on desktop so switching never jumps. */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.1] bg-white shadow-[0_30px_70px_-40px_rgba(0,0,0,0.35)]">
        <div
          key={active}
          id="product-demo-panel"
          role="tabpanel"
          className="flex animate-[seerix-fade-in_0.35s_ease-out] lg:h-[600px]"
        >
          {/* Icon rail */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-black/[0.07] bg-[#fbfaf9] py-4 md:flex">
            <span className="mb-3">
              <SeerixMark size={20} animated={false} />
            </span>
            {RAIL.map((d, i) => (
              <span
                key={d}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  i === 0 ? "bg-black/[0.06] text-black" : "text-zinc-400"
                }`}
              >
                <Icon d={d} />
              </span>
            ))}
          </div>

          <div className="grid min-w-0 flex-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
            {/* The conversation */}
            <div className="flex min-w-0 flex-col border-b border-black/[0.07] p-5 lg:border-b-0 lg:border-r lg:p-6">
              <p className="font-body text-[12.5px] text-zinc-400">
                arddev.in <span className="px-1">/</span>
                <span className="text-zinc-600">{demo.crumb}</span>
                <span className="pl-2 tracking-widest">···</span>
              </p>

              <p
                className="mt-6 rounded-xl rounded-tr-sm bg-[#f1f0ee] px-4 py-3 font-body text-[14px] leading-[1.55] text-black"
                style={rise(0.1)}
              >
                {demo.question}
              </p>

              <div style={rise(0.45)} className="mt-6">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  Seerix
                </p>
                <p className="mt-2 font-body text-[14px] leading-[1.65] text-zinc-700">
                  {demo.answer}
                </p>
              </div>

              <div className="mt-auto hidden rounded-xl border border-black/[0.12] px-4 pb-3 pt-3.5 lg:block">
                <p className="font-body text-[13.5px] text-zinc-400">
                  Ask a follow-up…
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-zinc-400">
                    Search Console · 16 months
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-signal/40 text-signal-deep">
                    <Icon d="M8 12.5v-9M4.5 7L8 3.5 11.5 7" />
                  </span>
                </div>
              </div>
            </div>

            {/* The table it was built from */}
            <div className="flex min-w-0 flex-col bg-white">
              <div className="flex items-end gap-1 border-b border-black/[0.07] bg-[#fbfaf9] px-4 pt-3">
                <span className="flex items-center gap-6 rounded-t-lg border border-b-0 border-black/[0.08] bg-white px-4 py-2 font-body text-[13px] text-black">
                  {demo.sheet}
                  <span className="text-[10px] text-zinc-400">▾</span>
                </span>
                <span className="px-3 py-2 text-zinc-300">+</span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.07] px-5 py-4">
                <div>
                  <p className="font-display text-[17px] font-medium tracking-[-0.01em] text-black">
                    {demo.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {demo.filters.map((f) => (
                      <span
                        key={f}
                        className="rounded-md bg-black/[0.04] px-2 py-0.5 font-body text-[11.5px] text-zinc-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-6">
                    {demo.stats.map(([k, v]) => (
                      <div key={k}>
                        <p className="font-body text-[11px] text-zinc-400">
                          {k}
                        </p>
                        <p className="font-display text-[16px] font-medium text-black">
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="rounded-lg border border-black/[0.12] px-3 py-1.5 font-body text-[12.5px] text-black">
                  Add to fix list
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left font-body text-[13px] text-zinc-700">
                  <thead>
                    <tr className="border-b border-black/[0.07]">
                      <th className="w-10 py-2.5 pl-4 font-normal" />
                      {demo.head.map((h) => (
                        <th
                          key={h}
                          className="border-l border-black/[0.06] px-3 py-2.5 font-body text-[12.5px] font-medium text-black"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {demo.rows.map((row, r) => (
                      <tr
                        key={r}
                        className="border-b border-black/[0.06]"
                        style={rise(0.7 + r * 0.09)}
                      >
                        <td className="py-2.5 pl-4 font-mono text-[11.5px] text-zinc-400">
                          {r + 1}
                        </td>
                        {row.map((c, k) => (
                          <td
                            key={k}
                            className="whitespace-nowrap border-l border-black/[0.06] px-3 py-2.5"
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
