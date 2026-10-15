// `npm run sfx -- <etiketler>` — kütüphanede ses ara. Örn: npm run sfx -- footstep carpet
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";
import { findInLibrary, type LibEntry } from "../src/utils/audioLibrary";

const q = process.argv.slice(2).join(" ");
const idx = path.join(ROOT, "src", "generated", "audioLibrary.json");
if (!fs.existsSync(idx)) {
  console.error("Önce `npm run audio` çalıştırın.");
  process.exit(1);
}
const entries = JSON.parse(fs.readFileSync(idx, "utf8")).entries as LibEntry[];
if (!q) {
  const packs = new Map<string, number>();
  entries.forEach((e) => packs.set(e.pack, (packs.get(e.pack) ?? 0) + 1));
  console.log(`Kütüphane: ${entries.length} ses`);
  packs.forEach((n, p) => console.log(`  · ${p}: ${n}`));
  console.log("\nArama: npm run sfx -- <etiket> [etiket...]   (ör. door close, impact heavy, footstep)");
  process.exit(0);
}
const hits = findInLibrary(entries, q);
console.log(`'${q}' → ${hits.length} sonuç`);
hits.slice(0, 40).forEach((h, i) => console.log(`  [${i}] ${h.id}   (${h.tags.join(", ")})`));
if (hits.length > 40) console.log(`  ... +${hits.length - 40} daha`);
console.log('\nBölüm verisinde kullanım: { id: "...", tag: "' + q + '", pick: 0, from: <kare>, volume: 0.5 }');
