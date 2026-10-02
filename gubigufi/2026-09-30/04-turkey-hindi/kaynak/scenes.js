// #4 Turkey = Hindi = Hindistan? — sahneler (zamanlar ses.mp3'ten ölçüldü)
const CAT = { name: 'KELİMENİN HİKÂYESİ #1', color: '#3D8BFD' };
const BLUE = '#3D8BFD', AUDIO_END = 56.19, END = 58.4, LS = 56.3;
const INK = '#c8302b', PAPER = '#efe3c6', PAPER2 = '#e2d2ad', NAVY = '#15213d';
IMPACTS.push([16.45, 7], [31.5, 7], [34.75, 7], [38.5, 5], [40.4, 5], [49.2, 5], [55.55, 10]);

const CAP = [
  [0.0, 2.28, 'İngilizler bu kuşa *"Türkiye"* diyor.'], [2.68, 4.22, 'Biz *"Hindistan"* diyoruz.'], [4.63, 5.29, 'Ama kuş...'], [5.69, 6.25, '*Amerikalı.*'],
  [6.71, 7.78, 'Peki bu *nasıl* oldu?'], [8.20, 11.84, "1500'lerde Avrupa'ya, Afrika'dan *beç tavuğu* geliyordu."], [12.26, 13.79, '*Osmanlı* toprakları üzerinden,'], [14.07, 14.97, 'Türk *tüccarlarla.*'],
  [15.39, 17.18, 'İngilizler ona *"turkey"* dedi.'], [17.53, 18.63, 'Yani, *Türk kuşu.*'],
  [19.11, 21.27, "Sonra *Amerika'dan* başka bir kuş geldi."], [21.63, 22.88, 'Beç tavuğuna *benziyordu.*'], [23.30, 25.80, 'İngilizler aynı adı, ona da *yapıştırdı.*'],
  [26.21, 27.97, 'Peki biz neden *"hindi"* diyoruz?'], [28.34, 30.43, "Çünkü *Kolomb,* Amerika'ya vardığında"], [30.61, 32.12, "*Hindistan'a* geldiğini sanıyordu."],
  [32.52, 34.33, 'Fransızlar da aynı *hatayı* yaptı.'], [34.68, 35.16, '*"Dinde",*'], [35.50, 36.71, "yani *Hindistan'dan.*"],
  [37.08, 39.28, 'Portekizliler ise ona *"peru"* diyor.'], [39.67, 41.10, 'Araplar, *"Rum horozu".*'],
  [41.50, 46.10, 'Yani tek bir kuş, dünyayı dolaşıp her dilde başka bir *ülkenin adını* almış.'], [46.43, 47.16, 'Ve *hiçbiri,*'], [47.44, 48.61, 'gerçek *memleketi* değil.'],
  [49.06, 50.73, 'Belki de bu yüzden,'], [50.85, 53.79, "Türkiye *2022'de* Birleşmiş Milletler'e adını bildirdi."], [54.24, 54.95, 'Turkey değil...'], [55.48, 56.19, '*Türkiye.*'],
];

