import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./audio";
import { worldStateSchema, type Episode, type WorldState } from "../../src/episodes/schema";

export const loadEpisode = async (id: string): Promise<Episode> => {
  const file = path.join(ROOT, "src", "episodes", `episode${id}.ts`);
  if (!fs.existsSync(file)) throw new Error(`Bölüm dosyası yok: src/episodes/episode${id}.ts`);
  const mod = await import(file);
  const ep = mod[`episode${id}`];
  if (!ep) throw new Error(`episode${id}.ts içinde 'export const episode${id}' bulunamadı.`);
  return ep as Episode;
};

export const loadWorldState = (): WorldState =>
  worldStateSchema.parse(JSON.parse(fs.readFileSync(path.join(ROOT, "src", "story", "worldState.json"), "utf8")));
