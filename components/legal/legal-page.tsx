import Link from "next/link";

import LegalContents from "@/components/legal/legal-contents";

import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

export type LegalSection = {
  heading: string;
  /** Each entry is one paragraph. */
  body: string[];
  /** Optional bulleted run, set after the paragraphs. */
  list?: string[];
};

type LegalPageProps = {
  label: string;
  title: string;
  lede: string;
  /** Display date, e.g. "20 September 2026". */
  updated: string;
  sections: LegalSection[];
};

function slug(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * The shared shell for the three legal routes. They differ only in their
 * sections, so the contents rail, measure and heading rhythm live here rather
 * than being spelled out three times.
 */
export default function LegalPage({
  label,
  title,
  lede,
  updated,
  sections,
}: LegalPageProps) {
  return (
    <section className="bg-white px-6 pb-20 pt-16 sm:pb-24 sm:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <SectionLabel name={label} />
          <h1 className="mt-4 font-display text-[36px] font-medium leading-[1.1] tracking-[-0.035em] text-black sm:text-[46px]">
            <BlockReveal>{title}</BlockReveal>
          </h1>
          <p className="mt-5 font-body text-[17px] leading-[1.6] text-zinc-500">
            {lede}
          </p>
          <p className="mt-6 font-mono text-[13px] uppercase tracking-[0.06em] text-zinc-400">
            Last updated {updated}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
          {/* Contents rail, pinned under the navbar on wide screens. Marks the
              section being read, so it is a client component. */}
          <LegalContents
            items={sections.map((section) => ({
              slug: slug(section.heading),
              heading: section.heading,
            }))}
          />

          <div className="max-w-2xl">
            {sections.map((section) => (
              <section
                key={section.heading}
                id={slug(section.heading)}
                // Clears the sticky navbar when jumped to from the rail.
                className="scroll-mt-28 border-b border-black/[0.07] pb-8 pt-8 first:pt-0 last:border-b-0"
              >
                <h2 className="font-display text-[22px] font-medium leading-[1.25] tracking-[-0.02em] text-black">
                  {section.heading}
                </h2>

                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 font-body text-[16px] leading-[1.7] text-zinc-500"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-zinc-300"
                        />
                        <span className="font-body text-[16px] leading-[1.7] text-zinc-500">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <p className="mt-10 font-body text-[15px] leading-[1.7] text-zinc-400">
              Questions about any of this? Write to{" "}
              <Link
                href="mailto:hello@seerix.ai"
                className="text-black underline underline-offset-4 transition-colors duration-200 hover:text-zinc-500"
              >
                hello@seerix.ai
              </Link>{" "}
              or use the{" "}
              <Link
                href="/contact"
                className="text-black underline underline-offset-4 transition-colors duration-200 hover:text-zinc-500"
              >
                contact form
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
