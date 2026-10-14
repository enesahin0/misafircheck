// `npm run tally` — manuel CSV/JSON'dan A/B oylarını sayar. Instagram API / bot YOK.
// Kurallar (decisions.json → voteRules) bölüm yayınlanmadan ilan edilir ve sonradan değiştirilmez:
//   · Bir kullanıcıdan bir oy: İLK GEÇERLİ oy sayılır.   · Geçerli oy yalnız A veya B (büyük/küçük harf, boşluk önemsiz).
//   · Eşitlikte: eşitliğe giren taraflar arasında İLK GEÇERLİ oyu veren taraf kazanır.
//   · Hiç geçerli oy yoksa: "Dış Hat'tan karar gelmedi; Leyla protokolü uyguladı" (NO_VOTES). Sahte katılım ÜRETİLMEZ.
// Kullanım:
//   npm run tally -- [dosya.csv|dosya.json] [--decision street14_decision]
//   npm run tally -- --apply --next 002      (kazanan kararın taslak etkilerini worldState'e uygular)
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/audio";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--") && ["decision", "next"].includes(args[i - 1].slice(2))));

const decisionId = opt("decision") ?? "street14_decision";
const storyDir = path.join(ROOT, "src", "story");
const decisionsPath = path.join(storyDir, "decisions.json");
const worldPath = path.join(storyDir, "worldState.json");
const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));
const dec = decisions[decisionId];
if (!dec) {
  console.error(`✗ Karar bulunamadı: ${decisionId}`);
  process.exit(1);
}

type Vote = { user: string; option: string; ts: string; order: number };

const readVotes = (file: string): Vote[] => {
  const raw = fs.readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    return (JSON.parse(raw) as { user_id: string; option: string; timestamp: string }[]).map((v, i) => ({ user: String(v.user_id), option: String(v.option), ts: String(v.timestamp), order: i }));
  }
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  const header = lines.shift()!.split(",").map((h) => h.trim().toLowerCase());
  const ix = (n: string) => header.indexOf(n);
  if (ix("user_id") < 0 || ix("option") < 0) throw new Error("CSV başlığı user_id,option,timestamp olmalı.");
  return lines.map((l, i) => {
    const c = l.split(",");
    return { user: c[ix("user_id")]?.trim() ?? "", option: c[ix("option")] ?? "", ts: c[ix("timestamp")]?.trim() ?? "", order: i };
  });
};

const tally = (votes: Vote[]) => {
  const sorted = [...votes].sort((a, b) => (a.ts && b.ts && a.ts !== b.ts ? (a.ts < b.ts ? -1 : 1) : a.order - b.order));
  const seen = new Set<string>();
  const valid: Vote[] = [];
  const ignored: string[] = [];
  for (const v of sorted) {
    const o = v.option.trim().toUpperCase();
    if (!v.user) { ignored.push(`boş kullanıcı (satır ${v.order + 1})`); continue; }
    if (o !== "A" && o !== "B") { ignored.push(`${v.user}: geçersiz seçenek '${v.option.trim()}'`); continue; }
    if (seen.has(v.user)) { ignored.push(`${v.user}: ikinci oy sayılmadı (ilk geçerli oy geçerli)`); continue; }
    seen.add(v.user);
    valid.push({ ...v, option: o });
  }
  const counts: Record<string, number> = { A: 0, B: 0 };
  valid.forEach((v) => counts[v.option]++);
  let winner: string;
  let rule: string;
  if (valid.length === 0) {
    winner = "NO_VOTES";
    rule = dec.voteRules.noVotes;
  } else if (counts.A === counts.B) {
    winner = valid[0].option;
    rule = `Eşitlik (${counts.A}-${counts.B}): ${dec.voteRules.tie}`;
  } else {
    winner = counts.A > counts.B ? "A" : "B";
    rule = "Salt çoğunluk";
  }
  return { counts, valid: valid.length, ignored, winner, rule };
};

