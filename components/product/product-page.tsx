import type { ReactNode } from "react";
import Link from "next/link";

import Button, { ButtonArrow } from "@/components/new-landing/button";
import SectionDivider from "@/components/new-landing/section-divider";
import SiteFooter from "@/components/new-landing/site-footer";

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
  /** What the job actually does, as a numbered list. */
  capabilities: Capability[];
  /** How the job runs, in three beats; the dark band. */
  steps: { label: string; body: string }[];
  /** The three evidence lines under the capabilities. */
  proof: { figure: string; unit?: string; label: string }[];
  /** Where the reader goes next, as a pair of sibling pages. */
  next: { job: string; href: string; blurb: string }[];
};

/**
 * The shape all four product pages share: opener with the animated panel,
 * the capability list, a proof row, then the two sibling jobs.
 *
 * One component rather than four near-identical pages, so the pages cannot
 * drift apart -- the same decision `PlanCard` makes for the two pricing
 * surfaces. Everything here reuses the landing system: `heading-mark` on the
 * headings, `SectionDivider` between sections, the shared `Button` at its one
 * size, and `SiteFooter` closing the page.
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
  return (
    <div className="flex flex-1 flex-col bg-ghost">
      {/* Opener: copy left, the job running on the right. */}
      <section className="bg-ghost px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
            <div>
              <p className="font-mono text-[12px] tracking-[0.04em] text-zinc-400">
                {job.toUpperCase()}
              </p>
              <h1 className="heading-mark mt-4 font-display text-[36px] font-light leading-[1.08] tracking-[-0.02em] text-black sm:text-[50px]">
                {headline}
              </h1>
              <p className="mt-5 max-w-xl font-body text-[17px] leading-[1.6] text-zinc-500 sm:text-[18px]">
                {lede}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/#demo">
                  See demo
                  <ButtonArrow />
                </Button>
                <Button href="/pricing" variant="secondary">
                  View pricing
                </Button>
              </div>
            </div>

            {/* Sits first on mobile so the job is shown before it is argued. */}
            <div className="order-first lg:order-none">{visual}</div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* What the job does. */}
      <section className="bg-ghost px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="heading-mark max-w-3xl font-display text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-black sm:text-[40px]">
            What {job.toLowerCase()} covers
          </h2>

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, index) => (
              <div
                key={cap.label}
                className="border-t border-black/[0.10] pt-5"
              >
                <span className="font-mono text-[12px] text-zinc-400">
                  0{index + 1}
                </span>
                <h3 className="mt-3 flex flex-wrap items-center gap-2 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-black">
                  {cap.label}
                  {cap.soon && (
                    <span className="rounded-full border border-black/[0.10] px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-zinc-400">
                      SOON
                    </span>
                  )}
                </h3>
                <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                  {cap.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it runs. The one dark section on the page: it breaks a long
          run of grey-on-white into two halves and gives the mechanism its
          own register, rather than a third list in the same texture. */}
      <section className="bg-[#1c1c21] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[12px] tracking-[0.04em] text-white/40">
            HOW IT RUNS
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-white sm:text-[40px]">
            Three beats, every time you ask.
          </h2>

          <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.label} className="border-t border-white/[0.14] pt-5">
                <span className="font-mono text-[12px] text-signal">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-white">
                  {step.label}
                </h3>
                <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-white/55">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The evidence row: the same ledger treatment the numbers section uses. */}
      <section className="bg-ghost px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <dl className="grid overflow-hidden rounded-3xl border border-black/[0.07] bg-[#faf9f8] sm:grid-cols-3">
            {proof.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col p-7 sm:p-8 ${
                  index > 0 ? "border-t sm:border-l sm:border-t-0" : ""
                } border-black/[0.07]`}
              >
                <dt className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-[40px] font-medium leading-none tracking-[-0.04em] text-black sm:text-[46px]">
                    {item.figure}
                  </span>
                  {item.unit && (
                    <span className="font-body text-[15px] text-zinc-400">
                      {item.unit}
                    </span>
                  )}
                </dt>
                <dd className="mt-3 font-body text-[14px] leading-[1.6] text-zinc-500">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SectionDivider />

      {/* The sibling jobs, so the four pages form a set rather than dead ends. */}
      <section className="bg-ghost px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="heading-mark font-display text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-black sm:text-[40px]">
            The rest of the job
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {next.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-black/[0.07] p-6 transition-colors duration-200 hover:border-black/[0.16]"
              >
                <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-black">
                  {item.job}
                </h3>
                <p className="mt-2 font-body text-[14px] leading-[1.65] text-zinc-500">
                  {item.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[14px] text-signal">
                  Read more
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3.5L10.5 8L6 12.5" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
