// Şehir düzeni (metre benzeri birim). x: doğu, z: güney, y: yukarı.
// Kamera güneydoğudan (x+, z+) kuzeybatıya bakar; +x ve +z yüzleri görünür.
import type { BuildingSpec } from "./Apartment";
import { C } from "./palette";

export const PLINTH = { x0: -34, x1: 34, z0: -34, z1: 34, depth: 3 };

/** 14. Sokak'ın silinen ayak izi. */
export const F = { x0: 5, x1: 28, z0: 5, z1: 29 };

/** Belediye binası (arşiv zemin katta). Merkez noktası. */
export const MUNI = { x: -4, z: -18, w: 16, d: 16 };

export const ROUTES = {
  /** Belediye Cad. (doğu-batı) — araç +x yönüne gider */
  belediye: { from: [-32, 1.6] as [number, number], to: [32, 1.6] as [number, number], rotY: Math.PI / 2 },
  /** Merkez Sk. (kuzey-güney) — araç +z yönüne gider */
  merkez: { from: [-19.5, -32] as [number, number], to: [-19.5, 32] as [number, number], rotY: 0 },
} as const;
export type RouteId = keyof typeof ROUTES;

export const CITY_BUILDINGS: BuildingSpec[] = [
  { id: "NW1", x: -29.5, z: -28, w: 7, d: 8, floors: 5, roof: "antenna", seed: 11, tone: C.slate, lit: [{ floor: 3, face: "z", col: 0 }] },
  { id: "NW2", x: -29.5, z: -18.5, w: 7, d: 8, floors: 3, roof: "tank", seed: 12, tone: C.slateLight },
  { id: "NW3", x: -29.5, z: -9.8, w: 7, d: 6, floors: 4, roof: "ac", seed: 13, tone: C.slate },
  { id: "NE1", x: 12, z: -27, w: 8, d: 8, floors: 6, roof: "antenna", seed: 21, tone: C.slateLight, lit: [{ floor: 4, face: "x", col: 1 }] },
  { id: "NE2", x: 24.5, z: -27, w: 9, d: 8, floors: 4, roof: "tank", seed: 22, tone: C.slate },
  { id: "NE3", x: 22, z: -11.5, w: 7, d: 6, floors: 2, roof: "ac", seed: 23, tone: C.slate },
  { id: "SW1", x: -29.5, z: 11, w: 7, d: 7, floors: 4, roof: "ac", seed: 31, tone: C.slateLight },
  { id: "SW2", x: -29.5, z: 20.5, w: 7, d: 8, floors: 3, roof: "tank", seed: 32, tone: C.slate },
  { id: "SW3", x: -29.5, z: 29.5, w: 7, d: 6, floors: 5, roof: "antenna", seed: 33, tone: C.slate, lit: [{ floor: 2, face: "z", col: 1 }] },
  { id: "SM1", x: -9, z: 12, w: 8, d: 7, floors: 3, roof: "tank", seed: 41, tone: C.slate },
  { id: "SM2", x: -9, z: 24.5, w: 9, d: 9, floors: 5, roof: "ac", seed: 42, tone: C.slateLight, lit: [{ floor: 2, face: "x", col: 2 }] },
  { id: "SM3", x: 0.5, z: 18, w: 5, d: 6, floors: 4, roof: "slant", seed: 43, tone: C.slate },
];

/** 14. Sokak binaları. eraseWindow: global silinme ilerlemesi (0..1) içinde bu bina ne zaman silinir. */
export const STREET14_BUILDINGS: BuildingSpec[] = [
  { id: "S14-W1", x: 8.8, z: 9.5, w: 6.6, d: 6.6, floors: 3, roof: "ac", seed: 51, tone: C.slate, eraseWindow: [0.05, 0.45] },
  {
    id: "S14-W2", x: 8.8, z: 17.5, w: 6.6, d: 7, floors: 4, roof: "tank", seed: 52, tone: C.slateLight, eraseWindow: [0.22, 0.62],
    lit: [
      { floor: 2, face: "x", col: 1, survive: true, people: 2, seed: 7 },
      { floor: 1, face: "z", col: 0, survive: false },
    ],
  },
  {
    id: "S14-W3", x: 8.8, z: 25.5, w: 6.6, d: 6.6, floors: 3, roof: "antenna", seed: 53, tone: C.slate, eraseWindow: [0.39, 0.79],
    lit: [{ floor: 1, face: "x", col: 1, survive: true, people: 1, seed: 8 }],
  },
  {
    id: "S14-E1", x: 24.2, z: 9.5, w: 6.6, d: 6.6, floors: 4, roof: "tank", seed: 54, tone: C.slateLight, eraseWindow: [0.08, 0.48],
    lit: [{ floor: 3, face: "z", col: 1, survive: true, people: 3, seed: 9 }],
  },
  { id: "S14-E2", x: 24.2, z: 17.5, w: 6.6, d: 7, floors: 3, roof: "ac", seed: 55, tone: C.slate, eraseWindow: [0.25, 0.65] },
  {
    id: "S14-E3", x: 24.2, z: 25.5, w: 6.6, d: 6.6, floors: 5, roof: "antenna", seed: 56, tone: C.slate, eraseWindow: [0.42, 0.82],
    lit: [{ floor: 2, face: "x", col: 0, survive: true, people: 2, seed: 10 }],
  },
];

/** Silinen sokağın zemin satırları: z aralığı + silinme eşiği */
export const STREET14_ROWS = [
  { z0: 5, z1: 11, at: 0.45 },
  { z0: 11, z1: 17, at: 0.6 },
  { z0: 17, z1: 23, at: 0.74 },
  { z0: 23, z1: 29, at: 0.88 },
] as const;

export const rowForZ = (z: number) => STREET14_ROWS.find((r) => z >= r.z0 && z < r.z1) ?? STREET14_ROWS[3];

/** Arşiv odası yerel koordinatını (merkez = belediye merkezi, zemin = 0) dünya koordinatına çevirir. */
export const room = (lx: number, ly: number, lz: number): [number, number, number] => [MUNI.x + lx, ly, MUNI.z + lz];
export const ROOM_FLOOR = 0.3;
