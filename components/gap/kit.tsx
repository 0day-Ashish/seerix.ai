"use client";

import { useState } from "react";

import { domains } from "@/components/gap/data";

/** One colour per compared domain: you in blue, competitors in amber and green. */
export const domainColor: Record<string, string> = {
  "arddev.in": "#5a58d1",
  "pixelforge.dev": "#b06a1f",
  "buildstack.io": "#2f7d5b",
};

export function Dot({ domain }: { domain: string }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
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
        <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-zinc-900">
          {title}
        </h1>
        <span className="flex items-center gap-2 rounded-full bg-zinc-100 px-2.5 py-0.5 font-body text-[12px] font-medium text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          Sample data
        </span>
      </div>
      <p className="mt-1 max-w-2xl font-body text-[14px] leading-[1.55] text-zinc-500">
        {description}
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200/80 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          {values.map((v, i) => (
            <label
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 transition-colors focus-within:border-signal"
            >
              <Dot domain={domains[i]} />
              <span className="shrink-0 font-body text-[12.5px] font-medium text-zinc-500">
                {i === 0 ? "You" : "vs"}
              </span>
              <input
                value={v}
                onChange={(e) =>
                  setValues((all) =>
                    all.map((x, j) => (j === i ? e.target.value : x)),
                  )
                }
                className="min-w-0 flex-1 bg-transparent font-body text-[14px] text-zinc-900 outline-none"
                aria-label={i === 0 ? "Your domain" : `Competitor ${i}`}
              />
            </label>
          ))}
          <button
            type="button"
            className="h-10 rounded-lg bg-signal px-6 font-body text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-signal-deep"
          >
            Compare
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 font-body text-[13px] text-zinc-500">
          <button
            type="button"
            className="text-signal hover:text-signal-deep hover:underline hover:underline-offset-[3px]"
          >
            + Add up to 2 competitors
          </button>
          <span className="h-3 w-px bg-zinc-200" />
          <span>
            Database: <span className="font-medium text-zinc-900">US</span>
          </span>
          {extra}
        </div>
      </div>
    </section>
  );
}

/** Tabs with counts, Semrush style, with a blue underline on the open one. */
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
      className="flex overflow-x-auto border-b border-zinc-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className={`-mb-px flex shrink-0 flex-col items-start rounded-t-lg border-b-2 px-4 py-2.5 text-left transition-colors ${
              on ? "border-signal" : "border-transparent hover:bg-zinc-50"
            }`}
          >
            <span
              className={`font-body text-[13px] ${on ? "font-medium text-zinc-900" : "text-zinc-500"}`}
            >
              {t}
            </span>
            <span
              className={`font-body text-[15px] font-semibold tabular-nums ${on ? "text-signal" : "text-zinc-400"}`}
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
      className={`flex w-full items-center gap-1 whitespace-nowrap font-body text-[12.5px] font-medium ${
        active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
      } ${align === "right" ? "justify-end" : ""}`}
    >
      {label}
      <span className={active ? "text-signal" : "opacity-0"}>
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
    <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 font-body text-[13px] tabular-nums text-zinc-500">
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
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-800 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
