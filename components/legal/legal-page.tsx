import Link from "next/link";

export type LegalSection = {
  heading: string;
  /** Each entry is one paragraph. */
  body: string[];
  /** Optional bulleted run, set after the paragraphs. */
  list?: string[];
};

type LegalPageProps = {
  title: string;
  lede: string;
  /** Display date, e.g. "20 September 2026". */
  updated: string;
  sections: LegalSection[];
};

/** Every legal page, for the "Related" list beside the one being read. */
const docs = [
  { href: "/privacy", title: "Privacy Policy" },
  { href: "/terms", title: "Terms of Service" },
  { href: "/seerixbot", title: "About SeerixBot" },
];

const BODY = "font-body text-[16px] leading-[28px] text-zinc-800";
const LINK =
  "text-black underline decoration-zinc-400 underline-offset-[3px] transition-colors duration-150 hover:decoration-black";

function slug(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Chevron() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3.5L10.5 8L6 12.5" />
    </svg>
  );
}

/**
 * The legal pages' one reading layout, after the tokensupply site's: a
 * "Related" list of the other legal pages on the left that stays put as you
 * read, and one 680px reading column: the title, the date in small grey, the
 * text in ink at 16px on 28px, and numbered section headings with space
 * rather than rules between them. No contents list. On a phone the related
 * list follows the text.
 */
export default function LegalPage({
  title,
  lede,
  updated,
  sections,
}: LegalPageProps) {
  const related = docs.filter((d) => d.title !== title);

  return (
    <section className="bg-ghost px-6 pb-28 pt-16 md:pt-20 lg:pb-36">
      <div className="mx-auto grid max-w-[1000px] gap-16 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-between lg:gap-12">
        <aside className="order-2 min-w-0 border-t border-black/[0.08] pt-10 lg:sticky lg:top-28 lg:order-1 lg:self-start lg:border-t-0 lg:pt-2">
          <nav aria-label="Related">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-zinc-500">
              Related
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {related.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="group inline-flex items-center gap-1 font-body text-[15px] text-zinc-600 transition-colors duration-150 hover:text-black"
                  >
                    {d.title}
                    <Chevron />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1 font-body text-[15px] text-zinc-600 transition-colors duration-150 hover:text-black"
                >
                  Contact
                  <Chevron />
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <article className="order-1 min-w-0 lg:order-2">
          <header className="flex flex-col gap-3">
            <h1 className="text-balance font-display text-[36px] font-extralight leading-[1.1] tracking-[-0.03em] text-black md:text-[44px]">
              {title}
            </h1>
            <p className="font-body text-[13px] text-zinc-500">
              Last updated on {updated}
            </p>
          </header>

          <p className={`${BODY} mt-10 text-pretty`}>{lede}</p>

          {sections.map((section, i) => (
            <section
              key={section.heading}
              id={slug(section.heading)}
              aria-labelledby={`${slug(section.heading)}-title`}
              className="mt-14 scroll-mt-28"
            >
              <h2
                id={`${slug(section.heading)}-title`}
                className="font-body text-[22px] leading-8 text-black md:text-[24px]"
              >
                {i + 1}. {section.heading}
              </h2>

              {section.body.map((paragraph) => (
                <p key={paragraph} className={`${BODY} mt-5 text-pretty`}>
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul
                  className={`${BODY} mt-5 flex list-disc flex-col gap-2.5 pl-6 marker:text-zinc-400`}
                >
                  {section.list.map((item) => (
                    <li key={item} className="pl-1 text-pretty">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section aria-labelledby="legal-contact" className="mt-14">
            <h2
              id="legal-contact"
              className="font-body text-[22px] leading-8 text-black md:text-[24px]"
            >
              {sections.length + 1}. Contact
            </h2>
            <p className={`${BODY} mt-5`}>
              Questions about any of this? Write to{" "}
              <a href="mailto:hello@seerix.ai" className={LINK}>
                hello@seerix.ai
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className={LINK}>
                contact form
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
