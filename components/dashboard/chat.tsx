"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  cannedAnswer,
  type Answer,
  type Message,
} from "@/components/dashboard/data";
import SeerixMark from "@/components/new-landing/seerix-mark";

/* -------------------------------------------------------------------------
 * Small pieces
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

const ICON = {
  plus: "M8 3v10M3 8h10",
  send: "M8 13V3M3.5 7.5L8 3l4.5 4.5",
  stop: "M5 5h6v6H5z",
  copy: "M5.5 5.5V3.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M3.5 5.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z",
  check: "M3.5 8.5l3 3 6-7",
  up: "M5 7.5V13H3V7.5zM5 7.5l2.5-5a1.5 1.5 0 0 1 1.5 1.5V6h3.2a1 1 0 0 1 1 1.2l-1 5a1 1 0 0 1-1 .8H5",
  down: "M5 8.5V3H3v5.5zM5 8.5l2.5 5A1.5 1.5 0 0 0 9 12v-2h3.2a1 1 0 0 0 1-1.2l-1-5a1 1 0 0 0-1-.8H5",
  retry: "M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5",
  chevron: "M6 4l4 4-4 4",
  arrowDown: "M8 3v10M3.5 8.5L8 13l4.5-4.5",
  chat: "M2.5 3h11v8H7.5L4.5 13.5V11h-2z",
};

/** **bold** and `code`, built as elements, never as HTML. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((pt, i) => {
        if (!pt) return null;
        if (pt.startsWith("**") && pt.endsWith("**"))
          return (
            <strong key={i} className="font-semibold text-zinc-900">
              {pt.slice(2, -2)}
            </strong>
          );
        if (pt.startsWith("`") && pt.endsWith("`"))
          return (
            <code
              key={i}
              className="rounded-md bg-zinc-100 px-1.5 py-px font-mono text-[12.5px] text-zinc-800"
            >
              {pt.slice(1, -1)}
            </code>
          );
        return <span key={i}>{pt}</span>;
      })}
    </>
  );
}

const BULLET = /^\s*([•\-–—→]|\d+[.)])\s+/;

/** Paragraphs on blank lines, bullet runs as lists. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((block, b) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const bullets = lines.filter((l) => BULLET.test(l));
        if (bullets.length && bullets.length >= lines.length - 1)
          return (
            <ul key={b} className="mb-3 list-disc pl-5 last:mb-0">
              {bullets.map((l, i) => (
                <li key={i} className="my-1">
                  <Inline text={l.replace(BULLET, "")} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={b} className="mb-3 last:mb-0">
            {lines.map((l, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <Inline text={l} />
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

const plain = (s: string) => s.replace(/\*\*|`/g, "");

/** Cuts text after `n` words without breaking a **bold** or `code` run. */
function firstWords(text: string, n: number) {
  const parts = text.split(/(\s+)/);
  let out = "";
  let words = 0;
  for (const p of parts) {
    if (words >= n) break;
    out += p;
    if (p.trim()) words++;
  }
  const open = (re: RegExp) => (out.match(re)?.length ?? 0) % 2 === 1;
  if (open(/\*\*/g)) out += "**";
  if (open(/`/g)) out += "`";
  return out;
}

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

const prefersStill = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------------------------------
 * The answer
 * ---------------------------------------------------------------------- */

const NON_ANSWERS = ["needs_clarification", "unsupported_question"];

function Reasoning({ a }: { a: Answer }) {
  const [open, setOpen] = useState(false);
  const conf =
    a.confidence_score != null && !NON_ANSWERS.includes(a.main_cause ?? "");
  const has = conf || a.supporting_evidence?.length || a.limitations?.length;
  if (!has) return null;
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white py-1 pl-2 pr-3 font-body text-[12.5px] text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
      >
        <Icon
          d={ICON.chevron}
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${open ? "rotate-90" : ""}`}
        />
        How Seerix worked this out
        {conf && (
          <span className="ml-1 rounded-full bg-emerald-50 px-1.5 py-px text-[11.5px] font-medium tabular-nums text-emerald-700">
            {Math.round(a.confidence_score! * 100)}% sure
          </span>
        )}
      </button>
      {open && (
        <div className="mt-2 animate-[seerix-fade-in_0.25s_ease-out] rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 font-body text-[13px] leading-[1.6]">
          {a.main_cause && !NON_ANSWERS.includes(a.main_cause) && (
            <p className="mb-2 text-zinc-700">
              <strong className="font-semibold text-zinc-900">Why:</strong>{" "}
              {a.main_cause}
            </p>
          )}
          {a.supporting_evidence?.length ? (
            <ol className="flex flex-col gap-1.5">
              {a.supporting_evidence.map((e, i) => (
                <li key={e.statement} className="flex gap-2.5 text-zinc-700">
                  <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white text-[10.5px] font-medium text-zinc-500 ring-1 ring-zinc-200">
                    {i + 1}
                  </span>
                  {e.statement}
                </li>
              ))}
            </ol>
          ) : null}
          {a.limitations?.map((l) => (
            <p key={l} className="mt-2 text-[12.5px] text-zinc-500">
              Note: {l}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Blocks({ a, onAsk }: { a: Answer; onAsk: (q: string) => void }) {
  const [done, setDone] = useState<Record<string, string>>({});
  return (
    <div className="animate-[seerix-fade-in_0.35s_ease-out]">
      {a.blocks?.map((b, i) => {
        if (b.type === "table")
          return (
            <div
              key={i}
              className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white"
            >
              {b.title && (
                <p className="border-b border-zinc-100 px-3.5 py-2.5 font-body text-[13px] font-medium text-zinc-800">
                  {b.title}
                </p>
              )}
              <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
                <thead>
                  <tr>
                    {b.headers.map((h) => (
                      <th
                        key={h}
                        className="border-b border-zinc-100 bg-zinc-50/70 px-3.5 py-2 font-body text-[12px] font-medium capitalize text-zinc-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r, j) => (
                    <tr
                      key={j}
                      className="border-b border-zinc-100 last:border-b-0"
                    >
                      {r.map((c, k) => (
                        <td
                          key={k}
                          className="px-3.5 py-2 tabular-nums text-zinc-800"
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        if (b.type === "page_findings")
          return b.items.map((it) => (
            <div
              key={it.page}
              className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <p className="break-all font-body text-[13.5px] font-medium text-zinc-900">
                {it.page}
              </p>
              <p className="mt-0.5 text-[12.5px] text-zinc-500">
                {it.numbers} · {it.cause}
              </p>
              <p className="mt-2 flex gap-2 rounded-lg bg-[#f5f8fe] px-3 py-2 text-[13px] text-zinc-800">
                <span className="text-[#1a5fd0]">Fix</span>
                {it.fix}
              </p>
            </div>
          ));
        return (
          <div
            key={i}
            className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
          >
            {b.steps.map((st) => (
              <div key={st.period}>
                <p className="text-[13px] font-medium text-zinc-900">
                  {st.period}
                </p>
                <ul className="mt-1 list-disc pl-5 text-[13px] text-zinc-600">
                  {st.actions.map((ac) => (
                    <li key={ac}>{ac}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}

      {a.recommended_actions?.length ? (
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-medium text-zinc-900">
            What to do
          </p>
          <ol className="flex flex-col gap-1.5">
            {a.recommended_actions.map((r, i) => (
              <li key={r.action_text} className="flex gap-2.5 text-[14px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef3fd] text-[11px] font-semibold text-[#1a5fd0]">
                  {i + 1}
                </span>
                <span>
                  <Inline text={r.action_text} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {a.suggested_actions?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {a.suggested_actions.map((s) => {
            const label = done[s.action];
            const cls =
              "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-body text-[12.5px] font-medium text-zinc-800 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:border-[#3b6fe0]/40 hover:bg-[#f5f8fe] hover:text-[#1a5fd0]";
            if (s.action === "open_rankings")
              return (
                <Link key={s.action} href="/app/rankings" className={cls}>
                  {s.label} →
                </Link>
              );
            return (
              <button
                key={s.action}
                type="button"
                disabled={!!label}
                onClick={() => {
                  if (s.action.startsWith("ask:"))
                    return onAsk(s.action.slice(4));
                  setDone((d) => ({
                    ...d,
                    [s.action]:
                      s.action === "run_crawl"
                        ? "Crawl started"
                        : "Added to fix list",
                  }));
                }}
                className={`${cls} disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700 disabled:shadow-none`}
              >
                {label ? (
                  <>
                    <Icon d={ICON.check} className="h-3.5 w-3.5" />
                    {label}
                  </>
                ) : (
                  <>
                    <Icon d={ICON.plus} className="h-3.5 w-3.5" />
                    {s.label}
                  </>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  children,
  on = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  on?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={on}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
        on
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
      }`}
    >
      {children}
    </button>
  );
}

function SeerixAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
      <SeerixMark size={16} animated={false} />
    </span>
  );
}

function AiMessage({
  a,
  live,
  onDone,
  onAsk,
  onRetry,
}: {
  a: Answer;
  live: boolean;
  onDone: () => void;
  onAsk: (q: string) => void;
  onRetry?: () => void;
}) {
  const total = wordCount(a.answer_summary);
  const [shown, setShown] = useState(live && !prefersStill() ? 0 : total);
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const streaming = shown < total;

  // Words arrive a few at a time, as a model's reply would.
  useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setShown((n) => Math.min(n + 3, total)), 28);
    return () => clearTimeout(id);
  }, [shown, streaming, total]);

  useEffect(() => {
    if (live && !streaming) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming]);

  return (
    <div className="flex gap-3.5">
      <SeerixAvatar />
      <div className="min-w-0 flex-1 pt-1">
        <p className="mb-2 font-body text-[13px] font-semibold text-zinc-900">
          Seerix
        </p>
        <div className="font-body text-[14.5px] leading-[1.7] text-zinc-700">
          {!streaming && <Reasoning a={a} />}
          <Rich
            text={
              streaming ? firstWords(a.answer_summary, shown) : a.answer_summary
            }
          />
          {streaming && (
            <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-full bg-[#3b6fe0]" />
          )}
          {!streaming && <Blocks a={a} onAsk={onAsk} />}
        </div>

        {!streaming && (
          <div className="mt-3 flex items-center gap-0.5">
            <ActionBtn
              label={copied ? "Copied" : "Copy answer"}
              onClick={() => {
                navigator.clipboard?.writeText(plain(a.answer_summary));
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              <Icon
                d={copied ? ICON.check : ICON.copy}
                className={`h-4 w-4 ${copied ? "text-emerald-600" : ""}`}
              />
            </ActionBtn>
            <ActionBtn
              label="Good answer"
              on={vote === "up"}
              onClick={() => setVote((v) => (v === "up" ? null : "up"))}
            >
              <Icon d={ICON.up} />
            </ActionBtn>
            <ActionBtn
              label="Bad answer"
              on={vote === "down"}
              onClick={() => setVote((v) => (v === "down" ? null : "down"))}
            >
              <Icon d={ICON.down} />
            </ActionBtn>
            {onRetry && (
              <ActionBtn label="Ask again" onClick={onRetry}>
                <Icon d={ICON.retry} />
              </ActionBtn>
            )}
            {vote && (
              <span className="ml-2 animate-[seerix-fade-in_0.25s_ease-out] font-body text-[12px] text-zinc-400">
                Thanks, that helps Seerix learn.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Three dots bouncing in turn while Seerix works on the answer. */
function Thinking() {
  return (
    <div className="flex gap-3.5">
      <SeerixAvatar />
      <div className="pt-1">
        <p className="mb-2 font-body text-[13px] font-semibold text-zinc-900">
          Seerix
        </p>
        <span
          role="status"
          aria-label="Seerix is thinking"
          className="inline-flex h-9 items-center gap-1.5 rounded-2xl rounded-tl-md bg-zinc-100 px-4"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-zinc-400"
              style={{
                animation: `seerix-typing 1.2s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Threads and the composer
 * ---------------------------------------------------------------------- */

type Msg = Message & { id: number; live?: boolean };

const STARTERS = [
  {
    q: "What changed this week?",
    sub: "A plain summary of the last 7 days",
    d: "M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3",
  },
  {
    q: "Which of my keywords moved the most?",
    sub: "Biggest gains and drops on Google",
    d: "M2 12l4-4 3 3 5-6M10.5 5H14v3.5",
  },
  {
    q: "Which pages are close to page one?",
    sub: "Quick wins worth a small push",
    d: "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
  {
    q: "Who should I get links from?",
    sub: "Sites that link to competitors, not you",
    d: "M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1",
  },
];

const SOURCES = ["Search Console", "Rankings", "Page changes", "Backlinks"];
const RANGES = [
  "Last 7 days",
  "Last 28 days",
  "Last 3 months",
  "Last 16 months",
];

let nextId = 1;

/**
 * The consultant. Opens empty on a few starter questions; until the chat
 * endpoint is wired, replies come from canned answers picked by topic.
 */
export default function Chat({ ask }: { ask?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [title, setTitle] = useState("New chat");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [text, setText] = useState("");
  const [sources, setSources] = useState<string[]>(SOURCES.slice(0, 3));
  const [range, setRange] = useState(RANGES[1]);
  const [atBottom, setAtBottom] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const asked = useRef(false);
  const busy = thinking || streaming;

  const send = (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    setMsgs((m) => {
      if (!m.length) setTitle(t);
      return [...m, { role: "user", text: t, id: nextId++ }];
    });
    setThinking(true);
    setAtBottom(true);
    timer.current = setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { role: "ai", answer: cannedAnswer(t), id: nextId++, live: true },
      ]);
      setThinking(false);
      setStreaming(true);
    }, 1900);
  };

  const stop = () => {
    clearTimeout(timer.current);
    setThinking(false);
  };

  const newChat = () => {
    stop();
    setStreaming(false);
    setMsgs([]);
    setTitle("New chat");
    setTimeout(() => box.current?.focus(), 0);
  };

  // A question handed over from an alert or another tab ("Ask why").
  useEffect(() => {
    if (!ask || asked.current) return;
    // Mark it asked only once it is sent, so a dev double-run can't drop it.
    const id = setTimeout(() => {
      asked.current = true;
      send(ask);
    }, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ask]);

  // Follow the conversation while the reader is at the bottom of it.
  useEffect(() => {
    const el = scroller.current;
    if (el && atBottom && (msgs.length || thinking))
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  });

  // The box grows with what is typed, up to a limit.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  const submit = () => {
    if (busy) return;
    send(text);
    setText("");
  };

  return (
    <div className="flex h-[calc(100dvh-200px)] min-h-[480px] gap-4 lg:h-[calc(100dvh-130px)]">
      {/* The conversation */}
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate font-body text-[15px] font-semibold text-zinc-900">
              {title}
            </h1>
            <p className="truncate font-body text-[12.5px] text-zinc-500">
              arddev.in · answers cite your own data
            </p>
          </div>
          <button
            type="button"
            onClick={newChat}
            disabled={msgs.length === 0 && !thinking}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 font-body text-[12.5px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          >
            <Icon d={ICON.plus} className="h-3.5 w-3.5" />
            New chat
          </button>
        </header>

        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
          }}
          data-lenis-prevent
          className="flex-1 overscroll-contain overflow-y-auto"
        >
          {msgs.length === 0 && !thinking ? (
            <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-5 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-zinc-200">
                <SeerixMark size={24} animated={false} />
              </span>
              <h2 className="mt-4 font-display text-[22px] font-semibold tracking-[-0.02em] text-zinc-900">
                What do you want to know about arddev.in?
              </h2>
              <p className="mt-1.5 font-body text-[14px] text-zinc-500">
                Ask in your own words. Every answer shows the data behind it.
              </p>
              <div className="mt-7 grid w-full gap-2.5 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s.q}
                    type="button"
                    onClick={() => send(s.q)}
                    className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 text-left transition-colors hover:border-[#3b6fe0]/40 hover:bg-[#f5f8fe]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 group-hover:bg-white group-hover:text-[#1a5fd0]">
                      <Icon d={s.d} />
                    </span>
                    <span>
                      <span className="block font-body text-[13.5px] font-medium text-zinc-900">
                        {s.q}
                      </span>
                      <span className="block font-body text-[12.5px] text-zinc-500">
                        {s.sub}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
              {msgs.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={m.id}
                    className="flex animate-[seerix-fade-in_0.25s_ease-out] justify-end"
                  >
                    <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-zinc-100 px-4 py-2.5 font-body text-[14.5px] leading-[1.55] text-zinc-900">
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <AiMessage
                    key={m.id}
                    a={m.answer}
                    live={!!m.live}
                    onDone={() => setStreaming(false)}
                    onAsk={send}
                    onRetry={
                      i === msgs.length - 1 && msgs[i - 1]?.role === "user"
                        ? () => {
                            const q = (msgs[i - 1] as { text: string }).text;
                            setMsgs((all) => all.slice(0, -2));
                            setTimeout(() => send(q), 0);
                          }
                        : undefined
                    }
                  />
                ),
              )}
              {thinking && <Thinking />}
            </div>
          )}
        </div>

        {!atBottom && (
          <button
            type="button"
            onClick={() => {
              setAtBottom(true);
              scroller.current?.scrollTo({
                top: scroller.current.scrollHeight,
                behavior: "smooth",
              });
            }}
            aria-label="Jump to latest"
            className="absolute bottom-[150px] left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-[0_6px_16px_-6px_rgba(15,23,42,0.25)] hover:text-zinc-900"
          >
            <Icon d={ICON.arrowDown} />
          </button>
        )}

        {/* Composer */}
        <div className="px-3 pb-3 pt-1 sm:px-6 sm:pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.12)] transition-shadow focus-within:border-[#3b6fe0]/50 focus-within:shadow-[0_0_0_4px_rgba(59,111,224,0.08)]"
          >
            <textarea
              ref={box}
              rows={1}
              // The whole box shows focus; the site-wide ring would double it.
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
                  submit();
                }
              }}
              placeholder="Ask about your traffic, rankings, links or content…"
              aria-label="Question"
              className="block max-h-[200px] w-full resize-none bg-transparent px-4 pb-1 pt-3.5 font-body text-[14.5px] leading-[1.55] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
            <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-1">
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <label className="relative shrink-0">
                  <span className="sr-only">Date range</span>
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="h-7 cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white pl-2.5 pr-7 font-body text-[12px] text-zinc-700 hover:bg-zinc-50 focus:outline-none"
                  >
                    {RANGES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </label>
                {SOURCES.map((s) => {
                  const on = sources.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setSources((cur) =>
                          on
                            ? cur.length > 1
                              ? cur.filter((x) => x !== s)
                              : cur
                            : [...cur, s],
                        )
                      }
                      className={`flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 font-body text-[12px] transition-colors ${
                        on
                          ? "border-[#3b6fe0]/30 bg-[#eef3fd] text-[#1a5fd0]"
                          : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
                      }`}
                    >
                      {on && <Icon d={ICON.check} className="h-3 w-3" />}
                      {s}
                    </button>
                  );
                })}
              </div>
              {thinking ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
                >
                  <Icon d={ICON.stop} className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={busy || !text.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-link text-white transition-colors hover:bg-link-deep disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  <Icon d={ICON.send} />
                </button>
              )}
            </div>
          </form>
          <p className="mt-2 text-center font-body text-[11.5px] text-zinc-400">
            Enter to send · Shift + Enter for a new line · Seerix only answers
            from your data
          </p>
        </div>
      </section>
    </div>
  );
}
