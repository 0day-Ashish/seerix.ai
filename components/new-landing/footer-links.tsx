import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "About SeerixBot", href: "/seerixbot" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "hello@seerix.ai", href: "mailto:hello@seerix.ai" },
    ],
  },
];

export default function FooterLinks() {
  return (
    // Sits right of the contact block, so it takes only the width its
    // columns need rather than stretching across the footer.
    <nav
      aria-label="Footer"
      className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 lg:ml-auto"
    >
      {columns.map((column) => (
        <div key={column.title}>
          <h3 className="font-body text-[15px] text-white/40">
            {column.title}
          </h3>
          <ul className="mt-6 space-y-4">
            {column.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-body text-[15px] text-white transition-colors duration-200 hover:text-[#DCDDDD]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
