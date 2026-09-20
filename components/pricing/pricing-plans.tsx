import Button from "@/components/new-landing/button";
import { plans } from "@/components/pricing/plans";

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

/**
 * The three plans as cards. Deliberately the same card treatment as the
 * landing page's pricing block, so arriving here from that section feels like
 * the same shelf seen closer up rather than a second design.
 */
export default function PricingPlans() {
  return (
    <section id="plans" className="bg-white px-6 pb-20 sm:pb-24">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-xl border bg-white p-7 ${
              plan.featured
                ? "border-black/[0.16] shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                : "border-black/[0.07]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[17px] font-medium tracking-[-0.02em] text-black">
                {plan.name}
              </h2>
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
              href={plan.href}
              variant={plan.featured ? "primary" : "secondary"}
              className="mt-7 w-full"
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
