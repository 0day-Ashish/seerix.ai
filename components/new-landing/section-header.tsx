import { BlockReveal } from "@/components/new-landing/block-reveal";

type SectionHeaderProps = {
  heading: string;
  /** Optional lede, set below the heading at a narrow measure. */
  lede?: string;
};

/**
 * The heading / lede stack every section opens with. The heading carries a
 * signal bar beside its first line (.heading-mark) in place of an eyebrow. Left-aligned and
 * stacked rather than the earlier two-column split, so all sections share one
 * rhythm.
 */
export default function SectionHeader({
  heading,
  lede,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="heading-mark font-display text-[36px] font-medium leading-[1.15] tracking-[-0.03em] text-black sm:text-[50px] lg:text-[56px]">
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
