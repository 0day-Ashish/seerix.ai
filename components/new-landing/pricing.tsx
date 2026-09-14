import Link from "next/link";

import Button from "@/components/new-landing/button";
import SectionHeader from "@/components/new-landing/section-header";

type Plan = {
  name: string;
  price: string;
  cadence: string;
  subtitle: string;
  features: string[];
  /** Only one plan carries the emphasis treatment. */
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$39",
    cadence: "/mo",
    subtitle: "For one site that matters",
    features: [
      "1 site",
      "100 AI questions / month",
      "1,000 pages crawled monthly",
      "500 keywords enriched monthly",
      "100 SERP snapshots monthly",
      "Weekly report + alerts",
    ],
  },
  {
    name: "Growth",
    price: "$99",
    cadence: "/mo",
    subtitle: "For builders running multiple sites",
    featured: true,
    features: [
      "5 sites",
      "500 AI questions / month",
      "5,000 pages crawled monthly per site",
      "2,000 keywords enriched monthly per site",
      "500 SERP snapshots monthly per site",
      "Weekly report + alerts",
    ],
  },
  {
    name: "Agency",
    price: "$249",
    cadence: "/mo",
    subtitle: "For portfolios and client work",
    features: [
      "20 sites",
      "2,000 AI questions / month",
      "10,000 pages crawled monthly per site",
      "10,000 keywords enriched monthly per site",
      "2,000 SERP snapshots monthly per site",
      "Weekly report + alerts",
    ],
  },
];

function Check() {
  return (
    <svg
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-zinc-400"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Pricing"
          heading="A fraction of one consultant hour."
          lede="The same analysis a $200/hr consultant runs by hand, working every day instead of one engagement."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border bg-white p-7 ${
                plan.featured
                  ? "border-black/[0.16] shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                  : "border-black/[0.07]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-[17px] font-medium tracking-[-0.02em] text-black">
                  {plan.name}
                </h3>
                {plan.featured && (
                  <span className="rounded-full border border-black/[0.08] px-2.5 py-0.5 font-body text-[12px] text-zinc-500">
                    Most popular
                  </span>
                )}
              </div>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-1">
                <span className="font-display text-[40px] font-medium tracking-[-0.03em] text-black">
                  {plan.price}
                </span>
                <span className="font-body text-[15px] text-zinc-400">
                  {plan.cadence}
                </span>
              </p>

              <p className="mt-2 font-body text-[15px] leading-[1.65] text-zinc-500">
                {plan.subtitle}
              </p>

              <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-black/[0.07] pt-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check />
                    <span className="font-body text-[15px] leading-[1.6] text-zinc-500">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href="#demo"
                variant={plan.featured ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                See demo
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 font-body text-[15px] leading-[1.65] text-zinc-500">
          Early access is invite-based while we work closely with design
          partners. Reach us at{" "}
          <Link
            href="mailto:hello@seerix.ai"
            className="text-black underline underline-offset-2 transition-colors hover:text-zinc-500"
          >
            hello@seerix.ai
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
