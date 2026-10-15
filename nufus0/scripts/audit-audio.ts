// `npm run audio:audit -- 001 [--commercial]` — bölümde kullanılan kütüphane seslerinin lisans dökümü + atıf metni.
//   --commercial : ticari olmayan (NC) ses varsa HATA verir (reklam/monetizasyon öncesi çalıştır).
import fs from "node:fs";
import path from "node:path";
import { ROOT, writeManifest } from "./lib/audio";
import { loadEpisode } from "./lib/load";
import { pickFromLibrary, type LibEntry } from "../src/utils/audioLibrary";

(async () => {
  const id = process.argv.slice(2).find((a) => !a.startsWith("-")) ?? "001";
  const commercial = process.argv.includes("--commercial");
  writeManifest();
  const ep = await loadEpisode(id);
  const lib = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "generated", "audioLibrary.json"), "utf8")).entries as LibEntry[];
  const byPath = new Map(lib.map((e) => [e.path, e]));
  const used = new Map<string, LibEntry>();
  const add = (e?: LibEntry | null) => e && used.set(e.id, e);
  for (const s of ep.audio.sfx) add(s.lib ? lib.find((e) => e.id === s.lib) : s.tag ? pickFromLibrary(lib, s.tag, s.pick ?? 0) : byPath.get(`audio/${s.src}`));
  if (ep.audio.music) add(ep.audio.music.lib ? lib.find((e) => e.id === ep.audio.music!.lib) : byPath.get(`audio/${ep.audio.music.src}`));

  const list = [...used.values()];
  console.log(`\nDOSYA ${id} — kütüphaneden ${list.length} ses kullanılıyor (üretilen yer tutucular hariç)\n`);
  const nc = list.filter((e) => e.commercialOk === false);
  const attr = list.filter((e) => e.attribution);
  list.forEach((e) => console.log(`  · ${e.id}  [${e.license ?? "?"}${e.commercialOk === false ? " · TİCARİ DEĞİL" : ""}]`));
  if (attr.length) {
    console.log("\nAçıklamaya eklenecek atıflar:");
    [...new Set(attr.map((e) => e.attribution as string))].forEach((a) => console.log("  " + a));
  }
  if (nc.length) {
    console.log(`\n⚠ ${nc.length} ses TİCARİ DEĞİL (reklam/monetizasyon öncesi değiştirilmeli):`);
    nc.forEach((e) => console.log("  - " + e.id));
  } else {
    console.log("\n✓ Kullanılan tüm sesler ticari kullanıma uygun.");
  }
  process.exit(commercial && nc.length ? 1 : 0);
})();
