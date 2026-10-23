// #3 Vombat — sahneler (zamanlar ses.mp3'ten ölçüldü)
const CAT = { name: 'DOĞA & HAYVANLAR', color: '#6CC04A' };
const GREEN = '#6CC04A', AUDIO_END = 58.83, END = 60.95, LS = 58.9;
const POO = ['#8a5a34', '#6d4526', '#a8744a']; // küp yüzleri
IMPACTS.push([1.9, 8], [37.5, 8], [44.0, 5]);

const CAP = [
  [0.0, 2.93, 'Doğada *küp* şeklinde bir şey üreten tek canlı,'], [3.12, 4.33, "*Avustralya'da* yaşıyor."],
  [4.78, 5.81, 'Ve ürettiği şey...'], [6.27, 6.75, '*kakası.*'], [7.25, 8.60, 'Bu, bir *vombat.*'],
  [9.0, 11.70, 'Her gece, *düzinelerce* küçük küp bırakıyor.'],
  [12.17, 14.25, 'Peki *yuvarlak* bir bağırsaktan,'], [14.46, 15.88, '*köşeli* bir şey nasıl çıkar?'],
  [16.29, 18.24, 'Bilim insanları bunu çözmek için,'], [18.52, 21.56, 'bağırsağın içine uzun bir *balon* yerleştirip şişirdi.'],
  [21.98, 23.13, 'Ve *sırrı* buldular.'], [23.48, 24.91, 'Bağırsağın *son kısmında,*'], [25.17, 26.77, 'duvar her yerde *aynı değil.*'],
  [27.22, 28.97, 'Bazı bölgeler *iki kat* kalın,'], [29.23, 30.43, '*dört kat* daha sert.'],
  [30.80, 32.08, 'Sert yerler *yavaş,*'], [32.34, 34.13, 'yumuşak yerler *hızlı* kasılıyor.'], [34.50, 38.09, 'Bu fark, kakayı yavaş yavaş yoğurup *köşeler* oluşturuyor.'],
  [38.52, 39.81, 'Peki neden *küp?*'], [40.11, 43.69, 'Bir *teoriye* göre vombatlar kakasını'], [43.84, 45.20, 'taşların üstüne bırakıp *bölgesini* işaretliyor.'],
  [45.57, 47.60, 'Ve küp... *yuvarlanıp gitmiyor.*'],
  [47.96, 51.99, 'Bu araştırma, önce *güldüren* sonra *düşündüren* bilime verilen,'], [52.14, 53.50, '*Ig Nobel* ödülünü kazandı.'],
  [53.88, 56.01, 'Ve belki bir gün *fabrikalar* da küpleri,'], [56.11, 58.51, 'tıpkı bir *vombat* gibi üretecek.'],
];

