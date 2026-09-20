import HowItWorks from "@/components/new-landing/how-it-works";
import Cta from "@/components/new-landing/cta";
import Faq from "@/components/new-landing/faq";
import Hero from "@/components/new-landing/hero";
import Industries from "@/components/new-landing/industries";
import SiteFooter from "@/components/new-landing/site-footer";
import Pricing from "@/components/new-landing/pricing";
import Trust from "@/components/new-landing/trust";
import Stats from "@/components/new-landing/stats";
import ValueProp from "@/components/new-landing/value-prop";
import WhatIsSeerix from "@/components/new-landing/what-is-seerix";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Hero />

      <div className="flex flex-1 flex-col">
        <WhatIsSeerix />
        <HowItWorks />
        <Stats />
        <ValueProp />
        <Trust />
        <Pricing />
        <Faq />
        <Industries />
        <Cta />
      </div>

      <SiteFooter />
    </div>
  );
}
