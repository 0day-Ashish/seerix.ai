import Link from "next/link";

/**
 * PLACEHOLDERS -- replace before launch.
 *
 * None of these values exist anywhere else in the repo, so they were not
 * derived from anything: the address, the phone number and all three social
 * URLs are invented stand-ins so the markup has something to render. Swap them
 * here and the footer picks the real ones up in both places they appear.
 */
export const companyDetails = {
  address: [
    "Seerix Technologies",
    "1 Example Street, Suite 200",
    "San Francisco, CA 94103",
  ],
  phone: { label: "+1 (555) 010-0199", href: "tel:+15550100199" },
  email: { label: "hello@seerix.ai", href: "mailto:hello@seerix.ai" },
};

type Social = {
  label: string;
  href: string;
  /** 16x16 path data, drawn in currentColor. */
  path: string;
};

export const socials: Social[] = [
  {
    label: "X",
    href: "https://x.com/seerixai",
    path: "M12.6 1.5h2.3l-5 5.7 5.9 7.8h-4.6l-3.6-4.7-4.1 4.7H1.1l5.4-6.1L.9 1.5h4.7l3.3 4.3 3.7-4.3Zm-.8 12.1h1.3L4.6 2.8H3.2l8.6 10.8Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/seerixai",
    path: "M5.1 14.2H2.4V6.1h2.7v8.1ZM3.7 4.9a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Zm10.9 9.3h-2.7v-4c0-1-.4-1.6-1.2-1.6-.7 0-1.1.5-1.3 1-.1.2-.1.5-.1.7v3.9H6.6V6.1h2.7v1.2c.4-.6 1-1.4 2.5-1.4 1.8 0 3.1 1.2 3.1 3.7v4.6Z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/seerixai",
    path: "M4.8 1.5h6.4a3.3 3.3 0 0 1 3.3 3.3v6.4a3.3 3.3 0 0 1-3.3 3.3H4.8a3.3 3.3 0 0 1-3.3-3.3V4.8a3.3 3.3 0 0 1 3.3-3.3Zm0 1.5a1.8 1.8 0 0 0-1.8 1.8v6.4A1.8 1.8 0 0 0 4.8 13h6.4a1.8 1.8 0 0 0 1.8-1.8V4.8A1.8 1.8 0 0 0 11.2 3H4.8Zm3.2 2.1a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Zm0 1.5a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Zm3.3-2.1a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7Z",
  },
];

/**
 * The address, direct contact lines and social row. Sits in the gap between the
 * tagline block and the link columns, which was the only empty width left in
 * the footer.
 */
export default function FooterDetails() {
  return (
    // Indented off the tagline block so the two do not read as one column.
    <div className="max-w-xs lg:pl-8 xl:pl-12">
      <h3 className="font-body text-[15px] text-white/40">Office</h3>

      <address className="mt-6 font-body text-[15px] not-italic leading-relaxed text-white/40">
        {companyDetails.address.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>

      {/* Phone only: the email already sits in the tagline block to the left. */}
      <p className="mt-4">
        <Link
          href={companyDetails.phone.href}
          className="font-body text-[15px] text-white transition-colors duration-200 hover:text-[#DCDDDD]"
        >
          {companyDetails.phone.label}
        </Link>
      </p>

      {/* Icon-only, so each link carries its platform name for screen readers. */}
      <ul className="mt-6 flex items-center gap-2">
        {socials.map((social) => (
          <li key={social.label}>
            <Link
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-200 hover:border-white/40 hover:text-white"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={social.path} />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
