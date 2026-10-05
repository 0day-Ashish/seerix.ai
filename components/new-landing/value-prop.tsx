import Link from "next/link";

/* -------------------------------------------------------------------------
 * Icons: one small stroke set, 16px grid, drawn for this section only.
 * ---------------------------------------------------------------------- */

const icons = {
  drop: "M2.5 4.5l4 4 2.5-2.5 4.5 4.5M10 10.5h3.5V7",
  layers: "M8 2.5l5.5 3L8 8.5 2.5 5.5 8 2.5zM2.5 8.5l5.5 3 5.5-3",
  split: "M8 13.5V8m0 0L3.5 3.5M8 8l4.5-4.5M2.5 6V3.5H5M11 3.5h2.5V6",
  cursor: "M4 3l8 4-3.5 1L7 11.5 4 3z",
  copy: "M5.5 5.5h7v7h-7zM3.5 10.5v-7h7",
  score: "M3 12.5V9m3.5 3.5V6.5M10 12.5V4M13.5 12.5V7.5",
  target:
    "M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  link: "M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1",
  clock: "M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 5v3l2 1.5",
  list: "M6 4.5h7.5M6 8h7.5M6 11.5h7.5M2.5 4.5h.5M2.5 8h.5M2.5 11.5h.5",
  camera:
    "M2.5 5.5h2l1-1.5h5l1 1.5h2v7h-11zM8 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  radar: "M8 8l4-4M8 13.5a5.5 5.5 0 1 1 5.5-5.5M8 10.5A2.5 2.5 0 1 1 10.5 8",
  bell: "M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3L4 11zM6.5 13.5h3",
  report: "M4 2.5h6l2.5 2.5v8.5H4zM6.5 8h4M6.5 10.5h4M6.5 5.5h1.5",
  check:
    "M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM5.5 8.2l1.8 1.8 3.3-3.6",
  title: "M3 4h10M8 4v8.5M5.5 12.5h5",
  text: "M3 4.5h10M3 8h10M3 11.5h6",
  quote: "M4 5.5h3v3l-1.5 2.5M9 5.5h3v3l-1.5 2.5",
  brief: "M3.5 5h9v8h-9zM6 5V3.5h4V5M3.5 8.5h9",
  db: "M8 5c3 0 5-.9 5-2s-2-2-5-2-5 .9-5 2 2 2 5 2zM3 3v10c0 1.1 2 2 5 2s5-.9 5-2V3M3 8c0 1.1 2 2 5 2s5-.9 5-2",
  bot: "M4 6h8v6.5H4zM8 6V3.5M6 9h.5M9.5 9h.5M2.5 9v1.5M13.5 9v1.5",
  shield:
    "M8 2.5l5 2v3.5c0 3-2.2 5-5 6-2.8-1-5-3-5-6V4.5l5-2zM6 8l1.5 1.5L10.5 6.5",
  gauge: "M2.5 11a5.5 5.5 0 0 1 11 0M8 11l2.5-3",
  lock: "M4.5 7.5h7v5.5h-7zM6 7.5V5.5a2 2 0 0 1 4 0v2",
  chat: "M3 4h10v6.5H7l-3 2.5v-2.5H3z",
} as const;

type IconName = keyof typeof icons;

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * Content
 * ---------------------------------------------------------------------- */

type Item = { label: string; icon: IconName; soon?: boolean };
type Column = { job: string; href: string; tile: string; items: Item[] };

/**
 * One soft tint per job, so a column's tiles read as a set: the signal tint
 * leads, the rest are quiet companions to it on the dark ground.
 */
const columns: Column[] = [
  {
    job: "Diagnose",
    href: "/#how-it-works",
    tile: "bg-[#ffd9c7] text-[#7a2a08]",
    items: [
      { label: "Traffic-drop diagnosis", icon: "drop" },
      { label: "Algorithm update check", icon: "layers" },
      { label: "Demand vs. ranking split", icon: "split" },
      { label: "Click-through analysis", icon: "cursor" },
      { label: "Cannibalization", icon: "copy" },
    ],
  },
  {
    job: "Prioritize",
    href: "/#how-it-works",
    tile: "bg-[#f3d6e4] text-[#6b1f43]",
    items: [
      { label: "Impact × effort scoring", icon: "score" },
      { label: "Striking-distance keywords", icon: "target" },
      { label: "Internal link gaps", icon: "link" },
      { label: "Content decay", icon: "clock" },
      { label: "Fix list export", icon: "list", soon: true },
    ],
  },
  {
    job: "Watch",
    href: "/#how-it-works",
    tile: "bg-[#cfeee0] text-[#14503a]",
    items: [
      { label: "SERP snapshots", icon: "camera" },
      { label: "Competitor tracking", icon: "radar" },
      { label: "Real-time alerts", icon: "bell" },
      { label: "Weekly report", icon: "report" },
      { label: "Fix verification", icon: "check" },
    ],
  },
  {
    job: "Create",
    href: "/#how-it-works",
    tile: "bg-[#f6efb6] text-[#5a4a07]",
    items: [
      { label: "Title rewrites", icon: "title" },
      { label: "Meta descriptions", icon: "text" },
      { label: "Guideline citations", icon: "quote" },
      { label: "Content briefs", icon: "brief", soon: true },
    ],
  },
];

const foundation: Item[] = [
  { label: "Search Console sync", icon: "db" },
  { label: "SeerixBot crawler", icon: "bot" },
  { label: "Evidence validator", icon: "shield" },
  { label: "Confidence scoring", icon: "gauge" },
  { label: "Per-site isolation", icon: "lock" },
  { label: "Ask Seerix", icon: "chat" },
];

