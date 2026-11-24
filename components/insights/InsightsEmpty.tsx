import Link from "next/link";
import { practiceForPillar, type Pillar } from "@/lib/insights/pillars";

export function InsightsEmpty({ pillar }: { pillar?: Pillar }) {
  const practice = pillar ? practiceForPillar(pillar) : undefined;
  return (
    <div className="border border-line bg-panel px-6 py-14 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass">
        {pillar ? pillar.title : "Insights"}
      </p>
      <h2 className="mt-4 max-w-xl font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {pillar
          ? "No published notes in this pillar yet."
          : "No published notes yet."}
      </h2>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
        {pillar
          ? "A note appears here when Micap publishes it. The practice page describes the engagement."
          : "A note appears here when Micap publishes it. The practice pages describe the engagements."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {practice ? (
          <Link
            href={`/${practice.slug}/`}
            className="inline-flex min-h-12 items-center bg-ink px-5 text-sm font-semibold text-cream hover:bg-ink/90"
          >
            View the {practice.title} practice
          </Link>
        ) : (
          <Link
            href="/contact/"
            className="inline-flex min-h-12 items-center bg-ink px-5 text-sm font-semibold text-cream hover:bg-ink/90"
          >
            Start a conversation
          </Link>
        )}
        {pillar ? (
          <Link
            href="/insights/"
            className="inline-flex min-h-12 items-center border border-ink px-5 text-sm font-semibold text-ink hover:bg-ink hover:text-cream"
          >
            All notes
          </Link>
        ) : null}
      </div>
    </div>
  );
}
