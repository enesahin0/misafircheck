"""#13 Mona Lisa hırsızlığı — sahne HTML'leri + plan.json + tepkiler.json (flat-bilim-animasyonu skill sözleşmesi)."""
import json

SB = [0, 8.9, 15.95, 20.9, 31.4, 34.2, 42.55, 52.7, 56.45, 59.95, 62.15]
ALT = {4: 3, 6: 2, 9: 3}   # hareket bulanıklığı (ft-motion): hızlı sahnelerde alt kare sayısı

TEP = {
    1: [('gubi', 4.4, 'sasir')],
    2: [('gufi', 3.9, 'omuzSilk')],
    3: [('gubi', 3.4, 'isaret')],
    4: [('gufi', 5.0, 'gozKapa'), ('gufi', 8.6, 'sasir')],
    5: [('gubi', 1.5, 'sasir')],
    6: [('gubi', 3.2, 'dusun'), ('gufi', 6.3, 'mutlu')],
    7: [('gubi', 1.2, 'merak'), ('gubi', 8.2, 'sasir')],
    8: [('gufi', .5, 'alkis'), ('gubi', .7, 'mutlu')],
    9: [('gufi', .15, 'yaklas'), ('gufi', 1.5, 'goster')],
}


HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/ml.js"></script>
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
# 01 — 21 Ağustos 1911, Louvre: çerçeve boşalır; "en ünlü tablo" ışıltısı
S[1] = r"""
$('zemin').innerHTML = ML.salon();
window.renderAt = t => {
  let o = '';
  const bos = t > 4.2, gh = A(t, 6.2, 7.0);
  o += ML.cerceve(540, 720, 420, 620, ML.monaLisa(540, 720, 420, 620), bos);
  if (bos && gh > 0) { o += K.glow({ x: 540, y: 720, r: 420, renk: '#F2CE7A', guc: .5 * gh }); o += `<g opacity="${.55 * gh}">` + ML.cerceve(540, 720, 420, 620, ML.monaLisa(540, 720, 420, 620)) + `</g>`;
    for (let i = 0; i < 6; i++) { const q = A(t, 6.5 + i * .25, 6.9 + i * .25); if (q > 0 && q < 1) o += ML.flasPatlamasi(540 + Math.cos(i * 2.1) * 330, 720 + Math.sin(i * 2.1) * 420, 40 * (1 - q) + 10, 1 - q); } }
  const d = pop(t, .3); if (d > 0) o += grp(`<rect x="-270" y="-56" width="540" height="112" rx="20" fill="${ML.P.terrakota}"/>` + txt('21 AĞUSTOS 1911', 0, 20, 58, '#FFF3E0'), 540, 1210, d, -4);
  o += gubi(t, { yol: [[.4, 1250, 420, 120], [1.8, 900, 560, 120]], x: 900, y: 560, boy: 120, bakHedef: [540, 720] });
  o += FX.flas(t, 4.2, .75, .09);
  o += FX.gecis(t, { orta: 8.9, renk: ML.P.altin, serit: ML.P.bordo, kapat: { tur: 'egik', sure: .35 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — o güne kadar pek tanınmıyordu: duvarda onlarca tablo, Mona Lisa köşede
S[2] = r"""
const R = K.rnd(4), TAB = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const w = 150 + R() * 70, h = 150 + R() * 90; TAB.push([140 + c * 265, 480 + r * 240, w * .8, h * .75, ['#8FAE8B', '#C98B8B', '#D8A032', '#6E7443', '#C0583A', '#1F6F78'][(r * 4 + c) % 6]]); }
$('zemin').innerHTML = ML.salon(.7);
window.renderAt = t => {
  let o = '';
  TAB.forEach(([x, y, w, h, r], i) => { if (i === 11) return; o += ML.cerceve(x, y, w, h, `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="${r}"/><circle cx="${x + w * .2}" cy="${y - h * .2}" r="${w * .12}" fill="#F6EBDD" opacity=".6"/><path d="M${x - w / 2} ${y + h / 2} L${x - w * .1} ${y} L${x + w * .2} ${y + h * .2} L${x + w / 2} ${y - h * .05} V${y + h / 2}Z" fill="#000" opacity=".2"/>`); });
  const [mx, my] = [TAB[11][0], TAB[11][1]];
  o += ML.cerceve(mx, my, 110, 160, ML.monaLisa(mx, my, 110, 160));
  const k = pop(t, 1.3); if (k > 0) o += `<circle cx="${mx}" cy="${my}" r="${130 * Math.min(1, k)}" fill="none" stroke="#F2CE7A" stroke-width="8" stroke-dasharray="18 12" opacity="${.9}"/>`;
  for (let i = 0; i < 4; i++) { const x = ((t * 140 + i * 320) % 1500) - 200; o += ML.kuyrukKisi(x, 1300, .7, ['#5E6B7A', '#7A5A4E', '#4E5E4A', '#6A4E62'][i], t * 8 + i); }
  o += gufi(t, { x: 160, y: 1245, boy: 120, bakHedef: [mx, my] });
  o += FX.gecis(t, { orta: 0, renk: ML.P.altin, serit: ML.P.bordo, kapat: { sure: .01 }, ac: { tur: 'egik', sure: .45 } });
  $('dinamik').innerHTML = o;
};"""
# 03 — hırsız: cam vitrin işçisi Vincenzo Peruggia
S[3] = r"""
$('zemin').innerHTML = ML.zemin('#EAD7BD', '#DCC3A2') + ML.vitrin(230, 1120, 260, 520);
window.renderAt = t => {
  let o = olc(ML.peruggia({ x: 580, y: 1160, boy: 560 }), 580, 1160, pop(t, .15, .5) + .001);
  const e = pop(t, 1.1); if (e > 0) o += grp(cip('CAM VİTRİN İŞÇİSİ', 0, 0, ML.P.petrol, '#FFF3E0', 30), 540, 420, e);
  const n = pop(t, 3.4); if (n > 0) o += grp(cip('VINCENZO PERUGGIA', 0, 0, '#FFF3E0', ML.P.bordo, 30), 580, 1195, n);
  o += gubi(t, { x: 930, y: 620, boy: 110, bakHedef: [580, 820], isaretHedef: [620, 760] });
  o += FX.gecis(t, { orta: 4.95, renk: ML.P.terrakota, kapat: { tur: 'daire', merkez: [580, 800], sure: .4 } });
  $('dinamik').innerHTML = o;
};"""
# 04 — kapalı pazartesi: beyaz önlük, çerçeveden çıkar, önlüğün altına, kapıdan çıkış
S[4] = r"""
$('zemin').innerHTML = ML.salon(.8) + `<rect x="900" y="620" width="170" height="440" rx="16" fill="${ML.P.bordoK}"/><rect x="915" y="640" width="140" height="400" rx="12" fill="#4A1A26"/><circle cx="935" cy="860" r="10" fill="${ML.P.altin}"/>`;
window.renderAt = t => {
  let o = '';
  const kp = pop(t, .3); if (kp > 0) o += grp(`<rect x="-120" y="-40" width="240" height="80" rx="14" fill="#F6EBDD"/>` + txt('KAPALI', 0, 16, 40, ML.P.bordo), 985, 560, kp);
  const pz = pop(t, 1.9); if (pz > 0) o += grp(cip('PAZARTESİ · 07:00', 0, 0, ML.P.petrol, '#FFF3E0', 28), 400, 420, pz);
  // tablo çerçeveden kayar
  const kay = E(A(t, 4.8, 6.4)), sak = A(t, 6.8, 7.8);
  const bos = t > 4.8;
  o += ML.cerceve(470, 720, 300, 440, ML.monaLisa(470, 720, 300, 440), bos);
  // yürüyüş: girer (1.0–4.0), bekler, çıkar (8.3–10.3)
  const gir = E(A(t, 1.0, 4.0)), cik = FX.E.inExpo(A(t, 8.3, 10.0)) ;
  const x = -120 + (330 + 120) * gir + (1250 - 330) * cik, faz = (t < 4 ? t : t > 8.3 ? t * 1.6 : 0) * 9;
  o += ML.onluklu(x, 1300, .8, faz, sak);
  if (bos && sak < 1) { const px = 470 - 90 * kay, py = 720 + 330 * kay, s = 1 - .45 * kay - .5 * sak; o += `<g opacity="${1 - sak}">` + ML.cerceve(px, py, 300 * s, 440 * s, ML.monaLisa(px, py, 300 * s, 440 * s), false, 1).replace(/fill="#A8761C"|fill="#D8A032"|fill="#F2CE7A"/g, 'fill="none"') + `</g>`; }
  o += gufi(t, { x: 820, y: 1245, boy: 120, bakHedef: [x, 1000] });
  o += FX.gecis(t, { orta: 0, renk: ML.P.terrakota, kapat: { sure: .01 }, ac: { tur: 'daire', merkez: [580, 800], sure: .5 } });
  $('dinamik').innerHTML = o;
};"""
# 05 — ancak ertesi gün fark edildi
S[5] = r"""
$('zemin').innerHTML = ML.salon(.6);
window.renderAt = t => {
  const g = Math.floor(A(t, .7, 1.1) * 1.999) ? 22 : 21;
  let o = ML.cerceve(700, 720, 300, 440, '', true) + olc(ML.takvim(290, 640, g, 'AĞUSTOS', .75), 290, 640, pop(t, 0, .4));
  if (t > .7 && t < 1.1) o += `<rect x="163" y="${530 + (t - .7) * 400}" width="255" height="120" rx="20" fill="#FFFFFF" opacity="${1 - (t - .7) / .4}"/>`;
  o += gubi(t, { x: 540, y: 1100, boy: 110, bakHedef: [700, 720] });
  $('dinamik').innerHTML = o;
};"""
# 06 — manşetler + boş duvar için kuyruk
S[6] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 2.4, 2.9));
  if (g < 1) {
    let a = ML.zemin('#EAD7BD', '#D9C3A0');
    [[300, 760, -8, .3, 'LA JOCONDE', 'ÇALINDI!'], [720, 820, 6, .7, 'LOUVRE', 'ŞOKTA'], [520, 900, -2, 1.1, 'MONA LİSA', 'NEREDE?']].forEach(([x, y, r, a0, m1, m2]) => { const d = pop(t, a0, .4); if (d <= 0) return;
      a += `<g transform="translate(0 ${-(1 - Math.min(1, d)) * 500})">` + ML.gazete(x, y, .62, r, FX.harfHarf(m1, 0, -220, 70, t, a0 + .2, { renk: ML.P.murekkep }) + FX.harfHarf(m2, 0, -140, 64, t, a0 + .4, { renk: ML.P.terrakota })) + `</g>`; });
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = ML.salon(.8) + ML.cerceve(540, 640, 300, 440, '', true);
    const adet = Math.floor(3 + 7 * E(A(t, 2.9, 7.5)));
    for (let i = 0; i < adet; i++) b += ML.kuyrukKisi(640 + i * 120, 1290 + (i % 2) * 20, .65 - i * .02, ['#5E6B7A', '#7A5A4E', '#4E5E4A', '#6A4E62', '#8A6A4A'][i % 5], t * 3 + i);
    b += gubi(t, { x: 200, y: 560, boy: 110, bakHedef: [540, 640] });
    b += gufi(t, { yol: [[4.3, 1200, 1250, 110], [6.2, 420, 1250, 110]], x: 420, y: 1250, boy: 110, bakHedef: [540, 640] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  o += FX.gecis(t, { orta: 2.65, renk: ML.P.petrol, serit: ML.P.altin, kapat: { tur: 'egik', sure: .25, yon: -1 }, ac: { tur: 'egik', sure: .35, yon: -1 } });
  $('dinamik').innerHTML = o;
};"""
# 07 — iki yıl sandıkta (Paris), 1913 Floransa'da yakalandı (GERÇEK harita)
S[7] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 5.0, 5.5));
  if (g < 1) {
    let a = ML.zemin('#F1E3CC', '#E2CBA8') + `<path d="M0 300 L1080 180 L1080 520 L0 640Z" fill="#D9BE96"/><rect x="700" y="330" width="240" height="180" rx="16" fill="#BFD9E6" transform="rotate(-6 820 420)"/>` +
      [0, 1, 2, 3].map(i => `<rect x="${720 + i * 55}" y="${440 - i * 18}" width="40" height="${50 + i * 12}" fill="#8A7A6A" transform="rotate(-6 820 420)"/>`).join('');
    const ac = E(A(t, .9, 1.6));
    a += ML.sandik(540, 1150, 1.3, ac, ac > .2 ? `<g transform="translate(0 -175) rotate(90) scale(.8)">` + ML.cerceve(0, 0, 110, 170, ML.monaLisa(0, 0, 110, 170)).replace(/fill="#000" opacity=".25"/, 'fill="none"') + `</g>` : '');
    const yl = pop(t, 2.2); if (yl > 0) a += grp(`<rect x="-170" y="-70" width="340" height="140" rx="40" fill="${ML.P.terrakota}"/>` + txt(FX.sayac(t, 2.2, 3.6, 0, 2) + ' YIL', 0, 26, 76, '#FFF3E0'), 540, 500, yl);
    a += gubi(t, { x: 190, y: 800, boy: 110, bakHedef: [540, 1000] });
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = ML.zemin('#E6EFEA', '#CFE0D8');
    const h = H.ciz({ ulkeler: H.kita('EU'), sigdir: H.ulke('İtalya', 'İsviçre', 'Belçika', 'Avusturya'), kenar: 30, vurgu: { 'Fransa': '#8FAE8B', 'İtalya': '#C98B8B' }, kutu: [60, 380, 960, 780], renk: '#EAD7BD', rim: '#FFF6E6', sinirOp: .6 });
    b += `<defs><clipPath id="avc"><rect x="60" y="380" width="960" height="780" rx="48"/></clipPath></defs><rect x="60" y="380" width="960" height="780" rx="48" fill="#BFDDE6"/><g clip-path="url(#avc)">${h.svg}</g>`;
    const [px, py] = h.p([2.35, 48.86]), [fx, fy] = h.p([11.26, 43.77]);
    b += H.igne(px, py, ML.P.petrol, .9, 'Paris');
    const yolp = E(A(t, 5.8, 7.6)); if (yolp > 0) { const mx = (px + fx) / 2 + 60, my = (py + fy) / 2 - 80; let d = `M${px} ${py - 50}`; for (let i = 1; i <= 24 * yolp; i++) { const u = i / 24; d += ` L${(1 - u) * (1 - u) * px + 2 * (1 - u) * u * mx + u * u * fx} ${(1 - u) * (1 - u) * (py - 50) + 2 * (1 - u) * u * my + u * u * (fy - 50)}`; }
      b += `<path d="${d}" stroke="${ML.P.terrakota}" stroke-width="9" stroke-dasharray="20 14" fill="none" stroke-linecap="round"/>`; }
    const fp = pop(t, 7.6); if (fp > 0) b += grp(H.igne(0, 0, ML.P.terrakota, 1, 'Floransa'), fx, fy, fp);
    const yk = pop(t, 8.3); if (yk > 0) b += grp(`<rect x="-160" y="-54" width="320" height="108" rx="30" fill="${ML.P.bordo}"/>` + txt('1913', -40, 20, 56, '#FFF3E0') + `<circle cx="80" cy="-6" r="22" fill="none" stroke="#FFF3E0" stroke-width="9"/><circle cx="118" cy="-6" r="22" fill="none" stroke="#FFF3E0" stroke-width="9"/>`, fx - 40, fy + 110, yk);
    b += gubi(t, { x: 920, y: 1230, boy: 100, bakHedef: yolp < 1 ? [px + (fx - px) * yolp, py + (fy - py) * yolp] : [fx, fy] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 08 — döndüğünde bir yıldız
S[8] = r"""
$('zemin').innerHTML = ML.salon(1);
window.renderAt = t => {
  let o = '';
  const k = pop(t, 0, .5);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * .3; o += `<path d="M540 720 L${540 + Math.cos(a) * 900} ${720 + Math.sin(a) * 900} L${540 + Math.cos(a + .1) * 900} ${720 + Math.sin(a + .1) * 900}Z" fill="#F2CE7A" opacity="${.18 * k}"/>`; }
  o += K.glow({ x: 540, y: 720, r: 500, renk: '#F2CE7A', guc: .5 * k }) + olc(ML.cerceve(540, 720, 360, 530, ML.monaLisa(540, 720, 360, 530)), 540, 720, k * (1 + .02 * Math.sin(t * 3)));
  for (let i = 0; i < 10; i++) { const q = ((t * 1.8 + i * .37) % 1); o += ML.flasPatlamasi(150 + ((i * 97) % 780), 1150 + (i % 3) * 30, 36 * (1 - q) + 8, (1 - q) * A(t, .2, .5)); }
  for (let i = 0; i < 8; i++) o += ML.kuyrukKisi(90 + i * 130, 1330, .55, ['#5E6B7A', '#7A5A4E', '#4E5E4A', '#6A4E62'][i % 4], t * 4 + i);
  const y = pop(t, 1.3); if (y > 0) o += grp(txt('★ YILDIZ ★', 0, 0, 64, '#F2CE7A'), 540, 380, y);
  o += gubi(t, { x: 150, y: 560, boy: 100, bakHedef: [540, 720] }) + gufi(t, { x: 930, y: 1100, boy: 110, bakHedef: [540, 720] });
  $('dinamik').innerHTML = o;
};"""
# 09 — kapanış: ünlü yapan, onu kaybetmek; Gufi kameraya yaklaşır
S[9] = r"""
$('zemin').innerHTML = ML.salon(.8) + ML.cerceve(300, 720, 260, 380, '', true) + ML.cerceve(780, 720, 260, 380, ML.monaLisa(780, 720, 260, 380));
window.renderAt = t => {
  const k = M.yakinlas(t, .15, 9);
  M.bulanik(k);
  let arka = gubi(t, { x: 540, y: 470, boy: 100, bakHedef: [540, 1000] });
  const on = gufi(t, { x: 540, y: 1250, boy: 130 + 300 * k, bakHedef: k > .5 ? 'kamera' : [780, 720] });
  $('dinamik').innerHTML = M.bulanikSar(arka, k) + on;
};"""
S[10] = open('_logo_sahne.js').read()

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
