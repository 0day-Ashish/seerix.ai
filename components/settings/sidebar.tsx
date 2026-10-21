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
    <aside className="lg:sticky lg:top-0 lg:h-dvh lg:w-[260px] lg:shrink-0 lg:overflow-y-auto">
      <div className="px-4 pb-3 pt-5 lg:pb-10">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[13.5px] text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900"
        >
          <NavIcon d="M10 3.5L5.5 8l4.5 4.5" />
          Back to dashboard
        </Link>

        <h1 className="mt-3 px-3 font-body text-[22px] font-medium tracking-[-0.02em] text-zinc-900">
          Settings
        </h1>

        <nav aria-label="Settings" className="mt-4 lg:mt-6">
          {/* One scrolling row on phones; stacked groups from lg. */}
          <div
            ref={stripRef}
            className="flex gap-0.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:block lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {settingsGroups.map((group) => (
              <div key={group.label} className="contents lg:mb-5 lg:block">
                <p className="hidden px-3.5 pb-1 font-body text-[12.5px] text-zinc-500 lg:block">
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
                      className={`flex shrink-0 items-center gap-3 rounded-full px-3.5 py-2 font-body text-[14px] transition-colors ${
                        on
                          ? "bg-white text-zinc-900 shadow-[0_0_0_1px_rgba(24,24,27,0.08),0_1px_2px_rgba(24,24,27,0.05)]"
                          : "text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
                      }`}
                    >
                      <NavIcon
                        d={item.icon}
                        className={on ? "text-signal" : "text-zinc-500"}
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
