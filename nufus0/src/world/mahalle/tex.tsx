// Prosedürel yüzey dokuları: tuğla, sıva, taş, kiremit, ahşap, zemin karosu, beton panel.
// Dokular nötr (beyaz tabanlı) çizilir; asıl renk materyalin `color`'ıyla çarpılır → her renk, her doku.
// Kutu UV'leri yüz boyutuna göre ölçeklenir: duvar uzunluğu ne olursa olsun tuğla boyu sabit kalır.
import React, { useMemo } from "react";
import * as THREE from "three";
import { textTexture } from "../textTexture";
import { rand } from "../../utils/deterministic";
import type { V3 } from "../primitives";

export type TexKind = "brick" | "plaster" | "stone" | "roof" | "wood" | "floor" | "panel";

/** Dokunun dünyada kapladığı kenar uzunluğu (metre). */
const TILE: Record<TexKind, number> = { brick: 2.0, plaster: 3.0, stone: 1.6, roof: 1.2, wood: 2.4, floor: 1.6, panel: 2.4 };

const g255 = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255);
const grey = (v: number) => `rgb(${g255(v)},${g255(v)},${g255(v)})`;

const DRAW: Record<TexKind, (g: CanvasRenderingContext2D, w: number, h: number) => void> = {
  brick: (g, w, h) => {
    g.fillStyle = grey(1);
    g.fillRect(0, 0, w, h);
    const rows = 8, bw = w / 4, bh = h / rows;
    for (let r = 0; r < rows; r++) for (let c = -1; c < 5; c++) {
      const off = r % 2 ? bw / 2 : 0;
      g.fillStyle = grey(0.78 + 0.15 * rand(r * 13 + c, 7));
      g.fillRect(c * bw + off + 2, r * bh + 2, bw - 4, bh - 4);
    }
  },
  plaster: (g, w, h) => {
    g.fillStyle = grey(0.97);
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      g.fillStyle = grey(0.9 + 0.1 * rand(i, 3));
      const s = 4 + rand(i, 5) * 9;
      g.fillRect(rand(i, 1) * w, rand(i, 2) * h, s, s * 0.6);
    }
    g.fillStyle = "rgba(0,0,0,0.06)";
    g.fillRect(0, h - 4, w, 4);
  },
  stone: (g, w, h) => {
    g.fillStyle = grey(0.7);
    g.fillRect(0, 0, w, h);
    let y = 0, k = 0;
    while (y < h) {
      const rh = 36 + rand(k, 1) * 26;
      let x = 0;
      while (x < w) {
        const sw = 40 + rand(k * 7 + x, 2) * 50;
        g.fillStyle = grey(0.86 + 0.14 * rand(k * 3 + x, 4));
        g.fillRect(x + 2, y + 2, Math.min(sw, w - x) - 4, rh - 4);
        x += sw; k++;
      }
      y += rh; k += 3;
    }
  },
  roof: (g, w, h) => {
    // kiremit: yarım daire sıraları; üst üste binen görünüm
    g.fillStyle = grey(0.72);
    g.fillRect(0, 0, w, h);
    const rows = 4, n = 4, th = h / rows, tw = w / n;
    for (let r = rows - 1; r >= 0; r--) for (let c = -1; c <= n; c++) {
      const off = r % 2 ? tw / 2 : 0;
      const cx = c * tw + off + tw / 2, cy = r * th + th * 0.35;
      g.fillStyle = grey(0.84 + 0.16 * rand(r * 9 + c, 5));
      g.beginPath();
      g.moveTo(cx - tw / 2 + 2, cy - th * 0.35);
      g.lineTo(cx + tw / 2 - 2, cy - th * 0.35);
      g.lineTo(cx + tw / 2 - 2, cy + th * 0.1);
      g.quadraticCurveTo(cx + tw / 2 - 4, cy + th * 0.62, cx, cy + th * 0.66);
      g.quadraticCurveTo(cx - tw / 2 + 4, cy + th * 0.62, cx - tw / 2 + 2, cy + th * 0.1);
      g.closePath();
      g.fill();
    }
  },
  wood: (g, w, h) => {
    g.fillStyle = grey(1);
    g.fillRect(0, 0, w, h);
    const rows = 8, ph = h / rows;
    for (let r = 0; r < rows; r++) {
      g.fillStyle = grey(0.86 + 0.14 * rand(r, 11));
      g.fillRect(0, r * ph + 2, w, ph - 3);
      g.fillStyle = "rgba(0,0,0,0.07)";
      for (let k = 0; k < 4; k++) g.fillRect(rand(r * 5 + k, 12) * w, r * ph + 5 + rand(r * 3 + k, 13) * (ph - 10), 30 + rand(k, r) * 60, 1.5);
    }
  },
  floor: (g, w, h) => {
    const n = 4, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      g.fillStyle = grey((i + j) % 2 ? 0.88 : 1);
      g.fillRect(i * s, j * s, s, s);
    }
    g.strokeStyle = "rgba(0,0,0,0.10)";
    g.lineWidth = 2;
    g.strokeRect(1, 1, w - 2, h - 2);
  },
  panel: (g, w, h) => {
    g.fillStyle = grey(0.96);
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(0,0,0,0.16)";
    g.lineWidth = 3;
    g.strokeRect(2, 2, w - 4, h - 4);
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    for (let i = 0; i < 80; i++) {
      g.fillStyle = grey(0.9 + 0.1 * rand(i, 21));
      g.fillRect(rand(i, 22) * w, rand(i, 23) * h, 6, 4);
    }
  },
};

