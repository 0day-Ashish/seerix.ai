/**
 * Two rows of oversized text running under the hero, in opposite directions.
 *
 * One phrase in three voices -- caps in the display face, lowercase in the
 * body face, then caps again in the quiet grey -- on the page's own white.
 * It repeats until it fills the row and then once more, so the loop can
 * restart at the halfway point with no visible seam. Pure CSS: the keyframe lives in globals.css, and the global
 * reduced-motion rule stops both rows.
 */

const phrase = [
  { text: "YOUR DATA", tone: "font-display font-medium uppercase text-black" },
  { text: "explained", tone: "font-body text-black" },
  { text: "WITH RECEIPTS", tone: "font-display font-medium uppercase text-[#888084]" },
];

/** Enough repeats that the row is wider than any viewport before it loops. */
const REPEATS = 4;

function Row({ reverse = false }: { reverse?: boolean }) {
  const run = Array.from({ length: REPEATS }, () => phrase).flat();

  return (
    <div className="flex overflow-hidden">
      {/* Two identical halves; the animation travels exactly one half. */}
      {[0, 1].map((half) => (
        <div
          key={half}
          aria-hidden={half === 1}
          className="flex shrink-0 items-baseline gap-[0.45em] pr-[0.45em] will-change-transform"
          style={{
            animation: `seerix-marquee 48s linear infinite${reverse ? " reverse" : ""}`,
          }}
        >
          {run.map((word, i) => (
            <span
              key={i}
              className={`whitespace-nowrap text-[clamp(56px,7.2vw,132px)] leading-none tracking-[-0.03em] ${word.tone}`}
            >
              {word.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="Your data, explained, with receipts"
      className="overflow-hidden bg-white py-16 sm:py-20"
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
