import { BlockReveal } from "@/components/new-landing/block-reveal";
import Button, { ButtonArrow } from "@/components/new-landing/button";

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
        {/* A frosted card, the same as the pricing cards, over the page's
            moving background. */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 px-7 py-12 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_24px_60px_-40px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:px-12 sm:py-16">
          <div className="relative">
            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
              {/* Heading parks alongside the grid while it scrolls past. */}
              <div className="lg:self-center">
                <p className="mb-4 font-body text-[14px] text-zinc-500">
                  Industries
                </p>
                <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] font-extralight tracking-[-0.03em] text-black">
                  <BlockReveal>
                    Built for sites where search traffic is the business.
                  </BlockReveal>
                </h2>

                <p className="mt-5 max-w-sm font-body text-[16px] leading-[1.6] text-zinc-500">
                  Seerix makes no assumptions about your vertical. Every
                  diagnosis is assembled from your own data, whatever you sell.
                </p>

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
                    <h3 className="font-body text-[19px] font-medium text-black">
                      {industry.name}
                    </h3>
                    <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                      {industry.body}
                    </p>
                  </div>
                ))}

                {/* An odd number of industries leaves the last cell empty, so it
                  closes the table rather than sitting blank: the list is not
                  meant to be exhaustive, and this is where you say so. */}
                <div className="group border-t border-black/[0.12] py-7 sm:border-l sm:pl-7">
                  <h3 className="font-body text-[19px] font-medium text-zinc-800">
                    Not listed here?
                  </h3>
                  <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                    The vertical never changes the method. Connect a property
                    and Seerix reads what your market actually does.
                  </p>

                  <Button href="/contact" className="mt-5">
                    Ask about your case
                    <ButtonArrow />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
