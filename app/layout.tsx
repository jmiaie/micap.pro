import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE, organizationJsonLd } from "@/lib/site";
import "./globals.css";

const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Micap LLC — consulting for software, business, construction, and real estate",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Micap LLC",
    template: "%s — Micap LLC",
  },
  description: SITE.description,
  applicationName: "Micap LLC",
  authors: [{ name: "Jeffrey Milam", url: SITE.url }],
  creator: "Micap LLC",
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: "Micap LLC",
    description: SITE.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Micap LLC",
    description: SITE.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
