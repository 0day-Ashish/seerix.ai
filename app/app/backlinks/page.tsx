import type { Metadata } from "next";

import Backlinks from "@/components/dashboard/backlinks";

export const metadata: Metadata = { title: "Backlinks · Seerix" };

export default function BacklinksPage() {
  return <Backlinks />;
}
