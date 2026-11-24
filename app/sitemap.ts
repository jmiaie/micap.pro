import type { MetadataRoute } from "next";
import { routes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: route.path === "/" ? "https://micap.pro/" : `https://micap.pro${route.path}`,
    lastModified: "2026-11-24",
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
