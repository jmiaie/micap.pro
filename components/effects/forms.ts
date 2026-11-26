import type { ShapeName } from "@/lib/effects";

export type MaterialId = 0 | 1 | 2;

export type Part = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  material: MaterialId;
  start: number;
  ax: number;
  ay: number;
  az: number;
  ex: number;
  ey: number;
  ez: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
};

type Draft = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  material?: MaterialId;
  /** Omit to schedule from height. */
  start?: number;
  /** Travel distance on the way in. 0 stays put. */
  drop?: number;
  qx?: number;
  qy?: number;
  qz?: number;
  qw?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function jitter(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function quatFromUp(dx: number, dy: number, dz: number) {
  const len = Math.hypot(dx, dy, dz) || 1;
  const x = dx / len;
  const y = dy / len;
  const z = dz / len;
  const cx = z;
  const cy = 0;
  const cz = -x;
  const cLen = Math.hypot(cx, cy, cz);
  if (cLen < 1e-6) {
    return y > 0
      ? { x: 0, y: 0, z: 0, w: 1 }
      : { x: 1, y: 0, z: 0, w: 0 };
  }
  const angle = Math.acos(clamp(y, -1, 1));
  const s = Math.sin(angle / 2);
  return {
    x: (cx / cLen) * s,
    y: (cy / cLen) * s,
    z: (cz / cLen) * s,
    w: Math.cos(angle / 2),
  };
}

function compile(drafts: Draft[]): Part[] {
  const parts: Part[] = drafts.map((draft) => ({
    x: draft.x,
    y: draft.y,
    z: draft.z,
    w: draft.w,
    h: draft.h,
    d: draft.d,
    material: draft.material ?? 0,
    start: draft.start ?? -1,
    ax: 0,
    ay: draft.drop === 0 ? 0 : -(draft.drop ?? 1.15 + Math.max(0, draft.y) * 0.1),
    az: 0,
    ex: 0,
    ey: 0,
    ez: 0,
    qx: draft.qx ?? 0,
    qy: draft.qy ?? 0,
    qz: draft.qz ?? 0,
    qw: draft.qw ?? 1,
  }));

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const part of parts) {
    minX = Math.min(minX, part.x - part.w / 2);
    maxX = Math.max(maxX, part.x + part.w / 2);
    minY = Math.min(minY, part.y - part.h / 2);
    maxY = Math.max(maxY, part.y + part.h / 2);
    minZ = Math.min(minZ, part.z - part.d / 2);
    maxZ = Math.max(maxZ, part.z + part.d / 2);
  }
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  for (const part of parts) {
    part.x -= cx;
    part.y -= minY;
    part.z -= cz;
  }

  const height = Math.max(0.01, maxY - minY);
  parts.forEach((part, index) => {
    if (part.start < 0) {
      const j = jitter(index + part.x * 2.1 + part.z);
      part.start = clamp((part.y / height) * 0.66 + (j - 0.5) * 0.04, 0, 0.74);
    }
  });

  let cy = 0;
  for (const part of parts) cy += part.y;
  cy /= parts.length || 1;
  for (const part of parts) {
    const radial = Math.hypot(part.x, part.z);
    const len = radial || 1;
    part.ex = (part.x / len) * (0.65 + Math.min(1.5, radial * 0.38));
    part.ez = (part.z / len) * (0.65 + Math.min(1.5, radial * 0.38));
    part.ey = (part.y - cy) * 0.42 + 0.12;
  }

  return parts;
}

