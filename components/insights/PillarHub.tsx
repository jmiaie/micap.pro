import Link from "next/link";
import { InquiryBand } from "@/components/InquiryBand";
import { JsonLd } from "@/components/JsonLd";
import { InsightList } from "@/components/insights/InsightList";
import { InsightsEmpty } from "@/components/insights/InsightsEmpty";
import { PillarNav } from "@/components/insights/PillarNav";
import { getPublishedInsights } from "@/lib/insights/collection";
import {
  insightBreadcrumbJsonLd,
  organizationJsonLd,
  pillarCollectionJsonLd,
} from "@/lib/insights/jsonld";
import { practiceForPillar, type Pillar } from "@/lib/insights/pillars";

export function PillarHub({ pillar }: { pillar: Pillar }) {
  const practice = practiceForPillar(pillar);
  const posts = getPublishedInsights().filter(
    (post) => post.pillar === pillar.slug,
  );

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={pillarCollectionJsonLd(pillar)} />
      <JsonLd
        data={insightBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights/" },
          { name: pillar.title, path: `/insights/${pillar.slug}/` },
        ])}
      />
      <header className="border-b border-line">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
            <Link href="/insights/" className="hover:text-ink">
              Insights
            </Link>
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            {pillar.title}
          </h1>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-muted">
            {pillar.description}
          </p>
          <Link
            href={`/${practice.slug}/`}
            className="mt-8 inline-flex min-h-12 items-center border border-ink px-5 text-sm font-semibold text-ink hover:bg-ink hover:text-cream"
          >
            View the {practice.title} practice
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-page gap-12 px-6 py-16 sm:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <PillarNav active={pillar.slug} />
        </div>
        <div className="lg:col-span-8">
          {posts.length === 0 ? (
            <InsightsEmpty pillar={pillar} />
          ) : (
            <InsightList posts={posts} />
          )}
        </div>
      </div>
      <InquiryBand />
    </>
  );
}
