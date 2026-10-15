// `npm run validate:universe` — Evren İncili tutarlılık denetimi (id'ler, referanslar, kapı numaraları).
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";
import * as S from "../src/story/universe/schema";

const dir = path.join(ROOT, "src", "story", "universe");
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const errors: string[] = [];
const warns: string[] = [];
const dup = (name: string, ids: (string | number | null)[]) => {
  const seen = new Set<string | number>();
  for (const i of ids) {
    if (i === null) continue;
    if (seen.has(i)) errors.push(`${name}: yinelenen id/numara '${i}'`);
    seen.add(i);
  }
};

try {
  const building = S.buildingSchema.parse(read("building.json"));
  const rules = S.rulesSchema.parse(read("rules.json"));
  const chars = S.charactersSchema.parse(read("characters.json"));
  const eng = S.engagementSchema.parse(read("engagement.json"));
  S.formatsSchema.parse(read("formats.json"));
  const kits = S.roomKitsSchema.parse(read("roomKits.json"));
  const seeds = S.seedsSchema.parse(read("anomalySeeds.json"));

  dup("kural", rules.rules.map((r) => r.id));
  dup("karakter", chars.characters.map((c) => c.id));
  dup("etkileşim", eng.loops.map((l) => l.id));
  dup("kit", kits.kits.map((k) => k.id));
  dup("daire id", building.units.map((u) => u.id));
  dup("kapı numarası", building.units.map((u) => u.door));
  dup("tohum", seeds.seeds.map((s) => s.id));

  const kitIds = new Set(kits.kits.map((k) => k.id));
  const charIds = new Set(chars.characters.map((c) => c.id));
  const floorLevels = new Set(building.floors.map((f) => f.level));
  const unitById = new Map(building.units.map((u) => [u.id, u]));
  const unitByDoor = new Map(building.units.filter((u) => u.door !== null).map((u) => [u.door as number, u]));
  const seedIds = new Set(seeds.seeds.map((s) => s.id));

  for (const u of building.units) {
    if (!floorLevels.has(u.floor)) errors.push(`${u.id}: bilinmeyen kat ${u.floor}`);
    if (!kitIds.has(u.roomKit)) errors.push(`${u.id}: bilinmeyen roomKit '${u.roomKit}'`);
    if (u.door !== null && u.door > 0 && u.door !== u.floor * 10 + u.slot) errors.push(`${u.id}: kapı numarası kat*10+sıra olmalı (${u.floor * 10 + u.slot}), ${u.door} yazılı`);
    for (const r of u.residents) if (!charIds.has(r)) errors.push(`${u.id}: bilinmeyen sakin '${r}'`);
    if (u.anomalySeed && !seedIds.has(u.anomalySeed)) errors.push(`${u.id}: bilinmeyen anomalySeed '${u.anomalySeed}'`);
    if (u.status === "OPENED" && !u.openedAtEpisode) errors.push(`${u.id}: OPENED ama openedAtEpisode yok (süreklilik)`);
    if (u.status === "SEALED" && u.openedAtEpisode) errors.push(`${u.id}: SEALED ama openedAtEpisode dolu`);
  }
  const doorsUsed = new Map<number, string>();
  for (const s of seeds.seeds) {
    if (!kitIds.has(s.roomKit)) errors.push(`tohum ${s.id}: bilinmeyen roomKit '${s.roomKit}'`);
    if (s.suggestedDoor !== null) {
      const u = unitByDoor.get(s.suggestedDoor);
      if (!u) errors.push(`tohum ${s.id}: önerilen kapı ${s.suggestedDoor} binada yok`);
      else if (s.status === "IDEA" && u.status !== "SEALED") errors.push(`tohum ${s.id}: önerilen kapı ${s.suggestedDoor} SEALED değil (${u.status})`);
      if (doorsUsed.has(s.suggestedDoor)) errors.push(`tohum ${s.id} ve ${doorsUsed.get(s.suggestedDoor)} aynı kapıyı (${s.suggestedDoor}) istiyor`);
      doorsUsed.set(s.suggestedDoor, s.id);
    }
  }
  for (const k of kits.kits) if (k.status === "built" && !fs.existsSync(path.join(ROOT, k.file))) errors.push(`kit ${k.id}: 'built' ama dosya yok: ${k.file}`);

  const sealed = building.units.filter((u) => u.status === "SEALED").length;
  const planned = kits.kits.filter((k) => k.status === "planned").length;
  console.log(`\nEVREN İNCİLİ · ${building.name}`);
  console.log(`  · ${building.units.length} birim (${sealed} mühürlü), ${rules.rules.length} kural, ${chars.characters.length} karakter, ${eng.loops.length} etkileşim döngüsü`);
  console.log(`  · ${seeds.seeds.length} anomali tohumu (${seeds.seeds.filter((s) => s.suggestedDoor === null).length} tanesi kapı atanmamış)`);
  if (planned) warns.push(`${planned} mekân kiti henüz 'planned' (3D olarak yazılacak).`);
  void unitById;
} catch (e) {
  errors.push(`Şema hatası: ${(e as Error).message}`);
}
warns.forEach((m) => console.log("  ⚠", m));
errors.forEach((m) => console.log("  ✗", m));
console.log(errors.length ? `\n✗ ${errors.length} hata` : "\n✓ Evren tutarlı");
process.exit(errors.length ? 1 : 0);
