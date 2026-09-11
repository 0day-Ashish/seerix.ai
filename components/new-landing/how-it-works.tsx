import Link from "next/link";

import { PixelHover } from "@/components/new-landing/pixel-hover";
import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type Step = {
  /** Step ordinal shown in mono above the title. */
  step: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    step: "01",
    title: "Connect Search Console",
    body: "One read-only Google sign-in pulls sixteen months of clicks, impressions, and rankings history, the ground truth for everything Seerix tells you. Nothing in your Google account is ever modified.",
  },
  {
    step: "02",
    title: "Seerix studies your site",
    body: "It crawls your pages, maps internal links, tracks the SERPs you compete in, watches competitors move, and checks every Google algorithm update against your timeline, continuously, in the background.",
  },
  {
    step: "03",
    title: "Ask anything. Get receipts.",
    body: "Traffic drops, page problems, what to write next, title rewrites. Every answer is a diagnosis assembled from your data, with the evidence pinned to it and an honest confidence score.",
  },
];

function CornerArrow() {
  return (
    <svg
      className="absolute right-4 top-4 z-10 h-4 w-4 text-zinc-300 transition-colors duration-200 group-hover:text-[#36363B]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11L11 5M6 5h5v5" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-6 pb-12">
      <SectionLabel number="01" name="HOW IT WORKS" hideTopBorder />

      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-2xl font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
          <BlockReveal>Connect once. Then just ask.</BlockReveal>
        </h2>

        <Link
          href="#features"
          className="group mt-8 inline-flex h-10 translate-y-0 items-center gap-3 rounded-lg border border-black/15 bg-white px-5 font-body text-[15px] text-zinc-700 [box-shadow:0_4px_0_0_#d4d4d8,0_5px_10px_rgba(0,0,0,0.10)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:text-black hover:[box-shadow:0_6px_0_0_#d4d4d8,0_10px_18px_rgba(0,0,0,0.14)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#d4d4d8,0_2px_4px_rgba(0,0,0,0.10)]"
        >
          Explore features
          <svg
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>

        {/* Hairlines come from the cells themselves, so the grid reads as one
            continuous table rather than separate cards. */}
        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-xl border border-black/10 lg:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col justify-start border-b border-r border-black/10 p-8 transition-colors duration-200 last:border-b-0 last:border-r-0 hover:bg-black/[0.02] lg:border-b-0 lg:[&:nth-child(3n)]:border-r-0"
            >
              <PixelHover />
              <CornerArrow />
              <div className="relative z-10">
                <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-black">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-zinc-600">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
