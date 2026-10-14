// Sahne geçişleri: çoğu kamera hareketi sürekli; sadece dramatik noktada sert kesme.
import type { Episode } from "../episodes/schema";

/** Son kart öncesi hızlı siyah kesme: [from, to) arası tam siyah. */
export const FINAL_CUT_FRAME = 1766;

export const blackAlpha = (ep: Episode, frame: number): number => {
  if (frame >= FINAL_CUT_FRAME) return 1;
  // 3 karelik hızlı kararma (kesme hissi)
  if (frame >= FINAL_CUT_FRAME - 3) return (frame - (FINAL_CUT_FRAME - 3)) / 3;
  void ep;
  return 0;
};
