"use client";

import { useEffect, useState } from "react";

import Button, {
  ButtonLabel,
  Glow,
  buttonClass,
} from "@/components/new-landing/button";
import WaitlistForm from "@/components/new-landing/waitlist-form";

/** The sources every answer is cited from, cycled after the subhead. */
const sources = [
  "Search Console",
  "SERP snapshots",
  "your crawl",
  "ranking history",
];

/**
 * The subhead's last words, fading from one source to the next. The width
 * is held at the longest so the line does not jump as they change.
 */
export function SourceCycle() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setShown(false);
      swap = setTimeout(() => {
        setI((v) => (v + 1) % sources.length);
        setShown(true);
      }, 300);
    }, 2400);
    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, []);

  return (
    <span className="relative inline-grid text-left">
      {/* Invisible longest entry: reserves the width. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        ranking history
      </span>
      <span
        aria-live="polite"
        className={`col-start-1 row-start-1 text-signal-deep transition-opacity duration-300 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      >
        {sources[i]}
      </span>
    </span>
  );
}

/**
 * The hero's two actions. "Join waitlist" opens the waitlist form in their
 * place, so the hero keeps the one sign-up the page has.
 */
export default function HeroActions() {
  const [joining, setJoining] = useState(false);

  if (joining)
    return (
      <div className="mx-auto w-full max-w-md text-left">
        <WaitlistForm />
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      <Button href="/contact" variant="secondary" className="w-56 sm:w-auto">
        Book a demo
      </Button>
      <button
        type="button"
        onClick={() => setJoining(true)}
        className={`${buttonClass("primary")} w-56 sm:w-auto`}
      >
        <Glow variant="primary" />
        <ButtonLabel>Join waitlist</ButtonLabel>
      </button>
    </div>
  );
}
