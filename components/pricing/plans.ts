/**
 * One source of truth for the pricing route: the cards and the comparison
 * table both read from here, so a price or a limit can never disagree between
 * the two views of the same plan.
 */

export type PlanId = "starter" | "growth" | "agency";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  subtitle: string;
  /** The card's bullet list. The table carries the exhaustive version. */
  features: string[];
  cta: string;
  href: string;
  /** Only one plan carries the emphasis treatment. */
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$39",
    cadence: "/mo",
    subtitle: "For one site that matters, watched every day instead of once a quarter.",
    features: [
      "1 site",
      "100 AI questions a month",
      "1,000 pages crawled monthly",
      "500 keywords enriched monthly",
      "Weekly report and alerts",
      "Email support",
    ],
    cta: "See demo",
    href: "/#demo",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$99",
    cadence: "/mo",
    subtitle: "For builders running several sites who need every one diagnosed, not just measured.",
    featured: true,
    features: [
      "5 sites",
      "500 AI questions a month",
      "5,000 pages crawled monthly per site",
      "2,000 keywords enriched monthly per site",
      "Competitor tracking and SERP snapshots",
      "Priority support",
    ],
    cta: "See demo",
    href: "/#demo",
  },
  {
    id: "agency",
    name: "Agency",
    price: "$249",
    cadence: "/mo",
    subtitle: "For portfolios and client work, where the answer has to be defensible to someone else.",
    features: [
      "20 sites",
      "2,000 AI questions a month",
      "10,000 pages crawled monthly per site",
      "10,000 keywords enriched monthly per site",
      "Client-ready exports and shared workspaces",
      "Named account contact",
    ],
    cta: "Talk to us",
    href: "mailto:hello@seerix.ai",
  },
];

/**
 * A cell is either a literal value ("5 sites"), or included / excluded. Keeping
 * the three cases distinct lets the table render a tick, a dash, or text
 * without guessing from the string.
 */
export type Cell = string | boolean;

export type CompareRow = {
  label: string;
  /** Expands the row label where the name alone is ambiguous. */
  hint?: string;
  values: Record<PlanId, Cell>;
};

export type CompareGroup = {
  name: string;
  rows: CompareRow[];
};

export const compareGroups: CompareGroup[] = [
  {
    name: "Sites and analysis",
    rows: [
      {
        label: "Connected sites",
        values: { starter: "1", growth: "5", agency: "20" },
      },
      {
        label: "AI questions",
        hint: "One question asked, one diagnosis returned.",
        values: {
          starter: "100 / mo",
          growth: "500 / mo",
          agency: "2,000 / mo",
        },
      },
      {
        label: "Pages crawled",
        values: {
          starter: "1,000 / mo",
          growth: "5,000 / mo per site",
          agency: "10,000 / mo per site",
        },
      },
      {
        label: "Keywords enriched",
        values: {
          starter: "500 / mo",
          growth: "2,000 / mo per site",
          agency: "10,000 / mo per site",
        },
      },
      {
        label: "Search Console history",
        hint: "Pulled on first connect, so answers start with context.",
        values: { starter: "16 months", growth: "16 months", agency: "16 months" },
      },
    ],
  },
  {
    name: "Evidence and answers",
    rows: [
      {
        label: "Evidence-cited diagnoses",
        hint: "Every claim cites the rows it was built from.",
        values: { starter: true, growth: true, agency: true },
      },
      {
        label: "Confidence scoring",
        values: { starter: true, growth: true, agency: true },
      },
      {
        label: "Did-my-fix-work verification",
        values: { starter: true, growth: true, agency: true },
      },
      {
        label: "SERP snapshots",
        values: {
          starter: "100 / mo",
          growth: "500 / mo per site",
          agency: "2,000 / mo per site",
        },
      },
      {
        label: "Competitor tracking",
        values: { starter: false, growth: true, agency: true },
      },
      {
        label: "Cross-site portfolio view",
        values: { starter: false, growth: false, agency: true },
      },
    ],
  },
  {
    name: "Reporting",
    rows: [
      {
        label: "Weekly report",
        values: { starter: true, growth: true, agency: true },
      },
      {
        label: "Ranking and traffic alerts",
        values: { starter: true, growth: true, agency: true },
      },
      {
        label: "Client-ready exports",
        values: { starter: false, growth: false, agency: true },
      },
      {
        label: "Shared workspaces",
        hint: "Seats for teammates or clients on the same account.",
        values: { starter: false, growth: false, agency: true },
      },
    ],
  },
  {
    name: "Support",
    rows: [
      {
        label: "Email support",
        values: { starter: true, growth: true, agency: true },
      },
      {
        label: "Priority support",
        values: { starter: false, growth: true, agency: true },
      },
      {
        label: "Named account contact",
        values: { starter: false, growth: false, agency: true },
      },
    ],
  },
];