/* -------------------------------------------------------------------------
 * Dithered blocks: the pixel texture in the top-right corner, built from
 * repeating gradients rather than an image so it stays crisp at any size.
 * ---------------------------------------------------------------------- */

const dither = {
  fine: "bg-[radial-gradient(#ffffff_0.9px,transparent_1.1px)] [background-size:4px_4px]",
  checker:
    "bg-[conic-gradient(#ffffff_25%,transparent_0_50%,#ffffff_0_75%,transparent_0)] [background-size:12px_12px]",
  small:
    "bg-[conic-gradient(#ffffff_25%,transparent_0_50%,#ffffff_0_75%,transparent_0)] [background-size:6px_6px]",
};

/**
 * Drawn once and placed twice, facing the same way both times: hanging from
 * the section's top edge, and hanging off its bottom edge onto the white page
 * below. Outside the section it carries its own dark ground, or the white
 * pattern would vanish into the page.
 */
function DitherBlocks({ edge }: { edge: "top" | "bottom" }) {
  // On hover the composition rearranges: the white slab slides across, the
  // checker columns march, the orange block climbs the centre column and the
  // dot field brightens. Hover is on the whole strip, so it reads as one
  // object responding rather than six separate targets.
  const move = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";
  return (
    <div
      aria-hidden="true"
      className={`group/dither absolute right-0 hidden h-40 w-[46%] lg:block ${
        edge === "top" ? "top-0" : "top-full bg-[#141416]"
      }`}
    >
      <div
        className={`absolute inset-0 opacity-[0.22] ${dither.fine} ${move} group-hover/dither:opacity-40`}
      />
      <div
        className={`absolute left-[32%] top-0 h-[38%] w-[33%] bg-white ${move} group-hover/dither:left-[54%] group-hover/dither:w-[22%]`}
      />
      <div
        className={`absolute left-[10%] top-[38%] h-[62%] w-[11%] ${dither.small} ${move} group-hover/dither:top-0 group-hover/dither:h-full group-hover/dither:animate-[seerix-march_1.2s_steps(4)_infinite]`}
      />
      <div
        className={`absolute left-[43%] top-[38%] h-[62%] w-[11%] ${dither.checker} ${move} group-hover/dither:animate-[seerix-march_0.9s_steps(4)_infinite]`}
      />
      <div
        className={`absolute right-[11%] top-0 h-[38%] w-[11%] opacity-80 ${dither.small} ${move} group-hover/dither:h-full group-hover/dither:opacity-100`}
      />
      <div
        className={`absolute bottom-0 left-[43%] h-[20%] w-[11%] bg-signal ${move} group-hover/dither:h-[42%]`}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Section
 * ---------------------------------------------------------------------- */

/**
 * Everything Seerix does, as a directory rather than a set of demos: four
 * jobs across the top, each a column of the features that make it up, over
 * the foundation they all run on. Dark ground, so the section stands as the
 * product's own index between the lighter story sections around it.
 */
export default function ValueProp() {
  return (
    <section
      id="features"
      // Not overflow-hidden: the lower blocks hang outside the section. z-20
      // keeps them above the trust section, which stacks at z-10.
      className="relative z-20 bg-[#141416] px-6 pb-24 pt-24 sm:pb-28 sm:pt-32"
    >
      <DitherBlocks edge="top" />
      <DitherBlocks edge="bottom" />

      <div className="relative mx-auto max-w-7xl">
        <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-white/80">
          <span className="flex h-7 w-7 items-center justify-center bg-white text-[#141416]">
            <Icon name="db" />
          </span>
          One analyst, the whole SEO job
        </p>

        <h2 className="heading-mark mt-14 max-w-4xl font-display text-[36px] leading-[1.1] tracking-[-0.03em] text-white sm:text-[50px] lg:text-[56px]">
          <span className="font-normal">Four jobs a consultant does,</span>{" "}
          <span className="font-normal">automated and backed by evidence.</span>
        </h2>
        <p className="mt-6 max-w-2xl font-body text-[17px] leading-[1.6] text-white/75 sm:text-[19px]">
          Built on your own Search Console data, Seerix diagnoses what changed,
          ranks what to fix, watches what moves and writes the fix, with every
          answer citing the rows it came from.
        </p>

        {/* The four jobs. */}
        <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.job}>
              <Link
                href={column.href}
                className="group inline-flex items-center gap-2 font-display text-[22px] font-semibold tracking-[-0.02em] text-white"
              >
                {column.job}
                <Arrow />
              </Link>
              <ul className="mt-7 flex flex-col gap-4">
                {column.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center ${column.tile}`}
                    >
                      <Icon name={item.icon} />
                    </span>
                    <span className="font-body text-[16px] text-white/90">
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="border border-white/40 px-1.5 py-px font-mono text-[11px] tracking-[0.04em] text-white/80">
                        SOON
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The foundation they all run on. */}
        <Link
          href="/#how-it-works"
          className="group mt-20 flex items-center justify-center gap-2 bg-white/[0.06] px-6 py-5 text-center font-display text-[18px] text-white transition-colors duration-200 hover:bg-white/[0.09] sm:text-[20px]"
        >
          <span>
            <span className="font-semibold">Foundation:</span>{" "}
            <span className="text-white/85">
              one evidence layer every answer is built on
            </span>
          </span>
          <Arrow />
        </Link>

        <ul className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {foundation.map((item) => (
            <li key={item.label} className="flex items-center gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#cfe3fb] text-[#123a66]">
                <Icon name={item.icon} />
              </span>
              <span className="font-body text-[16px] leading-snug text-white/90">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
