/**
 * Two vertical rules at the content column's edges, filling the nearest
 * positioned ancestor. Absolute (not fixed) so they span that section rather
 * than the viewport, and pointer-events-none so they never intercept clicks.
 */
export default function PageRails() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 -bottom-28 top-0 z-30 flex justify-center px-6"
      aria-hidden="true"
    >
      <div className="relative h-full w-full max-w-6xl">
        <span className="absolute inset-y-0 left-0 w-px bg-black/10" />
        <span className="absolute inset-y-0 right-0 w-px bg-black/10" />
      </div>
    </div>
  );
}
