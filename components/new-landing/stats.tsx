import { BlockReveal } from "@/components/new-landing/block-reveal";
import { CountUp } from "@/components/new-landing/count-up";
import SectionLabel from "@/components/new-landing/section-label";
type Stat = {
  /** Large mono figure. */
  value: string;
  /** Optional scale word set beside the figure (BILLION, TRILLION…). */
  unit?: string;
  description: string;
};

/** Each card sits at its own vertical offset, producing the staggered grid. */
type Card = {
  stats: Stat[];
  /** Tailwind column span + top offset for the lg layout. */
  className: string;
};

const cards: Card[] = [
  {
    // Top-left: starts at the top, ends where the stacked card begins.
    className: "lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mt-[104px] lg:h-[300px]",
    stats: [
      {
        value: "16",
        unit: "MONTHS",
        description:
          "of clicks, impressions and rankings history pulled on your first read-only sign-in",
      },
    ],
  },
  {
    // Offset down; its bottom edge meets the stacked card's top edge.
    className:
      "lg:col-span-6 lg:col-start-6 lg:row-start-1 lg:mt-[204px] lg:h-[200px]",
    stats: [
      {
        value: "15",
        unit: "MARKETS",
        description:
          "country and language markets, configured per site, any vertical",
      },
    ],
  },
  {
    // Wide stacked pair; right edge lines up with the MONTHS card above.
    className: "lg:col-span-11 lg:col-start-1 lg:row-start-2 lg:h-[290px]",
    stats: [
      { value: "2,000", description: "AI questions a month on Agency" },
      { value: "0", description: "Answers that cite evidence which doesn't exist" },
    ],
  },
  {
    // Right column: starts below the midpoint, bottom aligns with the
    // stacked card.
    className:
      "lg:col-span-6 lg:col-start-12 lg:row-span-2 lg:row-start-1 lg:mt-[228px] lg:h-[490px]",
    stats: [
      {
        value: "$39",
        unit: "/MONTH",
        description:
          "for the same analysis a $200/hr consultant runs by hand, working every day instead of one engagement",
      },
    ],
  },
];

export default function Stats() {
  return (
    <section id="numbers" className="px-6 pb-12 pt-20">
      <SectionLabel number="02" name="BY THE NUMBERS" />


      <div className="mx-auto mt-10 max-w-5xl">
        <span className="relative inline-flex items-center bg-[#36363B]/[0.07] px-5 py-3 font-mono text-[13px] font-medium tracking-[0.18em] text-[#23232a]">
          {/* Corner brackets: two edges each, drawn per corner. */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#36363B]/45" />

          BY THE NUMBERS
        </span>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16">
          <h2 className="font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
            <BlockReveal>Every claim shows its receipts</BlockReveal>
          </h2>
          <p className="max-w-md self-start font-body text-[15px] leading-relaxed text-zinc-500 md:pt-2">
            Answers cite your own Search Console rows, live SERP snapshots
            and crawl data, never a guess dressed up as a number.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-17 lg:items-start lg:gap-x-6 lg:gap-y-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-lg border border-black/10 bg-white p-8 ${card.className}`}
          >
            {card.stats.map((stat, statIndex) => (
              <div
                key={stat.value}
                className={
                  statIndex > 0
                    ? "mt-8 border-t border-black/10 pt-8"
                    : undefined
                }
              >
                <p className="flex items-baseline gap-x-3 whitespace-nowrap">
                  <CountUp
                    value={stat.value}
                    className="font-mono text-5xl tracking-tight text-black"
                  />
                  {stat.unit && (
                    <span className="font-mono text-xl tracking-wide text-black">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="mt-3 max-w-xs font-body text-[15px] leading-relaxed text-zinc-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
