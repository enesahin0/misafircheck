// #1 Göbeklitepe — sahneler (zamanlar ses.mp3'ten ölçüldü)
const CAT = { name: 'TÜRKİYE & ANADOLU', color: '#E07A3F' };
const TERRA = '#E07A3F', AUDIO_END = 59.72, END = 61.75;
IMPACTS.push([4.85, 20], [42.72, 24], [50.1, 6], [13.9, 8]);

const CAP = [
  [0.03, 1.02, "*Stonehenge'den*"], [1.12, 2.23, '*altı bin yıl* önce,'], [2.64, 3.59, "*Urfa'da* birileri"], [3.72, 5.36, '*on tonluk* taşları dikiyordu.'],
  [5.81, 6.79, 'Ama bir *sorun* var...'], [7.15, 8.0, 'Bu insanlar daha'], [8.0, 9.10, '*çiftçi* bile değildi.'],
  [9.47, 10.61, 'Ne *tarla* vardı,'], [10.76, 11.76, 'ne çanak *çömlek,*'], [12.0, 12.92, 'ne de *metal* alet.'],
  [13.26, 14.27, 'Sadece *taş...*'], [14.54, 15.78, 've *avcı-toplayıcılar.*'], [16.18, 17.40, 'Burası *Göbeklitepe.*'], [17.77, 19.19, '*On bir bin* yıldan yaşlı.'],
  [19.54, 20.56, '*Piramitlerden* de,'], [20.70, 22.59, '*yazının* icadından da çok önce.'], [22.99, 24.14, 'Bu dev sütunlar'], [24.27, 25.54, 'aslında birer *insan.*'],
  [25.92, 26.53, '*Kolları,*'], [26.67, 27.19, '*elleri,*'], [27.29, 28.68, '*kemerleri* taşa oyulmuş.'],
  [28.98, 30.28, 'Üzerlerinde *tilkiler,*'], [30.52, 31.45, 'yaban *domuzları,*'], [31.60, 32.81, '*akbabalar* dolaşıyor.'],
  [33.18, 34.4, "*1963'te* buraya gelen"], [34.4, 35.79, 'araştırmacılar,'], [36.05, 37.93, 'tepeyi sıradan bir *mezarlık* sandı'], [38.10, 39.01, 've geçip gitti.'],
  [39.37, 39.92, 'Ta ki'], [40.03, 41.6, "*1995'te* *Klaus* *Schmidt*"], [41.6, 43.56, 'kazmaya başlayana kadar.'],
  [43.88, 44.56, 'Bulduğu şey,'], [44.73, 45.7, 'ders kitaplarındaki'], [45.7, 46.79, 'sırayı *ters* çevirdi.'],
  [47.13, 48.20, 'Hep önce *tarım,*'], [48.33, 49.45, 'sonra *tapınak* dedik.'], [49.81, 51.29, '*Göbeklitepe* ise diyor ki:'], [51.63, 53.52, '*belki de* önce tapınak geldi.'],
  [53.86, 55.0, 'Ve tepenin sadece'], [55.0, 56.21, '*küçük* bir kısmı kazıldı.'], [56.57, 57.84, 'Yani asıl hikâye...'], [58.12, 59.54, 'hâlâ *toprağın altında.*'],
];

