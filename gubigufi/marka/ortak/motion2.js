/* gubigufi MOTION v2 — koreografi, kamera, geçiş, derinlik, kinetik tipografi, ses olayları.
   Tasarım kuralları: marka/motion/ARASTIRMA.md (1b) · brif: marka/motion/YONETMEN_BRIEF.md
   Her fonksiyon (t dahil) yalnızca argümanlarına bağlıdır → kare-kesin, alt-kare hareket bulanıklığında güvenli.
   İsteğe bağlı: vendor/flubber.min.js (morf), vendor/culori.js (OKLCH renk) — yoksa yedek yol çalışır.

   HIZLI KULLANIM (sahne):
     MO.sahne({
       zemin: MO.zemin({ ust: '#1A2A50', alt: '#0B1428', isik: [540, 1500, '#3E6FB8', .35] }),
       kamera: [[0, 1, 540, 900], [3.2, 1.22, 540, 760, .9]],     // [t, ölçek, odakX, odakY, süre?, ease?]
       ciz: t => {
         const kart = MO.oge(t, { gir: 3.25, cik: 6.0, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 });
         return MO.sar(kartSvg, kart, 540, 820);
       }
     });
   Geçişler uret.py'deki GECIS sözlüğünden gelir (window.GECIS = { gir: {...}, cik: {...} }).
*/
const MO = (() => {
  const W = 1080, H = 1920;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ar = (t, a, b) => cl((t - a) / (b - a));
  const sure = () => window.SAHNE_SURESI || 999;
  const SB = () => window.SB || 0;

  // ---------------- EASING ----------------
  const E = {
    lin: x => x,
    inQuad: x => x * x, outQuad: x => 1 - (1 - x) * (1 - x),
    inCubic: x => x * x * x, outCubic: x => 1 - Math.pow(1 - x, 3),
    inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x), inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
    inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
    outQuart: x => 1 - Math.pow(1 - x, 4), inOutQuart: x => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2,
  };
  // tasarımcı bezier'i (AE/CSS cubic-bezier) → saf fonksiyon
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1, t = x; for (let i = 0; i < 22; i++) { t = (lo + hi) / 2; if (sx(t) < x) lo = t; else hi = t; } return sy(t); };
  }
  E.yumusak = bezier(.16, 1, .3, 1);      // varsayılan iniş ("ipek gibi otur")
  E.kararli = bezier(.22, 1, .36, 1);     // power4.out benzeri
  E.kamera = bezier(.65, 0, .35, 1);      // kamera: yavaş kalk, yavaş dur

  // ---------------- YAY (analitik sönümlü harmonik osilatör) ----------------
  // Tasarımcı parametreleri: sure = %2 oturma süresi (sn), tasma = taşma oranı (0 = kritik sönüm, .08 = %8 taşar)
  // y0: başlangıç konumu (0 = normal; -.05 = anticipation sonrası geri çekilmiş), v0: başlangıç hızı (birim/sn)
  function yay(x, { sure: Ts = .6, tasma = .06, y0 = 0, v0 = 0 } = {}) {
    if (x <= 0) return y0;
    const L = Math.log(Math.max(1e-4, tasma));
    const z = tasma <= 1e-3 ? 1 : cl(-L / Math.sqrt(Math.PI * Math.PI + L * L), .05, 1);
    const w0 = z >= 1 ? 5.83 / Ts : 4 / (z * Ts);
    const A = y0 - 1; // hedefe göre başlangıç sapması
    let d;
    if (z >= .999) d = (A + (v0 + w0 * A) * x) * Math.exp(-w0 * x);
    else { const wd = w0 * Math.sqrt(1 - z * z), B = (v0 + z * w0 * A) / wd; d = Math.exp(-z * w0 * x) * (A * Math.cos(wd * x) + B * Math.sin(wd * x)); }
    return 1 + d;
  }

  // ---------------- AĞIRLIK SINIFLARI ----------------
  // giris: yay süresi/taşma, ant: anticipation (geri çekilme miktarı, süresi), cik: çıkış süresi, mesafe: giriş yolu (px), stagger: çocuk gecikmesi
  const AG = {
    hafif:    { sure: .42, tasma: .10, ant: 0,    antS: 0,   cik: .26, mesafe: 40,  stagger: .045, olcek0: .82, golge: 1 },
    orta:     { sure: .62, tasma: .06, ant: 0,    antS: 0,   cik: .32, mesafe: 90,  stagger: .06,  olcek0: .9,  golge: 2 },
    agir:     { sure: .85, tasma: .04, ant: .035, antS: .14, cik: .38, mesafe: 160, stagger: .08,  olcek0: .94, golge: 3 },
    kahraman: { sure: 1.0, tasma: .05, ant: .05,  antS: .18, cik: .42, mesafe: 220, stagger: .09,  olcek0: .86, golge: 3 },
    oyuncu:   { sure: .55, tasma: .22, ant: .08,  antS: .1,  cik: .3,  mesafe: 70,  stagger: .05,  olcek0: .6,  golge: 2 },
  };

  // ---------------- SES OLAY KAYDI (2f) ----------------
  // Her görsel olay kaydedilir; render.py --olaylar her kareyi tarayıp window.MO_OLAY'ı olaylar.json'a yazar.
  const OLAY = window.MO_OLAY = window.MO_OLAY || {};
  function olay(tur, tYerel, o = {}) {
    const g = +(SB() + tYerel).toFixed(3), k = `${tur}|${g}|${Math.round(o.x || 0)}|${o.etiket || ''}`;
    if (!OLAY[k]) OLAY[k] = Object.assign({ tur, t: g }, o);
  }

  // ---------------- ÖĞE YAŞAM DÖNGÜSÜ (2a) ----------------
  // MO.oge(t, { gir, cik, agirlik, giris, yon, materyal, x, gecik, bekle }) → durum
  // giris: 'yuksel' | 'dus' | 'olcek' | 'yan' | 'maske' | 'sabit'
  // durum: { gor (0/1 çizilsin mi), op, k (ölçek), kx, ky (ezil-uzan), dx, dy, rot, p (yay ilerlemesi), cikiyor, yuk (yükseklik → gölge) }
  function oge(t, { gir = 0, cik = null, agirlik = 'orta', giris = 'yuksel', yon = 1, materyal = null, x = 540, gecik = 0, bekle = 0, ses = true, etiket = '' } = {}) {
    const a = AG[agirlik] || AG.orta, t0 = gir + gecik;
    if (ses) {
      olay('giris', t0 + a.sure * .28, { agirlik, materyal, x, giris, etiket });
      if (cik != null) olay('cikis', cik, { agirlik, materyal, x, etiket });
    }
    const bos = { gor: 0, op: 0, k: 1, kx: 1, ky: 1, dx: 0, dy: 0, rot: 0, p: 0, cikiyor: 0, yuk: 0 };
    if (t < t0 - a.antS) return bos;
    if (cik != null && t >= cik + a.cik) return bos;
    // anticipation: hareketten önce ters yönde küçük hazırlık
    let p;
    if (t < t0) { const q = ar(t, t0 - a.antS, t0); p = -a.ant * E.inOutSine(q); }
    else p = yay(t - t0, { sure: a.sure, tasma: a.tasma, y0: -a.ant });
    const pc = Math.max(0, p), opG = E.outCubic(ar(t, t0, t0 + Math.min(.22, a.sure * .4)));
    let s = { gor: 1, op: opG, k: 1, kx: 1, ky: 1, dx: 0, dy: 0, rot: 0, p, cikiyor: 0, yuk: Math.max(0, 1 - pc) + Math.max(0, p - 1) * 4 };
    const m = a.mesafe;
    if (giris === 'yuksel') { s.dy = (1 - p) * m; s.k = lerp(a.olcek0 + (1 - a.olcek0) * .5, 1, pc) + Math.max(0, p - 1) * .2; }
    else if (giris === 'dus') { s.dy = -(1 - p) * m * 1.6; const imp = t - (t0 + a.sure * .35); if (imp > 0) { const sq = Math.exp(-9 * imp) * Math.sin(imp * 24) * .07; s.kx = 1 + sq; s.ky = 1 - sq; } }
    else if (giris === 'olcek') { s.k = lerp(a.olcek0, 1, p); if (t < t0) s.k = 1 + p * 1.5; }
    else if (giris === 'yan') { s.dx = (1 - p) * m * 1.8 * yon; s.rot = (1 - p) * 4 * yon; }
    else if (giris === 'maske') { s.mask = cl(p); }
    // bekleme: ağır/kahraman öğelerde nefes (çok küçük) — ölü kare olmasın
    if (bekle) { const f = (x * .013) % 6.28; s.dy += Math.sin(t * 1.6 + f) * bekle; s.rot += Math.sin(t * 1.1 + f) * bekle * .12; }
    // çıkış: hızlı, ivmelenen; giriş yönünün devamı
    if (cik != null && t >= cik) {
      const q = E.inQuad(ar(t, cik, cik + a.cik));
      s.cikiyor = q; s.op *= 1 - q; s.k *= 1 - .07 * q; s.dy -= q * m * .45; s.yuk += q;
      if (giris === 'yan') s.dx -= q * m * 1.2 * yon;
    }
    return s;
  }
  // durum → SVG sarmalayıcı. (x, y) öğenin pivotu; svg öğenin (0,0) merkezli çizimi
  function sar(svg, s, x = 0, y = 0, { golge = true } = {}) {
    if (!s || !s.gor || s.op <= .003) return '';
    const tr = `translate(${(x + s.dx).toFixed(2)} ${(y + s.dy).toFixed(2)}) rotate(${s.rot.toFixed(3)}) scale(${(s.k * s.kx).toFixed(4)} ${(s.k * s.ky).toFixed(4)})`;
    let ic = svg;
    if (s.mask != null && s.mask < 1) { const id = `mom${Math.round(x)}_${Math.round(y)}`, r = 1400 * E.outCubic(s.mask); ic = `<defs><clipPath id="${id}"><circle cx="0" cy="0" r="${r}"/></clipPath></defs><g clip-path="url(#${id})">${svg}</g>`; }
    const f = golge ? ` filter="url(#moG${cl(Math.round(1 + s.yuk * 2), 1, 3)})"` : '';
    return `<g transform="${tr}" opacity="${s.op.toFixed(3)}"${f}>${ic}</g>`;
  }
  // çocuk öğeler için stagger: i. çocuğun gecikmesi
  const sira = (i, agirlik = 'orta', carpan = 1) => i * (AG[agirlik] || AG.orta).stagger * carpan;

  // ---------------- KAMERA (2b) ----------------
  // cekimler: [[t, s, fx, fy, sure=.8, ease='kamera'], ...]. İlk çekim anında kurulur.
  // Dönüş: { s, fx, fy, rot, dx, dy } + nefes. Kamera hareketi başlangıcı ses olayı üretir (whoosh, hıza göre).
  function kamera(t, cekimler = [[0, 1, 540, 960]], { nefes = .012, nefesHiz = .55 } = {}) {
    let cur = { s: cekimler[0][1], fx: cekimler[0][2], fy: cekimler[0][3] };
    for (let i = 1; i < cekimler.length; i++) {
      const [t0, s, fx, fy, d = .8, ez = 'kamera'] = cekimler[i];
      const hiz = Math.hypot((fx - cur.fx) * s, (fy - cur.fy) * s) / d + Math.abs(Math.log(s / cur.s)) * 900 / d;
      olay('kamera', t0 + d * .5, { hiz: Math.round(hiz), x: fx, sure: d, olcekDegisim: +(s / cur.s).toFixed(3) });
      if (t < t0) break;
      const q = (E[ez] || E.kamera)(ar(t, t0, t0 + d));
      cur = { s: Math.exp(lerp(Math.log(cur.s), Math.log(s), q)), fx: lerp(cur.fx, fx, q), fy: lerp(cur.fy, fy, q) };
    }
    cur.s *= 1 + nefes * Math.sin(t * nefesHiz * 2 * Math.PI / 3);
    cur.rot = .25 * Math.sin(t * .37);
    cur.dx = 0; cur.dy = 0;
    return cur;
  }
  const kameraTr = c => `translate(${(W / 2 + c.dx).toFixed(2)} ${(H / 2 + c.dy).toFixed(2)}) rotate(${c.rot.toFixed(3)}) scale(${c.s.toFixed(4)}) translate(${-c.fx.toFixed(2)} ${-c.fy.toFixed(2)})`;

  // ---------------- GEÇİŞLER (2c) ----------------
  // Sahneler ayrı dosyalar: çıkan sahne geçişin ilk yarısını, giren sahne ikinci yarısını çizer; kesme anı perdelenir/hareket halindedir.
  // tur: 'odak' (rack focus), 'itme' (push-through, video başına ~1), 'yildiz' (marka maskesi: Gubi yıldızı), 'kayma' (whip),
  //      'perde' (renk alanı kayması), 'kes' (düz kesme; hareket üstüne).
  const GSURE = { odak: [.38, .5], itme: [.42, .62], yildiz: [.42, .55], kayma: [.28, .38], perde: [.4, .5], kes: [0, 0] };
  const yildizYol = (cx, cy, r) => { let d = ''; for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2, b = a + Math.PI / 4, n = a + Math.PI / 2; d += (i ? '' : `M${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`) + ` Q${(cx + Math.cos(b) * r * .16).toFixed(1)} ${(cy + Math.sin(b) * r * .16).toFixed(1)} ${(cx + Math.cos(n) * r).toFixed(1)} ${(cy + Math.sin(n) * r).toFixed(1)}`; } return d + 'Z'; };
  // gecisDurum: kameraya uygulanacak değişiklik + üst örtü SVG + bulanıklık
  function gecisDurum(t) {
    const G = window.GECIS || {}, T = sure();
    const r = { s: 1, dx: 0, dy: 0, blurX: 0, blurY: 0, karart: 0, ortu: '' };
    const uygula = (g, mod) => {
      if (!g || !g.tur || g.tur === 'kes') return;
      const [dc, dg] = GSURE[g.tur] || [.4, .5], renk = g.renk || '#0B1433', [mx, my] = g.merkez || [540, 900];
      if (mod === 'cik') {
        const q = ar(t, T - dc, T); if (q <= 0) return;
        if (q > 0 && t >= T - dc) olay('gecis', T - dc * .15, { gecisTur: g.tur, x: mx, yonu: 'cik' });
        if (g.tur === 'odak') { r.s *= 1 - .07 * E.inQuad(q); r.blurX = r.blurY = 16 * E.inQuad(q); r.karart = .4 * q; }
        if (g.tur === 'itme') { r.s *= 1 + 1.1 * E.inCubic(q); r.blurY = r.blurX = 10 * E.inCubic(q); r.fx = mx; r.fy = my; }
        if (g.tur === 'kayma') { const e = E.inCubic(q); r.dx -= 260 * e * (g.yon || 1); r.blurX = 40 * e; }
        if (g.tur === 'yildiz') { const e = E.inExpo(q), rr = lerp(10, 2600, e); r.ortu += `<path d="${yildizYol(mx, my, rr)}" fill="${renk}" transform="rotate(${45 * e} ${mx} ${my})"/>`; r.s *= 1 + .05 * E.inQuad(q); }
        if (g.tur === 'perde') { const e = E.inOutCubic(q), y = lerp(H + 200, -60, e); r.ortu += `<path d="M-40 ${y + 120} L${W + 40} ${y - 120} L${W + 40} ${H + 400} L-40 ${H + 400}Z" fill="${renk}"/>`; r.dy -= 60 * e; }
      } else {
        const q = ar(t, 0, dg); if (q >= 1) return;
        if (g.tur === 'odak') { const e = 1 - E.outCubic(q); r.s *= 1 + .08 * e; r.blurX = r.blurY = 16 * e; r.karart = .4 * e; }
        if (g.tur === 'itme') { const e = 1 - E.outExpo(q); r.s *= 1 + .6 * e; r.blurX = r.blurY = 10 * e; }
        if (g.tur === 'kayma') { const e = 1 - E.outExpo(q); r.dx += 260 * e * (g.yon || 1); r.blurX = 40 * e; }
        if (g.tur === 'yildiz') { const e = E.outCubic(q), rr = lerp(30, 2600, e);
          r.ortu += `<path fill-rule="evenodd" d="M-50 -50 H${W + 50} V${H + 50} H-50Z ${yildizYol(mx, my, rr)}" fill="${renk}" transform="rotate(${-20 * (1 - e)} ${mx} ${my})"/>`; r.s *= 1 + .06 * (1 - e); }
        if (g.tur === 'perde') { const e = E.outCubic(q), y = lerp(-60, -H - 400, e); r.ortu += `<path d="M-40 ${y + 120} L${W + 40} ${y - 120} L${W + 40} ${y + H + 400} L-40 ${y + H + 400}Z" fill="${renk}"/>`; r.dy += 50 * (1 - e); }
      }
    };
    uygula(G.cik, 'cik'); uygula(G.gir, 'gir');
    return r;
  }

  // ---------------- IŞIK / DERİNLİK / DOKU (2d) ----------------
  // Tutarlı ışık: sol-üstten. Gölge filtreleri 3 yükseklik seviyesi (moG1 alçak … moG3 yüksek).
  const DEFS = `<defs>
    <filter id="moG1" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="4" dy="8" stdDeviation="6" flood-color="#050A1C" flood-opacity=".32"/></filter>
    <filter id="moG2" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="7" dy="16" stdDeviation="13" flood-color="#050A1C" flood-opacity=".36"/></filter>
    <filter id="moG3" x="-35%" y="-35%" width="170%" height="185%"><feDropShadow dx="11" dy="26" stdDeviation="22" flood-color="#050A1C" flood-opacity=".38"/></filter>
    <filter id="moBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur id="moBlurN" stdDeviation="0 0"/></filter>
    <filter id="moGren" x="0" y="0" width="100%" height="100%"><feTurbulence id="moGrenT" type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="1" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.4 -.45"/></filter>
  </defs>`;
  // katmanlı zemin: gradyan + ışık havuzu (+ yavaş süpürme ışığı) — asla düz değil
  function zemin({ ust = '#1A2A50', alt = '#0B1428', isik = [540, 1450, '#3E6FB8', .32], ikinci = null, supurme = .06, aci = 160 } = {}) {
    const id = 'moZ' + Math.round(Math.random() * 1e6);
    return t => {
      const [ix, iy, ir, io] = isik, kay = Math.sin(t * .23) * 40;
      let o = `<defs><linearGradient id="${id}a" gradientTransform="rotate(${aci - 90} .5 .5)" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient>` +
        `<radialGradient id="${id}b" cx="${ix / W}" cy="${iy / H}" r=".62"><stop offset="0" stop-color="${ir}" stop-opacity="${io}"/><stop offset="1" stop-color="${ir}" stop-opacity="0"/></radialGradient>` +
        (ikinci ? `<radialGradient id="${id}c" cx="${ikinci[0] / W}" cy="${ikinci[1] / H}" r=".45"><stop offset="0" stop-color="${ikinci[2]}" stop-opacity="${ikinci[3]}"/><stop offset="1" stop-color="${ikinci[2]}" stop-opacity="0"/></radialGradient>` : '') +
        `<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFF3D6" stop-opacity="${supurme}"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>`;
      o += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#${id}a)"/><rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#${id}b)" transform="translate(${kay} 0)"/>`;
      if (ikinci) o += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#${id}c)" transform="translate(${-kay * .6} ${kay * .4})"/>`;
      if (supurme) { const sx = ((t * 70) % (W + 1400)) - 700; o += `<rect x="${sx}" y="-300" width="520" height="${H + 600}" fill="url(#${id}s)" transform="rotate(18 ${sx + 260} ${H / 2})"/>`; }
      return o;
    };
  }
  // ton: sahne başı renk derecelendirmesi (soft-light) — sıcak/soğuk/nötr ruh hali
  const ton = (renk = '#FFB060', op = .12, karisim = 'soft-light') => `<rect width="${W}" height="${H}" fill="${renk}" opacity="${op}" style="mix-blend-mode:${karisim}"/>`;
  // OKLCH renk karışımı (culori varsa) — RGB lerp'in çamur tonlarından kaçınır
  function renkKaristir(a, b, k) {
    if (window.culori) { const f = culori.interpolate([a, b], 'oklch'); return culori.formatHex(f(cl(k))); }
    const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = h(a), B = h(b);
    return '#' + A.map((v, i) => Math.round(lerp(v, B[i], cl(k))).toString(16).padStart(2, '0')).join('');
  }

  // ---------------- KİNETİK TİPOGRAFİ (2e) ----------------
  const _c = document.createElement('canvas').getContext('2d');
  const gen = (s, fs, w = 900) => { _c.font = `${w} ${fs}px Outfit`; return _c.measureText(s).width; };
  // baslik: kelime kelime maskeli yükseliş; *vurgu* kelimeler renkli + altı çizilir. x merkez, y taban çizgisi.
  function baslik(t, t0, metin, x, y, { boyut = 72, renk = '#FFF3D6', vurgu = '#FBAC39', aralik = .07, cik = null, agirlik = 900, cizgi = true } = {}) {
    const kel = metin.split(' ').map(w => ({ s: w.replace(/\*/g, ''), v: w.includes('*') }));
    const bos = gen(' ', boyut, agirlik) * 1.05, ws = kel.map(k => gen(k.s, boyut, agirlik)), top = ws.reduce((a, b) => a + b, 0) + bos * (kel.length - 1);
    let xx = x - top / 2, o = '';
    const cq = cik != null ? E.inQuad(ar(t, cik, cik + .3)) : 0;
    if (cq >= 1) return '';
    kel.forEach((k, i) => {
      const ti = t0 + i * aralik, p = yay(t - ti, { sure: .55, tasma: .04 }), w = ws[i];
      if (t >= ti - .01) {
        const id = `moK${Math.round(x)}_${Math.round(y)}_${i}`;
        o += `<defs><clipPath id="${id}"><rect x="${xx - 6}" y="${y - boyut * 1.05}" width="${w + 12}" height="${boyut * 1.38}"/></clipPath></defs>`;
        o += `<g clip-path="url(#${id})"><text x="${xx}" y="${(y + (1 - Math.min(1, p)) * boyut * 1.15 - cq * boyut * .3).toFixed(1)}" font-size="${boyut}" font-weight="${agirlik}" style="fill:${k.v ? vurgu : renk}" opacity="${1 - cq}">${k.s}</text></g>`;
        if (k.v && cizgi) { const cp = E.yumusak(ar(t, ti + .25, ti + .65)); if (cp > 0) o += `<rect x="${xx}" y="${y + boyut * .16}" width="${w * cp}" height="${Math.max(5, boyut * .09)}" rx="${boyut * .045}" fill="${vurgu}" opacity="${1 - cq}"/>`; }
      }
      olay('kelime', ti, { x: xx + w / 2, doku: 1 });
      xx += w + bos;
    });
    return o;
  }
  // sayiVurgu: sayaç (expo yavaşlama) + varışta ölçek vuruşu + renk oturması. bicim: n => metin
  function sayiVurgu(t, t0, sure_, hedef, x, y, { boyut = 140, renk = '#FFFFFF', vurgu = '#FBAC39', bicim = n => n.toLocaleString('tr-TR'), baslangic = 0 } = {}) {
    if (t < t0) return '';
    const q = ar(t, t0, t0 + sure_), n = Math.round(lerp(baslangic, hedef, E.outExpo(q)));
    const gir = yay(t - t0, { sure: .5, tasma: .08 }), op = E.outCubic(ar(t, t0, t0 + .15));
    const vur = (t > t0 + sure_ ? 1 + .12 * Math.exp(-7 * (t - t0 - sure_)) * Math.cos((t - t0 - sure_) * 18) : 1) * (.55 + .45 * gir);
    const rk = q < 1 ? vurgu : renkKaristir(vurgu, renk, ar(t, t0 + sure_, t0 + sure_ + .6));
    olay('sayac', t0, { sure: sure_, x, doku: 1 }); olay('varis', t0 + sure_, { agirlik: 'agir', x });
    return `<g transform="translate(${x} ${y}) scale(${vur.toFixed(4)})" opacity="${op.toFixed(3)}"><text x="0" y="${boyut * .35}" font-size="${boyut}" font-weight="900" text-anchor="middle" style="fill:${rk}">${bicim(n)}</text></g>`;
  }
  // cizgiCiz: yol çizimi (stroke-dashoffset) — vurgu çizgileri, oklar
  const cizgiCiz = (d, p, { renk = '#FBAC39', kal = 8, uzunluk = 1200 } = {}) => p <= 0 ? '' : `<path d="${d}" fill="none" stroke="${renk}" stroke-width="${kal}" stroke-linecap="round" stroke-dasharray="${uzunluk}" stroke-dashoffset="${uzunluk * (1 - E.yumusak(cl(p)))}"/>`;

  // ---------------- MORF (flubber) ----------------
  const _morf = {};
  function morf(a, b, p, anahtar) { if (!window.flubber) return p < .5 ? a : b; const k = anahtar || a + '→' + b; if (!_morf[k]) _morf[k] = flubber.interpolate(a, b, { maxSegmentLength: 8 }); return _morf[k](cl(p)); }

  // ---------------- SAHNE ÇATISI ----------------
  // Katmanlar: #zemin (parallax .25) → .kamera (#sabit, #dinamik) → #moOrtu (geçiş örtüsü) → #moGren (film greni) → kanal katmanı
  function sahne({ zemin: zf = zemin(), kamera: cek = [[0, 1, 540, 960]], ciz, onCiz = null, ton: tn = '', gren = .05, parallax = .25, nefes = .012 } = {}) {
    const svg = document.querySelector('svg'), NS = 'http://www.w3.org/2000/svg';
    svg.insertAdjacentHTML('afterbegin', DEFS);
    const kamG = document.querySelector('.kamera'), zG = document.getElementById('zemin'), dyn = document.getElementById('dinamik');
    const mk = id => { const g = document.createElementNS(NS, 'g'); g.setAttribute('id', id); document.getElementById('kamYak').appendChild(g); return g; };
    const ortu = mk('moOrtu'), grenG = mk('moGren'), onG = onCiz ? mk('moOn') : null;
    const blurN = document.getElementById('moBlurN');
    window.renderAt = t => {
      const c = kamera(t, cek, { nefes }), g = gecisDurum(t);
      if (g.fx != null) { c.fx = lerp(c.fx, g.fx, .5); c.fy = lerp(c.fy, g.fy, .5); }
      c.s *= g.s; c.dx += g.dx; c.dy += g.dy;
      kamG.setAttribute('transform', kameraTr(c));
      const zs = 1 + (c.s - 1) * parallax;
      zG.setAttribute('transform', `translate(${W / 2 + c.dx * parallax} ${H / 2 + c.dy * parallax}) scale(${Math.max(1, zs).toFixed(4)}) translate(${-(W / 2 + (c.fx - W / 2) * parallax)} ${-(H / 2 + (c.fy - H / 2) * parallax)})`);
      zG.innerHTML = typeof zf === 'function' ? zf(t) : zf;
      if (g.blurX + g.blurY > .3) { blurN.setAttribute('stdDeviation', `${g.blurX.toFixed(1)} ${g.blurY.toFixed(1)}`); kamG.setAttribute('filter', 'url(#moBlur)'); zG.setAttribute('filter', 'url(#moBlur)'); }
      else { kamG.removeAttribute('filter'); zG.removeAttribute('filter'); }
      dyn.innerHTML = ciz(t, c);
      if (onG) onG.innerHTML = onCiz(t, c);
      ortu.innerHTML = (g.karart > 0 ? `<rect width="${W}" height="${H}" fill="#050A1C" opacity="${g.karart.toFixed(3)}"/>` : '') + g.ortu + (typeof tn === 'function' ? tn(t) : tn);
      grenG.innerHTML = gren > 0 ? `<rect width="${W}" height="${H}" filter="url(#moGren)" opacity="${gren}" style="mix-blend-mode:overlay"/>` : '';
      if (gren > 0) { const tt = document.getElementById('moGrenT'); if (tt) tt.setAttribute('seed', String(1 + Math.floor((SB() + t) * 24) % 997)); }
    };
  }

  return { E, bezier, yay, AG, oge, sar, sira, kamera, kameraTr, gecisDurum, GSURE, yildizYol, zemin, ton, renkKaristir, baslik, sayiVurgu, cizgiCiz, morf, sahne, olay, gen, cl, lerp, ar, DEFS };
})();
