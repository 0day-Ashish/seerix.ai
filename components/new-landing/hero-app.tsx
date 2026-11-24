"use client";

import { useRef, useState } from "react";

import FitWidth from "@/components/new-landing/fit-width";
import GradientWash from "@/components/new-landing/gradient-wash";
import HeroAgent from "@/components/new-landing/hero-agent";

/** The dashboard pages the hero can show, one pill each. */
const pages = [
  { label: "Overview", href: "/app" },
  { label: "This week", href: "/app/this-week" },
  { label: "Fix list", href: "/app/fix-list" },
  { label: "Rankings", href: "/app/rankings" },
  { label: "Competitors", href: "/app/competitors" },
];

/** The window's design size: the dashboard's desktop layout, whole. */
const W = 1280;
const H = 780;

/**
 * The hero's product window: the real dashboard, not a drawing of it.
 *
 * Each pill loads that dashboard route in a frame laid out at a fixed
 * desktop width, and FitWidth zooms the window to the space. A frame
 * rather than the components themselves, because the dashboard picks its
 * layout from the viewport: rendered inline it would fold into its phone
 * layout on a phone, where the frame keeps the desktop one, shrunk like a
 * screenshot. It also means the hero can never drift from the product.
 *
 * Looked at, not used: the frame takes no pointer or keyboard input, so it
 * never captures the page's scroll and is skipped by assistive tech.
 */
export default function HeroApp() {
  const [active, setActive] = useState(0);
  // Pages opened so far stay mounted, so going back is instant. `shown` is
  // the page on screen: it only moves to the new one once that has loaded,
  // so the window never flashes blank between pages.
  const [opened, setOpened] = useState<number[]>([0]);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [shown, setShown] = useState(0);
  const page = pages[active];
  // The tab asked for most recently, read when a frame finishes loading.
  const wanted = useRef(0);

  const open = (i: number) => {
    wanted.current = i;
    setActive(i);
    setOpened((o) => (o.includes(i) ? o : [...o, i]));
    if (loaded.includes(i)) setShown(i);
  };
  const onLoad = (i: number) => {
    setLoaded((l) => (l.includes(i) ? l : [...l, i]));
    // Let the page paint its first frame before it fades in.
    setTimeout(() => {
      if (wanted.current === i) setShown(i);
    }, 250);
  };

  return (
    <div className="relative overflow-hidden">
      {/* The band's ground: the brand wash. */}
      <GradientWash />
      {/* The band fades to white toward its foot, window and wash alike;
          the agent sits above the fade, so it stays sharp. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[55%] bg-gradient-to-b from-white/0 via-white/80 to-white"
      />

      <div className="relative">
        <div
          role="tablist"
          aria-label="Dashboard pages"
          className="flex gap-2 overflow-x-auto px-4 pt-5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((p, i) => (
            <button
              key={p.href}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => open(i)}
              className={`h-[38px] shrink-0 rounded-full border px-4 font-body text-[14px] transition-colors ${
                i === active
                  ? "border-transparent bg-signal-ink text-white"
                  : "border-black/[0.08] bg-white/80 text-zinc-800 backdrop-blur-sm hover:bg-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
          <FitWidth width={W}>
            <div className="relative">
            <div className="overflow-hidden rounded-[14px] border border-black/[0.08] bg-[#f4f4f6] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]">
              {/* Title bar: the window controls and the address. */}
              <div className="relative flex h-[42px] items-center border-b border-black/[0.06] bg-white px-4">
                <span className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 rounded-md bg-black/[0.04] px-16 py-1 font-mono text-[12px] text-zinc-500">
                  app.seerix.ai{page.href.replace(/^\/app/, "")}
                </span>
              </div>

              <div className="relative" style={{ height: H }}>
                {opened.map((i) => (
                  <iframe
                    key={pages[i].href}
                    src={pages[i].href}
                    title={`Seerix dashboard: ${pages[i].label}`}
                    aria-hidden="true"
                    tabIndex={-1}
                    loading={i === 0 ? "lazy" : undefined}
                    width={W}
                    height={H}
                    onLoad={() => onLoad(i)}
                    className={`pointer-events-none absolute inset-0 block h-full w-full border-0 transition-[opacity,transform] duration-500 ease-out ${
                      i === shown
                        ? "z-10 translate-y-0 opacity-100"
                        : "z-0 translate-y-1.5 opacity-0"
                    }`}
                  />
                ))}
                {/* A soft pulse on the bar while a page is still loading. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 z-20 h-0.5 origin-left bg-signal/60 transition-opacity duration-300 ${
                    active !== shown ? "animate-pulse opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>
            {/* The agent, working over the dashboard's corner. */}
            <div className="pointer-events-none absolute bottom-8 right-6 z-30 h-[460px] w-[470px] [animation:seerix-agent-in_0.7s_cubic-bezier(0.2,0.8,0.2,1)_0.6s_both]">
              <HeroAgent />
            </div>
            </div>
          </FitWidth>
        </div>
      </div>
    </div>
  );
}
