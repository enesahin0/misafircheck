// `npm run audio` — yer tutucu sesleri sentezler (yoksa) ve ses manifestini yeniler.
import { generatePlaceholderAudio, writeManifest } from "./lib/audio";

const force = process.argv.includes("--force");
const made = generatePlaceholderAudio(force);
const files = writeManifest();
console.log(made.length ? `Sentezlenen yer tutucu ses: ${made.length}` : "Yer tutucu sesler hazır.");
console.log(`public/audio içinde ${files.length} ses dosyası bulundu.`);
