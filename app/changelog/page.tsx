import type { Metadata } from "next";

import ChangelogList from "@/components/changelog/changelog-list";
import Cta from "@/components/new-landing/cta";
import SiteFooter from "@/components/new-landing/site-footer";

export const metadata: Metadata = {
  title: "Changelog · Seerix",
  description:
    "What's new in Seerix: new diagnoses, improvements and fixes, release by release.",
  openGraph: {
    title: "Seerix changelog",
    description: "New diagnoses, improvements and fixes, release by release.",
    type: "website",
  },
};

export default function ChangelogPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="bg-white px-6 pb-24 pt-20 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <h1 className="heading-mark font-display text-[40px] font-medium leading-[1.05] tracking-[-0.035em] text-black sm:text-[56px]">
            Changelog
          </h1>
          <p className="mt-4 max-w-2xl font-body text-[18px] leading-[1.55] text-zinc-500 sm:text-[20px]">
            New diagnoses, improvements and fixes, release by release.
          </p>

          <div className="mt-9">
            <ChangelogList />
          </div>
        </div>
      </section>

      <Cta />
      <SiteFooter />
    </div>
  );
}
