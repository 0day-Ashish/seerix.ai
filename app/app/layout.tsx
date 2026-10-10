import type { Metadata } from "next";

import DashboardShell from "@/components/dashboard/shell";

export const metadata: Metadata = { title: "Dashboard · Seerix" };

/** The signed-in dashboard: its own shell, no marketing navbar or footer. */
export default function DashboardLayout({ children }: LayoutProps<"/app">) {
  return <DashboardShell>{children}</DashboardShell>;
}
