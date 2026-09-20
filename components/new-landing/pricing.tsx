import Link from "next/link";

import SectionHeader from "@/components/new-landing/section-header";
import PlanCard from "@/components/pricing/plan-card";

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

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Pricing"
          heading="A fraction of one consultant hour."
          lede="The same analysis a $200/hr consultant runs by hand, working every day instead of one engagement."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              cadence={plan.cadence}
              subtitle={plan.subtitle}
              features={plan.features}
              cta="See demo"
              href="#demo"
              featured={plan.featured}
            />
          ))}
        </div>

        <p className="mt-10 font-body text-[15px] leading-[1.65] text-zinc-500">
          <Link
            href="/pricing"
            className="text-black underline underline-offset-2 transition-colors hover:text-zinc-500"
          >
            Compare every plan side by side
          </Link>
          . Early access is invite-based while we work closely with design
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
