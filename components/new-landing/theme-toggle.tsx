"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "seerix-theme";

/** Resolves "system" against the OS setting; light and dark pass through. */
function resolve(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Mirrors the inline script in the document head, which runs before paint. */
function apply(theme: Theme) {
  const root = document.documentElement;
  const resolved = resolve(theme);
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="8" cy="8" r="3.25" />
        <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11L3.05 3.05" />
      </>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: <path d="M13.5 9.2A5.8 5.8 0 1 1 6.8 2.5a4.6 4.6 0 0 0 6.7 6.7z" />,
  },
  {
    value: "system",
    label: "System",
    icon: (
      <>
        <rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.25" />
        <path d="M5.5 14h5" />
      </>
    ),
  },
];

function readStored(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Private mode and blocked site data both throw; "system" is a safe base.
  }
  return "system";
}

/** True only after hydration, without setting state inside an effect. */
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeToggle() {
  // Read lazily rather than in an effect: this runs once on the client, so the
  // stored choice is present from the first client render.
  const [theme, setTheme] = useState<Theme>(readStored);

  // The server renders no selection (it cannot know the stored value), so the
  // pip is withheld until after hydration to keep the two passes identical.
  const mounted = useHydrated();

  // Only "system" tracks the OS, so the listener is scoped to that choice.
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  function select(next: Theme) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-0.5"
    >
      {options.map((option) => {
        const active = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => select(option.value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
              active
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <svg
              className="h-[15px] w-[15px]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
