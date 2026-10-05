type SeerixMarkProps = {
  /** Rendered size in px; the mark is square. */
  size?: number;
  /** Ink for light grounds, white for dark ones. The signal pixel is fixed. */
  tone?: "ink" | "white";
  /** Draw itself in once, on load. */
  animated?: boolean;
  className?: string;
};

/**
 * The Seerix mark: one continuous, square-cornered S drawn out of a single
 * signal pixel.
 *
 * The pixel is the finding -- the one thing the product flags -- and the S is
 * the line of reasoning that runs from it. Animated, the pixel lands first and
 * the S draws out of it; the keyframes live in globals.css (.seerix-mark), so
 * this stays a server component, and the reduced-motion rule makes the
 * draw instant.
 */
export default function SeerixMark({
  size = 32,
  tone = "ink",
  animated = true,
  className = "",
}: SeerixMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`${animated ? "seerix-mark" : ""} ${className}`}
    >
      <path
        className="seerix-mark-stroke"
        d="M21 7H8.6V17.5H23.4V28H8"
        stroke={tone === "ink" ? "#1c1c21" : "#ffffff"}
        strokeWidth="4.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
      />
      <rect
        className="seerix-mark-pixel"
        x="24.6"
        y="4.7"
        width="4.6"
        height="4.6"
        fill="var(--color-signal)"
      />
    </svg>
  );
}
