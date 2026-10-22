import Image from "next/image";
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
        <div className="relative overflow-hidden rounded-3xl bg-[#cfe8d8] px-7 py-12 sm:px-12 sm:py-16">
          {/* The brand gradient, shown as it is. The copy is set dark
              against it: zinc-900 clears 6.7:1 even on the image's deepest
              green, where white would have sat at 1.9:1. */}
          <Image
            src="/assets/bg-gradient.png"
            alt=""
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <div className="relative grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            {/* Heading parks alongside the grid while it scrolls past. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="heading-mark font-display text-[34px] font-medium leading-[1.15] tracking-[-0.03em] text-zinc-900 sm:text-[44px]">
                <BlockReveal>
                  Built for sites where search traffic is the business.
                </BlockReveal>
              </h2>

              <p className="mt-5 max-w-sm font-body text-[16px] leading-[1.6] text-zinc-700">
                Seerix makes no assumptions about your vertical. Every diagnosis
                is assembled from your own data, whatever you sell.
              </p>

              <Link
                href="#demo"
                className="group mt-8 inline-flex items-center gap-2 font-body text-[15px] text-zinc-900 transition-colors duration-200 hover:text-zinc-700"
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
                  className="border-t border-black/15 py-7 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-7 sm:[&:nth-child(odd)]:pr-7"
                >
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-zinc-900">
                    {industry.name}
                  </h3>
                  <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-700">
                    {industry.body}
                  </p>
                </div>
              ))}

              {/* An odd number of industries leaves the last cell empty, so it
                  closes the table rather than sitting blank: the list is not
                  meant to be exhaustive, and this is where you say so. */}
              <div className="group border-t border-black/15 py-7 sm:border-l sm:pl-7">
                <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-zinc-800">
                  Not listed here?
                </h3>
                <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-600">
                  The vertical never changes the method. Connect a property and
                  Seerix reads what your market actually does.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 font-body text-[15px] text-zinc-800 transition-colors duration-200 hover:text-zinc-900"
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
