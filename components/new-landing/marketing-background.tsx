"use client";

import { usePathname } from "next/navigation";

import NoiseBackground from "@/components/new-landing/noise-background";

/**
 * The animated background behind every marketing page. The app areas
 * (dashboard, settings, gap tools) paint their own chrome over the whole
 * screen, so it is not mounted there at all rather than running unseen.
 */
export default function MarketingBackground() {
  const pathname = usePathname();
  if (
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/gap")
  )
    return null;
  return <NoiseBackground />;
}
