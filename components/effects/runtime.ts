import type { EffectMode, PaletteName, ShapeName } from "@/lib/effects";
import { palettes } from "@/lib/effects";
import type { Part } from "@/components/effects/forms";
import { formFor } from "@/components/effects/forms";
import * as THREE from "three";

/**
 * One WebGL renderer for the page. Views copy into their own 2D canvases.
 *
 * Adapted from Meng To's MIT-licensed skills (area-weighted samples, a shared
 * erosion function, rigid construction phasing, and one renderer across cards).
 * Notice: CREDITS.md. This file is not a copy of those demos.
 */

export type EffectSpec = {
  shape: ShapeName;
  palette: PaletteName;
  particleCount: number;
  mode: EffectMode;
  tier: "primary" | "icon";
  priority: number;
  preview: boolean;
  visible: boolean;
  scroll: number;
  scrollEngaged: boolean;
  pointer: { x: number; y: number; active: boolean };
  hover: { active: boolean; x: number };
  onStatus?: (status: "ready" | "unsupported") => void;
};

type SpecRef = { current: EffectSpec };

type Uniforms = {
  phase: { value: number };
  spread: { value: number };
  brush: { value: THREE.Vector3 };
  amount: { value: number };
  globalAmount: { value: number };
  buildMode: { value: number };
  wireFloor: { value: number };
  clock: { value: number };
  density: { value: number };
  pointScale: { value: number };
  wireColor: { value: THREE.Vector3 };
  colorA: { value: THREE.Vector3 };
  colorB: { value: THREE.Vector3 };
  colorHot: { value: THREE.Vector3 };
};

type View = {
  spec: SpecRef;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pivot: THREE.Group;
  uniforms: Uniforms;
  solids: THREE.Mesh[];
  lines: THREE.LineSegments | null;
  grains: THREE.Points | null;
  terrain: THREE.Points | null;
  owned: THREE.BufferGeometry[];
  materials: THREE.Material[];
  previewPoint: THREE.Vector3;
  shown: string;
  pending: ShapeName | null;
  transition: "out" | "in" | null;
  phase: number;
  spread: number;
  autoT: number;
  autoDone: boolean;
  brush: THREE.Vector3;
  brushTarget: THREE.Vector3;
  amount: number;
  globalAmount: number;
  globalTarget: number;
  yaw: number;
  spin: number;
  painted: boolean;
  settled: boolean;
  clock: number;
  raycaster: THREE.Raycaster;
  pointerNdc: THREE.Vector2;
  failed: boolean;
};

const views = new Set<View>();
let renderer: THREE.WebGLRenderer | null = null;
let raf = 0;
let reduceQuery: MediaQueryList | null = null;
const box = new THREE.BoxGeometry(1, 1, 1);
const boxEdges = new THREE.EdgesGeometry(box, 20);
const tmpMatrix = new THREE.Matrix4();
const tmpNormal = new THREE.Matrix3();
const tmpPos = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpScale = new THREE.Vector3();
const tmpNormalVec = new THREE.Vector3();

const ASSEMBLE_VERT = /* glsl */ `
attribute vec4 arrive;
attribute vec3 explode;
varying vec3 vHome;
varying float vSolid;
uniform float phase;
uniform float spread;
`;

const GRAIN_VERT = /* glsl */ `
attribute float seed;
attribute vec4 arrive;
attribute vec3 explode;
varying float vAlpha;
varying float vTone;
uniform vec3 brush;
uniform float phase;
uniform float spread;
uniform float amount;
uniform float globalAmount;
uniform float clock;
uniform float density;
uniform float pointScale;
void main() {
  float solid = (phase - arrive.w - 0.055) / 0.16;
  float remaining = 1.0 - clamp(solid, 0.0, 1.0);
  vec3 home = position + arrive.xyz * remaining * remaining + explode * spread;
  float grain = 0.038 * sin(dot(position, vec3(19.0, 11.0, 9.0))) + 0.023 * cos(dot(position, vec3(-14.0, 29.0, 23.0)));
  float erosion = clamp(0.08 + distance(position, brush) * 0.69 + grain, 0.04, 1.5);
  float exposure = max(amount, globalAmount);
  float freed = smoothstep(erosion - 0.045, erosion + 0.13, exposure);
  float drift = seed < 0.65 ? 0.06 : (seed < 0.91 ? 0.28 : 0.77);
  vec3 flow = vec3(
    sin(position.y * 3.0 + clock * 1.3 + seed * 4.0),
    cos(position.z * 4.0 + clock + seed * 3.0),
    sin(position.x * 3.0 - clock)
  );
  vec3 nrm = normal;
  float nlen = length(nrm);
  nrm = nlen > 0.001 ? nrm / nlen : vec3(0.0, 1.0, 0.0);
  float buildSpread = 1.0 - smoothstep(0.12, 0.96, phase);
  float scatter = clamp(spread, 0.0, 1.0);
  vec3 p = home;
  p += freed * drift * (nrm * 0.63 + flow * 0.5 + vec3(0.46, 0.26, 0.0));
  p += buildSpread * drift * (nrm * 1.6 + flow * 0.9 + vec3(0.0, -1.1, 0.15));
  p += scatter * drift * (nrm * 0.45 + flow * 0.35);
  vAlpha = max(freed * smoothstep(0.0, 0.06, exposure), buildSpread * (0.35 + 0.65 * seed));
  vAlpha = max(vAlpha, scatter * 0.8 * (0.35 + 0.65 * seed));
  vTone = seed;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = density * pointScale * (1.15 + 1.7 * seed) * (220.0 / max(1.0, -mv.z));
  gl_PointSize = clamp(size, 1.0, 42.0);
}
`;

