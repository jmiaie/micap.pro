import type { MetadataRoute } from "next";
import { getPublishedInsights } from "@/lib/insights/collection";
import { pillars } from "@/lib/insights/pillars";
import { routes, SITE } from "@/lib/site";

const updated = "2026-11-24";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedInsights();
  const newest = posts[0]?.updatedDate ?? updated;

  return [
    ...routes.map((route) => ({
      url:
        route.path === "/"
          ? `${SITE.url}/`
          : `${SITE.url}${route.path}`,
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    {
      url: `${SITE.url}/insights/`,
      lastModified: newest,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...pillars.map((pillar) => ({
      url: `${SITE.url}/insights/${pillar.slug}/`,
      lastModified:
        posts.find((post) => post.pillar === pillar.slug)?.updatedDate ??
        updated,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${SITE.url}/insights/${post.slug}/`,
      lastModified: post.updatedDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
