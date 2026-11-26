import Link from "next/link";
import type { ReactNode } from "react";
import { CinematicHero } from "@/components/effects/CinematicHero";
import { InquiryBand } from "@/components/InquiryBand";
import { JsonLd } from "@/components/JsonLd";
import { divisionEffect } from "@/lib/effects";
import { fractionalGroups, media, practices, type Practice } from "@/lib/site";

export function PracticeView({
  practice,
  children,
  hero,
}: {
  practice: Practice;
  children?: ReactNode;
  hero?: ReactNode;
}) {
  const others = practices.filter((item) => item.slug !== practice.slug);
  const url = `https://micap.pro/${practice.slug}/`;
  const offered =
    practice.slug === "fractional"
      ? fractionalGroups.map((group, groupIndex) => ({
          "@type": "ListItem",
          position: groupIndex + 1,
          item: {
            "@type": "Service",
            name: group.title,
            description: group.framing,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: group.title,
              itemListElement: group.roles.map((role, roleIndex) => ({
                "@type": "ListItem",
                position: roleIndex + 1,
                item: {
                  "@type": "Service",
                  name: role.title,
                  description: role.body,
                },
              })),
            },
          },
        }))
      : practice.covers.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: item.title,
            description: item.body,
          },
        }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://micap.pro/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: practice.title,
              item: url,
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: practice.title,
          serviceType: practice.title,
          url,
          description: practice.description,
          provider: {
            "@type": "Organization",
            name: "Micap LLC",
            url: "https://micap.pro",
          },
          areaServed: "Worldwide",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: practice.title,
            itemListElement: offered,
          },
        }}
      />
      {hero ?? (
        <CinematicHero
          effect={divisionEffect(practice.slug)}
          eyebrow={practice.eyebrow}
          title={practice.title}
          lede={practice.lede}
          media={media[practice.media]}
        >
          <Link
            href="/contact/"
            className="inline-flex min-h-12 items-center bg-cream px-5 text-sm font-semibold text-ink hover:bg-white"
          >
            Discuss this work
          </Link>
          <Link
            href="/#divisions"
            className="inline-flex min-h-12 items-center border border-cream/30 px-5 text-sm font-semibold text-cream hover:border-cream"
          >
            All divisions
          </Link>
        </CinematicHero>
      )}

      {practice.covers.length > 0 ? (
        <section className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              What the work covers
            </h2>
          </div>
          <ol className="mt-10 border-t border-line">
            {practice.covers.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8"
              >
                <p className="font-display text-2xl text-brass md:col-span-2">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-2xl font-medium text-ink md:col-span-4">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-muted md:col-span-6">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {children}

      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
          <h2 className="max-w-2xl font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {practice.approachTitle}
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-2">
            {practice.approach.map((step, index) => (
              <li key={step.title} className="border-t border-line pt-6">
                <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-2xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-page px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink lg:col-span-4">
            Background
          </h2>
          <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted lg:col-span-8">
            {practice.background.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-page px-6 py-16 sm:px-10">
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
            The other divisions
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}/`}
                  className="flex h-full flex-col border border-line bg-panel p-6 hover:border-ink"
                >
                  <span className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
                    {item.index}
                  </span>
                  <span className="mt-4 font-display text-2xl font-medium text-ink">
                    {item.nav}
                  </span>
                  <span className="mt-3 text-sm leading-relaxed text-muted">
                    {item.card}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <InquiryBand />
    </>
  );
}
