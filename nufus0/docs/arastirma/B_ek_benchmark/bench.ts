import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { LUTPass } from "three/examples/jsm/postprocessing/LUTPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { HorizontalTiltShiftShader } from "three/examples/jsm/shaders/HorizontalTiltShiftShader.js";
import { VerticalTiltShiftShader } from "three/examples/jsm/shaders/VerticalTiltShiftShader.js";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const W = 1080, H = 1920;
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

type Opt = { shadows?: 0 | 1024 | 2048; merged?: boolean; instanced?: boolean };
function buildScene(o: Opt = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#cfe3f0");
  const r = rng(7);
  const mats = ["#e8c9a0", "#d98e73", "#b7c4a5", "#e9dfc8", "#c47c5a", "#8fb0c2"].map((c) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.9 }));
  const roofM = new THREE.MeshStandardMaterial({ color: "#b5482f", flatShading: true, roughness: 0.8 });
  const leafM = new THREE.MeshStandardMaterial({ color: "#6a9a4a", flatShading: true });
  const trunkM = new THREE.MeshStandardMaterial({ color: "#6b4a30", flatShading: true });
  const ground = new THREE.Mesh(new THREE.BoxGeometry(44, 0.5, 44), new THREE.MeshStandardMaterial({ color: "#a9c27d", flatShading: true }));
  ground.position.y = -0.25; ground.receiveShadow = true; scene.add(ground);
  const geoms: Record<string, THREE.BufferGeometry[]> = {};
  const items: { g: THREE.BufferGeometry; m: THREE.Material; mat: THREE.Matrix4 }[] = [];
  const tmp = new THREE.Object3D();
  const add = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, ry = 0) => { tmp.position.set(x, y, z); tmp.rotation.set(0, ry, 0); tmp.updateMatrix(); items.push({ g, m, mat: tmp.matrix.clone() }); };
  const box = new THREE.BoxGeometry(1, 1, 1);
  for (let gx = -9; gx < 9; gx++) for (let gz = -9; gz < 9; gz++) {
    const x = gx * 2.4 + r() * 0.3, z = gz * 2.4 + r() * 0.3;
    if (r() < 0.55) {
      const h = 1 + r() * 2.5; const w = 1.2 + r() * 0.5;
      const g = box.clone(); g.scale(w, h, w);
      add(g, mats[(r() * mats.length) | 0], x, h / 2, z, r() * 0.4);
      const rg = new THREE.ConeGeometry(w * 0.85, 0.9, 4); rg.rotateY(Math.PI / 4);
      add(rg, roofM, x, h + 0.45, z);
    } else if (r() < 0.8) {
      const tg = new THREE.CylinderGeometry(0.12, 0.16, 0.8, 5); add(tg, trunkM, x, 0.4, z);
      const lg = new THREE.IcosahedronGeometry(0.7 + r() * 0.3, 0); add(lg, leafM, x, 1.3, z);
    }
  }
  if (o.merged) {
    const byMat = new Map<THREE.Material, THREE.BufferGeometry[]>();
    for (const it of items) { const g = it.g.clone().applyMatrix4(it.mat); (byMat.get(it.m) ?? byMat.set(it.m, []).get(it.m)!).push(g.index ? g.toNonIndexed() : g); }
    for (const [m, gs] of byMat) { const mesh = new THREE.Mesh(mergeGeometries(gs)!, m); mesh.castShadow = mesh.receiveShadow = !!o.shadows; scene.add(mesh); }
  } else if (o.instanced) {
    // group identical (geometry type unique here) — approximate: one InstancedMesh per material using unit box/cone etc. is not possible w/ distinct scales; use per-material merged as stand-in is "merged". Here: instanced unit boxes only.
    const count = items.length;
    const im = new THREE.InstancedMesh(box, mats[0], count);
    items.forEach((it, i) => im.setMatrixAt(i, it.mat)); scene.add(im);
  } else {
    for (const it of items) { const mesh = new THREE.Mesh(it.g, it.m); mesh.applyMatrix4(it.mat); mesh.castShadow = mesh.receiveShadow = !!o.shadows; scene.add(mesh); }
  }
  scene.add(new THREE.HemisphereLight("#bfdcff", "#8a7a5a", 1.1));
  const sun = new THREE.DirectionalLight("#fff1d6", 2.2); sun.position.set(14, 20, 8);
  if (o.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(o.shadows, o.shadows); const c = sun.shadow.camera; c.left = -26; c.right = 26; c.top = 26; c.bottom = -26; c.near = 1; c.far = 80; sun.shadow.bias = -0.0005; }
  scene.add(sun);
  return { scene, count: items.length };
}
const cam = () => { const s = 15; const c = new THREE.OrthographicCamera(-s * (W / H), s * (W / H), s, -s, -100, 200); const az = Math.PI / 4, el = (38 * Math.PI) / 180, d = 40; c.position.set(Math.cos(el) * Math.sin(az) * d, Math.sin(el) * d, Math.cos(el) * Math.cos(az) * d); c.lookAt(0, 1, 0); c.updateProjectionMatrix(); return c; };

