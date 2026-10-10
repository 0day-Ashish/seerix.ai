"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { alerts, fixList, sites } from "@/components/dashboard/data";
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
    href: "/gap/backlinks",
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
    d: "M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4",
  },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      className="h-4 w-4 shrink-0"
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
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 border border-l-[3px] border-black/[0.1] px-4 py-2.5 ${
              urgent
                ? "border-l-signal bg-signal-soft/70"
                : "border-l-[#36363b] bg-white"
            }`}
          >
            <p className="min-w-0 basis-full font-body text-[13.5px] text-black sm:basis-0 sm:flex-1">
              {a.summary}
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-zinc-400">
                {new Date(a.created_at + "T00:00:00Z").toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", timeZone: "UTC" },
                )}
              </span>
              <Link
                href={
                  ask ? askHref(a.action.slice(4)) : "/settings/integrations"
                }
                className="border border-black/[0.16] bg-white px-2.5 py-1 font-body text-[12.5px] font-medium text-black hover:border-black/40"
              >
                {ask ? "Ask why" : "Fix in Settings"}
              </Link>
              <button
                type="button"
                onClick={() => setHidden((h) => [...h, a.alert_id])}
                className="px-1 text-[16px] leading-none text-zinc-400 hover:text-black"
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

  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>("[aria-current=page]");
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollLeft =
      active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#fbfaf9] lg:flex-row">
      <aside className="border-b border-black/[0.08] bg-[#f5f4f2] lg:sticky lg:top-0 lg:h-dvh lg:w-[220px] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 pb-3 pt-5 lg:pb-5">
          <Link href="/" className="flex items-center gap-2 px-1">
            <SeerixMark size={24} animated={false} />
            <span className="font-display text-[19px] font-medium tracking-[-0.02em] text-black">
              seerix
            </span>
          </Link>

          <nav
            ref={stripRef}
            aria-label="Dashboard"
            className="mt-4 flex gap-0.5 overflow-x-auto [scrollbar-width:none] lg:mt-7 lg:flex-1 lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {nav.map((n) => {
              const on =
                n.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(n.href);
              const last = n.label === "Settings";
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap px-2.5 py-[7px] font-body text-[13.5px] transition-colors ${
                    last ? "lg:mt-auto" : ""
                  } ${
                    on
                      ? "bg-black/[0.06] text-black"
                      : "text-zinc-600 hover:bg-black/[0.03] hover:text-black"
                  }`}
                >
                  <span className={on ? "text-signal-deep" : "text-zinc-500"}>
                    <NavIcon d={n.d} />
                  </span>
                  {n.label}
                  {n.count ? (
                    <span className="ml-auto bg-signal px-1.5 font-mono text-[10.5px] leading-[18px] text-white">
                      {n.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-black/[0.08] px-5 py-3 sm:px-8 lg:px-10">
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-400 sm:block">
            Workspace · Ardent Dev
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
                className="h-9 cursor-pointer appearance-none border border-black/[0.16] bg-white pl-3 pr-9 font-body text-[13.5px] text-black hover:border-black/40 focus:border-black focus:outline-none"
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
              className="h-9 border border-black/[0.16] bg-white px-3.5 font-body text-[13px] font-medium text-black hover:border-black/40"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="px-5 pb-20 pt-7 sm:px-8 lg:px-10 lg:pt-9">
          <div className="mx-auto max-w-6xl">
            <AlertStrip />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
