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
  ferhat: st("doner", 1.4, -0.9, 0),
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

/** Kamera planları. Hepsi "kutuya sığdır" hesabıyla kurulur: seçilen kutu kareden TAŞMAZ (kenar boşluğu = margin). */
export type Shot = { target: [number, number, number]; zoom: number; az?: number; el?: number };
const AZ = 45, EL = 38;
const FRAME_W = 1080, FRAME_H = 1920;

/** Dünya kutusunun (merkez c, boyut size) ekran izdüşümüne göre sığdırma zoom'u. */
export const fitBox = (c: [number, number, number], size: [number, number, number], margin = 0.05): Shot => {
  const a = (AZ * Math.PI) / 180, e = (EL * Math.PI) / 180;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const dx of [-0.5, 0.5]) for (const dy of [-0.5, 0.5]) for (const dz of [-0.5, 0.5]) {
    const x = c[0] + dx * size[0], y = c[1] + dy * size[1], z = c[2] + dz * size[2];
    const sx = x * Math.cos(a) - z * Math.sin(a);
    const sy = y * Math.cos(e) - (x * Math.sin(a) + z * Math.cos(a)) * Math.sin(e);
    minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
  }
  const zoom = Math.min((FRAME_W * (1 - 2 * margin)) / (maxX - minX), (FRAME_H * (1 - 2 * margin)) / (maxY - minY));
  return { target: c, zoom: Math.round(zoom * 100) / 100 };
};

const TALL = new Set(["yildiz-apt", "gul-apt", "pasaj-han", "teras7"]);

export const shotFor = (name: string): Shot => {
  if (name === "genel") return fitBox([0, 8.5, 0], [WORLD_W + 8, 27, WORLD_D + 8], 0.03);
  if (name === "genel-yakin") return fitBox([0, 4, 0], [WORLD_W * 0.62, 20, WORLD_D * 0.62], 0.04);
  const [id, kind] = name.split(":");
  const v = venue(id);
  const { w, d, h } = v.place;
  const [ox, oz] = v.origin;
  if (kind === "yakin") return { target: [ox, v.top + 1.4, oz + 0.5], zoom: 130 };
  if (kind === "kart") {
    // yalnız bu hücre, yüzen küçük ada olarak (referans "mekân kartı" görünümü)
    const [cx, cz] = cellCenter(v.cell[0], v.cell[1]);
    const top = v.id === "teras7" || v.id === "pasaj-han" ? PLACES["pasaj-han"].h + 0.35 + 4.5 : v.id === "yildiz-apt" ? 18 + 3.5 : v.id === "gul-apt" ? 12 + 3 : Math.max(h, 4) + 4;
    return fitBox([cx, (top - 4.5) / 2, cz], [SIDEWALK + 2, top + 4.5, SIDEWALK + 2], 0.06);
  }
  if (id === "teras7" && kind === "ust") return fitBox([ox, v.top + 1.6, oz], [w + 1, 4, d + 1], 0.06);
  // yüksek yapılar: tüm bina; alçak mekânlar: mekân + biraz çevre
  const whole = TALL.has(id);
  const tallH = id === "teras7" ? PLACES["pasaj-han"].h + 0.35 + 4.5 : h + 1.5;
  if (kind === "orta") {
    return whole ? fitBox([ox, tallH / 2, oz], [w + 2.5, tallH, d + 2.5], 0.07) : fitBox([ox, v.top + 1.6, oz], [w + 3.5, Math.max(h, 3.4) + 1.5, d + 3.5], 0.07);
  }
  if (kind === "genis" || !kind) {
    return whole ? fitBox([ox, tallH / 2, oz], [w + 12, tallH, d + 12], 0.05) : fitBox([ox, v.top + 1.6, oz], [w + 10, 5, d + 10], 0.05);
  }
  throw new Error(`mahalle: bilinmeyen plan '${name}'`);
};

export const CHAR_COLORS: Record<string, string> = Object.fromEntries((chars.characters as { id: string; color: string }[]).map((c) => [c.id, c.color]));

/** Boş hücreler (mekân olmayan bloklar): sahneyi dolduran sade dolgu. Her hücre ya mekân ya dolgudur (doğrulayıcı denetler). */
export type Filler = { cell: [number, number]; type: "block" | "house" | "garden" | "veg" | "parking" | "grove"; floors?: number; color?: string; seed: number };
export const FILLERS: Filler[] = [
  { cell: [0, 0], type: "house", color: "mustard", seed: 101 },
  { cell: [2, 0], type: "house", color: "cream", seed: 102 },
  { cell: [3, 0], type: "house", color: "mint", seed: 103 },
  { cell: [5, 0], type: "block", floors: 4, color: "sky", seed: 104 },
  { cell: [0, 1], type: "house", color: "cream", seed: 105 },
  { cell: [0, 2], type: "house", color: "sky", seed: 106 },
  { cell: [4, 1], type: "garden", seed: 107 },
  { cell: [1, 2], type: "veg", seed: 108 },
  { cell: [2, 2], type: "garden", seed: 109 },
  { cell: [4, 2], type: "grove", seed: 110 },
  { cell: [1, 3], type: "house", color: "mustard", seed: 112 },
  { cell: [2, 3], type: "grove", seed: 113 },
  { cell: [3, 3], type: "veg", seed: 114 },
  { cell: [4, 3], type: "parking", seed: 115 },
];