const GRAIN_FRAG = /* glsl */ `
varying float vAlpha;
varying float vTone;
uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorHot;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float r = length(uv);
  if (r > 0.5 || vAlpha < 0.01) discard;
  vec3 color = mix(colorA, colorB, vTone);
  if (vTone > 0.95) color = colorHot;
  float edge = 1.0 - smoothstep(0.28, 0.5, r);
  gl_FragColor = vec4(color, vAlpha * edge);
}
`;

const WIRE_VERT = /* glsl */ `
attribute vec4 arrive;
attribute vec3 explode;
varying float vAlpha;
uniform float phase;
uniform float spread;
uniform float wireFloor;
void main() {
  float solid = (phase - arrive.w - 0.055) / 0.16;
  float wire = (phase - arrive.w) / 0.17;
  float a = smoothstep(0.0, 0.28, wire) * (1.0 - smoothstep(0.52, 1.22, solid));
  float held = smoothstep(0.9, 1.15, solid) * wireFloor;
  a = max(a, held);
  a = max(a, clamp(spread, 0.0, 1.0) * 0.75);
  vAlpha = a;
  float remaining = 1.0 - clamp(solid, 0.0, 1.0);
  vec3 p = position + arrive.xyz * remaining * remaining + explode * spread;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  gl_Position.z -= 0.0008 * gl_Position.w;
}
`;

const WIRE_FRAG = /* glsl */ `
varying float vAlpha;
uniform vec3 wireColor;
void main() {
  if (vAlpha < 0.02) discard;
  gl_FragColor = vec4(wireColor, vAlpha);
}
`;

const TERRAIN_VERT = /* glsl */ `
attribute float seed;
uniform float clock;
uniform float density;
void main() {
  vec3 p = position;
  p.y += sin(clock * 0.7 + seed * 12.0) * 0.025;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = density * (0.7 + seed * 0.5) * (36.0 / max(1.0, -mv.z));
  gl_PointSize = clamp(size, 1.0, 4.5);
}
`;

const TERRAIN_FRAG = /* glsl */ `
uniform vec3 colorA;
void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  if (r > 0.5) discard;
  float edge = 1.0 - smoothstep(0.2, 0.5, r);
  gl_FragColor = vec4(colorA, 0.28 * edge);
}
`;

function srgb(hex: number) {
  return new THREE.Vector3(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  );
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function reducedMotion() {
  return Boolean(reduceQuery?.matches);
}

function mobileLayout() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function requestFrame() {
  if (typeof window === "undefined") return;
  if (!raf) raf = window.requestAnimationFrame(tick);
}

function ensureRenderer() {
  if (renderer) return renderer;
  const canvas = document.createElement("canvas");
  const mobile = mobileLayout();
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !mobile,
    powerPreference: mobile ? "low-power" : "high-performance",
    stencil: false,
    depth: true,
    premultipliedAlpha: false,
    failIfMajorPerformanceCaveat: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(1);
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    for (const view of views) view.spec.current.onStatus?.("unsupported");
  });
  if (!reduceQuery) {
    reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceQuery.addEventListener("change", () => {
      for (const view of views) view.painted = false;
      requestFrame();
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestFrame();
  });
  return renderer;
}

