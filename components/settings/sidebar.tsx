"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { settingsGroups } from "@/components/settings/nav";

export function NavIcon({
  d,
  className = "",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/**
 * The settings sidebar: the title, then the four groups.
 * On small screens it collapses to a horizontal strip of the same links.
 */
export default function SettingsSidebar() {
  const pathname = usePathname();
  const stripRef = useRef<HTMLDivElement>(null);

  // On phones the nav is one scrolling strip; bring the current page into it.
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>("[aria-current=page]");
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollLeft =
      active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
  }, [pathname]);

  return (
    <aside className="border-b border-black/[0.08] bg-[#f5f4f2] lg:sticky lg:top-0 lg:h-dvh lg:w-[264px] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="px-4 pb-4 pt-5 lg:px-5 lg:pb-10 lg:pt-6">

        <h1 className="px-1 font-display text-[22px] font-medium tracking-[-0.02em] text-black">
          Settings
        </h1>

        <nav aria-label="Settings" className="mt-4 lg:mt-6">
          {/* One scrolling row on phones; stacked groups from lg. */}
          <div
            ref={stripRef}
            className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] lg:block lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {settingsGroups.map((group) => (
              <div key={group.label} className="contents lg:mb-7 lg:block">
                <p className="hidden px-2.5 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400 lg:block">
                  {group.label}
                </p>
                {group.items.map((item) => {
                  const href = `/settings/${item.slug}`;
                  const on = pathname === href;
                  return (
                    <Link
                      key={item.slug}
                      href={href}
                      aria-current={on ? "page" : undefined}
                      className={`flex shrink-0 items-center gap-2.5 px-2.5 py-1.5 font-body text-[13.5px] transition-colors lg:py-2 ${
                        on
                          ? "bg-black/[0.06] text-black"
                          : "text-zinc-600 hover:bg-black/[0.03] hover:text-black"
                      }`}
                    >
                      <NavIcon
                        d={item.icon}
                        className={on ? "text-signal-deep" : "text-zinc-500"}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
