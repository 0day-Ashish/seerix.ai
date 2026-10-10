import type { Metadata } from "next";

import FixList from "@/components/dashboard/fix-list";

export const metadata: Metadata = { title: "Fix list · Seerix" };

export default function FixListPage() {
  return <FixList />;
}
