// `npm run validate` — bölüm verisini + dünya sürekliliğini kontrol eder.
import { writeManifest } from "./lib/audio";
import { writeModelIndex } from "./lib/models";
import { loadEpisode, loadWorldState } from "./lib/load";
import { printReport, validateEpisode } from "./lib/validate";

(async () => {
  const id = process.argv.slice(2).find((a) => !a.startsWith("-")) ?? "001";
  writeManifest();
  writeModelIndex();
  console.log(`\nDOSYA ${id} doğrulanıyor...`);
  const rep = validateEpisode(await loadEpisode(id), loadWorldState());
  printReport(rep);
  process.exit(rep.errors.length ? 1 : 0);
})().catch((e) => {
  console.error("✗", e.message ?? e);
  process.exit(1);
});
