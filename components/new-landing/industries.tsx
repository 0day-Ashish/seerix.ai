import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";

type Industry = {
  name: string;
  body: string;
};

const industries: Industry[] = [
  {
    name: "SaaS",
    body: "Track the comparison and alternative queries that convert, and catch a competitor outranking you on your own category terms.",
  },
  {
    name: "E-commerce",
    body: "Category and product pages diagnosed separately, with cannibalization surfaced where your own listings compete for one query.",
  },
  {
    name: "Publishers",
    body: "Large libraries crawled on a schedule, so decay is caught on the pages that still earn and not just the ones you remember.",
  },
  {
    name: "Local services",
    body: "Per-market configuration across 15 country and language markets, with rankings read where your customers actually search.",
  },
  {
    name: "Agencies",
    body: "Every client site isolated from the next, each with its own crawl scope, competitors and reporting, under one account.",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Dark panel: the one inverted block on the page, so the section
            reads as a break between the FAQ and the closing CTA. */}
        <div className="relative overflow-hidden bg-[#1c1c21] px-7 py-12 sm:px-12 sm:py-16">
          {/* Moving gradient: two lights orbiting the panel's centre in
              opposite directions at different speeds, so their overlap keeps
              shifting, over a signal glow that slowly breathes. Each orbit is a
              full-panel layer rotated about the middle with its light set off
              to one side. Transforms and opacity only; the reduced-motion rule
              holds it still. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {/* Grey light, clockwise. */}
            <div
              className="absolute inset-[-25%]"
              style={{ animation: "seerix-orbit 48s linear infinite" }}
            >
              <span className="absolute left-[10%] top-[12%] h-[45%] w-[38%] rounded-full bg-[#7a7a82] opacity-45 blur-[100px]" />
            </div>
            {/* Second grey light, counter-clockwise and slower. */}
            <div
              className="absolute inset-[-25%]"
              style={{ animation: "seerix-orbit 70s linear infinite reverse" }}
            >
              <span className="absolute bottom-[15%] right-[12%] h-[40%] w-[34%] rounded-full bg-[#888084] opacity-30 blur-[110px]" />
            </div>
            {/* Signal glow, breathing in place at the lower right. */}
            <span
              className="absolute -bottom-[40%] right-[8%] h-[90%] w-[55%] rounded-full bg-signal blur-[120px]"
              style={{ animation: "seerix-breathe 9s ease-in-out infinite" }}
            />
            <span
              className="absolute -bottom-[35%] left-[28%] h-[55%] w-[32%] rounded-full bg-[#d9430d] blur-[110px]"
              style={{
                animation: "seerix-breathe 13s ease-in-out infinite reverse",
              }}
            />
          </div>
          {/* Holds the copy on the left on the darkest ground. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1c1c21]/75 via-[#1c1c21]/20 to-transparent" />

          <div className="relative grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            {/* Heading parks alongside the grid while it scrolls past. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="heading-mark font-display text-[34px] font-medium leading-[1.15] tracking-[-0.03em] text-white sm:text-[44px]">
                <BlockReveal>
                  Built for sites where search traffic is the business.
                </BlockReveal>
              </h2>

              <p className="mt-5 max-w-sm font-body text-[16px] leading-[1.6] text-white/45">
                Seerix makes no assumptions about your vertical. Every diagnosis
                is assembled from your own data, whatever you sell.
              </p>

              <Link
                href="#demo"
                className="group mt-8 inline-flex items-center gap-2 font-body text-[15px] text-white transition-colors duration-200 hover:text-white/60"
              >
                See demo
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 3.5L10.5 8L6 12.5" />
                </svg>
              </Link>
            </div>

            {/* Hairlines come from the cells, so the grid reads as one table.
                Every cell draws a top rule; the right column adds a left one. */}
            <div className="grid sm:grid-cols-2">
              {industries.map((industry) => (
                <div
                  key={industry.name}
                  className="border-t border-white/10 py-7 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-7 sm:[&:nth-child(odd)]:pr-7"
                >
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-white">
                    {industry.name}
                  </h3>
                  <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-white/45">
                    {industry.body}
                  </p>
                </div>
              ))}

              {/* An odd number of industries leaves the last cell empty, so it
                  closes the table rather than sitting blank: the list is not
                  meant to be exhaustive, and this is where you say so. */}
              <div className="group border-t border-white/10 py-7 sm:border-l sm:pl-7">
                <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-white/55">
                  Not listed here?
                </h3>
                <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-white/35">
                  The vertical never changes the method. Connect a property and
                  Seerix reads what your market actually does.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 font-body text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
                >
                  Ask about your case
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
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
