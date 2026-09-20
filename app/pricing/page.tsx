import type { Metadata } from "next";

import Cta from "@/components/new-landing/cta";
import SiteFooter from "@/components/new-landing/site-footer";
import PricingCompare from "@/components/pricing/pricing-compare";
import PricingFaq from "@/components/pricing/pricing-faq";
import PricingHero from "@/components/pricing/pricing-hero";
import PricingPlans from "@/components/pricing/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing · Seerix",
  description:
    "Plans from $39/mo. Evidence-cited diagnoses on every plan; what changes is how many sites you run and how much Seerix looks at. Month to month, cancel anytime.",
  openGraph: {
    title: "Seerix pricing · A fraction of one consultant hour",
    description:
      "Start on one site that matters. Move up when you are answering for a portfolio. You pay for the plan, never for the evidence behind an answer.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <PricingHero />

      <div className="flex flex-1 flex-col">
        <PricingPlans />
        <PricingCompare />
        <PricingFaq />
        <Cta />
      </div>

      <SiteFooter />
    </div>
  );
}
