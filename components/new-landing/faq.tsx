"use client";

import Link from "next/link";
import { useState } from "react";

import GradientWash from "@/components/new-landing/gradient-wash";

type Faq = {
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    question: "Isn't this just ChatGPT with my data pasted in?",
    answer:
      "No, and the difference is structural. A chat model has no memory of your site, no crawler, no rank history and no way to check its own claims. Seerix keeps sixteen months of your Search Console history reconciled to GSC's own reporting days, runs its own crawler, snapshots your SERPs over time, and rejects any answer that cites evidence it doesn't hold. Then it does the one thing no chat window can: it comes back weeks later and measures whether the fix worked.",
  },
  {
    question: "What permissions does Seerix have on my Google account?",
    answer:
      "Read-only, and only what you explicitly grant: basic sign-in identity (email, profile) and read-only Search Console access for the properties you connect. Seerix can never modify anything in your Google account: no settings, no properties, no data. You can revoke access at any time from your Google Account permissions page, effective immediately.",
  },
  {
    question: "Won't the AI hallucinate about my site?",
    answer:
      "This is the core of how Seerix is engineered. The AI never browses or free-associates. It only sees structured evidence packets built from your actual data, and every claim must cite specific evidence rows. Answers citing evidence that doesn't exist are rejected by validators before you see them. When data can't support a conclusion, Seerix lowers its confidence score and says so in plain language.",
  },
  {
    question: "How long before Seerix has anything useful to say?",
    answer:
      "The first read-only sign-in pulls up to sixteen months of Search Console history, so the initial diagnoses land within the first crawl rather than after a warm-up period. Week-over-week comparisons and 'did my fix work?' verification need a little runtime on top of that, since they measure change after the moment you made it.",
  },
  {
    question: "What kinds of sites does it work for?",
    answer:
      "Any vertical (SaaS, e-commerce, content, local services) and any of 15 country/language markets, configured per site. Seerix makes zero assumptions about your business type; every diagnosis is built from your data. Diagnosis starts on day one from your imported history; fix verification and week-over-week trends build up over the following weeks, since they measure change after the moment you made it.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Not yet. Seerix hasn't launched. Join the waitlist and you'll get one email when it's live; no card, no spam. Paid plans will be cancellable anytime.",
  },
];

export default function Faq() {
  // All questions start collapsed.
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          {/* Heading and the way out park beside the list. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] font-light tracking-[-0.02em] text-black">
              What people ask first.
            </h2>
            <p className="mt-5 font-body text-[17px] leading-[1.6] text-zinc-600">
              How it differs from a chatbot, what it can touch in your Google
              account, and when it&rsquo;s ready.
            </p>

            {/* The way out when the list doesn't have it: drawn as the
                product's own question bar, routed to a person, on the same
                moving wash as the industries panel. */}
            <Link
              href="/contact"
              className="group relative isolate mt-10 block overflow-hidden rounded-2xl p-5 shadow-[0_20px_50px_-28px_rgba(40,25,110,0.45)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <GradientWash offset={4} className="-z-10" />
              <p className="font-body text-[13px] text-zinc-800">
                Not on the list?
              </p>
              <span className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white/80 px-4 py-3 ring-1 ring-black/[0.06] backdrop-blur-sm">
                <span className="font-body text-[14px] text-zinc-700">
                  Ask the people who built it
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-signal-ink text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </span>
              <p className="mt-3 font-mono text-[11px] text-zinc-700">
                a person replies within one business day
              </p>
            </Link>
          </div>

          <div className="border-t border-black/[0.07]">
            {faqs.map((faq) => {
              const isOpen = open === faq.question;
              const id = `faq-panel-${faqs.indexOf(faq)}`;
              return (
                <div key={faq.question}>
                  <div className="border-b border-black/[0.07]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : faq.question)}
                      className="group flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left font-body text-[18px] leading-snug text-black transition-colors duration-200 hover:text-zinc-600"
                    >
                      <span className="flex gap-4">
                        {/* A signal rule marks the open question. */}
                        <span
                          aria-hidden="true"
                          className={`mt-1 w-[2px] shrink-0 self-stretch rounded-full transition-colors duration-300 ${
                            isOpen ? "bg-signal-bright" : "bg-transparent"
                          }`}
                        />
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                          isOpen
                            ? "border-signal-bright bg-signal-bright text-signal-ink"
                            : "border-black/[0.12] text-zinc-500 group-hover:border-black/[0.3] group-hover:text-black"
                        }`}
                      >
                        <span className="absolute h-px w-2.5 bg-current" />
                        <span
                          className={`absolute h-2.5 w-px bg-current transition-transform duration-300 ease-out ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>

                    {/* grid-template-rows animates where height:auto cannot. */}
                    <div
                      id={id}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pl-[18px] pr-10 font-body text-[16px] leading-[1.7] text-zinc-500">
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
