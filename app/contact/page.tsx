import type { Metadata } from "next";

import ContactFaq from "@/components/contact/contact-faq";
import ContactForm from "@/components/contact/contact-form";
import {
  ContactFormBlock,
  ContactOpener,
  ContactRoutes,
} from "@/components/contact/contact-routes";
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

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <ContactOpener />

      <div className="flex flex-1 flex-col">
        <ContactFormBlock form={<ContactForm />} />
        <ContactRoutes />
        <ContactFaq />
        <Cta />
      </div>

      <SiteFooter />
    </div>
  );
}
