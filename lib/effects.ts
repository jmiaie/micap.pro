import type { Practice } from "@/lib/site";

export type ShapeName =
  | "skyline"
  | "frame"
  | "boardroom"
  | "stack"
  | "growth"
  | "parcel"
  | "blueprint";

export type PaletteName = "micap";

export type EffectMode =
  | "rise"
  | "build"
  | "dissolve"
  | "dismantle"
  | "morph"
  | "icon";

export type EffectConfig = {
  mode: "rise" | "build" | "dissolve" | "dismantle";
  shape: ShapeName;
  palette: PaletteName;
  particleCount: number;
  label: string;
};

export const palettes: Record<
  PaletteName,
  {
    cream: number;
    brass: number;
    brassDeep: number;
    ink: number;
    glass: number;
    hot: number;
  }
> = {
  micap: {
    cream: 0xf7f4ed,
    brass: 0xc4a472,
    brassDeep: 0x6e4c24,
    ink: 0x141614,
    glass: 0x1c2824,
    hot: 0xe6c98a,
  },
};

export const practiceShapes = {
  fractional: "boardroom",
  software: "stack",
  business: "growth",
  construction: "frame",
  "real-estate": "parcel",
} as const satisfies Record<Practice["slug"], ShapeName>;

export const homeEffect: EffectConfig = {
  mode: "rise",
  shape: "skyline",
  palette: "micap",
  particleCount: 800,
  label: "Class A+ multifamily massing model",
};

const divisionEffects: Record<Practice["slug"], EffectConfig> = {
  fractional: {
    mode: "rise",
    shape: "boardroom",
    palette: "micap",
    particleCount: 480,
    label: "Executive boardroom",
  },
  software: {
    mode: "rise",
    shape: "stack",
    palette: "micap",
    particleCount: 520,
    label: "Layered system architecture",
  },
  business: {
    mode: "rise",
    shape: "growth",
    palette: "micap",
    particleCount: 480,
    label: "Layered capital structure",
  },
  construction: {
    mode: "build",
    shape: "frame",
    palette: "micap",
    particleCount: 640,
    label: "Structural steel frame and tower crane",
  },
  "real-estate": {
    mode: "rise",
    shape: "parcel",
    palette: "micap",
    particleCount: 480,
    label: "Parcel site plan and massing model",
  },
};

export function divisionEffect(slug: Practice["slug"]): EffectConfig {
  return divisionEffects[slug];
}

export function shapeForPractice(slug: Practice["slug"]): ShapeName {
  return practiceShapes[slug];
}
