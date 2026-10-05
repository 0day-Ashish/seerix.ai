import Image from "next/image";
import Link from "next/link";

import { plans, type PlanId } from "@/components/pricing/plans";

function Check() {
  return (
    <svg
      className="mt-[5px] h-3.5 w-3.5 shrink-0 text-black"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

/** Mono tier label shown above each plan's name. */
const tier: Record<PlanId, string> = {
  starter: "Single site",
  growth: "Multi-site",
  agency: "Portfolio",
};

/** The list each column's allowances are introduced with. */
const lead: Record<PlanId, string> = {
  starter: "Includes:",
  growth: "Everything in Starter, plus:",
  agency: "Everything in Growth, plus:",
};

/**
 * The evidence each plan draws on, in a second list under the allowances. Kept
 * in step with the "Evidence and answers" group of the comparison table.
 */
const evidence: Record<PlanId, string[]> = {
  starter: [
    "16 months of Search Console history",
    "Site crawl by SeerixBot",
    "100 SERP snapshots a month",
  ],
  growth: ["500 SERP snapshots a month per site", "Competitor tracking"],
  agency: [
    "2,000 SERP snapshots a month per site",
    "Cross-site portfolio view",
  ],
};

/**
 * The three plans in one frame, split by rules. At lg each column is a
 * subgrid over four shared rows, so the card, button, allowances and evidence
 * start on the same line in every column however long each list runs.
 *
 * The three plans in one frame, split by rules. Each column opens on a tinted
 * card with the tier, price and promise, then the call to action, then what
 * the plan includes and the evidence it draws on. The first card carries the
 * image, the way into the rest.
 */
export default function PricingPlans() {
  return (
    <section id="plans" className="bg-white px-6 pb-24">
      <div className="mx-auto grid max-w-7xl border border-black/[0.12] lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_1fr]">
        {plans.map((plan, index) => {
          const lit = index === 0;
          return (
            <article
              key={plan.id}
              className={`flex flex-col p-4 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-0 ${
                index > 0
                  ? "border-t border-black/[0.12] lg:border-l lg:border-t-0"
                  : ""
              }`}
            >
              <div
                className={`relative min-h-[12rem] overflow-hidden p-6 ${
                  lit ? "bg-[#2a2a30] text-white" : "bg-[#f3f2ef] text-black"
                }`}
              >
                {lit && (
                  <>
                    <Image
                      src="/assets/Silver mist-2048x1428.png"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover [transform:scaleX(-1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c21]/80 via-[#1c1c21]/40 to-transparent" />
                  </>
                )}
                <div className="relative">
                  <p
                    className={`font-mono text-[12px] uppercase tracking-[0.12em] ${
                      lit ? "text-white/80" : "text-zinc-500"
                    }`}
                  >
                    {tier[plan.id]}
                  </p>
                  <p className="mt-2 flex items-baseline gap-2 font-display">
                    <span className="text-[36px] font-medium leading-none tracking-[-0.035em]">
                      {plan.name}
                    </span>
                    <span
                      className={`text-[18px] ${lit ? "text-white/80" : "text-zinc-500"}`}
                    >
                      {plan.price}
                      {plan.cadence}
                    </span>
                  </p>
                  <p
                    className={`mt-4 max-w-sm font-body text-[14px] leading-[1.55] ${
                      lit ? "text-white/85" : "text-zinc-600"
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                </div>
              </div>

              <Link
                href={plan.href}
                className="mt-4 flex h-11 items-center justify-center bg-[#141416] font-body text-[15px] font-medium text-white transition-colors hover:bg-[#36363B]"
              >
                {plan.cta}
              </Link>

              <div className="mt-6 border-t border-black/[0.08] pt-6">
                <p className="font-body text-[14px] text-zinc-500">
                  {lead[plan.id]}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check />
                      <span className="font-body text-[16px] leading-[1.5] text-black">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-black/[0.08] pt-6">
                <p className="font-body text-[14px] text-zinc-500">Evidence</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {evidence[plan.id].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check />
                      <span className="font-body text-[16px] leading-[1.5] text-black">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
