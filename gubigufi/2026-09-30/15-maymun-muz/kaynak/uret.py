"""#15 Maymun & Muz — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 4.0, 9.3, 15.2, 20.0, 26.3, 33.4, 37.8, 41.6, 48.0, 58.6, 64.5, 69.9, 72.1]
ALT = {10: 2, 12: 3}
TEP = {
    1: [('gubi', .4, 'dusun'), ('gufi', 2.9, 'aha')],
    2: [('gufi', 2.7, 'isaret'), ('gubi', 4.3, 'sasir')],
    3: [('gubi', 3.0, 'aha'), ('gufi', 3.3, 'sasir')],
    4: [('gubi', .2, 'dusun')],
    5: [('gufi', 3.0, 'mutlu'), ('gubi', 4.9, 'alkis')],
    6: [('gubi', .3, 'dusun'), ('gubi', 4.7, 'aha')],
    7: [('gubi', 2.3, 'mutlu')],
    8: [('gufi', .3, 'kahkaha')],
    9: [('gubi', 1.0, 'mutlu'), ('gufi', 4.5, 'mutlu')],
    10: [('gufi', 3.0, 'kahkaha'), ('gubi', 3.2, 'sasir')],
    11: [('gufi', 1.3, 'goster'), ('gubi', 3.0, 'alkis')],
    12: [('gufi', .2, 'yaklas'), ('gufi', 1.2, 'goster'), ('gubi', 1.5, 'mutlu')],
}
ORTAK = r"""
const YES = '#6CC04A';
const BAKICI = KO.giy('gubi', [['kasket', { renk: '#3FA35A', siper: '#1F6B4E' }]]);
const CIFTCI = KO.giy('gubi', [['hasir', {}]]);
const KAPTAN = KO.giy('gubi', [['kasket', { renk: '#1F3A7A', siper: '#10214A' }]]);
const SUNUCU = KO.giy('gubi', [['silindir', { renk: '#E8505B', bant: '#FFD23F' }]]);
const TO = CV.ton('orman');
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/my.js"></script><script src="../ortak/mydp.js"></script>
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
# 01 — orman: dalda maymun, "muz?"
S[1] = r"""
$('zemin').innerHTML = MY.orman(TO, 0, 1200, { dal: [380, 1080, 930] });
window.renderAt = t => {
  let o = MY.maymun(760, 930, 360, { t, duygu: t > 2.8 ? 'mutlu' : 'normal', el: t < 2.6 ? 'kasi' : 'yan', bak: t < 2.8 ? [-.6, .2] : [-.7, -.6] });
  o += gubi(t, { yol: [[.2, -150, 700, 190], [1.2, 250, 720, 190]], x: 250, y: 720, boy: 190, bakHedef: [760, 800] });
  if (t > 1.0 && t < 2.8) o += M.balon(330, 500, MY.muz(0, 0, .75, -15), { w: 220, h: 130, yon: -1 });
  const m = pop(t, 2.8); if (m > 0) o += K.glow({ x: 540, y: 470, r: 220, renk: '#FFE9A8', guc: .7 * Math.min(1, m) }) + grp(MY.muz(0, 0, 2.2, -12), 540, 470, m, 6 * Math.sin(t * 3));
  o += gufi(t, { x: 300, y: 1740, boy: 250, bakHedef: t < 2.8 ? [760, 800] : [540, 470] });
  o += MY.onYapraklar(TO, t);
  o += FX.gecis(t, { orta: 4.0, renk: YES, serit: '#1F6B4E', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — gerçek dünya haritası: primatlar vs yabani muzun yurdu
S[2] = r"""
const PRIM = ['Brazil', 'Colombia', 'Peru', 'Venezuela', 'Bolivia', 'Ecuador', 'Guyana', 'Suriname', 'Mexico', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Belize', 'Paraguay', 'Argentina',
  'Dem. Rep. Congo', 'Congo', 'Gabon', 'Cameroon', 'Nigeria', 'Ghana', "Côte d'Ivoire", 'Liberia', 'Sierra Leone', 'Guinea', 'Senegal', 'Mali', 'Central African Rep.', 'Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Burundi', 'Ethiopia', 'Somalia', 'South Sudan', 'Sudan', 'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'South Africa', 'Madagascar', 'Botswana', 'Namibia', 'Guinea-Bissau', 'Togo', 'Benin', 'Chad', 'Eq. Guinea', 'Morocco', 'Algeria',
  'China', 'Japan', 'Nepal', 'Bhutan', 'Sri Lanka', 'Pakistan', 'Afghanistan', 'Taiwan'];