function makeUniforms(palette: PaletteName): Uniforms {
  const colors = palettes[palette] ?? palettes.micap;
  return {
    phase: { value: 0 },
    spread: { value: 0 },
    brush: { value: new THREE.Vector3() },
    amount: { value: 0 },
    globalAmount: { value: 0 },
    buildMode: { value: 1 },
    wireFloor: { value: 0 },
    clock: { value: 0 },
    density: { value: 1 },
    pointScale: { value: 1 },
    wireColor: { value: srgb(colors.brass) },
    colorA: { value: srgb(colors.brass) },
    colorB: { value: srgb(colors.cream) },
    colorHot: { value: srgb(colors.hot) },
  };
}

function bindAssemble(material: THREE.MeshStandardMaterial, uniforms: Uniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.phase = uniforms.phase;
    shader.uniforms.spread = uniforms.spread;
    shader.uniforms.brush = uniforms.brush;
    shader.uniforms.amount = uniforms.amount;
    shader.uniforms.globalAmount = uniforms.globalAmount;
    shader.uniforms.buildMode = uniforms.buildMode;
    shader.vertexShader = `${ASSEMBLE_VERT}\n${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      vHome = transformed;
      vSolid = (phase - arrive.w - 0.055) / 0.16;
      float micapRemaining = 1.0 - clamp(vSolid, 0.0, 1.0);
      transformed += arrive.xyz * micapRemaining * micapRemaining + explode * spread;`,
    );
    shader.fragmentShader = `
      varying vec3 vHome;
      varying float vSolid;
      uniform vec3 brush;
      uniform float amount;
      uniform float globalAmount;
      uniform float buildMode;
      ${shader.fragmentShader}
    `
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        if (buildMode > 0.5 && vSolid <= 0.0) discard;
        float micapGrain = 0.038 * sin(dot(vHome, vec3(19.0, 11.0, 9.0))) + 0.023 * cos(dot(vHome, vec3(-14.0, 29.0, 23.0)));
        float micapErosion = clamp(0.08 + distance(vHome, brush) * 0.69 + micapGrain, 0.04, 1.5);
        if (micapErosion < max(amount, globalAmount)) discard;`,
      )
      .replace(
        "#include <opaque_fragment>",
        `outgoingLight += vec3(0.45, 0.32, 0.16) * (1.0 - smoothstep(0.25, 0.95, clamp(vSolid, 0.0, 1.0)));
        #include <opaque_fragment>`,
      );
  };
  material.customProgramCacheKey = () => "micap-assemble";
}

function standardMaterial(
  color: number,
  roughness: number,
  metalness: number,
  emissive: number,
  emissiveIntensity: number,
  uniforms: Uniforms,
) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive,
    emissiveIntensity,
  });
  bindAssemble(material, uniforms);
  return material;
}

function random(seed: { value: number }) {
  seed.value = (Math.imul(seed.value, 1664525) + 1013904223) >>> 0;
  return seed.value / 4294967296;
}

