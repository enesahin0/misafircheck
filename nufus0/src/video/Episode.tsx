// Veriden otomatik bölüm birleştirme: 3D dünya + sahne HUD'ları + altyazı + ses.
import React, { useMemo } from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import type { Episode, WorldState } from "../episodes/schema";
import { WorldScene } from "../world/WorldScene";
import { resolveWorld } from "./params";
import { buildCameraChains, sampleCamera } from "./camera";
import { glitchAt } from "./glitch";
import { blackAlpha } from "./transitions";
import { Subtitle } from "./Subtitle";
import { FileHeader, Vignette } from "./Overlay";
import { SCENE_OVERLAYS } from "../scenes";
import type { OverlayKey } from "../scenes/keys";
import { useFontsReady } from "../utils/fonts";
import { C } from "../world/palette";
import audioManifest from "../generated/audioManifest.json";
import audioLibrary from "../generated/audioLibrary.json";
import { pickFromLibrary, type LibEntry } from "../utils/audioLibrary";

/** "lowpoly" = keskin diorama (varsayılan). "pixel" = 3D katman düşük çözünürlükte render edilip keskin büyütülür; yazılar net kalır. */
export type RenderStyle = "lowpoly" | "pixel";
export const PIXEL_SCALE = 4;
export type EpisodeProps = { episode: Episode; worldState: WorldState; style?: RenderStyle };

const AUDIO_EXT = ["mp3", "wav", "m4a", "aac", "ogg"];
const have = new Set<string>(audioManifest.files);

/** Ses dosyası varsa yolunu döndürür; yoksa null (o ses sessiz geçilir, render durmaz). */
export const findNarration = (file: string): string | null => {
  for (const ext of AUDIO_EXT) {
    const p = `audio/narration/${file}.${ext}`;
    if (have.has(p)) return p;
  }
  return null;
};
export const findAudio = (src: string): string | null => (have.has(`audio/${src}`) ? `audio/${src}` : null);
const library = audioLibrary.entries as LibEntry[];
/** sfx girdisi → dosya yolu (src ya da kütüphane etiketi). Bulunamazsa null (o ses atlanır). */
export const resolveSfx = (s: { src?: string; lib?: string; tag?: string; pick?: number }): string | null =>
  s.src
    ? findAudio(s.src)
    : s.lib
      ? library.find((e) => e.id === s.lib)?.path ?? null
      : s.tag
        ? pickFromLibrary(library, s.tag, s.pick ?? 0)?.path ?? null
        : null;

const AudioTracks: React.FC<{ ep: Episode }> = ({ ep }) => {
  const music = ep.audio.music && findAudio(ep.audio.music.src);
  const dur = ep.durationFrames;
  return (
    <>
      {music && (
        <Html5Audio
          src={staticFile(music)}
          volume={(f) => ep.audio.music!.volume * interpolate(f, [0, 45, dur - 45, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      )}
      {ep.audio.sfx.map((s) => {
        const p = resolveSfx(s);
        return p ? (
          <Sequence key={s.id} from={s.from} layout="none">
            <Html5Audio src={staticFile(p)} volume={s.volume} />
          </Sequence>
        ) : null;
      })}
      {ep.audio.narration.map((n) => {
        const p = findNarration(n.file);
        return p ? (
          <Sequence key={n.id} from={n.from} layout="none">
            <Html5Audio src={staticFile(p)} volume={n.volume} />
          </Sequence>
        ) : null;
      })}
    </>
  );
};

export const EpisodeComposition: React.FC<EpisodeProps> = ({ episode: ep, worldState, style = "lowpoly" }) => {
  const px = style === "pixel" ? PIXEL_SCALE : 1;
  const frame = useCurrentFrame();
  const fontsReady = useFontsReady();
  const chains = useMemo(() => buildCameraChains(ep), [ep]);
  const params = resolveWorld(ep, worldState, frame);
  const camera = sampleCamera(chains, ep, frame);
  const g = glitchAt(ep, frame);
  const black = blackAlpha(ep, frame);

  return (
    <AbsoluteFill style={{ background: C.deepNight, overflow: "hidden" }}>
      {/* 3D dünya (gerçek geometri, ortografik izometrik kamera) */}
      <AbsoluteFill
        style={{
          transform: g.power ? `translateX(${g.dx}px)` : undefined,
          filter: g.power ? `drop-shadow(${10 * g.power}px 0 0 rgba(189,55,63,0.75)) saturate(${1 + g.power * 0.6})` : undefined,
        }}
      >
        {fontsReady && (
          <div style={{ width: ep.width / px, height: ep.height / px, transform: px > 1 ? `scale(${px})` : undefined, transformOrigin: "0 0", imageRendering: px > 1 ? "pixelated" : undefined }}>
            <ThreeCanvas
              orthographic
              width={ep.width / px}
              height={ep.height / px}
              flat
              dpr={1}
              gl={{ antialias: px === 1 }}
              style={{ imageRendering: px > 1 ? "pixelated" : undefined }}
              camera={{ zoom: 30, position: [100, 80, 100], near: 1, far: 420 }}
            >
              <WorldScene frame={frame} params={params} camera={{ ...camera, zoom: camera.zoom / px }} />
            </ThreeCanvas>
          </div>
        )}
      </AbsoluteFill>
      {g.bars.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: 0, width: ep.width, top: b.y, height: b.h, background: i % 2 ? "rgba(11,14,18,0.92)" : "rgba(189,55,63,0.35)", transform: `translateX(${b.dx}px)` }} />
      ))}

      <Vignette alert={params.redAlert} frame={frame} />
      <FileHeader ep={ep} frame={frame} />
      {/* hızlı siyah kesme: sahne HUD'larının (son kart dahil) ALTINDA kalmalı */}
      {black > 0 && <AbsoluteFill style={{ background: C.deepNight, opacity: black }} />}

      {/* Sahne HUD'ları: sahne.overlay → scenes/index.ts */}
      {ep.scenes.map((sc) => {
        const Overlay = sc.overlay ? SCENE_OVERLAYS[sc.overlay as OverlayKey] : undefined;
        if (!Overlay) return null;
        return (
          <Sequence key={sc.id} from={sc.from} durationInFrames={sc.to - sc.from} layout="none" name={sc.name}>
            <Overlay ep={ep} scene={sc} frame={frame} local={frame - sc.from} />
          </Sequence>
        );
      })}

      <Subtitle ep={ep} frame={frame} />
      <AudioTracks ep={ep} />
    </AbsoluteFill>
  );
};
