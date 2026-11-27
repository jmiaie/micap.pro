import * as THREE from "three";
import type { ShapeName } from "@/lib/effects";

/**
 * Original procedural studies for the Micap heroes.
 * Geometry is built with three.js primitives. No imported models,
 * and no people.
 */

export type MaterialName =
  | "glass"
  | "brass"
  | "steel"
  | "stone"
  | "timber"
  | "cloth"
  | "glow"
  | "shadow"
  | "line"
  | "sky";

export type PieceDef = {
  geometry: THREE.BufferGeometry;
  material: MaterialName;
  position?: [number, number, number];
  rotation?: [number, number, number];
  start?: number;
  travel?: [number, number, number];
  edges?: boolean;
  edgeLines?: THREE.BufferGeometry;
  opacity?: number;
  fade?: boolean;
  shared?: boolean;
  depthWrite?: boolean;
  doubleSide?: boolean;
  renderOrder?: number;
  /** Clear glass that shows the city behind it. */
  transmission?: boolean;
};

export type LightDef = {
  position: [number, number, number];
  color: number;
  intensity: number;
  distance: number;
};

export type CameraDef = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  drift: number;
  narrowTarget?: [number, number, number];
};

export type Subject = {
  pieces: PieceDef[];
  lights: LightDef[];
  particles: {
    center: [number, number, number];
    spread: [number, number, number];
    count: number;
  };
  camera: CameraDef;
  icon: CameraDef;
  blueprint?: boolean;
  pace?: number;
};

function merge(parts: THREE.BufferGeometry[]) {
  let count = 0;
  for (const geo of parts) count += geo.getAttribute("position").count;
  const pos = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  let cursor = 0;
  for (const geo of parts) {
    const position = geo.getAttribute("position");
    const normal = geo.getAttribute("normal");
    for (let i = 0; i < position.count; i += 1) {
      const o = (cursor + i) * 3;
      pos[o] = position.getX(i);
      pos[o + 1] = position.getY(i);
      pos[o + 2] = position.getZ(i);
      if (normal) {
        nrm[o] = normal.getX(i);
        nrm[o + 1] = normal.getY(i);
        nrm[o + 2] = normal.getZ(i);
      } else {
        nrm[o + 1] = 1;
      }
    }
    cursor += position.count;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(nrm, 3));
  return geometry;
}

function nonIndexed(source: THREE.BufferGeometry) {
  const geometry = source.index ? source.toNonIndexed() : source;
  if (geometry !== source) source.dispose();
  return geometry;
}

function placeBox(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  rotY = 0,
) {
  const geo = nonIndexed(new THREE.BoxGeometry(w, h, d));
  const matrix = new THREE.Matrix4().makeRotationY(rotY);
  matrix.setPosition(x, y, z);
  geo.applyMatrix4(matrix);
  return geo;
}

