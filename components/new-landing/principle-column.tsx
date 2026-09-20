import type { ReactNode } from "react";

type PrincipleColumnProps = {
  title: string;
  body: string;
  /** Decorative diagram sitting above the title. */
  visual: ReactNode;
};

/**
 * One column of the principles grid: a diagram, then the claim and the
 * paragraph backing it. The visual sits in a fixed-height frame so all three
 * columns share a title baseline regardless of how each drawing fills it.
 */
export default function PrincipleColumn({
  title,
  body,
  visual,
}: PrincipleColumnProps) {
  return (
    <div>
      <div className="flex h-[160px] items-center justify-center overflow-hidden rounded-xl border border-black/[0.07] bg-[#fafafa] px-6">
        {visual}
      </div>

      <h3 className="mt-6 font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-black">
        {title}
      </h3>
      <p className="mt-3 font-body text-[15px] leading-[1.65] text-zinc-500">
        {body}
      </p>
    </div>
  );
}
