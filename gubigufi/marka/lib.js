// gubigufi ortak motion kütüphanesi — her videoda aynı marka öğeleri
const W = 1080, H = 1920, FPS = 30;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
const COL = { ink: '#141112', cream: '#F6F1E7', amber: '#FBAC39', red: '#EE312E', logo: '#231F20' };
// Instagram + YouTube kesişimi güvenli alan
const SAFE = { l: 60, r: 890, t: 250, b: 1440, cx: 475 };

// ---------- matematik ----------
const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const pr = (t, a, b) => cl((t - a) / (b - a));
const ease = {
  lin: x => x,
  inQ: x => x * x, outQ: x => 1 - (1 - x) * (1 - x),
  inC: x => x * x * x, outC: x => 1 - Math.pow(1 - x, 3),
  io: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  ioS: x => -(Math.cos(Math.PI * x) - 1) / 2,
  outX: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inX: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
  back: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  el: x => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI) / 3) + 1,
  bounce: x => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375; },
};
function rng(seed) { let a = seed | 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
function mix(c1, c2, t) { const a = hex(c1), b = hex(c2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], cl(t)))).join(',')})`; }
function rgba(c, a) { const h = hex(c); return `rgba(${h[0]},${h[1]},${h[2]},${a})`; }
const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------- sarsıntı ----------
const IMPACTS = []; // [zaman, genlik]
function shakeAt(t) {
  let x = 0, y = 0;
  for (const [ti, a] of IMPACTS) {
    const d = t - ti; if (d < 0 || d > 1) continue;
    const k = a * Math.exp(-d * 7);
    x += k * Math.sin(d * 71); y += k * Math.cos(d * 53);
  }
  return { x, y };
}

// ---------- çizim yardımcıları ----------
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function font(w, s, fam = 'Outfit') { ctx.font = `${w} ${s}px ${fam}`; }
function text(s, x, y, { w = 900, size = 60, fam = 'Outfit', color = COL.cream, align = 'left', base = 'alphabetic', alpha = 1, shadow = 0, ls = 0 } = {}) {
  ctx.save(); font(w, size, fam); ctx.textAlign = align; ctx.textBaseline = base; ctx.globalAlpha *= alpha;
  if (ls) ctx.letterSpacing = ls + 'px';
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = shadow; ctx.shadowOffsetY = shadow / 4; }
  ctx.fillStyle = color; ctx.fillText(s, x, y); ctx.restore();
}
// Marka pırıltısı (4 köşeli yıldız)
function sparklePath(x, y, r, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = rot + i * Math.PI / 2, b = a + Math.PI / 4, n = a + Math.PI / 2;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    ctx.quadraticCurveTo(x + Math.cos(b) * r * .16, y + Math.sin(b) * r * .16, x + Math.cos(n) * r, y + Math.sin(n) * r);
  }
  ctx.closePath();
}
function sparkle(x, y, r, { rot = 0, color = COL.amber, glow = 0, alpha = 1 } = {}) {
  if (r <= 0.5) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
  sparklePath(x, y, r, rot - Math.PI / 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function glowCircle(x, y, r, color, a = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function strokeProgress(pts, p) { // çoklu çizgiyi p oranında çiz
  if (p <= 0) return; let L = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let rem = L * p; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    if (rem >= seg[i - 1]) { ctx.lineTo(pts[i][0], pts[i][1]); rem -= seg[i - 1]; }
    else { const k = rem / seg[i - 1]; ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); break; }
  }
  ctx.stroke();
}
function bez(p0, p1, p2, p3, n = 24) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; }

// ---------- insan silueti ----------
// y = ayak hizası, h = boy. Dönen: el konumu
function person(x, y, h, o = {}) {
  const { phase = 0, walk = 0, lean = 0, hat = false, spear = false, color = COL.ink, face = 1, arm = null, hair = false, pick = null, clip = false, look = 0, tunic = false } = o;
  const s = h / 100;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s); ctx.rotate(lean);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const sw = Math.sin(phase) * walk, bob = Math.abs(Math.cos(phase)) * walk * 2;
  ctx.translate(0, -bob);
  ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(-3, -46); ctx.lineTo(-3 + sw * 22, -22); ctx.lineTo(-3 + sw * 26, 0 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(3, -46); ctx.lineTo(3 - sw * 22, -22); ctx.lineTo(3 - sw * 26, 0 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-15, -79); ctx.quadraticCurveTo(0, -84, 15, -79); ctx.lineTo(9, -44); ctx.lineTo(-9, -44); ctx.closePath(); ctx.fill(); ctx.fillRect(-3.5, -84, 7, 6);
  if (tunic) { ctx.beginPath(); ctx.moveTo(-11, -52); ctx.lineTo(11, -52); ctx.lineTo(16, -28); ctx.lineTo(6, -31); ctx.lineTo(0, -26); ctx.lineTo(-7, -31); ctx.lineTo(-16, -28); ctx.closePath(); ctx.fill(); }
  ctx.beginPath(); ctx.arc(1 + look, -90, 9.5, 0, 7); ctx.fill();
  if (hair) { ctx.beginPath(); ctx.arc(-6, -96, 6, 0, 7); ctx.fill(); }
  if (hat) { ctx.fillRect(-15, -97, 32, 4); rr(-8, -109, 18, 13, 3); ctx.fill(); }
  ctx.lineWidth = 8;
  let hand;
  if (arm !== null) { // kollar öne uzanır (ip çekme vb.)
    hand = [Math.cos(arm) * 34, -74 + Math.sin(arm) * 34];
    ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(hand[0], hand[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -72); ctx.lineTo(hand[0] - 3, hand[1] + 4); ctx.stroke();
  } else if (pick !== null) { // kazma: pick = açı
    const a = pick; hand = [Math.cos(a) * 30, -74 + Math.sin(a) * 30];
    ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(hand[0], hand[1]); ctx.stroke();
    ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(a + Math.PI / 2);
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -52); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-26, -44); ctx.quadraticCurveTo(0, -60, 26, -44); ctx.stroke();
    ctx.restore();
  } else {
    hand = [-sw * 20 + 4, -46];
    ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(-sw * 16, -60); ctx.lineTo(-sw * 20 + 4, -46); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(sw * 16, -60); ctx.lineTo(sw * 20 - 4, -46); ctx.stroke();
  }
  if (spear) { ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(hand[0] - 8, hand[1] + 30); ctx.lineTo(hand[0] + 22, hand[1] - 70); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hand[0] + 22, hand[1] - 70); ctx.lineTo(hand[0] + 17, hand[1] - 56); ctx.lineTo(hand[0] + 29, hand[1] - 58); ctx.closePath(); ctx.fill(); }
  if (clip) { ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(-.3); ctx.fillRect(-2, -14, 14, 18); ctx.restore(); }
  ctx.restore();
  // el dünya koordinatı
  const c = Math.cos(lean), si = Math.sin(lean);
  const hx = hand[0] * s * face, hy = (hand[1] - bob) * s;
  return [x + hx * c - hy * si * face, y + hx * si * face + hy * c];
}

// ---------- kırılma (shatter) ----------
function offscreen(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); return c; }
function makeShards(img, g = 6, seed = 1) {
  const R = rng(seed), S = img.width, pts = [];
  for (let i = 0; i <= g; i++) { pts.push([]); for (let j = 0; j <= g; j++) { const e = (i > 0 && i < g && j > 0 && j < g); pts[i].push([j * S / g + (e ? (R() - .5) * S / g * .7 : 0), i * S / g + (e ? (R() - .5) * S / g * .7 : 0)]); } }
  const sh = [];
  for (let i = 0; i < g; i++) for (let j = 0; j < g; j++) {
    const a = pts[i][j], b = pts[i][j + 1], c = pts[i + 1][j + 1], d = pts[i + 1][j];
    for (const poly of (R() < .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]])) {
      const cx = (poly[0][0] + poly[1][0] + poly[2][0]) / 3, cy = (poly[0][1] + poly[1][1] + poly[2][1]) / 3;
      const dx = cx - S / 2, dy = cy - S / 2, dl = Math.hypot(dx, dy) + 1;
      sh.push({ poly, cx, cy, vx: dx / dl * (300 + R() * 700), vy: dy / dl * (300 + R() * 600) - 500 - R() * 300, vr: (R() - .5) * 12 });
    }
  }
  return sh;
}
function drawShards(img, sh, x, y, p, scale = 1) {
  const S = img.width;
  for (const s of sh) {
    ctx.save();
    const px = x + (s.cx - S / 2) * scale + s.vx * p, py = y + (s.cy - S / 2) * scale + s.vy * p + 2600 * p * p;
    ctx.translate(px, py); ctx.rotate(s.vr * p); ctx.scale(scale, scale); ctx.translate(-s.cx, -s.cy);
    ctx.globalAlpha *= cl(1 - p * .9);
    ctx.beginPath(); ctx.moveTo(...s.poly[0]); ctx.lineTo(...s.poly[1]); ctx.lineTo(...s.poly[2]); ctx.closePath(); ctx.clip();
    ctx.drawImage(img, 0, 0); ctx.restore();
  }
}

// ---------- logo ----------
const LOGO = (() => {
  const P = {}; for (const p of window.LOGO_PATHS) { const m = p.t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number); const path = new Path2D(); path.addPath(new Path2D(p.d), new DOMMatrix(m)); P[p.id] = { path, fill: p.fill }; }
  // harf merkezleri (PDF koordinatı)
  const C = { g1: [44.5, 134.8], u1: [90.6, 128.5], b: [134.3, 121], i1: [165, 128], g2: [150.3, 180.6], u2: [196.4, 174.3], f: [230.1, 173], i2: [253.6, 174], spark_big: [165, 92.2], spark_small: [177.7, 81.1], red_dot: [253.6, 144.9] };
  return { P, C, cx: 141.5, cy: 141.5 };
})();
// Logo sting: t0 = başlangıç
function logoSting(t, t0, cx = SAFE.cx, cy = 860, width = 620, from = null) {
  const s = width / 233, L = LOGO;
  const toScr = ([x, y]) => [(x - L.cx) * s + cx, (y - L.cy) * s + cy];
  const letters = ['g1', 'u1', 'b', 'i1', 'g2', 'u2', 'f', 'i2'];
  letters.forEach((id, i) => {
    const p = ease.back(pr(t, t0 + .12 + i * .045, t0 + .5 + i * .045)); if (p <= 0) return;
    const [lx, ly] = L.C[id];
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-L.cx, -L.cy);
    ctx.translate(lx, ly + (1 - p) * 30); ctx.scale(p, p); ctx.translate(-lx, -ly);
    ctx.globalAlpha *= cl(p * 2); ctx.fillStyle = COL.cream; ctx.fill(L.P[id].path); ctx.restore();
  });
  // büyük pırıltı: from noktasından uçarak gelir
  const bigT = pr(t, t0, t0 + .42), [bx, by] = toScr(L.C.spark_big);
  const sp = from ? [lerp(from[0], bx, ease.io(bigT)), lerp(from[1], by, ease.io(bigT))] : [bx, by];
  const tw = Math.exp(-Math.max(0, t - t0 - .42) * 5);
  sparkle(sp[0], sp[1], 11.1 * s * (from ? 1 : ease.back(bigT)) * (1 + .5 * tw), { glow: 30 + 40 * tw, rot: tw * .8 });
  const sm = ease.back(pr(t, t0 + .55, t0 + .75)), [smx, smy] = toScr(L.C.spark_small);
  sparkle(smx, smy, 4 * s * sm * (1 + .6 * Math.exp(-Math.max(0, t - t0 - .75) * 6)), { glow: 20 });
  // kırmızı kare: yukarıdan düşer
  const dp = ease.bounce(pr(t, t0 + .62, t0 + 1.02)); if (t > t0 + .62) {
    const [rx, ry] = toScr(L.C.red_dot); const z = 9.2 * s;
    ctx.fillStyle = COL.red; ctx.fillRect(rx - z / 2, lerp(ry - 700, ry, dp) - z / 2, z, z);
  }
}

// ---------- kaplamalar ----------
const GRAIN = [0, 1, 2, 3].map(k => offscreen(360, 640, (g, w, h) => { const R = rng(k + 7), id = g.createImageData(w, h); for (let i = 0; i < id.data.length; i += 4) { const v = R() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } g.putImageData(id, 0, 0); }));
function grain(t, amt = .06) { ctx.save(); ctx.globalAlpha = amt; ctx.globalCompositeOperation = 'overlay'; ctx.imageSmoothingEnabled = false; ctx.drawImage(GRAIN[Math.floor(t * FPS) % 4], 0, 0, W, H); ctx.restore(); }
function vignette(a = .5) { const g = ctx.createRadialGradient(W / 2, H * .45, H * .25, W / 2, H * .5, H * .78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// 60 sn sayacı: halka + ucunda kırmızı kare
function timer(p, alpha = 1) {
  const x = 846, y = 300, r = 28; ctx.save(); ctx.globalAlpha = alpha;
  ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(246,241,231,.18)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  const a1 = -Math.PI / 2 + p * Math.PI * 2;
  ctx.strokeStyle = COL.cream; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, a1); ctx.stroke();
  ctx.fillStyle = COL.red; const z = 11; ctx.fillRect(x + Math.cos(a1) * r - z / 2, y + Math.sin(a1) * r - z / 2, z, z);
  ctx.restore();
}
function chip(label, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; sparkle(84, 292, 13, { color }); text(label, 106, 301, { fam: 'JetBrains Mono', w: 700, size: 24, color: COL.cream, alpha: .85, ls: 2 }); ctx.restore();
}
// Kaynak damgası
function stamp(s, x, y, p, { rot = -.05, color = COL.cream, size = 26 } = {}) {
  if (p <= 0) return; const k = lerp(1.7, 1, ease.outC(p));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); ctx.globalAlpha *= cl(p * 3) * .92;
  font(700, size, 'JetBrains Mono'); ctx.letterSpacing = '1px'; const w = ctx.measureText(s).width;
  ctx.strokeStyle = color; ctx.lineWidth = 3; rr(-14, -size - 4, w + 28, size + 22, 8); ctx.stroke();
  ctx.fillStyle = color; ctx.fillText(s, 0, 0); ctx.restore();
}
// Kinetik altyazı: CAP = [[başla, bitir, "metin *vurgu*"], ...]
function captions(t, CAP, accent) {
  const cur = CAP.find(c => t >= c[0] - .05 && t < c[1] + .3); if (!cur) return;
  const [a, b, raw] = cur, words = raw.split(' ');
  const total = raw.replace(/\*/g, '').length; let acc = 0;
  const size = 54; font(700, size); ctx.save();
  const items = words.map(w => { const hl = w.includes('*'); const s = w.replace(/\*/g, ''); const st = a + (acc / total) * (b - a) * .92; acc += s.length + 1; return { s, hl, st, w: ctx.measureText(s + ' ').width }; });
  const lines = [[]]; let lw = 0; const maxW = 760;
  for (const it of items) { if (lw + it.w > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(it); lw += it.w; }
  const out = pr(t, b + .12, b + .3), baseY = 1370 - (lines.length - 1) * 33;
  lines.forEach((ln, li) => {
    const tw = ln.reduce((s, i) => s + i.w, 0) - ctx.measureText(' ').width; let x = SAFE.cx - tw / 2; const y = baseY + li * 66;
    for (const it of ln) {
      const p = ease.back(pr(t, it.st, it.st + .16));
      if (p > 0) {
        const cx = x + ctx.measureText(it.s).width / 2;
        ctx.save(); ctx.translate(cx, y - 18); ctx.scale(lerp(.6, 1, p), lerp(.6, 1, p)); ctx.translate(-cx, -(y - 18));
        ctx.globalAlpha = cl(p * 1.5) * (1 - out);
        ctx.lineJoin = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(12,9,10,.85)'; ctx.strokeText(it.s, x, y);
        ctx.fillStyle = it.hl ? accent : COL.cream; ctx.fillText(it.s, x, y); ctx.restore();
      }
      x += it.w;
    }
  });
  ctx.restore();
}
