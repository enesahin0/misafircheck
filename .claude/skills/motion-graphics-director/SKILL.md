---
name: motion-graphics
description: Create professional motion graphics videos — kinetic type, logo animations, title sequences, data-viz motion, product reveals, showreels, social clips. Deterministic canvas rendering + headless browser frame capture + ffmpeg encode, with optional synthesized soundtrack. Use when the user asks for a motion graphic, animated video, showreel, title animation, animated logo, kinetic typography, motion ident, or any "make it move" video deliverable.
---

# Motion Graphics

Produce polished, beat-synced, deterministic motion-graphics videos from a brief. Core pipeline: canvas-based renderer → headless browser frame capture → ffmpeg encode → optional synthesized audio. The methodology (brief analysis → concept → storyboard → shot design → animation → QC) applies to any duration, aspect ratio, or subject.

## Instructions

### Step 0 — Brief analysis

Extract from the user's request (ask only if a dimension is blocking):

| Dimension | Ask | Default if unspecified |
|---|---|---|
| Message | What must the viewer know/feel after watching? | Infer from subject |
| Duration | How long? | 15s (social/showreel), 30–60s (explainer) |
| Platform/ratio | Where does it play? | 1920x1080 @ 60fps |
| Tone | Corporate / luxury / cyberpunk / playful / cinematic? | Match subject |
| Audio | Soundtrack needed? | Yes — synthesized, deterministic |
| References | Images/videos/styles named? | None — develop original |

Write a one-sentence **creative idea** before coding (e.g., "Motion is a language: words assemble, then everything the words promised gets demonstrated"). Every scene must serve that idea. If a scene doesn't, cut it.

### Step 1 — Concept and storyboard

Structure the piece into scenes with distinct jobs. For a 15s piece at 120 BPM, 2.5s per scene works well. Each scene gets:

1. **Job** — hook / identity / proof / energy / depth / resolution (a piece needs most of these, in some order; hook first, resolution last)
2. **One dominant element** — one big idea per scene, not five small ones
3. **Entrance timing** — when elements arrive relative to scene start (stagger 40–80ms per element)
4. **Exit/cut behavior** — hard cut (energy), crossfade (calm), or camera push-through (continuity)

Storyboard as a table before writing code:

```
Scene | Time     | Job        | Dominant element        | Audio moment
1     | 0–2.5s   | Hook       | Kinetic type slam       | Letters land on kicks
2     | 2.5–5s   | Identity   | Mark draw-on + wordmark | Draw-on spans bar
...
```

Visual climax goes at ~70–80% through the piece. End on a clean lockup + fade.

### Step 2 — Visual direction

Establish a system before animating:

- **Palette**: 1 background, 1 ink, 1 accent, 1 secondary accent. The accent is scarce — highlight ONE element per scene, not all. Inverted scenes (light bg) count as using the palette, not breaking it.
- **Type**: 1 display face (heavy weight for headlines), 1 mono/body face for metadata. letter-spacing on tracked small caps reads "designed."
- **Shape language**: pick a family (angular/hexagonal, organic/blob, geometric/circular) and stay in it across scenes.
- **Post-grade**: film grain (pre-rendered seeded tiles, `overlay` at ~0.05 alpha), vignette (radial gradient to ~0.4 black), letterbox bars, subtle color grade (`soft-light` linear gradient). These unify disparate scenes into one film.
- **Consistency devices**: persistent HUD (timecode, scene counter, title), repeated accent color, same easing family everywhere.

### Step 3 — Implementation (environment inspection)

Check what is available, pick the best path:

1. **Node + headless Chromium (Chrome/Edge) + ffmpeg** — preferred. Deterministic canvas rendering, per-frame capture, h264 encode. This skill's scripts support it.
2. **Playwright/Puppeteer installed** — same as 1 with `playwright` instead of `playwright-core` + system Chrome path.
3. **Remotion** — if present in a React project, use it instead.
4. **After Effects / Blender available and user requests them** — generate scripting instructions (ExtendScript/Python) rather than canvas.
5. **ffmpeg only, no browser** — Python + numpy/PIL frame rendering.

Install path for path 1 (ask permission for npm installs):

```bash
npm init -y && npm i playwright-core
```

Set up the project: `scene.js` (pure renderer: `renderFrame(ctx, i)`), `host.html` (loads scene.js, exposes capture), `capture.mjs` (Playwright frame grab), `audio.py` (soundtrack), then ffmpeg.

**Critical determinism rule**: every animated value must be a pure function of frame index `i`. No `Date.now()`, no `Math.random()` without a seeded PRNG (mulberry32), no requestAnimationFrame. This is what makes re-renders identical and enables parallel/partial re-capture.

