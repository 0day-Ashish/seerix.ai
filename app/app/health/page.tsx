import type { Metadata } from "next";

import Health from "@/components/dashboard/health";

export const metadata: Metadata = { title: "Health · Seerix" };

export default function HealthPage() {
  return <Health />;
}
