// Demiryolu geometrisi ve tren zaman çizelgesi. React'siz, deterministik: aynı kare → aynı konum.
// Ray: kuzey kenardaki tünel A'dan (güneye doğru) girer, çeyrek daire döner, batı kenardaki tünel B'ye (batıya) gider.
// Yol parametresi s: A tünelinin içinde 0'dan başlar; s=8 A portalı, s=26.5 B portalı.
export const RAIL = {
  ax: -26, aStartZ: -33, portalAZ: -25,        // A: x sabit, güneye gider (+z)
  cx: -29.5, cz: -20, R: 3.5,                  // dönüş merkezi ve yarıçapı
  hz: -16.5, portalBX: -37.5, endX: -45,       // B: z sabit, batıya gider (-x)
};
const L1 = RAIL.cz - RAIL.aStartZ;             // düz 1
const LA = (RAIL.R * Math.PI) / 2;             // yay
export const S_ARC0 = L1, S_ARC1 = L1 + LA;
export const PATH_LEN = S_ARC1 + (RAIL.cx - RAIL.endX);
export const S_PORTAL_A = RAIL.portalAZ - RAIL.aStartZ;                 // 8
export const S_PORTAL_B = S_ARC1 + (RAIL.cx - RAIL.portalBX);           // 26.5

export type PathPoint = { x: number; z: number; rot: number };
/** s mesafesindeki konum ve yön (rot: Humanoid ile aynı kural, +z = 0). Aralık dışı doğrusal uzatılır. */
export const pathAt = (s: number): PathPoint => {
  if (s <= S_ARC0) return { x: RAIL.ax, z: RAIL.aStartZ + s, rot: 0 };
  if (s <= S_ARC1) {
    const th = (s - S_ARC0) / RAIL.R;
    return { x: RAIL.cx + RAIL.R * Math.cos(th), z: RAIL.cz + RAIL.R * Math.sin(th), rot: Math.atan2(-Math.sin(th), Math.cos(th)) };
  }
  return { x: RAIL.cx - (s - S_ARC1), z: RAIL.hz, rot: -Math.PI / 2 };
};

/** Tren boyları (öndeki mesafe → her aracın merkezi). Küçük yerel tren: lokomotif + kömürlük + 1 vagon. */
export const TRAIN = {
  cars: [
    { kind: "loco" as const, len: 2.8, center: 1.4 },
    { kind: "tender" as const, len: 1.4, center: 3.65 },
    { kind: "coach" as const, len: 2.6, center: 5.8 },
  ],
  length: 7.1,
};

export const TRAIN_PERIOD = 900;
const T_IN0 = 150, T_STOP = 380, T_GO = 560, T_OUT = 790;
export const S_FRONT_START = 2;
export const S_FRONT_STOP = 26;
export const S_FRONT_END = S_PORTAL_B + TRAIN.length + 1.5;
const easeOut = (p: number) => 1 - (1 - p) * (1 - p);
const easeIn = (p: number) => p * p;

export type TrainState = { front: number | null; phase: "yok" | "gelis" | "durak" | "kalkis"; speed: number; frameInCycle: number };
/** Tren saati: `frame` bölüm karesi, `offset` ile çevrim kaydırılır. Bölüm senaryosu istediği anı offset ile seçer. */
export const trainState = (frame: number, offset = 0): TrainState => {
  const u = (((frame + offset) % TRAIN_PERIOD) + TRAIN_PERIOD) % TRAIN_PERIOD;
  if (u < T_IN0) return { front: null, phase: "yok", speed: 0, frameInCycle: u };
  if (u < T_STOP) {
    const p = (u - T_IN0) / (T_STOP - T_IN0);
    return { front: S_FRONT_START + (S_FRONT_STOP - S_FRONT_START) * easeOut(p), phase: "gelis", speed: 2 * (1 - p), frameInCycle: u };
  }
  if (u < T_GO) return { front: S_FRONT_STOP, phase: "durak", speed: 0, frameInCycle: u };
  if (u < T_OUT) {
    const p = (u - T_GO) / (T_OUT - T_GO);
    return { front: S_FRONT_STOP + (S_FRONT_END - S_FRONT_STOP) * easeIn(p), phase: "kalkis", speed: 2 * p, frameInCycle: u };
  }
  return { front: null, phase: "yok", speed: 0, frameInCycle: u };
};
