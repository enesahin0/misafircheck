// Mahalle kiti kontrol kompozisyonu: tek kare, plan (shot) + ışık + vurgu parametreleriyle.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { MahalleParams, MahalleScene } from "../world/mahalle/Mahalle";
import { lightFor } from "../world/mahalle/seasons";
import { shotFor } from "../world/mahalle/layout";
import { useFontsReady } from "../utils/fonts";

export type MahalleDebugProps = { shot: string; params: MahalleParams; frame?: number };

export const MahalleDebug: React.FC<MahalleDebugProps> = ({ shot, params, frame: fixed }) => {
  const cur = useCurrentFrame();
  const frame = fixed ?? cur;
  const ready = useFontsReady();
  const camera = shotFor(shot);
  return (
    <AbsoluteFill style={{ background: lightFor(params.light, params.season ?? "yaz").bg }}>
      {ready && (
        <ThreeCanvas orthographic width={1080} height={1920} flat dpr={1} camera={{ zoom: 12, position: [100, 80, 100], near: 1, far: 420 }}>
          <MahalleScene frame={frame} params={params} camera={camera} />
        </ThreeCanvas>
      )}
    </AbsoluteFill>
  );
};
