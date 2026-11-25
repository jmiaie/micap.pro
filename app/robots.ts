import type { MetadataRoute } from "next";

// Required by `output: "export"` since Next 15: metadata routes are static.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://micap.pro/sitemap.xml",
  };
}
