import type { Metadata } from "next";

const defaultImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Micap LLC — consulting for software, business, construction, and real estate",
};

type PageImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  rss = false,
  article,
}: {
  title: string;
  description: string;
  path: string;
  image?: PageImage;
  rss?: boolean;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    byline: string;
  };
}): Metadata {
  const url = path === "/" ? "https://micap.pro/" : `https://micap.pro${path}`;
  const ogImage = image ?? defaultImage;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    ...(article
      ? { authors: [{ name: article.byline, url: "https://micap.pro" }] }
      : {}),
    alternates: {
      canonical: url,
      ...(rss
        ? {
            types: {
              "application/rss+xml": "https://micap.pro/insights/rss.xml",
            },
          }
        : {}),
    },
    openGraph: article
      ? {
          type: "article",
          title,
          description,
          url,
          images: [ogImage],
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
        }
      : {
          title,
          description,
          url,
          images: [ogImage],
        },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
