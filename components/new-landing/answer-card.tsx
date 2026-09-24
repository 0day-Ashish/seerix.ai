/**
 * A single diagnosis, drawn in plain markup rather than a screenshot: the
 * question, the answer in one sentence, the evidence it was built from, and
 * the confidence attached to it.
 *
 * Takes the diagnosis as a prop so the section beside it can switch between
 * questions. The default is the pricing-page drop used across the site, so a
 * bare <AnswerCard /> still renders. Dark, like the how-it-works panels, so it
 * has presence on the white section rather than sinking into it.
 */

export type Evidence = {
  source: string;
  detail: string;
  confidence: "High" | "Medium" | "Low";
};

export type Diagnosis = {
  question: string;
  answer: string;
  evidence: Evidence[];
  /** Pips lit, out of five. */
  confidence: number;
  confidenceLabel: "High" | "Medium" | "Low";
};

export const pricingDrop: Diagnosis = {
  question: "Why did /pricing lose traffic last week?",
  answer: "Rankings fell after a title rewrite, not a Google update.",
  evidence: [
    { source: "Search Console", detail: "clicks 2,940 → 1,823", confidence: "High" },
    { source: "SERP snapshot", detail: "position 4 → 11", confidence: "High" },
    { source: "Crawl", detail: "title rewritten 2 Apr", confidence: "Medium" },
  ],
  confidence: 4,
  confidenceLabel: "High",
};

export default function AnswerCard({
  diagnosis = pricingDrop,
  className = "",
}: {
  diagnosis?: Diagnosis;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-[#1c1c21] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* The question, set as though typed into the product. */}
      <div className="border-b border-white/[0.08] px-6 py-4">
        <p className="font-body text-[13px] text-white/45">
          {diagnosis.question}
        </p>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        {/* The answer: one sentence, which is the whole claim of the section. */}
        <p className="max-w-md font-display text-[19px] font-medium leading-snug tracking-[-0.02em] text-white">
          {diagnosis.answer}
        </p>

        {/* Evidence, so the answer above can be checked rather than trusted. */}
        <p className="mt-6 font-body text-[12px] font-medium uppercase tracking-[0.06em] text-white/40">
          Evidence
        </p>

        <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.09]">
          {diagnosis.evidence.map((row, index) => (
            <div
              key={row.source + row.detail}
              className={`flex items-center justify-between gap-4 px-3.5 py-2.5 ${
                index > 0 ? "border-t border-white/[0.07]" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dcdddd]/60" />
                <span className="shrink-0 font-body text-[13px] text-white/85">
                  {row.source}
                </span>
                <span className="truncate font-mono text-[12px] text-white/45">
                  {row.detail}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-white/[0.12] px-2 py-0.5 font-body text-[11px] text-white/50">
                {row.confidence}
              </span>
            </div>
          ))}
        </div>

        <div className="h-4 shrink-0" />

        {/* The honest confidence score the third point promises. Pinned to
            the foot when the card is stretched to match the copy. */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
          <span className="font-body text-[13px] text-white/45">
            Confidence in this diagnosis
          </span>
          <span className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 w-4 rounded-full ${
                    index < diagnosis.confidence
                      ? "bg-[#dcdddd]/80"
                      : "bg-white/[0.12]"
                  }`}
                />
              ))}
            </span>
            <span className="font-mono text-[12px] text-white/60">
              {diagnosis.confidenceLabel}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
