// Bölüm doğrulama: süre, kapsama, altyazı okunabilirliği, ses referansları, SÜREKLİLİK (dünya durumu ile çelişki).
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./audio";
import { OVERLAY_KEYS } from "../../src/scenes/keys";
import type { Episode, WorldState } from "../../src/episodes/schema";
import { pickFromLibrary, type LibEntry } from "../../src/utils/audioLibrary";

export type Report = { errors: string[]; warnings: string[]; info: string[] };

const manifestFiles = (): Set<string> => {
  try {
    return new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "src", "generated", "audioManifest.json"), "utf8")).files);
  } catch {
    return new Set();
  }
};

export const validateEpisode = (ep: Episode, ws: WorldState): Report => {
  const r: Report = { errors: [], warnings: [], info: [] };
  const err = (m: string) => r.errors.push(m);
  const warn = (m: string) => r.warnings.push(m);
  const D = ep.durationFrames;

  /* 1) süre */
  r.info.push(`${ep.dossier} · ${ep.fps} fps · ${ep.width}x${ep.height} · ${D} kare = ${(D / ep.fps).toFixed(2)} sn`);
  if (D !== 1800 || ep.fps !== 30) err("Süre tam 1800 kare / 30 fps (60.00 sn) olmalı.");

  /* 2) sahneler bitişik ve tam kapsıyor */
  let cursor = 0;
  ep.scenes.forEach((s, i) => {
    if (s.from !== cursor) err(`Sahne ${i + 1} (${s.id}) ${cursor}. karede başlamalı, ${s.from}. karede başlıyor (boşluk/çakışma).`);
    if (s.to <= s.from) err(`Sahne ${s.id}: to > from olmalı.`);
    cursor = s.to;
    if (s.overlay && !(OVERLAY_KEYS as readonly string[]).includes(s.overlay)) err(`Sahne ${s.id}: bilinmeyen overlay '${s.overlay}'.`);
    const fs_ = s.camera.map((c) => c.f);
    if (fs_.some((f, k) => k > 0 && f <= fs_[k - 1])) err(`Sahne ${s.id}: kamera anahtar kareleri artan sırada olmalı.`);
    if (fs_[0] !== s.from) warn(`Sahne ${s.id}: ilk kamera anahtarı sahne başlangıcında (${s.from}) değil.`);
    if (fs_.some((f) => f < s.from || f > s.to)) err(`Sahne ${s.id}: kamera anahtarı sahne aralığı dışında.`);
    if (!s.clue?.id) err(`Sahne ${s.id}: gizli ipucu tanımlı olmalı.`);
  });
  if (cursor !== D) err(`Sahneler ${cursor}. karede bitiyor; ${D}. karede bitmeli.`);
  const durs = ep.scenes.map((s) => `${s.id}=${((s.to - s.from) / ep.fps).toFixed(1)}s`).join("  ");
  r.info.push(`Sahne süreleri: ${durs}`);

  /* 3) altyazılar */
  let prevTo = 0;
  [...ep.captions].sort((a, b) => a.from - b.from).forEach((c) => {
    if (c.from < prevTo) err(`Altyazı çakışıyor: "${c.text}" (${c.from}).`);
    prevTo = c.to;
    if (c.to > D || c.to <= c.from) err(`Altyazı aralığı geçersiz: "${c.text}".`);
    const cps = c.text.replace(/\s/g, "").length / ((c.to - c.from) / ep.fps);
    if (cps > 16) warn(`Altyazı çok hızlı (${cps.toFixed(1)} harf/sn): "${c.text}"`);
    if (c.text.length > 60) warn(`Altyazı uzun (${c.text.length} karakter): "${c.text}"`);
  });
  const lastCap = Math.max(...ep.captions.map((c) => c.to));
  r.info.push(`${ep.captions.length} altyazı satırı, sonuncusu ${(lastCap / ep.fps).toFixed(1)}. sn'de bitiyor.`);

  /* 4) eğriler / aktör / glitch */
  for (const [name, t] of Object.entries(ep.tracks)) {
    const f = t.map((k) => k[0]);
    if (f.some((x, i) => i > 0 && x < f[i - 1])) err(`Eğri '${name}': kareler artan sırada olmalı.`);
    if (f.some((x) => x < 0 || x > D)) err(`Eğri '${name}': kare aralığı 0..${D} dışında.`);
  }
  ep.glitches.forEach((g) => {
    if (g.at + g.len > D) err(`Glitch ${g.at}: bölüm dışına taşıyor.`);
  });
  if (ep.leyla.some((k, i) => i > 0 && k.f <= ep.leyla[i - 1].f)) err("Leyla anahtar kareleri artan sırada olmalı.");

  /* 5) hook ölçütü: ilk 3 sn'de olay + 2 satır metin */
  const hook = ep.scenes[0];
  const e0 = ep.tracks.street14Erase?.[0]?.[1] ?? 0;
  if (hook.from !== 0) err("İlk sahne 0. karede başlamalı (açılış logosu/intro yok).");
  if (e0 <= 0 || e0 >= 1) warn("Hook: ilk karede silinme zaten başlamış olmalı (street14Erase[0] 0..1 arasında).");
  else r.info.push(`Hook: ilk karede silinme %${Math.round(e0 * 100)} (ilk pikselde olay var).`);
  const minHook = ep.hud.hook.lines.every((l) => l.length <= 18);
  if (!minHook) warn("Hook satırları kısa olmalı (≤18 karakter).");

  /* 6) ses referansları */
  const have = manifestFiles();
  const missing: string[] = [];
  ep.audio.narration.forEach((n) => {
    if (n.from >= D) err(`Seslendirme ${n.id}: bölüm dışında.`);
    const hit = ["mp3", "wav", "m4a", "aac", "ogg"].some((e) => have.has(`audio/narration/${n.file}.${e}`));
    if (!hit) missing.push(`public/audio/narration/${n.file}.mp3`);
  });
  let library: LibEntry[] = [];
  try {
    library = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "generated", "audioLibrary.json"), "utf8")).entries;
  } catch {
    /* kütüphane dizini yok: etiketli sesler eksik sayılır */
  }
  ep.audio.sfx.forEach((s) => {
    if (s.from >= D) err(`SFX ${s.id}: bölüm dışında.`);
    if (s.src) {
      if (!have.has(`audio/${s.src}`)) missing.push(`public/audio/${s.src}`);
    } else if (s.lib) {
      if (!library.some((e) => e.id === s.lib)) err(`SFX ${s.id}: kütüphanede '${s.lib}' kimliği yok (npm run sfx).`);
    } else if (s.tag && !pickFromLibrary(library, s.tag, s.pick ?? 0)) {
      err(`SFX ${s.id}: kütüphanede '${s.tag}' etiketiyle ses bulunamadı (npm run sfx -- ${s.tag}).`);
    }
  });
  if (ep.audio.music && !have.has(`audio/${ep.audio.music.src}`)) missing.push(`public/audio/${ep.audio.music.src}`);
  const missNarr = missing.filter((m) => m.includes("/narration/"));
  if (missNarr.length) warn(`Seslendirme dosyası yok (sessiz render edilir): ${missNarr.map((m) => path.basename(m)).join(", ")}`);
  const missOther = missing.filter((m) => !m.includes("/narration/"));
  if (missOther.length) warn(`SFX/müzik dosyası yok → \`npm run audio\` çalıştır: ${missOther.join(", ")}`);

  /* 7) oylama / karar */
  const ids = ep.decision.options.map((o) => o.id).join("");
  if (ids !== "AB") err("Karar seçenekleri A ve B olmalı.");
  if (ep.decision.status === "OPEN" && (ep.decision.winner !== null || ep.decision.votes !== null)) {
    err("Oylama AÇIKKEN winner/votes dolu olamaz — gerçek veri gelmeden sayım veya galip uydurulmaz.");
  }

  /* 8) SÜREKLİLİK */
  const last = Number(ws.meta.lastEpisode);
  const cur = Number(ep.episodeId);
  for (const [sid, want] of Object.entries(ep.continuity.sets.streets)) {
    const st = ws.streets[sid];
    if (!st) { err(`Süreklilik: worldState'te '${sid}' sokağı yok.`); continue; }
    if (cur <= last) {
      if (st.status !== want) err(`Süreklilik: bu bölüm '${sid}' sokağını ${want} yapıyor ama worldState'te ${st.status}.`);
    }
  }
  if (cur > last) {
    for (const [sid, want] of Object.entries(ep.continuity.requires.streets)) {
      const st = ws.streets[sid];
      if (!st || st.status !== want) err(`Süreklilik: bölüm '${sid}' sokağının ${want} olmasını bekliyor; worldState'te ${st?.status ?? "yok"}.`);
    }
    // Kaybolan sokak geri geliyorsa gerekçe (restoredAtEpisode) şart
    for (const [sid, want] of Object.entries(ep.continuity.sets.streets)) {
      const st = ws.streets[sid];
      if (st?.status === "ERASED" && want === "PRESENT" && st.restoredAtEpisode !== ep.episodeId) {
        err(`Süreklilik: '${sid}' sokağı kayıp ama bu bölümde geri geliyor; worldState'te restoredAtEpisode='${ep.episodeId}' gerekçesi yok.`);
      }
    }
    // Silinmiş sokak varsayılan olarak hâlâ silinmiş kalmalı
    for (const [sid, st] of Object.entries(ws.streets)) {
      if (st.status === "ERASED" && sid === "14" && ep.tracks.street14Erase) {
        const lastV = ep.tracks.street14Erase[ep.tracks.street14Erase.length - 1][1];
        if (lastV < 1 && st.restoredAtEpisode !== ep.episodeId) err("Süreklilik: 14. Sokak kayıp ama bölüm onu geri getiriyor (restoredAtEpisode yok).");
      }
    }
  }
  for (const c of ep.persistentClues) {
    if (cur <= last && !ws.clues.some((x) => x.id === c)) warn(`Kalıcı ipucu '${c}' worldState.clues içinde kayıtlı değil.`);
  }
  for (const s of ep.scenes) {
    if (!ep.persistentClues.includes(s.clue.id) && cur <= last && !ws.clues.some((x) => x.id === s.clue.id)) {
      warn(`Sahne ${s.id} ipucu '${s.clue.id}' persistentClues / worldState.clues içinde yok.`);
    }
  }
  const e = ep.tracks.street14Erase;
  if (e && ep.continuity.sets.streets["14"] === "ERASED" && e[e.length - 1][1] !== 1) err("14. Sokak ERASED olacak ama street14Erase eğrisi 1'de bitmiyor.");
  r.info.push(`Süreklilik: worldState son bölüm=${ws.meta.lastEpisode}, 14. Sokak=${ws.streets["14"]?.status}, kalıcı ipucu=${ep.persistentClues.length}.`);

  return r;
};

export const printReport = (r: Report) => {
  r.info.forEach((m) => console.log("  ·", m));
  r.warnings.forEach((m) => console.log("  ⚠", m));
  r.errors.forEach((m) => console.log("  ✗", m));
  console.log(r.errors.length ? `\n✗ ${r.errors.length} hata, ${r.warnings.length} uyarı` : `\n✓ Doğrulama geçti (${r.warnings.length} uyarı)`);
};
