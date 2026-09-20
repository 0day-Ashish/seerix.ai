/**
 * The rule that closes a section.
 *
 * It sits in the page between sections rather than on the sections themselves,
 * so a section carries no opinion about what follows it and the last one
 * before the footer simply has no divider after it.
 *
 * Inset to the same max-w-7xl column the sections use and held to the page
 * gutter, so it stops short of the viewport edges rather than running the full
 * width of the screen.
 */
export default function SectionDivider() {
  return (
    <div className="px-6" aria-hidden="true">
      <div className="mx-auto h-px max-w-7xl bg-black/[0.07]" />
    </div>
  );
}
