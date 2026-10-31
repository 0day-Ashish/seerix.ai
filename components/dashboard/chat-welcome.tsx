"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { breakdowns } from "@/components/dashboard/data";
import SeerixMark from "@/components/new-landing/seerix-mark";
import {
  ButtonLabel,
  Glow,
  buttonClass,
} from "@/components/new-landing/button";

/* -------------------------------------------------------------------------
 * The chat's opening screen: a greeting, one large box to ask in, shortcut
 * chips, and two cards -- setup steps worth doing, and a way to ask Seerix
 * for more questions worth asking.
 * ---------------------------------------------------------------------- */

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

const I = {
  link: "M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1",
  mic: "M8 1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-4 0v-4a2 2 0 0 1 2-2zM4 7.5a4 4 0 0 0 8 0M8 11.5v3",
  send: "M8 13V3M3.5 7.5L8 3l4.5 4.5",
  bulb: "M6 12.5h4M6.5 14.5h3M8 1.5a4 4 0 0 0-2.4 7.2c.5.4.9 1 .9 1.8h3c0-.8.4-1.4.9-1.8A4 4 0 0 0 8 1.5z",
  drop: "M2 4l4 4 3-3 5 6M10.5 11H14V7.5",
  target:
    "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  check: "M3.5 8.5l3 3 6-7",
  people:
    "M6 7a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 6 7zM1.75 13.5c0-2.3 1.9-4 4.25-4s4.25 1.7 4.25 4M11 2.6a2.2 2.2 0 0 1 0 4.3M12.2 9.7c1.2.5 2 1.8 2 3.8",
  google:
    "M13.5 8.2H8v2.2h3.1A3.5 3.5 0 1 1 10.4 5l1.6-1.6A5.7 5.7 0 1 0 13.7 8z",
  bing: "M4 2v10l4 2.5 4-2.5V8.5L7 6.5",
  calendar: "M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3",
  filter: "M2.5 3h11L9.5 8v5l-3-1.5V8z",
};

const CHIPS: { label: string; q: string; d: string; tag?: string }[] = [
  { label: "Give me ideas", q: "What should I work on this week?", d: I.bulb },
  {
    label: "Explain a drop",
    q: "Why did my clicks drop this week?",
    d: I.drop,
  },
  {
    label: "Quick wins",
    q: "Which pages are close to page one?",
    d: I.target,
  },
  { label: "Check a fix", q: "Did the /pricing title fix work?", d: I.check },
  {
    label: "Competitors",
    q: "Who is taking my clicks?",
    d: I.people,
    tag: "New",
  },
];

type Rec = {
  title: string;
  body: string;
  cta: string;
  d: string;
  tone: string;
  href?: string;
  ask?: string;
};

const RECOMMENDED: Rec[] = [
  {
    title: "Reconnect Google",
    body: "Access expires in 6 days",
    cta: "Reconnect",
    d: I.google,
    tone: "bg-warn-soft text-warn-deep",
    href: "/settings/integrations",
  },
  {
    title: "Connect Bing Webmaster",
    body: "See searches from Bing in the same view",
    cta: "Connect",
    d: I.bing,
    tone: "bg-teal-50 text-teal-700",
    href: "/settings/integrations",
  },
  {
    title: "Add competitors",
    body: "Track who moves on your searches",
    cta: "Add",
    d: I.people,
    tone: "bg-warn-soft text-warn-deep",
    href: "/app/competitors",
  },
  {
    title: "Verify the /pricing fix",
    body: "Marked done 9 days ago, ready to check",
    cta: "Verify",
    d: I.check,
    tone: "bg-good-soft text-good-deep",
    ask: "Did the /pricing title fix work?",
  },
  {
    title: "Weekly report",
    body: "Choose who gets it on Mondays",
    cta: "Set up",
    d: I.calendar,
    tone: "bg-signal-soft text-signal-deep",
    href: "/settings/scheduled",
  },
  {
    title: "Separate your brand searches",
    body: "Branded clicks hide real growth",
    cta: "Add",
    d: I.filter,
    tone: "bg-zinc-100 text-zinc-600",
    href: "/settings/exclusion-lists",
  },
];

