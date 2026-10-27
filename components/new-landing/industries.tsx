import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import GradientWash from "@/components/new-landing/gradient-wash";

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
    <section id="industries" className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* The brand wash: the moving gradient behind the product demo, so
            the section reads as a break between the FAQ and the closing CTA.
            The copy is near-black throughout, since it crosses the wash's
            darker violet as well as its lilac. */}
        {/* One panel with a diagonal bevel cut out of its top right, not a
            tab sitting on a box: the raised shoulder on the left, and the
            cut falls away to the panel's full width. The shape lives in
            globals.css (.bevel), rounded at every corner like the rest of
            the site's panels. */}
        <div
          className="bevel bevel-panel relative px-7 pb-12 pt-4 sm:px-12 sm:pb-16"
        >
          <GradientWash offset={9} />
          <div className="relative pt-16 sm:pt-20">
            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              {/* Heading parks alongside the grid while it scrolls past. */}
              <div className="lg:self-center">
                <p className="mb-4 font-body text-[14px] text-zinc-800">
                  Industries
                </p>
                <h2 className="heading-mark font-display text-[34px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
                  <BlockReveal>
                    Built for sites where search traffic is the business.
                  </BlockReveal>
                </h2>

                <p className="mt-5 max-w-sm font-body text-[16px] leading-[1.6] text-zinc-800">
                  Seerix makes no assumptions about your vertical. Every
                  diagnosis is assembled from your own data, whatever you sell.
                </p>

                <Link
                  href="#demo"
                  className="group mt-8 inline-flex translate-y-0 items-center gap-2 rounded-xl bg-signal-ink px-5 py-3 font-body text-[15px] font-medium text-white transition-all duration-150 ease-out [box-shadow:0_3px_0_0_#38383f,0_4px_10px_rgba(10,10,11,0.18)] hover:-translate-y-0.5 hover:[box-shadow:0_5px_0_0_#38383f,0_9px_16px_rgba(10,10,11,0.22)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#38383f,0_2px_4px_rgba(10,10,11,0.14)]"
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
                    className="border-t border-black/[0.12] py-7 first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-7 sm:[&:nth-child(odd)]:pr-7"
                  >
                    <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-black">
                      {industry.name}
                    </h3>
                    <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-800">
                      {industry.body}
                    </p>
                  </div>
                ))}

                {/* An odd number of industries leaves the last cell empty, so it
                  closes the table rather than sitting blank: the list is not
                  meant to be exhaustive, and this is where you say so. */}
                <div className="group border-t border-black/[0.12] py-7 sm:border-l sm:pl-7">
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-zinc-800">
                    Not listed here?
                  </h3>
                  <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-800">
                    The vertical never changes the method. Connect a property
                    and Seerix reads what your market actually does.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-2 font-body text-[15px] font-medium text-black underline decoration-black/25 underline-offset-4 transition-colors duration-200 hover:decoration-black"
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
