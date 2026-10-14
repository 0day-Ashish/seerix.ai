"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

import { alerts, fixList, sites } from "@/components/dashboard/data";
import {
  deleteThread,
  useThreads,
  when,
} from "@/components/dashboard/chat-history";
import { askHref } from "@/components/dashboard/kit";
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
function RecentChats() {
  const { threads, active } = useThreads();
  const pathname = usePathname();
  return (
    <div className="mt-4 hidden min-h-0 flex-1 flex-col border-t border-zinc-100 pt-4 lg:flex">
      <div className="flex items-center justify-between px-2.5 pb-1.5">
        <p className="font-body text-[12px] font-medium text-zinc-400">
          Recent chats
        </p>
        <Link
          href="/app/chat"
          title="New chat"
          aria-label="New chat"
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        >
          <NavIcon d="M8 3.5v9M3.5 8h9" />
        </Link>
      </div>
      {threads.length === 0 ? (
        <p className="px-2.5 font-body text-[12.5px] text-zinc-400">
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
                    on ? "bg-[#eef3fd]" : "hover:bg-zinc-100"
                  }`}
                >
                  <span
                    className={`block truncate text-[13px] ${
                      on ? "font-medium text-[#1a5fd0]" : "text-zinc-700"
                    }`}
                  >
                    {t.title}
                  </span>
                  <span className="block text-[11.5px] text-zinc-400">
                    {when(t.at)}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteThread(t.id)}
                  aria-label={`Delete “${t.title}”`}
                  title="Delete chat"
                  className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-200/70 hover:text-zinc-800 focus-visible:opacity-100 group-hover:opacity-100"
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

/** The alert strip that sits above every tab, as in the staging app. */
function AlertStrip() {
  const [hidden, setHidden] = useState<string[]>([]);
  const shown = alerts.filter((a) => !hidden.includes(a.alert_id));
  if (!shown.length) return null;
  return (
    <div className="mb-8 flex flex-col gap-2">
      {shown.map((a) => {
        const urgent = a.type === "google_reconnect_needed";
        const ask = a.action.startsWith("ask:");
        return (
          <div
            key={a.alert_id}
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-4 py-2.5 ${
              urgent
                ? "border-[#fbd5c3] bg-[#fff7f2]"
                : "border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            }`}
          >
            <p className="flex min-w-0 basis-full items-baseline gap-2.5 font-body text-[13.5px] text-zinc-800 sm:basis-0 sm:flex-1">
              <span
                className={`h-2 w-2 shrink-0 -translate-y-px rounded-full ${urgent ? "bg-signal" : "bg-amber-400"}`}
                aria-hidden="true"
              />
              {a.summary}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-body text-[12px] text-zinc-400">
                {new Date(a.created_at + "T00:00:00Z").toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", timeZone: "UTC" },
                )}
              </span>
              <Link
                href={
                  ask ? askHref(a.action.slice(4)) : "/settings/integrations"
                }
                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-body text-[12.5px] font-medium text-zinc-800 hover:bg-zinc-50"
              >
                {ask ? "Ask why" : "Fix in Settings"}
              </Link>
              <button
                type="button"
                onClick={() => setHidden((h) => [...h, a.alert_id])}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[16px] leading-none text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"
                aria-label="Dismiss alert"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
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
  const router = useRouter();
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
    <div data-app className="flex min-h-dvh flex-col bg-[#f7f8fa] lg:flex-row">
      <aside
        className={`border-b border-zinc-200/80 bg-white transition-[width] duration-200 ease-out lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 lg:border-b-0 lg:border-r ${
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
              <SeerixMark size={24} animated={false} />
              <span
                className={`font-display text-[19px] font-semibold tracking-[-0.02em] text-zinc-900 ${
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
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 lg:flex"
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
                        ? "bg-[#eef3fd] font-medium text-[#1a5fd0]"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <span className={on ? "text-[#1a5fd0]" : "text-zinc-400"}>
                      <NavIcon d={n.d} vb={"vb" in n ? n.vb : undefined} />
                    </span>
                    <span className={slim ? "lg:sr-only" : ""}>{n.label}</span>
                    {n.count ? (
                      <span
                        className={`ml-auto rounded-full bg-zinc-100 px-1.5 font-body text-[11px] font-medium text-zinc-600 ${
                          slim
                            ? "lg:absolute lg:right-1 lg:top-0.5 lg:ml-0 lg:bg-[#3b6fe0] lg:px-1 lg:text-[9.5px] lg:leading-[14px] lg:text-white"
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
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-zinc-200/80 bg-white/90 px-5 py-3 backdrop-blur-md sm:px-8 lg:px-10">
          <p className="hidden items-center gap-2 font-body text-[13px] text-zinc-500 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
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
                className="h-9 cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white pl-3 pr-9 font-body text-[13.5px] text-zinc-800 shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-zinc-50 focus:border-[#1a5fd0] focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.site_id} value={s.site_id}>
                    {s.site_name}
                  </option>
                ))}
                <option value="__add__">+ Add another site…</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </label>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="h-9 rounded-lg border border-zinc-200 bg-white px-3.5 font-body text-[13px] font-medium text-zinc-800 shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-zinc-50"
            >
              Sign out
            </button>
          </div>
        </header>

        <main
          className={`px-5 pt-7 sm:px-8 lg:px-10 lg:pt-9 ${
            pathname === "/app/chat" ? "pb-6" : "pb-20"
          }`}
        >
          <div className="mx-auto max-w-6xl">
            {/* Chat needs the whole screen, and its alerts already lead there. */}
            {pathname !== "/app/chat" && <AlertStrip />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
