"use client";

import { useEffect, useRef } from "react";

type PixelHoverProps = {
  /** Square pixel size in CSS pixels. */
  cell?: number;
  /** Gap between pixels. */
  gap?: number;
  color?: [number, number, number];
  className?: string;
};

const BRAND: [number, number, number] = [54, 54, 59];

/** Deterministic per-cell pseudo-random in [0,1). */
function rand(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * A grid of brand-grey pixels that flows across the parent while hovered.
 * The loop only runs during hover, so idle cells cost nothing; on leave the
 * grid fades back out rather than cutting.
 */
export function PixelHover({
  cell = 6,
  gap = 2,
  color = BRAND,
  className = "",
}: PixelHoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pitch = cell + gap;
    const [r, g, bl] = color;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let frame = 0;
    let start = 0;
    // Eases in on enter and out on leave so the grid never pops.
    let strength = 0;
    let target = 0;

    function resize() {
      const rect = host!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / pitch);
      rows = Math.ceil(height / pitch);
    }

    function draw(now: number) {
      if (!start) start = now;
      const t = (now - start) / 1000;
      strength += (target - strength) * 0.12;

      ctx!.clearRect(0, 0, width, height);

      if (strength > 0.002) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            // A diagonal wave sweeps through the grid; the per-cell hash
            // scatters it so the flow reads as pixels, not a clean band.
            const wave = Math.sin((col + row) * 0.55 - t * 3.2) * 0.5 + 0.5;
            const noise = rand(col, row, 7);
            const lit = wave * 0.75 + noise * 0.25;
            if (lit < 0.55) continue;
            const alpha = (lit - 0.55) * 1.6 * strength;
            ctx!.fillStyle = `rgba(${r}, ${g}, ${bl}, ${alpha.toFixed(3)})`;
            ctx!.fillRect(col * pitch, row * pitch, cell, cell);
          }
        }
      }

      if (strength > 0.002 || target > 0) {
        frame = requestAnimationFrame(draw);
      } else {
        frame = 0;
        ctx!.clearRect(0, 0, width, height);
      }
    }

    function run() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    const onEnter = () => {
      if (reduced) return;
      target = 1;
      run();
    };
    const onLeave = () => {
      target = 0;
      run();
    };

    resize();
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cell, gap, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

export default PixelHover;
