import Image from "next/image";
import Link from "next/link";

import SectionHeader from "@/components/new-landing/section-header";

type Spec = { label: string; value: string };

type Plan = {
  name: string;
  price: string;
  cadence: string;
  subtitle: string;
  /** Sites the plan covers; drawn as lit squares out of twenty. */
  sites: number;
  /** The allowances, as a spec sheet: label left, figure right. */
  specs: Spec[];
  /** Only one plan carries the emphasis treatment. */
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$39",
    cadence: "/mo",
    subtitle: "For one site that matters",
    sites: 1,
    specs: [
      { label: "AI questions", value: "100 / mo" },
      { label: "Pages crawled", value: "1,000 / mo" },
      { label: "Keywords enriched", value: "500 / mo" },
      { label: "SERP snapshots", value: "100 / mo" },
      { label: "Weekly report + alerts", value: "Yes" },
    ],
  },
  {
    name: "Growth",
    price: "$99",
    cadence: "/mo",
    subtitle: "For builders running multiple sites",
    sites: 5,
    featured: true,
    specs: [
      { label: "AI questions", value: "500 / mo" },
      { label: "Pages crawled", value: "5,000 / site" },
      { label: "Keywords enriched", value: "2,000 / site" },
      { label: "SERP snapshots", value: "500 / site" },
      { label: "Weekly report + alerts", value: "Yes" },
    ],
  },
  {
    name: "Agency",
    price: "$249",
    cadence: "/mo",
    subtitle: "For portfolios and client work",
    sites: 20,
    specs: [
      { label: "AI questions", value: "2,000 / mo" },
      { label: "Pages crawled", value: "10,000 / site" },
      { label: "Keywords enriched", value: "10,000 / site" },
      { label: "SERP snapshots", value: "2,000 / site" },
      { label: "Weekly report + alerts", value: "Yes" },
    ],
  },
];

/** Twenty squares, the plan's sites lit: the three cards read as a scale. */
function SiteGrid({ sites }: { sites: number }) {
  return (
    <div aria-hidden="true" className="grid grid-cols-10 gap-1">
      {Array.from({ length: 20 }, (_, i) => (
        <span
          key={i}
          className={`aspect-square ${
            i < sites ? "bg-signal-bright" : "bg-white/[0.10]"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Three plans as columns, each a spec sheet rather than a tick list: the
 * allowances read as label and figure, so the same row can be compared
 * straight across the three cards. The site grid at the top of each shows
 * the step up in scale before any number is read.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          heading="A fraction of one consultant hour."
          lede="The same analysis a $200/hr consultant runs by hand, working every day instead of one engagement."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, index) => {
            const dark = Boolean(plan.featured);
            return (
              <article
                key={plan.name}
                className={`relative flex flex-col overflow-hidden rounded-3xl p-7 sm:p-8 ${
                  dark
                    ? "bg-[#cfe8d8] text-zinc-900 shadow-[0_30px_70px_-30px_rgba(10,40,25,0.45)] lg:-my-3 lg:py-11"
                    : "border border-black/[0.08] bg-white"
                }`}
              >
                {/* The brand gradient fills the featured card, as it does on
                    the pricing route. The copy is dark against it. */}
                {dark && (
                  <Image
                    src="/assets/bg-gradient.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                )}
                {/* Plan name, and the badge where it applies. */}
                <div className="relative flex items-center justify-between gap-3">
                  <p
                    className={`font-mono text-[12px] uppercase tracking-[0.08em] ${
                      dark ? "text-zinc-600" : "text-zinc-500"
                    }`}
                  >
                    0{index + 1} &middot; {plan.name}
                  </p>
                  {dark && (
                    <span className="rounded-full bg-signal-bright px-2.5 py-0.5 font-body text-[12px] font-medium text-signal-ink">
                      Most popular
                    </span>
                  )}
                </div>

                <p className="relative mt-8 flex items-baseline gap-1.5">
                  <span
                    className={`font-display text-[52px] font-semibold leading-none tracking-[-0.045em] ${
                      dark ? "text-zinc-900" : "text-black"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`font-body text-[15px] ${
                      dark ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    {plan.cadence}
                  </span>
                </p>
                <p
                  className={`relative mt-3 font-body text-[15px] ${
                    dark ? "text-zinc-700" : "text-zinc-500"
                  }`}
                >
                  {plan.subtitle}
                </p>

                {/* Scale, before the figures. */}
                <div className="relative mt-8 bg-signal-ink p-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span
                      className="font-body text-[13px] text-white/50"
                    >
                      Sites
                    </span>
                    <span
                      className="font-mono text-[13px] text-white/85"
                    >
                      {plan.sites}
                    </span>
                  </div>
                  <SiteGrid sites={plan.sites} />
                </div>

                {/* The spec sheet. */}
                <dl className="relative mt-6 flex-1">
                  {plan.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className={`flex items-baseline justify-between gap-4 border-b py-3 ${
                        dark ? "border-black/[0.10]" : "border-black/[0.06]"
                      }`}
                    >
                      <dt
                        className={`font-body text-[14px] ${
                          dark ? "text-zinc-700" : "text-zinc-600"
                        }`}
                      >
                        {spec.label}
                      </dt>
                      <dd
                        className={`shrink-0 font-mono text-[13px] ${
                          dark ? "text-zinc-900" : "text-black"
                        }`}
                      >
                        {spec.value === "Yes" ? (
                          <svg
                            className={`h-3.5 w-3.5 ${dark ? "text-signal-deep" : "text-[#1c1c21]"}`}
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-label="Included"
                            role="img"
                          >
                            <path d="M3 8.5l3.2 3.2L13 5" />
                          </svg>
                        ) : (
                          spec.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href="#demo"
                  // The mint fill with a dark label, matching every other CTA.
                  className="relative mt-8 flex h-12 translate-y-0 items-center justify-center gap-2 rounded-xl font-body text-[15px] font-medium bg-signal-bright text-signal-ink transition-all duration-150 ease-out [box-shadow:0_3px_0_0_var(--color-signal-edge),0_4px_10px_rgba(10,10,11,0.14)] hover:-translate-y-0.5 hover:bg-signal-bright hover:[box-shadow:0_5px_0_0_var(--color-signal-edge),0_9px_16px_rgba(10,10,11,0.18)] active:translate-y-[2px] active:[box-shadow:0_1px_0_0_var(--color-signal-edge),0_2px_4px_rgba(10,10,11,0.12)]"
                >
                  See demo
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3.5L10.5 8L6 12.5" />
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-12 font-body text-[15px] leading-[1.65] text-zinc-500">
          <Link
            href="/pricing"
            className="text-black underline underline-offset-2 transition-colors hover:text-zinc-500"
          >
            Compare every plan side by side
          </Link>
          . Early access is invite-based while we work closely with design
          partners. Reach us at{" "}
          <Link
            href="mailto:hello@seerix.ai"
            className="text-black underline underline-offset-2 transition-colors hover:text-zinc-500"
          >
            hello@seerix.ai
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
