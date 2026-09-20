import Image from "next/image";
import SectionHeader from "@/components/new-landing/section-header";

type Card = {
  title: string;
  body: string;
  /** Swap in the real art when it's ready. */
  image?: string;
  /** Placeholder tint until the image lands. */
  tint: string;
  /** Where the tile sits in the bento at lg; below that they stack. */
  area: string;
  /** The lead tile carries more weight than the three beside it. */
  featured?: boolean;
};

/**
 * Tints are soft, closely-related washes off the brand greys rather than the
 * earlier full-contrast gradients, so they read as deliberate art instead of a
 * missing image.
 *
 * The four sit in a bento rather than four equal columns: Diagnose is the job
 * the product is bought for, so it takes the tall lead tile, Prioritize and
 * Watch stack beside it, and Create runs full width underneath as the last
 * mile it describes.
 */
const cards: Card[] = [
  {
    title: "Diagnose: know exactly why traffic changed",
    body: "Seerix separates rankings, demand and click-through effects, and checks every Google update against your timeline. Ask about any page and get its specific story.",
    tint: "bg-[radial-gradient(120%_100%_at_20%_15%,#f4f4f5_0%,#e6e6e7_45%,#cfcfd2_100%)]",
    area: "lg:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    title: "Prioritize: a fix list that's actually a list",
    body: "Every finding is scored by impact × effort × confidence. Striking-distance keywords at positions 6–15, plus cannibalization where your own pages compete.",
    tint: "bg-[radial-gradient(120%_100%_at_80%_20%,#f2f2f3_0%,#e0dfe1_45%,#c7c5c9_100%)]",
    area: "lg:col-span-2",
  },
  {
    title: "Watch: it notices before your revenue does",
    body: "Competitor SERP movement, a weekly report with real-time alerts, and outcome verification: mark a fix as done and Seerix watches whether it worked.",
    tint: "bg-[radial-gradient(120%_100%_at_25%_85%,#f3f3f4_0%,#e3e2e4_45%,#cac8cc_100%)]",
    area: "lg:col-span-2",
  },
  {
    title: "Create: the last mile, it writes with rules",
    body: "Titles and meta descriptions in three variants, generated against your page's real queries. Every suggestion cites the exact guideline it followed.",
    tint: "bg-[radial-gradient(120%_100%_at_75%_80%,#f4f4f4_0%,#e4e3e5_45%,#cdcbcf_100%)]",
    area: "lg:col-span-4",
  },
];

export default function ValueProp() {
  return (
    <section id="features" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="What Seerix does"
          heading="Four jobs a consultant does. Automated, with evidence."
        />

        {/* Bento: one column on mobile, two at sm, and a four-column track at
            lg where the tiles take their real spans. Rows are sized rather
            than auto so the lead tile's double row reads as deliberate. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[15rem]">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-2xl border border-black/[0.06] p-7 transition-colors duration-200 hover:border-black/[0.14] lg:min-h-0 ${card.tint} ${card.area}`}
            >
              {card.image && (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                />
              )}

              {/* Scrim: keeps the copy legible once real art replaces the
                  tint, and is invisible against the flat washes today. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/85 via-white/45 to-transparent" />

              <div className="relative max-w-md">
                <h3
                  className={`font-display font-medium leading-snug tracking-[-0.02em] text-black ${
                    card.featured ? "text-[22px]" : "text-[17px]"
                  }`}
                >
                  {card.title}
                </h3>
                <p className="mt-2 font-body text-[14px] leading-[1.65] text-zinc-600">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
