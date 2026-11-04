import Button, { ButtonArrow } from "@/components/new-landing/button";
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

/**
 * The three plan cards, shared by the homepage and /pricing so the two can't
 * drift apart: the name and who it is for, open space, then the price, the
 * plan in one line and the one action.
 */
export function PlanCards({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-3 md:grid-cols-3 ${className}`}>
      {plans.map((plan) => (
        <article
          key={plan.name}
          className="flex min-h-[22rem] flex-col rounded-[28px] border border-white/70 bg-white/70 p-7 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_24px_60px_-40px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-8"
        >
          <h3 className="font-display text-[28px] font-extralight tracking-[-0.03em] text-zinc-900">
            {plan.name}
          </h3>
          <p className="mt-2 max-w-[18rem] font-body text-[16px] leading-[1.45] text-zinc-500">
            {plan.subtitle}
          </p>

          {/* The open space the reference leaves before the price. */}
          <span className="min-h-10 flex-1" />

          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-[34px] font-extralight leading-none tracking-[-0.03em] text-zinc-900">
              {plan.price}
            </span>
            <span className="font-body text-[16px] text-zinc-500">
              /mo
            </span>
          </p>
          <p className="mt-4 font-body text-[16px] leading-[1.45] text-zinc-500">
            {plan.summary}
          </p>

          <Button href="/#waitlist" className="mt-6 w-fit">
            Join waitlist
            <ButtonArrow />
          </Button>
        </article>
      ))}
    </div>
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

        <PlanCards className="mt-12" />

        <p className="mx-auto mt-10 max-w-2xl text-center font-body text-[15px] leading-[1.6] text-zinc-500">
          Flat plans, no metering: crawls, SERP snapshots, alerts and the
          weekly report are included, and background monitoring never draws
          down your questions. Seerix is pre-launch; this is what plans
          will cost when it opens.
        </p>

        <div className="mt-6 flex justify-center">
          <Button href="/pricing#compare">
            Compare plans
            <ButtonArrow />
          </Button>
        </div>
      </div>
    </section>
  );
}
