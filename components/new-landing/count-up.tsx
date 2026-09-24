"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Target value as displayed, e.g. "18,472", "4.2" or "0". */
  value: string;
  /** Seconds the count takes. */
  duration?: number;
  className?: string;
};

/**
 * Splits "18,472", "4.2" or "$39" into its numeric value, its formatting
 * shape, and any non-numeric affixes ("$", "%") that must survive the count.
 */
function parse(value: string) {
  const match = value.match(/^([^0-9.-]*)([0-9,.-]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? value;
  const suffix = match?.[3] ?? "";
  const numeric = Number(digits.replace(/,/g, ""));
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return {
    target: Number.isFinite(numeric) ? numeric : 0,
    decimals,
    grouped: digits.includes(","),
    prefix,
    suffix,
  };
}

function format(
  n: number,
  decimals: number,
  grouped: boolean,
  prefix = "",
  suffix = "",
) {
  return (
    prefix +
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouped,
    }) +
    suffix
  );
}

/**
 * Counts from zero to the target when scrolled into view.
 *
 * The server renders the final value, so the number is correct without
 * JavaScript. On mount, a number that is not yet on screen is reset to zero
 * straight away, so the reader never sees the final figure snap back to 0
 * before counting. Reduced-motion users keep the final value throughout.
 */
export function CountUp({ value, duration = 2, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { target, decimals, grouped, prefix, suffix } = parse(value);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || target === 0) return;

    const zero = format(0, decimals, grouped, prefix, suffix);
    let frame = 0;
    let started = false;

    // Off screen at mount: sit at zero until it is seen.
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) setDisplay(zero);

    const step = (start: number) => (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // Ease out so the count decelerates into its final value.
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(format(target * eased, decimals, grouped, prefix, suffix));
      if (t < 1) frame = requestAnimationFrame(step(start));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        observer.disconnect();
        setDisplay(zero);
        frame = requestAnimationFrame((now) => {
          frame = requestAnimationFrame(step(now));
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}

export default CountUp;
