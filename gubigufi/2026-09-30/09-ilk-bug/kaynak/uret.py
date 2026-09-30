"""#9 İlk bug — sahne HTML'leri + plan.json + tepkiler.json (flat-bilim-animasyonu skill sözleşmesi).
Maskot tepkileri TEP'te tek yerde: hem sahnelere (M.canli) hem ses.py'ye (maskot_ses) gider."""
import json

SB = [0, 7.2, 14.9, 22.4, 29.5, 41.2, 45.7, 50.6, 56.11, 58.31]

TEP = {
    1: [('gufi', 2.3, 'sasir'), ('gubi', 4.4, 'merak'), ('gufi', 6.05, 'zipla')],
    2: [('gubi', 2.6, 'sasir'), ('gubi', 6.0, 'korku')],
    3: [('gufi', 1.0, 'korku'), ('gubi', 5.4, 'sasir'), ('gufi', 5.6, 'sasir')],
    4: [('gubi', 1.7, 'zipla'), ('gubi', 4.6, 'aha'), ('gufi', 5.2, 'mutlu')],
    5: [('gufi', 1.4, 'mutlu'), ('gubi', 3.7, 'merak'), ('gubi', 7.2, 'kararli'), ('gufi', 9.6, 'sasir')],
    6: [('gufi', 2.9, 'selam'), ('gubi', 3.2, 'mutlu')],
    7: [('gubi', .6, 'merak'), ('gufi', 1.6, 'zipla'), ('gufi', 2.3, 'zipla'), ('gufi', 3.4, 'sasir')],
    8: [('gubi', 4.35, 'mutlu'), ('gufi', 4.5, 'selam')],
}


HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/bug.js"></script>
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
# 01 — hata veren ekrandan güve çıkar, açık deftere konar, bantlanır
S[1] = r"""
$('zemin').innerHTML = B.bg({ nx: 540, ny: 620, neb: B.P.cyan, no: .16 }) + B.parca(3, 50);
const yol = u => [540 + Math.sin(u * 7) * 180 * (1 - u) + (560 - 540) * u, 560 + (1000 - 560) * u - Math.sin(u * Math.PI) * 180];
window.renderAt = t => {
  let o = '';
  const h = E(A(t, .5, 1.3)), fl = h > 0 ? (.75 + .25 * Math.sin(t * 20)) : 0;
  let ic = B.kod(290, 380, 500, t, h);
  if (h > 0) ic += `<g opacity="${fl}"><rect x="340" y="700" width="400" height="84" rx="42" fill="${B.P.kirmizi}"/>` + txt('⚠ HATA', 540, 758, 50, '#FFF3D6') + `</g>`;
  o += olc(B.ekran(540, 560, 600, 400, ic), 540, 560, pop(t, 0, .5));
  // defter açılır
  const dp = pop(t, 4.2, .5);
  if (dp > 0) o += `<g transform="translate(560 1020) scale(${.62 * dp}) rotate(-3)">` + B.defter(B.elYazi('9/9', -200, -220, 1, 40)) + `</g>`;
  // güve: ekrandan çıkar → uçar → deftere konar
  const u = E(A(t, 2.1, 5.6));
  let gx, gy, kan = t * 3.2, gr = 0;
  if (t < 5.6) { [gx, gy] = yol(u); gr = 20 * Math.sin(t * 3); } else { gx = 560; gy = 1000; kan = .5; }
  if (t > 2.0) o += B.guve(gx, gy, .7 * Math.min(1, A(t, 2.0, 2.4) + .2), kan, gr);
  const bp = A(t, 5.95, 6.1); if (bp > 0) o += `<g transform="translate(560 1020) scale(.62) rotate(-3)">` + B.bant(0, -25, 300 * bp + 20, -8) + `</g>`;
  const hedef = t > 2.0 ? [gx, gy] : [540, 560];
  o += gufi(t, { x: 150, y: 1250, boy: 140, bakHedef: hedef });
  o += gubi(t, { x: 935, y: 1150, boy: 110, bakHedef: hedef });
  $('dinamik').innerHTML = o;
};"""
# 02 — 9 Eylül 1947, Harvard: oda büyüklüğünde Mark II; lambalar kırmızıya döner
S[2] = r"""
$('zemin').innerHTML = B.bg({ ust: '#06151A', alt: '#0B242B', nx: 540, ny: 800, no: .12 }) + B.parca(5, 30);
window.renderAt = t => {
  let o = '';
  const alarm = E(A(t, 5.6, 6.8)), sars = alarm > 0 ? Math.sin(t * 60) * 3 * alarm : 0;
  let m = B.makine(t, alarm, 60, 570, 960, 600);
  m += `<rect x="370" y="470" width="340" height="70" rx="35" fill="#0B2A31"/>` + `<text class="mono" x="540" y="518" font-size="40" text-anchor="middle" letter-spacing="8" style="fill:${B.P.cyan}">MARK II</text>`;
  if (alarm > 0) m += K.glow({ x: 540, y: 800, r: 700, renk: B.P.kirmizi, guc: .3 * alarm * (.6 + .4 * Math.sin(t * 8)) });
  m += gubi(t, { x: 540, y: 1120, boy: 70, bakHedef: alarm > 0 ? [540, 700] : [300 + t * 60, 600] });
  const z = 2.4 - 1.4 * E(A(t, .3, 2.8));
  o += `<g transform="translate(${sars} 0) translate(540 900) scale(${z}) translate(-540 ${-900 + (z - 1) * 60})">${m}</g>`;
  const c = pop(t, .2); if (c > 0) o += grp(cip('9 EYLÜL 1947 · HARVARD', 0, 0, B.P.krem, '#0B2A31', 32), 540, 395, c);
  const oda = pop(t, 3.0) * (1 - A(t, 5.3, 5.6)); if (oda > 0) o += grp(cip('ODA BÜYÜKLÜĞÜNDE', 0, 0, B.P.cyan, '#0B2A31', 30), 540, 1235, oda);
  if (alarm > 0) { const e = pop(t, 5.7); o += grp(cip('HATA · HATA · HATA', 0, 0, B.P.kirmizi, '#FFF3D6', 30), 540, 1235, e); }
  $('dinamik').innerHTML = o;
};"""
# 03 — karanlık makine içi, el feneriyle arama; Röle 70'te güve
S[3] = r"""
$('zemin').innerHTML = B.bg({ ust: '#0A1E24', alt: '#0F2F38', no: .06 });
const RL = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) RL.push([195 + c * 230, 470 + r * 230, 55 + r * 4 + c * 1 + (r > 1 ? 5 : 0)]);
const HEDEF = 9; RL[HEDEF][2] = 70;
const YOL = [[260, 520], [800, 560], [680, 950], [300, 1000], [RL[HEDEF][0], RL[HEDEF][1]]];
window.renderAt = t => {
  let sahne = '';
  for (let i = 0; i < RL.length; i++) { const [x, y, no] = RL[i]; sahne += B.role(x, y, 1, t, no, i, i === HEDEF); }
  const gv = RL[HEDEF]; sahne += B.guve(gv[0] + 10, gv[1] - 10, .55, .15 + .05 * Math.sin(t * 20) * A(t, 5.4, 5.6), -30);
  // fener noktası
  const u = A(t, .3, 5.2) * (YOL.length - 1), k = Math.min(YOL.length - 2, Math.floor(u)), f = E(u - k);
  let sx = YOL[k][0] + (YOL[k + 1][0] - YOL[k][0]) * f, sy = YOL[k][1] + (YOL[k + 1][1] - YOL[k][1]) * f;
  const fx = 190, fy = 1150, sr = 150 + 40 * E(A(t, 5.2, 5.8));
  const zoom = 1 + .35 * E(A(t, 6.0, 7.4));
  let o = `<g transform="translate(${gv[0]} ${gv[1]}) scale(${zoom}) translate(${-gv[0]} ${-gv[1]})">` + sahne +
    `<defs><mask id="fm"><rect width="1080" height="1920" fill="#fff"/><circle cx="${sx}" cy="${sy}" r="${sr}" fill="#000"/><path d="M${fx} ${fy} L${sx - sr * .9} ${sy + sr * .3} L${sx + sr * .3} ${sy + sr * .9}Z" fill="#000" opacity=".5"/></mask></defs>` +
    `<rect width="1080" height="1920" fill="#02080B" opacity=".9" mask="url(#fm)"/>` + K.glow({ x: sx, y: sy, r: sr * 1.3, renk: B.P.amber, guc: .35 }) + `</g>`;
  if (t > 5.3) o += K.glow({ x: gv[0], y: gv[1], r: 200, renk: '#FFFFFF', guc: .5 * (1 - A(t, 5.3, 6.2)) });
  const rc = pop(t, 3.1); if (rc > 0) o += grp(cip('RÖLE 70', 0, 0, B.P.amber, '#0B2A31', 34), 540, 360, rc);
  // Gubi feneri tutar
  const fener = `<g transform="rotate(${Math.atan2(sy - fy, sx - fx) * 180 / Math.PI} ${fx} ${fy})"><rect x="${fx}" y="${fy - 22}" width="90" height="44" rx="16" fill="#C9D3E0"/><rect x="${fx + 80}" y="${fy - 32}" width="30" height="64" rx="12" fill="${B.P.amber}"/></g>`;
  o += fener + gubi(t, { x: fx - 40, y: fy + 20, boy: 120, bakHedef: [sx, sy] });
  o += gufi(t, { x: 360, y: 1290, boy: 120, bakHedef: t < 5.4 ? [fx, fy] : [gv[0], gv[1]] });
  $('dinamik').innerHTML = o;
};"""
# 04 — cımbız + bant + el yazısı not
S[4] = r"""
$('zemin').innerHTML = B.bg({ ust: '#1A2A2E', alt: '#10262C', neb: B.P.amber, nx: 540, ny: 760, no: .14 }) + B.parca(7, 30, B.P.krem);
const DX = 540, DY = 760, DS = 1.18;
window.renderAt = t => {
  let ic = B.elYazi('9/9', -200, -220, 1, 40) + B.elYazi('1545', -330, -40, 1, 34);
  const u = E(A(t, .1, 1.3)), gx = 300 + (-130 - 300) * u, gy = -500 + (-40 + 500) * u;
  ic += B.guve(gx, gy, .7, t < 1.3 ? t * 3 : 0, -20 + 20 * u);
  const bp = A(t, 1.55, 1.75); if (bp > 0) ic += B.bant(-130, -60, 60 + 280 * bp, -10);
  ic += B.elYazi('Relay #70 Panel F', 20, -120, A(t, 2.4, 3.4), 36);
  ic += B.elYazi('(moth) in relay.', 20, -74, A(t, 3.2, 3.9), 36);
  ic += B.elYazi('First actual case of bug', -200, 90, A(t, 4.4, 5.6), 44);
  ic += B.elYazi('being found.', -200, 146, A(t, 5.5, 6.1), 44);
  let o = `<g transform="translate(${DX} ${DY}) scale(${DS * pop(t, 0, .4)}) rotate(-2)">` + B.defter(ic) + `</g>`;
  // cımbız güveyi taşır
  if (t < 1.6) { const tx = DX + (gx * DS), ty = DY + (gy * DS); o += B.cimbiz(tx, ty - 20, 35, u > .95 ? A(t, 1.25, 1.45) : 0); }
  else if (t < 2.1) o += `<g opacity="${1 - A(t, 1.6, 2.1)}">` + B.cimbiz(DX - 130 * DS + 80 * A(t, 1.6, 2.1), DY - 60 * DS - 100 * A(t, 1.6, 2.1), 35, 1) + `</g>`;
  const tr = pop(t, 4.5); if (tr > 0) o += grp(cip('“GERÇEK BİR BÖCEK”', 0, 0, B.P.amber, '#0B2A31', 32), 540, 1180, tr);
  o += gubi(t, { x: 930, y: 420, boy: 110, bakHedef: t < 4.3 ? [DX + gx * DS, DY + gy * DS] : [540, 870] });
  o += gufi(t, { x: 140, y: 1250, boy: 120, bakHedef: [540, 860] });
  $('dinamik').innerHTML = o;
};"""
# 05 — "gerçek" bir espri → zaman geri akar → 1878 Edison, "bugs"
S[5] = r"""
window.renderAt = t => {
  let o = '';
  const ga = E(A(t, 3.3, 4.1));
  // A: defter yakın plan, "actual" kelimesi göz kırpar
  if (ga < 1) {
    let a = B.bg({ ust: '#1A2A2E', alt: '#10262C', neb: B.P.amber, no: .14 });
    let ic = B.elYazi('First actual case of bug', -200, 90, 1, 44) + B.elYazi('being found.', -200, 146, 1, 44);
    const hl = pop(t, .3); ic += `<rect x="-60" y="${90 - 36}" width="${150 * hl}" height="52" rx="12" fill="${B.P.amber}" opacity=".45"/>`;
    a += `<g transform="translate(560 760) scale(1.5) rotate(-2)">` + B.defter(ic) + `</g>`;
    const w = pop(t, 1.0); if (w > 0) a += grp(`<circle r="70" fill="${B.P.amber}"/><path d="M-30 -10 Q-18 -24 -6 -10" stroke="#0B2A31" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="10" y="-16" width="26" height="9" rx="4.5" fill="#0B2A31"/><path d="M-26 18 Q0 40 26 18" stroke="#0B2A31" stroke-width="9" fill="none" stroke-linecap="round"/>`, 700, 520, w, 10 * Math.sin(t * 4));
    const s = pop(t, 1.2); if (s > 0) a += grp(cip('BİR ŞAKA', 0, 0, B.P.krem, '#0B2A31', 34), 700, 380, s);
    a += gufi(t, { x: 180, y: 1250, boy: 130, bakHedef: [700, 520] });
    o += `<g opacity="${1 - ga}">${a}</g>`;
  }
  if (ga > 0) {
    // B: zaman şeridi 1947 → 1878
    const yil = Math.round(1947 - 69 * E(A(t, 3.6, 6.2)));
    let b = B.bg({ ust: '#221A12', alt: '#2E2216', neb: B.P.amber, nx: 360, ny: 760, no: .2 }) + B.parca(9, 40, B.P.amber);
    const kay = E(A(t, 3.6, 6.2));
    for (let i = -2; i < 12; i++) { const x = 540 + (i * 160) - ((kay * 69 * 160 / 10) % 160); b += `<rect x="${x - 3}" y="${1180}" width="6" height="${i % 5 === 0 ? 40 : 22}" rx="3" fill="#FFF3D6" opacity=".4"/>`; }
    b += `<rect x="60" y="1176" width="960" height="6" rx="3" fill="#FFF3D6" opacity=".3"/>`;
    const son = A(t, 6.2, 6.6);
    b += `<g opacity="${1 - son * .0}">` + txt(yil, 540 - 250 * E(A(t, 6.4, 7.0)), 520 - 80 * E(A(t, 6.4, 7.0)), 170 - 60 * E(A(t, 6.4, 7.0)), B.P.amber) + `</g>`;
    if (t < 6.4) b += `<path d="M300 700 L200 700 M230 670 L200 700 L230 730" stroke="${B.P.krem}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>`;
    const ed = A(t, 6.5, 7.1);
    if (ed > 0) {
      b += olc(B.ampul(300, 760, .9, .5 + .5 * Math.sin(t * 2.3) * .3 + .2, t), 300, 760, back(ed));
      b += B.mektup(720, 830, .72 * back(A(t, 6.8, 7.4)), 4, A(t, 8.6, 9.2), E(A(t, 9.3, 10.2)));
      const ch = pop(t, 7.0); if (ch > 0) b += grp(cip('EDISON · 1878', 0, 0, B.P.amber, '#2E2216', 32), 300, 1080, ch);
    }
    b += gubi(t, { x: 150, y: 1270, boy: 100, bakHedef: ed > 0 ? [720, 830] : [540, 520] });
    b += gufi(t, { x: 930, y: 1290, boy: 110, bakHedef: ed > 0 ? [720, 830] : [540, 520] });
    o += `<g opacity="${ga}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 06 — hikâyeyi yayan Grace Hopper: balonlar dünyayı sarar
S[6] = r"""
$('zemin').innerHTML = B.bg({ nx: 540, ny: 780, neb: B.P.cyan, no: .2 }) + B.parca(11, 70, B.P.krem);
window.renderAt = t => {
  let o = olc(B.dunya(540, 780, 230, t), 540, 780, pop(t, 0, .5));
  for (let i = 0; i < 9; i++) { const st = .3 + i * .33, p = pop(t, st, .35); if (p <= 0) continue;
    const a = i * 2.4 + t * .5, r = 330 + (i % 3) * 40, x = 540 + Math.cos(a) * r, y = 780 + Math.sin(a) * r * .75;
    o += B.balon(x, y, .75 * p, B.guve(0, 0, .32, t * 2 + i, 0));
    if (i > 0) { const b = (i - 1) * 2.4 + t * .5, r2 = 330 + ((i - 1) % 3) * 40; o += `<line x1="${540 + Math.cos(b) * r2}" y1="${780 + Math.sin(b) * r2 * .75}" x2="${x}" y2="${y}" stroke="${B.P.cyan}" stroke-width="4" stroke-dasharray="10 12" opacity="${.4 * p}"/>`; } }
  const k = pop(t, 1.9, .5); if (k > 0) o += grp(`<rect x="-330" y="-70" width="660" height="140" rx="70" fill="${B.P.cyan}"/>` + txt('GRACE HOPPER', 0, 4, 60, '#0B2A31') + `<text class="mono" x="0" y="44" font-size="24" text-anchor="middle" letter-spacing="4" style="fill:#0B2A31">BİLGİSAYAR ÖNCÜSÜ</text>`, 540, 1160, k);
  o += gufi(t, { x: 130, y: 470, boy: 100, bakHedef: [540, 780] });
  o += gubi(t, { x: 950, y: 440, boy: 90, bakHedef: [540, 780] });
  $('dinamik').innerHTML = o;
};"""
# 07 — Smithsonian vitrini
S[7] = r"""
$('zemin').innerHTML = B.bg({ ust: '#12121E', alt: '#1C1B2E', neb: '#FFE9B8', nx: 540, ny: 640, no: .12 }) + `<rect x="0" y="1150" width="1080" height="770" fill="#16152A"/>`;
window.renderAt = t => {
  let o = '';
  // spot ışığı konisi
  o += `<path d="M470 250 L610 250 L860 1000 L220 1000Z" fill="#FFE9B8" opacity="${.08 + .02 * Math.sin(t * 2)}"/>` + K.glow({ x: 540, y: 700, r: 380, renk: '#FFE9B8', guc: .35 });
  // kaide + cam vitrin
  o += `<rect x="290" y="960" width="500" height="190" rx="20" fill="#2A2944"/><rect x="290" y="960" width="500" height="30" rx="15" fill="#3E3D62"/>`;
  o += `<g transform="translate(540 760) scale(.5) rotate(-2)">` + B.defter(B.guve(-130, -40, .7, 0, 0) + B.bant(-130, -60, 340, -10) + B.elYazi('First actual case of bug', -200, 90, 1, 44) + B.elYazi('being found.', -200, 146, 1, 44)) + `</g>`;
  o += `<rect x="300" y="560" width="480" height="400" rx="16" fill="#BFE9F2" opacity=".14"/><path d="M340 600 L420 600 L330 760Z" fill="#FFFFFF" opacity=".18"/><rect x="300" y="540" width="480" height="24" rx="12" fill="#3E3D62"/>`;
  const buhar = A(t, 3.6, 4.0) * (1 - A(t, 4.4, 4.9)); if (buhar > 0) o += `<ellipse cx="660" cy="880" rx="${50 * buhar + 10}" ry="${30 * buhar + 6}" fill="#FFFFFF" opacity="${.35 * buhar}"/>`;
  o += `<rect x="380" y="1060" width="320" height="56" rx="12" fill="#C9A45C"/><text class="mono" x="540" y="1097" font-size="24" text-anchor="middle" letter-spacing="3" style="fill:#2A2944">SMITHSONIAN</text>`;
  const gx = 160 + 480 * E(A(t, 1.6, 3.3));
  o += gufi(t, { x: gx, y: 1300, boy: 130, bakHedef: [540, 760] });
  o += gubi(t, { x: 900, y: 1170, boy: 100, bakHedef: t < 3.4 ? [540, 760] : [gx, 1220] });
  const c = pop(t, .3); if (c > 0) o += grp(cip('BUGÜN HÂLÂ SERGİDE', 0, 0, '#FFE9B8', '#2A2944', 30), 540, 380, c);
  $('dinamik').innerHTML = o;
};"""
# 08 — D-E-B-U-G: hata güveye dönüşür, dışarı uçar, ekran yeşil
S[8] = r"""
$('zemin').innerHTML = B.bg({ nx: 540, ny: 700, neb: B.P.yesil, no: .12 }) + B.parca(13, 40);
window.renderAt = t => {
  let o = '';
  const ok = A(t, 4.2, 4.6), hat = 1 - ok;
  let ic = B.kod(290, 330, 500, t, hat * (t < 2.2 ? 1 : 1 - A(t, 2.2, 2.6)));
  if (t < 2.4) ic += `<g opacity="${(.7 + .3 * Math.sin(t * 20)) * (1 - A(t, 2.1, 2.4))}"><rect x="340" y="560" width="400" height="84" rx="42" fill="${B.P.kirmizi}"/>` + txt('⚠ HATA', 540, 618, 50, '#FFF3D6') + `</g>`;
  if (ok > 0) ic += `<rect x="240" y="300" width="600" height="400" fill="${B.P.yesil}" opacity="${.85 * ok}"/>` + olc(txt('✓', 540, 570, 220 * ok + 1, '#0B2A31'), 540, 500, back(ok));
  o += B.ekran(540, 500, 600, 400, ic);
  // hata → güve (ekranda doğar), sonra dışarı uçar
  if (t > 2.2) { const u = E(A(t, 3.9, 5.4)); const x = 540 + u * 600 + Math.sin(t * 6) * 30 * u, y = 600 - u * 520;
    o += B.guve(x, y, .6 * pop(t, 2.2) + .001, t * 3.5, 20 * Math.sin(t * 4)); }
  const H = 'DEBUG'; for (let i = 0; i < 5; i++) { const b = Math.max(0, Math.sin(Math.PI * A(t, .15 + i * .17, .45 + i * .17))); o += olc(B.tus(240 + i * 150, 1010, H[i], b, i < 2 ? B.P.cyan : B.P.krem), 240 + i * 150, 1010, pop(t, i * .08, .35)); }
  const d = pop(t, 1.2); if (d > 0) o += grp(txt('DE + BUG = BÖCEK AYIKLA', 0, 0, 44, B.P.amber), 540, 1170, d);
  o += gubi(t, { x: 130, y: 760, boy: 110, bakHedef: t > 2.2 ? [540 + E(A(t, 3.9, 5.4)) * 600, 600 - E(A(t, 3.9, 5.4)) * 520] : [540, 500] });
  o += gufi(t, { x: 960, y: 830, boy: 110, bakHedef: t > 2.2 ? [540 + E(A(t, 3.9, 5.4)) * 600, 600 - E(A(t, 3.9, 5.4)) * 520] : [540, 500] });
  $('dinamik').innerHTML = o;
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
