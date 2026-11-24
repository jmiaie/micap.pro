import { InquiryBand } from "@/components/InquiryBand";
import { JsonLd } from "@/components/JsonLd";
import { InsightList } from "@/components/insights/InsightList";
import { InsightsEmpty } from "@/components/insights/InsightsEmpty";
import { PillarNav } from "@/components/insights/PillarNav";
import { getPublishedInsights } from "@/lib/insights/collection";
import {
  insightBreadcrumbJsonLd,
  insightsCollectionJsonLd,
  organizationJsonLd,
} from "@/lib/insights/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Insights",
  description:
    "Notes from Micap LLC on the decisions the practices advise on. Written by the firm, under the Micap LLC byline or a practice desk.",
  path: "/insights/",
  rss: true,
});

export default function InsightsPage() {
  const posts = getPublishedInsights();

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={insightsCollectionJsonLd()} />
      <JsonLd
        data={insightBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights/" },
        ])}
      />
      <header className="border-b border-line">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
            Micap LLC
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
            Insights
          </h1>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
            Notes from Micap LLC on the decisions the practices advise on.
            Each note is published by the firm, under the Micap LLC byline or
            a practice desk.
          </p>
        </div>
      </header>
      <div className="mx-auto grid max-w-page gap-12 px-6 py-16 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <PillarNav active="all" />
        </div>
        <div className="lg:col-span-8">
          {posts.length === 0 ? <InsightsEmpty /> : <InsightList posts={posts} />}
        </div>
      </div>
      <InquiryBand />
    </>
  );
}
