// MAHALLE düzeni. React'siz: doğrulayıcı da kullanır.
// Kaynak: src/story/series/map.json (düzensiz parseller + yol ağı) ve neighborhood.json (mekân listesi).
// Dünya: x doğu, z güney, y yukarı; kamera güneydoğudan bakar (+x ve +z yüzleri görünür). 1 birim ≈ 1 m.
import hood from "../../story/series/neighborhood.json";
import mapJson from "../../story/series/map.json";
import chars from "../../story/series/characters.json";
import { mapSchema } from "../../story/series/mapSchema";

export const MAP = mapSchema.parse(mapJson);
export const BOUNDS = MAP.bounds;
export const WORLD_W = BOUNDS.x1 - BOUNDS.x0;
export const WORLD_D = BOUNDS.z1 - BOUNDS.z0;
export const WORLD_CX = (BOUNDS.x0 + BOUNDS.x1) / 2;
export const WORLD_CZ = (BOUNDS.z0 + BOUNDS.z1) / 2;
export const SIDEWALK_W = 1.4;

export type Rect = { x0: number; x1: number; z0: number; z1: number };
export type Road = (typeof MAP.roads)[number];
export type Parcel = (typeof MAP.parcels)[number];
export const rectCenter = (r: Rect): [number, number] => [(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2];
export const rectSize = (r: Rect): [number, number] => [r.x1 - r.x0, r.z1 - r.z0];
export const parcelOf = (venueId: string): Parcel => {
  const p = MAP.parcels.find((x) => x.items?.some((i) => i.venue === venueId));
  if (!p) throw new Error(`mahalle: '${venueId}' hiçbir parselde yok`);
  return p;
};
/** Parselin zemin üst yüksekliği: kaldırım/plaza 0.15, çim/toprak 0.06. */
export const parcelTop = (p: Parcel): number => (p.ground === "grass" || p.ground === "dirt" ? 0.06 : 0.15);

/** Mekânın yerleşimi: ayak izi (w x d) ve yükseklik. Ön yüz +z. */
export type Place = { w: number; d: number; h: number };
export const PLACES: Record<string, Place> = {
  meydan: { w: 10, d: 10, h: 0 },
  "cay-ocagi": { w: 4.6, d: 3.4, h: 3 },
  bakkal: { w: 8, d: 6, h: 3.4 },
  doner: { w: 8, d: 6, h: 3.4 },
  kuafor: { w: 7, d: 6, h: 3.4 },
  "yildiz-apt": { w: 8, d: 8, h: 18 },
  "gul-apt": { w: 7, d: 6, h: 12 },
  "pasaj-han": { w: 9, d: 8, h: 12 },
  teras7: { w: 9, d: 8, h: 12 },
  park: { w: 10, d: 10, h: 0 },
  firin: { w: 7, d: 6, h: 3.4 },
  durak: { w: 10, d: 10, h: 0 },
  istasyon: { w: 16, d: 12, h: 5 },
};

export type VenueSpec = { id: string; name: string; type: string; origin: [number, number]; place: Place; top: number; parcel: string };

const venues = hood.venues as unknown as { id: string; name: string; type: string; elevation?: string }[];
export const VENUES: VenueSpec[] = venues.map((v) => {
  const par = parcelOf(v.id);
  const item = par.items!.find((i) => i.venue === v.id)!;
  const place = PLACES[v.id] ?? { w: 8, d: 6, h: 3 };
  return { id: v.id, name: v.name, type: v.type, origin: item.pos, place, top: v.id === "teras7" ? PLACES["pasaj-han"].h + 0.35 : 0, parcel: par.id };
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

export const parcelById = (id: string): Parcel => {
  const p = MAP.parcels.find((x) => x.id === id) ?? parcelOf(id);
  return p;
};

export const shotFor = (name: string): Shot => {
  if (name.startsWith("parsel:")) {
    // herhangi bir parseli (mekân olmasa da) yüzen ada kartı olarak göster
    const par = parcelById(name.slice(7));
    const [pcx, pcz] = rectCenter(par);
    const [pw, pd] = rectSize(par);
    return fitBox([pcx, 3, pcz], [pw + 2, 14, pd + 2], 0.06);
  }
  if (name === "genel") return fitBox([WORLD_CX, 8.5, WORLD_CZ], [WORLD_W + 4, 27, WORLD_D + 4], 0.03);
  if (name === "genel-yakin") return fitBox([WORLD_CX, 4, WORLD_CZ], [WORLD_W * 0.62, 20, WORLD_D * 0.62], 0.04);
  const [id, kind] = name.split(":");
  const v = venue(id);
  const { w, d, h } = v.place;
  const [ox, oz] = v.origin;
  if (kind === "yakin") return { target: [ox, v.top + 1.4, oz + 0.5], zoom: 130 };
  if (kind === "kart") {
    // yalnız bu parsel, yüzen küçük ada olarak (referans "mekân kartı" görünümü)
    const par = parcelOf(id);
    const [pcx, pcz] = rectCenter(par);
    const [pw, pd] = rectSize(par);
    const top = id === "teras7" || id === "pasaj-han" ? PLACES["pasaj-han"].h + 0.35 + 4.5 : id === "yildiz-apt" ? 18 + 3.5 : id === "gul-apt" ? 12 + 3 : Math.max(h, 4) + 4;
    return fitBox([pcx, (top - 4.5) / 2, pcz], [pw + 2, top + 4.5, pd + 2], 0.06);
  }
  if (id === "teras7" && kind === "ust") return fitBox([ox, v.top + 1.6, oz], [w + 1, 4, d + 1], 0.06);
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
