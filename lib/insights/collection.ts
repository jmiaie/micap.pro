import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import {
  getPillar,
  isPillarSlug,
  pillars,
  type PillarSlug,
} from "@/lib/insights/pillars";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

/**
 * Organization bylines only. "Micap LLC", or a desk such as
 * "Micap Real Estate Desk". A personal name does not match.
 */
const BYLINE =
  /^(Micap LLC|Micap (?:[A-Z][A-Za-z]+ )+Desk)$/;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const frontmatterSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().min(1).max(300),
  pubDate: z.union([z.string(), z.date()]),
  updatedDate: z.union([z.string(), z.date()]).optional(),
  pillar: z.string(),
  byline: z.string().trim(),
  ogImage: z.string().trim().optional(),
  draft: z.boolean().optional(),
});

export type Insight = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate: string;
  pillar: PillarSlug;
  byline: string;
  ogImage?: string;
  draft: boolean;
  body: string;
  file: string;
};

function fail(file: string, message: string): never {
  throw new Error(`${path.relative(process.cwd(), file)}: ${message}`);
}

function isoDate(value: string | Date, field: string, file: string) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) fail(file, `${field} is not a real date`);
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(file, `${field} must be YYYY-MM-DD`);
  }
  const [year, month, day] = value.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    fail(file, `${field} is not a real date`);
  }
  return value;
}

function assertByline(byline: string, file: string) {
  if (!BYLINE.test(byline)) {
    fail(
      file,
      'byline must be "Micap LLC" or a desk such as "Micap Real Estate Desk". Personal names are not allowed.',
    );
  }
}

function assertOgImage(value: string | undefined, file: string) {
  if (!value) return undefined;
  if (
    !value.startsWith("/") ||
    value.includes("..") ||
    value.includes("://") ||
    value.includes("\\")
  ) {
    fail(file, "ogImage must be a site path such as /og.png");
  }
  const disk = path.join(process.cwd(), "public", value.replace(/^\/+/, ""));
  if (!fs.existsSync(disk)) {
    fail(file, `ogImage file not found at public${value}`);
  }
  return value;
}

function contentFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...contentFiles(full));
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function loadInsight(file: string): Insight {
  const slug = path.basename(file, path.extname(file));
  if (!SLUG.test(slug)) {
    fail(file, "filename must be a lowercase slug");
  }
  if (isPillarSlug(slug)) {
    fail(file, `slug "${slug}" is reserved for a pillar hub`);
  }

  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(file, error instanceof Error ? error.message : "could not parse frontmatter");
  }

  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
      .join("; ");
    fail(file, detail);
  }

  const data = result.data;
  if (!isPillarSlug(data.pillar) || !getPillar(data.pillar)) {
    fail(
      file,
      `pillar must be one of: ${pillars.map((pillar) => pillar.slug).join(", ")}`,
    );
  }
  assertByline(data.byline, file);

  const pubDate = isoDate(data.pubDate, "pubDate", file);
  const updatedDate = data.updatedDate
    ? isoDate(data.updatedDate, "updatedDate", file)
    : pubDate;
  if (updatedDate < pubDate) {
    fail(file, "updatedDate cannot be earlier than pubDate");
  }

  const body = parsed.content.trim();
  if (!body) fail(file, "body is empty");

  return {
    slug,
    title: data.title,
    description: data.description,
    pubDate,
    updatedDate,
    pillar: data.pillar,
    byline: data.byline,
    ogImage: assertOgImage(data.ogImage, file),
    draft: data.draft ?? false,
    body,
    file: path.relative(process.cwd(), file),
  };
}

function compareInsights(a: Insight, b: Insight) {
  if (a.pubDate !== b.pubDate) return a.pubDate < b.pubDate ? 1 : -1;
  return a.title.localeCompare(b.title);
}

let cached: Insight[] | undefined;

export function getInsights(): Insight[] {
  if (process.env.NODE_ENV !== "development" && cached) return cached;
  const seen = new Set<string>();
  const insights = contentFiles(CONTENT_DIR).map(loadInsight);
  for (const insight of insights) {
    if (seen.has(insight.slug)) {
      throw new Error(`Duplicate Insights slug "${insight.slug}"`);
    }
    seen.add(insight.slug);
  }
  insights.sort(compareInsights);
  if (process.env.NODE_ENV !== "development") cached = insights;
  return insights;
}

/** Published notes only. Drafts never enter the public site, feeds, or sitemap. */
export function getPublishedInsights() {
  return getInsights().filter((insight) => !insight.draft);
}

export function getPublishedInsight(slug: string) {
  return getPublishedInsights().find((insight) => insight.slug === slug);
}

/**
 * Drafts are routable only in development, so the sample layout can be
 * reviewed locally. Production static export omits them.
 */
export function getVisibleInsight(slug: string) {
  const insight = getInsights().find((item) => item.slug === slug);
  if (!insight) return undefined;
  if (insight.draft && process.env.NODE_ENV === "production") return undefined;
  return insight;
}

export function relatedInsights(current: Insight) {
  return getPublishedInsights()
    .filter(
      (insight) =>
        insight.slug !== current.slug && insight.pillar === current.pillar,
    )
    .slice(0, 3);
}

export function insightStaticParams() {
  const posts =
    process.env.NODE_ENV === "production"
      ? getPublishedInsights()
      : getInsights();
  return [
    ...pillars.map((pillar) => ({ slug: pillar.slug })),
    ...posts.map((post) => ({ slug: post.slug })),
  ];
}
