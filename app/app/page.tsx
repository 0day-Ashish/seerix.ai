import type { Metadata } from "next";

import Overview from "@/components/dashboard/overview";

export const metadata: Metadata = { title: "Overview · Seerix" };

export default function OverviewPage() {
  return <Overview />;
}