function lines(pairs: Array<[[number, number, number], [number, number, number]]>) {
  const position = new Float32Array(pairs.length * 6);
  pairs.forEach(([[ax, ay, az], [bx, by, bz]], index) => {
    const o = index * 6;
    position[o] = ax;
    position[o + 1] = ay;
    position[o + 2] = az;
    position[o + 3] = bx;
    position[o + 4] = by;
    position[o + 5] = bz;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  return geometry;
}

function rectLines(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
): Array<[[number, number, number], [number, number, number]]> {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const z0 = z - d / 2;
  const z1 = z + d / 2;
  const a: [number, number, number] = [x0, y, z0];
  const b: [number, number, number] = [x1, y, z0];
  const c: [number, number, number] = [x1, y, z1];
  const e: [number, number, number] = [x0, y, z1];
  return [
    [a, b],
    [b, c],
    [c, e],
    [e, a],
  ];
}

function gridLines(
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  y: number,
  nx: number,
  nz: number,
) {
  const pairs: Array<[[number, number, number], [number, number, number]]> = [];
  for (let i = 0; i <= nx; i += 1) {
    const x = x0 + ((x1 - x0) * i) / nx;
    pairs.push([
      [x, y, z0],
      [x, y, z1],
    ]);
  }
  for (let j = 0; j <= nz; j += 1) {
    const z = z0 + ((z1 - z0) * j) / nz;
    pairs.push([
      [x0, y, z],
      [x1, y, z],
    ]);
  }
  return lines(pairs);
}

function contactEllipse() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const fade = ctx.createRadialGradient(64, 64, 6, 64, 64, 64);
  fade.addColorStop(0, "rgba(0,0,0,0.55)");
  fade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

let contactMap: THREE.CanvasTexture | null = null;

export function contactTexture() {
  if (!contactMap) contactMap = contactEllipse();
  return contactMap;
}

function mass(
  pieces: PieceDef[],
  x: number,
  z: number,
  y0: number,
  w: number,
  d: number,
  h: number,
  start: number,
  travel: number,
  material: MaterialName = "glass",
  fade = false,
) {
  if (h < 0.02) return;
  pieces.push({
    geometry: new THREE.BoxGeometry(w, h, d),
    material,
    position: [x, y0 + h / 2, z],
    start,
    travel: [0, travel, 0],
    edges: true,
    fade,
    opacity: material === "glass" ? (fade ? 0.78 : 0.52) : undefined,
  });
}

function floorRings(
  x: number,
  z: number,
  y0: number,
  y1: number,
  w: number,
  d: number,
  step: number,
) {
  const pairs: Array<[[number, number, number], [number, number, number]]> = [];
  for (let y = y0 + step; y < y1 - 0.04; y += step) {
    pairs.push(...rectLines(x, y, z, w * 0.992, d * 0.992));
  }
  if (!pairs.length) return null;
  return lines(pairs);
}

function towerMassing(
  pieces: PieceDef[],
  spec: {
    x: number;
    z: number;
    w: number;
    d: number;
    h: number;
    podium: number;
    crownAt: number;
    start: number;
    travel: number;
    fade?: boolean;
  },
) {
  const { x, z, w, d, h, podium, crownAt, start, travel, fade } = spec;
  mass(pieces, x, z, 0, w, d, podium, start, travel, "glass", fade);
  const shaftH = Math.max(0.2, h * crownAt - podium);
  const shaftW = w * 0.78;
  const shaftD = d * 0.78;
  mass(pieces, x, z, podium, shaftW, shaftD, shaftH, start + 0.04, travel, "glass", fade);
  const crownY = podium + shaftH;
  const crownH = Math.max(0.16, h - crownY);
  mass(
    pieces,
    x,
    z,
    crownY,
    shaftW * 0.62,
    shaftD * 0.62,
    crownH,
    start + 0.08,
    travel,
    "glass",
    fade,
  );
  const rings = floorRings(x, z, podium, crownY, shaftW, shaftD, 0.34);
  if (rings) {
    pieces.push({
      geometry: rings,
      material: "line",
      start,
      travel: [0, travel, 0],
      opacity: fade ? 0.9 : 0.55,
      fade,
    });
  }
}

function skyline(): Subject {
  const pieces: PieceDef[] = [];
  pieces.push({
    geometry: new THREE.BoxGeometry(6.6, 0.08, 2.5),
    material: "stone",
    position: [0.45, 0.04, 0],
    start: 0,
    travel: [0, -0.2, 0],
  });
  pieces.push({
    geometry: gridLines(-2.6, 3.6, -1.5, 1.5, 0.085, 12, 6),
    material: "line",
    opacity: 0.28,
    start: 0,
  });
  const towers = [
    { x: -1.85, z: 0.18, w: 0.66, d: 0.5, h: 1.65, podium: 0.22, crownAt: 0.72 },
    { x: -0.85, z: -0.22, w: 0.8, d: 0.58, h: 2.55, podium: 0.26, crownAt: 0.7 },
    { x: 0.25, z: 0.08, w: 0.92, d: 0.66, h: 3.7, podium: 0.32, crownAt: 0.74 },
    { x: 1.35, z: -0.16, w: 0.74, d: 0.54, h: 2.85, podium: 0.26, crownAt: 0.68 },
    { x: 2.25, z: 0.24, w: 0.58, d: 0.46, h: 1.85, podium: 0.2, crownAt: 0.7 },
  ];
  towers.forEach((tower, index) => {
    towerMassing(pieces, {
      ...tower,
      start: 0.06 + index * 0.07,
      travel: -0.85,
    });
  });
  pieces.push({
    geometry: new THREE.PlaneGeometry(5.4, 2.1),
    material: "shadow",
    position: [0.45, 0.09, 0],
    rotation: [-Math.PI / 2, 0, 0],
    depthWrite: false,
    renderOrder: 1,
  });
  return {
    pieces,
    lights: [],
    particles: { center: [0.45, 1.5, 0], spread: [6.2, 3.2, 2.4], count: 520 },
    camera: {
      position: [4.6, 2.35, 6.1],
      target: [-0.35, 1.25, 0],
      fov: 26,
      drift: 0.05,
      narrowTarget: [0.45, 1.35, 0],
    },
    icon: {
      position: [3.4, 2.15, 4.4],
      target: [0.3, 1.15, 0],
      fov: 30,
      drift: 0,
    },
    pace: 0.95,
  };
}

const BAY = 0.78;
const BAYS_X = 4;
const BAYS_Z = 3;
const STORY = 0.4;
const STORIES = 7;

function frameMembers() {
  const height = STORIES * STORY;
  const x0 = -(BAYS_X * BAY) / 2;
  const z0 = -(BAYS_Z * BAY) / 2;
  const columns: THREE.BufferGeometry[] = [];
  for (let i = 0; i <= BAYS_X; i += 1) {
    for (let j = 0; j <= BAYS_Z; j += 1) {
      columns.push(
        placeBox(0.04, height, 0.04, x0 + i * BAY, height / 2, z0 + j * BAY),
      );
    }
  }
  const columnGeo = merge(columns);
  columns.forEach((geo) => geo.dispose());

  const floors: THREE.BufferGeometry[] = [];
  for (let level = 1; level <= STORIES; level += 1) {
    const y = level * STORY;
    const beams: THREE.BufferGeometry[] = [];
    for (let j = 0; j <= BAYS_Z; j += 1) {
      for (let i = 0; i < BAYS_X; i += 1) {
        beams.push(
          placeBox(BAY * 0.98, 0.03, 0.026, x0 + (i + 0.5) * BAY, y, z0 + j * BAY),
        );
      }
    }
    for (let i = 0; i <= BAYS_X; i += 1) {
      for (let j = 0; j < BAYS_Z; j += 1) {
        beams.push(
          placeBox(0.026, 0.03, BAY * 0.98, x0 + i * BAY, y, z0 + (j + 0.5) * BAY),
        );
      }
    }
    floors.push(merge(beams));
    beams.forEach((geo) => geo.dispose());
  }
  return { columnGeo, floors, x0, z0, height };
}

function craneGeometry() {
  const x = 2.05;
  const z = 1.5;
  const h = 3.45;
  const s = 0.1;
  const parts: THREE.BufferGeometry[] = [];
  for (const [dx, dz] of [
    [-s, -s],
    [s, -s],
    [-s, s],
    [s, s],
  ] as const) {
    parts.push(placeBox(0.022, h, 0.022, x + dx, h / 2, z + dz));
  }
  for (let k = 1; k <= 8; k += 1) {
    const y = (h * k) / 8;
    parts.push(placeBox(s * 2, 0.012, 0.012, x, y, z - s));
    parts.push(placeBox(s * 2, 0.012, 0.012, x, y, z + s));
    parts.push(placeBox(0.012, 0.012, s * 2, x - s, y, z));
    parts.push(placeBox(0.012, 0.012, s * 2, x + s, y, z));
  }
  parts.push(placeBox(0.28, 0.16, 0.22, x, h + 0.02, z));
  const mast = merge(parts);
  parts.forEach((geo) => geo.dispose());

  const jibY = h + 0.02;
  const tipX = x - 2.55;
  const counterX = x + 0.95;
  const jibPairs: Array<[[number, number, number], [number, number, number]]> = [];
  const chords = [0, 0.16];
  for (const lift of chords) {
    jibPairs.push([
      [x, jibY + lift, z],
      [tipX, jibY + lift * 0.35, z],
    ]);
    jibPairs.push([
      [x, jibY + lift, z],
      [counterX, jibY + lift, z],
    ]);
  }
  for (let i = 1; i <= 6; i += 1) {
    const t = i / 6;
    const px = x + (tipX - x) * t;
    const y0 = jibY;
    const y1 = jibY + 0.16 * (1 - t * 0.65);
    jibPairs.push([
      [px, y0, z],
      [px, y1, z],
    ]);
  }
  jibPairs.push([
    [tipX, jibY, z],
    [0.15, 1.35, 0.05],
  ]);
  return { mast, jib: lines(jibPairs), x, z, h };
}

function frame(): Subject {
  const pieces: PieceDef[] = [];
  const built = frameMembers();
  pieces.push({
    geometry: new THREE.BoxGeometry(BAYS_X * BAY + 0.8, 0.06, BAYS_Z * BAY + 0.8),
    material: "stone",
    position: [0, 0.03, 0],
    start: 0,
  });
  pieces.push({
    geometry: gridLines(-2.4, 2.8, -1.8, 1.8, 0.065, 10, 8),
    material: "line",
    opacity: 0.22,
    start: 0,
  });
  pieces.push({
    geometry: built.columnGeo,
    material: "steel",
    edges: false,
    start: 0.02,
    travel: [0, -1.4, 0],
  });
  built.floors.forEach((geometry, index) => {
    const level = index + 1;
    pieces.push({
      geometry,
      material: "brass",
      start: 0.08 + index * 0.07,
      travel: [0, -0.45, 0],
    });
    const slab = new THREE.BoxGeometry(BAYS_X * BAY - 0.08, 0.018, BAYS_Z * BAY - 0.08);
    pieces.push({
      geometry: slab,
      material: "glass",
      position: [0, level * STORY + 0.02, 0],
      opacity: 0.28,
      start: 0.12 + index * 0.07,
      travel: [0, -0.35, 0],
      depthWrite: false,
      renderOrder: 2,
    });
  });
  const crane = craneGeometry();
  pieces.push({
    geometry: crane.mast,
    material: "brass",
    start: 0.12,
    travel: [0, -1.1, 0],
  });
  pieces.push({
    geometry: crane.jib,
    material: "line",
    opacity: 0.9,
    start: 0.55,
    travel: [0, -0.4, 0],
  });
  pieces.push({
    geometry: new THREE.BoxGeometry(0.16, 0.1, 0.16),
    material: "brass",
    position: [crane.x + 0.78, crane.h + 0.08, crane.z],
    start: 0.62,
    travel: [0, -0.3, 0],
    edges: true,
  });
  return {
    pieces,
    lights: [],
    particles: { center: [0.4, 1.4, 0], spread: [6.5, 3.2, 4], count: 420 },
    camera: {
      position: [3.7, 2.25, 5.15],
      target: [0.45, 1.25, 0.15],
      fov: 30,
      drift: 0.04,
      narrowTarget: [0.35, 1.2, 0],
    },
    icon: {
      position: [3.3, 2.05, 3.6],
      target: [0.3, 1.05, 0],
      fov: 32,
      drift: 0,
    },
    pace: 0.8,
  };
}

function parcel(): Subject {
  const pieces: PieceDef[] = [];
  pieces.push({
    geometry: new THREE.BoxGeometry(5.1, 0.05, 3.5),
    material: "stone",
    position: [0, 0.025, -0.05],
  });
  pieces.push({
    geometry: new THREE.BoxGeometry(5.1, 0.02, 0.42),
    material: "steel",
    position: [0, 0.01, 1.9],
  });
  const lots = lines([
    ...rectLines(0, 0.06, -0.05, 4.7, 3.15),
    ...rectLines(-1.15, 0.06, -0.35, 2.15, 2.35),
    ...rectLines(1.15, 0.06, -0.45, 2.05, 2.15),
    [
      [-2.35, 0.06, 0.55],
      [2.35, 0.06, 0.55],
    ],
    [
      [0.05, 0.06, -1.62],
      [0.05, 0.06, 1.5],
    ],
  ]);
  pieces.push({ geometry: lots, material: "line", opacity: 0.72 });
  const buildings = [
    { x: -1.2, z: -0.55, w: 1.15, d: 0.82, h: 0.38 },
    { x: -0.15, z: -0.4, w: 0.62, d: 0.62, h: 1.45 },
    { x: 1.2, z: -0.7, w: 0.95, d: 0.7, h: 0.82 },
    { x: 0.95, z: 0.85, w: 1.25, d: 0.48, h: 0.28 },
  ];
  buildings.forEach((building, index) => {
    mass(
      pieces,
      building.x,
      building.z,
      0.05,
      building.w,
      building.d,
      building.h,
      0.08 + index * 0.08,
      -0.35,
    );
  });
  return {
    pieces,
    lights: [],
    particles: { center: [0, 0.6, 0], spread: [5, 1.4, 3.4], count: 280 },
    camera: {
      position: [3.5, 3.15, 4.15],
      target: [0.05, 0.25, -0.05],
      fov: 28,
      drift: 0.035,
      narrowTarget: [0.1, 0.35, 0],
    },
    icon: {
      position: [2.8, 2.5, 3.2],
      target: [0, 0.25, 0],
      fov: 32,
      drift: 0,
    },
    pace: 1,
  };
}

function growth(): Subject {
  const pieces: PieceDef[] = [];
  pieces.push({
    geometry: new THREE.BoxGeometry(4.7, 0.045, 0.95),
    material: "stone",
    position: [0, 0.03, 0],
    start: 0,
  });
  const tops: [number, number, number][] = [];
  for (let i = 0; i < 7; i += 1) {
    const layers = 2 + i;
    const x = (i - 3) * 0.62;
    const plate = 0.048;
    const gap = 0.034 + i * 0.01;
    for (let layer = 0; layer < layers; layer += 1) {
      const y = 0.08 + layer * (plate + gap);
      const top = layer === layers - 1;
      pieces.push({
        geometry: new THREE.BoxGeometry(0.44, plate, 0.66),
        material: top ? "brass" : "glass",
        position: [x, y, 0],
        opacity: top ? 1 : 0.4,
        edges: true,
        start: 0.05 + i * 0.06 + layer * 0.012,
        travel: [0, -0.4 - i * 0.04, 0],
        depthWrite: top,
      });
      if (top) tops.push([x, y + plate / 2, 0]);
    }
  }
  const trend: Array<[[number, number, number], [number, number, number]]> = [];
  for (let i = 0; i < tops.length - 1; i += 1) {
    trend.push([tops[i], tops[i + 1]]);
  }
  pieces.push({
    geometry: lines(trend),
    material: "line",
    opacity: 0.85,
    start: 0.55,
  });
  return {
    pieces,
    lights: [],
    particles: { center: [0.2, 0.8, 0], spread: [4.6, 1.8, 1.4], count: 260 },
    camera: {
      position: [3.1, 1.7, 4.3],
      target: [0.15, 0.62, 0],
      fov: 28,
      drift: 0.04,
      narrowTarget: [0.15, 0.7, 0],
    },
    icon: {
      position: [2.4, 1.45, 3.3],
      target: [0.1, 0.55, 0],
      fov: 30,
      drift: 0,
    },
    pace: 0.9,
  };
}

function boardroom(): Subject {
  const pieces: PieceDef[] = [];
  pieces.push({
    geometry: new THREE.BoxGeometry(9.5, 0.06, 7.4),
    material: "stone",
    position: [0, 0.03, -0.2],
  });
  const glass = {
    material: "glass" as const,
    transmission: true,
    renderOrder: 3,
    depthWrite: false,
  };
  pieces.push({
    ...glass,
    geometry: new THREE.PlaneGeometry(6.4, 2.55),
    position: [0, 1.38, -1.85],
  });
  pieces.push({
    ...glass,
    geometry: new THREE.PlaneGeometry(4.2, 2.55),
    position: [-3.2, 1.38, 0.2],
    rotation: [0, Math.PI / 2, 0],
  });
  pieces.push({
    ...glass,
    geometry: new THREE.PlaneGeometry(4.2, 2.55),
    position: [3.2, 1.38, 0.2],
    rotation: [0, Math.PI / 2, 0],
  });
  const frame: Array<[[number, number, number], [number, number, number]]> = [
    [
      [-3.2, 0.08, -1.85],
      [-3.2, 2.66, -1.85],
    ],
    [
      [3.2, 0.08, -1.85],
      [3.2, 2.66, -1.85],
    ],
    [
      [-3.2, 2.66, -1.85],
      [3.2, 2.66, -1.85],
    ],
    [
      [-1.05, 0.08, -1.84],
      [-1.05, 2.66, -1.84],
    ],
    [
      [1.05, 0.08, -1.84],
      [1.05, 2.66, -1.84],
    ],
  ];
  pieces.push({ geometry: lines(frame), material: "line", opacity: 0.45 });
  return {
    pieces,
    lights: [],
    particles: { center: [0, 1.2, 0], spread: [1, 1, 1], count: 0 },
    camera: {
      position: [0.55, 1.52, 3.25],
      target: [0, 0.78, -0.45],
      fov: 32,
      drift: 0.06,
      narrowTarget: [0.15, 0.84, -0.2],
    },
    icon: {
      position: [2.15, 1.55, 2.35],
      target: [0, 0.55, -0.1],
      fov: 34,
      drift: 0,
    },
    pace: 1.2,
  };
}

function stack(): Subject {
  const pieces: PieceDef[] = [];
  const layers = [
    { y: 0.28, rot: -0.08, nodes: 4 },
    { y: 0.92, rot: 0.06, nodes: 5 },
    { y: 1.56, rot: -0.05, nodes: 4 },
    { y: 2.2, rot: 0.04, nodes: 3 },
  ];
  const nodeWorld: [number, number, number][][] = [];
  layers.forEach((layer, index) => {
    pieces.push({
      geometry: new THREE.BoxGeometry(2.55, 0.03, 1.4),
      material: "glass",
      position: [0, layer.y, 0],
      rotation: [0, layer.rot, 0],
      opacity: 0.34,
      edges: true,
      start: 0.04 + index * 0.1,
      travel: [0, -0.35, 0],
      depthWrite: false,
      renderOrder: 2,
    });
    const locals: [number, number][] = [];
    for (let n = 0; n < layer.nodes; n += 1) {
      const u = (n / Math.max(1, layer.nodes - 1)) * 2 - 1;
      locals.push([u * 0.85, n % 2 === 0 ? -0.32 : 0.32]);
    }
    const matrix = new THREE.Matrix4().makeRotationY(layer.rot);
    const worlds: [number, number, number][] = [];
    locals.forEach(([lx, lz], n) => {
      const point = new THREE.Vector3(lx, 0, lz).applyMatrix4(matrix);
      const position: [number, number, number] = [point.x, layer.y + 0.07, point.z];
      worlds.push(position);
      pieces.push({
        geometry: new THREE.SphereGeometry(0.055, 18, 14),
        material: n === 0 ? "glow" : "brass",
        position,
        start: 0.12 + index * 0.1 + n * 0.02,
        travel: [0, -0.2, 0],
      });
    });
    nodeWorld.push(worlds);
    const pairs: Array<[[number, number, number], [number, number, number]]> = [];
    for (let n = 0; n < worlds.length - 1; n += 1) pairs.push([worlds[n], worlds[n + 1]]);
    if (pairs.length) {
      pieces.push({
        geometry: lines(pairs),
        material: "line",
        opacity: 0.7,
        start: 0.2 + index * 0.1,
      });
    }
  });
  const links: Array<[[number, number, number], [number, number, number]]> = [];
  for (let layer = 0; layer < nodeWorld.length - 1; layer += 1) {
    const from = nodeWorld[layer][0];
    const to = nodeWorld[layer + 1][0];
    if (from && to) links.push([from, to]);
    const fromB = nodeWorld[layer][nodeWorld[layer].length - 1];
    const toB = nodeWorld[layer + 1][nodeWorld[layer + 1].length - 1];
    if (fromB && toB) links.push([fromB, toB]);
  }
  pieces.push({
    geometry: lines(links),
    material: "line",
    opacity: 0.45,
    start: 0.48,
  });
  pieces.push({
    geometry: new THREE.PlaneGeometry(2.3, 1.3),
    material: "shadow",
    position: [0, 0.02, 0],
    rotation: [-Math.PI / 2, 0, 0],
    depthWrite: false,
  });
  return {
    pieces,
    lights: [],
    particles: { center: [0, 1.2, 0], spread: [3.2, 2.4, 2], count: 340 },
    camera: {
      position: [2.7, 2.05, 3.5],
      target: [0, 1.05, 0],
      fov: 28,
      drift: 0.045,
      narrowTarget: [0, 1.15, 0],
    },
    icon: {
      position: [2.1, 1.8, 2.7],
      target: [0, 1, 0],
      fov: 30,
      drift: 0,
    },
    pace: 0.9,
  };
}

function blueprint(): Subject {
  const pieces: PieceDef[] = [];
  pieces.push({
    geometry: gridLines(-1.4, 3.4, -1.6, 1.6, 0.02, 14, 8),
    material: "line",
    opacity: 0.4,
    fade: true,
  });
  towerMassing(pieces, {
    x: 1.15,
    z: 0,
    w: 0.95,
    d: 0.7,
    h: 3.15,
    podium: 0.28,
    crownAt: 0.72,
    start: 0,
    travel: 0,
    fade: true,
  });
  return {
    pieces,
    lights: [],
    particles: { center: [1.15, 1.4, 0], spread: [2.4, 2.8, 1.6], count: 220 },
    camera: {
      position: [3.4, 1.9, 4.3],
      target: [0.15, 1.2, 0],
      fov: 27,
      drift: 0.04,
      narrowTarget: [1.15, 1.35, 0],
    },
    icon: {
      position: [2.6, 1.7, 3.2],
      target: [1, 1.15, 0],
      fov: 28,
      drift: 0,
    },
    blueprint: true,
    pace: 0.55,
  };
}

const builders: Record<ShapeName, () => Subject> = {
  skyline,
  frame,
  parcel,
  growth,
  boardroom,
  stack,
  blueprint,
};

export function subjectFor(shape: ShapeName) {
  return builders[shape]();
}
