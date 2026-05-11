import type { MetadataRoute } from "next";

import { buildCanonical, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: buildCanonical("/sitemap.xml"),
    host: siteUrl(),
  };
}
