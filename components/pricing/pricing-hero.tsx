import Link from "next/link";

import Button from "@/components/new-landing/button";

/** The verticals Seerix is set up for, linking to their use-case panel. */
const useCases = [
  "SaaS",
  "E-commerce",
  "Publishers",
  "Local services",
  "Agencies",
];

/**
 * The pricing page's opener: one line of promise, the way in, and the
 * verticals as a row of chips -- left-aligned, with no hero art, so the plans
 * below are the first thing with any weight.
 */
export default function PricingHero() {
  return (
    <section className="bg-ghost px-6 pb-12 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <h1 className="heading-mark font-display text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-black sm:text-[56px]">
          Start with one site that matters
        </h1>
        <p className="mt-4 font-body text-[18px] leading-[1.55] text-zinc-500 sm:text-[20px]">
          Plans from $39 a month. Month to month, cancel anytime.
        </p>

        <div className="mt-9 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Button href="/#demo" className="w-full font-medium sm:w-56">
            Get started
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-body text-[13px] text-zinc-500">
              Use cases
            </span>
            {useCases.map((label) => (
              <Link
                key={label}
                href="#use-cases"
                className="rounded-full border border-black/[0.1] bg-white px-3.5 py-1.5 font-body text-[13px] text-zinc-700 transition-colors hover:border-signal-bright/40 hover:bg-signal-soft hover:text-signal-deep"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
