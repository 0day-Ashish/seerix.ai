import { CountUp } from "@/components/new-landing/count-up";

/* -------------------------------------------------------------------------
 * Each figure carries a small reading of itself drawn underneath, so the
 * number is shown as product output rather than as a marketing claim: the
 * sixteen months as a history strip, the markets as locale chips, the
 * allowance as a usage meter, the price against an hour of consultant time.
 * The signal colour marks the part of each reading the figure is about.
 * ---------------------------------------------------------------------- */

/** Sixteen monthly bars, the last one the month you connect. */
function HistoryStrip() {
  const heights = [
    38, 44, 41, 52, 49, 58, 55, 61, 57, 66, 63, 70, 68, 74, 71, 80,
  ];
  return (
    <div aria-hidden="true">
      <div className="flex h-12 items-end gap-[3px]">
        {heights.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1  ${
              i === heights.length - 1 ? "bg-signal" : "bg-black/[0.12]"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-zinc-400">
        <span>Jun 2025</span>
        <span className="text-signal-deep">today</span>
      </div>
    </div>
  );
}

/** The markets as locale chips, the configured ones lit. */
function MarketChips() {
  const markets = [
    ["en-US", true],
    ["en-GB", true],
    ["de-DE", true],
    ["fr-FR", false],
    ["es-ES", false],
    ["it-IT", false],
    ["nl-NL", false],
    ["en-AU", true],
    ["pt-BR", false],
    ["ja-JP", false],
    ["sv-SE", false],
    ["en-CA", false],
    ["pl-PL", false],
    ["da-DK", false],
    ["en-IN", false],
  ] as const;
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-1.5">
      {markets.map(([code, on]) => (
        <span
          key={code}
          className={`border px-1.5 py-0.5 font-mono text-[11px] ${
            on
              ? "border-signal/40 bg-signal-soft text-signal-deep"
              : "border-black/[0.08] text-zinc-400"
          }`}
        >
          {code}
        </span>
      ))}
    </div>
  );
}

/** The month's questions as a meter: used against the allowance. */
function UsageMeter() {
  return (
    <div aria-hidden="true">
      <div className="flex h-2 overflow-hidden rounded-full bg-black/[0.08]">
        <span className="h-full w-[31%] rounded-full bg-signal" />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-zinc-400">
        <span>
          <span className="text-signal-deep">612</span> used
        </span>
        <span>18 days left</span>
      </div>
    </div>
  );
}

/** The starting price set against one hour of a consultant's time. */
function PriceCompare() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-2 font-mono text-[11px]"
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-[19.5%] shrink-0 rounded-full bg-signal" />
        <span className="text-signal-deep">Seerix, a month</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-full max-w-[100%] flex-1 rounded-full bg-black/[0.14]" />
        <span className="shrink-0 text-zinc-400">1 consultant hour</span>
      </div>
    </div>
  );
}

type Stat = {
  value: string;
  unit?: string;
  label: string;
  description: string;
  reading: React.ReactNode;
};

const stats: Stat[] = [
  {
    value: "16",
    unit: "months",
    label: "History on day one",
    description:
      "of clicks, impressions and rankings, pulled on your first read-only sign-in.",
    reading: <HistoryStrip />,
  },
  {
    value: "15",
    unit: "markets",
    label: "Country and language",
    description: "configured per site, any vertical.",
    reading: <MarketChips />,
  },
  {
    value: "2,000",
    label: "AI questions a month",
    description: "on Agency. Background monitoring never draws on the count.",
    reading: <UsageMeter />,
  },
  {
    value: "$39",
    unit: "/month",
    label: "Where plans start",
    description: "for analysis a $200/hr consultant runs by hand.",
    reading: <PriceCompare />,
  },
];

/**
 * One readout strip rather than a grid of tiles: the heading runs across the
 * top, and the four figures share a single bordered panel split by rules, so
 * they read as columns of one report. Each column ends on its own reading.
 */
export default function Stats() {
  return (
    <section id="numbers" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <h2 className="heading-mark font-display text-[36px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[50px] lg:text-[56px]">
              Every claim shows its receipts
            </h2>
          </div>
          <p className="max-w-md font-body text-[16px] leading-[1.6] text-zinc-500">
            Answers cite your own Search Console rows, live SERP snapshots and
            crawl data, never a guess dressed up as a number.
          </p>
        </div>

        <dl className="mt-12 grid overflow-hidden border border-black/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col p-6 sm:p-7 ${
                // Rules between columns at each breakpoint, never on an edge.
                index > 0 ? "border-t border-black/[0.08]" : ""
              } ${index % 2 === 1 ? "sm:border-l" : ""} ${
                index < 2 ? "sm:border-t-0" : ""
              } ${index > 0 ? "lg:border-l lg:border-t-0" : ""}`}
            >
              <span className="font-mono text-[11px] text-zinc-400">
                0{index + 1}
              </span>
              <dt className="mt-6 flex flex-wrap items-baseline gap-x-2">
                <CountUp
                  value={stat.value}
                  className="font-display text-[48px] font-medium leading-none tracking-[-0.04em] text-black sm:text-[56px]"
                />
                {stat.unit && (
                  <span className="font-body text-[15px] text-zinc-400">
                    {stat.unit}
                  </span>
                )}
              </dt>
              <dd className="mt-4 flex flex-1 flex-col">
                <span className="block font-display text-[15px] font-medium tracking-[-0.01em] text-black">
                  {stat.label}
                </span>
                <span className="mt-1 block font-body text-[14px] leading-[1.6] text-zinc-500">
                  {stat.description}
                </span>
                <span className="flex-1" />
                <div className="mt-8">{stat.reading}</div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
