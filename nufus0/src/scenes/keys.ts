// Bölüm verisinde kullanılabilecek sahne-HUD anahtarları (doğrulama betiği bunu kullanır).
export const OVERLAY_KEYS = ["streetDeletion", "announcement", "trace", "population", "archive", "decision", "reveal", "cut"] as const;
export type OverlayKey = (typeof OVERLAY_KEYS)[number];
