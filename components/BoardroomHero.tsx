"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BOARDROOM_DEFAULT,
  boardroomSrc,
  boardroomSrcSet,
  type BoardroomId,
} from "@/lib/boardroomPhotos";

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
};

function readChoice(): BoardroomId {
  if (typeof window === "undefined") return BOARDROOM_DEFAULT;
  const value = new URLSearchParams(window.location.search).get("boardroom");
  if (value === "1" || value === "backup") return 1;
  return BOARDROOM_DEFAULT;
}

/**
 * Photographic stand-in for the fractional hero. The warm wood table is
 * the default. `?boardroom=backup` (or `?boardroom=1`) shows the glass
 * table on this sandbox branch.
 */
export function BoardroomHero({ eyebrow, title, lede }: Props) {
  const [choice, setChoice] = useState<BoardroomId>(BOARDROOM_DEFAULT);

  useEffect(() => {
    setChoice(readChoice());
  }, []);

  const sizes = "100vw";

  return (
    <section className="relative bg-ink text-cream">
      <div className="relative overflow-hidden sm:min-h-[calc(100svh-4.25rem)]">
        <div className="relative h-[46vh] min-h-[16rem] overflow-hidden sm:absolute sm:inset-0 sm:h-auto sm:min-h-0">
          <picture>
            <source
              type="image/avif"
              srcSet={boardroomSrcSet(choice, "avif")}
              sizes={sizes}
            />
            <source
              type="image/webp"
              srcSet={boardroomSrcSet(choice, "webp")}
              sizes={sizes}
            />
            <img
              key={choice}
              src={boardroomSrc(choice)}
              srcSet={boardroomSrcSet(choice, "webp")}
              sizes={sizes}
              alt=""
              width={2560}
              height={1707}
              data-boardroom={choice}
              fetchPriority={choice === BOARDROOM_DEFAULT ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover motion-safe:animate-boardroom-drift"
            />
          </picture>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25 sm:via-ink/70 sm:to-ink/10" />
        </div>
        <div className="relative z-10 flex w-full max-w-page flex-col justify-end px-6 py-10 sm:absolute sm:inset-0 sm:py-16 lg:px-12 lg:py-20">
          <div className="pointer-events-auto w-full max-w-xl border border-cream/20 bg-ink/65 p-6 backdrop-blur-md sm:p-8">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-brass-soft">
              {eyebrow}
            </p>
            <div className="mt-5 h-px w-12 bg-brass-soft" aria-hidden="true" />
            <h1 className="mt-6 max-w-[14ch] font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.35rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-prose text-base leading-relaxed text-cream/80 sm:text-lg">
              {lede}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
