import Link from "next/link";

/* -------------------------------------------------------------------------
 * The dashboard kit: page title, framed cards, KPI tiles, deltas, tags,
 * sparklines and a table. Soft corners, quiet greys and one blue for data
 * and actions; orange only for what needs attention.
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
        <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em] text-zinc-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl font-body text-[14px] leading-[1.55] text-zinc-500">
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
      className={`min-w-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      {title && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <h2 className="font-body text-[15px] font-semibold text-zinc-900">
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
      <div className={flush ? "" : `px-5 ${title ? "pb-5" : "py-5"}`}>
        {children}
      </div>
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
      className={`inline-flex items-center gap-0.5 font-body text-[12.5px] font-medium tabular-nums ${good ? "text-good-deep" : "text-danger-deep"}`}
    >
      {value >= 0 ? "↑" : "↓"}
      {Math.abs(shown)}
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
    <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="font-body text-[13px] text-zinc-500">{label}</p>
      <p className="mt-1.5 flex items-baseline gap-2">
        <span className="font-body text-[24px] font-semibold tabular-nums tracking-[-0.01em] text-zinc-900">
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
    neutral: "bg-zinc-100 text-zinc-700",
    signal: "bg-warn-soft text-warn-deep",
    good: "bg-good-soft text-good-deep",
    ink: "bg-signal-soft text-signal-deep",
  }[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 font-body text-[12px] font-medium ${styles}`}
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
  color = "#11854e",
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
    return <span className="font-body text-[12px] text-zinc-400">No data</span>;
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
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {last != null && (
        <circle cx={x(n - 1)} cy={y(last)} r="2.25" fill={color} />
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
          <tr>
            {head.map((h, i) => (
              <th
                key={h + i}
                className={`border-y border-zinc-100 bg-zinc-50/70 px-5 py-2.5 font-body text-[12.5px] font-medium text-zinc-500 ${
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
              className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/80"
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-5 py-3 align-top font-body text-[13.5px] text-zinc-700 ${
                    align?.[j] === "right" ? "text-right tabular-nums" : ""
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
  return (
    <span className="font-body text-[13.5px] text-zinc-900">{children}</span>
  );
}

/**
 * The raised treatment the marketing site uses: a solid offset edge under the
 * button, lifting on hover and travelling down into it on press, so the depth
 * reads as physical rather than as a drop shadow. Both variants sit on the
 * app's white content areas.
 */
const buttonStyles = {
  primary:
    "translate-y-0 bg-signal-bright text-signal-ink [box-shadow:0_3px_0_0_var(--color-signal-edge),0_4px_10px_rgba(10,10,11,0.14)] hover:-translate-y-0.5 hover:[box-shadow:0_5px_0_0_var(--color-signal-edge),0_9px_16px_rgba(10,10,11,0.18)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_var(--color-signal-edge),0_2px_4px_rgba(10,10,11,0.12)]",
  secondary:
    "translate-y-0 border border-zinc-200 bg-white text-zinc-800 [box-shadow:0_3px_0_0_#e4e4e7,0_4px_10px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900 hover:[box-shadow:0_5px_0_0_#e4e4e7,0_9px_16px_rgba(0,0,0,0.10)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#e4e4e7,0_2px_4px_rgba(0,0,0,0.07)]",
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
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3.5 font-body text-[13px] font-medium transition-all duration-150 ease-out disabled:opacity-50 ${buttonStyles[variant]} ${className}`}
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
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-3.5 font-body text-[13px] font-medium transition-all duration-150 ease-out ${buttonStyles[variant]}`}
    >
      {children}
    </Link>
  );
}

/** A link that opens chat with a question already asked. */
export function askHref(question: string) {
  return `/app/chat?q=${encodeURIComponent(question)}`;
}
