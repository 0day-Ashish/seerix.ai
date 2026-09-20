import HowItWorks from "@/components/new-landing/how-it-works";
import Cta from "@/components/new-landing/cta";
import Faq from "@/components/new-landing/faq";
import Hero from "@/components/new-landing/hero";
import Industries from "@/components/new-landing/industries";
import SectionDivider from "@/components/new-landing/section-divider";
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

      {/* Dividers live here rather than inside each section, so the rule sits
          between siblings and the last section before the footer has none. */}
      <div className="flex flex-1 flex-col">
        <WhatIsSeerix />
        <SectionDivider />
        <HowItWorks />
        {/* No divider here: the numbers follow the how-it-works panels
            directly, without a rule between them. */}
        <Stats />
        <SectionDivider />
        <ValueProp />
        <SectionDivider />
        <Trust />
        <SectionDivider />
        <Pricing />
        <SectionDivider />
        <Faq />
        <SectionDivider />
        <Industries />
        {/* No divider here: the closing CTA follows the industries panel
            directly, without a rule between them. */}
        <Cta />
      </div>

      <SiteFooter />
    </div>
  );
}
