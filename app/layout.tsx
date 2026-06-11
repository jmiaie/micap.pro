import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://micap.pro"),
  title: "Micap LLC - Project Management, Management Consulting, Consulting",
  description:
    "Micap LLC is a bespoke, boutique consulting agency offering business development, optimization, and both portfolio and project management services throughout the sustainable energy, construction, real estate, and technology sectors.",
  openGraph: {
    title: "Micap LLC — Project & Portfolio Management Consulting",
    description:
      "Bespoke consulting in business development, optimization, and portfolio and project management across sustainable energy, construction, real estate, and technology.",
    url: "https://micap.pro",
    siteName: "Micap LLC",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
