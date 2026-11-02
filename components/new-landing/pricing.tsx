import Link from "next/link";

import SectionHeader from "@/components/new-landing/section-header";

type Plan = {
  name: string;
  price: string;
  subtitle: string;
  /** The plan in one line: its sites and its question allowance. */
  summary: string;
};

/**
 * Three plans, each told in one line. The full allowance table lives on
 * /pricing; every limit there is per site, per month, except AI questions,
 * which are per account.
 */
const plans: Plan[] = [
  {
    name: "Starter",
    price: "$39",
    subtitle: "For one site that matters",
    summary: "1 site · 100 AI questions a month",
  },
  {
    name: "Growth",
    price: "$99",
    subtitle: "For builders running multiple sites",
    summary: "5 sites · 500 AI questions a month",
  },
  {
    name: "Agency",
    price: "$249",
    subtitle: "For portfolios and client work",
    summary: "20 sites · 2,000 AI questions a month",
  },
];

function Arrow() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/**
 * Pricing as quiet frosted cards over the page's background: the name and
 * who it is for, open space, then the price, the plan in one line and the
 * one action. The footnote and "Compare plans" sit centred beneath.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          heading="A fraction of one consultant hour."
          lede="The same analysis a $200/hr consultant runs by hand, working every day instead of one engagement. All limits are per site, per month."
        />

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="flex min-h-[22rem] flex-col rounded-[28px] border border-white/70 bg-white/70 p-7 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_24px_60px_-40px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-8"
            >
              <h3 className="font-display text-[28px] font-light tracking-[-0.02em] text-zinc-900">
                {plan.name}
              </h3>
              <p className="mt-2 max-w-[18rem] font-body text-[16px] leading-[1.45] text-zinc-500">
                {plan.subtitle}
              </p>

              {/* The open space the reference leaves before the price. */}
              <span className="min-h-10 flex-1" />

              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[34px] font-light leading-none tracking-[-0.02em] text-zinc-900">
                  {plan.price}
                </span>
                <span className="font-body text-[16px] text-zinc-500">
                  /mo
                </span>
              </p>
              <p className="mt-4 font-body text-[16px] leading-[1.45] text-zinc-500">
                {plan.summary}
              </p>

              <Link
                href="/#waitlist"
                className="group mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-black/[0.05] px-5 py-2.5 font-body text-[15px] text-zinc-900 transition-colors duration-200 hover:bg-black/[0.09]"
              >
                Join waitlist
                <Arrow />
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center font-body text-[15px] leading-[1.6] text-zinc-500">
          Flat plans, no metering: crawls, SERP snapshots, alerts and the
          weekly report are included, and background monitoring never draws
          down your questions. Seerix is pre-launch; this is what plans
          will cost when it opens.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/pricing#compare"
            className="group inline-flex items-center gap-3 rounded-full bg-signal-ink px-5 py-2.5 font-body text-[15px] text-white transition-colors duration-200 hover:bg-[#1c1c21]"
          >
            Compare plans
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
