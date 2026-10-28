"""#16 Soğan Neden Ağlatır — sahne HTML'leri + plan.json + tepkiler.json."""
import json

SB = [0, 6.9, 12.85, 16.3, 22.35, 30.3, 33.9, 42.2, 49.75, 52.9, 57.2, 61.9, 67.6, 69.8]
ALT = {12: 3}
TEP = {
    1: [('gufi', 3.4, 'gozKapa'), ('gubi', 4.6, 'dusun')],
    2: [('gubi', .2, 'dusun')],
    3: [('gufi', .5, 'sasir')],
    4: [('gubi', 3.0, 'sasir'), ('gufi', 4.6, 'korku')],
    5: [],
    6: [('gufi', .4, 'kararli'), ('gubi', 1.6, 'alkis')],
    7: [('gubi', .6, 'aha'), ('gubi', 6.4, 'mutlu')],
    8: [('gufi', .4, 'dusun'), ('gubi', 3.4, 'aha'), ('gufi', 5.6, 'mutlu')],
    9: [],
    10: [('gufi', 1.0, 'isaret'), ('gubi', 2.8, 'mutlu')],
    11: [('gubi', 3.2, 'kahkaha'), ('gufi', 3.4, 'uzgun')],
    12: [('gufi', .3, 'yaklas'), ('gufi', 1.4, 'goster'), ('gubi', 1.6, 'mutlu')],
}
ORTAK = r"""
const TR = '#FF9F1C';
const SEF = KO.giy('gubi', [['simitci', {}]]);
const T = CV.ton('seftali');
const ZY = 1250;
const tezgah = () => `<rect x="0" y="${ZY - 30}" width="1080" height="50" rx="14" fill="${T.cokKoyu}"/><rect x="0" y="${ZY - 30}" width="1080" height="12" rx="6" fill="#FFFFFF" opacity=".12"/><rect x="0" y="${ZY + 20}" width="1080" height="${1920 - ZY}" fill="${T.koyu}"/>` + [0, 1, 2, 3].map(i => `<rect x="${30 + i * 265}" y="${ZY + 80}" width="240" height="560" rx="18" fill="${T.orta}" opacity=".6"/><rect x="${120 + i * 265}" y="${ZY + 120}" width="60" height="14" rx="7" fill="${T.cokKoyu}" opacity=".6"/>`).join('');
const dogra = (t, x, y, hiz = 7) => { const q = Math.abs(Math.sin(t * hiz)); return `<g transform="translate(${x} ${y - 80 * q}) rotate(${-10 + 12 * q})">` + SG.bicak(0, 0, .75, 0) + '</g>'; };
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/sg.js"></script>
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
# 01 — mutfak: Gufi doğrar ve ağlar, Gubi şef
S[1] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = gufi(t, { x: 720, y: 1330, boy: 380, bakHedef: [380, 1160] }) + SG.gufiYas(720, 1330, 380, t, A(t, 1.0, 1.8));
  o += tezgah() + SG.tahta(400, 1220, 1.0) + SG.sogan(350, 1120, .85) + (t > .5 ? SG.sogan(560, 1180, .55, { yarim: 1 }) : '') + dogra(t, 520, 1090);
  o += gubi(t, { x: 900, y: 640, boy: 200, bakHedef: [700, 1000], ust: SEF });
  const c = pop(t, 3.6); if (c > 0) o += grp(cip('KİMYA TUZAĞI', 0, 0, TR, '#1B1640', 40), 480, 420, c);
  o += FX.gecis(t, { orta: 6.9, renk: TR, serit: '#1B1640', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 02 — geniş: Gubi büyüteçle → DETAY: hücre (doğrudan sonraki sahneye)
S[2] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = tezgah() + SG.tahta(540, 1220, 1.1) + SG.sogan(540, 1120, 1.15, { yarim: 1 });
  o += gubi(t, { x: 760, y: 820, boy: 210, bakHedef: [540, 1120], ust: SEF }) + `<g transform="translate(640 1000) rotate(30)"><circle cx="0" cy="0" r="80" fill="#BFE3F0" opacity=".45"/><circle cx="0" cy="0" r="80" fill="none" stroke="#3A3F5C" stroke-width="16"/><rect x="-12" y="80" width="24" height="120" rx="12" fill="#3A3F5C"/></g>`;
  o += DP.sar(t, .7, 99, d => SGD.hucre(d, t, 2.9, 4.4));
  $('dinamik').innerHTML = o;
};"""
# 03 — geniş: bıçak iner → DETAY: hücre yırtılır, karışır (doğrudan sonraki sahneye)
S[3] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = gufi(t, { x: 740, y: 1330, boy: 380, bakHedef: [420, 1160] }) + tezgah() + SG.tahta(420, 1220, 1.0) + SG.sogan(420, 1140, .9, { yarim: 1 });
  const q = FX.E.expo(A(t, .3, .7)); o += `<g transform="translate(470 ${980 + 150 * q}) rotate(-5)">` + SG.bicak(0, 0, 1.0, 0) + '</g>';
  if (t > .7) o += FX.sokHalkasi(420, 1160, t, .7, { renk: '#FFFFFF', yaricap: 260, kalinlik: 18 });
  o += DP.sar(t, 1.1, 99, d => SGD.yirtil(d, t));
  $('dinamik').innerHTML = o;
};"""
# 04 — uçucu gaz yükselir; molekül rozeti
S[4] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = gufi(t, { x: 760, y: 1330, boy: 380, bakHedef: [420, 800] }) + SG.gufiYas(760, 1330, 380, t, A(t, 4.4, 5.0));
  o += tezgah() + SG.tahta(420, 1220, 1.0) + SG.sogan(350, 1160, .6, { yarim: 1 }) + SG.sogan(500, 1160, .6, { yarim: 1 });
  o += SG.gaz(430, 1150, t, A(t, .2, 1.2), 320);
  const c = pop(t, 1.6); if (c > 0) o += grp(cip('UÇUCU GAZ', 0, 0, '#9FE07A', '#1B1640', 36), 330, 420, c);
  const m = FX.yayTip(t - 4.35, 'agir'); if (m > 0) o += `<circle cx="600" cy="620" r="${200 * Math.min(1, m)}" fill="#FFFDF6" opacity=".92"/>` + grp(SG.molekul(0, 0, 1.2), 600, 600, m) + grp(cip('PROPANTİYAL S-OKSİT', 0, 0, '#1B1640', '#9FE07A', 28), 600, 870, m);
  o += gubi(t, { x: 150, y: 700, boy: 190, bakHedef: [430, 700], ust: SEF });
  $('dinamik').innerHTML = o;
};"""
# 05 — DETAY (uzun, aşamalı): göz → sinir → beyin alarm → gözyaşı
S[5] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = gufi(t, { x: 700, y: 1330, boy: 380, bakHedef: 'kamera' }) + SG.gufiYas(700, 1330, 380, t) + tezgah();
  o += DP.sar(t, .2, 99, d => SGD.goz(d, t, 1.7, 3.55, 5.75));
  o += FX.gecis(t, { orta: 7.95, renk: '#2E9AD8', kapat: { tur: 'daire', merkez: [540, 1000], sure: .35 } });
  $('dinamik').innerHTML = o;
};"""
# 06 — ağlamak = savunma: kalkanlı göz amblemi
S[6] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#BFE3F0"/>` + CV.bulut(200, 260, .8) + CV.bulut(880, 200, .6);
window.renderAt = t => {
  const e = FX.yayTip(t - .2, 'agir');
  let o = '';
  if (e > 0) o += grp(`<path d="M0 -300 L240 -220 Q250 120 0 300 Q-250 120 -240 -220Z" fill="#2E9AD8"/><path d="M0 -250 L190 -185 Q196 90 0 245Z" fill="#FFFFFF" opacity=".18"/><ellipse cx="0" cy="-10" rx="150" ry="90" fill="#FFFFFF"/><circle cx="0" cy="-10" r="64" fill="#7E4A2A"/><circle cx="0" cy="-10" r="30" fill="#1B1410"/><path d="M110 40 Q130 110 120 170" stroke="#6CC8F0" stroke-width="18" stroke-linecap="round" fill="none"/>`, 540, 760, e);
  const c = pop(t, 1.2); if (c > 0) o += grp(cip('GÖZÜN SAVUNMASI', 0, 0, '#1B1640', '#FFE45C', 38), 540, 1150, c);
  o += gufi(t, { x: 300, y: 1760, boy: 250, bakHedef: [540, 760] }) + gubi(t, { x: 860, y: 1600, boy: 190, bakHedef: [540, 760], ust: SEF });
  o += FX.gecis(t, { orta: 0, renk: '#2E9AD8', kapat: { sure: .01 }, ac: { tur: 'daire', merkez: [540, 760], sure: .45 } });
  $('dinamik').innerHTML = o;
};"""
# 07 — 2002 Japonya laboratuvarı → DETAY: deney defteri → geniş: LFS enzimi
S[7] = r"""
const TL = CV.ton('teal');
$('zemin').innerHTML = SG.lab(TL);
const bilimci = (x, i, t) => KS.karakter(Object.assign({ x, y: 1560, boy: 520, t, ifade: 'gulumse', bak: [x < 540 ? .6 : -.6, -.4] }, KS.donem(2002, i), { kiyafet: { ceket: '#F4F6F8', gomlek: '#BFE3F0' }, sac: { tip: i ? 'uzun' : 'kisa', renk: '#1B1410' }, ten: '#F2C6A0' }));
window.renderAt = t => {
  let o = bilimci(170, 0, t) + bilimci(920, 1, t);
  const c = pop(t, .9); if (c > 0) o += grp(cip('2002 · JAPONYA', 0, 0, '#E8323C', '#FFFFFF', 38), 540, 640, c);
  const e = FX.yayTip(t - 6.1, 'agir'); if (e > 0) o += `<circle cx="850" cy="370" r="${230 * Math.min(1, e)}" fill="#7CFFB0" opacity=".25"/>` + grp(SGD.cipO('ÖZEL ENZİM', 0, 0, '#7CFFB0', '#1B1640', 34), 540, 1060, e);
  o += gubi(t, { x: 560, y: 820, boy: 200, bakHedef: [850, 370], ust: KO.giy('gubi', ['gozluk']) });
  o += DP.sar(t, 2.5, 4.8, d => SGD.defter(d));
  $('dinamik').innerHTML = o;
};"""
# 08 — buzdolabı: 30 dk soğut
S[8] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  const ac = A(t, 2.6, 3.0) * (1 - A(t, 4.2, 4.6));
  let o = SG.buzdolabi(800, ZY, .95, ac, T);
  const g = FX.E.inOutQuart(A(t, 3.0, 3.8)); if (t < 4.2) o += SG.sogan(420 + 380 * g, 1100 - 160 * g - Math.sin(g * Math.PI) * 120, .6 - .2 * g);
  if (ac > 0 && t > 3.8) o += SG.sogan(800, 640, .4);
  if (t > 3.0) for (let i = 0; i < 8; i++) { const q = ((t * .4 + i / 8) % 1); o += `<path d="M${640 + (i * 53) % 320} ${300 + q * 600} m-14 0 h28 m-14 -14 v28 m-10 -10 l20 20 m0 -20 l-20 20" stroke="#BFE3F0" stroke-width="5" opacity="${.9 * Math.sin(q * Math.PI)}"/>`; }
  const sa = pop(t, 3.3); if (sa > 0) o += grp(`<circle cx="0" cy="0" r="110" fill="#FFFDF6"/><circle cx="0" cy="0" r="92" fill="none" stroke="${TR}" stroke-width="12" stroke-dasharray="${578 * A(t, 3.3, 5.0)} 578" transform="rotate(-90)"/>` + txt(FX.sayac(t, 3.3, 5.0, 0, 30) + '', 0, 10, 64, '#1B1640') + PR.Tm('DK', 0, 56, 26, '#1B1640'), 300, 560, sa);
  const c = pop(t, 5.4); if (c > 0) o += grp(cip('SOĞUK = DAHA AZ GAZ', 0, 0, '#2E9AD8', '#FFFFFF', 32), 460, 820, c);
  o += gufi(t, { x: 330, y: 1330, boy: 360, bakHedef: [800, 700] }) + tezgah();
  o += gubi(t, { x: 180, y: 760, boy: 170, bakHedef: [800, 700], ust: SEF });
  $('dinamik').innerHTML = o;
};"""
# 09 — geniş: iki bıçak → DETAY: kör vs keskin kesit (doğrudan sonraki sahneye)
S[9] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = tezgah() + `<g transform="translate(330 1000) rotate(-60)">` + SG.bicak(0, 0, .9, 0, true) + `</g><g transform="translate(760 1000) rotate(-60)">` + SG.bicak(0, 0, .9, 0) + '</g>';
  o += gubi(t, { x: 540, y: 620, boy: 200, bakHedef: [540, 900], ust: SEF });
  o += DP.sar(t, .5, 99, d => SGD.bicakKiyas(d, t));
  $('dinamik').innerHTML = o;
};"""
# 10 — kök en sona: soğan diyagramı
S[10] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + `<rect x="80" y="330" width="920" height="1000" rx="40" fill="#FFFDF6"/>`;
window.renderAt = t => {
  let o = SG.sogan(540, 820, 2.6);
  const k = pop(t, 2.5); if (k > 0) o += `<ellipse cx="540" cy="${820 + 125 * 2.6}" rx="${150 * Math.min(1, k)}" ry="${80 * Math.min(1, k)}" fill="#E8323C" opacity=".35"/>` + grp(cip('EN YOĞUN', 0, 0, '#E8323C', '#FFFFFF', 36), 800, 1200, k);
  const kes = A(t, .6, 1.6); for (let i = 0; i < 4; i++) o += `<path d="M${320 + i * 130} 520 V${520 + 560 * kes}" stroke="#1B1640" stroke-width="6" stroke-dasharray="18 14" opacity=".5"/>`;
  const c = pop(t, .3); if (c > 0) o += grp(cip('KÖKÜ EN SONA BIRAK', 0, 0, TR, '#1B1640', 34), 540, 400, c);
  o += gufi(t, { x: 230, y: 1760, boy: 250, bakHedef: [540, 1140], isaretHedef: [540, 1140] }) + gubi(t, { x: 880, y: 1600, boy: 180, bakHedef: [540, 1140], ust: SEF });
  $('dinamik').innerHTML = o;
};"""
# 11 — ekmek & mum: pek işe yaramıyor
S[11] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY);
window.renderAt = t => {
  let o = gufi(t, { x: 560, y: 1330, boy: 380, bakHedef: 'kamera' }) + SG.gufiYas(560, 1330, 380, t);
  if (t > .4) o += SG.ekmek(560, 1330 - 380 * .47, .9 * Math.min(1, FX.yayTip(t - .4, 'oyuncu')));
  o += tezgah() + SG.tahta(560, 1220, .9) + SG.sogan(560, 1160, .6, { yarim: 1 });
  const mm = pop(t, 1.4); if (mm > 0) o += grp(SG.mum(0, 0, 1, t), 900, 1210, mm);
  const q = pop(t, .9); if (q > 0 && t < 3.1) o += grp(txt('?', 0, 0, 150, TR), 330, 700, q);
  const x = A(t, 3.1, 3.4); if (x > 0) o += `<g opacity="${x}"><path d="M470 960 l180 150 M650 960 l-180 150" stroke="#E8323C" stroke-width="22" stroke-linecap="round"/><path d="M840 960 l120 120 M960 960 l-120 120" stroke="#E8323C" stroke-width="18" stroke-linecap="round"/></g>` + grp(cip('PEK İŞE YARAMIYOR', 0, 0, '#E8323C', '#FFFFFF', 32), 540, 420, x);
  o += gubi(t, { x: 180, y: 700, boy: 180, bakHedef: [560, 1000], ust: SEF });
  o += FX.gecis(t, { orta: 4.7, renk: TR, serit: '#1B1640', kapat: { tur: 'egik', sure: .3 } });
  $('dinamik').innerHTML = o;
};"""
# 12 — kapanış: kalkanlı soğan kahraman; Gufi yüzücü gözlüğüyle kameraya
S[12] = r"""
$('zemin').innerHTML = SG.mutfak(T, ZY) + tezgah();
window.renderAt = t => {
  const k = M.yakinlas(t, .3, 9); M.bulanik(k * .8);
  const arka = SG.soganKahraman(420, 900, 1.1, t) + gubi(t, { x: 860, y: 620, boy: 190, bakHedef: [420, 900], ust: SEF });
  let on = gufi(t, { x: 640, y: 1700 + 120 * k, boy: 260 + 170 * k, bakHedef: 'kamera', ust: KO.giy('gufi', ['yuzucu']) });
  const c = pop(t, 3.2); if (c > 0) on += grp(cip('SADECE YENMEK İSTEMİYOR', 0, 0, TR, '#1B1640', 34), 540, 420, c);
  $('dinamik').innerHTML = M.bulanikSar(arka, k * .8) + on + FX.gecis(t, { orta: 0, renk: TR, serit: '#1B1640', kapat: { sure: .01 }, ac: { tur: 'egik', sure: .4 } });
};"""
for k in range(1, 13): S[k] = ORTAK + S[k]
S[13] = open('_logo_sahne.js').read()

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
