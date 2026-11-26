"use client";

import type { EffectCanvasProps } from "@/components/effects/useEffectView";
import { EffectCanvas } from "@/components/effects/useEffectView";

type Props = Omit<EffectCanvasProps, "mode"> & {
  /** pulse: a lattice that dissolves and returns. between: dissolve only while the shape changes. */
  cycle?: "pulse" | "between";
};

export function ParticleDissolveHero({ cycle, priority, ...props }: Props) {
  const mode = cycle === "pulse" ? "dissolve" : cycle === "between" ? "morph" : "rise";
  return (
    <EffectCanvas
      {...props}
      mode={mode}
      tier="primary"
      priority={priority ?? (cycle === "between" ? 1 : 10)}
    />
  );
}
