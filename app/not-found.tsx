import type { Metadata } from "next";
import Link from "next/link";

import Button, { ButtonArrow } from "@/components/new-landing/button";
import SiteFooter from "@/components/new-landing/site-footer";

export const metadata: Metadata = {
  title: "Page not found · Seerix",
  description: "The page you were looking for does not exist.",
};

/** The routes worth offering someone who has landed nowhere. */
const suggestions = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="px-6 pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="font-body text-[13px] font-medium tracking-[0.02em] text-zinc-400">
            404
          </p>

          <h1 className="mt-4 max-w-2xl font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
            That page isn&rsquo;t here.
          </h1>

          <p className="mt-5 max-w-xl font-body text-[16px] leading-[1.6] text-zinc-500">
            The link may be out of date, or the address mistyped. Everything
            below is still where you left it.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href="/">
              Back to home
              <ButtonArrow />
            </Button>
            <Button href="/contact" variant="secondary">
              Report a broken link
            </Button>
          </div>

          <nav
            aria-label="Suggested pages"
            className="mt-12 border-t border-black/[0.07] pt-8"
          >
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {suggestions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-[15px] text-zinc-500 transition-colors duration-200 hover:text-black"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
