"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Smooth scrolling for the whole document.
 *
 * Lenis takes over the scroll position, so anything that reads it has to be
 * driven from the same loop. Three components animate on ScrollTrigger
 * (block-reveal, trust, StrokeText), and left alone they would keep measuring
 * the native scroll and fire at the wrong point -- so ScrollTrigger is told to
 * update on every Lenis frame, and Lenis is driven by GSAP's ticker rather
 * than its own rAF, which keeps both on one clock.
 *
 * Off in the app (dashboard, gap tools, settings): Lenis catches the wheel
 * for the whole page, so panels that scroll on their own -- the chat, wide
 * tables, menus -- would stop scrolling.
 *
 * Renders nothing; it exists for the effect.
 */
const APP_ROUTES = /^\/(app|gap|settings)(\/|$)/;

export default function SmoothScroll() {
  const pathname = usePathname();
  const inApp = APP_ROUTES.test(pathname);

  useEffect(() => {
    if (inApp) return;

    // Respect a stated preference for less motion: smoothing a scroll is
    // exactly the kind of motion that setting is asking us not to add.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      // Anchor clicks and the browser's own scrolling stay instant; only
      // wheel and touch are smoothed.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // GSAP's ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    // The ticker's own smoothing fights Lenis's easing, so it is turned off.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [inApp]);

  return null;
}
