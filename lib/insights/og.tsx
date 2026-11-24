import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { getPillar } from "@/lib/insights/pillars";
import { getVisibleInsight } from "@/lib/insights/collection";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

function titleSize(title: string) {
  if (title.length > 80) return 46;
  if (title.length > 48) return 56;
  return 64;
}

export async function renderInsightOg(slug: string) {
  const post = getVisibleInsight(slug);
  const pillar = post ? getPillar(post.pillar) : getPillar(slug);
  if (!post && !pillar) {
    throw new Error(`No Insights image for ${slug}`);
  }

  if (post?.ogImage) {
    const file = path.join(
      process.cwd(),
      "public",
      post.ogImage.replace(/^\/+/, ""),
    );
    const data = await fs.promises.readFile(file);
    return new Response(data, {
      headers: { "Content-Type": ogContentType },
    });
  }

  const title = post?.title ?? pillar?.title ?? "Insights";
  const kicker = post ? (pillar?.title ?? "Insights") : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          color: "#141614",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#6e4c24",
            fontSize: 22,
          }}
        >
          <span>MICAP LLC</span>
          <span>INSIGHTS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {kicker ? (
            <div style={{ display: "flex", fontSize: 22, color: "#6e4c24" }}>
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: titleSize(title),
              lineHeight: 1.15,
              width: 1040,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#3f3d38" }}>
          micap.pro
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
