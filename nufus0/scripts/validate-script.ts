// `npm run script:check -- SAKSI` — bölüm senaryosu denetimi: süre tahmini, hook kuralları, A/B adilliği, referanslar.
// Konuşma hızı varsayımı: sakin anlatıcı ≈ 2,6 kelime/sn + cümle başına 0,3 sn nefes. Gerçek süre ElevenLabs dosyasıyla (sync-audio) netleşir.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";
import * as S from "../src/story/series/schema";

const WPS = 2.6;
const BREATH = 0.3;
const words = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
const sentences = (t: string) => t.split(/[.!?:]+/).map((s) => s.trim()).filter(Boolean).length;
const est = (t: string) => words(t) / WPS + sentences(t) * BREATH;

const key = (process.argv[2] ?? "").toLowerCase();
const dir = path.join(ROOT, "src", "story", "series", "episodes");
const file = fs.readdirSync(dir).find((f) => f.endsWith(".json") && f.toLowerCase().includes(key || "ep"));
if (!file) { console.error("✗ Senaryo bulunamadı: src/story/series/episodes/*" + key + "*.json"); process.exit(1); }

const errors: string[] = [];
const warns: string[] = [];
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(ROOT, "src", "story", "series", f), "utf8"));

try {
  const ep = S.episodeScriptSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")));
  const chars = S.charactersSchema.parse(read("characters.json"));
  const building = S.buildingSchema.parse(read("building.json"));
  const seeds = S.episodeSeedsSchema.parse(read("episodeSeeds.json"));
  const fmt = S.formatSchema.parse(read("format.json"));
  const mon = S.monetizationSchema.parse(read("monetization.json"));

  const charIds = new Set(chars.characters.map((c) => c.id));
  for (const c of ep.cast) if (!charIds.has(c)) errors.push(`cast: bilinmeyen karakter '${c}'`);
  for (const f of ep.flats) if (!building.flats.some((x) => x.id === f)) errors.push(`flats: bilinmeyen daire '${f}'`);
  if (!seeds.seeds.some((s) => s.id === ep.seed)) errors.push(`seed: '${ep.seed}' tohum listesinde yok`);
  if (ep.placementSlot && !mon.placementSlots.some((s) => s.id === ep.placementSlot)) errors.push(`placementSlot: bilinmeyen '${ep.placementSlot}'`);
  for (const h of ep.hookVariants) if (!fmt.hookPatterns.some((p) => p.id === h.pattern)) errors.push(`hook ${h.id}: bilinmeyen kalıp '${h.pattern}'`);

  // vuruşlar bitişik ve 60 sn'yi kapsıyor
  let cur = 0;
  for (const b of ep.beats) {
    if (Math.abs(b.from - cur) > 0.01) errors.push(`vuruş ${b.n} (${b.name}) ${cur} sn'de başlamalı, ${b.from} sn'de başlıyor`);
    cur = b.to;
    for (const t of b.onScreen) if (words(t) > 6) errors.push(`vuruş ${b.n}: ekran yazısı ≤ 6 kelime ('${t}')`);
  }
  if (Math.abs(cur - 60) > 0.01) errors.push(`vuruşlar ${cur} sn'de bitiyor; 60 sn olmalı`);

  // süre tahmini: vuruş başına anlatım sığıyor mu?
  console.log(`\nSENARYO: ${ep.id} · ${ep.title}  [${ep.status}]`);
  let total = 0;
  for (const b of ep.beats) {
    const lines = ep.narration.filter((l) => l.beat === b.n);
    const t = lines.reduce((a, l) => a + est(l.text), 0);
    total += t;
    const len = b.to - b.from;
    const pct = (t / len) * 100;
    const flag = pct > 120 ? "✗" : pct > 100 ? "⚠" : "·";
    console.log(`  ${flag} vuruş ${b.n} ${b.name.padEnd(18)} ${len.toFixed(1)} sn pencere · tahmini anlatım ${t.toFixed(1)} sn (%${pct.toFixed(0)})`);
    if (pct > 120) errors.push(`vuruş ${b.n} (${b.name}): anlatım pencereye sığmıyor (%${pct.toFixed(0)}) — kısalt veya pencereyi uzat`);
    else if (pct > 100) warns.push(`vuruş ${b.n} (${b.name}): anlatım pencereyi %${(pct - 100).toFixed(0)} aşıyor`);
    if (!lines.length && b.n !== 6) warns.push(`vuruş ${b.n}: anlatım satırı yok`);
  }
  const nWords = ep.narration.reduce((a, l) => a + words(l.text), 0);
  console.log(`  · toplam ${nWords} kelime, tahmini anlatım ${total.toFixed(1)} sn / 60 (boşluk: ${(60 - total).toFixed(1)} sn müzik/sessizlik/görsel an)`);
  if (total > 56) errors.push(`toplam anlatım ${total.toFixed(1)} sn; ≤ 56 sn olmalı`);
  if (total < 30) warns.push("anlatım çok kısa; bölüm boş kalabilir");

  // hook kuralları
  const first = ep.narration[0]?.text ?? "";
  if (words(first) > 9) warns.push(`ilk anlatım cümlesi ${words(first)} kelime (≤ 9 önerilir)`);
  for (const h of ep.hookVariants) {
    const fs0 = h.text.split(/[.!?]/)[0];
    if (words(fs0) > 12) warns.push(`hook ${h.id}: ilk cümle ${words(fs0)} kelime (≤ 12)`);
    for (const t of h.onScreen) if (words(t) > 6) errors.push(`hook ${h.id}: ekran yazısı ≤ 6 kelime ('${t}')`);
  }

  // karar adilliği
  if (!ep.decision.A.cost || !ep.decision.B.cost) errors.push("A/B bedelleri dolu olmalı");
  const la = words(ep.decision.A.label + ep.decision.A.cost);
  const lb = words(ep.decision.B.label + ep.decision.B.cost);
  if (Math.abs(la - lb) > 8) warns.push(`A/B tanımları dengesiz (${la} / ${lb} kelime)`);
  if (!ep.narration.some((l) => /yoruma/i.test(l.text) && /\bA\b/.test(l.text))) warns.push("anlatımda 'yoruma A ya da B yaz' çağrısı yok");
  if (!ep.caption.includes("kurgusal")) errors.push("açıklamada 'kurgusal' notu olmalı");

  console.log(`  · hook varyantları: ${ep.hookVariants.map((h) => h.pattern).join(", ")} · yuva: ${ep.placementSlot ?? "yok"} · ipucu: ${ep.clue ?? "yok"}`);
} catch (e) {
  errors.push("Şema hatası: " + (e as Error).message);
}
warns.forEach((m) => console.log("  ⚠", m));
errors.forEach((m) => console.log("  ✗", m));
console.log(errors.length ? `\n✗ ${errors.length} hata` : "\n✓ Senaryo geçerli");
process.exit(errors.length ? 1 : 0);
