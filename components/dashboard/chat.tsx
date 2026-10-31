"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  account,
  cannedAnswer,
  type Answer,
  type Message,
} from "@/components/dashboard/data";
import {
  getThread,
  newThreadId,
  saveThread,
  setActiveThread,
} from "@/components/dashboard/chat-history";
import ChatWelcome from "@/components/dashboard/chat-welcome";
import { Btn, PageTitle } from "@/components/dashboard/kit";
import {
  ButtonLabel,
  Glow,
  buttonClass,
} from "@/components/new-landing/button";

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
        className="inline-flex items-center gap-1.5 font-body text-[12.5px] text-zinc-400 transition-colors hover:text-zinc-700"
      >
        <Icon
          d={ICON.chevron}
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
        />
        How Seerix worked this out
        {conf && (
          <span className="ml-1 font-body text-[12.5px] tabular-nums text-zinc-400">
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
              <p className="mt-2 flex gap-2 rounded-lg bg-signal-soft px-3 py-2 text-[13px] text-zinc-800">
                <span className="text-signal-deep">Fix</span>
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
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal-soft text-[11px] font-semibold text-signal-deep">
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
              "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-body text-[12.5px] font-medium text-zinc-800 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:border-signal-bright/40 hover:bg-signal-soft hover:text-signal-deep";
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
                className={`${cls} disabled:border-good-soft disabled:bg-good-soft disabled:text-good-deep disabled:shadow-none`}
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
    // The reply sits on the page rather than in a bubble: the grey block
    // above it is the question, so the answer needs no frame of its own.
    <div className="min-w-0">
      <div className="min-w-0">
        <div className="font-body text-[14.5px] leading-[1.7] text-zinc-700">
          {!streaming && <Reasoning a={a} />}
          <Rich
            text={
              streaming ? firstWords(a.answer_summary, shown) : a.answer_summary
            }
          />
          {streaming && (
            <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-full bg-signal-bright" />
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
                className={`h-4 w-4 ${copied ? "text-good-deep" : ""}`}
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
    <div className="min-w-0">
      <div>
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
  "What changed this week?",
  "Which of my keywords moved the most?",
  "Which pages are close to page one?",
  "Who should I get links from?",
];

let nextId = 1;

/**
 * The consultant. Opens empty on a few starter questions; until the chat
 * endpoint is wired, replies come from canned answers picked by topic.
 */
export default function Chat({
  ask,
  thread,
}: {
  ask?: string;
  /** An earlier conversation to reopen, from the sidebar. */
  thread?: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const threadId = useRef<string | null>(null);
  // How many messages came from storage; opening a chat isn't a change.
  const loaded = useRef(0);
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  // Deep check: a slower answer that reads more of the data.
  const [deep, setDeep] = useState(false);
  const [text, setText] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const asked = useRef(false);
  const busy = thinking || streaming;

  const send = (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    setMsgs((m) => [...m, { role: "user", text: t, id: nextId++ }]);
    setThinking(true);
    setAtBottom(true);
    timer.current = setTimeout(
      () => {
        setMsgs((m) => [
          ...m,
          { role: "ai", answer: cannedAnswer(t), id: nextId++, live: true },
        ]);
        setThinking(false);
        setStreaming(true);
      },
      deep ? 3400 : 1900,
    );
  };

  const stop = () => {
    clearTimeout(timer.current);
    setThinking(false);
  };

  const newChat = () => {
    stop();
    setStreaming(false);
    setMsgs([]);
    threadId.current = null;
    loaded.current = 0;
    setActiveThread(null);
    window.history.replaceState(null, "", "/app/chat");
    setTimeout(() => box.current?.focus(), 0);
  };

  // Reopen a thread picked in the sidebar.
  useEffect(() => {
    const t = thread ? getThread(thread) : null;
    if (t) {
      threadId.current = t.id;
      loaded.current = t.messages.length;
      setMsgs(t.messages.map((m) => ({ ...m, id: nextId++ })));
    }
    setActiveThread(t?.id ?? null);
    return () => setActiveThread(null);
  }, [thread]);

  // Save the conversation once each answer has finished arriving. The first
  // save gives it an id and puts that in the address, so a reload keeps it.
  useEffect(() => {
    if (!msgs.length || thinking || streaming) return;
    if (msgs.length === loaded.current) return;
    const first = msgs.find((m) => m.role === "user");
    if (!first || first.role !== "user") return;
    if (!threadId.current) {
      threadId.current = newThreadId();
      window.history.replaceState(null, "", `/app/chat?t=${threadId.current}`);
      setActiveThread(threadId.current);
    }
    saveThread({
      id: threadId.current,
      title: first.text,
      at: Date.now(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      messages: msgs.map(({ id, live, ...m }) => m as Message),
    });
  }, [msgs, thinking, streaming]);

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
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  const submit = () => {
    if (busy) return;
    send(text);
    setText("");
  };

  if (msgs.length === 0 && !thinking)
    return (
      <ChatWelcome
        name={account.first_name}
        text={text}
        setText={setText}
        onSubmit={submit}
        onAsk={send}
        deep={deep}
        setDeep={setDeep}
      />
    );

  return (
    <div>
      <PageTitle
        title="Chat"
        description="Ask about your traffic, rankings, links or content. Every answer shows its reasoning and the data behind it."
        action={
          msgs.length > 0 || thinking ? (
            <Btn onClick={newChat}>
              <Icon d={ICON.plus} className="h-3.5 w-3.5" />
              New chat
            </Btn>
          ) : undefined
        }
      />

      <section className="relative mt-6 flex h-[calc(100dvh-330px)] min-h-[440px] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-ghost shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:h-[calc(100dvh-240px)]">
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
          }}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {
            <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
              {msgs.map((m, i) =>
                m.role === "user" ? (
                  <p
                    key={m.id}
                    className="animate-[seerix-fade-in_0.25s_ease-out] whitespace-pre-wrap rounded-xl bg-zinc-100 px-4 py-3 font-body text-[14.5px] leading-[1.55] text-zinc-900"
                  >
                    {m.text}
                  </p>
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
          }
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
            className="absolute bottom-[132px] left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-[0_6px_16px_-6px_rgba(15,23,42,0.25)] hover:text-zinc-900"
          >
            <Icon d={ICON.arrowDown} />
          </button>
        )}

        {/* Starter questions, then the box. */}
        <div className="border-t border-zinc-100 bg-white p-3 sm:p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STARTERS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                disabled={busy}
                className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 font-body text-[12.5px] text-zinc-600 transition-colors hover:border-signal-bright/40 hover:bg-signal-soft hover:text-signal-deep disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={box}
              rows={1}
              // The box shows focus with its border; the site-wide ring would double it.
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
              placeholder="Ask about your traffic, rankings, links, content…"
              aria-label="Question"
              className="block min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 font-body text-[14px] leading-[1.5] text-zinc-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-zinc-400 focus:border-signal-bright focus:ring-2 focus:ring-signal-bright/15"
            />
            {thinking ? (
              <button
                type="button"
                onClick={stop}
                className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 font-body text-[14px] font-medium text-zinc-800 hover:bg-zinc-50"
              >
                <Icon d={ICON.stop} className="h-3 w-3 fill-current" />
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={busy || !text.trim()}
                className={`${buttonClass("primary")} h-11 px-5`}
              >
                <Glow />
                <ButtonLabel>Ask</ButtonLabel>
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
