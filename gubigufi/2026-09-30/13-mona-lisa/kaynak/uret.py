"""#13 Mona Lisa hırsızlığı v2 (görsel tarz rehberi v3) — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 8.9, 15.95, 20.9, 31.4, 34.2, 42.55, 52.7, 56.45, 59.95, 62.15]
ALT = {4: 3, 6: 2, 9: 3}   # hareket bulanıklığı (ft-motion)

TEP = {
    1: [('gubi', 4.4, 'sasir')],
    2: [('gufi', 3.9, 'omuzSilk')],
    3: [('gubi', 3.4, 'isaret')],
    4: [('gufi', 5.0, 'gozKapa'), ('gufi', 8.6, 'sasir')],
    5: [('gubi', 1.5, 'sasir')],
    6: [('gubi', 3.2, 'dusun'), ('gufi', 6.3, 'mutlu')],
    7: [('gubi', 1.2, 'merak'), ('gubi', 8.2, 'sasir')],
    8: [('gufi', .5, 'alkis'), ('gubi', .7, 'mutlu')],
    9: [('gufi', .15, 'yaklas'), ('gufi', 1.5, 'goster')],
}
ORTAK = r"""
const TL = ML2.LOUVRE;
const SAFAK = { fon1: '#8C86DC', fon2: '#746CC8', orta: '#5C52AC', koyu: '#453C8E', cokKoyu: '#2E276A', acik: '#C2BCF4', vurgu: '#FFC24C', vurgu2: '#FF8FA8', isik: '#ECE8FF', ten: '#F5A8C0' };
const INSAN = [['#E8505B', '#2A1E5E', 'kakul', '#2A1E5E'], ['#2E9A9C', '#3A2A20', 'kisa', '#3A2A20'], ['#FFB44C', '#1B1F5E', 'atkuyrugu', '#6A3A20'], ['#8A6FE0', '#2A2A30', 'uzun', '#1B1F5E'], ['#6CC04A', '#3A2A20', 'kisa', '#8A5A3C']];
const insan = (i, x, y, boy, ek = {}) => { const [u, a, st, sr] = INSAN[i % INSAN.length]; return KS.karakter(Object.assign({ x, y, boy, ust: u, alt: a, sac: { tip: st, renk: sr }, ten: '#F7B39A' }, ek)); };
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/ml.js"></script>
<script src="../ortak/harita/d3-array.min.js"></script><script src="../ortak/harita/d3-geo.min.js"></script><script src="../ortak/harita/topojson-client.min.js"></script><script src="../ortak/harita/dunya50.js"></script><script src="../ortak/harita/ulke_tablo.js"></script><script src="../ortak/harita/turkiye10.js"></script><script src="../ortak/harita/harita.js"></script>
<script src="../ortak/logo_paths.js"></script><script src="../ortak/altyazi.js"></script>
<script>
const $ = i => document.getElementById(i), A = K.aralik, E = K.ease;
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pop = (t, a, d = .45) => back(A(t, a, a + d));
const grp = (s, x, y, k = 1, r = 0, op = 1) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})" opacity="${op}">${s}</g>`;
const olc = (s, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const txt = (s, x, y, size, renk = '#FFF3D6', w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
const cip = (s, x, y, renk, yazi = '#0B1433', fs = 38) => { const w = s.length * fs * .62 + 70; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
const gubi = (t, o) => M.canli('gubi', Object.assign({ t, tepkiler: TP.gubi }, o));
const gufi = (t, o) => M.canli('gufi', Object.assign({ t, tepkiler: TP.gufi }, o));
__JS__
</script>
<script src="../ortak/kanal.js"></script>
</body></html>"""


S = {}
# 01 — Louvre salonu (dolu): Mona Lisa çerçevesi boşalır
S[1] = r"""
$('zemin').innerHTML = ML2.muzeSalon(TL) + ML2.heykel(130, 1150, .75, TL) + CV.bitki(990, 1150, 1.05, TL);
window.renderAt = t => {
  let o = '';
  const bos = t > 4.2, gh = A(t, 6.2, 7.0);
  o += ML.cerceve(540, 690, 360, 520, ML.monaLisa(540, 690, 360, 520), bos);
  if (bos && gh > 0) { o += K.glow({ x: 540, y: 690, r: 420, renk: '#FFD27A', guc: .5 * gh }) + `<g opacity="${.55 * gh}">` + ML.cerceve(540, 690, 360, 520, ML.monaLisa(540, 690, 360, 520)) + `</g>`;
    for (let i = 0; i < 6; i++) { const q = A(t, 6.5 + i * .25, 6.9 + i * .25); if (q > 0 && q < 1) o += ML.flasPatlamasi(540 + Math.cos(i * 2.1) * 320, 690 + Math.sin(i * 2.1) * 400, 40 * (1 - q) + 10, 1 - q); } }
  o += ML2.kadife(360, 720, 1160, TL) + ML2.bank(840, 1330, .9, TL);
  o += insan(0, 250, 1560, 440, { t, bak: [.5, -.4] }) + insan(2, 780, 1600, 420, { t, bak: [-.5, -.4], ifade: bos ? 'saskin' : 'notr' });
  const d = pop(t, .3); if (d > 0) o += grp(`<rect x="-270" y="-56" width="540" height="112" rx="20" fill="${TL.vurgu}"/>` + txt('21 AĞUSTOS 1911', 0, 20, 58, TL.cokKoyu), 540, 1060, d, -4);
  o += gubi(t, { yol: [[.4, 1250, 420, 110], [1.8, 900, 470, 110]], x: 900, y: 470, boy: 110, bakHedef: [540, 690] });
  o += ML2.onCerceve(TL) + FX.flas(t, 4.2, .75, .09);
  o += FX.gecis(t, { orta: 8.9, renk: TL.vurgu, serit: TL.cokKoyu, kapat: { tur: 'egik', sure: .35 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — duvar dolusu tablo, Mona Lisa köşede; ziyaretçiler önünden geçip gidiyor (lavanta)
S[2] = r"""
const T = CV.ton('lavanta'), R = K.rnd(4), TAB = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const w = 150 + R() * 60, h = 150 + R() * 80; TAB.push([140 + c * 265, 480 + r * 220, w * .8, h * .72, [T.vurgu, T.vurgu2, '#2E9A9C', '#6CC04A', '#E8505B', T.koyu][(r * 4 + c) % 6]]); }
$('zemin').innerHTML = ML2.muzeSalon(T, 0, { tablolar: false });
window.renderAt = t => {
  let o = '';
  TAB.forEach(([x, y, w, h, r], i) => { if (i === 11) return; o += ML.cerceve(x, y, w, h, `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="${r}"/><circle cx="${x + w * .2}" cy="${y - h * .2}" r="${w * .12}" fill="#FFF6E6" opacity=".7"/><path d="M${x - w / 2} ${y + h / 2} L${x - w * .1} ${y} L${x + w * .2} ${y + h * .2} L${x + w / 2} ${y - h * .05} V${y + h / 2}Z" fill="#000" opacity=".2"/>`); });
  const [mx, my] = [TAB[11][0], TAB[11][1]];
  o += ML.cerceve(mx, my, 100, 145, ML.monaLisa(mx, my, 100, 145));
  const k = pop(t, 1.3); if (k > 0) o += `<circle cx="${mx}" cy="${my}" r="${120 * Math.min(1, k)}" fill="none" stroke="#FFD27A" stroke-width="8" stroke-dasharray="18 12"/>`;
  o += CV.bitki(80, 1150, .9, T) + ML2.bank(540, 1200, .9, T);
  for (let i = 0; i < 4; i++) { const x = ((t * 150 + i * 330) % 1500) - 220; o += insan(i, x, 1560 + (i % 2) * 60, 400, { adim: t * 7 + i, t }); }
  o += gufi(t, { x: 950, y: 1240, boy: 110, bakHedef: [mx, my] });
  o += FX.gecis(t, { orta: 0, renk: TL.vurgu, serit: TL.cokKoyu, kapat: { sure: .01 }, ac: { tur: 'egik', sure: .45 } });
  $('dinamik').innerHTML = o;
};"""
# 03 — Peruggia atölyede (kum tonları)
S[3] = r"""
const T = CV.ton('kum');
$('zemin').innerHTML = ML2.atolye(T);
window.renderAt = t => {
  let o = olc(ML.peruggia({ x: 560, y: 1330, boy: 600 }), 560, 1330, pop(t, .15, .5) + .001);
  const e = pop(t, 1.1); if (e > 0) o += grp(cip('CAM VİTRİN İŞÇİSİ', 0, 0, T.cokKoyu, '#FFF3E0', 30), 540, 400, e);
  const n = pop(t, 3.4); if (n > 0) o += grp(cip('VINCENZO PERUGGIA', 0, 0, '#FFF3E0', T.cokKoyu, 30), 560, 1235, n);
  o += gubi(t, { x: 950, y: 820, boy: 100, bakHedef: [560, 950], isaretHedef: [600, 900] });
  o += CV.onYaprak({ koyu: T.koyu, cokKoyu: T.cokKoyu }, 'alt', 4);
  o += FX.gecis(t, { orta: 4.95, renk: '#C0583A', kapat: { tur: 'daire', merkez: [560, 900], sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 04 — şafak, kapalı müze: beyaz önlüklü hırsız tabloyu önlüğe saklar ve çıkar
S[4] = r"""
$('zemin').innerHTML = ML2.muzeSalon(SAFAK) + `<rect x="880" y="600" width="180" height="550" rx="16" fill="${SAFAK.cokKoyu}"/><rect x="896" y="620" width="148" height="510" rx="12" fill="${SAFAK.koyu}"/><circle cx="916" cy="880" r="10" fill="${SAFAK.vurgu}"/>` + ML2.heykel(140, 1150, .65, SAFAK);
window.renderAt = t => {
  let o = '';
  const kp = pop(t, .3); if (kp > 0) o += grp(`<rect x="-120" y="-40" width="240" height="80" rx="14" fill="#FFF3E0"/>` + txt('KAPALI', 0, 16, 40, '#C0283C'), 970, 540, kp);
  const pz = pop(t, 1.9); if (pz > 0) o += grp(cip('PAZARTESİ · 07:00', 0, 0, SAFAK.vurgu, SAFAK.cokKoyu, 28), 420, 420, pz);
  const kay = E(A(t, 4.8, 6.4)), sak = A(t, 6.8, 7.8), bos = t > 4.8;
  o += ML.cerceve(470, 700, 300, 440, ML.monaLisa(470, 700, 300, 440), bos);
  const gir = E(A(t, 1.0, 4.0)), cik = FX.E.inExpo(A(t, 8.3, 10.0));
  const x = -140 + (330 + 140) * gir + (1300 - 330) * cik, yur = (t < 4 || t > 8.3) ? t * (t > 8.3 ? 14 : 8) : null;
  o += KS.karakter({ x, y: 1480, boy: 620, ust: '#F6F2EA', alt: '#2A2466', sac: { tip: 'kisa', renk: '#1E1612' }, biyik: '#1E1612', ten: '#F5B8A8', adim: yur, poz: sak > .5 ? 'tasi' : 'dur', t, bak: [.4, -.3] });
  if (sak > .5) o += `<rect x="${x - 70}" y="${1480 - 310}" width="140" height="130" rx="14" fill="#EDE6DA"/>`;
  if (bos && sak < 1) { const px = 470 - 140 * kay, py = 700 + 530 * kay, s = 1 - .45 * kay - .5 * sak; o += `<g opacity="${1 - sak}">` + ML.monaLisa(px, py, 300 * s, 440 * s) + `</g>`; }
  o += gufi(t, { x: 830, y: 1250, boy: 110, bakHedef: [x, 1000] });
  o += CV.onYaprak({ koyu: SAFAK.koyu, cokKoyu: SAFAK.cokKoyu }, 'alt', 6);
  o += FX.gecis(t, { orta: 0, renk: '#C0583A', kapat: { sure: .01 }, ac: { tur: 'daire', merkez: [560, 900], sure: .5 } });
  $('dinamik').innerHTML = o;
};"""
# 05 — ertesi gün fark edildi: bekçi boş çerçeveyi gösterir (şeftali ofis ışığı)
S[5] = r"""
const T = CV.ton('seftali');
$('zemin').innerHTML = ML2.muzeSalon(T) + CV.saat(700, 380, 46, T, 0);
window.renderAt = t => {
  const g = Math.floor(A(t, .7, 1.1) * 1.999) ? 22 : 21;
  let o = ML.cerceve(700, 720, 300, 440, '', true) + olc(ML.takvim(270, 620, g, 'AĞUSTOS', .75), 270, 620, pop(t, 0, .4));
  if (t > .7 && t < 1.1) o += `<rect x="143" y="${510 + (t - .7) * 400}" width="255" height="120" rx="20" fill="#FFFFFF" opacity="${1 - (t - .7) / .4}"/>`;
  o += insan(1, 400, 1600, 560, { poz: 'goster', ifade: 'saskin', t, bak: [.6, -.5] });
  o += gubi(t, { x: 940, y: 1080, boy: 100, bakHedef: [700, 720] });
  $('dinamik').innerHTML = o;
};"""
# 06 — Paris sokağı + gazete büfesi, manşetler; sonra boş duvar önünde kuyruk
S[6] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 2.4, 2.9));
  if (g < 1) {
    const T = CV.ton('adacayi'); let a = ML2.sokak(T, t) + ML2.bufe(820, 1180, T);
    a += insan(4, 180, 1700, 520, { t, poz: 'tasi', bak: [.3, -.2] }) + `<rect x="${180 - 60}" y="${1700 - 262}" width="120" height="100" rx="6" fill="#F3E6CC"/><path d="M${180 - 45} ${1700 - 240}h90M${180 - 45} ${1700 - 215}h70" stroke="#6A5A48" stroke-width="6"/>`;
    [[330, 760, -8, .3, 'LA JOCONDE', 'ÇALINDI!'], [720, 720, 6, .7, 'LOUVRE', 'ŞOKTA'], [540, 900, -2, 1.1, 'MONA LİSA', 'NEREDE?']].forEach(([x, y, r, a0, m1, m2]) => { const d = pop(t, a0, .4); if (d <= 0) return;
      a += `<g transform="translate(0 ${-(1 - Math.min(1, d)) * 500})">` + ML.gazete(x, y, .56, r, FX.harfHarf(m1, 0, -220, 70, t, a0 + .2, { renk: ML.P.murekkep }) + FX.harfHarf(m2, 0, -140, 64, t, a0 + .4, { renk: '#C0283C' })) + `</g>`; });
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = ML2.muzeSalon(TL, t) + ML.cerceve(540, 640, 300, 440, '', true) + ML2.kadife(360, 720, 1150, TL);
    const adet = Math.floor(3 + 6 * E(A(t, 2.9, 7.5)));
    for (let i = adet - 1; i >= 0; i--) b += insan(i, 620 + i * 115, 1560 + (i % 2) * 40, 420 - i * 8, { t, bak: [-.6, -.4] });
    b += gubi(t, { x: 190, y: 560, boy: 100, bakHedef: [540, 640] });
    b += gufi(t, { yol: [[4.3, 1200, 1240, 110], [6.2, 450, 1240, 110]], x: 450, y: 1240, boy: 110, bakHedef: [540, 640] });
    b += ML2.onCerceve(TL);
    o += `<g opacity="${g}">${b}</g>`;
  }
  o += FX.gecis(t, { orta: 2.65, renk: '#2E9A9C', serit: '#FFC24C', kapat: { tur: 'egik', sure: .25, yon: -1 }, ac: { tur: 'egik', sure: .35, yon: -1 } });
  $('dinamik').innerHTML = o;
};"""
# 07 — çatı katında sandık (2 yıl) → GERÇEK harita masada: Paris → Floransa
S[7] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 5.0, 5.5));
  if (g < 1) {
    const T = CV.ton('kum'); let a = ML2.cati(T, t);
    const ac = E(A(t, .9, 1.6));
    a += ML.sandik(620, 1450, 1.2, ac, ac > .2 ? `<g transform="translate(0 -175) rotate(90) scale(.8)">` + ML.cerceve(0, 0, 110, 170, ML.monaLisa(0, 0, 110, 170)).replace(/fill="#000" opacity=".25"/, 'fill="none"') + `</g>` : '');
    const yl = pop(t, 2.2); if (yl > 0) a += grp(`<rect x="-170" y="-70" width="340" height="140" rx="40" fill="#C0583A"/>` + txt(FX.sayac(t, 2.2, 3.6, 0, 2) + ' YIL', 0, 26, 76, '#FFF3E0'), 540, 760, yl);
    a += gubi(t, { x: 180, y: 780, boy: 100, bakHedef: [620, 1300] });
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    const T = CV.ton('adacayi');
    let b = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + `<rect x="0" y="1180" width="1080" height="740" fill="${T.koyu}"/><rect x="0" y="1180" width="1080" height="24" fill="${T.cokKoyu}"/>` + CV.raf(60, 330, 360, T, 5) + CV.lamba(950, 1180, .9, T) + CV.bitki(110, 1180, .8, T);
    const h = H.ciz({ ulkeler: H.kita('EU'), sigdir: H.ulke('İtalya', 'İsviçre', 'Belçika', 'Avusturya'), kenar: 30, vurgu: { 'Fransa': '#8FAE8B', 'İtalya': '#E8A0A0' }, kutu: [110, 420, 860, 720], renk: '#F3E6CC', rim: '#FFF8EC', sinirOp: .6 });
    b += `<g transform="rotate(-2 540 780)"><rect x="100" y="410" width="880" height="740" rx="24" fill="#F6EEDC"/><defs><clipPath id="avc"><rect x="110" y="420" width="860" height="720" rx="18"/></clipPath></defs><rect x="110" y="420" width="860" height="720" rx="18" fill="#BFDDE6"/><g clip-path="url(#avc)">${h.svg}</g></g>`;
    const [px, py] = h.p([2.35, 48.86]), [fx, fy] = h.p([11.26, 43.77]);
    b += H.igne(px, py, '#2E9A9C', .9, 'Paris');
    const yolp = E(A(t, 5.8, 7.6)); if (yolp > 0) { const mx = (px + fx) / 2 + 60, my = (py + fy) / 2 - 80; let d = `M${px} ${py - 50}`; for (let i = 1; i <= 24 * yolp; i++) { const u = i / 24; d += ` L${(1 - u) * (1 - u) * px + 2 * (1 - u) * u * mx + u * u * fx} ${(1 - u) * (1 - u) * (py - 50) + 2 * (1 - u) * u * my + u * u * (fy - 50)}`; }
      b += `<path d="${d}" stroke="#C0583A" stroke-width="9" stroke-dasharray="20 14" fill="none" stroke-linecap="round"/>`; }
    const fp = pop(t, 7.6); if (fp > 0) b += grp(H.igne(0, 0, '#C0583A', 1, 'Floransa'), fx, fy, fp);
    const yk = pop(t, 8.3); if (yk > 0) b += grp(`<rect x="-160" y="-54" width="320" height="108" rx="30" fill="#7A2E3A"/>` + txt('1913', -40, 20, 56, '#FFF3E0') + `<circle cx="80" cy="-6" r="22" fill="none" stroke="#FFF3E0" stroke-width="9"/><circle cx="118" cy="-6" r="22" fill="none" stroke="#FFF3E0" stroke-width="9"/>`, fx - 40, fy + 110, yk);
    b += CV.kupa(880, 1180, 1.2, T.vurgu, 1, t) + gubi(t, { x: 540, y: 1260, boy: 100, bakHedef: yolp < 1 ? [px + (fx - px) * yolp, py + (fy - py) * yolp] : [fx, fy] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 08 — döndüğünde bir yıldız: kalabalık, foto flaşları, ışın
S[8] = r"""
const T = CV.ton('sari');
$('zemin').innerHTML = ML2.muzeSalon(T);
window.renderAt = t => {
  let o = '';
  const k = pop(t, 0, .5);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * .3; o += `<path d="M540 690 L${540 + Math.cos(a) * 900} ${690 + Math.sin(a) * 900} L${540 + Math.cos(a + .1) * 900} ${690 + Math.sin(a + .1) * 900}Z" fill="#FFFFFF" opacity="${.2 * k}"/>`; }
  o += K.glow({ x: 540, y: 690, r: 500, renk: '#FFFFFF', guc: .5 * k }) + olc(ML.cerceve(540, 690, 340, 500, ML.monaLisa(540, 690, 340, 500)), 540, 690, k * (1 + .02 * Math.sin(t * 3)));
  o += ML2.kadife(340, 740, 1150, T);
  for (let i = 0; i < 7; i++) o += insan(i, 90 + i * 150, 1560 + (i % 2) * 50, 400, { t, poz: i % 3 === 0 ? 'selam' : 'dur', bak: [(540 - (90 + i * 150)) / 600, -.6], ifade: 'gulumse' });
  for (let i = 0; i < 10; i++) { const q = ((t * 1.8 + i * .37) % 1); o += ML.flasPatlamasi(120 + ((i * 97) % 840), 1060 + (i % 3) * 60, 36 * (1 - q) + 8, (1 - q) * A(t, .2, .5)); }
  const y = pop(t, 1.3); if (y > 0) o += grp(txt('YILDIZ', 0, 0, 70, T.cokKoyu), 540, 380, y);
  o += gubi(t, { x: 150, y: 520, boy: 100, bakHedef: [540, 690] }) + gufi(t, { x: 940, y: 1120, boy: 110, bakHedef: [540, 690] });
  $('dinamik').innerHTML = o;
};"""
# 09 — kapanış: Gufi kameraya yaklaşır, müze bulanık
S[9] = r"""
$('zemin').innerHTML = ML2.muzeSalon(TL) + ML.cerceve(300, 700, 250, 360, '', true) + ML.cerceve(780, 700, 250, 360, ML.monaLisa(780, 700, 250, 360)) + ML2.bank(540, 1330, .9, TL) + CV.bitki(80, 1150, .9, TL);
window.renderAt = t => {
  const k = M.yakinlas(t, .15, 9);
  M.bulanik(k);
  let arka = gubi(t, { x: 540, y: 470, boy: 100, bakHedef: [540, 1000] });
  const on = gufi(t, { x: 540, y: 1250, boy: 130 + 300 * k, bakHedef: k > .5 ? 'kamera' : [780, 700] });
  $('dinamik').innerHTML = M.bulanikSar(arka, k) + on;
};"""
for k in range(1, 10): S[k] = ORTAK + S[k]
S[10] = open('_logo_sahne.js').read()

plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
tum = []
N = len(SB) - 1
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
