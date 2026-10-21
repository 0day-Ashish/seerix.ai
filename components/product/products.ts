/**
 * The four jobs, in one place.
 *
 * The landing page's value-prop section lists the same four with their feature
 * chips; this is the long form of that list, so a chip there and a capability
 * here stay the same claim. Keep the two in step when either changes.
 */

export type ProductKey = "diagnose" | "prioritize" | "watch" | "create";

export type Product = {
  key: ProductKey;
  job: string;
  href: string;
  /** One line for the sibling cards at the foot of each page. */
  blurb: string;
  headline: string;
  lede: string;
  capabilities: { label: string; body: string; soon?: boolean }[];
  proof: { figure: string; unit?: string; label: string }[];
  /** Page <title> and description. */
  title: string;
  description: string;
};

export const products: Record<ProductKey, Product> = {
  diagnose: {
    key: "diagnose",
    job: "Diagnose",
    href: "/product/diagnose",
    blurb: "Know exactly why traffic changed, with the evidence attached.",
    headline: "Know exactly why traffic changed",
    lede: "Seerix separates rankings, demand and click-through effects, and checks every Google update against your timeline. Ask about any page and get its specific story.",
    capabilities: [
      {
        label: "Traffic-drop diagnosis",
        body: "Point at a page and a date range. Seerix assembles the evidence from your own Search Console rows and states what changed, in a sentence.",
      },
      {
        label: "Algorithm update check",
        body: "Every confirmed Google update is checked against your timeline, so an update is only blamed when the dates actually line up.",
      },
      {
        label: "Demand vs. ranking split",
        body: "A drop in impressions with a steady position is seasonality, not an SEO problem. Seerix tells the two apart before it tells you anything else.",
      },
      {
        label: "Click-through analysis",
        body: "Same position, fewer clicks usually means the SERP changed around you. Seerix measures CTR against the position's own baseline.",
      },
      {
        label: "Cannibalization",
        body: "Where two of your pages compete for one query, Seerix names both and says which one Google currently prefers.",
      },
      {
        label: "Evidence on every answer",
        body: "Each diagnosis carries the rows that produced it and an honest confidence score, so you can check the reasoning instead of trusting it.",
      },
    ],
    proof: [
      { figure: "16", unit: "months", label: "of history behind every diagnosis, pulled on your first sign-in." },
      { figure: "3", unit: "factors", label: "separated on every answer: ranking, demand and click-through." },
      { figure: "100", unit: "%", label: "of answers cite the rows they were built from, or they are discarded." },
    ],
    title: "Diagnose · Seerix",
    description:
      "Know exactly why traffic changed. Seerix separates rankings, demand and click-through effects and checks every Google update against your timeline.",
  },

  prioritize: {
    key: "prioritize",
    job: "Prioritize",
    href: "/product/prioritize",
    blurb: "A fix list that is actually a list, scored and ordered.",
    headline: "A fix list that's actually a list",
    lede: "Every finding is scored by impact, effort and confidence, so the work is ordered before you open it. No dashboard homework, no guessing which of forty issues matters.",
    capabilities: [
      {
        label: "Impact × effort scoring",
        body: "Each finding carries an estimated impact, the effort to ship it and the confidence behind both, multiplied into one ordering.",
      },
      {
        label: "Striking-distance keywords",
        body: "Queries sitting at positions 6–15, where a small move earns real clicks. Ranked by how much traffic the move would actually be worth.",
      },
      {
        label: "Internal link gaps",
        body: "Pages that deserve more internal links than they have, with the specific source pages worth linking from.",
      },
      {
        label: "Content decay",
        body: "Pages losing ground slowly enough that nobody notices, surfaced before the loss compounds.",
      },
      {
        label: "Fix list export",
        body: "Send the ordered list to the place your team already works instead of copying it by hand.",
        soon: true,
      },
      {
        label: "Confidence, stated",
        body: "Thin data lowers the score and says so. Seerix never rounds uncertainty up to sound decisive.",
      },
    ],
    proof: [
      { figure: "6–15", label: "the position band where a small ranking move earns the most clicks." },
      { figure: "3", unit: "inputs", label: "behind every score: impact, effort and confidence." },
      { figure: "1", unit: "list", label: "ordered before you open it, rather than forty issues to triage." },
    ],
    title: "Prioritize · Seerix",
    description:
      "A fix list that is actually a list. Every finding scored by impact × effort × confidence, with striking-distance keywords and internal link gaps surfaced first.",
  },

  watch: {
    key: "watch",
    job: "Watch",
    href: "/product/watch",
    blurb: "It notices before your revenue does, and tells you why.",
    headline: "It notices before your revenue does",
    lede: "Seerix watches your SERPs, your competitors and the fixes you ship, continuously. When something moves, the alert arrives with the reason already worked out.",
    capabilities: [
      {
        label: "SERP snapshots",
        body: "The result page as it actually looked, captured on a schedule, so a ranking claim can be checked rather than taken on trust.",
      },
      {
        label: "Competitor tracking",
        body: "Who gained the position you lost, on which query, and what changed on their page when they did.",
      },
      {
        label: "Real-time alerts",
        body: "A drop that matters reaches you when it happens, not in next month's report. Alerts carry the diagnosis, not just the number.",
      },
      {
        label: "Weekly report",
        body: "One digest of what moved, what caused it and what is worth doing, written in the same plain language as everything else.",
      },
      {
        label: "Fix verification",
        body: "Mark a fix as shipped and Seerix watches whether it worked, then tells you plainly if it did not.",
      },
      {
        label: "Background, always",
        body: "Monitoring runs continuously and never draws on your AI question allowance.",
      },
    ],
    proof: [
      { figure: "24/7", label: "monitoring that runs in the background, never against your allowance." },
      { figure: "15", unit: "markets", label: "country and language markets tracked, configured per site." },
      { figure: "1", unit: "report", label: "a week, plus real-time alerts when something cannot wait." },
    ],
    title: "Watch · Seerix",
    description:
      "Competitor SERP movement, real-time alerts and outcome verification. Mark a fix as done and Seerix watches whether it actually worked.",
  },

  create: {
    key: "create",
    job: "Create",
    href: "/product/create",
    blurb: "The last mile: it writes, and cites the rule it followed.",
    headline: "The last mile, written with rules",
    lede: "Titles and meta descriptions generated against your page's real queries, in three variants, each citing the exact guideline it followed. Nothing is invented.",
    capabilities: [
      {
        label: "Title rewrites",
        body: "Three variants per page, written against the queries that page actually ranks for rather than a keyword you guessed at.",
      },
      {
        label: "Meta descriptions",
        body: "Written to the length that survives truncation, with the query intent the page is competing for kept in front.",
      },
      {
        label: "Guideline citations",
        body: "Every suggestion names the rule it followed, so an edit can be argued with rather than simply accepted.",
      },
      {
        label: "Written from your data",
        body: "Suggestions are built from your own Search Console queries, not from a generic model of what a title should say.",
      },
      {
        label: "Content briefs",
        body: "The queries, the competing pages and the gaps, assembled into a brief before anything gets written.",
        soon: true,
      },
      {
        label: "Checked before it ships",
        body: "Length, duplication and keyword placement are checked as the suggestion is made, not after you have published it.",
      },
    ],
    proof: [
      { figure: "3", unit: "variants", label: "per page, so there is something to choose between." },
      { figure: "60", unit: "chars", label: "the title budget every suggestion is written to fit." },
      { figure: "0", label: "suggestions that cite a guideline they did not actually follow." },
    ],
    title: "Create · Seerix",
    description:
      "Titles and meta descriptions in three variants, generated against your page's real queries. Every suggestion cites the exact guideline it followed.",
  },
};

export const productOrder: ProductKey[] = [
  "diagnose",
  "prioritize",
  "watch",
  "create",
];

/** The other three jobs, for the set of cards closing each page. */
export function siblingsOf(key: ProductKey) {
  return productOrder
    .filter((k) => k !== key)
    .map((k) => {
      const p = products[k];
      return { job: p.job, href: p.href, blurb: p.blurb };
    });
}
