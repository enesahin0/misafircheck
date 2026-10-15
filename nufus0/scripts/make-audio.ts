// `npm run audio` — yer tutucu sesleri sentezler (yoksa), ses manifestini ve kütüphane dizinini yeniler.
import { generatePlaceholderAudio, writeLibraryIndex, writeManifest } from "./lib/audio";
import { writeModelIndex } from "./lib/models";

const force = process.argv.includes("--force");
const made = generatePlaceholderAudio(force);
const files = writeManifest();
const lib = writeLibraryIndex();
const models = writeModelIndex();
console.log(made.length ? `Sentezlenen yer tutucu ses: ${made.length}` : "Yer tutucu sesler hazır.");
console.log(`public/audio içinde ${files.length} ses dosyası; kütüphanede ${lib.count} etiketli ses.`);
console.log(`3D model dizini: ${models.count} model.`);
if (models.unlicensed.length) {
  console.error(`✗ Lisans defterinde olmayan model paketi: ${models.unlicensed.join(", ")}`);
  process.exit(1);
}
if (lib.unlicensed.length) {
  console.error(`✗ Lisans defterinde olmayan paket(ler): ${lib.unlicensed.join(", ")} — public/audio/library/ledger.json'a ekleyin ya da dosyaları kaldırın.`);
  process.exit(1);
}
