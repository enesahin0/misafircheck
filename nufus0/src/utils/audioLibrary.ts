// Etiketli ses kütüphanesi araması. Hem Node (doğrulama/CLI) hem tarayıcı (render) tarafından kullanılır.
// Aynı sorgu + aynı kütüphane = HER ZAMAN aynı dosya (deterministik): sonuçlar kimliğe göre sıralanır.
export type LibEntry = { id: string; path: string; pack: string; tags: string[] };

const norm = (s: string) => s.toLowerCase().replace(/ı/g, "i");

export const findInLibrary = (entries: LibEntry[], query: string): LibEntry[] => {
  const tokens = norm(query).split(/[\s,]+/).filter(Boolean);
  if (!tokens.length) return [];
  return entries
    .filter((e) => tokens.every((t) => e.tags.some((tag) => tag === t || tag.startsWith(t))))
    .sort((a, b) => a.id.localeCompare(b.id));
};

export const pickFromLibrary = (entries: LibEntry[], query: string, pick = 0): LibEntry | null => {
  const hits = findInLibrary(entries, query);
  return hits.length ? hits[Math.min(pick, hits.length - 1)] : null;
};
