import type { ReactNode } from "react";
import type { ShapeName } from "@/lib/effects";

const strokes: Record<ShapeName, ReactNode> = {
  skyline: (
    <>
      <path d="M6 52h52" />
      <path d="M10 52V36h6V28h4v24M24 52V24h8V16h4v36M40 52V30h7V22h4v30" />
    </>
  ),
  frame: (
    <>
      <path d="M14 52V16M26 52V16M38 52V16M14 28h24M14 40h24M14 16h24" />
      <path d="M44 18h12M44 18v6M50 14v28" />
    </>
  ),
  boardroom: (
    <>
      <path d="M14 30h36v10H14z" />
      <path d="M18 30v-6h4v6M30 30v-6h4v6M42 30v-6h4v6M18 40v6h4v-6M30 40v6h4v-6M42 40v6h4v-6" />
      <path d="M32 8v10M29 18h6" />
    </>
  ),
  stack: (
    <>
      <path d="M12 46h32l6-6H18zM14 34h32l6-6H20zM16 22h32l6-6H22z" />
      <circle cx="24" cy="40" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="36" cy="28" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="28" cy="16" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  growth: (
    <>
      <path d="M8 52h48" />
      <path d="M12 52v-6h6v6M20 52V40h6v12M28 52V34h6v18M36 52V24h6v28M44 52V16h6v36" />
      <path d="M15 46l8-6 8-6 8-8 8-10" />
    </>
  ),
  parcel: (
    <>
      <path d="M8 18h48v30H8z" />
      <path d="M8 32h48M28 18v30" />
      <path d="M14 36h10v8H14zM32 22h8v12h-8zM34 40h12v6H34z" />
    </>
  ),
  blueprint: (
    <>
      <path d="M8 14h48M8 28h48M8 42h48M8 56h48M12 10v48M28 10v48M44 10v48" strokeDasharray="2 2" />
      <path d="M30 50V28h10v22M33 28V18h4v10" />
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