// ======================================================================
// ortak çizimler
function cube(x, y, s, { ry = 0, rx = -.45, rz = 0, cols = POO, eyes = 0, blink = 0, squash = 1, alpha = 1 } = {}) {
  const V = []; for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) V.push([a, b, c]);
  const rot = ([X, Y, Z]) => { let x1 = X * Math.cos(ry) + Z * Math.sin(ry), z1 = -X * Math.sin(ry) + Z * Math.cos(ry); let y1 = Y * Math.cos(rx) - z1 * Math.sin(rx), z2 = Y * Math.sin(rx) + z1 * Math.cos(rx); const x2 = x1 * Math.cos(rz) - y1 * Math.sin(rz), y2 = x1 * Math.sin(rz) + y1 * Math.cos(rz); return [x2, y2, z2]; };
  const P = V.map(rot); const F = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.scale(s / squash, s * squash);
  const faces = F.map(f => { const z = f.reduce((a, i) => a + P[i][2], 0) / 4; return { f, z }; }).sort((a, b) => a.z - b.z);
  for (const { f, z } of faces) { const [a, b, c] = [P[f[0]], P[f[1]], P[f[2]]]; const nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const L = Math.hypot(nx, ny, nz); const lit = Math.abs((-nx * .4 - ny * .7 + nz * .6) / L);
    ctx.fillStyle = mix(cols[1], cols[2], lit); ctx.beginPath(); f.forEach((i, k) => { const p = P[i]; k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(40,20,10,.35)'; ctx.lineWidth = .04; ctx.stroke(); }
  if (eyes > 0) { const fz = rot([0, 0, 1]); if (fz[2] > .2) { ctx.save(); ctx.translate(fz[0], fz[1] + .05); ctx.globalAlpha *= eyes; for (const sx of [-.32, .32]) { ctx.fillStyle = '#1b0f08'; ctx.beginPath(); ctx.ellipse(sx, 0, .13, .18 * (1 - blink * .9), 0, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx + .04, -.06, .045, 0, 7); ctx.fill(); } ctx.fillStyle = 'rgba(255,120,140,.55)'; for (const sx of [-.55, .55]) { ctx.beginPath(); ctx.ellipse(sx, .22, .12, .07, 0, 0, 7); ctx.fill(); } ctx.restore(); } }
  ctx.restore();
}
function wombat(x, y, s, { face = 1, walk = 0, ph = 0, blink = 0, xray = 0, roll = 0, happy = 0, sit = 0 } = {}) {
  const bob = Math.abs(Math.sin(ph)) * 10 * walk;
  ctx.save(); ctx.translate(x, y - bob); ctx.scale(s * face, s); ctx.rotate(roll);
  // bacaklar
  ctx.fillStyle = '#5b4535'; for (const [lx, o] of [[-70, 0], [-35, Math.PI], [45, Math.PI], [80, 0]]) { const sw = Math.sin(ph + o) * 14 * walk; rr(lx - 16 + sw, 40, 32, 42, 14); ctx.fill(); }
  // gövde
  const g = ctx.createRadialGradient(-20, -40, 20, 0, 0, 170); g.addColorStop(0, '#a88d73'); g.addColorStop(1, '#6f5745'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(0, 0, 150, 100, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#c9b39a'; ctx.beginPath(); ctx.ellipse(20, 40, 95, 45, 0, 0, 7); ctx.fill();
  // kafa
  ctx.fillStyle = '#8f7560'; ctx.beginPath(); ctx.ellipse(120, -10, 80, 72, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#6f5745'; for (const [ex, ey] of [[88, -72], [140, -74]]) { ctx.beginPath(); ctx.ellipse(ex, ey, 20, 24, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c99a8a'; ctx.beginPath(); ctx.ellipse(ex, ey + 2, 10, 13, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#6f5745'; }
  ctx.fillStyle = '#2a1d15'; ctx.beginPath(); ctx.ellipse(186, 6, 30, 24, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(180, -2, 9, 5, 0, 0, 7); ctx.fill();
  for (const ex of [118, 158]) { ctx.fillStyle = '#140c08'; ctx.beginPath(); ctx.ellipse(ex, -22, 12, 15 * (1 - blink * .92), 0, 0, 7); ctx.fill(); if (blink < .5) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 4, -28, 4.5, 0, 7); ctx.fill(); } }
  ctx.fillStyle = 'rgba(255,120,140,.5)'; ctx.beginPath(); ctx.ellipse(100, 12, 16, 9, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(170, 32, 13, 8, 0, 0, 7); ctx.fill();
  if (happy > 0) { ctx.strokeStyle = '#2a1d15'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(172, 34, 12 * happy, .2, Math.PI - .2); ctx.stroke(); }
  // röntgen
  if (xray > 0) { ctx.globalAlpha = xray; ctx.fillStyle = 'rgba(10,30,60,.82)'; ctx.beginPath(); ctx.ellipse(0, 0, 152, 102, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(120, -10, 82, 74, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#9fd8ff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, 150, 100, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(120, -10, 80, 72, 0, 0, 7); ctx.stroke(); }
  ctx.restore();
}
const GUT = bez([140, -10], [40, 90], [-10, -80], [-40, 30], 40).concat(bez([-40, 30], [-60, 80], [-110, 60], [-160, 20], 30).slice(1)); // wombat yerel koordinat
function nightBG(t, { moon = true } = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1328'); g.addColorStop(.62, '#1e3157'); g.addColorStop(1, '#101a2e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = rng(8); for (let i = 0; i < 110; i++) { const x = R() * W, y = R() * 1250, k = R(); ctx.fillStyle = `rgba(246,241,231,${.2 + .6 * Math.abs(Math.sin(t * 2 + k * 20))})`; ctx.fillRect(x, y, 2 + k * 2, 2 + k * 2); }
  if (moon) { glowCircle(800, 480, 300, '#dfe8ff', .22); ctx.fillStyle = '#f3efe2'; ctx.beginPath(); ctx.arc(800, 480, 70, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.beginPath(); ctx.arc(780, 470, 14, 0, 7); ctx.arc(820, 500, 9, 0, 7); ctx.fill(); }
  // okaliptüs siluetleri
  ctx.fillStyle = '#0a1224'; for (const [x, h] of [[90, 620], [960, 700]]) { ctx.fillRect(x - 10, 1360 - h, 20, h); for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(x + Math.sin(k * 2.3) * 90, 1360 - h + k * 60, 110 - k * 8, 50, Math.sin(k) * .3, 0, 7); ctx.fill(); } }
  ctx.fillStyle = '#16233d'; ctx.beginPath(); ctx.moveTo(0, 1360); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, 1350 + 14 * Math.sin(x * .02)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.strokeStyle = '#2b4466'; ctx.lineWidth = 4; const R2 = rng(4); for (let i = 0; i < 40; i++) { const x = R2() * W, y = 1370 + R2() * 500; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y - 26); ctx.moveTo(x, y); ctx.lineTo(x + 7, y - 22); ctx.stroke(); }
}
function rock(x, y, w, h, tilt = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); const g = ctx.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, '#6c7a92'); g.addColorStop(1, '#3a4660'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(-w / 2 + 10, -h, -w / 6, -h); ctx.lineTo(w / 3, -h * .95); ctx.quadraticCurveTo(w / 2, -h * .6, w / 2, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
function blueprint(t) { ctx.fillStyle = '#0d2745'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(159,216,255,.08)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
const BLINK = t => { const k = t % 3.1; return k < .12 ? Math.sin(k / .12 * Math.PI) : 0; };

// ======================================================================
// S1-S2: küp, Avustralya, sansür
function sceneOpen(t) {
  const land = ease.bounce(pr(t, 1.2, 1.9));
  const bgA = pr(t, 1.0, 1.4);
  ctx.fillStyle = '#05070d'; ctx.fillRect(0, 0, W, H);
  if (bgA > 0) { ctx.save(); ctx.globalAlpha = bgA; nightBG(t); rock(SAFE.cx, 1360, 520, 190); ctx.restore(); }
  const y = t < 1.2 ? 860 + Math.sin(t * 2) * 10 : lerp(860, 1110, land);
  const sq = t > 1.85 && t < 2.3 ? 1 - .22 * Math.sin(pr(t, 1.85, 2.3) * Math.PI) : 1;
  const s = lerp(170, 60, ease.io(pr(t, .9, 1.9)));
  const eyes = pr(t, 6.35, 6.6), cy = y - (t > 6.27 && t < 6.9 ? Math.sin(pr(t, 6.27, 6.9) * Math.PI) * 90 : 0);
  cube(SAFE.cx, cy, s, { ry: t < 1.9 ? t * 1.7 : lerp(1.9 * 1.7, Math.PI * 2 + .6, ease.outC(pr(t, 1.9, 2.4))) , rx: -.45, eyes, blink: BLINK(t + 1), squash: sq });
  // avustralya haritası
  const mp = ease.io(pr(t, 2.9, 3.8)), ma = pr(t, 2.9, 3.1) * (1 - pr(t, 4.4, 4.7));
  if (ma > 0) { const AU = [[0, -.35], [.25, -.5], [.45, -.8], [.6, -.45], [.95, -.1], [.85, .35], [.55, .6], [.25, .45], [-.1, .55], [-.55, .35], [-.95, .25], [-.9, -.2], [-.55, -.4], [-.3, -.55], [0, -.35]].map(([a, b]) => [300 + a * 150, 520 + b * 150]);
    ctx.save(); ctx.globalAlpha = ma; ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.lineJoin = 'round'; strokeProgress(AU, mp); if (mp >= 1) { ctx.fillStyle = rgba(GREEN, .25); ctx.beginPath(); AU.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.fill(); }
    const pp = ease.back(pr(t, 3.6, 3.9)); ctx.fillStyle = COL.red; ctx.fillRect(420 - 10 * pp, 600 - 10 * pp, 20 * pp, 20 * pp); ctx.restore();
    text('AVUSTRALYA', 490, 530, { fam: 'JetBrains Mono', w: 700, size: 40, alpha: ma * pr(t, 3.4, 3.6), ls: 4 }); }
  // "tek canlı" etiketi
  const ta = pr(t, .3, .5) * (1 - pr(t, 1.0, 1.2)); if (ta > 0) text('DOĞADA TEK', SAFE.cx, 560, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: COL.amber, alpha: ta, ls: 10 });
  // sansür bandı
  const cin = ease.outC(pr(t, 4.95, 5.25)), cout = pr(t, 6.27, 6.8);
  if (cin > 0 && cout < 1) { ctx.save(); const bx = lerp(-700, SAFE.cx, cin), by = 1080 + ease.inQ(cout) * 900, r = cout * 1.2; ctx.translate(bx, by); ctx.rotate(r);
    const R = rng(Math.floor(t * 12)); for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { ctx.fillStyle = mix('#2b1a0e', '#c49a6c', R()); ctx.fillRect(-300 + i * 50, -100 + j * 50, 50, 50); }
    ctx.fillStyle = '#111'; ctx.fillRect(-300, -30, 600, 60); text('SANSÜR', 0, 17, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: COL.cream, ls: 12 }); ctx.restore(); }
  // koku çizgileri
  const st = pr(t, 6.5, 6.8) * (1 - pr(t, 7.0, 7.3)); if (st > 0) { ctx.strokeStyle = rgba('#a6d97a', st); ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let k = -1; k <= 1; k++) { ctx.beginPath(); for (let i = 0; i <= 20; i++) { const yy = 1020 - i * 9 - (t - 6.5) * 60, xx = SAFE.cx + k * 50 + Math.sin(i * .6 + t * 8) * 10; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } }
}
// S3: vombat çıkar, küp bırakır
function sceneWombat(t) {
  nightBG(t); rock(SAFE.cx, 1360, 520, 190);
  const out = pr(t, 12.0, 12.4);
  // çalı
  const shake = t > 6.8 && t < 7.4 ? Math.sin(t * 60) * 8 : 0; ctx.fillStyle = '#23405e'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(820 + k * 40 - 80 + shake, 1330 - (k % 2) * 40, 90, 0, 7); ctx.fill(); }
  // kalan ilk küp
  if (t < 9.3) cube(SAFE.cx, 1110, 60, { ry: Math.PI * 2 + .6, rx: -.45, eyes: 1, blink: BLINK(t + 1) });
  // vombat: yuvarlanarak çıkar, sonra yürür
  const rin = ease.outC(pr(t, 7.1, 7.8)); const walkP = pr(t, 9.0, 11.7);
  let x = lerp(900, 700, rin), roll = (1 - rin) * -6; if (t > 9.0) x = lerp(700, 180, walkP);
  const wy = 1330;
  // bırakılan küpler
  const n = Math.floor(walkP * 12);
  for (let i = 0; i < n; i++) { const cx = lerp(700, 180, (i + .5) / 12) + 200, pp = ease.back(pr(t, 9.0 + (i + .5) / 12 * 2.7, 9.2 + (i + .5) / 12 * 2.7)); cube(cx, wy + 10 - 20 * pp, 40 * pp, { ry: .6 + i * .3, rx: -.45 }); }
  wombat(x, wy - 110, 1.2, { face: t > 9.0 ? -1 : -1, walk: t > 9 && t < 11.7 ? 1 : 0, ph: t * 10, blink: BLINK(t), roll, happy: pr(t, 7.8, 8.2) });
  const na = pr(t, 7.8, 8.1) * (1 - pr(t, 8.9, 9.2)); if (na > 0) { ctx.save(); ctx.globalAlpha = na; rr(560, 980, 250, 70, 35); ctx.fillStyle = GREEN; ctx.fill(); text('VOMBAT', 685, 1030, { fam: 'JetBrains Mono', w: 700, size: 36, align: 'center', color: '#0b1328', ls: 4 }); ctx.restore(); }
  const ha = pr(t, 9.3, 9.6) * (1 - pr(t, 11.8, 12.1)); if (ha > 0) { text('☾ HER GECE', SAFE.cx, 520, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', alpha: ha, ls: 6 }); text('×' + Math.max(1, n), SAFE.cx, 660, { size: 130, align: 'center', color: COL.amber, alpha: ha, shadow: 30 }); }
}
// S4: büyüteçle röntgen
function sceneXray(t) {
  nightBG(t, { moon: false }); ctx.fillStyle = 'rgba(5,10,20,.5)'; ctx.fillRect(0, 0, W, H);
  const k = ease.outC(pr(t, 12.1, 12.6)); const X = SAFE.cx - 30, Y = 950, S = lerp(.9, 1.9, k);
  wombat(X, Y, S, { face: 1, blink: BLINK(t) });
  // büyüteç
  const lx = lerp(200, X - 20, ease.io(pr(t, 12.5, 13.3))), ly = Y - 10, LR = 330;
  ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, LR, 0, 7); ctx.clip();
  ctx.fillStyle = '#081a33'; ctx.fillRect(0, 0, W, H); wombat(X, Y, S, { face: 1, xray: 1 });
  ctx.save(); ctx.translate(X, Y); ctx.scale(S, S); ctx.strokeStyle = '#ff8fa3'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; strokeProgress(GUT, ease.io(pr(t, 12.9, 14.0))); ctx.strokeStyle = '#ffc0cc'; ctx.lineWidth = 8; strokeProgress(GUT, ease.io(pr(t, 12.9, 14.0)));
  // yuvarlak -> köşeli
  const mv = ease.io(pr(t, 13.8, 15.0)); if (mv > 0) { const L = GUT.length - 1, q = mv * L, i = Math.min(L - 1, Math.floor(q)), f = q - i; const px = lerp(GUT[i][0], GUT[i + 1][0], f), py = lerp(GUT[i][1], GUT[i + 1][1], f); const sq = pr(t, 14.46, 15.0); ctx.fillStyle = '#a8744a'; ctx.beginPath(); ctx.roundRect(px - 14, py - 14, 28, 28, lerp(14, 2, sq)); ctx.fill(); }
  ctx.restore(); ctx.restore();
  ctx.strokeStyle = COL.cream; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(lx, ly, LR, 0, 7); ctx.stroke(); ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx + LR * .72, ly + LR * .72); ctx.lineTo(lx + LR * 1.05, ly + LR * 1.05); ctx.stroke();
  // ● -> ■ ?
  const qa = pr(t, 14.4, 14.6) * (1 - pr(t, 15.9, 16.2)); if (qa > 0) { const m = ease.io(pr(t, 14.46, 15.2)); ctx.save(); ctx.globalAlpha = qa; ctx.fillStyle = COL.cream; ctx.beginPath(); ctx.roundRect(SAFE.cx - 250 - 55, 460 - 55, 110, 110, 55); ctx.fill(); text('→', SAFE.cx, 490, { size: 80, align: 'center' }); ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.roundRect(SAFE.cx + 250 - 55, 460 - 55, 110, 110, lerp(55, 6, m)); ctx.fill(); ctx.restore();
    const qb = ease.el(pr(t, 15.0, 15.6)); ctx.save(); ctx.translate(SAFE.cx, 640); ctx.scale(qb, qb); ctx.rotate(Math.sin(t * 6) * .08); text('?', 0, 60, { size: 170, align: 'center', color: COL.amber, alpha: qa, shadow: 30 }); ctx.restore(); }
}
// S5-S7: laboratuvar şeması, balon, sert/yumuşak bölgeler
const TUBE = { x0: 60, x1: 1020, y: 900, r: 70 };
const BANDS = (() => { const o = []; const start = TUBE.x0 + (TUBE.x1 - TUBE.x0) * .6; for (let i = 0; i < 8; i++) o.push({ a: lerp(start, TUBE.x1, i / 8), b: lerp(start, TUBE.x1, (i + 1) / 8), stiff: i % 2 === 0 }); return o; })();
function sceneLab(t) {
  blueprint(t);
  const inf = ease.el(pr(t, 19.5, 21.4)) * .95, bin = ease.io(pr(t, 17.2, 19.4));
  const bulge = x => 1 + inf * .35 * Math.exp(-Math.pow((x - lerp(TUBE.x0, 800, bin)) / 400, 2)) * (x < lerp(TUBE.x0, 900, bin) + 100 ? 1 : 0);
  // tüp duvarları
  const wall = (sgn) => { ctx.beginPath(); for (let x = TUBE.x0; x <= TUBE.x1; x += 8) { const w = TUBE.r * bulge(x) + 6 * Math.sin(x * .02 + t * 2); const y = TUBE.y + sgn * w; x === TUBE.x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); };
  const dp = ease.io(pr(t, 16.2, 17.0));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, TUBE.x0 + (TUBE.x1 - TUBE.x0) * dp + 1, H); ctx.clip();
  ctx.strokeStyle = '#9fd8ff'; ctx.lineWidth = 6; wall(-1); wall(1);
  // bölgeler (ısı haritası)
  const hm = pr(t, 25.17, 25.8);
  if (hm > 0) for (const b of BANDS) { const k = ease.back(cl(hm * 1.6 - (b.a - BANDS[0].a) / 700)); if (k <= 0) continue; ctx.strokeStyle = b.stiff ? COL.amber : '#3d8bfd'; ctx.lineWidth = b.stiff ? 22 * k : 8 * k;
    for (const sg of [-1, 1]) { ctx.beginPath(); for (let x = b.a; x <= b.b; x += 6) { const y = TUBE.y + sg * (TUBE.r * bulge(x) + 6 * Math.sin(x * .02 + t * 2)); x === b.a ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); } }
  ctx.restore();
  // balon
  if (bin > 0) { const bx1 = lerp(-300, 900, bin); ctx.fillStyle = '#ef4b5f'; ctx.beginPath(); ctx.moveTo(bx1 - 1100, TUBE.y); for (let x = bx1 - 1100; x <= bx1; x += 8) { const w = (TUBE.r * .45 + TUBE.r * .5 * inf * Math.exp(-Math.pow((x - lerp(TUBE.x0, 800, bin)) / 400, 2))) * Math.min(1, (bx1 - x) / 40); ctx.lineTo(x, TUBE.y - w); } for (let x = bx1; x >= bx1 - 1100; x -= 8) { const w = (TUBE.r * .45 + TUBE.r * .5 * inf * Math.exp(-Math.pow((x - lerp(TUBE.x0, 800, bin)) / 400, 2))) * Math.min(1, (bx1 - x) / 40); ctx.lineTo(x, TUBE.y + w); } ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(Math.max(0, bx1 - 900), TUBE.y - TUBE.r * .25 - inf * 12, 700, 8); }
  // manometre
  const ga = pr(t, 19.4, 19.7) * (1 - pr(t, 26.6, 26.9)); if (ga > 0) { ctx.save(); ctx.globalAlpha = ga; const cx = SAFE.cx, cy = 500, R = 120; ctx.fillStyle = '#0d2745'; ctx.strokeStyle = '#9fd8ff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.stroke(); for (let i = 0; i <= 10; i++) { const a = Math.PI * .75 + i / 10 * Math.PI * 1.5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 12), cy + Math.sin(a) * (R - 12)); ctx.lineTo(cx + Math.cos(a) * (R - 32), cy + Math.sin(a) * (R - 32)); ctx.stroke(); }
    const a = Math.PI * .75 + (inf * .8 + .05 * Math.sin(t * 20) * inf) * Math.PI * 1.5; ctx.strokeStyle = COL.red; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30)); ctx.stroke(); ctx.fillStyle = COL.cream; ctx.beginPath(); ctx.arc(cx, cy, 12, 0, 7); ctx.fill(); ctx.restore(); }
  // etiketler
  const la = pr(t, 16.4, 16.7) * (1 - pr(t, 21.9, 22.2)); if (la > 0) text('BAĞIRSAK · LABORATUVAR ŞEMASI', SAFE.cx, 1120, { fam: 'JetBrains Mono', w: 500, size: 26, align: 'center', color: '#9fd8ff', alpha: la, ls: 2 });
  // aha
  const sp = pr(t, 21.98, 22.5); if (sp > 0 && sp < 1) sparkle(SAFE.cx + 200, 700, 90 * Math.sin(sp * Math.PI), { glow: 50, rot: sp * 2 });
  // son %17
  const br = ease.outC(pr(t, 23.48, 24.1)) * (1 - pr(t, 26.7, 27.0)); if (br > 0) { const a = BANDS[0].a, b = TUBE.x1; ctx.strokeStyle = rgba(COL.cream, br); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a, 760); ctx.lineTo(a, 740); ctx.lineTo(lerp(a, b, br), 740); ctx.lineTo(lerp(a, b, br), 760); ctx.stroke(); text('SON %17', (a + b) / 2, 720, { fam: 'JetBrains Mono', w: 700, size: 36, align: 'center', alpha: br, ls: 3 }); }
  const lg = pr(t, 25.6, 25.9) * (1 - pr(t, 26.7, 27.0)); if (lg > 0) { ctx.fillStyle = rgba(COL.amber, lg); ctx.fillRect(170, 1100, 40, 14); text('SERT', 225, 1116, { fam: 'JetBrains Mono', w: 700, size: 28, alpha: lg }); ctx.fillStyle = rgba('#3d8bfd', lg); ctx.fillRect(480, 1104, 40, 6); text('YUMUŞAK', 535, 1116, { fam: 'JetBrains Mono', w: 700, size: 28, alpha: lg }); }
}
function sceneBars(t) {
  blueprint(t);
  const bar = (y, lab, mul, col, t0) => { const p = ease.el(pr(t, t0, t0 + .8)); text(lab, 110, y - 30, { fam: 'JetBrains Mono', w: 700, size: 34, alpha: pr(t, t0 - .3, t0), ls: 3 });
    ctx.fillStyle = 'rgba(159,216,255,.25)'; rr(110, y, 170, 70, 14); ctx.fill(); text('1×', 195, y + 50, { size: 40, align: 'center', color: '#9fd8ff', alpha: pr(t, t0 - .3, t0) });
    ctx.fillStyle = col; rr(110, y + 100, 170 * lerp(1, mul, p), 70, 14); ctx.fill(); text(Math.round(lerp(1, mul, cl(p))) + '×', 110 + 170 * lerp(1, mul, p) - 20, y + 152, { size: 44, align: 'right', color: '#0d2745', alpha: pr(t, t0, t0 + .2) }); };
  bar(560, 'DUVAR KALINLIĞI', 2, COL.amber, 28.1); bar(900, 'SERTLİK', 4, COL.red, 29.2);
  const ra = pr(t, 29.4, 29.6); if (ra > 0) text('yumuşak ↔ sert bölge', SAFE.cx, 1240, { w: 500, size: 40, align: 'center', alpha: ra * .8 });
}
// S8: kesit (uçtan görünüm): süperelips ile yuvarlaktan köşeye
function superPath(cx, cy, r, n, wob = 0, t = 0) { ctx.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2 + Math.PI / 4; const c = Math.cos(a), s = Math.sin(a); const k = r * (1 + wob * Math.sin(a * 4 + t)); const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * k, y = Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * k; i ? ctx.lineTo(cx + x, cy + y) : ctx.moveTo(cx + x, cy + y); } ctx.closePath(); }
function sceneSquare(t) {
  blueprint(t); const cx = SAFE.cx, cy = 880;
  const slow = pr(t, 30.8, 31.2), fast = pr(t, 32.34, 32.7), form = ease.io(pr(t, 34.5, 37.3));
  // halka: 4 sert (köşe) + 4 yumuşak (kenar) bölge
  for (let i = 0; i < 8; i++) { const stiff = i % 2 === 0; const a0 = i / 8 * Math.PI * 2 - Math.PI / 8 + Math.PI / 4, a1 = a0 + Math.PI / 4;
    const puls = stiff ? slow * .5 * (1 + Math.sin(t * 2.2)) : fast * .5 * (1 + Math.sin(t * 9)); const R = 330 - (stiff ? 10 : 34) * puls;
    ctx.strokeStyle = stiff ? COL.amber : '#3d8bfd'; ctx.lineWidth = stiff ? 46 : 20; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.arc(cx, cy, R, a0 + .02, a1 - .02); ctx.stroke(); }
  // hamur
  const n = lerp(2, 7, form); ctx.fillStyle = '#a8744a'; superPath(cx, cy, 230, n, .02 * (1 - form), t * 3); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.12)'; superPath(cx - 30, cy - 30, 120, n); ctx.fill();
  const ls = pr(t, 31.0, 31.3) * (1 - pr(t, 34.3, 34.6)); if (ls > 0) { text('YAVAŞ', cx + 290, cy - 290, { fam: 'JetBrains Mono', w: 700, size: 34, align: 'center', color: COL.amber, alpha: ls }); }
  const lf = pr(t, 32.5, 32.8) * (1 - pr(t, 34.3, 34.6)); if (lf > 0) { text('HIZLI', cx, cy - 390, { fam: 'JetBrains Mono', w: 700, size: 34, align: 'center', color: '#3d8bfd', alpha: lf }); }
  // çıt! küp olarak fırlar
  const pop = ease.back(pr(t, 37.4, 38.0)); if (t > 37.4) { ctx.fillStyle = 'rgba(13,39,69,.7)'; ctx.fillRect(0, 0, W, H); cube(cx, cy, lerp(150, 200, pop), { ry: .6 + (t - 37.4) * 2, rx: -.45, eyes: pr(t, 37.6, 37.8), blink: BLINK(t) }); const k = pr(t, 37.4, 37.8); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; ctx.strokeStyle = rgba(COL.amber, 1 - k); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 240 * k, cy + Math.sin(a) * 240 * k); ctx.lineTo(cx + Math.cos(a) * (240 * k + 60), cy + Math.sin(a) * (240 * k + 60)); ctx.stroke(); } text('ÇIT!', cx, 560, { size: 120, align: 'center', color: COL.amber, alpha: pr(t, 37.45, 37.6) * (1 - pr(t, 38.3, 38.5)), shadow: 30 }); }
}
// S9: neden küp? — eğimli kaya, top yuvarlanır, küp kalır
function sceneWhy(t) {
  nightBG(t);
  const tilt = -.16; rock(560, 1360, 900, 330, tilt);
  const surf = x => 1360 - 300 + (x - 560) * Math.tan(tilt) * -1; // yaklaşık üst yüzey
  const sx = 700;
  wombat(lerp(1300, 860, ease.outC(pr(t, 40.1, 41.3))), surf(900) - 80, 1.0, { face: -1, walk: t < 41.3 ? 1 : 0, ph: t * 10, blink: BLINK(t), happy: pr(t, 45.0, 45.4) });
  const drop = ease.bounce(pr(t, 43.84, 44.3));
  if (t > 43.84) { ctx.save(); ctx.translate(sx, lerp(surf(sx) - 300, surf(sx) - 58, drop)); ctx.rotate(-tilt * -1 * 0 + tilt * -1 * -1); cube(0, 0, 58, { ry: 0, rx: -.3, eyes: pr(t, 44.4, 44.6), blink: BLINK(t + .5) }); ctx.restore();
    const fl = ease.back(pr(t, 44.95, 45.3)); if (fl > 0) { ctx.save(); ctx.translate(sx + 30, surf(sx) - 112); ctx.scale(fl, fl); ctx.strokeStyle = COL.cream; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -90); ctx.stroke(); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(90, -72); ctx.lineTo(0, -54); ctx.fill(); text('BENİM', 34, -64, { fam: 'JetBrains Mono', w: 700, size: 18, align: 'center', color: '#0b1328' }); ctx.restore(); } }
  // top: yuvarlanır ve düşer
  if (t > 45.57) { const p = pr(t, 46.44, 47.6); const bx = lerp(430, -200, ease.inQ(p)), by = p < .6 ? surf(lerp(430, 150, ease.inQ(p / .6))) - 36 : lerp(surf(150) - 36, 1700, ease.inQ((p - .6) / .4)); const bxx = p < .6 ? lerp(430, 150, ease.inQ(p / .6)) : lerp(150, -120, (p - .6) / .4);
    const pin = ease.bounce(pr(t, 45.57, 45.95)); const y0 = lerp(surf(430) - 300, surf(430) - 36, pin); const X = t < 46.44 ? 430 : bxx, Y = t < 46.44 ? y0 : by;
    ctx.save(); ctx.translate(X, Y); ctx.rotate(-(430 - X) / 36); const g = ctx.createRadialGradient(-10, -12, 4, 0, 0, 36); g.addColorStop(0, '#c4926a'); g.addColorStop(1, '#6d4526'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 36, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(40,20,10,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.stroke(); ctx.restore(); }
  stamp('TEORİ', 110, 520, pr(t, 40.2, 40.45) * (1 - pr(t, 47.6, 47.9)), { color: COL.amber, size: 48, rot: -.08 });
  const q = pr(t, 38.52, 38.7) * (1 - pr(t, 39.9, 40.2)); if (q > 0) { ctx.fillStyle = `rgba(11,19,40,${.7 * q})`; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(SAFE.cx, 860); const k = ease.el(pr(t, 38.52, 39.1)); ctx.scale(k, k); cube(0, 0, 130, { ry: t * 2, rx: -.45, alpha: q }); ctx.restore(); text('?', SAFE.cx + 200, 700, { size: 200, color: COL.amber, alpha: q, shadow: 30 }); }
}
// S10: Ig Nobel kürsüsü
function faceIcon(x, y, r, kind, a) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = '#2a1d15'; ctx.strokeStyle = '#2a1d15'; ctx.lineWidth = r * .1; ctx.lineCap = 'round';
  if (kind === 'laugh') { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * r * .35, y - r * .15, r * .15, Math.PI, 0); ctx.stroke(); } ctx.beginPath(); ctx.arc(x, y + r * .1, r * .45, 0, Math.PI); ctx.fill(); }
  else { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * r * .35, y - r * .15, r * .1, 0, 7); ctx.fill(); } ctx.beginPath(); ctx.moveTo(x - r * .3, y + r * .4); ctx.lineTo(x + r * .3, y + r * .3); ctx.stroke(); ctx.beginPath(); ctx.arc(x + r * .6, y + r * .6, r * .22, 0, 7); ctx.fill(); }
  ctx.restore(); }
