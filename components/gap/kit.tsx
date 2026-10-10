"use client";

import { useState } from "react";

import { domains } from "@/components/gap/data";

/** One colour per compared domain: you in signal, competitors in ink tones. */
export const domainColor: Record<string, string> = {
  "arddev.in": "#ff5a1f",
  "pixelforge.dev": "#36363b",
  "buildstack.io": "#9a96a0",
};

export function Dot({ domain }: { domain: string }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0"
      style={{ background: domainColor[domain] }}
    />
  );
}

/**
 * The comparison bar: "You" plus competitors, a database and the action. Edits
 * are local; Compare re-runs nothing until there is a backend.
 */
export function DomainBar({
  title,
  description,
  extra,
}: {
  title: string;
  description: string;
  extra?: React.ReactNode;
}) {
  const [values, setValues] = useState<string[]>([...domains]);
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="heading-mark font-display text-[30px] font-medium tracking-[-0.025em] text-black">
          {title}
        </h1>
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-400">
          <span className="h-1.5 w-1.5 bg-signal" />
          Sample data
        </span>
      </div>
      <p className="mt-2 font-body text-[14px] text-zinc-500">{description}</p>

      <div className="mt-6 border border-black/[0.12] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          {values.map((v, i) => (
            <label
              key={i}
              className="flex min-w-0 items-center gap-2 border border-black/[0.14] px-3 py-2 focus-within:border-black"
            >
              <Dot domain={domains[i]} />
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400">
                {i === 0 ? "You" : "vs"}
              </span>
              <input
                value={v}
                onChange={(e) =>
                  setValues((all) =>
                    all.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
                className="min-w-0 flex-1 bg-transparent font-body text-[14px] text-black outline-none"
                aria-label={i === 0 ? "Your domain" : `Competitor ${i}`}
              />
            </label>
          ))}
          <button
            type="button"
            className="h-10 bg-[#141416] px-6 font-body text-[14px] font-medium text-white hover:bg-[#36363B]"
          >
            Compare
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 font-body text-[13px] text-zinc-500">
          <button type="button" className="text-signal-deep hover:underline">
            + Add up to 2 competitors
          </button>
          <span className="h-3 w-px bg-black/[0.12]" />
          <span>
            Database: <span className="text-black">US</span>
          </span>
          {extra}
        </div>
      </div>
    </section>
  );
}

/** Tabs with counts, Semrush style, in the site's square chip. */
export function Tabs<T extends string>({
  tabs,
  counts,
  value,
  onChange,
}: {
  tabs: readonly T[];
  counts: Record<T, number>;
  value: T;
  onChange: (t: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex overflow-x-auto border-b border-black/[0.1] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((t) => {
        const on = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t)}
            className={`-mb-px flex shrink-0 flex-col items-start border-b-2 px-4 py-2.5 text-left transition-colors ${
              on ? "border-signal" : "border-transparent hover:bg-black/[0.03]"
            }`}
          >
            <span
              className={`font-body text-[13px] ${on ? "text-black" : "text-zinc-500"}`}
            >
              {t}
            </span>
            <span
              className={`font-mono text-[15px] ${on ? "text-black" : "text-zinc-400"}`}
            >
              {counts[t]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SortHeader({
  label,
  active,
  dir,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.08em] ${
        active ? "text-black" : "text-zinc-500 hover:text-black"
      } ${align === "right" ? "justify-end" : ""}`}
    >
      {label}
      <span className={active ? "text-signal-deep" : "opacity-0"}>
        {dir === "asc" ? "↑" : "↓"}
      </span>
    </button>
  );
}

/** Previous / next with the visible range. */
export function Pager({
  page,
  pages,
  total,
  size,
  onPage,
}: {
  page: number;
  pages: number;
  total: number;
  size: number;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : page * size + 1;
  const to = Math.min(total, (page + 1) * size);
  return (
    <div className="flex items-center justify-between border-t border-black/[0.08] px-4 py-3 font-body text-[13px] text-zinc-500">
      <span>
        {from}–{to} of {total}
      </span>
      <div className="flex gap-1">
        {["Previous", "Next"].map((l, i) => {
          const target = i === 0 ? page - 1 : page + 1;
          const disabled = target < 0 || target >= pages;
          return (
            <button
              key={l}
              type="button"
              disabled={disabled}
              onClick={() => onPage(target)}
              className="border border-black/[0.14] px-3 py-1.5 text-black disabled:opacity-35"
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
