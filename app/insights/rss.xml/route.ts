import { renderInsightsRss } from "@/lib/insights/feeds";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderInsightsRss(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
