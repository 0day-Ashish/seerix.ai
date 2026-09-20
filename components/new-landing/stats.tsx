import Link from "next/link";

import Button, { ButtonArrow } from "@/components/new-landing/button";
import { CountUp } from "@/components/new-landing/count-up";
import SectionLabel from "@/components/new-landing/section-label";
import { BlockReveal } from "@/components/new-landing/block-reveal";

type Stat = {
  /** Large figure. */
  value: string;
  /** Optional scale word set beside the figure (months, /month...). */
  unit?: string;
  /** Short label directly under the figure. */
  label: string;
  /** The sentence that qualifies it. */
  description: string;
};

/**
 * Four figures in a row, each sitting in its own column with a rule above it.
 * The earlier layout put a full heading stack above an even grid; here the
 * copy sits to the left and the numbers run beside it, so the section reads as
 * a ledger rather than as four loose cards.
 */
const stats: Stat[] = [
  {
    value: "16",
    unit: "months",
    label: "History on day one",
    description:
      "of clicks, impressions and rankings pulled on your first read-only sign-in.",
  },
  {
    value: "15",
    unit: "markets",
    label: "Country and language",
    description: "configured per site, any vertical.",
  },
  {
    value: "2,000",
    label: "AI questions a month",
    description: "on Agency. Background monitoring never draws on the count.",
  },
  {
    value: "$39",
    unit: "/month",
    label: "Where plans start",
    description:
      "for analysis a $200/hr consultant runs by hand, working every day.",
  },
];

export default function Stats() {
  return (
    <section id="numbers" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Copy left, figures right: at lg the heading takes a third and the
            four numbers share the rest, so the row reads across. */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionLabel name="By the numbers" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>Every claim shows its receipts</BlockReveal>
            </h2>
            <p className="mt-5 max-w-md font-body text-[16px] leading-[1.6] text-zinc-500">
              Answers cite your own Search Console rows, live SERP snapshots and
              crawl data, never a guess dressed up as a number.
            </p>
          </div>

          {/* Each figure carries its own rule, so the four read as columns of a
              table rather than as free-floating numbers. */}
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:mt-0 lg:grid-cols-2">
            <dl className="contents">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="border-t border-black/[0.10] pt-5"
                >
                  <dt className="flex flex-wrap items-baseline gap-x-2">
                    <CountUp
                      value={stat.value}
                      className="font-display text-[40px] font-medium tracking-[-0.03em] text-black sm:text-[46px]"
                    />
                    {stat.unit && (
                      <span className="font-body text-[15px] text-zinc-400">
                        {stat.unit}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-3">
                    <span className="block font-display text-[15px] font-medium tracking-[-0.01em] text-black">
                      {stat.label}
                    </span>
                    <span className="mt-1.5 block max-w-xs font-body text-[14px] leading-[1.65] text-zinc-500">
                      {stat.description}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* Fills the fourth quadrant of the 2x2 grid: the figures above
                are the argument, this is the ask. Inverted so it reads as a
                panel rather than a fifth statistic. */}
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-[#36363B] p-7 sm:col-span-2">
              <div>
                <p className="font-display text-[20px] font-medium leading-snug tracking-[-0.02em] text-white sm:text-[22px]">
                  See these numbers against your own site.
                </p>
                <p className="mt-2 max-w-sm font-body text-[14px] leading-[1.65] text-white/50">
                  Read-only Search Console access, revocable anytime.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href="#demo"
                  variant="secondary"
                  size="compact"
                  className="w-full sm:w-auto"
                >
                  See demo
                  <ButtonArrow />
                </Button>
                <Link
                  href="/pricing"
                  className="group inline-flex items-center gap-2 font-body text-[14px] text-white/60 transition-colors duration-200 hover:text-white"
                >
                  View pricing
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3.5L10.5 8L6 12.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
