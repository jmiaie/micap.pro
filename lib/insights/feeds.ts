import { CONTACT_EMAIL, SITE, practices } from "@/lib/site";
import { getPublishedInsights } from "@/lib/insights/collection";
import { pillars } from "@/lib/insights/pillars";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rfc822(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dd = String(day).padStart(2, "0");
  return `${days[date.getUTCDay()]}, ${dd} ${months[month - 1]} ${year} 00:00:00 GMT`;
}

function postUrl(slug: string) {
  return `${SITE.url}/insights/${slug}/`;
}

export function renderInsightsRss() {
  const posts = getPublishedInsights();
  const items = posts
    .map((post) => {
      const url = postUrl(post.slug);
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid>${url}</guid>`,
        `      <pubDate>${rfc822(post.pubDate)}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <category>${escapeXml(pillars.find((pillar) => pillar.slug === post.pillar)?.title ?? post.pillar)}</category>`,
        `      <author>${escapeXml(`${CONTACT_EMAIL} (${post.byline})`)}</author>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Micap LLC Insights</title>
    <link>${SITE.url}/insights/</link>
    <description>${escapeXml("Notes from Micap LLC. Written by the firm, under the Micap LLC byline or a practice desk.")}</description>
    <language>en-us</language>
    <atom:link href="${SITE.url}/insights/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function linkLine(href: string, label: string, detail: string) {
  const safeLabel = label.replaceAll("[", "(").replaceAll("]", ")");
  return `- [${safeLabel}](${href}): ${detail}`;
}

export function renderLlmsTxt() {
  const posts = getPublishedInsights();
  const practiceLines = practices.map((practice) =>
    linkLine(
      `${SITE.url}/${practice.slug}/`,
      practice.title,
      practice.description,
    ),
  );
  const pillarLines = pillars.map((pillar) =>
    linkLine(
      `${SITE.url}/insights/${pillar.slug}/`,
      pillar.title,
      pillar.description,
    ),
  );
  const noteLines =
    posts.length === 0
      ? ["No notes are published yet."]
      : posts.map((post) => {
          const pillar = pillars.find((item) => item.slug === post.pillar);
          return linkLine(
            postUrl(post.slug),
            post.title,
            `${pillar?.title ?? "Insights"}. ${post.description} Byline: ${post.byline}.`,
          );
        });

  return `# ${SITE.name}

> ${SITE.description}

Insights are written by the firm. The byline is the organization Micap LLC or a practice desk, such as Micap Real Estate Desk. The site does not name an individual. Contact: ${CONTACT_EMAIL}.

## Practices

${practiceLines.join("\n")}

## Insights

${linkLine(`${SITE.url}/insights/`, "Insights", "Notes from Micap LLC.")}
${pillarLines.join("\n")}

## Published notes

${noteLines.join("\n")}

## Contact

${linkLine(`${SITE.url}/contact/`, "Contact", CONTACT_EMAIL)}
${linkLine(`${SITE.url}/about/`, "About", "Micap LLC, the firm.")}
${linkLine("https://micap.ai", "Micap AI", "Sister firm for the Software Lab and AI engineering.")}
`;
}
