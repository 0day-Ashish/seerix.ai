"use client";

import { useState } from "react";

import {
  pricingDrop,
  type Diagnosis,
} from "@/components/new-landing/answer-card";
import SectionLabel from "@/components/new-landing/section-label";

type Point = {
  title: string;
  body: string;
};

/**
 * The plain-language answer to "what is this", set before the how-it-works
 * walkthrough so a first-time reader knows what they are looking at.
 *
 * Copy on the left, and on the right the thing itself: a question bar with
 * three questions to pick from, and the diagnosis each one gets. The reader
 * can see the product answer before being told what it does.
 */
const points: Point[] = [
  {
    title: "Built on your own data",
    body: "Seerix reads your Search Console history rather than a third-party index, so every number it shows is the one Google already has on your site.",
  },
  {
    title: "An answer, not a dashboard",
    body: "Instead of handing you charts to interpret, it states what changed, why it changed, and what to do about it, in a sentence you can act on.",
  },
  {
    title: "Evidence attached",
    body: "Every diagnosis carries the data that produced it and an honest confidence score, so you can check the reasoning instead of trusting it blindly.",
  },
];

/**
 * Three questions, chosen to show the three things the points beside them
 * claim: a diagnosis, a prioritised list, and an honest "not yet".
 */
const diagnoses: Diagnosis[] = [
  pricingDrop,
  {
    question: "Which pages are close to page one?",
    answer:
      "Six pages sit at positions 6–12 with rising impressions. Start with /integrations.",
    evidence: [
      { source: "Search Console", detail: "impressions +38% (28d)", confidence: "High" },
      { source: "SERP snapshot", detail: "/integrations 8 → 6", confidence: "High" },
      { source: "Crawl", detail: "3 pages with no internal links", confidence: "Medium" },
    ],
    confidence: 4,
    confidenceLabel: "High",
  },
  {
    question: "Did the March title fix work?",
    answer:
      "Not yet. Clicks are flat, and the new title has only been indexed for nine days.",
    evidence: [
      { source: "Search Console", detail: "clicks 1,110 → 1,140", confidence: "Medium" },
      { source: "Crawl", detail: "reindexed 21 Mar", confidence: "High" },
      { source: "SERP snapshot", detail: "position unchanged (9)", confidence: "High" },
    ],
    confidence: 2,
    confidenceLabel: "Low",
  },
];

/** Short labels for the question bar; the full question is on the card. */
const chips = ["Traffic drop", "Quick wins", "Did the fix work?"];

export default function WhatIsSeerix() {
  const [active, setActive] = useState(0);
  const diagnosis = diagnoses[active];

  return (
    <section id="what-is-seerix" className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Stacked, not split: heading and lede share the top row, the demo
            runs the full width beneath them, and the three points close the
            section as a row. How-it-works below is the copy-left, panel-right
            section; this one reads top to bottom so the two don't repeat. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <SectionLabel name="What is Seerix" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[44px]">
              An SEO analyst that works from your Search Console.
            </h2>
          </div>
          <p className="max-w-xl font-body text-[17px] leading-[1.6] text-zinc-500">
            Seerix connects to the data Google already keeps on your site, then
            explains your rankings in plain language, with the receipts to back
            it up.
          </p>
        </div>

        {/* The demo, full width: the question bar across the top, then the
            answer on the left and the evidence it cites on the right. */}
        <div className="mt-14 overflow-hidden rounded-2xl bg-[#1c1c21] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)]">
          <div
            role="tablist"
            aria-label="Example questions"
            className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] p-3 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden"
          >
            <span className="hidden pl-3 pr-1 font-body text-[13px] text-white/40 sm:block">
              Ask Seerix
            </span>
            {chips.map((chip, index) => {
              const on = index === active;
              return (
                <button
                  key={chip}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="what-is-seerix-panel"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 font-body text-[14px] transition-colors duration-200 ${
                    on
                      ? "bg-white text-[#1c1c21]"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Keyed on the question so the panel fades in fresh each time. */}
          <div
            key={diagnosis.question}
            id="what-is-seerix-panel"
            role="tabpanel"
            className="grid animate-[seerix-fade-in_0.4s_ease-out] grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 lg:p-10"
          >
            <div className="flex min-w-0 flex-col">
              <p className="font-body text-[14px] text-white/45">
                {diagnosis.question}
              </p>
              <p className="mt-4 font-display text-[22px] font-medium leading-snug tracking-[-0.02em] text-white sm:text-[28px]">
                {diagnosis.answer}
              </p>

              <div className="mt-8 flex items-center gap-3 lg:mt-auto">
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <span
                      key={index}
                      className={`h-1.5 w-5 rounded-full ${
                        index < diagnosis.confidence
                          ? "bg-[#dcdddd]/80"
                          : "bg-white/[0.12]"
                      }`}
                    />
                  ))}
                </span>
                <span className="font-mono text-[12px] text-white/60">
                  {diagnosis.confidenceLabel} confidence
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <p className="font-body text-[12px] font-medium uppercase tracking-[0.06em] text-white/40">
                Evidence
              </p>
              <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.09]">
                {diagnosis.evidence.map((row, index) => (
                  <div
                    key={row.source + row.detail}
                    className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
                      index > 0 ? "border-t border-white/[0.07]" : ""
                    }`}
                  >
                    <span className="flex min-w-0 items-start gap-3 sm:items-center">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#dcdddd]/60 sm:mt-0" />
                      <span className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                        <span className="shrink-0 font-body text-[14px] text-white/85">
                          {row.source}
                        </span>
                        <span className="truncate font-mono text-[12px] text-white/45">
                          {row.detail}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-white/[0.12] px-2 py-0.5 font-body text-[11px] text-white/50">
                      {row.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The three points as a row closing the section. */}
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {points.map((point, index) => (
            <div key={point.title} className="border-t border-black/[0.10] pt-5">
              <span className="font-mono text-[12px] text-zinc-400">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-black">
                {point.title}
              </h3>
              <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
