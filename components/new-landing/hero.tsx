import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import Button, { ButtonArrow } from "@/components/new-landing/button";
import HeroPanel from "@/components/new-landing/hero-panel";
import LightStreaks from "@/components/new-landing/light-streaks";

/**
 * Left-aligned opener: an oversized headline, then a baseline row that carries
 * the subhead on the left and a secondary announcement link on the right. The
 * call-to-action pair is right-aligned beneath it, with the product panel
 * bleeding off the bottom of the section.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-28 sm:pt-52">
      <LightStreaks count={64} />
      {/* Clears the streaks off the panel without erasing the whole field: the
          fade starts low so the band behind the headline stays populated. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-60% to-white to-95%" />

      <div className="relative mx-auto max-w-7xl">
        <h1 className="max-w-4xl font-display text-[38px] font-medium leading-[1.07] tracking-[-0.035em] text-black sm:text-[52px] lg:text-[60px]">
          <BlockReveal>
            The Search Console platform that explains why
          </BlockReveal>
        </h1>

        {/* Buttons sit on their own right-aligned row so the subhead and the
            announcement below can share a baseline. */}
        <div className="mt-5 flex flex-col items-stretch gap-3 sm:-mt-[44px] sm:flex-row sm:items-center sm:justify-end">
          <Button href="#demo">
            See demo
            <ButtonArrow />
          </Button>
          <Button href="#features" variant="secondary">
            Explore features
          </Button>
        </div>

        {/* Subhead left, announcement right, aligned on their last line. */}
        <div className="mt-5 flex flex-col gap-4 sm:mt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <p className="max-w-md font-body text-[17px] leading-[1.55] text-zinc-500">
            Diagnoses with receipts, not dashboards with homework. Built on your
            own Search Console data.
          </p>

          <Link
            href="#features"
            className="group inline-flex shrink-0 items-center gap-2 font-body text-[15px] text-zinc-500 transition-colors duration-200 hover:text-black"
          >
            <span className="text-black">New</span>
            Evidence-cited answers
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          </Link>
        </div>

        {/* Bleeds past the section's bottom edge, as the reference does. */}
        <div className="mt-3 sm:mt-5">
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}
