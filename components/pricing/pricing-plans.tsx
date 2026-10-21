import Image from "next/image";
import Link from "next/link";

import { plans, type PlanId } from "@/components/pricing/plans";

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg
      className={`mt-[5px] h-3.5 w-3.5 shrink-0 ${dark ? "text-signal" : "text-black"}`}
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
 * The three plans as separate rounded cards, Growth featured as on the
 * homepage. At lg each card is a subgrid over four shared rows, so the
 * header, button, allowances and evidence start on the same line in every
 * card however long each list runs. The featured card carries the image.
 */
export default function PricingPlans() {
  return (
    <section id="plans" className="bg-white px-6 pb-24">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_1fr]">
        {plans.map((plan) => {
          const dark = Boolean(plan.featured);
          return (
            <article
              key={plan.id}
              className={`flex flex-col rounded-3xl p-4 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-0 ${
                dark
                  ? "bg-[linear-gradient(160deg,#4a4a51_0%,#36363b_35%,#1c1c21_100%)] text-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] lg:-my-3 lg:py-7"
                  : "border border-black/[0.08] bg-white"
              }`}
            >
              <div
                className={`relative min-h-[12rem] overflow-hidden rounded-2xl p-6 ${
                  dark
                    ? "bg-[#2a2a30] text-white ring-1 ring-white/[0.08]"
                    : "bg-[#f3f2ef] text-black"
                }`}
              >
                {dark && (
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
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`font-mono text-[12px] uppercase tracking-[0.12em] ${
                        dark ? "text-white/80" : "text-zinc-500"
                      }`}
                    >
                      {tier[plan.id]}
                    </p>
                    {dark && (
                      <span className="rounded-full bg-signal px-2.5 py-0.5 font-body text-[12px] font-medium text-white">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 flex items-baseline gap-2 font-display">
                    <span className="text-[36px] font-medium leading-none tracking-[-0.035em]">
                      {plan.name}
                    </span>
                    <span
                      className={`text-[18px] ${dark ? "text-white/80" : "text-zinc-500"}`}
                    >
                      {plan.price}
                      {plan.cadence}
                    </span>
                  </p>
                  <p
                    className={`mt-4 max-w-sm font-body text-[14px] leading-[1.55] ${
                      dark ? "text-white/85" : "text-zinc-600"
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                </div>
              </div>

              <Link
                href={plan.href}
                className={`mt-4 flex h-11 items-center justify-center rounded-xl font-body text-[15px] font-medium text-white transition-colors duration-200 ${
                  dark
                    ? "bg-signal hover:bg-signal-deep"
                    : "bg-[#1c1c21] hover:bg-[#36363B]"
                }`}
              >
                {plan.cta}
              </Link>

              <div
                className={`mx-2 mt-6 border-t pt-6 ${
                  dark ? "border-white/[0.08]" : "border-black/[0.08]"
                }`}
              >
                <p
                  className={`font-body text-[14px] ${dark ? "text-white/60" : "text-zinc-500"}`}
                >
                  {lead[plan.id]}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check dark={dark} />
                      <span
                        className={`font-body text-[16px] leading-[1.5] ${dark ? "text-white" : "text-black"}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`mx-2 mt-8 border-t pb-2 pt-6 ${
                  dark ? "border-white/[0.08]" : "border-black/[0.08]"
                }`}
              >
                <p
                  className={`font-body text-[14px] ${dark ? "text-white/60" : "text-zinc-500"}`}
                >
                  Evidence
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {evidence[plan.id].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check dark={dark} />
                      <span
                        className={`font-body text-[16px] leading-[1.5] ${dark ? "text-white" : "text-black"}`}
                      >
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
