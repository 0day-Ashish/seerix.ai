"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import GradientWash from "@/components/new-landing/gradient-wash";
import {
  Checkable,
  CitedOrRejected,
  HonestConfidence,
  NeverWrites,
  PrivateByDesign,
} from "@/components/new-landing/trust-visuals";

type Pillar = {
  /** Mono eyebrow over the card, as the reference labels each one. */
  eyebrow: string;
  title: string;
  body: string;
  /** The product fragment shown between the heading and the body. */
  visual: React.ReactNode;
};

const pillars: Pillar[] = [
  {
    eyebrow: "Evidence",
    title: "Cited, or rejected",
    body: "The AI only reasons over evidence assembled from your actual data. Answers citing evidence that doesn't exist are automatically thrown away before you see them.",
    visual: <CitedOrRejected />,
  },
  {
    eyebrow: "Confidence",
    title: "Honest confidence",
    body: "Short history? Thin data? Confidence drops and Seerix says why. It never rounds uncertainty up to sound smart, and 'I don't know yet' is an answer it's allowed to give.",
    visual: <HonestConfidence />,
  },
  {
    eyebrow: "Privacy",
    title: "Private by design",
    body: "Read-only Google access, revocable anytime. Encrypted tokens, isolated per-customer data, no selling, no cross-customer sharing, no model training on your data.",
    visual: <PrivateByDesign />,
  },
  {
    eyebrow: "Permissions",
    title: "It can never write",
    body: "Seerix holds read-only scopes and nothing else. It cannot change a setting, add or remove a property, or push anything back to your Google account, whatever you ask it to do.",
    visual: <NeverWrites />,
  },
  {
    eyebrow: "Auditability",
    title: "Checkable, not trusted",
    body: "Every diagnosis carries the evidence rows it was built from, so you can follow the reasoning back to the data yourself instead of taking the conclusion on faith.",
    visual: <Checkable />,
  },
];

