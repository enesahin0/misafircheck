// Sahne anahtar karelerinden sürekli (PCHIP) kamera yolu. Sürekli sahneler tek zincir olur,
// kamera aniden değişiyorsa (kesme) yeni zincir başlar → hızlanıp durma (stop-go) olmaz.
import type { Episode } from "../episodes/schema";
import type { IsoCam } from "../world/camera";
import { DEFAULT_AZ, DEFAULT_EL } from "../world/camera";
import type { V3 } from "../world/primitives";

type Key = { f: number; target: V3; lz: number; az: number; el: number };

const same = (a: Key, b: Key) =>
  Math.abs(a.f - b.f) < 1 &&
  a.target.every((v, i) => Math.abs(v - b.target[i]) < 1e-6) &&
  Math.abs(a.lz - b.lz) < 1e-6 &&
  a.az === b.az &&
  a.el === b.el;

const pchip = (xs: number[], ys: number[], x: number): number => {
  const n = xs.length;
  if (n === 1 || x <= xs[0]) return ys[0];
  if (x >= xs[n - 1]) return ys[n - 1];
  const h: number[] = [];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h.push(xs[i + 1] - xs[i]);
    d.push((ys[i + 1] - ys[i]) / h[i]);
  }
  const m: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  let k = 0;
  while (k < n - 2 && x > xs[k + 1]) k++;
  const t = (x - xs[k]) / h[k];
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * ys[k] +
    (t3 - 2 * t2 + t) * h[k] * m[k] +
    (-2 * t3 + 3 * t2) * ys[k + 1] +
    (t3 - t2) * h[k] * m[k + 1]
  );
};

type Chain = { from: number; to: number; keys: Key[] };

export const buildCameraChains = (ep: Episode): Chain[] => {
  const chains: Chain[] = [];
  let cur: Chain | null = null;
  for (const sc of ep.scenes) {
    const keys: Key[] = sc.camera.map((c) => ({
      f: c.f,
      target: c.target as V3,
      lz: Math.log(c.zoom),
      az: c.az ?? DEFAULT_AZ,
      el: c.el ?? DEFAULT_EL,
    }));
    if (cur && same(cur.keys[cur.keys.length - 1], keys[0])) {
      cur.keys.push(...keys.slice(1));
      cur.to = sc.to;
    } else {
      cur = { from: sc.from, to: sc.to, keys: [...keys] };
      chains.push(cur);
    }
    // sahne bitişinde son anahtar yoksa son değeri tut
    const last = cur.keys[cur.keys.length - 1];
    if (last.f < sc.to - 1) cur.keys.push({ ...last, f: sc.to - 1 });
  }
  return chains;
};

export const sampleCamera = (chains: Chain[], ep: Episode, frame: number): IsoCam => {
  const chain = chains.find((c) => frame >= c.from && frame < c.to) ?? chains[chains.length - 1];
  const xs = chain.keys.map((k) => k.f);
  const ch = (pick: (k: Key) => number) => pchip(xs, chain.keys.map(pick), frame);
  const scene = ep.scenes.find((s) => frame >= s.from && frame < s.to) ?? ep.scenes[ep.scenes.length - 1];
  const sw = scene.sway;
  const target: V3 = [
    ch((k) => k.target[0]) + Math.sin(frame / 41) * sw,
    ch((k) => k.target[1]) + Math.sin(frame / 57 + 1) * sw * 0.5,
    ch((k) => k.target[2]) + Math.cos(frame / 47) * sw,
  ];
  return { target, zoom: Math.exp(ch((k) => k.lz)), az: ch((k) => k.az), el: ch((k) => k.el) };
};
