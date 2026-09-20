import type { Metadata } from "next";

import ContactChannels from "@/components/contact/contact-channels";
import ContactFaq from "@/components/contact/contact-faq";
import ContactForm from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/contact-hero";
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
      <ContactHero />

      <div className="flex flex-1 flex-col">
        <section className="bg-white px-6 pb-20 sm:pb-24">
          {/* Form leads; the quicker routes sit beside it on wide screens and
              fall in underneath once the two columns stop fitting. */}
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <ContactForm />
            <ContactChannels />
          </div>
        </section>

        <ContactFaq />
      </div>

      <SiteFooter />
    </div>
  );
}
