// MAHALLE düzeni. React'siz: doğrulayıcı da kullanır. Kaynak: src/story/series/neighborhood.json (hücre/mekân).
// Dünya: x doğu, z güney, y yukarı; kamera güneydoğudan bakar (+x ve +z yüzleri görünür). 1 birim ≈ 1 m, 1 blok = CELL.
import hood from "../../story/series/neighborhood.json";
import chars from "../../story/series/characters.json";

export const CELL = 12;
export const COLS = hood.grid.cols;
export const ROWS = hood.grid.rows;
export const WORLD_W = COLS * CELL;
export const WORLD_D = ROWS * CELL;
export const SIDEWALK = 10; // blok içindeki kaldırım plakası (kenarlarda 1'er birim yol)

/** Hücre merkezi (dünya x,z). Harita (0,0) merkezde. */
export const cellCenter = (col: number, row: number): [number, number] => [(col - (COLS - 1) / 2) * CELL, (row - (ROWS - 1) / 2) * CELL];

export type VenueKind =
  | "meydan" | "cay-ocagi" | "bakkal" | "doner" | "kuafor" | "yildiz-apt" | "gul-apt" | "pasaj-han" | "teras7" | "park" | "firin" | "durak";

/** Mekânın hücre içindeki yerleşimi: yerel merkez (dx,dz), ayak izi (w x d). Ön yüz +z. */
export type Place = { dx: number; dz: number; w: number; d: number; h: number };

export const PLACES: Record<string, Place> = {
  meydan: { dx: 0, dz: 0, w: 10, d: 10, h: 0 },
  "cay-ocagi": { dx: 2.6, dz: -2.6, w: 4.6, d: 3.4, h: 3 },
  bakkal: { dx: 0, dz: -1.5, w: 8, d: 6, h: 3.4 },
  doner: { dx: 0, dz: -1.5, w: 8, d: 6, h: 3.4 },
  kuafor: { dx: 0, dz: -1.5, w: 7, d: 6, h: 3.4 },
  "yildiz-apt": { dx: 0, dz: -0.5, w: 8, d: 8, h: 18 },
  "gul-apt": { dx: 0, dz: -1, w: 7, d: 6, h: 12 },
  "pasaj-han": { dx: 0, dz: -0.5, w: 9, d: 8, h: 12 },
  teras7: { dx: 0, dz: -0.5, w: 9, d: 8, h: 12 },
  park: { dx: 0, dz: 0, w: 10, d: 10, h: 0 },
  firin: { dx: 0, dz: -1.5, w: 7, d: 6, h: 3.4 },
  durak: { dx: 0, dz: 0, w: 10, d: 10, h: 0 },
};

export type VenueSpec = { id: string; name: string; type: string; cell: [number, number]; origin: [number, number]; place: Place; top: number };

const venues = hood.venues as unknown as { id: string; name: string; type: string; cell: [number, number]; elevation?: string }[];
export const VENUES: VenueSpec[] = venues.map((v) => {
  const [cx, cz] = cellCenter(v.cell[0], v.cell[1]);
  const place = PLACES[v.id] ?? { dx: 0, dz: 0, w: 8, d: 6, h: 3 };
  const origin: [number, number] = [cx + place.dx, cz + place.dz];
  // teras7: Pasaj Han çatısı (y = 12)
  return { id: v.id, name: v.name, type: v.type, cell: v.cell, origin, place, top: v.id === "teras7" ? PLACES["pasaj-han"].h + 0.35 : 0 };
});
export const venue = (id: string): VenueSpec => {
  const v = VENUES.find((x) => x.id === id);
  if (!v) throw new Error(`mahalle: bilinmeyen mekân '${id}'`);
  return v;
};

