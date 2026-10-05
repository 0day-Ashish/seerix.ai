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
function SiteGrid({ sites, featured }: { sites: number; featured?: boolean }) {
  return (
    <div aria-hidden="true" className="grid grid-cols-10 gap-1">
      {Array.from({ length: 20 }, (_, i) => (
        <span
          key={i}
          className={`aspect-square  ${
            i < sites
              ? "bg-signal"
              : featured
                ? "bg-white/[0.08]"
                : "bg-black/[0.06]"
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
                className={`flex flex-col  p-7 sm:p-8 ${
                  dark
                    ? "bg-[linear-gradient(160deg,#4a4a51_0%,#36363b_35%,#1c1c21_100%)] text-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] lg:-my-3 lg:py-11"
                    : "border border-black/[0.08] bg-white"
                }`}
              >
                {/* Plan name, and the badge where it applies. */}
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`font-mono text-[12px] uppercase tracking-[0.08em] ${
                      dark ? "text-white/55" : "text-zinc-500"
                    }`}
                  >
                    0{index + 1} &middot; {plan.name}
                  </p>
                  {dark && (
                    <span className="rounded-full bg-signal px-2.5 py-0.5 font-body text-[12px] font-medium text-white">
                      Most popular
                    </span>
                  )}
                </div>

                <p className="mt-8 flex items-baseline gap-1.5">
                  <span
                    className={`font-display text-[52px] font-semibold leading-none tracking-[-0.045em] ${
                      dark ? "text-white" : "text-black"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`font-body text-[15px] ${
                      dark ? "text-white/50" : "text-zinc-400"
                    }`}
                  >
                    {plan.cadence}
                  </span>
                </p>
                <p
                  className={`mt-3 font-body text-[15px] ${
                    dark ? "text-white/65" : "text-zinc-500"
                  }`}
                >
                  {plan.subtitle}
                </p>

                {/* Scale, before the figures. */}
                <div
                  className={`mt-8  p-4 ${
                    dark
                      ? "bg-white/[0.04] ring-1 ring-white/[0.08]"
                      : "bg-zinc-50 ring-1 ring-black/[0.05]"
                  }`}
                >
                  <div className="mb-3 flex items-baseline justify-between">
                    <span
                      className={`font-body text-[13px] ${
                        dark ? "text-white/60" : "text-zinc-500"
                      }`}
                    >
                      Sites
                    </span>
                    <span
                      className={`font-mono text-[13px] ${
                        dark ? "text-white" : "text-black"
                      }`}
                    >
                      {plan.sites}
                    </span>
                  </div>
                  <SiteGrid sites={plan.sites} featured={dark} />
                </div>

                {/* The spec sheet. */}
                <dl className="mt-6 flex-1">
                  {plan.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className={`flex items-baseline justify-between gap-4 border-b py-3 ${
                        dark ? "border-white/[0.08]" : "border-black/[0.06]"
                      }`}
                    >
                      <dt
                        className={`font-body text-[14px] ${
                          dark ? "text-white/70" : "text-zinc-600"
                        }`}
                      >
                        {spec.label}
                      </dt>
                      <dd
                        className={`shrink-0 font-mono text-[13px] ${
                          dark ? "text-white" : "text-black"
                        }`}
                      >
                        {spec.value === "Yes" ? (
                          <svg
                            className={`h-3.5 w-3.5 ${dark ? "text-signal" : "text-[#1c1c21]"}`}
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
                  className={`mt-8 flex h-12 items-center justify-center gap-2  font-body text-[15px] font-medium transition-colors duration-200 ${
                    dark
                      ? "bg-signal text-white hover:bg-signal-deep"
                      : "bg-[#1c1c21] text-white hover:bg-[#36363B]"
                  }`}
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
