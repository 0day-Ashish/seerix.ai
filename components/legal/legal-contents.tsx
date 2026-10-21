"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LegalContentsProps = {
  /** Section slugs and headings, in document order. */
  items: { slug: string; heading: string }[];
};

/**
 * The contents rail, with the entry for the section being read marked out.
 *
 * Tracking is done with an IntersectionObserver over a band just under the
 * navbar rather than on scroll position: it costs nothing per frame, and the
 * active entry changes when a heading actually crosses into reading position.
 */
export default function LegalContents({ items }: LegalContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.slug))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    // Order is needed to resolve which of several visible sections wins.
    const order = new Map(items.map((item, index) => [item.slug, index]));
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        if (visible.size > 0) {
          // Topmost visible section is the one being read.
          const topmost = [...visible].sort(
            (a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0),
          )[0];
          setActiveSlug(topmost);
          return;
        }

        // Nothing in the band: between sections, or past the last one. Keep
        // the last section that started above the band rather than clearing,
        // so the rail never goes blank mid-document.
        const passed = sections.filter(
          (section) => section.getBoundingClientRect().top < 160,
        );
        if (passed.length > 0) {
          setActiveSlug(passed[passed.length - 1].id);
        }
      },
      {
        // A band from just under the navbar to a little above the fold, so a
        // heading becomes active as it reaches reading position.
        rootMargin: "-112px 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <h2 className="font-body text-[13px] font-medium tracking-[0.02em] text-zinc-400">
        On this page
      </h2>

      {/* The entry being read sits on a soft indigo pill. */}
      <ul className="mt-4 flex flex-col gap-0.5">
        {items.map((item) => {
          const active = item.slug === activeSlug;

          return (
            <li key={item.slug}>
              <Link
                href={`#${item.slug}`}
                aria-current={active ? "location" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-body text-[14px] leading-snug transition-colors duration-200 ${
                  active
                    ? "bg-signal-soft font-medium text-signal-deep"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-black"
                }`}
              >
                {item.heading}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
