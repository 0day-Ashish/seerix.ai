/**
 * SAMPLE DATA for the gap tools. Every figure here is illustrative: the pages
 * label it as sample data, and it should be replaced by real Search Console,
 * SERP and backlink data once the backend exists. Deterministic, so server and
 * client render the same tables.
 */

export const domains = [
  "arddev.in",
  "pixelforge.dev",
  "buildstack.io",
] as const;
export type Domain = (typeof domains)[number];

export type Intent = "I" | "N" | "C" | "T";

export type KeywordRow = {
  keyword: string;
  intent: Intent;
  /** Position per domain; 0 means the domain does not rank in the top 100. */
  positions: Record<Domain, number>;
  volume: number;
  kd: number;
  cpc: number;
  competition: number;
  results: number;
};

/** Small seeded generator so the sample set is stable across renders. */
function rng(seed: number) {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  // Small seeds give tiny first values; discard a few so draws are even.
  for (let i = 0; i < 5; i++) next();
  return next;
}

const keywordSeeds: [string, Intent][] = [
  ["web development company", "C"],
  ["custom web development services", "C"],
  ["nextjs development agency", "C"],
  ["hire react developers", "T"],
  ["hire nextjs developer", "T"],
  ["website redesign cost", "C"],
  ["saas website development", "C"],
  ["shopify development agency", "C"],
  ["headless cms development", "C"],
  ["web app development cost", "C"],
  ["mvp development services", "C"],
  ["webflow vs nextjs", "I"],
  ["nextjs seo checklist", "I"],
  ["how to improve core web vitals", "I"],
  ["what is headless commerce", "I"],
  ["react vs vue for startups", "I"],
  ["website speed optimization", "T"],
  ["technical seo audit", "T"],
  ["landing page design services", "C"],
  ["ui ux design agency", "C"],
  ["startup website cost", "I"],
  ["nextjs hosting comparison", "I"],
  ["arddev reviews", "N"],
  ["arddev portfolio", "N"],
  ["pixelforge pricing", "N"],
  ["buildstack case studies", "N"],
  ["website maintenance plans", "T"],
  ["web development pricing", "T"],
  ["freelance vs agency web development", "I"],
  ["ecommerce website development", "C"],
  ["progressive web app development", "C"],
  ["api integration services", "C"],
  ["how long does it take to build a website", "I"],
  ["website migration checklist", "I"],
  ["jamstack agency", "C"],
  ["vercel deployment guide", "I"],
  ["tailwind css agency", "C"],
  ["b2b website design", "C"],
  ["website accessibility audit", "T"],
  ["request a website quote", "T"],
];

export const keywordRows: KeywordRow[] = keywordSeeds.map(
  ([keyword, intent], i) => {
    const r = rng(i * 97 + 13);
    // Each domain ranks for a keyword with its own likelihood, so the tabs
    // (shared, missing, weak...) all end up with something in them.
    const pos = (likelihood: number) =>
      r() < likelihood ? 1 + Math.floor(r() * 60) : 0;
    const brandOf = keyword.includes("arddev")
      ? "acme"
      : keyword.includes("pixelforge")
        ? "rival"
        : keyword.includes("buildstack")
          ? "board"
          : null;
    return {
      keyword,
      intent,
      positions: {
        "arddev.in": brandOf === "acme" ? 1 : brandOf ? 0 : pos(0.55),
        "pixelforge.dev":
          brandOf === "rival" ? 1 : brandOf === "acme" ? 0 : pos(0.7),
        "buildstack.io":
          brandOf === "board" ? 1 : brandOf === "acme" ? 0 : pos(0.65),
      },
      volume: [90, 140, 260, 390, 590, 880, 1300, 1900, 2900, 4400, 6600, 9900][
        Math.floor(r() * 12)
      ],
      kd: 12 + Math.floor(r() * 80),
      cpc: Math.round((0.4 + r() * 14) * 100) / 100,
      competition: Math.round(r() * 100) / 100,
      results: (Math.floor(2 + r() * 900) * 1_000_000) / 10,
    };
  },
);

export type KeywordTab =
  "Shared" | "Missing" | "Weak" | "Strong" | "Untapped" | "Unique" | "All";

/** Semrush's definitions, with arddev.in as "you". */
export function keywordTab(row: KeywordRow, tab: KeywordTab): boolean {
  const you = row.positions["arddev.in"];
  const them = (["pixelforge.dev", "buildstack.io"] as const).map(
    (d) => row.positions[d],
  );
  const ranking = them.filter((p) => p > 0);
  switch (tab) {
    case "Shared":
      return you > 0 && them.every((p) => p > 0);
    case "Missing":
      return you === 0 && them.every((p) => p > 0);
    case "Weak":
      return you > 0 && ranking.length > 0 && ranking.every((p) => p < you);
    case "Strong":
      return you > 0 && ranking.length > 0 && ranking.every((p) => p > you);
    case "Untapped":
      return you === 0 && ranking.length > 0 && ranking.length < them.length;
    case "Unique":
      return you > 0 && ranking.length === 0;
    case "All":
      return true;
  }
}

export type BacklinkRow = {
  domain: string;
  /** Authority score, 0-100. */
  as: number;
  /** Backlinks from this referring domain to each compared domain. */
  links: Record<Domain, number>;
};

const referringSeeds = [
  "producthunt.com",
  "clutch.co",
  "designrush.com",
  "zapier.com",
  "medium.com",
  "dev.to",
  "smashingmagazine.com",
  "hubspot.com",
  "forbes.com",
  "techcrunch.com",
  "reddit.com",
  "alternativeto.net",
  "goodfirms.co",
  "sortlist.com",
  "awwwards.com",
  "creativebloq.com",
  "agencyanalytics.com",
  "notion.so",
  "indiehackers.com",
  "hackernoon.com",
  "designmodo.com",
  "webdesignerdepot.com",
  "sitepoint.com",
  "theverge.com",
  "fastcompany.com",
  "ycombinator.com",
  "slack.com",
  "atlassian.com",
  "freecodecamp.org",
  "uxdesign.cc",
];

export const backlinkRows: BacklinkRow[] = referringSeeds.map((domain, i) => {
  const r = rng(i * 131 + 7);
  const links = (likelihood: number) =>
    r() < likelihood ? 1 + Math.floor(r() * r() * 240) : 0;
  return {
    domain,
    as: 30 + Math.floor(r() * 66),
    links: {
      "arddev.in": links(0.45),
      "pixelforge.dev": links(0.75),
      "buildstack.io": links(0.65),
    },
  };
});

export type BacklinkTab =
  "Best" | "Weak" | "Strong" | "Shared" | "Unique" | "All";

export function backlinkTab(row: BacklinkRow, tab: BacklinkTab): boolean {
  const you = row.links["arddev.in"];
  const them = (["pixelforge.dev", "buildstack.io"] as const).map(
    (d) => row.links[d],
  );
  const linking = them.filter((n) => n > 0);
  switch (tab) {
    case "Best":
      return you === 0 && them.every((n) => n > 0);
    case "Weak":
      return you > 0 && linking.length > 0 && linking.every((n) => n > you);
    case "Strong":
      return you > 0 && linking.length > 0 && linking.every((n) => n < you);
    case "Shared":
      return you > 0 && them.every((n) => n > 0);
    case "Unique":
      return you > 0 && linking.length === 0;
    case "All":
      return true;
  }
}
