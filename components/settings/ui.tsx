"use client";

import { useState } from "react";

/* -------------------------------------------------------------------------
 * The settings kit: page header, framed panels, labelled rows, inputs,
 * toggles, buttons and tables. Square corners, the site's ink and signal.
 * ---------------------------------------------------------------------- */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-black/[0.08] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-[30px] font-medium tracking-[-0.025em] text-black">
          {title}
        </h2>
        <p className="mt-2 max-w-xl font-body text-[15px] leading-[1.55] text-zinc-500">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  footer,
  tone = "default",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={`mt-8 border bg-white ${
        tone === "danger" ? "border-signal/40" : "border-black/[0.12]"
      }`}
    >
      <div className="border-b border-black/[0.08] px-6 py-5">
        <h3 className="font-display text-[18px] tracking-[-0.01em] text-black">
          {title}
        </h3>
        {description && (
          <p className="mt-1 font-body text-[14px] leading-[1.5] text-zinc-500">
            {description}
          </p>
        )}
      </div>
      <div className="px-6 py-2">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-3 border-t border-black/[0.08] bg-[#f7f6f4] px-6 py-3.5">
          {footer}
        </div>
      )}
    </section>
  );
}

/** A labelled row inside a panel: label and hint left, control right. */
export function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-b border-black/[0.06] py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center sm:gap-8">
      <div>
        <p className="font-body text-[15px] text-black">{label}</p>
        {hint && (
          <p className="mt-0.5 font-body text-[13px] leading-[1.5] text-zinc-500">
            {hint}
          </p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const field =
  "w-full border border-black/[0.16] bg-white px-3.5 py-2.5 font-body text-[15px] text-black placeholder:text-zinc-400 transition-colors hover:border-black/30 focus:border-black focus:outline-none disabled:bg-[#f7f6f4] disabled:text-zinc-500";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${field} ${props.className ?? ""}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${field} resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${field} cursor-pointer appearance-none pr-10 ${props.className ?? ""}`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}

export function Toggle({
  defaultOn = false,
  label,
}: {
  defaultOn?: boolean;
  label: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 shrink-0 transition-colors duration-200 ${
        on ? "bg-signal" : "bg-black/[0.15]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 bg-white transition-transform duration-200 ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const styles = {
    primary: "bg-[#141416] text-white hover:bg-[#36363B]",
    secondary:
      "border border-black/[0.16] bg-white text-black hover:border-black/40",
    danger:
      "border border-signal/50 bg-white text-signal-deep hover:bg-signal-soft",
    ghost: "text-zinc-600 hover:bg-black/[0.04] hover:text-black",
  }[variant];
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 px-4 font-body text-[14px] font-medium transition-colors ${styles} ${className}`}
    />
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "signal";
}) {
  const styles = {
    neutral: "border border-black/[0.14] text-zinc-600",
    good: "bg-[#e5f3ea] text-[#1f6b3a]",
    signal: "bg-signal-soft text-signal-deep",
  }[tone];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] ${styles}`}
    >
      {children}
    </span>
  );
}

/** A plain ruled table; scrolls sideways inside itself on narrow screens. */
export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="-mx-6 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={h + i}
                className="border-b border-black/[0.08] px-6 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-zinc-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-black/[0.06] last:border-b-0"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className="px-6 py-4 font-body text-[14px] text-zinc-700"
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
}

/** A usage meter: label, used of limit, and a bar that turns signal near the cap. */
export function Meter({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="border-b border-black/[0.06] py-5 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-body text-[15px] text-black">{label}</p>
        <p className="font-mono text-[13px] text-zinc-600">
          {used.toLocaleString("en-US")} / {limit.toLocaleString("en-US")}
          {unit ? ` ${unit}` : ""}
        </p>
      </div>
      <div className="mt-3 h-2 bg-black/[0.07]">
        <div
          className={`h-full ${pct >= 80 ? "bg-signal" : "bg-[#141416]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** The note shown on pages whose figures are sample data until the app is wired up. */
export function DemoNote() {
  return (
    <p className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-400">
      <span className="h-1.5 w-1.5 bg-signal" />
      Sample data
    </p>
  );
}
