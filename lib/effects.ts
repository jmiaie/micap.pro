import type { Practice } from "@/lib/site";

export type ShapeName =
  | "skyline"
  | "tower"
  | "network"
  | "lattice"
  | "growth"
  | "parcel";

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
  fractional: "network",
  software: "lattice",
  business: "growth",
  construction: "tower",
  "real-estate": "parcel",
} as const satisfies Record<Practice["slug"], ShapeName>;

export const homeEffect: EffectConfig = {
  mode: "rise",
  shape: "skyline",
  palette: "micap",
  particleCount: 3000,
  label: "Decorative skyline assembling from blocks and particles",
};

const divisionEffects: Record<Practice["slug"], EffectConfig> = {
  fractional: {
    mode: "build",
    shape: "network",
    palette: "micap",
    particleCount: 2000,
    label: "Decorative network assembling",
  },
  software: {
    mode: "dissolve",
    shape: "lattice",
    palette: "micap",
    particleCount: 3400,
    label: "Decorative lattice dissolving into particles",
  },
  business: {
    mode: "build",
    shape: "growth",
    palette: "micap",
    particleCount: 1800,
    label: "Decorative chart assembling",
  },
  construction: {
    mode: "build",
    shape: "tower",
    palette: "micap",
    particleCount: 2600,
    label: "Decorative tower assembling from floors",
  },
  "real-estate": {
    mode: "dismantle",
    shape: "parcel",
    palette: "micap",
    particleCount: 2400,
    label: "Decorative parcel separating and reassembling",
  },
};

export function divisionEffect(slug: Practice["slug"]): EffectConfig {
  return divisionEffects[slug];
}

export function shapeForPractice(slug: Practice["slug"]): ShapeName {
  return practiceShapes[slug];
}
