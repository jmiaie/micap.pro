import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { PillarHub } from "@/components/insights/PillarHub";
import {
  getVisibleInsight,
  insightStaticParams,
} from "@/lib/insights/collection";
import { insightImagePath } from "@/lib/insights/jsonld";
import { getPillar } from "@/lib/insights/pillars";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return insightStaticParams();
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const pillar = getPillar(params.slug);
  if (pillar) {
    return pageMetadata({
      title: pillar.title,
      description: pillar.description,
      path: `/insights/${pillar.slug}/`,
      rss: true,
      image: {
        url: `/insights/${pillar.slug}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: `${pillar.title} — Micap LLC Insights`,
      },
    });
  }

  const post = getVisibleInsight(params.slug);
  if (!post) return {};
  return {
    ...pageMetadata({
      title: post.title,
      description: post.description,
      path: `/insights/${post.slug}/`,
      rss: true,
      image: {
        url: insightImagePath(post),
        width: 1200,
        height: 630,
        alt: post.title,
      },
      article: {
        publishedTime: `${post.pubDate}T00:00:00.000Z`,
        modifiedTime: `${post.updatedDate}T00:00:00.000Z`,
        byline: post.byline,
      },
    }),
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default function InsightSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const pillar = getPillar(params.slug);
  if (pillar) return <PillarHub pillar={pillar} />;

  const post = getVisibleInsight(params.slug);
  if (!post) notFound();
  return <InsightArticle post={post} />;
}
