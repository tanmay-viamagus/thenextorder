import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/register`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/film`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
