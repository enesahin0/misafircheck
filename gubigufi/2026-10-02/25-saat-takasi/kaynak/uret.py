"""#25 Türkiye saatleri — sahne HTML'leri + plan.json + tepkiler.json. Merak sırası anlatısı."""
import json

SB = [0, 7.0, 11.7, 21.3, 30.9, 39.5, 43.8, 55.7, 62.5, 66.5, 68.7]
ALT = {}
TEP = {
    1: [('gufi', 4.0, 'sasir')],
    2: [('gubi', 1.3, 'dusun'), ('gubi', 3.3, 'aha')],
    3: [('gubi', 1.4, 'isaret')],
    4: [('gubi', 8.5, 'sasir')],
    5: [('gufi', 3.2, 'dusun'), ('gubi', 6.4, 'kararli')],
    6: [('gufi', 2.0, 'sasir')],
    7: [('gubi', 9.7, 'mutlu')],
    8: [('gufi', 3.2, 'sasir'), ('gubi', 4.5, 'dusun')],
    9: [('gubi', .6, 'selam'), ('gufi', .9, 'selam')],
}
ORTAK = r"""
const R = PR.R;
const USTA = KO.giy('gubi', [['papyon', { renk: '#C8232F' }], 'gozluk']);
const OKULLU = KO.giy('gufi', [['kasket', { renk: '#5A6A7A', siper: '#3A4A5A' }]]);
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/ss.js"></script>
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
# 01 — kanca: İstanbul'da ocak sabahı 08:29, güneş yeni doğuyor, çocuklar karanlıkta yola çıkar
S[1] = r"""
const kid = (x, y, boy, i, t) => { const s = boy / 700; return R(x - 120 * s, y - 470 * s, 240 * s, 250 * s, 40 * s, ['#C8232F', '#2E4A9A', '#2E8A4A'][i % 3]) + KS.karakter({ x, y, boy, t, adim: t * 5 + i, bak: [.5, 0], ust: ['#E8A040', '#6A8AC8', '#E8505B'][i % 3], alt: '#2A3A5A', sac: { tip: i % 2 ? 'atkuyrugu' : 'kakul', renk: ['#2A1E14', '#5A3A20'][i % 2] }, ten: ['#F2C6A0', '#E8B08A'][i % 2], ayakkabi: '#FFFFFF' }); };
window.renderAt = t => {
  const k = A(t, 0, 7);
  let o = SS.istanbul(t, .1 + .06 * k, [760, 1240 - 70 * k]);
  const c = pop(t, .2); if (c > 0) o += grp(SS.cipO('OCAK · İSTANBUL', 0, 0, '#1B1640', '#FFE45C', 34), 540, 340, c);
  const d = pop(t, .5); if (d > 0) o += grp(R(-250, -90, 500, 180, 36, '#0B1433') + `<rect x="-250" y="-90" width="500" height="180" rx="36" fill="none" stroke="#FFE45C" stroke-width="5"/>` + SS.mono('08:29', 0, 40, 130, '#FFE45C', 'text-anchor="middle"'), 540, 560, d);
  const g = A(t, 3.9, 4.6); if (g > 0) o += `<g opacity="${g}">` + kid(150 + t * 34, 1840, 360, 0, t) + kid(330 + t * 34, 1850, 340, 1, t) + kid(500 + t * 34, 1846, 350, 2, t) + '</g>';
  o += gufi(t, { x: 920, y: 1820, boy: 240, duygu: 'merak', bakHedef: [700, 1200], ust: OKULLU });
  $('dinamik').innerHTML = o;
};"""
# 02 — güneş bu kadar geç doğmak zorunda değildi: 07:29 (soluk) ↔ 08:29 (gerçek); bir karar
S[2] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#10183A"/>`;
  const X = (hh, mm) => 110 + ((hh + mm / 60) - 6.5) * 287;
  o += R(110, 1000, 860, 6, 3, '#9FB4D8');
  for (let q = 7; q <= 9; q++) o += R(X(q, 0) - 2, 988, 4, 28, 2, '#9FB4D8') + SS.mono(String(q).padStart(2, '0') + ':00', X(q, 0) - 44, 1060, 32, '#9FB4D8');
  const a = pop(t, .3); if (a > 0) o += grp(`<circle r="84" fill="none" stroke="#FFE27A" stroke-width="9" stroke-dasharray="16 12" opacity=".75"/>` + SS.yaz('☀', 0, 24, 78, '#FFE27A', 900, 'middle', 'opacity=".55"'), X(7, 29), 740, a) + grp(SS.cipO('OLABİLİRDİ · 07:29', 0, 0, '#2A3A6A', '#9FC8FF', 28), X(7, 29) - 20, 590, a);
  const b = pop(t, 1.3); if (b > 0) o += grp(`<circle r="104" fill="#FFB020"/><circle r="150" fill="#FFB020" opacity=".22"/>` + SS.yaz('☀', 0, 30, 94, '#FFFFFF'), X(8, 29), 740, b) + grp(SS.cipO('GERÇEK · 08:29', 0, 0, '#B8782A', '#FFFFFF', 30), X(8, 29) + 20, 470, b);
  const k = A(t, 2.0, 2.8); if (k > 0) { const x1 = X(7, 29), x2 = X(8, 29); o += `<path d="M${x1} 890 L${x1} 920 L${x1 + (x2 - x1) * k} 920 L${x1 + (x2 - x1) * k} 890" stroke="#FFFFFF" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
  const h1 = pop(t, 2.3); if (h1 > 0) o += grp(SS.cipO('1 SAAT', 0, 0, '#B8232F', '#FFFFFF', 38), (X(7, 29) + X(8, 29)) / 2, 1130, h1);
  const c = pop(t, 3.2); if (c > 0) o += grp(SS.cipO('BİR KARAR', 0, 0, '#1B1640', '#FFE45C', 44), 540, 1250, c);
  o += gubi(t, { x: 200, y: 1740, boy: 230, duygu: 'merak', bakHedef: [640, 740], ust: USTA });
  $('dinamik').innerHTML = o;
};"""
# 03 — 2016: mart ileri → DETAY Resmî Gazete: kalıcı
S[3] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#16203A"/>`;
  const c = pop(t, .1); if (c > 0) o += grp(SS.cipO('2016', 0, 0, '#1B1640', '#FFE45C', 44), 540, 360, c);
  const k = pop(t, 1.3); if (k > 0) o += SS.takvim(540, 820, 1.35 * k, '26', 'MART', '2016');
  const s = pop(t, 2.3); if (s > 0) o += grp(SS.cipO('+1 SAAT', 0, 0, '#B8232F', '#FFFFFF', 44), 540, 1230, s);
  o += gubi(t, { x: 200, y: 1740, boy: 230, duygu: 'merak', bakHedef: [540, 820], ust: USTA });
  o += DP.sar(t, 4.3, 9.6, d => SSD.gazete(d));
  $('dinamik').innerHTML = o;
};"""
# 04 — gerekçe: enerji tasarrufu + akşam aydınlık; ama bir sorun var
S[4] = r"""
window.renderAt = t => {
  const ev = FX.E.inOutQuart(A(t, 4.9, 5.6));
  let o = ev < .5 ? `<rect width="1080" height="1920" fill="#16203A"/>` : SS.istanbul(t, .5, [260, 1080], { lamba: true });
  if (ev < 1) o = `<g opacity="${1 - ev * .0}">` + o + '</g>';
  if (ev <= 0) o += SS.ampul(540, 800, 2.1, FX.E.expo(A(t, 1.0, 1.8)));
  else o += `<g opacity="${1 - ev}">` + SS.ampul(540, 800, 2.1, 1) + '</g>';
  const a = pop(t, .15); if (a > 0) o += grp(SS.cipO('GEREKÇE', 0, 0, '#1B1640', '#FFE45C', 34), 540, 340, a);
  const b = pop(t, 1.0); if (b > 0 && ev < 1) o += grp(SS.cipO('ENERJİ TASARRUFU', 0, 0, '#2E8A4A', '#FFFFFF', 34), 540, 440, b);
  const c = pop(t, 3.0); if (c > 0 && ev < 1) o += grp(SS.cipO('GÜN IŞIĞI', 0, 0, '#B8782A', '#FFFFFF', 34), 540, 540, c);
  const d = pop(t, 5.1); if (d > 0) o += grp(SS.cipO('AKŞAM +1 SAAT AYDINLIK', 0, 0, '#B8782A', '#FFFFFF', 36), 540, 440, d);
  const e = pop(t, 8.4); if (e > 0) o += grp(SS.cipO('AMA BİR SORUN VAR', 0, 0, '#B8232F', '#FFFFFF', 42), 540, 540, e);
  o += gubi(t, { x: 190, y: 1740, boy: 230, duygu: t > 8.4 ? 'saskin' : 'merak', bakHedef: [540, 800], ust: USTA });
  $('dinamik').innerHTML = o;
};"""
# 05 — 45° boylam: harita; DETAY doğu ucu; bütün ülke çizginin batısında
S[5] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#16203A"/>`;
  const k = SS.harita(t, A(t, .6, 1.6), { kutu: [50, 700, 900, 420] });
  const west = A(t, 6.3, 7.3); if (west > 0) o += `<rect x="0" y="560" width="${k.x45}" height="700" fill="#4A8AD8" opacity="${.22 * west}"/>`;
  o += k.svg;
  const a = pop(t, .2); if (a > 0) o += grp(SS.cipO('SAATİMİZ: 45° DOĞU', 0, 0, '#1B1640', '#FFE45C', 34), 540, 360, a);
  const b = pop(t, 6.4); if (b > 0) o += grp(SS.cipO('BÜTÜN ÜLKE ÇİZGİNİN BATISINDA', 0, 0, '#B8232F', '#FFFFFF', 30), 540, 1180, b);
  o += gufi(t, { x: 200, y: 1790, boy: 240, duygu: 'merak', bakHedef: [600, 900], ust: OKULLU }) + gubi(t, { x: 880, y: 1720, boy: 200, duygu: 'merak', bakHedef: [600, 900], ust: USTA });
  o += DP.sar(t, 3.0, 6.1, d => SSD.dogu(d));
  $('dinamik').innerHTML = o;
};"""
# 06 — İstanbul'da güneş tam tepede, saat 13 → DETAY kadran
S[6] = r"""
window.renderAt = t => {
  let o = SS.istanbul(t, 1, [540, 330], { lamba: false });
  const a = pop(t, .2); if (a > 0) o += grp(SS.cipO('İSTANBUL · ÖĞLE', 0, 0, '#1B1640', '#FFE45C', 34), 540, 520, a);
  const b = pop(t, 1.0); if (b > 0) o += grp(R(-210, -90, 420, 180, 36, '#0B1433') + SS.mono('13:00', 0, 40, 120, '#FFE45C', 'text-anchor="middle"'), 540, 760, b);
  o += gufi(t, { x: 200, y: 1790, boy: 240, duygu: 'merak', bakHedef: [540, 400], ust: OKULLU });
  o += DP.sar(t, 1.9, 4.3, d => SSD.ogle(d));
  $('dinamik').innerHTML = o;
};"""
# 07 — takas: gün çubuğu (07:29–16:50) ↔ (08:29–17:50)
S[7] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#0E1626"/>`;
  o += SS.gunCubugu(A(t, .4, 4.6), A(t, 6.9, 9.4));
  const a = pop(t, .2); if (a > 0) o += grp(SS.cipO('OCAK · İSTANBUL', 0, 0, '#1B1640', '#FFE45C', 34), 540, 360, a);
  const b = pop(t, 6.9); if (b > 0) o += grp(SS.cipO('TAKAS', 0, 0, '#B8232F', '#FFFFFF', 44), 540, 460, b);
  const x = FX.E.outExpo(A(t, 9.6, 10.6)); if (x > 0) {
    const X = (hh, mm) => 110 + ((hh + mm / 60) - 6) * 61.4;
    o += `<g opacity="${x}"><path d="M${X(7, 29)} 740 L${X(8, 29)} 900 M${X(16, 50)} 740 L${X(17, 50)} 900" stroke="#FFE45C" stroke-width="7" stroke-dasharray="18 12"/>` + SS.cipO('SABAH → AKŞAM', 540, 820, '#1B1640', '#FFE45C', 28).replace('<rect', `<rect transform="translate(0 0)"`) + '</g>'; }
  o += gubi(t, { x: 200, y: 1740, boy: 230, duygu: t > 9.6 ? 'mutlu' : 'merak', bakHedef: [540, 800], ust: USTA });
  $('dinamik').innerHTML = o;
};"""
# 08 — Avrupa saati geri alınca: Almanya 03:00 → 02:00; Türkiye 04:00; fark 1 → 2 saat
S[8] = r"""
window.renderAt = t => {
  const k = FX.E.inOutQuart(A(t, .3, 2.2));
  let o = `<rect width="1080" height="1920" fill="#10183A"/>`;
  o += SS.kadran(290, 820, 200, 3 - k, 0, { cerceve: '#4A8AD8', ad: 'ALMANYA' }) + SS.kadran(790, 820, 200, 4, 0, { cerceve: '#E8323C', ad: 'TÜRKİYE' });
  const a = pop(t, .2); if (a > 0) o += grp(SS.cipO('HER EKİM', 0, 0, '#1B1640', '#FFE45C', 36), 540, 360, a);
  const f = pop(t, 3.1), g = A(t, 4.4, 5.2);
  if (f > 0) o += grp(SS.cipO(g < .5 ? 'FARK: 1 SAAT' : 'FARK: 2 SAAT', 0, 0, g < .5 ? '#2A3A6A' : '#B8232F', '#FFFFFF', 46), 540, 1260 - 40, f);
  o += gubi(t, { x: 190, y: 1740, boy: 220, duygu: 'merak', bakHedef: [540, 820], ust: USTA });
  o += gufi(t, { x: 900, y: 1800, boy: 230, duygu: t > 3.1 ? 'saskin' : 'merak', bakHedef: [540, 820], ust: OKULLU });
  $('dinamik').innerHTML = o;
};"""
# 09 — takip kartı
S[9] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#4A8AD8" opacity=".12"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .4);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#4A8AD8" stroke-width="6"/>` + SS.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#4A8AD8') + SS.yaz('+ TAKİP ET', 0, 98, 46, '#0B1433'), 540, 760, p);
  o += gubi(t, { x: 330, y: 1300, boy: 260, duygu: 'mutlu', bakHedef: 'kamera', ust: USTA });
  o += gufi(t, { x: 760, y: 1360, boy: 270, duygu: 'mutlu', bakHedef: 'kamera', ust: OKULLU });
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