**Name collision trap**: if host.html wraps the scene's `renderFrame` as `window.renderFrame`, the wrapper calls itself → stack overflow. Alias: `const __sceneRender = renderFrame;` before reassigning.

### Step 4 — Animation craft

Read [references/animation-principles.md](references/animation-principles.md) for the full library. Core rules:

- **Easing**: nothing moves linearly. `cubicOut`/`quintOut`/`expoOut` for entrances, `backOut` for playful overshoot, `easeInOut` for camera. One easing family per piece.
- **Draw-on**: stroke paths progressively (arc-length parameterized), don't fade them in.
- **Stagger**: elements arrive in sequence, 40–80ms apart, never simultaneously.
- **Beat sync**: `beatPulse(t, bpm)` — scale/flash elements on the kick. For 120 BPM, hits land every 0.5s.
- **Scene boundaries**: camera settle-in (1.05→1.0 zoom over 0.3s) at scene start, push-out at end, plus a 2–3 frame white flash on hard cuts. Makes cuts feel intentional.
- **3D depth**: fibonacci sphere + near-neighbor edges + perspective projection + depth-based alpha. No libraries needed.
- **Text**: draw tracked text glyph-by-glyph for per-letter animation; measure with `measureText`.

### Step 5 — Soundtrack (optional but recommended)

Synthesize a deterministic soundtrack (numpy → WAV). Read [scripts/audio_template.py](scripts/audio_template.py). Rules:

- Match BPM to edit rhythm; scene boundaries on bar lines.
- Layers: kick, hats, clap, bass, arp/melody, risers into scene changes, impacts at scene starts, sidechain duck.
- Envelope per hit (`exp` decay), master soft-clip (`tanh`), normalize to 0.97, fade in/out.
- Exact duration match to video.

### Step 6 — Capture and encode

Preview first (PNG stills at key timestamps — scene mid-points and entrances), inspect visually, fix, then full render:

```bash
node capture.mjs preview    # ~13 stills
# inspect, fix scene.js, repeat
node capture.mjs render     # all frames
ffmpeg -y -framerate 60 -i frames/f_%04d.jpg -i showreel_audio.wav \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart showreel.mp4
```

Verify with ffprobe: duration exact, 1920x1080, 60fps, h264+aac.

### Step 7 — Quality control

Read [references/qc-checklist.md](references/qc-checklist.md) and run it. Non-negotiables:

- Inspect ≥3 stills per scene visually before final render. Read the actual PNGs — don't trust code.
- Every element has a reason to exist. If you can't say what an effect communicates, delete it.
- Text legible at 50% zoom. Contrast checked (dark-on-dark and light-on-light bugs are common — always set `fillStyle` explicitly before each text block).
- No unseeded randomness. No linear motion. No default-looking font stacks for display type.

### Failure modes

| Failure | Cause | Fix |
|---|---|---|
| Letters invisible | fillStyle still BG from previous op | Set fillStyle explicitly before every text/color group |
| Stack overflow on capture | wrapper shadows scene function name | Alias scene fn before wrapping |
| Flicker between frames | unseeded randomness | mulberry32 with fixed seed |
| Blurry output | deviceScaleFactor / JPEG quality | scale factor 1, quality ≥0.92, or PNG |
| Audio/video drift | not `-shortest`, or DUR mismatch | exact sample count = SR × DUR |
| Choppy motion | frame steps too large in easing | more frames per transition, or smoother easing |
| Generic look | preset effects, uniform timing | stagger, accent scarcity, post-grade, one dominant element per scene |

## Inputs

Any of: topic/subject, concept/message, scenario/story, product/brand, visual reference (image/screenshot/video path), desired style, mood, duration, aspect ratio/platform, specific technique, rough idea. Combine freely. References are analyzed, not copied — see [references/reference-analysis.md](references/reference-analysis.md).

## Outputs

- Final `.mp4` (h264, yuv420p, faststart) at requested resolution/fps/duration
- Optional soundtrack `.wav`
- Source files (`scene.js`, `capture.mjs`, `audio.py`) so the user can re-render or tweak
- Preview stills folder

## References

- [references/animation-principles.md](references/animation-principles.md) — easing library, draw-on, stagger, beat sync, particles, 3D, camera
- [scripts/scene_template.js](scripts/scene_template.js) — deterministic canvas renderer skeleton with all helpers
- [scripts/capture_template.mjs](scripts/capture_template.mjs) — frame capture harness
- [scripts/audio_template.py](scripts/audio_template.py) — soundtrack synth
- [references/reference-analysis.md](references/reference-analysis.md) — extracting visual grammar from references
- [references/qc-checklist.md](references/qc-checklist.md) — pre-delivery checklist
