"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import SeerixMark from "@/components/new-landing/seerix-mark";

/* -------------------------------------------------------------------------
 * The problem, as a bento grid: three cells for the pain -- no why, so you
 * guess, so you pay -- and two for the turn: you ask, and the answer comes
 * with receipts. Each cell's visual is a small piece of the situation,
 * moving on one shared clock while the grid is on screen.
 * ---------------------------------------------------------------------- */

/**
 * One tick a second while the grid is visible; stopped off screen, and held
 * at a settled frame with reduced motion.
 */
function useTick(ref: React.RefObject<HTMLElement | null>) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (still) {
        // One settled frame: everything shown.
        setTick(6);
        return;
      }
      if (e.isIntersecting)
        timer = setInterval(() => setTick((t) => t + 1), 1000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [ref]);
  return tick;
}

/**
 * A band of dots sweeping across a card, as the reference draws its wave:
 * a dot grid masked to a soft curved stroke. `d` is the curve, drawn in a
 * 400 x 300 box and stretched to the card.
 */
function DotWave({ d }: { d: string }) {
  const mask = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='none'><filter id='f' x='-50%' y='-50%' width='200%' height='200%' filterUnits='userSpaceOnUse'><feGaussianBlur stdDeviation='9'/></filter><path d='${d}' fill='none' stroke='black' stroke-width='34' stroke-linecap='round' filter='url(#f)'/></svg>`,
  )}")`;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(91,79,216,0.5) 1.1px, transparent 1.6px)",
        backgroundSize: "6px 6px",
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    />
  );
}

/** Each card's wave, so neighbouring cards don't repeat one curve. */
const waves = {
  rise: "M-20 60 C 90 40, 140 230, 260 200 S 380 120, 430 150",
  fall: "M40 -20 C 30 120, 160 140, 230 210 S 360 300, 420 290",
  arc: "M-20 280 C 80 230, 160 120, 260 110 S 380 40, 430 20",
  low: "M-20 200 C 100 260, 220 180, 300 230 S 380 260, 430 240",
  high: "M-20 90 C 120 30, 220 140, 300 70 S 380 30, 430 50",
};

/**
 * One bento card, as the reference draws them: a frosted card, the visual
 * centred over its dot wave, and the title alone at the bottom left.
 */
function Cell({
  title,
  visual,
  wave,
  className = "",
}: {
  title: string;
  visual: ReactNode;
  wave: keyof typeof waves;
  className?: string;
}) {
  return (
    <div
      className={`frost relative flex min-h-[26rem] min-w-0 flex-col overflow-hidden rounded-[24px] ${className}`}
    >
      <DotWave d={waves[wave]} />
      <div className="relative flex flex-1 items-center justify-center px-6 pb-4 pt-10 sm:px-8">
        <div className="w-full">{visual}</div>
      </div>
      <h3 className="relative px-7 pb-7 font-[family-name:var(--font-geist-sans)] text-[19px] font-normal leading-[1.3] tracking-[-0.01em] text-zinc-900 sm:px-8 sm:pb-8">
        {title}
      </h3>
    </div>
  );
}

/* --- 1 · No why: Search Console, flipping charts, never saying why --- */

const clicks = [
  62, 64, 61, 65, 63, 66, 64, 63, 65, 62, 64, 63, 48, 41, 38, 36, 37, 35, 36,
  34, 35,
];
const CW = 440;
const CH = 150;
const cx = (i: number) => 4 + (i / (clicks.length - 1)) * (CW - 8);
const cy = (v: number) => 8 + (1 - v / 80) * (CH - 16);
const cline = clicks.map((v, i) => `${i ? "L" : "M"}${cx(i)},${cy(v)}`).join("");
const carea = `${cline}L${cx(clicks.length - 1)},${CH}L${cx(0)},${CH}Z`;
const tabs = ["Clicks", "Impressions", "CTR", "Position"];

