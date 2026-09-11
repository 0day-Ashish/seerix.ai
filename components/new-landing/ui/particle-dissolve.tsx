"use client";

import { useEffect, useRef } from "react";

type ParticleDissolveProps = {
  /** Height of the dissolve band in CSS pixels. */
  height?: number;
  /** Particle grid pitch in CSS pixels. Smaller = finer stipple. */
  pitch?: number;
  /** Solid fill below the dissolve. */
  baseColor?: string;
  className?: string;
};

/** Accent tones scattered through the dissolve, keyed off the brand greys. */
const ACCENTS: Array<[number, number, number]> = [
  [136, 128, 132], // genji grey
  [220, 221, 221], // white grey
  [160, 154, 158], // lifted genji
  [90, 88, 94], // amakusa midtone
];

/** Deterministic per-cell pseudo-random in [0,1). */
function rand(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** Low-frequency value noise, used to make the dissolve edge wander. */
function edgeNoise(x: number, seed: number) {
  const xi = Math.floor(x);
  const xf = smooth(x - xi);
  const a = rand(xi, 0, seed);
  const b = rand(xi + 1, 0, seed);
  return a + (b - a) * xf;
}

/**
 * A dark band whose top edge dissolves upward into the page background as a
 * field of scattered particles, thinning with height. Static by design, it
 * renders once per size change rather than animating.
 */
export function ParticleDissolve({
  height = 260,
  pitch = 3,
  baseColor = "#36363B",
  className = "",
}: ParticleDissolveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas = el;
    const ctx = context;

    function draw() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const columns = Math.ceil(w / pitch);
      const rows = Math.ceil(h / pitch);

      for (let col = 0; col < columns; col++) {
        // Wandering edge: where the solid fill starts for this column.
        const wobble =
          edgeNoise(col * pitch * 0.0018, 11) * 0.7 +
          edgeNoise(col * pitch * 0.006, 23) * 0.3;
        const solidAt = h * (0.72 + (wobble - 0.5) * 0.12);

        for (let row = 0; row < rows; row++) {
          const y = row * pitch;

          if (y >= solidAt) {
            ctx.fillStyle = baseColor;
            ctx.fillRect(col * pitch, y, pitch, pitch);
            continue;
          }

          // Above the edge, probability of a particle falls off with distance,
          // so the band shreds into sparse dots as it rises.
          const d = (solidAt - y) / (h * 0.72);
          const density = Math.pow(Math.max(0, 1 - d), 1.7);
          const r = rand(col, row, 3);
          if (r > density) continue;

          // Near the solid edge, particles converge on the base color.
          const nearEdge = Math.pow(Math.max(0, 1 - d * 2.2), 2);

          // A minority of particles take an accent hue; the rest match the base.
          const pick = rand(col, row, 91);
          if (pick > 0.78) {
            const accent = ACCENTS[Math.floor(rand(col, row, 57) * ACCENTS.length)];
            const alpha = (0.35 + rand(col, row, 13) * 0.5) * (1 - nearEdge * 0.5);
            ctx.fillStyle = `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${alpha.toFixed(2)})`;
          } else {
            const alpha = Math.min(1, 0.3 + rand(col, row, 41) * 0.65 + nearEdge * 0.5);
            ctx.fillStyle = `rgba(54, 54, 59, ${alpha.toFixed(2)})`;
          }
          ctx.fillRect(col * pitch, y, pitch, pitch);
        }
      }
    }

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [pitch, baseColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height }}
      className={`block w-full ${className}`}
      aria-hidden="true"
    />
  );
}
