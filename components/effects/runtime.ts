import type { PaletteName, ShapeName } from "@/lib/effects";
import { contactTexture, subjectFor } from "@/components/effects/subjects";
import type { MaterialName, PieceDef } from "@/components/effects/subjects";
import * as THREE from "three";

/**
 * One WebGL context for every study on the page. Each view blits into its
 * own canvas at devicePixelRatio (capped at 2). Motion eases, and the loop
 * stops when a view is offscreen, the tab is hidden, or motion is reduced.
 */

export type EffectSpec = {
  shape: ShapeName;
  palette: PaletteName;
  particleCount: number;
  mode: import("@/lib/effects").EffectMode;
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

type LivePiece = {
  object: THREE.Object3D;
  home: THREE.Vector3;
  travel: THREE.Vector3;
  start: number;
  fade: boolean;
};

type View = {
  spec: SpecRef;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  content: THREE.Group;
  pieces: LivePiece[];
  particles: THREE.Points | null;
  particleMat: THREE.ShaderMaterial | null;
  extraLights: THREE.Light[];
  furniture: THREE.Group | null;
  furnGen: number;
  holdReady: boolean;
  shown: string;
  pending: ShapeName | null;
  transition: "out" | "in" | null;
  presence: number;
  presenceTarget: number;
  phase: number;
  hoverYaw: number;
  clock: number;
  painted: boolean;
  failed: boolean;
  blueprint: boolean;
  pace: number;
  drift: number;
  cameraHome: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  narrowTarget: THREE.Vector3 | null;
  fov: number;
  settled: boolean;
};

const views = new Set<View>();
let renderer: THREE.WebGLRenderer | null = null;
let envMap: THREE.Texture | null = null;
let raf = 0;
let reduceQuery: MediaQueryList | null = null;
const up = new THREE.Vector3(0, 1, 0);
const offset = new THREE.Vector3();

const PARTICLE_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uDpr;
uniform float uPreview;
varying float vSeed;
void main() {
  vSeed = aSeed;
  vec3 p = position;
  float t = uTime * 0.18;
  p.y += sin(t + aSeed * 6.28318) * (0.03 + uPreview * 0.02);
  p.x += cos(t * 0.8 + aSeed * 4.1) * 0.02;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = (2.4 + uPreview) * uDpr * (150.0 / max(1.0, -mv.z));
  gl_PointSize = clamp(size, 1.0, 7.0);
}
`;

const PARTICLE_FRAG = /* glsl */ `
varying float vSeed;
uniform float uAlpha;
void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float r = length(uv);
  if (r > 0.5) discard;
  float edge = 1.0 - smoothstep(0.15, 0.5, r);
  vec3 brass = vec3(0.78, 0.58, 0.32);
  vec3 cream = vec3(0.96, 0.93, 0.86);
  vec3 color = mix(brass, cream, vSeed);
  gl_FragColor = vec4(color, edge * uAlpha);
}
`;

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function reducedMotion() {
  return Boolean(reduceQuery?.matches);
}

function mobileLayout() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function requestFrame() {
  if (typeof window === "undefined") return;
  if (!raf) raf = window.requestAnimationFrame(tick);
}

function makeEnvironment(gl: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry(12, 32, 18);
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i) / 12;
    const horizon = Math.exp(-((y - 0.05) ** 2) * 18);
    colors[i * 3] = 0.07 + horizon * 0.55;
    colors[i * 3 + 1] = 0.04 + horizon * 0.24;
    colors[i * 3 + 2] = 0.03 + horizon * 0.08;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  scene.add(
    new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide }),
    ),
  );
  const pmrem = new THREE.PMREMGenerator(gl);
  const map = pmrem.fromScene(scene, 0.035).texture;
  pmrem.dispose();
  geometry.dispose();
  return map;
}

function ensureRenderer() {
  if (renderer) return renderer;
  const canvas = document.createElement("canvas");
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: mobileLayout() ? "low-power" : "high-performance",
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
  try {
    envMap = makeEnvironment(renderer);
  } catch (error) {
    console.error(error);
    envMap = null;
  }
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

function createMaterial(name: MaterialName, piece: PieceDef) {
  const opacity = piece.opacity;
  if (name === "line") {
    const line = new THREE.LineBasicMaterial({
      color: 0xf3e0c4,
      transparent: true,
      opacity: opacity ?? 0.8,
      depthWrite: false,
    });
    return line;
  }
  if (name === "sky") {
    return new THREE.MeshBasicMaterial({
      vertexColors: true,
      depthWrite: false,
    });
  }
  if (name === "shadow") {
    const material = new THREE.MeshBasicMaterial({
      map: contactTexture(),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    return material;
  }
  if (piece.transmission) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xe8d8c6,
      metalness: 0,
      roughness: 0.045,
      transmission: 0.92,
      thickness: 0.06,
      ior: 1.45,
      transparent: true,
      opacity: 1,
      envMapIntensity: 1.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }
  const physical = new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.4,
    envMapIntensity: 1.05,
  });
  if (name === "glass") {
    physical.color.set(0xcbb79a);
    physical.metalness = 0.7;
    physical.roughness = 0.08;
    physical.transparent = true;
    physical.opacity = opacity ?? 0.42;
    physical.depthWrite = piece.depthWrite !== false;
  } else if (name === "brass") {
    physical.color.set(0xc4a472);
    physical.metalness = 0.88;
    physical.roughness = 0.24;
    physical.emissive.set(0x3a2912);
    physical.emissiveIntensity = 0.18;
  } else if (name === "steel") {
    physical.color.set(0x8d8680);
    physical.metalness = 0.92;
    physical.roughness = 0.28;
  } else if (name === "stone") {
    physical.color.set(0x2c2824);
    physical.metalness = 0.08;
    physical.roughness = 0.62;
  } else if (name === "timber") {
    physical.color.set(0x3a2c24);
    physical.metalness = 0.16;
    physical.roughness = 0.46;
  } else if (name === "cloth") {
    physical.color.set(0x1c1916);
    physical.metalness = 0.02;
    physical.roughness = 0.78;
  } else if (name === "glow") {
    physical.color.set(0xf6e2c0);
    physical.emissive.set(0xe8b15a);
    physical.emissiveIntensity = 1.35;
    physical.roughness = 0.4;
    physical.metalness = 0;
  }
  if (piece.depthWrite === false) physical.depthWrite = false;
  if (piece.doubleSide) physical.side = THREE.DoubleSide;
  physical.userData.baseOpacity = physical.opacity;
  physical.userData.wasTransparent = physical.transparent;
  return physical;
}

function attachPiece(view: View, piece: PieceDef) {
  const material = createMaterial(piece.material, piece);
  material.userData.baseOpacity = "opacity" in material ? material.opacity : 1;
  material.userData.wasTransparent = material.transparent;
  const object =
    piece.material === "line"
      ? new THREE.LineSegments(piece.geometry, material)
      : new THREE.Mesh(piece.geometry, material);
  if (piece.shared) object.userData.shared = true;
  if (piece.position) object.position.set(...piece.position);
  if (piece.rotation) object.rotation.set(...piece.rotation);
  if (piece.renderOrder) object.renderOrder = piece.renderOrder;
  if (piece.material !== "line" && piece.edges) {
    const edges = new THREE.EdgesGeometry(piece.geometry, 28);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0xf6e6cf,
        transparent: true,
        opacity: 0.88,
        depthWrite: false,
      }),
    );
    line.scale.setScalar(1.004);
    line.renderOrder = 4;
    object.add(line);
  }
  if (piece.edgeLines) {
    const line = new THREE.LineSegments(
      piece.edgeLines,
      new THREE.LineBasicMaterial({
        color: 0xe7c89a,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    );
    if (piece.shared) line.userData.shared = true;
    line.renderOrder = 4;
    object.add(line);
  }
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    const material = mesh.material;
    if (!material || Array.isArray(material) || !("opacity" in material)) return;
    if (material.userData.baseOpacity === undefined) {
      material.userData.baseOpacity = material.opacity;
      material.userData.wasTransparent = material.transparent;
    }
  });
  view.content.add(object);
  view.pieces.push({
    object,
    home: object.position.clone(),
    travel: new THREE.Vector3(...(piece.travel ?? [0, 0, 0])),
    start: piece.start ?? 0,
    fade: Boolean(piece.fade),
  });
}

function releaseContent(view: View) {
  for (const piece of view.pieces) {
    view.content.remove(piece.object);
    piece.object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.geometry && !mesh.userData.shared) mesh.geometry.dispose();
      const material = mesh.material;
      if (!material || mesh.userData.shared) return;
      const list = Array.isArray(material) ? material : [material];
      for (const item of list) item.dispose();
    });
  }
  view.pieces = [];
  if (view.particles) {
    view.particles.geometry.dispose();
    view.particleMat?.dispose();
    view.content.remove(view.particles);
    view.particles = null;
    view.particleMat = null;
  }
  for (const light of view.extraLights) view.scene.remove(light);
  view.extraLights = [];
  if (view.furniture) {
    view.content.remove(view.furniture);
    view.furniture = null;
  }
  view.furnGen += 1;
  view.holdReady = false;
}

type BoardroomKit = {
  table: THREE.Object3D;
  chair: THREE.Object3D;
  city: THREE.Texture;
  halfX: number;
  halfZ: number;
};

let boardroomKit: Promise<BoardroomKit> | null = null;

function loadBoardroom() {
  if (boardroomKit) return boardroomKit;
  boardroomKit = (async () => {
    const [{ GLTFLoader }, { DRACOLoader }, { RectAreaLightUniformsLib }] = await Promise.all([
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/loaders/DRACOLoader.js"),
      import("three/examples/jsm/lights/RectAreaLightUniformsLib.js"),
    ]);
    RectAreaLightUniformsLib.init();
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    const [gltf, city] = await Promise.all([
      loader.loadAsync("/models/boardroom.glb"),
      new THREE.TextureLoader().loadAsync("/media/city-window.jpg"),
    ]);
    draco.dispose();
    city.colorSpace = THREE.SRGBColorSpace;
    city.anisotropy = 4;
    const table = gltf.scene.getObjectByName("Table");
    const chair = gltf.scene.getObjectByName("Chair");
    if (!table || !chair) throw new Error("Boardroom model is missing a mesh");
    const tune = (root: THREE.Object3D, darken: number) => {
      root.traverse((node) => {
        const mesh = node as THREE.Mesh;
        if (!mesh.isMesh || Array.isArray(mesh.material)) return;
        mesh.userData.shared = true;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.color && darken !== 1) material.color.multiplyScalar(darken);
        material.envMapIntensity = 1.15;
      });
    };
    tune(table, 0.42);
    tune(chair, 1);
    const raw = new THREE.Box3().setFromObject(table);
    table.scale.setScalar(0.76 / (raw.getSize(new THREE.Vector3()).y || 1));
    table.updateMatrixWorld(true);
    const fitted = new THREE.Box3().setFromObject(table);
    table.position.x -= (fitted.min.x + fitted.max.x) / 2;
    table.position.y -= fitted.min.y;
    table.position.z -= (fitted.min.z + fitted.max.z) / 2;
    table.updateMatrixWorld(true);
    const size = new THREE.Box3().setFromObject(table).getSize(new THREE.Vector3());
    return { table, chair, city, halfX: size.x / 2, halfZ: size.z / 2 };
  })().catch((error) => {
    boardroomKit = null;
    throw error;
  });
  return boardroomKit;
}

function seatChair(kit: BoardroomKit, x: number, z: number, rotY: number) {
  const chair = kit.chair.clone(true);
  chair.position.set(x, 0, z);
  chair.rotation.y = rotY;
  chair.traverse((node) => {
    node.userData.shared = true;
  });
  return chair;
}

async function attachBoardroom(view: View) {
  const gen = view.furnGen;
  try {
    const kit = await loadBoardroom();
    if (gen !== view.furnGen || view.shown !== "boardroom") return;
    const group = new THREE.Group();
    const table = kit.table.clone(true);
    table.traverse((node) => {
      node.userData.shared = true;
    });
    group.add(table);
    const xs = [-kit.halfX * 0.58, 0, kit.halfX * 0.58];
    const near = kit.halfZ + 0.18;
    for (const x of xs) {
      group.add(seatChair(kit, x, near, Math.PI));
      group.add(seatChair(kit, x, -near, 0));
    }
    const city = new THREE.Mesh(
      new THREE.SphereGeometry(14, 48, 32),
      new THREE.MeshBasicMaterial({
        map: kit.city,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    city.renderOrder = -2;
    group.add(city);
    const warm = new THREE.RectAreaLight(0xffd7b0, 16, 1.8, 0.46);
    warm.position.set(0, 1.95, 0.05);
    warm.lookAt(0, 0.7, 0);
    const fill = new THREE.RectAreaLight(0xffedd4, 6, 1.3, 0.7);
    fill.position.set(0.2, 1.65, 1.15);
    fill.lookAt(0, 0.55, -0.2);
    group.add(warm, fill);
    view.content.add(group);
    view.furniture = group;
    view.holdReady = false;
    view.painted = false;
    requestFrame();
  } catch (error) {
    console.error(error);
    if (gen === view.furnGen) {
      view.holdReady = false;
      requestFrame();
    }
  }
}

function buildParticles(view: View, subject: ReturnType<typeof subjectFor>) {
  const mobile = mobileLayout();
  const cap = view.spec.current.tier === "icon" ? 0 : mobile ? 0.4 : 1;
  const count = Math.round(
    Math.min(view.spec.current.particleCount, subject.particles.count) * cap,
  );
  if (count < 8) return;
  const rand = mulberry32(41);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const { center, spread } = subject.particles;
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = center[0] + (rand() - 0.5) * spread[0];
    positions[i * 3 + 1] = center[1] + (rand() - 0.5) * spread[1];
    positions[i * 3 + 2] = center[2] + (rand() - 0.5) * spread[2];
    seeds[i] = rand();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: 1 },
      uAlpha: { value: 0.28 },
      uPreview: { value: 0 },
    },
    vertexShader: PARTICLE_VERT,
    fragmentShader: PARTICLE_FRAG,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 5;
  view.content.add(points);
  view.particles = points;
  view.particleMat = material;
}

function applyCamera(view: View, subject: ReturnType<typeof subjectFor>) {
  const camera = view.spec.current.tier === "icon" ? subject.icon : subject.camera;
  view.cameraHome.set(...camera.position);
  view.cameraTarget.set(...camera.target);
  view.narrowTarget = camera.narrowTarget ? new THREE.Vector3(...camera.narrowTarget) : null;
  view.fov = camera.fov;
  view.drift = view.spec.current.tier === "icon" ? 0 : camera.drift;
  view.blueprint = Boolean(subject.blueprint);
  view.pace = subject.pace ?? 0.9;
  view.camera.fov = camera.fov;
}

function buildContents(view: View, shape: ShapeName) {
  releaseContent(view);
  const subject = subjectFor(shape);
  for (const piece of subject.pieces) attachPiece(view, piece);
  for (const light of subject.lights) {
    const point = new THREE.PointLight(light.color, light.intensity, light.distance, 2);
    point.position.set(...light.position);
    view.scene.add(point);
    view.extraLights.push(point);
  }
  buildParticles(view, subject);
  applyCamera(view, subject);
  view.shown = shape;
  if (shape === "boardroom") {
    view.holdReady = true;
    void attachBoardroom(view);
  }
}

function createView(canvas: HTMLCanvasElement, spec: SpecRef): View {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  const scene = new THREE.Scene();
  scene.environment = envMap;
  scene.environmentIntensity = 0.9;
  const camera = new THREE.PerspectiveCamera(28, 1, 0.08, 80);
  const content = new THREE.Group();
  scene.add(content);
  scene.add(new THREE.HemisphereLight(0xf6e7d2, 0x24160e, 0.72));
  const key = new THREE.DirectionalLight(0xfff4e6, 2.5);
  key.position.set(-4.5, 7.5, 6);
  const rim = new THREE.DirectionalLight(0xe0b07a, 1.35);
  rim.position.set(6, 3.2, -4);
  const fill = new THREE.DirectionalLight(0xc9b8a2, 0.45);
  fill.position.set(0, 2, 8);
  scene.add(key, rim, fill);
  const view: View = {
    spec,
    canvas,
    ctx,
    scene,
    camera,
    content,
    pieces: [],
    particles: null,
    particleMat: null,
    extraLights: [],
    furniture: null,
    furnGen: 0,
    holdReady: false,
    shown: "",
    pending: null,
    transition: null,
    presence: 1,
    presenceTarget: 1,
    phase: 0,
    hoverYaw: 0,
    clock: 0,
    painted: false,
    failed: false,
    blueprint: false,
    pace: 0.9,
    drift: 0.04,
    cameraHome: new THREE.Vector3(),
    cameraTarget: new THREE.Vector3(),
    narrowTarget: null,
    fov: 28,
    settled: false,
  };
  buildContents(view, spec.current.shape);
  return view;
}

function pieceAppear(piece: LivePiece, phase: number) {
  return smoothstep((phase - piece.start) / 0.22);
}

function applyMotion(view: View, dt: number) {
  const spec = view.spec.current;
  const reduced = reducedMotion();
  if (spec.shape !== view.shown && view.pending !== spec.shape && !view.transition) {
    view.pending = spec.shape;
    view.transition = "out";
    view.presenceTarget = 0;
  }
  view.presence = damp(view.presence, view.presenceTarget, 5.5, dt);
  if (view.transition === "out" && view.presence < 0.04 && view.pending) {
    const next = view.pending;
    view.pending = null;
    buildContents(view, next);
    view.phase = spec.mode === "morph" ? 1 : view.phase;
    view.transition = "in";
    view.presenceTarget = 1;
    view.painted = false;
  } else if (view.transition === "in" && view.presence > 0.97) {
    view.presence = 1;
    view.transition = null;
  }

  if (reduced) {
    view.phase = 1;
  } else if (spec.mode === "build" && spec.scrollEngaged) {
    view.phase = damp(view.phase, spec.scroll, 4.5, dt);
  } else {
    view.phase = damp(view.phase, 1, view.pace, dt);
  }
  if (view.phase > 0.999) view.phase = 1;

  const hoverTarget = spec.hover.active ? spec.hover.x * 0.4 : 0;
  view.hoverYaw = damp(view.hoverYaw, hoverTarget, 7, dt);

  for (const piece of view.pieces) {
    const appear = reduced ? 1 : pieceAppear(piece, view.phase);
    piece.object.position.copy(piece.home).addScaledVector(piece.travel, 1 - appear);
    piece.object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      const material = mesh.material;
      if (!material || Array.isArray(material) || !("opacity" in material)) return;
      const base = Number(material.userData.baseOpacity ?? material.opacity ?? 1);
      let alpha = base * view.presence;
      if (piece.fade && view.blueprint) {
        alpha *=
          material instanceof THREE.LineBasicMaterial
            ? 0.95 - 0.5 * smoothstep(view.phase)
            : smoothstep(view.phase);
      } else if (material.transparent && !(material instanceof THREE.LineBasicMaterial)) {
        alpha *= 0.2 + 0.8 * appear;
      }
      if (material instanceof THREE.LineBasicMaterial && !piece.fade) {
        alpha = base * view.presence * (0.25 + 0.75 * appear);
      }
      const wasTransparent = Boolean(material.userData.wasTransparent);
      material.transparent = wasTransparent || alpha < 0.98 || view.presence < 0.98;
      material.opacity = alpha;
      if (piece.fade && "depthWrite" in material && !(material instanceof THREE.LineBasicMaterial)) {
        material.depthWrite = alpha > 0.72;
      }
    });
  }

  if (view.particleMat) {
    const preview = spec.preview ? 1 : 0;
    view.particleMat.uniforms.uTime.value = reduced ? 0 : view.clock;
    view.particleMat.uniforms.uPreview.value = preview;
    view.particleMat.uniforms.uAlpha.value = (reduced ? 0.22 : 0.32 + preview * 0.28) * view.presence;
  }
}

function frameCamera(view: View, cssW: number, cssH: number) {
  const aspect = cssW / Math.max(1, cssH);
  const target =
    aspect < 0.95 && view.narrowTarget ? view.narrowTarget : view.cameraTarget;
  const reduced = reducedMotion();
  const yaw = reduced ? 0 : Math.sin(view.clock * 0.2) * view.drift + view.hoverYaw;
  const bob = reduced ? 0 : Math.sin(view.clock * 0.13) * view.drift * 0.35;
  offset.copy(view.cameraHome).sub(view.cameraTarget);
  offset.applyAxisAngle(up, yaw);
  view.camera.position.copy(target).add(offset);
  view.camera.position.y += bob;
  view.camera.fov = view.fov;
  view.camera.aspect = aspect;
  view.camera.up.copy(up);
  view.camera.lookAt(target);
  view.camera.updateProjectionMatrix();
}

function pixelSize(canvas: HTMLCanvasElement) {
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return {
    cssW,
    cssH,
    dpr,
    width: Math.max(1, Math.round(cssW * dpr)),
    height: Math.max(1, Math.round(cssH * dpr)),
  };
}

function drawView(view: View, dt: number) {
  if (!renderer) return false;
  const { cssW, cssH, dpr, width, height } = pixelSize(view.canvas);
  if (cssW < 2 || cssH < 2) return false;
  view.clock += reducedMotion() ? 0 : dt;
  applyMotion(view, dt);
  frameCamera(view, cssW, cssH);
  if (view.particleMat) view.particleMat.uniforms.uDpr.value = dpr;
  const buffer = renderer.domElement;
  if (buffer.width !== width || buffer.height !== height) {
    renderer.setSize(width, height, false);
  }
  renderer.render(view.scene, view.camera);
  if (view.canvas.width !== width || view.canvas.height !== height) {
    view.canvas.width = width;
    view.canvas.height = height;
  }
  view.ctx.setTransform(1, 0, 0, 1, 0, 0);
  view.ctx.clearRect(0, 0, width, height);
  view.ctx.drawImage(buffer, 0, 0, width, height);
  if (!view.painted && !view.holdReady) {
    view.painted = true;
    view.spec.current.onStatus?.("ready");
  }
  const spec = view.spec.current;
  view.settled =
    reducedMotion() ||
    (view.phase > 0.985 &&
      view.transition === null &&
      Math.abs(view.hoverYaw) < 0.01 &&
      !spec.hover.active &&
      spec.tier === "icon");
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
  if (document.hidden) {
    lastNow = 0;
    return;
  }
  const dt = Math.min(0.033, lastNow ? (now - lastNow) / 1000 : 0.016);
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
    const icon =
      icons.find((view) => !view.painted) ??
      icons.find((view) => view.spec.current.hover.active) ??
      icons[0];
    if (icon && drawView(icon, dt)) {
      again = again || icons.some((item) => wantsFrame(item));
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
    releaseContent(view);
  };
}
