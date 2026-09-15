"use client";

import Link from "next/link";
import { useState } from "react";
import SectionLabel from "@/components/new-landing/section-label";
import { BlockReveal } from "@/components/new-landing/block-reveal";

type Faq = {
  /** Groups the list into labelled runs. */
  group: string;
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    group: "Access & data",
    question: "What permissions does Seerix have on my Google account?",
    answer:
      "Read-only, and only what you explicitly grant: basic sign-in identity (email, profile) and read-only Search Console access for the properties you connect. Seerix can never modify anything in your Google account: no settings, no properties, no data. You can revoke access at any time from your Google Account permissions page, effective immediately.",
  },
  {
    group: "Access & data",
    question: "Do you have access to my data?",
    answer:
      "Seerix stores the Search Console metrics, crawl results, and ranking snapshots needed to power your diagnoses. That's what makes week-over-week analysis and 'did my fix work?' possible. That data is encrypted, isolated per customer, never sold, never shared with other customers, and never used to train AI models. Delete your account and it's deleted. Full details in the Privacy Policy.",
  },
  {
    group: "Access & data",
    question: "Can I connect more than one Search Console property?",
    answer:
      "Yes. Each plan covers a set number of sites, and every site is configured on its own: its market, its competitors, its crawl scope. Properties are kept isolated from one another, so a diagnosis for one site never draws on another site's data, and you can add or remove a property at any time without losing the history of the others.",
  },
  {
    group: "Access & data",
    question: "What happens to my data if I cancel?",
    answer:
      "Your account stays readable until the end of the billing period, then the data is scheduled for deletion: Search Console metrics, crawl results, ranking snapshots, and the diagnoses built from them. You can export your findings before that point, and you can trigger deletion immediately from account settings instead of waiting.",
  },
  {
    group: "How it works",
    question: "Won't the AI hallucinate about my site?",
    answer:
      "This is the core of how Seerix is engineered. The AI never browses or free-associates. It only sees structured evidence packets built from your actual data, and every claim must cite specific evidence rows. Answers citing evidence that doesn't exist are rejected by validators before you see them. When data can't support a conclusion, Seerix lowers its confidence score and says so in plain language.",
  },
  {
    group: "How it works",
    question: "How is this different from Ahrefs or Semrush?",
    answer:
      "Those are excellent data tools, and they still leave you staring at charts, doing the consultant's job yourself. Seerix starts where they stop: it takes your Search Console history, crawl, rankings, and competitor movement and produces the diagnosis: what happened, why, what to do first, and whether the fix worked. You talk to it like the consultant you'd otherwise hire.",
  },
  {
    group: "How it works",
    question: "Does it replace Google Search Console?",
    answer:
      "No, it makes GSC useful. Search Console remains your source of truth (and Seerix deliberately matches its reporting days, so numbers always reconcile). Seerix adds what GSC doesn't have: the why, ranked priorities, SERP and competitor tracking, and a conversation on top of it all.",
  },
  {
    group: "How it works",
    question: "How long before Seerix has anything useful to say?",
    answer:
      "The first read-only sign-in pulls up to sixteen months of Search Console history, so the initial diagnoses land within the first crawl rather than after a warm-up period. Week-over-week comparisons and 'did my fix work?' verification need a little runtime on top of that, since they measure change after the moment you made it.",
  },
  {
    group: "How it works",
    question: "What does a confidence score actually mean?",
    answer:
      "It reflects how much of your data stands behind a claim: how long the history runs, how many rows support it, and whether competing explanations were ruled out. A low score is a real answer, not a hedge. It tells you the evidence is thin, and Seerix says which evidence it wanted and did not have.",
  },
  {
    group: "Plans",
    question: "What kinds of sites does it work for?",
    answer:
      "Any vertical (SaaS, e-commerce, content, local services) and any of 15 country/language markets, configured per site. Seerix makes zero assumptions about your business type; every diagnosis is built from your data. It works best with a few months of Search Console history so answers can be evidence-based.",
  },
  {
    group: "Plans",
    question: "What counts as an AI question?",
    answer:
      "One question you ask and one diagnosis you get back, however many evidence rows it had to assemble to answer. Follow-ups in the same thread count separately, since each one runs its own analysis. Background work does not draw on the allowance: crawls, SERP snapshots, alerts, and the weekly report are all included in the plan.",
  },
  {
    group: "Plans",
    question: "Can I change plans later?",
    answer:
      "Yes, in either direction, and the change takes effect on the next billing period. Moving up raises your site count and monthly allowances straight away. Moving down keeps everything you have already collected: the limits apply to new work, not to the history already in your account.",
  },
  {
    group: "Plans",
    question: "Is there a free trial?",
    answer:
      "Not yet. We're onboarding a limited group of design partners and working closely with each of them. Email hello@seerix.ai to join the early-access list; there's no credit card required to join, and paid plans can be cancelled anytime.",
  },
];

export default function Faq() {
  // All questions start collapsed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading parks alongside the list while it scrolls past. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel name="FAQ" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>Fair questions.</BlockReveal>
            </h2>
            <p className="mt-5 font-body text-[17px] leading-[1.6] text-zinc-500">
              Everything about Google permissions, how your data is handled, and
              why the answers can&rsquo;t make things up about your site.
            </p>

            <Link
              href="mailto:hello@seerix.ai"
              className="group mt-6 inline-flex items-center gap-2 font-body text-[15px] text-black transition-colors duration-200 hover:text-zinc-500"
            >
              Still have a question?
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
              // A group heading is drawn once, above its first question.
              const startsGroup =
                index === 0 || faqs[index - 1].group !== faq.group;

              return (
                <div key={faq.question}>
                  {startsGroup && (
                    <p
                      className={`font-body text-[14px] text-zinc-400 ${
                        index === 0 ? "" : "mt-12"
                      }`}
                    >
                      {faq.group}
                    </p>
                  )}

                  <div className="border-b border-black/[0.07]">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${index}`}
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
                      id={`faq-panel-${index}`}
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
