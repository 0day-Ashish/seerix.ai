import Link from "next/link";
import HowItWorks from "@/components/new-landing/how-it-works";
import Cta from "@/components/new-landing/cta";
import Faq from "@/components/new-landing/faq";
import Hero from "@/components/new-landing/hero";
import Industries from "@/components/new-landing/industries";
import Pricing from "@/components/new-landing/pricing";
import Trust from "@/components/new-landing/trust";
import FooterContact from "@/components/new-landing/footer-contact";
import FooterLinks from "@/components/new-landing/footer-links";
import Stats from "@/components/new-landing/stats";
import StrokeText from "@/components/new-landing/StrokeText";
import ValueProp from "@/components/new-landing/value-prop";
import { ParticleDissolve } from "@/components/new-landing/ui/particle-dissolve";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Hero />

      <div className="flex flex-1 flex-col">
        <HowItWorks />
        <Stats />
        <ValueProp />
        <Trust />
        <Pricing />
        <Faq />
        <Industries />
        <Cta />
      </div>

      <section className="mt-auto">
        <ParticleDissolve />
        {/* Amakusa Black, matching the tone the dissolve settles into. */}
        <div className="relative overflow-hidden bg-[#36363B] px-6 pb-[34vw] pt-12 sm:pb-[260px]">
          <div className="relative z-10">
            {/* Contact sits left, link columns right; they stack on mobile. */}
            <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              <FooterContact />
              <FooterLinks />
            </div>

            <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-[13px] text-white/40">
                &copy; {new Date().getFullYear()} Seerix &middot; seerix.ai SEO answers
                with receipts.
              </p>

              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {["Privacy", "Terms", "Legal"].map((label) => (
                  <li key={label}>
                    <Link
                      href="#"
                      className="font-body text-[13px] text-white/40 transition-colors duration-200 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Oversized wordmark, stroke-drawn on scroll into view. */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-[8vw] select-none sm:-bottom-[64px]">
            <StrokeText
              // SVG text inherits from the span, so set the family there.
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
              text="seerix"
              trigger="scroll"
              fillMode="wipe"
              strokeColor="#888084"
              fillColor="#DCDDDD"
              strokeWidth={1.1}
              fontSize={228}
              fontWeight={500}
              letterSpacing={-8}
              drawDuration={1.8}
              stagger={0.06}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
