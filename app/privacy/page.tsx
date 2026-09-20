import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/legal/legal-page";
import SiteFooter from "@/components/new-landing/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy · Seerix",
  description:
    "What Seerix reads from your Google account, what it stores, how long it keeps it, and how to revoke access or delete everything.",
};

const sections: LegalSection[] = [
  {
    heading: "The short version",
    body: [
      "Seerix reads your Google Search Console data so it can explain your rankings. Access is read-only and you can revoke it at any time from your Google Account permissions page, effective immediately.",
      "We store what an analysis needs, we do not sell it, we do not share it between customers, and we do not use it to train AI models. Delete your account and the data is deleted with it. The rest of this page is the detail behind those sentences.",
    ],
  },
  {
    heading: "Who we are",
    body: [
      "Seerix provides an SEO analysis platform that connects to Google Search Console and produces evidence-cited diagnoses. For the purposes of data protection law we are the controller of the account data described below, and a processor of the Search Console data you connect.",
      "You can reach us about anything on this page at hello@seerix.ai.",
    ],
  },
  {
    heading: "What we collect",
    body: [
      "We collect three kinds of data, and nothing beyond what those require:",
    ],
    list: [
      "Account data: your name, email address and basic Google profile information, used to sign you in and to contact you about your account.",
      "Connected Search Console data: the search performance metrics, queries, pages and property settings that Google exposes on a read-only basis for the properties you explicitly connect.",
      "Data Seerix generates: crawl results for your sites, SERP and ranking snapshots, competitor movement, and the diagnoses and evidence built from all of the above.",
      "Billing data: your plan, billing contact and payment status. Card details are handled by our payment provider and never reach our servers.",
      "Operational data: logs, error reports and basic product usage, used to keep the service running and to debug faults.",
    ],
  },
  {
    heading: "What permissions we hold on your Google account",
    body: [
      "Read-only, and only what you explicitly grant: basic sign-in identity, and read-only Search Console access for the properties you connect. Seerix cannot modify anything in your Google account. It cannot change settings, add or remove properties, or write data of any kind.",
      "You can revoke that access at any time from your Google Account permissions page. Revocation takes effect immediately and stops all further collection; the data already collected is handled under the retention and deletion sections below.",
      "Seerix's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
    ],
  },
  {
    heading: "Why we process it",
    body: [
      "Each category of data has one purpose and is not repurposed:",
    ],
    list: [
      "To produce the diagnoses, reports and alerts you asked for, which is the performance of our contract with you.",
      "To keep your account secure and the service reliable, which is our legitimate interest in running the platform.",
      "To bill you and meet our accounting obligations, which is a legal obligation.",
      "To send you service messages about your account. Marketing email is separate and only goes out where you have opted in.",
    ],
  },
  {
    heading: "How the AI uses your data",
    body: [
      "The model never browses the web and never free-associates about your site. It only sees structured evidence packets built from your own connected data, and every claim it makes has to cite specific evidence rows. Answers citing evidence that does not exist are rejected by validators before you ever see them.",
      "Your data is not used to train any AI model, ours or a third party's. Where an analysis runs through a third-party model provider, it goes under terms that prohibit training on the content we send.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We do not sell your data and we never share one customer's data with another. Customer data is isolated per account, so a diagnosis for one site cannot draw on another account's data.",
      "We share data only with the service providers needed to run Seerix, each bound by contract to process it only on our instructions:",
    ],
    list: [
      "Cloud hosting and database providers that store the platform's data.",
      "AI model providers that run analyses, under terms that forbid training on your content.",
      "Payment processing for subscription billing.",
      "Error monitoring and product analytics used to keep the service working.",
      "Authorities, where we are legally required to disclose something and the request is valid.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Connected Search Console metrics, crawl results, ranking snapshots and the diagnoses built from them are retained while your account is active, because week-over-week comparison and 'did my fix work?' depend on that history.",
      "If you cancel, your account stays readable until the end of the billing period, after which the data is scheduled for deletion. You can export your findings before that point, or trigger deletion immediately from account settings instead of waiting. Billing records are kept for as long as accounting law requires.",
    ],
  },
  {
    heading: "How we protect it",
    body: [
      "Data is encrypted in transit and at rest, isolated per customer, and access by our staff is limited to what is needed to operate and support the service. Access to production systems is restricted and logged.",
      "No system is perfect. If a breach affects your data, we will notify you and the relevant regulator within the timeframes the law sets.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Depending on where you live, you can ask us to give you a copy of your data, correct it, delete it, restrict or object to how we use it, or hand it to another provider in a portable format. You can also withdraw consent where our processing rests on it, and revoking Google access is always available to you directly.",
      "Write to hello@seerix.ai to exercise any of these. We respond within one month. If you are unhappy with our answer you can complain to your local data protection authority.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "We use cookies that are necessary to sign you in and keep your session, and a small amount of privacy-respecting analytics to understand how the product is used. We do not run advertising cookies or third-party ad trackers.",
      "Your theme preference is stored in your browser's local storage rather than sent to us.",
    ],
  },
  {
    heading: "International transfers",
    body: [
      "Our providers may process data outside your country, including in the United States. Where that happens we rely on appropriate safeguards such as the European Commission's standard contractual clauses.",
    ],
  },
  {
    heading: "Children",
    body: [
      "Seerix is a business tool and is not directed at children. We do not knowingly collect data from anyone under 16. If you believe a child has given us data, tell us and we will delete it.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If we change this policy we will update the date at the top of the page, and for material changes we will tell you by email or in the product before they take effect.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col">
        <LegalPage
          label="Legal"
          title="Privacy Policy"
          lede="What Seerix reads, what it stores, how long it keeps it, and how to take it all back."
          updated="20 September 2026"
          sections={sections}
        />
      </div>

      <SiteFooter />
    </div>
  );
}
