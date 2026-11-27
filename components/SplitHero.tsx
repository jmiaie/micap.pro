import type { ReactNode } from "react";
import { AmbientVideo } from "@/components/AmbientVideo";
import type { MediaKey } from "@/lib/site";
import { media } from "@/lib/site";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  mediaKey: MediaKey;
  priority?: boolean;
  children?: ReactNode;
};

export function SplitHero({
  eyebrow,
  title,
  lede,
  mediaKey,
  priority = true,
  children,
}: Props) {
  return (
    <section className="lg:grid lg:min-h-[calc(100svh-4.25rem)] lg:grid-cols-12">
      <div className="flex min-h-[calc(100svh-4.25rem)] flex-col justify-end bg-ink px-6 py-14 text-cream sm:px-10 sm:py-16 lg:col-span-5 lg:min-h-0 lg:px-12 lg:py-20">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-brass-soft">
          {eyebrow}
        </p>
        <div className="mt-5 h-px w-12 bg-brass-soft" aria-hidden="true" />
        <h1 className="mt-6 max-w-[16ch] text-balance font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:max-w-[18ch] sm:text-5xl lg:text-[3.35rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-cream/80 sm:text-lg">
          {lede}
        </p>
        {children ? (
          <div className="mt-10 flex flex-wrap gap-3">{children}</div>
        ) : null}
      </div>
      <div className="relative aspect-video bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-full">
        <AmbientVideo media={media[mediaKey]} priority={priority} />
      </div>
    </section>
  );
}
