import Link from "next/link";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type Pillar = {
  title: string;
  body: string;
};

const pillars: Pillar[] = [
  {
    title: "Cited, or rejected",
    body: "The AI only reasons over evidence assembled from your actual data. Answers citing evidence that doesn't exist are automatically thrown away before you see them.",
  },
  {
    title: "Honest confidence",
    body: "Short history? Thin data? Confidence drops and Seerix says why. It never rounds uncertainty up to sound smart, and 'I don't know yet' is an answer it's allowed to give.",
  },
  {
    title: "Private by design",
    body: "Read-only Google access, revocable anytime. Encrypted tokens, isolated per-customer data, no selling, no cross-customer sharing, no model training on your data.",
  },
];

export default function Trust() {
  return (
    <section id="trust" className="bg-white px-6 pb-12 pt-20">
      <SectionLabel number="04" name="WHY TRUST IT" />

      <div className="mx-auto mt-10 max-w-5xl">
        <span className="relative inline-flex items-center bg-[#36363B]/[0.07] px-5 py-3 font-mono text-[13px] font-medium tracking-[0.18em] text-[#23232a]">
          {/* Corner brackets: two edges each, drawn per corner. */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#36363B]/45" />

          WHY TRUST IT
        </span>

        <div className="mt-10">
          <h2 className="max-w-3xl font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
            <BlockReveal>
              Built so it can&rsquo;t make things up about your site.
            </BlockReveal>
          </h2>
        </div>

        <div className="mt-16 grid overflow-hidden rounded-xl border border-black/10 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="border-b border-r border-black/10 p-8 last:border-b-0 last:border-r-0 lg:border-b-0 lg:[&:nth-child(3n)]:border-r-0"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight text-black">
                {pillar.title}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-zinc-600">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#"
          className="group mt-8 inline-flex items-center gap-2 font-body text-[15px] text-zinc-700 transition-colors duration-200 hover:text-black"
        >
          Privacy Policy
          <svg
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
