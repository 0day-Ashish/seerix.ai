import Image from "next/image";
import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type Card = {
  title: string;
  body: string;
  /** Swap in the gradient art when it's ready. */
  image?: string;
  /** Placeholder tint until the image lands. */
  tint: string;
};

const cards: Card[] = [
  {
    title: "Diagnose: know exactly why traffic changed",
    body: "Seerix separates rankings, demand and click-through effects, and checks every Google update against your timeline. Ask about any page and get its specific story.",
    tint: "bg-gradient-to-br from-[#DCDDDD] via-[#a8a2a6] to-[#36363B]",
  },
  {
    title: "Prioritize: a fix list that's actually a list",
    body: "Every finding is scored by impact × effort × confidence. Striking-distance keywords at positions 6–15, plus cannibalization where your own pages compete.",
    tint: "bg-gradient-to-br from-[#c4c5c6] via-[#888084] to-[#2b2b30]",
  },
  {
    title: "Watch: it notices before your revenue does",
    body: "Competitor SERP movement, a weekly report with real-time alerts, and outcome verification: mark a fix as done and Seerix watches whether it worked.",
    tint: "bg-gradient-to-br from-[#cfd0d0] via-[#948d91] to-[#42424a]",
  },
  {
    title: "Create: the last mile, it writes with rules",
    body: "Titles and meta descriptions in three variants, generated against your page's real queries. Every suggestion cites the exact guideline it followed.",
    tint: "bg-gradient-to-br from-[#e2e3e3] via-[#9a9498] to-[#303036]",
  },
];

export default function ValueProp() {
  return (
    <section id="features" className="bg-white px-6 pb-12 pt-20">
      <SectionLabel number="03" name="WHAT SEERIX DOES" />


      <div className="mx-auto mt-10 max-w-5xl">
        <span className="relative inline-flex items-center bg-[#36363B]/[0.07] px-5 py-3 font-mono text-[13px] font-medium tracking-[0.18em] text-[#23232a]">
          {/* Corner brackets: two edges each, drawn per corner. */}
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#36363B]/45" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#36363B]/45" />

          WHAT SEERIX DOES
        </span>

        <div className="mt-10">
          <h2 className="max-w-3xl font-display text-4xl leading-[1.15] tracking-[-0.02em] text-black sm:text-5xl">
            <BlockReveal>Four jobs a consultant does. Automated, with evidence.</BlockReveal>
          </h2>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article key={card.title}>
              <div
                className={`relative aspect-[4/5] w-full overflow-hidden rounded-lg ${card.tint}`}
              >
                {card.image && (
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
              </div>

              <h3 className="mt-5 font-body text-[17px] text-black">
                {card.title}
              </h3>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-zinc-500">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
