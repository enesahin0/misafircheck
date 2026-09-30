"""#8 Limon suyu soyguncusu — sahne HTML'leri + plan.json + tepkiler.json (flat-bilim-animasyonu skill sözleşmesi).
Her sahne: t=0 = sahne başı; hareketler renderAt(t) içinde, sadece t'ye bağlı. Global zaman = SB + t.
Maskot tepkileri TEP'te tek yerde: hem sahnelere (M.canli) hem ses.py'ye (maskot_ses) gider."""
import json

SB = [0, 4.0, 7.4, 14.6, 22.4, 28.7, 30.9, 39.1, 45.6, 51.3, 56.53, 58.73]

# sahne → [(kim, yerel saniye, tepki)]
TEP = {
    1: [('gufi', .5, 'merak'), ('gufi', 3.3, 'kararli')],
    2: [('gufi', .15, 'zipla'), ('gufi', .8, 'zipla'), ('gufi', 1.45, 'zipla'), ('gufi', 2.55, 'mutlu')],
    3: [('gubi', 1.6, 'merak'), ('gubi', 3.2, 'sasir'), ('gufi', 5.0, 'kararli')],
    4: [('gufi', 2.0, 'zipla'), ('gufi', 4.3, 'mutlu'), ('gubi', 6.0, 'uzgun'), ('gufi', 6.4, 'sasir')],
    5: [('gufi', 1.0, 'sasir'), ('gufi', 3.45, 'korku')],
    6: [('gufi', .15, 'sasir')],
    7: [('gubi', .5, 'merak'), ('gubi', 6.3, 'aha')],
    8: [('gufi', 1.0, 'kararli'), ('gufi', 5.05, 'mutlu'), ('gubi', 5.5, 'uzgun')],
    9: [('gufi', 2.8, 'merak'), ('gubi', 3.3, 'merak')],
    10: [('gufi', .5, 'sasir'), ('gufi', 3.9, 'mutlu'), ('gubi', 3.6, 'selam')],
}

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/limon.js"></script>
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
# 01 — 1995: limon ikiye bölünür, Gufi yüzüne sürer
S[1] = r"""
$('zemin').innerHTML = L.bg({ nx: 540, ny: 700, neb: L.P.limon, no: .14 }) + L.parca(3, 60);
window.renderAt = t => {
  let o = '';
  const yil = pop(t, .25); if (yil > 0) o += grp(cip('1995', 0, 0, L.P.limon, '#0B1433', 44), 540, 400, yil);
  const lp = pop(t, .05, .5), ay = E(A(t, 1.2, 1.7));
  if (ay <= 0) o += olc(L.limon(540, 700, 170), 540, 700, lp * (1 + .03 * Math.sin(t * 4)));
  else {
    // sol yarı kalır, sağ yarı Gufi'ye uçar ve yüzüne sürülür
    o += L.dilim(540 - 120 * ay, 700 + 20 * ay, 150, -20 * ay);
    for (let i = 0; i < 4; i++) { const q = A(t, 1.4 + i * .3, 2.3 + i * .3); if (q > 0 && q < 1) o += L.damla(430 + i * 40, 800 + q * 300, 1, L.P.limon, 1 - q); }
    const u = E(A(t, 1.7, 2.3)), sur = A(t, 2.2, 3.4);
    const hx = 540 + 150 * ay + (560 - 540 - 150) * u + Math.sin(sur * Math.PI * 6) * 70 * (sur > 0 && sur < 1), hy = 700 + (1000 - 700) * u + Math.sin(sur * Math.PI * 3) * 40 * (sur > 0 && sur < 1);
    o += gufi(t, { x: 540, y: 1250, boy: 230, bakHedef: [hx, hy], ust: L.cila(540, 1250, 230, sur, t) });
    o += L.dilim(hx, hy, 120 * (1 - .15 * u), 30 - 60 * u);
    if (sur > 0 && sur < 1) for (let i = 0; i < 3; i++) o += L.damla(hx - 60 + i * 60, hy + 80 + ((t * 300 + i * 50) % 90), .7, L.P.limonA, .8);
  }
  if (ay <= 0) o += gufi(t, { x: 540, y: 1250, boy: 230, bakHedef: [540, 700] });
  $('dinamik').innerHTML = o;
};"""
# 02 — güpegündüz, maskesiz, iki banka
S[2] = r"""
window.renderAt = t => {
  let o = L.bg({ ust: L.P.gok1, alt: L.P.gok2, neb: '#FFE9B8', nx: 820, ny: 430, no: .35 });
  o += L.gunes(830, 440, 70, t) + L.bulut(260 + t * 18, 480, 1) + L.bulut(620 + t * 10, 560, .7, .8);
  o += `<rect x="0" y="1170" width="1080" height="750" fill="#5B6E9E"/><rect x="0" y="1170" width="1080" height="26" fill="#8FA2D0"/>`;
  o += L.banka(290, 1180, .8) + L.banka(790, 1180, .8);
  [[290, 1.85], [790, 2.2]].forEach(([x, a], i) => { const p = pop(t, a); if (p > 0) o += grp(`<circle r="54" fill="${L.P.kirmizi}"/>` + txt(i + 1, 0, 22, 64, '#FFF3D6'), x, 700, p); });
  const gx = 60 + 480 * E(A(t, 0, 2.1));
  o += gufi(t, { x: gx, y: 1300, boy: 170, bak: [.8, -.3], ust: L.cila(gx, 1300, 170, 1, t) });
  // üstü çizili maske: "maskesiz"
  const m = pop(t, .3) * (1 - A(t, 1.7, 1.95));
  if (m > 0) o += grp(`<path d="M-110 -10 Q-110 -50 -60 -50 Q0 -30 60 -50 Q110 -50 110 -10 Q110 40 60 40 Q20 40 0 10 Q-20 40 -60 40 Q-110 40 -110 -10Z" fill="#1B1640"/><circle cx="-55" cy="-5" r="20" fill="#5B6E9E"/><circle cx="55" cy="-5" r="20" fill="#5B6E9E"/><rect x="-140" y="-10" width="280" height="22" rx="11" fill="${L.P.kirmizi}" transform="rotate(-25)"/>`, gx, 1020, m);
  $('dinamik').innerHTML = o;
};"""
# 03 — görünmez mürekkep → "kameralara da görünmez olurum"
S[3] = r"""
$('zemin').innerHTML = L.bg({ ust: '#1A1330', alt: '#2A1A3A', neb: '#FFB547', nx: 540, ny: 800, no: .16 }) + L.parca(5, 40);
const HARF = 'GİZLİ';
window.renderAt = t => {
  let o = '';
  const k = E(A(t, 4.6, 5.3)), px = 540 - 250 * k, py = 700 - 120 * k, ps = 1 - .45 * k;
  let kg = `<rect x="-290" y="-210" width="580" height="420" rx="18" fill="#F3E9D2"/><rect x="-290" y="-210" width="70" height="420" rx="14" fill="#E0D2B4" opacity=".6"/>`;
  const yaz = A(t, 1.4, 2.6), isi = A(t, 2.9, 4.3);
  for (let i = 0; i < HARF.length; i++) { const x = -180 + i * 90, g = A(yaz, i / 5, (i + 1) / 5), b = A(isi, i / 6, (i + 1.5) / 6);
    if (g > 0) kg += `<text x="${x}" y="45" font-size="130" font-weight="900" text-anchor="middle" style="fill:${b > 0 ? L.P.kahve : '#E9DDC2'}" opacity="${b > 0 ? .25 + .75 * b : .5 * g}">${HARF[i]}</text>`; }
  if (yaz > 0 && yaz < 1) kg += L.damla(-180 + yaz * 360, -40, 1.2, L.P.limon);
  o += `<g transform="translate(${px} ${py}) rotate(-3) scale(${ps})">${kg}</g>`;
  // mum aşağıdan ısıtır
  const mm = pop(t, 2.6) * (1 - A(t, 4.4, 4.7)); if (mm > 0) { o += olc(L.mum(540, 1180, t), 540, 1180, mm); for (let i = 0; i < 3; i++) { const q = (t * .9 + i / 3) % 1; o += `<path d="M${500 + i * 40} ${960 - q * 60} q10 -15 0 -30 q-10 -15 0 -30" stroke="#FFB547" stroke-width="6" fill="none" stroke-linecap="round" opacity="${.5 * (1 - q) * mm}"/>`; } }
  if (k > 0) {
    // ok + güvenlik kamerası + "görünmez" Gufi
    o += `<g opacity="${k}"><path d="M430 560 Q540 500 600 560" stroke="#FFF3D6" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M615 575 L570 570 L600 535Z" fill="#FFF3D6"/></g>`;
    const kx = 830, ky = 520, ca = -25 + 8 * Math.sin(t * 1.5);
    o += olc(`<rect x="${kx + 40}" y="${ky - 150}" width="22" height="130" rx="11" fill="#5E6FB8"/><g transform="rotate(${ca + 180} ${kx} ${ky})"><rect x="${kx - 90}" y="${ky - 45}" width="180" height="90" rx="30" fill="#E8E2D6"/><circle cx="${kx - 90}" cy="${ky}" r="34" fill="#1E1B4B"/><circle cx="${kx - 90}" cy="${ky}" r="16" fill="${L.P.kirmizi}" opacity="${.5 + .5 * Math.sin(t * 6)}"/></g>`, kx, ky, pop(t, 4.9));
    const ghost = .5 + .2 * Math.sin(t * 5);
    o += `<g opacity="${ghost * k + (1 - k)}">` + gufi(t, { x: 760, y: 1130, boy: 200, bakHedef: [kx, ky], ust: L.cila(760, 1130, 200, 1, t) }) + `</g>`;
    const s = pop(t, 5.6); if (s > 0) o += grp(txt('?', 0, 0, 150, L.P.limon), 600, 900, s, 10 * Math.sin(t * 3));
  }
  o += gubi(t, { x: 190, y: 1130 - 40 * k, boy: 130, bakHedef: k > 0 ? [760, 1000] : [px, py] });
  $('dinamik').innerHTML = o;
};"""
# 04 — Polaroid testi: fotoğrafta yüz yok (kamera tavana bakıyormuş)
S[4] = r"""
$('zemin').innerHTML = L.bg({ ust: '#141B3F', alt: '#23204F', neb: L.P.limon, nx: 560, ny: 640, no: .1 }) + L.parca(7, 45);
window.renderAt = t => {
  let o = '';
  const rv = E(A(t, 5.1, 5.8)), camX = 590, camY = 1050, camR = -30 - 20 * rv;
  // gerçek tavan lambası (açıklama anı)
  if (rv > 0) { o += `<g transform="translate(0 ${-300 * (1 - rv)})">` + L.tavanLamba(830, 250, .9, 1) + `</g>`;
    o += `<path d="M${camX + 20} ${camY - 60} L${760} ${470} L${900} ${470}Z" fill="${L.P.limon}" opacity="${.18 * rv}"/>`;
    for (let i = 0; i < 6; i++) { const q = (i + (t * 2) % 1) / 6; o += `<circle cx="${camX + 20 + (830 - camX - 20) * q}" cy="${camY - 60 + (470 - camY + 60) * q}" r="7" fill="${L.P.limon}" opacity="${.8 * rv}"/>`; } }
  const fl = t > 2.0 ? Math.exp(-(t - 2.0) * 7) : 0;
  o += gufi(t, { x: 380, y: 1230, boy: 200, bakHedef: t < 2.4 ? [camX, camY] : t < 5.1 ? [560, 600] : [830, 440], ust: L.cila(380, 1230, 200, 1, t) });
  o += L.fotoMakine(camX, camY, .8 * pop(t, .1), camR, fl);
  // fotoğraf çıkar, uçar ve banyo olur
  const ej = E(A(t, 2.3, 2.9));
  if (ej > 0) {
    const fx = camX + (560 - camX) * ej - 280 * rv, fy = camY + (600 - camY) * ej - 100 * rv, fs = (.4 + .6 * ej) * (1 - .45 * rv);
    const ic = `<g transform="translate(${fx} ${fy}) scale(${fs})">${L.tavanLamba(0, -225, .8, 1)}</g>`;
    o += L.polaroid(fx, fy, fs, E(A(t, 2.9, 4.4)), ic, 0);
  }
  const yz = pop(t, 4.4) * (1 - A(t, 5.0, 5.2)); if (yz > 0) o += grp(cip('YÜZ YOK ✓', 0, 0, L.P.yesil, '#0B1433', 36), 560, 330, yz);
  if (rv > 0) o += gubi(t, { x: 870, y: 1080, boy: 140, bakHedef: t < 6.0 ? [830, 440] : [380, 1100] });
  $('dinamik').innerHTML = o;
};"""
# 05 — aynı gece haberlerde; polis kapıda
S[5] = r"""
$('zemin').innerHTML = L.bg({ ust: '#0B1433', alt: '#1E1B4B', neb: L.P.yesil, nx: 540, ny: 700, no: .1 }) + L.parca(9, 40)
  + `<rect x="80" y="330" width="220" height="200" rx="24" fill="#0B1024"/><circle cx="220" cy="400" r="40" fill="#FFF3D6"/><circle cx="238" cy="388" r="36" fill="#0B1024"/>`;
window.renderAt = t => {
  let o = '';
  const sc = `<rect x="160" y="480" width="760" height="460" fill="#123B30"/><rect x="200" y="560" width="220" height="300" rx="18" fill="#1F5A48"/><rect x="660" y="600" width="200" height="260" rx="18" fill="#1F5A48"/>`
    + `<g opacity=".92">` + M.gufi({ x: 540, y: 880, boy: 200, duygu: 'kararli', bak: [.3, .2], acik: 1 }) + L.cila(540, 880, 200, 1, t) + `</g>`
    + `<text class="mono" x="215" y="530" font-size="30" style="fill:${L.P.yesil}">● REC  19.04.1995</text>`
    + `<rect x="190" y="870" width="700" height="56" rx="10" fill="${L.P.kirmizi}"/><text x="${540 - ((t * 120) % 300) + 150}" y="910" font-size="34" font-weight="900" text-anchor="middle" style="fill:#FFF3D6">SON DAKİKA · SON DAKİKA</text>`;
  o += olc(L.tv(540, 710, .9, sc, t), 540, 710, pop(t, .05, .5));
  const vur = [3.2, 3.45, 3.7].reduce((m, a) => m + (t > a && t < a + .12 ? Math.sin((t - a) / .12 * Math.PI) : 0), 0);
  o += L.kapi(900, 1290, .75, vur * 10);
  o += gufi(t, { x: 260, y: 1290, boy: 170, bakHedef: t < 3.2 ? [540, 700] : [900, 1050], ust: L.cila(260, 1290, 170, 1, t) });
  if (t > 3.1) o += L.polisIsik(t, A(t, 3.1, 3.4));
  $('dinamik').innerHTML = o;
};"""
# 06 — "Ama ben limon suyu sürmüştüm!"
S[6] = r"""
$('zemin').innerHTML = L.bg({ nx: 540, ny: 900, neb: L.P.kirmizi, no: .12 }) + L.parca(11, 40);
window.renderAt = t => {
  let o = L.polisIsik(t, 1);
  const z = 1 + .06 * t;
  let g = gufi(t, { x: 540, y: 1330, boy: 400, bak: [0, .2], ust: L.cila(540, 1330, 400, 1, t) });
  o += olc(g, 540, 1100, z);
  const b = pop(t, .15, .4); if (b > 0) o += grp(L.balon(0, 0, 560, 250, [-1, 1]) + L.limon(-110, 0, 70) + txt('?!', 120, 50, 150, L.P.kirmizi), 560, 520, b, -3);
  $('dinamik').innerHTML = o;
};"""
# 07 — psikolog David Dunning okuyor: "beceriksiz olan fark edebilir mi?"
S[7] = r"""
$('zemin').innerHTML = L.bg({ ust: '#1B1236', alt: '#2A1845', neb: L.P.pembe, nx: 540, ny: 760, no: .18 }) + L.parca(13, 50);
window.renderAt = t => {
  let o = '';
  const cik = E(A(t, 3.7, 4.2));
  if (cik < 1) {
    const foto = M.gufi({ x: -120, y: 150, boy: 190, duygu: 'kararli', bak: [.2, 0], acik: 1 }) + L.cila(-120, 150, 190, 1, t);
    o += `<g opacity="${1 - cik}">` + L.gazete(540, 720 + 300 * cik, .78 * pop(t, 0, .5), -4, foto);
    const gz = E(A(t, .8, 1.5)); if (gz > 0) o += L.gozluk(540, 300 + 620 * gz, .85, .5 + .5 * Math.sin(t * 2));
    o += `</g>`;
    const d = pop(t, 1.3) * (1 - cik); if (d > 0) o += grp(cip('PSİKOLOG · DAVID DUNNING', 0, 0, L.P.pembe, '#FFF3D6', 30), 540, 1120, d);
  }
  if (t > 3.8) {
    // dağınık baloncuklar birleşip dev "?" olur
    const R = K.rnd(21), q = E(A(t, 3.8, 5.0)), pts = [];
    for (let i = 0; i < 26; i++) { const a = i / 26; let x, y; if (a < .72) { const ang = Math.PI * 1.05 - a / .72 * Math.PI * 1.55; x = 540 + Math.cos(ang) * 150; y = 560 - Math.sin(ang) * 150 + (ang < -.2 ? (-.2 - ang) * 120 : 0); } else { x = 540 + 10; y = 760 + (a - .72) / .28 * 90; } pts.push([x, y]); }
    pts.forEach(([x, y], i) => { const sx = R() * 1080, sy = 300 + R() * 1000; o += `<circle cx="${sx + (x - sx) * q}" cy="${sy + (y - sy) * q}" r="${26 + 6 * Math.sin(t * 3 + i)}" fill="${i % 3 ? L.P.pembe : '#FF8AD8'}"/>`; });
    const nk = pop(t, 5.0); if (nk > 0) o += `<circle cx="550" cy="930" r="${40 * nk}" fill="${L.P.pembe}"/>` + K.glow({ x: 540, y: 700, r: 420, renk: L.P.pembe, guc: .35 * nk });
    const b1 = pop(t, 4.2); if (b1 > 0) o += grp(cip('BECERİKSİZ', 0, 0, '#FFF3D6', '#2A1845', 36), 540, 1080, b1);
    const b2 = pop(t, 6.2); if (b2 > 0) o += grp(cip('FARK EDER Mİ?', 0, 0, L.P.limon, '#2A1845', 36), 540, 1185, b2);
  }
  o += gubi(t, { x: 870, y: 1060, boy: 130, bakHedef: t < 3.8 ? [540, 600] : [540, 650] });
  $('dinamik').innerHTML = o;
};"""
# 08 — en düşük puanlılar kendini ortalamanın üstünde sandı
S[8] = r"""
$('zemin').innerHTML = L.bg({ nx: 540, ny: 800, neb: L.P.pembe, no: .14 }) + L.parca(15, 45);
window.renderAt = t => {
  let o = '';
  const c = pop(t, .2); if (c > 0) o += grp(cip('KRUGER & DUNNING · 1999', 0, 0, '#FFF3D6', '#1E1B4B', 30), 540, 400, c);
  const Y0 = 1180, H = 640, ort = Y0 - H * .5;
  o += `<rect x="150" y="${Y0}" width="780" height="10" rx="5" fill="#5E6FB8"/>`;
  const ol = A(t, .6, 1.2); for (let x = 150; x < 150 + 780 * ol; x += 44) o += `<rect x="${x}" y="${ort - 4}" width="26" height="8" rx="4" fill="#FFF3D6" opacity=".7"/>`;
  if (ol > 0) o += `<text class="mono" x="150" y="${ort - 20}" font-size="26" text-anchor="start" letter-spacing="2" style="fill:#FFF3D6" opacity="${ol}">ORTALAMA</text>`;
  const h1 = H * .12 * E(A(t, 1.5, 2.4)), h2 = H * .62 * E(A(t, 3.8, 5.4));
  o += `<rect x="270" y="${Y0 - h1}" width="180" height="${Math.max(1, h1)}" rx="${Math.min(30, h1 / 2)}" fill="${L.P.yesil}"/><rect x="630" y="${Y0 - h2}" width="180" height="${Math.max(1, h2)}" rx="${Math.min(30, h2 / 2)}" fill="${L.P.pembe}"/>`;
  o += `<text class="mono" x="360" y="1240" font-size="30" text-anchor="middle" letter-spacing="2" style="fill:${L.P.yesil}">GERÇEK</text><text class="mono" x="720" y="1240" font-size="30" text-anchor="middle" letter-spacing="2" style="fill:${L.P.pembe}">TAHMİN</text>`;
  if (h2 > H * .5) o += K.glow({ x: 720, y: ort, r: 160, renk: L.P.pembe, guc: .5 * A(h2, H * .5, H * .56) });
  const gy = Y0 - h2;
  o += gufi(t, { x: 720, y: gy, boy: 140, bakHedef: t < 5 ? [720, gy - 300] : [360, Y0 - h1], ust: L.cila(720, gy, 140, 1, t) });
  o += gubi(t, { x: 360, y: Y0 - h1 - 90, boy: 110, bakHedef: [720, gy - 80] });
  $('dinamik').innerHTML = o;
};"""
# 09 — Dunning-Kruger etkisi; bilim hâlâ tartışıyor (terazi)
S[9] = r"""
$('zemin').innerHTML = L.bg({ ust: '#1B1236', alt: '#1E1B4B', neb: L.P.pembe, nx: 540, ny: 600, no: .2 }) + L.parca(17, 50);
window.renderAt = t => {
  let o = '';
  const k = pop(t, .15, .5); if (k > 0) o += grp(`<rect x="-360" y="-120" width="720" height="240" rx="60" fill="${L.P.pembe}"/><rect x="-360" y="-120" width="720" height="60" rx="30" fill="#FF9BE3" opacity=".45"/>` + txt('DUNNING–KRUGER', 0, -8, 76, '#FFF3D6') + txt('ETKİSİ', 0, 78, 60, '#2A1845'), 540, 520, k);
  const tz = pop(t, 2.5, .5);
  if (tz > 0) { const aci = 12 * Math.sin((t - 2.5) * 2.2) * A(t, 2.5, 3.0);
    const sol = `<rect x="PX" y="PY" width="1" height="1" fill="none"/>` , ic1 = `<g transform="translate(PX PY)"><rect x="-50" y="-60" width="34" height="60" rx="10" fill="${L.P.yesil}"/><rect x="10" y="-100" width="34" height="100" rx="10" fill="${L.P.pembe}"/></g>`;
    const ic2 = `<g transform="translate(PX PY)"><text x="0" y="0" font-size="100" font-weight="900" text-anchor="middle" style="fill:${L.P.limon}">?</text></g>`;
    o += olc(L.terazi(540, 790, aci, ic1, ic2), 540, 1000, tz);
    const sL = [540 - 260 * Math.cos(aci * Math.PI / 180), 790 - 260 * Math.sin(aci * Math.PI / 180) + 110], sR = [1080 - sL[0], 1580 - sL[1]];
    const hedef = Math.sin((t - 2.5) * 2.2) > 0 ? sL : sR;
    o += gubi(t, { x: 150, y: 1150, boy: 120, bakHedef: hedef });
    o += gufi(t, { x: 930, y: 1260, boy: 130, bakHedef: hedef, ust: L.cila(930, 1260, 130, 1, t) });
  } else { o += gubi(t, { x: 150, y: 1150, boy: 120, bakHedef: [540, 520] }); o += gufi(t, { x: 930, y: 1260, boy: 130, bakHedef: [540, 520], ust: L.cila(930, 1260, 130, 1, t) }); }
  $('dinamik').innerHTML = o;
};"""
# 10 — ayna: emin olmak ≠ bilmek
S[10] = r"""
$('zemin').innerHTML = L.bg({ nx: 540, ny: 700, neb: L.P.limon, no: .12 }) + L.parca(19, 50);
window.renderAt = t => {
  let o = '';
  const mx = 770, my = 660, ap = pop(t, .05, .5);
  let ay = `<ellipse cx="${mx}" cy="${my}" rx="215" ry="295" fill="#C98A3A"/><ellipse cx="${mx}" cy="${my}" rx="190" ry="270" fill="#2C3A78"/><ellipse cx="${mx}" cy="${my}" rx="190" ry="270" fill="#8FA2F0" opacity=".25"/>`;
  // yansıma: aynadaki Gufi (ters), limon parıl parıl
  ay += `<defs><clipPath id="ayc"><ellipse cx="${mx}" cy="${my}" rx="190" ry="270"/></clipPath></defs><g clip-path="url(#ayc)"><g transform="translate(${2 * mx} 0) scale(-1 1)">` + gufi(t, { x: mx, y: 900, boy: 230, bakHedef: [mx + 400, 700], ust: L.cila(mx, 900, 230, 1, t) }) + `</g>` + K.glow({ x: mx, y: 720, r: 200, renk: L.P.limon, guc: .35 + .2 * Math.sin(t * 4) }) + `</g>`;
  ay += `<path d="M${mx + 90} ${my - 200} L${mx + 140} ${my - 120}" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" opacity=".5"/>`;
  o += olc(ay, mx, my, ap);
  o += gufi(t, { x: 330, y: 960, boy: 210, bakHedef: [mx, my], ust: L.cila(330, 960, 210, 1, t) });
  if (t > 3.4) o += gubi(t, { x: 190, y: 560, boy: 110, bakHedef: [330, 850] });
  const a1 = pop(t, 1.6); if (a1 > 0) o += grp(txt('EMİN OLMAK', 0, 0, 92, L.P.limon), 540, 1110, a1);
  const a2 = pop(t, 3.2); if (a2 > 0) o += grp(txt('≠ BİLMEK', 0, 0, 92, '#FFF3D6'), 540, 1225, a2);
  $('dinamik').innerHTML = o;
};"""
S[11] = open('_logo_sahne.js').read()

plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
tum = []
for i in range(1, 12):
    tp = {'gubi': [[a, b] for k, a, b in TEP.get(i, []) if k == 'gubi'], 'gufi': [[a, b] for k, a, b in TEP.get(i, []) if k == 'gufi']}
    tum += [[k, round(SB[i - 1] + a, 3), b] for k, a, b in TEP.get(i, [])]
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__TP__", json.dumps(tp)).replace("__JS__", S[i])
    if i == 11: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]})
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
json.dump(sorted(tum, key=lambda r: r[1]), open("tepkiler.json", "w"), ensure_ascii=False)
print("sahneler + plan.json + tepkiler.json yazıldı")
