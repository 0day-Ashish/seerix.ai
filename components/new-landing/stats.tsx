import { CountUp } from "@/components/new-landing/count-up";
import SectionHeader from "@/components/new-landing/section-header";

type Stat = {
  /** Large figure. */
  value: string;
  /** Optional scale word set beside the figure (MONTHS, /MONTH...). */
  unit?: string;
  description: string;
};

/**
 * An even four-up grid. The earlier layout offset each card by a hand-tuned
 * pixel amount; the figures carry the emphasis on their own.
 */
const stats: Stat[] = [
  {
    value: "16",
    unit: "months",
    description:
      "of clicks, impressions and rankings history pulled on your first read-only sign-in",
  },
  {
    value: "15",
    unit: "markets",
    description:
      "country and language markets, configured per site, any vertical",
  },
  {
    value: "2,000",
    description: "AI questions a month on Agency",
  },
  {
    value: "$39",
    unit: "/month",
    description:
      "for the same analysis a $200/hr consultant runs by hand, working every day instead of one engagement",
  },
];

export default function Stats() {
  return (
    <section id="numbers" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="By the numbers"
          heading="Every claim shows its receipts"
          lede="Answers cite your own Search Console rows, live SERP snapshots and crawl data, never a guess dressed up as a number."
        />

        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value}>
              <p className="flex flex-wrap items-baseline gap-x-2">
                <CountUp
                  value={stat.value}
                  className="font-display text-[40px] font-medium tracking-[-0.03em] text-black"
                />
                {stat.unit && (
                  <span className="font-body text-[15px] text-zinc-400">
                    {stat.unit}
                  </span>
                )}
              </p>
              <p className="mt-3 font-body text-[15px] leading-[1.65] text-zinc-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
