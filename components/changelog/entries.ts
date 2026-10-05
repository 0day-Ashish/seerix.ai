/**
 * The changelog, newest first. Edit this file to publish a release: the page
 * reads nothing else.
 *
 * PLACEHOLDER CONTENT: these entries describe features the site already
 * talks about, with illustrative dates and versions. Replace them with the
 * real release history before launch.
 */

export type ChangeKind = "New" | "Improved" | "Fixed";

export type Entry = {
  /** ISO date; shown as e.g. "12 Sep 2026". */
  date: string;
  version: string;
  kind: ChangeKind;
  title: string;
  summary: string;
  changes: string[];
  /** Which product sketch to show beside the entry, if any. */
  sketch?: "diagnosis" | "alerts" | "titles";
};

export const entries: Entry[] = [
  {
    date: "2026-09-22",
    version: "0.9",
    kind: "New",
    title: "Did-my-fix-work verification",
    summary:
      "Mark a finding as fixed and Seerix watches what happens next, then tells you whether the fix worked, with the evidence either way.",
    changes: [
      "Fixes tracked from the day you mark them done",
      "Verdicts carry a confidence score, like every diagnosis",
      "Verified fixes roll up into the weekly report",
    ],
    sketch: "diagnosis",
  },
  {
    date: "2026-09-08",
    version: "0.8.2",
    kind: "Improved",
    title: "Faster first diagnosis",
    summary:
      "The first answer after connecting Search Console now lands during the initial crawl instead of after it.",
    changes: [
      "History import runs alongside the first crawl",
      "Progress shown while the import runs",
    ],
  },
  {
    date: "2026-08-25",
    version: "0.8",
    kind: "New",
    title: "Competitor alerts",
    summary:
      "Seerix now flags when a competitor moves on a query you rank for, before the traffic change shows up in your numbers.",
    changes: [
      "Alerts for competitor moves on your ranking queries",
      "Alert feed with new findings marked",
      "Available on Growth and Agency",
    ],
    sketch: "alerts",
  },
  {
    date: "2026-08-11",
    version: "0.7.4",
    kind: "Fixed",
    title: "Search Console date alignment",
    summary:
      "Seerix now matches Search Console's reporting days exactly, so totals reconcile with what you see in Google.",
    changes: [
      "Reporting days aligned to Search Console's time zone",
      "Week-over-week comparisons recalculated",
    ],
  },
  {
    date: "2026-07-28",
    version: "0.7",
    kind: "New",
    title: "Title and description rewrites",
    summary:
      "Three title and meta description variants per page, written against the page's real queries and each citing the guideline it followed.",
    changes: [
      "Three variants per page",
      "Character counts against the display limit",
      "Each suggestion cites its guideline",
    ],
    sketch: "titles",
  },
  {
    date: "2026-07-14",
    version: "0.6.3",
    kind: "Improved",
    title: "Clearer confidence scores",
    summary:
      "A low-confidence answer now says which evidence it wanted and did not have, instead of only showing the score.",
    changes: [
      "Missing evidence listed under low scores",
      "Confidence explained in plain language",
    ],
  },
];
