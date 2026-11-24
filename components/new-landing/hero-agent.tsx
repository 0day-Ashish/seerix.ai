"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The agent's window over the hero dashboard: a terminal-like chat in which
 * a question is typed, Seerix works through its checks one line at a time,
 * and the answer arrives with its confidence. It plays in a loop while in
 * view, pauses when scrolled away, and shows the whole exchange at once to
 * anyone who prefers reduced motion.
 */

type Line =
  | { kind: "ask"; text: string }
  | { kind: "step"; text: string }
  | { kind: "say"; body: ReactNode }
  | { kind: "point"; body: ReactNode };

const B = ({ children }: { children: ReactNode }) => (
  <span className="font-medium text-zinc-950">{children}</span>
);

const script: Line[] = [
  { kind: "ask", text: "Why did clicks drop 16% this month?" },
  { kind: "step", text: "Reading 28 days of Search Console rows" },
  { kind: "step", text: "Checking Google updates against your timeline" },
  {
    kind: "say",
    body: (
      <>
        Five pages account for <B>91%</B> of the lost clicks. Google rewrote
        the titles on four of them on <B>2 Apr</B>.
      </>
    ),
  },
  {
    kind: "say",
    body: (
      <>
        <B>Likely cause:</B> the rewritten titles cut CTR on /pricing from
        4.1% to 2.6% at the same position.
      </>
    ),
  },
  { kind: "ask", text: "Was it the core update?" },
  { kind: "step", text: "Comparing the 14 Mar core update with your rankings" },
  { kind: "say", body: <>However:</> },
  { kind: "point", body: <>Positions held within 0.4 on every affected page.</> },
  { kind: "point", body: <>Impressions stayed flat, so demand didn&rsquo;t fall.</> },
  {
    kind: "say",
    body: (
      <>
        Confidence the core update caused it: <B>Low</B>.
      </>
    ),
  },
];

/** What is typed into the prompt at the end, before the loop restarts. */
const DRAFT = "What should I fix first";

const STEP_MS = 900;
const TYPE_MS = 38;

export default function HeroAgent() {
  const root = useRef<HTMLDivElement>(null);
  // How many script lines are on screen, and how much of the current
  // question has been typed.
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setStill(reduce.matches);
        setVisible(e.isIntersecting);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (still || !visible) return;
    const atEnd = shown >= script.length;
    const line = script[shown];
    // A question types out first, then counts as shown.
    const typing = line?.kind === "ask" || atEnd;
    const target = atEnd ? DRAFT.length : line?.kind === "ask" ? line.text.length : 0;

    let t: ReturnType<typeof setTimeout>;
    if (typing && typed < target) {
      t = setTimeout(() => setTyped((n) => n + 1), TYPE_MS);
    } else if (atEnd) {
      // Hold the finished exchange, then start over.
      t = setTimeout(() => {
        setShown(0);
        setTyped(0);
      }, 3200);
    } else {
      t = setTimeout(
        () => {
          setShown((n) => n + 1);
          setTyped(0);
        },
        line?.kind === "ask" ? 350 : line?.kind === "step" ? STEP_MS : STEP_MS * 1.3,
      );
    }
    return () => clearTimeout(t);
  }, [shown, typed, visible, still]);

  const count = still ? script.length : shown;
  const current = !still && shown < script.length ? script[shown] : null;
  const asking = current?.kind === "ask";
  const draft = still ? "" : shown >= script.length ? DRAFT.slice(0, typed) : "";

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.09] bg-white/95 font-mono text-[12.5px] leading-[1.6] text-zinc-700 shadow-[0_30px_70px_-20px_rgba(30,20,80,0.45),0_2px_6px_rgba(15,23,42,0.06)] backdrop-blur-xl"
    >
      {/* Title bar. */}
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-black/[0.07] px-3.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-zinc-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
          seerix-agent
        </span>
      </div>

      {/* The exchange, pinned to its newest line. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 px-4 pb-3">
          {script.slice(0, count).map((line, i) => (
            <Row key={i} line={line} />
          ))}
          {asking && (
            <p className="rounded-md bg-zinc-100 px-2.5 py-1.5 text-zinc-950">
              <span className="text-signal">&gt;</span>{" "}
              {current.text.slice(0, typed)}
              <Caret />
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent" />
      </div>

      {/* The prompt, and what it is connected to. */}
      <div className="shrink-0 border-t border-black/[0.07] px-4 py-2.5 text-zinc-950">
        <span className="text-signal">&gt;</span> {draft}
        {!asking && <Caret />}
      </div>
      <p className="shrink-0 border-t border-black/[0.05] px-4 py-2 text-[11.5px] text-zinc-500">
        search-console connected &middot; arddev.in
      </p>
    </div>
  );
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] animate-pulse bg-signal/70" />
  );
}

function Row({ line }: { line: Line }) {
  const enter = "[animation:seerix-fade-in_0.35s_ease-out_both]";
  if (line.kind === "ask")
    return (
      <p className={`rounded-md bg-zinc-100 px-2.5 py-1.5 text-zinc-950 ${enter}`}>
        <span className="text-signal">&gt;</span> {line.text}
      </p>
    );
  if (line.kind === "step")
    return (
      <p className={`flex gap-2 text-zinc-600 ${enter}`}>
        <span className="text-signal">&rsaquo;</span>
        {line.text}
      </p>
    );
  if (line.kind === "point")
    return (
      <p className={`flex gap-2 pl-1 ${enter}`}>
        <span className="text-zinc-400">&bull;</span>
        <span>{line.body}</span>
      </p>
    );
  return <p className={enter}>{line.body}</p>;
}
