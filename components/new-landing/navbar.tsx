"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
];

const productColumns = [
  {
    title: "WHAT IT DOES",
    swatch: "bg-[#36363B]",
    items: [
      { label: "Diagnose", href: "#features" },
      { label: "Prioritize", href: "#features" },
      { label: "Watch", href: "#features" },
      { label: "Create", href: "#features" },
    ],
  },
  {
    title: "HOW IT WORKS",
    swatch: "bg-[#888084]",
    items: [
      { label: "Connect Search Console", href: "#how-it-works" },
      { label: "Seerix studies your site", href: "#how-it-works" },
      { label: "Ask anything", href: "#how-it-works" },
      { label: "Why trust it", href: "#trust" },
    ],
  },
];

const featured = { label: "SEERIX: SEO ANSWERS WITH RECEIPTS", href: "#" };

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
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

function ArrowBox() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-black/15 text-zinc-500 transition-all duration-200 ease-out group-hover:border-[#36363B] group-hover:bg-[#36363B] group-hover:text-white">
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
          className={
            open ? "rotate-180 transition-transform" : "transition-transform"
          }
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[min(40rem,calc(100vw-3rem))] -translate-x-1/2 pt-2">
          <div className="relative overflow-hidden rounded-lg border border-black/10 shadow-lg shadow-black/5">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/assets/Emerald.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative p-1.5">
              <div className="grid gap-1.5 sm:grid-cols-2">
                {productColumns.map((column) => (
                  <div
                    key={column.title}
                    className="flex flex-col rounded-md border border-white/40 bg-white/90 p-3.5 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2.5 pb-4">
                      <span
                        className={`h-2.5 w-2.5 rounded-sm ${column.swatch}`}
                      />
                      <span className="font-mono text-[11px] font-medium tracking-wider text-black">
                        {column.title}
                      </span>
                    </div>

                    <ul className="mt-auto">
                      {column.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="group -mx-1.5 flex items-center justify-between gap-3 rounded border-t border-dashed border-black/15 px-1.5 py-2 text-[13px] text-zinc-800 transition-colors duration-200 hover:bg-black/[0.04] hover:text-black"
                          >
                            <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">
                              {item.label}
                            </span>
                            <ArrowBox />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link
                href={featured.href}
                className="group mt-1.5 flex items-center justify-between gap-3 rounded-md border border-white/40 bg-white/90 p-2.5 backdrop-blur-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/70 hover:bg-white hover:shadow-md hover:shadow-black/10"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded border border-black/10 bg-white">
                    <Image
                      src="/assets/seerix-symbol-ink.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-wider text-black">
                    {featured.label}
                  </span>
                </span>
                <ArrowBox />
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // The info bar sits above the sticky header and scrolls away with the page,
    // so the border fades in once it has cleared the top.
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-white transition-colors duration-300 ease-out ${
        scrolled ? "border-black/15" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          {/* The mark is three bars at 60 degree steps, so a 60 degree turn
              lands it back on itself and the spin has no visible seam. */}
          <Image
            src="/assets/seerix-symbol-ink.svg"
            alt="Seerix"
            width={24}
            height={24}
            priority
            className="transition-transform duration-500 ease-out will-change-transform group-hover:rotate-60 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
          />
          <span className="relative font-display text-xl font-semibold tracking-tight text-black">
            seerix
            <sup className="absolute -right-3.5 top-1 font-body text-[8px] font-extrabold leading-none tracking-normal text-black">
              TM
            </sup>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 font-body text-[15px] text-zinc-700 lg:flex">
          <li>
            <ProductsMenu />
          </li>
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3 font-body">
          <Link
            href="#faq"
            className="hidden h-10 translate-y-0 items-center rounded-lg border border-black/15 bg-white px-4 text-[15px] text-zinc-700 [box-shadow:0_4px_0_0_#d4d4d8,0_5px_10px_rgba(0,0,0,0.10)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-black/30 hover:text-black hover:[box-shadow:0_6px_0_0_#d4d4d8,0_10px_18px_rgba(0,0,0,0.14)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#d4d4d8,0_2px_4px_rgba(0,0,0,0.10)] sm:flex"
          >
            Contact us
          </Link>
          <Link
            href="#demo"
            className="group flex h-10 translate-y-0 items-center gap-3 rounded-lg bg-gradient-to-b from-[#4a4a51] to-[#36363B] px-5 text-[15px] text-white [box-shadow:0_4px_0_0_#1c1c21,0_5px_10px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:from-[#55555d] hover:to-[#3f3f45] hover:[box-shadow:0_6px_0_0_#1c1c21,0_10px_18px_rgba(0,0,0,0.22)] active:translate-y-[3px] active:[box-shadow:0_1px_0_0_#1c1c21,0_2px_4px_rgba(0,0,0,0.15)]"
          >
            See demo
            <svg
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
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
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/15 bg-white text-zinc-700 transition-colors hover:border-black/30 hover:text-black lg:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-black/10 bg-white px-6 pb-8 pt-2 lg:hidden"
        >
          <ul className="font-body text-[15px] text-zinc-700">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-dashed border-black/10 py-3.5 transition-colors hover:text-black"
                >
                  {link.label}
                  <ArrowBox />
                </Link>
              </li>
            ))}
          </ul>

          {/* The desktop mega-menu is hover-driven, so its contents are
              re-laid out here as plain stacked groups. */}
          {productColumns.map((column) => (
            <div key={column.title} className="mt-6">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${column.swatch}`} />
                <span className="font-mono text-[11px] font-medium tracking-wider text-black">
                  {column.title}
                </span>
              </div>
              <ul className="mt-1">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between border-b border-dashed border-black/10 py-3 font-body text-[14px] text-zinc-700 transition-colors hover:text-black"
                    >
                      {item.label}
                      <ArrowBox />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Mirrors the header CTA, which is hidden at this width. */}
          <Link
            href="#faq"
            onClick={() => setMenuOpen(false)}
            className="mt-7 flex h-11 items-center justify-center rounded-lg border border-black/15 bg-white px-6 font-body text-[15px] text-zinc-700 [box-shadow:0_4px_0_0_#d4d4d8] transition-colors hover:border-black/30 hover:text-black sm:hidden"
          >
            Contact us
          </Link>
        </div>
      )}
    </header>
  );
}
