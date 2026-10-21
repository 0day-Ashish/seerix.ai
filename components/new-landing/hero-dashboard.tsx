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
  origin: "50% 50%",
  typed: 0,
  sending: false,
  answer: 0,
};

/** The script: [ms from loop start, changes to apply]. */
function script(): [number, Partial<Scene>][] {
  const steps: [number, Partial<Scene>][] = [
    [0, rest],
    [700, { zoom: 1.4, origin: "62% 26%" }],
  ];
  const typeStart = 1700;
  const perChar = 55;
  for (let i = 1; i <= QUESTION.length; i++)
    steps.push([typeStart + i * perChar, { typed: i }]);
  const typed = typeStart + QUESTION.length * perChar;
  steps.push(
    [typed + 350, { sending: true }],
    [typed + 650, { sending: false, zoom: 1, origin: "50% 50%", answer: 1 }],
    [typed + 1100, { answer: 2 }],
    [typed + 1450, { answer: 3 }],
    [typed + 1800, { answer: 4 }],
    [typed + 2400, { zoom: 1.12, origin: "58% 55%" }],
    [typed + 5200, { zoom: 1, origin: "50% 50%" }],
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

/** Mirrors the sidebar in /app, in the same order. */
const nav = [
  { label: "Overview", d: "M2 13.5h12M4 11V8M8 11V3.5M12 11V6" },
  {
    label: "This week",
    d: "M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3",
  },
  { label: "Chat", d: "M2.5 3h11v8H7.5L4.5 13.5V11h-2z", on: true },
  {
    label: "Fix list",
    d: "M6.5 4h7M6.5 8h7M6.5 12h7M2.5 4l1 1 1.5-2M2.5 8l1 1 1.5-2M2.5 12l1 1 1.5-2",
    count: 3,
  },
  { label: "Rankings", d: "M2 12l4-4 3 3 5-6M10.5 5H14v3.5" },
  {
    label: "Keywords",
    d: "M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.5 10.5l3 3",
  },
  {
    label: "Backlinks",
    d: "M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1",
  },
  {
    label: "Competitors",
    d: "M6 7a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 6 7zM1.75 13.5c0-2.3 1.9-4 4.25-4s4.25 1.7 4.25 4M11 2.6a2.2 2.2 0 0 1 0 4.3M12.2 9.7c1.2.5 2 1.8 2 3.8",
  },
  { label: "Health", d: "M1.5 8h3l1.5-4 3 8 1.5-4h4" },
];

/** The shortcut chips under the prompt, as the chat page lists them. */
const chips = [
  {
    label: "Give me ideas",
    d: "M6 12.5h4M6.5 14.5h3M8 1.5a4 4 0 0 0-2.4 7.2c.5.4.9 1 .9 1.8h3c0-.8.4-1.4.9-1.8A4 4 0 0 0 8 1.5z",
  },
  { label: "Explain a drop", d: "M2 4l4 4 3-3 5 6M10.5 11H14V7.5" },
  {
    label: "Quick wins",
    d: "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
  { label: "Check a fix", d: "M3.5 8.5l3 3 6-7" },
  {
    label: "Competitors",
    d: "M6 7a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 6 7zM1.75 13.5c0-2.3 1.9-4 4.25-4s4.25 1.7 4.25 4M11 2.6a2.2 2.2 0 0 1 0 4.3M12.2 9.7c1.2.5 2 1.8 2 3.8",
    tag: "NEW",
  },
];

/** The setup steps the chat page recommends. */
const recommended = [
  {
    title: "Reconnect Google",
    body: "Access expires in 6 days",
    cta: "Reconnect",
  },
  {
    title: "Connect Bing Webmaster",
    body: "See searches from Bing in the same view",
    cta: "Connect",
  },
  {
    title: "Add competitors",
    body: "Track who moves on your searches",
    cta: "Add",
  },
  {
    title: "Verify the /pricing fix",
    body: "Marked done 9 days ago, ready to check",
    cta: "Verify",
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
    <div data-app className="flex h-full w-full bg-[#f5f5f6] font-body">
      {/* Sidebar: the real app's, pills on the page ground rather than a
          bordered rail. */}
      <aside className="flex w-[260px] shrink-0 flex-col px-4 pb-3 pt-5">
        <div className="flex items-center gap-1">
          <span className="mr-auto flex items-center gap-2 px-2">
            <SeerixMark size={24} animated={false} />
            <span
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              className="text-[19px] font-semibold tracking-[-0.02em] text-zinc-900"
            >
              seerix
            </span>
          </span>
          <Icon
            d="M8 2.5a5.5 5.5 0 0 0-5.5 5.5v3l-1 1.5h13l-1-1.5V8A5.5 5.5 0 0 0 8 2.5zM6.5 14h3"
            className="h-[18px] w-[18px] text-zinc-500"
          />
        </div>

        <span className="mt-5 flex h-10 items-center justify-center gap-2 rounded-full bg-signal text-[14.5px] text-white shadow-[0_1px_2px_rgba(44,71,242,0.3)]">
          <Icon d="M8 3.5v9M3.5 8h9" className="h-4 w-4" />
          Ask Seerix
        </span>

        <nav className="mt-5 flex flex-col gap-0.5">
          {nav.map((n) => (
            <span
              key={n.label}
              className={`relative flex items-center gap-3 rounded-full px-3.5 py-2 text-[14.5px] ${
                n.on
                  ? "bg-white text-zinc-900 shadow-[0_0_0_1px_rgba(24,24,27,0.08),0_1px_2px_rgba(24,24,27,0.05)]"
                  : "text-zinc-600"
              }`}
            >
              <span className={n.on ? "text-signal" : "text-zinc-500"}>
                <Icon d={n.d} className="h-4 w-4" />
              </span>
              {n.label}
              {n.count ? (
                <span className="ml-auto rounded-full bg-zinc-200/70 px-1.5 text-[11.5px] text-zinc-600">
                  {n.count}
                </span>
              ) : null}
            </span>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-zinc-200 bg-white px-4 py-3.5">
          <p className="flex items-center justify-between text-[13px]">
            <span className="text-zinc-500">Growth plan</span>
            <span className="text-signal">See plans</span>
          </p>
          <p className="mt-1.5 text-[14px] text-zinc-900">
            212 of 500 questions this month
          </p>
          <span className="mt-3 block h-1 overflow-hidden rounded-full bg-zinc-100">
            <span className="block h-full w-[42%] rounded-full bg-signal" />
          </span>
        </div>

        <p className="mt-3 flex items-center gap-2.5 px-3.5 py-2 text-[14.5px] text-zinc-600">
          <Icon
            d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2"
            className="h-4 w-4 text-zinc-500"
          />
          Settings
        </p>
        <p className="mt-2 flex items-center gap-2.5 px-2 py-1 text-[13px]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-[12px] font-medium text-white">
            A
          </span>
          <span>
            <span className="block font-medium text-zinc-900">Ashish</span>
            <span className="block text-[12px] text-zinc-500">
              arddev.in · Owner
            </span>
          </span>
        </p>
      </aside>

      {/* Main: the Chat page, in a white rounded panel as the app renders it. */}
      <main className="relative flex-1 overflow-hidden rounded-l-2xl border-l border-t border-zinc-200 bg-white px-8 pt-16">
        <div className="mx-auto w-full max-w-[760px]">
          <h3 className="text-center font-display text-[38px] font-medium tracking-[-0.03em] text-zinc-900">
            Welcome back, Ashish.
          </h3>

          {/* The prompt: what the camera zooms to and what gets typed into. */}
          <div
            className={`mt-7 rounded-2xl bg-white p-4 ring-2 transition-[box-shadow,opacity] duration-300 ${
              s.typed > 0 ? "ring-signal" : "ring-signal/40"
            } ${s.answer ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100"}`}
          >
            <p className="h-6 text-[15px]">
              {s.typed === 0 ? (
                <span className="text-zinc-400">
                  Ask why your traffic changed, or what to fix next…
                </span>
              ) : (
                <span className="text-zinc-900">
                  {QUESTION.slice(0, s.typed)}
                  <span
                    className={`ml-px inline-block h-4 w-[2px] translate-y-[2px] bg-zinc-900 ${
                      typing ? "" : "animate-pulse"
                    }`}
                  />
                </span>
              )}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <Icon
                  d="M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1"
                  className="h-4 w-4"
                />
              </span>
              <span className="ml-auto flex items-center gap-2 text-[13px] text-zinc-600">
                Deep check
                <span className="rounded bg-signal-soft px-1.5 font-mono text-[9px] tracking-[0.08em] text-signal-deep">
                  BETA
                </span>
                <span className="flex h-[18px] w-8 items-center rounded-full bg-zinc-200 px-0.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-white shadow-sm" />
                </span>
              </span>
              <span className="flex h-8 w-8 items-center justify-center text-zinc-400">
                <Icon
                  d="M8 1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-4 0v-4a2 2 0 0 1 2-2zM4 7.5a4 4 0 0 0 8 0M8 11.5v3"
                  className="h-4 w-4"
                />
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 ${
                  s.typed === QUESTION.length
                    ? "bg-signal text-white"
                    : "bg-zinc-100 text-zinc-400"
                } ${s.sending ? "scale-90" : "scale-100"}`}
              >
                <Icon d="M8 13V3M3.5 7.5L8 3l4.5 4.5" className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Shortcut chips, as the chat page lists them. */}
          <div
            className={`mt-4 flex justify-center gap-2 transition-opacity duration-300 ${
              s.answer ? "opacity-0" : "opacity-100"
            }`}
          >
            {chips.map((c) => (
              <span
                key={c.label}
                className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-[13px] text-zinc-700"
              >
                <Icon d={c.d} className="h-3.5 w-3.5 text-zinc-500" />
                {c.label}
                {c.tag && (
                  <span className="font-mono text-[9px] tracking-[0.08em] text-signal-deep">
                    {c.tag}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Below the prompt: the two cards, or the diagnosis once asked. */}
          <div
            className={`relative h-[260px] transition-[margin] duration-500 ${
              s.answer ? "-mt-[136px]" : "mt-7"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 grid grid-cols-2 gap-4 transition-all duration-500 ${
                s.answer
                  ? "pointer-events-none translate-y-3 opacity-0"
                  : "opacity-100"
              }`}
            >
              <div className="rounded-2xl border border-zinc-200 p-5">
                <p className="text-[15px] font-medium text-zinc-900">
                  Recommended
                </p>
                {recommended.map((r) => (
                  <div
                    key={r.title}
                    className="mt-2.5 flex items-center gap-3 pt-2.5"
                  >
                    <span className="h-7 w-7 shrink-0 rounded-lg bg-zinc-100" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-zinc-900">
                        {r.title}
                      </span>
                      <span className="block truncate text-[12px] text-zinc-500">
                        {r.body}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-700">
                      {r.cta}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#fafafa] p-6 text-center ring-1 ring-zinc-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-soft text-signal-deep">
                  <Icon
                    d="M6 12.5h4M6.5 14.5h3M8 1.5a4 4 0 0 0-2.4 7.2c.5.4.9 1 .9 1.8h3c0-.8.4-1.4.9-1.8A4 4 0 0 0 8 1.5z"
                    className="h-5 w-5"
                  />
                </span>
                <p className="mt-4 text-[16px] font-medium text-zinc-900">
                  Want more suggestions?
                </p>
                <p className="mt-2 text-[13px] leading-[1.5] text-zinc-500">
                  Seerix finds three more questions worth asking in about a
                  minute.
                </p>
                <span className="mt-4 rounded-full border border-signal/40 px-4 py-2 text-[13px] text-signal-deep">
                  Get more suggestions
                </span>
              </div>
            </div>

            {/* The diagnosis, which takes the cards' place once asked. */}
            <div
              className={`absolute inset-x-0 top-0 rounded-2xl bg-[#141416] p-5 text-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.45)] transition-all duration-500 ${
                s.answer
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <p className="text-[13px] text-white/45">{QUESTION}</p>
              <p className="mt-2 font-display text-[20px] tracking-[-0.02em]">
                Rankings fell after a title rewrite, not a Google update.
              </p>
              <div className="mt-4 rounded-xl ring-1 ring-white/10">
                {evidence.map((e, i) => (
                  <div
                    key={e.source}
                    className={`flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 transition-all duration-300 first:border-0 ${
                      s.answer > i + 1
                        ? "opacity-100"
                        : "translate-x-2 opacity-0"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-[13px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      {e.source}
                      <span className="font-mono text-[12px] text-white/45">
                        {e.detail}
                      </span>
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-[11px] text-white/55 ring-1 ring-white/15">
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
                      className={`h-1.5 w-5 rounded-sm ${i < 4 ? "bg-signal" : "bg-white/15"}`}
                    />
                  ))}
                </span>
                High confidence
              </p>
            </div>
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