function sampleSurface(
  buckets: { pos: number[]; index: number[]; arrive: number[]; explode: number[]; nrm: number[] }[],
  count: number,
) {
  const triangles: {
    area: number;
    a: number;
    b: number;
    c: number;
    bucket: (typeof buckets)[number];
  }[] = [];
  let total = 0;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const triangle = new THREE.Triangle();
  for (const bucket of buckets) {
    for (let i = 0; i < bucket.index.length; i += 3) {
      const ia = bucket.index[i];
      const ib = bucket.index[i + 1];
      const ic = bucket.index[i + 2];
      a.set(bucket.pos[ia * 3], bucket.pos[ia * 3 + 1], bucket.pos[ia * 3 + 2]);
      b.set(bucket.pos[ib * 3], bucket.pos[ib * 3 + 1], bucket.pos[ib * 3 + 2]);
      c.set(bucket.pos[ic * 3], bucket.pos[ic * 3 + 1], bucket.pos[ic * 3 + 2]);
      triangle.set(a, b, c);
      const area = triangle.getArea();
      if (area <= 0) continue;
      total += area;
      triangles.push({ area: total, a: ia, b: ib, c: ic, bucket });
    }
  }
  const homes = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const arrive = new Float32Array(count * 4);
  const explode = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const rng = { value: 722 };
  if (!triangles.length || count === 0) {
    return { homes, normals, arrive, explode, seeds };
  }
  for (let i = 0; i < count; i += 1) {
    const pick = random(rng) * total;
    let lo = 0;
    let hi = triangles.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (triangles[mid].area < pick) lo = mid + 1;
      else hi = mid;
    }
    const tri = triangles[lo];
    const u = Math.sqrt(random(rng));
    const v = random(rng);
    const weights = [1 - u, u * (1 - v), u * v];
    const ids = [tri.a, tri.b, tri.c];
    for (let k = 0; k < 3; k += 1) {
      const id = ids[k];
      const w = weights[k];
      homes[i * 3] += tri.bucket.pos[id * 3] * w;
      homes[i * 3 + 1] += tri.bucket.pos[id * 3 + 1] * w;
      homes[i * 3 + 2] += tri.bucket.pos[id * 3 + 2] * w;
      normals[i * 3] += tri.bucket.nrm[id * 3] * w;
      normals[i * 3 + 1] += tri.bucket.nrm[id * 3 + 1] * w;
      normals[i * 3 + 2] += tri.bucket.nrm[id * 3 + 2] * w;
    }
    const source = tri.a;
    arrive[i * 4] = tri.bucket.arrive[source * 4];
    arrive[i * 4 + 1] = tri.bucket.arrive[source * 4 + 1];
    arrive[i * 4 + 2] = tri.bucket.arrive[source * 4 + 2];
    arrive[i * 4 + 3] = tri.bucket.arrive[source * 4 + 3];
    explode[i * 3] = tri.bucket.explode[source * 3];
    explode[i * 3 + 1] = tri.bucket.explode[source * 3 + 1];
    explode[i * 3 + 2] = tri.bucket.explode[source * 3 + 2];
    seeds[i] = random(rng);
  }
  return { homes, normals, arrive, explode, seeds };
}

function bake(parts: Part[]) {
  const buckets = [0, 1, 2].map(() => ({
    pos: [] as number[],
    nrm: [] as number[],
    arrive: [] as number[],
    explode: [] as number[],
    index: [] as number[],
  }));
  const linePos: number[] = [];
  const lineArrive: number[] = [];
  const lineExplode: number[] = [];
  const position = box.attributes.position;
  const normal = box.attributes.normal;
  const index = box.index;
  const edge = boxEdges.attributes.position;
  if (!index) throw new Error("Box geometry is missing an index");

  for (const part of parts) {
    tmpPos.set(part.x, part.y, part.z);
    tmpQuat.set(part.qx, part.qy, part.qz, part.qw).normalize();
    tmpScale.set(part.w, part.h, part.d);
    tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
    tmpNormal.getNormalMatrix(tmpMatrix);
    const bucket = buckets[part.material];
    const base = bucket.pos.length / 3;
    for (let i = 0; i < position.count; i += 1) {
      tmpPos.fromBufferAttribute(position, i).applyMatrix4(tmpMatrix);
      bucket.pos.push(tmpPos.x, tmpPos.y, tmpPos.z);
      tmpNormalVec.fromBufferAttribute(normal, i).applyNormalMatrix(tmpNormal).normalize();
      bucket.nrm.push(tmpNormalVec.x, tmpNormalVec.y, tmpNormalVec.z);
      bucket.arrive.push(part.ax, part.ay, part.az, part.start);
      bucket.explode.push(part.ex, part.ey, part.ez);
    }
    for (let i = 0; i < index.count; i += 1) {
      bucket.index.push(base + index.getX(i));
    }
    for (let i = 0; i < edge.count; i += 1) {
      tmpPos.fromBufferAttribute(edge, i).applyMatrix4(tmpMatrix);
      linePos.push(tmpPos.x, tmpPos.y, tmpPos.z);
      lineArrive.push(part.ax, part.ay, part.az, part.start);
      lineExplode.push(part.ex, part.ey, part.ez);
    }
  }
  return { buckets, linePos, lineArrive, lineExplode };
}

function geometryFromBucket(bucket: {
  pos: number[];
  nrm: number[];
  arrive: number[];
  explode: number[];
  index: number[];
}) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(bucket.pos, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(bucket.nrm, 3));
  geometry.setAttribute("arrive", new THREE.Float32BufferAttribute(bucket.arrive, 4));
  geometry.setAttribute("explode", new THREE.Float32BufferAttribute(bucket.explode, 3));
  geometry.setIndex(bucket.index);
  return geometry;
}

function releaseMaterials(view: View) {
  for (const material of view.materials) material.dispose();
  view.materials = [];
}

