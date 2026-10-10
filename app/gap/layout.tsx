import DashboardShell from "@/components/dashboard/shell";

/** The gap tools are the dashboard's Keywords and Backlinks tabs. */
export default function GapLayout({ children }: LayoutProps<"/gap">) {
  return <DashboardShell>{children}</DashboardShell>;
}
