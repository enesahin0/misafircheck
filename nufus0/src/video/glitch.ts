// Glitch SADECE bölüm verisindeki "kayıt/düzeltme hatası" anlarında çalışır (CLAUDE.md §3).
import type { Episode } from "../episodes/schema";
import { hash } from "../utils/deterministic";

export type GlitchState = { power: number; dx: number; bars: { y: number; h: number; dx: number }[] };

export const glitchAt = (ep: Episode, frame: number): GlitchState => {
  let power = 0;
  let at = 0;
  let len = 1;
  for (const g of ep.glitches) {
    if (frame >= g.at && frame < g.at + g.len) {
      const p = g.power * (1 - (frame - g.at) / g.len * 0.6);
      if (p > power) {
        power = p;
        at = g.at;
        len = g.len;
      }
    }
  }
  if (power === 0) return { power: 0, dx: 0, bars: [] };
  const k = frame * 3.1 + at;
  const dx = (hash(k) - 0.5) * 2 * 26 * power;
  const n = 3 + Math.floor(power * 4);
  const bars = Array.from({ length: n }).map((_, i) => ({
    y: hash(k + i * 7.3) * 1700 + 100,
    h: 8 + hash(k + i * 3.7) * 70 * power,
    dx: (hash(k + i * 5.1) - 0.5) * 120 * power,
  }));
  void len;
  return { power, dx, bars };
};
