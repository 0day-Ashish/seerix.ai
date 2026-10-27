"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { AccountRow } from "@/components/dashboard/shell";
import SeerixMark from "@/components/new-landing/seerix-mark";
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
 * The settings sidebar, in the dashboard's black: the mark, the title, the
 * four groups, and the same account row at the foot. On small screens it
 * collapses to a horizontal strip of the same links.
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
    <aside className="bg-signal-ink lg:sticky lg:top-0 lg:h-dvh lg:w-[220px] lg:shrink-0">
      <div className="flex h-full flex-col px-4 pb-3 pt-5 lg:pb-5">
        <Link href="/app" className="flex items-center gap-2 px-1">
          <SeerixMark size={24} tone="white" animated={false} />
          <span className="wordmark text-[19px] font-semibold tracking-[-0.02em] text-white">
            seerix
          </span>
        </Link>

        <h1 className="mt-6 px-2.5 font-display text-[13px] font-medium uppercase tracking-[0.08em] text-white/40 lg:mt-7">
          Settings
        </h1>

        <nav
          aria-label="Settings"
          className="mt-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          {/* One scrolling row on phones; stacked groups from lg. */}
          <div
            ref={stripRef}
            className="flex gap-0.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:block lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {settingsGroups.map((group) => (
              <div key={group.label} className="contents lg:mb-5 lg:block">
                <p className="hidden px-2.5 pb-1.5 font-body text-[12px] font-medium text-white/40 lg:block">
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
                      className={`flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-[7px] font-body text-[13.5px] transition-colors ${
                        on
                          ? "bg-white/10 font-medium text-signal-bright"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <NavIcon
                        d={item.icon}
                        className={on ? "text-signal-bright" : "text-white/40"}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        <div className="hidden lg:block">
          <AccountRow />
        </div>
      </div>
    </aside>
  );
}
