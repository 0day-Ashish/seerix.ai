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
 * Counts from zero to the target when scrolled into view. Renders the final
 * value on the server and for reduced-motion users, so the number is always
 * correct even if the animation never runs.
 */
export function CountUp({ value, duration = 1.6, className = "" }: CountUpProps) {
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

    let frame = 0;
    let start = 0;
    let done = false;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / (duration * 1000), 1);
      // Ease out so the count decelerates into its final value.
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(format(target * eased, decimals, grouped, prefix, suffix));
      if (t < 1) frame = requestAnimationFrame(step);
      else done = true;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done && !frame) {
            setDisplay(format(0, decimals, grouped, prefix, suffix));
            frame = requestAnimationFrame(step);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

export default CountUp;
