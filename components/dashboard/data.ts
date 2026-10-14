/**
 * SAMPLE DATA for the dashboard. Every figure here is illustrative and the
 * pages label it as sample data. Field names follow the API responses the
 * staging app reads (GET /metrics/daily, /wins, /insights, /alerts, /digest,
 * /reports, /fix-list, /rank-tracking, /competitors, /competitors/intel,
 * /crawls, /crawls/:id/issues, /chat/threads/:id/messages), so wiring the
 * backend means replacing these exports with fetches, not reshaping pages.
 */

export const site = { site_id: "site_arddev", site_name: "arddev.in" };
export const sites = [site];

/** Small seeded generator so server and client render the same numbers. */
function rng(seed: number) {
  let s = seed;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < 5; i++) next();
  return next;
}

/* ---------- GET /metrics/daily ---------------------------------------- */

export type Day = {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
};

/** Search Console lags two days, so the series ends on 8 October. */
const LAST_DAY = Date.UTC(2026, 9, 8);
const DAY_MS = 86_400_000;
/** Search Console keeps sixteen months, so that is all there is to show. */
const HISTORY_DAYS = 487;

export const LAST_DATE = new Date(LAST_DAY).toISOString().slice(0, 10);

export const daily: Day[] = (() => {
  const r = rng(42);
  const out: Day[] = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const t = LAST_DAY - i * DAY_MS;
    const d = new Date(t);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    // Slow growth for the first ten months, quicker over the last six.
    const trend =
      i < 180 ? 1 + (179 - i) / 260 : Math.max(1 - (i - 179) / 620, 0.5);
    // A gentle yearly swell, softest in December.
    const season =
      1 + 0.08 * Math.cos(((d.getUTCMonth() - 5) / 12) * 2 * Math.PI);
    // A dip over the last eleven days: the drop the alert strip reports.
    const dip = i < 11 ? 0.68 : 1;
    const impressions = Math.round(
      (360 + r() * 140) * trend * season * dip * (weekend ? 0.62 : 1),
    );
    const ctr = 0.019 + r() * 0.012;
    out.push({
      date: d.toISOString().slice(0, 10),
      impressions,
      clicks: Math.round(impressions * ctr * (i < 11 ? 0.82 : 1)),
      position:
        Math.round((Math.min(19.5 - (179 - i) / 60, 23.5) + r() * 2.4) * 10) /
        10,
    });
  }
  return out;
})();

/** Totals for a run of days, against the run before it (null if missing). */
export function summarize(cur: Day[], prev: (Day | null)[]) {
  const full = prev.length > 0 && prev.every(Boolean);
  const p = prev.filter((d): d is Day => d != null);
  const tot = (a: Day[]) => {
    const clicks = a.reduce((n, d) => n + d.clicks, 0);
    const impressions = a.reduce((n, d) => n + d.impressions, 0);
    return {
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : 0,
      // Impression-weighted, as Search Console reports it.
      position: impressions
        ? a.reduce((n, d) => n + d.position * d.impressions, 0) / impressions
        : 0,
    };
  };
  return { cur: tot(cur), prev: full ? tot(p) : null };
}

/* ---------- GET /metrics/breakdown --------------------------------------- */

/**
 * How the site's traffic splits by query, page, country and device. Each
 * row is a share of the period's total and how much it grew, so the numbers
 * follow whatever range the overview is showing. `pos` is its usual Google
 * position. New rankings had nothing in the period before.
 */
export type BreakdownDef = {
  key: string;
  label: string;
  share: number;
  growth: number;
  pos: number;
  /** Flag emoji for countries, or a device name for the icon. */
  icon?: string;
  /** Subdomain a page lives on ("www"); none for the bare domain. */
  host?: string;
};

export const breakdowns: Record<
  | "queries"
  | "pages"
  | "groups"
  | "countries"
  | "devices"
  | "newQueries"
  | "newPages",
  BreakdownDef[]
