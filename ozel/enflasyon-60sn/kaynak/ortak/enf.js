/* ENFLASYON · 60 sn kinetik tipografi — tek zaman çizelgesi: renderAt(t) → T = SB + t (global saniye). 120 BPM, vuruş = 0,5 sn. */
(() => {
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), A = (t, a, b) => cl((t - a) / (b - a));
const oE = q => q >= 1 ? 1 : 1 - Math.pow(2, -10 * q), ioC = q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
const oB = q => { const c1 = 2.2, c3 = c1 + 1; return q <= 0 ? 0 : 1 + c3 * Math.pow(q - 1, 3) + c1 * Math.pow(q - 1, 2); };
const h = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const KR = '#FF2D2D', SR = '#FFE600', BY = '#F4F1EA', KY = '#00E5FF', KOYU = '#070709';
const fmt = (v, d = 0) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
// 3D ekstrüzyon gölgesi
const ext = (n, renk, dx = 1, dy = 1) => { let s = []; for (let i = 1; i <= n; i++) s.push(`${i * dx}px ${i * dy}px 0 ${renk}`); return s.join(','); };
// konumlu metin (merkez x,y) — chroma: kırmızı/camgöbeği ayrışma
function yaz(s, x, y, fs, { renk = BY, w = 900, sc = 1, rot = 0, rx = 0, ry = 0, op = 1, derin = 0, derinRenk = '#5A0000', ls = 0, chroma = 0, mono = false, blur = 0, golge = '' } = {}) {
  const tr = `translate(-50%,-50%) perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rot}deg) scale(${sc})`;
  const base = `left:${x}px;top:${y}px;font-size:${fs}px;font-weight:${w};letter-spacing:${ls}px;transform:${tr};opacity:${op};${blur ? `filter:blur(${blur}px);` : ''}`;
  const cls = mono ? 'c mono' : 'c';
  let o = '';
  if (chroma) o += `<div class="${cls}" style="${base}color:${KR};mix-blend-mode:screen;margin-left:${-chroma}px">${s}</div><div class="${cls}" style="${base}color:${KY};mix-blend-mode:screen;margin-left:${chroma}px">${s}</div>`;
  o += `<div class="${cls}" style="${base}color:${renk};text-shadow:${derin ? ext(derin, derinRenk) : 'none'}${golge ? ',' + golge : ''}">${s}</div>`;
  return o;
}
// SLAM: büyükten çarparak gelir (t0), opsiyonel çıkış (t1)
function slam(T, t0, s, x, y, fs, o = {}) { const d = T - t0; if (d < 0) return ''; const q = oE(cl(d / .22)), cik = o.t1 ? A(T, o.t1, o.t1 + .18) : 0; if (cik >= 1) return '';
  return yaz(s, x, y, fs, Object.assign({}, o, { sc: (o.sc || 1) * (2.4 - 1.4 * q) * (1 - .3 * cik), op: Math.min(1, d / .06) * (1 - cik), blur: (1 - q) * 10 + cik * 12, chroma: (o.chroma || 0) + 22 * (1 - q) })); }
// glitch dilimleri: bir HTML bloğunu yatay şeritlere bölüp kaydırır
function glitch(html, T, guc) { if (guc <= .01) return html; let o = ''; const n = 7, f = Math.floor(T * 30);
  for (let i = 0; i < n; i++) { const y0 = i / n * 100, y1 = (i + 1) / n * 100, dx = (h(f * 7 + i) - .5) * 120 * guc; o += `<div class="ab" style="width:1080px;height:1920px;clip-path:inset(${y0}% 0 ${100 - y1}% 0);transform:translateX(${dx}px)">${html}</div>`; }
  return o; }
// para (genel tasarım, gerçek banknot DEĞİL)
function banknot(x, y, w, ry, rx, sc = 1, renk1 = '#2E7D5B', renk2 = '#1B4D38') { const hh = w * .5;
  return `<div class="ab" style="left:${x - w / 2}px;top:${y - hh / 2}px;width:${w}px;height:${hh}px;transform:perspective(1600px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc});transform-style:preserve-3d;border-radius:18px;background:linear-gradient(120deg,${renk1},${renk2});box-shadow:0 40px 80px rgba(0,0,0,.6), inset 0 0 0 10px rgba(255,255,255,.12)">
    <div class="ab" style="left:24px;top:24px;right:24px;bottom:24px;border:3px solid rgba(255,255,255,.25);border-radius:12px"></div>
    <div class="ab" style="left:${w * .08}px;top:${hh * .2}px;width:${hh * .6}px;height:${hh * .6}px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.35),rgba(255,255,255,0) 70%)"></div>
    <div class="ab" style="left:${w * .45}px;top:${hh * .12}px;font-size:${hh * .52}px;font-weight:900;color:#E8FFF2;letter-spacing:-4px;text-shadow:${ext(6, '#0E2E20')}">100</div>
    <div class="ab mono" style="left:${w * .47}px;top:${hh * .72}px;font-size:${hh * .1}px;color:#BFF5DA;letter-spacing:6px">TÜRK LİRASI ₺</div></div>`; }
// market ürünleri (12 adet) — n tanesi sepette, gerisi düşer
const URUN = [['EKMEK', '#E8A45A'], ['SÜT', '#F4F1EA'], ['PEYNİR', '#FFE08A'], ['YUMURTA', '#F2D7B0'], ['YAĞ', '#FFD23F'], ['DOMATES', '#FF4A3A'], ['ÇAY', '#3FA35A'], ['ŞEKER', '#FFFFFF'], ['MAKARNA', '#F2C46A'], ['PİRİNÇ', '#EDE6D6'], ['ZEYTİN', '#4A4A2A'], ['SABUN', '#8AD8FF']];
function sepet(T, x, y, n, tDus = -1) { let o = `<div class="ab" style="left:${x - 360}px;top:${y - 40}px;width:720px;height:380px;border-radius:0 0 60px 60px;background:linear-gradient(#2A2A33,#15151B);box-shadow:inset 0 10px 0 #3A3A46, 0 30px 60px rgba(0,0,0,.6)"></div>`;
  for (let k = 0; k < 6; k++) o += `<div class="ab" style="left:${x - 330 + k * 120}px;top:${y + 10}px;width:12px;height:300px;background:#22222A;border-radius:6px"></div>`;
  URUN.forEach(([ad, r], i) => { const c = i % 4, rr = Math.floor(i / 4), ux = x - 270 + c * 180, uy = y - 40 - rr * 110; let dy = 0, rot = (h(i) - .5) * 14, op = 1;
    if (i >= n) { const d = tDus < 0 ? 99 : T - (tDus + (i - n) * .05); if (d > 0) { dy = 1600 * d * d + 300 * d; rot += d * 400 * (h(i + 3) - .5); op = cl(1 - d * 1.2); } }
    if (op > 0) o += `<div class="ab" style="left:${ux - 80}px;top:${uy - 46 + dy}px;width:160px;height:92px;border-radius:20px;background:${r};transform:rotate(${rot}deg);opacity:${op};box-shadow:0 10px 0 rgba(0,0,0,.35)"><div class="ab mono" style="left:0;width:160px;top:30px;text-align:center;font-size:24px;color:#111">${ad}</div></div>`; });
  return o; }
// fiyat etiketi (3D döner)
function etiket(x, y, s, ry, renk = SR) { return `<div class="ab" style="left:${x - 260}px;top:${y - 110}px;width:520px;height:220px;transform:perspective(1400px) rotateY(${ry}deg);background:${renk};border-radius:24px 120px 120px 24px;box-shadow:0 30px 60px rgba(0,0,0,.55)"><div class="ab" style="left:430px;top:90px;width:40px;height:40px;border-radius:50%;background:${KOYU}"></div><div class="ab" style="left:0;width:430px;top:30px;text-align:center;font-size:130px;font-weight:900;color:${KOYU};letter-spacing:-4px"></div></div>`; }
// kayan şerit
function serit(T, y, s, hiz, renk, zemin, rot = 0, fs = 54) { const tek = (s + '  •  ').repeat(12), off = -((T * hiz) % 1400); return `<div class="ab" style="left:-200px;top:${y}px;width:1480px;height:${fs * 1.6}px;background:${zemin};transform:rotate(${rot}deg);overflow:hidden"><div class="ab" style="left:${off}px;top:${fs * .25}px;font-size:${fs}px;font-weight:900;color:${renk};white-space:nowrap;letter-spacing:2px">${tek}</div></div>`; }
// ===================== ZAMAN ÇİZELGESİ =====================
const VURUS = [0, 1.0, 2.0, 2.5, 4.0, 5.5, 7.0, 8.0, 10.6, 13.2, 15.8, 18.4, 21.0, 25.0, 27.5, 30.0, 34.5, 37.0, 41.5, 43.0, 46.0, 50.0, 53.5, 54.2, 56.0, 57.0, 58.2];
const FLAS = [2.5, 8.0, 25.0, 34.5, 41.5, 53.5, 57.0];
const YIL = [[2021, 36.08, 136], [2022, 64.27, 224], [2023, 64.77, 368], [2024, 44.38, 532], [2025, 30.89, 696]];
function sahne(T) {
  let o = '';
  // ---------- A · 0–4 HOOK ----------
  if (T < 4) {
    o += `<div class="ab" style="width:1080px;height:1920px;background:radial-gradient(circle at 50% 45%,#1B3A2C 0%,${KOYU} 60%)"></div>`;
    const q = oE(A(T, 0, 1.2)); o += banknot(540, 860, 820, 540 * (1 - q) + Math.sin(T * 2) * 8, 18 * (1 - q) + 8, .6 + .4 * q);
    o += slam(T, 1.0, 'BU 100 LİRA', 540, 470, 120, { derin: 10, derinRenk: '#3A0000' });
    o += slam(T, 2.0, 'NEREYE', 540, 1240, 190, { renk: SR, derin: 14, derinRenk: '#6A5A00' });
    o += slam(T, 2.5, 'GİTTİ?', 540, 1450, 260, { renk: SR, derin: 18, derinRenk: '#6A5A00', chroma: 6 });
    if (T > 3.3) o = glitch(o, T, A(T, 3.3, 4));
    return o; }
  // ---------- B · 4–8 2021 BAŞI SEPET ----------
  if (T < 8) {
    o += `<div class="ab" style="width:1080px;height:1920px;background:#0E0E14"></div>` + serit(T, 1700, 'OCAK 2021', 300, '#0E0E14', SR, -4, 50);
    o += slam(T, 4.0, 'OCAK 2021', 540, 360, 150, { derin: 10, derinRenk: '#333' });
    const g = oB(A(T, 4.4, 5.2)); o += `<div class="ab" style="width:1080px;height:1920px;transform:translateY(${(1 - g) * 900}px)">${sepet(T, 540, 1050, 12)}</div>`;
    if (T > 5.5) { const r = oE(A(T, 5.5, 6.3)); o += etiket(540, 1500, 1, 90 * (1 - r)).replace('</div></div>', '100 ₺</div></div>'); }
    o += slam(T, 7.0, '= DOLU SEPET', 540, 620, 96, { renk: SR, derin: 8, derinRenk: '#5A5000' });
    return o; }
  // ---------- C · 8–22 YIL YIL ----------
  if (T < 22) {
    const i = Math.min(4, Math.floor((T - 8) / 2.6)), t0 = 8 + i * 2.6, [yil, yuzde, fiyat] = YIL[i], onceki = i ? YIL[i - 1][2] : 100;
    const nItem = Math.max(2, Math.round(12 / (fiyat / 100))), nOnce = i ? Math.max(2, Math.round(12 / (onceki / 100))) : 12;
    const kirmizi = .35 + .65 * (yuzde / 85);
    o += `<div class="ab" style="width:1080px;height:1920px;background:radial-gradient(circle at 50% 40%, rgba(255,45,45,${.35 * kirmizi}) 0%, ${KOYU} 65%)"></div>`;
    o += serit(T, 250, 'ENFLASYON', 420, 'rgba(255,255,255,.08)', 'transparent', -8, 120) + serit(T, 1720, 'FİYATLAR ↑', -380, 'rgba(255,230,0,.10)', 'transparent', 6, 110);
    const f = oE(A(T, t0, t0 + .35)); o += yaz(String(yil), 540, 300, 180, { rx: 90 * (1 - f), derin: 12, derinRenk: '#550000', op: f });
    o += slam(T, t0 + .25, '%' + fmt(yuzde, 2), 540, 520, 200, { renk: i === 1 || i === 2 ? KR : SR, derin: 16, derinRenk: '#2A0000', chroma: 4 });
    o += `<div class="ab" style="width:1080px;height:1920px;transform:scale(.82) translate(0,180px)">${sepet(T, 540, 1050, nItem, t0 + .5)}</div>`;
    // fiyat sayacı (yuvarlanan)
    const fv = onceki + (fiyat - onceki) * ioC(A(T, t0 + .3, t0 + 1.4)), kayma = A(T, t0 + .3, t0 + 1.4) > 0 && A(T, t0 + .3, t0 + 1.4) < 1 ? 3 : 0;
    o += `<div class="ab" style="left:150px;top:1440px;width:780px;height:190px;background:${SR};border-radius:28px;transform:rotate(-3deg);box-shadow:0 24px 0 #7A6A00"></div>`;
    o += yaz('100₺\'LİK SEPET', 540, 1470, 34, { renk: KOYU, mono: true, rot: -3, ls: 4 }) + yaz(fmt(Math.round(fv)) + ' ₺', 540, 1560, 130, { renk: KOYU, rot: -3, blur: kayma });
    o += yaz(`100 ₺ İLE ALINAN: ${nItem}/12`, 540, 760, 40, { renk: BY, mono: true, op: A(T, t0 + .9, t0 + 1.2) });
    if (T > 21.0) o = glitch(o, T, A(T, 21.2, 22));
    return o; }
  // ---------- D · 22–30 ZİRVE ----------
  if (T < 30) {
    const al = T > 25 && T < 27.5 ? (Math.floor(T * 8) % 2 ? .35 : 0) : 0;
    o += `<div class="ab" style="width:1080px;height:1920px;background:${KOYU}"></div><div class="ab" style="width:1080px;height:1920px;background:${KR};opacity:${al}"></div>`;
    // grafik: 2020–2026 yıllık enflasyon (temsili aylık eğri; işaretli noktalar resmi)
    const P = [[2020.9, 14.6], [2021.5, 19], [2021.9, 36.1], [2022.4, 73], [2022.8, 85.5], [2022.9, 64.3], [2023.5, 38], [2023.9, 64.8], [2024.4, 75.5], [2024.9, 44.4], [2025.4, 35.4], [2025.9, 30.9], [2026.6, 31.5]];
    const X = yx => 90 + (yx - 2020.8) / 5.9 * 900, Y = v => 1500 - v * 11;
    const ciz = ioC(A(T, 22.2, 25.0)); let d = '', son = P[0]; const tot = P.length - 1, kac = ciz * tot;
    for (let k = 0; k <= tot; k++) { if (k > kac + 1) break; let p = P[k]; if (k > kac) { const a = P[k - 1], f = kac - (k - 1); p = [a[0] + (P[k][0] - a[0]) * f, a[1] + (P[k][1] - a[1]) * f]; } d += (k ? 'L' : 'M') + X(p[0]) + ' ' + Y(p[1]); son = p; }
    const zoom = 1 + .5 * ioC(A(T, 24.6, 25.3)) * (1 - A(T, 27.6, 28.4)), zx = X(2022.8), zy = Y(85.5);
    let g = `<svg class="ab" width="1080" height="1920"><defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${KR}" stop-opacity=".45"/><stop offset="1" stop-color="${KR}" stop-opacity="0"/></linearGradient></defs>`;
    for (let v = 0; v <= 80; v += 20) g += `<line x1="90" x2="990" y1="${Y(v)}" y2="${Y(v)}" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="2"/><text x="60" y="${Y(v) + 8}" font-size="22" fill="#FFFFFF" fill-opacity=".35" font-family="JetBrains Mono" text-anchor="end">%${v}</text>`;
    [2021, 2022, 2023, 2024, 2025, 2026].forEach(yy => g += `<text x="${X(yy + .45)}" y="1550" font-size="24" fill="#FFFFFF" fill-opacity=".45" font-family="JetBrains Mono" text-anchor="middle">${yy}</text>`);
    g += `<path d="${d} L${X(son[0])} 1500 L90 1500Z" fill="url(#lg)"/><path d="${d}" stroke="${KR}" stroke-width="10" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${X(son[0])}" cy="${Y(son[1])}" r="16" fill="${SR}"/></svg>`;
    o += `<div class="ab" style="width:1080px;height:1920px;transform-origin:${zx}px ${zy}px;transform:scale(${zoom})">${g}</div>`;
    o += slam(T, 22.2, '5 YILLIK GRAFİK', 540, 330, 70, { renk: BY, mono: true, t1: 24.9 });
    o += slam(T, 25.0, 'EKİM 2022', 540, 330, 110, { renk: BY, derin: 8, derinRenk: '#550000' });
    o += slam(T, 25.25, '%85,51', 540, 560, 300, { renk: KR, derin: 22, derinRenk: '#2A0000', chroma: 8 });
    o += slam(T, 27.5, '24 YILIN ZİRVESİ', 540, 790, 84, { renk: SR, derin: 8, derinRenk: '#5A5000' });
    if (T > 29.3) o = glitch(o, T, A(T, 29.3, 30));
    return o; }
  // ---------- E · 30–37 7 KAT ----------
  if (T < 37) {
    o += `<div class="ab" style="width:1080px;height:1920px;background:linear-gradient(#141018,${KOYU})"></div>`;
    o += slam(T, 30.0, '5 YILDA', 540, 330, 110, { derin: 8, derinRenk: '#333' }) + slam(T, 30.5, 'FİYATLAR', 540, 470, 140, { renk: SR, derin: 10, derinRenk: '#5A5000' });
    const M = [1, 1.36, 2.24, 3.68, 5.32, 6.96];
    M.forEach((m, k) => { const g = oB(A(T, 31 + k * .5, 31.5 + k * .5)), hh = m * 95 * g, x = 130 + k * 165;
      o += `<div class="ab" style="left:${x}px;top:${1560 - hh}px;width:120px;height:${hh}px;background:linear-gradient(90deg,${k === 5 ? KR : '#FF6A3A'},${k === 5 ? '#8A0000' : '#8A2A10'});border-radius:14px 14px 0 0;transform:perspective(900px) rotateY(-18deg);box-shadow:16px 0 0 rgba(0,0,0,.35)"></div>`;
      if (g > .5) o += yaz(fmt(m, 2).replace(',00', '') + '×', x + 60, 1530 - hh, 34, { mono: true, renk: BY }); o += yaz(String(2020 + k), x + 60, 1610, 28, { mono: true, renk: '#8A8A9A' }); });
    o += slam(T, 34.5, '≈ 7 KAT', 540, 760, 230, { renk: KR, derin: 20, derinRenk: '#2A0000', chroma: 6 });
    o += yaz('2020 sonu → 2025 sonu · TÜİK TÜFE', 540, 1700, 30, { mono: true, renk: '#8A8A9A', op: A(T, 35, 35.5) });
    if (T > 36.4) o = glitch(o, T, A(T, 36.4, 37));
    return o; }
  // ---------- F · 37–43 DOLAR ----------
  if (T < 43) {
    o += `<div class="ab" style="width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%,#0E2A1E,${KOYU} 70%)"></div>` + serit(T, 1650, '$ DOLAR $', 500, 'rgba(120,255,180,.10)', 'transparent', -6, 140);
    o += slam(T, 37.0, '1 DOLAR', 540, 420, 150, { derin: 10, derinRenk: '#0E3A26' });
    const v = 7.4 + (43 - 7.4) * ioC(A(T, 37.6, 41.2)), dev = A(T, 37.6, 41.2) > 0 && A(T, 37.6, 41.2) < 1;
    const yil = Math.round(2021 + 5 * ioC(A(T, 37.6, 41.2)));
    o += yaz(fmt(v, 2) + ' ₺', 540, 820, 230, { renk: '#7CFFB2', derin: 18, derinRenk: '#0A2A1A', blur: dev ? 2 : 0, chroma: dev ? 3 : 0, mono: true });
    o += yaz('OCAK ' + yil, 540, 1030, 56, { mono: true, renk: BY, op: A(T, 37.6, 37.9) });
    o += slam(T, 41.5, '≈ 6 KAT', 540, 1300, 220, { renk: SR, derin: 18, derinRenk: '#5A5000', chroma: 6 });
    if (T > 42.4) o = glitch(o, T, A(T, 42.4, 43));
    return o; }
  // ---------- G · 43–50 TANIM: ERİME ----------
  if (T < 50) {
    o += `<div class="ab" style="width:1080px;height:1920px;background:${BY}"></div>`;
    o += slam(T, 43.0, 'ENFLASYON', 540, 420, 170, { renk: KOYU, derin: 0 }) + slam(T, 43.6, 'NEDİR?', 540, 580, 120, { renk: KR });
    o += yaz('FİYATLARIN ARTMASI DEĞİL SADECE —', 540, 760, 40, { mono: true, renk: '#55555F', op: A(T, 44.5, 44.8) });
    // eriyen yazı: harfler aşağı akar, damlalar
    const er = A(T, 46.6, 49.6), s = 'PARANIN ERİMESİ';
    if (T > 46) { const q = oE(A(T, 46.0, 46.25)); let xs = 540 - s.length * 33; for (let k = 0; k < s.length; k++) { const ch = s[k], dy = er * er * (80 + 160 * h(k)) , sk = 1 + er * (.5 + 1.0 * h(k + 4)); o += `<div class="c" style="left:${xs + k * 66 + 33}px;top:${1050 + dy}px;font-size:${100 * (2.2 - 1.2 * q)}px;font-weight:900;color:${KR};transform:translate(-50%,-50%) scaleY(${sk});transform-origin:50% 0%;opacity:${q}">${ch === ' ' ? '&nbsp;' : ch}</div>`;
        if (er > 0 && ch !== ' ') o += `<div class="ab" style="left:${xs + k * 66 + 27}px;top:${1100 + dy + 60 * sk}px;width:12px;height:${30 + er * 260 * h(k + 9)}px;background:${KR};border-radius:0 0 8px 8px"></div>`; } }
    // erime göleti
    if (er > 0) o += `<div class="ab" style="left:${540 - 480 * er}px;top:${1750}px;width:${960 * er}px;height:${70 * er}px;border-radius:50%;background:${KR};opacity:.9"></div>`;
    return o; }
  // ---------- H · 50–56 BUGÜN ----------
  if (T < 56) {
    o += `<div class="ab" style="width:1080px;height:1920px;background:${KOYU}"></div>`;
    o += slam(T, 50.0, 'AĞUSTOS 2026', 540, 360, 100, { mono: true, renk: BY });
    const v = 85.51 + (31.51 - 85.51) * ioC(A(T, 50.3, 52.2));
    o += yaz('%' + fmt(v, 2), 540, 620, 240, { renk: v > 50 ? KR : SR, derin: 18, derinRenk: '#2A0000', op: A(T, 50.3, 50.5) });
    o += slam(T, 52.3, 'DÜŞÜYOR ↓', 540, 860, 110, { renk: '#7CFFB2', t1: 53.4 });
    o += slam(T, 53.5, 'AMA', 540, 860, 220, { renk: BY, derin: 16, derinRenk: '#333', chroma: 8, t1: 54.1 });
    o += slam(T, 54.2, 'PARAN HÂLÂ', 540, 1080, 100, { renk: BY }) + slam(T, 54.5, 'YILDA ~%24', 540, 1250, 170, { renk: KR, derin: 14, derinRenk: '#2A0000' }) + slam(T, 54.8, 'ERİYOR', 540, 1430, 150, { renk: KR, derin: 14, derinRenk: '#2A0000' });
    o += yaz('%31,51 fiyat artışı = paranın alım gücünde ~%24 kayıp', 540, 1700, 26, { mono: true, renk: '#8A8A9A', op: A(T, 55, 55.3) });
    if (T > 55.6) o = glitch(o, T, A(T, 55.6, 56));
    return o; }
  // ---------- I · 56–60 FİNAL ----------
  o += `<div class="ab" style="width:1080px;height:1920px;background:${KOYU}"></div>`;
  const kayma = A(T, 57.6, 58.6);
  o += slam(T, 56.0, 'PARAN DURURSA', 540, 640, 110, { renk: BY, derin: 10, derinRenk: '#333' });
  const e = A(T, 57.0, 58.6); o += slam(T, 57.0, 'ERİR.', 540, 860 + e * e * 120, 300, { renk: KR, derin: 22, derinRenk: '#2A0000', chroma: 6 });
  o += slam(T, 58.2, 'SEN NE YAPIYORSUN?', 540, 1240, 74, { renk: SR });
  o += yaz('Kaynak: TÜİK TÜFE · döviz kurları yaklaşık', 540, 1780, 24, { mono: true, renk: '#6A6A7A', op: A(T, 58.6, 59) });
  const kap = A(T, 59.5, 60); if (kap > 0) o += `<div class="ab" style="width:1080px;height:1920px;background:#000;opacity:${kap}"></div>`;
  return o;
}
window.renderAt = t => {
  const T = (window.SB || 0) + t;
  let icerik = sahne(T);
  // kamera: vuruş anlarında zoom punch + sarsıntı
  let p = 0, sk = 0; for (const v of VURUS) { const d = T - v; if (d >= 0 && d < .35) { p = Math.max(p, Math.exp(-d * 12)); sk = Math.max(sk, Math.exp(-d * 18)); } }
  const sx = (h(Math.floor(T * 60)) - .5) * 26 * sk, sy = (h(Math.floor(T * 60) + 99) - .5) * 26 * sk;
  let flas = 0; for (const f of FLAS) { const d = T - f; if (d >= 0 && d < .2) flas = Math.max(flas, 1 - d / .2); }
  // geçiş: segment sınırlarında whip (yatay kayma + bulanıklık)
  const SINIR = [4, 8, 22, 30, 37, 43, 50, 56]; let wx = 0, wb = 0; for (const s of SINIR) { const d = T - s; if (d >= -.12 && d < .12) { const q = d / .12; wx = q < 0 ? -q * q * 600 * -1 : (1 - q) * (1 - q) * -600 * -1; wb = (1 - Math.abs(q)) * 30; } }
  const seed = Math.floor(T * 30) % 97;
  document.getElementById('kok').innerHTML =
    `<div class="ab" style="width:1080px;height:1920px;transform:translate(${sx + wx}px,${sy}px) scale(${1 + .06 * p});filter:${wb ? `blur(${wb}px)` : 'none'}">${icerik}</div>` +
    `<div class="ab" style="width:1080px;height:1920px;background:#FFFFFF;opacity:${flas * .85}"></div>` +
    `<div class="ab" style="width:1080px;height:1920px;background:repeating-linear-gradient(0deg,rgba(0,0,0,.10) 0 2px,transparent 2px 5px);pointer-events:none"></div>` +
    `<svg class="ab" width="1080" height="1920" style="opacity:.10;mix-blend-mode:overlay"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seed}"/></filter><rect width="1080" height="1920" filter="url(#gr)"/></svg>` +
    `<div class="ab" style="width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,.65) 100%)"></div>`;
};
})();
