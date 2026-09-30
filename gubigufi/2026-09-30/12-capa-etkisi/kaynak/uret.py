"""#12 Çapa etkisi — sahne HTML'leri + plan.json + tepkiler.json (flat-bilim-animasyonu skill sözleşmesi)."""
import json

SB = [0, 7.2, 19.0, 24.4, 31.0, 39.5, 49.6, 54.6, 58.12, 60.32]

TEP = {
    1: [('gubi', 1.2, 'isaret'), ('gufi', 5.2, 'sasir')],
    2: [('gufi', 9.2, 'merak'), ('gufi', 10.8, 'sasir')],
    3: [('gubi', 1.0, 'isaret'), ('gufi', 2.3, 'dusun')],
    4: [('gubi', 4.7, 'isaret'), ('gufi', 5.9, 'sasir')],
    5: [('gufi', 5.3, 'kararli'), ('gufi', 7.0, 'uzgun')],
    6: [('gubi', .5, 'omuzSilk'), ('gufi', 7.8, 'gozKapa')],
    7: [('gufi', 3.1, 'sasir'), ('gubi', 3.4, 'goster')],
    8: [('gufi', .1, 'yaklas'), ('gufi', 1.6, 'isaret')],
}


HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/capa.js"></script>
<script src="../ortak/harita/d3-array.min.js"></script><script src="../ortak/harita/d3-geo.min.js"></script><script src="../ortak/harita/topojson-client.min.js"></script><script src="../ortak/harita/dunya50.js"></script><script src="../ortak/harita/ulke_tablo.js"></script><script src="../ortak/harita/turkiye10.js"></script><script src="../ortak/harita/harita.js"></script>
<script src="../ortak/logo_paths.js"></script><script src="../ortak/altyazi.js"></script>
<script>
const $ = i => document.getElementById(i), A = K.aralik, E = K.ease;
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pop = (t, a, d = .45) => back(A(t, a, a + d));
const grp = (s, x, y, k = 1, r = 0, op = 1) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})" opacity="${op}">${s}</g>`;
const olc = (s, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const txt = (s, x, y, size, renk = '#FFF3D6', w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
const cip = (s, x, y, renk, yazi = '#0B1433', fs = 38) => { const w = s.length * fs * .62 + 70; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
const gubi = (t, o) => M.canli('gubi', Object.assign({ t, tepkiler: TP.gubi }, o));
const gufi = (t, o) => M.canli('gufi', Object.assign({ t, tepkiler: TP.gufi }, o));
__JS__
</script>
<script src="../ortak/kanal.js"></script>
</body></html>"""


S = {}
# 01 — yarışma stüdyosu: çark döner, rastgele sayıda durur
S[1] = r"""
window.renderAt = t => {
  let o = C.studyo(t);
  const don = E(A(t, .3, 3.6)), aci = C.hedefAci(35) - (1 - don) * 1440;
  o += olc(C.cark(540, 700, 280, aci, t > 3.6 ? 35 : null), 540, 700, pop(t, 0, .5) + .001);
  if (t > 3.6) o += K.glow({ x: 540, y: 380, r: 160, renk: '#FFFFFF', guc: .5 * (1 - A(t, 3.6, 4.6)) });
  o += C.kursu(250, 1260, .9);
  o += gubi(t, { yol: [[0, 1250, 380, 130], [1.0, 860, 520, 130]], x: 860, y: 520, boy: 130, bakHedef: [540, 700], isaretHedef: [540, 700] });
  o += gufi(t, { yol: [[0.2, -150, 1071, 140], [1.6, 250, 1071, 140]], x: 250, y: 1071, boy: 140, bakHedef: t < 4.1 ? [540, 700] : [540, 420] });
  $('dinamik').innerHTML = o;
};"""
# 02 — 1974 Tversky & Kahneman; çark kimine 10'da kimine 65'te durdu
S[2] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 5.6, 6.1));
  if (g < 1) {
    let a = C.studyo(t);
    const c = pop(t, .3); if (c > 0) a += grp(cip('1974', 0, 0, '#FFFFFF', '#6B3A5B', 44), 540, 420, c);
    const tv = pop(t, 2.4), kh = pop(t, 3.4);
    if (tv > 0) a += olc(C.tversky({ x: 310, y: 1150, boy: 420 }), 310, 1150, tv) + grp(cip('AMOS TVERSKY', 0, 0, '#FFFFFF', '#1B1640', 24), 310, 1180, tv);
    if (kh > 0) a += olc(C.kahneman({ x: 770, y: 1150, boy: 420 }), 770, 1150, kh) + grp(cip('DANIEL KAHNEMAN', 0, 0, '#FFFFFF', '#1B1640', 24), 770, 1180, kh);
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = `<rect width="540" height="1920" fill="#F1D9C9"/><rect x="540" width="540" height="1920" fill="#D5E6E0"/><rect x="532" width="16" height="1920" fill="#FFFFFF"/>`;
    const d1 = E(A(t, 6.0, 9.0)), d2 = E(A(t, 6.0, 10.6));
    b += C.cark(270, 700, 190, C.hedefAci(10) - (1 - d1) * 1080, t > 9 ? 10 : null) + C.cark(810, 700, 190, C.hedefAci(65) - (1 - d2) * 1260, t > 10.6 ? 65 : null);
    const n1 = pop(t, 9.1), n2 = pop(t, 10.7);
    if (n1 > 0) b += grp(txt('10', 0, 0, 170, '#B0472E'), 270, 1080, n1);
    if (n2 > 0) b += grp(txt('65', 0, 0, 170, '#1F6F78'), 810, 1080, n2);
    b += gufi(t, { x: 540, y: 1250, boy: 120, bakHedef: t < 10 ? [270, 700] : [810, 700] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 03 — soru: BM'deki ülkelerin yüzde kaçı Afrikalı? (GERÇEK harita)
S[3] = r"""
$('zemin').innerHTML = C.zemin('#CDEFFA', '#EAF8FF');
const AF = H.kita('AF');
window.renderAt = t => {
  let o = '';
  const kac = Math.floor(AF.length * E(A(t, .6, 3.4))), vurgu = {}; for (let i = 0; i < kac; i++) vurgu[AF[i].id] = i % 2 ? '#C0583A' : '#D98B3A';
  const h = H.ciz({ ulkeler: H.dunya(), vurgu, kutu: [30, 380, 1020, 620], proj: 'equalEarth', renk: '#E9DDC2', rim: '#FFF6E0', sinirOp: .5, sinirKal: 1 });
  o += olc(h.svg, 540, 690, pop(t, 0, .5) + .001);
  const kp = pop(t, 1.8); if (kp > 0) o += grp(`<rect x="-400" y="-90" width="800" height="180" rx="50" fill="#FFFFFF"/><text x="0" y="-12" font-size="46" font-weight="900" text-anchor="middle" style="fill:#1B1640">BM'deki ülkelerin</text><text x="0" y="56" font-size="54" font-weight="900" text-anchor="middle" style="fill:#B0472E">% KAÇI AFRİKALI?</text>`, 540, 1100, kp);
  const af = h.p([20, 3]);
  o += gubi(t, { x: 930, y: 420, boy: 110, bakHedef: af, isaretHedef: af });
  o += gufi(t, { x: 150, y: 1245, boy: 120, bakHedef: [540, 1100] });
  $('dinamik').innerHTML = o;
};"""
# 04 — %25 ve %45 (gerçek oranlı sütunlar), tepede çarktaki sayıya bağlı ip
S[4] = r"""
$('zemin').innerHTML = C.zemin('#F6EBDD', '#EED9C4') + `<rect x="0" y="1160" width="1080" height="760" fill="#F1D9C9"/>`;
window.renderAt = t => {
  let o = '';
  const Y0 = 1150, K1 = 14, h1 = 25 * K1 * E(A(t, 1.5, 2.6)), h2 = 45 * K1 * E(A(t, 4.6, 5.8));
  o += `<rect x="250" y="${Y0 - h1}" width="170" height="${Math.max(2, h1)}" rx="24" fill="#C0583A"/><rect x="660" y="${Y0 - h2}" width="170" height="${Math.max(2, h2)}" rx="24" fill="#1F6F78"/>`;
  o += `<rect x="150" y="${Y0}" width="780" height="10" rx="5" fill="#6B3A5B"/>`;
  if (h1 > 5) o += txt('%' + Math.round(h1 / K1), 335, Y0 - h1 - 30, 64, '#B0472E');
  if (h2 > 5) o += txt('%' + Math.round(h2 / K1), 745, Y0 - h2 - 30, 64, '#1F6F78');
  // çark rozetleri sütunun tepesine iple bağlı (çapa bağı)
  [[335, h1, '10', '#C0583A', 1.3], [745, h2, '65', '#1F6F78', 4.4]].forEach(([x, h, s, r, a]) => { const p = pop(t, a); if (p <= 0) return; const by = Y0 - Math.max(h, 40) - 190;
    o += `<path d="M${x} ${by + 70} L${x} ${Y0 - h - 85}" stroke="#6B3A5B" stroke-width="6" stroke-dasharray="12 10"/>` + grp(`<circle r="62" fill="${r}"/><circle r="46" fill="#FFFFFF"/>` + txt(s, 0, 18, 52, '#1B1640'), x, by, p); });
  o += `<text class="mono" x="335" y="1210" font-size="26" text-anchor="middle" letter-spacing="2" style="fill:#1B1640">ÇARK: 10</text><text class="mono" x="745" y="1210" font-size="26" text-anchor="middle" letter-spacing="2" style="fill:#1B1640">ÇARK: 65</text>`;
  o += gubi(t, { x: 540, y: 560, boy: 100, bakHedef: t < 4.5 ? [335, 900] : [745, 800], isaretHedef: [745, 700] });
  o += gufi(t, { x: 960, y: 1245, boy: 110, bakHedef: t < 4.5 ? [335, 900] : [745, 700] });
  $('dinamik').innerHTML = o;
};"""
# 05 — çapa: ilk sayı çapaya dönüşür, tahmin kayığı ondan pek uzaklaşamaz
S[5] = r"""
window.renderAt = t => {
  let o = C.deniz(t);
  const c = pop(t, .2); if (c > 0) o += grp(cip('ÇAPA ETKİSİ', 0, 0, '#6B3A5B', '#FFFFFF', 40), 540, 400, c);
  const sp = pop(t, 2.2), don = A(t, 3.0, 3.4), bat = E(A(t, 3.3, 4.6));
  const ax = 480, ay = 640 + 860 * bat;
  if (sp > 0 && don < 1) o += grp(txt('10', 0, 40, 200, '#B0472E'), ax, 640, sp * (1 - don));
  if (don > 0) o += C.cipa(ax, ay, .9 * back(don), Math.sin(t * 2) * 6, '#5B6E9E');
  // kayık: ip gerildikçe geri çekilir
  const cek = A(t, 5.6, 8.0), bx = 560 + 170 * Math.min(1, cek * 1.5) - 40 * Math.max(0, Math.sin((cek - .5) * 12)) * (cek > .5), by = 905 + Math.sin(t * 1.5) * 8;
  if (bat > 0) o += `<path d="M${ax} ${ay - 140} Q${(ax + bx) / 2} ${(ay + by) / 2 + (cek > .6 ? 0 : 60)} ${bx - 120} ${by}" stroke="#8A5A3C" stroke-width="8" fill="none"/>`;
  o += gufi(t, { x: bx + 10, y: by - 12, boy: 110, bakHedef: cek > 0 ? [1000, 800] : [ax, 700] });
  o += C.kayik(bx, by, 1, Math.sin(t * 1.5) * 3);
  o += `<text class="mono" x="${bx}" y="${by + 40}" font-size="26" text-anchor="middle" style="fill:#FFFFFF">TAHMİN</text>`;
  $('dinamik').innerHTML = o;
};"""
# 06 — uzmanlar da: Almanya (gerçek harita) → mahkeme, hileli zar 3 / 9 → ceza 5 / 8 ay
S[6] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 2.2, 2.7));
  if (g < 1) {
    let a = C.zemin('#FFF3D6', '#FFE3B0');
    const h = H.ciz({ ulkeler: H.kita('EU'), sigdir: H.ulke('Almanya'), kenar: 80, vurgu: { 'Almanya': '#D98B3A' }, kutu: [60, 380, 960, 760], renk: '#E9DDC2', rim: '#FFF6E0', sinirOp: .6 });
    a += `<defs><clipPath id="alc"><rect x="60" y="380" width="960" height="760" rx="48"/></clipPath></defs><rect x="60" y="380" width="960" height="760" rx="48" fill="#BFE6F2"/><g clip-path="url(#alc)">${h.svg}</g>`;
    const ch = pop(t, .4); if (ch > 0) a += grp(cip('ALMANYA', 0, 0, '#FFFFFF', '#1B1640', 36), 540, 1210, ch);
    a += gubi(t, { x: 900, y: 1210, boy: 100, bakHedef: [540, 760] });
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = C.mahkeme() + C.hakim(540, 780, 1.1);
    b += `<rect x="140" y="760" width="800" height="340" rx="26" fill="${C.P.ahsap}"/><rect x="140" y="760" width="800" height="50" rx="24" fill="${C.P.ahsapA}"/>`;
    const r = E(A(t, 3.9, 5.1)), zd = t < 5.1 ? [1, 6, 3, 9][Math.floor(t * 8) % 4] : 9;
    b += C.zar(120 + 190 * r, 706 - Math.abs(Math.sin(r * Math.PI * 3)) * 80 * (1 - r), .9, zd, (1 - r) * 540);
    // karşılaştırma: zar 3 → 5 ay, zar 9 → 8 ay
    const k1 = pop(t, 6.0), k2 = pop(t, 7.6);
    if (k1 > 0) b += grp(C.zar(0, 0, .55, 3) + `<rect x="60" y="-26" width="${5 * 70 * E(A(t, 6.1, 6.9))}" height="52" rx="26" fill="#1F6F78"/>` + `<text x="${80 + 5 * 70 * E(A(t, 6.1, 6.9))}" y="16" font-size="40" font-weight="900" style="fill:#FFF3D6">5 AY</text>`, 220, 880, k1);
    if (k2 > 0) b += grp(C.zar(0, 0, .55, 9) + `<rect x="60" y="-26" width="${8 * 70 * E(A(t, 7.7, 8.7))}" height="52" rx="26" fill="#EE312E"/>` + `<text x="${80 + 8 * 70 * E(A(t, 7.7, 8.7))}" y="16" font-size="40" font-weight="900" style="fill:#FFF3D6">8 AY</text>`, 220, 990, k2);
    b += gufi(t, { x: 150, y: 1245, boy: 120, bakHedef: [540, 700] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 07 — etiket: üstü çizili yüksek fiyat, küçük çapa asılı
S[7] = r"""
$('zemin').innerHTML = C.zemin('#E8F7FF', '#CDEFFA') + [0, 1, 2].map(i => `<rect x="60" y="${420 + i * 300}" width="960" height="30" rx="15" fill="#FFFFFF"/>`).join('') +
  [0, 1, 2].map(i => [0, 1, 2, 3, 4, 5].map(k => `<rect x="${90 + k * 155}" y="${300 + i * 300}" width="110" height="120" rx="18" fill="${['#C0583A', '#D8A032', '#1F6F78', '#6B3A5B', '#D98B3A', '#8FAE8B'][(i + k) % 6]}" opacity=".55"/>`).join('')).join('');
window.renderAt = t => {
  let o = '';
  const s = pop(t, .1, .5);
  const sal = Math.sin(t * 2.2) * 8;
  o += `<path d="M700 ${840} Q${720 + sal} ${930} ${730 + sal} ${1000}" stroke="#8A5A3C" stroke-width="6" fill="none"/>` + C.cipa(730 + sal, 1080, .45 * pop(t, .9), sal);
  o += C.etiket(540, 760, 1.35 * s + .001, '1.999 TL', '999 TL', E(A(t, 2.3, 2.9)), back(A(t, 3.0, 3.4)));
  o += gufi(t, { x: 180, y: 1245, boy: 120, bakHedef: [540, 760] });
  o += gubi(t, { x: 920, y: 560, boy: 100, bakHedef: [540, 760] });
  $('dinamik').innerHTML = o;
};"""
# 08 — pazar: Gufi kameraya yaklaşır, izleyiciyi işaret eder
S[8] = r"""
$('zemin').innerHTML = C.tezgah(0);
window.renderAt = t => {
  const k = M.yakinlas(t, .1, 9);
  M.bulanik(k);
  let arka = gubi(t, { x: 860, y: 700, boy: 110, bakHedef: [540, 1000] });
  const gx = 300 + (540 - 300) * k, gy = 1245, gb = 130 + (440 - 130) * k;
  const on = gufi(t, { x: gx, y: gy, boy: gb, bakHedef: k > .5 ? 'kamera' : [540, 900], isaretHedef: [980, 1500] });
  $('dinamik').innerHTML = M.bulanikSar(arka, k) + on;
};"""
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
    plan["sahneler"].append({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]})
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
json.dump(sorted(tum, key=lambda r: r[1]), open("tepkiler.json", "w"), ensure_ascii=False)
print("sahneler + plan.json + tepkiler.json yazıldı")
