// `npm run gundem` — gündem adayları: RSS'ten başlık çeker, güvenlik filtresinden geçirir, mahalle uyarlaması önerir.
// Karar İNSANINDIR: bu araç sadece liste çıkarır. Haber metni kopyalanmaz; yalnızca başlık + bağlantı kaydedilir.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib/audio";

type Src = { id: string; name: string; feed: string };
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "story", "series", "gundem.json"), "utf8"));
const sources: Src[] = cfg.sources;

// Türkçe ekler yüzünden `\b` güvenilmez: başlığı küçük harfe (tr) çevirip kelimelere bölüyor, KÖK ile başlayan kelimeyi arıyoruz.
// `exact` kısa kökler içindir (ör. "kar" kelimesi "karşı"/"çıkar" ile karışmasın).
type Rule = { stems: string[]; exact?: string[] };
const tokens = (t: string) => t.toLocaleLowerCase("tr-TR").split(/[^a-zçğıöşüâîû0-9]+/).filter(Boolean);
const hit = (toks: string[], r: Rule) => toks.some((w) => r.stems.some((st) => w.startsWith(st)) || r.exact?.includes(w));

const BLOCK: Rule = {
  stems: ["öldü", "ölü", "ölüm", "hayatını", "cinayet", "intihar", "saldır", "terör", "çatış", "savaş", "bomba", "silahl", "kaza", "yaralı", "yaralan", "şehit", "cenaze", "deprem", "sel", "yangın", "boğul", "tutuklan", "tutuklam", "gözaltı", "soruştur", "iddianame", "mahkeme", "dava", "hapis", "ceza", "seçim", "parti", "hükümet", "bakan", "cumhurbaşkan", "milletvekil", "meclis", "kongre", "başkan", "erdoğan", "trump", "putin", "netanyahu", "gazze", "israil", "ukrayna", "rusya", "hamas", "iran", "suriye", "irak", "nato", "büyükelçi", "diplomat", "kınam", "soykırım", "istismar", "taciz", "tecavüz", "şiddet", "cami", "imam", "ezan", "mezhep", "kürt", "ermeni", "salgın", "virüs", "kanser", "ameliyat", "enflasyon", "faiz", "dolar", "borsa", "vergi", "asgari", "emekli", "grev", "işten çıkar", "uyarı", "tahliye", "dışarı çıkma", "olumsuz hava", "taşkın", "heyelan", "çığ", "fırtına uyar", "yaşamını", "kayıp", "arama kurtarma", "enkaz", "patlama", "kriz", "yaptırım", "vatandaşlık", "göçmen", "sığınmacı", "mülteci", "baykar", "harekât", "savunma", "silah", "ordu", "asker", "tatbikat", "füze", "jet", "askeri"],
  exact: ["din", "ab", "abd", "bm", "ak", "chp", "mhp", "hdp", "dem"],
};
const MAYBE: Rule = { stems: ["kuvvetli", "sağanak", "göle", "su bas", "sel", "olta", "zam", "indirim", "fiyat", "akaryakıt", "benzin", "ulaşım", "otobüs", "metro", "vapur", "ekonomi", "kira", "petrol", "brent", "altın"], exact: [] };
const TOPICS: [string, Rule, string, string][] = [
  ["spor", { stems: ["maç", "derbi", "şampiyon", "lig", "kupa", "olimpiyat", "transfer", "turnuva", "milli takım", "basketbol", "voleybol", "futbol"] }, "GUNDEM", "cay-ocagi / doner — ortak ekran akşamı, takım adı yok"],
  ["hava", { stems: ["sıcak", "soğuk", "yağmur", "yağış", "rüzgar", "rüzgâr", "hava durumu", "sis", "kırağı", "kar yağ"], exact: ["kar", "don"] }, "GUNDEM", "cay-ocagi / bakkal — buzlu çay / kar krizi"],
  ["kültür", { stems: ["festival", "konser", "film", "dizi", "ödül", "sergi", "tiyatro", "müzik", "albüm", "sinema", "oscar"] }, "GUNDEM", "meydan / cay-ocagi — mahalle 'ödül töreni' ya da şenlik"],
  ["teknoloji", { stems: ["yapay zek", "telefon", "iphone", "uygulama", "robot", "teknoloji", "chatgpt", "elektrikli", "bilgisayar", "chatbot", "sohbet bot"], exact: ["ai"] }, "GUNDEM", "bakkal — Bülent dijitalleştirmeye çalışır"],
  ["yaşam", { stems: ["okul", "karne", "sınav", "lgs", "yks", "tatil", "bayram", "pazar", "alışveriş"] }, "GUNDEM", "meydan / bakkal — Efe, Hacer, mahalle hazırlığı"],
  ["hayvan", { stems: ["kedi", "köpek", "hayvan", "kuş", "sokak hayvan"] }, "GUNDELIK_KOMIK", "bakkal / park — Paşa ve Karabaş"],
  ["bilim", { stems: ["keşif", "keşfet", "bilim", "nasa", "gezegen", "ay tutulması", "yıldız", "elmas"] }, "GUNDEM", "yildiz-apt çatısı — Efe ve Rıza Amca teleskop"],
  ["viral", { stems: ["viral", "trend", "rekor", "ilk kez", "garip", "ilginç", "şaşırt"] }, "GUNDELIK_KOMIK", "meydan — Ceren 'içerik' çeker"],
];

