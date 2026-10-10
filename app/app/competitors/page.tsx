import type { Metadata } from "next";

import Competitors from "@/components/dashboard/competitors";

export const metadata: Metadata = { title: "Competitors · Seerix" };

export default function CompetitorsPage() {
  return <Competitors />;
}
