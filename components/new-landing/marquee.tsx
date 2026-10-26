/**
 * A quiet ticker under the hero: the kind of diagnosis Seerix writes, one
 * after another. Each entry is a page, the number that moved, the cause and
 * how sure it is -- the "receipts" the headline promises, shown rather than
 * shouted.
 *
 * The run is drawn twice and the loop travels exactly one copy, so it
 * restarts with no visible seam. Pure CSS: the keyframe lives in globals.css,
 * hovering pauses it, and the global reduced-motion rule stops it.
 */

type Receipt = {
  page: string;
  metric: string;
  up?: boolean;
  cause: string;
  confidence: number;
};

const receipts: Receipt[] = [
  {
    page: "/pricing",
    metric: "clicks −38%",
    cause: "Google rewrote the title tag",
    confidence: 86,
  },
  {
    page: "/blog/nextjs-seo",
    metric: "position 4.2 → 9.8",
    cause: "a competitor published a fresher guide",
    confidence: 78,
  },
  {
    page: "/features",
    metric: "CTR +21%",
    up: true,
    cause: "the new meta description is working",
    confidence: 91,
  },
  {
    page: "/docs/setup",
    metric: "impressions −52%",
    cause: "canonical points at the old URL",
    confidence: 94,
  },
  {
    page: "/case-studies",
    metric: "clicks +64%",
    up: true,
    cause: "two new referring domains in March",
    confidence: 72,
  },
  {
    page: "/integrations",
    metric: "not indexed",
    cause: "blocked by a noindex left from staging",
    confidence: 97,
  },
];

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center will-change-transform [animation:seerix-marquee_70s_linear_infinite] group-hover:[animation-play-state:paused]"
    >
      {receipts.map((r) => (
        <li
          key={r.page}
          className="flex shrink-0 items-center gap-3 whitespace-nowrap border-r border-black/[0.07] px-6 py-4 sm:px-8 sm:py-5"
        >
          <span className="font-mono text-[12.5px] text-black sm:text-[13px]">
            {r.page}
          </span>
          <span
            className={`font-mono text-[12.5px] sm:text-[13px] ${
              r.up ? "text-[#1f6b3a]" : "text-signal-deep"
            }`}
          >
            {r.metric}
          </span>
          <span className="font-body text-[14px] text-zinc-600 sm:text-[15px]">
            {r.cause}
          </span>
          <span className="font-mono text-[11.5px] text-zinc-400">
            {r.confidence}% sure
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="Example diagnoses"
      className="mt-10 border-y border-black/[0.07] bg-ghost sm:mt-14"
    >
      <div className="flex items-stretch">
        <p className="relative z-10 hidden shrink-0 items-center gap-2.5 border-r border-black/[0.07] bg-white px-6 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 md:flex lg:px-10">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-bright" />
          Diagnosed this week
        </p>
        <div className="group flex min-w-0 flex-1 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <Run />
          <Run hidden />
        </div>
      </div>
    </section>
  );
}
