import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/blog/write", "/blog/*/edit", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
