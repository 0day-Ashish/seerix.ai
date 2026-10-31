import Button from "@/components/new-landing/button";
import GradientWash from "@/components/new-landing/gradient-wash";
import { plans, type PlanId } from "@/components/pricing/plans";

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg
      className={`mt-[5px] h-3.5 w-3.5 shrink-0 ${dark ? "text-signal-deep" : "text-black"}`}
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
    <section id="plans" className="bg-ghost px-6 pb-24">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_1fr]">
        {plans.map((plan) => {
          const dark = Boolean(plan.featured);
          return (
            <article
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl p-4 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-0 ${
                dark
                  ? "bg-[#d8d1fa] text-zinc-900 shadow-[0_30px_70px_-30px_rgba(40,25,110,0.45)] lg:-my-3 lg:py-7"
                  : "border border-black/[0.08] bg-white"
              }`}
            >
              {/* The brand wash fills the whole featured card, so it reads
                  as one lilac panel rather than a lilac inset in grey.
                  The copy is dark against it, as on the industries panel. */}
              {dark && <GradientWash />}
              <div
                className={`relative min-h-[12rem] overflow-hidden rounded-2xl p-6 ${
                  dark
                    ? "text-zinc-900 ring-1 ring-black/[0.07]"
                    : "bg-[#f3f2ef] text-black"
                }`}
              >
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`font-mono text-[12px] uppercase tracking-[0.12em] ${
                        dark ? "text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      {tier[plan.id]}
                    </p>
                    {dark && (
                      <span className="rounded-full bg-signal-bright px-2.5 py-0.5 font-body text-[12px] font-medium text-signal-ink">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 flex items-baseline gap-2 font-display">
                    <span className="text-[36px] font-medium leading-none tracking-[-0.035em]">
                      {plan.name}
                    </span>
                    <span
                      className={`text-[18px] ${dark ? "text-zinc-700" : "text-zinc-500"}`}
                    >
                      {plan.price}
                      {plan.cadence}
                    </span>
                  </p>
                  <p
                    className={`mt-4 max-w-sm font-body text-[14px] leading-[1.55] ${
                      dark ? "text-zinc-700" : "text-zinc-600"
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                </div>
              </div>

              {/* The site's glow button: ink on the featured card's wash,
                  light on the others. */}
              <Button
                href={plan.href}
                variant={dark ? "primary" : "secondary"}
                className="mt-4 h-11 w-full text-[15px]"
              >
                {plan.cta}
              </Button>

              <div
                className={`relative mx-2 mt-6 border-t pt-6 ${
                  dark ? "border-black/[0.12]" : "border-black/[0.08]"
                }`}
              >
                <p
                  className={`font-body text-[14px] ${dark ? "text-zinc-700" : "text-zinc-500"}`}
                >
                  {lead[plan.id]}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check dark={dark} />
                      <span
                        className={`font-body text-[16px] leading-[1.5] ${dark ? "text-zinc-900" : "text-black"}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`relative mx-2 mt-8 border-t pb-2 pt-6 ${
                  dark ? "border-black/[0.12]" : "border-black/[0.08]"
                }`}
              >
                <p
                  className={`font-body text-[14px] ${dark ? "text-zinc-700" : "text-zinc-500"}`}
                >
                  Evidence
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {evidence[plan.id].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check dark={dark} />
                      <span
                        className={`font-body text-[16px] leading-[1.5] ${dark ? "text-zinc-900" : "text-black"}`}
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
