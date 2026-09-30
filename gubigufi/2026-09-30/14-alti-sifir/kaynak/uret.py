"""#14 Altı Sıfır — sahne HTML'leri + plan.json + tepkiler.json (maskotlar önde, rollerde)."""
import json

SB = [0, 6.3, 13.9, 20.95, 28.7, 32.85, 41.45, 50.95, 56.8, 61.1, 65.5, 67.7]
ALT = {5: 2, 8: 2, 10: 3}
TEP = {
    1: [('gufi', .5, 'goster'), ('gubi', 4.0, 'mutlu'), ('gufi', 4.9, 'sasir')],
    2: [('gufi', 2.3, 'goster'), ('gubi', 5.6, 'sasir')],
    3: [('gubi', 1.9, 'dusun'), ('gufi', 2.6, 'omuzSilk'), ('gubi', 5.9, 'korku'), ('gufi', 6.0, 'sasir')],
    4: [('gubi', .4, 'mutlu'), ('gubi', 5.5, 'aha'), ('gufi', 6.4, 'gozKapa')],
    5: [('gubi', .2, 'dusun'), ('gubi', 1.8, 'aha'), ('gufi', 3.0, 'sasir')],
    6: [('gubi', .3, 'mutlu'), ('gufi', .5, 'zipla'), ('gufi', 3.9, 'sasir'), ('gufi', 6.6, 'goster')],
    7: [('gufi', 2.0, 'alkis'), ('gubi', 2.1, 'mutlu'), ('gubi', 7.8, 'mutlu'), ('gufi', 7.8, 'mutlu')],
    8: [('gufi', 2.9, 'sasir'), ('gufi', 4.2, 'kahkaha')],
    9: [('gubi', 3.2, 'kahkaha'), ('gufi', 3.4, 'omuzSilk')],
    10: [('gufi', .3, 'yaklas'), ('gufi', 2.6, 'goster')],
}
ORTAK = r"""
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const MILYONER = KO.giy('gufi', [['silindir', { renk: '#2A2440', bant: '#D8A032' }], 'monokl', ['papyon', { renk: '#D8A032' }]]);
const YESIL = '#2FBF71';
// sayı satırı: s içindeki ilk `kalan` karakter kalır, diğerleri t0'dan itibaren fırlar (sıfırlar uçar, noktalar söner)
const uc = (s, x, y, fs, renk, t, t0, kalan, { hedef = null, yerY = 1900 } = {}) => {
  const ch = [...s], w = ch.map(c => c === '.' || c === ',' ? fs * .3 : fs * .6), W = w.reduce((a, b) => a + b, 0);
  const Wk = w.slice(0, kalan).reduce((a, b) => a + b, 0), kay = FX.E.expo(A(t, t0 + .5, t0 + 1.0));
  let xx = x - W / 2 + (W - Wk) / 2 * kay, o = '';
  ch.forEach((c, i) => { const cx = xx + w[i] / 2; xx += w[i];
    if (i < kalan || t < t0) { o += `<text x="${cx}" y="${y}" font-size="${fs}" font-weight="900" text-anchor="middle" style="fill:${renk}">${c}</text>`; return; }
    const d = t - t0 - (i - kalan) * .05; if (d < 0) { o += `<text x="${cx}" y="${y}" font-size="${fs}" font-weight="900" text-anchor="middle" style="fill:${renk}">${c}</text>`; return; }
    if (c !== '0') { if (d < .25) o += `<text x="${cx}" y="${y}" font-size="${fs}" font-weight="900" text-anchor="middle" style="fill:${renk}" opacity="${1 - d / .25}">${c}</text>`; return; }
    let px, py, r;
    if (hedef) { const q = FX.E.inOutQuart(A(d, 0, 1)); px = cx + (hedef[0] - cx) * q; py = y + (hedef[1] - y) * q - Math.sin(q * Math.PI) * 260; r = q * 540; if (q >= 1) return; }
    else { const h = FX.hash(i * 7.1 + s.length), vx = (h - .5) * 900 + (i - kalan - 2) * 90, vy = -700 - h * 300; px = cx + vx * d; py = Math.min(yerY, y + vy * d + 1900 * d * d); r = vx * d * .8; if (d > 1.6) return; }
    o += `<text x="${px}" y="${py}" font-size="${fs}" font-weight="900" text-anchor="middle" transform="rotate(${r} ${px} ${py - fs * .35})" style="fill:${renk}">0</text>`; });
  return o;
};
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script>
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
# 01 — Milyonerler ülkesi: Gufi milyoner, Gubi simitçi; tomarla tek simit
S[1] = r"""
const T = CV.ton('sari');
$('zemin').innerHTML = PR.sokak(T, 0, 1300);
window.renderAt = t => {
  let o = '';
  for (let i = 0; i < 2; i++) { const x = ((t * 90 + i * 620) % 1400) - 200; o += KS.karakter({ x, y: 1330, boy: 300, ust: ['#8A6FE0', '#2E9A9C'][i], alt: '#2A2A40', sac: { tip: ['uzun', 'kisa'][i], renk: '#3A2A20' }, adim: t * 6 + i, t }); }
  o += PR.simitTezgah(800, 1450, 1.0, T);
  o += gubi(t, { x: 800, y: 840, boy: 190, bakHedef: t < 3.3 ? [330, 1200] : [640, 1150], ust: KO.giy('gubi', ['simitci']) });
  const it = FX.E.inOutQuart(A(t, 3.4, 4.2));
  o += PR.tomar(130 + 520 * it, 1700 - 510 * it - Math.sin(it * Math.PI) * 180, 1 - .3 * it, 9);
  const sq = A(t, 4.3, 4.9); if (sq > 0) { const sx = 790 + (470 - 790) * sq, sy = 1170 + (1420 - 1170) * sq - Math.sin(sq * Math.PI) * 220; o += PR.simit(sx, sy, 34 + 10 * sq, sq * 360); }
  o += gufi(t, { x: 360, y: 1700, boy: 280, bakHedef: t < 3.4 ? 'kamera' : [700, 1150], ust: MILYONER });
  const c1 = pop(t, .4); if (c1 > 0) o += grp(cip('HERKES MİLYONER', 0, 0, '#2A2440', '#FFE45C', 34), 540, 360, c1);
  const c2 = pop(t, 4.9); if (c2 > 0) o += grp(`<rect x="-170" y="-48" width="340" height="96" rx="48" fill="#FFFDF6"/>` + txt('1 SİMİT', 0, 18, 50, '#C8323C'), 420, 1060, c2, -6);
  o += FX.gecis(t, { orta: 6.3, renk: YESIL, serit: '#1B1F3A', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — 2004: cüzdan, 20 milyonluk, dolar kuru
S[2] = r"""
const T = CV.ton('lavanta');
$('zemin').innerHTML = CV.oda(T, { zeminY: 1250, pencere: [700, 330, 260, 330] }) + CV.raf(60, 420, 400, T, 3) + CV.lamba(980, 1250, .9, T) + CV.bitki(90, 1250, .9, T) + CV.hali(540, 1500, 900, 170, T) + CV.sehpa(540, 1480, 1.6, T);
window.renderAt = t => {
  let o = '';
  const tk = pop(t, .2), tq = FX.E.expo(A(t, 1.4, 2.0)); if (tk > 0) o += grp(PR.takvim(0, 0, 1, 'YIL', '2004', '#E8505B'), 540 - 330 * tq, 760 - 300 * tq, tk * (1.15 - .6 * tq), -4 * tq);
  const bo = 1 - A(t, 4.8, 5.3);
  if (t > 1.3 && bo > 0) { const ca = FX.E.expo(A(t, 1.5, 2.0)); o += `<g opacity="${bo}">` + PR.cuzdan(540, 1300, 1.1, ca);
    const b = FX.E.expo(A(t, 1.9, 2.8)); if (b > 0) o += PR.banknot(540, 1300 - 520 * b, 360 + 400 * b, { deger: '20.000.000', birim: 'LİRA', rot: -4 * b });
    o += `</g>`; }
  if (t > 4.8) { const q = FX.E.expo(A(t, 4.8, 5.4)); o += PR.banknot(540, 780 - 340 * q, 760 - 330 * q, { deger: '20.000.000', rot: -4 });
    const d = FX.E.expo(A(t, 4.9, 5.5)); o += PR.dovizTabela(540, 1900 - 1000 * d, 1.1, [['1 $', fmt(FX.sayac(t, 5.3, 6.6, 0, 1500000)), '#7CFFB0']], T); }
  o += gufi(t, { x: 850, y: 1560, boy: 250, bakHedef: t < 4.8 ? [540, 780] : [540, 1000], ust: MILYONER });
  o += gubi(t, { yol: [[4.6, -150, 1200, 180], [5.3, 190, 1180, 180]], x: -150, y: 1200, boy: 180, bakHedef: [540, 1000], ust: KO.giy('gubi', ['gozluk']) });
  o += FX.gecis(t, { orta: 0, renk: YESIL, serit: '#1B1F3A', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 03 — market: Gubi kasiyer sıfır sayıyor, fiş uzuyor, hesap makinesi E
S[3] = r"""
const T = CV.ton('seftali');
$('zemin').innerHTML = PR.market(T, 1250);
window.renderAt = t => {
  let o = `<rect x="560" y="1130" width="560" height="420" rx="24" fill="${T.cokKoyu}"/><rect x="560" y="1130" width="560" height="40" rx="18" fill="${T.koyu}"/>`;
  o += gubi(t, { x: 950, y: 880, boy: 210, bakHedef: t < 5.6 ? [720, 1100] : [330, 900], ust: KO.giy('gubi', [['kasket', { renk: '#2E9A9C', yazi: '' }]]) });
  o += PR.kasa(720, 1150, 1.05, T, t < 1 ? '' : fmt(FX.sayac(t, 1, 4.5, 0, 9750000)));
  o += PR.fis(720, 1090, Math.max(10, 830 * A(t, .4, 4.8)), ['EKMEK 350.000', 'SÜT 1.250.000', 'PEYNİR 4.500.000', 'ÇAY 3.650.000', '---------', 'TOPLAM', '9.750.000', '...'], 24);
  if (t > 1.9 && t < 4.6) { const n = FX.sayac(t, 2.0, 4.2, 1, 9); o += M.balon(930, 600, txt(n + '. sıfır?', 0, 14, 44, '#1B1640'), { w: 300, h: 120, yon: 1 }); }
  // hesap makinesi Gufi'nin başı üstünde
  const hm = FX.E.expo(A(t, 4.3, 4.9)); if (hm > 0) { const dig = Math.floor(A(t, 4.9, 5.7) * 11), hata = t > 5.8, sal = hata ? Math.sin(t * 60) * 8 * Math.exp(-(t - 5.8) * 3) : 0;
    o += grp(PR.hesapMakinesi(0, 0, 1, hata ? 'E' : ('9' + '0'.repeat(dig)).slice(-9), { hata: hata ? 1 : 0 }), 300 + sal, 1010 + (1 - hm) * 700, .95, -6); }
  o += gufi(t, { x: 300, y: 1720, boy: 240, bakHedef: t < 4.3 ? [720, 1100] : [300, 1010], ust: KO.giy('gufi', [['kasket', { renk: '#E8505B', siper: '#8E1B2F' }]]) });
  o += FX.gecis(t, { orta: 7.05, renk: '#E8505B', kapat: { tur: 'daire', merkez: [300, 1010], sure: .35 } });
  $('dinamik').innerHTML = o;
};"""
# 04 — sahne: Rekorlar Kitabı; Gubi sunucu, Gufi 'ödül' alır ve utanır
S[4] = r"""
const T = CV.ton('gul');
let z = `<rect width="1080" height="1920" fill="${T.cokKoyu}"/>`;
for (let i = 0; i < 12; i++) z += `<rect x="${i * 90}" y="0" width="90" height="1300" fill="${i % 2 ? '#9E2A4A' : '#B8365A'}"/><rect x="${i * 90 + 10}" y="0" width="16" height="1300" fill="#FFFFFF" opacity=".08"/>`;
z += `<path d="M0 0 H1080 V140 Q810 230 540 150 Q270 230 0 140Z" fill="#7E1E3E"/><rect x="0" y="0" width="1080" height="30" fill="#D8A032"/>`;
z += `<rect x="0" y="1300" width="1080" height="620" fill="#6A3A2A"/><rect x="0" y="1300" width="1080" height="24" fill="#8E5226"/>`;
for (let i = 0; i < 8; i++) z += `<rect x="${i * 140}" y="1330" width="6" height="590" fill="#000" opacity=".12"/>`;
$('zemin').innerHTML = z;
window.renderAt = t => {
  let o = CV.huzme(380, 0, T, 3, 12).replace(/opacity="[^"]*"/g, 'opacity=".08"');
  const sp = A(t, 5.3, 5.8); if (sp > 0) o += `<path d="M760 0 L940 0 L1060 1560 L640 1560Z" fill="#FFF3C0" opacity="${.25 * sp}"/>`;
  o += PR.kursu(540, 1420, 1.1, T, 'REKOR');
  const ac = A(t, .6, 1.4);
  const sol = PR.Tm('DÜNYA REKORU', -160, -110, 30, '#8E1B3F', 'letter-spacing="3"') + PR.banknot(-160, -10, 230, { deger: '20.000.000' }) + PR.Tm('1995 · 1996', -160, 110, 26, '#5A3A4A') + PR.Tm('1999–2004', -160, 145, 26, '#5A3A4A');
  let sag = PR.Tm('TÜRK LİRASI', 160, -110, 32, '#8E1B3F', 'letter-spacing="3"');
  if (t > 5.4) sag += FX.harfHarf('EN', 160, -30, 52, t, 5.4, { renk: '#1B1640' }) + FX.harfHarf('DEĞERSİZ', 160, 30, 52, t, 5.5, { renk: '#C8323C' }) + FX.harfHarf('PARA', 160, 90, 52, t, 5.8, { renk: '#1B1640' });
  o += PR.kitap(540, 820, 1.2, ac, sol, sag);
  const st = pop(t, 6.3, .35); if (st > 0) o += grp(`<rect x="-150" y="-50" width="300" height="100" rx="12" fill="none" stroke="#C8323C" stroke-width="12"/>` + txt('REKOR!', 0, 20, 60, '#C8323C'), 720, 1010, 2.2 - 1.2 * st, -14, Math.min(1, st * 1.5));
  o += PR.mikrofon(340, 1800, 1.0);
  o += gubi(t, { x: 190, y: 1540, boy: 190, bakHedef: t < 5.2 ? 'kamera' : [700, 900], ust: KO.giy('gubi', ['papyon']) });
  o += gufi(t, { x: 860, y: 1730, boy: 250, bakHedef: [540, 820], ust: MILYONER });
  for (let i = 0; i < 9; i++) { const x = 60 + i * 125, y = 1880 + (i % 2) * 30; o += `<circle cx="${x}" cy="${y - 90}" r="58" fill="#2A1020"/><rect x="${x - 90}" y="${y - 40}" width="180" height="200" rx="80" fill="#2A1020"/>`; }
  o += FX.gecis(t, { orta: 0, renk: '#E8505B', kapat: { sure: .01 }, ac: { tur: 'daire', merkez: [540, 820], sure: .45 } });
  $('dinamik').innerHTML = o;
};"""
# 05 — Merkez Bankası: Gubi memur, makasla altı sıfır; Gufi sıfırları kovalıyor
S[5] = r"""
const T = CV.ton('adacayi');
$('zemin').innerHTML = CV.oda(T, { zeminY: 1300, dolap: false, pencere: [720, 260, 260, 300] }) + CV.raf(60, 330, 420, T, 7) + CV.saat(560, 250, 60, T, 2) + CV.bitki(980, 1300, 1.0, T) + CV.cerceveResim(90, 560, 180, 130, T);
window.renderAt = t => {
  let o = '';
  const bx = 540, by = 820;
  o += PR.banknot(bx, by, 860, { deger: '', birim: 'LİRA', pal: 'eski' });
  const kes = A(t, 2.1, 2.7);
  o += uc('20.000.000', bx + 860 * .14, by + 30, 96, '#7B4E96', t, 2.6, 2, { yerY: 1700 });
  if (t > 1.8 && t < 3.4) { const k = FX.E.expo(A(t, 1.8, 2.1)), x = 1200 - 900 * k + 700 * kes; o += PR.makas(x - 300 * kes, by + 30, 1.1, .5 + .5 * Math.sin(t * 30), 180); }
  if (kes > 0 && kes < 1) o += `<rect x="${bx + 20}" y="${by - 10}" width="${420 * kes}" height="8" fill="#FFFFFF" opacity=".8"/>`;
  const c = pop(t, 1.9); if (c > 0) o += grp(cip('− 6 SIFIR', 0, 0, '#1B1F3A', '#7CFFB0', 40), 540, 420, c);
  o += gubi(t, { x: 880, y: 1100, boy: 210, bakHedef: t < 2 ? 'kamera' : [bx, by], ust: KO.giy('gubi', [['kravat', { renk: '#1B3A6A' }], 'gozluk']) });
  o += gufi(t, { yol: [[2.9, 180, 1720, 230], [3.9, 760, 1720, 230]], x: 180, y: 1720, boy: 230, bakHedef: [900, 1600] });
  o += FX.gecis(t, { orta: 4.15, renk: '#1B1F3A', serit: '#FFE45C', kapat: { tur: 'serit', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — 1 Ocak 2005: havai fişek, 1.000.000 → 1 YTL, 20 milyon → 20 YTL, Gufi kameraya
S[6] = r"""
const T = CV.ton('gece');
let z = `<rect width="1080" height="1920" fill="${T.cokKoyu}"/><rect width="1080" height="1300" fill="${T.koyu}" opacity=".6"/>`;
for (let i = 0; i < 40; i++) z += `<circle cx="${(i * 197) % 1080}" cy="${(i * 331) % 1000}" r="${2 + i % 3}" fill="#FFFFFF" opacity=".6"/>`;
[[0, 1080, 160], [150, 900, 120], [300, 1000, 150], [470, 880, 110], [600, 960, 170], [800, 860, 130], [940, 1000, 140]].forEach(([x, y, w]) => { z += `<rect x="${x}" y="${y}" width="${w}" height="${1400 - y}" fill="${T.orta}"/>`; for (let yy = y + 30; yy < 1360; yy += 70) for (let xx = x + 20; xx < x + w - 30; xx += 45) if ((xx + yy) % 3) z += `<rect x="${xx}" y="${yy}" width="22" height="30" rx="4" fill="#FFE9A8" opacity=".7"/>`; });
z += `<path d="M430 880 L430 700 L452 640 L474 700 L474 880Z" fill="${T.orta}"/><rect x="0" y="1400" width="1080" height="520" fill="${T.orta}"/><rect x="0" y="1400" width="1080" height="18" fill="${T.acik}" opacity=".4"/>`;
$('zemin').innerHTML = z;
window.renderAt = t => {
  const k = M.yakinlas(t, 6.2, 9.5); M.bulanik(k);
  let a = '';
  [[200, 300, 0, '#FFE45C'], [860, 250, .5, '#FF5FA8'], [520, 180, 1.0, '#7CFFB0'], [300, 420, 1.6, '#8FA2FF'], [800, 420, 2.2, '#FFB44C'], [150, 200, 5.0, '#FF5FA8'], [900, 300, 5.6, '#FFE45C']].forEach(([x, y, t0, r]) => a += PR.fisek(x, y, t, t0, r));
  const tq = FX.E.expo(A(t, 3.1, 3.6)), tk = pop(t, .3);
  if (tk > 0) a += `<g opacity="${1 - A(t, 5.9, 6.3)}">` + grp(PR.takvim(0, 0, 1, '1 OCAK', '2005', '#E8505B'), 540 + 320 * tq, 700 - 140 * tq, tk * (1.2 - .6 * tq)) + `</g>`;
  const ch = pop(t, 1.6); if (ch > 0) a += grp(cip('YENİ TÜRK LİRASI · YTL', 0, 0, '#FFE45C', '#1B1F3A', 34), 540, 1080 - 520 * tq, ch * (1 - .15 * tq));
  // 1.000.000 → 1 YTL
  if (t > 3.3 && t < 6.4) { const g = pop(t, 3.3) * (1 - A(t, 6.0, 6.4)); a += `<g opacity="${Math.min(1, g)}"><rect x="140" y="700" width="800" height="240" rx="40" fill="#FFFDF6"/>` + uc('1.000.000', 470, 860, 120, '#1B1F3A', t, 3.9, 1) + `</g>`;
    const yt = pop(t, 4.7); if (yt > 0) a += `<g opacity="${1 - A(t, 6.0, 6.4)}">` + grp(txt('YTL', 0, 0, 90, YESIL), 700, 860, yt) + `</g>`;
    const tl = 1 - A(t, 3.9, 4.3); if (tl > 0) a += txt('TL', 800, 860, 90, '#1B1F3A', 900, `opacity="${tl}"`); }
  // 20 milyon → 20 YTL (dönen banknot)
  if (t > 6.2) { const f = A(t, 6.6, 7.2), sx = Math.abs(Math.cos(f * Math.PI)), yeni = f > .5; a += `<g transform="translate(540 700) scale(${sx} 1) translate(-540 -700)">` + PR.banknot(540, 700, 720, yeni ? { deger: '20', birim: 'YENİ TÜRK LİRASI', pal: 'yeni' } : { deger: '20.000.000', birim: 'LİRA' }) + `</g>`; }
  let on = gufi(t, { x: 760 - 220 * k, y: 1700 + 120 * k, boy: 240 + 260 * k, bakHedef: k > .4 ? 'kamera' : [540, 700], ust: KO.giy('gufi', ['parti']) });
  const arka = gubi(t, { x: 200, y: 1080, boy: 200, bakHedef: [540, 700], ust: KO.giy('gubi', [['parti', { renk: '#E8505B' }]]) });
  $('dinamik').innerHTML = M.bulanikSar(arka, k) + a + on + FX.gecis(t, { orta: 0, renk: '#1B1F3A', serit: '#FFE45C', kapat: { sure: .01 }, ac: { tur: 'serit', sure: .35 } });
};"""
# 07 — terazi: maaş ve fiyat birlikte küçülür; kimse fakirleşmedi
S[7] = r"""
const T = CV.ton('orman');
let z = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(220, 240, .9) + CV.bulut(850, 380, .7) + `<path d="M0 1220 Q300 1080 620 1180 Q880 1260 1080 1150 V1920 H0Z" fill="${T.fon2}"/><path d="M0 1380 Q400 1300 1080 1400 V1920 H0Z" fill="${T.orta}"/>`;
z += CV.agacGovde(120, 1300, 40, 260, T) + `<circle cx="120" cy="1040" r="140" fill="${T.koyu}"/><circle cx="170" cy="990" r="90" fill="${T.orta}"/>` + CV.otTutami(420, 1400, 1.2, T.koyu) + CV.otTutami(980, 1420, 1.1, T.koyu) + CV.cicek(300, 1470, 1, T.vurgu) + CV.cicek(860, 1480, 1, T.vurgu2);
$('zemin').innerHTML = z;
window.renderAt = t => {
  const eg = 3 * Math.sin(t * 1.6) * Math.exp(-Math.max(0, t - 4.3) * .6) + 2 * Math.sin(t * 5) * (A(t, 4.3, 4.8) - A(t, 6.8, 7.3));
  const tr = PR.terazi(540, 1520, 1.0, eg, T);
  const kc = 1 - .18 * FX.E.expo(A(t, 4.3, 7.0));
  let o = tr.svg;
  o += gubi(t, { x: tr.sol[0], y: tr.sol[1] - 110 * kc, boy: 190 * kc, bakHedef: t < 4 ? 'kamera' : [tr.sag[0], tr.sag[1] - 200] });
  o += gufi(t, { x: tr.sag[0], y: tr.sag[1] - 10, boy: 200 * kc, bakHedef: [tr.sol[0], tr.sol[1] - 150] });
  const sw = t > 5.0;
  const L = (x, y, ust, s1, s2, t0) => { const p = pop(t, t0); if (p <= 0) return ''; const sq = 1 + .25 * FX.sallan(t - 5.0);
    return grp(`<rect x="-180" y="-90" width="360" height="180" rx="30" fill="#FFFDF6"/>` + PR.Tm(ust, 0, -38, 30, T.cokKoyu, 'letter-spacing="4"') + (sw ? txt(s2, 0, 50, 64, YESIL) : txt(s1, 0, 50, s1.length > 11 ? 38 : 50, '#1B1640')), x, y, p * (sw ? sq : 1)); };
  o += L(tr.sol[0], tr.sol[1] - 380, 'MAAŞ', '400.000.000 TL', '400 YTL', .3) + L(tr.sag[0], tr.sag[1] - 380, 'SİMİT', '300.000 TL', '0,30 YTL', .5);
  if (t > 4.3 && t < 7.5) for (let i = 0; i < 12; i++) { const d = t - 4.4 - i * .12; if (d < 0 || d > 1.3) continue; const q = d / 1.3, sx0 = i % 2 ? tr.sag[0] : tr.sol[0], sy0 = (i % 2 ? tr.sag[1] : tr.sol[1]) - 360;
    o += PR.sifir(sx0 + (960 - sx0) * q, sy0 + (1700 - sy0) * q - Math.sin(q * Math.PI) * 300, 70, '#7B4E96', q * 400); }
  const kv = A(t, 4.0, 4.5); if (kv > 0) o += `<g opacity="${kv}"><rect x="880" y="1610" width="160" height="200" rx="24" fill="#5A6078"/><rect x="866" y="1590" width="188" height="40" rx="16" fill="#3A3F5C"/>` + PR.Tm('SIFIRLAR', 960, 1720, 24, '#FFF3E0') + `</g>`;
  const c = pop(t, 2.0); if (c > 0) o += grp(cip('KİMSE FAKİRLEŞMEDİ ✓', 0, 0, YESIL, '#FFFFFF', 34), 540, 300, c);
  const c2 = pop(t, 7.6); if (c2 > 0) o += grp(cip('GİDEN SADECE SIFIRLAR', 0, 0, '#1B1F3A', '#FFE45C', 32), 540, 420, c2);
  o += FX.gecis(t, { orta: 9.5, renk: '#D8A032', kapat: { tur: 'egik', sure: .3, yon: -1 } });
  $('dinamik').innerHTML = o;
};"""
# 08 — 2009: tabeladan "YENİ" düşer, Gubi iter
S[8] = r"""
const T = CV.ton('kum');
$('zemin').innerHTML = PR.sokak(T, 0, 1320);
window.renderAt = t => {
  let o = '';
  const yil = FX.sayac(t, .3, 2.0, 2005, 2009);
  o += PR.tabela(540, 520, 940, 190, '', T, { renk: '#1B1F3A', zemin: '#FFC24C' });
  const kay = FX.E.expo(A(t, 3.0, 3.6));
  o += txt('TÜRK LİRASI', 650 - 110 * kay, 548, 84, '#1B1F3A');
  // YENİ kelimesi: 2.3'te düşer, zemine sekip durur, Gubi iter
  const d = t - 2.3; let yx = 250, yy = 548, yr = 0;
  if (d > 0) { const g = Math.min(d, .75), yerY = 1640; yy = Math.min(yerY, 548 + 1700 * g * g); if (d > .75) yy = yerY - Math.abs(Math.sin((d - .75) * 9)) * 60 * Math.exp(-(d - .75) * 4); yr = Math.min(1, d / .75) * 170; }
  const it = A(t, 3.9, 5.4); yx += 1000 * FX.E.inOutQuart(it);
  o += `<g transform="rotate(${yr} ${yx} ${yy - 28})">` + txt('YENİ', yx, yy, 84, '#C8323C') + `</g>`;
  if (t > 2.3 && t < 2.6) o += `<rect x="150" y="470" width="200" height="100" rx="10" fill="#FFC24C"/>`;
  o += grp(PR.takvim(0, 0, 1, 'YIL', String(yil), YESIL), 200, 900, pop(t, .1) * .8, -5);
  o += gubi(t, { yol: [[3.3, -150, 1580, 190], [3.9, 130, 1580, 190], [5.4, 1130, 1580, 190]], x: -150, y: 1580, boy: 190, bakHedef: [yx, yy], ust: KO.giy('gubi', [['kasket', { renk: '#6A3A20', siper: '#3A2010' }]]) });
  o += gufi(t, { x: 860, y: 1740, boy: 240, bakHedef: [yx, yy - 40] });
  o += FX.gecis(t, { orta: 5.85, renk: '#8A6FE0', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 09 — sıfır yanılsaması: Gufi sıfır kulesinden düşer, şapkası uçar
S[9] = r"""
const T = CV.ton('lavanta');
let z = `<defs><radialGradient id="rg9" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="${T.isik}"/><stop offset="1" stop-color="${T.fon2}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#rg9)"/>` + CV.bulut(180, 380, .9, '#FFFFFF', T.acik) + CV.bulut(900, 260, .7, '#FFFFFF', T.acik) + `<rect x="0" y="1560" width="1080" height="360" fill="${T.orta}"/><ellipse cx="540" cy="1560" rx="520" ry="40" fill="${T.koyu}" opacity=".3"/>`;
$('zemin').innerHTML = z;
const KULE = [[365, 1480], [540, 1480], [715, 1480], [452, 1300], [628, 1300], [540, 1120]];
window.renderAt = t => {
  let o = '';
  for (let i = 0; i < 20; i++) { const x = (i * 131) % 1080, y = 1500 - ((t * 60 + i * 97) % 1100); o += `<circle cx="${x}" cy="${y}" r="${4 + i % 4}" fill="#FFFFFF" opacity=".5"/>`; }
  KULE.forEach(([x, y], i) => { const tp = 2.0 + (5 - i) * .16, d = t - tp; if (d > .25) return; if (d > 0) { const q = d / .25; o += `<circle cx="${x}" cy="${y}" r="${80 + 90 * q}" fill="none" stroke="#FFFFFF" stroke-width="${10 * (1 - q)}" opacity="${1 - q}"/>`; return; }
    o += `<g transform="translate(${x} ${y}) scale(${1 + .03 * Math.sin(t * 3 + i)})">` + PR.sifir(0, 0, 260, i % 2 ? '#8A6FE0' : '#6A4FC0') + `</g>`; });
  const dus = A(t, 2.9, 3.3), gy = t < 2.9 ? 1000 : 1000 + (1700 - 1000) * dus * dus;
  const sapkaGit = t > 2.8;
  o += gufi(t, { x: 540, y: gy, boy: 260, bakHedef: t < 2 ? 'kamera' : [540, 1500], ust: KO.giy('gufi', sapkaGit ? ['monokl'] : [['silindir', { renk: '#2A2440', bant: '#D8A032' }], 'monokl', ['papyon', { renk: '#D8A032' }]]) });
  if (sapkaGit) { const d = t - 2.8; o += `<g transform="translate(${540 + 380 * d} ${gy - 600 * d + 300 * d * d}) rotate(${d * 260}) translate(-540 ${-gy})">` + KO.tek('gufi', 'silindir', 540, gy, 260, { renk: '#2A2440', bant: '#D8A032' }) + `</g>`; }
  const y1 = pop(t, 2.4); if (y1 > 0) o += grp(txt('SIFIR', 0, -20, 96, '#4A348E') + txt('YANILSAMASI', 0, 80, 84, '#E8505B'), 540, 480, y1);
  o += gubi(t, { x: 890, y: 800, boy: 190, bakHedef: [540, gy - 200] });
  o += FX.gecis(t, { orta: 0, renk: '#8A6FE0', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 10 — kapanış: çekmecedeki eski milyonluk, Gufi kameraya
S[10] = r"""
const T = CV.ton('seftali');
$('zemin').innerHTML = CV.oda(T, { zeminY: 1300, pencere: [120, 300, 260, 330] }) + CV.raf(560, 360, 440, T, 4) + CV.cerceveResim(620, 640, 150, 110, T) + CV.lamba(80, 1300, .9, T) + CV.bitki(1000, 1300, .9, T) + CV.hali(540, 1560, 900, 170, T);
window.renderAt = t => {
  const k = M.yakinlas(t, .3, 9); M.bulanik(k * .8);
  const ac = FX.E.expo(A(t, .6, 1.2));
  let arka = PR.cekmece(760, 1320, .9, ac, T, PR.banknot(0, -150, 320, { deger: '1.000.000' }));
  arka += gubi(t, { x: 900, y: 820, boy: 180, bakHedef: [760, 1150] });
  const b = FX.E.expo(A(t, 1.2, 2.1)); let on = '';
  if (b > 0) on += K.glow({ x: 700, y: 760, r: 300, renk: '#FFE9A8', guc: .5 * b }) + PR.banknot(760 - 60 * b, 1170 - 410 * b, 320 + 180 * b, { deger: '1.000.000', rot: -6 + 3 * Math.sin(t * 2) });
  on += gufi(t, { x: 330, y: 1700 + 120 * k, boy: 240 + 200 * k, bakHedef: k > .5 ? 'kamera' : [760, 1150] });
  const q = pop(t, 3.0); if (q > 0) on += grp(txt('?', 0, 0, 160, '#E8505B'), 820, 470, q, 10);
  $('dinamik').innerHTML = M.bulanikSar(arka, k * .8) + on;
};"""
for k in range(1, 11): S[k] = ORTAK + S[k]
S[11] = open('_logo_sahne.js').read()

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
