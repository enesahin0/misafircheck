"""#24 Fırlayan kitapçık (2001 krizi) — sahne HTML'leri + plan.json + tepkiler.json. Merak sırası anlatısı."""
import json

SB = [0, 9.6, 14.6, 21.7, 27.2, 37.7, 42.8, 51.25, 60.0, 68.1, 72.6, 82.5, 86.5, 88.7]
ALT = {}
TEP = {
    1: [('gubi', 6.8, 'sasir')],
    2: [('gubi', 3.6, 'dusun')],
    5: [('gufi', 1.0, 'sasir'), ('gubi', 7.6, 'dusun')],
    6: [('gubi', 3.4, 'korku')],
    7: [('gubi', 5.6, 'sasir')],
    8: [('gubi', 1.0, 'dusun'), ('gufi', 3.0, 'sasir')],
    9: [('gufi', 6.9, 'korku')],
    10: [('gufi', 2.6, 'uzgun')],
    11: [('gubi', 6.9, 'korku'), ('gufi', 7.9, 'dusun')],
    12: [('gubi', .6, 'selam'), ('gufi', .9, 'selam')],
}
ORTAK = r"""
const R = PR.R;
const BANKACI = KO.giy('gubi', [['papyon', { renk: '#2E4A9A' }], 'gozluk']);
const VATANDAS = KO.giy('gufi', [['kasket', { renk: '#5A6A7A', siper: '#3A4A5A' }]]);
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/kk.js"></script>
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
# 01 — kanca: havada dönen kitapçık + sayaç %7500
S[1] = r"""
$('zemin').innerHTML = `<g style="filter:blur(6px)">${KK.salon(0, { gerilim: 0 })}</g><rect width="1080" height="1920" fill="#05060A" opacity=".45"/>`;
window.renderAt = t => {
  let o = '';
  const sp = t * 190, ky = 700 + Math.sin(t * 2.2) * 40;
  o += `<ellipse cx="540" cy="${ky + 150}" rx="${120 - 12 * Math.sin(t * 2.2)}" ry="22" fill="#000" opacity=".3"/>`;
  for (let i = 4; i >= 1; i--) o += `<g opacity="${.1 / i}">` + KK.kitapcik(540 - i * 14, ky, 2.7, sp - i * 22) + '</g>';
  o += KK.kitapcik(540, ky, 2.7, sp);
  const c = pop(t, 3.6); if (c > 0) o += grp(KK.cipO('2 GÜN SONRA', 0, 0, '#B8232F', '#FFFFFF', 34), 540, 400, c);
  const n = A(t, 5.4, 8.2), sy = Math.round(7500 * FX.E.expo(n));
  if (n > 0) o += `<g opacity="${A(t, 5.4, 5.8)}">` + KK.yaz('%' + sy, 540, 1130, 190, n >= 1 ? '#FF5A5A' : '#FFFFFF') + '</g>';
  o += gubi(t, { x: 190, y: 1730, boy: 230, duygu: 'merak', bakHedef: [540, 700], ust: BANKACI });
  $('dinamik').innerHTML = o;
};"""
# 02 — tek bir gecelik borç: ay gökyüzü, banka
S[2] = r"""
window.renderAt = t => {
  const p = A(t, 0, 5);
  let o = KK.gece(t, p) + KK.banka(720, 1560, 1.15, 1);
  const a = pop(t, .2); if (a > 0) o += grp(KK.yaz('%7500', 0, 0, 150, '#FFFFFF'), 540, 760, a);
  const y = pop(t, 1.0); if (y > 0) o += grp(KK.cipO('YILLIK BAZDA', 0, 0, '#1E2A5A', '#9FC8FF', 28), 540, 880, y);
  const g = pop(t, 3.4); if (g > 0) o += grp(KK.cipO('TEK BİR GECE', 0, 0, '#B8232F', '#FFFFFF', 38), 540, 380, g);
  o += gubi(t, { x: 200, y: 1740, boy: 230, duygu: 'merak', bakHedef: [720, 1300], ust: BANKACI });
  $('dinamik').innerHTML = o;
};"""
# 03 — 19 Şubat 2001, MGK: salon siluetleri; kapılar kapanır
S[3] = r"""
window.renderAt = t => {
  let o = KK.salon(t + 14.6, { gerilim: 0 });
  const c = pop(t, .4); if (c > 0) o += grp(KK.cipO('19 ŞUBAT 2001 · ANKARA', 0, 0, '#1B1640', '#FFE45C', 34), 540, 400, c);
  const k = pop(t, 2.6); if (k > 0) o += grp(KK.cipO('MİLLİ GÜVENLİK KURULU', 0, 0, '#F4EEE2', '#3A2A20', 30), 540, 490, k);
  o += KK.kapilar(FX.E.inOutQuart(A(t, 5.9, 7.0)));
  $('dinamik').innerHTML = o;
};"""
# 04 — tartışma büyür; kitapçık havada → DETAY: masaya düşer
S[4] = r"""
window.renderAt = t => {
  let o = KK.salon(t + 21.7, { gerilim: A(t, .3, 3.0) });
  const u = A(t, 3.1, 4.1), kx = 1000 - 500 * u, ky = 1050 - 260 * Math.sin(u * Math.PI);
  if (u > 0 && u < 1) o += KK.kitapcik(kx, ky, 1.1, u * 560);
  const c = pop(t, .3); if (c > 0) o += grp(KK.cipO('BİR TARTIŞMA BÜYÜYOR', 0, 0, '#B8232F', '#FFFFFF', 32), 540, 400, c);
  o += DP.sar(t, 3.9, 5.5, d => KKD.dusus(d));
  $('dinamik').innerHTML = o;
};"""
# 05 — kameralara tek cümle (TV) → DETAY manşet → terazi: söz kitapçıktan ağır
S[5] = r"""
const TO = CV.ton('seftali');
window.renderAt = t => {
  const T = t + 27.2;
  let o;
  if (t < 7.35) {
    o = CV.oda(TO, { zeminY: 1250, pencere: [60, 420, 160, 240] }) + `<g opacity=".92" transform="translate(0 110)">${KK.tv(T)}</g>`;
    const c = pop(t, .3); if (c > 0) o += grp(KK.cipO('KAMERALARA TEK CÜMLE', 0, 0, '#1B1640', '#FFE45C', 32), 540, 390, c);
    o += gufi(t, { x: 230, y: 1800, boy: 250, duygu: 'merak', bakHedef: [540, 700], ust: VATANDAS });
    o += DP.sar(t, 4.8, 7.35, d => KKD.manset(d));
  } else {
    const k = A(t, 7.4, 8.4);
    o = `<rect width="1080" height="1920" fill="#14182A"/>` + KK.terazi(T, k);
    const c = pop(t, 7.5); if (c > 0) o += grp(KK.cipO('SÖZ > KİTAPÇIK', 0, 0, '#B8232F', '#FFFFFF', 34), 540, 400, c);
    o += gubi(t, { x: 880, y: 1720, boy: 220, duygu: 'merak', bakHedef: [540, 900], ust: BANKACI });
  }
  $('dinamik').innerHTML = o;
};"""
# 06 — borsa −%14,6; milyarlarca dolar çıktı
S[6] = r"""
window.renderAt = t => {
  const b = FX.E.inOutQuart(A(t, .5, 2.8)), gec = FX.E.inOutQuart(A(t, 3.0, 3.8));
  let o = `<rect width="1080" height="1920" fill="#0E1626"/>`;
  o += `<g transform="translate(540 ${620 - 100 * gec}) scale(${1 - .38 * gec}) translate(-540 -620)">` + KK.borsa(t, b) + '</g>';
  if (t > 3.0) o += `<g opacity="${gec}">` + KK.cikis(t, A(t, 3.2, 5.0)) + '</g>';
  const c = pop(t, .3); if (c > 0) o += grp(KK.cipO('AYNI GÜN', 0, 0, '#1B1640', '#FFE45C', 34), 540, 300, c);
  const d = pop(t, 3.2); if (d > 0) o += grp(KK.cipO('~7,6 MİLYAR $ ÇIKTI', 0, 0, '#B8232F', '#FFFFFF', 34), 540, 760, d);
  o += gubi(t, { x: 880, y: 1730, boy: 220, duygu: 'merak', bakHedef: [540, 700], ust: BANKACI });
  $('dinamik').innerHTML = o;
};"""
# 07 — gecelik faiz 760 → 7500
S[7] = r"""
window.renderAt = t => {
  const a = FX.E.outExpo(A(t, 2.6, 3.6)), b = FX.E.outExpo(A(t, 5.4, 6.9));
  let o = `<rect width="1080" height="1920" fill="#0E1626"/>` + KK.faiz(t, a, b);
  const c = pop(t, .3); if (c > 0) o += grp(KK.cipO('GECELİK FAİZ', 0, 0, '#1B1640', '#FFE45C', 36), 540, 380, c);
  const y = pop(t, .9); if (y > 0) o += grp(KK.cipO('YILLIK BAZDA', 0, 0, '#1E2A5A', '#9FC8FF', 26), 540, 480, y);
  if (t > 7.7 && t < 8.1) o += FX.flas(t, 7.8, .3, .12);
  o += gubi(t, { x: 190, y: 1740, boy: 220, duygu: t > 5.4 ? 'saskin' : 'merak', bakHedef: [540, 900], ust: BANKACI });
  $('dinamik').innerHTML = o;
};"""
# 08 — 100 → 120: akşam/sabah → DETAY para yığınları
S[8] = r"""
window.renderAt = t => {
  const gunduz = t > 2.5;
  let o = gunduz ? `<defs><linearGradient id="gk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7AB8E8"/><stop offset="1" stop-color="#F4E6C8"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#gk)"/><circle cx="800" cy="520" r="120" fill="#FFE45C"/><circle cx="800" cy="520" r="190" fill="#FFE45C" opacity=".25"/>` : KK.gece(t, .55);
  o += KK.banka(540, 1520, 1.0, gunduz ? 0 : 1);
  const a = pop(t, .5); if (a > 0 && !gunduz) o += grp(KK.cipO('AKŞAM · 100 TL', 0, 0, '#1E2A5A', '#FFE45C', 34), 540, 400, a);
  const b = pop(t, 2.6); if (b > 0) o += grp(KK.cipO('SABAH · ~120 TL', 0, 0, '#B8782A', '#FFFFFF', 34), 540, 400, b);
  const c = pop(t, 6.5); if (c > 0) o += grp(KK.cipO('TEK GECEDE', 0, 0, '#B8232F', '#FFFFFF', 38), 540, 560, c);
  o += gubi(t, { x: 190, y: 1740, boy: 220, duygu: 'merak', bakHedef: [540, 1300], ust: BANKACI });
  o += gufi(t, { x: 890, y: 1790, boy: 230, duygu: gunduz ? 'saskin' : 'merak', bakHedef: [540, 1300], ust: VATANDAS });
  o += DP.sar(t, 3.3, 6.2, d => KKD.yiginlar(d));
  $('dinamik').innerHTML = o;
};"""
# 09 — üç gün sonra: sabit kur bırakıldı; döviz bürosu → DETAY tabela 685.000 → 940.000
S[9] = r"""
window.renderAt = t => {
  let o = KK.buro(t, 685000);
  const c = pop(t, .35); if (c > 0) o += grp(KK.cipO('3 GÜN SONRA', 0, 0, '#1B1640', '#FFE45C', 34), 540, 280, c);
  const s = pop(t, 1.45); if (s > 0) o += grp(KK.cipO('SABİT KUR BIRAKILDI', 0, 0, '#B8232F', '#FFFFFF', 32), 540, 1190, s);
  const KUY = [
    { x: 150, ust: '#3A3A44', alt: '#2A2A34', sac: { tip: 'kisa', renk: '#6A6A6A' }, biyik: '#6A6A6A', ten: '#E8B08A', kiyafet: { ceket: '#3A3A44', gomlek: '#D8D0C0', kravat: '#7E2E3A' } },
    { x: 310, ust: '#7A4A4A', alt: '#2A3A5A', sac: { tip: 'atkuyrugu', renk: '#2A1E14' }, ten: '#F2C6A0', kiyafet: { ceket: '#6A5A4A' } },
    { x: 470, ust: '#4A5A6A', alt: '#2A2A2A', sac: { tip: 'kisa', renk: '#1B1410' }, biyik: '#1B1410', ten: '#C88A60', kiyafet: { ceket: '#5A5A3A', sapka: 'kasket', sapkaRenk: '#3A3A3A' } },
    { x: 640, ust: '#5A4A6A', alt: '#3A2A20', sac: { tip: 'uzun', renk: '#5A3A20' }, ten: '#F7B8A4', kiyafet: { etek: '#3A3A5A', etekBoy: 'diz', ceket: '#4A3A5A' } }];
  KUY.forEach(k => o += KS.karakter(Object.assign({ y: 1990, boy: 600, t, bak: [.6, -.2], ifade: 'notr', ayakkabi: '#1B1410' }, k)));
  o += gufi(t, { x: 880, y: 1860, boy: 300, duygu: t > 6.9 ? 'korku' : 'merak', bakHedef: [540, 800], ust: VATANDAS });
  o += DP.sar(t, 2.6, 8.1, d => KKD.tabela(d, 685000, 940000, 4.2, 5.2));
  $('dinamik').innerHTML = o;
};"""
# 10 — maaş aynı, alım gücü ≈ %73
S[10] = r"""
window.renderAt = t => {
  const e = FX.E.inOutQuart(A(t, 2.2, 3.9)), k = 1 - .27 * e;
  let o = `<rect width="1080" height="1920" fill="#16202E"/>`;
  o += `<g transform="translate(540 650) scale(${k}) translate(-540 -650)">` + R(270, 520, 540, 280, 28, '#5AA86A') + R(290, 540, 500, 240, 18, '#7ACB8A') + KK.yaz('MAAŞ', 540, 690, 110, '#2A6A3A') + '</g>';
  const m = pop(t, .35); if (m > 0) o += grp(KK.cipO('MAAŞ AYNI', 0, 0, '#1B1640', '#FFE45C', 36), 540, 400, m);
  const w = 760, bx = 160, by = 850;
  o += R(bx, by, w, 70, 35, '#2A3A52') + R(bx, by, w * (1 - .27 * e), 70, 35, e > .98 ? '#E8323C' : '#3AC878') + KK.mono('ALIM GÜCÜ', bx, by - 22, 28, '#9FB4D8');
  o += KK.yaz(Math.round(100 - 27 * e) + '%', 540, by + 200, 120, e > .98 ? '#FF6A6A' : '#FFFFFF');
  const x = pop(t, 3.0); if (x > 0) o += grp(KK.cipO('≈ DÖRTTE BİR ERİDİ', 0, 0, '#B8232F', '#FFFFFF', 32), 540, 1150, x);
  o += gufi(t, { x: 190, y: 1790, boy: 240, duygu: t > 2.5 ? 'uzgun' : 'merak', bakHedef: [540, 800], ust: VATANDAS });
  $('dinamik').innerHTML = o;
};"""
# 11 — kitapçık değildi; belirsizlik; tek cümle
S[11] = r"""
window.renderAt = t => {
  let o = KK.sis(t) + KK.kitapcik(540, 760, 2.4, -6);
  const x = A(t, 3.0, 3.5); if (x > 0) o += `<path d="M380 560 L700 960 M700 560 L380 960" stroke="#E8323C" stroke-width="30" stroke-linecap="round" opacity="${x}"/>`;
  const a = pop(t, .35); if (a > 0 && t < 4.1) o += grp(KK.cipO('KİTAPÇIK DEĞİL', 0, 0, '#1B1640', '#FFE45C', 34), 540, 330, a);
  const b = pop(t, 4.1); if (b > 0 && t < 6.7) o += grp(KK.cipO('PİYASALARIN KORKUSU', 0, 0, '#2A2A44', '#FFFFFF', 32), 540, 390, b);
  if (t > 6.78) { const k = pop(t, 6.8); o += grp(R(-330, -92, 660, 184, 46, '#1B1640') + `<rect x="-330" y="-92" width="660" height="184" rx="46" fill="none" stroke="#E8323C" stroke-width="8"/>` + KK.yaz('BELİRSİZLİK', 0, 36, 98, '#FFFFFF'), 540, 1060, k); }
  const c = pop(t, 7.9); if (c > 0) o += grp(KK.cipO('TEK BİR CÜMLE', 0, 0, '#B8232F', '#FFFFFF', 34), 540, 1235, c);
  o += gubi(t, { x: 190, y: 1740, boy: 220, duygu: 'merak', bakHedef: [540, 800], ust: BANKACI });
  o += gufi(t, { x: 890, y: 1790, boy: 230, duygu: 'merak', bakHedef: [540, 800], ust: VATANDAS });
  $('dinamik').innerHTML = o;
};"""
# 12 — takip kartı
S[12] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#2FBF71" opacity=".12"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .4);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#2FBF71" stroke-width="6"/>` + KK.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#2FBF71') + KK.yaz('+ TAKİP ET', 0, 98, 46, '#0B1433'), 540, 760, p);
  o += gubi(t, { x: 330, y: 1300, boy: 260, duygu: 'mutlu', bakHedef: 'kamera', ust: BANKACI });
  o += gufi(t, { x: 760, y: 1360, boy: 270, duygu: 'mutlu', bakHedef: 'kamera', ust: VATANDAS });
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