function NoWhy({ tick }: { tick: number }) {
  const tab = tick % tabs.length;
  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)]">
      <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-black/[0.10]" />
          ))}
        </span>
        <span className="mx-auto truncate rounded-full bg-black/[0.04] px-4 py-1 font-body text-[11.5px] text-zinc-400">
          search.google.com/search-console/performance
        </span>
      </div>
      <div className="flex">
        <div className="hidden w-24 shrink-0 space-y-3 border-r border-black/[0.05] p-4 sm:block">
          {[70, 55, 80, 50, 65].map((w, i) => (
            <span
              key={i}
              className="block h-2 rounded-full bg-black/[0.07]"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1 p-4">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t, i) => (
              <span
                key={t}
                className={`rounded-md px-2.5 py-1 font-body text-[11.5px] transition-colors duration-300 ${
                  i === tab ? "bg-signal-soft text-signal-deep" : "text-zinc-400"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="relative mt-3">
            <svg
              viewBox={`0 0 ${CW} ${CH}`}
              className="block h-auto w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="nowhy-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5b4fd8" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#5b4fd8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((r) => (
                <line
                  key={r}
                  x1="4"
                  x2={CW - 4}
                  y1={8 + r * 40}
                  y2={8 + r * 40}
                  stroke="#efeff1"
                  strokeDasharray="3 3"
                />
              ))}
              <path d={carea} fill="url(#nowhy-fill)" />
              <path
                d={cline}
                fill="none"
                stroke="#5b4fd8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle
                cx={cx(12)}
                cy={cy(clicks[12])}
                r="4"
                fill="white"
                stroke="#5b4fd8"
                strokeWidth="2"
              />
            </svg>
            {/* The tooltip that gives the number and never the reason. */}
            <span className="absolute left-[58%] top-[6%] rounded-lg bg-signal-ink px-2.5 py-1.5 font-mono text-[11px] leading-[1.5] text-white shadow-lg">
              2 Apr · clicks <span className="text-signal-bright">−42%</span>
              <br />
              why? <span className="text-white/40">no answer</span>
            </span>
          </div>
          <p className="mt-2 font-mono text-[11px] text-zinc-400">
            chart {((tick % 15) + 1).toString().padStart(2, "0")} of 15 · no
            reason given
          </p>
        </div>
      </div>
    </div>
  );
}

/* --- 2 · So you guess: three theories, a spinner that never resolves --- */

const guesses = ["the core update", "the new title", "lost links"];

function Guess({ tick }: { tick: number }) {
  const at = Math.floor(tick / 2) % guesses.length;
  return (
    <div className="mx-auto max-w-xs">
      <div className="flex flex-wrap justify-center gap-1.5">
        {guesses.map((g, i) => (
          <span
            key={g}
            className={`rounded-md px-2 py-1 font-mono text-[11px] ring-1 transition-colors duration-300 ${
              i === at
                ? "bg-white text-zinc-900 ring-black/[0.15]"
                : "bg-white text-zinc-400 ring-black/[0.06]"
            }`}
          >
            {g.replace(/^the /, "")}?
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-full bg-white py-2.5 pl-3 pr-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.06]">
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-signal/25 border-t-signal" />
        <span
          key={at}
          className="truncate font-body text-[13.5px] text-zinc-800 [animation:seerix-fade-in_0.3s_ease-out]"
        >
          Is it {guesses[at]}? Can&rsquo;t tell.
        </span>
      </div>
      <p className="mx-auto mt-3 w-fit rounded-md bg-white px-2 py-0.5 text-center font-mono text-[11px] text-zinc-500">
        3 fixes shipped together · none measured
      </p>
    </div>
  );
}

/* --- 3 · So you pay: one consultant, one slot, next week --- */

function Pay({ tick }: { tick: number }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="mx-auto max-w-xs">
      <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.06]">
        <span className="font-body text-[13.5px] text-zinc-800">
          SEO consultant
        </span>
        <span className="font-mono text-[13px] text-zinc-900">$200 / hr</span>
      </div>
      <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-zinc-400">
          Next week
        </p>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((d, i) =>
            i === 1 ? (
              <span
                key={i}
                className={`flex h-8 items-center justify-center rounded-md bg-signal-ink font-mono text-[11px] text-white transition-shadow duration-700 ${
                  tick % 2 ? "ring-4 ring-signal/20" : "ring-0"
                }`}
              >
                {d}
              </span>
            ) : (
              <span
                key={i}
                className="flex h-8 items-center justify-center rounded-md bg-black/[0.04] font-mono text-[11px] text-zinc-300 line-through"
              >
                {d}
              </span>
            ),
          )}
        </div>
        <p className="mt-2 font-body text-[12px] text-zinc-500">
          One slot. One audit. Once.
        </p>
      </div>
    </div>
  );
}

/* --- 4 · You ask: the question, a beat, then the cause --- */

function Ask({ tick }: { tick: number }) {
  const p = tick % 8;
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3">
      <p className="self-end rounded-2xl rounded-br-md bg-white px-4 py-2.5 font-body text-[14px] text-zinc-900 shadow-sm ring-1 ring-black/[0.06]">
        Why did /pricing drop last week?
      </p>
      <div className="min-h-[5rem]">
        <p className="flex w-fit items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-2.5 font-body text-[12px] text-signal-deep ring-1 ring-black/[0.06]">
          <SeerixMark size={16} animated={false} />
          Seerix
        </p>
        {p < 3 ? (
          <span className="mt-2 inline-flex gap-1 rounded-2xl bg-white px-3 py-3 ring-1 ring-black/[0.06]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        ) : (
          <p className="mt-2 rounded-2xl rounded-bl-md bg-signal-ink px-4 py-2.5 font-body text-[14px] leading-[1.5] text-white [animation:seerix-fade-in_0.35s_ease-out]">
            Google rewrote the titles on four pages on 2 Apr. Not the core
            update.
          </p>
        )}
      </div>
    </div>
  );
}

/* --- 5 · With receipts: the evidence, logged row by row --- */

const rows = [
  ["GSC", "clicks 2,940 → 1,823", "2 Apr"],
  ["SERP", "position 4 → 11", "2 Apr"],
  ["Crawl", "<title> changed", "2 Apr"],
  ["Ruled out", "core update", "·"],
  ["Ruled out", "lost links", "·"],
];

function Receipts({ tick }: { tick: number }) {
  const shown = Math.min(rows.length, (tick % (rows.length + 3)) + 1);
  return (
    <div className="mx-auto max-w-sm rounded-xl bg-white p-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.06]">
      <p className="flex items-center gap-2 font-body text-[13px] text-zinc-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
        Evidence
      </p>
      <ul className="mt-3 border-l border-black/[0.08] pl-4">
        {rows.map(([src, what, when], i) => (
          <li
            key={what}
            className={`relative flex items-baseline justify-between gap-3 py-1.5 transition-all duration-500 ${
              i < shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <span className="absolute -left-[19px] top-3 h-1.5 w-1.5 rounded-full bg-zinc-300" />
            <span className="min-w-0 truncate font-body text-[13.5px] text-zinc-800">
              <span
                className={`font-mono text-[11.5px] ${
                  src === "Ruled out" ? "text-zinc-400" : "text-signal-deep"
                }`}
              >
                {src}
              </span>{" "}
              {what}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-zinc-400">
              {when}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const tick = useTick(ref);

  return (
    <section className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl font-display text-[34px] font-extralight leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
          You already have the data.{" "}
          <span className="text-zinc-400">
            What you don&rsquo;t have is the why.
          </span>
        </h2>

        {/* The bento: separate cards, a wide one beside a narrow one on
            top and three below, each title at its foot. */}
        <div
          ref={ref}
          className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <Cell
            className="md:col-span-2"
            wave="rise"
            title="Fifteen charts, and still no why"
            visual={<NoWhy tick={tick} />}
          />
          <Cell wave="fall" title="So you guess, and change three things" visual={<Guess tick={tick} />} />
          <Cell wave="arc" title="So you pay $200 an hour" visual={<Pay tick={tick} />} />
          <Cell wave="low" title="Or you just ask Seerix" visual={<Ask tick={tick} />} />
          <Cell wave="high" title="And get the receipts" visual={<Receipts tick={tick} />} />
        </div>
      </div>
    </section>
  );
}