/** Questions Seerix "finds" when asked for more. */
const MORE = [
  "Which blog posts lost the most clicks since June?",
  "Why does /services/nextjs-development rank lower on mobile?",
  "Which searches show my page but rarely get clicked?",
];

type Speech = {
  lang: string;
  interimResults: boolean;
  onresult: (e: {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
  }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

export default function ChatWelcome({
  name,
  text,
  setText,
  onSubmit,
  onAsk,
  deep,
  setDeep,
}: {
  name: string;
  text: string;
  setText: (t: string) => void;
  onSubmit: () => void;
  onAsk: (q: string) => void;
  deep: boolean;
  setDeep: (v: boolean) => void;
}) {
  const box = useRef<HTMLTextAreaElement>(null);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [more, setMore] = useState<"idle" | "loading" | "done">("idle");
  const [listening, setListening] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const rec = useRef<Speech | null>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanSpeak(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
    );
    box.current?.focus();
  }, []);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 56), 180)}px`;
  }, [text]);

  useEffect(() => {
    if (!pagesOpen) return;
    const away = (e: PointerEvent) =>
      !pagesRef.current?.contains(e.target as Node) && setPagesOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [pagesOpen]);

  const listen = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const w = window as unknown as Record<string, new () => Speech>;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "en-US";
    r.interimResults = false;
    r.onresult = (e) => {
      const said = Array.from(e.results)
        .map((x) => x[0].transcript)
        .join(" ");
      setText((text ? text + " " : "") + said);
    };
    r.onend = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-1 pb-10 pt-6 sm:pt-12">
      <SeerixMark size={72} className="mb-6" />
      <h1 className="text-center font-display text-[32px] font-semibold tracking-[-0.03em] text-zinc-900 sm:text-[44px]">
        Welcome back, {name}.
      </h1>

      {/* The box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mt-7 w-full rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] transition-shadow focus-within:border-signal-bright/50 focus-within:shadow-[0_0_0_4px_rgba(59,111,224,0.08),0_8px_30px_-12px_rgba(15,23,42,0.18)]"
      >
        <textarea
          ref={box}
          rows={2}
          style={{ outline: "none" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask why your traffic changed, or what to fix next…"
          aria-label="Question"
          className="block w-full resize-none bg-transparent px-5 pb-1 pt-4 font-body text-[15px] leading-[1.55] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
        <div className="flex items-center gap-1.5 px-3 pb-3 pt-1">
          <div ref={pagesRef} className="relative">
            <button
              type="button"
              onClick={() => setPagesOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={pagesOpen}
              title="Ask about a page"
              aria-label="Ask about a page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              <Icon d={I.link} />
            </button>
            {pagesOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]"
              >
                <p className="px-2.5 pb-1 pt-1.5 font-body text-[12px] font-medium text-zinc-400">
                  Ask about a page
                </p>
                {breakdowns.pages.slice(0, 6).map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setText(
                        text.trim()
                          ? `${text.trim()} ${p.label}`
                          : `How is ${p.label} doing?`,
                      );
                      setPagesOpen(false);
                      box.current?.focus();
                    }}
                    className="block w-full truncate rounded-lg px-2.5 py-1.5 text-left font-body text-[13px] text-zinc-700 hover:bg-zinc-100"
                  >
                    {p.host && (
                      <span className="text-zinc-400">{p.host} · </span>
                    )}
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-body text-[13px] text-zinc-500 hover:bg-zinc-50">
              <span className="hidden sm:inline">Deep check</span>
              <span className="hidden rounded bg-signal-soft px-1 text-[10px] font-semibold tracking-wide text-signal-deep sm:inline">
                BETA
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={deep}
                aria-label="Deep check: slower, reads more of your data"
                title="Slower, reads more of your data"
                onClick={() => setDeep(!deep)}
                className={`relative h-5 w-9 shrink-0 rounded-full p-0 transition-colors ${
                  deep ? "bg-signal-bright" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    deep ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
            <button
              type="button"
              onClick={listen}
              disabled={!canSpeak}
              title={
                canSpeak
                  ? listening
                    ? "Stop listening"
                    : "Ask by voice"
                  : "Voice isn't supported in this browser"
              }
              aria-label={listening ? "Stop listening" : "Ask by voice"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                listening
                  ? "bg-danger-soft text-danger-deep"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon
                d={I.mic}
                className={`h-4 w-4 ${listening ? "animate-pulse" : ""}`}
              />
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              aria-label="Send"
              className={`${buttonClass("primary", "app")} w-9 px-0`}
            >
              <Glow />
              <ButtonLabel>
                <Icon d={I.send} />
              </ButtonLabel>
            </button>
          </div>
        </div>
      </form>

      {/* Shortcuts */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => onAsk(c.q)}
            className="flex h-9 items-center gap-2 rounded-full bg-zinc-100 px-3.5 font-body text-[13.5px] text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900"
          >
            <Icon d={c.d} className="h-4 w-4 text-zinc-500" />
            {c.label}
            {c.tag && (
              <span className="rounded-full bg-signal-soft px-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-signal-deep">
                {c.tag}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Two cards */}
      <div className="mt-12 grid w-full gap-4 md:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-zinc-200/80 bg-ghost p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="font-body text-[16px] font-semibold text-zinc-900">
            Recommended
          </h2>
          <ul className="mt-2 divide-y divide-zinc-100">
            {RECOMMENDED.map((r) => {
              const cls =
                "shrink-0 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 font-body text-[12.5px] font-medium text-zinc-800 transition-colors hover:bg-zinc-50";
              return (
                <li key={r.title} className="flex items-center gap-3 py-2.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${r.tone}`}
                  >
                    <Icon d={r.d} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-body text-[13.5px] font-medium text-zinc-900">
                      {r.title}
                    </span>
                    <span className="block truncate font-body text-[12.5px] text-zinc-500">
                      {r.body}
                    </span>
                  </span>
                  {r.href ? (
                    <Link href={r.href} className={cls}>
                      {r.cta}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => r.ask && onAsk(r.ask)}
                      className={cls}
                    >
                      {r.cta}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex min-w-0 flex-col rounded-2xl border border-zinc-200/80 bg-[#fafbfc] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {more === "done" ? (
            <div className="animate-[seerix-fade-in_0.35s_ease-out]">
              <h2 className="font-body text-[16px] font-semibold text-zinc-900">
                Three more worth asking
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {MORE.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => onAsk(q)}
                      className="group flex w-full items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-left font-body text-[13.5px] leading-[1.45] text-zinc-800 transition-colors hover:border-signal-bright/40 hover:bg-signal-soft"
                    >
                      {q}
                      <span className="shrink-0 text-signal-deep transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-center font-body text-[12px] text-zinc-400">
                New suggestions arrive overnight.
              </p>
            </div>
          ) : (
            <div className="m-auto flex flex-col items-center py-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal-soft text-signal-deep">
                <Icon d={I.bulb} className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-body text-[17px] font-semibold text-zinc-900">
                Want more suggestions?
              </h2>
              <p className="mt-1.5 max-w-[16rem] font-body text-[13.5px] leading-[1.55] text-zinc-500">
                Seerix finds three more questions worth asking in about a
                minute.
              </p>
              <button
                type="button"
                disabled={more === "loading"}
                onClick={() => {
                  setMore("loading");
                  setTimeout(() => setMore("done"), 1600);
                }}
                className="mt-5 flex h-10 items-center gap-2 rounded-xl border border-signal-bright/40 bg-white px-4 font-body text-[13.5px] font-medium text-signal-deep transition-colors hover:bg-signal-soft disabled:opacity-70"
              >
                {more === "loading" && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-signal-bright/25 border-t-signal" />
                )}
                {more === "loading"
                  ? "Looking at your data…"
                  : "Get more suggestions"}
              </button>
              <p className="mt-4 font-body text-[12px] text-zinc-400">
                New suggestions arrive overnight.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
