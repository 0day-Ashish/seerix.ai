"use client";

import { useEffect, useRef } from "react";

type LightStreaksProps = {
  /** How many streaks are alive at once. Scaled down on narrow screens. */
  count?: number;
  /** Travel direction in degrees; 0 is left-to-right, positive tilts down. */
  angle?: number;
  /** Base travel speed in CSS pixels per second. */
  speed?: number;
  /** Peak opacity of the brightest streak. */
  opacity?: number;
  /** Streak body colour. */
  color?: [number, number, number];
  className?: string;
};

/** Brand grey: on a white ground the streaks read as shadow, not neon. */
const BRAND: [number, number, number] = [54, 54, 59];

type Streak = {
  /** Head position, in CSS pixels. */
  x: number;
  y: number;
  /** Trail length and thickness. */
  length: number;
  width: number;
  /** Per-streak speed multiplier and opacity, so the field has depth. */
  rate: number;
  alpha: number;
};

/**
 * A field of thin streaks drifting diagonally across the parent, each one a
 * gradient that fades from a bright head to nothing at the tail. Purely
 * decorative: it sits behind content, ignores pointer events, and does not
 * run at all under prefers-reduced-motion.
 */
export default function LightStreaks({
  count = 22,
  angle = -18,
  speed = 46,
  opacity = 0.3,
  color = BRAND,
  className = "",
}: LightStreaksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const [r, g, b] = color;
    const radians = (angle * Math.PI) / 180;
    const dirX = Math.cos(radians);
    const dirY = Math.sin(radians);

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let streaks: Streak[] = [];

    /** Places one streak, either anywhere (first fill) or off the leading edge. */
    function spawn(seeded: boolean): Streak {
      // Travel is diagonal, so the spawn band has to cover the diagonal span
      // rather than just one edge, or corners stay empty.
      const span = width + height;
      const along = seeded ? Math.random() * span : -Math.random() * 0.3 * span;
      const across = (Math.random() - 0.5) * span * 1.4;

      // Depth: slower, fainter, shorter streaks read as further away.
      const depth = Math.random();
      return {
        x: width / 2 + dirX * (along - span / 2) - dirY * across,
        y: height / 2 + dirY * (along - span / 2) + dirX * across,
        length: 90 + depth * 320,
        width: 0.7 + depth * 1.5,
        rate: 0.45 + depth * 1.1,
        alpha: (0.25 + depth * 0.75) * opacity,
      };
    }

    function resize() {
      const rect = host!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer streaks on small screens: same density, less work.
      const total = width < 640 ? Math.round(count * 0.5) : count;
      streaks = Array.from({ length: total }, () => spawn(true));
    }

    function draw(now: number) {
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      ctx!.clearRect(0, 0, width, height);

      // Default compositing: these strokes are darker than the ground, so
      // additive blending would push them toward white and erase them.
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.x += dirX * speed * s.rate * delta;
        s.y += dirY * speed * s.rate * delta;

        // Recycle once the whole trail has cleared the canvas.
        const tailX = s.x - dirX * s.length;
        const tailY = s.y - dirY * s.length;
        const margin = s.length + 40;
        if (
          Math.min(s.x, tailX) > width + margin ||
          Math.max(s.x, tailX) < -margin ||
          Math.min(s.y, tailY) > height + margin ||
          Math.max(s.y, tailY) < -margin
        ) {
          streaks[i] = spawn(false);
          continue;
        }

        const gradient = ctx!.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(
          0.12,
          `rgba(${r}, ${g}, ${b}, ${s.alpha.toFixed(3)})`,
        );
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = s.width;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(tailX, tailY);
        ctx!.stroke();
      }

      frame = requestAnimationFrame(draw);
    }

    /** Starts or stops the loop; also the reduced-motion handler. */
    function sync() {
      const shouldRun = !motion.matches;
      if (shouldRun && !frame) {
        last = 0;
        frame = requestAnimationFrame(draw);
      } else if (!shouldRun && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        ctx!.clearRect(0, 0, width, height);
      }
    }

    // Pausing off-screen keeps the loop off the main thread while scrolled away.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) sync();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "100px" },
    );

    resize();
    sync();
    visibility.observe(host);
    motion.addEventListener("change", sync);
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      visibility.disconnect();
      observer.disconnect();
      motion.removeEventListener("change", sync);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count, angle, speed, opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
