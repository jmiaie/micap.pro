"use client";

import { useEffect, useState } from "react";
import type { ShapeName } from "@/lib/effects";
import { ParticleDissolveHero } from "@/components/effects/ParticleDissolveHero";

type Active = {
  shape: ShapeName;
  index: string;
  title: string;
};

const fallback: Active = {
  shape: "network",
  index: "01",
  title: "Fractional Executive Services",
};

function readActive(): Active | null {
  const cards = [...document.querySelectorAll<HTMLElement>("[data-division-shape]")];
  let best: HTMLElement | null = null;
  let bestDistance = Infinity;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight * 0.46);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = card;
    }
  }
  if (!best) return null;
  const shape = best.dataset.divisionShape as ShapeName | undefined;
  if (!shape) return null;
  return {
    shape,
    index: best.dataset.divisionIndex ?? fallback.index,
    title: best.dataset.divisionTitle ?? fallback.title,
  };
}

export function DivisionField() {
  const [active, setActive] = useState<Active>(fallback);

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      const next = readActive();
      if (!next) return;
      setActive((current) =>
        current.shape === next.shape && current.title === next.title ? current : next,
      );
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(apply);
    };
    const onOver = (event: Event) => {
      const card = (event.target as Element | null)?.closest?.("[data-division-shape]");
      if (!(card instanceof HTMLElement)) return;
      const shape = card.dataset.divisionShape as ShapeName | undefined;
      if (!shape) return;
      setActive({
        shape,
        index: card.dataset.divisionIndex ?? fallback.index,
        title: card.dataset.divisionTitle ?? fallback.title,
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerover", onOver);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div className="relative hidden min-h-[32rem] overflow-hidden bg-ink lg:block">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,164,114,0.2), rgba(20,22,20,0.15) 58%, rgba(20,22,20,0.92))",
        }}
      />
      <ParticleDissolveHero
        shape={active.shape}
        palette="micap"
        particleCount={1600}
        cycle="between"
        priority={1}
        suspendBelow={1024}
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-6">
        <p className="text-xs font-semibold uppercase tracking-eyebrow text-brass-soft">
          {active.index}
        </p>
        <p className="mt-2 font-display text-3xl font-medium tracking-tight text-cream">
          {active.title}
        </p>
      </div>
    </div>
  );
}
