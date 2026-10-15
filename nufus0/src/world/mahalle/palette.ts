// MAHALLE paleti: sıcak, doygunluğu kontrollü low-poly. Işık ön ayarları gün içindeki dört zamanı tanımlar.
export const M = {
  // zemin
  asphalt: "#59606A", asphaltDark: "#4A515A", lineYellow: "#E3C566", curb: "#B8B2A6",
  pave: "#C9BFAA", paveDark: "#B3A88F", plaza: "#D9CDB0", grass: "#7FA164", grassDark: "#6A8C54", dirt: "#A18462",
  // duvar tonları
  cream: "#E7D8B8", sand: "#D9BF93", brick: "#B5654C", brickDark: "#98513C", terracotta: "#C77B55",
  mint: "#9CC4B0", sky: "#8FB3D1", blue: "#4F7CAC", navy: "#2E4468", lilac: "#A58BB5", rose: "#D99A9A",
  mustard: "#D8A93F", olive: "#8C9A55", green: "#4E8B63", greenDark: "#356B4B", white: "#F1EDE4", grey: "#9AA0A8", greyDark: "#6B727C",
  // detay
  wood: "#9A6E48", woodDark: "#6F4B30", glass: "#6E8BA3", glassDark: "#34475A", roofTile: "#A9573F", roofGrey: "#7C8590",
  red: "#C8473D", orange: "#E08A3C", yellow: "#EBC24B", taxi: "#EBC02F", ink: "#2B2F36", skin1: "#E2B48F", skin2: "#C98F6A", skin3: "#A76F4C",
  neon: "#C65CFF", neonCyan: "#4FE0E0", warm: "#FFD27A", warmDeep: "#F5A94A", leaf: "#5F9B4F", leaf2: "#4C8742", leaf3: "#7DB45A",
} as const;

export type LightId = "sabah" | "ogle" | "aksam" | "gece";
export type LightPreset = {
  id: LightId; label: string;
  bg: string; fogNear: number; fogFar: number;
  hemiSky: string; hemiGround: string; hemiI: number;
  sun: string; sunI: number; sunPos: [number, number, number];
  fill: string; fillI: number;
  /** 0..1: yanan pencere olasılığı */
  windows: number;
  /** 0..1: lamba/tabela parıltısı */
  lamps: number;
  neon: number;
};

export const LIGHTS: Record<LightId, LightPreset> = {
  sabah: { id: "sabah", label: "Sabah", bg: "#8FC3EA", fogNear: 220, fogFar: 380, hemiSky: "#FFF0D2", hemiGround: "#8E8574", hemiI: 1.9, sun: "#FFD9A6", sunI: 2.5, sunPos: [34, 20, 10], fill: "#BFD6F0", fillI: 0.35, windows: 0.12, lamps: 0.0, neon: 0.0 },
  ogle: { id: "ogle", label: "Öğle", bg: "#53A9F2", fogNear: 260, fogFar: 420, hemiSky: "#FFFFFF", hemiGround: "#A39A84", hemiI: 2.05, sun: "#FFE6B8", sunI: 2.9, sunPos: [26, 34, 16], fill: "#CFE2F5", fillI: 0.3, windows: 0.0, lamps: 0.0, neon: 0.0 },
  aksam: { id: "aksam", label: "Akşam (mavi saat)", bg: "#35456B", fogNear: 200, fogFar: 340, hemiSky: "#7E93C4", hemiGround: "#3A3038", hemiI: 1.7, sun: "#FF9D6A", sunI: 1.9, sunPos: [-10, 9, 30], fill: "#6F86C2", fillI: 0.55, windows: 0.4, lamps: 0.85, neon: 0.6 },
  gece: { id: "gece", label: "Gece", bg: "#0E1428", fogNear: 180, fogFar: 320, hemiSky: "#4A5C92", hemiGround: "#1B1A26", hemiI: 1.45, sun: "#8EA2E0", sunI: 1.15, sunPos: [-14, 26, 18], fill: "#4A5C92", fillI: 0.6, windows: 0.5, lamps: 1.0, neon: 1.0 },
};
export const LIGHT_IDS = Object.keys(LIGHTS) as LightId[];
