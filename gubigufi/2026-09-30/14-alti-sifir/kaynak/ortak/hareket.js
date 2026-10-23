/* gubigufi HAREKET (FX) — ft-motion (github.com/imserhatdemir/ft-motion, MIT, Serhat Demir) tekniklerinin
   BİZİM SVG + flat tarzımıza uyarlanmış hali. Her fonksiyon yalnızca argümanlarına (t dahil) bağlıdır → deterministik,
   hareket bulanıklığında (plan.json "hareket_bulanikligi": N) güvenle çalışır.
   KULLANMA: glitch, kromatik sapma, HUD, film greni gibi "teknoloji reklamı" efektleri tarzımıza UYMAZ — eklenmedi.
   Renkler her zaman MARKA.md'deki olgun paletten verilir.

   Easing sözlüğü (ne zaman ne):
     FX.E.expo(p)      → girişler/açılışlar (hızlı başla, ipek gibi otur) — varsayılan
     FX.yay(t - t0)    → pop/beliriş (hafif taşar, yaylanarak oturur) — back()'ten daha doğal
     FX.sallan(t - t0) → darbe tepkisi / squash (1'den başlar, sönerek salınır)
     FX.E.inBack(p)    → büyük çıkıştan önce hazırlık (önce geri çekilir)
     FX.E.inExpo(p)    → emilme, çöküş, içine çekilme
*/
const FX = (() => {
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ar = (t, a, b) => cl((t - a) / (b - a));
  function kubik(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1, t = x; for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (sx(t) < x) lo = t; else hi = t; } return sy(t); };
  }
  const E = {
    expo: kubik(.16, 1, .3, 1), css: kubik(.25, .1, .25, 1), snap: kubik(.7, 0, .2, 1),
    outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x), inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
    inOutQuart: x => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2,
    outBack: (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
    inBack: (x, s = 1.70158) => (s + 1) * x * x * x - s * x * x,
  };
  const yay = (x, frek = 18, sonum = 8) => x <= 0 ? 0 : 1 - Math.exp(-sonum * x) * Math.cos(frek * x);
  const sallan = (x, frek = 19, sonum = 7) => x < 0 ? 0 : Math.exp(-sonum * x) * Math.cos(frek * x);
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const gurultu = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
  // kamera sarsıntısı: olaylar [[zaman, px], ...] → [dx, dy]; kameraya transform olarak uygula
  function sarsinti(t, olaylar, sonum = 9) {
    let dx = 0, dy = 0; for (const [t0, px] of olaylar) { const d = t - t0; if (d < 0 || d > 1) continue; const k = px * Math.exp(-sonum * d); dx += gurultu(t * 40 + t0 * 7) * k; dy += gurultu(t * 40 + t0 * 13 + 50) * k; }
    return [dx, dy];
  }
  // ---------- GEÇİŞLER (sahne sonunda/başında çağır; ekranı renkli şekille kapatıp açar) ----------
  // egikSilme: q 0→1; mod 'kapat' | 'ac'; yon ±1; serit: öndeki ince zıt renk şerit
  function egikSilme(q, { mod = 'kapat', yon = 1, renk = '#1F6F78', serit = null, egim = .22, W = 1080, H = 1920 } = {}) {
    const sk = H * egim * .3, m = sk + W * .06 + 20, a = lerp(-m, W + m, q);
    const x0 = mod === 'kapat' ? -m : a, x1 = mod === 'kapat' ? a : W + m;
    const tr = yon < 0 ? `transform="translate(${W} 0) scale(-1 1)"` : '';
    let o = `<g ${tr}><path d="M${x0 + sk} -2 L${x1 + sk} -2 L${x1} ${H + 2} L${x0} ${H + 2}Z" fill="${renk}"/>`;
    if (serit) { const sw = 60 * cl(q * 6) * (mod === 'ac' ? cl((1 - q) * 6) : 1); o += mod === 'kapat' ? `<path d="M${x1 + sk} -2 L${x1 + sk + sw} -2 L${x1 + sw} ${H + 2} L${x1} ${H + 2}Z" fill="${serit}"/>` : `<path d="M${x0 + sk - sw} -2 L${x0 + sk} -2 L${x0} ${H + 2} L${x0 - sw} ${H + 2}Z" fill="${serit}"/>`; }
    return o + `</g>`;
  }
  function seritSilme(p, { mod = 'kapat', renk = '#7A2E3A', n = 6, W = 1080, H = 1920 } = {}) {
    const w = W / n; let o = '';
    for (let i = 0; i < n; i++) { const idx = mod === 'kapat' ? i : n - 1 - i, qi = E.inOutQuart(cl((p - idx * .09) / .55));
      o += mod === 'kapat' ? `<rect x="${i * w - 1}" y="0" width="${w + 2}" height="${1920 * qi}" rx="${w / 2 * (1 - qi)}" fill="${renk}"/>` : `<rect x="${i * w - 1}" y="${H * qi}" width="${w + 2}" height="${H * (1 - qi) + 1}" fill="${renk}"/>`; }
    return o;
  }
  function daireOrtu(cx, cy, q, renk = '#D8A032', r0 = 18, W = 1080, H = 1920) {
    const uzak = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) + 10;
    return `<circle cx="${cx}" cy="${cy}" r="${lerp(r0, uzak, q)}" fill="${renk}"/>`;
  }
  // gecis: 'orta' anında ekran tamamen kapalı; sahneyi o an değiştir. tur: 'egik' | 'serit' | 'daire' (+ merkez:[x,y])
  function gecis(t, { orta, renk = '#1F6F78', serit = null, kapat = {}, ac = {} }) {
    const c = Object.assign({ tur: 'egik', sure: .3, yon: 1 }, kapat), r = Object.assign({ tur: 'egik', sure: .4, yon: 1 }, ac);
    if (t < orta - c.sure || t > orta + r.sure) return '';
    const mod = t < orta ? 'kapat' : 'ac', s = mod === 'kapat' ? c : r, p = mod === 'kapat' ? (t - (orta - c.sure)) / c.sure : (t - orta) / r.sure;
    if (s.tur === 'daire') { const [x, y] = s.merkez || [540, 960]; return daireOrtu(x, y, mod === 'kapat' ? E.inOutQuart(p) : 1 - E.outExpo(p), renk); }
    if (s.tur === 'serit') return seritSilme(p, { mod, renk });
    return egikSilme(mod === 'kapat' ? E.inOutQuart(p) : E.outExpo(p) * .985 + p * .015, { mod, yon: s.yon, renk, serit });
  }
  // ---------- DARBELER (idareli kullan) ----------
  const flas = (t, t0, tepe = .6, sonum = .07, renk = '#FFF6E6') => { const d = t - t0; if (d < 0) return ''; const a = tepe * Math.exp(-d / sonum); return a < .01 ? '' : `<rect width="1080" height="1920" fill="${renk}" opacity="${a}"/>`; };
  function sokHalkasi(cx, cy, t, t0, { renk = '#D8A032', omur = .6, yaricap = 700, kalinlik = 40 } = {}) {
    const d = t - t0; if (d < 0 || d > omur) return ''; const p = d / omur;
    return `<circle cx="${cx}" cy="${cy}" r="${yaricap * E.outExpo(p)}" fill="none" stroke="${renk}" stroke-width="${kalinlik * (1 - p) + 2}" opacity="${1 - p}"/>`;
  }
  // ---------- KİNETİK YAZI ----------
  // maskeliYukselis: metin kutusundan aşağıdan yükselerek çıkar (Türkçe aksanlar için kutu pay bırakır)
  let _id = 0;
  function maskeliYazi(s, x, y, boyut, p, { renk = '#1B1640', agirlik = 900, hiza = 'middle', ek = '' } = {}) {
    const id = `fxm${++_id}`, w = s.length * boyut * .7 + 40, x0 = hiza === 'middle' ? x - w / 2 : x - 20;
    return `<defs><clipPath id="${id}"><rect x="${x0}" y="${y - boyut * 1.15}" width="${w}" height="${boyut * 1.45}"/></clipPath></defs>` +
      `<g clip-path="url(#${id})"><text x="${x}" y="${y + (1 - p) * boyut * 1.2}" font-size="${boyut}" font-weight="${agirlik}" text-anchor="${hiza}" style="fill:${renk}" ${ek}>${s}</text></g>`;
  }
  // harfHarf: harfler soldan sağa sırayla yaylanarak belirir (stagger 0.04 sn)
  const _olc = (typeof document !== 'undefined') ? document.createElement('canvas').getContext('2d') : null;
  function harfHarf(s, x, y, boyut, t, t0, { renk = '#1B1640', aralik = .04 } = {}) {
    const ch = [...s]; let ws; if (_olc) { _olc.font = `900 ${boyut}px Outfit`; ws = ch.map(c => _olc.measureText(c).width); } else ws = ch.map(() => boyut * .62);
    const W = ws.reduce((a, b) => a + b, 0); let xx = x - W / 2, o = '';
    ch.forEach((c, i) => { const cx = xx + ws[i] / 2; xx += ws[i]; const q = yay(t - t0 - i * aralik); if (q <= 0) return;
      o += `<text x="${cx}" y="${y + (1 - Math.min(q, 1)) * boyut * .5}" font-size="${boyut}" font-weight="900" text-anchor="middle" opacity="${Math.min(1, q * 1.5)}" transform="translate(${cx} ${y}) scale(${Math.max(.01, q)}) translate(${-cx} ${-y})" style="fill:${renk};font-weight:900">${c}</text>`; });
    return o;
  }
  // üstünü çiz: eski fikri geçersiz kıl (çizgi expo ile uzar, metin soluklaşır)
  const ustunuCiz = (x, y, w, p, renk = '#B0472E', kal = 12) => p <= 0 ? '' : `<rect x="${x}" y="${y - kal / 2}" width="${w * E.expo(p)}" height="${kal}" rx="${kal / 2}" fill="${renk}"/>`;
  // sayaç: expo ile yavaşlayan sayma (ses: ses_lib.sayac_tiklari ile eşle)
  const sayac = (t, t0, t1, a, b) => Math.round(lerp(a, b, E.expo(ar(t, t0, t1))));
  // ---------- NOKTA ALANI (flat noktalar; dalga halkası) ----------
  function dalgaNoktalar(cx, cy, t, firlatmalar, { kolon = 9, satir = 9, aralik = 90, taban = 7, kazanc = 16, renk1 = '#EAD7BD', renk2 = '#C0583A', hiz = 900, genislik = 140, omur = 1.3 } = {}) {
    let o = '';
    for (let i = 0; i < kolon; i++) for (let j = 0; j < satir; j++) { const x = cx + (i - (kolon - 1) / 2) * aralik, y = cy + (j - (satir - 1) / 2) * aralik; let w = 0;
      for (const t0 of firlatmalar) { const d = t - t0; if (d < 0 || d > omur) continue; const r = d * hiz, dist = Math.hypot(x - cx, y - cy); w = Math.max(w, Math.exp(-(((dist - r) / genislik) ** 2)) * (1 - d / omur)); }
      o += `<circle cx="${x}" cy="${y}" r="${taban + kazanc * w}" fill="${w > .3 ? renk2 : renk1}" opacity="${.6 + .4 * w}"/>`; }
    return o;
  }
  // soğan kabuğu izi: hızlı hareket eden nesnenin arkasında silikleşen kopyalar. ciz(t) → svg
  function sogan(ciz, t, { adet = 3, aralik = .03, op = .25 } = {}) { let o = ''; for (let i = adet; i >= 1; i--) o += `<g opacity="${op * (1 - i / (adet + 1))}">${ciz(t - i * aralik)}</g>`; return o + ciz(t); }
  return { E, yay, sallan, hash, gurultu, sarsinti, egikSilme, seritSilme, daireOrtu, gecis, flas, sokHalkasi, maskeliYazi, harfHarf, ustunuCiz, sayac, dalgaNoktalar, sogan, ar, cl, lerp };
})();
