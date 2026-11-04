import Link from "next/link";

import { CountUp } from "@/components/new-landing/count-up";

type Stat = {
  value: string;
  /** Mono capital label under the figure. */
  label: string;
  /** The source the figure comes from, and the one line it stands for. */
  source: string;
  line: string;
};

const stats: Stat[] = [
  {
    value: "16",
    label: "Months of history on day one",
    source: "Search Console",
    line: "clicks, impressions and rankings, on your first read-only sign-in.",
  },
  {
    value: "15",
    label: "Markets, any vertical",
    source: "Per site",
    line: "country and language configured on their own.",
  },
  {
    value: "2,000",
    label: "AI questions a month on Agency",
    source: "Monitoring",
    line: "crawls, snapshots and alerts never draw on the count.",
  },
];

/** A small square where a rule meets its tick, as on a drawing. */
function Node({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 border border-black/25 bg-[#f7f6f2] ${className}`}
    />
  );
}

/**
 * The figures, as a drawn ledger: the claim on the left, and on the right
 * each number between hairlines that run past their ends, with small squares
 * and ticks at the corners. The numbers are server-rendered, so they read
 * correctly before any script runs.
 */
export default function Stats() {
  return (
    <section
      id="numbers"
      className="overflow-hidden bg-ghost px-6 py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:pt-6">
          <h2 className="font-display text-[34px] font-extralight leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
            Every claim shows its receipts
          </h2>
          <p className="mt-6 max-w-lg font-body text-[17px] leading-[1.6] text-zinc-600">
            Answers cite your own Search Console rows, live SERP snapshots and
            crawl data, never a guess dressed up as a number. These are the
            figures every plan runs on.
          </p>
          <Link
            href="/pricing#compare"
            className="mt-8 inline-block border-b border-black/60 pb-0.5 font-mono text-[12.5px] uppercase tracking-[0.12em] text-black transition-colors hover:border-black hover:text-zinc-600"
          >
            Compare every plan
          </Link>
        </div>

        <dl className="relative">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative border-t border-black/[0.12] py-9 pl-6 pr-4 sm:pl-12 last:border-b"
            >
              {/* Ticks running past the rule at both ends, and the squares
                  where they cross. */}
              <span
                aria-hidden="true"
                className="absolute -left-10 -right-10 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.12] to-transparent"
              />
              <span
                aria-hidden="true"
                className="absolute -top-8 left-0 h-16 w-px bg-gradient-to-b from-transparent via-black/[0.12] to-transparent"
              />
              <span
                aria-hidden="true"
                className="absolute -top-8 right-0 h-16 w-px bg-gradient-to-b from-transparent via-black/[0.12] to-transparent"
              />
              <Node className="left-0 top-0" />
              <Node className="left-full top-0" />
              {i === stats.length - 1 && (
                <>
                  <Node className="left-0 top-full" />
                  <Node className="left-full top-full" />
                </>
              )}

              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <CountUp
                  value={stat.value}
                  className="font-display text-[56px] font-extralight leading-none tracking-[-0.03em] text-black sm:text-[64px]"
                />
                <p className="mt-4 font-mono text-[12.5px] uppercase tracking-[0.12em] text-zinc-500">
                  {stat.label}
                </p>
                <p className="mt-4 font-body text-[15.5px] leading-[1.55] text-zinc-600">
                  <span className="mr-1.5 inline-flex items-center gap-1.5 font-medium text-black">
                    <span className="h-2 w-2 bg-signal" />
                    {stat.source}
                  </span>
                  {stat.line}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
