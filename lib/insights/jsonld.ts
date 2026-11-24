import { CONTACT_EMAIL, SITE } from "@/lib/site";
import type { Insight } from "@/lib/insights/collection";
import {
  getPillar,
  insightDateTime,
  practiceForPillar,
  type Pillar,
} from "@/lib/insights/pillars";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Micap LLC",
    url: SITE.url,
    email: CONTACT_EMAIL,
    logo: `${SITE.url}/og.png`,
  };
}

function authorOrganization(name: string) {
  return {
    "@type": "Organization",
    name,
    url: SITE.url,
  };
}

export function insightImagePath(insight: Pick<Insight, "slug" | "ogImage">) {
  return insight.ogImage ?? `/insights/${insight.slug}/opengraph-image.png`;
}

export function articleJsonLd(insight: Insight) {
  const pillar = getPillar(insight.pillar);
  const url = `${SITE.url}/insights/${insight.slug}/`;
  const author = authorOrganization(insight.byline);
  if (author["@type"] !== "Organization") {
    throw new Error("Insights authors must be an Organization");
  }
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.description,
    datePublished: insightDateTime(insight.pubDate),
    dateModified: insightDateTime(insight.updatedDate),
    inLanguage: "en-US",
    mainEntityOfPage: url,
    url,
    image: `${SITE.url}${insightImagePath(insight)}`,
    articleSection: pillar?.title,
    author,
    publisher: {
      "@type": "Organization",
      name: "Micap LLC",
      url: SITE.url,
      email: CONTACT_EMAIL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/og.png`,
      },
    },
  };
}

export function insightsCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Insights",
    description:
      "Notes from Micap LLC. Written by the firm, under the Micap LLC byline or a practice desk.",
    url: `${SITE.url}/insights/`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: authorOrganization("Micap LLC"),
  };
}

export function pillarCollectionJsonLd(pillar: Pillar) {
  const practice = practiceForPillar(pillar);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pillar.title,
    description: pillar.description,
    url: `${SITE.url}/insights/${pillar.slug}/`,
    isPartOf: {
      "@type": "CollectionPage",
      name: "Insights",
      url: `${SITE.url}/insights/`,
    },
    about: {
      "@type": "Service",
      name: practice.title,
      url: `${SITE.url}/${practice.slug}/`,
      provider: authorOrganization("Micap LLC"),
    },
    publisher: authorOrganization("Micap LLC"),
  };
}

export function insightBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}