/** Karakter için varsayılan "istasyon" (mekân içi konum, dünya x/z, y = zemin). */
export type Station = { x: number; y: number; z: number; rot: number; sit?: number };
const st = (id: string, dx: number, dz: number, rot = 0, sit = 0, dy = 0): Station => {
  const v = venue(id);
  return { x: v.origin[0] + dx, y: v.top + dy, z: v.origin[1] + dz, rot, sit };
};
export const STATIONS: Record<string, Station> = {
  hatice: st("cay-ocagi", 0.2, -1.1, 0),
  nuri: st("bakkal", 1.6, -1.0, 0),
  bulent: st("bakkal", -2.4, -0.8, Math.PI / 2),
  ferhat: st("doner", 1.0, -1.0, 0),
  mert: st("doner", -2.2, -0.6, 0),
  nermin: st("kuafor", 0.4, -0.6, 0),
  nil: st("teras7", 0.0, 0.8, 0),
  koray: st("teras7", 3.6, 3.0, Math.PI / 4),
  kerem: st("teras7", -2.2, 1.2, -Math.PI / 2),
  recep: st("durak", -2.0, -0.1, 0),
  kemal: st("durak", -0.2, 3.3, -Math.PI / 2),
  hacer: st("yildiz-apt", -2.1, 4.6, 0, 0, 3),
  karabas: st("cay-ocagi", -1.0, 2.6, 0.6),
  efe: st("park", -1.6, 2.0, 0),
};

/** Kamera planları. zoom: px/birim (1080 genişlik). genel=tüm harita; geniş ≈44; orta ≈75; yakın ≈130. */
export type Shot = { target: [number, number, number]; zoom: number; az?: number; el?: number };
export const shotFor = (name: string): Shot => {
  if (name === "genel") return { target: [0, 3, 0], zoom: 11.2 };
  if (name === "genel-yakin") return { target: [0, 2, 0], zoom: 16 };
  const [id, kind] = name.split(":");
  const v = venue(id);
  const cy = v.top + (v.id === "yildiz-apt" ? 6 : v.id === "pasaj-han" ? 5 : 1.2);
  const t: [number, number, number] = [v.origin[0], cy, v.origin[1]];
  if (kind === "yakin") return { target: [t[0], v.top + 1.4, t[2] + 0.5], zoom: 130 };
  if (kind === "orta") return { target: [t[0], v.top + 1.2, t[2]], zoom: 75 };
  if (kind === "genis" || !kind) return { target: t, zoom: v.id === "yildiz-apt" || v.id === "pasaj-han" ? 26 : 44 };
  throw new Error(`mahalle: bilinmeyen plan '${name}'`);
};

export const CHAR_COLORS: Record<string, string> = Object.fromEntries((chars.characters as { id: string; color: string }[]).map((c) => [c.id, c.color]));

/** Boş hücreler (mekân olmayan bloklar): sahneyi dolduran sade dolgu. Her hücre ya mekân ya dolgudur (doğrulayıcı denetler). */
export type Filler = { cell: [number, number]; type: "block" | "garden" | "parking" | "grove"; floors?: number; color?: string; seed: number };
export const FILLERS: Filler[] = [
  { cell: [0, 0], type: "block", floors: 5, color: "cream", seed: 101 },
  { cell: [2, 0], type: "block", floors: 4, color: "lilac", seed: 102 },
  { cell: [3, 0], type: "block", floors: 3, color: "mint", seed: 103 },
  { cell: [5, 0], type: "block", floors: 4, color: "sky", seed: 104 },
  { cell: [0, 1], type: "block", floors: 3, color: "mustard", seed: 105 },
  { cell: [0, 2], type: "block", floors: 3, color: "rose", seed: 106 },
  { cell: [4, 1], type: "garden", seed: 107 },
  { cell: [1, 2], type: "parking", seed: 108 },
  { cell: [2, 2], type: "garden", seed: 109 },
  { cell: [4, 2], type: "grove", seed: 110 },
  { cell: [1, 3], type: "parking", seed: 112 },
  { cell: [2, 3], type: "garden", seed: 113 },
  { cell: [3, 3], type: "grove", seed: 114 },
  { cell: [4, 3], type: "garden", seed: 115 },
];
