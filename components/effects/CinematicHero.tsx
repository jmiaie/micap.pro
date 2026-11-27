"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { AmbientVideo } from "@/components/AmbientVideo";
import { BuildOnScroll } from "@/components/effects/BuildOnScroll";
import { DismantleReassemble } from "@/components/effects/DismantleReassemble";
import { ParticleDissolveHero } from "@/components/effects/ParticleDissolveHero";
import type { EffectConfig } from "@/lib/effects";
import type { MediaAsset } from "@/lib/site";

type Props = {
  effect: EffectConfig;
  eyebrow: string;
  title: ReactNode;
  lede: string;
  media: MediaAsset;
  children?: ReactNode;
};

export function CinematicHero({
  effect,
  eyebrow,
  title,
  lede,
  media,
  children,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [unsupported, setUnsupported] = useState(false);
  const scroll = effect.mode === "build" || effect.mode === "dismantle";
  const visual = {
    shape: effect.shape,
    palette: effect.palette,
    particleCount: effect.particleCount,
    scrollRef: scroll ? trackRef : undefined,
    onStatus: (status: "ready" | "unsupported") => {
      if (status === "unsupported") setUnsupported(true);
    },
  };

  return (
    <section
      ref={trackRef}
      data-effect={effect.label}
      className={scroll ? "relative h-[158vh] sm:h-[176vh]" : "relative"}
    >
      <div
        className={
          scroll
            ? "sticky top-[4.25rem] h-[calc(100svh-4.25rem)] overflow-hidden bg-ink text-cream"
            : "relative overflow-hidden bg-ink text-cream sm:min-h-[calc(100svh-4.25rem)]"
        }
      >
        <div className="relative h-[46vh] min-h-[16rem] sm:absolute sm:inset-0 sm:h-auto sm:min-h-0">
          <img
            src={media.poster}
            srcSet={media.srcSet}
            sizes="100vw"
            alt=""
            width={media.width}
            height={media.height}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/50" />
          {unsupported ? <AmbientVideo media={media} priority /> : null}
          {effect.mode === "build" ? (
            <BuildOnScroll {...visual} />
          ) : effect.mode === "dismantle" ? (
            <DismantleReassemble {...visual} />
          ) : (
            <ParticleDissolveHero
              {...visual}
              cycle={effect.mode === "dissolve" ? "pulse" : undefined}
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2] hidden bg-gradient-to-r from-ink via-ink/75 to-ink/15 sm:block lg:via-ink/45" />
        <div className="relative z-10 flex w-full max-w-page flex-col justify-end px-6 py-10 sm:absolute sm:inset-0 sm:mt-auto sm:py-16 lg:px-12 lg:py-20">
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
            {children ? (
              <div className="mt-10 flex flex-wrap gap-3">{children}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
