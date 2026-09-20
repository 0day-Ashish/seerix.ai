import AnswerCard from "@/components/new-landing/answer-card";
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
 * Each point is answered by something visible in the card beside it: the data
 * source, the one-sentence answer, and the evidence rows with their confidence
 * reading. The section makes its case by showing the thing rather than
 * describing it three times.
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
    <section id="what-is-seerix" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Copy left, the thing itself right. The heading stack is spelled out
            here rather than using SectionHeader, which assumes a full-width
            column above the content. */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionLabel name="What is Seerix" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>
                An SEO analyst that works from your Search Console.
              </BlockReveal>
            </h2>
            <p className="mt-5 max-w-xl font-body text-[16px] leading-[1.6] text-zinc-500">
              Seerix connects to the data Google already keeps on your site,
              then explains your rankings in plain language, with the receipts
              to back it up.
            </p>

            {/* Stacked rather than three columns: beside the card there is no
                room for columns, and the rules keep the prose rhythm the
                section had before. */}
            <div className="mt-10 border-t border-black/[0.07]">
              {points.map((point) => (
                <div
                  key={point.title}
                  className="border-b border-black/[0.07] py-6"
                >
                  <h3 className="font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-black">
                    {point.title}
                  </h3>
                  <p className="mt-2.5 max-w-lg font-body text-[15px] leading-[1.65] text-zinc-500">
                    {point.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sits first in the source on mobile so the claim is shown before
              it is argued, and returns to the right on wide screens. */}
          <div className="order-first lg:order-none">
            <AnswerCard />
          </div>
        </div>
      </div>
    </section>
  );
}
