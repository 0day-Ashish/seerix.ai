"use client";

import { useEffect, useRef, useState } from "react";

import SeerixMark from "@/components/new-landing/seerix-mark";

/* -------------------------------------------------------------------------
 * The hero's product video: the Seerix home screen, drawn in markup, played
 * as a short scripted loop -- zoom to the prompt, type a question, send it,
 * pull back as the diagnosis replaces the suggestions, zoom to the answer,
 * reset. Rendered at a fixed design size and scaled to fit, so the camera
 * moves are the same at every width.
 * ---------------------------------------------------------------------- */

const W = 1200;
const H = 720;
const QUESTION = "Why did /pricing lose traffic last week?";

type Scene = {
  /** Camera zoom and the point it zooms toward, in % of the screen. */
  zoom: number;
  origin: string;
  /** Characters of the question typed so far. */
  typed: number;
  sending: boolean;
  /** 0 = suggestions, 1+ = the answer with that many evidence rows. */
  answer: number;
};

const rest: Scene = {
  zoom: 1,
  origin: "50% 40%",
  typed: 0,
  sending: false,
  answer: 0,
};

/** The script: [ms from loop start, changes to apply]. */
function script(): [number, Partial<Scene>][] {
  const steps: [number, Partial<Scene>][] = [
    [0, rest],
    [700, { zoom: 1.42, origin: "59.5% 38%" }],
  ];
  const typeStart = 1700;
  const perChar = 55;
  for (let i = 1; i <= QUESTION.length; i++)
    steps.push([typeStart + i * perChar, { typed: i }]);
  const typed = typeStart + QUESTION.length * perChar;
  steps.push(
    [typed + 350, { sending: true }],
    [typed + 650, { sending: false, zoom: 1, origin: "50% 40%", answer: 1 }],
    [typed + 1100, { answer: 2 }],
    [typed + 1450, { answer: 3 }],
    [typed + 1800, { answer: 4 }],
    [typed + 2400, { zoom: 1.25, origin: "59.5% 80%" }],
    [typed + 5200, { zoom: 1, origin: "50% 40%" }],
    [typed + 6600, rest],
  );
  return steps;
}

const LOOP = 1700 + QUESTION.length * 55 + 7600;

/* --- Small pieces of chrome ------------------------------------------- */

function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg
      className={`h-[18px] w-[18px] shrink-0 ${className}`}
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

const nav = [
  { label: "Home", d: "M2.5 7L8 2.5 13.5 7v6.5h-11z", on: true },
  { label: "Diagnoses", d: "M2.5 4.5l4 4 2.5-2.5 4.5 4.5" },
  {
    label: "Fix list",
    d: "M6 4.5h7.5M6 8h7.5M6 11.5h7.5M2.5 4.5h.5M2.5 8h.5M2.5 11.5h.5",
  },
  {
    label: "Watch",
    d: "M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3L4 11zM6.5 13.5h3",
    beta: true,
  },
  { label: "Pages", d: "M4 2.5h6l2.5 2.5v8.5H4z" },
  { label: "Queries", d: "M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.5 10.5l3 3" },
  { label: "Competitors", d: "M8 8l4-4M8 13.5a5.5 5.5 0 1 1 5.5-5.5" },
];

const recommended = [
  {
    title: "Connect Bing Webmaster",
    body: "See search beyond Google in one view",
    cta: "Connect",
  },
  {
    title: "Add competitors",
    body: "Track who moves on your queries",
    cta: "Add",
  },
  {
    title: "Verify the /pricing fix",
    body: "Marked done 9 days ago, ready to check",
    cta: "Verify",
  },
  {
    title: "Quick wins: 6 pages",
    body: "Positions 6–12 with rising impressions",
    cta: "Review",
  },
  {
    title: "Weekly report",
    body: "Choose who gets it on Mondays",
    cta: "Set up",
  },
];

const evidence = [
  { source: "Search Console", detail: "clicks 2,940 → 1,823", conf: "High" },
  { source: "SERP snapshot", detail: "position 4 → 11", conf: "High" },
  { source: "Crawl", detail: "title rewritten 2 Apr", conf: "Medium" },
];

/* --- The screen ------------------------------------------------------- */

