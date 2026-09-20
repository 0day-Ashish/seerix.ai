import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type Point = {
  title: string;
  body: string;
};

/**
 * The plain-language answer to "what is this", set before the how-it-works
 * walkthrough so a first-time reader knows what they are looking at.
 *
 * Deliberately card-free: how-it-works follows immediately with a panel beside
 * its copy, so this section earns its place by being the quiet one. Type and
 * whitespace carry it.
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
    <section id="what-is-seerix" className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* The statement, set wide and given the room to be read on its own. */}
        <div className="max-w-4xl">
          <SectionLabel name="What is Seerix" />
          <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
            <BlockReveal>
              An SEO analyst that works from your Search Console.
            </BlockReveal>
          </h2>
          <p className="mt-6 max-w-2xl font-body text-[17px] leading-[1.6] text-zinc-500">
            Seerix connects to the data Google already keeps on your site, then
            explains your rankings in plain language, with the receipts to back
            it up.
          </p>
        </div>

        {/* Three columns of prose, separated by one hairline and the gaps
            alone: no borders, no panels, nothing to click. */}
        <div className="mt-16 grid gap-x-10 gap-y-12 border-t border-black/[0.07] pt-12 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title}>
              <h3 className="font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-black">
                {point.title}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-[1.65] text-zinc-500">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
