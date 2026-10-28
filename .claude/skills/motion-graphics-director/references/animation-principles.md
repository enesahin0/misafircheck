# Animation Principles Library

Motion-craft reference for the motion-graphics skill. All examples assume canvas 2D but techniques translate to SVG (SMIL/CSS), WebGL shaders, After Effects expressions, or Blender drivers.

## Easing

Nothing moves linearly. Linear motion reads as mechanical/cheap.

```js
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const cubicOut = t => 1 - Math.pow(1 - t, 3);        // entrances, decelerating
const quintOut = t => 1 - Math.pow(1 - t, 5);        // snappier entrances
const expoOut = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);  // very fast start
const backOut = (t, s = 1.70158) => { t -= 1; return t * t * ((s + 1) * t + s) + 1; };  // overshoot
const easeInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;  // camera moves
```

Assignment rules:
- **Element entrances**: cubicOut/quintOut/expoOut. Overshoot (backOut) for playful/energetic tones only.
- **Camera**: easeInOut, always. Never linear, never overshoot.
- **Exits**: easeInOut or cubicIn — accelerating away feels natural.
- Pick ONE overshoot amount per piece and reuse (e.g., backOut s=1.7 everywhere).

## Timing patterns

- **Stagger**: sibling elements arrive 40–80ms apart. Too fast = blur, too slow = sluggish. Per-letter: 50ms; per-bar: 45ms; per-list-item: 80ms.
- **Entrance duration**: 0.4–0.7s for type, 0.6–0.9s for paths, 0.3s for color/opacity.
- **Hold**: every composition needs a beat of stillness (~0.3–0.5s) after elements settle — motion without rest reads as noise.
- **Beat pulse** (music sync): scale or flash on kick.

```js
const beatPulse = (t, bpm = 120) => {
  const per = 60 / bpm;
  const ph = ((t % per) + per) % per / per;
  return Math.pow(1 - ph, 3);  // 1 at kick, decays to 0
};
// usage: scale = 1 + 0.03 * beatPulse(t)
```

- **Scene rhythm**: 2.5s per scene at 120 BPM = 5 beats — enough for entrance (0.5s), development (1.5s), hold (0.5s).

## Draw-on (path tracing)

Stroke paths progressively by arc length, not opacity. Reads as "being drawn."

```js
function drawPathOn(c, pts, prog, close = false) {
  prog = clamp(prog);
  if (prog <= 0) return;
  let L = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]);
    seg.push(d); L += d;
  }
  if (close) {
    const d = Math.hypot(pts[0][0] - pts[pts.length-1][0], pts[0][1] - pts[pts.length-1][1]);
    seg.push(d); L += d;
  }
  const target = L * prog;
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  let acc = 0, done = false;
  for (let i = 1; i < pts.length; i++) {
    const d = seg[i-1];
    if (acc + d <= target) { c.lineTo(pts[i][0], pts[i][1]); acc += d; }
    else {
      const r = (target - acc) / d;
      c.lineTo(lerp(pts[i-1][0], pts[i][0], r), lerp(pts[i-1][1], pts[i][1], r));
      done = true; break;
    }
  }
  if (!done && close && target > acc) {
    const d = seg[seg.length-1]; const r = (target - acc) / d;
    c.lineTo(lerp(pts[pts.length-1][0], pts[0][0], r), lerp(pts[pts.length-1][1], pts[0][1], r));
  }
  c.stroke();
}

function drawArcOn(c, cx, cy, r, a0, prog) {
  prog = clamp(prog); if (prog <= 0) return;
  c.beginPath(); c.arc(cx, cy, r, a0, a0 + prog * Math.PI * 2); c.stroke();
}
```

## Typography

- **Display face**: Arial Black / "Archivo Black" / "Bebas Neue" equivalents — heavy, tight. Body/metadata: mono (Consolas) with letter-spacing.
- **Tracked text** (per-letter control):

```js
function measureTracked(c, txt, ls) {
  let w = 0;
  for (const ch of txt) w += c.measureText(ch).width + ls;
  return w - ls;
}
function drawTracked(c, txt, x, y, ls = 0, align = 'left') {
  const w = measureTracked(c, txt, ls);
  let cx = align === 'center' ? x - w/2 : align === 'right' ? x - w : x;
  for (const ch of txt) { c.fillText(ch, cx, y); cx += c.measureText(ch).width + ls; }
  return w;
}
```

