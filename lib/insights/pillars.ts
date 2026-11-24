import { practiceBySlug, type Practice } from "@/lib/site";

/**
 * Insights pillars, in the order they are published.
 * A byline is the firm or a practice desk. It is never a person.
 */
export const pillars = [
  {
    slug: "fractional-executive-services",
    title: "Fractional Executive Services",
    description:
      "Notes on fractional executive work: a defined leadership seat, a cadence, and an end. The practice page describes the engagement.",
    practiceSlug: "fractional",
    disclaimer: false,
  },
  {
    slug: "software",
    title: "Software Development & Tech Consulting",
    description:
      "Notes on scope, architecture, and delivery. Lab and AI engineering sit with sister firm Micap AI. The practice page describes the engagement.",
    practiceSlug: "software",
    disclaimer: false,
  },
  {
    slug: "business",
    title: "Business",
    description:
      "Notes on operating decisions: what runs now, what waits, and how the work is sequenced. The practice page describes the engagement.",
    practiceSlug: "business",
    disclaimer: false,
  },
  {
    slug: "construction",
    title: "Construction",
    description:
      "Notes on owner's-side construction questions: scope, cost, and schedule. The practice page describes the engagement.",
    practiceSlug: "construction",
    disclaimer: true,
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    description:
      "Notes on capital, acquisitions, and value-add. These notes are general information. The practice page describes the engagement.",
    practiceSlug: "real-estate",
    disclaimer: true,
  },
] as const;

export type Pillar = (typeof pillars)[number];
export type PillarSlug = Pillar["slug"];

const pillarSlugs = pillars.map((pillar) => pillar.slug);

export function isPillarSlug(value: string): value is PillarSlug {
  return pillarSlugs.includes(value as PillarSlug);
}

export function getPillar(slug: string): Pillar | undefined {
  return pillars.find((pillar) => pillar.slug === slug);
}

export function practiceForPillar(pillar: Pillar): Practice {
  return practiceBySlug[pillar.practiceSlug];
}

export function formatInsightDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function insightDateTime(isoDate: string) {
  return `${isoDate}T00:00:00.000Z`;
}
