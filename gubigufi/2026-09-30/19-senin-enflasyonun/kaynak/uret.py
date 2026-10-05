"""#19 Senin enflasyonun kaç — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 6.8, 11.9, 22.05, 24.9, 31.15, 38.55, 45.4, 49.55, 54.15, 62.55, 67.7, 69.9]
ALT = {11: 3}
TEP = {
    1: [('gubi', 2.2, 'kararli'), ('gufi', 2.4, 'kararli'), ('gufi', 5.7, 'omuzSilk')],
    2: [('gubi', 1.2, 'sasir')],
    3: [('gufi', 7.6, 'dusun')],
    4: [('gubi', .5, 'omuzSilk'), ('gufi', .7, 'omuzSilk')],
    5: [('gubi', 4.2, 'dusun')],
    6: [('gubi', 2.5, 'korku')],
    7: [('gufi', 1.2, 'mutlu')],
    8: [('gufi', 3.4, 'mutlu')],
    9: [('gubi', 2.6, 'sasir'), ('gufi', 2.8, 'omuzSilk')],
    10: [('gubi', 1.0, 'dusun')],
    11: [('gufi', .2, 'yaklas'), ('gufi', 1.4, 'goster'), ('gubi', 1.6, 'mutlu')],
}
ORTAK = r"""
const YES = '#2FBF71';
const T = CV.ton('teal');
const OGR = KO.giy('gubi', [['kep', { renk: '#1B1640', puskul: '#FFB44C' }]]);
const EMK = KO.giy('gufi', ['gozluk', ['kasket', { renk: '#8A8A9A', siper: '#5A5A6A' }]]);
const ornek = () => cip('ÖRNEK', 130, 380, '#FFE45C', '#1B1640', 22);
const OGR_P = [['Kira', .40, '#E8505B'], ['Gıda', .35, '#FFB44C'], ['Ulaşım', .15, '#2E9AD8'], ['Diğer', .10, '#8A6FE0']];
const EMK_P = [['Gıda', .40, '#FFB44C'], ['Fatura', .25, '#2E9AD8'], ['İlaç', .15, '#E8505B'], ['Diğer', .20, '#8A6FE0']];
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/en.js"></script>
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
# 01 — salon: TV'de enflasyon haberi, kanepede kaşları çatık ikili
S[1] = r"""
$('zemin').innerHTML = EN.salon(T);
window.renderAt = t => {
  let o = EN.tvHaber(t);
  o += gubi(t, { x: 380, y: 1200, boy: 180, bakHedef: [540, 740], ust: OGR });
  o += gufi(t, { x: 720, y: 1350, boy: 230, bakHedef: t < 5.6 ? [540, 740] : 'kamera', ust: EMK });
  if (t > 2.1 && t < 5.4) o += M.balon(560, 460, txt('BENİ ANLATMIYOR!', 0, 16, 40, '#1B1640'), { w: 470, h: 120, yon: 1 });
  const c = pop(t, 5.6); if (c > 0) o += grp(cip('HAKLI OLABİLİRSİN', 0, 0, YES, '#FFFFFF', 34), 540, 440, c);
  $('dinamik').innerHTML = o;
};"""
# 02 — TÜFE = dev sepet
S[2] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#DFF6EC"/>` + CV.bulut(200, 260, .8) + CV.bulut(860, 200, .6) + `<rect x="0" y="1300" width="1080" height="620" fill="#86C8A8"/>`;
window.renderAt = t => {
  const s = FX.E.expo(A(t, .1, 1.0));
  let o = EN.sepet(540, -400 + 1480 * s, 1.3, [['gida', -120, -170, 1], ['kira', 60, -190, 1], ['ulasim', 170, -160, .9]]);
  if (t > 1.0) o += FX.sokHalkasi(540, 1200, t, 1.0, { renk: '#FFFFFF', yaricap: 600, kalinlik: 20 });
  const p = FX.yayTip(t - .3, 'agir'); if (p > 0) o += grp(`<rect x="-180" y="-80" width="360" height="160" rx="40" fill="${YES}"/>` + txt('TÜFE', 0, 30, 100, '#FFFFFF'), 540, 440, p);
  const c = pop(t, 2.8); if (c > 0) o += grp(cip('SEPETİN FİYAT DEĞİŞİMİ', 0, 0, '#1B1640', '#FFE45C', 30), 540, 600, c);
  o += gubi(t, { x: 180, y: 1520, boy: 170, bakHedef: [540, 1000], ust: OGR }) + gufi(t, { x: 900, y: 1770, boy: 230, bakHedef: [540, 1000], ust: EMK });
  $('dinamik').innerHTML = o;
};"""
# 03 — geniş sepet → DETAY sepetin içi (kalemler + ağırlık) → geniş: ORTALAMA HANE kartonu
S[3] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#DFF6EC"/>` + `<rect x="0" y="1300" width="1080" height="620" fill="#86C8A8"/>`;
const L = [[.1, 'gida', 'GIDA', .8], [.9, 'kira', 'KİRA', .6], [1.7, 'ulasim', 'ULAŞIM', .5], [2.5, 'giyim', 'GİYİM', .25], [3.3, 'saglik', 'SAĞLIK', .15]];
window.renderAt = t => {
  let o = EN.sepet(540, 1080, 1.3, [['gida', -120, -170, 1], ['kira', 60, -190, 1], ['ulasim', 170, -160, .9]]);
  const k = FX.yayTip(t - 7.4, 'normal'); if (k > 0) o = grp(EN.karton(0, 0, 1, t), 540, 1250, k) + grp(cip('ORTALAMA HANE', 0, 0, '#1B1640', '#FFFFFF', 32), 540, 470, k);
  o += gufi(t, { x: 180, y: 1770, boy: 230, bakHedef: [540, 900], ust: EMK });
  o += DP.sar(t, .6, 7.3, d => END.sepetIc(d, L, 5.3));
  $('dinamik').innerHTML = o;
};"""
# 04 — kimse ortalama değil
S[4] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#DFF6EC"/>` + `<rect x="0" y="1300" width="1080" height="620" fill="#86C8A8"/>`;
window.renderAt = t => {
  let o = EN.karton(540, 1250, 1, t) + `<path d="M300 700 L780 1240 M780 700 L300 1240" stroke="#E8323C" stroke-width="${24 * A(t, .8, 1.2)}" stroke-linecap="round" opacity=".85"/>`;
  const c = pop(t, .3); if (c > 0) o += grp(cip('KİMSE ORTALAMA DEĞİL', 0, 0, '#E8323C', '#FFFFFF', 32), 540, 440, c);
  o += gubi(t, { x: 170, y: 1540, boy: 200, bakHedef: 'kamera', ust: OGR }) + gufi(t, { x: 900, y: 1770, boy: 260, bakHedef: 'kamera', ust: EMK });
  $('dinamik').innerHTML = o;
};"""
# 05 — öğrenci kiracı: harcama pastası, kira %40
S[5] = r"""
$('zemin').innerHTML = EN.ogrenciOda(T);
window.renderAt = t => {
  let o = EN.pasta(720, 760, 230, OGR_P, FX.E.expo(A(t, 1.9, 3.8)));
  const vur = A(t, 4.1, 4.5) * (1 - A(t, 5.6, 6.0)); if (vur > 0) o += `<circle cx="720" cy="760" r="${250 + 10 * Math.sin(t * 12)}" fill="none" stroke="#E8505B" stroke-width="${12 * vur}"/>`;
  const c = pop(t, 2.0); if (c > 0) o += grp(cip('KİRACI ÖĞRENCİ', 0, 0, '#1B1640', '#FFFFFF', 30), 720, 440, c);
  o += ornek();
  o += gubi(t, { x: 300, y: 900, boy: 230, bakHedef: [720, 760], ust: OGR });
  o += FX.gecis(t, { orta: 0, renk: YES, serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — kira +%60, gıda +%45 → DETAY hesap tablosu (%47) → doğrudan sonraki sahne
S[6] = r"""
$('zemin').innerHTML = EN.ogrenciOda(T);
window.renderAt = t => {
  let o = '';
  [[.2, 'KİRA', 60, '#E8505B', 320], [1.9, 'GIDA', 45, '#FFB44C', 700]].forEach(([t0, ad, v, r, x]) => { const p = FX.E.expo(A(t, t0, t0 + 1.0)); if (p <= 0) return; const hgt = 500 * v / 60 * p;
    o += `<rect x="${x - 90}" y="${1150 - hgt}" width="180" height="${hgt}" rx="20" fill="${r}"/>` + txt(`+%${Math.round(v * p)}`, x, 1120 - hgt, 70, r) + grp(cip(ad, 0, 0, '#1B1640', '#FFFFFF', 28), x, 1200, 1); });
  o += ornek();
  o += gubi(t, { x: 520, y: 520, boy: 200, bakHedef: [500, 900], ust: OGR });
  if (t > 2.5) for (let i = 0; i < 2; i++) { const q = ((t * 1.3 + i / 2) % 1); o += `<ellipse cx="${620 + i * 20}" cy="${470 + q * 120}" rx="10" ry="15" fill="#6CC8F0" opacity="${1 - q}"/>`; }
  o += DP.sar(t, 3.9, 99, d => END.hesap(d, [['Kira', 40, 60], ['Gıda', 35, 45], ['Ulaşım', 15, 30], ['Diğer', 10, 25]], 47, '#E8505B'));
  $('dinamik').innerHTML = o;
};"""
# 07 — ev sahibi emekli: kira yok, gıda/fatura/ilaç
S[7] = r"""
$('zemin').innerHTML = EN.emekliEv(T);
window.renderAt = t => {
  let o = EN.pasta(330, 780, 210, EMK_P, FX.E.expo(A(t, 3.3, 5.0)));
  const k = pop(t, 1.0); if (k > 0) o += grp(`<circle cx="0" cy="0" r="80" fill="#FFFDF6"/>` + EN.ikon('kira', 0, 0, 1) + `<path d="M-56 -56 L56 56" stroke="#E8323C" stroke-width="14" stroke-linecap="round"/>`, 800, 560, k) + grp(cip('KİRA YOK', 0, 0, '#E8323C', '#FFFFFF', 26), 800, 680, k);
  const c = pop(t, .3); if (c > 0) o += grp(cip('EV SAHİBİ EMEKLİ', 0, 0, '#1B1640', '#FFFFFF', 30), 330, 440, c);
  o += ornek();
  o += gufi(t, { x: 800, y: 1010, boy: 220, bakHedef: [330, 780], ust: EMK });
  $('dinamik').innerHTML = o;
};"""
# 08 — emeklinin termometresi ~%34
S[8] = r"""
$('zemin').innerHTML = EN.emekliEv(T);
window.renderAt = t => {
  const v = 34 * FX.E.expo(A(t, 1.0, 3.9));
  let o = `<rect x="140" y="360" width="600" height="880" rx="40" fill="#FFFDF6" opacity=".9"/>` + EN.termometre(440, 1060, 1.0, v, 60, '#2E9AD8', 'EMEKLİ');
  o += ornek() + gufi(t, { x: 890, y: 1010, boy: 220, bakHedef: [440, 700], ust: EMK });
  $('dinamik').innerHTML = o;
};"""
# 09 — yan yana: %47 vs %34, ortada resmi = ortalama
S[9] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#DFF6EC"/>` + `<rect x="0" y="1300" width="1080" height="620" fill="#86C8A8"/>`;
window.renderAt = t => {
  const p = FX.E.expo(A(t, .1, 1.2));
  let o = EN.termometre(250, 1100, .95, 47 * p, 60, '#E8505B', 'ÖĞRENCİ') + EN.termometre(830, 1100, .95, 34 * p, 60, '#2E9AD8', 'EMEKLİ');
  const RY = 1100 - 570 * 29.73 / 60 * .95, r = A(t, 1.2, 1.8); o += `<path d="M130 ${RY} H950" stroke="#1B1640" stroke-width="8" stroke-dasharray="24 16" opacity="${r}"/>` + (r > 0 ? grp(cip('RESMİ %29,73 = ORTALAMA', 0, 0, '#1B1640', '#FFE45C', 26), 540, RY - 60, r) : '');
  const c = pop(t, 2.6); if (c > 0) o += grp(cip('HERKESİNKİ FARKLI', 0, 0, YES, '#FFFFFF', 34), 540, 420, c);
  o += gubi(t, { x: 250, y: 1560, boy: 180, bakHedef: [830, 800], ust: OGR }) + gufi(t, { x: 830, y: 1780, boy: 230, bakHedef: [250, 800], ust: EMK });
  $('dinamik').innerHTML = o;
};"""
# 10 — defter: kalemlere ayır → DETAY formül kartı
S[10] = r"""
$('zemin').innerHTML = EN.ogrenciOda(T);
window.renderAt = t => {
  let o = `<g transform="rotate(-3 540 760)"><rect x="220" y="400" width="640" height="720" rx="20" fill="#FFFDF6"/>`;
  for (let i = 0; i < 12; i++) o += `<rect x="250" y="${470 + i * 52}" width="580" height="3" fill="#9AC8E0"/>`;
  ['Kira', 'Gıda', 'Ulaşım', 'Giyim', 'Sağlık'].forEach((s, i) => { const q = A(t, .3 + i * .5, .7 + i * .5); if (q > 0) o += `<text x="290" y="${560 + i * 104}" font-size="52" font-weight="700" opacity="${q}" style="fill:#2A3A7A">${s}</text><text x="780" y="${560 + i * 104}" font-size="48" font-weight="700" text-anchor="end" opacity="${q}" style="fill:#8A7A9E">%…</text>`; });
  o += '</g>' + PR.hesapMakinesi(880, 1100, .6, '0');
  o += gubi(t, { x: 170, y: 560, boy: 190, bakHedef: [540, 760], ust: OGR });
  o += DP.sar(t, 3.8, 99, d => END.formul(d));
  $('dinamik').innerHTML = o;
};"""
# 11 — kapanış: Gufi cüzdanıyla kameraya
S[11] = r"""
$('zemin').innerHTML = EN.salon(T);
window.renderAt = t => {
  const k = M.yakinlas(t, .2, 9); M.bulanik(k * .8);
  const arka = EN.tvHaber(t) + gubi(t, { x: 380, y: 1200, boy: 180, bakHedef: [540, 1400], ust: OGR });
  let on = gufi(t, { x: 560, y: 1700 + 120 * k, boy: 260 + 170 * k, bakHedef: 'kamera', ust: EMK });
  const cz = pop(t, 1.3); if (cz > 0) on += grp(PR.cuzdan(0, 0, .8, .6), 860, 1480, cz);
  const c = pop(t, .4), c2 = pop(t, 2.3);
  if (c > 0) on += grp(cip('RESMİ RAKAM = ORTALAMA', 0, 0, '#1B1640', '#FFE45C', 30), 540, 420, c);
  if (c2 > 0) on += grp(cip('SENİN CEBİN SENİNKİ', 0, 0, YES, '#FFFFFF', 34), 540, 540, c2);
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
