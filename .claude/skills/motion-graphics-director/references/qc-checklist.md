# Quality Control Checklist

Run before delivering any motion-graphics piece. Inspect actual rendered stills — never trust code alone.

## Visual inspection (mandatory)

- [ ] Read ≥3 PNG stills per scene (entrance moment, mid-scene, hold moment) with the Read tool
- [ ] No invisible/dark-on-dark or light-on-light elements — set `fillStyle` explicitly before EVERY text/color block
- [ ] Text legible at 50% zoom; metadata text legible at 100%
- [ ] One dominant element per scene — composition has clear focal point
- [ ] Accent color scarce: one highlighted element per scene, not everything
- [ ] Post-grade present: grain, vignette, letterbox (or deliberate choice to omit)
- [ ] Scenes feel like one film — shared palette, easing family, typography, shape language

## Motion sanity

- [ ] No linear motion anywhere (grep for missing easing on animated values)
- [ ] Stagger present: siblings arrive in sequence, not simultaneously
- [ ] Hold beat exists after elements settle (~0.3–0.5s of rest)
- [ ] Scene boundaries intentional: settle-in + push-out camera, or deliberate cut/flash
- [ ] Beat sync verified: visual hits align with audio kicks (spot-check frames at beat times)
- [ ] Climax lands at ~70–80% through the piece

## Determinism and correctness

- [ ] All randomness seeded (mulberry32 or equivalent); no Math.random()/Date.now()
- [ ] Every animated value pure function of frame index
- [ ] Re-render of single frame matches first render (spot-check one frame twice)
- [ ] No host.html name collision (scene fn aliased before window reassignment)

## Technical verification

- [ ] ffprobe: duration exact (matches requested, e.g. 15.000000)
- [ ] ffprobe: resolution + fps correct (e.g., 1920x1080, 60/1)
- [ ] ffprobe: h264 + yuv420p + faststart (plays everywhere)
- [ ] Audio present, not clipped (peak ≤ 0.97), ends with video
- [ ] File size reasonable (< 20MB for 15–60s social piece)
- [ ] First and last frames checked (strong opening frame, clean ending — no half-faded garbage)

## Communicative purpose

- [ ] One-sentence creative idea written before coding — every scene serves it
- [ ] Each animation answers "why does this exist" (draw-on = being made; beat pulse = energy; slam = emphasis)
- [ ] No decorative effects you can't justify
- [ ] Opening hooks in first 2s; ending resolves (lockup + fade, not abrupt stop)
- [ ] Viewer would know the message after watching without audio
