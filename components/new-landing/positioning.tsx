type Point = { title: string; body: string };

/**
 * Each card carries a different argument: what you get, how soon, what it
 * costs. The evidence argument is the trust section's alone, so none of
 * these restate it.
 */
const points: Point[] = [
  {
    title: "An answer, not homework",
    body: "Ask in plain language. Seerix states what changed, why it changed, and what to do first. A sentence you can act on, not a chart wall to interpret.",
  },
  {
    title: "Useful on day one",
    body: "Your first read-only sign-in pulls sixteen months of Search Console history, so the first diagnosis lands within the first crawl, with no warm-up period.",
  },
  {
    title: "A fraction of a consultant hour",
    body: "The same analysis a $200/hr consultant runs by hand, working on your site every day. Plans start at $39 a month, less than twelve minutes of that hour.",
  },
];

/**
 * The positioning strip: the brand line as a full-width statement, set where
 * the visitor already knows what the product is, and three cards under it.
 */
export default function Positioning() {
  return (
    <section className="bg-ghost px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl font-display text-[34px] font-light leading-[1.15] tracking-[-0.02em] text-black sm:text-[44px]">
          Diagnoses with receipts, not dashboards with homework.
        </h2>

        {/* Folder-tab cards: the bevelled shape the site uses (.bevel in
            globals.css), frosted like the other panels, with the number on
            the raised shoulder. clip-path trims any border or shadow, so the
            frost is fill and blur only. */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {points.map((point, index) => (
            <div
              key={point.title}
              className="bevel bevel-card bg-white/70 px-6 pb-8 pt-4 backdrop-blur-xl sm:px-7"
            >
              <span className="font-mono text-[12px] text-zinc-500">
                0{index + 1}
              </span>
              <h3 className="mt-12 font-display text-[20px] font-light leading-snug tracking-[-0.01em] text-black">
                {point.title}
              </h3>
              <p className="mt-2.5 font-body text-[15px] leading-[1.65] text-zinc-600">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
