// Zaman ve değer yardımcıları. Her şey kareye (frame) bağlı ve deterministiktir.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const sec = (s: number) => Math.round(s * FPS);

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) => (a === b ? 0 : clamp((v - a) / (b - a)));
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number) => Math.pow(clamp(t), 3);

/**
 * [kare, değer] çiftlerinden oluşan parça parça eğri. Varsayılan geçiş smoothstep;
 * anahtarın 3. elemanı "l" ise ONA doğru doğrusal, "s" ise ONA doğru basamak (anında) geçiş.
 */
export type Track = ReadonlyArray<readonly [number, number] | readonly [number, number, "l" | "s"]>;

export const sampleTrack = (track: Track | undefined, frame: number, fallback = 0): number => {
  if (!track || track.length === 0) return fallback;
  if (frame <= track[0][0]) return track[0][1];
  const last = track[track.length - 1];
  if (frame >= last[0]) return last[1];
  for (let i = 0; i < track.length - 1; i++) {
    const [f0, v0] = track[i];
    const [f1, v1, mode] = track[i + 1] as readonly [number, number, ("l" | "s")?];
    if (frame >= f0 && frame <= f1) {
      if (mode === "s") return frame >= f1 ? v1 : v0;
      const t = (frame - f0) / Math.max(1, f1 - f0);
      return lerp(v0, v1, mode === "l" ? t : smooth(t));
    }
  }
  return last[1];
};

/** Kare numarasını "SS:KK" (saniye:kare) olarak yazar. */
export const frameClock = (frame: number) => {
  const s = Math.floor(frame / FPS);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export const degToRad = (d: number) => (d * Math.PI) / 180;