const MUZ = ['India', 'Bangladesh', 'Myanmar', 'Thailand', 'Laos', 'Vietnam', 'Cambodia', 'Malaysia', 'Indonesia', 'Philippines', 'Papua New Guinea', 'Brunei'];
const vurgu0 = {}, vurgu1 = {}; PRIM.forEach(k => { vurgu0[k] = '#8FD65A'; vurgu1[k] = '#8FD65A'; }); MUZ.forEach(k => { vurgu0[k] = '#8FD65A'; vurgu1[k] = '#FFD23F'; });
const KUTU = [30, 470, 1020, 620];
const h0 = H.ciz({ proj: 'naturalEarth', kutu: KUTU, renk: '#E9DDC2', vurgu: {}, sinirOp: .35 }), h1 = H.ciz({ proj: 'naturalEarth', kutu: KUTU, renk: '#E9DDC2', vurgu: vurgu0, sinirOp: .35 }), h2 = H.ciz({ proj: 'naturalEarth', kutu: KUTU, renk: '#E9DDC2', vurgu: vurgu1, sinirOp: .35 });
$('zemin').innerHTML = `<g style="filter:blur(14px)">${MY.orman(TO, 0, 1200)}</g><rect width="1080" height="1920" fill="#10301A" opacity=".35"/>`;
window.renderAt = t => {
  const a = A(t, .4, .9), b = A(t, 2.6, 3.1);
  let o = `<rect x="20" y="420" width="1040" height="720" rx="40" fill="#BFE3F0"/><rect x="20" y="420" width="1040" height="720" rx="40" fill="#FFFFFF" opacity=".15"/>`;
  o += h0.svg + `<g opacity="${a * (1 - b)}">${h1.svg}</g><g opacity="${b}">${h2.svg}</g>`;
  const c1 = pop(t, .7), c2 = pop(t, 3.0), c3 = pop(t, 4.2);
  if (c1 > 0 && t < 3.0) o += grp(cip('MAYMUNLARIN YAŞADIĞI YERLER', 0, 0, '#3FA35A', '#FFFFFF', 28), 540, 400, c1 * (1 - A(t, 2.7, 3.0)));
  const [sx, sy] = h2.p([112, 5]);
  if (c2 > 0) o += `<circle cx="${sx}" cy="${sy}" r="${130 * c2}" fill="none" stroke="#E8505B" stroke-width="8" stroke-dasharray="16 10"/>` + grp(cip('YABANİ MUZUN YURDU', 0, 0, '#FFD23F', '#1B1640', 28), 540, 400, c2);
  if (c3 > 0) o += grp(`<rect x="-230" y="-70" width="460" height="140" rx="30" fill="#FFFDF6"/>` + MY.muz(-140, 0, .8, -10) + `<path d="M-200 -50 L-80 50" stroke="#C8323C" stroke-width="12"/>` + (w => '')(0) + PR.T_('DOĞADA YOK', 60, 16, 44, '#C8323C'), 560, 1560, c3);
  o += gufi(t, { x: 170, y: 1780, boy: 230, bakHedef: [sx, sy], isaretHedef: [sx, sy] });
  o += gubi(t, { x: 940, y: 1760, boy: 150, bakHedef: [sx, sy] });
  o += FX.gecis(t, { orta: 0, renk: YES, serit: '#1F6B4E', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 03 — ıslah: yabani muz → market muzu (7000 yıl), Gubi çiftçi
S[3] = r"""
const T = CV.ton('adacayi');
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(200, 240, .8) + `<path d="M0 1050 Q540 960 1080 1050 V1920 H0Z" fill="${T.fon2}"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${i * 240 - 60} 1300 L${i * 240 + 60} 1050" stroke="${T.orta}" stroke-width="40" opacity=".5"/>`).join('') + HK.agac(120, 1080, .7, '#6CC04A', '#3FA35A') + HK.agac(980, 1070, .6, '#8FD65A', '#3FA35A') + `<rect x="200" y="1150" width="680" height="40" rx="16" fill="#8E5226"/><rect x="240" y="1190" width="30" height="200" fill="#6A3A20"/><rect x="810" y="1190" width="30" height="200" fill="#6A3A20"/>`;
window.renderAt = t => {
  let o = '';
  const m = FX.E.expo(A(t, 2.9, 3.6));
  o += `<g opacity="${1 - m}">` + MY.yabaniMuz(540, 1080, 1.6 * (1 - .3 * m), -8) + `</g><g opacity="${m}">` + grp(MY.muz(0, 0, 2.0, -10), 540, 1070, .6 + .4 * m) + `</g>`;
  if (t > 2.9 && t < 4.2) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = 120 + 200 * A(t, 2.9, 4.2); o += `<circle cx="${540 + Math.cos(a) * r}" cy="${1070 + Math.sin(a) * r * .6}" r="${10 * (1 - A(t, 2.9, 4.2))}" fill="#FFE45C"/>`; }
  const c = pop(t, .5); if (c > 0) o += grp(cip('TATLI · ÇEKİRDEKSİZ', 0, 0, '#FFD23F', '#1B1640', 32), 540, 460, c);
  const c2 = pop(t, 3.2); if (c2 > 0) o += grp(cip('~7000 YIL ÖNCE · YENİ GİNE', 0, 0, '#1B1640', '#FFE45C', 30), 540, 580, c2);
  o += gubi(t, { x: 860, y: 800, boy: 200, bakHedef: [540, 1070], ust: CIFTCI });
  o += gufi(t, { x: 300, y: 1740, boy: 250, bakHedef: [540, 1070] });
  $('dinamik').innerHTML = o;
};"""
# 04 — geniş: tahtada yabani muz → DETAY: kesiti (sonraki sahneye doğrudan kesme)
S[4] = r"""
const T = CV.ton('adacayi');
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + CV.raf(60, 330, 420, T, 4) + CV.bitki(980, 1150, .9, T) + `<rect x="0" y="1150" width="1080" height="770" fill="${T.koyu}"/><rect x="160" y="1000" width="760" height="160" rx="30" fill="#C8894A"/><rect x="160" y="1000" width="760" height="24" rx="12" fill="#E0A868"/>`;
window.renderAt = t => {
  let o = MY.yabaniMuz(540, 1000, 2.2, -4) + gubi(t, { x: 820, y: 760, boy: 200, bakHedef: [540, 1000], ust: CIFTCI }) + gufi(t, { x: 260, y: 1740, boy: 240, bakHedef: [540, 1000] });
  o += DP.sar(t, .9, 99, d => MYD.yabani(d, 1.5, 2.3));
  $('dinamik').innerHTML = o;
};"""
# 05 — doğada ne yerler: yaprak, çiçek, tohum, böcek, lifli meyve
S[5] = r"""
$('zemin').innerHTML = MY.orman(TO, 0, 1200);
const ITEM = [[2.0, 'YAPRAK', (x, y) => `<ellipse cx="${x}" cy="${y}" rx="70" ry="36" fill="#3FA35A" transform="rotate(-30 ${x} ${y})"/><path d="M${x - 60} ${y + 30} L${x + 60} ${y - 30}" stroke="#1F6B4E" stroke-width="6"/>`],
  [2.7, 'ÇİÇEK', (x, y) => CV.cicek(x, y, 2.2, '#E8505B')], [3.3, 'TOHUM', (x, y) => [0, 1, 2].map(i => `<ellipse cx="${x - 30 + i * 30}" cy="${y + (i % 2) * 14}" rx="16" ry="24" fill="#8E5226"/>`).join('')],
  [3.9, 'BÖCEK', (x, y) => `<ellipse cx="${x}" cy="${y}" rx="44" ry="30" fill="#2E9A9C"/><circle cx="${x + 44}" cy="${y}" r="18" fill="#1B1640"/>` + [-20, 0, 20].map(a => `<path d="M${x + a} ${y + 26} l-10 26 M${x + a} ${y - 26} l-10 -26" stroke="#1B1640" stroke-width="6"/>`).join('')],
  [4.8, 'LİFLİ YABANİ MEYVE', (x, y) => `<circle cx="${x}" cy="${y}" r="48" fill="#8A6FE0"/><circle cx="${x - 16}" cy="${y - 16}" r="12" fill="#FFFFFF" opacity=".4"/><path d="M${x} ${y - 48} l10 -24" stroke="#3FA35A" stroke-width="8"/>`]];
const POS = [[170, 520], [540, 400], [910, 520], [230, 820], [850, 820]];
window.renderAt = t => {
  let o = '', son = -1; ITEM.forEach(([t0], i) => { if (t >= t0) son = i; });
  ITEM.forEach(([t0, ad, f], i) => { const p = pop(t, t0); if (p <= 0) return; const [x, y] = POS[i]; o += `<circle cx="${x}" cy="${y}" r="${110 * Math.min(1, p)}" fill="#FFFDF6" opacity=".9"/>` + grp(f(0, 0), x, y - 10, p) + grp(cip(ad, 0, 0, '#1F6B4E', '#FFFFFF', ad.length > 10 ? 22 : 26), x, y + 110, p); });
  o += MY.maymun(540, 1190, 400, { t, duygu: son >= 0 ? 'mutlu' : 'normal', el: son >= 0 && son !== 3 ? 'agiz' : 'yan', tutar: son === 0 ? 'yaprak' : null, bak: son >= 0 ? [(POS[son][0] - 540) / 400, -.5] : 'kamera' });
  o += gufi(t, { x: 860, y: 1760, boy: 240, bakHedef: [540, 1000], ust: '' }) + (t > 2.6 ? `<g transform="translate(${760} ${1560}) rotate(-30)"><ellipse cx="0" cy="0" rx="60" ry="30" fill="#3FA35A"/></g>` : '');
  o += gubi(t, { x: 200, y: 1560, boy: 180, bakHedef: [540, 1000] });
  o += MY.onYapraklar(TO, t);
  o += FX.gecis(t, { orta: 6.3, renk: '#D8A032', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — 1900'ler limanı: muz gemisi, ucuz muz
S[6] = r"""
const T = CV.ton('kum');
window.renderAt = t => {
  const gx = 1500 - 960 * FX.E.expo(A(t, 1.8, 3.6));
  let o = MY.liman(T, gx) + `<rect width="1080" height="1920" fill="#C8A060" opacity=".12"/>`;
  const q = pop(t, .3); if (q > 0 && t < 2.4) o += grp(txt('?', 0, 0, 220, '#8E5226'), 540, 560, q * (1 - A(t, 2.0, 2.4)));
  const c = pop(t, 2.6); if (c > 0) o += grp(cip("1900'LER", 0, 0, '#2A2440', '#FFE45C', 36), 540, 400, c);
  if (t > 3.6) { for (let i = 0; i < 4; i++) { const p = pop(t, 3.8 + i * .25); if (p > 0) o += grp(MY.muzSalkim(0, 0, .9), 170 + i * 250, 1450, p); } }
  const u = pop(t, 4.7); if (u > 0) o += grp(`<rect x="-160" y="-70" width="320" height="140" rx="20" fill="#FFFDF6" transform="rotate(-6)"/>` + txt('UCUZ!', 0, 22, 76, '#C8323C'), 820, 700, u, -6);
  o += gubi(t, { x: 190, y: 1180, boy: 190, bakHedef: [gx, 900], ust: KAPTAN });
  o += gufi(t, { x: 860, y: 1780, boy: 230, bakHedef: [540, 1450] });
  o += FX.gecis(t, { orta: 0, renk: '#D8A032', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 07 — sirk & hayvanat bahçesi: bol bol muz
S[7] = r"""
$('zemin').innerHTML = MY.sirk();
window.renderAt = t => {
  let o = MY.tabure(540, 1380, 1.1) + MY.maymun(540, 1110, 360, { t, duygu: t > 2.3 ? 'mutlu' : 'normal', el: t > 2.3 ? 'iki' : 'yan', bak: [0, -.8] });
  const c1 = pop(t, .3), c2 = pop(t, 1.2);
  if (c1 > 0) o += grp(cip('HAYVANAT BAHÇESİ', 0, 0, '#3FA35A', '#FFFFFF', 30), 300, 420, c1);
  if (c2 > 0) o += grp(cip('SİRK', 0, 0, '#FFD23F', '#1B1640', 34), 820, 420, c2);
  for (let i = 0; i < 14; i++) { const t0 = 2.2 + i * .1, d = t - t0; if (d < 0) continue; const x = 200 + (i * 173) % 700, y = Math.min(1200 + (i % 3) * 30, -100 + 1600 * d * d + 300 * d); o += MY.muz(x, y, .7, i * 40 + (y < 1150 ? d * 300 : 0)); }
  o += gubi(t, { x: 180, y: 900, boy: 200, bakHedef: [540, 900], ust: SUNUCU });
  $('dinamik').innerHTML = o;
};"""
# 08 — oturma odası: eski TV → DETAY: çizgi film (doğrudan sonraki sahneye)
S[8] = r"""
const T = CV.ton('seftali');
$('zemin').innerHTML = MY.oturma(T);
window.renderAt = t => {
  let o = MY.tv(540, 900, .9, `<rect x="-240" y="-180" width="380" height="320" fill="#FFE45C"/>` + MY.maymun(-50, 120, 260, { t, duygu: 'mutlu', el: 'agiz', tutar: 'muz' }));
  o += `<rect x="120" y="1480" width="840" height="200" rx="60" fill="#8A6FE0"/><rect x="100" y="1400" width="880" height="120" rx="50" fill="#6A4FC0"/>`;
  o += gufi(t, { x: 540, y: 1540, boy: 240, bakHedef: [540, 900] });
  o += DP.sar(t, .9, 99, d => MYD.tvEkran(d, t));
  $('dinamik').innerHTML = o;
};"""
# 09 — Gubi maymuna muz verir → DETAY: mutlu yüz → geniş: Gufi pasta
S[9] = r"""
$('zemin').innerHTML = MY.orman(TO, 0, 1200);
window.renderAt = t => {
  const v = FX.E.inOutQuart(A(t, .6, 1.8)), aldi = t > 1.8;
  let o = MY.maymun(640, 1190, 400, { t, duygu: aldi ? 'mutlu' : 'saskin', el: aldi ? 'yukari' : (t > .8 ? 'uzat' : 'yan'), hedef: [300, 900], tutar: aldi ? 'muz' : null, bak: aldi ? 'kamera' : [-.8, -.2] });
  if (!aldi) o += MY.muz(300 + 340 * v, 820 - 40 * v - Math.sin(v * Math.PI) * 120, 1.0, -20) + (t > .6 ? `<circle cx="${300 + 340 * v}" cy="${820 - 40 * v - Math.sin(v * Math.PI) * 120}" r="90" fill="#FFE9A8" opacity=".25"/>` : '');
  o += gubi(t, { x: 230, y: 760, boy: 200, bakHedef: [640, 900], ust: BAKICI });
  const pz = pop(t, 4.3); if (pz > 0) o += grp(MY.pasta(0, 0, 1), 760, 1560, pz);
  o += gufi(t, { yol: [[4.1, 1250, 1760, 240], [4.5, 520, 1760, 240]], x: 1250, y: 1760, boy: 240, bakHedef: [760, 1500] });
  if (t > 4.5) o += M.balon(420, 1250, txt('♥', 0, 30, 90, '#E8505B'), { w: 170, h: 130, yon: 1 });
  o += MY.onYapraklar(TO, t);
  o += DP.sar(t, 2.5, 4.1, d => MYD.mutluYuz(d, t));
  $('dinamik').innerHTML = o;
};"""
# 10 — DETAY: Paignton tabelası → geniş: Gufi muzu kapıp kaçar, maymun ağlar; gerekçe çipleri
S[10] = r"""
const T = CV.ton('orman');
$('zemin').innerHTML = MY.kafes(T);
window.renderAt = t => {
  const kap = t > 3.1, agla = t > 3.7;
  let o = MY.maymun(560, 1180, 400, { t, duygu: agla ? 'agla' : (kap ? 'saskin' : 'mutlu'), el: kap ? 'yan' : 'yukari', tutar: kap ? null : 'muz', bak: kap && !agla ? [.8, 0] : 'kamera' });
  if (agla) { const k = A(t, 3.7, 5); o += `<ellipse cx="560" cy="1210" rx="${220 * k}" ry="${30 * k}" fill="#6CC8F0" opacity=".6"/>`; }
  o += gubi(t, { x: 200, y: 700, boy: 190, bakHedef: [560, 900], ust: BAKICI });
  const gyol = [[2.3, -200, 1740, 250], [3.0, 690, 1740, 250], [3.2, 700, 1740, 250], [4.0, 1350, 1740, 250]];
  o += gufi(t, { yol: gyol, x: -200, y: 1740, boy: 250, bakHedef: t < 3.1 ? [700, 900] : 'kamera' });
  if (kap && t < 4.0) { const hr = M.hareket(gyol, t); o += MY.muz(hr.x + 80, 1740 - 250 * .7, 1.0, 20); }
  [[6.0, 'GEREKÇE', '#1B1640', '#FFE45C', 34], [7.0, 'FAZLA ŞEKER', '#E8505B', '#FFFFFF', 32], [8.1, 'DİŞ ÇÜRÜĞÜ', '#FFFDF6', '#C8323C', 32], [8.9, 'ŞEKER HASTALIĞI RİSKİ', '#FFFDF6', '#C8323C', 30]].forEach(([t0, s, r, y, f], i) => { const p = pop(t, t0); if (p > 0) o += grp(cip(s, 0, 0, r, y, f), 540, 380 + i * 105, p); });
  o += MY.citOn(T);
  o += DP.sar(t, .1, 2.4, d => MYD.tabela(d, t));
  $('dinamik').innerHTML = o;
};"""
# 11 — Gufi salatayla döner: maymun sakin + parlak tüyler
S[11] = r"""
const T = CV.ton('orman');
$('zemin').innerHTML = MY.kafes(T);
window.renderAt = t => {
  const ver = t > 2.0, parlak = A(t, 2.9, 3.6);
  let o = MY.maymun(560, 1180, 400, { t, duygu: t < 1.3 ? 'uzgun' : 'mutlu', el: ver ? 'agiz' : 'yan', tutar: ver ? 'salata' : null, parlak, bak: t < 1.3 ? [0, .6] : 'kamera' });
  const gx = t < 1.2 ? 1300 - 540 * FX.E.expo(A(t, .1, 1.2)) : 760;
  o += gufi(t, { x: gx, y: 1740, boy: 250, bakHedef: [560, 1000] });
  if (!ver) o += MY.salataKase(gx, 1740 - 250 * 1.1, .7 + .3 * A(t, 1.3, 2.0) * 0);
  const c0 = pop(t, .4), c1 = pop(t, 3.2), c2 = pop(t, 4.3);
  if (c0 > 0) o += grp(cip('YEŞİL YAPRAKLI SEBZELER', 0, 0, YES, '#FFFFFF', 30), 540, 400, c0);
  if (c1 > 0) o += grp(cip('DAHA SAKİN ✓', 0, 0, '#FFFDF6', '#1F6B4E', 32), 330, 520, c1);
  if (c2 > 0) o += grp(cip('PARLAK TÜYLER ✓', 0, 0, '#FFFDF6', '#1F6B4E', 32), 750, 630, c2);
  o += gubi(t, { x: 200, y: 720, boy: 190, bakHedef: [560, 900], ust: BAKICI });
  o += MY.citOn(T);
  o += FX.gecis(t, { orta: 5.9, renk: YES, serit: '#1F6B4E', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 12 — kapanış: üçlü; Gufi salatayla kameraya
S[12] = r"""
$('zemin').innerHTML = MY.orman(TO, 0, 1200);
window.renderAt = t => {
  const k = M.yakinlas(t, .2, 9); M.bulanik(k * .8);
  let arka = MY.maymun(760, 1190, 360, { t, duygu: 'mutlu', el: 'agiz', tutar: 'salata', parlak: .6 }) + gubi(t, { x: 260, y: 820, boy: 190, bakHedef: [760, 900], ust: BAKICI });
  let on = gufi(t, { x: 400, y: 1700 + 120 * k, boy: 250 + 190 * k, bakHedef: 'kamera' });
  const c = pop(t, 4.0); if (c > 0) on += grp(cip('MUZ DEĞİL, SALATA!', 0, 0, YES, '#FFFFFF', 38), 540, 420, c);
  $('dinamik').innerHTML = M.bulanikSar(arka, k * .8) + on + FX.gecis(t, { orta: 0, renk: YES, serit: '#1F6B4E', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
};"""
for k in range(1, 13): S[k] = ORTAK + S[k]
S[13] = open('_logo_sahne.js').read()

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
