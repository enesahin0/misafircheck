"""#11 Kendine mikrop içen doktor — sahne HTML'leri + plan.json + tepkiler.json (flat-bilim-animasyonu skill sözleşmesi)."""
import json

SB = [0, 5.3, 15.8, 25.4, 28.9, 36.3, 42.9, 50.0, 53.8, 60.68, 62.88]

TEP = {
    1: [('gufi', 1.2, 'korku'), ('gubi', 1.5, 'sasir')],
    2: [('gubi', 2.0, 'merak'), ('gufi', 8.9, 'sasir')],
    3: [('gubi', 8.2, 'aha')],
    4: [('gufi', 1.0, 'uzgun')],
    5: [('gufi', 5.6, 'korku'), ('gubi', 6.2, 'sasir')],
    6: [('gubi', 5.0, 'sasir')],
    7: [('gufi', 6.2, 'mutlu')],
    8: [('gubi', 1.0, 'mutlu'), ('gufi', 1.2, 'mutlu')],
    9: [('gufi', 5.2, 'sasir'), ('gubi', 5.5, 'mutlu'), ('gufi', 6.0, 'mutlu')],
}
UYARI = r"""const uyari = `<rect x="330" y="1234" width="420" height="40" rx="20" fill="#FFFFFF" opacity=".7"/><text class="mono" x="540" y="1261" font-size="22" text-anchor="middle" letter-spacing="1" style="fill:#1B1640">Tıbbi tavsiye değildir</text>`;"""


HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/tip.js"></script>
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
# 01 — güneşli laboratuvar: bakteri dolu bardak
S[1] = r"""
$('zemin').innerHTML = D.zemin('#FFF3E2', '#FFE2BF', [760, 520, 800, '#FFFFFF', .5]) + D.pencere(640, 400, 300, 250) +
  `<rect x="0" y="1130" width="1080" height="790" fill="${D.P.ahsap}"/><rect x="0" y="1130" width="1080" height="26" fill="#F2C48C"/><rect x="0" y="1156" width="1080" height="14" fill="${D.P.ahsapK}" opacity=".5"/>`;
window.renderAt = t => {
  let o = '';
  const z = 1 + .12 * E(A(t, 0, 5.3));
  o += olc(D.bardak(520, 1140, 1.55 * pop(t, .05, .5) + .001, 1, t), 520, 900, z);
  o += gufi(t, { x: 170, y: 1175, boy: 140, bakHedef: [520, 900] });
  o += gubi(t, { x: 880, y: 820, boy: 120, bakHedef: [520, 900] });
  $('dinamik').innerHTML = o;
};"""
# 02 — 1980'ler: ülser = stres + acı; asitte bakteri yaşamaz
S[2] = r"""
$('zemin').innerHTML = D.zemin('#DDF3EA', '#BFE6D6') + `<rect x="0" y="1120" width="1080" height="800" fill="#9FD3C1"/><rect x="0" y="1120" width="1080" height="20" fill="#E8FAF2"/>`;
window.renderAt = t => {
  let o = '';
  const c = pop(t, .2); if (c > 0) o += grp(cip("1980'LER", 0, 0, D.P.mintK, '#FFFFFF', 36), 540, 400, c);
  const kd = E(A(t, 6.2, 6.8));
  if (kd < 1) {
    const sol = `<text x="-150" y="-60" font-size="84" font-weight="900" text-anchor="middle" style="fill:#2F6F8F">ÜLSER</text>`;
    let sag = `<text x="150" y="-60" font-size="54" font-weight="900" text-anchor="middle" style="fill:#2F6F8F">=</text>`;
    const s1 = pop(t, 3.5); if (s1 > 0) sag += grp(`<path d="M-30 -60 L10 -60 L-10 -10 L30 -10 L-20 60 L0 5 L-35 5Z" fill="#FFB547"/>`, 100, -10, s1) + grp(`<text x="0" y="0" font-size="30" font-weight="900" text-anchor="middle" style="fill:#2F6F8F">STRES</text>`, 100, 150, s1);
    const s2 = pop(t, 4.9); if (s2 > 0) sag += grp(`<path d="M-40 30 Q-10 -60 40 -50 Q20 -30 10 10 Q-10 50 -40 30Z" fill="#EE312E"/><path d="M34 -52 q8 -20 20 -24" stroke="#4CAF50" stroke-width="10" stroke-linecap="round" fill="none"/>`, 220, -10, s2) + grp(`<text x="0" y="0" font-size="30" font-weight="900" text-anchor="middle" style="fill:#2F6F8F">ACI</text>`, 220, 150, s2);
    o += `<g opacity="${1 - kd}" transform="translate(0 ${-200 * kd})">` + D.kitap(540, 800, pop(t, 1.5, .5) * .95 + .001, sol, sag, -2) + `</g>`;
  }
  if (kd > 0) {
    // mide kesiti: asit + içeri giren bakteri erir
    let ic = '';
    const sv = 820 + Math.sin(t * 2) * 6;
    ic += `<rect x="0" y="${sv}" width="1080" height="700" fill="#E8E86A" opacity=".85"/><path d="M0 ${sv} Q135 ${sv - 14} 270 ${sv} T540 ${sv} T810 ${sv} T1080 ${sv} V${sv + 20} H0Z" fill="#F6F59C"/>`;
    for (let i = 0; i < 10; i++) { const q = (t * .6 + i * .13) % 1; ic += `<circle cx="${400 + (i * 61) % 320}" cy="${sv + 200 - q * 200}" r="${6 + i % 3 * 3}" fill="#FFFFFF" opacity="${.6 * (1 - q)}"/>`; }
    const b = A(t, 7.3, 8.8), er = A(t, 8.8, 9.9);
    if (b > 0 && er < 1) ic += D.bakteri(760 - 200 * E(b), 520 + 330 * E(b), .9 * (1 - er) + .01, t, 50 + 40 * E(b), er > 0 ? '#C9C9A0' : D.P.bakteri, 1 - er);
    if (er > 0 && er < 1) for (let i = 0; i < 6; i++) ic += `<circle cx="${560 + Math.cos(i) * 60 * er}" cy="${850 - er * 90 - i * 10}" r="${10 * (1 - er)}" fill="#FFFFFF" opacity="${1 - er}"/>`;
    o += `<g opacity="${kd}">` + olc(D.mide(560, 760, 1.35, ic, t), 560, 760, .85 + .15 * kd) + `</g>`;
    const ac = pop(t, 6.6); if (ac > 0) o += grp(cip('MİDE ASİDİ', 0, 0, '#E8E86A', '#1B1640', 32), 780, 1150, ac);
  }
  o += gubi(t, { x: 930, y: 560, boy: 110, bakHedef: kd > 0 ? [560, 800] : [540, 780] });
  o += gufi(t, { x: 150, y: 1240, boy: 130, bakHedef: kd > 0 ? [560, 850] : [540, 780] });
  $('dinamik').innerHTML = o;
};"""
# 03 — Avustralya (gerçek harita), Warren & Marshall, mikroskopta sarmal bakteri
S[3] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 4.1, 4.6));
  if (g < 1) {
    let a = D.zemin('#CDEFFA', '#9ED9F0');
    const h = H.ciz({ ulkeler: H.ulke('Avustralya'), kutu: [150, 360, 780, 520], renk: '#F2C27A', rim: '#FFE7C2', sinir: false });
    a += olc(h.svg, 540, 620, pop(t, 0, .5) + .001);
    const [px, py] = h.p([115.86, -31.95]); const pp = pop(t, .6); if (pp > 0) a += grp(H.igne(0, 0, '#EE312E', 1, 'Perth'), px, py, pp);
    const w = pop(t, 1.7), m = pop(t, 2.8);
    if (w > 0) a += olc(D.warren({ x: 300, y: 1200, boy: 330 }), 300, 1200, w) + grp(cip('ROBIN WARREN', 0, 0, '#FFFFFF', '#1B1640', 24), 300, 1225, w);
    if (m > 0) a += olc(D.marshall({ x: 780, y: 1200, boy: 330 }), 780, 1200, m) + grp(cip('BARRY MARSHALL', 0, 0, '#FFFFFF', '#1B1640', 24), 780, 1225, m);
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = D.zemin('#FFE3EA', '#FFC7D3') + D.gorus(540, 760, 330 * (.6 + .4 * g), t, 7);
    const hp = pop(t, 8.0); if (hp > 0) b += grp(`<rect x="-330" y="-50" width="660" height="100" rx="50" fill="${D.P.bakteri}"/><text x="0" y="16" font-size="46" font-weight="900" font-style="italic" text-anchor="middle" style="fill:#1B1640">Helicobacter pylori</text>`, 540, 1180, hp);
    b += gubi(t, { x: 930, y: 1150, boy: 110, bakHedef: [540, 760] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 04 — kimse inanmadı; hayvan deneyi sonuç vermedi
S[4] = r"""
$('zemin').innerHTML = D.zemin('#FFF0DE', '#FFE0C0') + `<rect x="80" y="880" width="920" height="60" rx="30" fill="${D.P.ahsap}"/><rect x="120" y="940" width="40" height="260" rx="20" fill="${D.P.ahsapK}"/><rect x="920" y="940" width="40" height="260" rx="20" fill="${D.P.ahsapK}"/>`;
window.renderAt = t => {
  let o = '';
  const kay = E(A(t, 1.4, 1.9));
  let m = '';
  [[300, '#8FB8E0'], [540, '#B9A6E0'], [780, '#9FD3C1']].forEach(([x, r], i) => { m += D.siluet(x, 880, 1, r, 1); const p = pop(t, .2 + i * .2); if (p > 0) m += grp(`<circle r="46" fill="#EE312E"/><path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>`, x + 60, 620, p); });
  o += `<g transform="translate(${-1080 * kay} 0)">${m}</g>`;
  if (kay > 0) { o += `<g transform="translate(${1080 * (1 - kay)} 0)">` + D.domuz(540, 1150, 1.6, t) + `</g>`;
    const c = pop(t, 2.2); if (c > 0) o += grp(cip('✓ HASTALANMADI', 0, 0, '#6CC04A', '#FFFFFF', 34), 540, 560, c); }
  o += gufi(t, { x: 150, y: 1240, boy: 120, bakHedef: kay > 0 ? [540, 950] : [540, 700] });
  $('dinamik').innerHTML = o;
};"""
# 05 — 1984: Marshall bakteriyi içer
S[5] = r"""
$('zemin').innerHTML = D.zemin('#FFF3E2', '#FFE2BF', [760, 520, 800, '#FFFFFF', .5]) + D.pencere(700, 400, 260, 220);
window.renderAt = t => {
  let o = '';
  const tk = pop(t, .2); if (tk > 0) o += olc(D.takvim(260, 560, '1984', .8), 260, 560, tk);
  const s = 560 / 360, hy = 1260 - 250 * s, mx = 540, my = hy + 4 * s + 64 * s;
  o += olc(D.marshall({ x: 540, y: 1260, boy: 560, ifade: t > 5.5 && t < 7.3 ? 'notr' : 'gulumse', acik: t > 5.6 && t < 7.2 ? 0 : 1 }), 540, 1260, pop(t, .8, .5));
  const bp = pop(t, 3.3);
  if (bp > 0) { const ic = E(A(t, 5.3, 5.8)), bx = 820 + (mx + 70 - 820) * ic, by = 1180 + (my + 20 - 1180) * ic, rot = -48 * E(A(t, 5.6, 6.0));
    const sev = 1 - E(A(t, 5.9, 7.1));
    o += `<g transform="rotate(${rot} ${bx} ${by - 120})">` + D.bardak(bx, by, .8 * bp, sev, t) + `</g>`; }
  o += gufi(t, { x: 150, y: 1250, boy: 130, bakHedef: [640, 1000] });
  o += gubi(t, { x: 930, y: 760, boy: 110, bakHedef: [640, 1000] });
  $('dinamik').innerHTML = o;
};"""
# 06 — birkaç gün sonra kusma; endoskopi: mide içi iltihap + bakteri
S[6] = r"""
window.renderAt = t => {
  let o = '';
  const g = E(A(t, 2.0, 2.5));
  if (g < 1) {
    let a = D.zemin('#FFF3E2', '#FFE2BF');
    const gun = Math.min(9, 1 + Math.floor(t * 4.5));
    a += olc(D.takvim(540, 520, 'GÜN ' + gun, .75, '#6CC04A'), 540, 520, pop(t, 0, .4));
    a += D.marshall({ x: 540, y: 1250, boy: 480, ifade: 'saskin' });
    const s = 480 / 360; for (let i = 0; i < 3; i++) { const q = (t * 1.5 + i / 3) % 1; a += `<path d="M${680 + i * 20} ${880 - q * 80} q14 -12 0 -24 q-14 -12 0 -24" stroke="#6CC04A" stroke-width="9" fill="none" stroke-linecap="round" opacity="${1 - q}"/>`; }
    o += `<g opacity="${1 - g}">${a}</g>`;
  }
  if (g > 0) {
    let b = D.zemin('#FFB9C7', '#FF8FA6');
    for (let i = 0; i < 6; i++) { const y = 300 + i * 260; b += `<path d="M-20 ${y} Q180 ${y - 70 + 20 * Math.sin(t + i)} 380 ${y} T780 ${y} T1180 ${y} V${y + 200} H-20Z" fill="${i % 2 ? '#FFA3B6' : '#FF94AA'}"/>`; }
    const il = A(t, 2.6, 3.4);
    [[300, 700, 70], [720, 560, 90], [620, 980, 60], [260, 1100, 50]].forEach(([x, y, r], i) => { b += `<circle cx="${x}" cy="${y}" r="${r * il * (1 + .08 * Math.sin(t * 5 + i))}" fill="${D.P.iltihap}" opacity=".7"/><circle cx="${x}" cy="${y}" r="${r * .55 * il}" fill="#C21F3A" opacity=".6"/>`; });
    const bk = A(t, 4.4, 5.0); if (bk > 0) [[330, 690, 30], [700, 580, -40], [640, 990, 70], [280, 1090, 10], [800, 820, 120]].forEach(([x, y, r], i) => b += D.bakteri(x + 40, y - 30, .7 * bk, t + i, r));
    // endoskop hortumu + ışıklı uç
    const e = E(A(t, 2.4, 4.6)), ux = 560 + 40 * Math.sin(t), uy = -40 + 780 * e;
    b += `<path d="M560 -60 Q${520} ${uy * .5} ${ux} ${uy}" stroke="#2A2A36" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M560 -60 Q${520} ${uy * .5} ${ux} ${uy}" stroke="#4A4A5A" stroke-width="16" fill="none" stroke-linecap="round" transform="translate(6 -4)"/>` +
      K.glow({ x: ux, y: uy + 30, r: 200, renk: '#FFFFFF', guc: .6 }) + `<circle cx="${ux}" cy="${uy + 10}" r="18" fill="#FFFFFF"/>`;
    const fl = t > 5.0 ? Math.exp(-(t - 5.0) * 6) : 0; if (fl > 0) b += `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${fl * .8}"/>`;
    const c = pop(t, 5.1); if (c > 0) b += grp(cip('İLTİHAP + BAKTERİ', 0, 0, '#FFFFFF', D.P.iltihap, 32), 540, 1180, c);
    b += gubi(t, { x: 150, y: 1140, boy: 100, bakHedef: [ux, uy] });
    o += `<g opacity="${g}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 07 — tedavi: reçete değişir, kapsüller bakterileri kovalar
S[7] = r"""
$('zemin').innerHTML = D.zemin('#E6F6EF', '#C9EBDD');
window.renderAt = t => {
  let o = D.recete(540, 600, .95 * pop(t, 0, .45) + .001, E(A(t, 3.2, 3.9)), A(t, 5.2, 5.6));
  let ic = ''; const iy = E(A(t, 6.0, 7.0));
  ic += `<rect width="1080" height="1920" fill="#FFC9D4" opacity="${iy * .8}"/>`;
  [[480, 1030], [610, 980], [560, 1110]].forEach(([x, y], i) => { const k = A(t, 5.8 + i * .25, 6.2 + i * .25); if (k < 1) ic += D.bakteri(x, y, .5 * (1 - k) + .01, t + i, i * 60, D.P.bakteri, 1 - k); });
  for (let i = 0; i < 3; i++) { const k = E(A(t, 5.3 + i * .2, 6.1 + i * .2)); if (k > 0 && k < 1) ic += D.kapsul(900 - 380 * k, 800 + i * 110 + 60 * Math.sin(k * 6), -20 + i * 20, .8); }
  o += D.mide(540, 1060, .72, ic, t);
  o += gufi(t, { x: 160, y: 1240, boy: 120, bakHedef: [540, 1060] });
  o += uyari;
  $('dinamik').innerHTML = o;
};"""
# 08 — 21 yıl sonra: 2005 Nobel
S[8] = r"""
$('zemin').innerHTML = D.zemin('#FFF3D6', '#FFE09A', [540, 700, 700, '#FFFFFF', .6]) + `<path d="M0 0 H180 Q140 700 200 1920 H0Z" fill="${D.P.bordo}"/><path d="M1080 0 H900 Q940 700 880 1920 H1080Z" fill="${D.P.bordo}"/>`;
window.renderAt = t => {
  let o = '';
  const y = pop(t, .1); if (y > 0) o += grp(cip('1984 → 2005', 0, 0, D.P.bordo, '#FFFFFF', 34), 540, 400, y);
  o += olc(D.madalya(540, 720, 170, t * 2.2 * (1 - A(t, 1.2, 2.2)) + (t > 2.2 ? 0 : 0)), 540, 720, pop(t, .3, .5) + .001);
  const n = pop(t, .9); if (n > 0) o += grp(txt('NOBEL', 0, 0, 72, D.P.bordo), 540, 980, n);
  const w = pop(t, 1.2), m = pop(t, 1.4);
  if (w > 0) o += olc(D.warren({ x: 330, y: 1240, boy: 250, ifade: 'gulumse' }), 330, 1240, w);
  if (m > 0) o += olc(D.marshall({ x: 750, y: 1240, boy: 250 }), 750, 1240, m);
  o += gubi(t, { x: 540, y: 1140, boy: 90, bakHedef: [540, 720] });
  $('dinamik').innerHTML = o;
};"""
# 09 — kapanış: herkes yanılıyordu… hem de kendi midenle
S[9] = r"""
$('zemin').innerHTML = D.zemin('#FFF3E2', '#FFE2BF', [760, 520, 800, '#FFFFFF', .5]) +
  `<rect x="0" y="1130" width="1080" height="790" fill="${D.P.ahsap}"/><rect x="0" y="1130" width="1080" height="26" fill="#F2C48C"/>`;
window.renderAt = t => {
  let o = '';
  o += olc(D.marshall({ x: 330, y: 1130, boy: 520 }), 330, 1130, pop(t, 0, .45));
  o += D.bardak(700, 1140, 1.0, 0, t, false) + K.glow({ x: 700, y: 1000, r: 120, renk: '#FFE27A', guc: .5 + .3 * Math.sin(t * 3) });
  const k = pop(t, 1.2); if (k > 0) o += grp(txt('HERKES', 0, 0, 70, '#1B1640') + txt('YANILIYORDU', 0, 78, 70, D.P.iltihap), 700, 560, k, -3);
  // Gufi kendi karnına bakar
  o += gufi(t, { x: 900, y: 1250, boy: 150, bakHedef: t > 5.0 ? [900, 1400] : [700, 1000] });
  o += gubi(t, { x: 560, y: 1200, boy: 100, bakHedef: t > 5.0 ? [900, 1180] : [330, 800] });
  o += uyari;
  $('dinamik').innerHTML = o;
};"""
S[10] = open('_logo_sahne.js').read()
for k in range(1, 10): S[k] = UYARI + S[k]

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
