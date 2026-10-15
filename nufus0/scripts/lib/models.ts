// 3D model dizini: public/models/** altındaki .glb dosyalarını etiketler → src/generated/modelIndex.json
// Lisans defteri (public/models/ledger.json) ile karşılaştırır: defterde olmayan paket = HATA.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./audio";

const DIR = path.join(ROOT, "public", "models");
const walk = (d: string, out: string[] = []): string[] => {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.toLowerCase().endsWith(".glb")) out.push(p);
  }
  return out;
};

export const writeModelIndex = () => {
  const entries = walk(DIR).map((p) => {
    const pack = path.relative(DIR, path.dirname(p)).split(path.sep).join("/");
    const base = path.basename(p, ".glb");
    const tags = [
      ...new Set([
        ...base.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-.]+/g, " ").replace(/\d+/g, " ").toLowerCase().split(/\s+/).filter(Boolean),
        ...pack.replace(/^kenney\//, "").split("-"),
      ]),
    ];
    return { id: `${pack}/${base}`, path: path.relative(path.join(ROOT, "public"), p).split(path.sep).join("/"), pack, tags };
  });
  entries.sort((a, b) => a.id.localeCompare(b.id));
  const out = path.join(ROOT, "src", "generated");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "modelIndex.json"), JSON.stringify({ entries }, null, 1) + "\n");
  const ledgerPath = path.join(DIR, "ledger.json");
  const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf8")).packs : {};
  const unlicensed = [...new Set(entries.map((e) => e.pack))].filter((p) => !ledger[p]);
  return { count: entries.length, unlicensed, packs: [...new Set(entries.map((e) => e.pack))] };
};