export default function Trust() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* An endless rail: the cards are rendered three times and the scroll
     position is quietly moved back a full set whenever it crosses into a
     copy. Without this the first and last card could never reach the centre,
     so they never expanded. The jump is one scrollLeft write between frames,
     so it is invisible. */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    // Start in the middle copy, so there is room to scroll either way.
    const setWidth = () => el.scrollWidth / 3;
    const start = () => {
      el.scrollLeft = setWidth();
    };
    // After layout, and again once fonts and images have settled it.
    start();
    const t = setTimeout(start, 300);

    const onScroll = () => {
      const w = setWidth();
      if (w <= 0) return;
      if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
      else if (el.scrollLeft > w * 1.5) el.scrollLeft -= w;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Which card sits nearest the rail's centre. Read on scroll rather than
     set by the drag, so it is right however the rail moved -- drag, wheel,
     keyboard or a snap settling. */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      const cards = [...el.querySelectorAll("article")];
      let best = 0;
      let bestGap = Infinity;
      cards.forEach((c, i) => {
        const centre = c.offsetLeft + c.offsetWidth / 2;
        const gap = Math.abs(centre - mid);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      // Back onto the real list: every copy of a pillar expands together.
      const real = best % pillars.length;
      setActive((n) => (n === real ? n : real));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Click-drag to scroll, with momentum.

     Three things make the gesture feel right, and all three were missing:

     1. Scroll-snap is turned off for the duration. `snap-mandatory` pulls
        the rail back to the nearest card on every frame, so a drag fought
        the snap the whole way and released into a jerk.
     2. The throw carries. Velocity is sampled over the last few moves and
        decays after release, instead of the rail stopping dead.
     3. No React state in the gesture: re-rendering the section per frame is
        what made it heavy in the first place. */
  /* Autoplay: the rail advances one card, rests long enough to read it,
     then advances again. It stops the moment a person takes over -- a
     pointer down, a wheel, a touch -- and does not resume, because a rail
     that moves under someone's hand is worse than one that never moved.
     Paused while off screen, and off entirely under reduced motion. */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let stopped = false;

    const step = () => {
      const card = el.querySelector("article");
      if (!card) return;
      // One card plus the gap; the loop effect handles the wrap.
      const by = card.getBoundingClientRect().width + 20;
      el.scrollBy({ left: by, behavior: "smooth" });
    };

    const start = () => {
      if (stopped || timer) return;
      timer = setInterval(step, 3800);
    };
    const pause = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    /** A person took over: stop for good. */
    const surrender = () => {
      stopped = true;
      pause();
    };

    el.addEventListener("pointerdown", surrender);
    el.addEventListener("wheel", surrender, { passive: true });
    el.addEventListener("touchstart", surrender, { passive: true });

    // Only run while the rail is actually on screen.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : pause()),
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      pause();
      io.disconnect();
      el.removeEventListener("pointerdown", surrender);
      el.removeEventListener("wheel", surrender);
      el.removeEventListener("touchstart", surrender);
    };
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;

    let startX = 0;
    let startLeft = 0;
    let moved = false;
    let active = false;
    let raf = 0;

    // Velocity, in px per ms, smoothed over the last couple of moves.
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;

    const lenis = () =>
      (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis;

    const stopGlide = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    /** Decays the throw, then hands the rail back to CSS snap. */
    const glide = () => {
      velocity *= 0.95;
      el.scrollLeft -= velocity * 16;
      const atEdge =
        el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth;
      if (Math.abs(velocity) > 0.02 && !atEdge) {
        raf = requestAnimationFrame(glide);
        return;
      }
      raf = 0;
      velocity = 0;
      // Snap comes back only once the rail is still, so it settles on a card
      // instead of snatching mid-throw. Every exit from the glide passes
      // through here, including a throw that runs into an edge.
      el.style.scrollSnapType = "";
    };

    const onDown = (e: PointerEvent) => {
      // A real touch scrolls natively: hijacking it loses the momentum.
      if (e.pointerType === "touch" || e.button !== 0) return;
      stopGlide();
      active = true;
      moved = false;
      velocity = 0;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      startLeft = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      // A few pixels of slack, so a click on a card is not read as a drag.
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) {
        moved = true;
        el.style.cursor = "grabbing";
        el.style.userSelect = "none";
        // Off for the gesture; restored when the glide settles.
        el.style.scrollSnapType = "none";
        lenis()?.stop();
      }
      e.preventDefault();

      const dt = e.timeStamp - lastT;
      if (dt > 0) {
        const v = (e.clientX - lastX) / dt;
        // Smoothed, so one stuttery frame does not define the throw.
        velocity = velocity * 0.7 + v * 0.3;
        lastX = e.clientX;
        lastT = e.timeStamp;
      }

      // Written straight to the DOM: the browser already coalesces pointer
      // events to one per frame, so a rAF here only adds a frame of lag.
      el.scrollLeft = startLeft - dx;
    };

    const onUp = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      el.releasePointerCapture?.(e.pointerId);
      el.style.cursor = "";
      el.style.userSelect = "";
      lenis()?.start();

      if (moved) {
        // Let the throw carry; the glide restores snap when it settles.
        raf = requestAnimationFrame(glide);
        // Swallow the click that follows a drag, so it cannot open a link.
        const swallow = (c: MouseEvent) => {
          c.preventDefault();
          c.stopPropagation();
        };
        el.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(
          () => el.removeEventListener("click", swallow, { capture: true }),
          0,
        );
      } else {
        el.style.scrollSnapType = "";
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      stopGlide();
      lenis()?.start();
    };
  }, []);

  return (
    <section
      id="trust"
      className="relative isolate z-30 overflow-x-clip bg-ghost pb-20 pt-28 sm:pb-28 sm:pt-40 lg:pt-48"
    >
      {/* Centred heading, as the reference has it, with the rail beneath
          running the full width so a card peeks in from either side. */}
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] font-light tracking-[-0.02em] text-zinc-900">
          Built so it can&rsquo;t make things up about your site.
        </h2>
      </div>

      {/* Drag to scroll. `overscroll-x-contain` stops a throw at either end
          from turning into a browser back-swipe. */}
      <div
        ref={rail}
        data-lenis-prevent-horizontal
        className="mt-12 flex cursor-grab snap-x snap-proximity gap-5 overflow-x-auto overscroll-x-contain px-6 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:mt-16 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {[0, 1, 2].flatMap((copy) =>
          pillars.map((pillar, i) => {
            const on = i === active;
            return (
              <article
                key={`${copy}-${pillar.title}`}
                className={`shrink-0 snap-center transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  on
                    ? "w-[86vw] border-l border-black/[0.10] pl-5 sm:w-[30rem] lg:w-[34rem]"
                    : "w-[70vw] sm:w-[24rem] lg:w-[27rem]"
                }`}
              >
                {/* The same bevel the industries panel carries: one shape
                    with a diagonal cut out of its top right, the eyebrow
                    sitting on the shoulder it leaves. The shape lives in
                    globals.css (.bevel), rounded at every corner. The ground
                    is the brand wash behind the product demo, clipped to the
                    bevel; only the centred card's wash moves. */}
                <div
                  className={`bevel bevel-card relative px-6 pb-6 pt-4 transition-[min-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:px-8 lg:pb-8 ${
                    on
                      ? "min-h-[22rem] lg:min-h-[28rem]"
                      : "min-h-[19rem] lg:min-h-[23rem]"
                  }`}
                >
                  <GradientWash paused={!on} offset={i * 4.3} />

                  {/* On the shoulder, and only on the centred card: the
                      neighbours are there to be peeked at, not read. */}
                  <p
                    className={`relative flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-zinc-800 transition-opacity duration-300 ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 bg-signal" />
                    {pillar.eyebrow}
                  </p>

                  <div className="relative pt-9">{pillar.visual}</div>

                  <h3 className="relative mt-7 inline-block rounded-lg bg-white px-3 py-1.5 shadow-[0_8px_20px_-12px_rgba(40,25,110,0.35)] font-display text-[22px] font-medium leading-snug tracking-[-0.02em] text-zinc-900 lg:text-[26px]">
                    {pillar.title}
                  </h3>
                </div>

                <p
                  className={`mt-5 font-body text-[15px] leading-[1.7] text-zinc-600 transition-opacity duration-300 lg:text-[16px] ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {pillar.body}
                </p>
              </article>
            );
          }),
        )}

        {/* Trailing spacer only: it lets the last card reach the centre
            without the row opening on empty space. */}
        <span
          aria-hidden="true"
          className="w-0 shrink-0 lg:w-[calc((100vw-34rem)/2-1.25rem)]"
        />
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
    </section>
  );
}
