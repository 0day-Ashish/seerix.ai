"use client";

import { useState } from "react";
import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

const faqs = [
  {
    question: "What permissions does Seerix have on my Google account?",
    answer:
      "Read-only, and only what you explicitly grant: basic sign-in identity (email, profile) and read-only Search Console access for the properties you connect. Seerix can never modify anything in your Google account: no settings, no properties, no data. You can revoke access at any time from your Google Account permissions page, effective immediately.",
  },
  {
    question: "Do you have access to my data?",
    answer:
      "Seerix stores the Search Console metrics, crawl results, and ranking snapshots needed to power your diagnoses. That's what makes week-over-week analysis and 'did my fix work?' possible. That data is encrypted, isolated per customer, never sold, never shared with other customers, and never used to train AI models. Delete your account and it's deleted. Full details in the Privacy Policy.",
  },
  {
    question: "Won't the AI hallucinate about my site?",
    answer:
      "This is the core of how Seerix is engineered. The AI never browses or free-associates. It only sees structured evidence packets built from your actual data, and every claim must cite specific evidence rows. Answers citing evidence that doesn't exist are rejected by validators before you see them. When data can't support a conclusion, Seerix lowers its confidence score and says so in plain language.",
  },
  {
    question: "How is this different from Ahrefs or Semrush?",
    answer:
      "Those are excellent data tools, and they still leave you staring at charts, doing the consultant's job yourself. Seerix starts where they stop: it takes your Search Console history, crawl, rankings, and competitor movement and produces the diagnosis: what happened, why, what to do first, and whether the fix worked. You talk to it like the consultant you'd otherwise hire.",
  },
  {
    question: "Does it replace Google Search Console?",
    answer:
      "No, it makes GSC useful. Search Console remains your source of truth (and Seerix deliberately matches its reporting days, so numbers always reconcile). Seerix adds what GSC doesn't have: the why, ranked priorities, SERP and competitor tracking, and a conversation on top of it all.",
  },
  {
    question: "What kinds of sites does it work for?",
    answer:
      "Any vertical (SaaS, e-commerce, content, local services) and any of 15 country/language markets, configured per site. Seerix makes zero assumptions about your business type; every diagnosis is built from your data. It works best with a few months of Search Console history so answers can be evidence-based.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Not yet. We're onboarding a limited group of design partners and working closely with each of them. Email hello@seerix.ai to join the early-access list; there's no credit card required to join, and paid plans can be cancelled anytime.",
  },
];

export default function Faq() {
  // All questions start collapsed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white px-6 pb-12 pt-20">
      <SectionLabel number="04" name="FAQ" />


      <div className="mx-auto mt-10 max-w-5xl">
        <span className="relative inline-flex items-center bg-[#36363B]/[0.07] px-5 py-3 font-mono text-[13px] font-medium tracking-[0.18em] text-[#23232a]">
          {/* Corner brackets: two edges each, drawn per corner. */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#36363B]/45" />

          FAQ
        </span>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16">
          <h2 className="font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
            <BlockReveal>Fair questions.</BlockReveal>
          </h2>
          <p className="max-w-md self-start font-body text-[15px] leading-relaxed text-zinc-500 md:pt-2">
            Everything about Google permissions, how your data is handled,
            and why the answers can&rsquo;t make things up about your site.
          </p>
        </div>

        <div className="mt-16">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border-b border-black/10"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-[17px] tracking-[-0.01em] text-black transition-colors duration-200 hover:text-zinc-600"
                >
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="relative h-4 w-4 shrink-0 text-zinc-400"
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
                    {/* The tint lands on the answer alone, once revealed. */}
                    <div className="mb-6 rounded-lg bg-[#36363B]/[0.07] px-5 py-4">
                      <p className="max-w-2xl font-body text-[15px] leading-relaxed text-zinc-600">
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
    </section>
  );
}
