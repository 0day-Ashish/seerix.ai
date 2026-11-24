import Link from "next/link";

/** Three columns: what Seerix does, who makes it, and the fine print. */
const columns = [
  {
    title: "Products",
    links: [
      { label: "Diagnose", href: "/product/diagnose" },
      { label: "Prioritize", href: "/product/prioritize" },
      { label: "Watch", href: "/product/watch" },
      { label: "Create", href: "/product/create" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Manifesto", href: "/manifesto" },
      { label: "Changelog", href: "/changelog" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
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