function shaft(
  drafts: Draft[],
  x: number,
  z: number,
  floors: number,
  width: number,
  depth: number,
  y0 = 0,
) {
  const story = 0.28;
  const total = floors * story;
  const corners: [number, number][] = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  for (const [sx, sz] of corners) {
    drafts.push({
      x: x + sx * width * 0.38,
      z: z + sz * depth * 0.38,
      y: y0 + total / 2,
      w: Math.max(0.055, width * 0.09),
      h: total,
      d: Math.max(0.055, depth * 0.09),
      material: 1,
    });
  }
  for (let floor = 0; floor < floors; floor += 1) {
    const y = y0 + 0.08 + floor * story;
    drafts.push({
      x,
      y,
      z,
      w: width,
      h: 0.07,
      d: depth,
      material: 0,
    });
    drafts.push({
      x,
      y: y + 0.12,
      z: z + depth * 0.52,
      w: width * 0.78,
      h: 0.1,
      d: 0.04,
      material: floor % 3 === 0 ? 1 : 2,
    });
  }
  drafts.push({
    x,
    y: y0 + total + 0.1,
    z,
    w: width * 0.68,
    h: 0.16,
    d: depth * 0.68,
    material: 1,
  });
}

function floorsOnly(
  drafts: Draft[],
  x: number,
  z: number,
  count: number,
  width: number,
  depth: number,
) {
  for (let floor = 0; floor < count; floor += 1) {
    const y = 0.22 + floor * 0.3;
    drafts.push({ x, y, z, w: width, h: 0.1, d: depth, material: 0 });
    drafts.push({
      x,
      y: y + 0.1,
      z: z + depth * 0.5,
      w: width * 0.72,
      h: 0.08,
      d: 0.035,
      material: 2,
    });
  }
  drafts.push({
    x,
    y: 0.22 + count * 0.3,
    z,
    w: width * 0.78,
    h: 0.08,
    d: depth * 0.78,
    material: 1,
  });
}

function link(
  drafts: Draft[],
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  start: number,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dy, dz);
  const q = quatFromUp(dx, dy, dz);
  drafts.push({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
    w: 0.09,
    h: Math.max(0.12, len),
    d: 0.09,
    material: 1,
    start,
    drop: 0.35,
    qx: q.x,
    qy: q.y,
    qz: q.z,
    qw: q.w,
  });
}

function skyline(): Part[] {
  const drafts: Draft[] = [
    {
      x: 0,
      y: 0.05,
      z: 0.15,
      w: 8.4,
      h: 0.1,
      d: 3.4,
      material: 1,
      start: 0,
      drop: 0,
    },
  ];
  const towers = [
    { x: -3.15, z: -0.15, floors: 5, w: 0.72, d: 0.56 },
    { x: -1.85, z: 0.2, floors: 8, w: 0.86, d: 0.62 },
    { x: -0.3, z: -0.05, floors: 12, w: 0.98, d: 0.7 },
    { x: 1.25, z: 0.22, floors: 7, w: 0.78, d: 0.58 },
    { x: 2.7, z: -0.08, floors: 10, w: 0.88, d: 0.64 },
  ];
  for (const tower of towers) {
    shaft(drafts, tower.x, tower.z, tower.floors, tower.w, tower.d, 0.12);
  }
  return compile(drafts);
}

function tower(): Part[] {
  const drafts: Draft[] = [
    {
      x: 0,
      y: 0.2,
      z: 0.15,
      w: 2.5,
      h: 0.4,
      d: 1.55,
      material: 0,
      start: 0,
      drop: 0.35,
    },
  ];
  shaft(drafts, 0, 0, 14, 1.2, 0.9, 0.42);
  return compile(drafts);
}

function network(): Part[] {
  const drafts: Draft[] = [];
  const clusters = [
    { x: -1.35, y: 1.15, z: 0.1, n: 5, r: 0.72 },
    { x: 1.25, y: 1.45, z: -0.05, n: 4, r: 0.66 },
    { x: 0.05, y: 0.38, z: 0.25, n: 4, r: 0.7 },
  ];
  const nodes: { x: number; y: number; z: number }[] = [];
  clusters.forEach((cluster, clusterIndex) => {
    const local: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < cluster.n; i += 1) {
      const angle = (i / cluster.n) * Math.PI * 2 + clusterIndex;
      const node = {
        x: cluster.x + Math.cos(angle) * cluster.r,
        y: cluster.y + ((i % 3) - 1) * 0.2,
        z: cluster.z + Math.sin(angle) * cluster.r * 0.7,
      };
      local.push(node);
      nodes.push(node);
      drafts.push({
        x: node.x,
        y: node.y,
        z: node.z,
        w: 0.4,
        h: 0.4,
        d: 0.4,
        material: i === 0 ? 1 : 0,
        start: 0.02 + clusterIndex * 0.06 + i * 0.02,
        drop: 1.15,
      });
    }
    for (let i = 0; i < local.length; i += 1) {
      link(drafts, local[i], local[(i + 1) % local.length], 0.4 + clusterIndex * 0.06);
    }
  });
  link(drafts, nodes[0], nodes[5], 0.58);
  link(drafts, nodes[5], nodes[9], 0.64);
  link(drafts, nodes[9], nodes[2], 0.7);
  return compile(drafts);
}

