import Link from "next/link";

/* -------------------------------------------------------------------------
 * The dashboard kit: page title, framed cards, KPI tiles, deltas, tags,
 * sparklines and a ruled table. Square corners, ink and signal.
 * ---------------------------------------------------------------------- */

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="heading-mark font-display text-[30px] font-medium tracking-[-0.025em] text-black">
            {title}
          </h1>
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-400">
            <span className="h-1.5 w-1.5 bg-signal" />
            Sample data
          </span>
        </div>
        {description && (
          <p className="mt-2 max-w-2xl font-body text-[14px] leading-[1.55] text-zinc-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({
  title,
  hint,
  action,
  children,
  flush = false,
  className = "",
}: {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  /** No inner padding: for tables that run edge to edge. */
  flush?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 border border-black/[0.12] bg-white ${className}`}
    >
      {title && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.08] px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-[17px] tracking-[-0.01em] text-black">
              {title}
            </h2>
            {hint && (
              <p className="mt-0.5 font-body text-[12.5px] leading-[1.5] text-zinc-500">
                {hint}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={flush ? "" : "px-5 py-4"}>{children}</div>
    </section>
  );
}

/** Up is good unless `invert` (positions, where lower is better). */
export function Delta({
  value,
  invert = false,
  suffix = "%",
}: {
  value: number | null;
  invert?: boolean;
  suffix?: string;
}) {
  if (value == null || !isFinite(value)) return null;
  const good = invert ? value < 0 : value >= 0;
  const shown =
    suffix === "%" ? Math.round(value * 100) : Math.round(value * 10) / 10;
  return (
    <span
      className={`font-mono text-[12px] ${good ? "text-[#1f6b3a]" : "text-signal-deep"}`}
    >
      {value >= 0 ? "+" : ""}
      {shown}
      {suffix}
    </span>
  );
}

export function Kpi({
  label,
  value,
  delta,
  sub,
}: {
  label: string;
  value: string;
  delta?: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="border border-black/[0.12] bg-white px-4 py-3.5">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-[26px] font-medium tracking-[-0.02em] text-black">
          {value}
        </span>
        {delta}
      </p>
      {sub && (
        <p className="mt-0.5 font-body text-[12px] text-zinc-500">{sub}</p>
      )}
    </div>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "signal" | "good" | "ink";
}) {
  const styles = {
    neutral: "border border-black/[0.12] text-zinc-600",
    signal: "bg-signal-soft text-signal-deep",
    good: "bg-[#e5f3ea] text-[#1f6b3a]",
    ink: "bg-[#141416] text-white",
  }[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.04em] ${styles}`}
    >
      {children}
    </span>
  );
}

/**
 * A tiny line. Positions by default (lower is better, drawn higher);
 * `higherIsBetter` for counts. Null points break nothing, they are skipped.
 */
export function Spark({
  points,
  higherIsBetter = false,
  color = "#ff5a1f",
  width = 96,
  height = 24,
}: {
  points: (number | null)[];
  higherIsBetter?: boolean;
  color?: string;
  width?: number;
  height?: number;
}) {
  const vals = points.filter((v): v is number => v != null);
  if (!vals.length)
    return <span className="font-mono text-[11px] text-zinc-400">no data</span>;
  const mn = higherIsBetter ? Math.min(...vals) : 1;
  const mx = Math.max(...vals, higherIsBetter ? 0 : 10);
  const y = (v: number) => {
    const f = (v - mn) / Math.max(mx - mn, 1);
    return higherIsBetter
      ? height - 2 - f * (height - 4)
      : 2 + f * (height - 4);
  };
  const n = points.length;
  const x = (i: number) =>
    n > 1 ? (i / (n - 1)) * (width - 4) + 2 : width / 2;
  let d = "";
  points.forEach((p, i) => {
    if (p == null) return;
    d += `${d ? "L" : "M"}${x(i).toFixed(1)} ${y(p).toFixed(1)} `;
  });
  const last = points[n - 1];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="shrink-0"
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
      {last != null && (
        <rect
          x={x(n - 1) - 2}
          y={y(last) - 2}
          width="4"
          height="4"
          fill={color}
        />
      )}
    </svg>
  );
}

/** A ruled table; scrolls sideways inside its card on narrow screens. */
export function DataTable({
  head,
  rows,
  align,
  minWidth = 560,
}: {
  head: string[];
  rows: React.ReactNode[][];
  /** Per-column alignment; numbers read best right-aligned. */
  align?: ("left" | "right")[];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="bg-[#f7f6f4]">
            {head.map((h, i) => (
              <th
                key={h + i}
                className={`border-b border-black/[0.08] px-5 py-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-zinc-500 ${
                  align?.[i] === "right" ? "text-right" : ""
                }`}
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
              className="border-b border-black/[0.05] last:border-b-0 hover:bg-black/[0.015]"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-5 py-3 align-top font-body text-[13.5px] text-zinc-700 ${
                    align?.[j] === "right"
                      ? "text-right font-mono text-[13px]"
                      : ""
                  }`}
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

export function Mono({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[12.5px] text-black">{children}</span>;
}

const buttonStyles = {
  primary: "bg-[#141416] text-white hover:bg-[#36363B]",
  secondary:
    "border border-black/[0.16] bg-white text-black hover:border-black/40",
};

export function Btn({
  variant = "secondary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles;
}) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 px-3.5 font-body text-[13px] font-medium transition-colors disabled:opacity-50 ${buttonStyles[variant]} ${className}`}
    />
  );
}

export function BtnLink({
  href,
  variant = "secondary",
  children,
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 px-3.5 font-body text-[13px] font-medium transition-colors ${buttonStyles[variant]}`}
    >
      {children}
    </Link>
  );
}

/** A link that opens chat with a question already asked. */
export function askHref(question: string) {
  return `/app/chat?q=${encodeURIComponent(question)}`;
}
