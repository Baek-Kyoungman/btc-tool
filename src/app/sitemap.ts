import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo";

const STATIC_PAGES = [
  "",
  "/satoshi-calculator",
  "/bitcoin-clock",
  "/bitcoin-halving",
  "/bitcoin-ath",
  "/bitcoin-chart",
  "/bitcoin-fear-greed",
  "/bitcoin-supply",
  "/mempool-fees",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("posts")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });

    if (posts?.length) {
      blogEntries = posts.map((p) => ({
        url: `${base}/blog/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Supabase 미설정 시 블로그 항목 제외
  }

  return [...staticEntries, ...blogEntries];
}
