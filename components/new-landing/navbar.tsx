"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Button, { ButtonArrow } from "@/components/new-landing/button";
import GradientWash from "@/components/new-landing/gradient-wash";
import SeerixMark from "@/components/new-landing/seerix-mark";

const links = [
  { label: "Changelog", href: "/changelog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

type ProductItem = {
  label: string;
  desc: string;
  href: string;
  /** 16px stroke icon, one path. */
  icon: string;
  badge?: string;
};

/** The Products menu, as three columns; the mobile menu reuses it. */
const productColumns: {
  title: string;
  swatch: string;
  items: ProductItem[];
}[] = [
  {
    title: "Analyst",
    swatch: "bg-signal-bright",
    items: [
      {
        label: "Diagnose",
        desc: "Why traffic moved, with the evidence behind it",
        href: "/product/diagnose",
        icon: "M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.5 10.5l3 3",
      },
      {
        label: "Prioritize",
        desc: "Fixes ranked by impact against effort",
        href: "/product/prioritize",
        icon: "M3 13.5V9M6.5 13.5V6M10 13.5V3.5M13.5 13.5V7.5",
      },
      {
        label: "Watch",
        desc: "SERPs and competitors, checked every day",
        href: "/product/watch",
        icon: "M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
      },
    ],
  },
  {
    title: "Automation",
    swatch: "bg-[#e0a63a]",
    items: [
      {
        label: "Create",
        desc: "Titles and metas drafted from what ranks",
        href: "/product/create",
        icon: "M10.5 2.5l3 3-8 8H2.5v-3l8-8zM9 4l3 3",
      },
      {
        label: "Content briefs",
        desc: "A brief for every page worth writing",
        href: "/product/create",
        icon: "M4 2h6l2.5 2.5V14H4zM6 7h4M6 9.5h4M6 12h2.5",
        badge: "Soon",
      },
      {
        label: "Weekly report",
        desc: "What changed and what to do, every Monday",
        href: "/#features",
        icon: "M2.5 3.5h11v10h-11zM2.5 6.5h11M5.5 2v3M10.5 2v3",
      },
    ],
  },
  {
    title: "How it works",
    swatch: "bg-[#888084]",
    items: [
      {
        label: "Search Console",
        desc: "Sixteen months of history on one read-only sign-in",
        href: "/#how-it-works",
        icon: "M8 5c3 0 5-.9 5-2s-2-2-5-2-5 .9-5 2 2 2 5 2zM3 3v10c0 1.1 2 2 5 2s5-.9 5-2V3M3 8c0 1.1 2 2 5 2s5-.9 5-2",
      },
      {
        label: "SeerixBot",
        desc: "The crawler that reads your pages",
        href: "/seerixbot",
        icon: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM2 8h12M8 2c1.7 1.8 2.5 3.8 2.5 6S9.7 12.2 8 14C6.3 12.2 5.5 10.2 5.5 8S6.3 3.8 8 2z",
      },
      {
        label: "Pricing",
        desc: "Three flat plans, from $39 a month",
        href: "/pricing",
        icon: "M8.5 2H14v5.5L7.5 14 2 8.5zM11 5h.01",
      },
    ],
  },
];

function ItemIcon({ d }: { d: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-zinc-700 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors duration-200 group-hover:text-black">
      <svg
        className="h-4 w-4"
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
    </span>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3 w-3 ${className}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 3 7.5 6 4.5 9" />
    </svg>
  );
}

function ArrowBox() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-black/15 text-zinc-500 transition-all duration-200 ease-out group-hover:border-[#36363B] group-hover:bg-[#36363B] group-hover:text-white">
      <svg
        className="h-2.5 w-2.5 transition-transform duration-200 ease-out group-hover:translate-x-px"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </span>
  );
}

function ProductsMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      ref={wrapperRef}
      className="static"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 transition-colors hover:text-black"
      >
        Products
        <Chevron
          className={`transition-transform duration-200 ${
            open ? "-rotate-90" : "rotate-90"
          }`}
        />
      </button>

      {/* Full width under the bar: three columns of jobs, a hairline, and
          what's new on the right. Solid white, so the page never shows through. */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 px-6 pt-1">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl border border-black/[0.08] bg-white p-7 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-0">
            {productColumns.map((column) => (
              <div key={column.title} className="lg:pr-8">
                <p className="font-body text-[13px] text-zinc-500">
                  {column.title}
                </p>
                <ul className="mt-4 flex flex-col gap-1">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group -mx-2 flex gap-3 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-black/[0.035]"
                      >
                        <ItemIcon d={item.icon} />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-body text-[14.5px] text-zinc-900">
                            {item.label}
                            {item.badge && (
                              <span className="rounded-md bg-signal-soft px-1.5 py-px font-body text-[11px] text-signal-deep">
                                {item.badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block font-body text-[13px] leading-[1.45] text-zinc-500">
                            {item.desc}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* What's new: our own card, the brand wash with the mark. */}
            <div className="border-black/[0.07] lg:border-l lg:pl-8">
              <p className="font-body text-[13px] text-zinc-500">
                New in Seerix
              </p>
              <Link
                href="/#how-it-works"
                onClick={() => setOpen(false)}
                className="group mt-4 block"
              >
                <span className="relative isolate flex aspect-[2/1] items-center justify-center overflow-hidden rounded-xl">
                  <GradientWash offset={3} className="-z-10" />
                  {/* A rising line of evidence dots behind the mark. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-50 [-webkit-mask-image:linear-gradient(160deg,transparent_35%,black_50%,transparent_70%)] [mask-image:linear-gradient(160deg,transparent_35%,black_50%,transparent_70%)]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1.4px)",
                      backgroundSize: "7px 7px",
                    }}
                  />
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(40,25,110,0.5)] transition-transform duration-300 group-hover:scale-105">
                    <SeerixMark size={26} animated={false} />
                  </span>
                </span>
                <span className="mt-4 block font-body text-[14.5px] leading-[1.5] text-zinc-900">
                  Meet evidence-cited diagnoses: ask why traffic moved, get
                  the cause with its receipts.
                </span>
                <span className="mt-3 flex items-center gap-1.5 font-body text-[13.5px] text-zinc-500 transition-colors group-hover:text-black">
                  See how it works
                  <Chevron className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Hamburger that morphs to a close mark, driven by the open state. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <path d="M4 4l8 8M12 4l-8 8" />
      ) : (
        <path d="M2 4.5h12M2 11.5h12" />
      )}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Where the bar ends on screen, so the menu sheet starts just below it
  // whether or not the announcement above is still in view.
  const headerRef = useRef<HTMLElement>(null);
  const [sheetTop, setSheetTop] = useState(72);
  // Products starts collapsed each time the mobile menu opens.
  const [productsOpen, setProductsOpen] = useState(false);

  // The panel only exists below lg, so growing past that breakpoint while it
  // is open would otherwise leave the scroll lock stuck on.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    function onChange() {
      if (query.matches) setMenuOpen(false);
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // The app areas (settings, the gap tools) have their own sidebar; the
  // marketing bar stays out of them.
  if (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/gap") ||
    pathname === "/app" ||
    pathname.startsWith("/app/")
  )
    return null;

  return (
    <>
      {/* The announcement, above the bar: black, and it scrolls away while
          the bar below it stays. */}
      <p className="relative z-50 bg-signal-ink px-6 py-2.5 text-center font-body text-[13px] text-white/75 sm:text-[14px]">
        Launching soon.{" "}
        <Link
          href="/#waitlist"
          className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
        >
          Join the waitlist
        </Link>{" "}
        and get one email when Seerix is live.
      </p>
    <header ref={headerRef} className="sticky top-0 z-40 w-full">
      {/* Frosted ground: the page shows through, blurred. It runs past the
          bar's bottom edge and fades out there, so the bar ends in a soft
          falloff rather than a hard line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+28px)] bg-white/60 backdrop-blur-xl backdrop-saturate-150 [-webkit-mask-image:linear-gradient(to_bottom,black_62%,transparent)] [mask-image:linear-gradient(to_bottom,black_62%,transparent)]"
      />
      <div className="relative px-6">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <SeerixMark size={32} />
            <span className="wordmark relative text-[25px] font-medium tracking-[-0.03em] text-black">
              seerix
              <sup className="wordmark absolute -right-4 top-1.5 text-[9px] font-bold leading-none tracking-normal text-black">
                TM
              </sup>
            </span>
          </Link>

          <div className="flex items-center gap-10">
            <ul className="hidden items-center gap-9 font-body text-[15px] text-black/80 lg:flex">
              <li>
                <ProductsMenu />
              </li>
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-black/50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-2">
              {/* The one button: the waitlist. Contact stays a plain link in
                  the row. Wrapped, so the breakpoint display never fights the
                  button's own inline-flex. */}
              <span className="hidden sm:block">
                <Button href="/#waitlist">Join waitlist</Button>
              </span>

              <button
                type="button"
                onClick={() => {
                  const bottom = headerRef.current?.getBoundingClientRect().bottom;
                  if (bottom) setSheetTop(bottom);
                  setMenuOpen((value) => !value);
                  setProductsOpen(false);
                }}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.09] bg-white text-zinc-500 transition-colors hover:border-black/[0.16] hover:text-black lg:hidden"
              >
                <MenuIcon open={menuOpen} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Full screen: the sheet fills the viewport behind the bar (-z-[5]
          sits above the frosted ground at -z-10 and below the bar itself),
          so the mark and the close button stay where they were. The links
          scroll in the middle; the closing note is pinned to the bottom. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          // Solid ivory, not bg-ghost: that goes transparent over the
          // animated background, and the sheet must hide the page.
          className="fixed inset-0 -z-[5] flex h-dvh flex-col bg-[#f7f6f2] lg:hidden"
          style={{ paddingTop: sheetTop }}
        >
          {/* data-lenis-prevent: the smooth-scroll library otherwise takes
              the wheel and touch for the (locked) page, so this list could
              not be scrolled. */}
          <div
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-black/[0.07] px-6 pb-8 pt-2"
          >
            <div className="mx-auto max-w-7xl">
              <ul className="font-body text-[15px] text-zinc-600">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between border-b border-black/[0.07] py-3.5 transition-colors hover:text-black"
                    >
                      {link.label}
                      <ArrowBox />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* The desktop mega-menu is hover-driven, so here it is a
              collapsed "Products" row that opens its groups on tap. */}
              <button
                type="button"
                onClick={() => setProductsOpen((v) => !v)}
                aria-expanded={productsOpen}
                aria-controls="mobile-products"
                className="flex w-full items-center justify-between border-b border-black/[0.07] py-3.5 font-body text-[15px] text-zinc-600 transition-colors hover:text-black"
              >
                Products
                <Chevron
                  className={`transition-transform ${productsOpen ? "rotate-90" : ""}`}
                />
              </button>
              {productsOpen && (
                <div id="mobile-products" className="pb-2">
                  {productColumns.map((column) => (
                    <div key={column.title} className="mt-5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${column.swatch}`}
                        />
                        <span className="font-body text-[12px] font-medium text-black">
                          {column.title}
                        </span>
                      </div>
                      <ul className="mt-1">
                        {column.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between border-b border-black/[0.07] py-3 font-body text-[14px] text-zinc-600 transition-colors hover:text-black"
                            >
                              {item.label}
                              <ArrowBox />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* The header's one button, which is held back on phones. */}
              <div className="mt-7 lg:hidden">
                <Button
                  href="/#waitlist"
                  onClick={() => setMenuOpen(false)}
                  className="w-full"
                >
                  Join waitlist
                  <ButtonArrow />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-black/[0.07] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
            <div className="mx-auto max-w-7xl">
              <p className="max-w-xs font-body text-[22px] font-medium leading-[1.2] text-black">
                Diagnoses with receipts, not dashboards with homework.
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 font-body text-[13px] text-zinc-500">
                <a
                  href="mailto:hello@seerix.ai"
                  className="text-black underline decoration-black/25 underline-offset-4 hover:decoration-black"
                >
                  hello@seerix.ai
                </a>
                <span>&copy; {new Date().getFullYear()} Seerix</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
