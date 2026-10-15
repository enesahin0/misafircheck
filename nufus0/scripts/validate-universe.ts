// `npm run validate:universe` — KOMŞULAR evreni tutarlılık denetimi (id'ler, referanslar, ipucu kuralları).
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";
import * as S from "../src/story/series/schema";

const dir = path.join(ROOT, "src", "story", "series");
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const errors: string[] = [];
const warns: string[] = [];
const dup = (name: string, ids: (string | number)[]) => {
  const seen = new Set<string | number>();
  for (const i of ids) {
    if (seen.has(i)) errors.push(`${name}: yinelenen id '${i}'`);
    seen.add(i);
  }
};

try {
  S.seriesSchema.parse(read("series.json"));
  const building = S.buildingSchema.parse(read("building.json"));
  const chars = S.charactersSchema.parse(read("characters.json"));
  const rel = S.relationshipsSchema.parse(read("relationships.json"));
  const arc = S.seasonArcSchema.parse(read("seasonArc.json"));
  const ledger = S.clueLedgerSchema.parse(read("clueLedger.json"));
  const fmt = S.formatSchema.parse(read("format.json"));
  const eng = S.engagementSchema.parse(read("engagement.json"));
  const mon = S.monetizationSchema.parse(read("monetization.json"));
  const seeds = S.episodeSeedsSchema.parse(read("episodeSeeds.json"));

  const charIds = new Set(chars.characters.map((c) => c.id));
  const flatIds = new Set(building.flats.map((f) => f.id));
  const slotIds = new Set(mon.placementSlots.map((s) => s.id));
  const suspectIds = new Set(arc.suspects.map((s) => s.id));
  dup("karakter", chars.characters.map((c) => c.id));
  dup("daire", building.flats.map((f) => f.id));
  dup("kat", building.floors.map((f) => f.id));
  dup("ipucu", ledger.clues.map((c) => c.id));
  dup("tohum", seeds.seeds.map((s) => s.id));
  dup("döngü", eng.loops.map((l) => l.id));
  dup("yuva", mon.placementSlots.map((s) => s.id));
  dup("hook kalıbı", fmt.hookPatterns.map((x) => x.id));
  dup("karakter rengi", chars.characters.map((c) => c.color.toLowerCase()));

  // karakter ↔ daire tutarlılığı (çift yönlü)
  for (const c of chars.characters) {
    const f = building.flats.find((x) => x.id === c.flat);
    if (!f) { errors.push(`${c.id}: bilinmeyen daire '${c.flat}'`); continue; }
    const listed = f.residents.includes(c.id) || f.pets?.includes(c.id);
    if (!listed) errors.push(`${c.id}: ${c.flat} dairesinin sakin listesinde yok`);
  }
  for (const f of building.flats) {
    for (const r of [...f.residents, ...(f.pets ?? [])]) if (!charIds.has(r)) errors.push(`${f.id}: bilinmeyen sakin '${r}'`);
    for (const s of f.placementSlots) if (!slotIds.has(s)) errors.push(`${f.id}: bilinmeyen yerleştirme yuvası '${s}'`);
    if (f.status === "VACANT" && f.residents.length) errors.push(`${f.id}: VACANT ama sakin var`);
    if (!building.floors.some((fl) => fl.level === f.floor)) errors.push(`${f.id}: bilinmeyen kat ${f.floor}`);
  }
  for (const e of rel.edges) for (const k of [e.a, e.b]) if (!charIds.has(k)) errors.push(`ilişki: bilinmeyen karakter '${k}'`);
  for (const s of arc.suspects) if (!charIds.has(s.id)) errors.push(`şüpheli: bilinmeyen karakter '${s.id}'`);
  for (const sp of arc.subplots) for (const c of sp.chars) if (!charIds.has(c) && !flatIds.has(c)) errors.push(`alt hikâye ${sp.id}: bilinmeyen '${c}'`);

  // ipucu kuralı: her ipucu ≥2 şüpheli, hepsi geçerli
  for (const c of ledger.clues) {
    if (c.supports.length < 2) errors.push(`ipucu ${c.id}: kilit bölümüne kadar en az 2 şüpheyle uyumlu olmalı`);
    for (const s of c.supports) if (!suspectIds.has(s)) errors.push(`ipucu ${c.id}: '${s}' şüpheli listesinde değil`);
    if (c.episodeHint >= arc.culpritPolicy.lockEpisode && c.supports.length < 2) errors.push(`ipucu ${c.id}: kilit bölümünden önce tek şüpheyi gösteremez`);
  }
  // her şüpheli en az 2 ipucuyla desteklenmeli (adil oyun)
  for (const s of arc.suspects) {
    const n = ledger.clues.filter((c) => c.supports.includes(s.id)).length;
    if (n < 2) warns.push(`şüpheli ${s.id}: yalnızca ${n} ipucuyla destekleniyor (adil oyun için ≥2)`);
  }
  // tohumlar
  const firstSentenceWords = (t: string) => t.split(/[.!?]/)[0].trim().split(/\s+/).length;
  for (const s of seeds.seeds) {
    for (const c of s.chars) if (!charIds.has(c)) errors.push(`tohum ${s.id}: bilinmeyen karakter '${c}'`);
    for (const f of s.flats) if (!flatIds.has(f)) errors.push(`tohum ${s.id}: bilinmeyen daire '${f}'`);
    if (s.clue && !ledger.clues.some((c) => c.id === s.clue)) errors.push(`tohum ${s.id}: bilinmeyen ipucu '${s.clue}'`);
    if (s.placementSlot && !slotIds.has(s.placementSlot)) errors.push(`tohum ${s.id}: bilinmeyen yuva '${s.placementSlot}'`);
    if (!fmt.hookPatterns.some((h) => h.id === s.hookPattern)) errors.push(`tohum ${s.id}: bilinmeyen hook kalıbı '${s.hookPattern}'`);
    if (!s.decision.A.label || !s.decision.B.label || !s.decision.A.cost || !s.decision.B.cost) errors.push(`tohum ${s.id}: A/B seçenekleri ve bedelleri dolu olmalı`);
    if (firstSentenceWords(s.hook) > 14) warns.push(`tohum ${s.id}: hook'un ilk cümlesi ${firstSentenceWords(s.hook)} kelime (≤ 12 önerilir)`);
  }

  console.log(`\nKOMŞULAR EVRENİ · ${building.name}`);
  console.log(`  · ${building.flats.length} daire (${building.flats.filter((f) => f.status === "VACANT").length} boş), ${chars.characters.length} karakter, ${rel.edges.length} ilişki`);
  console.log(`  · Sezon gizemi: "${arc.title}" (${arc.suspects.length} şüpheli, ${ledger.clues.length} ipucu, kilit: ${arc.culpritPolicy.lockEpisode}. bölüm)`);
  console.log(`  · ${seeds.seeds.length} bölüm tohumu · ${fmt.hookPatterns.length} hook kalıbı · ${eng.loops.length} etkileşim döngüsü · ${mon.placementSlots.length} marka yuvası`);
} catch (e) {
  errors.push(`Şema hatası: ${(e as Error).message}`);
}
warns.forEach((m) => console.log("  ⚠", m));
errors.forEach((m) => console.log("  ✗", m));
console.log(errors.length ? `\n✗ ${errors.length} hata` : "\n✓ Evren tutarlı");
process.exit(errors.length ? 1 : 0);
