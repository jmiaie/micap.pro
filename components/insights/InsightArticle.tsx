import Link from "next/link";
import { InquiryBand } from "@/components/InquiryBand";
import { JsonLd } from "@/components/JsonLd";
import { InsightBody } from "@/components/insights/InsightBody";
import { InsightDisclaimer } from "@/components/insights/InsightDisclaimer";
import { RelatedPosts } from "@/components/insights/RelatedPosts";
import { relatedInsights, type Insight } from "@/lib/insights/collection";
import {
  articleJsonLd,
  insightBreadcrumbJsonLd,
  organizationJsonLd,
} from "@/lib/insights/jsonld";
import { formatInsightDate, getPillar } from "@/lib/insights/pillars";

export function InsightArticle({ post }: { post: Insight }) {
  const pillar = getPillar(post.pillar);
  if (!pillar) return null;
  const related = relatedInsights(post);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={insightBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights/" },
          { name: pillar.title, path: `/insights/${pillar.slug}/` },
          { name: post.title, path: `/insights/${post.slug}/` },
        ])}
      />
      {post.draft ? (
        <p className="bg-brass px-6 py-3 text-center text-sm font-medium text-cream">
          Draft. This note is not published.
        </p>
      ) : null}
      <article>
        <header className="border-b border-line">
          <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
              <Link href="/insights/" className="hover:text-ink">
                Insights
              </Link>
              <span aria-hidden> · </span>
              <Link
                href={`/insights/${pillar.slug}/`}
                className="hover:text-ink"
              >
                {pillar.title}
              </Link>
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
              {post.description}
            </p>
            <p className="mt-8 text-sm text-faint">
              <span>{post.byline}</span>
              <span aria-hidden> · </span>
              <time dateTime={post.pubDate}>{formatInsightDate(post.pubDate)}</time>
              {post.updatedDate !== post.pubDate ? (
                <>
                  <span aria-hidden> · </span>
                  Updated{" "}
                  <time dateTime={post.updatedDate}>
                    {formatInsightDate(post.updatedDate)}
                  </time>
                </>
              ) : null}
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-page px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-prose">
            {pillar.disclaimer ? (
              <div className="mb-10">
                <InsightDisclaimer />
              </div>
            ) : null}
            <InsightBody source={post.body} />
          </div>
        </div>
      </article>
      <RelatedPosts posts={related} showEmpty={post.draft} />
      <InquiryBand
        title="Tell us what you are deciding."
        body="A short note is enough. It reaches the practice."
      />
    </>
  );
}
