/**
 * Abstract product panel: a still of the interface Seerix is building, drawn in
 * plain markup rather than a screenshot. Decorative, so it is hidden from
 * assistive tech; swap it for a real capture when there is one.
 */

const navItems = ["Overview", "Diagnoses", "Pages", "Queries", "Competitors"];

/** Evidence rows under the answer, each with its own confidence reading. */
const evidence = [
  { source: "Search Console", detail: "clicks −38% wk/wk", confidence: "High" },
  { source: "SERP snapshot", detail: "position 4 → 11", confidence: "High" },
  { source: "Crawl", detail: "title rewritten Apr 2", confidence: "Medium" },
];

/** Bar heights for the sparkline, as percentages of the plot area. */
const trend = [62, 68, 71, 66, 74, 70, 58, 44, 31, 28, 33, 30];

export default function HeroPanel() {
  return (
    <div
      aria-hidden="true"
      className="relative rounded-t-2xl border border-b-0 border-black/[0.08] bg-white shadow-[0_-1px_0_rgba(0,0,0,0.02),0_24px_60px_-20px_rgba(0,0,0,0.18)]"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-black/[0.08]" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/[0.08]" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/[0.08]" />
        <span className="ml-3 font-body text-[12px] text-zinc-400">
          seerix.ai / acme.com
        </span>
      </div>

      <div className="flex">
        {/* Sidebar: hidden on narrow screens, where the answer is the point. */}
        <div className="hidden w-52 shrink-0 border-r border-black/[0.06] p-4 sm:block">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-[#36363B]" />
            <span className="font-body text-[13px] font-medium text-black">
              acme.com
            </span>
          </div>

          <ul className="mt-5 space-y-0.5">
            {navItems.map((item, index) => (
              <li
                key={item}
                className={`rounded-md px-2 py-1.5 font-body text-[13px] ${
                  index === 1 ? "bg-black/[0.05] text-black" : "text-zinc-400"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Answer column */}
        <div className="min-w-0 flex-1 p-5 sm:p-7">
          <p className="font-body text-[13px] text-zinc-400">
            Why did /pricing lose traffic last week?
          </p>

          <p className="mt-3 max-w-lg font-display text-[17px] font-medium leading-snug tracking-[-0.02em] text-black sm:text-[19px]">
            Rankings fell after a title rewrite, not a Google update.
          </p>

          {/* Sparkline: the drop the answer is about. */}
          <div className="mt-6 flex h-20 items-end gap-1.5">
            {trend.map((height, index) => (
              <span
                key={index}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-sm ${
                  index > 7 ? "bg-[#36363B]/70" : "bg-black/[0.10]"
                }`}
              />
            ))}
          </div>

          {/* Evidence rows */}
          <div className="mt-6 overflow-hidden rounded-lg border border-black/[0.07]">
            {evidence.map((row, index) => (
              <div
                key={row.source}
                className={`flex items-center justify-between gap-4 px-3.5 py-2.5 ${
                  index > 0 ? "border-t border-black/[0.06]" : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#36363B]/40" />
                  <span className="shrink-0 font-body text-[13px] text-black">
                    {row.source}
                  </span>
                  <span className="truncate font-body text-[13px] text-zinc-400">
                    {row.detail}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-black/[0.08] px-2 py-0.5 font-body text-[11px] text-zinc-500">
                  {row.confidence}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