// ======================================================================
// ortak: T sütun (yandan görünüm; taban merkezi orijin)
function pillarShape(g, sw, sh, cw, ch, off = .18) { // sw: gövde genişliği, sh: toplam yükseklik
  g.beginPath();
  const cx0 = -cw * (.5 - off), cx1 = cw * (.5 + off);
  g.moveTo(-sw / 2, 0); g.lineTo(-sw / 2, -sh + ch); g.lineTo(cx0, -sh + ch); g.lineTo(cx0 + 6, -sh + 8);
  g.quadraticCurveTo(cx0 + 8, -sh, cx0 + 20, -sh); g.lineTo(cx1 - 18, -sh); g.quadraticCurveTo(cx1, -sh, cx1, -sh + 18);
  g.lineTo(cx1 - 4, -sh + ch); g.lineTo(sw / 2, -sh + ch); g.lineTo(sw / 2, 0); g.closePath();
}
function drawPillar(x, y, s, { rot = 0, base = TERRA, dark = '#8a3f1c', light = '#f39a5f', side = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (side > 0) { ctx.fillStyle = dark; ctx.save(); ctx.translate(side, -side * .4); pillarShape(ctx, 120, 600, 300, 110); ctx.fill(); ctx.restore(); }
  const g = ctx.createLinearGradient(-150, 0, 190, 0); g.addColorStop(0, light); g.addColorStop(.45, base); g.addColorStop(1, dark);
  ctx.fillStyle = g; pillarShape(ctx, 120, 600, 300, 110); ctx.fill();
  ctx.restore();
}

// ======================================================================
// SAHNE 1 — Stonehenge + zaman geri sarma
const STONES = [[140, 54, 230], [250, 70, 300], [350, 70, 310], [470, 80, 370], [580, 80, 372], [720, 70, 320], [820, 70, 312], [940, 50, 210]];
const LINTELS = [[235, 185, 190], [455, 125, 205], [705, 185, 200]];
const HILL = x => 1190 + 60 * Math.sin(x * .004 + 1) + 22 * Math.sin(x * .013);
const PARTS = (() => { const R = rng(11), out = []; const G = 1230;
  for (let i = 0; i < 1700; i++) {
    let x, y; if (R() < .82) { const s = STONES[Math.floor(R() * STONES.length)]; x = s[0] - s[1] / 2 + R() * s[1]; y = G - R() * s[2]; }
    else { const l = LINTELS[Math.floor(R() * 3)]; x = l[0] + R() * l[2] - 40; y = G - (l[0] < 400 ? 330 : l[0] < 600 ? 400 : 345) + R() * 30; }
    const tx = R() * W, ty = HILL(tx) + R() * 700;
    out.push({ x, y, tx, ty, s: 2 + R() * 3.5, k: .6 + R() * .8 });
  } return out; })();
const STARS = (() => { const R = rng(3); return Array.from({ length: 90 }, () => [R() * W, R() * 1100, R() * 2 + .5, R()]); })();

function sceneStonehenge(t) {
  const fade = 1 - pr(t, 1.12, 1.45);
  const sky = ctx.createLinearGradient(0, 0, 0, 1250); sky.addColorStop(0, '#0d0c18'); sky.addColorStop(.7, '#262040'); sky.addColorStop(1, '#4a3c5c');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  for (const [x, y, r, k] of STARS) { ctx.fillStyle = `rgba(246,241,231,${.25 + .5 * Math.abs(Math.sin(t * 3 + k * 9))})`; ctx.fillRect(x, y, r, r); }
  glowCircle(730, 560, 260, '#cfd2ff', .18); ctx.fillStyle = '#eeeaf5'; ctx.beginPath(); ctx.arc(730, 560, 64, 0, 7); ctx.fill();
  const z = lerp(1, 1.09, ease.outC(pr(t, 0, 1.2)));
  ctx.save(); ctx.translate(540, 1150); ctx.scale(z, z); ctx.translate(-540, -1150);
  ctx.fillStyle = '#0c0b12'; ctx.fillRect(-200, 1228, W + 400, 900);
  if (fade > 0) {
    ctx.globalAlpha = fade;
    for (const [x, w, h] of STONES) { const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#b9b2c4'); g.addColorStop(1, '#5d5670'); ctx.fillStyle = g; rr(x - w / 2, 1232 - h, w, h, 6); ctx.fill(); }
    ctx.fillStyle = '#9b93a8';
    for (const [x, y, w] of LINTELS) { const yy = x < 400 ? 900 : x < 600 ? 838 : 890; rr(x - 40, yy, w, 38, 5); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  text('STONEHENGE · MÖ 3000', 90, 470, { fam: 'JetBrains Mono', w: 700, size: 30, alpha: .8 * fade * pr(t, .1, .4), ls: 2 });
}
function sceneRewind(t) {
  const p = pr(t, 1.12, 2.95);
  // zaman tüneli halkaları
  if (t < 2.7) for (let i = 0; i < 9; i++) {
    const k = ((t - 1.12) * 1.6 + i / 9) % 1; ctx.strokeStyle = rgba(COL.cream, .12 * (1 - k) * pr(t, 1.12, 1.4) * (1 - pr(t, 2.3, 2.7)));
    ctx.lineWidth = 3; ctx.setLineDash([30, 22]); ctx.lineDashOffset = -t * 300; ctx.beginPath(); ctx.arc(480, 900, 60 + k * 900, 0, 7); ctx.stroke(); ctx.setLineDash([]);
  }
  const zz = lerp(1, 1.09, 1);
  for (const q of PARTS) {
    const pa = ease.inQ(pr(p, 0, .55)), pb = ease.outC(pr(p, .5, 1));
    const bx = (q.x - 540) * zz + 540, by = (q.y - 1150) * zz + 1150;
    const dx = bx - 480, dy = by - 900, r0 = Math.hypot(dx, dy), a0 = Math.atan2(dy, dx);
    const a = a0 - pa * 5 * q.k, r = r0 * lerp(1, .45 + .3 * q.k, pa);
    const sx = 480 + Math.cos(a) * r, sy = 900 + Math.sin(a) * r;
    const x = lerp(sx, q.tx, pb), y = lerp(sy, q.ty, pb);
    ctx.fillStyle = mix('#c4bdd0', TERRA, pr(p, .2, .8)); ctx.globalAlpha = 1 - pr(t, 2.55, 2.95);
    ctx.fillRect(x, y, q.s, q.s);
  }
  ctx.globalAlpha = 1;
  // yıl sayacı
  const ca = pr(t, 1.15, 1.3) * (1 - pr(t, 2.45, 2.75));
  if (ca > 0) {
    const yr = lerp(3000, 9600, ease.io(pr(t, 1.2, 2.3)));
    const k = 1 + .06 * Math.sin(t * 40) * (1 - pr(t, 2.1, 2.3));
    ctx.save(); ctx.translate(SAFE.cx, 900); ctx.scale(k, k);
    text('MÖ ' + fmt(Math.round(yr / 10) * 10), 0, 40, { size: 150, align: 'center', alpha: ca, shadow: 30 });
    ctx.restore();
    text('◂◂  6.000 YIL GERİ', SAFE.cx, 1010, { fam: 'JetBrains Mono', w: 700, size: 34, align: 'center', color: COL.amber, alpha: ca * pr(t, 1.4, 1.6), ls: 3 });
  }
}

// ======================================================================
// SAHNE 2 — Urfa, 10 tonluk taş dikiliyor
function urfaBG(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 1250); sky.addColorStop(0, '#1a0e0b'); sky.addColorStop(.55, '#5a2a15'); sky.addColorStop(1, '#d9773a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  glowCircle(560, 1030, 520, '#f7b35a', .45); ctx.fillStyle = '#f9c46e'; ctx.beginPath(); ctx.arc(560, 1060, 170, 0, 7); ctx.fill();
  ctx.fillStyle = '#7a3a1a'; ctx.beginPath(); ctx.moveTo(0, 1120); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 1110 + 40 * Math.sin(x * .006 + 2)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = '#2a150d'; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, HILL(x)); ctx.lineTo(W, H); ctx.fill();
}
const PULLERS = [150, 225, 300, 372, 440];
function sceneUrfa(t, frozen = false) {
  urfaBG(t);
  const rp = ease.io(pr(t, 3.72, 4.85)); const rot = (Math.PI / 2) * (1 - rp) - .02 * Math.sin(pr(t, 4.85, 5.3) * Math.PI);
  const bx = 740, by = HILL(740) + 8;
  drawPillar(bx, by, 1, { rot });
  // halatlar + çekenler
  const top = [bx + Math.sin(rot) * 560 - Math.cos(rot) * 40, by - Math.cos(rot) * 560 - Math.sin(rot) * 40];
  const walkIn = ease.outC(pr(t, 2.55, 3.5));
  PULLERS.forEach((px, i) => {
    const x = px - (1 - walkIn) * 420, y = HILL(x) + 6, pulling = pr(t, 3.6, 3.8) * (1 - pr(t, 4.8, 5.1));
    const lean = -.28 * pulling + Math.sin(t * 9 + i) * .03 * pulling;
    const hand = person(x, y, 118, { phase: t * 11 + i, walk: walkIn < 1 ? .8 : 0, lean, arm: lerp(-.3, -.15, pulling), color: '#120906', face: 1, hair: i % 2 === 0, tunic: true });
    ctx.strokeStyle = 'rgba(30,15,8,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]);
    ctx.quadraticCurveTo((hand[0] + top[0]) / 2, (hand[1] + top[1]) / 2 + 40 * (1 - pulling), top[0], top[1]); ctx.stroke();
  });
  // toz
  if (t > 4.85) { const R = rng(5), d = t - 4.85; for (let i = 0; i < 70; i++) { const a = -Math.PI * R(), v = 200 + R() * 500; ctx.fillStyle = rgba('#e8b58a', .5 * cl(1 - d / 1.1)); const r = 4 + R() * 14 * (1 + d); ctx.beginPath(); ctx.arc(bx + Math.cos(a) * v * d, by + Math.sin(a) * v * d * .5 + 60 * d * d, r, 0, 7); ctx.fill(); } }
  // konum
  const lp = ease.bounce(pr(t, 2.64, 3.1)), la = pr(t, 2.64, 2.8) * (frozen ? 1 : 1 - pr(t, 5.2, 5.5));
  if (la > 0) {
    ctx.save(); ctx.globalAlpha = la; const py = lerp(300, 450, lp);
    ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.arc(104, py - 20, 17, Math.PI, 0); ctx.lineTo(104, py + 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a0e0b'; ctx.beginPath(); ctx.arc(104, py - 20, 6, 0, 7); ctx.fill(); ctx.restore();
    text('ŞANLIURFA', 136, 462, { fam: 'JetBrains Mono', w: 700, size: 36, alpha: la * pr(t, 2.9, 3.1), ls: 3 });
    text('37.22°K · 38.92°D', 136, 500, { fam: 'JetBrains Mono', w: 500, size: 22, alpha: .6 * la * pr(t, 3.0, 3.2) });
  }
  // 10 TON
  const tp = pr(t, 4.25, 4.5), ta = pr(t, 4.25, 4.33) * (frozen ? 1 : 1 - pr(t, 5.3, 5.55));
  if (ta > 0) {
    const k = lerp(2.6, 1, ease.outC(tp)); ctx.save(); ctx.translate(90, 800); ctx.scale(k, k);
    text('10', 0, 0, { size: 230, alpha: ta, shadow: 40 }); text('TON', 0, 190, { size: 190, color: COL.amber, alpha: ta, shadow: 40 }); ctx.restore();
  }
}
// SAHNE 3 — "Ama bir sorun var": donma, kırmızı kare, zoom
function sceneFreeze(t) {
  const g = pr(t, 5.36, 5.75), z = ease.inC(pr(t, 6.35, 7.2)), fx = PULLERS[4], fy = HILL(fx) - 60;
  ctx.save(); ctx.translate(lerp(0, 480 - fx, z), lerp(0, 1000 - fy, z));
  ctx.translate(fx, fy); ctx.scale(lerp(1, 5.5, z), lerp(1, 5.5, z)); ctx.translate(-fx, -fy);
  sceneUrfa(5.36, true); if (g > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = `rgba(128,128,128,${g})`; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(0,0,0,${.5 * g})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  // odak parantezi
  const bp = ease.back(pr(t, 5.9, 6.25));
  if (t > 5.81) {
    ctx.strokeStyle = COL.red; ctx.lineWidth = 4 / lerp(1, 5.5, z); const w = 55 * bp + 20, h = 85 * bp + 30;
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(fx + sx * w, fy + sy * h - sy * 18); ctx.lineTo(fx + sx * w, fy + sy * h); ctx.lineTo(fx + sx * w - sx * 18, fy + sy * h); ctx.stroke(); }
    const q = ease.back(pr(t, 5.81, 6.0)) * 14; ctx.fillStyle = COL.red; ctx.fillRect(fx - q / 2, fy - 90 - q / 2 - 10, q, q);
  }
  ctx.restore();
}

// ======================================================================
// SAHNE 4 — avcı-toplayıcı; tarla çizgileri kırılır, yabani ot çıkar
const ROWS = (() => { const R = rng(21); return Array.from({ length: 11 }, (_, i) => ({ x: -700 + i * 250, segs: Array.from({ length: 7 }, () => ({ vx: (R() - .5) * 500, vy: -300 - R() * 700, vr: (R() - .5) * 8 })) })); })();
const GRASS = (() => { const R = rng(9); return Array.from({ length: 150 }, () => ({ x: R() * W, y: 1230 + Math.pow(R(), .7) * 690, h: 40 + R() * 110, b: (R() - .5) * .6, d: R() * .5 })); })();
function sceneHunter(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 1240); sky.addColorStop(0, '#1d0f0a'); sky.addColorStop(1, '#b85a2a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  const out = ease.inC(pr(t, 9.15, 9.6));
  glowCircle(520, 860, 700, '#f7b35a', .35); ctx.fillStyle = '#f5b964'; ctx.beginPath(); ctx.arc(520, 880, 330, 0, 7); ctx.fill();
  ctx.fillStyle = '#1a0d08'; ctx.fillRect(0, 1230, W, 700);
  // tarla çizgileri
  const VP = [480, 1180], dp = pr(t, 7.85, 8.35), br = pr(t, 8.55, 9.3);
  ctx.lineCap = 'round';
  ROWS.forEach((r) => {
    for (let j = 0; j < 7; j++) {
      const a0 = j / 7, a1 = (j + 1) / 7; if (a0 > dp) break; const a1c = Math.min(a1, dp);
      const p0 = [lerp(r.x, VP[0], a0 * .82), lerp(H + 40, 1236, a0 * 1.0)], p1 = [lerp(r.x, VP[0], a1c * .82), lerp(H + 40, 1236, a1c)];
      const s = r.segs[j], d = br * 1.1;
      ctx.save(); const mx = (p0[0] + p1[0]) / 2 + s.vx * d, my = (p0[1] + p1[1]) / 2 + s.vy * d + 1400 * d * d;
      ctx.translate(mx, my); ctx.rotate(s.vr * d); ctx.strokeStyle = rgba(COL.cream, .55 * (1 - br)); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(p0[0] - (p0[0] + p1[0]) / 2, p0[1] - (p0[1] + p1[1]) / 2); ctx.lineTo(p1[0] - (p0[0] + p1[0]) / 2, p1[1] - (p0[1] + p1[1]) / 2); ctx.stroke(); ctx.restore();
    }
  });
  // yabani ot
  for (const g of GRASS) { const p = ease.back(pr(t, 8.6 + g.d, 9.05 + g.d)); if (p <= 0) continue; ctx.strokeStyle = '#6b3a1a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.quadraticCurveTo(g.x + g.b * 40, g.y - g.h * p * .6, g.x + g.b * g.h * p, g.y - g.h * p); ctx.stroke(); }
  const k = lerp(1.18, 1, ease.outC(pr(t, 7.05, 8)));
  person(430 - out * 900, 1330, 640 * k, { spear: true, hair: true, tunic: true, color: '#120906', lean: -.04 + .015 * Math.sin(t * 2) });
  // geçiş: ağ gibi beyaz flaş
  ctx.fillStyle = rgba(COL.cream, .9 * (1 - pr(t, 7.1, 7.35))); ctx.fillRect(0, 0, W, H);
}

// ======================================================================
// SAHNE 5 — Ne tarla, ne çömlek, ne metal: nesneler kırılır
const OBJ = {
  wheat: offscreen(560, 560, (g) => { g.translate(280, 300); g.lineCap = 'round';
    for (let k = -2; k <= 2; k++) { g.save(); g.rotate(k * .16); g.strokeStyle = '#d99a3b'; g.lineWidth = 9; g.beginPath(); g.moveTo(0, 230); g.quadraticCurveTo(k * 8, 0, 0, -120); g.stroke();
      for (let i = 0; i < 9; i++) { for (const sd of [-1, 1]) { g.save(); g.translate(0, -120 + i * 22); g.rotate(sd * .5); g.fillStyle = i % 2 ? '#f6b64a' : '#e9a33a'; g.beginPath(); g.ellipse(sd * 12, 0, 9, 20, 0, 0, 7); g.fill(); g.restore(); } }
      g.fillStyle = '#f6b64a'; g.beginPath(); g.ellipse(0, -138, 8, 18, 0, 0, 7); g.fill(); g.restore(); }
    g.fillStyle = '#b4552a'; g.fillRect(-60, 110, 120, 26); }),
  pot: offscreen(560, 560, (g) => { g.translate(280, 280);
    const gr = g.createLinearGradient(-170, 0, 170, 0); gr.addColorStop(0, '#f09a5c'); gr.addColorStop(.5, '#c8612e'); gr.addColorStop(1, '#7b3417'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(-70, -210); g.lineTo(70, -210); g.lineTo(60, -170); g.quadraticCurveTo(200, -110, 180, 40); g.quadraticCurveTo(160, 200, 60, 230); g.lineTo(-60, 230); g.quadraticCurveTo(-160, 200, -180, 40); g.quadraticCurveTo(-200, -110, -60, -170); g.closePath(); g.fill();
    g.fillStyle = '#1a0d08'; g.globalAlpha = .75; g.fillRect(-176, -40, 352, 22); g.fillRect(-172, 20, 344, 8);
    for (let i = -150; i < 150; i += 34) { g.beginPath(); g.moveTo(i, -18); g.lineTo(i + 17, 18); g.lineTo(i + 34, -18); g.lineWidth = 5; g.strokeStyle = '#1a0d08'; g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = '#7b3417'; g.fillRect(-80, -222, 160, 20); }),
  metal: offscreen(560, 560, (g) => { g.translate(280, 280); g.rotate(-.5);
    g.fillStyle = '#6b3a1a'; g.fillRect(-18, -60, 36, 300);
    const gr = g.createLinearGradient(-160, -200, 160, -40); gr.addColorStop(0, '#e9eef2'); gr.addColorStop(.4, '#8e99a3'); gr.addColorStop(.6, '#d2d9df'); gr.addColorStop(1, '#5c6670'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(-40, -90); g.lineTo(-40, -150); g.quadraticCurveTo(-170, -230, -200, -120); g.quadraticCurveTo(-120, -150, -80, -90); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-40, -150); g.lineTo(40, -150); g.lineTo(40, -90); g.lineTo(-40, -90); g.fill(); g.beginPath(); g.moveTo(40, -140); g.lineTo(120, -125); g.lineTo(120, -115); g.lineTo(40, -100); g.fill(); }),
};
const SHARDS = { wheat: makeShards(OBJ.wheat, 6, 2), pot: makeShards(OBJ.pot, 6, 3), metal: makeShards(OBJ.metal, 6, 4) };
const OBJT = [['wheat', 9.47, 10.45, 10.6, 'TARLA'], ['pot', 10.76, 11.6, 11.76, 'ÇÖMLEK'], ['metal', 12.0, 12.76, 12.92, 'METAL']];
function sceneObjects(t) {
  ctx.fillStyle = '#1d0f0a'; ctx.fillRect(0, 0, W, H); glowCircle(SAFE.cx, 880, 700, '#c8612e', .45);
  // arkadaki sayaç çubukları
  OBJT.forEach(([id, a, sl, sh, lab], i) => {
    const x = SAFE.cx + (i - 1) * 120, on = pr(t, a, a + .2), gone = t > sh;
    ctx.fillStyle = gone ? COL.red : rgba(COL.cream, .25 + .5 * on); rr(x - 40, 1180, 80, 12, 6); ctx.fill();
  });
  for (const [id, a, sl, sh, lab] of OBJT) {
    if (t < a) continue;
    const X = SAFE.cx, Y = 820;
    if (t < sh) {
      const p = ease.back(pr(t, a, a + .32)), bob = Math.sin((t - a) * 5) * 8;
      ctx.save(); ctx.translate(X, Y + bob); ctx.rotate(Math.sin((t - a) * 3) * .05); ctx.scale(p * .95, p * .95); ctx.drawImage(OBJ[id], -280, -280); ctx.restore();
      text(lab, X, 1120, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', alpha: pr(t, a + .1, a + .3), ls: 8 });
      const sp = ease.outC(pr(t, sl, sl + .12));
      if (sp > 0) { ctx.strokeStyle = COL.red; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X - 240, Y - 240); ctx.lineTo(X - 240 + 480 * sp, Y - 240 + 480 * sp); ctx.stroke(); }
    } else if (t < sh + 1.3) { drawShards(OBJ[id], SHARDS[id], X, Y, t - sh, .95); }
  }
}

// ======================================================================
// SAHNE 6 — Sadece taş: çakmaktaşı + avcı-toplayıcılar + kıvılcım
const FLINT = (() => { const R = rng(33), n = 11, pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([Math.cos(a) * (130 + R() * 40), Math.sin(a) * (175 + R() * 40)]); } return { pts, ang: pts.map(() => R() * 6.28), inner: [(R() - .5) * 40, (R() - .5) * 60] }; })();
function drawFlint(x, y, s, rot, light) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const P = FLINT.pts, n = P.length, c = FLINT.inner;
  for (let i = 0; i < n; i++) {
    const a = P[i], b = P[(i + 1) % n], v = .5 + .5 * Math.cos(FLINT.ang[i] + light);
    ctx.fillStyle = mix('#2b2a33', '#d8cbb8', v * .9); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,230,200,.25)'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
}
function sceneFlint(t) {
  ctx.fillStyle = '#1d0f0a'; ctx.fillRect(0, 0, W, H); glowCircle(SAFE.cx, 900, 800, '#c8612e', .3 + .25 * pr(t, 15.4, 16.1));
  ctx.fillStyle = '#140a07'; ctx.fillRect(0, 1250, W, 700);
  ctx.strokeStyle = rgba('#f39a5f', .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 1250); ctx.lineTo(W, 1250); ctx.stroke();
  const d = ease.bounce(pr(t, 13.26, 13.9)); const y = lerp(-300, 860, d);
  drawFlint(SAFE.cx, y, 1, Math.sin(t * .8) * .15, t * 1.4);
  // avcılar
  const w = ease.outC(pr(t, 14.54, 15.4));
  [[-1, 170], [-1, 290], [1, 660], [1, 790]].forEach(([side, tx], i) => {
    const x = side < 0 ? lerp(-150 - i * 60, tx, w) : lerp(W + 150 + i * 60, tx, w);
    person(x, 1250, 170, { phase: t * 10 + i, walk: w < 1 ? .9 : 0, face: -side, spear: i % 2 === 0, hair: i % 2 === 1, tunic: true, color: '#0c0605' });
  });
  // kıvılcım
  const sp = pr(t, 15.8, 16.2); if (sp > 0) {
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28 + t; ctx.strokeStyle = rgba(COL.amber, .8 * (1 - sp)); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(SAFE.cx + Math.cos(a) * 60, 690 + Math.sin(a) * 60); ctx.lineTo(SAFE.cx + Math.cos(a) * (80 + sp * 380), 690 + Math.sin(a) * (80 + sp * 380)); ctx.stroke(); }
    sparkle(SAFE.cx, 690, ease.back(sp) * 150, { glow: 60, rot: sp * 1.5 });
  }
  const fl = pr(t, 16.0, 16.2) * (1 - pr(t, 16.2, 16.55)); if (fl > 0) { ctx.fillStyle = rgba('#fff4dd', fl); ctx.fillRect(0, 0, W, H); }
}

// ======================================================================
// SAHNE 7 — Kuşbakışı Göbeklitepe + 11.000+
const CONT = (() => { const R = rng(44); return Array.from({ length: 16 }, (_, i) => ({ r: 90 + i * 75, ph: [R() * 6, R() * 6, R() * 6] })); })();
const ENC = [[390, 850, 120, 10], [575, 790, 140, 12], [520, 1040, 165, 12], [335, 1070, 105, 9]];
const GHOST = (() => { const R = rng(55), o = []; while (o.length < 15) { const a = R() * 6.28, d = 350 + R() * 850, x = 475 + Math.cos(a) * d, y = 950 + Math.sin(a) * d * .9, r = 70 + R() * 90; if (o.every(q => Math.hypot(q[0] - x, q[1] - y) > q[2] + r + 30)) o.push([x, y, r, 8 + Math.floor(R() * 4)]); } return o; })();
function drawEnclosure(x, y, r, n, { col = '#f3cfa8', wall = '#3a1a0c', alpha = 1, dashed = false } = {}) {
  ctx.save(); ctx.globalAlpha *= alpha;
  if (dashed) { ctx.setLineDash([14, 12]); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
  else { ctx.strokeStyle = wall; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.strokeStyle = '#a45a2d'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, r - 12, 0, 7); ctx.stroke(); }
  for (let i = 0; i < n; i++) { const a = i / n * 6.28 + x; ctx.save(); ctx.translate(x + Math.cos(a) * (r - 22), y + Math.sin(a) * (r - 22)); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = col; ctx.fillRect(-20, -7, 40, 14); ctx.restore(); }
  ctx.fillStyle = col; for (const s of [-1, 1]) { ctx.save(); ctx.translate(x + s * r * .18, y); ctx.rotate(.3); ctx.fillRect(-30, -10, 60, 20); ctx.restore(); }
  ctx.restore();
}
function aerial(t, { lit = 0, ghosts = 0, scan = -1 } = {}) {
  ctx.fillStyle = '#5d2b14'; ctx.fillRect(-2000, -2000, 5000, 6000);
  const g = ctx.createRadialGradient(475, 950, 50, 475, 950, 1300); g.addColorStop(0, '#9a4c24'); g.addColorStop(1, '#4a220f'); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 5000, 6000);
  for (const c of CONT) { ctx.strokeStyle = 'rgba(243,190,140,.22)'; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * 6.283; const rr_ = c.r * (1 + .07 * Math.sin(a * 3 + c.ph[0]) + .04 * Math.sin(a * 5 + c.ph[1]) + .03 * Math.sin(a * 7 + c.ph[2])); const x = 475 + Math.cos(a) * rr_, y = 950 + Math.sin(a) * rr_ * .9; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  if (ghosts > 0) for (const [x, y, r, n] of GHOST) { const vis = scan < 0 ? 1 : pr(scan, y - r, y); if (vis > 0) drawEnclosure(x, y, r, n, { col: COL.cream, alpha: .45 * ghosts * vis, dashed: true }); }
  if (lit > 0) glowCircle(455, 940, 420, COL.amber, .35 * lit);
  for (const [x, y, r, n] of ENC) drawEnclosure(x, y, r, n);
}
function sceneAerial(t) {
  const z = ease.outX(pr(t, 16.18, 17.5)), s = lerp(3.4, 1, z) * lerp(1, 1.06, pr(t, 17.5, 19.3)), rot = lerp(.5, 0, z);
  ctx.save(); ctx.translate(SAFE.cx, 950); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-475, -950); aerial(t); ctx.restore();
  // başlık
  const title = 'GÖBEKLİTEPE'; font(900, 132); ctx.letterSpacing = '0px'; const tw = ctx.measureText(title).width; const fs = Math.min(132, 132 * 800 / tw);
  font(900, fs); let x = SAFE.cx - ctx.measureText(title).width / 2; const up = ease.io(pr(t, 17.6, 18.0));
  const ty = lerp(560, 430, up), ts = lerp(1, .72, up);
  ctx.save(); ctx.translate(SAFE.cx, ty); ctx.scale(ts, ts); ctx.translate(-SAFE.cx, -ty);
  for (let i = 0; i < title.length; i++) { const ch = title[i], p = ease.back(pr(t, 16.3 + i * .045, 16.6 + i * .045)); font(900, fs); const cw = ctx.measureText(ch).width;
    if (p > 0) text(ch, x, ty - (1 - p) * 90, { size: fs, alpha: cl(p * 2), shadow: 30 }); x += cw; }
  ctx.restore();
  text('37.22°K · 38.92°D · ŞANLIURFA', SAFE.cx, lerp(625, 470, up), { fam: 'JetBrains Mono', w: 500, size: 26, align: 'center', alpha: .8 * pr(t, 16.9, 17.2) * (1 - up), ls: 2 });
  // 11.000+ YIL
  const dim = pr(t, 17.6, 17.9); if (dim > 0) { ctx.fillStyle = `rgba(20,17,18,${.5 * dim})`; ctx.fillRect(0, 0, W, H); }
  const cp = ease.outC(pr(t, 17.77, 18.7));
  if (t > 17.7) {
    const v = fmt(Math.round(11000 * cp / 10) * 10); const plus = ease.back(pr(t, 18.65, 18.85));
    ctx.save(); font(900, 200); const vw = ctx.measureText(v).width; const X = SAFE.cx - (vw + 80 * plus) / 2;
    text(v, X, 1060, { size: 200, alpha: pr(t, 17.7, 17.85), shadow: 30 });
    if (plus > 0) { ctx.save(); ctx.translate(X + vw + 45, 1000); ctx.scale(plus, plus); text('+', 0, 60, { size: 170, color: COL.amber, align: 'center' }); ctx.restore(); }
    ctx.restore();
    text('YIL', SAFE.cx, 1140, { fam: 'JetBrains Mono', w: 700, size: 52, align: 'center', color: COL.amber, alpha: pr(t, 18.0, 18.3), ls: 12 });
    if (plus > 0) sparkle(SAFE.cx + 330, 850, 30 * plus * (1 + .4 * Math.sin(t * 8)), { glow: 30 });
  }
}

// ======================================================================
// SAHNE 8 — Dikey zaman şeridi
const YA = { gt: 11626, yazi: 5226, pir: 4586 }; const PX = .52; const wy = ya => -ya * PX;
function sceneTimeline(t) {
  ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, W, H);
  // kamera
  let camY, s;
  const c0 = wy(YA.gt) + 380, c1 = wy(YA.pir) - 60, c2 = -2100;
  const m1 = ease.io(pr(t, 19.5, 20.3)), m2 = ease.io(pr(t, 21.3, 22.25)), m3 = ease.inC(pr(t, 22.45, 23.05));
  s = 1 / lerp(1, 1 / .15, m2);
  if (m2 <= 0) camY = lerp(c0, c1, m1);
  else { const g0 = (wy(YA.gt) - c1) + 900, gT = (wy(YA.gt) - c2) * .15 + 900; const gy = lerp(g0, gT, ease.outC(m2)); camY = wy(YA.gt) - (gy - 900) / s; }
  const sy = y => (y - camY) * s + 900;
  const gtS = sy(wy(YA.gt));
  ctx.save();
  if (m3 > 0) { const zk = lerp(1, 14, m3); ctx.translate(300, gtS); ctx.scale(zk, zk); ctx.translate(-300, -gtS); }
  // çizgi
  const RX = 300; ctx.strokeStyle = rgba(COL.cream, .45); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(RX, sy(wy(YA.gt + 400))); ctx.lineTo(RX, sy(200)); ctx.stroke();
  const blur = Math.abs(lerp(c0, c1, ease.io(pr(t + 1 / 30, 19.5, 20.3))) - lerp(c0, c1, m1)) * s;
  for (let ya = 0; ya <= 12000; ya += 250) {
    const y = sy(wy(ya)); if (y < -200 || y > H + 200) continue; const major = ya % 1000 === 0;
    ctx.strokeStyle = rgba(COL.cream, major ? .6 : .3); ctx.lineWidth = major ? 4 : 2; ctx.beginPath(); ctx.moveTo(RX - (major ? 26 : 14), y); ctx.lineTo(RX - (major ? 26 : 14), y + Math.min(blur * .8, 120) + 1); ctx.lineTo(RX, y); ctx.stroke();
    if (major && s > .5 && ya > 0) { const yr = ya - 2026; text(yr > 0 ? 'MÖ ' + fmt(Math.round(yr / 100) * 100) : 'MS', RX - 44, y + 8, { fam: 'JetBrains Mono', w: 500, size: 22, align: 'right', alpha: .5 }); }
  }
  ctx.restore();
  const ms = m3 > 0 ? lerp(1, 14, m3) : 1, mt = y => (y - gtS) * ms + gtS, mx = x => (x - 300) * ms + 300;
  // işaretler
  const mark = (ya, label, sub, icon, appear, col = COL.cream, ldy = 0) => {
    const y = mt(sy(wy(ya))), p = ease.back(pr(t, appear, appear + .35)); if (p <= 0 || y < -300 || y > H + 300) return;
    const big = lerp(1, .55, m2);
    ctx.save(); ctx.translate(mx(RX), y); ctx.scale(p * ms, p * ms); icon(big); ctx.restore();
    if (m3 < .3) { text(label, mx(RX) + 70 * big + 30, y + 4 + ldy * m2, { size: 44 * big + 6, alpha: pr(t, appear + .1, appear + .3) * (1 - m3 * 3), color: col }); text(sub, mx(RX) + 70 * big + 30, y + 38 * big + 10 + ldy * m2, { fam: 'JetBrains Mono', w: 500, size: 22, alpha: .7 * pr(t, appear + .15, appear + .35) * (1 - m3 * 3) }); }
  };
  mark(YA.gt, 'GÖBEKLİTEPE', 'MÖ 9.600', (k) => { ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.arc(0, 0, 44 * k, 0, 7); ctx.fill(); ctx.fillStyle = '#5a2a15'; ctx.fillRect(-7 * k, -12 * k, 14 * k, 34 * k); ctx.fillRect(-20 * k, -24 * k, 40 * k, 13 * k); }, 19.2, COL.amber);
  mark(YA.pir, 'PİRAMİTLER', 'MÖ 2.560', (k) => { ctx.fillStyle = '#e8c07a'; ctx.beginPath(); ctx.moveTo(0, -60 * k); ctx.lineTo(62 * k, 40 * k); ctx.lineTo(-62 * k, 40 * k); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#b8894a'; ctx.beginPath(); ctx.moveTo(0, -60 * k); ctx.lineTo(62 * k, 40 * k); ctx.lineTo(8 * k, 40 * k); ctx.closePath(); ctx.fill(); }, 19.95, COL.cream, 26);
  mark(YA.yazi, 'YAZI', 'MÖ 3.200 · Sümer', (k) => { ctx.fillStyle = '#c9a57a'; ctx.beginPath(); ctx.roundRect(-40 * k, -52 * k, 80 * k, 104 * k, 12 * k); ctx.fill(); ctx.fillStyle = '#6d4f2e'; for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.moveTo((-24 + j * 20) * k, (-36 + i * 17) * k); ctx.lineTo((-14 + j * 20) * k, (-32 + i * 17) * k); ctx.lineTo((-24 + j * 20) * k, (-28 + i * 17) * k); ctx.fill(); } }, 20.7);
  mark(0, 'BUGÜN', '2026', (k) => { ctx.fillStyle = COL.cream; ctx.beginPath(); ctx.arc(0, 0, 22 * k, 0, 7); ctx.fill(); }, 21.5);
  // aralık parantezi
  const bp = ease.outC(pr(t, 21.85, 22.3)) * (1 - m3 * 4);
  if (bp > 0) { const y0 = sy(wy(YA.gt)), y1 = sy(wy(YA.yazi)), X = 720; ctx.strokeStyle = COL.amber; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(X - 20, y0); ctx.lineTo(X, y0); ctx.lineTo(X, lerp(y0, y1, bp)); if (bp > .98) ctx.lineTo(X - 20, y1); ctx.stroke();
    ctx.save(); ctx.translate(X + 40, (y0 + y1) / 2); ctx.rotate(Math.PI / 2); text('6.400 YIL', 0, 0, { size: 58, align: 'center', color: COL.amber, alpha: bp }); ctx.restore(); }
  // kuşbakışının daire olarak küçülüp işarete dönmesi
  const ci = pr(t, 19.0, 19.45); if (ci < 1) {
    const r = lerp(1300, 44, ease.io(ci)); ctx.save(); ctx.beginPath(); ctx.arc(300, sy(wy(YA.gt)), r, 0, 7); ctx.clip();
    ctx.translate(300, sy(wy(YA.gt))); const k = r / 700; ctx.scale(k, k); ctx.translate(-475, -950); aerial(t); ctx.restore();
    ctx.strokeStyle = COL.amber; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(300, sy(wy(YA.gt)), r, 0, 7); ctx.stroke();
  }
}

// ======================================================================
// SAHNE 9-11 — Dev sütun: insan, kabartmalar, hayvanlar
const PIL = { x: SAFE.cx, y: 1500, sw: 280, cw: 600, ch: 200, h: 1080 };
const PILLAR_IMG = offscreen(700, 1150, (g) => {
  g.translate(350, 1120);
  const gr = g.createLinearGradient(-300, 0, 300, 0); gr.addColorStop(0, '#f2a468'); gr.addColorStop(.5, '#d9763f'); gr.addColorStop(1, '#8e4520');
  g.fillStyle = gr; pillarShape(g, PIL.sw, PIL.h, PIL.cw, PIL.ch, .02); g.fill(); g.save(); g.clip();
  const R = rng(77); for (let i = 0; i < 2600; i++) { g.fillStyle = R() < .5 ? 'rgba(255,220,180,.10)' : 'rgba(60,20,5,.12)'; const r = R() * 5 + 1; g.beginPath(); g.arc(-300 + R() * 600, -1100 + R() * 1100, r, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(60,20,5,.25)'; g.lineWidth = 3; for (let i = 0; i < 14; i++) { g.beginPath(); let x = -300 + R() * 600, y = -1100 + R() * 1100; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (R() - .5) * 60; y += R() * 50; g.lineTo(x, y); } g.stroke(); }
  g.restore();
});
// hayvanlar (sağa bakar, birim ~200px)
function foxPath(ph = 0) {
  ctx.beginPath(); ctx.ellipse(0, 0, 70, 26, 0, 0, 7);
  ctx.moveTo(50, -20); ctx.lineTo(112, -4); ctx.lineTo(56, 16); ctx.closePath();
  ctx.moveTo(60, -18); ctx.lineTo(70, -52); ctx.lineTo(82, -16); ctx.closePath(); ctx.moveTo(76, -16); ctx.lineTo(90, -46); ctx.lineTo(96, -12); ctx.closePath();
  ctx.moveTo(-58, -8); ctx.quadraticCurveTo(-130, -60, -168, -14); ctx.quadraticCurveTo(-120, 16, -58, 14); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 11; ctx.lineCap = 'round'; for (const [lx, o] of [[-42, 0], [-30, Math.PI], [36, Math.PI], [48, 0]]) { const s = Math.sin(ph + o) * 22; ctx.beginPath(); ctx.moveTo(lx, 14); ctx.lineTo(lx + s, 62); ctx.stroke(); }
}
function boarPath(ph = 0) {
  ctx.beginPath(); ctx.ellipse(0, 0, 88, 50, 0, 0, 7);
  ctx.moveTo(55, -34); ctx.lineTo(128, -2); ctx.lineTo(126, 20); ctx.lineTo(55, 38); ctx.closePath();
  ctx.moveTo(66, -30); ctx.lineTo(76, -58); ctx.lineTo(90, -26); ctx.closePath();
  ctx.moveTo(-80, -30); for (let i = 0; i < 12; i++) ctx.lineTo(-80 + i * 12 + 6, i % 2 ? -52 : -66); ctx.lineTo(60, -34); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 15; ctx.lineCap = 'round'; for (const [lx, o] of [[-50, 0], [-36, Math.PI], [40, Math.PI], [54, 0]]) { const s = Math.sin(ph + o) * 16; ctx.beginPath(); ctx.moveTo(lx, 30); ctx.lineTo(lx + s, 76); ctx.stroke(); }
}
function vulturePath(flap = 0) {
  ctx.beginPath();
  for (const s of [-1, 1]) { ctx.moveTo(0, -10); ctx.lineTo(s * 80, -40 - 60 * flap); ctx.lineTo(s * 190, -30 - 110 * flap);
    for (let i = 0; i < 5; i++) { ctx.lineTo(s * (190 - i * 26), 10 - 90 * flap + (i % 2 ? 0 : 24) + i * 6); } ctx.lineTo(s * 30, 30); ctx.closePath(); }
  ctx.moveTo(26, 10); ctx.ellipse(0, 10, 32, 62, 0, 0, 7);
  ctx.moveTo(14, -58); ctx.arc(0, -58, 16, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, -62); ctx.quadraticCurveTo(34, -60, 26, -44); ctx.lineTo(12, -50); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-18, 66); ctx.lineTo(0, 110); ctx.lineTo(18, 66); ctx.closePath(); ctx.fill();
}
function relief(pathFn, x, y, s, p, arg = 0) {
  if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * lerp(.7, 1, ease.back(p)), s * lerp(.7, 1, ease.back(p))); ctx.globalAlpha *= cl(p * 2);
  ctx.save(); ctx.translate(-4, -4); ctx.fillStyle = 'rgba(255,200,150,.55)'; ctx.strokeStyle = ctx.fillStyle; pathFn(arg); ctx.restore();
  ctx.fillStyle = '#7c3a1a'; ctx.strokeStyle = '#7c3a1a'; pathFn(arg); ctx.restore();
}
const ARM_L = bez([PIL.x - 118, 690], [PIL.x - 150, 900], [PIL.x - 140, 1080], [PIL.x - 30, 1098]);
const ARM_R = bez([PIL.x + 118, 690], [PIL.x + 150, 900], [PIL.x + 140, 1080], [PIL.x + 30, 1098]);
function scenePillar(t) {
  ctx.fillStyle = '#1a0d08'; ctx.fillRect(0, 0, W, H); glowCircle(SAFE.cx, 800, 900, '#b85a2a', .5);
  // arka plan: gece gökyüzü ve tepe siluetleri
  ctx.fillStyle = '#120906'; ctx.fillRect(0, 1480, W, 500);
  const inP = ease.outC(pr(t, 22.85, 23.45)), turn = ease.io(pr(t, 22.95, 23.9));
  const s = lerp(.15, 1, inP);
  // kamera: hayvan bölümünde biraz yaklaş
  const cz = ease.io(pr(t, 28.6, 29.2)) * (1 - ease.io(pr(t, 32.9, 33.3)) * 0);
  ctx.save(); ctx.translate(PIL.x, 1000); ctx.scale(lerp(1, 1.08, cz), lerp(1, 1.08, cz)); ctx.translate(-PIL.x, -1000);
  // gövde
  ctx.save(); ctx.translate(PIL.x, PIL.y); ctx.scale(s * lerp(.25, 1, turn), s); ctx.translate(-PIL.x, -PIL.y);
  const light = pr(t, 25.2, 25.6) * (1 - pr(t, 25.6, 26.3));
  ctx.drawImage(PILLAR_IMG, PIL.x - 350, PIL.y - 1120);
  if (light > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .3 * light; ctx.drawImage(PILLAR_IMG, PIL.x - 350, PIL.y - 1120); ctx.restore(); }
  if (turn < 1) { ctx.fillStyle = `rgba(60,20,5,${.6 * (1 - turn)})`; ctx.fillRect(PIL.x - 350, PIL.y - 1120, 700, 1150); }
  ctx.restore();
  // hayalet insan
  const gp = pr(t, 24.27, 25.0), ga = pr(t, 24.27, 24.4) * (1 - pr(t, 25.3, 25.9));
  if (ga > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, lerp(380, 1540, ease.io(gp))); ctx.clip();
    ctx.globalAlpha = ga; ctx.strokeStyle = COL.cream; ctx.lineWidth = 7; ctx.shadowColor = COL.amber; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.ellipse(PIL.x + 10, 500, 120, 125, 0, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PIL.x - 50, 622); ctx.lineTo(PIL.x - 170, 690); ctx.lineTo(PIL.x - 190, 1100); ctx.moveTo(PIL.x + 50, 622); ctx.lineTo(PIL.x + 170, 690); ctx.lineTo(PIL.x + 190, 1100);
    ctx.moveTo(PIL.x - 130, 700); ctx.lineTo(PIL.x - 120, 1480); ctx.moveTo(PIL.x + 130, 700); ctx.lineTo(PIL.x + 120, 1480); ctx.stroke();
    ctx.restore();
    // tarama çizgisi
    if (gp < 1) { const y = lerp(380, 1540, ease.io(gp)); ctx.fillStyle = rgba(COL.amber, .8 * ga); ctx.fillRect(60, y - 2, W - 120, 4); glowCircle(PIL.x, y, 300, COL.amber, .25 * ga); }
  }
  // kabartmalar: kol, el, kemer
  const glowLine = (fn) => { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#6a2e12'; ctx.lineWidth = 16; fn(); ctx.shadowColor = COL.amber; ctx.shadowBlur = 25; ctx.strokeStyle = COL.amber; ctx.lineWidth = 7; ctx.translate(-3, -3); fn(); ctx.restore(); };
  const armP = ease.io(pr(t, 25.92, 26.5)), handP = ease.io(pr(t, 26.67, 27.1)), beltP = ease.io(pr(t, 27.29, 28.1));
  if (armP > 0) glowLine(() => { strokeProgress(ARM_L, armP); strokeProgress(ARM_R, armP); });
  if (handP > 0) glowLine(() => { for (let i = 0; i < 5; i++) { const y = 1068 + i * 12; strokeProgress([[PIL.x - 60, y], [PIL.x - 12, y]], handP); strokeProgress([[PIL.x + 60, y], [PIL.x + 12, y]], handP); } });
  if (beltP > 0) glowLine(() => { strokeProgress([[PIL.x - 138, 1150], [PIL.x + 138, 1150]], beltP); strokeProgress([[PIL.x - 138, 1188], [PIL.x + 138, 1188]], beltP); if (beltP > .6) { ctx.beginPath(); ctx.arc(PIL.x, 1169, 16 * pr(beltP, .6, 1), 0, 7); ctx.stroke(); }
    strokeProgress([[PIL.x - 40, 1190], [PIL.x - 30, 1300], [PIL.x, 1330], [PIL.x + 30, 1300], [PIL.x + 40, 1190]], pr(beltP, .5, 1)); });
  const lab = (s_, x, y, lx, ly, p) => { if (p <= 0) return; const a = p * (1 - pr(t, 28.6, 28.95)); ctx.strokeStyle = rgba(COL.cream, .7 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, lx, ease.outC(p)), lerp(y, ly, ease.outC(p))); ctx.stroke(); ctx.fillStyle = rgba(COL.cream, a); ctx.beginPath(); ctx.arc(lx, ly, 5, 0, 7); ctx.fill(); text(s_, x + (x < PIL.x ? -8 : 8), y + 10, { fam: 'JetBrains Mono', w: 700, size: 30, align: x < PIL.x ? 'right' : 'left', alpha: a, ls: 3 }); };
  lab('KOL', 200, 880, PIL.x - 146, 900, pr(t, 26.1, 26.4)); lab('EL', 760, 1030, PIL.x + 40, 1080, pr(t, 26.8, 27.1)); lab('KEMER', 180, 1170, PIL.x - 120, 1168, pr(t, 27.5, 27.8));
  // hayvanlar: önce kabartma, sonra canlanır
  const A = [[foxPath, PIL.x, 800, .75, 28.98, 29.9, 'fox'], [boarPath, PIL.x, 960, .7, 30.52, 31.1, 'boar'], [vulturePath, PIL.x + 20, 500, .55, 31.6, 32.15, 'vul']];
  for (const [fn, x, y, sc, ta, tl, id] of A) {
    const rp = pr(t, ta, ta + .3);
    if (rp > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = 'rgba(70,25,8,.55)'; ctx.strokeStyle = ctx.fillStyle; fn(id === 'vul' ? .3 : 0); ctx.restore(); } // oyuk (boşluk)
    if (t < tl) { relief(fn, x, y, sc, rp, id === 'vul' ? .3 : 0); continue; }
    const d = t - tl; ctx.save();
    if (id === 'fox') { const p = d; ctx.translate(x + 40 + p * 900, y - Math.sin(Math.min(p * 4, Math.PI)) * 160 + p * 380); ctx.scale(sc * 1.1, sc * 1.1); ctx.fillStyle = '#f7b27a'; ctx.strokeStyle = '#f7b27a'; ctx.shadowColor = COL.amber; ctx.shadowBlur = 30; fn(t * 22); }
    else if (id === 'boar') { const p = d; ctx.translate(x - 60 - p * 950, y + 30 + p * 340); ctx.scale(-sc * 1.15, sc * 1.15); ctx.fillStyle = '#f7b27a'; ctx.strokeStyle = '#f7b27a'; ctx.shadowColor = COL.amber; ctx.shadowBlur = 30; fn(t * 26); }
    else { const p = ease.inC(pr(t, tl, 33.3)); const k = lerp(sc, 11, p); ctx.translate(lerp(x, SAFE.cx, p), lerp(y, 1150, p)); ctx.scale(k, k); ctx.fillStyle = mix('#f7b27a', '#0c0605', pr(p, .2, .6)); ctx.shadowColor = COL.amber; ctx.shadowBlur = 30 * (1 - p); fn(Math.sin(t * 16)); }
    ctx.restore();
  }
  ctx.restore();
}

// ======================================================================
// SAHNE 12-13 — 1963 fotoğrafı -> 1995 renk -> kazma -> çatlak
const SEP = { sky0: '#e8d4ad', sky1: '#bda27a', hill: '#8a6d47', hill2: '#6e5537', stone: '#5d4630', fig: '#2e2317' };
const REAL = { sky0: '#2a1510', sky1: '#d27a3e', hill: '#9a4c24', hill2: '#5d2b14', stone: '#f0b27a', fig: '#120906' };
const STONE_TOPS = [[240, 402], [290, 392], [345, 388], [400, 391], [452, 397], [505, 406]];
function digScene(t, cm) { // yerel 740x800 koordinat; cm: 0 sepya -> 1 gerçek renk
  const C = k => mix(SEP[k], REAL[k], cm);
  const sky = ctx.createLinearGradient(0, 0, 0, 470); sky.addColorStop(0, C('sky0')); sky.addColorStop(1, C('sky1')); ctx.fillStyle = sky; ctx.fillRect(-400, -400, 1600, 900);
  if (cm > 0) { glowCircle(560, 380, 300, '#f7b35a', .4 * cm); }
  ctx.fillStyle = C('hill'); ctx.beginPath(); ctx.moveTo(-400, 520); ctx.quadraticCurveTo(100, 470, 150, 440); ctx.quadraticCurveTo(370, 360, 600, 440); ctx.quadraticCurveTo(700, 470, 1200, 520); ctx.lineTo(1200, 1400); ctx.lineTo(-400, 1400); ctx.fill();
  ctx.fillStyle = C('hill2'); ctx.fillRect(-400, 610, 1600, 900);
  // taş uçları (mezar taşı gibi)
  for (const [x, y] of STONE_TOPS) { ctx.fillStyle = C('stone'); rr(x - 13, y - 26, 26, 36, [12, 12, 2, 2]); ctx.fill(); }
}
function sceneDig(t) {
  ctx.fillStyle = '#0c0605'; ctx.fillRect(0, 0, W, H);
  const enter = ease.outC(pr(t, 33.05, 33.6)), expand = ease.io(pr(t, 39.9, 40.8)), cm = pr(t, 39.95, 40.7);
  const fk = lerp(1, 3.1, expand), rot = lerp(lerp(-.14, -.035, enter), 0, expand);
  // polaroid çerçeve
  ctx.save(); ctx.translate(SAFE.cx, lerp(800, 860, expand)); ctx.rotate(rot); ctx.scale(lerp(1.5, 1, enter) * fk, lerp(1.5, 1, enter) * fk); ctx.globalAlpha = pr(t, 33.05, 33.25);
  ctx.fillStyle = '#efe6d4'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.fillRect(-400, -470, 800, 980); ctx.shadowBlur = 0;
  text('Göbeklitepe yüzey araştırması', 0, 450, { fam: 'JetBrains Mono', w: 500, size: 24, align: 'center', color: '#5a4a38', alpha: 1 - expand });
  ctx.save(); ctx.beginPath(); ctx.rect(-370, -440, 740, 800); ctx.clip(); ctx.translate(-370, -440);
  digScene(t, cm);
  // araştırmacılar
  const walkIn = ease.outC(pr(t, 33.2, 35.7)), leave = ease.inQ(pr(t, 38.1, 39.0));
  [0, 1, 2].forEach(i => {
    const x = lerp(-120 - i * 70, 250 + i * 70, walkIn) + leave * 900, stop = t > 35.7 && t < 38.1;
    person(x, 640, 110, { phase: (t * (t > 38.1 ? 26 : 9)) + i, walk: stop ? 0 : .9, hat: true, clip: i === 1, face: 1, color: mix(SEP.fig, REAL.fig, cm), look: stop ? -2 : 0 });
  });
  // "mezarlık?" vurgusu
  const mp = ease.outC(pr(t, 36.1, 36.7)), ma = 1 - pr(t, 38.1, 38.4);
  if (mp > 0 && ma > 0) { ctx.save(); ctx.globalAlpha = ma; ctx.strokeStyle = '#8b1e1b'; ctx.lineWidth = 5; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.ellipse(372, 392, 170, 60, 0, -Math.PI / 2, -Math.PI / 2 + mp * 6.283); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#8b1e1b'; ctx.save(); ctx.translate(560, 280); ctx.rotate(-.08); font(700, 36, 'JetBrains Mono'); ctx.globalAlpha = ma * pr(t, 36.5, 36.8); ctx.fillText('MEZARLIK?', -60, 0); ctx.restore(); ctx.restore(); }
  // Schmidt
  if (t > 40.0) {
    const w = ease.outC(pr(t, 40.03, 41.1)), x = lerp(760, 380, w);
    const raise = ease.io(pr(t, 41.5, 42.4)), strike = ease.inC(pr(t, 42.45, 42.7));
    const ang = lerp(lerp(.9, -2.3, raise), .8, strike);
    person(x, 432, 70, { phase: t * 10, walk: w < 1 ? .9 : 0, hat: true, face: -1, pick: w < 1 ? null : ang, color: REAL.fig });
  }
  ctx.restore();
  // film efektleri (sepya boyunca)
  const film = 1 - cm; if (film > 0) { const R = rng(Math.floor(t * FPS)); ctx.fillStyle = `rgba(40,25,10,${.08 * R() * film})`; ctx.fillRect(-370, -440, 740, 800); ctx.strokeStyle = `rgba(255,245,220,${.35 * film})`; ctx.lineWidth = 1.5; for (let i = 0; i < 2; i++) { const x = -370 + R() * 740; ctx.beginPath(); ctx.moveTo(x, -440); ctx.lineTo(x + (R() - .5) * 10, 360); ctx.stroke(); } }
  // tarih damgası
  const roll = ease.io(pr(t, 39.37, 39.95));
  ctx.save(); ctx.translate(250, 330); font(700, 44, 'JetBrains Mono'); ctx.fillStyle = '#ff8a3d'; ctx.shadowColor = '#ff6a1d'; ctx.shadowBlur = 12; ctx.globalAlpha = 1 - expand;
  ctx.fillText('19', -60, 0); ctx.save(); ctx.beginPath(); ctx.rect(-8, -44, 70, 56); ctx.clip(); ctx.fillText('63', -6, -roll * 56); ctx.fillText('95', -6, 56 - roll * 56); ctx.restore(); ctx.restore();
  ctx.restore();
  // büyük yıl (ekranda)
  const yp = pr(t, 39.37, 39.5) * (1 - pr(t, 40.9, 41.3));
  if (yp > 0) { const ry = ease.io(pr(t, 39.4, 39.95)); ctx.save(); ctx.beginPath(); ctx.rect(0, 380, W, 220); ctx.clip(); text('1963', SAFE.cx, 560 - ry * 220, { size: 190, align: 'center', alpha: yp, shadow: 30 }); text('1995', SAFE.cx, 780 - ry * 220, { size: 190, align: 'center', color: COL.amber, alpha: yp, shadow: 30 }); ctx.restore(); }
  text('KLAUS SCHMIDT · ARKEOLOG', SAFE.cx, 480, { fam: 'JetBrains Mono', w: 700, size: 30, align: 'center', alpha: pr(t, 41.25, 41.5) * (1 - pr(t, 42.6, 42.9)), ls: 3 });
  // çatlak + ışık
  if (t > 42.72) {
    const cp = ease.outC(pr(t, 42.72, 43.6)); const sx = SAFE.cx + (345 - 370) * 3.1, sy_ = 860 + (436 - 440) * 3.1;
    const R = rng(8); ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = COL.amber; ctx.shadowColor = COL.amber; ctx.shadowBlur = 30;
    for (let b = 0; b < 6; b++) { let x = sx, y = sy_; const pts = [[x, y]]; const dir = -1.2 + b * .48; for (let k = 0; k < 9; k++) { x += Math.sin(dir + (R() - .5) * 1.2) * 90; y += Math.cos(dir * .3) * 70 + R() * 50; pts.push([x, y]); } ctx.lineWidth = 9 - b * .6; strokeProgress(pts, cp); }
    ctx.restore();
    const rays = pr(t, 43.1, 43.85); if (rays > 0) { glowCircle(sx, sy_ + 200, 900 * rays, COL.amber, .6 * rays); }
    const fl = pr(t, 43.6, 43.9); if (fl > 0) { ctx.fillStyle = rgba('#fff4dd', fl); ctx.fillRect(0, 0, W, H); }
  }
}

// ======================================================================
// SAHNE 14-16 — Ders kitabı; sıra ters döner
const PAGE = { x: 125, y: 400, w: 700, h: 950 };
const SLOT = [700, 1040];
function wheatIcon(x, y, k) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.strokeStyle = '#b4552a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(0, -40); ctx.stroke(); ctx.fillStyle = '#d99a3b'; for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { ctx.save(); ctx.translate(0, -30 + i * 14); ctx.rotate(s * .5); ctx.beginPath(); ctx.ellipse(s * 8, 0, 6, 12, 0, 0, 7); ctx.fill(); ctx.restore(); } ctx.restore(); }
function templeIcon(x, y, k) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#b4552a'; ctx.fillRect(-12, -18, 24, 58); ctx.fillRect(-34, -40, 68, 22); ctx.fillStyle = COL.amber; ctx.beginPath(); sparklePath(30, -54, 12, -Math.PI / 2); ctx.fill(); ctx.restore(); }
function card(word, icon, y, lift, hl, x = 0) {
  ctx.save(); ctx.translate(x, 0); const cx = PAGE.x + 60, w = PAGE.w - 120, h = 200;
  ctx.shadowColor = 'rgba(60,30,10,.35)'; ctx.shadowBlur = 10 + 30 * lift; ctx.shadowOffsetY = 6 + 14 * lift;
  ctx.fillStyle = '#fbf6ec'; rr(cx + 90, y - lift * 16, w - 90, h, 18); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if (hl > 0) { ctx.fillStyle = rgba(COL.amber, .55); rr(cx + 225, y + 62 - lift * 16, (w - 260) * hl, 80, 10); ctx.fill(); }
  icon(cx + 160, y + 100 - lift * 16, 1.2);
  text(word, cx + 240, y + 128 - lift * 16, { size: 78, color: '#231F20' });
  ctx.restore();
}
function sceneBook(t) {
  ctx.fillStyle = '#1a0d08'; ctx.fillRect(0, 0, W, H); glowCircle(SAFE.cx, 880, 1000, '#d27a3e', .5 * (1 - pr(t, 53.9, 54.4)));
  const rise = ease.outC(pr(t, 43.88, 44.6)), open = ease.io(pr(t, 44.73, 45.35)), out = ease.inC(pr(t, 53.86, 54.45));
  ctx.save(); ctx.translate(SAFE.cx, 875); ctx.rotate(lerp(.4, 0, rise) + out * .5); const k = lerp(.5, 1, rise) * lerp(1, .15, out); ctx.scale(k, k); ctx.translate(-SAFE.cx, -875 + lerp(700, 0, rise));
  ctx.globalAlpha = 1 - pr(out, .6, 1);
  // sayfa
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.fillStyle = '#f3ead9'; rr(PAGE.x, PAGE.y, PAGE.w, PAGE.h, 14); ctx.fill(); ctx.shadowBlur = 0;
  const sp = ctx.createLinearGradient(PAGE.x, 0, PAGE.x + 60, 0); sp.addColorStop(0, 'rgba(90,50,20,.35)'); sp.addColorStop(1, 'rgba(90,50,20,0)'); ctx.fillStyle = sp; ctx.fillRect(PAGE.x, PAGE.y, 60, PAGE.h);
  text('TARİH · 5. SINIF · ÜNİTE 1', PAGE.x + 70, PAGE.y + 70, { fam: 'JetBrains Mono', w: 500, size: 22, color: '#8a6a4a' });
  text('Uygarlığın Doğuşu', PAGE.x + 70, PAGE.y + 140, { w: 700, size: 52, color: '#231F20' });
  // numaralar sabit
  const jit = pr(t, 45.9, 46.1) * (1 - pr(t, 46.7, 46.9));
  for (let i = 0; i < 2; i++) { ctx.fillStyle = '#231F20'; ctx.beginPath(); ctx.arc(PAGE.x + 100, SLOT[i] + 100, 44, 0, 7); ctx.fill(); text(String(i + 1), PAGE.x + 100, SLOT[i] + 124, { size: 64, align: 'center', color: '#f3ead9' }); }
  // ok
  ctx.strokeStyle = '#231F20'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(PAGE.x + 100, SLOT[0] + 160); ctx.lineTo(PAGE.x + 100, SLOT[1] + 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(PAGE.x + 82, SLOT[1] + 18); ctx.lineTo(PAGE.x + 100, SLOT[1] + 42); ctx.lineTo(PAGE.x + 118, SLOT[1] + 18); ctx.stroke();
  // kartlar: yer değiştirir
  const lift = ease.outC(pr(t, 51.63, 51.95)) * (1 - ease.outC(pr(t, 52.6, 52.9)));
  const sw = ease.io(pr(t, 51.95, 52.6));
  const hlA = ease.outC(pr(t, 47.13, 47.5)), hlB = ease.outC(pr(t, 48.33, 48.7));
  const jy = Math.sin(t * 60) * 4 * jit;
  card('TARIM', wheatIcon, lerp(SLOT[0], SLOT[1], sw) + jy, lift, hlA, Math.sin(sw * Math.PI) * 150);
  card('TAPINAK', templeIcon, lerp(SLOT[1], SLOT[0], sw) - jy, lift, hlB, -Math.sin(sw * Math.PI) * 150);
  // Göbeklitepe figürü konuşur
  const dp = ease.bounce(pr(t, 49.81, 50.15)); if (t > 49.81) {
    ctx.save(); ctx.translate(PAGE.x + PAGE.w - 90, lerp(-200, PAGE.y + 250, dp)); ctx.rotate(Math.sin(t * 7) * .06 * pr(t, 50.3, 50.4) * (1 - pr(t, 51.3, 51.5)));
    ctx.scale(.28, .28); drawPillar(0, 0, 1, {}); ctx.restore();
    const sp2 = pr(t, 50.3, 51.3); if (sp2 > 0 && sp2 < 1) { ctx.strokeStyle = TERRA; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { const a = ((t * 3 + i / 3) % 1); ctx.globalAlpha = 1 - a; ctx.beginPath(); ctx.arc(PAGE.x + PAGE.w - 150, PAGE.y + 110, 20 + a * 40, Math.PI * .8, Math.PI * 1.2); ctx.stroke(); } ctx.globalAlpha = 1 - pr(out, .6, 1); }
  }
  // pırıltı patlaması
  const bp = pr(t, 52.55, 53.1); if (bp > 0 && bp < 1) { for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; sparkle(PAGE.x + 400 + Math.cos(a) * 260 * ease.outC(bp), SLOT[0] + 100 + Math.sin(a) * 160 * ease.outC(bp), 22 * (1 - bp), { glow: 20 }); } }
  stamp('BİLİM HÂLÂ TARTIŞIYOR', PAGE.x + 90, PAGE.y + PAGE.h - 60, pr(t, 52.95, 53.25), { color: COL.red, size: 30, rot: -.06 });
  ctx.restore();
  // kapak (açılış)
  if (open < 1) {
    ctx.save(); ctx.translate(SAFE.cx, 875); ctx.rotate(lerp(.4, 0, rise)); ctx.scale(lerp(.5, 1, rise), lerp(.5, 1, rise)); ctx.translate(-SAFE.cx, -875 + lerp(700, 0, rise));
    ctx.translate(PAGE.x, 0); ctx.scale(Math.cos(open * Math.PI), 1); ctx.translate(-PAGE.x, 0);
    ctx.fillStyle = open < .5 ? '#9c4520' : '#e9dcc4'; rr(PAGE.x, PAGE.y, PAGE.w, PAGE.h, 14); ctx.fill();
    if (open < .5) { text('TARİH', PAGE.x + PAGE.w / 2, PAGE.y + 420, { size: 120, align: 'center', color: '#f3d7a0' }); text('5', PAGE.x + PAGE.w / 2, PAGE.y + 600, { size: 180, align: 'center', color: '#f3d7a0', alpha: .8 }); }
    ctx.restore();
  }
}

// ======================================================================
// SAHNE 17 — Tepenin küçük bir kısmı kazıldı
function sceneWide(t) {
  const s = lerp(.62, .5, ease.outC(pr(t, 53.9, 56.5)));
  const sq = ease.io(pr(t, 56.45, 56.95));
  ctx.save(); ctx.translate(SAFE.cx, 560 + (1 - sq) * 340); ctx.scale(s, s * lerp(1, .04, sq)); ctx.translate(-475, -950);
  aerial(t, { lit: pr(t, 54.0, 54.4), ghosts: 1, scan: lerp(-300, 2300, ease.io(pr(t, 54.5, 56.0))) });
  ctx.restore();
  if (sq < .5) {
    const scanY = lerp(-300, 2300, ease.io(pr(t, 54.5, 56.0))); const sy_ = (scanY - 950) * s + 900;
    if (t > 54.5 && t < 56.1) { ctx.fillStyle = rgba(COL.amber, .9); ctx.fillRect(0, sy_ - 2, W, 4); const g = ctx.createLinearGradient(0, sy_ - 120, 0, sy_); g.addColorStop(0, rgba(COL.amber, 0)); g.addColorStop(1, rgba(COL.amber, .25)); ctx.fillStyle = g; ctx.fillRect(0, sy_ - 120, W, 120); }
    const lp = ease.outC(pr(t, 54.2, 54.6)) * (1 - pr(t, 56.2, 56.5));
    if (lp > 0) { const lx = SAFE.cx + (455 - 475) * s, ly = 900 + (940 - 950) * s; ctx.strokeStyle = rgba(COL.amber, lp); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lx, ly, 190 * s * 1.3, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx + 150, ly - 150); ctx.lineTo(lx + 230, ly - 290); ctx.stroke(); text('KAZILAN ALAN', lx + 230, ly - 305, { fam: 'JetBrains Mono', w: 700, size: 30, color: COL.amber, alpha: lp, align: 'center', ls: 2 }); }
    stamp('KAYNAK: SMITHSONIAN · UNESCO 2018', 100, 1230, pr(t, 55.2, 55.45) * (1 - pr(t, 56.2, 56.5)), { size: 24, rot: -.04 });
  }
}
// SAHNE 18 — Toprağın altına iniş
const STRATA = (() => { const R = rng(66); return Array.from({ length: 22 }, (_, i) => ({ y: i * 170, c: mix('#8a4422', '#150a06', i / 18), ph: R() * 6, a: 10 + R() * 18, peb: Array.from({ length: 10 }, () => [R() * W, R() * 170, 3 + R() * 9]) })); })();
function sceneDescend(t) {
  const d = lerp(0, 2750, ease.io(pr(t, 56.8, 59.3))); const top = 560 - d;
  ctx.fillStyle = '#150a06'; ctx.fillRect(0, 0, W, H);
  // yüzey üstü
  ctx.fillStyle = '#2a150d'; ctx.fillRect(0, 0, W, Math.max(0, top)); if (top > -200) { glowCircle(SAFE.cx, top, 500, COL.amber, .3); }
  for (const s of STRATA) {
    const y = top + s.y; if (y > H || y + 200 < 0) continue;
    ctx.fillStyle = s.c; ctx.beginPath(); ctx.moveTo(0, y + s.a * Math.sin(s.ph)); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, y + s.a * Math.sin(x * .006 + s.ph)); ctx.lineTo(W, y + 220); ctx.lineTo(0, y + 220); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (const [px, py, r] of s.peb) { ctx.beginPath(); ctx.ellipse(px, y + py, r * 1.4, r, 0, 0, 7); ctx.fill(); }
  }
  // kökler
  ctx.strokeStyle = 'rgba(40,20,10,.8)'; ctx.lineWidth = 4; const R = rng(4); for (let i = 0; i < 16; i++) { let x = R() * W, y = top; ctx.beginPath(); ctx.moveTo(x, y); for (let k = 0; k < 7; k++) { x += (R() - .5) * 50; y += 30 + R() * 30; ctx.lineTo(x, y); } ctx.stroke(); }
  // gömülü sütun
  const py = top + 3180, gp = pr(t, 58.1, 58.7);
  ctx.save(); ctx.globalAlpha = .5 + .5 * gp; drawPillar(SAFE.cx - 30, py, .75, { base: mix('#3a1a0c', TERRA, gp), light: mix('#4a2410', '#f39a5f', gp), dark: '#2a1208' }); ctx.restore();
  if (gp > 0) { glowCircle(SAFE.cx, py - 250, 700, COL.amber, .45 * gp); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * gp; drawPillar(SAFE.cx - 30, py, .75, { base: COL.amber, light: '#ffe0a0', dark: TERRA }); ctx.restore(); }
  // karanlık kapanış
  const dk = pr(t, 59.35, 59.8); if (dk > 0) { ctx.fillStyle = `rgba(20,17,18,${dk})`; ctx.fillRect(0, 0, W, H); }
}
function sparkleEnd(t) { // gömülü sütunun pırıltısı -> logo
  const p = ease.back(pr(t, 58.5, 58.85)); if (p <= 0 || t > 59.75) return;
  const x = SAFE.cx + 60, y = 500 + 60 * Math.sin(t * 2) * 0 + (1 - pr(t, 56.8, 59.3)) * 0;
  sparkle(x, 780, 36 * p * (1 + .25 * Math.sin(t * 9)), { glow: 40, rot: t * .5 });
}

// ======================================================================
const SCENES = [
  [0, 1.5, sceneStonehenge], [1.8, 5.45, sceneUrfa], [1.12, 2.96, sceneRewind], [5.36, 7.25, sceneFreeze], [7.15, 9.62, sceneHunter],
  [9.4, 13.3, sceneObjects], [13.25, 16.4, sceneFlint], [16.18, 19.3, sceneAerial], [19.0, 23.1, sceneTimeline], [22.85, 33.3, scenePillar],
  [33.05, 43.92, sceneDig], [43.85, 54.5, sceneBook], [53.86, 57.0, sceneWide], [56.45, 59.9, sceneDescend],
];
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px';
  ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t); ctx.save(); ctx.translate(sh.x, sh.y);
  // geçiş yumuşatmaları
  for (const [a, b, f] of SCENES) {
    if (t < a || t >= b) continue;
    ctx.save();
    if (f === sceneUrfa) ctx.globalAlpha = pr(t, 1.8, 2.7);
    if (f === sceneObjects) ctx.globalAlpha = pr(t, 9.4, 9.6);
    if (f === sceneFlint) ctx.globalAlpha = pr(t, 13.25, 13.3);
    if (f === sceneAerial) ctx.globalAlpha = 1;
    if (f === sceneTimeline) ctx.globalAlpha = pr(t, 19.0, 19.1);
    if (f === scenePillar) ctx.globalAlpha = pr(t, 22.85, 23.05);
    if (f === sceneWide) ctx.globalAlpha = pr(t, 53.86, 54.3);
    if (f === sceneDescend) ctx.globalAlpha = pr(t, 56.7, 56.95);
    f(t); ctx.restore();
  }
  sparkleEnd(t);
  ctx.restore();
  // logo
  if (t > 59.6) { ctx.fillStyle = COL.ink; ctx.globalAlpha = pr(t, 59.6, 59.8); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; logoSting(t, 59.72, SAFE.cx, 860, 620, [SAFE.cx + 60, 780]); }
  vignette(.55); grain(t, .07);
  if (t < AUDIO_END) { const a = pr(t, .15, .5) * (1 - pr(t, 59.3, 59.7)); chip(CAT.name, CAT.color, a * .9); timer(t / AUDIO_END, a); }
  captions(t, CAP, COL.amber);
  const fo = pr(t, END - .3, END); if (fo > 0) { ctx.fillStyle = `rgba(20,17,18,${fo})`; ctx.fillRect(0, 0, W, H); }
}
window.DURATION = END;
window.render = render;
window.ready = Promise.all(['300 20px Outfit', '500 20px Outfit', '700 20px Outfit', '900 20px Outfit', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map(f => document.fonts.load(f, 'ÇĞİÖŞÜçğıöşü'))).then(() => true);
