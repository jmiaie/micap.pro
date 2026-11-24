import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

function InsightAnchor({
  href = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^https?:\/\//.test(href);
  if (!external && href.startsWith("/")) {
    const hashAt = href.indexOf("#");
    const queryAt = href.indexOf("?");
    const cut =
      hashAt === -1
        ? queryAt
        : queryAt === -1
          ? hashAt
          : Math.min(hashAt, queryAt);
    const path = cut === -1 ? href : href.slice(0, cut);
    const suffix = cut === -1 ? "" : href.slice(cut);
    const normalized = path.endsWith("/") ? path : `${path}/`;
    return (
      <Link href={`${normalized}${suffix}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function InsightBody({ source }: { source: string }) {
  return (
    <div className="insight-prose">
      <MDXRemote
        source={source}
        options={{
          blockJS: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
        components={{
          a: InsightAnchor,
        }}
      />
    </div>
  );
}
