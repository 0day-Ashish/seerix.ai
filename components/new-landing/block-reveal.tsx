"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type BlockRevealProps = {
  children: string;
  /** Colour of the sweeping block. */
  color?: string;
  /** Seconds for one line's block to sweep across and clear. */
  duration?: number;
  /** Seconds between each line starting. */
  stagger?: number;
  className?: string;
};

/**
 * Sweeps a solid block across each line of a heading in turn, uncovering the
 * text in its wake. Lines are measured after layout so the split follows the
 * real wrap points rather than a guess.
 */
export function BlockReveal({
  children,
  color = "#36363B",
  duration = 1.15,
  stagger = 0.22,
  className = "",
}: BlockRevealProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Split into words, then group them into visual lines by their offsetTop.
    const words = children.split(" ");
    root.textContent = "";
    const spans = words.map((word, index) => {
      const span = document.createElement("span");
      span.textContent = index === words.length - 1 ? word : `${word} `;
      span.style.display = "inline-block";
      span.style.whiteSpace = "pre";
      root.appendChild(span);
      return span;
    });

    // Group by vertical position, then wrap each line in its own relative box.
    const lines = new Map<number, HTMLSpanElement[]>();
    for (const span of spans) {
      const top = Math.round(span.offsetTop);
      const bucket = lines.get(top);
      if (bucket) bucket.push(span);
      else lines.set(top, [span]);
    }

    root.textContent = "";
    const blocks: HTMLSpanElement[] = [];
    const texts: HTMLSpanElement[] = [];

    for (const lineSpans of lines.values()) {
      const line = document.createElement("span");
      line.style.position = "relative";
      line.style.display = "block";
      line.style.overflow = "hidden";

      const text = document.createElement("span");
      text.style.display = "inline-block";
      for (const span of lineSpans) text.appendChild(span);

      const block = document.createElement("span");
      block.setAttribute("aria-hidden", "true");
      block.style.position = "absolute";
      block.style.inset = "0";
      block.style.backgroundColor = color;
      block.style.transform = "scaleX(0)";
      block.style.pointerEvents = "none";

      line.appendChild(text);
      line.appendChild(block);
      root.appendChild(line);
      blocks.push(block);
      texts.push(text);
    }

    if (reduced) {
      gsap.set(texts, { autoAlpha: 1 });
      gsap.set(blocks, { scaleX: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(texts, { autoAlpha: 0 });
      gsap.set(blocks, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
      });

      // Each line: block sweeps in, text switches on under cover, block exits.
      blocks.forEach((block, index) => {
        const at = index * stagger;
        tl.to(block, { scaleX: 1, duration: duration / 2 }, at)
          .set(texts[index], { autoAlpha: 1 }, at + duration / 2)
          .to(
            block,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: duration / 2,
            },
            at + duration / 2,
          );
      });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top 90%",
        once: true,
        onEnter: () => tl.play(0),
      });

      // The heading may already be in view on load.
      if (trigger.isActive) tl.play(0);

      return () => trigger.kill();
    }, root);

    return () => ctx.revert();
  }, [children, color, duration, stagger]);

  return (
    <span ref={rootRef} className={`block ${className}`}>
      {children}
    </span>
  );
}

export default BlockReveal;
