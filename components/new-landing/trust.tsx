"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SectionHeader from "@/components/new-landing/section-header";
import {
  Checkable,
  CitedOrRejected,
  HonestConfidence,
  NeverWrites,
  PrivateByDesign,
} from "@/components/new-landing/trust-visuals";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Pillar = {
  title: string;
  body: string;
  /** The product fragment shown between the heading and the body. */
  visual: React.ReactNode;
};

const pillars: Pillar[] = [
  {
    title: "Cited, or rejected",
    body: "The AI only reasons over evidence assembled from your actual data. Answers citing evidence that doesn't exist are automatically thrown away before you see them.",
    visual: <CitedOrRejected />,
  },
  {
    title: "Honest confidence",
    body: "Short history? Thin data? Confidence drops and Seerix says why. It never rounds uncertainty up to sound smart, and 'I don't know yet' is an answer it's allowed to give.",
    visual: <HonestConfidence />,
  },
  {
    title: "Private by design",
    body: "Read-only Google access, revocable anytime. Encrypted tokens, isolated per-customer data, no selling, no cross-customer sharing, no model training on your data.",
    visual: <PrivateByDesign />,
  },
  {
    title: "It can never write",
    body: "Seerix holds read-only scopes and nothing else. It cannot change a setting, add or remove a property, or push anything back to your Google account, whatever you ask it to do.",
    visual: <NeverWrites />,
  },
  {
    title: "Checkable, not trusted",
    body: "Every diagnosis carries the evidence rows it was built from, so you can follow the reasoning back to the data yourself instead of taking the conclusion on faith.",
    visual: <Checkable />,
  },
];

export default function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Below lg the row is a plain swipeable overflow strip: pinning the page
    // on a touch device to drive a sideways move fights the user's scroll.
    const wide = window.matchMedia("(min-width: 1024px)");

    // Captured as locals so the closures below see non-null values rather
    // than the refs, which TypeScript cannot narrow across a callback.
    const el = section;
    const pinned = pin;
    const rail = track;

    let ctx: gsap.Context | null = null;

    function build() {
      ctx?.revert();
      if (reduced || !wide.matches) return;

      ctx = gsap.context(() => {
        // Measured from the last card rather than from the rail's scrollWidth:
        // the rail is a w-max flex child whose reported width does not
        // reliably include its own trailing inset, which left the final card
        // running off the right edge. Its right edge is the ground truth.
        const distance = () => {
          const last = rail.lastElementChild as HTMLElement | null;
          if (!last) return 0;
          // Undo any travel already applied, so the measurement is taken
          // against the rail's resting position on every refresh.
          const applied = (gsap.getProperty(rail, "x") as number) || 0;
          const right = last.getBoundingClientRect().right - applied;
          // Stop with the same gutter on the right as the row starts with on
          // the left, so the last card lands inside the page rather than
          // touching the edge of the screen.
          return Math.max(0, right - window.innerWidth + gutter());
        };

        // Matches the rail's left inset: the centred max-w-7xl column gutter.
        function gutter() {
          return Math.max(24, (window.innerWidth - 1280) / 2 + 24);
        }

        if (distance() <= 0) return;

        gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            // The wrapper is pinned rather than the section: GSAP moves the
            // pinned node into a spacer it injects, and pinning the section
            // itself put that spacer between the page's sections where it had
            // no background of its own, letting the next section show through.
            trigger: pinned,
            pin: pinned,
            // Below the 72px sticky navbar rather than at the viewport top,
            // so the heading is not held underneath it.
            start: "top 72px",
            // Pin for exactly the horizontal distance, so the page resumes
            // vertical scrolling the moment the last card lands.
            end: () => `+=${distance()}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
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
      id="trust"
      // relative + z-10 so the section sits above the one that follows it:
      // while pinned it stops moving, and a later sibling would otherwise
      // paint straight over the held cards.
      //
      // No overflow-hidden here: GSAP wraps the pinned node in a spacer, and
      // clipping on an ancestor fights the pin. The rail clips instead.
      className="relative z-10 bg-white"
    >
      {/* The pinned node is this wrapper, not the section. GSAP moves whatever
          it pins into a spacer it injects; pinning the section put that spacer
          between the page's sections with no ground of its own, which is how
          the next section showed through. Pinning inside keeps the spacer
          within this section, and the opaque background travels with it. */}
      <div
        ref={pinRef}
        className="relative z-10 flex flex-col bg-white py-20 sm:py-24 lg:h-[calc(100dvh-72px)] lg:pb-0 lg:pt-16"
      >
        <div className="mx-auto w-full max-w-7xl px-6">
          <SectionHeader
            label="Why trust it"
            heading="Built so it can't make things up about your site."
          />
        </div>

        {/* The rail runs past the page gutter on purpose: the row should read
            as continuing off-screen rather than ending at the column edge.
            Below lg it is a normal swipeable overflow strip. */}
        <div className="mt-10 overflow-x-auto pb-2 [scrollbar-width:none] lg:overflow-x-clip lg:pb-0 [&::-webkit-scrollbar]:hidden">
          <div
            ref={trackRef}
            className="flex w-max gap-4 px-6 will-change-transform lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
          >
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="flex h-[26rem] w-[82vw] shrink-0 flex-col justify-between rounded-2xl bg-[#1c1c21] p-8 sm:w-[27rem] lg:h-[min(30rem,calc(100dvh-21rem))] lg:w-[30rem] lg:p-11"
              >
                <h3 className="font-display text-[22px] font-medium leading-snug tracking-[-0.02em] text-white lg:text-[26px]">
                  {pillar.title}
                </h3>
                <div className="my-6">{pillar.visual}</div>
                <p className="font-body text-[15px] leading-[1.7] text-white/55 lg:text-[16px]">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-6">
          <Link
            href="/privacy"
            className="group inline-flex items-center gap-2 font-body text-[15px] text-zinc-500 transition-colors duration-200 hover:text-black"
          >
            Privacy Policy
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
      </div>

    </section>
  );
}
