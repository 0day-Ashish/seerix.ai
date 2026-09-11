type SectionLabelProps = {
  /** Two-digit section number, e.g. "01". */
  number: string;
  name: string;
  /** Drop the top rule where the preceding section already draws one. */
  hideTopBorder?: boolean;
};

/**
 * Sticky section marker that parks under the navbar while its section is in
 * view. Each label sticks within its own section, so the next one pushes the
 * previous up on scroll with no JavaScript.
 *
 * The rails sit at the max-w-6xl container's padding edge, so the bar pulls out
 * by that padding to meet them exactly, then re-applies it to the content.
 */
export default function SectionLabel({
  number,
  name,
  hideTopBorder = false,
}: SectionLabelProps) {
  return (
    <div className="sticky top-16 z-20 mb-10">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`-mx-6 flex items-center gap-3 border-b border-black/10 bg-white/90 px-6 py-3 backdrop-blur-sm ${
            hideTopBorder ? "" : "border-t"
          }`}
        >
          <span className="font-display text-[13px] font-medium tracking-[0.1em] text-[#36363B]">
            {number}
          </span>
          <span className="h-3 w-px bg-black/15" />
          <span className="font-display text-[13px] font-medium tracking-[0.1em] text-black">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}
