import PlanCard from "@/components/pricing/plan-card";
import { plans } from "@/components/pricing/plans";

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
          <PlanCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            cadence={plan.cadence}
            subtitle={plan.subtitle}
            features={plan.features}
            cta={plan.cta}
            href={plan.href}
            featured={plan.featured}
          />
        ))}
      </div>
    </section>
  );
}