function Screen({ s }: { s: Scene }) {
  const typing = s.typed > 0 && s.typed < QUESTION.length;
  return (
    <div className="flex h-full w-full bg-white font-body">
      {/* Sidebar */}
      <aside className="flex w-[230px] shrink-0 flex-col border-r border-black/[0.06] bg-[#f7f6f4] p-3">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <SeerixMark size={20} animated={false} />
          <span className="flex-1 text-[14px] font-medium text-black">
            acme.com
          </span>
          <Icon d="M4 6l4 4 4-4" className="text-zinc-400" />
        </div>

        <div className="mt-3 flex h-9 items-center justify-center gap-2 bg-signal text-[14px] font-medium text-white">
          <Icon d="M8 3v10M3 8h10" className="h-4 w-4" />
          Ask Seerix
        </div>

        <nav className="mt-3 flex flex-col gap-0.5">
          {nav.map((n) => (
            <span
              key={n.label}
              className={`flex items-center gap-2.5 px-2.5 py-[7px] text-[14px] ${
                n.on ? "bg-signal-soft text-black" : "text-zinc-600"
              }`}
            >
              <Icon
                d={n.d}
                className={n.on ? "text-signal-deep" : "text-zinc-500"}
              />
              {n.label}
              {n.beta && (
                <span className="bg-signal-soft px-1.5 font-mono text-[9px] tracking-[0.08em] text-signal-deep">
                  BETA
                </span>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-3 border-t border-black/[0.07] pt-3">
          <p className="px-2.5 font-mono text-[10px] tracking-[0.1em] text-zinc-500">
            RECENT
          </p>
          {["Pricing page drop", "March title fix"].map((r) => (
            <p
              key={r}
              className="mt-2 flex items-center gap-2 px-2.5 text-[13px] text-zinc-500"
            >
              <Icon
                d="M3 4h10v6.5H7l-3 2.5v-2.5H3z"
                className="h-3.5 w-3.5 text-zinc-400"
              />
              {r}
            </p>
          ))}
          <p className="mt-2 px-2.5 text-[12px] text-zinc-400">All recent ›</p>
        </div>

        <div className="mt-auto bg-white p-3 ring-1 ring-black/[0.05]">
          <p className="flex justify-between text-[12px]">
            <span className="font-medium text-black">Next steps</span>
            <span className="text-zinc-400">2/5</span>
          </p>
          <span className="mt-2 block h-1 bg-black/[0.07]">
            <span className="block h-full w-2/5 bg-signal" />
          </span>
        </div>
        <p className="mt-3 flex items-center gap-2.5 px-2.5 text-[13px] text-zinc-600">
          <Icon
            d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2"
            className="text-zinc-500"
          />
          Settings
        </p>
        <p className="mt-3 flex items-center gap-2.5 px-2 text-[13px] font-medium text-black">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#141416] text-[11px] text-white">
            A
          </span>
          Alex Mercer
        </p>
      </aside>

      {/* Main */}
      <main className="relative flex flex-1 flex-col items-center bg-[linear-gradient(180deg,#fbfaf9,#f4f3f1)] px-10 pt-14">
        <span className="absolute right-5 top-4 border border-black/[0.1] bg-white px-2 py-0.5 text-[11px] text-zinc-600">
          Growth plan
        </span>

        <h3 className="font-display text-[38px] font-medium tracking-[-0.03em] text-black">
          Welcome back, Alex.
        </h3>
        <p className="mt-2 flex items-center gap-2 text-[13px] text-zinc-500">
          <Icon
            d="M4 2.5h6l2.5 2.5v8.5H4zM6.5 8h4M6.5 10.5h4"
            className="h-3.5 w-3.5"
          />
          <span className="text-zinc-700">This week&rsquo;s report</span>·
          Monday, Oct 5
        </p>

        {/* Prompt */}
        <div
          className={`mt-6 w-full max-w-[640px] bg-white p-4 shadow-[0_8px_30px_-16px_rgba(0,0,0,0.25)] ring-1 transition-shadow duration-300 ${
            s.typed > 0 ? "ring-signal/50" : "ring-black/[0.08]"
          }`}
        >
          <p className="h-6 text-[15px]">
            {s.typed === 0 ? (
              <span className="text-zinc-400">
                Ask why anything changed on your site…
              </span>
            ) : (
              <span className="text-black">
                {QUESTION.slice(0, s.typed)}
                <span
                  className={`ml-px inline-block h-4 w-[2px] translate-y-[2px] bg-black ${
                    typing ? "" : "animate-pulse"
                  }`}
                />
              </span>
            )}
          </p>
          <div className="mt-5 flex items-center gap-2 text-zinc-500">
            <Icon d="M8 3v10M3 8h10" />
            <Icon d="M10.5 5L6 9.5a1.5 1.5 0 0 0 2 2l5-5a3 3 0 0 0-4-4L4 7.5" />
            <span className="ml-auto flex items-center gap-1 text-[13px]">
              <Icon d="M8 1.5L4 9h4l-1 5.5L12 7H8z" className="h-3.5 w-3.5" />
              Deep
            </span>
            <span
              className={`flex h-8 w-8 items-center justify-center transition-all duration-150 ${
                s.typed === QUESTION.length
                  ? "bg-signal text-white"
                  : "text-zinc-400 ring-1 ring-black/[0.12]"
              } ${s.sending ? "scale-90" : "scale-100"}`}
            >
              <Icon d="M8 13V3M4 7l4-4 4 4" className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-2 text-[13px] text-zinc-600">
          {[
            ["Give me ideas", ""],
            ["Quick wins", "NEW"],
            ["New", ""],
            ["Chat", ""],
          ].map(([l, tag]) => (
            <span
              key={l}
              className="flex items-center gap-1.5 bg-black/[0.04] px-3 py-1.5"
            >
              {l}
              {tag && (
                <span className="font-mono text-[9px] tracking-[0.08em] text-signal-deep">
                  {tag}
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Below the prompt: suggestions, or the diagnosis once asked. */}
        <div className="relative mt-8 w-full max-w-[760px] flex-1">
          <div
            className={`absolute inset-x-0 top-0 grid grid-cols-2 gap-4 transition-all duration-500 ${
              s.answer
                ? "pointer-events-none translate-y-3 opacity-0"
                : "opacity-100"
            }`}
          >
            <div className="bg-white p-5 ring-1 ring-black/[0.07]">
              <p className="text-[16px] font-medium text-black">Recommended</p>
              {recommended.map((r) => (
                <div
                  key={r.title}
                  className="mt-3 flex items-center gap-3 border-t border-black/[0.05] pt-3 first-of-type:border-0"
                >
                  <span className="h-7 w-7 shrink-0 bg-signal-soft" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-black">
                      {r.title}
                    </span>
                    <span className="block truncate text-[12px] text-zinc-500">
                      {r.body}
                    </span>
                  </span>
                  <span className="shrink-0 px-2.5 py-1 text-[12px] text-black ring-1 ring-black/[0.12]">
                    {r.cta}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center bg-white/60 p-6 text-center ring-1 ring-black/[0.06]">
              <span className="h-4 w-4 bg-signal" />
              <p className="mt-5 text-[17px] font-medium text-black">
                Want more suggestions?
              </p>
              <p className="mt-2 text-[13px] leading-[1.5] text-zinc-500">
                Seerix finds three more in about a minute.
              </p>
              <span className="mt-5 px-4 py-2 text-[13px] text-signal-deep ring-1 ring-signal/50">
                Get more suggestions
              </span>
              <p className="mt-4 text-[11px] text-zinc-400">
                New suggestions arrive overnight.
              </p>
            </div>
          </div>

          <div
            className={`absolute inset-x-0 top-0 bg-[#141416] p-6 text-white transition-all duration-500 ${
              s.answer
                ? "opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            }`}
          >
            <p className="text-[13px] text-white/45">{QUESTION}</p>
            <p className="mt-2 font-display text-[22px] tracking-[-0.02em]">
              Rankings fell after a title rewrite, not a Google update.
            </p>
            <div className="mt-4 ring-1 ring-white/10">
              {evidence.map((e, i) => (
                <div
                  key={e.source}
                  className={`flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 transition-all duration-300 first:border-0 ${
                    s.answer > i + 1 ? "opacity-100" : "translate-x-2 opacity-0"
                  }`}
                >
                  <span className="flex items-center gap-3 text-[13px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {e.source}
                    <span className="font-mono text-[12px] text-white/45">
                      {e.detail}
                    </span>
                  </span>
                  <span className="text-[11px] text-white/55 ring-1 ring-white/15 px-2 py-0.5">
                    {e.conf}
                  </span>
                </div>
              ))}
            </div>
            <p
              className={`mt-4 flex items-center gap-3 font-mono text-[12px] text-white/60 transition-opacity duration-300 ${
                s.answer >= 4 ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-5 ${i < 4 ? "bg-signal" : "bg-white/15"}`}
                  />
                ))}
              </span>
              High confidence
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * The dashboard in a Mac display, playing the scripted loop while on screen.
 */
export default function HeroDashboard() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scene, setScene] = useState<Scene>(rest);

  // Fit the fixed-size screen to the frame's width.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Run the script while visible; reduced motion shows the finished answer.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred a tick: set from a callback, not the effect body.
      const t = setTimeout(
        () => setScene({ ...rest, typed: QUESTION.length, answer: 4 }),
        0,
      );
      return () => clearTimeout(t);
    }

    const steps = script();
    let timers: ReturnType<typeof setTimeout>[] = [];
    let loop: ReturnType<typeof setInterval> | null = null;

    const play = () => {
      timers.forEach(clearTimeout);
      timers = steps.map(([at, patch]) =>
        setTimeout(() => setScene((s) => ({ ...s, ...patch })), at),
      );
    };
    const stop = () => {
      timers.forEach(clearTimeout);
      timers = [];
      if (loop) clearInterval(loop);
      loop = null;
      setScene(rest);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loop) {
          play();
          loop = setInterval(play, LOOP);
        } else if (!entry.isIntersecting && loop) {
          stop();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative rounded-[22px] bg-[#1c1c21] p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/40 sm:rounded-[28px] sm:p-3.5"
    >
      <span className="absolute left-1/2 top-[4px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#3a3a42] ring-1 ring-black/60 sm:top-[5px]" />
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-[12px] bg-white sm:rounded-[16px]"
        style={{ height: H * scale }}
      >
        {/* Fit: scales the fixed-size screen to the frame, from the corner. */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Camera: zooms toward the scene's point of interest. */}
          <div
            className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              transformOrigin: scene.origin,
              transform: `scale(${scene.zoom})`,
            }}
          >
            <Screen s={scene} />
          </div>
        </div>
      </div>
    </div>
  );
}
