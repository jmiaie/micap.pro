"use client";

import type { EffectCanvasProps } from "@/components/effects/useEffectView";
import { EffectCanvas } from "@/components/effects/useEffectView";

type Props = Omit<EffectCanvasProps, "mode" | "tier">;

export function DismantleReassemble({ priority, ...props }: Props) {
  return (
    <EffectCanvas
      {...props}
      mode="dismantle"
      tier="primary"
      priority={priority ?? 10}
    />
  );
}