const main = () => {
  if (flag("apply")) {
    if (!dec.result) throw new Error("Önce sayım yapılıp sonuç kaydedilmeli: `npm run tally -- votes.csv --save`");
    const next = opt("next");
    if (!next) throw new Error("--next <bölüm numarası> gerekli (ör. --next 002): etkiler o bölümde uygulanır.");
    const eff = dec.draftEffects?.[dec.result.winner];
    if (!eff) throw new Error(`'${dec.result.winner}' için draftEffects yok.`);
    const ws = JSON.parse(fs.readFileSync(worldPath, "utf8"));
    for (const [sid, status] of Object.entries(eff.streets as Record<string, string>)) {
      const st = ws.streets[sid];
      if (!st) throw new Error(`worldState'te '${sid}' sokağı yok.`);
      if (st.status !== status) {
        st.status = status;
        if (status === "ERASED") { st.erasedAtEpisode = next; st.restoredAtEpisode = null; }
        else st.restoredAtEpisode = next; // geri dönüş: gerekçeli (süreklilik denetimi bunu ister)
      }
    }
    ws.decisionHistory.push({ decision: decisionId, episodeId: dec.episodeId, winner: dec.result.winner, counts: dec.result.counts, appliedAtEpisode: next, price: eff.price });
    ws.pendingDecision = null;
    ws.timeline.push({ episode: next, title: "(yeni bölüm)", branchesFrom: dec.episodeId, resolvedBy: dec.result.winner });
    fs.writeFileSync(worldPath, JSON.stringify(ws, null, 2) + "\n");
    dec.status = "CLOSED";
    dec.appliedAtEpisode = next;
    fs.writeFileSync(decisionsPath, JSON.stringify(decisions, null, 2) + "\n");
    console.log(`✓ '${dec.result.winner}' etkileri worldState'e uygulandı (bölüm ${next}). Fiyat: ${eff.price}`);
    return;
  }

  const file = positional[0] ?? path.join(storyDir, "votes.csv");
  if (!fs.existsSync(file)) {
    console.error(`✗ Oy dosyası yok: ${path.relative(ROOT, file)}\n  CSV sütunları: user_id,option,timestamp. Örnek biçim için src/story/votes.sample.csv'ye bakın.`);
    process.exit(1);
  }
  const isSample = /sample/i.test(path.basename(file));
  if (isSample && !flag("allow-sample")) {
    console.error("✗ Bu bir ÖRNEK dosyadır (gerçek oy değil). Betiği denemek için --allow-sample ekleyin.");
    process.exit(1);
  }
  if (isSample) console.log("⚠ ÖRNEK VERİ — gerçek sonuç DEĞİLDİR. Kaydedilmeyecek.\n");
  const r = tally(readVotes(file));
  console.log(`Karar: ${decisionId}  (A: ${dec.options.A.label} / B: ${dec.options.B.label})`);
  console.log(`Geçerli oy: ${r.valid} · A=${r.counts.A}  B=${r.counts.B}`);
  r.ignored.forEach((m) => console.log("  ·", m));
  console.log(`Sonuç: ${r.winner}  (${r.rule})`);
  if (flag("save")) {
    if (isSample) throw new Error("Örnek veri kaydedilemez.");
    dec.result = { winner: r.winner, counts: r.counts, validVotes: r.valid, rule: r.rule, source: path.relative(ROOT, file), tallied: "manual" };
    fs.writeFileSync(decisionsPath, JSON.stringify(decisions, null, 2) + "\n");
    console.log("✓ Sonuç decisions.json'a kaydedildi. Etkileri uygulamak için: npm run tally -- --apply --next 002");
  } else {
    console.log("(Kaydetmek için --save ekleyin.)");
  }
};

try {
  main();
} catch (e) {
  console.error("✗", (e as Error).message);
  process.exit(1);
}
