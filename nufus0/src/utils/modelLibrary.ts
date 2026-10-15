// Etiketli 3D model kütüphanesi araması (deterministik: sonuçlar kimliğe göre sıralanır).
export type ModelEntry = { id: string; path: string; pack: string; tags: string[] };

export const findModels = (entries: ModelEntry[], query: string): ModelEntry[] => {
  const tokens = query.toLowerCase().split(/[\s,]+/).filter(Boolean);
  if (!tokens.length) return [];
  return entries
    .filter((e) => tokens.every((t) => e.tags.some((tag) => tag === t || tag.startsWith(t))))
    .sort((a, b) => a.id.localeCompare(b.id));
};
