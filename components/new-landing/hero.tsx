import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";

const trustMarks = [
  "Search Console",
  "SERP tracking",
  "Crawl data",
  "Competitors",
  "Algo updates",
];

/**
 * Sits above the railed content so the vertical rules start below it, and
 * closes with its own hairline to hand off to the first railed section.
 */
export default function Hero() {
  return (
    <section className="border-b border-black/10 bg-white px-6 pb-24 pt-24 sm:pt-28">
      <div className="mx-auto max-w-5xl">
        <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-[-0.03em] text-black sm:text-6xl lg:text-7xl">
          <BlockReveal>
            Seerix: the Search Console platform that explains why
          </BlockReveal>
        </h1>

        <p className="mt-7 max-w-xl font-body text-[17px] leading-relaxed text-zinc-600">
          Seerix connects to your Google Search Console, monitors your SERPs,
          and tracks every ranking change, then does what dashboards
          can&rsquo;t: tells you why it happened and what to do next.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
            href="#features"
            className="flex h-11 translate-y-0 items-center rounded-lg border border-black/15 bg-white px-6 font-body text-[15px] text-zinc-700 [box-shadow:0_4px_0_0_#d4d4d8,0_5px_10px_rgba(0,0,0,0.10)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:text-black hover:[box-shadow:0_6px_0_0_#d4d4d8,0_10px_18px_rgba(0,0,0,0.14)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#d4d4d8,0_2px_4px_rgba(0,0,0,0.10)]"
          >
            Explore features
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400">
            BUILT ON
          </span>
          {trustMarks.map((name) => (
            <span
              key={name}
              className="font-display text-[15px] font-semibold tracking-tight text-zinc-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
