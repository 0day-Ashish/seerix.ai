"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Button, { ButtonArrow } from "@/components/new-landing/button";

const links = [
  { label: "Changelog", href: "/changelog" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "/contact" },
];

const productColumns = [
  {
    title: "What it does",
    swatch: "bg-[#36363B]",
    items: [
      { label: "Diagnose", href: "#features" },
      { label: "Prioritize", href: "#features" },
      { label: "Watch", href: "#features" },
      { label: "Create", href: "#features" },
    ],
  },
  {
    title: "How it works",
    swatch: "bg-[#888084]",
    items: [
      { label: "Connect Search Console", href: "#how-it-works" },
      { label: "Seerix studies your site", href: "#how-it-works" },
      { label: "Ask anything", href: "#how-it-works" },
      { label: "Why trust it", href: "#trust" },
    ],
  },
];

const featured = { label: "Seerix: SEO answers with receipts", href: "#" };

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
                    className="flex flex-col rounded-md border border-black/[0.06] bg-white p-3.5"
                  >
                    <div className="flex items-center gap-2.5 pb-4">
                      <span
                        className={`h-2.5 w-2.5 rounded-sm ${column.swatch}`}
                      />
                      <span className="font-body text-[12px] font-medium text-black">
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
                className="group mt-1.5 flex items-center justify-between gap-3 rounded-md border border-black/[0.06] bg-white p-2.5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-black/[0.14] hover:shadow-md hover:shadow-black/10"
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
                  <span className="font-body text-[12px] font-medium text-black">
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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.07] bg-white backdrop-blur-xl">
      <div className="px-6">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            {/* The rows converge on the answer at the right, so the mark
              nudges that way on hover rather than spinning: it is no longer
              radially symmetric, and a turn would simply tilt it. */}
            <Image
              src="/assets/seerix-symbol-ink.svg"
              alt="Seerix"
              width={24}
              height={24}
              priority
              className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
            <span className="relative font-display text-[19px] font-medium tracking-[-0.02em] text-black">
              seerix
              <sup className="absolute -right-3.5 top-1 font-body text-[8px] font-extrabold leading-none tracking-normal text-black">
                TM
              </sup>
            </span>
          </Link>

          <ul className="hidden items-center gap-7 font-body text-[14px] text-zinc-500 lg:flex">
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
            <span className="hidden lg:contents">
              <Button href="/contact" variant="secondary">
                Contact us
              </Button>
            </span>
            <span className="hidden sm:contents">
              <Button href="#demo">
                See demo
                <ButtonArrow />
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-black/[0.09] bg-white text-zinc-500 transition-colors hover:border-black/[0.16] hover:text-black lg:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-black/[0.07] bg-white px-6 pb-8 pt-2 lg:hidden"
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

            {/* The desktop mega-menu is hover-driven, so its contents are
              re-laid out here as plain stacked groups. */}
            {productColumns.map((column) => (
              <div key={column.title} className="mt-6">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-sm ${column.swatch}`} />
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

            {/* Mirrors the header CTA, which is hidden at this width. */}
            {/* Mirrors the header CTAs, which are held back below lg. */}
            <div className="mt-7 flex flex-col gap-3 lg:hidden">
              <Button
                href="#demo"
                onClick={() => setMenuOpen(false)}
                className="w-full sm:hidden"
              >
                See demo
                <ButtonArrow />
              </Button>
              <Button
                href="/contact"
                onClick={() => setMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
