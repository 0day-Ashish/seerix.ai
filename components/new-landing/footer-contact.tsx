import Image from "next/image";
import Link from "next/link";

const tagline =
  "The SEO platform that explains why. Connect your Google Search Console and get diagnoses with receipts, not dashboards with homework.";

const contacts = [{ label: "hello@seerix.ai", href: "mailto:hello@seerix.ai" }];

export default function FooterContact() {
  return (
    <div className="max-w-xs">
      <Link href="/" className="group flex items-center gap-2.5">
        {/* White variant for the black footer; spins 60 degrees like the
            navbar mark, which maps the three bars back onto themselves. */}
        <Image
          src="/assets/seerix-symbol-white.svg"
          alt="Seerix"
          width={24}
          height={24}
          className="transition-transform duration-500 ease-out will-change-transform group-hover:rotate-60 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
        />
        <span className="relative font-display text-xl font-semibold tracking-tight text-white">
          seerix
          <sup className="absolute -right-3.5 top-1 font-body text-[8px] font-extrabold leading-none tracking-normal text-white">
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
