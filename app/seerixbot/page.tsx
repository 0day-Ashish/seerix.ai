import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/legal/legal-page";
import SiteFooter from "@/components/new-landing/site-footer";

export const metadata: Metadata = {
  title: "About SeerixBot · Seerix",
  description:
    "SeerixBot is the crawler that reads your site so Seerix can explain your rankings. What it fetches, how to identify it, and how to control or block it.",
};

const sections: LegalSection[] = [
  {
    heading: "What SeerixBot is",
    body: [
      "SeerixBot is the crawler behind the Seerix platform. When a customer connects a site, SeerixBot fetches its pages so that a diagnosis can cite what is actually on them: titles, headings, internal links, canonical tags, status codes and page structure.",
      "It crawls only sites that a customer has connected and configured, and it crawls within the limits of that customer's plan. It does not roam the web building a general index, and it is not an AI training crawler: nothing it fetches is used to train models.",
    ],
  },
  {
    heading: "How to identify it",
    body: [
      "SeerixBot identifies itself in the user agent string on every request, so you can recognise it in your logs:",
    ],
    list: [
      "Mozilla/5.0 (compatible; SeerixBot/1.0; +https://seerix.ai/seerixbot)",
      "Requests come from our published crawler infrastructure and always carry that agent string.",
      "If you see traffic claiming to be SeerixBot that does not resolve to our infrastructure, it is not us. Send us the log lines and we will look into it.",
    ],
  },
  {
    heading: "What it fetches",
    body: [
      "SeerixBot requests HTML pages and the resources it needs to understand them. It reads what a search engine would read, and no more:",
    ],
    list: [
      "Page HTML, response headers and status codes.",
      "Titles, meta descriptions, headings, canonical tags and structured data.",
      "Internal and outbound link structure.",
      "robots.txt and XML sitemaps.",
    ],
  },
  {
    heading: "What it does not do",
    body: ["There are hard limits on the crawler's behaviour:"],
    list: [
      "It does not attempt to log in, submit forms, or reach anything behind authentication.",
      "It does not collect personal data from pages, and it is not used to build marketing lists.",
      "It does not click through checkout flows or take any action that changes state on your site.",
      "It does not ignore robots.txt.",
    ],
  },
  {
    heading: "How politely it crawls",
    body: [
      "SeerixBot is rate limited per site and backs off automatically when a server slows down or starts returning errors. Crawls are scheduled to spread load rather than arrive all at once, and repeat crawls use conditional requests so unchanged pages are not re-fetched in full.",
      "If SeerixBot is still heavier than you would like, you can slow it with a Crawl-delay directive or write to us and we will lower the rate for your domain directly.",
    ],
  },
  {
    heading: "Controlling or blocking it",
    body: [
      "SeerixBot obeys robots.txt. To block it from your whole site, add:",
      "User-agent: SeerixBot / Disallow: /",
      "To keep it out of one area only, disallow that path instead. Changes to robots.txt are picked up on the next crawl.",
      "Blocking SeerixBot on a site you have connected to Seerix means diagnoses for that site lose their on-page evidence, so the analysis will be thinner. That is a legitimate choice; it is just worth knowing the trade.",
    ],
  },
  {
    heading: "Reporting a problem",
    body: [
      "If SeerixBot is causing load problems, hitting pages it should not, or behaving in any way that looks wrong, write to hello@seerix.ai with your domain and the relevant log lines. Crawler complaints are treated as urgent, and we can suspend crawling of a domain immediately while we investigate.",
    ],
  },
];

export default function SeerixBotPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col">
        <LegalPage
          label="Legal"
          title="About SeerixBot"
          lede="The crawler that reads your site so Seerix can explain your rankings. What it fetches, how to spot it, and how to control it."
          updated="20 September 2026"
          sections={sections}
        />
      </div>

      <SiteFooter />
    </div>
  );
}
