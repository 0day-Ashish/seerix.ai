"use client";

import { useState } from "react";

/* -------------------------------------------------------------------------
 * The settings kit: page header, framed panels, labelled rows, inputs,
 * toggles, buttons and tables. Soft corners, quiet greys and the dashboard's
 * blue for actions; red for anything destructive.
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
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-zinc-900">
          {title}
        </h2>
        <p className="mt-1 max-w-xl font-body text-[14px] leading-[1.55] text-zinc-500">
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
      className={`mt-6 overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${
        tone === "danger" ? "border-red-200" : "border-zinc-200/80"
      }`}
    >
      <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
        <h3
          className={`font-body text-[15px] font-semibold ${
            tone === "danger" ? "text-red-700" : "text-zinc-900"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 font-body text-[13px] leading-[1.5] text-zinc-500">
            {description}
          </p>
        )}
      </div>
      <div className="px-5 py-1 sm:px-6">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3 sm:px-6">
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
    <div className="grid gap-3 border-b border-zinc-100 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center sm:gap-8">
      <div>
        <p className="font-body text-[14px] font-medium text-zinc-900">
          {label}
        </p>
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
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-body text-[14px] text-zinc-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-zinc-400 transition-colors hover:border-zinc-300 focus:border-[#1a5fd0] focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-500 disabled:shadow-none";

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
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
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
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-link" : "bg-zinc-200"
      }`}
    >
      <span
        className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.2)] transition-transform duration-200 ${
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
  variant?: "primary" | "secondary" | "danger" | "danger-ghost" | "ghost";
}) {
  const styles = {
    primary:
      "bg-link text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] hover:bg-link-deep",
    secondary:
      "border border-zinc-200 bg-white text-zinc-800 shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-zinc-50",
    danger:
      "bg-red-600 text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] hover:bg-red-700",
    "danger-ghost": "text-red-600 hover:bg-red-50 hover:text-red-700",
    ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
  }[variant];
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3.5 font-body text-[13.5px] font-medium transition-colors disabled:cursor-not-allowed ${styles} ${className}`}
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
    neutral: "bg-zinc-100 text-zinc-700",
    good: "bg-emerald-50 text-emerald-700",
    signal: "bg-[#fff1ea] text-[#c2410c]",
  }[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 font-body text-[12px] font-medium ${styles}`}
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
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={h + i}
                className="whitespace-nowrap border-b border-zinc-100 bg-zinc-50/70 px-5 py-2.5 font-body text-[12.5px] font-medium text-zinc-500 sm:px-6"
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
              className="border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-50/80"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className="px-5 py-3 font-body text-[13.5px] text-zinc-700 sm:px-6"
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

/** A usage meter: label, used of limit, and a bar that turns amber near the cap. */
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
    <div className="border-b border-zinc-100 py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-body text-[14px] font-medium text-zinc-900">
          {label}
        </p>
        <p className="font-body text-[13px] tabular-nums text-zinc-600">
          {used.toLocaleString("en-US")} / {limit.toLocaleString("en-US")}
          {unit ? ` ${unit}` : ""}
        </p>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full ${pct >= 80 ? "bg-amber-400" : "bg-[#3b6fe0]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** The note shown on pages whose figures are sample data until the app is wired up. */
export function DemoNote() {
  return (
    <p className="mt-6 flex items-center gap-2 font-body text-[12.5px] text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      Sample data
    </p>
  );
}
