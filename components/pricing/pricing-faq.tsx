"use client";

import Link from "next/link";
import { useState } from "react";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type Item = { question: string; answer: string };

/**
 * Billing only. The landing page's FAQ answers permissions, data handling and
 * how the analysis works; repeating those here would bury the four questions
 * someone actually arrives at a pricing page holding.
 */
const faqs: Item[] = [
  {
    question: "What counts as an AI question?",
    answer:
      "One question you ask and one diagnosis you get back, however many evidence rows it had to assemble to answer. Follow-ups in the same thread count separately, since each one runs its own analysis. Background work never draws on the allowance: crawls, SERP snapshots, alerts and the weekly report are all included in the plan.",
  },
  {
    question: "Do you charge per page crawled or per evidence row?",
    answer:
      "No. Plans are a flat monthly fee against the allowances listed above, so a month where a site needs a lot of digging never turns into a surprise line item. The crawl and enrichment limits are ceilings on the work Seerix does, not a meter you are billed against.",
  },
  {
    question: "What happens if I reach my limit?",
    answer:
      "Nothing breaks. Seerix keeps monitoring, reporting and alerting; what pauses is new AI questions until the next cycle, and the dashboard flags it well before you get there. If you are consistently running out, we will say so rather than let you sit at the ceiling.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, in either direction. Moving up raises your site count and allowances straight away and is prorated. Moving down takes effect at the next renewal and keeps everything already collected: the limits apply to new work, not to the history in your account.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No. Every plan is month to month and can be cancelled at any time. Your account stays readable until the end of the billing period, and you can export your findings or trigger deletion immediately from account settings.",
  },
];

export default function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="billing-faq" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel name="Billing FAQ" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>What you will be charged.</BlockReveal>
            </h2>
            <p className="mt-5 font-body text-[17px] leading-[1.6] text-zinc-500">
              Allowances, limits and what happens when you reach them.
            </p>

            <Link
              href="/#faq"
              className="group mt-6 inline-flex items-center gap-2 font-body text-[15px] text-black transition-colors duration-200 hover:text-zinc-500"
            >
              Questions about access and data
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3.5L10.5 8L6 12.5" />
              </svg>
            </Link>
          </div>

          <div>
            {faqs.map((faq, index) => {
              const open = openIndex === index;

              return (
                <div key={faq.question} className="border-b border-black/[0.07]">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`billing-faq-panel-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="group flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left font-body text-[18px] leading-snug text-black transition-colors duration-200 hover:text-zinc-500"
                  >
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="relative mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-colors duration-200 group-hover:text-black"
                    >
                      {/* Plus that loses its vertical stroke when open. */}
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out ${
                          open ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>

                  {/* grid-template-rows animates where height:auto cannot. */}
                  <div
                    id={`billing-faq-panel-${index}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-10 font-body text-[16px] leading-[1.7] text-zinc-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
