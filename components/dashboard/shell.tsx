"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { account, alerts, fixList, sites } from "@/components/dashboard/data";
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

/** Closes a popover on a click outside it or on Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) =>
      !ref.current?.contains(e.target as Node) && close();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open, close]);
  return ref;
}

const POPOVER =
  "rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_18px_44px_-14px_rgba(15,23,42,0.28)]";

/**
 * Recent chats, under the tabs: newest first, the open one highlighted, a
 * new-chat button, and a delete on hover. Desktop sidebar only.
 */
function RecentChats() {
  const { threads, active } = useThreads();
  const pathname = usePathname();
  return (
    <div className="mt-5 hidden min-h-0 flex-1 flex-col lg:flex">
      <div className="flex items-center justify-between pb-1 pl-3 pr-1">
        <p className="font-body text-[12.5px] text-zinc-500">Recent chats</p>
        <Link
          href="/app/chat"
          title="New chat"
          aria-label="New chat"
          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white hover:text-zinc-800"
        >
          <NavIcon d="M8 3.5v9M3.5 8h9" />
        </Link>
      </div>
      {threads.length === 0 ? (
        <p className="px-3 font-body text-[12.5px] text-zinc-400">
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
                  className={`block rounded-xl py-1.5 pl-3 pr-8 font-body transition-colors ${
                    on
                      ? "bg-white shadow-[0_0_0_1px_rgba(24,24,27,0.08)]"
                      : "hover:bg-white/70"
                  }`}
                >
                  <span
                    className={`block truncate text-[13.5px] ${
                      on ? "text-zinc-900" : "text-zinc-600"
                    }`}
                  >
                    {t.title}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteThread(t.id)}
                  aria-label={`Delete “${t.title}”`}
                  title={`Delete · ${when(t.at)}`}
                  className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-zinc-800 focus-visible:opacity-100 group-hover:opacity-100"
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

/** The bell: every alert, with a dot while there are any. */
function Bell() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const urgent = alerts.some((a) => a.type === "google_reconnect_needed");
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications (${alerts.length})`}
        aria-expanded={open}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900"
      >
        <NavIcon d="M4 10.5V7a4 4 0 0 1 8 0v3.5l1 1.5H3zM6.5 13.5a1.5 1.5 0 0 0 3 0" />
        {alerts.length > 0 && (
          <span
            className={`absolute right-1 top-1 h-2 w-2 rounded-full ring-2 ring-[#f5f5f6] ${
              urgent ? "bg-danger" : "bg-signal"
            }`}
          />
        )}
      </button>
      {open && (
        <div className={`absolute left-0 top-full z-50 mt-2 w-80 ${POPOVER}`}>
          <p className="px-3 pb-1 pt-2 font-body text-[13px] font-medium text-zinc-900">
            Notifications
          </p>
          {alerts.map((a) => {
            const ask = a.action.startsWith("ask:");
            return (
              <Link
                key={a.alert_id}
                href={
                  ask ? askHref(a.action.slice(4)) : "/settings/integrations"
                }
                onClick={() => setOpen(false)}
                className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-50"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    a.type === "google_reconnect_needed"
                      ? "bg-danger"
                      : "bg-warn"
                  }`}
                />
                <span className="min-w-0">
                  <span className="block font-body text-[13.5px] leading-[1.45] text-zinc-800">
                    {a.summary}
                  </span>
                  <span className="mt-0.5 block font-body text-[12.5px] text-signal">
                    {ask ? "Ask why" : "Fix in Settings"} →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** The plan and how much of it is used this month. */
function PlanCard() {
  const used = 212;
  const of = 500;
  return (
    <div className="mt-3 hidden rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 lg:block">
      <div className="flex items-center justify-between font-body text-[13px]">
        <span className="text-zinc-500">Growth plan</span>
        <Link
          href="/settings/billing"
          className="text-signal hover:underline"
        >
          See plans
        </Link>
      </div>
      <p className="mt-1.5 font-body text-[14px] text-zinc-900">
        {used} of {of} questions this month
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-signal"
          style={{ width: `${(used / of) * 100}%` }}
        />
      </div>
    </div>
  );
}

/** The person and the site, with the site switcher and sign out. */
function Account({
  slim,
  compact = false,
}: {
  slim: boolean;
  /** Avatar only, with the menu opening downwards: the phone top row. */
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [siteId, setSiteId] = useState(sites[0].site_id);
  const ref = useDismiss(open, () => setOpen(false));
  const site = sites.find((s) => s.site_id === siteId) ?? sites[0];
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={slim ? `${account.first_name} · ${site.site_name}` : undefined}
        className={`flex items-center gap-3 rounded-2xl text-left transition-colors hover:bg-white ${
          compact ? "p-0.5" : "w-full p-2"
        } ${slim ? "lg:justify-center" : ""}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal font-body text-[14px] font-medium text-white">
          {account.first_name[0]}
        </span>
        <span
          className={`min-w-0 flex-1 ${compact ? "hidden" : ""} ${slim ? "lg:hidden" : ""}`}
        >
          <span className="block truncate font-body text-[14px] text-zinc-900">
            {account.first_name}
          </span>
          <span className="block truncate font-body text-[12.5px] text-zinc-500">
            {site.site_name} · Owner
          </span>
        </span>
        <span
          className={`text-zinc-400 ${compact ? "hidden" : ""} ${slim ? "lg:hidden" : ""}`}
        >
          <NavIcon d="M5 6l3-3 3 3M5 10l3 3 3-3" />
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-50 w-64 ${POPOVER} ${
            compact ? "right-0 top-full mt-2" : "bottom-full left-0 mb-2"
          }`}
        >
          <p className="px-3 pb-1 pt-2 font-body text-[12px] text-zinc-400">
            Sites
          </p>
          {sites.map((s) => (
            <button
              key={s.site_id}
              type="button"
              role="menuitemradio"
              aria-checked={s.site_id === siteId}
              onClick={() => {
                setSiteId(s.site_id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body text-[13.5px] text-zinc-800 hover:bg-zinc-50"
            >
              {s.site_name}
              {s.site_id === siteId && (
                <span className="text-signal">
                  <NavIcon d="M3.5 8.5l3 3 6-7" />
                </span>
              )}
            </button>
          ))}
          {/* Adding a site is onboarding, which lands with the backend. */}
          <button
            type="button"
            disabled
            title="Coming with onboarding"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-body text-[13.5px] text-zinc-400"
          >
            <NavIcon d="M8 3.5v9M3.5 8h9" />
            Add another site
          </button>
          <div className="my-1 border-t border-zinc-100" />
          <p className="flex items-center gap-2 px-3 py-2 font-body text-[12.5px] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-good" />
            Google data updated this morning
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={() => router.push("/")}
            className="block w-full rounded-xl px-3 py-2 text-left font-body text-[13.5px] text-zinc-800 hover:bg-zinc-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * The dashboard shell, after Suresign's: the sidebar sits on the grey page
 * -- logo, alerts and collapse; the ask button; the tabs; recent
 * chats; the plan; Settings; the account -- and the page itself is one white
 * panel beside it. On phones the sidebar becomes a top row and one
 * scrolling strip of tabs.
 */
export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const stripRef = useRef<HTMLElement>(null);
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

  const isOn = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);
  const settings = nav[nav.length - 1];
  const tabs = nav.slice(0, -1);

  const item = (n: (typeof nav)[number], extra = "") => {
    const on = isOn(n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        aria-current={on ? "page" : undefined}
        title={slim ? n.label : undefined}
        className={`relative flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-3.5 py-2 font-body text-[14.5px] transition-colors ${
          slim ? "lg:justify-center lg:px-0" : ""
        } ${
          on
            ? "bg-white text-zinc-900 shadow-[0_0_0_1px_rgba(24,24,27,0.08),0_1px_2px_rgba(24,24,27,0.05)]"
            : "text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
        } ${extra}`}
      >
        <span className={on ? "text-signal" : "text-zinc-500"}>
          <NavIcon d={n.d} vb={"vb" in n ? n.vb : undefined} />
        </span>
        <span className={slim ? "lg:sr-only" : ""}>{n.label}</span>
        {n.count ? (
          <span
            className={`ml-auto rounded-full bg-zinc-200/70 px-1.5 font-body text-[11.5px] text-zinc-600 ${
              slim
                ? "lg:absolute lg:right-2 lg:top-0.5 lg:ml-0 lg:bg-signal lg:px-1 lg:text-[9.5px] lg:leading-[14px] lg:text-white"
                : ""
            }`}
          >
            {n.count}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div data-app className="min-h-dvh bg-[#f5f5f6] lg:flex">
      <aside
        className={`relative z-40 transition-[width] duration-200 ease-out lg:sticky lg:top-0 lg:h-dvh lg:shrink-0 ${
          slim ? "lg:w-[76px]" : "lg:w-[260px]"
        }`}
      >
        <div
          className={`flex h-full flex-col px-4 pb-3 pt-4 lg:pb-3 lg:pt-5 ${slim ? "lg:px-3" : ""}`}
        >
          <div
            className={`flex items-center gap-1 ${slim ? "lg:flex-col lg:gap-2" : ""}`}
          >
            <Link href="/" className="mr-auto flex items-center gap-2 px-2">
              <SeerixMark size={24} animated={false} />
              <span
                // The wordmark keeps the brand face; the rest of the app is in Inter.
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className={`text-[19px] font-semibold tracking-[-0.02em] text-zinc-900 ${
                  slim ? "lg:hidden" : ""
                }`}
              >
                seerix
              </span>
            </Link>
            <Bell />
            <span className="lg:hidden">
              <Account slim={false} compact />
            </span>
            <button
              type="button"
              onClick={toggleSlim}
              aria-label={slim ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!slim}
              title={slim ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900 lg:flex"
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

          <Link
            href="/app/chat"
            title={slim ? "Ask Seerix" : undefined}
            className={`mt-5 hidden h-10 items-center justify-center gap-2 rounded-full bg-signal font-body text-[14.5px] text-white shadow-[0_1px_2px_rgba(44,71,242,0.3)] transition-colors hover:bg-signal-deep lg:flex ${
              slim ? "lg:mx-auto lg:w-10" : ""
            }`}
          >
            <NavIcon d="M8 3.5v9M3.5 8h9" />
            <span className={slim ? "lg:sr-only" : ""}>Ask Seerix</span>
          </Link>

          <nav
            ref={stripRef}
            aria-label="Dashboard"
            className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:mt-5 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((n) => item(n))}
            {item(settings, "lg:hidden")}
          </nav>

          {!slim && <RecentChats />}
          {slim && <div className="hidden flex-1 lg:block" />}

          {!slim && <PlanCard />}
          <div className="mt-3 hidden lg:block">{item(settings)}</div>
          <div className="mt-1 hidden lg:block">
            <Account slim={slim} />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:py-2 lg:pr-2">
        <main
          className={`min-h-[calc(100dvh-140px)] rounded-t-[22px] border-t border-zinc-200/80 bg-white px-5 pt-7 sm:px-8 lg:min-h-[calc(100dvh-16px)] lg:rounded-[20px] lg:border lg:border-zinc-200/80 lg:px-11 lg:pt-10 ${
            pathname === "/app/chat" ? "pb-6" : "pb-20"
          }`}
        >
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
