import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import GradientWash from "@/components/new-landing/gradient-wash";
import HeroGlow from "@/components/new-landing/hero-glow";
import ProductDemo from "@/components/new-landing/product-demo";
import WaitlistForm from "@/components/new-landing/waitlist-form";

/**
 * Left-aligned opener: an oversized headline, then a baseline row that carries
 * the subhead on the left and a secondary announcement link on the right. The
 * call-to-action pair is right-aligned beneath it, with the product panel
 * bleeding off the bottom of the section.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ghost px-6 pb-4 pt-16 sm:pb-6 sm:pt-32">
      {/* Settles the panel's glow into the page ground toward the bottom
          of the section. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-72% to-ghost to-97%" />

      {/* Isolated so the panel's glow can sit behind the copy and form
          (-z-10) without dropping behind the section's own ground. */}
      <div className="relative isolate mx-auto max-w-7xl">
        {/* Announcement pill: a label and its link sharing one outline, split
            by a hairline. Replaces the inline "New" link that used to sit by
            the subhead, so the hero announces one thing in one place. */}
        <Link
          href="/pricing"
          className="group mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-signal/20 bg-signal-soft py-2 pl-3.5 pr-3 transition-colors duration-200 hover:border-signal/40 sm:gap-3 sm:pl-4 sm:pr-3.5"
        >
          <span className="font-body text-[12px] text-zinc-700 sm:text-[14px]">
            <span className="sm:hidden">Evidence-cited diagnoses</span>
            <span className="hidden sm:inline">
              Introducing evidence-cited diagnoses
            </span>
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-signal/20" />
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-body text-[12px] font-medium text-signal-deep sm:text-[14px]">
            Read more
            <svg
              className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 8.5L8.5 3.5M4.5 3.5h4v4" />
            </svg>
          </span>
        </Link>

        <h1 className="max-w-4xl font-display text-[31px] font-medium leading-[1.09] tracking-[-0.03em] text-black sm:text-[52px] sm:leading-[1.07] sm:tracking-[-0.035em] lg:text-[60px]">
          <BlockReveal>
            The Search Console platform that explains why
          </BlockReveal>
        </h1>

        {/* Subhead left, the hero's one action right, sharing a row so the
            form sits level with the copy rather than riding up beside the
            headline's last line. */}
        <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="max-w-md font-body text-[15px] leading-[1.6] text-zinc-600 sm:text-[17px] sm:leading-[1.55]">
            Diagnoses with receipts, not dashboards with homework. Built on your
            own Search Console data.
          </p>

          <div className="shrink-0">
            <WaitlistForm />
          </div>
        </div>

        {/* The product demo: tabs over an app window, stepping through the
            jobs Seerix does, on the brand's moving lilac wash. */}
        <div className="relative mt-8 sm:mt-12">
          {/* Light rising off the panel, behind it. */}
          <HeroGlow />
          <div className="relative overflow-hidden rounded-[22px] p-3 sm:rounded-[28px] sm:p-8">
            <GradientWash />
            <div className="relative">
              <ProductDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
