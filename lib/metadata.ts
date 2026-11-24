import type { Metadata } from "next";

const image = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Micap LLC — consulting for software, business, construction, and real estate",
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? "https://micap.pro/" : `https://micap.pro${path}`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
