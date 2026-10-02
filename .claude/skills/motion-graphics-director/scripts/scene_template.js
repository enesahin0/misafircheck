// scene_template.js — deterministic motion-graphics renderer skeleton
// Adapt per project: palette, fonts, scenes. Keep the helper library intact.
// Contract: renderFrame(ctx, i) draws frame i of N (duration*FPS). Pure function of i.
'use strict';

// ---------- project constants (EDIT THESE) ----------
const W = 1920, H = 1080, FPS = 60, DUR = 15.0, NF = Math.round(DUR * FPS);
const SECTION = 2.5;   // seconds per scene

// ---------- palette (EDIT — 1 bg, 1 ink, 1 accent, 1 secondary) ----------
const BG    = '#0a0b10';
const INK   = '#f2f1ec';
const ACC   = '#ff4d00';
const ACC2  = '#00e5ff';

// ---------- fonts (EDIT — 1 display, 1 body, 1 mono) ----------
const DISP = '"Arial Black", Arial, sans-serif';
const BODY = 'Arial, sans-serif';
const MONO = 'Consolas, "Courier New", monospace';
const font = (w, s, f = BODY) => `${w} ${s}px ${f}`;

// ---------- seeded rng (KEEP — required for determinism) ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------- easing library (KEEP) ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const cubicOut = t => 1 - Math.pow(1 - t, 3);
const quintOut = t => 1 - Math.pow(1 - t, 5);
const expoOut = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const backOut = (t, s = 1.70158) => { t -= 1; return t * t * ((s + 1) * t + s) + 1; };
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const beatPulse = (t, bpm = 120) => { const per = 60 / bpm; const ph = ((t % per) + per) % per / per; return Math.pow(1 - ph, 3); };

// ---------- text helpers (KEEP) ----------
function measureTracked(c, txt, ls) {
  let w = 0;
  for (const ch of txt) w += c.measureText(ch).width + ls;
  return w - ls;
}
function drawTracked(c, txt, x, y, ls = 0, align = 'left') {
  const w = measureTracked(c, txt, ls);
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  for (const ch of txt) { c.fillText(ch, cx, y); cx += c.measureText(ch).width + ls; }
  return w;
}

// ---------- draw-on helpers (KEEP) ----------
function drawPathOn(c, pts, prog, close = false) {
  prog = clamp(prog);
  if (prog <= 0) return;
  let L = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d); L += d;
  }
  if (close) {
    const d = Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
    seg.push(d); L += d;
  }
  const target = L * prog;
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  let acc = 0, done = false;
  for (let i = 1; i < pts.length; i++) {
    const d = seg[i - 1];
    if (acc + d <= target) { c.lineTo(pts[i][0], pts[i][1]); acc += d; }
    else { const r = (target - acc) / d; c.lineTo(lerp(pts[i - 1][0], pts[i][0], r), lerp(pts[i - 1][1], pts[i][1], r)); done = true; break; }
  }
  if (!done && close && target > acc) {
    const d = seg[seg.length - 1]; const r = (target - acc) / d;
    c.lineTo(lerp(pts[pts.length - 1][0], pts[0][0], r), lerp(pts[pts.length - 1][1], pts[0][1], r));
  }
  c.stroke();
}
function drawArcOn(c, cx, cy, r, a0, prog) {
  prog = clamp(prog); if (prog <= 0) return;
  c.beginPath(); c.arc(cx, cy, r, a0, a0 + prog * Math.PI * 2); c.stroke();
}

// ---------- grain tiles (KEEP — pre-rendered once, seeded) ----------
const grainTiles = [];
(function () {
  for (let g = 0; g < 6; g++) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const gx = cv.getContext('2d');
    const id = gx.createImageData(256, 256);
    const rr = mulberry32(1234 + g * 77);
    for (let p = 0; p < id.data.length; p += 4) {
      const v = (rr() * 255) | 0;
      id.data[p] = id.data[p + 1] = id.data[p + 2] = v; id.data[p + 3] = 255;
    }
    gx.putImageData(id, 0, 0);
    grainTiles.push(cv);
  }
})();

// ---------- SCENES (EDIT — one function per scene, signature (c, lt, t)) ----------
// lt = local time within scene (0..SECTION), t = global time

