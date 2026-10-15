import * as THREE from "three/webgpu";
const W = 1080, H = 1920;
const P = window as any; const log = (s: string) => { P.__LOG = (P.__LOG || "") + s + "\n"; };
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
(async () => {
  try {
    log("navigator.gpu: " + (!!(navigator as any).gpu));
    let ad: any = null;
    try { ad = await (navigator as any).gpu?.requestAdapter(); } catch (e) { log("requestAdapter err " + e); }
    log("adapter: " + (ad ? JSON.stringify({ vendor: ad.info?.vendor, arch: ad.info?.architecture, desc: ad.info?.description, fallback: ad.isFallbackAdapter }) : "null"));
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: false });
    await renderer.init();
    log("backend isWebGPU: " + (renderer as any).backend?.isWebGPUBackend + " | isWebGL: " + (renderer as any).backend?.isWebGLBackend);
    renderer.setPixelRatio(1); renderer.setSize(W, H, false);
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#cfe3f0");
    const r = rng(7);
    const mats = ["#e8c9a0", "#d98e73", "#b7c4a5", "#e9dfc8"].map((c) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.9 }));
    const g = new THREE.Mesh(new THREE.BoxGeometry(44, 0.5, 44), new THREE.MeshStandardMaterial({ color: "#a9c27d", flatShading: true })); g.position.y = -0.25; scene.add(g);
    for (let gx = -9; gx < 9; gx++) for (let gz = -9; gz < 9; gz++) { if (r() < 0.6) { const h = 1 + r() * 2.5; const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.4), mats[(r() * 4) | 0]); m.position.set(gx * 2.4, h / 2, gz * 2.4); scene.add(m); const c = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.9, 4), mats[1]); c.position.set(gx * 2.4, h + 0.45, gz * 2.4); scene.add(c); } }
    scene.add(new THREE.HemisphereLight("#bfdcff", "#8a7a5a", 1.1)); const sun = new THREE.DirectionalLight("#fff1d6", 2.2); sun.position.set(14, 20, 8); scene.add(sun);
    const s = 15; const cam = new THREE.OrthographicCamera(-s * (W / H), s * (W / H), s, -s, -100, 200); const az = Math.PI / 4, el = (38 * Math.PI) / 180, d = 40; cam.position.set(Math.cos(el) * Math.sin(az) * d, Math.sin(el) * d, Math.cos(el) * Math.cos(az) * d); cam.lookAt(0, 1, 0);
    const t0 = performance.now();
    await renderer.renderAsync(scene, cam); log("first render (incl compile) ms: " + Math.round(performance.now() - t0));
    const ts: number[] = [];
    for (let i = 0; i < 6; i++) { const a = performance.now(); await renderer.renderAsync(scene, cam); const ctx2 = canvas; void ctx2; ts.push(performance.now() - a); }
    ts.sort((a, b) => a - b); log("renderAsync median ms: " + Math.round(ts[3]) + " min " + Math.round(ts[0]));
    P.__RESULTS = [];
  } catch (e: any) { P.__ERR = String(e && e.stack || e); }
  P.__DONE = true;
})();
