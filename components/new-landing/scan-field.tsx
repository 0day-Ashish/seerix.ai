"use client";

import { useEffect, useRef } from "react";

type ScanFieldProps = {
  /** Ink cells on a light ground, or white cells on a dark one. */
  tone?: "light" | "dark";
  /** Pitch of the grid in CSS px. Each cell's square is drawn inside it. */
  cell?: number;
  /** Peak opacity of the grey cells, 0-1. */
  strength?: number;
  /** How many cells the scan can flag per pass across the field. */
  findings?: number;
  /** Seconds for the scan band to cross the field once. */
  sweep?: number;
  /** Draw the thin orange line at the front of the band. */
  scanLine?: boolean;
  className?: string;
};

/* -------------------------------------------------------------------------
 * Value noise: cheap, smooth, deterministic. Enough for a field that drifts.
 * ---------------------------------------------------------------------- */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  const u = smooth(xf);
  const v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * The Seerix scan field: the site's signature pattern.
 *
 * A grid of square cells, each sized by a slowly drifting value -- a halftone
 * of data. A vertical band sweeps across it; where the band passes a hot cell
 * that cell lights in signal orange, holds, and fades. It is the product in
 * one motion: the data, the scan through it, the finding it flags.
 *
 * Drawn on a 2D canvas, paused when off screen or in a hidden tab, and a single
 * still frame for reduced-motion users.
 */
export default function ScanField({
  tone = "light",
  cell = 14,
  strength = 0.16,
  findings = 4,
  sweep = 9,
  scanLine = true,
  className = "",
}: ScanFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cv = canvas;
    const g = ctx;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ink = tone === "light" ? "28,28,33" : "255,255,255";
    const signal = "255,90,31";

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    // Per pass: the cells the scan will flag, and when each was lit.
    let hot: { c: number; r: number; lit: number }[] = [];
    let pass = -1;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
    }

    /** Pick this pass's findings among the cells the field already rates high. */
    function choose(seed: number, t: number) {
      const picks: { c: number; r: number; lit: number }[] = [];
      let tries = 0;
      while (picks.length < findings && tries < 400) {
        tries++;
        const c = Math.floor(hash(seed, tries) * cols);
        const r = Math.floor(hash(tries, seed + 7) * rows);
        if (value(c, r, t) > 0.55) picks.push({ c, r, lit: -1 });
      }
      return picks;
    }

    function value(c: number, r: number, t: number) {
      return noise(c * 0.11 + t * 0.04, r * 0.11 - t * 0.03) * 0.75 +
        noise(c * 0.37, r * 0.37 + t * 0.08) * 0.25;
    }

    function draw(time: number) {
      const t = time / 1000;
      g.clearRect(0, 0, w, h);

      // Where the band is, as a column position; it runs past both edges.
      const span = cols + 16;
      const progress = (t / sweep) % 1;
      const scan = progress * span - 8;
      const thisPass = Math.floor(t / sweep);
      if (thisPass !== pass) {
        pass = thisPass;
        hot = choose(thisPass + 1, t);
      }

      const max = cell * 0.62;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = value(c, r, t);
          // Cells inside the band read brighter, falling off either side.
          const d = Math.abs(c - scan);
          const band = d < 6 ? 1 - d / 6 : 0;
          const size = Math.max(1, max * (0.25 + v * 0.75));
          const a = strength * (0.35 + v * 0.65) + band * strength * 1.4;
          g.fillStyle = `rgba(${ink},${Math.min(a, 1)})`;
          const o = (cell - size) / 2;
          g.fillRect(c * cell + o, r * cell + o, size, size);
        }
      }

      // Findings: lit as the band reaches them, then held and faded.
      for (const f of hot) {
        if (f.lit < 0 && scan >= f.c) f.lit = t;
        if (f.lit < 0) continue;
        const age = t - f.lit;
        const life = sweep * 0.8;
        if (age > life) continue;
        const fade = age < 0.25 ? age / 0.25 : 1 - Math.max(0, (age - life * 0.6) / (life * 0.4));
        g.fillStyle = `rgba(${signal},${0.95 * fade})`;
        g.fillRect(f.c * cell + 1, f.r * cell + 1, cell - 2, cell - 2);
        // A thin bracket marks the finding.
        g.strokeStyle = `rgba(${signal},${0.6 * fade})`;
        g.lineWidth = 1;
        g.strokeRect(f.c * cell - 3.5, f.r * cell - 3.5, cell + 7, cell + 7);
      }

      // The scan line itself.
      const x = scan * cell;
      if (scanLine && x > -cell && x < w + cell) {
        g.fillStyle = `rgba(${signal},0.55)`;
        g.fillRect(x, 0, 1.5, h);
      }
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(sweep * 1000 * 0.62);
    });
    ro.observe(cv);

    if (reduced) {
      draw(sweep * 1000 * 0.62);
      return () => ro.disconnect();
    }

    let visible = true;
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    io.observe(cv);

    let frame = 0;
    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      draw(time);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [tone, cell, strength, findings, sweep, scanLine]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
