// Mevsim verisi: src/story/series/seasons.json (tek doğruluk kaynağı). React'siz; doğrulayıcı da kullanır.
import seasonsJson from "../../story/series/seasons.json";
import { LIGHTS, LightId, LightPreset } from "./palette";

export type SeasonId = "ilkbahar" | "yaz" | "sonbahar" | "kis";
export type SeasonVisual = {
  grass: string; grassDark: string; leaves: string[]; blossom: boolean; bare: boolean; snow: boolean;
  pave: string; asphalt: string; curb: string; dirt: string;
  bgSabah: string; bgOgle: string; sunMul: number; sunColor: string;
  particles: "kar" | "yaprak" | "cicek" | null; fallenLeaves: boolean; parasols: boolean; pumpkins: boolean; chimneySmoke: boolean;
  cloth: "hafif" | "yazlık" | "ceketli" | "kalın";
};

export const SEASON_IDS: SeasonId[] = ["ilkbahar", "yaz", "sonbahar", "kis"];
export const SEASONS: Record<SeasonId, { name: string; visual: SeasonVisual }> = Object.fromEntries(
  (seasonsJson.seasons as unknown as { id: SeasonId; name: string; visual: SeasonVisual }[]).map((s) => [s.id, { name: s.name, visual: s.visual }]),
) as Record<SeasonId, { name: string; visual: SeasonVisual }>;

export const seasonForMonth = (month: number): SeasonId => (seasonsJson.monthMap as Record<string, SeasonId>)[String(month)];

export const SNOW = "#F4F8FC";

/** Günün saati + mevsim → ışık ön ayarı (gökyüzü ve güneş mevsimden etkilenir). */
export const lightFor = (time: LightId, season: SeasonId): LightPreset => {
  const base = LIGHTS[time];
  const v = SEASONS[season].visual;
  const day = time === "sabah" || time === "ogle";
  return {
    ...base,
    bg: time === "sabah" ? v.bgSabah : time === "ogle" ? v.bgOgle : base.bg,
    sun: day ? v.sunColor : base.sun,
    sunI: base.sunI * v.sunMul,
    hemiI: base.hemiI * (v.snow ? 1.1 : 1),
  };
};
