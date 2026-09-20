"use client";

import { useState } from "react";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import Button, { ButtonArrow } from "@/components/new-landing/button";
import SectionLabel from "@/components/new-landing/section-label";
import {
  AskCard,
  ConnectCard,
  StudyCard,
} from "@/components/new-landing/step-cards";

type Step = {
  /** Step ordinal shown above the title. */
  step: string;
  title: string;
  body: string;
  /** The panel this step selects on the right. */
  card: React.ReactNode;
};

const steps: Step[] = [
  {
    step: "01",
    title: "Connect Search Console",
    body: "One read-only Google sign-in pulls sixteen months of clicks, impressions, and rankings history, the ground truth for everything Seerix tells you. Nothing in your Google account is ever modified.",
    card: <ConnectCard />,
  },
  {
    step: "02",
    title: "Seerix studies your site",
    body: "It crawls your pages, maps internal links, tracks the SERPs you compete in, watches competitors move, and checks every Google algorithm update against your timeline, continuously, in the background.",
    card: <StudyCard />,
  },
  {
    step: "03",
    title: "Ask anything. Get receipts.",
    body: "Traffic drops, page problems, what to write next, title rewrites. Every answer is a diagnosis assembled from your data, with the evidence pinned to it and an honest confidence score.",
    card: <AskCard />,
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Copy left, the selected step's panel right -- the same split the
            what-is-seerix section uses, so the two read as one system. */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionLabel name="How it works" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>Connect once. Then just ask.</BlockReveal>
            </h2>
            <p className="mt-5 max-w-xl font-body text-[16px] leading-[1.6] text-zinc-500">
              Three steps, and only the first one is yours. Hover a step to see
              what it produces.
            </p>

            {/* Buttons rather than divs: hover alone would leave this
                unreachable by keyboard and unusable on touch, so pointer,
                focus and tap all select the same step. */}
            <div className="mt-10 border-t border-black/[0.07]">
              {steps.map((item, index) => {
                const selected = index === active;

                return (
                  <button
                    key={item.step}
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    aria-pressed={selected}
                    className="group block w-full border-b border-black/[0.07] py-6 text-left"
                  >
                    <span
                      className={`font-body text-[13px] transition-colors duration-200 ${
                        selected ? "text-black" : "text-zinc-400"
                      }`}
                    >
                      {item.step}
                    </span>
                    <h3
                      className={`mt-2 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] transition-colors duration-200 ${
                        selected
                          ? "text-black"
                          : "text-zinc-400 group-hover:text-black"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {/* Only the selected step carries its paragraph: three at
                        once would outrun the panel beside them. */}
                    <p
                      className={`grid transition-all duration-300 ease-out ${
                        selected
                          ? "mt-2.5 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-lg font-body text-[15px] leading-[1.65] text-zinc-500">
                          {item.body}
                        </span>
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>

            <Button href="#features" variant="secondary" className="mt-10">
              Explore features
              <ButtonArrow />
            </Button>
          </div>

          {/* Sits first in the source on mobile so the panel is seen before it
              is argued, and returns to the right on wide screens, dropped a
              little below the heading it sits beside. */}
          <div className="order-first lg:order-none lg:mt-16">
            {steps[active].card}
          </div>
        </div>
      </div>
    </section>
  );
}
