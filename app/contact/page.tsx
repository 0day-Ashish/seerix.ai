import type { Metadata } from "next";

import ContactForm from "@/components/contact/contact-form";
import { ContactIntro, ContactRoutes } from "@/components/contact/contact-routes";
import Cta from "@/components/new-landing/cta";
import SiteFooter from "@/components/new-landing/site-footer";

export const metadata: Metadata = {
  title: "Contact · Seerix",
  description:
    "Questions about what Seerix can see, whether it fits your portfolio, or what a diagnosis looks like on your site. We reply within one business day.",
  openGraph: {
    title: "Contact Seerix",
    description:
      "Talk to the people who built it. A person, not a ticket queue, replying within one business day.",
    type: "website",
  },
};

/**
 * The contact page, after the tokensupply site's: the introduction beside the
 * form, the other ways to reach the team, then the homepage's close.
 */
export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-ghost">
      <ContactIntro form={<ContactForm />} />
      <ContactRoutes />
      <Cta />
      <SiteFooter />
    </div>
  );
}
