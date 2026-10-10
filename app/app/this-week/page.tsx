import type { Metadata } from "next";

import ThisWeek from "@/components/dashboard/this-week";

export const metadata: Metadata = { title: "This week · Seerix" };

export default function ThisWeekPage() {
  return <ThisWeek />;
}