// ======================================================================
// karakterler
function tag(x, y, s, txt, flip = 1, sway = 0, col = '#fbf6ec') { // bavul etiketi
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway); ctx.scale(s, s * flip);
  ctx.fillStyle = col; ctx.strokeStyle = 'rgba(60,40,20,.35)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-95, 0); ctx.lineTo(95, 0); ctx.lineTo(95, 70); ctx.lineTo(-95, 70); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#b9a88a'; ctx.beginPath(); ctx.arc(-72, 35, 9, 0, 7); ctx.fill();
  font(700, txt.length > 7 ? 30 : 38, 'JetBrains Mono'); ctx.fillStyle = '#231F20'; ctx.textAlign = 'center'; ctx.fillText(txt, 12, 49);
  ctx.restore();
}
function turkey(x, y, s, o = {}) {
  const { face = 1, blink = 0, tagTxt = null, tagFlip = 1, hat = 0, beret = 0, dizzy = 0, wink = 0, walk = 0, ph = 0, bob = 0 } = o;
  ctx.save(); ctx.translate(x, y - Math.abs(Math.sin(ph)) * 12 * walk - bob); ctx.scale(s * face, s);
  // kuyruk yelpazesi
  const fan = ['#5a3418', '#b8652a', '#e8c07a', '#7a4b2a'];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const a = -Math.PI * .95 + i / 8 * Math.PI * .9 + Math.sin(ph * .5) * .02; const L = 230 - r * 45; ctx.save(); ctx.translate(-40, -40); ctx.rotate(a); ctx.fillStyle = fan[(r + i) % 4]; ctx.beginPath(); ctx.ellipse(L * .55, 0, L * .55, 34 - r * 6, 0, 0, 7); ctx.fill(); if (r === 0) { ctx.fillStyle = '#f3e3c0'; ctx.beginPath(); ctx.ellipse(L - 16, 0, 12, 20, 0, 0, 7); ctx.fill(); } ctx.restore(); }
  // bacaklar
  ctx.strokeStyle = '#e88a2e'; ctx.lineWidth = 12; ctx.lineCap = 'round'; for (const [lx, o2] of [[-30, 0], [25, Math.PI]]) { const sw = Math.sin(ph + o2) * 20 * walk; ctx.beginPath(); ctx.moveTo(lx, 70); ctx.lineTo(lx + sw, 150); ctx.lineTo(lx + sw + 26, 156); ctx.stroke(); }
  // gövde
  const g = ctx.createRadialGradient(-10, -20, 20, 0, 20, 170); g.addColorStop(0, '#9a6538'); g.addColorStop(1, '#5a3418'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 20, 130, 120, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(40,20,5,.25)'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(-60 + i * 20, 30 + i * 8, 50, 16, .6, 0, 7); ctx.fill(); }
  // boyun + kafa
  ctx.fillStyle = '#a9c9e2'; ctx.beginPath(); ctx.moveTo(60, -40); ctx.quadraticCurveTo(110, -80, 100, -150); ctx.lineTo(150, -150); ctx.quadraticCurveTo(150, -60, 100, -10); ctx.fill();
  ctx.beginPath(); ctx.ellipse(125, -170, 52, 50, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#e04848'; ctx.beginPath(); ctx.ellipse(150, -110, 16, 34, .2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(158, -170); ctx.quadraticCurveTo(190, -150, 176, -110); ctx.lineWidth = 9; ctx.strokeStyle = '#e04848'; ctx.stroke();
  ctx.fillStyle = '#f2b33d'; ctx.beginPath(); ctx.moveTo(170, -175); ctx.lineTo(205, -165); ctx.lineTo(170, -152); ctx.fill();
  for (const [ex, w] of [[118, 0], [150, wink]]) { ctx.fillStyle = '#140c08'; const k = 1 - Math.max(blink, w) * .92; ctx.beginPath(); ctx.ellipse(ex, -182, 10, 13 * k, 0, 0, 7); ctx.fill(); if (k > .5) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 3, -187, 4, 0, 7); ctx.fill(); } }
  ctx.fillStyle = 'rgba(255,120,140,.55)'; ctx.beginPath(); ctx.ellipse(105, -155, 12, 7, 0, 0, 7); ctx.fill();
  // şapkalar
  if (hat > 0) { ctx.save(); ctx.translate(128, lerp(-600, -212, ease.bounce(hat))); ctx.fillStyle = '#8a5a2a'; ctx.beginPath(); ctx.ellipse(0, 0, 95, 20, -.05, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-50, -2); ctx.quadraticCurveTo(-55, -70, -10, -62); ctx.quadraticCurveTo(0, -52, 10, -62); ctx.quadraticCurveTo(55, -70, 50, -2); ctx.fill(); ctx.fillStyle = '#5a3418'; ctx.fillRect(-50, -18, 100, 12); ctx.restore(); }
  if (beret > 0) { ctx.save(); ctx.translate(120, lerp(-600, -212, ease.bounce(beret))); ctx.rotate(-.25); ctx.fillStyle = '#23304f'; ctx.beginPath(); ctx.ellipse(0, 0, 70, 26, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-4, -34, 8, 12); ctx.restore(); }
  if (dizzy > 0) { for (let i = 0; i < 3; i++) { const a = ph * 3 + i * 2.1; sparkle(125 + Math.cos(a) * 80, -250 + Math.sin(a) * 20, 16 * dizzy, { color: COL.amber }); } }
  ctx.restore();
  // etiket (dünya koordinatı; ayna etkilenmesin)
  if (tagTxt) { const nx = x + 90 * s * face, ny = y - 60 * s - bob; ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(nx - 20 * s * face, ny + 90 * s); ctx.stroke(); tag(nx - 20 * s * face, ny + 90 * s, s * 1.3, tagTxt, tagFlip, Math.sin(ph * .7) * .06); }
}
function guinea(x, y, s, o = {}) {
  const { face = 1, blink = 0, walk = 0, ph = 0, tagTxt = null } = o;
  ctx.save(); ctx.translate(x, y - Math.abs(Math.sin(ph)) * 10 * walk); ctx.scale(s * face, s);
  ctx.strokeStyle = '#e88a2e'; ctx.lineWidth = 10; ctx.lineCap = 'round'; for (const [lx, o2] of [[-25, 0], [20, Math.PI]]) { const sw = Math.sin(ph + o2) * 18 * walk; ctx.beginPath(); ctx.moveTo(lx, 60); ctx.lineTo(lx + sw, 120); ctx.stroke(); }
  ctx.fillStyle = '#3a3f4a'; ctx.beginPath(); ctx.ellipse(0, 10, 110, 85, -.1, 0, 7); ctx.fill();
  const R = rng(5); ctx.fillStyle = '#e8eef5'; for (let i = 0; i < 60; i++) { const a = R() * 6.28, r = Math.sqrt(R()) * .9; ctx.beginPath(); ctx.arc(Math.cos(a) * 100 * r, 10 + Math.sin(a) * 75 * r, 4, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#3a3f4a'; ctx.beginPath(); ctx.moveTo(60, -30); ctx.quadraticCurveTo(95, -70, 90, -110); ctx.lineTo(118, -110); ctx.quadraticCurveTo(118, -50, 90, -10); ctx.fill();
  ctx.fillStyle = '#9ec6e8'; ctx.beginPath(); ctx.ellipse(106, -125, 32, 30, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e04848'; ctx.beginPath(); ctx.ellipse(112, -94, 9, 14, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c7a06a'; ctx.beginPath(); ctx.moveTo(98, -158); ctx.lineTo(110, -178); ctx.lineTo(118, -156); ctx.fill();
  ctx.fillStyle = '#f2b33d'; ctx.beginPath(); ctx.moveTo(134, -128); ctx.lineTo(156, -120); ctx.lineTo(134, -112); ctx.fill();
  ctx.fillStyle = '#140c08'; ctx.beginPath(); ctx.ellipse(114, -132, 7, 9 * (1 - blink * .9), 0, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(116, -135, 2.5, 0, 7); ctx.fill();
  ctx.restore();
  if (tagTxt) { const nx = x + 80 * s * face, ny = y - 40 * s; ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(nx - 10 * s * face, ny + 70 * s); ctx.stroke(); tag(nx - 10 * s * face, ny + 70 * s, s * 1.2, tagTxt, 1, Math.sin(ph * .7) * .06); }
}
const BLINK = t => { const k = t % 2.9; return k < .12 ? Math.sin(k / .12 * Math.PI) : 0; };
// mürekkep damgası
function inkStamp(txt, x, y, p, { size = 70, rot = -.12, sub = null, col = INK } = {}) {
  if (p <= 0) return; const k = lerp(2.2, 1, ease.outC(pr(p, 0, .35)));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); ctx.globalAlpha *= cl(p * 4) * .9;
  font(900, size); const w = ctx.measureText(txt).width + 60, h = size + (sub ? 70 : 40);
  ctx.strokeStyle = col; ctx.lineWidth = 7; rr(-w / 2, -h / 2, w, h, 16); ctx.stroke(); ctx.lineWidth = 3; rr(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(txt, 0, sub ? size * .15 : size * .35);
  if (sub) { font(700, size * .32, 'JetBrains Mono'); ctx.fillText(sub, 0, size * .72); }
  // mürekkep dokusu (boşluklar)
  const R = rng(txt.length * 7); ctx.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(0,0,0,${.3 + R() * .5})`; ctx.beginPath(); ctx.arc((R() - .5) * w, (R() - .5) * h, 2 + R() * 5, 0, 7); ctx.fill(); }
  ctx.restore();
}
// harita parçaları
const LAND = {
  britain: [[200, 400], [245, 380], [270, 440], [255, 520], [215, 540], [190, 480]],
  europe: [[300, 470], [420, 430], [560, 450], [640, 520], [610, 600], [520, 640], [430, 700], [360, 660], [310, 580]],
  anatolia: [[600, 700], [720, 680], [830, 700], [850, 760], [760, 800], [640, 790], [590, 750]],
  africa: [[330, 860], [520, 830], [700, 870], [780, 980], [720, 1180], [620, 1350], [530, 1380], [470, 1250], [380, 1120], [320, 980]],
  america: [[60, 520], [260, 480], [320, 600], [240, 760], [290, 900], [240, 1150], [160, 1320], [110, 1150], [120, 900], [40, 740]],
  india: [[860, 820], [960, 800], [1000, 880], [940, 1010], [900, 930]],
};
function blob(pts, col) { ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; if (i === 0) ctx.moveTo(m[0], m[1]); ctx.quadraticCurveTo(q[0], q[1], (q[0] + pts[(i + 2) % pts.length][0]) / 2, (q[1] + pts[(i + 2) % pts.length][1]) / 2); } ctx.closePath(); ctx.fill(); }
function parchment(t) {
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  const R = rng(22); for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(120,90,50,${R() * .06})`; ctx.beginPath(); ctx.arc(R() * W, R() * H, 10 + R() * 60, 0, 7); ctx.fill(); }
  ctx.strokeStyle = 'rgba(120,90,50,.18)'; ctx.lineWidth = 2; for (let x = 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 60; y < H; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}
function mapLabel(s, x, y, a = 1) { text(s, x, y, { fam: 'JetBrains Mono', w: 700, size: 30, align: 'center', color: '#5a4630', alpha: a, ls: 4 }); }

// ======================================================================
// S1: etiket döner, kovboy şapkası, pasaport
function sceneIntro(t) {
  const g = ctx.createRadialGradient(540, 800, 100, 540, 900, 1300); g.addColorStop(0, '#2a4a86'); g.addColorStop(1, '#0e1830'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // uçuşan harf parçacıkları
  const R = rng(4); for (let i = 0; i < 26; i++) { const y = (R() * H - t * (40 + R() * 60)) % H; text('TURKEY HİNDİ DINDE PERU'.split(' ')[i % 4], R() * W, (y + H) % H, { fam: 'JetBrains Mono', w: 700, size: 22, alpha: .08 }); }
  const intro = ease.back(pr(t, 0, .45)), jump = pr(t, 6.9, 7.8);
  const flip = t < 3.03 ? 1 : Math.cos(pr(t, 3.03, 3.3) * Math.PI * 2);
  const txt = t < 3.15 ? 'TURKEY' : t < 5.1 ? 'HİNDİ' : '?';
  const f2 = t > 4.8 && t < 5.4 ? Math.cos(pr(t, 4.8, 5.4) * Math.PI * 2) : flip;
  const by = 1080 - Math.sin(Math.min(jump, 1) * Math.PI) * 500 * (jump < .5 ? 1 : 1) + ease.inQ(pr(jump, .5, 1)) * 400;
  const sc = lerp(1.25, .45, ease.inQ(pr(jump, .4, 1))) * intro;
  if (jump < 1) turkey(SAFE.cx - 30, by, sc, { blink: BLINK(t), tagTxt: jump < .3 ? txt : null, tagFlip: f2, hat: pr(t, 5.69, 6.2), ph: t * 4, bob: Math.sin(t * 3) * 6 });
  // dil balonları
  const bub = (s_, x, y, a0, a1) => { const a = ease.back(pr(t, a0, a0 + .3)) * (1 - pr(t, a1, a1 + .2)); if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.fillStyle = COL.cream; rr(-170, -55, 340, 110, 55); ctx.fill(); ctx.beginPath(); ctx.moveTo(-20, 50); ctx.lineTo(10, 90); ctx.lineTo(30, 50); ctx.fill(); text(s_, 0, 14, { fam: 'JetBrains Mono', w: 700, size: 34, align: 'center', color: NAVY }); ctx.restore(); };
  bub('İNGİLİZCE', 280, 470, .2, 2.5); bub('TÜRKÇE', 700, 470, 2.68, 4.4);
  const us = pr(t, 5.8, 6.1) * (1 - pr(t, 6.7, 6.9)); if (us > 0) text('MEMLEKETİ: AMERİKA', SAFE.cx, 520, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', color: COL.amber, alpha: us, ls: 3 });
  // pasaport kapağı
  const pp = ease.outC(pr(t, 7.2, 7.7)), open = ease.io(pr(t, 7.9, 8.35));
  if (pp > 0) { ctx.save(); ctx.translate(SAFE.cx, lerp(1900, 900, pp)); const ps = lerp(.55, 2.6, open); ctx.scale(ps * Math.cos(open * Math.PI / 2 * .98), ps);
    ctx.fillStyle = NAVY; rr(-190, -260, 380, 520, 22); ctx.fill(); ctx.strokeStyle = '#d7b46a'; ctx.lineWidth = 4; rr(-170, -240, 340, 480, 14); ctx.stroke();
    ctx.fillStyle = '#d7b46a'; ctx.beginPath(); ctx.arc(0, -40, 60, 0, 7); ctx.fill(); ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(0, -40, 46, 0, 7); ctx.fill(); sparkle(0, -40, 30, { color: '#d7b46a' });
    text('PASAPORT', 0, 110, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', color: '#d7b46a', ls: 6 }); text('KUŞ · BIRD', 0, 160, { fam: 'JetBrains Mono', w: 500, size: 22, align: 'center', color: '#d7b46a' });
    ctx.restore(); }
  const q = pr(t, 6.71, 6.9) * (1 - pr(t, 7.5, 7.7)); if (q > 0) text('?', 830, 700, { size: 220, color: COL.amber, alpha: q, shadow: 30 });
}
// S2: Afrika -> Osmanlı -> Avrupa -> İngiltere
const ROUTE1 = [[520, 1180], [560, 1000], [640, 880], [700, 760], [600, 640], [450, 560], [300, 500], [235, 460]];
function sceneRoute(t) {
  parchment(t);
  for (const k of ['britain', 'europe', 'anatolia', 'africa']) blob(LAND[k], k === 'anatolia' ? '#d9b279' : PAPER2);
  ctx.strokeStyle = 'rgba(90,70,40,.35)'; ctx.lineWidth = 3; for (const k of ['britain', 'europe', 'anatolia', 'africa']) { ctx.beginPath(); LAND[k].forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.stroke(); }
  mapLabel('AFRİKA', 560, 1250, pr(t, 8.3, 8.6)); mapLabel('OSMANLI', 740, 850, pr(t, 12.2, 12.5)); mapLabel('AVRUPA', 470, 620, pr(t, 14.5, 14.8)); mapLabel('İNGİLTERE', 250, 360, pr(t, 15.3, 15.6));
  const rp = t < 12.26 ? lerp(0, .3, ease.io(pr(t, 8.5, 11.8))) : t < 15.39 ? lerp(.3, .62, ease.io(pr(t, 12.3, 14.9))) : lerp(.62, 1, ease.io(pr(t, 15.4, 16.3)));
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.setLineDash([18, 14]); ctx.lineCap = 'round'; strokeProgress(ROUTE1, rp); ctx.setLineDash([]);
  // yürüyen beç tavuğu rota ucunda
  let L = 0; const seg = []; for (let i = 1; i < ROUTE1.length; i++) { const d = Math.hypot(ROUTE1[i][0] - ROUTE1[i - 1][0], ROUTE1[i][1] - ROUTE1[i - 1][1]); seg.push(d); L += d; }
  let rem = L * rp, px = ROUTE1[0][0], py = ROUTE1[0][1], dir = 1; for (let i = 1; i < ROUTE1.length; i++) { if (rem > seg[i - 1]) { rem -= seg[i - 1]; continue; } const k = rem / seg[i - 1]; px = lerp(ROUTE1[i - 1][0], ROUTE1[i][0], k); py = lerp(ROUTE1[i - 1][1], ROUTE1[i][1], k); dir = ROUTE1[i][0] >= ROUTE1[i - 1][0] ? 1 : -1; break; }
  // tüccar (sarıklı) + kervan
  const ta = ease.back(pr(t, 14.07, 14.4)); if (ta > 0) { ctx.save(); ctx.translate(780, 740); ctx.scale(ta, ta); person(0, 0, 150, { color: '#3a2618', face: -1, arm: -.4 }); ctx.fillStyle = '#f3e3c0'; ctx.beginPath(); ctx.ellipse(-2, -140, 18, 13, 0, 0, 7); ctx.fill(); ctx.restore(); }
  guinea(px, py - 80, .55, { face: dir, walk: 1, ph: t * 10, blink: BLINK(t) });
  inkStamp('TURKEY', 560, 470, pr(t, 16.3, 17.2), { size: 90, rot: -.14, sub: t > 17.9 ? '= TÜRK KUŞU' : null });
  const ya = pr(t, 8.2, 8.5) * (1 - pr(t, 11.8, 12.1)); if (ya > 0) text('1500\'LER', SAFE.cx, 520, { size: 110, align: 'center', color: '#5a4630', alpha: ya });
}
// S3: Amerika'dan hindi, karşılaştırma, etiket uçar
function sceneSwap(t) {
  parchment(t);
  ctx.fillStyle = 'rgba(61,139,253,.12)'; ctx.fillRect(0, 0, W, H);
  const pan = ease.io(pr(t, 19.0, 20.4)) * (1 - ease.io(pr(t, 21.3, 21.8)));
  ctx.save(); ctx.translate(lerp(0, 300, pan), 0); blob(LAND.america, PAPER2); mapLabel('AMERİKA', 170, 450, pr(t, 19.2, 19.5) * (1 - pr(t, 21.3, 21.6))); ctx.restore();
  // dalgalar
  ctx.strokeStyle = 'rgba(61,139,253,.35)'; ctx.lineWidth = 4; for (let r = 0; r < 6; r++) { ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 1000 + r * 60 + 8 * Math.sin(x * .03 + t * 3 + r)); ctx.stroke(); }
  // hindi gemiyle gelir
  const arr = ease.outC(pr(t, 19.1, 21.2));
  const tx = lerp(-200, 730, arr), ty = lerp(1150, 1080, arr);
  if (arr < 1) { ctx.fillStyle = '#6b4424'; ctx.beginPath(); ctx.moveTo(tx - 170, ty + 60); ctx.lineTo(tx + 170, ty + 60); ctx.lineTo(tx + 120, ty + 120); ctx.lineTo(tx - 120, ty + 120); ctx.fill(); }
  const cmp = pr(t, 21.63, 22.0);
  guinea(lerp(430, 290, cmp), 1110, .75, { face: 1, blink: BLINK(t + .3), tagTxt: t < 23.4 ? 'TURKEY' : null });
  turkey(tx, ty - 10, .62, { face: -1, blink: BLINK(t), tagTxt: t > 24.8 ? 'TURKEY' : null, walk: arr < 1 ? .3 : 0, ph: t * 8 });
  if (cmp > 0 && cmp < 1 || (t > 22 && t < 23.3)) { const a = pr(t, 21.63, 21.9) * (1 - pr(t, 23.0, 23.3)); text('≈', SAFE.cx + 30, 900, { size: 180, align: 'center', color: BLUE, alpha: a, shadow: 20 }); text('BENZER', SAFE.cx + 30, 980, { fam: 'JetBrains Mono', w: 700, size: 34, align: 'center', color: '#5a4630', alpha: a, ls: 6 }); }
  // uçan etiket
  const fl = ease.io(pr(t, 23.4, 24.8)); if (fl > 0 && fl < 1) { const x = lerp(360, 640, fl), y = lerp(1110, 1010, fl) - Math.sin(fl * Math.PI) * 420; tag(x, y, 1.0, 'TURKEY', 1, Math.sin(fl * 12) * .4); }
  const pl = pr(t, 24.8, 25.2); if (pl > 0 && pl < 1) { ctx.strokeStyle = rgba(COL.amber, 1 - pl); ctx.lineWidth = 5; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; ctx.beginPath(); ctx.moveTo(700 + Math.cos(a) * 60 * (1 + pl), 1080 + Math.sin(a) * 60 * (1 + pl)); ctx.lineTo(700 + Math.cos(a) * 90 * (1 + pl), 1080 + Math.sin(a) * 90 * (1 + pl)); ctx.stroke(); } }
}
// S4: Kolomb, yanlış harita, Fransızlar
function sceneColumbus(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 1100); sky.addColorStop(0, '#f6c98a'); sky.addColorStop(1, '#f2e2c0'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f9dfa0'; ctx.beginPath(); ctx.arc(820, 820, 110, 0, 7); ctx.fill();
  for (let r = 0; r < 7; r++) { ctx.fillStyle = mix('#5f9fd9', '#1e4f8a', r / 6); ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 1060 + r * 80 + 12 * Math.sin(x * .02 + t * (2 + r * .3) + r)); ctx.lineTo(W, H); ctx.fill(); }
  // gemi
  const sx = lerp(-150, 560, ease.outC(pr(t, 26.2, 30.5))), sy = 1080 + Math.sin(t * 2.2) * 10, rk = Math.sin(t * 1.8) * .05;
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(rk); ctx.fillStyle = '#5a3418'; ctx.beginPath(); ctx.moveTo(-210, -20); ctx.lineTo(210, -20); ctx.lineTo(160, 60); ctx.lineTo(-170, 60); ctx.fill();
  ctx.fillStyle = '#7a4b2a'; for (const mx of [-110, 0, 110]) ctx.fillRect(mx - 5, -300, 10, 290);
  ctx.fillStyle = '#f7f0df'; for (const [mx, h] of [[-110, 180], [0, 230], [110, 170]]) { ctx.beginPath(); ctx.moveTo(mx - 70, -280); ctx.quadraticCurveTo(mx + 20, -280 + h / 2, mx - 70, -280 + h); ctx.lineTo(mx + 70, -280 + h); ctx.quadraticCurveTo(mx + 110, -280 + h / 2, mx + 70, -280); ctx.fill(); ctx.fillStyle = INK; ctx.fillRect(mx - 8, -230, 16, 60); ctx.fillRect(mx - 26, -210, 52, 16); ctx.fillStyle = '#f7f0df'; }
  ctx.restore();
  // Kolomb'un haritası
  const ma = ease.back(pr(t, 28.3, 28.7)) * (1 - pr(t, 32.3, 32.6));
  if (ma > 0) { ctx.save(); ctx.translate(SAFE.cx, 560); ctx.scale(ma, ma); ctx.rotate(-.04); ctx.fillStyle = PAPER; ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 20; rr(-330, -170, 660, 300, 18); ctx.fill(); ctx.shadowBlur = 0;
    text('KOLOMB\'UN ROTASI · 1492', 0, -110, { fam: 'JetBrains Mono', w: 500, size: 24, align: 'center', color: '#5a4630' });
    ctx.strokeStyle = '#5a4630'; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(-260, 40); ctx.quadraticCurveTo(0, -60, 200, 20); ctx.stroke(); ctx.setLineDash([]);
    text('HİNDİSTAN', 120, 90, { size: 56, align: 'center', color: '#231F20' });
    const st = ease.outC(pr(t, 30.6, 30.9)); if (st > 0) { ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-40, 72); ctx.lineTo(-40 + 330 * st, 72); ctx.stroke(); text('AMERİKA', 120, 10, { size: 44, align: 'center', color: INK, alpha: pr(t, 30.9, 31.1) }); }
    ctx.restore(); }
  // hindi gemide
  turkey(sx + 40, sy - 80, .32, { face: 1, blink: BLINK(t), beret: pr(t, 32.52, 33.0), ph: t * 3 });
  inkStamp('HİNDİ', 300, 830, pr(t, 31.4, 32.3) * (1 - pr(t, 32.4, 32.7)), { size: 100, rot: -.1 });
  const fr = pr(t, 32.52, 32.8) * (1 - pr(t, 36.8, 37.0)); if (fr > 0) text('FRANSIZCA', SAFE.cx, 520, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: NAVY, alpha: fr, ls: 6 });
  inkStamp('DINDE', SAFE.cx, 760, pr(t, 34.68, 35.4) * (1 - pr(t, 36.8, 37.0)), { size: 100, rot: .08, sub: t > 35.88 ? "= d'Inde · HİNDİSTAN'DAN" : null, col: '#23304f' });
}
// S5: pasaport sayfaları hızla döner
function passportPage(k, t) {
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(61,139,253,.18)'; ctx.lineWidth = 2; for (let i = -20; i < 40; i++) { ctx.beginPath(); ctx.moveTo(i * 60, 0); ctx.lineTo(i * 60 + 600, H); ctx.stroke(); }
  text('PASAPORT · SAYFA ' + (k + 3), SAFE.cx, 400, { fam: 'JetBrains Mono', w: 500, size: 26, align: 'center', color: '#5a4630' });
  const P = [['PORTEKİZCE', 'PERU', 38.49, 'ÜLKE: PERU'], ['ARAPÇA', 'DİK RÛMÎ', 40.41, 'RUM HOROZU']][k];
  text(P[0], SAFE.cx, 520, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: NAVY, ls: 6 });
  turkey(SAFE.cx - 60, 1200, .7, { blink: BLINK(t), tagTxt: P[1] === 'DİK RÛMÎ' ? 'RUM HOROZU' : P[1], ph: t * 4, bob: Math.sin(t * 5) * 4 });
  inkStamp(P[1], SAFE.cx, 720, pr(t, P[2], P[2] + .7), { size: 100, rot: k ? .1 : -.1, sub: P[3], col: k ? '#1f7a4a' : INK });
}
function scenePages(t) {
  const flip = [38.0, 39.4], k = t < 39.55 ? 0 : 1;
  passportPage(k, t);
  for (const f of flip) { const p = pr(t, f, f + .3); if (p > 0 && p < 1) { ctx.save(); ctx.translate(0, 0); ctx.scale(1 - p, 1); ctx.fillStyle = PAPER2; ctx.fillRect(0, 0, W, H); ctx.fillStyle = `rgba(0,0,0,${.3 * p})`; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
  const ini = 1 - pr(t, 37.0, 37.35); if (ini > 0) { ctx.save(); ctx.scale(ini, 1); ctx.fillStyle = PAPER2; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
// S6: dolaşık rotalar yumağı
const ROUTES = (() => { const R = rng(19), pts = [[200, 700], [300, 480], [470, 560], [720, 740], [560, 1100], [940, 900], [180, 1100], [400, 800]]; return Array.from({ length: 18 }, (_, i) => { const a = pts[Math.floor(R() * pts.length)], b = pts[Math.floor(R() * pts.length)]; return { a, b, c: [(a[0] + b[0]) / 2 + (R() - .5) * 700, (a[1] + b[1]) / 2 + (R() - .5) * 700], col: [INK, BLUE, '#1f7a4a', '#d98a2b', '#7b61ff'][i % 5], d: R() * .5 }; }); })();
function sceneTangle(t) {
  parchment(t);
  const z = lerp(1.25, .9, ease.io(pr(t, 41.5, 46.0)));
  ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
  for (const k of Object.keys(LAND)) blob(LAND[k], PAPER2);
  const gather = ease.io(pr(t, 45.0, 46.4));
  for (const r of ROUTES) { const p = ease.io(pr(t, 41.6 + r.d * 3, 43.6 + r.d * 3)); if (p <= 0) continue; const a = r.a.map((v, i) => lerp(v, [540, 880][i] + (r.a[i] - [540, 880][i]) * .12, gather)), b = r.b.map((v, i) => lerp(v, [540, 880][i] + (r.b[i] - [540, 880][i]) * .12, gather)), c = r.c.map((v, i) => lerp(v, [540, 880][i] + (r.c[i] - [540, 880][i]) * .2, gather));
    ctx.strokeStyle = r.col; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); ctx.lineDashOffset = -t * 60; strokeProgress(bez(a, c, c, b, 30), p); ctx.setLineDash([]); }
  ctx.restore();
  turkey(SAFE.cx - 20, 1230, .62, { blink: BLINK(t), dizzy: pr(t, 46.3, 46.7), ph: t * 4, tagTxt: ['TURKEY', 'HİNDİ', 'DINDE', 'PERU', 'RUM HOROZU'][Math.floor(t * 4) % 5] });
  const ya = pr(t, 47.44, 47.7) * (1 - pr(t, 48.9, 49.1)); if (ya > 0) { text('GERÇEK MEMLEKETİ', SAFE.cx, 470, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', color: '#5a4630', alpha: ya, ls: 4 }); text('KUZEY AMERİKA', SAFE.cx, 580, { size: 96, align: 'center', color: INK, alpha: ya }); }
  const ha = pr(t, 46.43, 46.7) * (1 - pr(t, 47.3, 47.5)); if (ha > 0) text('HİÇBİRİ ✗', SAFE.cx, 560, { size: 120, align: 'center', color: INK, alpha: ha });
}
// S7: BM isim plakası
function plate(x, y, txt, rot = 0, s = 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#fbfaf6'; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8; ctx.beginPath(); ctx.moveTo(-300, -80); ctx.lineTo(300, -80); ctx.lineTo(320, 80); ctx.lineTo(-320, 80); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; font(900, 110); ctx.fillStyle = '#1a1a1a'; ctx.textAlign = 'center'; ctx.fillText(txt, 0, 38); ctx.restore(); }
function sceneUN(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b3a6b'); g.addColorStop(1, '#0c1a33'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // genel kurul salonu arka planı
  for (let r = 0; r < 6; r++) { ctx.strokeStyle = `rgba(215,180,106,${.12 + r * .02})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 1700, 500 + r * 160, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 40; i++) { const a = Math.PI * 1.15 + i / 40 * Math.PI * .7; ctx.beginPath(); ctx.arc(540 + Math.cos(a) * 900, 1700 + Math.sin(a) * 900, 14, 0, 7); ctx.fill(); }
  text('BİRLEŞMİŞ MİLLETLER · 2022', SAFE.cx, 470, { fam: 'JetBrains Mono', w: 700, size: 38, align: 'center', color: '#d7b46a', alpha: pr(t, 49.1, 49.4), ls: 4 });
  // masa
  ctx.fillStyle = '#6b4424'; rr(40, 1180, 1000, 260, 18); ctx.fill(); ctx.fillStyle = '#7d5230'; ctx.fillRect(40, 1180, 1000, 40);
  const fall = ease.inQ(pr(t, 54.35, 54.95));
  if (fall < 1) plate(SAFE.cx + fall * 60, 1090 + fall * 900, 'TURKEY', Math.sin(pr(t, 54.24, 54.4) * 30) * .04 * (1 - fall) + fall * 1.4);
  const drop = ease.bounce(pr(t, 55.35, 55.8)); if (t > 55.35) { plate(SAFE.cx, lerp(-200, 1090, drop), 'TÜRKİYE'); const sp = pr(t, 55.6, 56.2); if (sp > 0 && sp < 1) for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + .3; sparkle(SAFE.cx + Math.cos(a) * 380 * ease.outC(sp), 1090 + Math.sin(a) * 180 * ease.outC(sp), 26 * (1 - sp), { glow: 20 }); } }
  // hindi masanın yanında göz kırpar
  turkey(900, 1100, .42, { face: -1, blink: BLINK(t), wink: pr(t, 55.8, 55.95) * (1 - pr(t, 56.2, 56.35)), ph: t * 4 });
  stamp('KAYNAK: ETYMONLINE · MERRIAM-WEBSTER', 90, 700, pr(t, 50.0, 50.25) * (1 - pr(t, 53.6, 53.9)), { size: 22, rot: -.03 });
}

// ======================================================================
const SCENES = [[0, 8.4, sceneIntro], [8.2, 19.2, sceneRoute], [18.9, 26.4, sceneSwap], [26.1, 37.1, sceneColumbus], [37.0, 41.6, scenePages], [41.4, 49.2, sceneTangle], [49.0, 56.6, sceneUN]];
// geçiş: mürekkep dairesi (irisle açılma) — yeni sahne büyüyen daire içinde
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px';
  ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t); ctx.save(); ctx.translate(sh.x, sh.y);
  SCENES.forEach(([a, b, f], i) => { if (t < a || t >= b) return; ctx.save();
    if (i > 0 && f !== scenePages) { const p = ease.io(pr(t, a, a + .3)); if (p < 1) { ctx.beginPath(); ctx.arc(SAFE.cx, 900, 1200 * p + 1, 0, 7); ctx.clip(); } }
    f(t); ctx.restore(); });
  ctx.restore();
  if (t > LS - .2) { ctx.fillStyle = COL.ink; ctx.globalAlpha = pr(t, LS - .2, LS); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; logoSting(t, LS, SAFE.cx, 860, 620, [SAFE.cx, 1090]); }
  vignette(.35); grain(t, .05);
  if (t < AUDIO_END) { const a = pr(t, .15, .5) * (1 - pr(t, AUDIO_END - .4, AUDIO_END)); ctx.fillStyle = `rgba(20,17,18,${.55 * a})`; rr(62, 268, 430, 48, 24); ctx.fill(); ctx.beginPath(); ctx.arc(846, 300, 44, 0, 7); ctx.fill(); chip(CAT.name, CAT.color, a * .9); timer(t / AUDIO_END, a); }
  captions(t, CAP, COL.amber);
  const fo = pr(t, END - .3, END); if (fo > 0) { ctx.fillStyle = `rgba(20,17,18,${fo})`; ctx.fillRect(0, 0, W, H); }
}
window.DURATION = END; window.render = render;
window.ready = Promise.all(['300 20px Outfit', '500 20px Outfit', '700 20px Outfit', '900 20px Outfit', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map(f => document.fonts.load(f, 'ÇĞİÖŞÜçğıöşüÂâÎî'))).then(() => true);
