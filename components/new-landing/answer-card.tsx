/**
 * A single diagnosis, drawn in plain markup rather than a screenshot. It is
 * the argument the surrounding section makes, shown instead of described: the
 * question, the answer in one sentence, the evidence it was built from, and
 * the confidence attached to it.
 *
 * Decorative, so it is hidden from assistive tech -- the three points beside
 * it carry the same meaning in prose. Swap for a real capture when there is
 * one; the shape deliberately matches HeroPanel's answer column.
 */

/** The rows the answer cites, each with its own confidence reading. */
const evidence = [
  {
    source: "Search Console",
    detail: "clicks 2,940 → 1,823",
    confidence: "High",
  },
  { source: "SERP snapshot", detail: "position 4 → 11", confidence: "High" },
  { source: "Crawl", detail: "title rewritten Apr 2", confidence: "Medium" },
];

export default function AnswerCard() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.18)]"
    >
      {/* The question, set as though typed into the product. */}
      <div className="border-b border-black/[0.06] px-6 py-4">
        <p className="font-body text-[13px] text-zinc-400">
          Why did /pricing lose traffic last week?
        </p>
      </div>

      <div className="px-6 py-6">
        {/* The answer: one sentence, which is the whole claim of the section. */}
        <p className="max-w-md font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-black">
          Rankings fell after a title rewrite, not a Google update.
        </p>

        {/* Evidence, so the answer above can be checked rather than trusted. */}
        <p className="mt-6 font-body text-[12px] font-medium uppercase tracking-[0.06em] text-zinc-400">
          Evidence
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-black/[0.07]">
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

        {/* The honest confidence score the third point promises. */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/[0.06] pt-4">
          <span className="font-body text-[13px] text-zinc-400">
            Confidence in this diagnosis
          </span>
          <span className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 w-4 rounded-full ${
                    index < 4 ? "bg-[#36363B]/70" : "bg-black/[0.08]"
                  }`}
                />
              ))}
            </span>
            <span className="font-mono text-[12px] text-zinc-500">High</span>
          </span>
        </div>
      </div>
    </div>
  );
}
