"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type UseCase = {
  name: string;
  icon: string;
  summary: string;
  points: string[];
  tags: string[];
  plan: { name: string; price: string };
  /** A worked example of the diagnosis this vertical asks for. */
  example: { question: string; answer: string };
};

const useCases: UseCase[] = [
  {
    name: "SaaS",
    icon: "M3 4h10v7H3zM6 13.5h4",
    summary:
      "Track the comparison and alternative queries that convert, and catch a competitor outranking you on your own category terms.",
    points: [
      "Comparison and alternative queries tracked weekly",
      "Competitor movement on your category terms",
      "Pricing and signup pages diagnosed first",
    ],
    tags: ["Comparison Queries", "Competitor Tracking", "Page Diagnosis"],
    plan: { name: "Growth", price: "$99" },
    example: {
      question: "Why did signups from search fall?",
      answer: "/pricing slipped 4 → 11 after a title rewrite on 2 Apr.",
    },
  },
  {
    name: "E-commerce",
    icon: "M3 4h1.5l1.5 7h7l1-5H5.2M7 13.5h.5M11.5 13.5h.5",
    summary:
      "Category and product pages diagnosed separately, with cannibalization surfaced where your own listings compete for one query.",
    points: [
      "Category and product pages split",
      "Cannibalization between your own listings",
      "Seasonal demand separated from ranking loss",
    ],
    tags: ["Cannibalization", "Category Pages", "Demand Split"],
    plan: { name: "Growth", price: "$99" },
    example: {
      question: "Why are two pages fighting for 'running shoes'?",
      answer: "Both rank 8–12; merging lifts the stronger page to page one.",
    },
  },
  {
    name: "Publishers",
    icon: "M4 3h8v10H4zM6 6h4M6 8.5h4M6 11h2",
    summary:
      "Large libraries crawled on a schedule, so decay is caught on the pages that still earn and not just the ones you remember.",
    points: [
      "Scheduled crawls across large libraries",
      "Content decay on the pages that still earn",
      "Refresh priorities scored by traffic at stake",
    ],
    tags: ["Content Decay", "Refresh Queue", "Library Crawl"],
    plan: { name: "Agency", price: "$249" },
    example: {
      question: "Which old articles should we refresh first?",
      answer: "12 pages lost 30%+ clicks in 90 days; 4 still rank top-10.",
    },
  },
  {
    name: "Local services",
    icon: "M8 13.5s4-4 4-7a4 4 0 0 0-8 0c0 3 4 7 4 7zM8 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    summary:
      "Per-market configuration across 15 country and language markets, with rankings read where your customers actually search.",
    points: [
      "Markets configured per site",
      "Rankings read in the right country and language",
      "Location pages diagnosed one by one",
    ],
    tags: ["Market Config", "Location Pages", "Local SERPs"],
    plan: { name: "Starter", price: "$39" },
    example: {
      question: "Why did calls from search drop in Leeds?",
      answer: "The Leeds page lost its title; Manchester's still ranks 3.",
    },
  },
  {
    name: "Agencies",
    icon: "M2.5 13V6l3-2 3 2v7M8.5 13V8l3-2 2 1.5V13M2 13.5h12",
    summary:
      "Every client site isolated from the next, each with its own crawl scope, competitors and reporting, under one account.",
    points: [
      "Client sites isolated from each other",
      "Client-ready exports and shared workspaces",
      "Cross-site portfolio view",
    ],
    tags: ["Client Exports", "Portfolio View", "Shared Workspaces"],
    plan: { name: "Agency", price: "$249" },
    example: {
      question: "Which client needs attention this week?",
      answer: "Three of 18 sites dropped; one is a migration gone wrong.",
    },
  },
];

function Icon({ d }: { d: string }) {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0"
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

/**
 * The verticals as a list on the left and the chosen one opened on the
 * right: what Seerix does there, the plan it fits, and a worked example of
 * the question it answers. The example stands in for a customer story until
 * there are customers to quote.
 */
export default function PricingUseCases() {
  const [active, setActive] = useState(0);
  const uc = useCases[active];

  return (
    <section id="use-cases" className="scroll-mt-28 bg-white px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="heading-mark font-display text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-[44px]">
          Use cases
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div
            role="tablist"
            aria-label="Use cases"
            className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
          >
            {useCases.map((u, i) => {
              const on = i === active;
              return (
                <button
                  key={u.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 items-center gap-3 px-4 py-3 text-left font-body text-[16px] transition-colors ${
                    on ? "bg-zinc-100 text-black" : "text-zinc-500 hover:text-black"
                  }`}
                >
                  <Icon d={u.icon} />
                  <span className="flex-1 whitespace-nowrap">{u.name}</span>
                  {on && <span className="hidden lg:inline">&rsaquo;</span>}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            key={uc.name}
            className="grid animate-[seerix-fade-in_0.35s_ease-out] gap-6 border border-black/[0.10] p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.35)] sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
          >
            <div className="flex min-w-0 flex-col">
              <h3 className="font-display text-[30px] font-medium tracking-[-0.03em] text-black">
                {uc.name}
              </h3>
              <p className="mt-3 max-w-lg font-body text-[15px] leading-[1.6] text-zinc-600">
                {uc.summary}
              </p>
              <ul className="mt-5 list-disc space-y-2 pl-5 font-body text-[15px] text-zinc-600 marker:text-zinc-400">
                {uc.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {uc.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-zinc-100 px-2.5 py-1.5 font-mono text-[12px] text-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex-1" />
              <div className="mt-8 bg-zinc-50 p-5">
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[18px] text-black">
                    Fits the {uc.plan.name} plan
                  </span>
                  <span className="font-display text-[26px] tracking-[-0.02em] text-black">
                    {uc.plan.price}
                    <span className="ml-1 font-body text-[13px] text-zinc-500">/mo</span>
                  </span>
                </p>
                <Link
                  href="/#demo"
                  className="mt-4 flex h-11 items-center justify-center bg-[#141416] font-body text-[15px] font-medium text-white transition-colors hover:bg-[#36363B]"
                >
                  See it on your site
                </Link>
              </div>
            </div>

            <div className="flex min-w-0 flex-col border border-black/[0.08]">
              <div className="relative aspect-[6/5] overflow-hidden bg-[#2a2a30]">
                <Image
                  src="/assets/Silver mist-2048x1428.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover [transform:scaleX(-1)]"
                />
                <div className="absolute inset-x-5 bottom-5 bg-white p-4">
                  <p className="font-mono text-[11px] tracking-[0.08em] text-zinc-500">
                    ASKED
                  </p>
                  <p className="mt-1 font-body text-[14px] text-black">
                    {uc.example.question}
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-zinc-50 p-5">
                <p className="font-body text-[13px] text-zinc-500">Example diagnosis</p>
                <p className="mt-2 font-display text-[19px] leading-snug tracking-[-0.01em] text-black">
                  {uc.example.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
