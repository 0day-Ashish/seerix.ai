import FooterContact from "@/components/new-landing/footer-contact";
import FooterDetails from "@/components/new-landing/footer-details";
import FooterLinks from "@/components/new-landing/footer-links";
import StrokeText from "@/components/new-landing/StrokeText";
import ThemeToggle from "@/components/new-landing/theme-toggle";
import { ParticleDissolve } from "@/components/new-landing/ui/particle-dissolve";

/**
 * The shared page foot: dissolve, contact and links, then the oversized
 * wordmark. Extracted from the landing route so the pricing route ends the
 * same way rather than carrying a second copy of it.
 */
export default function SiteFooter() {
  return (
    <section className="mt-auto">
      <ParticleDissolve />
      {/* Amakusa Black, matching the tone the dissolve settles into. */}
      <div className="relative overflow-hidden bg-[#36363B] px-6 pb-[34vw] pt-12 sm:pb-[260px]">
        <div className="relative z-10">
          {/* Tagline left, office and socials in the middle, link columns
              right; they stack on mobile. */}
          <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <FooterContact />
            <FooterDetails />
            <FooterLinks />
          </div>

          <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-[13px] text-white/40">
              &copy; {new Date().getFullYear()} Seerix. All rights reserved.
            </p>

            <ThemeToggle />
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
  );
}
