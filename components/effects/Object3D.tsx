"use client";

import { useEffect, useState } from "react";
import type { EffectCanvasProps } from "@/components/effects/useEffectView";
import { EffectCanvas } from "@/components/effects/useEffectView";
import { FallbackMark } from "@/components/effects/FallbackMark";

type Props = Omit<EffectCanvasProps, "mode" | "tier" | "scrollRef" | "preview">;

export function Object3D({ className, onStatus, particleCount = 420, ...props }: Props) {
  const [enhance, setEnhance] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (narrow.matches || reduce.matches) return;
    const id = window.setTimeout(() => setEnhance(true), 700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className={`relative h-full w-full text-brass-soft ${className ?? ""}`}>
      <FallbackMark
        shape={props.shape}
        className={`absolute inset-0 h-full w-full motion-safe:transition-opacity motion-safe:duration-500 ${
          live ? "opacity-0" : "opacity-100"
        }`}
      />
      {enhance ? (
        <EffectCanvas
          {...props}
          particleCount={particleCount}
          mode="icon"
          tier="icon"
          priority={0}
          className="absolute inset-0 h-full w-full"
          onStatus={(status) => {
            if (status === "ready") setLive(true);
            onStatus?.(status);
          }}
        />
      ) : null}
    </div>
  );
}
