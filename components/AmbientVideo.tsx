"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/site";

type Props = {
  media: MediaAsset;
  priority?: boolean;
  sizes?: string;
};

export function AmbientVideo({
  media,
  priority = false,
  sizes = "(min-width: 1024px) 58vw, 100vw",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let cancelled = false;
    let timerId = 0;
    let observer: IntersectionObserver | null = null;

    const arm = () => {
      if (cancelled || !rootRef.current) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setActive(true);
            observer?.disconnect();
          }
        },
        { rootMargin: "0px" },
      );
      observer.observe(rootRef.current);
    };

    const schedule = () => {
      if (cancelled) return;
      timerId = window.setTimeout(arm, 400);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const onPreference = () => {
      if (reduce.matches) {
        setActive(false);
        setPlaying(false);
      }
    };
    reduce.addEventListener("change", onPreference);

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.clearTimeout(timerId);
      window.removeEventListener("load", schedule);
      reduce.removeEventListener("change", onPreference);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!active || !video) return;
    video.muted = true;
    video.defaultMuted = true;
    const play = () => {
      video.play().catch(() => {
        setPlaying(false);
      });
    };
    video.load();
    if (video.readyState >= 2) play();
    else video.addEventListener("canplay", play, { once: true });
    return () => video.removeEventListener("canplay", play);
  }, [active]);

  return (
    <div ref={rootRef} className="absolute inset-0 bg-ink" aria-hidden="true">
      <img
        src={media.poster}
        srcSet={media.srcSet}
        sizes={sizes}
        alt=""
        width={media.width}
        height={media.height}
        fetchPriority="auto"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {active ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          loop
          autoPlay
          preload="none"
          poster={media.poster}
          onPlaying={() => setPlaying(true)}
        >
          <source src={media.webm} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
