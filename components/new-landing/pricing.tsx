import Link from "next/link";

import GradientWash from "@/components/new-landing/gradient-wash";
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

/** A flat tick, as the reference draws it. */
function Tick({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`mt-[3px] h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          heading="A fraction of one consultant hour."
          lede="The same analysis a $200/hr consultant runs by hand, working every day instead of one engagement."
        />

        {/* Name and subtitle, then the price, then the action -- the list
            sits last. The featured card stands on the brand wash (the moving
            gradient behind the product demo) with the one ink button; the
            side cards are white, raised off the ivory, with the lilac one. */}
        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const on = Boolean(plan.featured);
            return (
              <article
                key={plan.name}
                className={`relative isolate flex flex-col overflow-hidden rounded-3xl p-7 transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-9 ${
                  on
                    ? "shadow-[0_30px_70px_-30px_rgba(40,25,110,0.45)]"
                    : "bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-30px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]"
                }`}
              >
                {on && <GradientWash offset={6} className="-z-10" />}

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[26px] font-medium tracking-[-0.02em] text-black">
                    {plan.name}
                  </h3>
                  {on && (
                    <span className="mt-1 rounded-full bg-white/70 px-2.5 py-1 font-body text-[12px] font-medium text-zinc-900 ring-1 ring-black/[0.06] backdrop-blur-sm">
                      Most popular
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 max-w-[22rem] font-body text-[16px] leading-[1.5] ${
                    on ? "text-zinc-800" : "text-zinc-500"
                  }`}
                >
                  {plan.subtitle}
                </p>

                <p className="mt-8 flex items-baseline gap-2">
                  <span className="font-display text-[52px] font-medium leading-none tracking-[-0.04em] text-black">
                    {plan.price}
                  </span>
                  <span
                    className={`font-body text-[17px] ${on ? "text-zinc-800" : "text-zinc-500"}`}
                  >
                    {plan.cadence}
                  </span>
                </p>
                <p
                  className={`mt-3 font-body text-[15px] ${on ? "text-zinc-800" : "text-zinc-500"}`}
                >
                  Per month, billed monthly
                </p>

                {/* The action sits above the list, not under it. Raised on a
                    solid offset edge, the same way the site's buttons are: it
                    lifts on hover and travels down into its own shadow on
                    press. Ink on the wash, lilac on white: each button
                    contrasts with its own card. */}
                <Link
                  href="#demo"
                  className={`mt-7 flex h-12 translate-y-0 items-center justify-center rounded-xl font-body text-[15px] font-medium transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-[2px] ${
                    on
                      ? "bg-signal-ink text-white [box-shadow:0_3px_0_0_#38383f,0_4px_10px_rgba(10,10,11,0.18)] hover:[box-shadow:0_5px_0_0_#38383f,0_9px_16px_rgba(10,10,11,0.22)] active:[box-shadow:0_1px_0_0_#38383f,0_2px_4px_rgba(10,10,11,0.14)]"
                      : "bg-signal-bright text-signal-ink [box-shadow:0_3px_0_0_var(--color-signal-edge),0_4px_10px_rgba(10,10,11,0.14)] hover:[box-shadow:0_5px_0_0_var(--color-signal-edge),0_9px_16px_rgba(10,10,11,0.18)] active:[box-shadow:0_1px_0_0_var(--color-signal-edge),0_2px_4px_rgba(10,10,11,0.12)]"
                  }`}
                >
                  Get started
                </Link>

                <ul
                  className={`mt-8 flex flex-col gap-4 border-t pt-7 ${
                    on ? "border-black/[0.12]" : "border-black/[0.07]"
                  }`}
                >
                  {plan.specs.map((spec) => (
                    <li key={spec.label} className="flex gap-3">
                      <Tick className={on ? "text-zinc-900" : "text-signal"} />
                      <span className="font-body text-[16px] leading-[1.45] text-zinc-800">
                        {spec.label}
                        {spec.value !== "Yes" && (
                          <span className={on ? "text-zinc-700" : "text-zinc-500"}>
                            {" "}
                            &middot; {spec.value}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                  <li className="flex gap-3">
                    <Tick className={on ? "text-zinc-900" : "text-signal"} />
                    <span className="font-body text-[16px] leading-[1.45] text-zinc-800">
                      {plan.sites} {plan.sites === 1 ? "site" : "sites"}
                    </span>
                  </li>
                </ul>
              </article>
            );
          })}
        </div>

        <p className="mt-10 font-body text-[15px] leading-[1.65] text-zinc-500">
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
