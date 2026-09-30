"""#6 Venüs — sahne HTML'lerini ve plan.json'u üretir (flat-bilim-animasyonu skill sözleşmesi).
Her sahne: t=0 = sahne başı; hareketler renderAt(t) içinde, sadece t'ye bağlı. Global zaman = SB + t."""
import json

SB = [0, 3.17, 6.30, 12.97, 17.67, 22.0, 26.66, 32.07, 40.15, 47.39, 49.5]

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/venus.js"></script>
<script src="../ortak/logo_paths.js"></script><script src="../ortak/altyazi.js"></script>
<script>
const $ = i => document.getElementById(i), A = K.aralik, E = K.ease;
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pop = (t, a, d = .45) => back(A(t, a, a + d));
const grp = (s, x, y, k = 1, r = 0, op = 1) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})" opacity="${op}">${s}</g>`;
const txt = (s, x, y, size, renk = '#FFF3D6', w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
__JS__
</script>
<script src="../ortak/kanal.js"></script>
</body></html>"""

S = {}
# 01 — Venüs önünde parti şapkalı Gufi + pasta
S[1] = r"""
$('zemin').innerHTML = V.bg({ nx: 300, ny: 300 }) + V.yildiz(3, 80);
window.renderAt = t => {
  let o = V.venus({ x: 540, y: 700, r: 300, faz: t * .05 });
  const gp = pop(t, .15);
  o += grp(M.gufi({ x: 0, y: 0, boy: 190, duygu: 'mutlu', kirp: -1 }) + V.sapka(0, -212, 1), 360, 1230 - Math.abs(Math.sin(t * 5)) * 16 * A(t, .5, .8), gp);
  o += grp(V.pasta({ x: 0, y: 0, s: 1.05, t }), 700, 1235, pop(t, .5));
  const R = K.rnd(9); for (let i = 0; i < 40; i++) { const st = .7 + R() * .8, d = t - st; if (d < 0) continue; const x = 540 + (R() - .5) * 900, y = -40 + d * (260 + R() * 200); o += `<rect x="${x}" y="${y}" width="16" height="9" rx="4" fill="${[V.PAL.mag, V.PAL.cyan, V.PAL.amber, '#FFF3D6'][i % 4]}" transform="rotate(${d * 200 * (R() - .5)} ${x} ${y})" opacity=".9"/>`; }
  // çıkış: sahne sonunda Venüs'e yakınlaş
  $('dinamik').innerHTML = o;
  const z = 1 + E(A(t, 2.75, 3.17)) * .25; $('dinamik').setAttribute('transform', `translate(540 700) scale(${z}) translate(-540 -700)`);
};"""
# 02 — 1 GÜN > 1 YIL kartları
S[2] = r"""
$('zemin').innerHTML = V.bg({ nx: 540, ny: 700, neb: V.PAL.cyan }) + V.yildiz(5, 70);
const kart = (y1, y2, renk, alt) => `<rect x="-190" y="-150" width="380" height="300" rx="56" fill="${renk}"/><rect x="-190" y="-150" width="60" height="300" rx="30" fill="#FFF3D6" opacity=".25"/>` + txt(y1, 0, 30, 130, '#0B1433') + txt(y2, 0, 110, 50, '#0B1433', 700);
window.renderAt = t => {
  let o = V.glowDaire(540, 760, 520, V.PAL.cyan, .25);
  const g = pop(t, 1.15), y = pop(t, 1.75), win = E(A(t, 2.2, 2.7));
  o += grp(kart('1', 'GÜN', V.PAL.cyan), 300, 760 + Math.sin(t * 2) * 8, g * (1 + .3 * win), -4 * (1 - win));
  o += grp(kart('1', 'YIL', V.PAL.amber), 790, 760 - Math.sin(t * 2) * 8, y * (1 - .22 * win), 5);
  o += txt('>', 545, 800, 150 * pop(t, 2.3), '#FFF3D6');
  o += grp(M.gubi({ x: 0, y: 0, boy: 150, duygu: 'saskin', bak: [-1, -.4], kirp: -2 }), 540, 1140 + Math.sin(t * 3) * 10, pop(t, .3));
  $('dinamik').innerHTML = o;
};"""
# 03 — Güneş etrafında yörünge: 225 gün = 1 yıl
S[3] = r"""
$('zemin').innerHTML = V.bg({ ust: '#1A1035', alt: '#3B1740', neb: V.PAL.gunes, nx: 540, ny: 720 }) + V.yildiz(7, 70);
window.renderAt = t => {
  const cx = 540, cy = 720, R = 330;
  let o = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#FFF3D6" stroke-opacity=".25" stroke-width="4" stroke-dasharray="6 18" stroke-linecap="round"/>`;
  o += V.gunes({ x: cx, y: cy, r: 120 * pop(t, 0, .6) + .01 });
  const p = E(A(t, .3, 4.8)), a = -Math.PI / 2 + p * Math.PI * 2;
  if (p > 0) { const L = 2 * Math.PI * R; o += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${V.PAL.amber}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${L * p} ${L}" transform="rotate(-90 ${cx} ${cy})" opacity=".9"/>`; }
  o += V.venus({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, r: 58, faz: t * .2, glow: false });
  const n = Math.round(225 * p);
  o += txt(n, 540, 1210, 150, '#FFF3D6') + txt('GÜN', 540, 1265, 40, V.PAL.amber, 700, 'class="mono" letter-spacing="8"');
  const yil = pop(t, 5.2); if (yil > 0) o += grp(`<rect x="-150" y="-50" width="300" height="100" rx="50" fill="${V.PAL.amber}"/>` + txt('= 1 YIL', 0, 22, 56, '#1A1035'), 870, 1150, yil);
  o += grp(M.gubi({ x: 0, y: 0, boy: 110, duygu: yil > 0 ? 'mutlu' : 'merak', bak: [1, -.5], kirp: -1 }), 180 + Math.sin(t) * 6, 1060, pop(t, .5));
  $('dinamik').innerHTML = o;
  const z = 1 + E(A(t, 6.2, 6.67)) * 1.6, vx = cx + Math.cos(a) * R, vy = cy + Math.sin(a) * R;
  $('dinamik').setAttribute('transform', `translate(${vx} ${vy}) scale(${z}) translate(${-vx} ${-vy})`);
};"""
# 04 — Kendi etrafında 243 gün: yakın plan + iki çubuk
S[4] = r"""
$('zemin').innerHTML = V.bg({ nx: 820, ny: 300 }) + V.yildiz(11, 70);
window.renderAt = t => {
  let o = V.venus({ x: 540, y: 690, r: 330, faz: t * .03 });
  // yüzeydeki bayrak (dönüşü göstermek için yavaşça kayar)
  const fx = 700 - t * 22; o += `<rect x="${fx}" y="${520 - 90}" width="8" height="90" rx="4" fill="#FFF3D6"/><path d="M${fx + 8} ${430} L${fx + 70} ${448} L${fx + 8} ${466}Z" fill="${V.PAL.mag}"/>`;
  o += grp(V.donusOku(0, 0, 400, 1, V.PAL.cyan, E(A(t, .3, 2.6))), 540, 690, 1, 0, .8);
  const bar = (y, et, renk, p, deger, yaz) => `<rect x="120" y="${y}" width="760" height="64" rx="32" fill="#FFF3D6" opacity=".12"/><rect x="120" y="${y}" width="${Math.max(64, 760 * p)}" height="64" rx="32" fill="${renk}"/>` +
      `<text class="mono" x="130" y="${y - 16}" font-size="30" style="fill:${renk}" letter-spacing="3">${et}</text><text x="${140 + 760 * p - 24}" y="${y + 46}" font-size="40" font-weight="900" text-anchor="end" style="fill:#0B1433">${yaz}</text>`;
  const py = E(A(t, .2, 1.2)) * (225 / 260), pg = E(A(t, .4, 4.3)) * (243 / 260);
  o += bar(1080, '1 YIL', V.PAL.amber, py, 225, Math.round(225 * E(A(t, .2, 1.2))));
  o += bar(1210, '1 GÜN', V.PAL.cyan, pg, 243, Math.round(243 * E(A(t, .4, 4.3))));
  const h = pop(t, 3.05); if (h > 0) o += grp(txt('243!', 0, 0, 90, V.PAL.cyan), 860, 1190, h);
  $('dinamik').innerHTML = o;
};"""
# 05 — Yarış: YIL bitişte, GÜN hâlâ yolda
S[5] = r"""
$('zemin').innerHTML = V.bg({ nx: 540, ny: 900, neb: V.PAL.amber }) + V.yildiz(13, 60);
window.renderAt = t => {
  let o = '';
  for (const y of [640, 900]) o += `<rect x="90" y="${y - 70}" width="900" height="140" rx="70" fill="#2E3A7A" opacity=".55"/>`;
  // bitiş çizgisi
  for (let i = 0; i < 8; i++) o += `<rect x="${860 + (i % 2) * 20}" y="${540 + i * 55}" width="20" height="55" fill="${i % 2 ? '#FFF3D6' : '#0B1433'}" opacity=".8"/>`;
  const yx = 170 + 700 * E(A(t, .1, 1.3)), gx = 170 + 420 * E(A(t, .1, 4.3)) + Math.sin(t * 8) * 4;
  const top = (x, y, et, renk, duygu) => `<g transform="translate(${x} ${y})">${K.kure({ x: 0, y: 0, r: 58, renk, rim: '#FFF3D6', golge: '#1E1B4B', isikYon: [1, -1] })}<text x="0" y="14" font-size="36" font-weight="900" text-anchor="middle" style="fill:#0B1433">${et}</text></g>`;
  o += top(yx, 640, 'YIL', V.PAL.amber); o += top(gx, 900, 'GÜN', V.PAL.cyan);
  o += grp(M.gubi({ x: 0, y: 0, boy: 120, duygu: A(t, 1.3, 1.4) > 0 ? 'mutlu' : 'merak', kirp: -1 }), 960, 440 - Math.abs(Math.sin(t * 7)) * 20 * A(t, 1.3, 1.5), pop(t, 1.1));
  o += grp(M.gufi({ x: 0, y: 0, boy: 120, duygu: 'saskin', bak: [-1, 0], kirp: -2 }), 250, 1180, pop(t, 2.0));
  const b = pop(t, 1.35); if (b > 0) o += grp(`<rect x="-120" y="-40" width="240" height="80" rx="40" fill="${V.PAL.amber}"/>` + txt('BİTTİ!', 0, 20, 48, '#0B1433'), 700, 470, b);
  const h = pop(t, 3.0); if (h > 0) o += grp(`<rect x="-150" y="-40" width="300" height="80" rx="40" fill="${V.PAL.cyan}"/>` + txt('HÂLÂ YOLDA', 0, 18, 40, '#0B1433'), 560, 1060, h);
  $('dinamik').innerHTML = o;
};"""
# 06 — Ters dönüş, sonra Güneş batıdan doğar
S[6] = r"""
$('zemin').innerHTML = V.bg({ nx: 540, ny: 700, neb: V.PAL.mag }) + V.yildiz(17, 70);
window.renderAt = t => {
  const k = E(A(t, 1.9, 2.3)); let o = '';
  if (k < 1) { let a = '';
    a += V.dunya({ x: 290, y: 700, r: 170 }) + V.donusOku(290, 700, 240, -1, V.PAL.cyan, E(A(t, .2, 1.3)));
    a += V.venus({ x: 790, y: 700, r: 170, glow: false }) + V.donusOku(790, 700, 240, 1, V.PAL.mag, E(A(t, .5, 1.6)));
    a += txt('DÜNYA', 290, 1000, 44, V.PAL.cyan, 700, 'class="mono"') + txt('VENÜS', 790, 1000, 44, V.PAL.mag, 700, 'class="mono"');
    const tr = pop(t, .9); if (tr > 0) a += grp(`<rect x="-150" y="-45" width="300" height="90" rx="45" fill="${V.PAL.mag}"/>` + txt('TERS!', 0, 22, 60, '#0B1433'), 790, 420, tr);
    o += `<g opacity="${1 - k}">${a}</g>`; }
  if (k > 0) { const sy = 1100 - 420 * E(A(t, 2.6, 4.4)); let b = V.yuzey(t, V.gunes({ x: 250, y: sy, r: 110 }));
    b += `<rect x="130" y="1000" width="16" height="170" rx="8" fill="#3B1740"/><rect x="60" y="960" width="200" height="80" rx="24" fill="#FFF3D6"/>` + txt('BATI', 160, 1015, 46, '#3B1740');
    b += `<rect x="934" y="1000" width="16" height="170" rx="8" fill="#3B1740"/><rect x="842" y="960" width="200" height="80" rx="24" fill="#FFF3D6" opacity=".7"/>` + txt('DOĞU', 942, 1015, 46, '#3B1740');
    b += grp(M.gufi({ x: 0, y: 0, boy: 130, duygu: 'saskin', bak: [-1, -1], kirp: -1 }), 620, 1235, pop(t, 3.2));
    o += `<g opacity="${k}">${b}</g>`; }
  $('dinamik').innerHTML = o;
};"""
# 07 — Takvim: 117 Dünya günü
S[7] = r"""
$('zemin').innerHTML = V.bg({ nx: 540, ny: 700, neb: V.PAL.cyan }) + V.yildiz(19, 60);
window.renderAt = t => {
  let o = V.glowDaire(540, 760, 480, V.PAL.amber, .25);
  const p = E(A(t, 3.3, 5.0)), n = Math.max(1, Math.round(117 * p));
  o += grp(V.takvim(0, 0, n, 'DÜNYA GÜNÜ'), 540, 760, pop(t, .15));
  // kopan yapraklar
  if (t > 3.3) { const R = K.rnd(4); for (let i = 0; i < 14; i++) { const st = 3.3 + i * .12, d = t - st; if (d < 0 || d > 1.0) continue; const x = 540 + (R() - .5) * 60 + d * (R() < .5 ? -1 : 1) * (500 + R() * 400), y = 700 - d * 400 + d * d * 1400; o += `<rect x="${x - 110}" y="${y - 90}" width="220" height="180" rx="24" fill="#FFF3D6" opacity="${.85 * (1 - d)}" transform="rotate(${d * 260 * (R() - .5)} ${x} ${y})"/>`; } }
  o += grp(M.gubi({ x: 0, y: 0, boy: 130, duygu: t < 3.3 ? 'merak' : 'saskin', bak: [1, -.5], kirp: -1 }), 190, 470 + Math.sin(t * 2.5) * 10, pop(t, .25));
  const q = pop(t, .5) * (1 - A(t, 3.1, 3.3)); if (q > 0) o += txt('?', 300, 380, 150 * q, V.PAL.amber);
  const et = pop(t, 5.0); if (et > 0) o += grp(`<rect x="-230" y="-50" width="460" height="100" rx="50" fill="${V.PAL.amber}"/>` + txt('SABAHTAN SABAHA', 0, 16, 44, '#0B1433'), 540, 1150, et);
  $('dinamik').innerHTML = o;
};"""
# 08 — Venüs'te kahvaltı: ~4 ay + 460 °C
S[8] = r"""
window.renderAt = t => {
  let o = V.yuzey(t, V.gunes({ x: 800, y: 500, r: 70 }));
  // masa
  const mp = pop(t, .2, .5);
  let masa = `<ellipse cx="0" cy="170" rx="330" ry="26" fill="#3B1740" opacity=".4"/><rect x="-300" y="-20" width="600" height="46" rx="23" fill="#8A4F7D"/><rect x="-250" y="20" width="36" height="150" rx="18" fill="#6B2A5E"/><rect x="214" y="20" width="36" height="150" rx="18" fill="#6B2A5E"/>` +
    `<ellipse cx="-60" cy="-26" rx="130" ry="30" fill="#FFF3D6"/>` + V.yumurta(-60, -34, E(A(t, 4.8, 6.0))) +
    `<rect x="120" y="-110" width="80" height="90" rx="20" fill="${V.PAL.cyan}"/><rect x="194" y="-90" width="34" height="46" rx="17" fill="none" stroke="${V.PAL.cyan}" stroke-width="12"/>`;
  // buhar / sıcak dalgaları
  const hs = A(t, 4.6, 5.2); for (let i = 0; i < 4; i++) { let d = 'M'; for (let k = 0; k <= 12; k++) { const y = -60 - k * 22, x = -100 + i * 60 + Math.sin(k * .8 + t * 6 + i) * 12; d += (k ? ' L' : '') + x + ' ' + y; } masa += `<path d="${d}" fill="none" stroke="#FFF3D6" stroke-width="8" stroke-linecap="round" opacity="${.5 * hs}"/>`; }
  o += grp(masa, 470, 1080, mp);
  const ay = pop(t, 2.4); if (ay > 0) o += grp(`<rect x="-200" y="-70" width="400" height="140" rx="70" fill="#1E1B4B" opacity=".85"/>` + txt('~4 AY', 0, 36, 100, V.PAL.amber), 400, 700, ay);
  const tp = E(A(t, 4.6, 6.4)); o += grp(V.termometre(0, 0, 460, tp), 930, 1180, pop(t, 4.5));
  if (tp > 0) o += txt(Math.round(460 * tp) + '°C', 900, 640, 72, '#FFF3D6');
  const gf = pop(t, 5.0); if (gf > 0) { o += grp(M.gufi({ x: 0, y: 0, boy: 150, duygu: 'saskin', bak: [1, -.3], kirp: -1 }), 150, 1235 + Math.sin(t * 30) * 2, gf);
    for (let i = 0; i < 3; i++) { const d = ((t * 1.2 + i / 3) % 1); o += `<ellipse cx="${210 + i * 18}" cy="${1060 + d * 80}" rx="8" ry="12" fill="${V.PAL.cyan}" opacity="${1 - d}"/>`; } }
  $('dinamik').innerHTML = o;
};"""
# 09 — Terazi: çok pasta vs tek sabah
S[9] = r"""
$('zemin').innerHTML = V.bg({ nx: 540, ny: 760, neb: V.PAL.mag }) + V.yildiz(23, 80);
window.renderAt = t => {
  let o = V.venus({ x: 540, y: 520, r: 150, faz: t * .05 });
  const npasta = Math.floor(A(t, 2.5, 4.4) * 6 + (t > 2.5 ? 1 : 0)), sabah = pop(t, 4.9);
  const tilt = Math.min(npasta, 6) * 2.2 - (sabah > 0 ? 3 : 0) + Math.sin(t * 2) * .6, ang = tilt * Math.PI / 180;
  const cx = 540, cy = 860, L = 330, lx = cx - Math.cos(ang) * L, ly = cy + Math.sin(ang) * L, rx = cx + Math.cos(ang) * L, ry = cy - Math.sin(ang) * L;
  o += `<rect x="${cx - 18}" y="${cy}" width="36" height="330" rx="18" fill="#2E3A7A"/><rect x="${cx - 140}" y="${cy + 310}" width="280" height="40" rx="20" fill="#2E3A7A"/>`;
  o += `<line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="#FFF3D6" stroke-width="20" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="24" fill="${V.PAL.amber}"/>`;
  const kefe = (x, y, ic) => `<line x1="${x}" y1="${y}" x2="${x - 90}" y2="${y + 140}" stroke="#FFF3D6" stroke-opacity=".6" stroke-width="6"/><line x1="${x}" y1="${y}" x2="${x + 90}" y2="${y + 140}" stroke="#FFF3D6" stroke-opacity=".6" stroke-width="6"/>` +
     `<path d="M${x - 130} ${y + 140} Q${x} ${y + 220} ${x + 130} ${y + 140}Z" fill="${V.PAL.cyan}"/>` + ic;
  let pc = ''; for (let i = 0; i < Math.min(npasta, 6); i++) { const k = pop(t, 2.5 + i * .31, .35); pc += grp(V.pasta({ x: 0, y: 0, s: .28, mum: 1, t }), lx - 70 + (i % 3) * 70, ly + 128 - Math.floor(i / 3) * 42, k); }
  o += kefe(lx, ly, pc);
  const sb = sabah > 0 ? grp(V.gunes({ x: 0, y: 0, r: 34 }) + `<rect x="-70" y="0" width="140" height="40" fill="${V.PAL.cyan}"/>`, rx, ry + 120, sabah) : '';
  o += kefe(rx, ry, sb);
  if (npasta > 0) o += txt('DOĞUM GÜNÜ', lx, ly - 40, 38, V.PAL.mag, 700, 'class="mono"');
  if (sabah > 0) o += txt('SABAH', rx, ry - 40, 38, V.PAL.amber, 700, 'class="mono"');
  o += grp(M.gubi({ x: 0, y: 0, boy: 110, duygu: t > 5.8 ? 'mutlu' : 'merak', bak: [1, 0], kirp: -1 }), 170, 1230 + Math.sin(t * 3) * 8, pop(t, .3));
  o += grp(M.gufi({ x: 0, y: 0, boy: 110, duygu: t > 5.8 ? 'mutlu' : 'saskin', bak: [-1, 0], kirp: -2 }), 910, 1260, pop(t, .5));
  $('dinamik').innerHTML = o;
  const z = 1 - .9 * E(A(t, 6.85, 7.24)); $('dinamik').setAttribute('transform', `translate(540 800) scale(${z}) translate(-540 -800)`);
};"""
# 10 — Kapanış: Gubi & Gufi logoya dönüşür
S[10] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#141112"/>`;
const LP = {}; for (const p of window.LOGO_PATHS) LP[p.id] = p;
const C = { g1: [44.5, 134.8], u1: [90.6, 128.5], b: [134.3, 121], i1: [165, 128], g2: [150.3, 180.6], u2: [196.4, 174.3], f: [230.1, 173], i2: [253.6, 174] };
const S = 620 / 233, OX = 475, OY = 860, scr = ([x, y]) => [(x - 141.5) * S + OX, (y - 141.5) * S + OY];
window.renderAt = t => {
  let o = `<g transform="translate(${OX} ${OY}) scale(${S}) translate(-141.5 -141.5)">`;
  Object.keys(C).forEach((k, i) => { const p = pop(t, .12 + i * .045, .38); if (p <= 0) return; const [cx, cy] = C[k];
    o += `<g transform="translate(${cx} ${cy + (1 - p) * 30}) scale(${p}) translate(${-cx} ${-cy})" opacity="${Math.min(1, p * 2)}"><path transform="${LP[k].t.replace('matrix', 'matrix')}" d="${LP[k].d}" fill="#F6F1E7"/></g>`; });
  const sp = A(t, .55, .7); o += `<g opacity="${sp}"><path transform="${LP.spark_big.t}" d="${LP.spark_big.d}" fill="#FBAC39"/><path transform="${LP.spark_small.t}" d="${LP.spark_small.d}" fill="#FBAC39"/><path transform="${LP.red_dot.t}" d="${LP.red_dot.d}" fill="#EE312E"/></g>`;
  o += `</g>`;
  // Gubi uçup pırıltıya, Gufi zıplayıp kırmızı kareye dönüşür
  const [bx, by] = scr([165, 92.2]), [rx, ry] = scr([253.6, 144.9]);
  const g = E(A(t, 0, .62)); if (g < 1) o += grp(M.gubi({ x: 0, y: 0, boy: 140, duygu: 'mutlu' }), 300 + (bx - 300) * g, 1250 + (by - 1250) * g - Math.sin(g * Math.PI) * 200, 1 - .7 * g, 0, 1 - A(t, .5, .62));
  const f = E(A(t, .1, .72)); if (f < 1) o += grp(M.gufi({ x: 0, y: 36, boy: 120, duygu: 'mutlu' }), 780 + (rx - 780) * f, 1290 + (ry - 1290) * f - Math.sin(f * Math.PI) * 320, 1 - .8 * f, 0, 1 - A(t, .6, .72));
  if (t > .55 && t < 1.2) o += V.glowDaire(bx, by, 160 * (1 - A(t, .55, 1.2)), '#FBAC39', .7);
  const fo = A(t, 1.8, 2.1); if (fo > 0) o += `<rect width="1080" height="1920" fill="#141112" opacity="${fo}"/>`;
  $('dinamik').innerHTML = o;
};"""

plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
for i in range(1, 11):
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__JS__", S[i])
    if i == 10: html = html.replace('<script src="../ortak/kanal.js"></script>', '')  # logo sahnesinde kanal katmanı yok
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]})
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
print("sahneler + plan.json yazıldı")
