// Model kütüphanesi görsel testi: aynı ışık/kamera/sis ile birkaç GLB, palete uydurulmuş.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { C } from "../world/palette";
import { IsoCamera } from "../world/camera";
import { Model } from "../world/Model";
import { Box } from "../world/primitives";
import { useFontsReady } from "../utils/fonts";

const ITEMS: { tag: string; pick?: number; s?: number }[] = [
  { tag: "sofa", s: 1.6 }, { tag: "lamp round floor", s: 1.6 }, { tag: "bed double", s: 1.6 }, { tag: "bookcase open", s: 1.6 },
  { tag: "kitchen stove", s: 1.6 }, { tag: "television modern", s: 1.6 }, { tag: "house", s: 0.7 }, { tag: "building", s: 0.7 },
  { tag: "tree", s: 1.2 }, { tag: "sedan", s: 1.3 }, { tag: "character", s: 1.6 }, { tag: "bathtub", s: 1.6 },
];

export const ModelTest: React.FC = () => {
  const ready = useFontsReady();
  return (
    <AbsoluteFill style={{ background: C.deepNight }}>
      {ready && (
        <ThreeCanvas orthographic width={1080} height={1920} flat dpr={1} camera={{ zoom: 40, position: [100, 80, 100], near: 1, far: 420 }}>
          <color attach="background" args={[C.deepNight]} />
          <fog attach="fog" args={[C.deepNight, 150, 270]} />
          <hemisphereLight args={["#74879C", "#0B0E12", 2.2]} />
          <directionalLight position={[14, 30, 22]} intensity={2.8} color="#B7C3D1" />
          <IsoCamera target={[0, 0, 0]} zoom={52} />
          <Box size={[26, 0.3, 30]} pos={[0, -0.15, 0]} color={C.concreteDark} />
          {ITEMS.map((it, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return <Model key={it.tag} tag={it.tag} pick={it.pick} scale={it.s} pos={[-8 + col * 8, 0, -11 + row * 7.5]} />;
          })}
        </ThreeCanvas>
      )}
    </AbsoluteFill>
  );
};
