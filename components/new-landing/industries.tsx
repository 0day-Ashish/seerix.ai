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
        {/* One panel with a diagonal bevel cut out of its top right, not a
            tab sitting on a box: the eyebrow occupies the raised shoulder on
            the left, and the cut falls away to the panel's full width.
            Square corners throughout, as the reference has them.

            clip-path draws it as a single polygon, so the bevel is a true
            cut rather than two shapes meeting on a seam. */}
        <div
          className="relative bg-signal-ink px-7 pb-12 pt-4 sm:px-12 sm:pb-16"
          style={{
            clipPath:
              "polygon(0 0, 16rem 0, 20rem 4.5rem, 100% 4.5rem, 100% 100%, 0 100%)",
          }}
        >
          <p className="font-body text-[14px] text-white/70">Industries</p>
          <div className="pt-10 sm:pt-12">
            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              {/* Heading parks alongside the grid while it scrolls past. */}
              <div className="lg:self-center">
                <h2 className="heading-mark font-display text-[34px] font-medium leading-[1.15] tracking-[-0.03em] text-white sm:text-[44px]">
                  <BlockReveal>
                    Built for sites where search traffic is the business.
                  </BlockReveal>
                </h2>

                <p className="mt-5 max-w-sm font-body text-[16px] leading-[1.6] text-white/60">
                  Seerix makes no assumptions about your vertical. Every
                  diagnosis is assembled from your own data, whatever you sell.
                </p>

                <Link
                  href="#demo"
                  className="group mt-8 inline-flex translate-y-0 items-center gap-2 rounded-xl bg-signal-bright px-5 py-3 font-body text-[15px] font-medium text-signal-ink transition-all duration-150 ease-out [box-shadow:0_3px_0_0_var(--color-signal-edge),0_4px_10px_rgba(10,10,11,0.14)] hover:-translate-y-0.5 hover:[box-shadow:0_5px_0_0_var(--color-signal-edge),0_9px_16px_rgba(10,10,11,0.18)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_var(--color-signal-edge),0_2px_4px_rgba(10,10,11,0.12)]"
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

              {/* Hairlines come from the cells, so the grid reads as one
                table. Every cell draws a top rule except the first row,
                which would otherwise rule the top of the grid itself: that
                is cell one when stacked, cells one and two at sm. */}
              <div className="grid sm:grid-cols-2">
                {industries.map((industry) => (
                  <div
                    key={industry.name}
                    className="border-t border-white/12 py-7 first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-7 sm:[&:nth-child(odd)]:pr-7"
                  >
                    <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-white">
                      {industry.name}
                    </h3>
                    <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-white/55">
                      {industry.body}
                    </p>
                  </div>
                ))}

                {/* An odd number of industries leaves the last cell empty, so it
                  closes the table rather than sitting blank: the list is not
                  meant to be exhaustive, and this is where you say so. */}
                <div className="group border-t border-white/12 py-7 sm:border-l sm:pl-7">
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-white/70">
                    Not listed here?
                  </h3>
                  <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-white/40">
                    The vertical never changes the method. Connect a property
                    and Seerix reads what your market actually does.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-2 font-body text-[15px] text-white/80 transition-colors duration-200 hover:text-white"
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
      </div>
    </section>
  );
}
