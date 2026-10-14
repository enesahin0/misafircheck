// Rastgelelik YOK — yalnızca tohumlu (seed) deterministik gürültü.
// Aynı kare her render'da aynı pikseli üretir (CLAUDE.md §4).
import { lerp, smooth } from "./time";

export const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const rand = (seed: number, i: number): number => hash(seed * 97.13 + i * 13.37 + 0.5);

/** Pürüzsüz 1B değer gürültüsü, 0..1 */
export const noise1 = (t: number, seed = 0): number => {
  const i = Math.floor(t);
  const f = t - i;
  return lerp(hash(i + seed * 57.3), hash(i + 1 + seed * 57.3), smooth(f));
};

/**
 * Bozuk lamba / titreyen ışık: çoğu zaman yanık, ara sıra kısa kesintiler.
 * 0..1 döner.
 */
export const flicker = (frame: number, seed: number, brokenness = 0.5): number => {
  const slot = Math.floor(frame / 3);
  const r = hash(slot * 1.7 + seed * 31.1);
  if (r < brokenness * 0.45) return 0.05 + 0.2 * hash(slot + seed);
  if (r < brokenness * 0.7) return 0.55 + 0.3 * hash(slot * 2.3 + seed);
  return 1;
};

/** Sinüs tabanlı nabız, 0..1 */
export const pulse = (frame: number, period: number, phase = 0): number =>
  0.5 + 0.5 * Math.sin(((frame + phase) / period) * Math.PI * 2);

/** Kısa "kayıt hatası" darbeleri için: verilen karelerin yakınında 1 döner. */
export const burst = (frame: number, at: number, len: number): number =>
  frame >= at && frame < at + len ? 1 - (frame - at) / len : 0;
