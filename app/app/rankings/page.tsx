import type { Metadata } from "next";

import Rankings from "@/components/dashboard/rankings";

export const metadata: Metadata = { title: "Rankings · Seerix" };

export default function RankingsPage() {
  return <Rankings />;
}
