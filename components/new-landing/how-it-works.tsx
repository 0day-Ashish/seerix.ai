"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Button, { ButtonArrow } from "@/components/new-landing/button";
import SectionLabel from "@/components/new-landing/section-label";
import {
  AskCard,
  ConnectCard,
  StudyCard,
} from "@/components/new-landing/step-cards";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Step = {
  /** Step ordinal shown on the rail. */
  step: string;
  /** The heading, split so its second line can carry the weight. */
  lead: string;
  strong: string;
  body: string;
  /** The panel this step shows on the right. */
  card: React.ReactNode;
};

const steps: Step[] = [
  {
    step: "01",
    lead: "Connect",
    strong: "Search Console",
    body: "One read-only Google sign-in pulls sixteen months of clicks, impressions, and rankings history, the ground truth for everything Seerix tells you. Nothing in your Google account is ever modified.",
    card: <ConnectCard />,
  },
  {
    step: "02",
    lead: "Seerix studies",
    strong: "your site",
    body: "It crawls your pages, maps internal links, tracks the SERPs you compete in, watches competitors move, and checks every Google algorithm update against your timeline, continuously, in the background.",
    card: <StudyCard />,
  },
  {
    step: "03",
    lead: "Ask anything.",
    strong: "Get receipts.",
    body: "Traffic drops, page problems, what to write next, title rewrites. Every answer is a diagnosis assembled from your data, with the evidence pinned to it and an honest confidence score.",
    card: <AskCard />,
  },
];

/** Scroll distance, in viewport heights, given to each step while pinned. */
const SCROLL_PER_STEP = 0.9;

/** The step's heading and paragraph, shared by both layouts below. */
function StepCopy({ item }: { item: Step }) {
  return (
    <>
      <h3 className="font-display text-[34px] leading-[1.08] tracking-[-0.03em] text-black sm:text-[44px] lg:text-[52px]">
        <span className="block font-normal">{item.lead}</span>
        <span className="block font-semibold">{item.strong}</span>
      </h3>
      <p className="mt-6 max-w-md font-body text-[16px] leading-[1.6] text-zinc-500">
        {item.body}
      </p>
    </>
  );
}

/**
 * The vertical progress rail beside the copy: a tall bar with the ordinal for
 * the step being shown, a dot for each of the others.
 */
function Rail({ active }: { active: number }) {
  return (
    <ol className="flex flex-col items-start gap-4" aria-hidden="true">
      {steps.map((item, index) => {
        const on = index === active;
        return (
          <li key={item.step} className="flex items-center gap-3">
            <span
              className={`block w-[2px] rounded-full transition-all duration-300 ease-out ${
                on ? "h-9 bg-black" : "h-[3px] w-[3px] bg-zinc-300"
              }`}
            />
            <span
              className={`font-mono text-[12px] transition-opacity duration-300 ${
                on ? "opacity-100" : "opacity-0"
              }`}
            >
              {item.step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Below lg the steps are stacked and read by scrolling past them; pinning
    // the page on a small screen would fight that.
    const wide = window.matchMedia("(min-width: 1024px)");

    const el = section;
    const pinned = pin;
    let ctx: gsap.Context | null = null;

    function build() {
      ctx?.revert();
      if (reduced || !wide.matches) {
        setActive(0);
        return;
      }

      ctx = gsap.context(() => {
        const last = steps.length - 1;

        ScrollTrigger.create({
          trigger: pinned,
          pin: pinned,
          // Held just under the 72px sticky navbar, as the trust section is.
          start: "top 72px",
          end: () =>
            `+=${Math.round(window.innerHeight * SCROLL_PER_STEP * steps.length)}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Progress maps evenly onto the steps, and the scroll settles on a
          // step boundary rather than between two.
          snap: {
            snapTo: 1 / last,
            duration: { min: 0.15, max: 0.4 },
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            setActive(Math.round(self.progress * last));
          },
        });
      }, el);
    }

    build();
    wide.addEventListener("change", build);
    return () => {
      wide.removeEventListener("change", build);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      // Above the section that follows while pinned, and no overflow-hidden
      // on the pinned node's ancestors: GSAP wraps it in a spacer.
      className="relative z-10 bg-white"
    >
      {/* Wide screens: one viewport, pinned, with the step changing as the
          reader scrolls through it. */}
      <div
        ref={pinRef}
        className="hidden bg-white px-6 lg:flex lg:h-[calc(100dvh-72px)] lg:flex-col lg:justify-center"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-6">
            <div className="pt-1">
              <Rail active={active} />
            </div>

            {/* The three copies are stacked and cross-faded, so the column
                keeps one height and nothing beside it shifts. */}
            <div>
              <SectionLabel name="How it works" />
              <div className="relative mt-6">
                {steps.map((item, index) => {
                  const on = index === active;
                  return (
                    <div
                      key={item.step}
                      aria-hidden={!on}
                      className={`transition-all duration-500 ease-out ${
                        on
                          ? "relative translate-y-0 opacity-100"
                          : "pointer-events-none absolute inset-x-0 top-0 translate-y-2 opacity-0"
                      }`}
                    >
                      <StepCopy item={item} />
                    </div>
                  );
                })}
              </div>

              <Button href="#features" variant="secondary" className="mt-10">
                Explore features
                <ButtonArrow />
              </Button>
            </div>
          </div>

          {/* Panels stacked in one box the size of a card, cross-faded. */}
          <div className="relative h-[36rem] lg:h-[min(39rem,calc(100dvh-12rem))]">
            {steps.map((item, index) => {
              const on = index === active;
              return (
                <div
                  key={item.step}
                  aria-hidden={!on}
                  className={`absolute inset-0 transition-all duration-500 ease-out ${
                    on ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
                  }`}
                >
                  {item.card}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Narrow screens and reduced motion: the same steps, one after the
          other, each with its panel. */}
      <div className="px-6 py-20 sm:py-24 lg:hidden">
        <div className="mx-auto max-w-7xl">
          <SectionLabel name="How it works" />
          <ol className="mt-10 flex flex-col gap-16">
            {steps.map((item) => (
              <li key={item.step} className="flex flex-col gap-8">
                <div>
                  <span className="font-mono text-[12px] text-zinc-400">
                    {item.step}
                  </span>
                  <div className="mt-3">
                    <StepCopy item={item} />
                  </div>
                </div>
                {item.card}
              </li>
            ))}
          </ol>

          <Button href="#features" variant="secondary" className="mt-12">
            Explore features
            <ButtonArrow />
          </Button>
        </div>
      </div>
    </section>
  );
}