function disposeContents(view: View) {
  for (const mesh of view.solids) {
    mesh.geometry.dispose();
    view.pivot.remove(mesh);
  }
  view.solids = [];
  if (view.lines) {
    view.lines.geometry.dispose();
    view.pivot.remove(view.lines);
    view.lines = null;
  }
  if (view.grains) {
    view.grains.geometry.dispose();
    view.pivot.remove(view.grains);
    view.grains = null;
  }
  if (view.terrain) {
    view.terrain.geometry.dispose();
    view.pivot.remove(view.terrain);
    view.terrain = null;
  }
  view.owned = [];
}

function frameCamera(view: View, parts: Part[]) {
  const box3 = new THREE.Box3();
  for (const part of parts) {
    box3.expandByPoint(
      tmpPos.set(part.x - part.w / 2, part.y - part.h / 2, part.z - part.d / 2),
    );
    box3.expandByPoint(
      tmpPos.set(part.x + part.w / 2, part.y + part.h / 2, part.z + part.d / 2),
    );
  }
  const size = box3.getSize(new THREE.Vector3());
  const center = box3.getCenter(new THREE.Vector3());
  const { camera } = view;
  const cssW = view.canvas.clientWidth || 1;
  const cssH = view.canvas.clientHeight || 1;
  camera.aspect = cssW / Math.max(1, cssH);
  const mode = view.spec.current.mode;
  camera.fov = mode === "icon" ? 32 : 28;
  camera.updateProjectionMatrix();
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const distY = (size.y * 0.62) / Math.max(0.2, Math.tan(vFov / 2));
  const distX = (size.x * 0.62) / Math.max(0.2, Math.tan(hFov / 2));
  const margin = mode === "icon" ? 1.45 : mode === "morph" ? 1.35 : 1.22;
  const dist = Math.max(distX, distY, size.z * 1.4) * margin;
  const azimuth = mode === "icon" ? 0.75 : 0.52;
  const lookX =
    mode === "icon" || mode === "morph" ? center.x : center.x - size.x * 0.16;
  camera.position.set(
    center.x + Math.sin(azimuth) * dist * (mode === "rise" || mode === "build" || mode === "dissolve" || mode === "dismantle" ? 0.72 : 1),
    center.y + size.y * (mode === "icon" ? 0.12 : 0.04),
    center.z + Math.cos(azimuth) * dist,
  );
  camera.lookAt(lookX, center.y + size.y * 0.02, center.z);
  camera.updateMatrixWorld();
  view.previewPoint.set(center.x, center.y + size.y * 0.1, box3.max.z);
}

