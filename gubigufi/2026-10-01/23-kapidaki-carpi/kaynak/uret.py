"""#23 Kapıdaki çarpı — sahne HTML'leri + plan.json + tepkiler.json (HASSAS şablon: maskot imza sesi yok)."""
import json

SB = [0, 7.4, 13.6, 23.8, 31.3, 35.4, 43.3, 55.2, 67.4, 69.6]
ALT = {}
TEP = {
    4: [('gubi', .4, 'uzgun')],
    6: [('gufi', 5.4, 'uzgun')],
}
ORTAK = r"""
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/kc.js"></script>
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
# 01 — kanca: kapıya kırmızı çarpı; komşu kapı aralanır, Gubi & Gufi bakar
S[1] = r"""
window.renderAt = t => {
  let o = KC.koridor(t, { komsuAcik: .45 * FX.E.inOutQuart(A(t, 3.4, 4.4)) });
  o += KC.carpi(450, 880, .95, FX.E.inOutQuart(A(t, .1, 1.5)));
  if (t > 3.6) { const g = A(t, 3.6, 4.4); o += `<g opacity="${g}">` + gufi(t, { x: 960, y: 1270, boy: 220, duygu: 'saskin', bakHedef: [450, 880] }) + gubi(t, { x: 960, y: 760, boy: 150, duygu: 'saskin', parla: .3, bakHedef: [450, 880] }) + '</g>'; }
  $('dinamik').innerHTML = o;
};"""
# 02 — "Peki neden?" → DETAY: çarpı yakın + alıntı (tut, kes)
S[2] = r"""
window.renderAt = t => {
  let o = KC.koridor(t, { komsuAcik: .45 }) + KC.carpi(450, 880, .95, 1) + gufi(t, { x: 960, y: 1270, boy: 220, duygu: 'saskin', bakHedef: [450, 880] }) + gubi(t, { x: 960, y: 760, boy: 150, duygu: 'saskin', parla: .3, bakHedef: [450, 880] });
  o += DP.sar(t, 1.2, 6.2, d => KCD.carpiYakin(d, 1));
  $('dinamik').innerHTML = o;
};"""
# 03 — Aralık 1978, Maraş: kış sokağı → DETAY tokmak + boya → geniş: işaretli kapılar
S[3] = r"""
window.renderAt = t => {
  const T = t + 13.6;
  let o = KC.sokak78(T, A(t, 8.8, 9.8));
  // 1978 kış: paltolu, kasketli adam · uzun paltolu, başörtülü kadın (yetişkin oranı)
  o += KS.karakter({ x: 140 + t * 18, y: 1320, boy: 470, t: T, adim: T * 4, bak: [.6, 0], ust: '#5A5048', alt: '#3A3430', ayakkabi: '#1B1410', sac: { tip: 'kisa', renk: '#2A1E14' }, biyik: '#2A1E14', ten: '#E8B08A', kiyafet: { ceket: '#3A3A44', gomlek: '#D8D0C0', sapka: 'kasket', sapkaRenk: '#4A4038' } });
  o += KS.karakter({ x: 900 - t * 12, y: 1330, boy: 450, t: T, adim: T * 4 + 1, bak: [-.6, 0], ust: '#6A4A48', alt: '#3A2A20', ayakkabi: '#1B1410', sac: { tip: 'kakul', renk: '#3A2A20' }, ten: '#F2C6A0', kiyafet: { ceket: '#5A4040', etek: '#4A3A3A', etekBoy: 'uzun', sapka: 'basortu', sapkaRenk: '#8A7A6A' } });
  const c = pop(t, .3); if (c > 0) o += grp(cip('ARALIK 1978 · MARAŞ', 0, 0, '#1B1640', '#FFE45C', 34), 540, 400, c);
  const k = pop(t, 3.3); if (k > 0) o += grp(cip('TANIK ANLATIMLARINA GÖRE', 0, 0, '#F4EEE2', '#3A2A20', 28), 540, 490, k);
  o += DP.sar(t, 6.8, 8.8, d => KCD.tokmak(d));
  $('dinamik').innerHTML = o;
};"""
# 04 — bir hafta: gece silueti → DETAY mumlar (111 · 559 ev) tut, kes
S[4] = r"""
window.renderAt = t => {
  let o = KC.gece(t) + gubi(t, { x: 540, y: 1560, boy: 190, duygu: 'uzgun', parla: .25, bakHedef: [620, 1100] });
  const c = pop(t, .2); if (c > 0) o += grp(cip('BİR HAFTA', 0, 0, '#3A2A2A', '#FFC45C', 34), 540, 400, c);
  o += DP.sar(t, 1.9, 7.5, d => KCD.mumlar(d));
  $('dinamik').innerHTML = o;
};"""
# 05 — korkunun simgesi
S[5] = r"""
window.renderAt = t => {
  const k = 1 + .04 * A(t, 0, 4.1);
  let o = `<g transform="translate(450 900) scale(${k}) translate(-450 -900)">` + KC.koridor(t, { komsuAcik: 0, isik: .3 }) + KC.carpi(450, 880, .95, 1) + '</g>' + `<rect width="1080" height="1920" fill="#0B0A14" opacity="${.55 * A(t, 0, 1.2)}"/>` + `<g opacity="${A(t, .6, 1.4)}">` + KC.carpi(450, 880, .95, 1) + '</g>';
  const s = pop(t, 2.0); if (s > 0) o += grp(cip('KORKUNUN SİMGESİ', 0, 0, '#C8232F', '#FFFFFF', 36), 540, 400, s);
  $('dinamik').innerHTML = o;
};"""
# 06 — 2012'den bu yana: Türkiye haritası, iğneler
S[6] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#E8E2D6"/>`;
  const h = H.ciz({ ulkeler: H.ulke('Türkiye'), kutu: [50, 600, 980, 520], renk: '#D8CCB4', rim: '#F4ECDC', sinir: false });
  o += h.svg;
  [[[38.28, 37.76], 'Adıyaman', 1.6], [[38.31, 38.35], 'Malatya', 2.6], [[27.14, 38.42], 'İzmir', 3.5], [[34.95, 40.55], 'Çorum', 4.4]].forEach(([ll, ad, t0]) => { const [x, y] = h.p(ll), p = pop(t, t0); if (p > 0) o += grp(H.igne(0, 0, '#C8232F', 1, ad), x, y, p); });
  const c = pop(t, .3); if (c > 0) o += grp(cip("2012'DEN BU YANA", 0, 0, '#1B1640', '#FFE45C', 34), 540, 420, c);
  const d = pop(t, 5.3); if (d > 0) o += grp(cip('PEK ÇOK ŞEHİRDE', 0, 0, '#C8232F', '#FFFFFF', 30), 540, 510, d);
  o += gufi(t, { x: 860, y: 1800, boy: 230, duygu: 'merak', bakHedef: [600, 880] });
  $('dinamik').innerHTML = o;
};"""
# 07 — yöntem yeni değil: 1978 · 1933 · 2014 kartları; amaç: hedef göstermek, korkutmak
S[7] = r"""
const nun = `<path d="M-55 -150 Q-55 -70 0 -70 Q55 -70 55 -150" stroke="#C8232F" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="0" cy="-200" r="14" fill="#C8232F"/>`;
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#1E1A24"/>`;
  const kz = A(t, 7.5, 8.3);
  o += KC.kart(190, 820, '1978', 'Maraş', KC.kapiMini('#6A4A3A', KC.carpi(0, -100, .32, 1)), pop(t, .2), { kirmizi: kz });
  o += KC.kart(540, 820, '1933', 'Almanya', KC.dukkanMini(), pop(t, 1.75), { kirmizi: kz });
  o += KC.kart(890, 820, '2014', 'Musul', KC.kapiMini('#5A6A7A', nun), pop(t, 4.75), { kirmizi: kz });
  const c = pop(t, .2); if (c > 0) o += grp(cip('YÖNTEM YENİ DEĞİL', 0, 0, '#F4EEE2', '#1B1640', 34), 540, 400, c);
  const a = pop(t, 8.9); if (a > 0) o += grp(cip('HEDEF GÖSTERMEK · KORKUTMAK', 0, 0, '#C8232F', '#FFFFFF', 32), 540, 1190, a);
  $('dinamik').innerHTML = o;
};"""
# 08 — sadece boya değil → DETAY fırça → geniş: çarpı kapatıldı, komşular kapının yanında
S[8] = r"""
const KOMSU = [['#3A5A8C', '#2A2E40', { tip: 'kisa', renk: '#2A1E14' }, '#F2C6A0'], ['#E8A040', '#3A3A48', { tip: 'uzun', renk: '#5A3A20' }, '#E8B08A'], ['#6A8A6A', '#2A2440', { tip: 'kisa', renk: '#8A8A8A' }, '#F7B8A4']];
window.renderAt = t => {
  const son = t > 8.4;
  let o = KC.koridor(t, { komsuAcik: son ? 1 : .45, isik: son ? 1.6 : 1 });
  if (!son) o += KC.carpi(450, 880, .95, 1);
  else o += KC.boyaYama(450, 885);
  if (son) KOMSU.forEach(([u, a, sac, ten], i) => { const p = FX.E.outExpo(A(t, 8.6 + i * .3, 9.2 + i * .3)); if (p > 0) o += `<g opacity="${p}">` + KS.karakter({ x: 760 + i * 120 + (1 - p) * 120, y: 1300, boy: 430, t, ust: u, alt: a, sac, ten, ayakkabi: '#1B1B22', ifade: t > 10.0 ? 'gulumse' : 'notr', bak: [-.7, -.1] }) + '</g>'; });
  const s = pop(t, .4); if (s > 0 && !son) o += grp(cip('SADECE BOYA DEĞİL', 0, 0, '#1B1640', '#FFE45C', 34), 540, 400, s);
  const k = pop(t, 3.9); if (k > 0 && !son) o += grp(cip('"ÖTEKİ"', 0, 0, '#C8232F', '#FFFFFF', 34), 540, 490, k);
  o += gufi(t, { x: 150, y: 1300, boy: 200, duygu: son ? 'mutlu' : 'merak', bakHedef: [450, 880] });
  o += gubi(t, { x: 760, y: 560, boy: 150, duygu: t > 10.0 ? 'mutlu' : 'merak', parla: son ? .6 : .3, bakHedef: [450, 880] });
  const y = pop(t, 10.1); if (y > 0) o += grp(cip('KAPININ YANINDA DURMAK', 0, 0, '#2E8A4A', '#FFFFFF', 32), 540, 400, y);
  o += DP.sar(t, 6.4, 8.4, d => KCD.firca(d));
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
