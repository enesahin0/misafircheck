"""#10 Bulduğun Cüzdan — sahne HTML'leri + plan.json + tepkiler.json (maskotlar rolde)."""
import json

SB = [0, 5.0, 13.4, 22.65, 29.6, 34.55, 44.65, 52.1, 56.3, 58.5]
ALT = {6: 2, 8: 3}
TEP = {
    1: [('gufi', 1.4, 'sasir'), ('gufi', 4.1, 'dusun')],
    2: [('gubi', 2.2, 'isaret'), ('gufi', 3.2, 'dusun'), ('gubi', 6.5, 'isaret')],
    3: [('gufi', 2.6, 'korku'), ('gubi', 3.0, 'kararli'), ('gufi', 7.9, 'sasir')],
    4: [('gubi', 3.4, 'mutlu'), ('gufi', 5.9, 'mutlu')],
    5: [('gufi', .6, 'goster'), ('gubi', 1.9, 'dusun'), ('gubi', 4.1, 'kahkaha'), ('gufi', 4.3, 'sasir')],
    6: [('gubi', 6.3, 'mutlu'), ('gufi', 8.9, 'omuzSilk')],
    7: [('gufi', .3, 'dusun'), ('gufi', 6.3, 'zipla'), ('gubi', 6.5, 'alkis')],
    8: [('gufi', .1, 'yaklas'), ('gufi', 1.0, 'goster'), ('gubi', 1.2, 'mutlu')],
}
ORTAK = r"""
const MOR = '#8C6CFF';
const POLIS = KO.giy('gubi', [['kasket', { renk: '#1F3A7A', siper: '#10214A' }]]);
const HAKIM = KO.giy('gubi', ['gozluk', ['papyon', { renk: '#1B1640' }]]);
const SAHIP = KO.giy('gubi', [['melon', { renk: '#6A3A20' }]]);
const GOREVLI = KO.giy('gubi', [['kasket', { renk: '#8E1B3F', siper: '#5A0F28' }]]);
const SONBAHAR = ['#F28F3A', '#E8505B', '#FFB44C', '#C8623A'];
const cuz = (x, y, s, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})">` + PR.cuzdan(0, 0, s, 0) + '</g>';
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script>
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
# 01 — sonbahar sokağı: Gufi cüzdanı bulur
S[1] = r"""
const T = CV.ton('seftali');
$('zemin').innerHTML = PR.sokak(T, 0, 1300) + HK.agac(330, 1320, 1.0, '#F28F3A', '#C8623A') + HK.agac(830, 1320, .9, '#FFB44C', '#E07A2A');
window.renderAt = t => {
  let o = HK.yapraklar(t, SONBAHAR, 12, [0, 1080, 100, 1800]);
  const acil = FX.E.expo(A(t, 1.7, 2.3));
  if (acil < 1) o += `<g opacity="${1 - acil}">` + K.glow({ x: 700, y: 1600, r: 120, renk: '#FFE9A8', guc: .6 + .3 * Math.sin(t * 6) }) + cuz(700, 1560, .5, -12) + `</g>`;
  o += gufi(t, { yol: [[0, -200, 1720, 260], [1.3, 380, 1720, 260]], x: 380, y: 1720, boy: 260, bakHedef: t < 1.3 ? [700, 1580] : t < 4 ? [540, 820] : 'kamera' });
  if (acil > 0) { o += grp(PR.cuzdan(0, 60, 1.5, FX.E.expo(A(t, 2.0, 2.5))), 540, 820, acil);
    for (let i = 0; i < 3; i++) { const b = FX.yay(t - 2.3 - i * .12); if (b > 0) o += PR.banknot(540 + (i - 1) * 120 * b, 820 - 200 * b, 330, { deger: ['100', '200', '50'][i], birim: 'TL', pal: ['mavi', 'yesil', 'turuncu'][i], rot: (i - 1) * 16 * b }); }
    const k = FX.yay(t - 3.05); if (k > 0) o += HK.kimlik(760, 900 - 60 * k, 1.0 * Math.min(1.2, k), 12); }
  const q = pop(t, 4.1); if (q > 0) o += grp(txt('?', 0, 0, 170, MOR), 620, 1080, q, 8);
  o += FX.gecis(t, { orta: 5.0, renk: MOR, serit: '#1B1640', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — yol ayrımı: Gubi trafik polisi yolu gösterir; Medeni Kanun kitabı
S[2] = r"""
const T = CV.ton('gunes');
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(200, 260, .9) + CV.bulut(880, 180, .7) + `<path d="M0 1180 Q540 1100 1080 1180 V1920 H0Z" fill="#9FD27A"/><path d="M380 1920 L500 1180 L580 1180 L700 1920Z" fill="#C9C2B4"/><path d="M0 1500 Q300 1440 520 1460 L540 1520 Q260 1520 0 1600Z" fill="#C9C2B4"/><path d="M1080 1480 Q800 1430 560 1460 L550 1520 Q820 1510 1080 1580Z" fill="#C9C2B4"/>` + HK.agac(120, 1250, .8, '#6CC04A', '#3FA35A') + HK.agac(960, 1240, .75, '#8FD65A', '#3FA35A');
window.renderAt = t => {
  let o = '';
  const kp = pop(t, .3, .5); if (kp > 0) { const sol = PR.Tm('TÜRK MEDENİ', -160, -60, 34, '#4A348E', 'letter-spacing="3"') + PR.Tm('KANUNU', -160, -10, 34, '#4A348E', 'letter-spacing="3"') + PR.T_('§', -160, 110, 110, '#8C6CFF');
    let sag = PR.Tm('MADDE 769', 160, -100, 30, '#4A348E', 'letter-spacing="3"'); if (t > 1.9) sag += FX.harfHarf('BİLDİRMEK', 160, 0, 50, t, 1.9, { renk: '#1B1640' }) + FX.harfHarf('ZORUNLU', 160, 70, 50, t, 2.2, { renk: '#C8323C' });
    o += grp(PR.kitap(0, 0, 1, 1, sol, sag, '#5A3FA8'), 540, 520, kp * .85); }
  const y1 = A(t, 1.8, 2.3), y2 = A(t, 6.4, 6.9);
  o += HK.direk(540, 780, 1480, [['SAHİBİ', -1, 870, y1 * (1 - y2 * .6), '#FFE45C'], ['POLİS', 1, 1010, y2, '#7CC8FF']]);
  o += gubi(t, { yol: [[.4, 1200, 1560, 200], [1.4, 850, 1560, 200]], x: 850, y: 1560, boy: 200, bakHedef: t < 6 ? [370, 870] : [710, 1010], isaretHedef: t < 6 ? [300, 870] : [800, 1010], ust: POLIS });
  if (t > 1.4) o += `<g transform="translate(${930} ${1640}) rotate(-20)"><rect x="-40" y="-18" width="80" height="36" rx="18" fill="#C9D2E0"/><circle cx="36" cy="0" r="24" fill="#C9D2E0"/><circle cx="36" cy="0" r="10" fill="#5A607E"/></g>`;
  o += gufi(t, { x: 260, y: 1740, boy: 250, bakHedef: t < 6 ? [370, 870] : [710, 1010] }) + cuz(430, 1640, .35, -10);
  o += FX.gecis(t, { orta: 0, renk: MOR, serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 03 — saklarsan suç: parmaklık gölgesi → mahkeme, Gubi hakim
S[3] = r"""
const T = CV.ton('seftali'), TM = CV.ton('kum');
window.renderAt = t => {
  const g = FX.E.expo(A(t, 2.2, 2.7));
  let o = '';
  if (g < 1) { let a = `<rect width="1080" height="1920" fill="${T.fon1}"/>`; for (let r = 0; r < 14; r++) for (let c = 0; c < 6; c++) a += `<rect x="${c * 190 + (r % 2) * 95 - 60}" y="${r * 90 + 100}" width="176" height="78" rx="8" fill="${T.fon2}"/>`;
    a += `<rect x="0" y="1320" width="1080" height="600" fill="${T.orta}"/>` + HK.parmaklik(140, 380, 800, 900, .3 * A(t, 1.6, 2.1));
    const saklan = FX.E.expo(A(t, .5, 1.4));
    a += gufi(t, { x: 480, y: 1740, boy: 280, bak: [Math.sin(t * 3) * .9, 0], bakHedef: null });
    a += cuz(600 + 60 * saklan, 1560 + 120 * saklan, .45 * (1 - .5 * saklan), -10);
    o += `<g opacity="${1 - g}">${a}</g>`; }
  if (g > 0) { let b = HK.mahkeme(TM) + HK.parmaklik(80, 1300, 380, 560, .22);
    b += gubi(t, { x: 540, y: 690, boy: 210, bakHedef: [540, 1500], ust: HAKIM });
    b += HK.kursu(540, 1180, TM, 'TCK 160');
    const vur = (t0) => { const d = t - t0; return d > 0 && d < .35 ? -40 * Math.sin(d / .35 * Math.PI) : 0; };
    b += HK.tokmak(820, 820, 1.0, -30 + vur(3.0) + vur(5.2) + vur(6.3));
    [[5.0, 'ŞİKÂYETE BAĞLI', '#FFE45C', '#1B1640'], [6.2, '1 YILA KADAR HAPİS', '#C8323C', '#FFFFFF'], [7.6, 'ya da ADLİ PARA CEZASI', '#1B1640', '#FFE45C']].forEach(([t0, s, r, y], i) => { const p = pop(t, t0); if (p > 0) b += grp(cip(s, 0, 0, r, y, 30), 540, 960 + i * 80, p); });
    b += gufi(t, { x: 540, y: 1760, boy: 250, bakHedef: [540, 700] });
    if (t > 7.9) { const c = FX.yay(t - 7.9); b += cuz(700, 1600 - 120 * c, .45, 10); }
    o += `<g opacity="${g}">${b}</g>`; }
  o += FX.flas(t, 3.0, .35, .06) + FX.flas(t, 5.2, .25, .06);
  $('dinamik').innerHTML = o;
};"""
# 04 — apartman kapısı: sahibine teslim, masraf + uygun ödül
S[4] = r"""
const T = CV.ton('gul');
$('zemin').innerHTML = HK.apartman(T, 0);
window.renderAt = t => {
  const ac = FX.E.expo(A(t, 1.6, 2.2));
  let o = HK.apartman(T, ac) + CV.bitki(520, 1320, .9, T) + CV.bitki(1040, 1320, .8, T);
  if (ac > .3) o += gubi(t, { x: 780, y: 1000, boy: 210, bakHedef: t < 3.4 ? [430, 1400] : 'kamera', ust: SAHIP });
  const w = FX.E.inOutQuart(A(t, 2.6, 3.4)); o += cuz(450 + 300 * w, 1530 - 430 * w - Math.sin(w * Math.PI) * 120, .4, -10 + 20 * w);
  const h = FX.E.inOutQuart(A(t, 5.3, 5.9)); if (t > 5.2) o += HK.hediye(760 - 360 * h, 1080 + 460 * h - Math.sin(h * Math.PI) * 160, .9);
  const c1 = pop(t, 4.4), c2 = pop(t, 5.5);
  if (c1 > 0) o += grp(cip('MASRAF ✓', 0, 0, '#2FBF71', '#FFFFFF', 34), 290, 560, c1);
  if (c2 > 0) o += grp(cip('UYGUN ÖDÜL ✓', 0, 0, '#FFE45C', '#1B1640', 34), 290, 690, c2);
  o += gufi(t, { x: 300, y: 1740, boy: 260, bakHedef: [780, 1000] });
  o += HK.yapraklar(t, SONBAHAR, 6, [0, 1080, 0, 1900]);
  o += FX.gecis(t, { orta: 6.95, renk: '#5E5874', kapat: { tur: 'daire', merkez: [540, 800], sure: .35 } });
  $('dinamik').innerHTML = o;
};"""
# 05 — "%10" efsanesi: taş çatlar, parçalanır
S[5] = r"""
const T = CV.ton('lavanta');
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + CV.bulut(160, 240, .8, '#FFFFFF', T.acik) + CV.bulut(900, 360, .6, '#FFFFFF', T.acik) + `<path d="M0 1200 Q540 1120 1080 1200 V1920 H0Z" fill="${T.orta}"/><path d="M0 1450 Q540 1400 1080 1470 V1920 H0Z" fill="${T.koyu}" opacity=".5"/>` + CV.kaya(120, 1230, .8, T) + CV.kaya(980, 1240, .6, T);
window.renderAt = t => {
  let o = '';
  const cik = FX.E.expo(A(t, .1, .7)), cat = A(t, 4.0, 4.3), par = A(t, 4.35, 4.95);
  if (par <= 0) o += `<g transform="translate(0 ${(1 - cik) * 600})">` + HK.tas(540, 820, 1.0, cat) + `</g>`; else o += HK.tas(540, 820, 1.0, 1, par);
  if (t > 3.8 && par < 1) { const d = A(t, 3.8, 4.1); o += HK.damgaYazi(540, 820, 2.2 - 1.2 * FX.E.outExpo(d), 'EFSANE', '#C8323C', -12, Math.min(1, d * 2) * (1 - par)); }
  const kb = pop(t, 2.0); if (kb > 0) o += grp((w => `<rect x="${-w / 2}" y="-60" width="${w}" height="120" rx="20" fill="#FFFDF6"/>`)(K.yaziGen('KANUNDA ORAN YOK', 44) + 80) + txt('KANUNDA ORAN YOK', 0, 16, 44, '#4A348E'), 540, 360, kb);
  o += gufi(t, { x: 270, y: 1740, boy: 260, bakHedef: [540, 820] });
  if (t > .6 && t < 3.9) o += M.balon(420, 1270, txt('%10?', 0, 16, 56, '#1B1640'), { w: 220, h: 110, yon: -1 });
  o += gubi(t, { x: 860, y: 1560, boy: 200, bakHedef: t < 4 ? [540, 820] : [270, 1550] });
  o += FX.flas(t, 4.0, .4, .06) + FX.sokHalkasi(540, 820, t, 4.35, { renk: '#FFFFFF' });
  o += FX.gecis(t, { orta: 0, renk: '#5E5874', kapat: { sure: .01 }, ac: { tur: 'daire', merkez: [540, 800], sure: .45 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — istisna: bölünmüş ekran — sokak (ödül ✓) · bina içi (görevliye teslim, ödül ✗)
S[6] = r"""
const T = CV.ton('seftali'), TB = CV.ton('teal');
$('zemin').innerHTML = `<defs><clipPath id="solY"><rect x="0" y="0" width="540" height="1920"/></clipPath></defs><g clip-path="url(#solY)">` + PR.sokak(T, 0, 1300) + HK.agac(300, 1320, .9, '#F28F3A', '#C8623A') + `</g>` + HK.binaIci(TB, 540, 540) + `<rect x="532" y="0" width="16" height="1920" fill="#FFFDF6"/>`;
window.renderAt = t => {
  let o = HK.danisma(810, 1180, .9, TB, 'DANIŞMA');
  o += gubi(t, { x: 810, y: 900, boy: 190, bakHedef: t < 5 ? [540, 1500] : [700, 1300], ust: GOREVLI });
  const c = pop(t, .3); if (c > 0) o += grp(cip('İSTİSNA', 0, 0, MOR, '#FFFFFF', 40), 540, 420, c);
  const e1 = pop(t, 1.6), e2 = pop(t, 3.4);
  if (e1 > 0) o += grp(cip('SOKAK', 0, 0, '#FFFDF6', '#8E3E36', 30), 270, 560, e1);
  if (e2 > 0) o += grp(cip('EV · KAMU BİNASI', 0, 0, '#FFFDF6', TB.cokKoyu, 26), 810, 560, e2);
  const d1 = pop(t, 2.4); if (d1 > 0) o += grp(cip('ÖDÜL ✓', 0, 0, '#2FBF71', '#FFFFFF', 34), 270, 700, d1);
  const d2 = A(t, 8.6, 8.95); if (d2 > 0) o += HK.damgaYazi(810, 700, (2.0 - FX.E.outExpo(d2)) * .55, 'ÖDÜL ✗', '#C8323C', -10, Math.min(1, d2 * 2));
  const tv = FX.E.inOutQuart(A(t, 5.4, 6.2));
  o += gufi(t, { yol: [[1.4, 250, 1740, 240], [3.4, 690, 1740, 240]], x: 250, y: 1740, boy: 240, bakHedef: [810, 900] });
  const gx = t < 3.4 ? 250 + 440 * FX.E.inOutQuart(A(t, 1.4, 3.4)) : 690;
  o += cuz(gx + 110 + (810 - gx - 110) * tv, 1600 - 580 * tv - Math.sin(tv * Math.PI) * 100, .35 * (1 - .3 * tv), -10);
  $('dinamik').innerHTML = o + FX.flas(t, 8.6, .2, .06);
};"""
# 07 — 5 yıl: bankta bekleyen Gufi, mevsimler akar, takvim döner, "SENİN" kurdelesi
S[7] = r"""
const MEV = [['#F28F3A', '#C8623A', '#FFE0B0', '#D9A860', 0], [null, null, '#DDE8F2', '#EEF4FA', 1], ['#9FE07A', '#5FB85A', '#DFF3D6', '#A9DB7A', 0], ['#3FA35A', '#1F6B4E', '#FFF1B8', '#8FC860', 0]];
const lerpR = (a, b, k) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
window.renderAt = t => {
  const q = A(t, 2.4, 6.0) * 20, i0 = Math.floor(q) % 4, i1 = (i0 + 1) % 4, f = q % 1, m0 = MEV[i0], m1 = MEV[i1], sk = t > 6.0 ? 0 : f;
  const gok = t > 6.0 ? MEV[0][2] : lerpR(m0[2], m1[2], sk), yer = t > 6.0 ? MEV[0][3] : lerpR(m0[3], m1[3], sk), kis = t > 6.0 ? 0 : (i0 === 1 ? 1 - sk : i1 === 1 ? sk : 0);
  let o = `<rect width="1080" height="1920" fill="${gok}"/>` + CV.bulut(220, 260, .8) + `<path d="M0 1260 Q540 1180 1080 1260 V1920 H0Z" fill="${yer}"/><path d="M0 1500 Q540 1450 1080 1520 V1920 H0Z" fill="#000" opacity=".06"/>`;
  const taç = t > 6.0 || t < 2.4 ? MEV[0] : (kis > .5 ? MEV[1] : (sk < .5 ? m0 : m1));
  o += HK.agac(250, 1300, 1.1, taç[0], taç[1], '#6A3A20', kis) + HK.agac(930, 1290, .8, taç[0], taç[1], '#6A3A20', kis);
  o += HK.bank(540, 1780, 1.1, CV.ton('kum'));
  o += HK.yapraklar(t, kis > .5 ? ['#FFFFFF'] : SONBAHAR, 10, [0, 1080, 0, 1800], kis > .5);
  const yil = t < 2.4 ? 0 : Math.min(5, Math.floor(A(t, 2.4, 6.0) * 5 + .001));
  o += gubi(t, { x: 870, y: 640, boy: 190, bakHedef: [540, 1400] }) + grp(PR.takvim(0, 0, 1, 'YIL', String(2026 + yil), MOR), 560, 640, pop(t, .2) * .75, -4);
  const yc = pop(t, 2.5); if (yc > 0) o += grp(cip(`${yil} YIL`, 0, 0, '#1B1640', '#FFE45C', 40), 560, 400, yc * (1 + .15 * FX.sallan(t - 2.4 - yil * .72)));
  o += gufi(t, { x: 420, y: 1716, boy: 230, bakHedef: t < 6 ? [560, 640] : 'kamera' });
  if (kis > .1) o += `<ellipse cx="420" cy="${1716 - 245}" rx="${110 * kis}" ry="${26 * kis}" fill="#FFFFFF"/>`;
  o += cuz(640, 1650, .35, 0);
  const kd = pop(t, 6.1); if (kd > 0) o += grp(HK.kurdele(0, 0, .55), 640, 1610, kd);
  o += FX.gecis(t, { orta: 7.45, renk: '#FFB44C', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 08 — kapanış: güneşli park, Gufi hediyeyle kameraya
S[8] = r"""
const T = CV.ton('gunes');
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(200, 250, .9) + CV.bulut(860, 200, .7) + `<path d="M0 1200 Q540 1120 1080 1200 V1920 H0Z" fill="#9FD27A"/>` + HK.agac(140, 1230, .9, '#F28F3A', '#C8623A') + HK.agac(950, 1220, .8, '#FFB44C', '#E07A2A') + HK.bank(540, 1260, .8, CV.ton('kum')) + CV.cicek(300, 1400, 1, '#E8505B') + CV.cicek(800, 1420, 1, '#8C6CFF');
window.renderAt = t => {
  const k = M.yakinlas(t, .1, 9); M.bulanik(k * .8);
  const arka = gubi(t, { x: 820, y: 900, boy: 190, bakHedef: [540, 1500], ust: SAHIP }) + HK.yapraklar(t, SONBAHAR, 8, [0, 1080, 0, 1400]);
  let on = gufi(t, { x: 480, y: 1700 + 120 * k, boy: 250 + 190 * k, bakHedef: 'kamera' });
  const hp = pop(t, 1.0); if (hp > 0) on += grp(HK.hediye(0, 0, 1), 780, 1150, hp * (1 + .3 * k));
  const c = pop(t, 1.3); if (c > 0) on += grp(cip('DÜRÜSTLÜK KAZANDIRIR', 0, 0, MOR, '#FFFFFF', 34), 540, 420, c);
  const u = A(t, .4, .9); if (u > 0) on += `<text x="540" y="1880" font-size="26" font-weight="600" text-anchor="middle" opacity="${.8 * u}" style="fill:#1B1640">Genel bilgilendirmedir, hukuki tavsiye değildir.</text>`;
  $('dinamik').innerHTML = M.bulanikSar(arka, k * .8) + on + FX.gecis(t, { orta: 0, renk: '#FFB44C', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
};"""
for k in range(1, 9): S[k] = ORTAK + S[k]
S[9] = open('_logo_sahne.js').read()

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
