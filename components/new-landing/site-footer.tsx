import Link from "next/link";

import FooterContact from "@/components/new-landing/footer-contact";
import FooterDetails from "@/components/new-landing/footer-details";
import FooterLinks from "@/components/new-landing/footer-links";
import StrokeText from "@/components/new-landing/StrokeText";
import { ParticleDissolve } from "@/components/new-landing/ui/particle-dissolve";

/** The short legal run in the bottom bar, beside the status readout. */
const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "SeerixBot", href: "/seerixbot" },
];

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

            {/* Replaces the theme toggle, which had nothing to switch: no part
                of the site carries dark variants. A status readout and the
                legal links use the slot for something the footer is actually
                asked for. */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex items-center gap-2 font-body text-[13px] text-white/40">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                </span>
                All systems operational
              </span>

              <nav aria-label="Legal" className="flex items-center gap-5">
                {legalLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-body text-[13px] text-white/40 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
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
