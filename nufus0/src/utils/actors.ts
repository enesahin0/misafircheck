// Karakter hareketi: anahtar karelerden konum / poz örnekleme. Tamamen deterministik.
import { clamp, lerp, smooth } from "./time";

export type ActorKey = {
  f: number;
  pos: [number, number]; // arşiv odası yerel (x, z)
  rot: number; // radyan, +z'ye bakış = 0
  sit?: number;
  reach?: number; // dolaba uzanma
  hold?: number; // dosyayı göğüste tutma
  typing?: number;
  yaw?: number; // kafa dönüşü
};

export type ActorSample = {
  x: number;
  z: number;
  rot: number;
  sit: number;
  reach: number;
  hold: number;
  typing: number;
  yaw: number;
  moving: number;
  walkPhase: number;
};

const shortestAngle = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};

const STRIDE = 0.78; // bir tam adım döngüsü için metre

export const sampleActor = (keys: ActorKey[], frame: number): ActorSample => {
  const first = keys[0];
  let dist = 0;
  let seg = -1;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    const len = Math.hypot(b.pos[0] - a.pos[0], b.pos[1] - a.pos[1]);
    if (frame >= b.f) {
      dist += len;
    } else if (frame >= a.f) {
      seg = i;
      break;
    }
  }
  const v = (k: ActorKey, name: "sit" | "reach" | "hold" | "typing" | "yaw") => k[name] ?? 0;
  if (seg < 0) {
    const k = frame <= first.f ? first : keys[keys.length - 1];
    return {
      x: k.pos[0], z: k.pos[1], rot: k.rot,
      sit: v(k, "sit"), reach: v(k, "reach"), hold: v(k, "hold"), typing: v(k, "typing"), yaw: v(k, "yaw"),
      moving: 0, walkPhase: (dist / STRIDE) * Math.PI * 2,
    };
  }
  const a = keys[seg];
  const b = keys[seg + 1];
  const t = clamp((frame - a.f) / Math.max(1, b.f - a.f));
  const len = Math.hypot(b.pos[0] - a.pos[0], b.pos[1] - a.pos[1]);
  const walking = len > 0.05;
  const s = smooth(t);
  return {
    x: lerp(a.pos[0], b.pos[0], walking ? t : s),
    z: lerp(a.pos[1], b.pos[1], walking ? t : s),
    rot: a.rot + shortestAngle(a.rot, b.rot) * s,
    sit: lerp(v(a, "sit"), v(b, "sit"), s),
    reach: lerp(v(a, "reach"), v(b, "reach"), s),
    hold: lerp(v(a, "hold"), v(b, "hold"), s),
    typing: lerp(v(a, "typing"), v(b, "typing"), s),
    yaw: lerp(v(a, "yaw"), v(b, "yaw"), s),
    moving: walking ? 1 : 0,
    walkPhase: ((dist + len * t) / STRIDE) * Math.PI * 2,
  };
};
