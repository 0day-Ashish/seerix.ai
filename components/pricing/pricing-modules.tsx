import Button from "@/components/new-landing/button";

type Module = {
  name: string;
  /** What the module is metered by, if anything. */
  allowance: string;
  unit: string;
  summary: string;
  points: string[];
  visual: React.ReactNode;
};

/* Each module's output in miniature: real rows, real figures, set the
   way the product sets them. */

const card =
  "w-full max-w-[16rem] overflow-hidden rounded-xl bg-white text-left shadow-[0_10px_30px_-14px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.06]";
const mono = "font-mono text-[10.5px]";

function DiagnoseSketch() {
  const bars = [70, 74, 68, 76, 72, 78, 50, 42, 38, 40];
  return (
    <div className={card}>
      <div className="flex items-baseline justify-between border-b border-black/[0.06] px-3 py-2">
        <span className="font-body text-[11.5px] text-zinc-900">/pricing</span>
        <span className={`${mono} text-signal-deep`}>clicks −38%</span>
      </div>
      <div className="flex h-12 items-end gap-[3px] px-3 pt-3">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t-[2px] ${i > 5 ? "bg-signal" : "bg-black/[0.10]"}`}
          />
        ))}
      </div>
      <p className="m-3 mt-2.5 flex items-center gap-1.5 rounded-md bg-signal-soft px-2 py-1 font-body text-[11px] text-signal-deep">
        <span aria-hidden="true">✓</span> Title rewritten · 2 Apr
      </p>
    </div>
  );
}

function PrioritizeSketch() {
  const rows = [
    ["/integrations", 94],
    ["/blog/nextjs-seo", 88],
    ["/compare/ahrefs", 74],
    ["/templates", 61],
  ] as const;
  return (
    <div className={card}>
      {rows.map(([page, score], r) => (
        <div
          key={page}
          className="flex items-center gap-2 border-b border-black/[0.06] px-3 py-2 last:border-0"
        >
          <span className={`${mono} w-3 text-zinc-400`}>{r + 1}</span>
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-zinc-800">
            {page}
          </span>
          <span
            className={`rounded-[4px] px-1.5 py-px ${mono} ${
              r === 0 ? "bg-signal text-white" : "bg-black/[0.05] text-zinc-600"
            }`}
          >
            {score}
          </span>
        </div>
      ))}
    </div>
  );
}

function WatchSketch() {
  const alerts = [
    ["pixelforge.dev overtook you", "/pricing · today", true],
    ["Position 4 → 11", "/features · 2 Apr", false],
    ["Fix verified · clicks +41%", "/pricing · 9 Apr", false],
  ] as const;
  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-1.5">
      {alerts.map(([what, where, fresh]) => (
        <div
          key={what}
          className={`flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-left shadow-[0_8px_20px_-12px_rgba(15,23,42,0.35)] ring-1 ${
            fresh ? "ring-signal/40" : "ring-black/[0.06]"
          }`}
        >
          <span
            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${fresh ? "bg-signal" : "bg-zinc-300"}`}
          />
          <span className="min-w-0">
            <span className="block truncate font-body text-[11.5px] text-zinc-900">
              {what}
            </span>
            <span className={`block ${mono} text-zinc-400`}>{where}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function CreateSketch() {
  const titles = [
    ["Pricing that scales with your sites | Seerix", 42],
    ["Seerix plans: from $39 a month", 36],
    ["Compare Seerix plans and allowances", 41],
  ] as const;
  return (
    <div className="flex w-full max-w-[16rem] flex-col gap-1.5">
      {titles.map(([title, len], i) => (
        <div
          key={title}
          className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left shadow-[0_8px_20px_-12px_rgba(15,23,42,0.35)] ring-1 ${
            i === 0 ? "bg-signal-soft ring-signal/40" : "bg-white ring-black/[0.06]"
          }`}
        >
          <span className="min-w-0 truncate font-body text-[11.5px] text-zinc-900">
            {title}
          </span>
          <span className={`${mono} shrink-0 text-zinc-500`}>{len}/60</span>
        </div>
      ))}
    </div>
  );
}

const modules: Module[] = [
  {
    name: "Diagnose",
    allowance: "From 100",
    unit: "/mo questions",
    summary: "Why traffic changed, page by page",
    points: [
      "Rankings, demand and CTR separated",
      "Google updates checked against your timeline",
      "Every claim cites its evidence rows",
    ],
    visual: <DiagnoseSketch />,
  },
  {
    name: "Prioritize",
    allowance: "Included",
    unit: "on every plan",
    summary: "A fix list, ranked",
    points: [
      "Impact × effort × confidence scoring",
      "Striking-distance keywords",
      "Cannibalization where pages compete",
    ],
    visual: <PrioritizeSketch />,
  },
  {
    name: "Watch",
    allowance: "From 100",
    unit: "/mo SERP snapshots",
    summary: "What moved, before revenue does",
    points: [
      "Ranking and traffic alerts",
      "Competitor movement on Growth and up",
      "Fixes verified after you ship them",
    ],
    visual: <WatchSketch />,
  },
  {
    name: "Create",
    allowance: "Included",
    unit: "on every plan",
    summary: "Titles and descriptions, with rules",
    points: [
      "Three variants per page",
      "Generated against real queries",
      "Each cites the guideline it followed",
    ],
    visual: <CreateSketch />,
  },
];

/**
 * What every plan runs, as a row of product cards. Each opens on its
 * module's output in miniature, then the job, its allowance and what it does.
 * Nothing is billed per call; the allowances are the plan's.
 */
export default function PricingModules() {
  return (
    <section className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-[34px] leading-[1.15] sm:text-[44px] tracking-[-0.03em] font-extralight text-black">
          What every plan runs
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, index) => (
            <article
              key={m.name}
              className="frost flex flex-col rounded-[28px] p-3 sm:p-4"
            >
              <div
                aria-hidden="true"
                className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white/50 p-4 ring-1 ring-black/[0.04]"
              >
                {/* A fine dot grid, fading at the edges, under the sketch. */}
                <span
                  className="absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(91,79,216,0.28) 1px, transparent 1.4px)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <div className="relative flex w-full justify-center">
                  {m.visual}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between px-1">
                <span className="font-mono text-[12px] text-zinc-400">
                  0{index + 1}
                </span>
                <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 font-body text-[12px] text-zinc-600">
                  <span className="font-medium text-zinc-900">
                    {m.allowance}
                  </span>{" "}
                  {m.unit}
                </span>
              </div>
              <p className="mt-3 px-1 font-display text-[30px] font-extralight leading-none tracking-[-0.03em] text-black">
                {m.name}
              </p>
              <p className="mt-2 px-1 font-body text-[15px] text-zinc-600">
                {m.summary}
              </p>
              <ul className="mt-4 px-1">
                {m.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 border-t border-black/[0.07] py-2.5 font-body text-[14px] text-zinc-700"
                  >
                    <svg
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-signal"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 8.5l3.2 3.2L13 5" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex-1" />
              <Button href="/#waitlist" className="mt-4 h-11 w-full">
                Join waitlist
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