function buildContents(view: View, shape: ShapeName) {
  disposeContents(view);
  releaseMaterials(view);
  const spec = view.spec.current;
  const parts = formFor(shape);
  const baked = bake(parts);
  const colors = palettes[spec.palette] ?? palettes.micap;
  const materials = [
    standardMaterial(colors.cream, 0.58, 0.06, 0x000000, 0, view.uniforms),
    standardMaterial(colors.brass, 0.34, 0.78, colors.brassDeep, 0.16, view.uniforms),
    standardMaterial(colors.glass, 0.18, 0.42, colors.brass, 0.42, view.uniforms),
  ];
  view.materials.push(...materials);
  baked.buckets.forEach((bucket, index) => {
    if (!bucket.pos.length) return;
    const geometry = geometryFromBucket(bucket);
    view.owned.push(geometry);
    const mesh = new THREE.Mesh(geometry, materials[index]);
    mesh.frustumCulled = false;
    view.pivot.add(mesh);
    view.solids.push(mesh);
  });

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(baked.linePos, 3));
  lineGeometry.setAttribute("arrive", new THREE.Float32BufferAttribute(baked.lineArrive, 4));
  lineGeometry.setAttribute("explode", new THREE.Float32BufferAttribute(baked.lineExplode, 3));
  view.owned.push(lineGeometry);
  const lineMaterial = new THREE.ShaderMaterial({
    uniforms: view.uniforms,
    vertexShader: WIRE_VERT,
    fragmentShader: WIRE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  view.materials.push(lineMaterial);
  view.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  view.lines.frustumCulled = false;
  view.lines.renderOrder = 2;
  view.pivot.add(view.lines);

  const mobile = mobileLayout();
  const cap = spec.mode === "icon" ? 480 : mobile ? 1000 : 3600;
  const count = Math.max(0, Math.min(cap, spec.particleCount));
  if (count > 0) {
    const samples = sampleSurface(baked.buckets, count);
    const grainGeometry = new THREE.BufferGeometry();
    grainGeometry.setAttribute("position", new THREE.BufferAttribute(samples.homes, 3));
    grainGeometry.setAttribute("normal", new THREE.BufferAttribute(samples.normals, 3));
    grainGeometry.setAttribute("arrive", new THREE.BufferAttribute(samples.arrive, 4));
    grainGeometry.setAttribute("explode", new THREE.BufferAttribute(samples.explode, 3));
    grainGeometry.setAttribute("seed", new THREE.BufferAttribute(samples.seeds, 1));
    view.owned.push(grainGeometry);
    const grainMaterial = new THREE.ShaderMaterial({
      uniforms: view.uniforms,
      vertexShader: GRAIN_VERT,
      fragmentShader: GRAIN_FRAG,
      transparent: true,
      depthWrite: false,
    });
    view.materials.push(grainMaterial);
    view.grains = new THREE.Points(grainGeometry, grainMaterial);
    view.grains.frustumCulled = false;
    view.grains.renderOrder = 3;
    view.pivot.add(view.grains);
  }

  if (spec.mode !== "icon") {
    const grid = mobile ? 12 : 22;
    const extent = 1.15;
    let minY = Infinity;
    let maxX = 0;
    let maxZ = 0;
    for (const part of parts) {
      minY = Math.min(minY, part.y - part.h / 2);
      maxX = Math.max(maxX, Math.abs(part.x) + part.w / 2);
      maxZ = Math.max(maxZ, Math.abs(part.z) + part.d / 2);
    }
    const positions: number[] = [];
    const seeds: number[] = [];
    const rng = { value: 91 };
    for (let i = 0; i < grid; i += 1) {
      for (let j = 0; j < grid; j += 1) {
        if (random(rng) < 0.28) continue;
        const x = ((i / (grid - 1)) - 0.5) * maxX * 2 * extent;
        const z = ((j / (grid - 1)) - 0.5) * maxZ * 2 * extent;
        positions.push(x, minY + (random(rng) - 0.5) * 0.04, z);
        seeds.push(random(rng));
      }
    }
    const terrainGeometry = new THREE.BufferGeometry();
    terrainGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    terrainGeometry.setAttribute("seed", new THREE.Float32BufferAttribute(seeds, 1));
    view.owned.push(terrainGeometry);
    const terrainMaterial = new THREE.ShaderMaterial({
      uniforms: view.uniforms,
      vertexShader: TERRAIN_VERT,
      fragmentShader: TERRAIN_FRAG,
      transparent: true,
      depthWrite: false,
    });
    view.materials.push(terrainMaterial);
    view.terrain = new THREE.Points(terrainGeometry, terrainMaterial);
    view.terrain.frustumCulled = false;
    view.pivot.add(view.terrain);
  }

  frameCamera(view, parts);
  view.shown = `${shape}:${spec.particleCount}`;
}

function createView(canvas: HTMLCanvasElement, spec: SpecRef): View {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.05, 200);
  const pivot = new THREE.Group();
  scene.add(pivot);
  scene.add(new THREE.HemisphereLight(0xf7f4ed, 0x3a3228, 0.92));
  const key = new THREE.DirectionalLight(0xfff6ea, 1.45);
  key.position.set(-6, 9, 7);
  const rim = new THREE.DirectionalLight(0xc4a472, 0.85);
  rim.position.set(7, 3.2, -5);
  const fill = new THREE.DirectionalLight(0x8ea39a, 0.32);
  fill.position.set(0, 1.2, 8);
  scene.add(key, rim, fill);
  const uniforms = makeUniforms(spec.current.palette);
  const view: View = {
    spec,
    canvas,
    ctx,
    scene,
    camera,
    pivot,
    uniforms,
    solids: [],
    lines: null,
    grains: null,
    terrain: null,
    owned: [],
    materials: [],
    previewPoint: new THREE.Vector3(),
    shown: "",
    pending: null,
    transition: null,
    phase: 0,
    spread: 0,
    autoT: 0,
    autoDone: false,
    brush: new THREE.Vector3(),
    brushTarget: new THREE.Vector3(),
    amount: 0,
    globalAmount: 0,
    globalTarget: 0,
    yaw: spec.current.mode === "icon" ? 0.55 : 0.35,
    spin: 0,
    painted: false,
    settled: false,
    clock: 0,
    raycaster: new THREE.Raycaster(),
    pointerNdc: new THREE.Vector2(),
    failed: false,
  };
  buildContents(view, spec.current.shape);
  return view;
}

function disposeView(view: View) {
  disposeContents(view);
  releaseMaterials(view);
}

