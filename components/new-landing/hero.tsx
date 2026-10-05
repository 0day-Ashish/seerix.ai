import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import HeroPanel from "@/components/new-landing/hero-panel";
import ScanField from "@/components/new-landing/scan-field";
import WaitlistForm from "@/components/new-landing/waitlist-form";

/**
 * Left-aligned opener: an oversized headline, then a baseline row that carries
 * the subhead on the left and a secondary announcement link on the right. The
 * call-to-action pair is right-aligned beneath it, with the product panel
 * bleeding off the bottom of the section.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-16 sm:pt-32">
      {/* The scan field, confined to the top-right corner: it stays clear of
          the headline and the product panel, and fades out toward the
          centre and down toward the waitlist form. */}
      <div className="pointer-events-none absolute right-0 top-0 h-[29rem] w-[48%] [-webkit-mask-image:radial-gradient(ellipse_at_top_right,black_25%,transparent_72%)] [mask-image:radial-gradient(ellipse_at_top_right,black_25%,transparent_72%)]">
        <ScanField tone="light" cell={16} strength={0.16} findings={4} sweep={8} />
      </div>
      {/* Clears the field off the panel without erasing it: the fade starts
          low and stops short of opaque, so the weave still reaches the
          bottom-left corner it sweeps out of. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-72% to-white to-97%" />

      <div className="relative mx-auto max-w-7xl">
        {/* Announcement pill: a label and its link sharing one outline, split
            by a hairline. Replaces the inline "New" link that used to sit by
            the subhead, so the hero announces one thing in one place. */}
        <Link
          href="/pricing"
          className="group mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-black/[0.10] bg-white py-2 pl-3.5 pr-3 transition-colors duration-200 hover:border-black/[0.18] sm:gap-3 sm:pl-4 sm:pr-3.5"
        >
          <span className="font-body text-[12px] text-zinc-600 sm:text-[14px]">
            <span className="sm:hidden">Evidence-cited diagnoses</span>
            <span className="hidden sm:inline">
              Introducing evidence-cited diagnoses
            </span>
          </span>
          <span aria-hidden="true" className="h-4 w-px bg-black/[0.10]" />
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

        {/* The hero's one action. It keeps the right-aligned placement the
            button pair had, tucked up beside the headline's last line. */}
        <div className="mt-5 sm:-mt-[44px] sm:flex sm:justify-end">
          <WaitlistForm />
        </div>

        {/* The announcement that used to share this row now sits in the pill
            above the headline, so the subhead has the line to itself. */}
        <div className="mt-5 sm:mt-4">
          <p className="max-w-md font-body text-[15px] leading-[1.6] text-zinc-500 sm:text-[17px] sm:leading-[1.55]">
            Diagnoses with receipts, not dashboards with homework. Built on your
            own Search Console data.
          </p>
        </div>

        {/* Bleeds past the section's bottom edge, as the reference does. The
            rule closing the section is drawn here rather than on the section
            itself, so it runs behind the panel instead of across it. */}
        <div className="relative mt-3 sm:mt-5">
          <div className="pointer-events-none absolute inset-x-[-100vw] bottom-0 border-b border-black/[0.07]" />
          <div className="relative">
            <HeroPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
