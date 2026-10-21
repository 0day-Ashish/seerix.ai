"use client";

import { useEffect, useRef, useState } from "react";

import {
  PRESET_GROUPS,
  presetLabel,
  presetRange,
  rangeText,
  type Grain,
  type Preset,
} from "@/components/dashboard/range";

const GRAINS: { key: Grain; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
];

/**
 * The date range button and its menu: Day / Week / Month at the top, then
 * the presets in four groups, up to the sixteen months Google keeps.
 */
export default function RangePicker({
  preset,
  grain,
  onPreset,
  onGrain,
}: {
  preset: Preset;
  grain: Grain;
  onPreset: (p: Preset) => void;
  onGrain: (g: Grain) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 items-center gap-2.5 rounded-lg border border-zinc-200 bg-white pl-3 pr-2.5 font-body text-[13px] text-zinc-800 hover:bg-zinc-50"
      >
        <svg
          className="h-4 w-4 text-zinc-400"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3" />
        </svg>
        <span className="font-medium">{presetLabel(preset)}</span>
        <span className="hidden text-zinc-500 sm:inline">
          {rangeText(presetRange(preset))}
        </span>
        <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11.5px] text-zinc-600">
          by {grain}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-2 w-64 rounded-xl sm:left-auto sm:right-0 border border-zinc-200 bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)]"
        >
          <div className="flex rounded-lg bg-zinc-100 p-0.5">
            {GRAINS.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => onGrain(g.key)}
                className={`h-8 flex-1 rounded-md font-body text-[13px] transition-colors ${
                  g.key === grain
                    ? "bg-white font-medium text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {PRESET_GROUPS.map((group, i) => (
            <div
              key={i}
              className="mt-1.5 border-t border-zinc-100 pt-1.5 first:border-t-0"
            >
              {group.map((p) => {
                const on = p.key === preset;
                return (
                  <button
                    key={p.key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    onClick={() => {
                      onPreset(p.key);
                      setOpen(false);
                    }}
                    className={`block w-full rounded-lg px-2.5 py-1.5 text-left font-body text-[13.5px] transition-colors hover:bg-zinc-100 ${
                      on ? "bg-signal-soft" : ""
                    }`}
                  >
                    <span
                      className={
                        on ? "font-semibold text-signal" : "text-zinc-800"
                      }
                    >
                      {p.label}
                    </span>
                    {on && (
                      <span className="block text-[12px] text-zinc-500">
                        {rangeText(presetRange(p.key))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
