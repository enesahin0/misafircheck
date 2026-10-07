"""#7 Işık saçıyorsun — sahne HTML'lerini ve plan.json'u üretir (flat-bilim-animasyonu skill sözleşmesi).
Her sahne: t=0 = sahne başı; hareketler renderAt(t) içinde, sadece t'ye bağlı. Global zaman = SB + t."""
import json

SB = [0, 3.67, 11.14, 16.22, 20.18, 25.07, 35.10, 37.28, 43.86, 49.71, 51.8]

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/isik.js"></script>
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
# 01 — parlayan silüet + göremeyen göz
S[1] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 760 }) + I.parca(3, 60);
window.renderAt = t => {
  const nab = .55 + .25 * Math.sin(t * 3);
  let o = I.insan({ x: 540, y: 1250, h: 820, parla: nab * A(t, 0, .5) });
  o += grp(I.gozCizik(0, 0, 1, E(A(t, 2.1, 2.5))), 830, 480, pop(t, 1.95));
  $('dinamik').innerHTML = o;
};"""
# 02 — "benzetme değil" + 2009 Japonya karanlık oda
S[2] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 800, neb: I.UZ.amber, no: .12 }) + I.parca(5, 50);
window.renderAt = t => {
  let o = '';
  const b = pop(t, .25) * (1 - A(t, 1.6, 1.9)); if (b > 0) o += grp(`<rect x="-300" y="-60" width="600" height="120" rx="60" fill="${I.UZ.mag}"/>` + txt('BENZETME DEĞİL', 0, 20, 56, '#0B1433'), 540, 760, b);
  const r = pop(t, 1.9, .5); if (r > 0) { o += grp(I.oda(1 - E(A(t, 6.2, 6.9))), 540, 800, r, 0, 1); }
  const et = pop(t, 2.1); if (et > 0) o += grp(`<rect x="-230" y="-46" width="460" height="92" rx="46" fill="#0B1433" opacity=".8"/>` + `<text class="mono" x="0" y="14" font-size="40" text-anchor="middle" letter-spacing="4" style="fill:#FFB547">2009 · JAPONYA</text>`, 540, 360, et);
  const g5 = pop(t, 4.1); if (g5 > 0) o += grp(`<rect x="-150" y="-40" width="300" height="80" rx="40" fill="${I.UZ.cyan}"/>` + txt('5 GÖNÜLLÜ', 0, 16, 42, '#0B1433'), 540, 1215, g5);
  $('dinamik').innerHTML = o;
};"""
S[2] = S[2].replace("grp(I.oda(1 - E(A(t, 6.2, 6.9))), 540, 800, r, 0, 1)", "`<g transform=\"translate(540 800) scale(${r}) translate(-540 -800)\">${I.oda(1 - E(A(t, 6.2, 6.9)))}</g>`")
# 03 — süper hassas soğutmalı kamera + gün sayacı
S[3] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 760, neb: I.UZ.cyan, no: .15 }) + I.parca(7, 50);
window.renderAt = t => {
  const flas = [1.2, 3.4, 4.3].reduce((m, a) => Math.max(m, Math.exp(-Math.max(0, t - a) * 8) * (t > a ? 1 : 0)), 0);
  let o = I.kamera(540, 760, pop(t, .1, .6) + .001, t, flas);
  const ek = pop(t, .9); if (ek > 0) o += grp(`<rect x="-270" y="-46" width="540" height="92" rx="46" fill="#0B1433" opacity=".8"/>` + `<text class="mono" x="0" y="14" font-size="36" text-anchor="middle" letter-spacing="3" style="fill:#3CD6F0">EN HASSAS KAMERA</text>`, 540, 400, ek);
  const g = Math.max(1, Math.ceil(3 * E(A(t, 3.2, 4.6)))); const ga = pop(t, 3.2);
  if (ga > 0) o += grp(`<rect x="-150" y="-60" width="300" height="120" rx="40" fill="#FFF3D6"/>` + txt('GÜN ' + g, 0, 22, 64, '#1E1B4B'), 540, 1150, ga);
  $('dinamik').innerHTML = o;
};"""
# 04 — kamera ekranında parlayan silüet; Gufi şaşkın
S[4] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 700 }) + I.parca(9, 60);
window.renderAt = t => {
  let o = `<rect x="140" y="330" width="800" height="860" rx="60" fill="#2E3A7A"/><rect x="175" y="365" width="730" height="790" rx="36" fill="#05070F"/>`;
  const on = E(A(t, .9, 2.2));
  o += `<g opacity="${on}">` + I.insan({ x: 540, y: 1130, h: 600, renk: '#0A0F26', rim: '#0A0F26', golge: '#0A0F26', parla: .9 + .1 * Math.sin(t * 4), parlaRenk: I.UZ.cyan }) +
       K.glow({ x: 540, y: 790, r: 150, renk: '#FFFFFF', guc: .5 }) + `</g>`;
  const R = K.rnd(2); for (let i = 0; i < 90; i++) o += `<rect x="${175 + R() * 730}" y="${365 + R() * 790}" width="3" height="3" fill="#FFFFFF" opacity="${.08 + .1 * Math.abs(Math.sin(t * 20 + i))}"/>`;
  o += `<circle cx="210" cy="400" r="12" fill="${I.UZ.mag}" opacity="${.5 + .5 * Math.sin(t * 6)}"/><text class="mono" x="232" y="410" font-size="26" style="fill:#FF4F8B">REC</text>`;
  o += grp(M.gufi({ x: 0, y: 0, boy: 150, duygu: 'saskin', bak: [1, -1], kirp: -1 }), 850, 1300 - Math.abs(Math.sin(t * 6)) * 14 * A(t, 2.2, 2.4), pop(t, 2.0));
  $('dinamik').innerHTML = o;
};"""
# 05 — bin kat daha zayıf
S[5] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 800, neb: I.UZ.mag, no: .14 }) + I.parca(11, 50);
window.renderAt = t => {
  let o = '';
  const zy = pop(t, .1); if (zy > 0) o += grp(txt('ÇOK ZAYIF', 0, 0, 96, I.UZ.cyan), 540, 440, zy);
  const h1 = 620 * E(A(t, 1.6, 2.6)), h2 = Math.max(4, h1 / 100);
  o += `<rect x="260" y="${1180 - h1}" width="200" height="${h1}" rx="40" fill="${I.UZ.amber}"/><rect x="620" y="${1180 - h2}" width="200" height="${h2}" rx="${Math.min(40, h2 / 2)}" fill="${I.UZ.cyan}"/>`;
  o += `<text class="mono" x="360" y="1240" font-size="30" text-anchor="middle" style="fill:#FFB547">GÖZ EŞİĞİ</text><text class="mono" x="720" y="1240" font-size="30" text-anchor="middle" style="fill:#3CD6F0">VÜCUT IŞIĞI</text>`;
  if (t > 2.4) o += I.foton(720, 1160 - 10, 8, I.UZ.cyan, .6 + .4 * Math.sin(t * 9));
  const k = pop(t, 2.9); if (k > 0) o += grp(txt('×1000', 0, 0, 150, '#FFF3D6'), 720, 800, k);
  o += grp(M.gubi({ x: 0, y: 0, boy: 110, duygu: 'saskin', bak: [1, 1], kirp: -1 }), 180, 520, pop(t, 2.2));
  $('dinamik').innerHTML = o;
};"""
# 06 — ölçek dalışı: yüz → deri → hücre → moleküller → fotonlar
S[6] = r"""
window.renderAt = t => {
  let o = '';
  const d = E(A(t, 2.3, 4.4)); // dalış
  if (d < 1) { // yüz yakın plan (karanlık)
    let a = I.bg({ nx: 540, ny: 800 }) + I.insan({ x: 540, y: 2300, h: 2100, parla: .7 }) ;
    a += grp(M.gubi({ x: 0, y: 0, boy: 130, duygu: 'merak', bak: [1, -.5], kirp: -1 }), 200, 560, pop(t, .2));
    const q = pop(t, .5) * (1 - A(t, 2.1, 2.3)); if (q > 0) a += txt('?', 330, 470, 160 * q, I.UZ.amber);
    const z = Math.pow(14, d); o += `<g transform="translate(540 760) scale(${z}) translate(-540 -760)" opacity="${1 - A(d, .75, 1)}">${a}</g>`;
  }
  if (d > .6) { // mikro dünya
    const k = A(d, .6, 1); let b = I.bg({ ust: I.MK.z1, alt: I.MK.z2, neb: I.MK.pembe, nx: 540, ny: 760, no: .2 });
    b += I.parca(13, 50, I.MK.isik);
    const hz = 1 + (1 - k) * 2;
    b += `<g transform="translate(540 760) scale(${hz}) translate(-540 -760)">` + I.hucre({ x: 540, y: 760, r: 330, t });
    // moleküller hücre içinde
    const R = K.rnd(8); for (let i = 0; i < 7; i++) { const a0 = R() * 6.28, rr = 80 + R() * 170, sp = .4 + R() * .5; const x = 540 + Math.cos(a0 + t * sp) * rr, y = 760 + Math.sin(a0 + t * sp * 1.2) * rr * .8; b += I.molekul(x, y, .8, i % 2 ? I.MK.lime : '#FFD1DC', t * (i % 2 ? 1 : -1)); }
    // tepkimeler: foton kaçışları (s11: "ışık parçacıkları")
    for (let j = 0; j < 9; j++) { const st = 5.9 + j * .38, p = A(t, st, st + 1.4); if (p <= 0 || p >= 1) continue; const a = j * 2.4, x = 540 + Math.cos(a) * (150 + p * 480), y = 760 + Math.sin(a) * (150 + p * 480); b += I.foton(x, y, 12, j % 2 ? I.MK.lime : '#FFFFFF', 1 - p); if (p < .15) b += K.glow({ x: 540 + Math.cos(a) * 150, y: 760 + Math.sin(a) * 150, r: 90, renk: '#FFFFFF', guc: .8 * (1 - p / .15) }); }
    b += `</g>`;
    const et = pop(t, 3.3) * (1 - A(t, 5.6, 5.9)); if (et > 0) b += grp(`<rect x="-290" y="-46" width="580" height="92" rx="46" fill="#0C2E3A" opacity=".85"/>` + `<text class="mono" x="0" y="14" font-size="36" text-anchor="middle" letter-spacing="2" style="fill:#B8E05A">KİMYASAL TEPKİMELER</text>`, 540, 1230, et);
    const ft = pop(t, 7.0); if (ft > 0) b += grp(`<rect x="-240" y="-46" width="480" height="92" rx="46" fill="#0C2E3A" opacity=".85"/>` + `<text class="mono" x="0" y="14" font-size="36" text-anchor="middle" letter-spacing="2" style="fill:#FFFFFF">✦ IŞIK PARÇACIĞI</text>`, 540, 1230, ft);
    o += `<g opacity="${k}">${b}</g>`;
  }
  $('dinamik').innerHTML = o;
};"""
# 07 — en çok yüz parlıyor
S[7] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 760 }) + I.parca(15, 50);
window.renderAt = t => {
  let o = I.insan({ x: 540, y: 1260, h: 820, parla: .25 });
  const yz = E(A(t, .3, .9)); o += K.glow({ x: 540, y: 1260 - 820 / 600 * 480, r: 330, renk: I.UZ.amber, guc: .85 * yz * (.85 + .15 * Math.sin(t * 5)) });
  o += `<circle cx="540" cy="${1260 - 820 / 600 * 480}" r="${120 * yz}" fill="${I.UZ.amber}" opacity=".35"/>`;
  const e = pop(t, .5); if (e > 0) o += grp(`<rect x="-180" y="-46" width="360" height="92" rx="46" fill="${I.UZ.amber}"/>` + txt('EN PARLAK', 0, 18, 48, '#1E1B4B'), 540, 420, e);
  $('dinamik').innerHTML = o;
};"""
# 08 — saat: sabah sönük, 16:00 en parlak
S[8] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 700, neb: I.UZ.amber, no: .14 }) + I.parca(17, 50);
window.renderAt = t => {
  const h = 8 + 8 * E(A(t, 2.6, 6.0)); // 08:00 → 16:00
  let o = I.saat(540, 700, 260, h);
  const par = Math.max(0, Math.min(1, (h - 8) / 8)); // parıltı seviyesi
  o += `<rect x="190" y="1080" width="700" height="60" rx="30" fill="#FFF3D6" opacity=".12"/><rect x="190" y="1080" width="${Math.max(60, 700 * (.15 + .85 * par))}" height="60" rx="30" fill="${I.UZ.amber}"/>`;
  o += `<text class="mono" x="190" y="1060" font-size="28" style="fill:#FFB547" letter-spacing="3">PARILTI</text>`;
  o += grp(M.gubi({ x: 0, y: 0, boy: 100 + 50 * par, duygu: par > .9 ? 'mutlu' : 'merak', parla: .3 + .7 * par, kirp: -1 }), 170, 470, pop(t, .3));
  const sn = pop(t, 2.5) * (1 - A(t, 3.6, 3.9)); if (sn > 0) o += grp(txt('SABAH · SÖNÜK', 0, 0, 44, '#8FA2F0', 700, 'class="mono"'), 540, 1010, sn);
  const pk = pop(t, 5.6); if (pk > 0) o += grp(`<rect x="-190" y="-50" width="380" height="100" rx="50" fill="${I.UZ.amber}"/>` + txt('16:00 ✦', 0, 22, 60, '#1E1B4B'), 540, 1000, pk);
  $('dinamik').innerHTML = o;
};"""
# 09 — "Bugün ışıl ışılsın" → teknik olarak haklı
S[9] = r"""
$('zemin').innerHTML = I.bg({ nx: 540, ny: 760, neb: I.UZ.mag, no: .16 }) + I.parca(19, 70);
window.renderAt = t => {
  let o = '';
  o += grp(M.gubi({ x: 0, y: 0, boy: 200, duygu: t > 2.8 ? 'mutlu' : 'merak', bak: [-1, 0], parla: .8, kirp: -1 }), 760, 820 + Math.sin(t * 2.2) * 12, pop(t, .1));
  const gp = A(t, 4.6, 5.5); if (gp > 0) o += K.glow({ x: 320, y: 1010, r: 260, renk: I.UZ.cyan, guc: .6 * gp * (.8 + .2 * Math.sin(t * 6)) });
  o += grp(M.gufi({ x: 0, y: 0, boy: 190, duygu: t > 4.6 ? 'saskin' : 'mutlu', bak: [1, t > 4.6 ? 1 : 0], kirp: -2 }), 320, 1130, pop(t, .3));
  const bl = pop(t, 2.4) * (1 - A(t, 4.4, 4.6)); if (bl > 0) o += grp(`<rect x="-270" y="-70" width="540" height="140" rx="50" fill="#FFF3D6"/><path d="M-120 60 L-160 120 L-60 60Z" fill="#FFF3D6"/>` + txt('Işıl ışılsın!', 0, 22, 62, '#1E1B4B'), 420, 520, bl);
  const tk = pop(t, 4.6); if (tk > 0) o += grp(`<rect x="-300" y="-50" width="600" height="100" rx="50" fill="${I.UZ.cyan}"/>` + txt('TEKNİK OLARAK DOĞRU ✓', 0, 18, 44, '#0B1433'), 540, 430, tk);
  $('dinamik').innerHTML = o;
  const z = 1 - .9 * E(A(t, 5.45, 5.85)); $('dinamik').setAttribute('transform', `translate(540 850) scale(${z}) translate(-540 -850)`);
};"""

S[10] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#141112"/>`;
const LP = {}; for (const p of window.LOGO_PATHS) LP[p.id] = p;
const C = { g1: [44.5, 134.8], u1: [90.6, 128.5], b: [134.3, 121], i1: [165, 128], g2: [150.3, 180.6], u2: [196.4, 174.3], f: [230.1, 173], i2: [253.6, 174] };
const S = 660 / 233, OX = 540, OY = 940, scr = ([x, y]) => [(x - 141.5) * S + OX, (y - 141.5) * S + OY];
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
  if (t > .55 && t < 1.2) o += K.glow({ x: bx, y: by, r: 160 * (1 - A(t, .55, 1.2)) + 1, renk: '#FBAC39', guc: .7 });
  const fo = A(t, 1.8, 2.1); if (fo > 0) o += `<rect width="1080" height="1920" fill="#141112" opacity="${fo}"/>`;
  $('dinamik').innerHTML = o;
};"""
plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
for i in range(1, 11):
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__JS__", S[i])
    if i == 10: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]})
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
print("sahneler + plan.json yazıldı")