> = {
  // Queries add up to less than the total: Google hides rare searches.
  queries: [
    ["nextjs seo checklist", 0.14, 0.62, 6.8],
    ["ard dev", 0.09, 1.15, 1.2],
    ["hire nextjs developer", 0.07, 1.42, 11.4],
    ["arddev", 0.06, 1.08, 1.1],
    ["nextjs development company", 0.05, 1.21, 9.6],
    ["website redesign cost", 0.04, 1.65, 14.2],
    ["fintech dashboard design", 0.035, 0.88, 8.3],
    ["nextjs vs gatsby", 0.03, 0.94, 7.5],
    ["core web vitals nextjs", 0.025, 1.3, 10.1],
    ["headless cms nextjs", 0.02, 1.02, 12.7],
    ["react agency india", 0.018, 1.74, 15.3],
    ["nextjs ecommerce", 0.015, 0.71, 18.9],
    ["seo for nextjs app router", 0.012, 2.1, 13.4],
    ["nextjs agency", 0.01, 1.12, 16.8],
  ].map(([label, share, growth, pos]) => ({
    key: label as string,
    label: label as string,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
  pages: [
    ["", "/", 0.17, 1.1, 3.4],
    ["www", "/blog/nextjs-seo-checklist", 0.22, 0.64, 6.2],
    ["www", "/", 0.09, 1.5, 3.9],
    ["www", "/services/nextjs-development", 0.12, 1.38, 9.8],
    ["www", "/pricing", 0.08, 1.22, 7.1],
    ["www", "/case-studies/fintech-dashboard", 0.07, 0.9, 8.6],
    ["www", "/blog/core-web-vitals", 0.06, 1.27, 10.4],
    ["www", "/services/web-development", 0.05, 1.05, 12.2],
    ["www", "/blog/headless-cms", 0.045, 0.97, 13.1],
    ["www", "/blog/nextjs-vs-gatsby", 0.04, 0.92, 7.9],
    ["docs", "/getting-started", 0.03, 1.8, 9.2],
    ["www", "/about", 0.03, 1.0, 4.2],
    ["www", "/contact", 0.025, 1.15, 5.6],
    ["www", "/assets/case-study.pdf", 0.01, 2.4, 14.6],
  ].map(([host, label, share, growth, pos]) => ({
    key: `${host}${label}`,
    label: label as string,
    host: (host as string) || undefined,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
  // Pages grouped by what they are, as set up in Settings.
  groups: [
    ["Homepage", 0.26, 1.24, 3.6],
    ["Blog", 0.38, 0.72, 8.1],
    ["Services", 0.17, 1.33, 10.6],
    ["Case studies", 0.08, 0.9, 8.6],
    ["Docs subdomain", 0.04, 1.8, 9.2],
    ["Company pages", 0.055, 1.06, 4.8],
    ["Downloads", 0.015, 2.4, 14.6],
  ].map(([label, share, growth, pos]) => ({
    key: label as string,
    label: label as string,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
  countries: [
    ["India", "🇮🇳", 0.36, 1.32, 9.1],
    ["United States", "🇺🇸", 0.21, 0.86, 14.8],
    ["United Kingdom", "🇬🇧", 0.08, 1.05, 13.2],
    ["Canada", "🇨🇦", 0.05, 0.92, 15.6],
    ["Germany", "🇩🇪", 0.04, 1.18, 17.3],
    ["Australia", "🇦🇺", 0.04, 0.78, 16.1],
    ["Pakistan", "🇵🇰", 0.035, 1.9, 8.4],
    ["Singapore", "🇸🇬", 0.03, 1.1, 12.5],
    ["Philippines", "🇵🇭", 0.025, 1.4, 11.9],
    ["France", "🇫🇷", 0.02, 0.7, 19.2],
    ["Brazil", "🇧🇷", 0.02, 0.55, 18.4],
    ["Japan", "🇯🇵", 0.015, 1.6, 20.1],
    ["Indonesia", "🇮🇩", 0.015, 1.25, 13.7],
    ["Sri Lanka", "🇱🇰", 0.01, 2.2, 10.3],
    ["Netherlands", "🇳🇱", 0.01, 0.95, 17.8],
  ].map(([label, icon, share, growth, pos]) => ({
    key: label as string,
    label: label as string,
    icon: icon as string,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
  devices: [
    ["Desktop", 0.58, 0.94, 11.2],
    ["Mobile", 0.4, 1.14, 13.6],
    ["Tablet", 0.02, 0.8, 15.9],
  ].map(([label, share, growth, pos]) => ({
    key: label as string,
    label: label as string,
    icon: label as string,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
  newQueries: [
    ["nextjs app router seo", 0.012, 1, 18.4],
    ["nextjs sitemap generator", 0.008, 1, 21.7],
    ["arddev reviews", 0.006, 1, 4.1],
    ["fintech ui kit", 0.005, 1, 26.3],
    ["nextjs image seo", 0.004, 1, 23.8],
    ["seo checklist 2026", 0.003, 1, 31.2],
    ["nextjs i18n seo", 0.002, 1, 28.5],
    ["ard dev agency", 0.002, 1, 3.6],
    ["nextjs robots txt", 0.001, 1, 34.9],
    ["headless cms comparison", 0.001, 1, 38.2],
  ].map(([label, share, growth, pos]) => ({
    key: label as string,
    label: label as string,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
  newPages: [
    ["/blog/app-router-seo", 0.014, 1, 17.6],
    ["/blog/nextjs-sitemap", 0.009, 1, 20.4],
    ["/case-studies/ui-kit", 0.006, 1, 24.1],
    ["/blog/image-seo", 0.004, 1, 22.9],
    ["/services/seo-audit", 0.003, 1, 27.5],
    ["/blog/i18n-seo", 0.002, 1, 29.8],
  ].map(([label, share, growth, pos]) => ({
    key: label as string,
    label: label as string,
    share: share as number,
    growth: growth as number,
    pos: pos as number,
  })),
};

/* ---------- GET /wins ---------------------------------------------------- */

export const wins = {
  tally: { wins: 3, verified_total: 4 },
  wins: [
    {
      title: "Rewrote the title on /services/nextjs-development",
      clicks_delta_pct: 0.41,
      verified_at: "2026-09-29",
    },
    {
      title: "Merged two overlapping pricing pages into /pricing",
      clicks_delta_pct: 0.23,
      verified_at: "2026-09-15",
    },
    {
      title: "Added FAQ schema to /blog/nextjs-seo-checklist",
      clicks_delta_pct: 0.12,
      verified_at: "2026-09-02",
    },
  ],
};

/* ---------- GET /insights?status=active --------------------------------- */

export const insights = [
  {
    insight_id: "in_1",
    insight_title:
      "/blog/nextjs-seo-checklist lost its position-3 spot for “nextjs seo checklist”",
    priority_score: 92,
    confidence_score: 0.88,
  },
  {
    insight_id: "in_2",
    insight_title:
      "/services/web-development and /services shown for the same 14 queries",
    priority_score: 81,
    confidence_score: 0.79,
  },
  {
    insight_id: "in_3",
    insight_title:
      "“website redesign cost” has 2.9K monthly searches and no page targeting it",
    priority_score: 74,
    confidence_score: 0.71,
  },
  {
    insight_id: "in_4",
    insight_title:
      "/case-studies/fintech-dashboard is slow on mobile (LCP 4.8s)",
    priority_score: 63,
    confidence_score: 0.9,
  },
  {
    insight_id: "in_5",
    insight_title: "11 pages carry the same meta description",
    priority_score: 48,
    confidence_score: 0.95,
  },
];

/* ---------- GET /alerts?days=14 ----------------------------------------- */

export type Alert = {
  alert_id: string;
  type: "traffic_drop" | "google_reconnect_needed" | "sync_failed";
  summary: string;
  /** "ask:<question>" opens chat with that question; "settings" opens settings. */
  action: string;
  created_at: string;
};

export const alerts: Alert[] = [
  {
    alert_id: "al_1",
    type: "traffic_drop",
    summary:
      "Clicks fell 31% week over week, mostly on /blog/nextjs-seo-checklist.",
    action: "ask:why did my clicks drop this week",
    created_at: "2026-10-07",
  },
  {
    alert_id: "al_2",
    type: "google_reconnect_needed",
    summary:
      "Google access expires in 6 days. Reconnect to keep weekly syncs running.",
    action: "settings",
    created_at: "2026-10-06",
  },
];

/* ---------- GET /digest ------------------------------------------------- */

export const digest = {
  input: {
    periodStart: "2026-10-02",
    periodEnd: "2026-10-08",
    clicks: 61,
    clicksPrev: 88,
    impressions: 2_406,
    impressionsPrev: 3_312,
    backlinkDelta: { newDomains: 4, lostDomains: 1 },
    wins: [
      {
        title: "Rewrote the title on /services/nextjs-development",
        deltaPct: 0.41,
      },
    ],
    topFix: {
      title:
        "Restore the comparison table on /blog/nextjs-seo-checklist and re-request indexing",
      evidence:
        "The page dropped from position 3.1 to 8.4 on 30 Sep, the day the table was removed. Clicks for its top query fell from 19 to 4.",
    },
    moreFixCount: 4,
    topGainer: {
      page: "/services/nextjs-development",
      clicksPrev: 9,
      clicks: 14,
    },
    topLoser: {
      page: "/blog/nextjs-seo-checklist",
      clicksPrev: 31,
      clicks: 8,
    },
    alerts: [
      {
        summary:
          "Clicks fell 31% week over week, mostly on /blog/nextjs-seo-checklist.",
      },
    ],
  },
  text: `Your week on arddev.in (2 Oct to 8 Oct)

Clicks: 61 (down 31% from 88)
Impressions: 2,406 (down 27% from 3,312)
Referring domains: +4 new, 1 lost

What happened
Most of the drop is one page. /blog/nextjs-seo-checklist fell from position 3.1 to 8.4 for "nextjs seo checklist" on 30 September, the same day its comparison table was removed in a content update. The rest of the site held steady.

The one thing to do
Restore the comparison table on /blog/nextjs-seo-checklist and re-request indexing in Search Console. 4 more fixes are waiting in your fix list.

Win
Rewriting the title on /services/nextjs-development lifted its clicks 41% since 15 September.

Seerix`,
};

/* ---------- GET /reports ------------------------------------------------- */

export const reports = [
  {
    report_id: "rp_39",
    period_start: "2026-09-25",
    period_end: "2026-10-01",
    sent_at: "2026-10-05",
    text: `Your week on arddev.in (25 Sep to 1 Oct)

Clicks: 88 (up 6% from 83)
Impressions: 3,312 (up 9% from 3,038)

The one thing to do
Give "website redesign cost" its own page. It has 2,900 monthly searches and your services page ranks 41st for it by accident.`,
  },
  {
    report_id: "rp_38",
    period_start: "2026-09-18",
    period_end: "2026-09-24",
    sent_at: "2026-09-28",
    text: `Your week on arddev.in (18 Sep to 24 Sep)

Clicks: 83 (up 12% from 74)
Impressions: 3,038 (up 4% from 2,921)

Win
Merging the two pricing pages lifted /pricing clicks 23%.`,
  },
  {
    report_id: "rp_37",
    period_start: "2026-09-11",
    period_end: "2026-09-17",
    sent_at: "2026-09-21",
    text: `Your week on arddev.in (11 Sep to 17 Sep)

Clicks: 74 (flat)
Impressions: 2,921 (up 2%)

The one thing to do
Merge /pricing-old into /pricing: both rank for the same 9 queries and split the clicks.`,
  },
];

/* ---------- GET /fix-list ------------------------------------------------ */

export type Fix = {
  recommendation_id: string;
  title: string;
  evidence: string;
  priority_score: number;
  confidence_score: number;
  effort: "Minutes" | "An hour" | "A day";
  page: string;
};

export const fixList: { do_now: Fix[]; monitor: Fix[] } = {
  do_now: [
    {
      recommendation_id: "rc_1",
      title: "Restore the comparison table and re-request indexing",
      evidence:
        "Position 3.1 → 8.4 for “nextjs seo checklist” on 30 Sep, the day the table was removed. Clicks 19 → 4 a week.",
      priority_score: 92,
      confidence_score: 0.88,
      effort: "An hour",
      page: "/blog/nextjs-seo-checklist",
    },
    {
      recommendation_id: "rc_2",
      title: "Pick one page for web development queries and redirect the other",
      evidence:
        "/services and /services/web-development both appear for 14 queries; neither has held top 10 for any of them.",
      priority_score: 81,
      confidence_score: 0.79,
      effort: "An hour",
      page: "/services/web-development",
    },
    {
      recommendation_id: "rc_3",
      title: "Write a page for “website redesign cost”",
      evidence:
        "2,900 monthly searches. /services ranks 41st for it without targeting it; both competitors rank top 10.",
      priority_score: 74,
      confidence_score: 0.71,
      effort: "A day",
      page: "(new page)",
    },
  ],
  monitor: [
    {
      recommendation_id: "rc_4",
      title: "Compress the hero image and defer the chart library",
      evidence:
        "Mobile LCP 4.8s from field data; the 1.9 MB hero image is the largest element.",
      priority_score: 63,
      confidence_score: 0.9,
      effort: "Minutes",
      page: "/case-studies/fintech-dashboard",
    },
    {
      recommendation_id: "rc_5",
      title: "Write unique meta descriptions for 11 pages",
      evidence:
        "11 pages share one description; their CTR averages 0.9% against 2.4% for the rest of the site.",
      priority_score: 48,
      confidence_score: 0.95,
      effort: "An hour",
      page: "11 pages",
    },
  ],
};

/* ---------- GET /rank-tracking ------------------------------------------ */

export type Ranking = {
  keyword: string;
  query_class: "top query" | "seed topic";
  latest_position: number | null;
  change: number | null;
  best_position: number | null;
  history: { t: string; p: number | null }[];
  captures: number;
  ranking_url: string | null;
  ai_overview: boolean;
  features: string[];
};

const rankSeeds: [
  string,
  Ranking["query_class"],
  number | null,
  string | null,
  boolean,
  string[],
][] = [
  [
    "nextjs seo checklist",
    "top query",
    8,
    "/blog/nextjs-seo-checklist",
    true,
    ["people_also_ask", "video"],
  ],
  [
    "nextjs development agency",
    "seed topic",
    6,
    "/services/nextjs-development",
    false,
    ["local_pack"],
  ],
  [
    "hire nextjs developer",
    "seed topic",
    11,
    "/services/nextjs-development",
    false,
    ["people_also_ask"],
  ],
  [
    "web development company",
    "seed topic",
    34,
    "/services/web-development",
    false,
    ["local_pack", "reviews"],
  ],
  [
    "custom web development services",
    "seed topic",
    19,
    "/services",
    false,
    ["people_also_ask"],
  ],
  [
    "how to improve core web vitals",
    "top query",
    4,
    "/blog/core-web-vitals",
    true,
    ["featured_snippet", "people_also_ask"],
  ],
  [
    "webflow vs nextjs",
    "top query",
    3,
    "/blog/webflow-vs-nextjs",
    true,
    ["people_also_ask"],
  ],
  [
    "website redesign cost",
    "seed topic",
    41,
    "/services",
    true,
    ["people_also_ask"],
  ],
  ["saas website development", "seed topic", 15, "/services/saas", false, []],
  [
    "headless cms development",
    "seed topic",
    null,
    null,
    false,
    ["people_also_ask"],
  ],
  ["arddev", "top query", 1, "/", false, ["sitelinks"]],
  [
    "website migration checklist",
    "top query",
    9,
    "/blog/website-migration",
    false,
    ["featured_snippet"],
  ],
  ["tailwind css agency", "seed topic", 7, "/services/frontend", false, []],
  [
    "mvp development services",
    "seed topic",
    23,
    "/services/mvp",
    false,
    ["people_also_ask"],
  ],
];

export const rankings: Ranking[] = rankSeeds.map(
  ([keyword, query_class, pos, url, ai, features], i) => {
    const r = rng(i * 53 + 11);
    const weeks = 8;
    const history = Array.from({ length: weeks }, (_, w) => {
      if (pos == null) return { t: `w${w}`, p: null };
      // Walk back from the latest position so the line ends where the table says.
      const drift = Math.round((r() - 0.45) * 6 * (weeks - 1 - w) * 0.4);
      return { t: `w${w}`, p: Math.max(1, pos + drift) };
    });
    // The checklist page is the drop story; give it the cliff.
    if (keyword === "nextjs seo checklist") {
      history.forEach((h, w) => (h.p = w < 7 ? 3 : 8));
    }
    const prev = history[weeks - 2].p;
    return {
      keyword,
      query_class,
      latest_position: pos,
      change: pos == null || prev == null ? null : prev - pos,
      best_position:
        pos == null ? null : Math.min(...history.map((h) => h.p ?? 999), pos),
      history,
      captures: weeks,
      ranking_url: url,
      ai_overview: ai,
      features,
    };
  },
);

/* ---------- GET /competitors, /competitors/suggestions, /intel --------- */

export const competitorCap = 3;

export const competitors = [
  {
    competitor_id: "cp_1",
    competitor_domain: "pixelforge.dev",
    created_at: "2026-08-24",
  },
  {
    competitor_id: "cp_2",
    competitor_domain: "buildstack.io",
    created_at: "2026-08-24",
  },
];

export const suggestions = [
  { domain: "craftedweb.co", queries_seen: 17 },
  { domain: "nextwave.studio", queries_seen: 12 },
  { domain: "devhaus.agency", queries_seen: 9 },
  { domain: "launchpage.io", queries_seen: 6 },
];

export const intel = {
  competitors: [
    {
      domain: "pixelforge.dev",
      snapshot: {
        provider_rank: 41,
        referring_domains: 386,
        backlinks_total: 5_912,
        ranked_keywords: 1_240,
        captured_date: "2026-10-04",
      },
      keyword_gap: [
        {
          keyword_text: "website redesign cost",
          search_volume: 2_900,
          their_position: 6,
          our_position: 41,
        },
        {
          keyword_text: "web app development cost",
          search_volume: 1_900,
          their_position: 4,
          our_position: null,
        },
        {
          keyword_text: "shopify development agency",
          search_volume: 1_300,
          their_position: 9,
          our_position: null,
        },
        {
          keyword_text: "web development company",
          search_volume: 9_900,
          their_position: 12,
          our_position: 34,
        },
      ],
      top_keywords: [
        {
          keyword_text: "pixelforge",
          position: 1,
          search_volume: 880,
          ranking_url: "/",
        },
        {
          keyword_text: "web app development cost",
          position: 4,
          search_volume: 1_900,
          ranking_url: "/blog/web-app-cost",
        },
        {
          keyword_text: "website redesign cost",
          position: 6,
          search_volume: 2_900,
          ranking_url: "/pricing/redesign",
        },
        {
          keyword_text: "react agency",
          position: 7,
          search_volume: 590,
          ranking_url: "/services/react",
        },
      ],
    },
    {
      domain: "buildstack.io",
      snapshot: {
        provider_rank: 33,
        referring_domains: 214,
        backlinks_total: 2_870,
        ranked_keywords: 760,
        captured_date: "2026-10-04",
      },
      keyword_gap: [
        {
          keyword_text: "headless cms development",
          search_volume: 880,
          their_position: 5,
          our_position: null,
        },
        {
          keyword_text: "mvp development services",
          search_volume: 1_300,
          their_position: 8,
          our_position: 23,
        },
        {
          keyword_text: "jamstack agency",
          search_volume: 390,
          their_position: 3,
          our_position: null,
        },
      ],
      top_keywords: [
        {
          keyword_text: "buildstack",
          position: 1,
          search_volume: 590,
          ranking_url: "/",
        },
        {
          keyword_text: "jamstack agency",
          position: 3,
          search_volume: 390,
          ranking_url: "/jamstack",
        },
        {
          keyword_text: "headless cms development",
          position: 5,
          search_volume: 880,
          ranking_url: "/services/headless",
        },
        {
          keyword_text: "mvp development services",
          position: 8,
          search_volume: 1_300,
          ranking_url: "/mvp",
        },
      ],
    },
  ],
  link_gap: [
    {
      source_domain: "clutch.co",
      domain_rank: 89,
      competitors_linked: 2,
      total_backlinks: 14,
      spam_score: 1,
    },
    {
      source_domain: "designrush.com",
      domain_rank: 74,
      competitors_linked: 2,
      total_backlinks: 6,
      spam_score: 2,
    },
    {
      source_domain: "smashingmagazine.com",
      domain_rank: 81,
      competitors_linked: 1,
      total_backlinks: 3,
      spam_score: 0,
    },
    {
      source_domain: "goodfirms.co",
      domain_rank: 68,
      competitors_linked: 2,
      total_backlinks: 9,
      spam_score: 4,
    },
    {
      source_domain: "dev.to",
      domain_rank: 77,
      competitors_linked: 1,
      total_backlinks: 22,
      spam_score: 3,
    },
  ],
  broken_targets: [
    {
      competitor_domain: "pixelforge.dev",
      target_url: "/blog/nextjs-13-migration",
      links: 31,
      domains: 12,
      example_source: "sitepoint.com",
    },
    {
      competitor_domain: "buildstack.io",
      target_url: "/guides/core-web-vitals-2025",
      links: 18,
      domains: 9,
      example_source: "web.dev",
    },
  ],
  top_pages: [
    {
      competitor_domain: "pixelforge.dev",
      ranking_url: "/blog/web-app-cost",
      keywords_count: 142,
      total_volume: 11_400,
      best_position: 2,
    },
    {
      competitor_domain: "buildstack.io",
      ranking_url: "/services/headless",
      keywords_count: 96,
      total_volume: 6_200,
      best_position: 3,
    },
    {
      competitor_domain: "pixelforge.dev",
      ranking_url: "/pricing/redesign",
      keywords_count: 71,
      total_volume: 8_900,
      best_position: 4,
    },
  ],
  backlink_history: (
    [
      ["arddev.in", 96, 128],
      ["pixelforge.dev", 340, 386],
      ["buildstack.io", 199, 214],
    ] as const
  ).flatMap(([target_domain, from, to]) =>
    Array.from({ length: 6 }, (_, i) => ({
      target_domain,
      month: `2026-0${4 + i}`,
      // A steady climb with a little month-to-month wobble.
      referring_domains:
        i === 0 || i === 5
          ? i === 0
            ? from
            : to
          : Math.round(
              from +
                ((to - from) * i) / 5 +
                [0, -4, 3, -2, 5, 0][i] * (from > 300 ? 2 : 1),
            ),
    })),
  ),
};

/* ---------- GET /crawls, /crawls/:id/issues ------------------------------ */

export const crawl = {
  crawl_run_id: "cr_12",
  url_crawled_count: 412,
  url_failed_count: 6,
  url_blocked_count: 3,
  crawl_completed_at: "2026-10-06T04:12:00Z",
};

export type Issue = {
  issue_type: string;
  severity: "error" | "warning" | "notice";
  count: number;
  example: string;
  what: string;
};

export const issues: Issue[] = [
  {
    issue_type: "broken_internal_link",
    severity: "error",
    count: 6,
    example: "/blog/react-server-components → /docs/rsc (404)",
    what: "Links that point at pages returning 404.",
  },
  {
    issue_type: "redirect_chain",
    severity: "warning",
    count: 4,
    example: "/services-old → /services → /services/web-development",
    what: "Two or more hops before the final page.",
  },
  {
    issue_type: "duplicate_meta_description",
    severity: "warning",
    count: 11,
    example: "/case-studies/*",
    what: "Several pages share one description.",
  },
  {
    issue_type: "missing_h1",
    severity: "warning",
    count: 3,
    example: "/contact",
    what: "No top-level heading on the page.",
  },
  {
    issue_type: "slow_lcp_mobile",
    severity: "warning",
    count: 2,
    example: "/case-studies/fintech-dashboard (4.8s)",
    what: "Largest Contentful Paint over 2.5s on mobile.",
  },
  {
    issue_type: "noindex_in_sitemap",
    severity: "notice",
    count: 3,
    example: "/thank-you",
    what: "Pages in the sitemap that ask not to be indexed.",
  },
  {
    issue_type: "image_missing_alt",
    severity: "notice",
    count: 27,
    example: "/about (9 images)",
    what: "Images without alternative text.",
  },
  {
    issue_type: "title_too_long",
    severity: "notice",
    count: 5,
    example: "/blog/webflow-vs-nextjs (74 chars)",
    what: "Titles likely cut off in results.",
  },
];

/* ---------- GET /backlinks (per-link rows) ------------------------------ */

export type Backlink = {
  /** Authority score of the linking page, 0-100. */
  page_from_rank: number;
  source_title: string;
  source_page_url: string;
  language: string;
  mobile_friendly: boolean;
  external_links: number;
  internal_links: number;
  anchor_text: string;
  target_url: string;
  link_type: "Text" | "Image";
  attribute: "follow" | "nofollow" | "sponsored" | "ugc";
  semantic_location: "Content" | "Footer" | "Sidebar" | "Header" | null;
  status: "active" | "new" | "lost";
  lost_reason?: "Link removed" | "Page not found" | "Redirected";
  first_seen: string;
  last_seen: string;
  /** Set when the target page on our site no longer resolves. */
  our_status?: 404 | 410;
};

type Row = [
  number,
  string,
  string,
  string,
  boolean,
  number,
  number,
  string,
  string,
  Backlink["link_type"],
  Backlink["attribute"],
  Backlink["semantic_location"],
  Backlink["status"],
  Backlink["lost_reason"] | null,
  string,
  string,
];

const BROKEN_TARGETS = new Set([
  "arddev.in/blog/performance-budgeting-all-you-need-to-know",
  "arddev.in/blog/understanding-react-server-components",
]);

// prettier-ignore
const backlinkSeeds: Row[] = [
  [71, "Best web development companies in India (2026) | Clutch", "clutch.co/in/web-developers", "EN", true, 212, 340, "Arddev", "arddev.in/", "Text", "follow", "Content", "active", null, "2025-11-04", "2026-10-11"],
  [64, "Core Web Vitals in practice - Smashing Magazine", "smashingmagazine.com/2026/05/core-web-vitals-in-practice", "EN", true, 38, 96, "this teardown of a slow SaaS site", "arddev.in/blog/core-web-vitals", "Text", "follow", "Content", "active", null, "2026-05-19", "2026-10-09"],
  [62, "vercel/next.js · Discussion #61234 · GitHub", "github.com/vercel/next.js/discussions/61234", "EN", true, 14, 88, "arddev.in/blog/nextjs-seo-checklist", "arddev.in/blog/nextjs-seo-checklist", "Text", "ugc", "Content", "active", null, "2026-03-02", "2026-10-10"],
  [58, "Arddev - Product Hunt", "producthunt.com/products/arddev", "EN", true, 9, 140, "Visit website", "arddev.in/", "Text", "nofollow", "Sidebar", "active", null, "2025-12-15", "2026-10-07"],
  [55, "Top Next.js agencies - DesignRush", "designrush.com/agency/web-development-companies/nextjs", "EN", true, 120, 260, "arddev.in", "arddev.in/", "Text", "follow", "Content", "new", null, "2026-10-02", "2026-10-12"],
  [52, "How to migrate a WordPress site to Next.js - Stack Overflow", "stackoverflow.com/questions/77812345/migrate-wordpress-to-nextjs", "EN", true, 6, 112, "website migration checklist", "arddev.in/blog/website-migration", "Text", "ugc", "Content", "active", null, "2026-02-21", "2026-10-08"],
  [49, "Webflow vs Next.js for startups : r/webdev", "reddit.com/r/webdev/comments/1f3k2a/webflow_vs_nextjs_for_startups", "EN", true, 22, 74, "this comparison", "arddev.in/blog/webflow-vs-nextjs", "Text", "ugc", "Content", "active", null, "2026-04-11", "2026-10-11"],
  [47, "Redirecting...", "shorthalte4dzone.online/", "EN", false, 1, 0, "buat ke situs terbaru kami :D", "arddev.in/", "Text", "follow", null, "lost", "Link removed", "2026-04-04", "2026-05-03"],
  [46, "Shopify Hydrogen vs Next.js - SitePoint", "sitepoint.com/shopify-hydrogen-vs-nextjs", "EN", true, 19, 63, "headless commerce build", "arddev.in/services/web-development", "Text", "follow", "Content", "lost", "Link removed", "2025-12-08", "2026-09-21"],
  [44, "Ask HN: Who builds marketing sites in Next.js?", "news.ycombinator.com/item?id=41827733", "EN", true, 31, 12, "arddev.in", "arddev.in/", "Text", "nofollow", "Content", "active", null, "2026-06-30", "2026-10-06"],
  [43, "Web development agencies | GoodFirms", "goodfirms.co/directory/languages/top-website-development-companies", "EN", true, 180, 310, "Arddev", "arddev.in/", "Text", "follow", "Content", "new", null, "2026-09-28", "2026-10-12"],
  [41, "Building a fintech dashboard in 6 weeks - HackerNoon", "hackernoon.com/building-a-fintech-dashboard-in-6-weeks", "EN", true, 12, 57, "case study", "arddev.in/case-studies/fintech-dashboard", "Text", "follow", "Content", "active", null, "2026-01-17", "2026-10-03"],
  [39, "Tailwind CSS - Showcase", "tailwindcss.com/showcase", "EN", true, 64, 22, "Arddev studio", "arddev.in/", "Image", "follow", "Content", "active", null, "2026-02-09", "2026-10-09"],
  [37, "Accessibility audits that actually ship - CSS-Tricks", "css-tricks.com/accessibility-audits-that-ship", "EN", true, 17, 81, "accessibility audit", "arddev.in/services/web-development", "Text", "follow", "Content", "new", null, "2026-10-05", "2026-10-12"],
  [35, "Next.js SEO checklist for 2026 - DEV Community", "dev.to/arddev/nextjs-seo-checklist-2026", "EN", true, 8, 45, "full checklist on our blog", "arddev.in/blog/nextjs-seo-checklist", "Text", "follow", "Content", "active", null, "2026-03-14", "2026-10-10"],
  [33, "Freelance vs agency: who should build your MVP? - Indie Hackers", "indiehackers.com/post/freelance-vs-agency-mvp-8a1c2", "EN", true, 11, 39, "arddev", "arddev.in/", "Text", "ugc", "Content", "active", null, "2026-05-27", "2026-09-30"],
  [31, "Sortlist: web agencies in Bangalore", "sortlist.com/web-development/bangalore-karnataka-in", "EN", true, 96, 204, "Arddev", "arddev.in/", "Text", "sponsored", "Content", "active", null, "2026-01-05", "2026-10-11"],
  [29, "Weekly web dev links #212 - Frontend Focus", "frontendfoc.us/issues/212", "EN", true, 41, 6, "How we cut LCP by 60%", "arddev.in/blog/core-web-vitals", "Text", "follow", "Content", "lost", "Page not found", "2025-11-21", "2026-08-30"],
  [27, "Headless commerce stack guide - Hashnode", "hashnode.com/post/headless-commerce-stack-guide", "EN", true, 15, 33, "arddev.in/services/web-development", "arddev.in/services/web-development", "Text", "follow", "Content", "new", null, "2026-10-01", "2026-10-11"],
  [26, "Awwwards - Arddev profile", "awwwards.com/arddev", "EN", true, 7, 92, "Website", "arddev.in/", "Text", "nofollow", "Header", "active", null, "2025-12-02", "2026-10-04"],
  [24, "Resources for designers (2026) - UX Collective", "uxdesign.cc/resources-for-designers-2026", "EN", true, 58, 14, "Next.js development agency", "arddev.in/services/nextjs-development", "Text", "follow", "Content", "new", null, "2026-09-24", "2026-10-10"],
  [23, "arddev+nextjs - Yahoo Search Results", "uk.search.yahoo.com/mobile/s?p=arddev%2Bnextjs", "EN", true, 17, 32, "www.arddev.in › blog › ...", "arddev.in/blog/understanding-react-server-components", "Text", "follow", null, "lost", "Link removed", "2025-11-20", "2026-04-10"],
  [23, "Website migration checklist (thread) : r/SEO", "reddit.com/r/SEO/comments/1g9p0x/website_migration_checklist", "EN", true, 20, 42, "migration checklist", "arddev.in/blog/website-migration", "Text", "ugc", "Content", "active", null, "2026-07-08", "2026-10-02"],
  [21, "API integration partners | Zapier", "zapier.com/partners/experts/arddev", "EN", true, 5, 66, "arddev.in", "arddev.in/", "Text", "follow", "Sidebar", "active", null, "2026-02-27", "2026-10-07"],
  [19, "Directory of B2B website designers", "b2bwebdirectory.net/designers?page=4", "EN", false, 140, 12, "arddev", "arddev.in/", "Text", "follow", "Footer", "lost", "Redirected", "2025-12-19", "2026-07-14"],
  [18, "Performance Budgeting - Вопросы к П...", "ya.ru/neurum/t/PerformanceBudgeting", "RU", true, 7, 27, "www.arddev.in", "arddev.in/blog/performance-budgeting-all-you-need-to-know", "Text", "follow", "Content", "active", null, "2026-06-29", "2026-08-15"],
  [17, "Business Strategy - Вопросы к П...", "ya.ru/neurum/t/BusinessStrategy", "RU", true, 47, 83, "www.arddev.in", "arddev.in/blog/performance-budgeting-all-you-need-to-know", "Text", "follow", "Content", "active", null, "2026-06-27", "2026-10-01"],
  [15, "Jamstack agencies directory", "jamstack.org/agencies", "EN", true, 230, 18, "Arddev", "arddev.in/", "Text", "follow", "Content", "new", null, "2026-10-06", "2026-10-12"],
  [12, "Weekly roundup: Next.js links - Medium", "medium.com/@frontendweekly/nextjs-roundup-41", "EN", true, 26, 9, "nextjs seo checklist", "arddev.in/blog/nextjs-seo-checklist", "Text", "nofollow", "Content", "active", null, "2026-08-12", "2026-10-05"],
  [11, "IFRS 15 automated: a guide to compliance dashboards", "finopsjournal.com/ifrs-15-automated", "EN", true, 31, 45, "five-step model", "arddev.in/case-studies/fintech-dashboard", "Text", "follow", "Content", "active", null, "2026-03-27", "2026-09-26"],
];

export const backlinks: Backlink[] = backlinkSeeds.map(
  ([
    page_from_rank,
    source_title,
    source_page_url,
    language,
    mobile_friendly,
    external_links,
    internal_links,
    anchor_text,
    target_url,
    link_type,
    attribute,
    semantic_location,
    status,
    lost_reason,
    first_seen,
    last_seen,
  ]) => ({
    page_from_rank,
    source_title,
    source_page_url,
    language,
    mobile_friendly,
    external_links,
    internal_links,
    anchor_text,
    target_url,
    link_type,
    attribute,
    semantic_location,
    status,
    lost_reason: lost_reason ?? undefined,
    first_seen,
    last_seen,
    // These targets were deleted in the July blog cleanup without a redirect.
    our_status: BROKEN_TARGETS.has(target_url) ? 404 : undefined,
  }),
);

/** GET /backlinks snapshot: the headline numbers for the latest capture. */
export const backlinkSnapshot = (() => {
  const live = backlinks.filter((b) => b.status !== "lost");
  const domain = (u: string) => u.split("/")[0];
  return {
    captured_date: "2026-10-04",
    backlinks_total: live.length,
    backlinks_new: backlinks.filter((b) => b.status === "new").length,
    backlinks_lost: backlinks.filter((b) => b.status === "lost").length,
    referring_domains: new Set(live.map((b) => domain(b.source_page_url))).size,
    referring_pages: new Set(live.map((b) => b.source_page_url)).size,
    referring_ips: 24,
    referring_subnets: 22,
    provider_rank: 35,
    dofollow: live.filter((b) => b.attribute === "follow").length,
  };
})();

/** Top referring domains: links and dofollow links per domain. */
export const referringDomains = Object.values(
  backlinks
    .filter((b) => b.status !== "lost")
    .reduce<
      Record<
        string,
        { domain: string; rank: number; links: number; dofollow: number }
      >
    >((m, b) => {
      const d = b.source_page_url.split("/")[0];
      const r = (m[d] ??= { domain: d, rank: 0, links: 0, dofollow: 0 });
      r.rank = Math.max(r.rank, b.page_from_rank);
      r.links += 1;
      if (b.attribute === "follow") r.dofollow += 1;
      return m;
    }, {}),
).sort((a, b) => b.rank - a.rank);

/** Anchor mix: how many referring domains use each anchor. */
export const anchors = Object.entries(
  backlinks
    .filter((b) => b.status !== "lost")
    .reduce<Record<string, Set<string>>>((m, b) => {
      (m[b.anchor_text] ??= new Set()).add(b.source_page_url.split("/")[0]);
      return m;
    }, {}),
)
  .map(([anchor, d]) => ({ anchor, referring_domains: d.size }))
  .sort(
    (a, b) =>
      b.referring_domains - a.referring_domains ||
      a.anchor.localeCompare(b.anchor),
  );

/* ---------- GET /chat/threads/:id/messages ------------------------------- */

export type Answer = {
  answer_summary: string;
  confidence_score?: number;
  main_cause?: string;
  supporting_evidence?: { statement: string }[];
  limitations?: string[];
  recommended_actions?: { action_text: string }[];
  blocks?: (
    | { type: "table"; title?: string; headers: string[]; rows: string[][] }
    | {
        type: "page_findings";
        items: { page: string; numbers: string; cause: string; fix: string }[];
      }
    | { type: "plan"; steps: { period: string; actions: string[] }[] }
  )[];
  suggested_actions?: { label: string; action: string; reason?: string }[];
};

export type Message =
  { role: "user"; text: string } | { role: "ai"; answer: Answer };

/** The seeded first consultation the chat opens with. */
export const seededThread: Message[] = [
  { role: "user", text: "Why did my clicks drop this week?" },
  {
    role: "ai",
    answer: {
      confidence_score: 0.88,
      main_cause:
        "One page lost its ranking after a content change; the rest of the site held.",
      supporting_evidence: [
        {
          statement:
            "Site clicks 88 → 61 week over week; 23 of the 27 lost clicks came from /blog/nextjs-seo-checklist.",
        },
        {
          statement:
            "Its position for “nextjs seo checklist” went 3.1 → 8.4 on 30 Sep (Search Console, daily).",
        },
        {
          statement:
            "The page was edited on 30 Sep: the comparison table was removed (crawl diff, 29 Sep vs 6 Oct).",
        },
        {
          statement:
            "The two pages now above it both carry a comparison table (results-page capture, 4 Oct).",
        },
      ],
      limitations: [
        "Search Console data ends on 8 Oct; the last two days are not in yet.",
        "No Google update was confirmed in this window, so a broader shift cannot be fully ruled out.",
      ],
      answer_summary:
        "Clicks fell **31%** this week, and almost all of it is **one page**.\n\n`/blog/nextjs-seo-checklist` dropped from position **3.1 to 8.4** for its main query on 30 September, the same day its comparison table was removed. The pages that took its place both have one.\n\nEverything else on the site is flat or slightly up.",
      blocks: [
        {
          type: "page_findings",
          items: [
            {
              page: "/blog/nextjs-seo-checklist",
              numbers: "clicks 31 → 8 · position 3.1 → 8.4",
              cause: "comparison table removed on 30 Sep",
              fix: "Restore the table, then re-request indexing in Search Console.",
            },
          ],
        },
      ],
      recommended_actions: [
        {
          action_text:
            "Restore the comparison table on `/blog/nextjs-seo-checklist`.",
        },
        { action_text: "Re-request indexing for the page once it is live." },
        {
          action_text:
            "Check back next Monday: Seerix measures the fix automatically.",
        },
      ],
      suggested_actions: [
        { label: "Add to fix list", action: "add_fix" },
        { label: "Run a fresh crawl", action: "run_crawl" },
      ],
    },
  },
];

/** Canned replies until the chat endpoint is wired, picked by topic. */
export function cannedAnswer(question: string): Answer {
  const q = question.toLowerCase();
  if (/rank|moved|position|keyword/.test(q)) {
    return {
      confidence_score: 0.82,
      main_cause:
        "Two tracked keywords moved more than three places this week.",
      supporting_evidence: [
        {
          statement:
            "Weekly results-page captures, 1 Oct vs 8 Oct, 14 tracked keywords.",
        },
      ],
      answer_summary:
        "Two keywords moved more than three places this week. **nextjs seo checklist** fell 5 places after the content change on its page, and **hire nextjs developer** climbed 4 after the title rewrite on `/services/nextjs-development`.",
      blocks: [
        {
          type: "table",
          title: "Biggest movers",
          headers: ["keyword", "was", "now", "page"],
          rows: [
            ["nextjs seo checklist", "3", "8", "/blog/nextjs-seo-checklist"],
            [
              "hire nextjs developer",
              "15",
              "11",
              "/services/nextjs-development",
            ],
          ],
        },
      ],
      suggested_actions: [{ label: "Open rankings", action: "open_rankings" }],
    };
  }
  if (/link|outreach|backlink|prospect/.test(q)) {
    return {
      confidence_score: 0.74,
      main_cause:
        "clutch.co links to both competitors and lists agencies by city.",
      supporting_evidence: [
        {
          statement:
            "clutch.co links to pixelforge.dev and buildstack.io, not to you (link profile, 4 Oct).",
        },
      ],
      limitations: [
        "Link data comes from a third-party index and refreshes fortnightly.",
      ],
      answer_summary:
        "Your best prospect is **clutch.co**: it links to both competitors, has a domain rank of 89, and listing is free.\n\nHere is a short outreach note you could adapt:",
      recommended_actions: [
        {
          action_text:
            "Create a Clutch profile with two case studies and ask three clients for reviews.",
        },
        {
          action_text: "Then pitch designrush.com with the same case studies.",
        },
      ],
      blocks: [
        {
          type: "plan",
          steps: [
            {
              period: "This week",
              actions: [
                "Create the Clutch profile",
                "Ask three clients for reviews",
              ],
            },
            {
              period: "Next week",
              actions: ["Submit to DesignRush and GoodFirms"],
            },
          ],
        },
      ],
    };
  }
  if (/drop|fell|traffic|click|changed|week/.test(q)) {
    return seededThread[1].role === "ai"
      ? seededThread[1].answer
      : { answer_summary: "" };
  }
  return {
    main_cause: "needs_clarification",
    answer_summary:
      "I can answer that from your Search Console, rankings, crawl and link data. Which would help most?",
    suggested_actions: [
      { label: "What changed this week", action: "ask:what changed this week" },
      {
        label: "Which keywords moved",
        action: "ask:which of my keywords moved the most this week and why",
      },
      {
        label: "Best link prospects",
        action: "ask:draft an outreach email for the best link prospect",
      },
    ],
  };
}

/* ---------- formatting -------------------------------------------------- */

export const fmt = (n: number | null | undefined) =>
  n == null ? "—" : n.toLocaleString("en-US");

export const pct = (n: number | null | undefined, digits = 2) =>
  n == null ? "—" : `${(n * 100).toFixed(digits)}%`;

export const shortDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", timeZone: "UTC" },
  );
