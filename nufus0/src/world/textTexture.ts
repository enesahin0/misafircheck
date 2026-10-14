import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

/** Programatik metin dokusu (bozuk AI metni yok — CLAUDE.md §3). Fontlar yüklendikten sonra çağrılmalı. */
export const textTexture = (
  key: string,
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
): THREE.CanvasTexture => {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
};
