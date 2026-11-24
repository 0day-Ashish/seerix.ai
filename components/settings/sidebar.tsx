"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
 * four groups, and the same account row at the foot. Below lg it is a drawer
 * from the left, as the dashboard's is, opened from the top bar; the shell
 * owns whether it is open.
 */
export default function SettingsSidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      id="settings-drawer"
      className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-[#f4f4f6] transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-[220px] lg:max-w-none lg:shrink-0 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto px-4 pb-5 pt-5 lg:overflow-visible">
        <div className="flex items-center justify-between gap-2">
          <Link href="/app" className="flex items-center gap-2 px-1">
            <SeerixMark size={24} animated={false} />
            <span className="wordmark text-[19px] font-semibold tracking-[-0.02em] text-zinc-900">
              seerix
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-black/[0.04] hover:text-zinc-900 lg:hidden"
          >
            <NavIcon d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
          </button>
        </div>

        <h1 className="mt-6 px-2.5 font-display text-[13px] font-medium uppercase tracking-[0.08em] text-zinc-400 lg:mt-7">
          Settings
        </h1>

        <nav
          aria-label="Settings"
          className="mt-3 flex-1 lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          {/* One scrolling row on phones; stacked groups from lg. */}
          <div
            className="flex flex-col gap-0.5"
          >
            {settingsGroups.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="px-2.5 pb-1.5 font-body text-[12px] font-medium text-zinc-400">
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
                          ? "bg-signal-soft font-medium text-signal-deep ring-1 ring-inset ring-signal-bright/60"
                          : "text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-900"
                      }`}
                    >
                      <NavIcon
                        d={item.icon}
                        className={on ? "text-signal-deep" : "text-zinc-400"}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-auto">
          <AccountRow />
        </div>
      </div>
    </aside>
  );
}
