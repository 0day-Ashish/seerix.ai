
import { CountUp } from "@/components/new-landing/count-up";
import SectionLabel from "@/components/new-landing/section-label";
import { BlockReveal } from "@/components/new-landing/block-reveal";

type Stat = {
  /** Large figure. */
  value: string;
  /** Optional scale word set beside the figure (months, /month...). */
  unit?: string;
  /** Short label directly under the figure. */
  label: string;
  /** The sentence that qualifies it. */
  description: string;
};

/**
 * Four figures in a row, each sitting in its own column with a rule above it.
 * The earlier layout put a full heading stack above an even grid; here the
 * copy sits to the left and the numbers run beside it, so the section reads as
 * a ledger rather than as four loose cards.
 */
const stats: Stat[] = [
  {
    value: "16",
    unit: "months",
    label: "History on day one",
    description:
      "of clicks, impressions and rankings pulled on your first read-only sign-in.",
  },
  {
    value: "15",
    unit: "markets",
    label: "Country and language",
    description: "configured per site, any vertical.",
  },
  {
    value: "2,000",
    label: "AI questions a month",
    description: "on Agency. Background monitoring never draws on the count.",
  },
  {
    value: "$39",
    unit: "/month",
    label: "Where plans start",
    description:
      "for analysis a $200/hr consultant runs by hand, working every day.",
  },
];

/**
 * Soft washes off the brand greys, one per tile, each lit from a different
 * corner. The same family the features bento uses, so the two sections read
 * as one system.
 */
const tints = [
  "bg-[radial-gradient(120%_100%_at_15%_10%,#f7f7f8_0%,#ececed_50%,#dcdddd_100%)]",
  "bg-[radial-gradient(120%_100%_at_85%_15%,#f7f7f8_0%,#eaeaeb_50%,#d8d8da_100%)]",
  "bg-[radial-gradient(120%_100%_at_20%_90%,#f7f7f8_0%,#ebebec_50%,#dadadc_100%)]",
  "bg-[radial-gradient(120%_100%_at_80%_85%,#f7f7f8_0%,#e9e9ea_50%,#d6d6d8_100%)]",
];

export default function Stats() {
  return (
    <section id="numbers" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Copy left, figures right: at lg the heading takes a third and the
            four numbers share the rest, so the row reads across. */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionLabel name="By the numbers" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>Every claim shows its receipts</BlockReveal>
            </h2>
            <p className="mt-5 max-w-md font-body text-[16px] leading-[1.6] text-zinc-500">
              Answers cite your own Search Console rows, live SERP snapshots and
              crawl data, never a guess dressed up as a number.
            </p>
          </div>

          {/* Each figure sits in its own washed box, so the four read as a
              set of tiles rather than as free-floating numbers. */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:mt-0 lg:grid-cols-2">
            <dl className="contents">
              {stats.map((stat, index) => (
                <div
                  key={stat.value}
                  className={`rounded-2xl border border-black/[0.06] p-7 ${tints[index % tints.length]}`}
                >
                  <dt className="flex flex-wrap items-baseline gap-x-2">
                    <CountUp
                      value={stat.value}
                      className="font-display text-[40px] font-medium tracking-[-0.03em] text-black sm:text-[46px]"
                    />
                    {stat.unit && (
                      <span className="font-body text-[15px] text-zinc-400">
                        {stat.unit}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-3">
                    <span className="block font-display text-[15px] font-medium tracking-[-0.01em] text-black">
                      {stat.label}
                    </span>
                    <span className="mt-1.5 block max-w-xs font-body text-[14px] leading-[1.65] text-zinc-500">
                      {stat.description}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
