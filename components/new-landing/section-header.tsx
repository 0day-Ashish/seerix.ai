import { BlockReveal } from "@/components/new-landing/block-reveal";
import SectionLabel from "@/components/new-landing/section-label";

type SectionHeaderProps = {
  /** Eyebrow above the heading. */
  label: string;
  heading: string;
  /** Optional lede, set below the heading at a narrow measure. */
  lede?: string;
};

/**
 * The eyebrow / heading / lede stack every section opens with. Left-aligned and
 * stacked rather than the earlier two-column split, so all sections share one
 * rhythm.
 */
export default function SectionHeader({
  label,
  heading,
  lede,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <SectionLabel name={label} />
      <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[40px]">
        <BlockReveal>{heading}</BlockReveal>
      </h2>
      {lede && (
        <p className="mt-5 max-w-xl font-body text-[16px] leading-[1.6] text-zinc-500">
          {lede}
        </p>
      )}
    </div>
  );
}
