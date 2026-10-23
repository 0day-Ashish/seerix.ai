"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

import { account, fixList, sites } from "@/components/dashboard/data";
import {
  deleteThread,
  useThreads,
  when,
} from "@/components/dashboard/chat-history";
import SeerixMark from "@/components/new-landing/seerix-mark";

/** The ten tabs of the staging dashboard, in its order. */
const nav = [
  { href: "/app", label: "Overview", d: "M2 13.5h12M4 11V8M8 11V3.5M12 11V6" },
  {
    href: "/app/this-week",
    label: "This week",
    d: "M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3",
  },
  { href: "/app/chat", label: "Chat", d: "M2.5 3h11v8H7.5L4.5 13.5V11h-2z" },
  {
    href: "/app/fix-list",
    label: "Fix list",
    d: "M6.5 4h7M6.5 8h7M6.5 12h7M2.5 4l1 1 1.5-2M2.5 8l1 1 1.5-2M2.5 12l1 1 1.5-2",
    count: fixList.do_now.length,
  },
  {
    href: "/app/rankings",
    label: "Rankings",
    d: "M2 12l4-4 3 3 5-6M10.5 5H14v3.5",
  },
  {
    href: "/gap/keywords",
    label: "Keywords",
    d: "M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.5 10.5l3 3",
  },
  {
    href: "/app/backlinks",
    label: "Backlinks",
    d: "M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1",
  },
  {
    href: "/app/competitors",
    label: "Competitors",
    d: "M6 7a2.25 2.25 0 1 0 0-4.5A2.25 2.25 0 0 0 6 7zM1.75 13.5c0-2.3 1.9-4 4.25-4s4.25 1.7 4.25 4M11 2.6a2.2 2.2 0 0 1 0 4.3M12.2 9.7c1.2.5 2 1.8 2 3.8",
  },
  { href: "/app/health", label: "Health", d: "M1.5 8h3l1.5-4 3 8 1.5-4h4" },
  {
    href: "/settings/profile",
    label: "Settings",
    // A gear, drawn on a 24px grid.
    vb: 24,
    d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
];

/** A 16px icon; `vb` for one drawn on a larger grid, scaled to match. */
function NavIcon({ d, vb = 16 }: { d: string; vb?: number }) {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox={`0 0 ${vb} ${vb}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={(1.3 * vb) / 16}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/**
 * Recent chats, under the tabs: newest first, the open one highlighted, a
 * new-chat button, and a delete on hover. Desktop sidebar only.
 */
/**
 * The account row at the foot of the sidebar, under Settings.
 *
 * Opens a small menu carrying the account's own actions: the profile page and
 * signing out. Sign out used to sit in the top bar beside the site switcher,
 * which put an account action in the row about the site; it belongs here with
 * the person it signs out.
 */
function AccountRow({ slim }: { slim: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on a click outside or on Escape, the two ways a menu is dismissed.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative mt-1 border-t border-white/10 pt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={slim ? account.full_name : undefined}
        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/10 ${
          slim ? "lg:justify-center lg:px-0" : ""
        }`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal-bright font-body text-[11.5px] font-medium text-signal-ink">
          {account.initials}
        </span>
        <span className={`min-w-0 flex-1 ${slim ? "lg:hidden" : ""}`}>
          <span className="block truncate font-body text-[13.5px] font-medium text-white">
            {account.full_name}
          </span>
          <span className="block truncate font-body text-[12px] text-white/50">
            {account.email}
          </span>
        </span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-white/40 ${slim ? "lg:hidden" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 10l3 3 3-3M5 6l3-3 3 3" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-1 w-full min-w-[200px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)]"
        >
          <Link
            href="/settings/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 font-body text-[13.5px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
          >
            Profile and account
          </Link>
          <Link
            href="/settings/billing"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 font-body text-[13.5px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
          >
            Plan and billing
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
            className="block w-full border-t border-zinc-100 px-3 py-2 text-left font-body text-[13.5px] text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function RecentChats() {
  const { threads, active } = useThreads();
  const pathname = usePathname();
  return (
    <div className="mt-4 hidden min-h-0 flex-1 flex-col border-t border-white/10 pt-4 lg:flex">
      <div className="flex items-center justify-between px-2.5 pb-1.5">
        <p className="font-body text-[12px] font-medium text-white/40">
          Recent chats
        </p>
        <Link
          href="/app/chat"
          title="New chat"
          aria-label="New chat"
          className="flex h-6 w-6 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          <NavIcon d="M8 3.5v9M3.5 8h9" />
        </Link>
      </div>
      {threads.length === 0 ? (
        <p className="px-2.5 font-body text-[12.5px] text-white/40">
          Your chats will show up here.
        </p>
      ) : (
        <ul className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 [scrollbar-width:thin]">
          {threads.map((t) => {
            const on = pathname === "/app/chat" && t.id === active;
            return (
              <li key={t.id} className="group relative">
                <Link
                  href={`/app/chat?t=${t.id}`}
                  title={t.title}
                  aria-current={on ? "page" : undefined}
                  className={`block rounded-lg py-1.5 pl-2.5 pr-7 font-body transition-colors ${
                    on ? "bg-white/10" : "hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`block truncate text-[13px] ${
                      on ? "font-medium text-signal-deep" : "text-white/70"
                    }`}
                  >
                    {t.title}
                  </span>
                  <span className="block text-[11.5px] text-white/40">
                    {when(t.at)}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteThread(t.id)}
                  aria-label={`Delete “${t.title}”`}
                  title="Delete chat"
                  className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-white/40 opacity-0 transition-opacity hover:bg-white/15/70 hover:text-white/80 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <NavIcon d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * The dashboard shell: sidebar with the ten tabs, a top bar with the site
 * picker and sign out, and the alert strip. Keywords and Backlinks are the
 * gap tools; Settings opens the settings area. On phones the sidebar becomes
 * one scrolling strip.
 */
export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const stripRef = useRef<HTMLElement>(null);
  const [siteId, setSiteId] = useState(sites[0].site_id);
  // Desktop only: the sidebar can shrink to its icons. Kept per viewer.
  const [slim, setSlim] = useState(false);

  useEffect(() => {
    try {
      setSlim(localStorage.getItem("seerix-sidebar") === "slim");
    } catch {}
  }, []);

  const toggleSlim = () =>
    setSlim((v) => {
      try {
        localStorage.setItem("seerix-sidebar", v ? "wide" : "slim");
      } catch {}
      return !v;
    });

  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>("[aria-current=page]");
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollLeft =
      active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
  }, [pathname]);

  return (
    <div data-app className="flex min-h-dvh flex-col bg-white lg:flex-row">
      <aside
        className={`bg-signal-ink transition-[width] duration-200 ease-out lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 ${
          slim ? "lg:w-[68px]" : "lg:w-[220px]"
        }`}
      >
        <div
          className={`flex h-full flex-col px-4 pb-3 pt-5 lg:pb-5 ${slim ? "lg:px-3" : ""}`}
        >
          <div
            className={`flex items-center justify-between gap-2 ${
              slim ? "lg:flex-col lg:gap-3" : ""
            }`}
          >
            <Link href="/" className="flex items-center gap-2 px-1">
              <SeerixMark size={24} tone="white" animated={false} />
              <span
                className={`font-display text-[19px] font-semibold tracking-[-0.02em] text-white ${
                  slim ? "lg:hidden" : ""
                }`}
              >
                seerix
              </span>
            </Link>
            <button
              type="button"
              onClick={toggleSlim}
              aria-label={slim ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!slim}
              title={slim ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 lg:flex"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
                <path d="M7.5 3.5v13" />
                <path d={slim ? "M11 8l2 2-2 2" : "M13 8l-2 2 2 2"} />
              </svg>
            </button>
          </div>

          <nav
            ref={stripRef}
            aria-label="Dashboard"
            className="mt-4 flex gap-0.5 overflow-x-auto [scrollbar-width:none] lg:mt-7 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {nav.map((n) => {
              const on =
                n.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(n.href);
              const last = n.label === "Settings";
              return (
                <Fragment key={n.href}>
                  {/* Chat history sits between the tabs and Settings. */}
                  {last && !slim && <RecentChats />}
                  <Link
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    title={slim ? n.label : undefined}
                    className={`relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-[7px] font-body text-[13.5px] transition-colors ${
                      slim ? "lg:justify-center lg:px-0 lg:py-2" : ""
                    } ${last ? "lg:mt-auto" : ""} ${
                      on
                        ? "bg-white/10 font-medium text-signal-bright"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className={on ? "text-signal-bright" : "text-white/40"}>
                      <NavIcon d={n.d} vb={"vb" in n ? n.vb : undefined} />
                    </span>
                    <span className={slim ? "lg:sr-only" : ""}>{n.label}</span>
                    {n.count ? (
                      <span
                        className={`ml-auto rounded-full bg-white/10 px-1.5 font-body text-[11px] font-medium text-white/60 ${
                          slim
                            ? "lg:absolute lg:right-1 lg:top-0.5 lg:ml-0 lg:bg-signal-bright lg:px-1 lg:text-[9.5px] lg:leading-[14px] lg:text-signal-ink"
                            : ""
                        }`}
                      >
                        {n.count}
                      </span>
                    ) : null}
                  </Link>
                </Fragment>
              );
            })}
          </nav>

          {/* Below Settings, which the nav pushes to the bottom. */}
          <div className="hidden lg:block">
            <AccountRow slim={slim} />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-signal-ink">
        <header className="relative sticky top-0 z-30 flex items-center justify-between gap-3 bg-signal-ink px-5 py-3 sm:px-8 lg:px-10">
          <p className="hidden items-center gap-2 font-body text-[13px] text-white/60 sm:flex">
            <span className="h-2 w-2 rounded-full bg-signal-bright" />
            Google data updated this morning
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">Site</span>
              <select
                value={siteId}
                onChange={(e) => {
                  // Adding a site is onboarding, which lands with the backend.
                  if (e.target.value === "__add__") return;
                  setSiteId(e.target.value);
                }}
                className="h-9 translate-y-0 cursor-pointer appearance-none rounded-xl border border-white/[0.14] bg-[#1b1b1d] pl-3.5 pr-9 font-body text-[13.5px] text-white/85 transition-all duration-150 ease-out [box-shadow:0_3px_0_0_#000,0_4px_10px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:border-white/25 hover:text-white hover:[box-shadow:0_5px_0_0_#000,0_9px_16px_rgba(0,0,0,0.4)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_#000,0_2px_4px_rgba(0,0,0,0.3)] focus:outline-none"
              >
                {sites.map((s) => (
                  <option
                    key={s.site_id}
                    value={s.site_id}
                    className="bg-[#1b1b1d] text-white/85"
                  >
                    {s.site_name}
                  </option>
                ))}
                <option value="__add__" className="bg-[#1b1b1d] text-white/85">
                  + Add another site…
                </option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </label>
          </div>
          {/* The curve where the content meets the chrome. It hangs off the
              sticky header rather than sitting on <main>, which scrolls away
              and took the corner with it. */}
          <span
            aria-hidden="true"
            // A concave corner: black everywhere except inside the circle,
            // which is the content showing through.
            className="pointer-events-none absolute left-0 top-full hidden h-5 w-5 lg:block"
            style={{
              background:
                "radial-gradient(circle at 100% 100%, transparent 0 20px, var(--color-signal-ink) 20.5px)",
            }}
          />
        </header>

        <main
          className={`min-h-[calc(100dvh-57px)] bg-white px-5 pt-7 sm:px-8 lg:px-10 lg:pt-9 ${
            pathname === "/app/chat" ? "pb-6" : "pb-20"
          }`}
        >
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
