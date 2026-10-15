// `npm run validate:universe` — MAHALLE evreni tutarlılık denetimi (id'ler, referanslar, kadro, ilişkiler, olay dağılımı, ipucu adilliği).
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";
import * as S from "../src/story/series/schema";
import { COLS, FILLERS, PLACES, ROWS, STATIONS, VENUES, shotFor } from "../src/world/mahalle/layout";
import { SEASON_IDS as KIT_SEASONS, SEASONS as KIT_SEASON_DATA } from "../src/world/mahalle/seasons";

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
  const nh = S.neighborhoodSchema.parse(read("neighborhood.json"));
  const building = S.buildingSchema.parse(read("building.json"));
  const chars = S.charactersSchema.parse(read("characters.json"));
  const rel = S.relationshipsSchema.parse(read("relationships.json"));
  const ev = S.eventCatalogSchema.parse(read("eventCatalog.json"));
  const arcs = S.arcsSchema.parse(read("arcs.json"));
  const gundem = S.gundemSchema.parse(read("gundem.json"));
  const season = S.seasonArcSchema.parse(read("seasonArc.json"));
  const ledger = S.clueLedgerSchema.parse(read("clueLedger.json"));
  const fmt = S.formatSchema.parse(read("format.json"));
  const eng = S.engagementSchema.parse(read("engagement.json"));
  const mon = S.monetizationSchema.parse(read("monetization.json"));
  const seeds = S.episodeSeedsSchema.parse(read("episodeSeeds.json"));

  const C = chars.characters;
  const charById = new Map(C.map((c) => [c.id, c]));
  const venueIds = new Set(nh.venues.map((v) => v.id));
  const flatIds = new Set(building.flats.map((f) => f.id));
  const slotIds = new Set(mon.placementSlots.map((s) => s.id));
  const guestIds = new Set(arcs.guestSystem.examples.map((g) => g.id).concat(["MISAFIR"]));
  const suspectIds = new Set(season.suspects.map((s) => s.id));
  dup("karakter", C.map((c) => c.id));
  dup("karakter rengi", C.map((c) => c.color.toLowerCase()));
  dup("mekân", nh.venues.map((v) => v.id));
  dup("mekân hücresi", nh.venues.filter((v) => v.type !== "public" && !v.elevation).map((v) => `${v.cell}`));
  dup("daire", building.flats.map((f) => f.id));
  dup("ipucu", ledger.clues.map((c) => c.id));
  dup("tohum", seeds.seeds.map((s) => s.id));
  dup("yay", arcs.arcs.map((a) => a.id));
  dup("olay türü", ev.types.map((t) => t.id));
  dup("döngü", eng.loops.map((l) => l.id));
  dup("yuva", mon.placementSlots.map((s) => s.id));
  dup("hook kalıbı", fmt.hookPatterns.map((x) => x.id));

  // harita: hücreler sınır içinde
  for (const v of nh.venues) {
    if (v.cell[0] < 0 || v.cell[0] >= nh.grid.cols || v.cell[1] < 0 || v.cell[1] >= nh.grid.rows) errors.push(`mekân ${v.id}: hücre ${v.cell} harita dışında`);
    if (v.owner && !charById.has(v.owner)) errors.push(`mekân ${v.id}: bilinmeyen sahip '${v.owner}'`);
    for (const s of v.staff) if (!charById.has(s)) errors.push(`mekân ${v.id}: bilinmeyen personel '${s}'`);
    for (const s of v.placementSlots) if (!slotIds.has(s)) errors.push(`mekân ${v.id}: bilinmeyen yuva '${s}'`);
    if (v.ref && !fs.existsSync(path.join(dir, v.ref))) errors.push(`mekân ${v.id}: ref dosyası yok '${v.ref}'`);
  }
  // kadro ↔ mekân/daire
  for (const c of C) {
    if (flatIds.has(c.home)) {
      const f = building.flats.find((x) => x.id === c.home)!;
      if (!f.residents.includes(c.id) && !f.pets?.includes(c.id)) errors.push(`${c.id}: ${c.home} dairesinin sakin listesinde yok`);
    } else if (venueIds.has(c.home)) {
      const v = nh.venues.find((x) => x.id === c.home)!;
      if (v.owner !== c.id && !v.staff.includes(c.id)) errors.push(`${c.id}: ${c.home} mekânında sahip/personel değil`);
    } else errors.push(`${c.id}: bilinmeyen ev/mekân '${c.home}'`);
  }
  for (const f of building.flats) {
    for (const r of [...f.residents, ...(f.pets ?? [])]) if (!charById.has(r)) errors.push(`${f.id}: bilinmeyen sakin '${r}'`);
    for (const s of f.placementSlots) if (!slotIds.has(s)) errors.push(`${f.id}: bilinmeyen yuva '${s}'`);
  }
  // ilişkiler
  const seenEdge = new Set<string>();
  const degree = new Map<string, number>();
  for (const e of rel.edges) {
    for (const k of [e.from, e.to]) {
      if (!charById.has(k)) errors.push(`ilişki: bilinmeyen karakter '${k}'`);
      degree.set(k, (degree.get(k) ?? 0) + 1);
    }
    const key = `${e.from}>${e.to}`;
    if (seenEdge.has(key)) errors.push(`ilişki: yinelenen yönlü kenar ${key}`);
    seenEdge.add(key);
    if (e.from === e.to) errors.push(`ilişki: kendine kenar (${e.from})`);
  }
  for (const c of C.filter((x) => x.tier === "CORE")) if ((degree.get(c.id) ?? 0) < 2) warns.push(`CORE karakter ${c.id}: yalnızca ${degree.get(c.id) ?? 0} ilişki (≥2 önerilir)`);
  const hates = rel.edges.filter((e) => e.affinity <= -2).length;
  const loves = rel.edges.filter((e) => e.affinity >= 4).length;
  if (hates < 3 || loves < 3) warns.push(`ilişki dengesi: nefret ${hates}, sevgi ${loves} (her ikisinden ≥3 olmalı)`);
  // olay dağılımı
  const sum = ev.types.reduce((a, t) => a + t.per30, 0);
  if (sum < 28 || sum > 33) errors.push(`olay türleri 30 bölümde toplam ${sum.toFixed(1)}; 28–33 arası olmalı`);
  for (const t of ev.types) for (const p of t.places) if (!venueIds.has(p)) errors.push(`olay ${t.id}: bilinmeyen mekân '${p}'`);
  const rare = ev.types.filter((t) => t.id.startsWith("NADIR_"));
  if (!rare.every((t) => (t.rules?.length ?? 0) > 0)) errors.push("NADİR olay türlerinin (düğün/yas) koruma kuralları olmalı");
  // yaylar + konuklar + korkuluklar
  for (const a of arcs.arcs) {
    for (const p of a.where) if (!venueIds.has(p)) errors.push(`yay ${a.id}: bilinmeyen mekân '${p}'`);
    for (const c of a.chars) if (!charById.has(c) && !guestIds.has(c)) errors.push(`yay ${a.id}: bilinmeyen karakter '${c}'`);
    if (a.id === "ARC_ASK") for (const c of a.chars) { const ch = charById.get(c); if (ch && ch.age !== null && ch.age < 18) errors.push(`yay ${a.id}: reşit olmayan karakter '${c}' romantik yayda yer alamaz`); }
  }
  const minors = C.filter((c) => c.age !== null && c.age < 18).map((c) => c.id);
  for (const a of arcs.arcs) if (/romantik|aşk|sevgili/i.test(a.summary) && a.chars.some((c) => minors.includes(c))) errors.push(`yay ${a.id}: reşit olmayan karakter romantik içerikte`);
  if (arcs.arcs.filter((a) => a.status === "ACTIVE").length > 3) errors.push("aynı anda en çok 3 aktif yay olabilir");
  // şüpheliler + ipuçları (adil oyun)
  for (const s of season.suspects) if (!charById.has(s.id)) errors.push(`şüpheli: bilinmeyen karakter '${s.id}'`);
  for (const c of ledger.clues) {
    if (c.supports.length < 2) errors.push(`ipucu ${c.id}: ≥2 şüpheyle uyumlu olmalı`);
    for (const s of c.supports) if (!suspectIds.has(s)) errors.push(`ipucu ${c.id}: '${s}' şüpheli listesinde değil`);
  }
  for (const s of season.suspects) if (ledger.clues.filter((c) => c.supports.includes(s.id)).length < 2) warns.push(`şüpheli ${s.id}: <2 ipucu (adil oyun)`);
  // gündem politikası tutarlılığı
  for (const x of gundem.adaptationExamples) for (const p of x.places) if (!venueIds.has(p) && !flatIds.has(p)) errors.push(`gündem örneği: bilinmeyen mekân '${p}'`);
  // tohumlar
  const firstWords = (t: string) => t.split(/[.!?]/)[0].trim().split(/\s+/).length;
  for (const s of seeds.seeds) {
    for (const c of s.chars) if (!charById.has(c)) errors.push(`tohum ${s.id}: bilinmeyen karakter '${c}'`);
    for (const f of s.flats) if (!flatIds.has(f)) errors.push(`tohum ${s.id}: bilinmeyen daire '${f}'`);
    for (const p of s.places) if (!venueIds.has(p)) errors.push(`tohum ${s.id}: bilinmeyen mekân '${p}'`);
    if (!ev.types.some((t) => t.id === s.eventType)) errors.push(`tohum ${s.id}: bilinmeyen olay türü '${s.eventType}'`);
    if (s.clue && !ledger.clues.some((c) => c.id === s.clue)) errors.push(`tohum ${s.id}: bilinmeyen ipucu '${s.clue}'`);
    if (s.placementSlot && !slotIds.has(s.placementSlot)) errors.push(`tohum ${s.id}: bilinmeyen yuva '${s.placementSlot}'`);
    if (!fmt.hookPatterns.some((h) => h.id === s.hookPattern)) errors.push(`tohum ${s.id}: bilinmeyen hook kalıbı '${s.hookPattern}'`);
    if (!s.decision.A.label || !s.decision.B.label || !s.decision.A.cost || !s.decision.B.cost) errors.push(`tohum ${s.id}: A/B seçenekleri ve bedelleri dolu olmalı`);
    if (firstWords(s.hook) > 14) warns.push(`tohum ${s.id}: hook'un ilk cümlesi ${firstWords(s.hook)} kelime (≤12 önerilir)`);
  }
  // mekân çeşitliliği: tohumlar yalnız tek mekâna yığılmasın
  const placeUse = new Map<string, number>();
  for (const s of seeds.seeds) for (const p of s.places) placeUse.set(p, (placeUse.get(p) ?? 0) + 1);
  const unused = nh.venues.filter((v) => !placeUse.has(v.id)).map((v) => v.id);
  if (unused.length) warns.push(`hiçbir tohumda kullanılmayan mekân: ${unused.join(", ")}`);

  // 3D kit: her hücre mekân ya da dolgu; her mekânın yerleşimi, kamera planı ve istasyonları var
  const covered = new Set<string>();
  for (const v of VENUES) covered.add(v.cell.join(","));
  for (const f of FILLERS) {
    const k = f.cell.join(",");
    if (covered.has(k)) errors.push(`3D kit: dolgu hücresi ${k} zaten bir mekâna ait`);
    covered.add(k);
  }
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (!covered.has(`${c},${r}`)) errors.push(`3D kit: hücre ${c},${r} boş (mekân veya dolgu ekle)`);
  for (const v of nh.venues) {
    if (!PLACES[v.id]) errors.push(`3D kit: mekân '${v.id}' için yerleşim (PLACES) yok`);
    for (const k of ["genis", "orta", "yakin", "kart"]) {
      try { shotFor(`${v.id}:${k}`); } catch (e) { errors.push(`3D kit: ${v.id}:${k} planı kurulamadı (${(e as Error).message})`); }
    }
  }
  for (const [id] of Object.entries(STATIONS)) if (!charById.has(id)) errors.push(`3D kit: istasyon karakteri '${id}' yok`);
  for (const c of C) if (c.tier === "CORE" && !STATIONS[c.id] && !["suleyman", "cemal", "pasa"].includes(c.id)) warns.push(`3D kit: CORE karakter '${c.id}' için varsayılan istasyon yok`);

  // mevsimler: 4 mevsim, 12 ay eşlenmiş, kit verisiyle aynı
  const seasonData = S.seasonsSchema.parse(read("seasons.json"));
  for (let m = 1; m <= 12; m++) if (!seasonData.monthMap[String(m)]) errors.push(`mevsimler: ${m}. ay eşlenmemiş`);
  for (const id of S.SEASON_IDS) {
    const sd = seasonData.seasons.find((x) => x.id === id);
    if (!sd) { errors.push(`mevsimler: '${id}' yok`); continue; }
    if (!KIT_SEASON_DATA[id]) errors.push(`mevsimler: 3D kit '${id}' verisini okuyamadı`);
    for (const m of sd.months) if (seasonData.monthMap[String(m)] !== id) errors.push(`mevsimler: ${id} ayları monthMap ile çelişiyor (${m})`);
    if (sd.visual.snow && !sd.visual.bare) warns.push(`mevsimler: ${id} karlı ama ağaçlar çıplak değil`);
  }
  if (KIT_SEASONS.length !== seasonData.seasons.length) errors.push("mevsimler: kit ve veri sayısı farklı");

  const core = C.filter((c) => c.tier === "CORE").length;
  console.log(`\nMAHALLE EVRENİ · ${nh.name}`);
  console.log(`  · ${nh.venues.length} mekân (${nh.grid.cols}×${nh.grid.rows} harita), ${building.flats.length} apartman dairesi`);
  console.log(`  · ${C.length} karakter (${core} CORE, ${C.length - core} REGULAR), ${rel.edges.length} yönlü ilişki (nefret≤-2: ${hates}, sevgi≥4: ${loves})`);
  console.log(`  · ${ev.types.length} olay türü (30 bölümde ${sum.toFixed(1)}), ${arcs.arcs.length} yay, ${arcs.guestSystem.examples.length} konuk örneği, gündem: ${gundem.adaptationExamples.length} uyarlama örneği`);
  console.log(`  · mevsimler: ${seasonData.seasons.map((x) => x.name).join(", ")} · ${seasonData.seasons.reduce((a, x) => a + x.eventIdeas.length, 0)} mevsimlik olay fikri`);
  console.log(`  · 3D kit: ${VENUES.length} mekân + ${FILLERS.length} dolgu = ${COLS * ROWS} hücre, ${Object.keys(STATIONS).length} karakter istasyonu`);
  console.log(`  · Sezon gizemi "${season.title}": ${season.suspects.length} şüpheli, ${ledger.clues.length} ipucu · ${seeds.seeds.length} bölüm tohumu · ${mon.placementSlots.length} marka yuvası`);
} catch (e) {
  errors.push(`Şema hatası: ${(e as Error).message}`);
}
warns.forEach((m) => console.log("  ⚠", m));
errors.forEach((m) => console.log("  ✗", m));
console.log(errors.length ? `\n✗ ${errors.length} hata` : "\n✓ Evren tutarlı");
process.exit(errors.length ? 1 : 0);
