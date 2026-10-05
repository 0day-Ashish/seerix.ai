import Link from "next/link";

import SeerixMark from "@/components/new-landing/seerix-mark";

const tagline =
  "The SEO platform that explains why. Connect your Google Search Console and get diagnoses with receipts, not dashboards with homework.";

const contacts = [{ label: "hello@seerix.ai", href: "mailto:hello@seerix.ai" }];

export default function FooterContact() {
  return (
    <div className="max-w-xs">
      <Link href="/" className="group flex items-center gap-2">
        <SeerixMark size={32} tone="white" />
        <span className="relative font-display text-[25px] font-medium tracking-[-0.03em] text-white">
          seerix
          <sup className="absolute -right-4 top-1.5 font-body text-[9px] font-extrabold leading-none tracking-normal text-white">
            TM
          </sup>
        </span>
      </Link>

      <p className="mt-6 font-body text-[15px] leading-relaxed text-white/40">
        {tagline}
      </p>

      <ul className="mt-6 space-y-2">
        {contacts.map((contact) => (
          <li key={contact.label}>
            <Link
              href={contact.href}
              className="font-body text-[15px] text-white transition-colors duration-200 hover:text-[#DCDDDD]"
            >
              {contact.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
