"use client";

import type { EffectCanvasProps } from "@/components/effects/useEffectView";
import { EffectCanvas } from "@/components/effects/useEffectView";

type Props = Omit<EffectCanvasProps, "mode" | "tier">;

export function BuildOnScroll({ priority, ...props }: Props) {
  return (
    <EffectCanvas
      {...props}
      mode="build"
      tier="primary"
      priority={priority ?? 10}
    />
  );
}
