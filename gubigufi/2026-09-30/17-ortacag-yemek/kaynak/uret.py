"""#17 Orta Çağ köylü sofrası — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 6.35, 12.0, 22.25, 25.1, 30.2, 37.95, 41.9, 47.8, 54.1, 64.85, 71.7, 73.9]
ALT = {1: 2, 11: 3}
TEP = {
    1: [('gufi', 1.3, 'sasir'), ('gufi', 3.6, 'uzgun')],
    2: [('gubi', 2.7, 'aha'), ('gufi', 3.4, 'sasir')],
    3: [('gubi', .5, 'mutlu')],
    4: [('gufi', 1.0, 'sasir')],
    5: [('gufi', 1.6, 'mutlu'), ('gubi', 3.2, 'alkis')],
    6: [('gubi', 1.0, 'mutlu'), ('gufi', 5.2, 'sasir')],
    7: [('gufi', 1.4, 'goster')],
    8: [('gufi', 2.2, 'uzgun')],
    9: [('gubi', 1.5, 'aha'), ('gufi', 5.4, 'mutlu')],
    10: [('gufi', .3, 'dusun'), ('gubi', 2.2, 'uzgun'), ('gufi', 5.7, 'aha')],
    11: [('gufi', .2, 'yaklas'), ('gufi', 1.2, 'goster'), ('gubi', 1.4, 'mutlu')],
}
ORTAK = r"""
const TAR = '#E07A3F';
const T = CV.ton('adacayi');
const KOYLU_G = KO.giy('gubi', [['kukuleta', { renk: '#6A7A4A' }]]);
const TURIST = KO.giy('gufi', [['kasket', { renk: '#2E9AD8', siper: '#1F6B9E' }]]);
const koylu = (x, y, boy, i, t, ek = {}) => KS.karakter(Object.assign({ x, y, boy, t, ifade: 'gulumse' }, KS.donem(1300, i), ek));
const gri = (s, k = 1) => k > .001 ? `<g style="filter:grayscale(${k}) brightness(${1 - .08 * k})">${s}</g>` : s;
const zeminGri = k => { const z = $('zemin'); z.style.filter = k > .001 ? `grayscale(${k}) brightness(${1 - .08 * k})` : 'none'; };
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/oc.js"></script>
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
# 01 — gri köy, zaman kapısından düşen turist Gufi, gri lapa
S[1] = r"""
$('zemin').innerHTML = OC.koy(T);
window.renderAt = t => {
  zeminGri(1);
  let g = koylu(((t * 60) % 1400) - 200, 1250, 330, 0, t, { adim: t * 6 }) + koylu(900 - ((t * 40) % 400), 1230, 300, 1, t, { adim: t * 5 });
  g += `<rect x="560" y="1100" width="220" height="140" rx="24" fill="#8E6A3A"/>` + OC.kase(670, 1080, 1.3, '#9A9A92');
  let o = gri(g);
  const pk = A(t, .2, .6) * (1 - A(t, 1.5, 2.0));
  if (pk > 0) { for (let i = 0; i < 5; i++) o += `<ellipse cx="300" cy="420" rx="${(180 - i * 30) * pk}" ry="${(100 - i * 16) * pk}" fill="${['#8A6FE0', '#2E9AD8', '#6CC8F0', '#FFFFFF', '#FFE45C'][i]}" opacity=".85" transform="rotate(${t * 200 * (i % 2 ? 1 : -1)} 300 420)"/>`; }
  o += gufi(t, { yol: [[.5, 300, 440, 200], [1.2, 330, 1740, 250]], x: 330, y: 1740, boy: 250, bakHedef: t < 2 ? [300, 420] : [670, 1080], ust: TURIST });
  const c = pop(t, 3.0); if (c > 0) o += grp(cip('GRİ LAPA?', 0, 0, '#5A5A58', '#FFFFFF', 40), 670, 900, c);
  $('dinamik').innerHTML = o;
};"""
# 02 — "pottaj": dünya renklenir, Gubi köylü kazanı karıştırır
S[2] = r"""
$('zemin').innerHTML = OC.koy(T);
window.renderAt = t => {
  const r = FX.E.expo(A(t, 2.6, 3.4)); zeminGri(1 - r);
  let g = koylu(180, 1250, 330, 2, t) + koylu(960, 1240, 310, 3, t) + OC.kazan(540, 1420, 1.0, t, r > .5 ? '#8FB050' : '#9A9A92');
  g += gubi(t, { x: 800, y: 1000, boy: 200, bakHedef: [540, 1200], ust: KOYLU_G }) + `<g transform="translate(${660 + Math.cos(t * 3) * 30} ${1180 + Math.sin(t * 3) * 10}) rotate(-25)"><rect x="-12" y="-300" width="24" height="320" rx="10" fill="#8E5A30"/></g>`;
  let o = gri(g, 1 - r);
  if (t > 2.6) o += FX.flas(t, 2.6, .5, .1, '#FFF6D6') + FX.sokHalkasi(540, 1200, t, 2.6, { renk: '#FFE45C', yaricap: 900 });
  const p = FX.yayTip(t - 2.6, 'agir'); if (p > 0) o += grp(`<rect x="-250" y="-90" width="500" height="180" rx="40" fill="#FFFDF6"/>` + txt('POTTAJ', 0, 34, 110, TAR), 540, 540, p);
  const c = pop(t, 3.8); if (c > 0) o += grp(cip('SIKICI DEĞİLDİ', 0, 0, '#3FA35A', '#FFFFFF', 34), 540, 720, c);
  o += gufi(t, { x: 250, y: 1760, boy: 240, bakHedef: [540, 1250], ust: TURIST });
  $('dinamik').innerHTML = o;
};"""
# 03 — kulübe içi, yulaf/arpa → DETAY: kazanın içi, malzemeler tek tek
S[3] = r"""
$('zemin').innerHTML = OC.kulubeIc(T);
window.renderAt = t => {
  let o = OC.kazan(540, 1450, 1.1, t, '#8FB050');
  o += `<g transform="translate(180 1330)"><path d="M-90 0 Q-110 -150 -60 -200 L60 -200 Q110 -150 90 0Z" fill="#C8A878"/>` + OC.malzeme('yulaf', 0, -230, 1) + `</g><g transform="translate(900 1330)"><path d="M-90 0 Q-110 -150 -60 -200 L60 -200 Q110 -150 90 0Z" fill="#B89868"/>` + OC.malzeme('yulaf', 0, -230, 1, 20) + `</g>`;
  const c1 = pop(t, .3), c2 = pop(t, 1.2);
  if (c1 > 0) o += grp(cip('YULAF', 0, 0, '#E8C878', '#4A2A10', 32), 180, 980, c1);
  if (c2 > 0) o += grp(cip('ARPA', 0, 0, '#D8B868', '#4A2A10', 32), 900, 980, c2);
  o += gubi(t, { x: 540, y: 720, boy: 200, bakHedef: [540, 1200], ust: KOYLU_G });
  const L = [[.4, 'bezelye', 'BEZELYE'], [1.1, 'fasulye', 'FASULYE'], [1.7, 'sogan', 'SOĞAN'], [2.3, 'pirasa', 'PIRASA'], [2.8, 'lahana', 'LAHANA'], [4.9, 'ot', 'BAHÇE OTLARI']];
  o += DP.sar(t, 2.6, 99, d => OCD.kazanIc(d, t, L) + (d > 6.4 ? `<g transform="translate(540 1600) scale(${Math.min(1, FX.yayTip(d - 6.4, 'normal'))})">` + OCD.cipO('KOYU BİR ÇORBA', 0, 0, TAR, '#FFFFFF', 38) + '</g>' : ''));
  $('dinamik').innerHTML = o;
};"""
# 04 — mevsime göre renk: 4 kâse
S[4] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#F2E2BC"/>` + `<rect x="60" y="360" width="960" height="900" rx="40" fill="#E8D2A8"/>`;
const MEV = [['İLKBAHAR', '#8FD65A', 300, 620], ['YAZ', '#E8C850', 780, 620], ['SONBAHAR', '#E08A3A', 300, 1010], ['KIŞ', '#8E6A4A', 780, 1010]];
window.renderAt = t => {
  let o = '';
  MEV.forEach(([ad, r, x, y], i) => { const p = FX.yayTip(t - .2 - i * .45, 'normal'); if (p <= 0) return; o += grp(OC.kase(0, 0, 1.2, r, OC.pottajIc()) + cip(ad, 0, 150, '#4A2A10', '#FFF3E0', 26), x, y, p); });
  o += gufi(t, { x: 540, y: 1760, boy: 250, bakHedef: [540, 800], ust: TURIST });
  o += FX.gecis(t, { orta: 2.85, renk: TAR, serit: '#4A2A10', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 05 — masa: çavdar/arpa ekmeği + hafif bira
S[5] = r"""
$('zemin').innerHTML = OC.kulubeIc(T);
window.renderAt = t => {
  let o = OC.masa(540, 1180, 900, T) + OC.ekmek(380, 1140, 1.1) + OC.testi(740, 1180, 1.0) + OC.kupa(900, 1180, 1.0) + OC.kase(560, 1150, .8, '#8FB050', OC.pottajIc());
  const c1 = pop(t, .4), c2 = pop(t, 3.1);
  if (c1 > 0) o += grp(cip('ÇAVDAR · ARPA EKMEĞİ', 0, 0, '#8E5A30', '#FFF3E0', 30), 540, 600, c1);
  if (c2 > 0) o += grp(cip('HAFİF BİRA', 0, 0, '#E8B840', '#4A2A10', 32), 800, 860, c2);
  o += gufi(t, { x: 300, y: 1760, boy: 250, bakHedef: [380, 1140], ust: TURIST }) + gubi(t, { x: 200, y: 820, boy: 180, bakHedef: [540, 1100], ust: KOYLU_G });
  o += FX.gecis(t, { orta: 0, renk: TAR, serit: '#4A2A10', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — domuz, pastırma, sosis (kış karı)
S[6] = r"""
$('zemin').innerHTML = OC.koy(T);
window.renderAt = t => {
  const kis = A(t, 4.9, 5.5);
  let o = `<rect width="1080" height="1920" fill="#DDE8F2" opacity="${.35 * kis}"/>`;
  o += `<rect x="560" y="700" width="460" height="24" rx="10" fill="#6A4A2A"/>`;
  const p1 = pop(t, 5.1), p2 = pop(t, 5.7); if (p1 > 0) o += grp(OC.pastirma(0, 0, .9, t), 660, 720, p1); if (p2 > 0) o += grp(OC.sosis(0, 0, .8, t), 880, 820, p2);
  o += OC.domuz(360 + Math.sin(t * .8) * 60, 1270, 1.1, t, Math.cos(t * .8) > 0 ? 1 : -1);
  const c1 = pop(t, .2), c2 = pop(t, 1.3);
  if (c1 > 0) o += grp(cip('ET NADİRDİ', 0, 0, '#8E1B2F', '#FFFFFF', 34), 360, 460, c1);
  if (c2 > 0) o += grp(cip('AMA VARDI', 0, 0, '#3FA35A', '#FFFFFF', 34), 360, 580, c2);
  if (kis > 0) for (let i = 0; i < 24; i++) { const q = ((t * .25 + HK.hash(i)) % 1); o += `<circle cx="${HK.hash(i + 9) * 1080 + Math.sin(t + i) * 20}" cy="${q * 1900}" r="${5 + HK.hash(i + 3) * 6}" fill="#FFFFFF" opacity="${.9 * kis}"/>`; }
  o += gubi(t, { x: 150, y: 1000, boy: 190, bakHedef: [360, 1200], ust: KOYLU_G });
  o += gufi(t, { x: 840, y: 1760, boy: 240, bakHedef: [700, 800], ust: TURIST });
  $('dinamik').innerHTML = o;
};"""
# 07 — peynir, yumurta, süt
S[7] = r"""
$('zemin').innerHTML = OC.koy(T);
window.renderAt = t => {
  let o = OC.tavuk(820, 1300, 1.2, t) + OC.tavuk(960, 1320, .9, t + 1);
  const it = [[.35, x => OC.peynir(0, 0, 1.2), 'PEYNİR', 260], [1.35, x => OC.yumurta(0, 0, 1.6), 'YUMURTA', 540], [2.35, x => OC.sut(0, 60, 1.1), 'SÜT', 820]];
  it.forEach(([t0, f, ad, x]) => { const p = FX.yayTip(t - t0, 'oyuncu'); if (p <= 0) return; o += `<circle cx="${x}" cy="720" r="${150 * Math.min(1, p)}" fill="#FFFDF6" opacity=".92"/>` + grp(f(), x, 730, p) + grp(cip(ad, 0, 0, '#4A2A10', '#FFF3E0', 28), x, 920, p); });
  o += gufi(t, { x: 300, y: 1760, boy: 240, bakHedef: [540, 720], ust: TURIST }) + gubi(t, { x: 620, y: 1560, boy: 170, bakHedef: [820, 1250], ust: KOYLU_G });
  $('dinamik').innerHTML = o;
};"""
# 08 — kilise çanı + perhiz takvimi → DETAY: tuzlu ringa fıçısı (doğrudan sonraki sahneye)
S[8] = r"""
$('zemin').innerHTML = OC.koy(T);
window.renderAt = t => {
  let o = OC.kilise(820, 1250, .9, t, 1 - A(t, 1.8, 2.4));
  const tk = pop(t, .5); if (tk > 0) o += grp(OC.takvimPerhiz(0, 0, .85, A(t, .7, 2.6)), 340, 720, tk);
  const c = pop(t, 1.6); if (c > 0) o += grp(cip('ET YASAK', 0, 0, '#8E1B2F', '#FFFFFF', 36), 340, 1080, c);
  o += gufi(t, { x: 300, y: 1760, boy: 240, bakHedef: [340, 720], ust: TURIST }) + gubi(t, { x: 620, y: 1560, boy: 170, bakHedef: [820, 700], ust: KOYLU_G });
  o += DP.sar(t, 3.0, 99, d => OCD.ringa(d, t));
  $('dinamik').innerHTML = o;
};"""
# 09 — bahçe: pahalı biber vs köylünün otları
S[9] = r"""
$('zemin').innerHTML = OC.koy(T) + `<rect x="0" y="1180" width="1080" height="740" fill="#7A5A3A"/>` + [0, 1, 2, 3].map(i => `<rect x="${40 + i * 260}" y="1220" width="220" height="80" rx="30" fill="#5A3A20"/>`).join('');
window.renderAt = t => {
  let o = '';
  const b = pop(t, .2); if (b > 0) { o += grp(OC.biber(0, 0, 1.1) + OC.sikke(120, -40, 34) + OC.sikke(150, -80, 34) + OC.sikke(110, -110, 34), 780, 700, b); o += grp(cip('PAHALI', 0, 0, '#8E1B2F', '#FFFFFF', 32), 780, 820, b); }
  [[1.6, 'sarimsak', 'SARIMSAK'], [3.4, 'hardal', 'HARDAL'], [4.2, 'maydanoz', 'MAYDANOZ'], [5.2, 'adacayi', 'ADAÇAYI']].forEach(([t0, ad, et], i) => { const p = FX.yayTip(t - t0, 'oyuncu'); if (p <= 0) return; const x = 170 + i * 250, y = 1060; o += `<circle cx="${x}" cy="${y}" r="${100 * Math.min(1, p)}" fill="#FFFDF6" opacity=".9"/>` + grp(OC.malzeme(ad, 0, 0, 1), x, y, p) + grp(cip(et, 0, 0, '#3FA35A', '#FFFFFF', 22), x, y + 130, p); });
  o += gubi(t, { x: 300, y: 620, boy: 190, bakHedef: [540, 1060], ust: KOYLU_G });
  o += gufi(t, { x: 820, y: 1770, boy: 240, bakHedef: [540, 1060], ust: TURIST });
  $('dinamik').innerHTML = o;
};"""
# 10 — hasat tarlası: 1348, işçi azalır, ücret artar → DETAY: hesap defteri
S[10] = r"""
window.renderAt = t => {
  let o = OC.tarla(CV.ton('kum'), t);
  const kara = A(t, 1.8, 2.4) * (1 - A(t, 5.4, 6.0)); o += `<rect width="1080" height="1920" fill="#2A2030" opacity="${.35 * kara}"/>`;
  for (let i = 0; i < 7; i++) { const kalir = i % 3 === 0, s = kalir ? 1 : 1 - A(t, 3.0 + i * .15, 3.6 + i * .15); if (s <= 0) continue; o += `<g opacity="${s}">` + koylu(90 + i * 150, 1180, 300, i, t, { poz: 'goster' }) + '</g>'; }
  const c0 = pop(t, .2); if (c0 > 0 && t < 1.8) o += grp(cip('EN ŞAŞIRTICISI', 0, 0, TAR, '#FFFFFF', 34), 540, 420, c0);
  const c1 = pop(t, 1.8); if (c1 > 0) o += grp(cip('1348 · KARA ÖLÜM', 0, 0, '#2A2030', '#FFFFFF', 38), 540, 420, c1);
  const c2 = pop(t, 3.6); if (c2 > 0) o += grp(cip('İŞÇİ AZALDI', 0, 0, '#FFFDF6', '#2A2030', 32), 540, 540, c2);
  const u = A(t, 5.6, 6.4); if (u > 0) { for (let i = 0; i < Math.floor(1 + 7 * u); i++) o += OC.sikke(860, 800 - i * 26, 50); o += grp(cip('ÜCRET ↑', 0, 0, '#E8B84A', '#4A2A10', 34), 860, 900, pop(t, 5.6)); }
  o += gufi(t, { x: 260, y: 1770, boy: 240, bakHedef: [540, 900], ust: TURIST }) + gubi(t, { x: 820, y: 1580, boy: 170, bakHedef: [540, 900], ust: KOYLU_G });
  o += DP.sar(t, 6.8, 99, d => OCD.defter(d));
  $('dinamik').innerHTML = o;
};"""
# 11 — renkli şölen masası; Gufi kameraya
S[11] = r"""
$('zemin').innerHTML = OC.koy(T);
window.renderAt = t => {
  const k = M.yakinlas(t, .2, 9); M.bulanik(k * .8);
  let arka = koylu(180, 1150, 320, 4, t) + koylu(900, 1150, 320, 5, t) + koylu(560, 1080, 280, 6, t) + OC.masa(540, 1150, 960, T) + OC.kase(300, 1120, .7, '#8FB050', OC.pottajIc()) + OC.ekmek(520, 1110, .7) + OC.pastirma(640, 980, .5, t) + OC.kupa(760, 1150, .9) + OC.peynir(880, 1130, .5);
  arka += gubi(t, { x: 820, y: 760, boy: 180, bakHedef: [540, 1100], ust: KOYLU_G });
  let on = gufi(t, { x: 440, y: 1700 + 120 * k, boy: 250 + 170 * k, bakHedef: 'kamera', ust: TURIST });
  const c = pop(t, 3.2); if (c > 0) on += grp(cip('GRİ DEĞİLDİ!', 0, 0, TAR, '#FFFFFF', 40), 540, 420, c);
  $('dinamik').innerHTML = M.bulanikSar(arka, k * .8) + on;
};"""
for k in range(1, 12): S[k] = ORTAK + S[k]
S[12] = open('_logo_sahne.js').read()

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
