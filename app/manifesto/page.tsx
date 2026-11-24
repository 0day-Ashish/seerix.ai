import type { Metadata } from "next";

import ManifestoPage from "@/components/manifesto/manifesto-page";

export const metadata: Metadata = {
  title: "Our manifesto · Seerix",
  description:
    "Why we are building Seerix: an analyst that reads your Search Console data and tells you why your rankings moved.",
};

/**
 * The manifesto, after the tokensupply site's: the header stays and there is
 * no footer; the page ends inside its lilac field.
 */
export default function Manifesto() {
  return (
    <main className="flex flex-1 flex-col bg-ghost">
      <ManifestoPage />
    </main>
  );
}
