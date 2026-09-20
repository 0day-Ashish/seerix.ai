import type { ReactNode } from "react";

import SectionHeader from "@/components/new-landing/section-header";
import {
  CreateVisual,
  DiagnoseVisual,
  PrioritizeVisual,
  WatchVisual,
} from "@/components/new-landing/value-prop-visuals";

type Card = {
  title: string;
  body: string;
  /** Soft wash the visual sits on. */
  tint: string;
  /** Where the tile sits in the bento at lg; below that they stack. */
  area: string;
  /** The lead tile carries more weight than the three beside it. */
  featured?: boolean;
  /** The tile's own 3D drawing. */
  visual: ReactNode;
};

/**
 * The four sit in a bento rather than four equal columns: Diagnose is the job
 * the product is bought for, so it takes the tall lead tile, Prioritize and
 * Watch stack beside it, and Create runs full width underneath as the last
 * mile it describes.
 *
 * Each tile carries its own isometric drawing of what the job produces, so the
 * section shows the four jobs rather than listing them.
 */
const cards: Card[] = [
  {
    title: "Diagnose: know exactly why traffic changed",
    body: "Rankings, demand and click-through separated, every Google update checked against your timeline.",
    tint: "bg-[radial-gradient(120%_100%_at_20%_15%,#f4f4f5_0%,#e6e6e7_45%,#cfcfd2_100%)]",
    area: "lg:col-span-2 lg:row-span-2",
    featured: true,
    visual: <DiagnoseVisual />,
  },
  {
    title: "Prioritize: a fix list that's actually a list",
    body: "Every finding scored by impact × effort × confidence.",
    tint: "bg-[radial-gradient(120%_100%_at_80%_20%,#f2f2f3_0%,#e0dfe1_45%,#c7c5c9_100%)]",
    area: "lg:col-span-2",
    visual: <PrioritizeVisual />,
  },
  {
    title: "Create: the last mile, it writes with rules",
    body: "Titles and meta descriptions in three variants, each citing the guideline it followed.",
    tint: "bg-[radial-gradient(120%_100%_at_25%_85%,#f3f3f4_0%,#e3e2e4_45%,#cac8cc_100%)]",
    area: "lg:col-span-2",
    visual: <CreateVisual />,
  },
  {
    title: "Watch: it notices before your revenue does",
    body: "Competitor movement, real-time alerts, and fixes verified after you ship them.",
    tint: "bg-[radial-gradient(120%_100%_at_75%_80%,#f4f4f4_0%,#e4e3e5_45%,#cdcbcf_100%)]",
    area: "lg:col-span-4",
    visual: <WatchVisual />,
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
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:auto-rows-[15rem] lg:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className={`group relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-2xl border border-black/[0.06] p-7 transition-colors duration-200 hover:border-black/[0.14] lg:min-h-0 ${card.tint} ${card.area}`}
            >
              {card.visual}

              {/* Scrim: lifts the copy clear of the drawing behind it. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/95 via-white/70 to-transparent" />

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
