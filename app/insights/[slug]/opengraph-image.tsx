import { insightStaticParams } from "@/lib/insights/collection";
import { ogContentType, ogSize, renderInsightOg } from "@/lib/insights/og";

export const alt = "Micap LLC Insights";
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export function generateStaticParams() {
  return insightStaticParams();
}

export default function Image({ params }: { params: { slug: string } }) {
  return renderInsightOg(params.slug);
}
