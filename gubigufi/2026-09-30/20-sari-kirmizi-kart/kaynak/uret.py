"""#20 Sarı & kırmızı kart — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 10.1, 16.35, 24.1, 28.6, 35.65, 42.1, 50.6, 53.95, 61.45, 69.2, 74.0, 76.2]
ALT = {6: 2, 11: 3}
TEP = {
    1: [('gubi', .8, 'kararli'), ('gufi', 7.6, 'sasir')],
    2: [('gubi', 1.0, 'mutlu')],
    3: [('gubi', .5, 'isaret'), ('gufi', 4.4, 'omuzSilk'), ('gubi', 6.5, 'dusun')],
    4: [('gufi', .3, 'kararli'), ('gubi', 1.0, 'korku')],
    5: [],
    6: [('gufi', 4.4, 'sasir')],
    7: [('gufi', .3, 'aha'), ('gubi', 7.2, 'mutlu')],
    8: [('gubi', .3, 'mutlu')],
    9: [('gubi', 5.4, 'kararli')],
    10: [('gubi', 3.1, 'uzgun'), ('gufi', 4.2, 'sasir')],
    11: [('gufi', .2, 'yaklas'), ('gufi', 1.3, 'goster'), ('gubi', 1.5, 'mutlu')],
}
ORTAK = r"""
const MAV = '#1FA2FF';
const HAKEM = KO.giy('gubi', [['kasket', { renk: '#1B1B1B', siper: '#000000' }], 'duduk']);
const KAPTAN = KO.giy('gufi', ['kaptan']);
const ASTON = KO.giy('gufi', [['melon', { renk: '#5A4A3A', bant: '#1B1640' }], ['biyik', { renk: '#6A5A4A' }]]);
const ARJ = '#8CC8F0', ING = '#FFFDF6';
const JACK = { ust: '#E8E0D0', sac: { tip: 'kisa', renk: '#5A3A20' }, kiyafet: { yelek: '#5A6A8A', gomlek: '#FFFDF6' } }, BOBBY = { ust: '#FFFDF6', sac: { tip: 'kisa', renk: '#8A6A3A' }, kiyafet: { yelek: '#8A6A4A', kravat: '#7E2E3A' } };
const seyirci = (x, y, boy, i, t) => KS.karakter(Object.assign({ x, y, boy, t, ifade: 'gulumse' }, KS.donem(1966, i)));
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/sk.js"></script>
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
# 01 — kart yokken sadece sözle: karmaşa
S[1] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: '— : —' });
window.renderAt = t => {
  let o = SK.oyuncu(200, 1500, 420, t, 'ARJ1966', 0, { bak: [.6, -.3] }) + SK.oyuncu(900, 1480, 400, t, 'ING1966', 1, { bak: [-.6, -.3], ifade: 'saskin' });
  o += gubi(t, { x: 540, y: 1000, boy: 230, bakHedef: 'kamera', ust: HAKEM });
  const k = pop(t, 1.2); if (k > 0) o += grp(SK.kart(-60, 0, .6, '#FFD23F', -10) + SK.kart(60, 0, .6, '#E8323C', 10) + `<path d="M-130 -110 L130 110 M130 -110 L-130 110" stroke="#1B1B1B" stroke-width="18" stroke-linecap="round"/>`, 540, 620, k) + grp(cip('KART YOK', 0, 0, '#1B1B1B', '#FFFFFF', 30), 540, 780, k);
  [[5.2, 'HEY!', 260, 560], [5.8, 'ACHTUNG!', 820, 600], [6.3, '¡OYE!', 300, 820], [7.5, '?!', 800, 860], [8.0, '??', 540, 540]].forEach(([t0, s, x, y]) => { const p = pop(t, t0); if (p > 0) o += grp(M.balon(0, 0, txt(s, 0, 16, 44, '#1B1640'), { w: K.yaziGen(s, 44) + 90, h: 110, yon: x < 540 ? 1 : -1 }), x, y + Math.sin(t * 4 + x) * 10, p); });
  o += gufi(t, { x: 540, y: 1780, boy: 240, bakHedef: [540, 1000], ust: KAPTAN });
  o += FX.gecis(t, { orta: 10.1, renk: MAV, serit: '#1B1F3A', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — 1966: İngiltere – Arjantin, dönem giysili seyirci
S[2] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: '1966' });
window.renderAt = t => {
  let o = SK.oyuncu(260, 1560, 460, t, 'ING1966', 0, { bak: [.6, -.2] }) + SK.oyuncu(820, 1560, 460, t, 'ARJ1966', 1, { bak: [-.6, -.2] });
  o += SK.oyuncu(120, 1880, 520, t, 'ING1966', 2, { bak: [.4, -.4] }) + SK.oyuncu(960, 1880, 520, t, 'ARJ1966', 3, { bak: [-.4, -.4] });
  const c = pop(t, .3); if (c > 0) o += grp(cip('1966 · DÜNYA KUPASI', 0, 0, '#1B1F3A', '#FFE45C', 34), 540, 620, c);
  const f = pop(t, 2.4); if (f > 0) o += grp(`<rect x="-80" y="-50" width="160" height="100" fill="#FFFDF6"/><rect x="-80" y="-12" width="160" height="24" fill="#C8232F"/><rect x="-12" y="-50" width="24" height="100" fill="#C8232F"/>`, 260, 1000, f) + grp(`<rect x="-80" y="-50" width="160" height="100" fill="#8CC8F0"/><rect x="-80" y="-17" width="160" height="34" fill="#FFFDF6"/><circle cx="0" cy="0" r="12" fill="#F2B82A"/>`, 820, 1000, f) + grp(cip('VS', 0, 0, MAV, '#FFFFFF', 34), 540, 1000, f);
  o += gubi(t, { x: 540, y: 820, boy: 200, bakHedef: 'kamera', ust: HAKEM });
  o += FX.gecis(t, { orta: 0, renk: MAV, serit: '#1B1F3A', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 03 — hakem atar; dil engeli
S[3] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: 'İNG 0 · 0 ARJ' });
window.renderAt = t => {
  let o = SK.oyuncu(900, 1500, 400, t, 'ARJ1966', 0, { bak: [-.6, -.2], ifade: 'saskin' });
  o += gubi(t, { x: 300, y: 950, boy: 240, bakHedef: [700, 1500], isaretHedef: [1080, 1300], ust: HAKEM });
  o += gufi(t, { x: 700, y: 1780, boy: 290, bakHedef: [300, 950], ust: KAPTAN });
  const b1 = pop(t, 1.8), b2 = pop(t, 4.4), b3 = pop(t, 6.5);
  if (b1 > 0) o += grp(M.balon(0, 0, txt('RAUS!', 0, 18, 56, '#1B1640'), { w: 260, h: 120, yon: 1 }) + cip('ALMANCA', 0, 110, '#1B1B1B', '#FFE45C', 24), 330, 600, b1);
  if (b2 > 0) o += grp(M.balon(0, 0, txt('¿QUÉ?', 0, 18, 56, '#1B1640'), { w: 260, h: 120, yon: -1 }) + cip('İSPANYOLCA', 0, 110, ARJ, '#1B1640', 24), 760, 1060, b2);
  if (b3 > 0) o += grp(txt('?', 0, 0, 160, '#E8323C'), 300, 720, b3, -10);
  $('dinamik').innerHTML = o;
};"""
# 04 — sahayı terk etmiyor → DETAY: duran saat (doğrudan sonraki sahneye)
S[4] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: 'İNG 0 · 0 ARJ' });
window.renderAt = t => {
  let o = gufi(t, { x: 560, y: 1500, boy: 270, bakHedef: 'kamera', ust: KAPTAN }) + `<ellipse cx="560" cy="1510" rx="180" ry="24" fill="#2F8A4A"/>`;
  o += gubi(t, { x: 820, y: 960, boy: 220, bakHedef: [560, 1400], ust: HAKEM });
  o += DP.sar(t, 1.9, 99, d => SKD.saat(d, t));
  $('dinamik').innerHTML = o;
};"""
# 05 — kahvaltı: Charlton kardeşler → DETAY gazete → geniş
S[5] = r"""
const T = CV.ton('seftali');
$('zemin').innerHTML = SK.kahvalti(T);
window.renderAt = t => {
  const sas = t > 4.8;
  let o = KS.karakter(Object.assign({ x: 300, y: 1560, boy: 560, t, ifade: sas ? 'saskin' : 'notr', bak: [.5, -.3] }, JACK)) + KS.karakter(Object.assign({ x: 780, y: 1560, boy: 560, t, ifade: sas ? 'saskin' : 'notr', bak: [-.5, -.3] }, BOBBY));
  o += SK.gazete(540, 1120, .45, -4, "CHARLTON'LARA UYARI!", 'Kardeşler gazeteden öğrendi');
  const c = pop(t, .3); if (c > 0) o += grp(cip('ERTESİ SABAH', 0, 0, '#1B1F3A', '#FFE45C', 30), 540, 420, c);
  const j = pop(t, 5.0); if (j > 0) o += grp(cip('JACK', 0, 0, ING, '#1B1640', 26), 300, 880, j) + grp(cip('BOBBY', 0, 0, ING, '#1B1640', 26), 780, 880, j);
  o += gubi(t, { x: 940, y: 560, boy: 170, bakHedef: [540, 1100], ust: HAKEM });
  o += DP.sar(t, 2.1, 4.8, d => SKD.gazete(d));
  $('dinamik').innerHTML = o;
};"""
# 06 — 1966 Londra: Ken Aston arabada, trafik ışığında durur
S[6] = r"""
$('zemin').innerHTML = SK.londra(0);
window.renderAt = t => {
  let o = SK.otobus(1500 - 700 * t, 1330, .9);
  o += SK.isik(900, 1320, .75, t > 3.9 ? 'kirmizi' : 'yesil', t);
  const ax = -500 + 880 * FX.E.expo(A(t, .4, 4.4));
  const sofor = `<defs><clipPath id="cam"><path d="M-70 -240 Q-30 -275 50 -275 Q120 -275 150 -200 L-110 -170Z"/></clipPath></defs><g clip-path="url(#cam)">` + gufi(t, { x: 30, y: -95, boy: 175, bakHedef: [880, -700], ust: ASTON }) + '</g>';
  o += SK.araba(ax, 1800, 1.35, sofor);
  const c = pop(t, .3); if (c > 0) o += grp(cip('1966 · LONDRA', 0, 0, '#1B1F3A', '#FFE45C', 30), 540, 420, c);
  const k = pop(t, 1.0); if (k > 0) o += grp(cip('KEN ASTON', 0, 0, MAV, '#FFFFFF', 32), 540, 540, k);
  $('dinamik').innerHTML = o;
};"""
# 07 — trafik ışığı: fikir! sarı = dikkat, kırmızı = dur; ışıklar karta dönüşür
S[7] = r"""
$('zemin').innerHTML = `<g style="filter:blur(12px)">${SK.londra(0)}</g><rect width="1080" height="1920" fill="#1B1F3A" opacity=".25"/>`;
window.renderAt = t => {
  const yan = t < 2.4 ? 'yesil' : t < 4.9 ? 'sari' : t < 7.1 ? 'kirmizi' : null;
  let o = SK.isik(540, 1550, 1.35, yan, t);
  const a = pop(t, .3); if (a > 0) o += grp(`<circle cx="0" cy="0" r="70" fill="#FFF3A0"/><rect x="-26" y="60" width="52" height="40" rx="8" fill="#9AA0B0"/>` + [0, 1, 2, 3, 4, 5].map(i => { const an = i / 6 * Math.PI * 2; return `<path d="M${Math.cos(an) * 90} ${Math.sin(an) * 90} L${Math.cos(an) * 130} ${Math.sin(an) * 130}" stroke="#FFE45C" stroke-width="10" stroke-linecap="round"/>`; }).join(''), 200, 520, a);
  const c1 = pop(t, 3.1), c2 = pop(t, 5.8);
  if (c1 > 0) o += grp(cip('SARI: DİKKAT, YAVAŞLA', 0, 0, '#FFD23F', '#1B1640', 30), 540, 420, c1);
  if (c2 > 0) o += grp(cip('KIRMIZI: DUR, DIŞARI!', 0, 0, '#E8323C', '#FFFFFF', 30), 540, 530, c2);
  const q = FX.E.expo(A(t, 7.1, 7.9));
  if (t > 7.1) { o += SK.kart(540 + (330 - 540) * q, 1550 - 1.35 * 260 + (720 - (1550 - 1.35 * 260)) * q, .6 + 1.2 * q, '#FFD23F', -10 * q) + SK.kart(540 + (750 - 540) * q, 1550 - 1.35 * 420 + (720 - (1550 - 1.35 * 420)) * q, .6 + 1.2 * q, '#E8323C', 10 * q); }
  o += gufi(t, { x: 200, y: 1780, boy: 230, bakHedef: [540, 900], ust: ASTON });
  o += gubi(t, { x: 900, y: 1640, boy: 170, bakHedef: [540, 900], ust: HAKEM });
  $('dinamik').innerHTML = o;
};"""
# 08 — dil gerekmez: farklı ülkelerden oyuncular anlar
S[8] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: 'KARTLAR' });
window.renderAt = t => {
  let o = '';
  [['BRE1970', 0, 150], ['ITA1970', 0, 390], ['MEK1970', 0, 690], ['FRG1966', 0, 930]].forEach(([f, s, x], i) => { o += SK.oyuncu(x, 1600, 380, t, f, i, { bak: [(540 - x) / 500, -.5], ifade: t > 1.2 ? 'gulumse' : 'saskin' }); const p = pop(t, 1.2 + i * .15); if (p > 0) o += grp(txt('✓', 0, 0, 80, '#3FA35A'), x, 1080, p); });
  o += gubi(t, { x: 540, y: 820, boy: 210, bakHedef: 'kamera', ust: HAKEM }) + SK.kart(380, 800, .8, '#FFD23F', -12) + SK.kart(700, 800, .8, '#E8323C', 12);
  const c = pop(t, .3); if (c > 0) o += grp(cip('DİL GEREKMEZ', 0, 0, MAV, '#FFFFFF', 36), 540, 540, c);
  $('dinamik').innerHTML = o;
};"""
# 09 — 1970 Meksika → DETAY: kart cepten → geniş: ilk sarı, Lovçev
S[9] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: 'MEKSİKA 1970', gok: '#7ACFF0', gunes: true, sombrero: true, donem: 1970 });
window.renderAt = t => {
  let o = SK.oyuncu(760, 1580, 460, t, 'SSCB1970', 0, { bak: [-.6, -.3], ifade: t > 5.4 ? 'saskin' : 'notr', sac: { tip: 'kisa', renk: '#8A6A3A' } });
  o += `<text x="760" y="1310" font-size="34" font-weight="900" text-anchor="middle" style="fill:#FFD23F">CCCP</text>`;
  const c = pop(t, .3); if (c > 0) o += grp(cip('1970 · MEKSİKA', 0, 0, '#3FA35A', '#FFFFFF', 34), 540, 620, c);
  if (t > 5.2) o += SK.kart(430, 820, 1.0, '#FFD23F', -8);
  const l = pop(t, 5.6); if (l > 0) o += grp(cip('YEVGENİ LOVÇEV', 0, 0, '#C8232F', '#FFFFFF', 28), 760, 1080, l);
  o += gubi(t, { x: 300, y: 980, boy: 220, bakHedef: [760, 1300], ust: HAKEM });
  o += DP.sar(t, 2.9, 5.2, d => SKD.cepten(d));
  $('dinamik').innerHTML = o;
};"""
# 10 — skor tabelası: 1970 kırmızı 0 → 1974 ilk kırmızı
S[10] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: '1970 → 1974', donem: 1972 });
window.renderAt = t => {
  const r1 = A(t, 2.9, 3.2), r2 = A(t, 3.8, 4.1);
  let o = SK.tabelaSkor(540, 700, 1.0, [['1970 · KIRMIZI', r1 > 0 ? '0' : '?', '#E8323C'], ['1974 · İLK KIRMIZI', r2 > 0 ? '✓' : '', '#3FC85A']]);
  if (r1 > 0 && r1 < 1) o += FX.flas(t, 2.9, .35, .08);
  const cb = FX.E.expo(A(t, 1.2, 2.6)); o += SK.kart(760, 1100 + 200 * cb, 1.0, '#E8323C', 10 - 30 * cb);
  o += gubi(t, { x: 760, y: 1080, boy: 200, bakHedef: [540, 700], ust: HAKEM });
  o += gufi(t, { x: 300, y: 1780, boy: 260, bakHedef: [540, 700], ust: KAPTAN });
  $('dinamik').innerHTML = o;
};"""
# 11 — kapanış: evrensel dil
S[11] = r"""
$('zemin').innerHTML = SK.stadyum(0, { yazi: 'GUBİ 1 · 1 GUFİ' });
window.renderAt = t => {
  const k = M.yakinlas(t, .2, 9); M.bulanik(k * .8);
  const arka = SK.isik(200, 1300, .6, ['yesil', 'sari', 'kirmizi'][Math.floor(t * 1.2) % 3], t) + gubi(t, { x: 820, y: 860, boy: 210, bakHedef: [540, 1500], ust: HAKEM }) + SK.kart(690, 840, .6, '#FFD23F', -10) + SK.kart(950, 840, .6, '#E8323C', 10);
  let on = gufi(t, { x: 540, y: 1700 + 120 * k, boy: 260 + 180 * k, bakHedef: 'kamera', ust: KAPTAN });
  const c = pop(t, .4); if (c > 0) on += grp(cip('FUTBOLUN EVRENSEL DİLİ', 0, 0, MAV, '#FFFFFF', 34), 540, 420, c);
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
