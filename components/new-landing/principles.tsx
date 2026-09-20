import type { ReactNode } from "react";

import PrincipleColumn from "@/components/new-landing/principle-column";
import {
  AnswerVisual,
  EvidenceVisual,
  OwnDataVisual,
} from "@/components/new-landing/principle-visuals";

type Principle = {
  title: string;
  body: string;
  visual: ReactNode;
};

/**
 * The three claims the product rests on, stated before any feature detail so a
 * reader knows what kind of tool this is: whose data it uses, what it hands
 * back, and why the answer can be checked. Each column's diagram draws the
 * mechanism its paragraph describes.
 */
const principles: Principle[] = [
  {
    title: "Built on your own data",
    body: "Seerix reads your Search Console history rather than a third-party index, so every number it shows is the one Google already has on your site.",
    visual: <OwnDataVisual />,
  },
  {
    title: "An answer, not a dashboard",
    body: "Instead of handing you charts to interpret, it states what changed, why it changed, and what to do about it, in a sentence you can act on.",
    visual: <AnswerVisual />,
  },
  {
    title: "Evidence attached",
    body: "Every diagnosis carries the data that produced it and an honest confidence score, so you can check the reasoning instead of trusting it blindly.",
    visual: <EvidenceVisual />,
  },
];

export default function Principles() {
  return (
    <section id="principles" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* The hairline is the section's only divider: it separates these
            columns from whatever sits above without adding a heading. */}
        <div className="grid gap-x-8 gap-y-12 border-t border-black/[0.07] pt-10 sm:grid-cols-3">
          {principles.map((principle) => (
            <PrincipleColumn
              key={principle.title}
              title={principle.title}
              body={principle.body}
              visual={principle.visual}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
