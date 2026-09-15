import SectionHeader from "@/components/new-landing/section-header";

type Point = {
  title: string;
  body: string;
};

/**
 * The plain-language answer to "what is this", set before the how-it-works
 * walkthrough so a first-time reader knows what they are looking at.
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
        <SectionHeader
          label="What is Seerix"
          heading="An SEO analyst that works from your Search Console."
          lede="Seerix connects to the data Google already keeps on your site, then explains your rankings in plain language, with the receipts to back it up."
        />

        {/* Three plain columns: this section is prose, so it stays lighter than
            the carded sections that follow it. */}
        <div className="mt-10 grid gap-x-8 gap-y-10 border-t border-black/[0.07] pt-10 sm:grid-cols-3">
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
