import Link from "next/link";

import SectionHeader from "@/components/new-landing/section-header";

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
    <section id="trust" className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Why trust it"
          heading="Built so it can't make things up about your site."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-black/[0.07] bg-white p-7 transition-colors duration-200 hover:border-black/[0.14]"
            >
              <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-black">
                {pillar.title}
              </h3>
              <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-500">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#"
          className="group mt-10 inline-flex items-center gap-2 font-body text-[15px] text-zinc-500 transition-colors duration-200 hover:text-black"
        >
          Privacy Policy
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
    </section>
  );
}