function identityLut(size = 16) { const d = new Uint8Array(size ** 3 * 4); let i = 0; for (let b = 0; b < size; b++) for (let g = 0; g < size; g++) for (let r = 0; r < size; r++) { d[i++] = (r / (size - 1)) * 255; d[i++] = (g / (size - 1)) * 255; d[i++] = (b / (size - 1)) * 255; d[i++] = 255; } const t = new THREE.Data3DTexture(d, size, size, size); t.format = THREE.RGBAFormat; t.type = THREE.UnsignedByteType; t.minFilter = t.magFilter = THREE.LinearFilter; t.unpackAlignment = 1; t.needsUpdate = true; return t; }

const FusedShader = { name: "Fused", uniforms: { tDiffuse: { value: null }, focus: { value: 0.5 }, band: { value: 0.18 }, amount: { value: 0.0035 }, sat: { value: 1.25 }, vig: { value: 0.35 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
  fragmentShader: `uniform sampler2D tDiffuse; uniform float focus,band,amount,sat,vig; varying vec2 vUv;
  void main(){ float d=smoothstep(0.,band,abs(vUv.y-focus)-band*0.5); vec2 o=vec2(0.,amount*d); vec4 c=texture2D(tDiffuse,vUv)*0.2270270270;
  c+=texture2D(tDiffuse,vUv+o*1.3846153846)*0.3162162162+texture2D(tDiffuse,vUv-o*1.3846153846)*0.3162162162;
  c+=texture2D(tDiffuse,vUv+o*3.2307692308)*0.0702702703+texture2D(tDiffuse,vUv-o*3.2307692308)*0.0702702703;
  float l=dot(c.rgb,vec3(.299,.587,.114)); c.rgb=mix(vec3(l),c.rgb,sat); vec2 q=vUv-.5; c.rgb*=1.-vig*dot(q,q)*2.; gl_FragColor=c; }` };

const results: any[] = [];
const SETN = Number(new URLSearchParams(location.search).get('n') || 0);
const log = (s: string) => { (window as any).__LOG = ((window as any).__LOG || "") + s + "\n"; };

async function run(name: string, setup: (r: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => ((i: number) => void), opt: Opt = {}, rOpt: { antialias?: boolean; w?: number; h?: number } = {}) {
  const w = rOpt.w ?? W, h = rOpt.h ?? H;
  const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !!rOpt.antialias, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(1); renderer.setSize(w, h, false);
  if (opt.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; }
  const { scene, count } = buildScene(opt);
  const camera = cam(); (camera as any).left = -15 * (w / h); (camera as any).right = 15 * (w / h); camera.updateProjectionMatrix();
  const t0 = performance.now();
  const frame = setup(renderer, scene, camera);
  const gl = renderer.getContext() as WebGL2RenderingContext; const px = new Uint8Array(4);
  const once = (i: number) => { frame(i); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); };
  once(0); const first = performance.now() - t0;
  const ts: number[] = [];
  for (let i = 1; i <= (SETN || 9); i++) { const a = performance.now(); once(i); ts.push(performance.now() - a); await new Promise((r) => setTimeout(r, 0)); }
  ts.sort((a, b) => a - b);
  const res = { name, ms: Math.round(ts[Math.floor(ts.length/2)]), min: Math.round(ts[0]), first_incl_compile: Math.round(first), calls: renderer.info.render.calls, tris: renderer.info.render.triangles, objs: count, w, h };
  results.push(res); log(JSON.stringify(res));
  renderer.dispose(); renderer.forceContextLoss();
}
const comp = (r: THREE.WebGLRenderer, w = W, h = H) => { const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType }); return new EffectComposer(r, rt); };
const withComposer = (build: (c: EffectComposer, s: THREE.Scene, cam: THREE.Camera, r: THREE.WebGLRenderer) => void, out = true) => (r: THREE.WebGLRenderer, s: THREE.Scene, cam: THREE.Camera) => { const c = comp(r, r.domElement.width, r.domElement.height); c.setPixelRatio(1); c.setSize(r.domElement.width, r.domElement.height); c.addPass(new RenderPass(s, cam)); build(c, s, cam, r); if (out) c.addPass(new OutputPass()); return () => c.render(); };