- **Per-letter entrance**: each glyph gets `p = clamp((lt - (start + i*0.05)) / 0.6)` then y-offset `(1 - backOut(p)) * distance`, alpha `cubicOut(p * 1.7)`.
- **Kinetic slam**: single word scales 1.7→1.0 with expoOut over 0.16s, slight rotation settling to 0. Works with hard audio hits.
- **Type-on caption**: letters appear sequentially with small y-drop, line 2 starts ~0.45s after line 1.

## Camera and scene transitions

- **Settle-in**: scene starts zoomed 1.05, eases to 1.0 over 0.3s. Conveys arrival.
- **Push-out**: last 0.13s of scene zooms back to 1.05. Combined with next scene's settle-in = continuity.
- **Hard cut flash**: 2–3 frame white overlay at 90%→0 alpha on cuts between high-energy scenes. Use sparingly — every cut flashed = cheap.
- **Crossfade**: for calm pieces, 0.3s opacity crossfade instead of flash.

```js
// per-frame wrapper
c.translate(960, 540);
const zi = 1 + 0.05 * (1 - expoOut(clamp(lt / 0.30)));                       // settle-in
const zo = 1 + 0.05 * easeInOut(clamp((lt - (SECTION - 0.13)) / 0.13));      // push-out
c.scale(zi * zo, zi * zo);
c.translate(-960, -540);
```

## Shapes and geometry

- **Hexagon/logomark**: vertices at `angle + i*PI/3`, draw-on with drawPathOn, rotate slowly (t * 0.12).
- **Morphing blob**: radius modulated by summed sine harmonics — organic, alive.

```js
for (let i = 0; i <= 120; i++) {
  const th = i / 120 * Math.PI * 2;
  const r = R * (1 + 0.22*Math.sin(3*th + t*1.1) + 0.14*Math.sin(5*th - t*0.7) + 0.08*Math.sin(8*th + t*1.7));
  // x = cx + cos(th)*r, y = cy + sin(th)*r*0.92
}
```

- **Grid drift**: background grid offset by `(t * speed) % step` — subtle life without distraction (alpha ≤ 0.06).
- **Orbits**: ellipse paths with tilt transform; trails via 6–8 ghost dots at decreasing alpha.

## Particles and 3D

- **Dust**: 100–150 seeded particles, slow linear drift, alpha 0.08–0.25, size 0.4–2px. Wraps at edges.
- **Fibonacci sphere wireframe** (no libs):

```js
// points
const N = 380, pts = [], ga = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N-1)) * 2, rad = Math.sqrt(1 - y*y), th = ga * i;
  pts.push([Math.cos(th)*rad, y, Math.sin(th)*rad]);
}
// edges: pairs with 3D distance < threshold (~0.215 for N=380)
// per frame: rotate (yaw = t*0.36, pitch = 0.42 + 0.16*sin(t*0.5)), project:
// persp = 1050 / (1050 - z*R); screen = center + [x, y] * R * persp
// alpha by depth: near edges bright, far edges dim
// highlight: edges whose midpoint x ≈ 0 (facing plane) get accent color
```

- **Depth rule**: alpha/size scale with z. Flat alpha kills 3D illusion.

## Light and texture

- **Glow**: `shadowColor` + `shadowBlur` (20–30) on the ONE highlighted element per scene. Then `shadowBlur = 0` immediately after — leaks otherwise.
- **Radial glow backdrop**: createRadialGradient behind hero element, very low alpha (0.10–0.15).
- **Film grain**: pre-render 6 seeded noise tiles (256px), tile with `overlay` at 0.05 alpha, offset per frame (`(i*53)%256`). Kills banding, adds texture.

```js
const grainTiles = [];
// build once: ImageData with seeded rng, each pixel gray 0-255
// per frame:
c.globalCompositeOperation = 'overlay';
c.globalAlpha = 0.05;
const tile = grainTiles[i % 6], ox = (i*53) % 256, oy = (i*97) % 256;
for (let gy = 0; gy < H + 256; gy += 256)
  for (let gx = 0; gx < W + 256; gx += 256)
    c.drawImage(tile, gx - ox, gy - oy);
c.globalCompositeOperation = 'source-over';
```

- **Vignette**: radial gradient, transparent center → 0.4 black at edges.
- **Color grade**: `soft-light` linear gradient (cool→warm, ~0.10 alpha). Skip on light-background scenes.
- **Letterbox**: 44px black bars top/bottom — instant "film" framing.

## Determinism

Every animated value = pure function of frame index. Required for: identical re-renders, partial re-capture, parallel batches, frame-accurate QC.

```js
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

Seed per use (layout noise, grain tiles, particles, data values). Never `Math.random()`, never `Date.now()`.
