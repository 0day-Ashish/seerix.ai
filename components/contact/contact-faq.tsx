"use client";

import Link from "next/link";
import { useState } from "react";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type Item = { question: string; answer: string };

/**
 * About getting in touch, not about the product. The landing FAQ covers access,
 * data and how the analysis works, and the pricing FAQ covers billing; what is
 * left for this page is what happens after you press send.
 */
const faqs: Item[] = [
  {
    question: "How quickly will I hear back?",
    answer:
      "Within one business day, usually the same day if you write during European or US working hours. A real person reads it: there is no ticket queue, no autoresponder chain, and no chatbot standing between you and an answer.",
  },
  {
    question: "Can I see Seerix on my own site before I pay?",
    answer:
      "Yes, and that is the demo we prefer to give. You connect a property read-only, we walk through what Seerix found on it, and you keep the findings whether or not you go ahead. Half an hour, no deck, no canned demo site standing in for yours.",
  },
  {
    question: "I found a bug or something looks wrong in a diagnosis.",
    answer:
      "Send it with the site and the question you asked, and we will trace it back through the evidence the answer was built from. Diagnoses cite their evidence rows precisely so that this is possible. If a diagnosis was wrong, we want the case more than you want to report it.",
  },
  {
    question: "Do you do agency or multi-site arrangements?",
    answer:
      "Yes. If you are answering for a portfolio rather than one site, tell us how many properties and in which markets and we will tell you honestly whether a listed plan covers it or whether it needs a conversation.",
  },
  {
    question: "What do you do with what I send here?",
    answer:
      "We use it to answer you and nothing else. It is not added to a marketing list, not sold, and not used to train models. If you would rather not use the form, hello@seerix.ai reaches exactly the same inbox.",
  },
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="contact-faq" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel name="Before you write" />
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
              <BlockReveal>What happens after you send.</BlockReveal>
            </h2>
            <p className="mt-5 font-body text-[17px] leading-[1.6] text-zinc-500">
              Who reads it, how fast, and what we do with it.
            </p>

            <Link
              href="/#faq"
              className="group mt-6 inline-flex items-center gap-2 font-body text-[15px] text-black transition-colors duration-200 hover:text-zinc-500"
            >
              Questions about the product
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
                    aria-controls={`contact-faq-panel-${index}`}
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
                    id={`contact-faq-panel-${index}`}
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