const unCdata = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
const dec = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const pick = (blk: string, tag: string) => {
  const m = blk.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? dec(unCdata(m[1]).replace(/<[^>]+>/g, "").trim()) : "";
};

type Item = { title: string; link: string; source: string; published: string; verdict: "UYGUN" | "İNCELE" | "ELE"; topic: string; eventType: string; adapt: string; why: string };

const parse = (xml: string, src: Src): Pick<Item, "title" | "link" | "published" | "source">[] => {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  return blocks.slice(0, 40).map((b) => {
    const link = pick(b, "link") || (b.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? "");
    return { title: pick(b, "title"), link, published: pick(b, "pubDate") || pick(b, "updated") || pick(b, "published"), source: src.name };
  }).filter((i) => i.title);
};

const classify = (title: string): Pick<Item, "verdict" | "topic" | "eventType" | "adapt" | "why"> => {
  const toks = tokens(title);
  if (hit(toks, BLOCK)) return { verdict: "ELE", topic: "-", eventType: "-", adapt: "", why: "hassas/yasaklı konu (gundem.json block)" };
  const maybe = hit(toks, MAYBE);
  for (const [name, rule, type, adapt] of TOPICS) if (hit(toks, rule)) return { verdict: maybe ? "İNCELE" : "UYGUN", topic: name, eventType: type, adapt, why: maybe ? "fiyat/ekonomi: yalnızca mahalle ölçeğinde, suçlayıcı olmadan" : "izinli konu" };
  return { verdict: "İNCELE", topic: "genel", eventType: "GUNDEM", adapt: "Mahalle benzeri bulunabilir mi? Yoksa kullanma", why: "konu eşleşmedi: insan değerlendirsin" };
};

(async () => {
  const all: Item[] = [];
  await Promise.all(
    sources.map(async (s) => {
      try {
        let xml: string;
        try {
          const r = await fetch(s.feed, { headers: { "User-Agent": "Mozilla/5.0 (nufus0-gundem)" }, signal: AbortSignal.timeout(20000) });
          xml = await r.text();
        } catch {
          // Ağ vekili olan ortamlarda Node fetch'i vekili kullanmayabilir: curl yedeği
          xml = execFileSync("curl", ["-sL", "-m", "25", "-A", "Mozilla/5.0 (nufus0-gundem)", s.feed], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
        }
        for (const it of parse(xml, s)) all.push({ ...it, ...classify(it.title) });
      } catch (e) {
        console.error(`  ! ${s.name} alınamadı: ${(e as Error).message}`);
      }
    }),
  );
  const seen = new Set<string>();
  const uniq = all.filter((i) => {
    const k = i.title.toLowerCase().replace(/[^a-zçğıöşü0-9]/g, "").slice(0, 40);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const order = { UYGUN: 0, İNCELE: 1, ELE: 2 } as const;
  uniq.sort((a, b) => order[a.verdict] - order[b.verdict]);
  const day = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
  const outFile = path.join(ROOT, "out", `gundem-${day}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ day, count: uniq.length, items: uniq }, null, 1));

  const n = { UYGUN: 0, İNCELE: 0, ELE: 0 };
  uniq.forEach((i) => n[i.verdict]++);
  console.log(`\nGÜNDEM ADAYLARI · ${day} · ${uniq.length} başlık (UYGUN ${n.UYGUN} · İNCELE ${n.İNCELE} · ELE ${n.ELE})\n`);
  const show = (v: Item["verdict"], limit: number) => {
    uniq.filter((i) => i.verdict === v).slice(0, limit).forEach((i, k) => {
      console.log(`${v === "UYGUN" ? "✓" : "?"} [${k + 1}] ${i.title}  — ${i.source}`);
      console.log(`     konu: ${i.topic} → tür: ${i.eventType} · öneri: ${i.adapt}`);
    });
  };
  show("UYGUN", 12);
  console.log("");
  show("İNCELE", 8);
  console.log(`\nELE'lenen ${n.ELE} başlık listelenmedi (hassas konu). Tam liste: ${path.relative(ROOT, outFile)}`);
  console.log("Karar sizde: seçtiğiniz haberi teyit edin, mahalleye çevirmek için bana söyleyin.");
})();
