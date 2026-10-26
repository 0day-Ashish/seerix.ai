import Image from "next/image";

import ProductDemo from "@/components/new-landing/product-demo";

type Point = {
  title: string;
  body: string;
};

/**
 * The plain-language answer to "what is this", set before the how-it-works
 * walkthrough so a first-time reader knows what they are looking at.
 *
 * The heading, then the thing itself: the product demo, stepping through
 * the jobs Seerix does, so the reader sees it work before being told how.
 */
const points: Point[] = [
  {
    title: "Built on your own data",
    body: "Seerix reads your Search Console history rather than a third-party index, so every number it shows is the one Google already has on your site.",
  },
  {
    title: "An answer, not a dashboard",
    body: "Instead of handing you charts to interpret, it states what changed, why it changed, and what to do about it, in a sentence you can act on.",
  },
  {
    title: "Evidence attached",
    body: "Every diagnosis carries the data that produced it and an honest confidence score, so you can check the reasoning instead of trusting it blindly.",
  },
];

export default function WhatIsSeerix() {
  return (
    <section id="what-is-seerix" className="bg-ghost px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Stacked, not split: heading and lede share the top row, the demo
            runs the full width beneath them, and the three points close the
            section as a row. How-it-works below is the copy-left, panel-right
            section; this one reads top to bottom so the two don't repeat. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <h2 className="heading-mark font-display text-[36px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[54px] lg:text-[60px]">
              An SEO analyst that works from your Search Console.
            </h2>
          </div>
          <p className="max-w-xl font-body text-[17px] leading-[1.6] text-zinc-500">
            Seerix connects to the data Google already keeps on your site, then
            explains your rankings in plain language, with the receipts to back
            it up.
          </p>
        </div>

        {/* The demo, full width: tabs over an app window, stepping through
            the jobs Seerix does. It sits on the brand's grained green wash
            rather than the page white, so the product has a ground of its
            own. Served through next/image so the large source ships as an
            optimised, sized WebP rather than the original PNG. */}
        <div className="relative mt-14 overflow-hidden rounded-[28px] p-5 sm:p-8">
          <Image
            src="/assets/bg-gradient.png"
            alt=""
            fill
            priority={false}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <div className="relative">
            <ProductDemo />
          </div>
        </div>

        {/* The three points as a row closing the section. */}
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {points.map((point, index) => (
            <div
              key={point.title}
              className="border-t border-black/[0.10] pt-5"
            >
              <span className="font-mono text-[12px] text-zinc-400">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-black">
                {point.title}
              </h3>
              <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
