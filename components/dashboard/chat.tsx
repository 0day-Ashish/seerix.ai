"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  cannedAnswer,
  seededThread,
  type Answer,
  type Message,
} from "@/components/dashboard/data";
import { PageTitle } from "@/components/dashboard/kit";

/** **bold** and `code`, built as elements, never as HTML. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((pt, i) => {
        if (!pt) return null;
        if (pt.startsWith("**") && pt.endsWith("**"))
          return (
            <strong key={i} className="font-semibold text-black">
              {pt.slice(2, -2)}
            </strong>
          );
        if (pt.startsWith("`") && pt.endsWith("`"))
          return (
            <code
              key={i}
              className="bg-black/[0.05] px-1 py-px font-mono text-[12.5px] text-black"
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

const NON_ANSWERS = ["needs_clarification", "unsupported_question"];

function Reasoning({ a }: { a: Answer }) {
  const [open, setOpen] = useState(false);
  const conf =
    a.confidence_score != null && !NON_ANSWERS.includes(a.main_cause ?? "");
  const has = conf || a.supporting_evidence?.length || a.limitations?.length;
  if (!has) return null;
  return (
    <div className="mb-4 border border-black/[0.1] bg-[#fbfaf9]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left font-body text-[12.5px] font-medium text-black"
      >
        <span className="font-mono text-[10px] text-signal-deep">
          {open ? "▾" : "▸"}
        </span>
        Reasoning
        {conf && (
          <span className="font-mono text-[11.5px] font-normal text-zinc-500">
            · {Math.round(a.confidence_score! * 100)}% confident
          </span>
        )}
      </button>
      {open && (
        <div className="border-t border-black/[0.08] px-3 pb-3 pt-2.5 font-body text-[12.5px] leading-[1.55]">
          {a.main_cause && !NON_ANSWERS.includes(a.main_cause) && (
            <p className="mb-2 text-zinc-700">
              <strong className="font-semibold text-black">Why:</strong>{" "}
              {a.main_cause}
            </p>
          )}
          {a.supporting_evidence?.map((e) => (
            <p
              key={e.statement}
              className="my-1.5 border-l-2 border-signal pl-2.5 text-zinc-700"
            >
              {e.statement}
            </p>
          ))}
          {a.limitations?.map((l) => (
            <p key={l} className="mt-1.5 italic text-zinc-500">
              {l}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function AiMessage({ a, onAsk }: { a: Answer; onAsk: (q: string) => void }) {
  const [done, setDone] = useState<Record<string, string>>({});
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-[#141416]">
        <span className="h-1.5 w-1.5 bg-signal" />
      </span>
      <div className="min-w-0 flex-1 border border-black/[0.1] bg-white px-4 py-3.5 font-body text-[14px] leading-[1.6] text-zinc-700 sm:max-w-[85%]">
        <Reasoning a={a} />
        <Rich text={a.answer_summary} />

        {a.blocks?.map((b, i) => {
          if (b.type === "table")
            return (
              <div key={i} className="mt-3 overflow-x-auto">
                {b.title && (
                  <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-zinc-500">
                    {b.title}
                  </p>
                )}
                <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr>
                      {b.headers.map((h) => (
                        <th
                          key={h}
                          className="border-b border-black/[0.1] py-1.5 pr-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.06em] text-zinc-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-b border-black/[0.05]">
                        {r.map((c, k) => (
                          <td key={k} className="py-1.5 pr-3 text-black">
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
                className="mt-3 border border-black/[0.1] px-3 py-2.5"
              >
                <p className="font-mono text-[12.5px] text-black">{it.page}</p>
                <p className="mt-0.5 text-[12.5px] text-zinc-500">
                  {it.numbers} · {it.cause}
                </p>
                <p className="mt-1 text-[13.5px] text-black">→ {it.fix}</p>
              </div>
            ));
          return (
            <div key={i} className="mt-3 flex flex-col gap-2.5">
              {b.steps.map((st) => (
                <div key={st.period}>
                  <p className="font-medium text-black">{st.period}</p>
                  {st.actions.map((ac) => (
                    <p key={ac} className="text-[13px] text-zinc-600">
                      • {ac}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          );
        })}

        {a.recommended_actions?.length ? (
          <div className="mt-3">
            {a.recommended_actions.map((r) => (
              <p
                key={r.action_text}
                className="my-1.5 border-l-2 border-signal pl-2.5 text-[13.5px] text-black"
              >
                <Inline text={`→ ${r.action_text}`} />
              </p>
            ))}
          </div>
        ) : null}

        {a.suggested_actions?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {a.suggested_actions.map((s) => {
              const label = done[s.action];
              const cls =
                "border border-black/[0.16] bg-white px-2.5 py-1 font-body text-[12.5px] text-black transition-colors hover:border-signal";
              if (s.action === "open_rankings")
                return (
                  <Link key={s.action} href="/app/rankings" className={cls}>
                    ⚡ {s.label}
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
                  className={`${cls} disabled:border-[#1f6b3a]/30 disabled:bg-[#e5f3ea] disabled:text-[#1f6b3a]`}
                >
                  {label ? `✓ ${label}` : `⚡ ${s.label}`}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const STARTERS = [
  "What changed this week?",
  "Which of my keywords moved the most?",
  "Who should I get links from?",
];

/**
 * The consultant. Opens on the seeded first consultation; until the chat
 * endpoint is wired, replies come from canned answers picked by topic.
 */
export default function Chat({ ask }: { ask?: string }) {
  const [msgs, setMsgs] = useState<Message[]>(seededThread);
  const [thinking, setThinking] = useState(false);
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const asked = useRef(false);

  const send = (q: string) => {
    const t = q.trim();
    if (!t || thinking) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", answer: cannedAnswer(t) }]);
      setThinking(false);
    }, 900);
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

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  return (
    <div>
      <PageTitle
        title="Chat"
        description="Ask about your traffic, rankings, links or content. Every answer shows its reasoning and the data behind it."
      />

      <section className="mt-7 flex h-[calc(100dvh-260px)] min-h-[480px] flex-col border border-black/[0.12] bg-[#fbfaf9]">
        <div
          ref={scroller}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 sm:px-6"
        >
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] bg-[#141416] px-4 py-2.5 font-body text-[14px] leading-[1.55] text-white">
                  {m.text}
                </p>
              </div>
            ) : (
              <AiMessage key={i} a={m.answer} onAsk={send} />
            ),
          )}
          {thinking && (
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#141416]">
                <span className="h-1.5 w-1.5 animate-pulse bg-signal" />
              </span>
              <span className="font-mono text-[12px] text-zinc-500">
                Reading your data…
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-black/[0.1] bg-white p-3 sm:p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="shrink-0 border border-black/[0.12] px-2.5 py-1 font-body text-[12.5px] text-zinc-600 hover:border-black/40 hover:text-black"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
              setText("");
            }}
            className="flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask about your traffic, rankings, links, content…"
              aria-label="Question"
              className="h-11 min-w-0 flex-1 border border-black/[0.16] bg-white px-3.5 font-body text-[14px] text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
            />
            <button
              type="submit"
              disabled={thinking || !text.trim()}
              className="h-11 bg-[#141416] px-5 font-body text-[14px] font-medium text-white hover:bg-[#36363B] disabled:opacity-40"
            >
              Ask
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
