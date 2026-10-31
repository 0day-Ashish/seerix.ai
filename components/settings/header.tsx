"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ButtonLabel,
  Glow,
  buttonClass,
} from "@/components/new-landing/button";
import { findItem, settingsGroups } from "@/components/settings/nav";

/**
 * The settings top bar, matching the dashboard's: a breadcrumb for where you
 * are on the left, the way back on the right, and the concave corner where
 * the white panel meets the chrome.
 */
export default function SettingsHeader({
  open = false,
  onOpen,
}: {
  open?: boolean;
  onOpen?: () => void;
}) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2] ?? "";
  const item = findItem(slug);
  const group = settingsGroups.find((g) => g.items.some((i) => i.slug === slug));

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-signal-ink px-4 py-3 sm:px-8 lg:px-10">
      {/* Below lg: the drawer's button, in place of the sidebar. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="settings-drawer"
        className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
        </svg>
      </button>
      <p className="mr-auto flex min-w-0 items-center gap-2 font-body text-[13px] text-white/50">
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

      {/* The site's glow button, light on the black bar. */}
      <Link href="/app" className={buttonClass("secondary", "app")}>
        <Glow variant="secondary" />
        <ButtonLabel>
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
        </ButtonLabel>
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
