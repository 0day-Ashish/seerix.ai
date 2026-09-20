import type { MetadataRoute } from "next";

import { siteUrl } from "@/app/sitemap";

/**
 * Everything on the marketing site is meant to be indexed. The Next.js build
 * output under /_next carries no content of its own, so it is kept out of the
 * crawl budget.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/_next/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
