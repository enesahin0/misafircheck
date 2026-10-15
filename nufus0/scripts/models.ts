// `npm run models` → dizini yenile + paketleri listele.   `npm run models -- sofa` → model ara.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";
import { writeModelIndex } from "./lib/models";
import { findModels, type ModelEntry } from "../src/utils/modelLibrary";

const r = writeModelIndex();
if (r.unlicensed.length) {
  console.error(`✗ Lisans defterinde olmayan model paketi: ${r.unlicensed.join(", ")} (public/models/ledger.json)`);
  process.exit(1);
}
const q = process.argv.slice(2).join(" ");
if (!q) {
  console.log(`3D model kütüphanesi: ${r.count} model, ${r.packs.length} paket`);
  r.packs.forEach((p) => console.log("  ·", p));
  console.log("\nArama: npm run models -- <etiket> [etiket...]   (ör. sofa, table lamp, building)");
  process.exit(0);
}
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "generated", "modelIndex.json"), "utf8")).entries as ModelEntry[];
const hits = findModels(entries, q);
console.log(`'${q}' → ${hits.length} model`);
hits.slice(0, 40).forEach((h, i) => console.log(`  [${i}] ${h.id}`));
if (hits.length > 40) console.log(`  ... +${hits.length - 40} daha`);
