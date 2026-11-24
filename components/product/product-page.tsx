import type { ReactNode } from "react";
import Link from "next/link";

import Cta from "@/components/new-landing/cta";
import GradientWash from "@/components/new-landing/gradient-wash";
import SectionHeader from "@/components/new-landing/section-header";
import SiteFooter from "@/components/new-landing/site-footer";
import WaitlistForm from "@/components/new-landing/waitlist-form";
import { products } from "@/components/product/products";

export type Capability = {
  label: string;
  body: string;
  /** Not shipped yet; marked rather than hidden. */
  soon?: boolean;
};

export type ProductPageProps = {
  /** The job: Diagnose, Prioritize, Watch, Create. */
  job: string;
  headline: string;
  lede: string;
  /** The animated panel for this job. */
  visual: ReactNode;
  /** What the job actually does. */
  capabilities: Capability[];
  /** How the job runs, in three beats. */
  steps: { label: string; body: string }[];
  /** Three evidence figures, set as a ledger under the opener. */
  proof: { figure: string; unit?: string; label: string }[];
  /** Where the reader goes next: the other jobs. */
  next: { job: string; href: string; blurb: string }[];
};

const order = Object.values(products).map((p) => p.job);

/** A small square where a rule meets its tick, as on the homepage ledger. */
function Node({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 border border-black/25 bg-[#f7f6f2] ${className}`}
    />
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/**
 * The shape all four product pages share, in the homepage's language: the
 * opener with the waitlist and the job running on the brand wash, the proof
 * as a drawn ledger, what the job covers as frosted cards, how it runs as a
 * three-step line, the other jobs, then the homepage's close.
 *
 * One component rather than four near-identical pages, so the pages cannot
 * drift apart.
 */
export default function ProductPage({
  job,
  headline,
  lede,
  visual,
  capabilities,
  steps,
  proof,
  next,
}: ProductPageProps) {
  const n = order.indexOf(job) + 1;

  return (
    <div className="flex flex-1 flex-col bg-ghost">
      {/* Opener: copy and the one ask on the left, the job on the right. */}
      <section className="bg-ghost px-6 pb-14 pt-14 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-zinc-500">
            <Link href="/#features" className="transition-colors hover:text-black">
              Products
            </Link>
            <span aria-hidden="true" className="text-zinc-300">
              /
            </span>
            <span className="text-zinc-900">{job}</span>
            {n > 0 && (
              <span className="ml-auto text-zinc-400">
                Job 0{n} of 0{order.length}
              </span>
            )}
          </p>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
            <div>
              <h1 className="font-display text-[40px] font-extralight leading-[1.08] tracking-[-0.035em] text-black sm:text-[56px]">
                {headline}
              </h1>
              <p className="mt-6 max-w-xl font-body text-[17px] leading-[1.6] text-zinc-600 sm:text-[18px]">
                {lede}
              </p>

              <div id="waitlist" className="mt-9 scroll-mt-32">
                <WaitlistForm note="no spam · one email when we launch" />
              </div>

              <Link
                href="/pricing"
                className="mt-7 inline-block border-b border-black/60 pb-0.5 font-mono text-[12px] uppercase tracking-[0.12em] text-black transition-colors hover:border-black hover:text-zinc-600"
              >
                See what each plan includes
              </Link>
            </div>

            {/* The job, on the brand wash; first on mobile so it is shown
                before it is argued. */}
            <div className="relative order-first isolate overflow-hidden rounded-[28px] p-4 sm:p-8 lg:order-none">
              <GradientWash className="-z-10" />
              {visual}
            </div>
          </div>
        </div>
      </section>

      {/* The proof, as the homepage's drawn ledger: three figures between
          hairlines, squares where the rules cross. */}
      <section className="overflow-hidden bg-ghost px-6 pb-20 sm:pb-24">
        <dl className="relative mx-auto grid max-w-7xl border-y border-black/[0.12] sm:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute -left-10 -right-10 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.12] to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute -left-10 -right-10 bottom-0 h-px bg-gradient-to-r from-transparent via-black/[0.12] to-transparent"
          />
          <Node className="left-0 top-0" />
          <Node className="left-full top-0" />
          <Node className="left-0 top-full" />
          <Node className="left-full top-full" />
          {proof.map((item, i) => (
            <div
              key={item.label}
              className={`relative px-1 py-9 sm:px-10 ${
                i > 0
                  ? "border-t border-black/[0.12] sm:border-l sm:border-t-0"
                  : "sm:pl-0"
              }`}
            >
              {i > 0 && (
                <>
                  <Node className="left-0 top-0 hidden sm:block" />
                  <Node className="left-0 top-full hidden sm:block" />
                </>
              )}
              <dt className="flex items-baseline gap-2">
                <span className="font-display text-[52px] font-extralight leading-none tracking-[-0.03em] text-black sm:text-[60px]">
                  {item.figure}
                </span>
                {item.unit && (
                  <span className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-zinc-500">
                    {item.unit}
                  </span>
                )}
              </dt>
              <dd className="mt-4 max-w-xs font-body text-[15px] leading-[1.55] text-zinc-600">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What the job covers, as frosted cards. */}
      <section className="bg-ghost px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            heading={`What ${job.toLowerCase()} covers`}
            lede="Each one runs on your own Search Console rows, live SERP snapshots and crawl data, and every answer cites what it was built from."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, index) => (
              <article
                key={cap.label}
                className="frost flex flex-col rounded-[24px] p-6 sm:p-7"
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-soft font-mono text-[12px] text-signal-deep ring-1 ring-signal-bright/50">
                    0{index + 1}
                  </span>
                  {cap.soon && (
                    <span className="rounded-md bg-signal-soft px-2 py-0.5 font-body text-[11.5px] text-signal-deep">
                      Soon
                    </span>
                  )}
                </span>
                <h3 className="mt-6 font-body text-[18px] font-medium leading-snug text-black">
                  {cap.label}
                </h3>
                <p className="mt-2.5 font-body text-[15px] leading-[1.6] text-zinc-600">
                  {cap.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it runs: three steps on one line, each a card under its node. */}
      <section className="bg-ghost px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            heading="Three steps, every time you ask."
            lede="The same order on every question, so an answer is never a guess dressed up as a finding."
          />

          <ol className="relative mt-12 grid gap-4 sm:grid-cols-3">
            {/* The line the steps hang from. */}
            <span
              aria-hidden="true"
              className="absolute left-5 right-5 top-5 hidden border-t border-dashed border-signal/40 sm:block"
            />
            {steps.map((step, index) => (
              <li key={step.label} className="relative">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white font-mono text-[12.5px] text-signal-deep shadow-[0_4px_14px_-6px_rgba(91,79,216,0.45)] ring-1 ring-signal-bright">
                  0{index + 1}
                </span>
                <div className="frost mt-5 rounded-[24px] p-6 sm:p-7">
                  <h3 className="font-body text-[18px] font-medium leading-snug text-black">
                    {step.label}
                  </h3>
                  <p className="mt-2.5 font-body text-[15px] leading-[1.6] text-zinc-600">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The other jobs, as the homepage's job cards. */}
      <section className="bg-ghost px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader heading="The rest of the job" />

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {next.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="frost group flex flex-col rounded-[24px] p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7"
              >
                <span className="flex items-center justify-between">
                  <span className="font-mono text-[12px] text-zinc-500">
                    0{order.indexOf(item.job) + 1}
                  </span>
                  <span className="text-zinc-400 transition-colors group-hover:text-black">
                    <Arrow />
                  </span>
                </span>
                <span className="mt-8 font-display text-[30px] font-extralight leading-none tracking-[-0.03em] text-black">
                  {item.job}
                </span>
                <span className="mt-3 font-body text-[15px] leading-[1.55] text-zinc-600">
                  {item.blurb}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Cta />
      <SiteFooter />
    </div>
  );
}