function updateMotion(view: View, dt: number) {
  const spec = view.spec.current;
  const reduced = reducedMotion();
  if (reduced) {
    view.phase = 1;
    view.spread = 0;
    view.amount = 0;
    view.globalAmount = 0;
    view.globalTarget = 0;
    view.yaw = spec.mode === "icon" ? 0.55 : 0.35;
    view.pivot.rotation.y = view.yaw;
    view.settled = true;
    return;
  }

  if (spec.shape !== view.shown.split(":")[0] && view.pending !== spec.shape) {
    view.pending = spec.shape;
    if (!view.transition) view.transition = "out";
  }

  if (view.transition === "out") {
    view.globalTarget = 1.48;
    if (view.globalAmount > 1.35 && view.pending) {
      buildContents(view, view.pending);
      view.pending = null;
      view.transition = "in";
      view.painted = false;
    }
  } else if (view.transition === "in") {
    view.globalTarget = 0;
    if (view.globalAmount < 0.03) {
      view.globalAmount = 0;
      view.transition = null;
      view.globalTarget = 0;
    }
  }

  const mode = spec.mode;
  if (mode === "rise" || mode === "build") {
    if (mode === "build" && spec.scrollEngaged) view.phase = spec.scroll;
    else view.phase = Math.min(1, view.phase + dt / 2.7);
    view.spread = 0;
    if (!view.transition) view.globalTarget = 0;
  } else if (mode === "dismantle") {
    view.phase = 1;
    if (spec.scrollEngaged) view.spread = Math.sin(spec.scroll * Math.PI);
    else if (!view.autoDone) {
      view.autoT = Math.min(1, view.autoT + dt / 5.2);
      view.spread = Math.sin(view.autoT * Math.PI);
      if (view.autoT >= 1) view.autoDone = true;
    } else view.spread = Math.sin(spec.scroll * Math.PI);
    if (!view.transition) view.globalTarget = 0;
  } else if (mode === "dissolve") {
    view.phase = 1;
    view.spread = 0;
    if (!view.transition) {
      const pulse = 0.5 - 0.5 * Math.cos(view.clock * 0.7);
      view.globalTarget = pulse * 1.38;
    }
  } else if (mode === "morph") {
    view.phase = 1;
    view.spread = 0;
    if (!view.transition) view.globalTarget = 0;
  } else {
    view.phase = 1;
    view.spread = 0;
    if (!view.transition) view.globalTarget = spec.hover.active ? 0.62 : 0;
  }

  view.globalAmount = damp(
    view.globalAmount,
    view.globalTarget,
    view.transition ? 4.5 : 1.8,
    dt,
  );

  let amountTarget = 0;
  const brushModes = mode === "rise" || mode === "dissolve" || mode === "morph";
  if (brushModes && (spec.preview || spec.pointer.active)) {
    if (spec.preview && !spec.pointer.active) {
      view.brushTarget.copy(view.previewPoint);
      amountTarget = 1;
    } else if (spec.pointer.active) {
      const rect = view.canvas.getBoundingClientRect();
      const x = ((spec.pointer.x - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const y = -((spec.pointer.y - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      view.pointerNdc.set(x, y);
      view.raycaster.setFromCamera(view.pointerNdc, view.camera);
      const hit = view.raycaster.intersectObjects(view.solids, false)[0];
      if (hit) {
        const local = hit.object.worldToLocal(hit.point.clone());
        view.brushTarget.copy(local);
        amountTarget = 1;
        if (view.amount < 0.001) view.brush.copy(local);
      }
    }
  }
  if (amountTarget > 0) {
    view.brush.lerp(view.brushTarget, 1 - Math.exp(-16 * dt));
  }
  view.amount = damp(view.amount, amountTarget, amountTarget > 0 ? 8 : 3.5, dt);
  if (amountTarget === 0 && view.amount < 0.001) view.amount = 0;

  if (mode === "icon") {
    if (spec.hover.active) view.spin += dt * 0.58;
    const hoverYaw = spec.hover.active ? spec.hover.x * 0.7 : 0;
    const target = 0.55 + hoverYaw + (spec.hover.active ? view.spin : 0);
    const delta = Math.atan2(Math.sin(target - view.yaw), Math.cos(target - view.yaw));
    view.yaw += delta * (1 - Math.exp(-10 * dt));
    view.pivot.rotation.y = view.yaw;
    view.settled =
      !spec.hover.active &&
      Math.abs(delta) < 0.004 &&
      view.globalAmount < 0.02 &&
      view.transition === null;
  } else {
    view.pivot.rotation.y = 0.35 + Math.sin(view.clock * 0.18) * 0.2;
    view.settled = false;
  }
}

function wireFloorFor(view: View) {
  const mode = view.spec.current.mode;
  if (reducedMotion()) return 0;
  if (mode === "dismantle") return 0.18 + view.spread * 0.15;
  if (mode === "icon") return 0.55;
  if (mode === "dissolve" || mode === "morph") return 0.34;
  return view.phase > 0.94 ? 0.4 : 0;
}

function drawView(view: View, dt: number) {
  const cssW = view.canvas.clientWidth;
  const cssH = view.canvas.clientHeight;
  if (cssW < 2 || cssH < 2 || !renderer) return false;
  const mobile = mobileLayout();
  let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
  let width = Math.floor(cssW * dpr);
  let height = Math.floor(cssH * dpr);
  const budget = mobile ? 700_000 : 1_400_000;
  while (width * height > budget && dpr > 0.55) {
    dpr *= 0.85;
    width = Math.max(1, Math.floor(cssW * dpr));
    height = Math.max(1, Math.floor(cssH * dpr));
  }
  view.clock += dt;
  updateMotion(view, dt);
  const build =
    view.spec.current.mode === "rise" || view.spec.current.mode === "build";
  view.uniforms.phase.value = view.phase;
  view.uniforms.spread.value = view.spread;
  view.uniforms.amount.value = view.amount;
  view.uniforms.globalAmount.value = view.globalAmount;
  view.uniforms.buildMode.value = reducedMotion() ? 0 : build ? 1 : 0;
  view.uniforms.wireFloor.value = wireFloorFor(view);
  view.uniforms.clock.value = view.clock;
  view.uniforms.density.value = dpr;
  view.uniforms.pointScale.value = view.spec.current.mode === "icon" ? 1.7 : 1;
  view.uniforms.brush.value.copy(view.brush);
  view.camera.aspect = cssW / cssH;
  view.camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.render(view.scene, view.camera);
  if (view.canvas.width !== width || view.canvas.height !== height) {
    view.canvas.width = width;
    view.canvas.height = height;
  }
  view.ctx.setTransform(1, 0, 0, 1, 0, 0);
  view.ctx.clearRect(0, 0, width, height);
  view.ctx.drawImage(renderer.domElement, 0, 0);
  if (!view.painted) {
    view.painted = true;
    view.spec.current.onStatus?.("ready");
  }
  return true;
}

function wantsFrame(view: View) {
  if (!view.spec.current.visible || view.failed) return false;
  if (reducedMotion()) return !view.painted;
  if (view.spec.current.tier === "icon") {
    return !view.painted || !view.settled || view.transition !== null;
  }
  return true;
}

let lastNow = 0;

function tick(now: number) {
  raf = 0;
  if (document.hidden) return;
  const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016);
  lastNow = now;
  let again = false;
  try {
    if (!renderer) ensureRenderer();
    const primaries = [...views].filter(
      (view) => view.spec.current.tier === "primary" && wantsFrame(view),
    );
    primaries.sort((a, b) => b.spec.current.priority - a.spec.current.priority);
    const primary = primaries[0];
    if (primary && drawView(primary, dt)) again = wantsFrame(primary);
    const icons = [...views].filter(
      (view) => view.spec.current.tier === "icon" && wantsFrame(view),
    );
    const hovered = icons.find((view) => view.spec.current.hover.active);
    const unpainted = icons.find((view) => !view.painted);
    const icon = unpainted ?? hovered ?? icons[0];
    if (icon && drawView(icon, dt)) {
      const more = icons.some((item) => wantsFrame(item));
      again = again || more;
    }
  } catch (error) {
    console.error(error);
    for (const view of views) {
      view.failed = true;
      view.spec.current.onStatus?.("unsupported");
    }
    again = false;
  }
  if (again) requestFrame();
}

export function mountView(canvas: HTMLCanvasElement, spec: SpecRef) {
  let view: View;
  try {
    ensureRenderer();
    view = createView(canvas, spec);
  } catch (error) {
    console.error(error);
    spec.current.onStatus?.("unsupported");
    return () => {};
  }
  views.add(view);
  const resize = new ResizeObserver(() => {
    view.painted = false;
    requestFrame();
  });
  resize.observe(canvas);
  requestFrame();
  return () => {
    resize.disconnect();
    views.delete(view);
    disposeView(view);
  };
}
