import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/legal/legal-page";
import SiteFooter from "@/components/new-landing/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service · Seerix",
  description:
    "The agreement covering your use of Seerix: plans and billing, what you and we are each responsible for, and how either side can end it.",
};

const sections: LegalSection[] = [
  {
    heading: "Agreement to these terms",
    body: [
      "These terms are the agreement between you and Seerix for your use of the Seerix platform. By creating an account or using the service you accept them. If you are agreeing on behalf of a company, you confirm you are authorised to bind it, and 'you' means that company.",
      "If you do not accept these terms, do not use the service.",
    ],
  },
  {
    heading: "What the service does",
    body: [
      "Seerix connects to Google Search Console on a read-only basis, monitors your search performance and rankings, and produces diagnoses explaining what changed and why, each citing the evidence it was built from.",
      "Seerix is an analysis tool. It tells you what its evidence supports; it does not guarantee any particular ranking, traffic level or commercial outcome, and search engines remain free to change their behaviour at any time.",
    ],
  },
  {
    heading: "Your account",
    body: [
      "You need an account to use Seerix, and the details you give us must be accurate. You are responsible for what happens under your account, including keeping your credentials secure, and you should tell us promptly at hello@seerix.ai if you believe it has been used without your permission.",
      "You must be at least 16 years old and legally able to enter into this agreement.",
    ],
  },
  {
    heading: "Plans, billing and renewal",
    body: [
      "Plans are billed monthly in advance at the price shown on the pricing page, and renew automatically until cancelled. Prices exclude tax unless stated otherwise; any applicable VAT or sales tax is added at checkout.",
      "Each plan covers a set number of sites and a set allowance of AI questions. Background work such as crawls, SERP snapshots, alerts and the weekly report does not draw on that allowance. Reaching the allowance pauses new AI questions until the next cycle; monitoring, reporting and alerting continue.",
      "Moving up a plan takes effect straight away and is prorated. Moving down takes effect at the next renewal and keeps everything already collected, since the limits apply to new work rather than to your history.",
    ],
  },
  {
    heading: "Cancellation and refunds",
    body: [
      "Every plan is month to month with no contract, and you can cancel at any time from account settings. Cancellation stops the next renewal; your account stays readable until the end of the period you have already paid for.",
      "We do not refund part-used months, other than where consumer law in your country requires it or where we have failed to provide the service.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Use Seerix for your own sites, or for sites you are authorised to work on. You agree not to:",
    ],
    list: [
      "Connect a property you have no right to access, or misrepresent your authority over a site.",
      "Resell, sublicense or white-label the service without our written agreement.",
      "Attempt to circumvent plan limits, rate limits or access controls, including through automated account creation.",
      "Scrape, reverse engineer or copy the platform, or use it to build a competing product.",
      "Upload unlawful content, or use the service to break the law or any third party's rights.",
      "Interfere with the platform's operation or its security, or with other customers' use of it.",
    ],
  },
  {
    heading: "Your data and your rights in it",
    body: [
      "Your Search Console data, your site content and the findings produced for your account remain yours. You grant us only the licence needed to run the service: to process that data in order to produce your diagnoses, reports and alerts.",
      "We do not sell your data, do not share it between customers, and do not use it to train AI models. How we handle it in detail is set out in the Privacy Policy, which forms part of this agreement.",
    ],
  },
  {
    heading: "Our intellectual property",
    body: [
      "The platform itself, including its software, models, prompts, evidence pipeline, design and brand, belongs to Seerix. These terms give you a limited, non-exclusive, non-transferable right to use it while your subscription is active, and nothing more.",
      "Feedback you send us may be used to improve the product without obligation to you.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "Seerix depends on third-party services, Google Search Console foremost among them. Your use of those services is governed by their own terms, and we are not responsible for their availability, accuracy or changes to them. If Google changes or withdraws access to an API we rely on, parts of the service may change accordingly.",
    ],
  },
  {
    heading: "Availability",
    body: [
      "We work to keep Seerix available and reliable, but we do not promise uninterrupted service. Maintenance, third-party outages and faults happen. Where we plan maintenance likely to interrupt the service, we will give notice in the product.",
    ],
  },
  {
    heading: "Disclaimers",
    body: [
      "The service is provided 'as is' and 'as available'. To the extent the law allows, we exclude all implied warranties, including of merchantability, fitness for a particular purpose and non-infringement.",
      "Diagnoses are analysis, not professional advice, and acting on them is your decision. Nothing here excludes liability that cannot lawfully be excluded, and nothing limits your statutory rights as a consumer.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the extent the law allows, neither party is liable for indirect or consequential loss, or for lost profits, revenue, data or goodwill. Our total liability under this agreement in any twelve-month period is limited to the fees you paid us in that period.",
      "This clause does not limit liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited by law.",
    ],
  },
  {
    heading: "Suspension and termination",
    body: [
      "You may stop using Seerix and cancel at any time. We may suspend or end your access if you materially breach these terms, if your payment fails and is not resolved, or if we are required to by law, giving you notice and a chance to put it right where it is reasonable to do so.",
      "When the agreement ends, your right to use the platform ends. Data is handled under the retention terms in the Privacy Policy: you can export your findings, or trigger immediate deletion from account settings.",
    ],
  },
  {
    heading: "Changes to the service and to these terms",
    body: [
      "We develop the product continuously, so features may be added, changed or retired. We will not materially reduce what your paid plan provides during a period you have already paid for.",
      "We may update these terms; if a change is material we will tell you by email or in the product before it takes effect. Continuing to use the service after that point means you accept the updated terms.",
    ],
  },
  {
    heading: "General",
    body: [
      "If any provision is found unenforceable, the rest continues to apply. A delay in enforcing a right is not a waiver of it. You may not assign this agreement without our consent; we may assign it as part of a merger or sale of the business.",
      "These terms, together with the Privacy Policy, are the whole agreement between us about the service.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex flex-1 flex-col">
        <LegalPage
          label="Legal"
          title="Terms of Service"
          lede="The agreement covering your use of Seerix: what each side is responsible for, how billing works, and how either of us can end it."
          updated="20 September 2026"
          sections={sections}
        />
      </div>

      <SiteFooter />
    </div>
  );
}
