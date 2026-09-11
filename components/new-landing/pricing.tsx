import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

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
      className="mt-1 h-3.5 w-3.5 shrink-0 text-[#36363B]"
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
    <section id="pricing" className="bg-white px-6 pb-12 pt-20">
      <SectionLabel number="05" name="PRICING" />

      <div className="mx-auto mt-10 max-w-5xl">
        <span className="relative inline-flex items-center bg-[#36363B]/[0.07] px-5 py-3 font-mono text-[13px] font-medium tracking-[0.18em] text-[#23232a]">
          {/* Corner brackets: two edges each, drawn per corner. */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#36363B]/45" />

          PRICING
        </span>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16">
          <h2 className="font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
            <BlockReveal>A fraction of one consultant hour.</BlockReveal>
          </h2>
          <p className="max-w-md self-start font-body text-[15px] leading-relaxed text-zinc-500 md:pt-2">
            The same analysis a $200/hr consultant runs by hand, working
            every day instead of one engagement.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border bg-white p-8 ${
                plan.featured
                  ? "border-[#36363B]/40 shadow-sm shadow-black/5"
                  : "border-black/10"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-tight text-black">
                  {plan.name}
                </h3>
                {plan.featured && (
                  <span className="rounded bg-[#36363B]/[0.07] px-2 py-1 font-mono text-[10px] font-medium tracking-[0.12em] text-[#23232a]">
                    MOST POPULAR
                  </span>
                )}
              </div>

              <p className="mt-6 flex items-baseline gap-x-1 whitespace-nowrap">
                <span className="font-mono text-5xl tracking-tight text-black">
                  {plan.price}
                </span>
                <span className="font-mono text-lg tracking-wide text-zinc-500">
                  {plan.cadence}
                </span>
              </p>

              <p className="mt-3 font-body text-[15px] leading-relaxed text-zinc-500">
                {plan.subtitle}
              </p>

              <ul className="mt-8 flex flex-1 flex-col gap-3 border-t border-black/10 pt-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check />
                    <span className="font-body text-[15px] leading-relaxed text-zinc-600">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="#demo"
                className={
                  plan.featured
                    ? "group mt-8 flex h-11 translate-y-0 items-center justify-center gap-3 rounded-lg bg-gradient-to-b from-[#4a4a51] to-[#36363B] px-6 font-body text-[15px] text-white [box-shadow:0_4px_0_0_#1c1c21,0_5px_10px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:from-[#55555d] hover:to-[#3f3f45] hover:[box-shadow:0_6px_0_0_#1c1c21,0_10px_18px_rgba(0,0,0,0.22)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#1c1c21,0_2px_4px_rgba(0,0,0,0.15)]"
                    : "mt-8 flex h-11 translate-y-0 items-center justify-center rounded-lg border border-black/15 bg-white px-6 font-body text-[15px] text-zinc-700 [box-shadow:0_4px_0_0_#d4d4d8,0_5px_10px_rgba(0,0,0,0.10)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:text-black hover:[box-shadow:0_6px_0_0_#d4d4d8,0_10px_18px_rgba(0,0,0,0.14)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#d4d4d8,0_2px_4px_rgba(0,0,0,0.10)]"
                }
              >
                See demo
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 font-body text-[15px] leading-relaxed text-zinc-500">
          Early access is invite-based while we work closely with design
          partners. Reach us at{" "}
          <Link
            href="mailto:hello@seerix.ai"
            className="font-medium text-[#36363B] underline underline-offset-2 transition-colors hover:text-[#23232a]"
          >
            hello@seerix.ai
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
