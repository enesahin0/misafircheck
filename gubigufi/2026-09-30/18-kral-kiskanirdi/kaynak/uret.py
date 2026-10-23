"""#18 Kral seni kıskanırdı — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 6.6, 11.5, 19.85, 24.6, 29.1, 38.1, 48.15, 56.4, 62.3, 70.0, 73.6, 75.8]
ALT = {8: 2, 11: 3}
TEP = {
    1: [('gubi', 1.0, 'kararli')],
    2: [('gufi', .8, 'selam'), ('gubi', 1.5, 'sasir')],
    3: [('gubi', 1.6, 'korku'), ('gufi', 2.4, 'goster')],
    4: [('gubi', 1.6, 'korku')],
    5: [('gufi', 2.0, 'mutlu')],
    6: [('gubi', .6, 'korku'), ('gufi', 6.8, 'mutlu')],
    7: [('gufi', 1.0, 'goster'), ('gubi', 3.2, 'uzgun')],
    8: [('gubi', 2.0, 'uzgun'), ('gufi', 4.6, 'selam')],
    9: [('gubi', 2.0, 'donus'), ('gufi', 3.4, 'zipla'), ('gufi', 4.6, 'mutlu')],
    10: [('gubi', 2.2, 'uzgun'), ('gufi', 4.6, 'aha')],
    11: [('gufi', .2, 'yaklas'), ('gufi', 1.2, 'goster')],
}
ORTAK = r"""
const TAR = '#E07A3F', YB = 1000;
const T = CV.ton('gunes');
const KRAL = KO.giy('gubi', [['tac', {}]]);
const saray = (t, k = 0) => KR.saray(0, YB, t, { karanlik: k });
const cift = (t, k = 0) => saray(t, k) + KR.ev(YB, T) + KR.bolucu(YB);
const etk = () => cip('1000 YIL ÖNCE', 190, 940, '#3A2A1A', '#F2CE7A', 24) + cip('BUGÜN', 950, 1060, '#2E9AD8', '#FFFFFF', 24);
const hizmet = (x, y, boy, i, t) => KS.karakter(Object.assign({ x, y, boy, t, ifade: 'gulumse' }, KS.donem(1000, i)));
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/oc.js"></script><script src="../ortak/kr.js"></script>
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
# 01 — taht salonu: kral, hizmetkârlar, altın
S[1] = r"""
window.renderAt = t => {
  let o = KR.saray(0, 1920, t) + KR.taht(540, 1500, 1.4) + KR.sandik(190, 1640, 1.3) + KR.sandik(890, 1650, 1.2);
  o += hizmet(150, 1830, 420, 0, t) + hizmet(930, 1830, 420, 1, t);
  o += gubi(t, { x: 540, y: 1080, boy: 240, bakHedef: 'kamera', ust: KRAL });
  const c = pop(t, 3.8); if (c > 0) o += grp(cip('SARAY · HİZMETKÂR · ALTIN', 0, 0, '#F2B82A', '#3A2A1A', 30), 540, 420, c);
  $('dinamik').innerHTML = o;
};"""
# 02 — bölünmüş ekran açılır: kral ↔ bugünkü sıradan insan
S[2] = r"""
window.renderAt = t => {
  const a = FX.E.expo(A(t, .2, .9)), yb = 1920 - (1920 - YB) * a;
  let o = KR.saray(0, yb, t) + KR.ev(yb, T) + KR.bolucu(yb);
  o += gubi(t, { x: 540, y: Math.min(700, yb - 300), boy: 220, bakHedef: [540, 1600], ust: KRAL });
  if (a > .3) o += gufi(t, { x: 540, y: 1760 + (1 - a) * 900, boy: 260, bakHedef: [540, 700] });
  if (a > .95) o += etk();
  const c = pop(t, 3.3); if (c > 0) o += grp(cip('NELERİ KISKANIRDI?', 0, 0, TAR, '#FFFFFF', 34), 540, 420, c);
  $('dinamik').innerHTML = o;
};"""
# 03 — ilaç: kral parmağını keser → DETAY antibiyotik (sonraki sahneye kesme)
S[3] = r"""
window.renderAt = t => {
  let o = cift(t) + etk();
  o += gubi(t, { x: 540, y: 640, boy: 230, bakHedef: [640, 780], ust: KRAL });
  if (t > 1.5) { const d = A(t, 1.5, 2.2); o += `<ellipse cx="660" cy="${760 + 60 * d}" rx="16" ry="22" fill="#E8323C" opacity="${1 - A(t, 3.5, 4.2)}"/>` + grp(cip('KÜÇÜK BİR YARA', 0, 0, '#8E1B2F', '#FFFFFF', 28), 540, 380, pop(t, 1.6)); }
  const il = pop(t, 2.2); if (il > 0) o += grp(KR.ilac(0, 0, 1) + `<rect x="-160" y="-230" width="80" height="30" rx="14" fill="#F2C6A0" transform="rotate(-20)"/>`, 820, 1640, il);
  o += gufi(t, { x: 320, y: 1760, boy: 250, bakHedef: [820, 1560] });
  o += DP.sar(t, 5.0, 99, d => KRD.antibiyotik(d));
  $('dinamik').innerHTML = o;
};"""
# 04 — diş: bandajlı kral, kerpeten vs bugün uyuşturma
S[4] = r"""
window.renderAt = t => {
  let o = cift(t) + etk();
  o += gubi(t, { x: 540, y: 620, boy: 240, bakHedef: [760, 560], ust: KO.giy('gubi', [['disBandaj', {}], ['tac', {}]]) });
  const k = FX.E.expo(A(t, 1.2, 1.8)); o += KR.kerpeten(1150 - 450 * k, 560 + Math.sin(t * 20) * 6 * k, 1.1, -70);
  const c = pop(t, 2.3); if (c > 0) o += `<g opacity="${c}">` + grp(cip('UYUŞTURMA', 0, 0, '#FFFDF6', '#8E1B2F', 28), 300, 380, c) + `<path d="M170 380 L430 380" stroke="#E8323C" stroke-width="8"/></g>`;
  const b = pop(t, 2.6); if (b > 0) o += grp(cip('DİŞÇİ + UYUŞTURMA ✓', 0, 0, '#2E9AD8', '#FFFFFF', 28), 700, 1560, b);
  o += gufi(t, { x: 260, y: 1770, boy: 250, bakHedef: 'kamera' });
  o += FX.gecis(t, { orta: 0, renk: '#2E9AD8', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 05 — gözlük: kral kısık gözle, Gufi gözlüklü
S[5] = r"""
window.renderAt = t => {
  let o = cift(t) + etk() + KR.kitap(540, 800, 1.0) + KR.kitap(760, 1580, .9);
  o += gubi(t, { x: 540, y: 560, boy: 220, duygu: 'kararli', bakHedef: [540, 800], ust: KRAL });
  const g = FX.yayTip(t - 1.6, 'oyuncu');
  o += gufi(t, { x: 380, y: 1770, boy: 260, bakHedef: [760, 1580], ust: g > .3 ? KO.giy('gufi', ['gozluk']) : '' });
  const c = pop(t, 1.6); if (c > 0) o += grp(cip('GÖZLÜK: ~1286', 0, 0, '#1B1640', '#FFE45C', 30), 540, 380, c);
  $('dinamik').innerHTML = o;
};"""
# 06 — karanlık/soğuk saray vs düğme + sıcak duş (DETAY: ışık düğmesi, sonra geniş)
S[6] = r"""
window.renderAt = t => {
  const ac = t > 5.9;
  let o = saray(t, 1) + KR.ev(YB, T) + (ac ? '' : `<rect x="0" y="${YB}" width="1080" height="${1920 - YB}" fill="#0A0A20" opacity=".6"/>`) + KR.bolucu(YB) + etk();
  o += KR.mum(300, 860, 1.0, t) + gubi(t, { x: 560, y: 600, boy: 220, bakHedef: [300, 700], ust: KRAL }) + KR.nefes(640, 580, t) + KR.nefes(640, 580, t + .4);
  [[.5, 'KARANLIK', 420], [1.6, 'SOĞUK', 520], [3.3, 'MUM + ODUN = PAHALI', 620]].forEach(([t0, s, y]) => { const p = pop(t, t0); if (p > 0) o += grp(cip(s, 0, 0, '#1B1640', '#F2CE7A', 26), 800, y - 60, p); });
  o += KR.ampul(540, 1200, .9, ac) + KR.dus(880, 1780, 1.1, t, ac) + KR.dugme(180, 1560, .9, ac);
  o += gufi(t, { x: 500, y: 1780, boy: 250, bakHedef: ac ? 'kamera' : [180, 1560] });
  o += DP.sar(t, 4.9, 6.6, d => KRD.dugme(d));
  $('dinamik').innerHTML = o;
};"""
# 07 — sofra: yok olan besinler → DETAY harita → karabiber lüks
S[7] = r"""
const h1 = H.ciz({ proj: 'naturalEarth', kutu: [30, 620, 1020, 640], renk: '#E9DDC2', vurgu: { 'Mexico': '#8FD65A', 'Peru': '#8FD65A', 'Brazil': '#8FD65A', 'Colombia': '#8FD65A', 'France': '#FFB44C', 'Spain': '#FFB44C', 'Italy': '#FFB44C', 'Germany': '#FFB44C' }, sinirOp: .3 });
window.renderAt = t => {
  let o = cift(t) + etk() + KR.sofraEski(540, 820, 1.0);
  o += gubi(t, { x: 540, y: 560, boy: 210, bakHedef: [540, 1560], ust: KRAL });
  [['domates', .2], ['patates', 1.1], ['misir', 1.8], ['cikolata', 2.6], ['kahve', 3.7]].forEach(([ad, t0], i) => { const p = FX.yayTip(t - t0, 'oyuncu'); if (p <= 0) return; const x = 300 + i * 160, y = 1560; o += `<circle cx="${x}" cy="${y}" r="${70 * Math.min(1, p)}" fill="#FFFDF6"/>` + grp(KR.yiy(ad, 0, 0, 1), x, y, p); });
  o += gufi(t, { x: 140, y: 1780, boy: 220, bakHedef: [540, 1560] });
  const bb = pop(t, 7.6); if (bb > 0) o += grp(OC.biber(0, 0, .8) + OC.sikke(90, -40, 26) + OC.sikke(110, -76, 26), 860, 820, bb) + grp(cip('ÇOK PAHALI', 0, 0, '#8E1B2F', '#FFFFFF', 26), 860, 900, bb);
  const cc = pop(t, 8.5); if (cc > 0) o += grp(cip('BUGÜN HER MARKETTE', 0, 0, '#3FA35A', '#FFFFFF', 26), 700, 1720, cc);
  o += DP.sar(t, 4.9, 7.5, d => KRD.harita(d, h1));
  $('dinamik').innerHTML = o;
};"""
# 08 — atlı ulak (haftalar) vs görüntülü konuşma
S[8] = r"""
window.renderAt = t => {
  let o = cift(t) + etk();
  const ax = -300 + 1700 * A(t, .2, 4.0); o += KR.atli(ax, 900, .9, t);
  const g = pop(t, .6); if (g > 0) o += grp(`<rect x="-150" y="-60" width="300" height="120" rx="24" fill="#FFFDF6"/>` + txt(FX.sayac(t, .6, 3.6, 1, 21) + ' GÜN', 0, 20, 56, '#8E1B2F'), 540, 380, g);
  o += gubi(t, { x: 860, y: 560, boy: 190, bakHedef: [ax, 800], ust: KRAL });
  const tl = FX.yayTip(t - 4.2, 'normal'); if (tl > 0) o += grp(KR.telefon(0, 0, 1.0, t, `<rect x="-96" y="-200" width="192" height="400" fill="#8FC8E8"/>` + KS.karakter({ x: 0, y: 200, boy: 300, t, ifade: 'gulumse', ust: '#8A6FE0', sac: { tip: 'uzun', renk: '#3A2A20' } }) + `<rect x="30" y="100" width="60" height="90" rx="10" fill="#E8505B"/>`), 800, 1640, tl);
  const c = pop(t, 5.0); if (c > 0) o += grp(cip('ANINDA', 0, 0, '#2E9AD8', '#FFFFFF', 30), 800, 1440, c);
  o += gufi(t, { x: 360, y: 1770, boy: 250, bakHedef: [800, 1640] });
  $('dinamik').innerHTML = o;
};"""
# 09 — müzisyen çağırmak vs cepte milyon şarkı
S[9] = r"""
window.renderAt = t => {
  let o = cift(t) + etk() + KR.lavtaci(300, 980, 520, t);
  o += gubi(t, { x: 760, y: 640, boy: 210, bakHedef: [300, 700], ust: KRAL });
  const c = pop(t, 3.3); if (c > 0) o += grp(cip('MİLYONLARCA ŞARKI', 0, 0, '#8A6FE0', '#FFFFFF', 28), 720, 1560, c);
  for (let i = 0; i < 4; i++) { const q = ((t * .9 + i / 4) % 1); if (t > 3.2) o += txt(['♪', '♫'][i % 2], 300 + i * 60, 1700 - q * 260, 70, ['#E8505B', '#8A6FE0', '#2E9AD8', '#FFB44C'][i], 900, `opacity="${1 - q}"`); }
  o += gufi(t, { x: 380, y: 1770, boy: 260, bakHedef: 'kamera', ust: KO.giy('gufi', ['kulaklik']) });
  $('dinamik').innerHTML = o;
};"""
# 10 — kral tacını uzatır; Gufi tacı takar
S[10] = r"""
window.renderAt = t => {
  const bl = A(t, .2, 1.0);
  let o = KR.ev(0, T) + `<g opacity="${1 - bl}">` + saray(t) + KR.bolucu(YB) + '</g>' + CV.oda(T, { zeminY: 1500, dolap: false, pencere: [700, 300, 280, 360] }).replace('<rect width="1080" height="1920"', '<rect width="0" height="0"');
  const tacGit = t > 3.5, tacVar = t > 4.5;
  o += gubi(t, { yol: [[.8, 540, 500, 220], [2.4, 780, 1000, 220]], x: 780, y: 1000, boy: 220, bakHedef: [380, 1500], ust: tacGit ? '' : KRAL });
  if (tacGit && !tacVar) { const q = FX.E.inOutQuart(A(t, 3.5, 4.5)), x = 780 + (380 - 780) * q, y = 870 + (1440 - 870) * q - Math.sin(q * Math.PI) * 200; o += `<g transform="translate(${x} ${y})">` + KO.tek('gubi', 'tac', 0, 130, 220) + '</g>'; }
  o += gufi(t, { x: 380, y: 1770, boy: 280, bakHedef: tacVar ? 'kamera' : [780, 1000], ust: tacVar ? KO.giy('gufi', [['tac', {}]]) : '' });
  const it = pop(t, 3.4); if (it > 0) o += grp(KR.telefon(0, 0, .5, t) , 700, 1620, it) + grp(KR.ilac(0, 0, .6), 880, 1700, it);
  const c = pop(t, 3.4); if (c > 0) o += grp(cip('EN ZENGİN KRAL BİLE KISKANIRDI', 0, 0, TAR, '#FFFFFF', 28), 540, 420, c);
  $('dinamik').innerHTML = o;
};"""
# 11 — kapanış: taçlı Gufi kameraya
S[11] = r"""
$('zemin').innerHTML = KR.ev(0, T) + CV.cerceveResim(120, 420, 220, 160, T);
window.renderAt = t => {
  const k = M.yakinlas(t, .2, 9); M.bulanik(k * .8);
  const arka = gubi(t, { x: 820, y: 900, boy: 200, bakHedef: [440, 1500] }) + KR.telefon(760, 1500, .45, t) + KR.ilac(300, 1500, .5);
  let on = gufi(t, { x: 440, y: 1700 + 120 * k, boy: 270 + 170 * k, bakHedef: 'kamera', ust: KO.giy('gufi', [['tac', {}]]) });
  const c = pop(t, .5); if (c > 0) on += grp(cip('SANDIĞIMIZDAN ŞANSLIYIZ', 0, 0, TAR, '#FFFFFF', 34), 540, 420, c);
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
