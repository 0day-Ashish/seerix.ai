"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lays its children out at a fixed design width and zooms them down to fit
 * when the space is narrower, so a desktop layout shows whole on a phone,
 * like a screenshot, rather than reflowing into a different one. At or above
 * the design width it gets out of the way.
 *
 * `zoom` rather than a transform: it scales layout as well as paint, so the
 * height follows and nothing below needs compensating. Until the first
 * measurement, classes give a close guess per breakpoint so the server render
 * does not flash the unscaled layout.
 */
export default function FitWidth({
  width,
  children,
}: {
  width: number;
  children: ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setZoom(Math.min(1, entry.contentRect.width / width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={outer}>
      <div
        className={
          zoom === null
            ? "max-lg:[width:var(--fit-w)] max-sm:[zoom:0.28] sm:max-lg:[zoom:0.6]"
            : undefined
        }
        style={
          zoom === null
            ? ({ "--fit-w": `${width}px` } as React.CSSProperties)
            : zoom < 1
              ? { width, zoom }
              : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
