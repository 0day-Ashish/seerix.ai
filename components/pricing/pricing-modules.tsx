import Image from "next/image";
import Link from "next/link";

type Module = {
  name: string;
  /** What the module is metered by, if anything. */
  allowance: string;
  unit: string;
  summary: string;
  points: string[];
  visual: React.ReactNode;
};

/* Small inline sketches of each module's output, drawn in plain markup. */

function DiagnoseSketch() {
  return (
    <div className="w-[70%] bg-white p-3 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)]">
      <div className="flex h-10 items-end gap-[3px]">
        {[70, 74, 68, 76, 72, 78, 50, 42, 38, 40].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 ${i > 5 ? "bg-signal" : "bg-black/[0.12]"}`}
          />
        ))}
      </div>
      <span className="mt-2 block h-1.5 w-3/4 bg-black/[0.18]" />
      <span className="mt-1.5 block h-1.5 w-1/2 bg-black/[0.10]" />
    </div>
  );
}

function PrioritizeSketch() {
  return (
    <div className="w-[70%] bg-white shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)]">
      {[0, 1, 2, 3].map((r) => (
        <div
          key={r}
          className="flex items-center gap-2 border-b border-black/[0.06] px-3 py-2 last:border-0"
        >
          <span className="font-mono text-[9px] text-zinc-400">{r + 1}</span>
          <span className={`h-1.5 flex-1 ${r === 0 ? "bg-black/30" : "bg-black/[0.10]"}`} />
          <span className={`h-3 w-6 ${r === 0 ? "bg-signal" : "bg-black/[0.08]"}`} />
        </div>
      ))}
    </div>
  );
}

function WatchSketch() {
  return (
    <div className="flex w-[70%] flex-col gap-1.5">
      {["new", "", ""].map((tag, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 bg-white px-3 py-2 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)] ${
            tag ? "ring-1 ring-signal/50" : ""
          }`}
        >
          <span className={`h-2 w-2 ${tag ? "bg-signal" : "bg-black/[0.15]"}`} />
          <span className="h-1.5 flex-1 bg-black/[0.14]" />
        </div>
      ))}
    </div>
  );
}

function CreateSketch() {
  return (
    <div className="flex w-[70%] flex-col gap-1.5">
      {[1, 0, 0].map((pick, i) => (
        <div
          key={i}
          className={`flex items-center justify-between gap-2 px-3 py-2 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)] ${
            pick ? "bg-signal-soft ring-1 ring-signal/50" : "bg-white"
          }`}
        >
          <span className="h-1.5 w-2/3 bg-black/[0.16]" />
          <span className="font-mono text-[9px] text-zinc-500">{[42, 36, 41][i]}/60</span>
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
 * What every plan runs, as a row of product cards. Each opens on a sketch of
 * the module's output -- the first on the brand image -- then what it does.
 * Nothing is billed per call; the allowances are the plan's.
 */
export default function PricingModules() {
  return (
    <section className="bg-white px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="heading-mark font-display text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-black sm:text-[44px]">
          What every plan runs
        </h2>

        <div className="mt-10 grid border border-black/[0.12] sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, index) => {
            const lit = index === 0;
            return (
              <article
                key={m.name}
                className={`flex flex-col p-4 ${
                  index > 0 ? "border-t border-black/[0.12] sm:border-t-0" : ""
                } ${index % 2 === 1 ? "sm:border-l sm:border-black/[0.12]" : ""} ${
                  index > 1 ? "sm:border-t sm:border-black/[0.12] lg:border-t-0" : ""
                } ${index > 0 ? "lg:border-l lg:border-black/[0.12]" : ""}`}
              >
                <div
                  aria-hidden="true"
                  className={`relative flex aspect-square flex-col justify-between overflow-hidden p-4 ${
                    lit ? "bg-[#2a2a30] text-white" : "bg-[#f3f2ef] text-black"
                  }`}
                >
                  {lit && (
                    <Image
                      src="/assets/pricing.png"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover [transform:scaleY(-1)]"
                    />
                  )}
                  <div className="relative flex justify-center pt-2">{m.visual}</div>
                  <div className="relative">
                    <p className="font-display text-[30px] font-medium leading-none tracking-[-0.03em]">
                      {m.name}
                    </p>
                    <p className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-display text-[18px]">{m.allowance}</span>
                      <span
                        className={`font-body text-[12px] ${lit ? "text-white/75" : "text-zinc-500"}`}
                      >
                        {m.unit}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="mt-5 font-body text-[15px] text-black">{m.summary}</p>
                <ul className="mt-3">
                  {m.points.map((point) => (
                    <li
                      key={point}
                      className="border-t border-black/[0.08] py-3 font-body text-[14px] text-zinc-600"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <Link
                  href="/#demo"
                  className="mt-4 flex h-10 items-center justify-center bg-[#141416] font-body text-[14px] font-medium text-white transition-colors hover:bg-[#36363B]"
                >
                  See it work
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
