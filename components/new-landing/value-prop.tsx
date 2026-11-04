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
type Column = {
  job: string;
  summary: string;
  href: string;
  tile: string;
  items: Item[];
};

/**
 * One soft tint per job, so a column's tiles read as a set: the signal tint
 * leads, the rest are quiet companions to it on the dark ground.
 */
const columns: Column[] = [
  {
    job: "Diagnose",
    summary: "Why traffic moved, with the evidence behind it.",
    href: "/product/diagnose",
    tile: "bg-[#e3e2fb] text-[#2f2d8a]",
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
    summary: "Fixes ranked by impact against effort.",
    href: "/product/prioritize",
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
    summary: "SERPs and competitors, checked every day.",
    href: "/product/watch",
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
    summary: "Titles, metas and briefs, drafted from what ranks.",
    href: "/product/create",
    tile: "bg-[#f6efb6] text-[#5a4a07]",
    items: [
      { label: "Title rewrites", icon: "title" },
      { label: "Meta descriptions", icon: "text" },
      { label: "Guideline citations", icon: "quote" },
      { label: "Content briefs", icon: "brief", soon: true },
    ],
  },
];

/* -------------------------------------------------------------------------
 * Section
 * ---------------------------------------------------------------------- */

/**
 * Everything Seerix does, as four frosted cards, one per job: its number, the
 * job in the display serif, a line on what it means, and the features that
 * make it up as a ruled list. Light ground, like the sections around it.
 */
export default function ValueProp() {
  return (
    <section id="features" className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl font-display text-[34px] leading-[1.15] sm:text-[44px] font-extralight tracking-[-0.03em] text-black">
          One analyst, the whole SEO job.
        </h2>
        <p className="mt-5 max-w-2xl font-body text-[17px] leading-[1.6] text-zinc-600">
          Four jobs a consultant does: automated, continuous, and backed by
          evidence. This is where the hero&rsquo;s question becomes a working
          relationship.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, i) => (
            <Link
              key={column.job}
              href={column.href}
              className="frost group flex flex-col rounded-[24px] p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-zinc-400">
                  0{i + 1}
                </span>
                <span className="text-zinc-400 transition-colors group-hover:text-black">
                  <Arrow />
                </span>
              </span>
              <span className="mt-6 font-display text-[30px] font-extralight leading-none tracking-[-0.03em] text-black">
                {column.job}
              </span>
              <span className="mt-3 font-body text-[14.5px] leading-[1.5] text-zinc-500">
                {column.summary}
              </span>

              <ul className="mt-6 border-t border-black/[0.07]">
                {column.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 border-b border-black/[0.06] py-2.5 last:border-b-0"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${column.tile}`}
                    >
                      <Icon name={item.icon} />
                    </span>
                    <span className="min-w-0 flex-1 font-body text-[14px] text-zinc-800">
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="rounded-md bg-signal-soft px-1.5 py-px font-body text-[11px] text-signal-deep">
                        Soon
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