function sceneAward(t) {
  ctx.fillStyle = '#10142a'; ctx.fillRect(0, 0, W, H);
  for (const s of [-1, 1]) { ctx.save(); ctx.translate(SAFE.cx + s * 420, 0); ctx.rotate(-s * .35); const g = ctx.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, 'rgba(255,240,200,.25)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.lineTo(260, 1500); ctx.lineTo(-260, 1500); ctx.fill(); ctx.restore(); }
  // kürsü
  ctx.fillStyle = '#e8e2d6'; rr(SAFE.cx - 170, 1080, 340, 300, 12); ctx.fill(); ctx.fillStyle = '#c8c1b3'; rr(SAFE.cx - 470, 1180, 290, 200, 12); ctx.fill(); rr(SAFE.cx + 180, 1230, 290, 150, 12); ctx.fill();
  text('1', SAFE.cx, 1260, { size: 150, align: 'center', color: '#10142a' });
  // küp zıplayarak çıkar
  const hop = pr(t, 48.0, 48.8); const cy = hop < 1 ? lerp(1500, 1000, ease.outC(hop)) - Math.sin(hop * Math.PI) * 250 : 1000 + Math.sin((t - 48.8) * 5) * 6 * (t < 52 ? 1 : 0);
  cube(SAFE.cx, cy, 70, { ry: .6 + Math.sin(t * 1.5) * .2, rx: -.4, eyes: 1, blink: BLINK(t) });
  // madalya
  const md = ease.bounce(pr(t, 51.9, 52.4)); if (t > 51.9) { const my = lerp(300, cy + 40, md); ctx.strokeStyle = COL.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(SAFE.cx - 50, my - 110); ctx.lineTo(SAFE.cx, my - 30); ctx.lineTo(SAFE.cx + 50, my - 110); ctx.stroke(); ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.arc(SAFE.cx, my, 34, 0, 7); ctx.fill(); sparkle(SAFE.cx, my, 18, { color: '#fff4dd' }); }
  // güldüren -> düşündüren
  const fa = pr(t, 48.8, 49.2) * (1 - pr(t, 52.0, 52.3)); if (fa > 0) { faceIcon(SAFE.cx - 180, 560, 80 * ease.back(pr(t, 49.0, 49.4)), 'laugh', fa); text('→', SAFE.cx, 590, { size: 80, align: 'center', alpha: fa * pr(t, 50.0, 50.3) }); faceIcon(SAFE.cx + 180, 560, 80 * ease.back(pr(t, 50.3, 50.7)), 'think', fa); }
  // konfeti
  if (t > 52.2) { const R = rng(12); for (let i = 0; i < 140; i++) { const d = t - 52.2 - R() * .2; if (d < 0) continue; const a = -Math.PI / 2 + (R() - .5) * 2.2, v = 700 + R() * 900; const x = SAFE.cx + Math.cos(a) * v * d + Math.sin(d * 6 + i) * 20, y = 1000 + Math.sin(a) * v * d + 900 * d * d; ctx.save(); ctx.translate(x, y); ctx.rotate(d * 10 * (R() - .5)); ctx.fillStyle = [COL.amber, COL.red, GREEN, '#3d8bfd', COL.cream][i % 5]; ctx.fillRect(-8, -4, 16, 8); ctx.restore(); } }
  const ia = pr(t, 52.2, 52.5); if (ia > 0) { text('IG NOBEL', SAFE.cx, 560, { size: 140, align: 'center', color: COL.amber, alpha: ia, shadow: 40 }); text('FİZİK · 2019', SAFE.cx, 640, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', alpha: ia, ls: 6 }); }
  stamp('KAYNAK: SOFT MATTER 2021 · IMPROBABLE RESEARCH', 90, 800, pr(t, 52.8, 53.05) * (1 - pr(t, 53.8, 54.1)), { size: 20, rot: -.03 });
}
// S11: vombat fabrikası
function sceneFactory(t) {
  ctx.fillStyle = '#16233d'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#1e3157'; for (let i = 0; i < 6; i++) ctx.fillRect(i * 200 - 40, 300 + (i % 2) * 80, 140, 900);
  // bant
  const by = 1250; ctx.fillStyle = '#2b3a55'; rr(-20, by, W + 40, 60, 30); ctx.fill(); ctx.fillStyle = '#4a5d80'; for (let x = -((t * 200) % 80); x < W; x += 80) { ctx.beginPath(); ctx.arc(x, by + 30, 16, 0, 7); ctx.fill(); }
  // vombat makinesi
  const mx = 560, my = 1030; const shake = Math.sin(t * 40) * 3 * (t > 55 ? 1 : 0);
  ctx.save(); ctx.translate(mx + shake, my); ctx.fillStyle = '#6c7a92'; rr(-230, -150, 460, 300, 60); ctx.fill(); ctx.fillStyle = '#8391aa'; rr(-230, -150, 460, 70, [60, 60, 0, 0]); ctx.fill();
  ctx.fillStyle = '#4a5670'; ctx.fillRect(120, -300, 70, 160); const R = rng(Math.floor(t * 8)); for (let i = 0; i < 3; i++) { const d = ((t * .8 + i / 3) % 1); ctx.fillStyle = `rgba(220,230,255,${.35 * (1 - d)})`; ctx.beginPath(); ctx.arc(155 + d * 60, -310 - d * 200, 30 + d * 50, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#6c7a92'; for (const ex of [-150, -60]) { ctx.beginPath(); ctx.ellipse(ex, -170, 34, 40, 0, 0, 7); ctx.fill(); }
  for (const ex of [-120, 20]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, -50, 34, 0, 7); ctx.fill(); ctx.fillStyle = '#140c08'; ctx.beginPath(); ctx.arc(ex - 6, -46, 18 * (1 - BLINK(t) * .9), 0, 7); ctx.fill(); }
  ctx.fillStyle = '#2a1d15'; ctx.beginPath(); ctx.ellipse(-230, 10, 40, 32, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,120,140,.45)'; ctx.beginPath(); ctx.ellipse(-170, 40, 24, 12, 0, 0, 7); ctx.fill();
  text('VOMBAT-3000', 20, 110, { fam: 'JetBrains Mono', w: 700, size: 32, align: 'center', color: COL.cream }); ctx.restore();
  // giren hammadde (yuvarlak) ve çıkan küpler
  const sp = 200; for (let i = 0; i < 10; i++) { const x = ((t - 53.8) * sp + i * 160) % 1600 - 300; if (x < mx - 200) { if (x > -60) { ctx.fillStyle = '#a8744a'; ctx.beginPath(); ctx.arc(x, by - 36, 34, 0, 7); ctx.fill(); } } else if (x > mx + 230) { cube(x, by - 38, 34, { ry: .6, rx: -.45, eyes: 1, blink: BLINK(t + i) }); } }
  const la = pr(t, 54.0, 54.3); if (la > 0) text('FABRİKA', SAFE.cx, 520, { fam: 'JetBrains Mono', w: 700, size: 48, align: 'center', alpha: la * (1 - pr(t, 58.3, 58.6)), ls: 12 });
  // son küp uçar -> ilk sahnenin kayası (döngü)
  const fly = ease.io(pr(t, 57.2, 58.5)); if (fly > 0) { cube(lerp(900, SAFE.cx, fly), lerp(by - 38, 860, fly) - Math.sin(fly * Math.PI) * 300, lerp(34, 170, fly), { ry: fly * 6, rx: -.45 }); }
}

// ======================================================================
const SCENES = [
  [0, 7.35, sceneOpen], [6.8, 12.4, sceneWombat], [12.1, 16.4, sceneXray], [16.1, 27.3, sceneLab], [27.1, 30.9, sceneBars], [30.7, 38.6, sceneSquare],
  [38.5, 48.1, sceneWhy], [47.9, 54.0, sceneAward], [53.8, 59.2, sceneFactory],
];
const FADES = { [sceneWombat.name]: [6.8, 7.3], [sceneXray.name]: [12.1, 12.35], [sceneLab.name]: [16.1, 16.4], [sceneBars.name]: [27.1, 27.35], [sceneSquare.name]: [30.7, 30.95], [sceneWhy.name]: [38.5, 38.6], [sceneAward.name]: [47.9, 48.15], [sceneFactory.name]: [53.8, 54.05] };
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px';
  ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t); ctx.save(); ctx.translate(sh.x, sh.y);
  for (const [a, b, f] of SCENES) { if (t < a || t >= b) continue; ctx.save(); const fd = FADES[f.name]; if (fd) { // kaydırmalı geçiş: yeni sahne sağdan kayar
      const p = ease.io(pr(t, fd[0], fd[1])); ctx.translate((1 - p) * W * .25, 0); ctx.globalAlpha = p; }
    f(t); ctx.restore(); }
  ctx.restore();
  if (t > LS - .2) { ctx.fillStyle = COL.ink; ctx.globalAlpha = pr(t, LS - .2, LS); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; logoSting(t, LS, SAFE.cx, 860, 620, [SAFE.cx, 860]); }
  vignette(.45); grain(t, .05);
  if (t < AUDIO_END) { const a = pr(t, .15, .5) * (1 - pr(t, AUDIO_END - .4, AUDIO_END)); chip(CAT.name, CAT.color, a * .9); timer(t / AUDIO_END, a); }
  captions(t, CAP, COL.amber);
  const fo = pr(t, END - .3, END); if (fo > 0) { ctx.fillStyle = `rgba(20,17,18,${fo})`; ctx.fillRect(0, 0, W, H); }
}
window.DURATION = END; window.render = render;
window.ready = Promise.all(['300 20px Outfit', '500 20px Outfit', '700 20px Outfit', '900 20px Outfit', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map(f => document.fonts.load(f, 'ÇĞİÖŞÜçğıöşü'))).then(() => true);