(async () => {
  const P = (window as any);
  try {
    const info = (() => { const g = document.createElement("canvas").getContext("webgl2")!; const e = g.getExtension("WEBGL_debug_renderer_info"); return { renderer: e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : "?", ver: g.getParameter(g.VERSION), exts: g.getSupportedExtensions()!.length, floatRT: !!g.getExtension("EXT_color_buffer_float"), halfRT: !!g.getExtension("EXT_color_buffer_half_float"), maxTex: g.getParameter(g.MAX_TEXTURE_SIZE) }; })();
    P.__INFO = info; log(JSON.stringify(info));
    const direct = (r: THREE.WebGLRenderer, s: THREE.Scene, c: THREE.Camera) => () => r.render(s, c);
    const SET = new URLSearchParams(location.search).get("set") || "1";
    if (SET === "1") {
    await run("A0 baseline: direkt render, MSAA kapali", direct);
    await run("A1 baseline + MSAA 4x (antialias:true)", direct, {}, { antialias: true });
    await run("A2 baseline yarim cozunurluk 540x960", direct, {}, { w: 540, h: 960 });
    await run("B0 sahne: gercek golge 1024 PCF", direct, { shadows: 1024 });
    await run("B1 sahne: gercek golge 2048 PCF", direct, { shadows: 2048 });
    await run("C0 draw-call: birlestirilmis geometri (malzeme basina)", direct, { merged: true });
    await run("C1 draw-call: tek InstancedMesh (yalniz kutu, ~540 ornek)", direct, { instanced: true });
    await run("D0 composer bos: RenderPass+OutputPass (HalfFloat RT)", withComposer(() => {}));
    await run("D1 + tilt-shift (three H+V TiltShift, 2 gecis)", withComposer((c) => { const h = new ShaderPass(HorizontalTiltShiftShader); const v = new ShaderPass(VerticalTiltShiftShader); h.uniforms.h.value = 2 / H; v.uniforms.v.value = 2 / H; h.uniforms.r.value = v.uniforms.r.value = 0.5; c.addPass(h); c.addPass(v); }));
    await run("D2 + tilt-shift+vinyet+renk: TEK birlesik gecis (kendi shader)", withComposer((c) => { c.addPass(new ShaderPass(FusedShader)); }));
    await run("D3 + vinyet (three VignetteShader)", withComposer((c) => c.addPass(new ShaderPass(VignetteShader))));
    await run("D4 + FXAA", withComposer((c) => { const p = new ShaderPass(FXAAShader); p.uniforms.resolution.value.set(1 / W, 1 / H); c.addPass(p); }));
    await run("D5 + SMAA", withComposer((c) => c.addPass(new SMAAPass())));
    await run("D6 + UnrealBloom (3 mip)", withComposer((c) => c.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.4, 0.5, 0.9))));
    await run("D7 + FilmPass (grain)", withComposer((c) => c.addPass(new FilmPass(0.2, false))));
    await run("D8 + 3D LUT (LUTPass 16^3)", withComposer((c) => { const l = new LUTPass({ lut: identityLut(16), intensity: 1 }); c.addPass(l); }));
    await run("E0 + GTAOPass", withComposer((c, s, cam) => { const p = new GTAOPass(s, cam, W, H); c.addPass(p); }));
    await run("E1 + SAOPass", withComposer((c, s, cam) => { const p = new SAOPass(s, cam); c.addPass(p); }));
    await run("E2 + SSAOPass (kernel 16)", withComposer((c, s, cam) => { const p = new SSAOPass(s, cam, W, H); c.addPass(p); }));
    await run("E3 + OutlinePass (1 nesne grubu, ~100 mesh)", withComposer((c, s, cam) => { const sel: THREE.Object3D[] = []; s.traverse((o) => { if ((o as any).isMesh && sel.length < 100) sel.push(o); }); const p = new OutlinePass(new THREE.Vector2(W, H), s, cam, sel); p.edgeStrength = 3; p.edgeThickness = 1; c.addPass(p); }));
    await run("E4 + BokehPass (DOF)", withComposer((c, s, cam) => { c.addPass(new BokehPass(s, cam, { focus: 40, aperture: 0.0002, maxblur: 0.01 })); }));
    // composite 'onerilen' yigin: birlesik tek gecis + LUT? hayir: yalniz birlesik
    await run("F0 ONERILEN: sahne + birlesik(tilt+vinyet+sat) + Output", withComposer((c) => c.addPass(new ShaderPass(FusedShader))));
    await run("F1 ONERILEN + yarim cozunurluk (540x960) yukseltme oncesi", withComposer((c) => c.addPass(new ShaderPass(FusedShader))), {}, { w: 540, h: 960 });
    await run("F2 F0 + GTAO + bloom", withComposer((c, s, cam) => { c.addPass(new GTAOPass(s, cam, W, H)); c.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.3, 0.4, 0.9)); c.addPass(new ShaderPass(FusedShader)); }));
    // Parcacik
    await run("G0 Points 5000 (PointsMaterial)", (r, s, c) => { const n = 5000; const p = new Float32Array(n * 3); const q = rng(3); for (let i = 0; i < n; i++) { p[i * 3] = (q() - 0.5) * 40; p[i * 3 + 1] = q() * 20; p[i * 3 + 2] = (q() - 0.5) * 40; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); s.add(new THREE.Points(g, new THREE.PointsMaterial({ color: "#ffffff", size: 6, sizeAttenuation: false, transparent: true }))); return () => r.render(s, c); });
    await run("G1 Points 50000 + 6px", (r, s, c) => { const n = 50000; const p = new Float32Array(n * 3); const q = rng(3); for (let i = 0; i < n; i++) { p[i * 3] = (q() - 0.5) * 40; p[i * 3 + 1] = q() * 20; p[i * 3 + 2] = (q() - 0.5) * 40; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); s.add(new THREE.Points(g, new THREE.PointsMaterial({ color: "#ffffff", size: 6, sizeAttenuation: false, transparent: true }))); return () => r.render(s, c); });
    await run("G2 40 buyuk additive glow sprite (200px)", (r, s, c) => { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const x = cv.getContext("2d")!; const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,220,150,1)"); gr.addColorStop(1, "rgba(255,220,150,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(cv); const q = rng(5); for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); sp.position.set((q() - 0.5) * 30, 1 + q() * 3, (q() - 0.5) * 30); sp.scale.set(5, 5, 1); s.add(sp); } return () => r.render(s, c); });
    }
    if (SET === "2") {
      const matScene = (mk: () => THREE.Material) => (r: THREE.WebGLRenderer, s: THREE.Scene, c: THREE.Camera) => { s.traverse((o: any) => { if (o.isMesh && o.material && o.material.isMeshStandardMaterial) { const col = o.material.color; const m: any = mk(); m.color = col.clone(); if ("flatShading" in m) m.flatShading = true; o.material = m; } }); return () => r.render(s, c); };
      await run("H0 tekrar: A0 baseline (varyans)", direct);
      await run("H1 tekrar: A0 baseline (varyans)", direct);
      await run("I0 malzeme: MeshLambertMaterial", matScene(() => new THREE.MeshLambertMaterial()));
      await run("I1 malzeme: MeshToonMaterial (gradientMap yok)", matScene(() => new THREE.MeshToonMaterial()));
      await run("I2 malzeme: MeshBasicMaterial (isiksiz)", matScene(() => new THREE.MeshBasicMaterial()));
      await run("I3 malzeme: MeshPhongMaterial", matScene(() => new THREE.MeshPhongMaterial({ shininess: 5 })));
      await run("J0 composer UnsignedByte RT (HalfFloat degil) + Output", (r, s, cm) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); c.addPass(new OutputPass()); return () => c.render(); });
      await run("J1 composer HalfFloat RT + Output (referans D0)", withComposer(() => {}));
      await run("J2 composer RT MSAA samples=4 + Output", (r, s, cm) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); c.addPass(new OutputPass()); return () => c.render(); });
      await run("J3 yalniz bir tam-ekran ShaderPass (kopya/Vignette), composer UnsignedByte", (r, s, cm) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); const v = new ShaderPass(VignetteShader); v.renderToScreen = true; c.addPass(v); return () => c.render(); });
      await run("K0 sahne dogrudan -> tilt-shift 9tap tek gecis, Vinyet, UnsignedByte RT (EN UCUZ ZINCIR)", (r, s, cm) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); const f = new ShaderPass(FusedShader); f.renderToScreen = true; c.addPass(f); return () => c.render(); });
      await run("K1 sahne MeshLambert + K0 zinciri", (r, s, cm) => { s.traverse((o: any) => { if (o.isMesh && o.material && o.material.isMeshStandardMaterial) { const m = new THREE.MeshLambertMaterial({ color: o.material.color.clone() }); m.flatShading = true; o.material = m; } }); const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); const f = new ShaderPass(FusedShader); f.renderToScreen = true; c.addPass(f); return () => c.render(); });
      await run("K2 sahne 0.75x (810x1440) + K0 zinciri (RT kucuk, CSS ile buyutulur)", (r, s, cm) => { const w = 810, h = 1440; const c = new EffectComposer(r, new THREE.WebGLRenderTarget(w, h, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(w, h); c.addPass(new RenderPass(s, cm)); const f = new ShaderPass(FusedShader); f.renderToScreen = true; c.addPass(f); return () => c.render(); }, {}, { w: 810, h: 1440 });
      await run("K3 gercek golge 1024 + K0 zinciri", (r, s, cm) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); const f = new ShaderPass(FusedShader); f.renderToScreen = true; c.addPass(f); return () => c.render(); }, { shadows: 1024 });
      await run("K4 gercek golge 512 (kucuk, sert) + K0 zinciri", (r, s, cm) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(s, cm)); const f = new ShaderPass(FusedShader); f.renderToScreen = true; c.addPass(f); return () => c.render(); }, { shadows: 512 as any });
      await run("L0 UnrealBloom yarim cozunurlukte (resolution 540x960 verilirse)", withComposer((c) => c.addPass(new UnrealBloomPass(new THREE.Vector2(540, 960), 0.4, 0.5, 0.9))));
      await run("L1 GTAOPass yarim cozunurluk AO (GTAO 540x960 pass, sahne tam)", withComposer((c, s, cm) => { c.addPass(new GTAOPass(s, cm, 540, 960)); }));
    }

    if (SET === "3") {
      const ub = (r: THREE.WebGLRenderer, w = W, h = H) => { const c = new EffectComposer(r, new THREE.WebGLRenderTarget(w, h, { type: THREE.UnsignedByteType })); c.setPixelRatio(1); c.setSize(w, h); return c; };
      const fusedChain = (r: THREE.WebGLRenderer, s: THREE.Scene, cm: THREE.Camera, w = W, h = H) => { const c = ub(r, w, h); c.addPass(new RenderPass(s, cm)); const f = new ShaderPass(FusedShader); f.renderToScreen = true; c.addPass(f); return () => c.render(); };
      await run("Z0 baseline direkt (MeshStandard flat)", direct);
      await run("Z1 K0: sahne + tek birlesik gecis (tilt-shift 9-tap+vinyet+doygunluk)", fusedChain);
      await run("Z2 Z1 + gercek golge 1024", (r, s, cm) => fusedChain(r, s, cm), { shadows: 1024 });
      await run("Z3 pmndrs-tarzi tilt-shift: 1/4 cozunurlukte ayrik H+V blur (2 gecis) + tam cozunurluk kompozit", (r, s, cm) => {
        const c = ub(r); c.addPass(new RenderPass(s, cm));
        const q = 4, bw = Math.floor(W / q), bh = Math.floor(H / q);
        const rtA = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.UnsignedByteType }), rtB = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.UnsignedByteType });
        const blurMat = (dir: THREE.Vector2) => new THREE.ShaderMaterial({ uniforms: { t: { value: null }, d: { value: dir } }, vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}", fragmentShader: "uniform sampler2D t; uniform vec2 d; varying vec2 vUv; void main(){ vec4 c=texture2D(t,vUv)*0.227027; c+=texture2D(t,vUv+d*1.3846)*0.31621+texture2D(t,vUv-d*1.3846)*0.31621; c+=texture2D(t,vUv+d*3.2308)*0.07027+texture2D(t,vUv-d*3.2308)*0.07027; gl_FragColor=c; }" });
        const mH = blurMat(new THREE.Vector2(1 / bw, 0)), mV = blurMat(new THREE.Vector2(0, 1 / bh));
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mH); const oc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); const sc = new THREE.Scene(); sc.add(quad);
        const comp = new ShaderPass({ uniforms: { tDiffuse: { value: null }, tBlur: { value: null }, focus: { value: 0.5 }, band: { value: 0.18 } }, vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader: "uniform sampler2D tDiffuse,tBlur; uniform float focus,band; varying vec2 vUv; void main(){ float m=smoothstep(0.,band,abs(vUv.y-focus)-band*.5); gl_FragColor=mix(texture2D(tDiffuse,vUv),texture2D(tBlur,vUv),m); }" });
        comp.renderToScreen = true;
        const blurPass: any = { enabled: true, needsSwap: false, renderToScreen: false, setSize() {}, dispose() {}, render(rr: THREE.WebGLRenderer, _w: any, rb: THREE.WebGLRenderTarget) { quad.material = mH; mH.uniforms.t.value = rb.texture; rr.setRenderTarget(rtA); rr.render(sc, oc); quad.material = mV; mV.uniforms.t.value = rtA.texture; rr.setRenderTarget(rtB); rr.render(sc, oc); comp.uniforms.tBlur.value = rtB.texture; } };
        c.addPass(blurPass); c.addPass(comp); return () => c.render(); });
      const kuw = (rad: number, sec: number) => ({ uniforms: { tDiffuse: { value: null }, px: { value: new THREE.Vector2(1 / W, 1 / H) } }, vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 px; varying vec2 vUv; void main(){ vec3 cs=vec3(0.); float ws=0.; for(int i=0;i<${sec};i++){ vec3 sum=texture2D(tDiffuse,vUv).rgb; vec3 sq=sum*sum; float n=1.; for(int r=1;r<=${rad};r++){ for(int k=0;k<3;k++){ float a=(float(i)+(float(k)+.5)/3.)*${(6.28318 / sec).toFixed(5)}; vec3 c=texture2D(tDiffuse,vUv+vec2(cos(a),sin(a))*float(r)*px).rgb; sum+=c; sq+=c*c; n+=1.; } } vec3 m=sum/n; vec3 v=abs(sq/n-m*m); float w=1./(1.+pow(255.*sqrt(v.r+v.g+v.b),4.)); cs+=m*w; ws+=w; } gl_FragColor=vec4(cs/ws,1.); }` });
      await run("Z4 Kuwahara-lite (4 sektor, r=3, ~40 ornek/px) tam cozunurluk", (r, s, cm) => { const c = ub(r); c.addPass(new RenderPass(s, cm)); const p = new ShaderPass(kuw(3, 4)); p.renderToScreen = true; c.addPass(p); return () => c.render(); });
      await run("Z5 Kuwahara-lite 4 sektor r=3 yalniz 0.5x cozunurlukte (540x960 sahne)", (r, s, cm) => { const w = 540, h = 960; const c = ub(r, w, h); c.addPass(new RenderPass(s, cm)); const k = kuw(3, 4); k.uniforms.px.value.set(1 / w, 1 / h); const p = new ShaderPass(k); p.renderToScreen = true; c.addPass(p); return () => c.render(); }, {}, { w: 540, h: 960 });
      await run("Z6 normal+derinlik kenar cizgisi: 2. sahne cizimi (MeshNormalMaterial) + Sobel gecisi", (r, s, cm) => {
        const nrt = new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType }); const nm = new THREE.MeshNormalMaterial({ flatShading: true });
        const c = ub(r); c.addPass(new RenderPass(s, cm));
        const edge = new ShaderPass({ uniforms: { tDiffuse: { value: null }, tN: { value: nrt.texture }, px: { value: new THREE.Vector2(1 / W, 1 / H) } }, vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader: "uniform sampler2D tDiffuse,tN; uniform vec2 px; varying vec2 vUv; void main(){ vec3 c=texture2D(tN,vUv).rgb; float e=0.; e+=length(c-texture2D(tN,vUv+vec2(px.x,0.)).rgb); e+=length(c-texture2D(tN,vUv+vec2(0.,px.y)).rgb); e+=length(c-texture2D(tN,vUv-vec2(px.x,0.)).rgb); e+=length(c-texture2D(tN,vUv-vec2(0.,px.y)).rgb); float l=smoothstep(.15,.4,e); gl_FragColor=vec4(mix(texture2D(tDiffuse,vUv).rgb,vec3(.1,.07,.06),l),1.); }" });
        edge.renderToScreen = true; c.addPass(edge);
        return () => { s.overrideMaterial = nm; r.setRenderTarget(nrt); r.render(s, cm); s.overrideMaterial = null; c.render(); }; });
      await run("Z7 inverted-hull kontur: her mesh icin BackSide kopya (draw call 2x)", (r, s, cm) => { const hm = new THREE.MeshBasicMaterial({ color: "#2a1a12", side: THREE.BackSide }); const meshes: THREE.Mesh[] = []; s.traverse((o: any) => { if (o.isMesh && o.geometry.type !== "BoxGeometry" || (o.isMesh && o.scale.x < 20)) meshes.push(o); }); for (const m of meshes) { const h = new THREE.Mesh(m.geometry, hm); h.scale.setScalar(1.06); m.add(h); } return () => r.render(s, cm); });
      await run("Z8 temas golgesi: ~300 yarı-saydam radyal 'blob' dortgen (carpma karisimi)", (r, s, cm) => { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const x = cv.getContext("2d")!; const g = x.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(cv); const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }); const q = rng(11); const pg = new THREE.PlaneGeometry(2.4, 2.4); pg.rotateX(-Math.PI / 2); for (let i = 0; i < 300; i++) { const b = new THREE.Mesh(pg, m); b.position.set((q() - 0.5) * 40, 0.02, (q() - 0.5) * 40); s.add(b); } return () => r.render(s, cm); });
      await run("Z9 dokulu golge: tek buyuk onceden-pisirilmis lightmap/AO dokusu ile zemin (1 plane, 2048 tex)", (r, s, cm) => { const cv = document.createElement("canvas"); cv.width = cv.height = 2048; const x = cv.getContext("2d")!; x.fillStyle = "#fff"; x.fillRect(0, 0, 2048, 2048); const t = new THREE.CanvasTexture(cv); const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, blending: THREE.MultiplyBlending, premultipliedAlpha: true, depthWrite: false }); const p = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), m); p.rotation.x = -Math.PI / 2; p.position.y = 0.03; s.add(p); return () => r.render(s, cm); });
      await run("Z10 sis (THREE.Fog) + ACES ton esleme (renderer icinde)", (r, s, cm) => { s.fog = new THREE.Fog("#cfe3f0", 30, 90); r.toneMapping = THREE.ACESFilmicToneMapping; return () => r.render(s, cm); });
      await run("Z11 yagmur: 1500 LineSegments cizgi (2 vertex) additive", (r, s, cm) => { const n = 1500; const p = new Float32Array(n * 6); const q = rng(21); for (let i = 0; i < n; i++) { const x = (q() - 0.5) * 40, y = q() * 20, z = (q() - 0.5) * 40; p.set([x, y, z, x - 0.05, y - 0.8, z], i * 6); } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); s.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: "#cfe6ff", transparent: true, opacity: 0.6 }))); return () => r.render(s, cm); });
      await run("Z12 parcacik: 2000 instanced kuyruklu quad (kar/yaprak)", (r, s, cm) => { const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.15, 0.15), new THREE.MeshBasicMaterial({ color: "#fff", side: THREE.DoubleSide }), 2000); const q = rng(33); const o = new THREE.Object3D(); for (let i = 0; i < 2000; i++) { o.position.set((q() - 0.5) * 40, q() * 18, (q() - 0.5) * 40); o.rotation.set(q() * 6, q() * 6, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); } s.add(im); return () => r.render(s, cm); });
    }

    if (SET === "4") {
      const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" }); renderer.setPixelRatio(1); renderer.setSize(W, H, false);
      const { scene } = buildScene({}); const camera = cam();
      const mkC = (type: number) => { const c = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type })); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(scene, camera)); return c; };
      const UB = THREE.UnsignedByteType, HF = THREE.HalfFloatType;
      const cfg: { name: string; f: () => void }[] = [];
      const add = (name: string, f: () => void) => cfg.push({ name, f });
      add("direct", () => renderer.render(scene, camera));
      { const c = mkC(UB); const p = new ShaderPass(FusedShader); p.renderToScreen = true; c.addPass(p); add("UB + fused(tilt9+vin+sat)", () => c.render()); }
      { const c = mkC(HF); const p = new ShaderPass(FusedShader); p.renderToScreen = true; c.addPass(p); add("HF + fused(tilt9+vin+sat)", () => c.render()); }
      { const c = mkC(UB); c.addPass(new OutputPass()); add("UB + OutputPass", () => c.render()); }
      { const c = mkC(HF); c.addPass(new OutputPass()); add("HF + OutputPass", () => c.render()); }
      { const c = mkC(UB); const h = new ShaderPass(HorizontalTiltShiftShader); const v = new ShaderPass(VignetteShader); h.uniforms.h.value = 2 / H; const t2 = new ShaderPass(VerticalTiltShiftShader); t2.uniforms.v.value = 2 / H; c.addPass(h); c.addPass(t2); t2.renderToScreen = true; add("UB + three TiltShift H+V (2 pass)", () => c.render()); void v; }
      { const c = mkC(UB); const p = new ShaderPass(VignetteShader); p.renderToScreen = true; c.addPass(p); add("UB + Vignette (1 pass)", () => c.render()); }
      { const c = mkC(UB); const p = new FilmPass(0.2, false); p.renderToScreen = true; c.addPass(p); add("UB + Film grain (1 pass)", () => c.render()); }
      { const c = mkC(UB); const p = new LUTPass({ lut: identityLut(16), intensity: 1 }); p.renderToScreen = true; c.addPass(p); add("UB + 3D LUT (1 pass)", () => c.render()); }
      { const c = mkC(UB); const p = new ShaderPass(FXAAShader); p.uniforms.resolution.value.set(1 / W, 1 / H); p.renderToScreen = true; c.addPass(p); add("UB + FXAA (1 pass)", () => c.render()); }
      { const c = mkC(UB); const p = new SMAAPass(); p.renderToScreen = true; c.addPass(p); add("UB + SMAA (3 pass)", () => c.render()); }
      { const c = mkC(UB); const p = new UnrealBloomPass(new THREE.Vector2(W, H), 0.4, 0.5, 0.9); c.addPass(p); c.addPass(new OutputPass()); add("UB + UnrealBloom + Output", () => c.render()); }
      { const c = mkC(UB); const sel: THREE.Object3D[] = []; scene.traverse((o: any) => { if (o.isMesh && sel.length < 100) sel.push(o); }); const p = new OutlinePass(new THREE.Vector2(W, H), scene, camera, sel); c.addPass(p); c.addPass(new OutputPass()); add("UB + OutlinePass(100 mesh) + Output", () => c.render()); }
      { const c = mkC(UB); c.addPass(new GTAOPass(scene, camera, W, H)); c.addPass(new OutputPass()); add("UB + GTAO + Output", () => c.render()); }
      const gl = renderer.getContext() as WebGL2RenderingContext; const px = new Uint8Array(4);
      const tt: Record<string, number[]> = {};
      for (let round = 0; round < (SETN || 8); round++) {
        for (const c of cfg) { const a = performance.now(); c.f(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); const d = performance.now() - a; if (round > 0) (tt[c.name] ??= []).push(d); }
        await new Promise((r) => setTimeout(r, 0));
      }
      for (const c of cfg) { const a = tt[c.name].sort((x, y) => x - y); const res = { name: c.name, ms: Math.round(a[a.length >> 1]), min: Math.round(a[0]), first_incl_compile: 0, calls: 0 }; results.push(res); log(JSON.stringify(res)); }
    }

    if (SET === "6") {
      const hashPx = (gl: WebGL2RenderingContext) => { const buf = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf); let h = 2166136261 >>> 0; for (let i = 0; i < buf.length; i++) { h ^= buf[i]; h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); };
      const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true }); renderer.setPixelRatio(1); renderer.setSize(W, H, false);
      const { scene } = buildScene({}); const camera = cam();
      const c1 = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.UnsignedByteType })); c1.setPixelRatio(1); c1.setSize(W, H); c1.addPass(new RenderPass(scene, camera)); const fp = new ShaderPass(FusedShader); fp.renderToScreen = true; c1.addPass(fp);
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const out: Record<string, string[]> = { direct: [], fused: [] };
      for (let i = 0; i < 3; i++) { camera.position.x += 0.0; renderer.render(scene, camera); out.direct.push(hashPx(gl)); c1.render(); out.fused.push(hashPx(gl)); }
      // ters sira
      for (let i = 0; i < 2; i++) { c1.render(); out.fused.push(hashPx(gl)); renderer.render(scene, camera); out.direct.push(hashPx(gl)); }
      const res = { name: "HASH " + JSON.stringify(out), ms: 0, min: 0, first_incl_compile: 0, calls: 0 }; results.push(res); log(JSON.stringify(res));
    }
    P.__RESULTS = results;
  } catch (e: any) { P.__ERR = String(e && e.stack || e); }
  P.__DONE = true;
})();