// EXAMPLE — hook scene: kinetic type slam + tracked subline
function s1(c, lt, t) {
  // background drift grid
  c.save();
  c.strokeStyle = INK; c.globalAlpha = 0.045; c.lineWidth = 1;
  const step = 120, off = (t * 14) % step;
  c.beginPath();
  for (let x = -step + off; x < W + step; x += step) { c.moveTo(x, 0); c.lineTo(x, H); }
  for (let y = -step + off; y < H + step; y += step) { c.moveTo(0, y); c.lineTo(W, y); }
  c.stroke(); c.restore();

  const word = 'YOUR WORD';
  c.font = font(900, 250, DISP);
  c.fillStyle = INK;                       // ALWAYS set fillStyle explicitly
  const bp = beatPulse(t);
  const ls = 4;
  const widths = [...word].map(ch => c.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + ls * (word.length - 1);
  let x = 960 - total / 2;
  for (let k = 0; k < word.length; k++) {
    const p = clamp((lt - (0.10 + k * 0.055)) / 0.6);
    const y = 610 + (1 - backOut(p)) * 190;
    c.globalAlpha = cubicOut(clamp(p * 1.7));
    const sc = 1 + 0.028 * bp;
    c.save(); c.translate(x + widths[k] / 2, y); c.scale(sc, sc); c.translate(-(x + widths[k] / 2), -y);
    c.fillText(word[k], x, y);
    c.restore();
    x += widths[k] + ls;
  }
  c.globalAlpha = 1;

  // accent bar wipe
  const bw = total * expoOut(clamp((lt - 0.45) / 0.55));
  c.fillStyle = ACC;
  c.fillRect(960 - bw / 2, 652, bw, 12);

  // subline
  c.font = font(700, 44, BODY);
  c.fillStyle = INK;
  c.globalAlpha = cubicOut(clamp((lt - 0.85) / 0.5));
  drawTracked(c, 'YOUR SUBLINE.', 960, 736, 16, 'center');
  c.restore();
}

const SCENES = [s1 /*, s2, s3 ... */];

// ---------- main (KEEP structure) ----------
function renderFrame(c, i) {
  const t = i / FPS;
  const sec = Math.min(SCENES.length - 1, Math.floor(t / SECTION));
  const lt = t - sec * SECTION;

  c.save();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = BG;
  c.fillRect(0, 0, W, H);
  c.textAlign = 'left'; c.textBaseline = 'alphabetic';

  // camera settle-in / push-out
  c.save();
  c.translate(960, 540);
  const zi = 1 + 0.05 * (1 - expoOut(clamp(lt / 0.30)));
  const zo = 1 + 0.05 * easeInOut(clamp((lt - (SECTION - 0.13)) / 0.13));
  c.scale(zi * zo, zi * zo);
  c.translate(-960, -540);
  SCENES[sec](c, lt, t);
  c.restore();

  // grade (soft-light cool-to-warm)
  c.save();
  c.globalCompositeOperation = 'soft-light';
  const gr = c.createLinearGradient(0, 0, W, H);
  gr.addColorStop(0, 'rgba(0,180,220,0.10)');
  gr.addColorStop(1, 'rgba(255,110,30,0.10)');
  c.fillStyle = gr; c.fillRect(0, 0, W, H);
  c.restore();

  // grain
  c.save();
  c.globalCompositeOperation = 'overlay';
  c.globalAlpha = 0.05;
  const tile = grainTiles[i % 6];
  const ox = (i * 53) % 256, oy = (i * 97) % 256;
  for (let gy = 0; gy < H + 256; gy += 256)
    for (let gx = 0; gx < W + 256; gx += 256)
      c.drawImage(tile, gx - ox, gy - oy);
  c.restore();
  c.globalCompositeOperation = 'source-over';

  // vignette
  const vg = c.createRadialGradient(960, 540, 420, 960, 540, 1160);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.40)');
  c.fillStyle = vg; c.fillRect(0, 0, W, H);

  // letterbox
  c.fillStyle = '#000';
  c.fillRect(0, 0, W, 44);
  c.fillRect(0, H - 44, W, 44);

  // boundary flash on hard cuts (frames at SECTION boundaries)
  for (let b = 1; b < SCENES.length; b++) {
    const B = Math.round(b * SECTION * FPS);
    const d = i - B;
    if (d >= 0 && d < 8) {
      c.globalAlpha = (1 - d / 8) * 0.9;
      c.fillStyle = '#fff';
      c.fillRect(0, 0, W, H);
      c.globalAlpha = 1;
    }
  }
  c.restore();
}

// export for Node (capture harness) — browser host uses global
if (typeof module !== 'undefined') module.exports = { renderFrame, W, H, FPS, NF, DUR };
