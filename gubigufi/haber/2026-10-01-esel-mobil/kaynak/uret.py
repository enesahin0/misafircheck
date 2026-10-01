"""GubiGufi Haber #1 — eşel mobil — sahne HTML'leri + plan.json + tepkiler.json. Ses 2,0 sn gecikmeli (jenerik)."""
import json

SB = [0, 2.0, 16.9, 22.0, 32.7, 35.4, 47.0, 53.4, 62.2, 67.6, 69.8]
ALT = {}
TEP = {
    2: [('gubi', .4, 'selam')],
    3: [('gufi', .3, 'selam')],
    5: [('gufi', .3, 'kararli')],
    6: [('gufi', 8.2, 'sasir')],
    7: [('gufi', .3, 'isaret')],
    8: [('gufi', .3, 'kararli')],
    9: [('gubi', .5, 'goster'), ('gubi', 4.3, 'selam')],
}
ORTAK = r"""
const SUNUCU = KO.giy('gubi', [['papyon', { renk: '#E8323C' }]]);
const MUHABIR = (x, y, boy, ifade, t) => HB.mikrofon(x, y, boy);
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/hb.js"></script>
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
TICKER_PY = "AKARYAKITTA EŞEL MOBİL SONA ERDİ  ·  BENZİNDE ÖTV EKİM-KASIM-ARALIK KADEMELİ ARTACAK  ·  LPG'DE ÖTV 11,38 TL/KG  ·  EVİM SİSTEMİNDE YENİ KURALLAR YÜRÜRLÜKTE  ·  "
# 01 — jenerik
S[1] = r"""
window.renderAt = t => { $('dinamik').innerHTML = HB.jenerik(t); };"""
# 02 — stüdyo: Gubi sunucu; DETAY Resmî Gazete; Gufi'ye bağlantı (duvar → tam ekran)
S[2] = r"""
const duvarIc = t => `<rect width="820" height="470" fill="#0A2448"/>` + HB.kure(160, 235, 130, t, .6) + HB.pompa(700, 440, .8) + `<text x="420" y="120" font-size="58" font-weight="900" text-anchor="middle" style="fill:#FFFFFF">EŞEL MOBİL</text><rect x="250" y="150" width="340" height="12" fill="#E8323C"/>`;
const saha = t => HB.istasyon(t) + gufi(t, { x: 330, y: 1830, boy: 300, bakHedef: 'kamera', ust: MUHABIR, eller: false });
window.renderAt = t => {
  const z = FX.E.inOutQuart(A(t, 12.9, 14.0));
  let o;
  if (z <= 0) {
    const ic = t < 11.4 ? duvarIc(t) : `<g transform="scale(${820 / 1080}) translate(0 -1230)">${saha(t)}</g><rect x="20" y="20" width="150" height="44" rx="8" fill="#E8323C"/><text class="mono" x="40" y="51" font-size="24" style="fill:#FFF">● CANLI</text>`;
    o = HB.studyo(t, ic) + gubi(t, { x: 540, y: 905, boy: 250, bakHedef: 'kamera', ust: SUNUCU }) + HB.masa(t);
    o += HB.ekran(t, { alt: t > 9.6 ? ['GUFİ SAHADA', 'CANLI BAĞLANTI'] : ['AKARYAKITTA EŞEL MOBİL DÖNEMİ SONA ERDİ', 'EKONOMİ'], altP: t > 9.6 ? A(t, 11.0, 11.5) : A(t, 2.6, 3.1), serit: TICKER });
  } else {
    // duvardaki yayın tam ekrana büyür
    const [x, y, w, hh] = HB.DUVAR, X = x * (1 - z), Y = y * (1 - z), W = w + (1080 - w) * z, H = hh + (1920 - hh) * z;
    const vb = [0, 1230 * (1 - z), 1080, (1080 * hh / w) * (1 - z) + 1920 * z];
    o = HB.studyo(t, '') + `<svg x="${X}" y="${Y}" width="${W}" height="${H}" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid slice">${saha(t)}</svg>`;
  }
  o += DP.sar(t, 7.2, 10.9, d => HB.gazete(d));
  o += HB.parazit(t, 14.4, .7);
  $('dinamik').innerHTML = o;
};"""
# 03 — saha: Gufi canlı
S[3] = r"""
$('zemin').innerHTML = HB.istasyon(0);
window.renderAt = t => {
  let o = gufi(t, { x: 330, y: 1830, boy: 300, bakHedef: 'kamera', ust: MUHABIR, eller: false });
  o += HB.ekran(t, { yer: 'AKARYAKIT İSTASYONU', alt: ['GUFİ · SAHA MUHABİRİ', 'CANLI BAĞLANTI'], altP: A(t, .2, .7) }) + HB.sinyal(950, 420);
  $('dinamik').innerHTML = o;
};"""
# 04 — grafik: ÖTV yastığı → yastık kalkar
S[4] = r"""
window.renderAt = t => {
  let o = HB.yastik(t, { ezil: A(t, 1.3, 2.3) * (1 - A(t, 7.0, 7.4)), yuzde: pop(t, 2.0), yastikP: 1 - FX.E.inOutQuart(A(t, 7.2, 8.0)), carp: FX.E.expo(A(t, 8.0, 8.5)) });
  if (t > 8.0 && t < 8.6) o += FX.flas(t, 8.4, .3, .1);
  o += HB.ekran(t, {});
  o += HB.parazit(t, 0, .4);
  $('dinamik').innerHTML = o;
};"""
# 05 — saha: kademeli geçiş
S[5] = r"""
$('zemin').innerHTML = HB.istasyon(0);
window.renderAt = t => {
  let o = gufi(t, { x: 330, y: 1830, boy: 300, bakHedef: [550, 800], ust: MUHABIR, eller: false });
  o += HB.ekran(t, { yer: 'AKARYAKIT İSTASYONU', alt: ['BENZİNDE KADEMELİ GEÇİŞ', 'EKONOMİ'], altP: A(t, .2, .7) }) + HB.sinyal(950, 420);
  o += HB.parazit(t, 0, .4);
  $('dinamik').innerHTML = o;
};"""
# 06 — grafik: ÖTV merdiveni
S[6] = r"""
window.renderAt = t => {
  let o = HB.merdiven(t, [A(t, 3.45, 4.05), A(t, 5.62, 6.22), A(t, 8.05, 8.65)]);
  o += gufi(t, { x: 910, y: 1760, boy: 210, bakHedef: [540, 900] });
  o += HB.ekran(t, {});
  o += HB.parazit(t, 0, .4);
  $('dinamik').innerHTML = o;
};"""
# 07 — saha → DETAY pompa ekranı
S[7] = r"""
$('zemin').innerHTML = HB.istasyon(0);
window.renderAt = t => {
  let o = gufi(t, { x: 330, y: 1830, boy: 300, bakHedef: [440, 800], ust: MUHABIR, eller: false });
  o += HB.ekran(t, { yer: 'AKARYAKIT İSTASYONU', alt: ['ÜÇ AY BOYUNCA HER AY ZAM', 'EKONOMİ'], altP: A(t, .2, .7) }) + HB.sinyal(950, 420);
  o += DP.sar(t, 1.6, 6.4, d => HB.pompaEkran(d)) + (t > 1.6 ? HB.ekran(t, {}) : '');
  o += HB.parazit(t, 0, .4);
  $('dinamik').innerHTML = o;
};"""
# 08 — saha LPG → grafik LPG etiketi
S[8] = r"""
window.renderAt = t => {
  let o;
  if (t < 3.0) { o = HB.istasyon(t, { lpg: true }) + gufi(t, { x: 330, y: 1830, boy: 300, bakHedef: [660, 800], ust: MUHABIR, eller: false });
    o += HB.ekran(t, { yer: 'AKARYAKIT İSTASYONU', alt: ["LPG'DE KADEMELİ GEÇİŞ YOK", 'EKONOMİ'], altP: A(t, .2, .7) }) + HB.sinyal(950, 420); }
  else { o = HB.lpgEtiket(t - 3.0 - .8) + HB.ekran(t, {}); }
  o += HB.parazit(t, 0, .4) + HB.parazit(t, 3.0, .4);
  $('dinamik').innerHTML = o;
};"""
# 09 — stüdyoya dönüş, takip kartı, kapanış
S[9] = r"""
window.renderAt = t => {
  let o = HB.studyo(t, `<rect width="820" height="470" fill="#0A2448"/>` + HB.kure(410, 235, 180, t, .5)) + gubi(t, { x: 540, y: 905, boy: 250, bakHedef: 'kamera', ust: SUNUCU }) + HB.masa(t);
  const p = pop(t, .4); if (p > 0) o += HB.takip(p);
  o += HB.ekran(t, { canli: t < 5.0, alt: ['İYİ AKŞAMLAR', 'GUBİGUFİ HABER'], altP: A(t, 4.1, 4.6), serit: TICKER });
  o += HB.parazit(t, 0, .5);
  $('dinamik').innerHTML = o;
};"""
ORTAK += "const TICKER = " + json.dumps(TICKER_PY) + ";\n"

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
