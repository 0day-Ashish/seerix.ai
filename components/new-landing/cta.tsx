import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

export default function Cta() {
  return (
    <section id="demo" className="bg-white px-6 pb-16 pt-20">
      <SectionLabel number="06" name="GET STARTED" />


      <div className="mx-auto mt-16 max-w-5xl">
        <div className="px-8 py-12 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
            <BlockReveal>Stop guessing why. Start knowing.</BlockReveal>
          </h2>

          <p className="mx-auto mt-6 max-w-lg font-body text-[15px] leading-relaxed text-zinc-600">
            Connect your Search Console and ask your first question. Works
            with Search Console alone &middot; No credit card &middot; Cancel
            anytime.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#demo"
              className="group flex h-11 translate-y-0 items-center gap-3 rounded-lg bg-gradient-to-b from-[#4a4a51] to-[#36363B] px-6 font-body text-[15px] text-white [box-shadow:0_4px_0_0_#1c1c21,0_5px_10px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:from-[#55555d] hover:to-[#3f3f45] hover:[box-shadow:0_6px_0_0_#1c1c21,0_10px_18px_rgba(0,0,0,0.22)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#1c1c21,0_2px_4px_rgba(0,0,0,0.15)]"
            >
              See demo
              <svg
                className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>

            <Link
              href="mailto:hello@seerix.ai"
              className="flex h-11 translate-y-0 items-center rounded-lg border border-black/15 bg-white px-6 font-body text-[15px] text-zinc-700 [box-shadow:0_4px_0_0_#d4d4d8,0_5px_10px_rgba(0,0,0,0.10)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:text-black hover:[box-shadow:0_6px_0_0_#d4d4d8,0_10px_18px_rgba(0,0,0,0.14)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#d4d4d8,0_2px_4px_rgba(0,0,0,0.10)]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