const texCache = new Map<TexKind, THREE.CanvasTexture>();
export const surfaceTexture = (kind: TexKind): THREE.CanvasTexture => {
  let t = texCache.get(kind);
  if (!t) {
    t = textTexture(`surf|${kind}`, 256, 256, DRAW[kind]);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    texCache.set(kind, t);
  }
  return t;
};

const matCache = new Map<string, THREE.MeshStandardMaterial>();
export const surfaceMaterial = (kind: TexKind, color: string): THREE.MeshStandardMaterial => {
  const key = `${kind}|${color}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ map: surfaceTexture(kind), color, flatShading: true, roughness: 0.95, metalness: 0 });
    matCache.set(key, m);
  }
  return m;
};

const geoCache = new Map<string, THREE.BoxGeometry>();
const texturedBox = (w: number, h: number, d: number, tile: number): THREE.BoxGeometry => {
  const key = `${w.toFixed(3)}|${h.toFixed(3)}|${d.toFixed(3)}|${tile}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new THREE.BoxGeometry(w, h, d);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    // yüz sırası: +x, -x, +y, -y, +z, -z (her biri 4 köşe)
    const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / tile, (uv.getY(i) * dims[f][1]) / tile);
    }
    uv.needsUpdate = true;
    geoCache.set(key, g);
  }
  return g;
};

/** Dokulu kutu. pos = merkez. `tile` verilmezse türün varsayılan boyu. */
export const TBox: React.FC<{ size: V3; pos?: V3; rot?: V3; color: string; tex: TexKind; tile?: number }> = ({ size, pos = [0, 0, 0], rot, color, tex, tile }) => {
  const geo = useMemo(() => texturedBox(size[0], size[1], size[2], tile ?? TILE[tex]), [size[0], size[1], size[2], tile, tex]);
  return <mesh position={pos} rotation={rot} geometry={geo} material={surfaceMaterial(tex, color)} />;
};

/** Tabanı verilen y'de duran dokulu kutu. */
export const TBase: React.FC<{ size: V3; pos?: V3; rot?: V3; color: string; tex: TexKind; tile?: number }> = ({ size, pos = [0, 0, 0], ...rest }) => (
  <TBox size={size} pos={[pos[0], pos[1] + size[1] / 2, pos[2]]} {...rest} />
);

let roofTex: THREE.CanvasTexture | null = null;
/** Kırma çatı (koni) için tekrarlı kiremit dokusu. */
export const roofCoilMaterial = (color: string): THREE.MeshStandardMaterial => {
  if (!roofTex) {
    roofTex = surfaceTexture("roof").clone();
    roofTex.wrapS = roofTex.wrapT = THREE.RepeatWrapping;
    roofTex.repeat.set(8, 3);
    roofTex.needsUpdate = true;
  }
  const key = `roofcone|${color}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ map: roofTex, color, flatShading: true, roughness: 0.95, metalness: 0 });
    matCache.set(key, m);
  }
  return m;
};
