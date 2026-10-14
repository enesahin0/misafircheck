// 5 saniyelik şehir testi (CLAUDE.md §4 performans #2) + tek karelik hata ayıklama kompozisyonu.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { DEFAULT_PARAMS, WorldParams, WorldScene } from "../world/WorldScene";
import { lerp, smooth } from "../utils/time";
import { C } from "../world/palette";
import { useFontsReady } from "../utils/fonts";
import type { IsoCam } from "../world/camera";
import { room } from "../world/layout";

const Canvas: React.FC<{ frame: number; params: WorldParams; camera: IsoCam }> = ({ frame, params, camera }) => {
  const ready = useFontsReady();
  return (
    <AbsoluteFill style={{ background: C.deepNight }}>
      {ready && (
        <ThreeCanvas orthographic width={1080} height={1920} flat dpr={1} camera={{ zoom: 30, position: [100, 80, 100], near: 1, far: 420 }}>
          <WorldScene frame={frame} params={params} camera={camera} />
        </ThreeCanvas>
      )}
    </AbsoluteFill>
  );
};

/** 5 sn: şehir turu + sokak silinmesi + arşiv kesiti açılışı */
export const CityTest5s: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 150;
  const params: WorldParams = {
    ...DEFAULT_PARAMS,
    street14Erase: smooth(t * 1.6),
    speakerRed: t > 0.4 ? 1 : 0,
    redCar: { route: "belediye", t: lerp(0.1, 0.9, t) },
    cutaway: smooth((t - 0.6) / 0.3),
  };
  const mid = smooth(t);
  const camera: IsoCam = {
    target: [lerp(10, room(0, 0, 0)[0], smooth((t - 0.45) / 0.3)), 2, lerp(10, room(0, 0, 0)[2], smooth((t - 0.45) / 0.3))],
    zoom: lerp(18, 40, smooth((t - 0.45) / 0.3)) + 4 * mid,
    az: 45,
  };
  return <Canvas frame={frame} params={params} camera={camera} />;
};

export type DebugProps = { frame: number; params: Partial<WorldParams>; camera: IsoCam };

export const Debug: React.FC<DebugProps> = ({ frame, params, camera }) => (
  <Canvas frame={frame} params={{ ...DEFAULT_PARAMS, ...params }} camera={camera} />
);
