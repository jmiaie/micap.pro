import type { ReactNode } from "react";
import type { ShapeName } from "@/lib/effects";

const strokes: Record<ShapeName, ReactNode> = {
  skyline: (
    <>
      <path d="M6 50h52" />
      <path d="M10 50V34h8v16M22 50V22h10v28M36 50V28h8v22M48 50V18h8v32" />
      <path d="M14 40h4M26 32h4M40 36h4M52 28h4" />
    </>
  ),
  tower: (
    <>
      <path d="M18 52h28" />
      <path d="M22 52V14h20v38" />
      <path d="M26 22h12M26 30h12M26 38h12M26 46h12" />
      <path d="M28 14V8h8v6" />
    </>
  ),
  network: (
    <>
      <path d="M14 22l18 8 16-10M14 22L22 44l20 6M32 30l10 20" />
      <circle cx="14" cy="22" r="3" fill="currentColor" stroke="none" />
      <circle cx="32" cy="30" r="3.2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="20" r="3" fill="currentColor" stroke="none" />
      <circle cx="22" cy="44" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="42" cy="50" r="2.6" fill="currentColor" stroke="none" />
    </>
  ),
  lattice: (
    <>
      <path d="M12 16h40M12 32h40M12 48h40M16 12v40M32 12v40M48 12v40" />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="16" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="48" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="48" cy="48" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),
  growth: (
    <>
      <path d="M8 52h48" />
      <path d="M12 52V40h6v12M22 52V32h6v20M32 52V26h6v26M42 52V16h6v36" />
      <path d="M15 40l10-8 10-6 10-10" />
    </>
  ),
  parcel: (
    <>
      <path d="M8 40h48v12H8z" />
      <path d="M14 40V26h12v14M30 40V18h10v22M42 40V30h8v10" />
      <path d="M32 40V28" />
    </>
  ),
};

export function FallbackMark({
  shape,
  className,
}: {
  shape: ShapeName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      {strokes[shape]}
    </svg>
  );
}
