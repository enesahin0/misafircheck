"""#21 1518 Dans vebası — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 8.2, 11.7, 15.6, 26.3, 32.3, 40.0, 45.7, 49.65, 56.3, 60.7, 68.2, 73.8, 77.9, 82.6, 87.8, 94.5, 96.7]
ALT = {}
TEP = {
    1: [('gubi', 6.9, 'sasir')],
    2: [('gubi', .5, 'omuzSilk')],
    3: [('gufi', 2.0, 'dusun')],
    4: [('gubi', 8.5, 'omuzSilk')],
    5: [('gufi', .6, 'dusun'), ('gufi', 4.7, 'aha')],
    6: [('gubi', 2.2, 'mutlu'), ('gubi', 5.6, 'kararli')],
    7: [('gubi', .4, 'dusun'), ('gubi', 4.3, 'korku')],
    8: [('gufi', .5, 'kararli'), ('gubi', 1.1, 'uzgun')],
    9: [('gufi', .8, 'kararli')],
    10: [('gufi', 2.3, 'mutlu'), ('gubi', 2.4, 'mutlu'), ('gubi', 3.3, 'dusun')],
    11: [('gubi', .3, 'aha'), ('gubi', 6.6, 'kararli')],
    12: [('gubi', .5, 'goster'), ('gufi', 3.7, 'aha')],
    13: [('gufi', .6, 'uzgun')],
    14: [('gubi', 1.2, 'korku')],
    15: [('gubi', 2.3, 'isaret'), ('gufi', 2.7, 'sasir')],
    16: [('gufi', 4.3, 'aha'), ('gubi', 5.3, 'mutlu')],
}
ORTAK = r"""
const MAV = '#E07A3F';
const MUZ = KO.giy('gubi', [['bere', { renk: '#7E2E3A' }]]);
const TARIHCI = KO.giy('gubi', ['gozluk']);
// Gufi HEKİM: hekim başlığı + sağ elinde matula (idrar şişesi); eller:false ile kullan (üçüncü el çıkmasın)
const HEKIM_G = (x, y, boy, ifade, t) => KO.giy('gufi', ['hekim'])(x, y, boy) + DV.matula(x + boy * .66, y - boy * .66, boy / 330, t) + `<circle cx="${x + boy * .64}" cy="${y - boy * .5}" r="${boy * .12}" fill="#8E1B3F"/><circle cx="${x + boy * .63}" cy="${y - boy * .51}" r="${boy * .12}" fill="#EE312E"/>`;
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/dv.js"></script>
<script src="../ortak/harita/d3-array.min.js"></script><script src="../ortak/harita/d3-geo.min.js"></script><script src="../ortak/harita/topojson-client.min.js"></script><script src="../ortak/harita/dunya50.js"></script><script src="../ortak/harita/ulke_tablo.js"></script><script src="../ortak/harita/turkiye10.js"></script><script src="../ortak/harita/harita.js"></script>
<script src="../ortak/logo_paths.js"></script><script src="../ortak/altyazi.js"></script>
<script>
const $ = i => document.getElementById(i), A = K.aralik, E = K.ease;
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pop = (t, a, d = .45) => back(A(t, a, a + d));
const grp = (s, x, y, k = 1, r = 0, op = 1) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})" opacity="${op}">${s}</g>`;
const olc = (s, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const txt = (s, x, y, size, renk = '#FFF3D6', w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
const cip = (s, x, y, renk, yazi = '#0B1433', fs = 38) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
const gubi = (t, o) => M.canli('gubi', Object.assign({ t, tepkiler: TP.gubi }, o));
const gufi = (t, o) => M.canli('gufi', Object.assign({ t, tepkiler: TP.gufi }, o));
__JS__
</script>
<script src="../ortak/kanal.js"></script>
</body></html>"""


S = {}
# 01 — 1518 temmuz, Strazburg sokağı; Frau Troffea kapıdan çıkar, dansa başlar
S[1] = r"""
$('zemin').innerHTML = DV.sokak({ y0: 1180 });
window.renderAt = t => {
  let o = KS.karakter(Object.assign({ x: 130, y: 1300, boy: 330, t, bak: [.8, -.2], ifade: t > 6.8 ? 'saskin' : 'notr' }, KS.donem(1518, 0))) + KS.karakter(Object.assign({ x: 960, y: 1290, boy: 320, t, bak: [-.8, -.2], ifade: t > 7.0 ? 'saskin' : 'notr' }, KS.donem(1518, 1)));
  const yur = FX.E.inOutQuart(A(t, 2.7, 6.2)), tx = 330 + 210 * yur;
  if (t > 2.6) { const dans = t > 6.6, sw = dans ? Math.sin(t * 6) * 10 : 0, bob = dans ? Math.abs(Math.sin(t * 5)) * 18 : 0;
    o += `<g transform="translate(0 ${-bob}) rotate(${sw} ${tx} 1270)">` + KS.karakter(Object.assign({ x: tx, y: 1270, boy: 420, t, poz: dans ? 'dans' : 'dur', adim: t < 6.2 ? t * 7 : (dans ? t * 8 : null), bak: [0, -.2], ifade: dans ? 'gulumse' : 'notr' }, DV.TROFFEA)) + '</g>'; }
  const c = pop(t, .3); if (c > 0) o += grp(cip('1518 · STRAZBURG', 0, 0, '#1B1640', '#FFE45C', 34), 540, 380, c);
  const n = pop(t, 3.0); if (n > 0) o += grp(cip('FRAU TROFFEA', 0, 0, '#E07A3F', '#FFFFFF', 30), tx, 760, n);
  o += DV.davul(700, 1800, .9, t, false) + gubi(t, { x: 870, y: 1700, boy: 250, bakHedef: [tx, 1000], ust: MUZ });
  $('dinamik').innerHTML = o;
};"""
# 02 — Müzik yok, durmuyor → DETAY: kapıya çentik (günlerce)
S[2] = r"""
$('zemin').innerHTML = DV.sokak({ y0: 1180 });
window.renderAt = t => {
  const T = t + 8.2, sw = Math.sin(T * 6) * 10, bob = Math.abs(Math.sin(T * 5)) * 20;
  let o = `<g transform="translate(0 ${-bob}) rotate(${sw} 540 1260)">` + KS.karakter(Object.assign({ x: 540, y: 1260, boy: 470, t: T, poz: 'dans', adim: T * 8, bak: [0, -.3], ifade: 'saskin' }, DV.TROFFEA)) + '</g>';
  const m = pop(t, .15); if (m > 0) o += grp(DV.notaCarpi(0, 0, 1), 540, 470, m);
  o += DV.davul(700, 1800, .9, t, false) + gubi(t, { x: 870, y: 1700, boy: 250, bakHedef: [540, 900], ust: MUZ });
  o += DP.sar(t, 1.7, 3.6, d => DVD.centik(d));
  $('dinamik').innerHTML = o;
};"""
# 03 — bir hafta: halk katılır, sayaç 34+; Gufi hekim kaşlarını çatar
S[3] = r"""
$('zemin').innerHTML = DV.meydan({ y0: 1150 });
window.renderAt = t => {
  const T = t + 11.7;
  let o = '';
  [[150, 1240, 300, 1, .3], [930, 1240, 300, 2, .6], [300, 1210, 260, 3, 1.3], [780, 1210, 260, 4, 1.6], [90, 1180, 230, 5, 2.2], [990, 1180, 230, 6, 2.5], [420, 1170, 220, 7, 2.9], [660, 1170, 220, 8, 3.1]].forEach(([x, y, b, i, t0]) => { const g = FX.E.outExpo(A(t, t0, t0 + .6)); if (g > 0) o += `<g opacity="${g}">` + DV.dansci(x + (x < 540 ? -120 : 120) * (1 - g), y, b, T, i) + '</g>'; });
  o += `<g transform="translate(0 ${-Math.abs(Math.sin(T * 5)) * 18}) rotate(${Math.sin(T * 6) * 10} 540 1260)">` + KS.karakter(Object.assign({ x: 540, y: 1260, boy: 400, t: T, poz: 'dans', adim: T * 8, ifade: 'saskin' }, DV.TROFFEA)) + '</g>';
  const c = pop(t, .2); if (c > 0) o += grp(cip('1 HAFTA', 0, 0, '#1B1640', '#FFE45C', 34), 540, 370, c);
  const s = pop(t, 1.5); if (s > 0) o += grp(`<rect x="-150" y="-70" width="300" height="140" rx="30" fill="#E07A3F"/>` + txt(FX.sayac(t, 1.6, 3.4, 1, 34) + '+', 0, 20, 76, '#FFFFFF') + txt('KİŞİ', 0, 58, 26, '#FFF3D6', 800), 540, 520, s);
  o += gufi(t, { x: 210, y: 1790, boy: 260, bakHedef: [540, 1000], ust: HEKIM_G, eller: false });
  $('dinamik').innerHTML = o;
};"""
# 04 — Ağustos: yüzlerce → DETAY ayakkabılar → geniş: kimse neden bilmiyor
S[4] = r"""
$('zemin').innerHTML = DV.meydan({ y0: 1150 });
window.renderAt = t => {
  const T = t + 15.6;
  let o = DV.kalabalik(T, { n: 13, y: 1195, boy: 210, seed: 1, bas: 10 }) + DV.kalabalik(T, { n: 10, y: 1260, boy: 280, x0: 20, x1: 1060, seed: 4, bas: 30 });
  if (t > 8.0) for (let k = 0; k < 6; k++) { const p = pop(t, 8.1 + k * .15); if (p > 0) o += grp(txt('?', 0, 0, 64, '#FFF3D6'), 110 + k * 170, 880 + (k % 2) * 60 + Math.sin(T * 3 + k) * 10, p); }
  o += DV.kalabalik(T, { n: 4, y: 1990, boy: 540, x0: 0, x1: 1080, seed: 9, bas: 50 });
  const c = pop(t, .3); if (c > 0) o += grp(cip('AĞUSTOS 1518', 0, 0, '#1B1640', '#FFE45C', 34), 540, 380, c);
  const y = pop(t, 2.4); if (y > 0) o += grp(cip('YÜZLERCE DANSÇI', 0, 0, '#E07A3F', '#FFFFFF', 34), 540, 470, y);
  o += gubi(t, { x: 900, y: 1690, boy: 230, bakHedef: [540, 1000], ust: MUZ });
  o += DP.sar(t, 5.4, 8.0, d => DVD.ayakkabi(d));
  $('dinamik').innerHTML = o;
};"""
# 05 — hekimler kurulu: Gufi hekim matulaya bakar → DETAY reçete → geniş: DAHA ÇOK DANS!
S[5] = r"""
$('zemin').innerHTML = `<g style="filter:blur(10px)">${DV.meydan({ y0: 1150 })}</g><rect width="1080" height="1920" fill="#1B1030" opacity=".25"/>`;
window.renderAt = t => {
  let o = KS.karakter(Object.assign({ x: 170, y: 1300, boy: 480, t, bak: [.6, -.3], ifade: 'notr' }, DV.HEKIM(0))) + KS.karakter(Object.assign({ x: 910, y: 1300, boy: 470, t, bak: [-.6, -.3], ifade: 'notr' }, DV.HEKIM(1)));
  o += gufi(t, { x: 540, y: 1250, boy: 330, bakHedef: [700, 820], ust: HEKIM_G, eller: false });
  const c = pop(t, .3); if (c > 0) o += grp(cip('ŞEHRİN HEKİMLERİ', 0, 0, '#1B1640', '#FFE45C', 34), 540, 380, c);
  const d = pop(t, 4.65); if (d > 0) { o += grp(`<rect x="-330" y="-80" width="660" height="160" rx="40" fill="#E07A3F"/>` + txt('DAHA ÇOK DANS!', 0, 26, 74, '#FFFFFF'), 540, 560, d);
    for (let k = 0; k < 6; k++) { const q = ((t - 4.65) * .9 + k / 6) % 1; o += DV.nota(200 + k * 140, 800 - q * 300, .9, '#FFE45C', 1 - q); } }
  o += DP.sar(t, 2.1, 4.55, d => DVD.recete(d));
  o += FX.gecis(t, { orta: 0, renk: '#E07A3F', serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — sahne kurulur, müzisyenler (Gubi davul), güçlü adamlar dansçıyı tutar
S[6] = r"""
$('zemin').innerHTML = DV.meydan({ y0: 1150 });
window.renderAt = t => {
  const T = t + 32.3;
  let o = DV.kalabalik(T, { n: 12, y: 1190, boy: 190, seed: 2, bas: 60 });
  o += DV.sahne(540, 1150, 780, FX.E.outExpo(A(t, .1, 1.7)));
  const m = A(t, 2.0, 2.4); if (m > 0) { o += `<g opacity="${m}">` + DV.fluct(760, 1122, 400, T, 3) + '</g>'; }
  const cal = t > 2.1;
  o += DV.davul(250, 1100, 1.0, t, cal) + gubi(t, { x: 360, y: 960, boy: 200, bakHedef: 'kamera', ust: MUZ });
  if (cal) for (let k = 0; k < 5; k++) { const q = ((t - 2.1) * .7 + k / 5) % 1; o += DV.nota(160 + k * 90 + Math.sin(q * 6 + k) * 30, 900 - q * 380, .8, '#FFF3D6', (1 - q) * Math.min(1, (t - 2.1) * 2)); }
  // güçlü adamlar yorgun dansçıyı tutar (ön plan; yüzler altyazı bandının altında)
  const g = FX.E.outExpo(A(t, 4.1, 4.8));
  if (g > 0) { const yy = 1990 + 200 * (1 - g);
    o += KS.karakter(Object.assign({ x: 300, y: yy, boy: 590, t: T, poz: 'goster', bak: [.5, -.2], ifade: 'notr' }, DV.GUCLU(0))) + `<g transform="translate(1080 0) scale(-1 1)">` + KS.karakter(Object.assign({ x: 300, y: yy, boy: 590, t: T, poz: 'goster', bak: [.5, -.2], ifade: 'notr' }, DV.GUCLU(1))) + '</g>';
    o += `<g transform="rotate(${Math.sin(T * 5) * 4} 540 ${yy})">` + KS.karakter(Object.assign({ x: 540, y: yy - 20, boy: 560, t: T, poz: 'dans', adim: T * 5, bak: [0, .3], ifade: 'notr' }, KS.donem(1518, 5))) + '</g>'; }
  [['SAHNE', .3, 330], ['MÜZİSYENLER', 2.2, 410], ['GÜÇLÜ ADAMLAR', 4.3, 490]].forEach(([s, t0, y]) => { const p = pop(t, t0); if (p > 0) o += grp(cip(s, 0, 0, '#1B1640', '#FFE45C', 30), 540, y, p); });
  $('dinamik').innerHTML = o;
};"""
# 07 — harita: salgın yayılır
S[7] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#3A2A20"/>` + `<g opacity=".25">${DV.kaldirim(0, '#5A4A3A', '#4A3A2A')}</g>`;
window.renderAt = t => {
  let o = DV.harita(t, FX.E.inOutQuart(A(t, 1.9, 5.4)), { y: 760, s: .85 });
  const c = pop(t, .3); if (c > 0) o += grp(cip('TAHMİN EDİN…', 0, 0, '#1B1640', '#FFE45C', 34), 540, 250, c);
  const s = pop(t, 4.35); if (s > 0) o += grp(cip('SALGIN BÜYÜYOR', 0, 0, '#E8323C', '#FFFFFF', 38), 540, 1270 - 60, s);
  o += DV.davul(190, 1820, .9, t, t < 1.6) + gubi(t, { x: 870, y: 1700, boy: 250, bakHedef: [540, 760], ust: MUZ });
  o += FX.gecis(t, { orta: 0, renk: '#E07A3F', serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 08 — karar tersine: belediye kapısı → DETAY ferman (tut, kes)
S[8] = r"""
$('zemin').innerHTML = DV.belediye();
window.renderAt = t => {
  let o = '';
  const c = pop(t, .3); if (c > 0) o += grp(cip('KARAR TERSİNE', 0, 0, '#1B1640', '#FFE45C', 34), 540, 250, c);
  const r = FX.E.inOutQuart(A(t, .5, 1.6)); o += `<g transform="translate(540 1010) rotate(${-180 * r})" opacity="${A(t, .4, .6)}"><path d="M-110 0 A110 110 0 1 1 0 110" stroke="#FFE45C" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-150 -10 L-110 50 L-70 -10Z" fill="#FFE45C"/></g>`;
  o += gufi(t, { x: 230, y: 1800, boy: 260, bakHedef: [540, 900], ust: HEKIM_G, eller: false });
  o += DV.davul(690, 1810, .9, t, false) + gubi(t, { x: 860, y: 1690, boy: 240, bakHedef: [540, 900], ust: MUZ });
  o += DP.sar(t, 1.9, 3.95, d => DVD.ferman(d));
  $('dinamik').innerHTML = o;
};"""
# 09 — Aziz Vitus türbesine kafile → DETAY kırmızı ayakkabılar (tut, kes)
S[9] = r"""
$('zemin').innerHTML = DV.dag(0);
const YOL = [[610, 1330], [700, 1200], [640, 1120], [700, 1040]];
const yolNok = u => { const n = YOL.length - 1, k = Math.min(n - 1, Math.floor(u * n)), q = u * n - k; return [YOL[k][0] + (YOL[k + 1][0] - YOL[k][0]) * q, YOL[k][1] + (YOL[k + 1][1] - YOL[k][1]) * q]; };
window.renderAt = t => {
  const T = t + 49.65;
  let o = '';
  for (let k = 6; k >= 0; k--) { const u = Math.min(.98, k * .14 + t * .03), [x, y] = yolNok(u), b = 170 - u * 110;
    o += KS.karakter(Object.assign({ x, y, boy: b, t: T, adim: T * 5 + k, bak: [.3, -.5] }, k % 3 === 1 ? DV.HEKIM(k) : KS.donem(1518, k + 20))); }
  const c = pop(t, .5); if (c > 0) o += grp(cip('AZİZ VİTUS TÜRBESİ', 0, 0, '#1B1640', '#FFE45C', 30), 760, 700, c);
  o += gufi(t, { x: 250, y: 1790, boy: 270, bakHedef: [760, 900], ust: HEKIM_G, eller: false });
  o += DP.sar(t, 3.45, 6.65, d => DVD.kirmizi(d));
  $('dinamik').innerHTML = o;
};"""
# 10 — Eylül: meydan boşalır; Gubi & Gufi rahatlar; "Peki neydi bu?"
S[10] = r"""
$('zemin').innerHTML = DV.meydan({ y0: 1150 });
window.renderAt = t => {
  const T = t + 56.3, g = 1 - FX.E.inOutQuart(A(t, .4, 2.6));
  let o = DV.kalabalik(T, { n: 12, y: 1200, boy: 230, seed: 3, bas: 70, gorunen: Math.max(.09, g) });
  const c = pop(t, .3); if (c > 0) o += grp(cip('EYLÜL 1518', 0, 0, '#1B1640', '#FFE45C', 34), 540, 380, c);
  const q = pop(t, 3.2); if (q > 0) o += grp(`<circle cx="0" cy="0" r="110" fill="#E07A3F"/>` + txt('?', 0, 50, 150, '#FFFFFF'), 540, 700, q);
  o += gufi(t, { x: 300, y: 1800, boy: 270, bakHedef: [540, 800], ust: HEKIM_G, eller: false });
  o += gubi(t, { x: 800, y: 1690, boy: 250, bakHedef: [540, 800], ust: MUZ });
  $('dinamik').innerHTML = o;
};"""
# 11 — Teori 1: çavdar mahmuzu → DETAY → geniş: kasılma ≠ haftalarca dans; Gubi TARİHÇİ
S[11] = r"""
$('zemin').innerHTML = DV.tarla(0);
window.renderAt = t => {
  const T = t + 60.7;
  let o = '';
  const c = pop(t, .2); if (c > 0) o += grp(cip('TEORİ 1', 0, 0, '#1B1640', '#FFE45C', 34), 540, 330, c);
  const k1 = pop(t, 3.5), k2 = pop(t, 5.5);
  if (k1 > 0) { const j = Math.sin(T * 40) * 5; o += grp(`<rect x="-200" y="-260" width="400" height="520" rx="36" fill="#FFF8EC"/>` + `<g transform="translate(${j} 0)">` + KS.karakter(Object.assign({ x: 0, y: 150, boy: 300, t: T, poz: 'dur', ifade: 'saskin' }, KS.donem(1518, 2))) + '</g>' + txt('KASILMA', 0, 225, 44, '#3A1E3A'), 280, 760, k1); }
  if (k2 > 0) { o += grp(`<rect x="-200" y="-260" width="400" height="520" rx="36" fill="#FFF8EC"/>` + KS.karakter(Object.assign({ x: 0, y: 150, boy: 300, t: T, poz: 'dans', adim: T * 8, ifade: 'gulumse' }, KS.donem(1518, 1))) + txt('HAFTALARCA', 0, 205, 36, '#3A1E3A') + txt('DANS', 0, 245, 36, '#3A1E3A'), 800, 760, k2);
    o += grp(`<circle cx="0" cy="0" r="62" fill="#E8323C"/>` + txt('≠', 0, 26, 90, '#FFFFFF'), 540, 760, pop(t, 5.9)); }
  o += PR.kitap(640, 1760, .35, 1, '', '', '#6A3A2A') + gubi(t, { x: 820, y: 1650, boy: 250, bakHedef: [540, 760], ust: TARIHCI });
  o += DP.sar(t, 1.2, 3.4, d => DVD.ergot(d));
  o += FX.gecis(t, { orta: 0, renk: '#E07A3F', serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 12 — tarihçiler: kitlesel psikojenik hastalık
S[12] = r"""
const TN = CV.ton('seftali');
$('zemin').innerHTML = CV.oda(TN, { zeminY: 1300, pencere: [720, 300, 260, 320] }) + CV.raf(60, 520, 380, TN) + CV.lamba(940, 1300, 1, TN);
window.renderAt = t => {
  let o = '';
  const c = pop(t, .3); if (c > 0) o += grp(cip('TARİHÇİLERİN ÇOĞU', 0, 0, '#1B1640', '#FFE45C', 34), 540, 330, c);
  const p = pop(t, 3.45); if (p > 0) { o += grp(`<rect x="-440" y="-150" width="880" height="300" rx="46" fill="#1B1640"/><rect x="-440" y="-150" width="880" height="300" rx="46" fill="none" stroke="#E07A3F" stroke-width="8"/>` + txt('KİTLESEL', 0, -45, 64, '#FFE45C') + txt('PSİKOJENİK HASTALIK', 0, 50, 64, '#FFFFFF') + txt('toplu, bulaşan stres tepkisi', 0, 112, 30, '#C8C0E8', 700), 540, 560, p); }
  o += PR.kitap(300, 1200, .35, 1, '', '', '#6A3A2A') + gubi(t, { x: 300, y: 1000, boy: 230, bakHedef: [820, 1100], ust: TARIHCI });
  o += gufi(t, { x: 800, y: 1290, boy: 300, bakHedef: [300, 980] });
  $('dinamik').innerHTML = o;
};"""
# 13 — kıtlık, hastalık, tükenmiş şehir
S[13] = r"""
$('zemin').innerHTML = `<g style="filter:saturate(.35) brightness(.85)">${DV.sokak({ gok: 'gri', y0: 1180 })}</g>`;
window.renderAt = t => {
  const T = t + 73.8;
  let o = KS.karakter(Object.assign({ x: 150, y: 1270, boy: 400, t: T, poz: 'tasi', bak: [.2, .5], ifade: 'notr' }, KS.donem(1518, 1))) + `<path d="M90 ${1270 - 300 * 400 / 700} Q150 ${1270 - 230 * 400 / 700} 210 ${1270 - 300 * 400 / 700}Z" fill="#8E6A4A"/>`;
  o += KS.karakter(Object.assign({ x: 840, y: 1270, boy: 380, t: T, bak: [-.2, .5], ifade: 'notr' }, KS.donem(1518, 4)));
  // veba işaretli kapı (dönem: salgın evine boyalı haç)
  o += `<g opacity="${A(t, 1.2, 1.5)}"><path d="M292 1070 L352 1070 M322 1040 L322 1110" stroke="#C8232F" stroke-width="14" stroke-linecap="round"/></g>`;
  [['KITLIK', .3, 330, '#8E6A4A'], ['HASTALIK', 1.3, 410, '#C8232F'], ['TÜKENMİŞ BİR ŞEHİR', 2.4, 490, '#1B1640']].forEach(([s, t0, y, r]) => { const p = pop(t, t0); if (p > 0) o += grp(cip(s, 0, 0, r, '#FFFFFF', 32), 540, y, p); });
  o += gufi(t, { x: 820, y: 1810, boy: 250, bakHedef: [540, 1000] });
  $('dinamik').innerHTML = o;
};"""
# 14 — Aziz Vitus laneti inancı: kilise, sunak, dua eden halk (arkadan siluet)
S[14] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#1E1624"/>` + [0, 1, 2, 3].map(i => `<path d="M${40 + i * 270} 1920 L${40 + i * 270} 500 Q${175 + i * 270} 260 ${310 + i * 270} 500 L${310 + i * 270} 1920" fill="none" stroke="#2E2436" stroke-width="30"/>`).join('') + `<circle cx="540" cy="700" r="420" fill="#FFB45C" opacity=".12"/>`;
window.renderAt = t => {
  const T = t + 77.9;
  let o = DV.sunak(540, 780, 1.25);
  const l = A(t, 1.0, 1.6); if (l > 0) for (let k = 0; k < 9; k++) { const a = T * 1.4 + k / 9 * Math.PI * 2, r = 330 + 30 * Math.sin(T * 3 + k); o += DV.nota(540 + Math.cos(a) * r, 700 + Math.sin(a) * r * .7, .9, '#E8323C', .85 * l); }
  const c = pop(t, .5); if (c > 0) o += grp(cip('AZİZ VİTUS LANETİ', 0, 0, '#E8323C', '#FFFFFF', 34), 540, 250, c);
  // dua eden halk: arkadan siluet (yüz yok)
  for (let k = 0; k < 6; k++) { const x = 90 + k * 180, y = 1640 + (k % 2) * 60, kad = k % 2 === 0;
    o += `<ellipse cx="${x}" cy="${y + 160}" rx="120" ry="150" fill="#120C16"/><circle cx="${x}" cy="${y}" r="62" fill="#1A121E"/>` + (kad ? `<path d="M${x - 66} ${y + 10} Q${x - 70} ${y - 70} ${x} ${y - 72} Q${x + 70} ${y - 70} ${x + 66} ${y + 10} Q${x} ${y - 20} ${x - 66} ${y + 10}Z" fill="#CFC6B4"/>` : `<ellipse cx="${x + 8}" cy="${y - 44}" rx="72" ry="20" fill="#0A060C"/>`); }
  o += gubi(t, { x: 900, y: 1130, boy: 200, bakHedef: [540, 700], ust: TARIHCI });
  $('dinamik').innerHTML = o;
};"""
# 15 — stres + inanç → beyin → beden dans eder
S[15] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#2A2140"/><circle cx="540" cy="640" r="480" fill="#4A3A6A" opacity=".5"/>`;
window.renderAt = t => {
  const T = t + 82.6, isi = A(t, 1.2, 2.0);
  let o = `<circle cx="540" cy="620" r="${260 + 20 * Math.sin(T * 6) * isi}" fill="#E056C1" opacity="${.25 * isi}"/>` + DV.beyin(540, 620, .95, isi > .5 ? '#F58AB4' : '#F2A4B4');
  const s1 = pop(t, .3), s2 = pop(t, 1.0);
  if (s1 > 0) o += grp(cip('STRES', 0, 0, '#E8323C', '#FFFFFF', 34), 190, 460, s1) + `<path d="M230 500 Q300 520 360 560" stroke="#E8323C" stroke-width="14" fill="none" stroke-linecap="round" opacity="${s1}"/>`;
  if (s2 > 0) o += grp(cip('İNANÇ', 0, 0, '#8C6CFF', '#FFFFFF', 34), 890, 460, s2) + `<path d="M850 500 Q780 520 720 560" stroke="#8C6CFF" stroke-width="14" fill="none" stroke-linecap="round" opacity="${s2}"/>`;
  const a = A(t, 2.3, 2.8); if (a > 0) o += `<path d="M540 ${900} L540 ${900 + 70 * a}" stroke="#FFE45C" stroke-width="16" stroke-linecap="round"/><path d="M510 ${950 + 20 * a} L540 ${990 * 1 + 10 * a} L570 ${950 + 20 * a}" stroke="#FFE45C" stroke-width="16" fill="none" stroke-linecap="round" opacity="${a}"/>`;
  const d = A(t, 2.5, 2.9); if (d > 0) o += `<g opacity="${d}" transform="translate(0 ${-Math.abs(Math.sin(T * 5)) * 16}) rotate(${Math.sin(T * 6) * 9} 540 1260)">` + KS.karakter(Object.assign({ x: 540, y: 1260, boy: 330, t: T, poz: 'dans', adim: T * 8, ifade: 'saskin' }, DV.TROFFEA)) + '</g>';
  o += gubi(t, { x: 200, y: 1690, boy: 230, bakHedef: [540, 620], isaretHedef: [540, 620], ust: TARIHCI });
  o += gufi(t, { x: 870, y: 1800, boy: 250, bakHedef: [540, 1100] });
  $('dinamik').innerHTML = o;
};"""
# 16 — final: akşam Strazburg; mikrop değil, korkuydu
S[16] = r"""
$('zemin').innerHTML = DV.sokak({ gok: 'aksam', y0: 1180, gece: 1 });
window.renderAt = t => {
  const T = t + 87.8;
  let o = `<g opacity=".85" transform="translate(0 ${-Math.abs(Math.sin(T * 5)) * 10}) rotate(${Math.sin(T * 6) * 8} 540 1200)">` + KS.karakter(Object.assign({ x: 540, y: 1200, boy: 250, t: T, poz: 'dans', adim: T * 8, ifade: 'notr' }, DV.TROFFEA)) + '</g>';
  const c = pop(t, .3); if (c > 0) o += grp(cip('500 YIL ÖNCE', 0, 0, '#1B1640', '#FFE45C', 34), 540, 330, c);
  const m = pop(t, 3.8); if (m > 0) { o += grp(DV.mikrop(0, 0, 1) + (t > 4.2 ? `<path d="M-110 -110 L110 110" stroke="#E8323C" stroke-width="22" stroke-linecap="round" opacity="${A(t, 4.2, 4.4)}"/>` : ''), 540, 560, m * (1 - A(t, 5.0, 5.2))); }
  const k = pop(t, 5.2); if (k > 0) o += grp(`<rect x="-280" y="-95" width="560" height="190" rx="48" fill="#1B1640"/><rect x="-280" y="-95" width="560" height="190" rx="48" fill="none" stroke="#E07A3F" stroke-width="8"/>` + txt('KORKU', 0, 38, 110, '#FFE45C'), 540, 560, k);
  o += gufi(t, { x: 330, y: 1800, boy: 290, bakHedef: 'kamera', ust: HEKIM_G, eller: false });
  o += DV.davul(930, 1830, .8, t, false) + gubi(t, { x: 760, y: 1690, boy: 250, bakHedef: 'kamera', ust: MUZ });
  o += FX.gecis(t, { orta: 0, renk: '#E07A3F', serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""

N = len(SB) - 1
for k in range(1, N): S[k] = ORTAK + S[k]
S[N] = open('_logo_sahne.js').read()

plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
tum = []
for i in range(1, N + 1):
    tp = {'gubi': [[a, b] for k, a, b in TEP.get(i, []) if k == 'gubi'], 'gufi': [[a, b] for k, a, b in TEP.get(i, []) if k == 'gufi']}
    tum += [[k, round(SB[i - 1] + a, 3), b] for k, a, b in TEP.get(i, [])]
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__TP__", json.dumps(tp)).replace("__JS__", S[i])
    if i == N: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append(dict({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]}, **({"alt_kare": ALT[i]} if i in ALT else {})))
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
json.dump(sorted(tum, key=lambda r: r[1]), open("tepkiler.json", "w"), ensure_ascii=False)
print("sahneler + plan.json + tepkiler.json yazıldı")