function lattice(): Part[] {
  const drafts: Draft[] = [];
  const cols = 7;
  const rows = 5;
  const spanX = 0.46;
  const spanY = 0.4;
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const x = (i - (cols - 1) / 2) * spanX;
      const y = 0.25 + j * spanY;
      if ((i + j) % 2 === 0) {
        drafts.push({
          x,
          y,
          z: 0,
          w: 0.11,
          h: 0.11,
          d: 0.11,
          material: 1,
        });
      }
      if (i < cols - 1 && j % 2 === 0) {
        drafts.push({
          x: x + spanX / 2,
          y,
          z: 0,
          w: spanX * 0.92,
          h: 0.035,
          d: 0.035,
          material: 2,
        });
      }
      if (j < rows - 1 && i % 3 !== 1) {
        drafts.push({
          x,
          y: y + spanY / 2,
          z: 0,
          w: 0.035,
          h: spanY * 0.92,
          d: 0.035,
          material: 0,
        });
      }
    }
  }
  for (let i = 0; i < cols; i += 2) {
    const x = (i - (cols - 1) / 2) * spanX;
    drafts.push({
      x,
      y: 0.25 + 2 * spanY,
      z: 0.28,
      w: 0.04,
      h: 0.04,
      d: 0.28,
      material: 1,
      start: 0.5,
    });
  }
  return compile(drafts);
}

function growth(): Part[] {
  const drafts: Draft[] = [
    {
      x: 0,
      y: 0.05,
      z: 0,
      w: 3.7,
      h: 0.08,
      d: 0.95,
      material: 1,
      start: 0,
      drop: 0,
    },
  ];
  const heights = [0.48, 0.72, 0.6, 1.05, 0.92, 1.38, 1.72, 2.15];
  heights.forEach((height, index) => {
    const x = (index - (heights.length - 1) / 2) * 0.44;
    const segments = 3;
    for (let segment = 0; segment < segments; segment += 1) {
      const slice = height / segments;
      drafts.push({
        x,
        y: segment * slice + slice / 2 + 0.08,
        z: 0,
        w: 0.28,
        h: slice * 0.84,
        d: 0.28,
        material: segment === segments - 1 ? 1 : 0,
        start: 0.08 + index * 0.04 + segment * 0.05,
      });
    }
  });
  return compile(drafts);
}

function parcel(): Part[] {
  const drafts: Draft[] = [];
  const lots = [
    [-0.9, -0.72],
    [0.9, -0.72],
    [-0.9, 0.72],
    [0.9, 0.72],
  ];
  for (const [x, z] of lots) {
    drafts.push({
      x,
      y: 0.06,
      z,
      w: 1.55,
      h: 0.1,
      d: 1.25,
      material: 1,
      start: 0,
      drop: 0.25,
    });
  }
  floorsOnly(drafts, -0.7, -0.4, 3, 0.78, 0.58);
  floorsOnly(drafts, 0.78, -0.28, 5, 0.64, 0.5);
  floorsOnly(drafts, 0.05, 0.68, 2, 0.96, 0.5);
  return compile(drafts);
}

const builders: Record<ShapeName, () => Part[]> = {
  skyline,
  tower,
  network,
  lattice,
  growth,
  parcel,
};

export function formFor(shape: ShapeName): Part[] {
  return builders[shape]();
}
