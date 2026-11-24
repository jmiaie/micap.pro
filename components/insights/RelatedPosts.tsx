import Link from "next/link";
import type { Insight } from "@/lib/insights/collection";
import { formatInsightDate, getPillar } from "@/lib/insights/pillars";

export function RelatedPosts({
  posts,
  showEmpty = false,
}: {
  posts: Insight[];
  showEmpty?: boolean;
}) {
  if (posts.length === 0 && !showEmpty) return null;

  return (
    <section aria-labelledby="related-notes" className="border-t border-line">
      <div className="mx-auto max-w-page px-6 py-16 sm:px-10">
        <h2
          id="related-notes"
          className="font-display text-3xl font-medium tracking-tight text-ink"
        >
          Related notes
        </h2>
        {posts.length === 0 ? (
          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
            Published notes in the same pillar will be listed here.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {posts.map((post) => {
              const pillar = getPillar(post.pillar);
              return (
                <li key={post.slug}>
                  <Link
                    href={`/insights/${post.slug}/`}
                    className="flex h-full flex-col border border-line bg-panel p-6 hover:border-ink"
                  >
                    <span className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
                      {pillar?.title}
                    </span>
                    <span className="mt-4 font-display text-2xl font-medium text-ink">
                      {post.title}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-muted">
                      {post.description}
                    </span>
                    <span className="mt-4 text-sm text-faint">
                      <time dateTime={post.pubDate}>
                        {formatInsightDate(post.pubDate)}
                      </time>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
