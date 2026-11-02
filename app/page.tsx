import Cta from "@/components/new-landing/cta";
import Faq from "@/components/new-landing/faq";
import FindGaps from "@/components/new-landing/find-gaps";
import Hero from "@/components/new-landing/hero";
import Industries from "@/components/new-landing/industries";
import Marquee from "@/components/new-landing/marquee";
import Positioning from "@/components/new-landing/positioning";
import Problem from "@/components/new-landing/problem";
import SiteFooter from "@/components/new-landing/site-footer";
import Pricing from "@/components/new-landing/pricing";
import Stats from "@/components/new-landing/stats";
import ValueProp from "@/components/new-landing/value-prop";

/**
 * The page tells one story: the hook, the pain, what Seerix is, how it
 * works, everything it does, the numbers, the price, the questions, who it
 * is for -- then the one ask again. A proof quote belongs
 * after the ticker once a real one exists; until then the slot stays empty.
 */
export default function Home() {
  return (
    // The animated background comes from the root layout; the sections' own
    // ivory steps aside for it (globals.css).
    <div className="flex flex-1 flex-col">
      <Hero />
      <Marquee />

      {/* No rules between sections: every section carries the same padding,
          so the spacing alone separates them. */}
      <div className="flex flex-1 flex-col">
        <Problem />
        <Positioning />
        <FindGaps />
        <ValueProp />
        <Stats />
        <Pricing />
        <Faq />
        <Industries />
        <Cta />
      </div>

      <SiteFooter />
    </div>
  );
}
