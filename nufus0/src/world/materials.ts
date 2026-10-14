import * as THREE from "three";

// Aynı renk = aynı materyal. Hepsi mat, düz (flat) gölgeli → low-poly görünüm.
const stdCache = new Map<string, THREE.MeshStandardMaterial>();
const basicCache = new Map<string, THREE.MeshBasicMaterial>();

export type MatOpts = { emissive?: string; ei?: number; rough?: number };

export const mat = (color: string, o: MatOpts = {}): THREE.MeshStandardMaterial => {
  const key = `${color}|${o.emissive ?? ""}|${o.ei ?? 0}|${o.rough ?? 0.95}`;
  let m = stdCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: o.rough ?? 0.95,
      metalness: 0,
      emissive: o.emissive ?? "#000000",
      emissiveIntensity: o.ei ?? 0,
    });
    stdCache.set(key, m);
  }
  return m;
};

/** Işıktan etkilenmeyen (yanan pencere, ekran, uyarı ışığı) materyal. */
export const basic = (color: string): THREE.MeshBasicMaterial => {
  let m = basicCache.get(color);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
    basicCache.set(color, m);
  }
  return m;
};

let glow: THREE.CanvasTexture | null = null;
/** Yumuşak radyal parıltı dokusu (toplamalı karıştırma ile sahte "glow"). */
export const glowTexture = (): THREE.CanvasTexture => {
  if (glow) return glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glow = new THREE.CanvasTexture(c);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
};
