"use client";

import { useState } from "react";
import { EffectCanvas } from "@/components/effects/useEffectView";
import { FallbackMark } from "@/components/effects/FallbackMark";

type Props = {
  poster: string;
  srcSet: string;
  width: number;
  height: number;
};

/**
 * Blueprint drawing that eases into a solid massing model.
 * The poster and line mark hold the frame until WebGL has painted.
 */
export function BlueprintStudy({ poster, srcSet, width, height }: Props) {
  const [ready, setReady] = useState(false);
  return (
    <div className="absolute right-0 top-0 h-[42%] w-[52%] sm:inset-y-0 sm:h-auto sm:w-[46%]">
      <img
        src={poster}
        srcSet={srcSet}
        sizes="(min-width: 640px) 46vw, 52vw"
        alt=""
        width={width}
        height={height}
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-45"
        }`}
      />
      <FallbackMark
        shape="blueprint"
        className={`absolute left-[18%] top-[18%] h-36 w-36 text-brass-soft transition-opacity duration-700 sm:left-1/2 sm:top-1/2 sm:h-48 sm:w-48 sm:-translate-x-1/2 sm:-translate-y-1/2 ${
          ready ? "opacity-0" : "opacity-80"
        }`}
      />
      <EffectCanvas
        shape="blueprint"
        mode="rise"
        palette="micap"
        particleCount={360}
        priority={8}
        onStatus={(status) => {
          if (status === "ready") setReady(true);
        }}
      />
    </div>
  );
}
