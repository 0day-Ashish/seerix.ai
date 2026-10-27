"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { findItem, settingsGroups } from "@/components/settings/nav";

/**
 * The settings top bar, matching the dashboard's: a breadcrumb for where you
 * are on the left, the way back on the right, and the concave corner where
 * the white panel meets the chrome.
 */
export default function SettingsHeader() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2] ?? "";
  const item = findItem(slug);
  const group = settingsGroups.find((g) => g.items.some((i) => i.slug === slug));

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-signal-ink px-5 py-3 sm:px-8 lg:px-10">
      <p className="flex min-w-0 items-center gap-2 font-body text-[13px] text-white/50">
        <span>Settings</span>
        {group && (
          <>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="hidden sm:inline">{group.label}</span>
            <span aria-hidden="true" className="hidden text-white/25 sm:inline">
              /
            </span>
          </>
        )}
        {item && (
          <span className="truncate font-medium text-white/85">
            {item.label}
          </span>
        )}
      </p>

      {/* The same raised dark control as the dashboard's site picker. */}
      <Link
        href="/app"
        className="inline-flex h-9 shrink-0 translate-y-0 items-center gap-1.5 rounded-xl border border-white/[0.14] bg-[#1b1b1d] pl-2.5 pr-3.5 font-body text-[13.5px] text-white/85 transition-all duration-150 ease-out [box-shadow:0_3px_0_0_#000,0_4px_10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:border-white/25 hover:text-white hover:[box-shadow:0_5px_0_0_#000,0_9px_16px_rgba(0,0,0,0.4)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#000,0_2px_4px_rgba(0,0,0,0.3)]"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 3.5L5.5 8l4.5 4.5" />
        </svg>
        Back to dashboard
      </Link>

      {/* The curve where the content meets the chrome; on the sticky header
          so it stays put while the panel scrolls. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-full hidden h-5 w-5 lg:block"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, transparent 0 20px, var(--color-signal-ink) 20.5px)",
        }}
      />
    </header>
  );
}
