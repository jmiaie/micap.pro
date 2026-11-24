import Link from "next/link";
import type { Insight } from "@/lib/insights/collection";
import { formatInsightDate, getPillar } from "@/lib/insights/pillars";

export function InsightList({ posts }: { posts: Insight[] }) {
  return (
    <ul className="border-t border-line">
      {posts.map((post) => {
        const pillar = getPillar(post.pillar);
        return (
          <li key={post.slug} className="border-b border-line">
            <Link href={`/insights/${post.slug}/`} className="group block py-8">
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
                {pillar?.title}
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink group-hover:text-brass">
                {post.title}
              </h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
                {post.description}
              </p>
              <p className="mt-4 text-sm text-faint">
                {post.byline}
                <span aria-hidden> · </span>
                <time dateTime={post.pubDate}>{formatInsightDate(post.pubDate)}</time>
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
