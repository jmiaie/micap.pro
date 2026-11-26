"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { EffectMode, PaletteName, ShapeName } from "@/lib/effects";
import type { EffectSpec } from "@/components/effects/runtime";

export type EffectCanvasProps = {
  shape: ShapeName;
  palette?: PaletteName;
  particleCount?: number;
  mode: EffectMode;
  tier?: "primary" | "icon";
  priority?: number;
  className?: string;
  scrollRef?: RefObject<HTMLElement | null>;
  preview?: boolean;
  suspendBelow?: number;
  onStatus?: (status: "ready" | "unsupported") => void;
};

type RuntimeModule = typeof import("@/components/effects/runtime");

function whenIdle(run: () => void) {
  let cancel = () => {};
  const start = () => {
    const id = window.setTimeout(run, 280);
    cancel = () => window.clearTimeout(id);
  };
  if (document.readyState === "complete") start();
  else {
    const onLoad = () => start();
    window.addEventListener("load", onLoad, { once: true });
    const previous = cancel;
    cancel = () => {
      window.removeEventListener("load", onLoad);
      previous();
    };
  }
  return () => cancel();
}

export function useEffectView(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  props: EffectCanvasProps,
) {
  const spec = useRef<EffectSpec>({
    shape: props.shape,
    palette: props.palette ?? "micap",
    particleCount: props.particleCount ?? 2400,
    mode: props.mode,
    tier: props.tier ?? "primary",
    priority: props.priority ?? (props.tier === "icon" ? 0 : 5),
    preview: Boolean(props.preview),
    visible: false,
    scroll: 0,
    scrollEngaged: false,
    pointer: { x: 0, y: 0, active: false },
    hover: { active: false, x: 0 },
    onStatus: props.onStatus,
  });
  const runtime = useRef<RuntimeModule | null>(null);

  spec.current.shape = props.shape;
  spec.current.palette = props.palette ?? "micap";
  spec.current.particleCount = props.particleCount ?? 2400;
  spec.current.mode = props.mode;
  spec.current.tier = props.tier ?? "primary";
  spec.current.priority = props.priority ?? (props.tier === "icon" ? 0 : 5);
  spec.current.preview = Boolean(props.preview);
  spec.current.onStatus = props.onStatus;

  const suspendBelow = props.suspendBelow ?? 0;
  const scrollRef = props.scrollRef;
  const mode = props.mode;

  useEffect(() => {
    runtime.current?.requestFrame();
  }, [props.shape, props.preview, props.particleCount, props.mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (suspendBelow && window.matchMedia(`(max-width: ${suspendBelow - 1}px)`).matches) {
      return;
    }

    let dead = false;
    let release = () => {};
    let cancelIdle = () => {};
    let started = false;

    const wake = () => runtime.current?.requestFrame();

    const begin = () => {
      if (started || dead) return;
      started = true;
      cancelIdle = whenIdle(() => {
        import("@/components/effects/runtime")
          .then((mod) => {
            runtime.current = mod;
            if (dead || !canvasRef.current) return;
            release = mod.mountView(canvasRef.current, spec);
            mod.requestFrame();
          })
          .catch(() => {
            spec.current.onStatus?.("unsupported");
          });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const minRatio = mode === "icon" ? 0.01 : 0.18;
        const visible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= minRatio);
        spec.current.visible = visible;
        if (visible) begin();
        wake();
      },
      {
        rootMargin: mode === "icon" ? "80px" : "0px",
        threshold: [0, 0.18, 0.4, 0.75],
      },
    );
    observer.observe(canvas);

    const host =
      mode === "icon"
        ? canvas.closest("li") ?? canvas.parentElement
        : canvas;

    const onPointer = (event: PointerEvent) => {
      spec.current.pointer = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
      if (mode === "icon" && host) {
        const rect = host.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        spec.current.hover = { active: true, x: Math.max(-1, Math.min(1, x)) };
      }
      wake();
    };
    const onLeave = () => {
      spec.current.pointer = { ...spec.current.pointer, active: false };
      spec.current.hover = { active: false, x: 0 };
      wake();
    };

    host?.addEventListener("pointermove", onPointer);
    host?.addEventListener("pointerdown", onPointer);
    host?.addEventListener("pointerleave", onLeave);
    host?.addEventListener("pointercancel", onLeave);

    let onScroll: (() => void) | undefined;
    if (scrollRef) {
      onScroll = () => {
        const track = scrollRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const next =
          total <= 1 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
        if (
          spec.current.visible &&
          Math.abs(next - spec.current.scroll) > 0.02 &&
          next > 0.04
        ) {
          spec.current.scrollEngaged = true;
        }
        spec.current.scroll = next;
        wake();
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      dead = true;
      cancelIdle();
      release();
      observer.disconnect();
      host?.removeEventListener("pointermove", onPointer);
      host?.removeEventListener("pointerdown", onPointer);
      host?.removeEventListener("pointerleave", onLeave);
      host?.removeEventListener("pointercancel", onLeave);
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
  }, [canvasRef, mode, scrollRef, suspendBelow]);
}

export function EffectCanvas({
  className,
  ...props
}: EffectCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffectView(ref, {
    ...props,
    onStatus: (status) => {
      if (status === "ready") setReady(true);
      props.onStatus?.(status);
    },
  });
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-effect-mode={props.mode}
      data-effect-shape={props.shape}
      className={`${className ?? "absolute inset-0 h-full w-full"} touch-pan-y motion-safe:transition-opacity motion-safe:duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
