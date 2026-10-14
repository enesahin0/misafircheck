// Çok basit low-poly insan figürleri: yüz detaysız, basit pivot hareketi (CLAUDE.md §2).
import React from "react";
import { C } from "./palette";
import { mat } from "./materials";
import { Box, Shadow } from "./primitives";
import type { ActorSample } from "../utils/actors";

export type Outfit = {
  jacket: string;
  trousers: string;
  skin: string;
  hair: string;
  scarf?: string;
  scale?: number;
};

// İnsan silüetlerinin giysisi / ölçeği bölümden bölüme DEĞİŞMEZ.
export const OUTFITS = {
  leyla: { jacket: C.amber, trousers: C.slate, skin: C.skin, hair: C.deepNight, scarf: C.bone, scale: 1 },
  mahir: { jacket: C.concrete, trousers: C.slateDark, skin: "#7B6659", hair: C.deepNight, scale: 1.05 },
  inspector0: { jacket: C.deepNight, trousers: C.deepNight, skin: C.deepNight, hair: C.deepNight, scale: 1.12 },
} satisfies Record<string, Outfit>;

const Limb: React.FC<{ len: number; w: number; color: string }> = ({ len, w, color }) => (
  <mesh position={[0, -len / 2, 0]} material={mat(color)}>
    <boxGeometry args={[w, len, w]} />
  </mesh>
);

export const Humanoid: React.FC<{
  outfit: Outfit;
  pose: ActorSample;
  frame: number;
  holdingFile?: boolean;
}> = ({ outfit, pose, frame, holdingFile }) => {
  const { sit, reach, hold, typing, moving, walkPhase, yaw } = pose;
  const sc = outfit.scale ?? 1;
  const swing = Math.sin(walkPhase) * 0.7 * moving;
  const breathe = Math.sin(frame / 18) * 0.012;
  const pelvisY = 0.95 - 0.45 * sit + Math.abs(Math.sin(walkPhase)) * 0.03 * moving;

  // bacaklar
  const thighL = -Math.PI / 2 * sit + swing * (1 - sit);
  const thighR = -Math.PI / 2 * sit - swing * (1 - sit);
  const shinL = (Math.PI / 2) * sit + Math.max(0, -swing) * 0.9 * (1 - sit);
  const shinR = (Math.PI / 2) * sit + Math.max(0, swing) * 0.9 * (1 - sit);

  // kollar: omuz (x dönüşü, negatif = ileri/yukarı), dirsek
  const typeJit = Math.sin(frame / 2.6) * 0.07 * typing;
  const typeJit2 = Math.sin(frame / 2.1 + 1) * 0.07 * typing;
  let armL = -swing * 0.9 * (1 - typing) - 1.0 * typing + typeJit - 0.7 * hold;
  let armR = swing * 0.9 * (1 - typing) - 1.0 * typing + typeJit2 - 0.7 * hold;
  armR = armR * (1 - reach) + -2.55 * reach;
  const elbowL = -0.95 * typing - 1.25 * hold - 0.15 * moving;
  const elbowR = -0.95 * typing - 1.25 * hold - 0.15 * moving * (1 - reach) - 0.3 * reach;

  return (
    <group position={[pose.x, 0, pose.z]} rotation={[0, pose.rot, 0]} scale={[sc, sc, sc]}>
      <Shadow pos={[0, 0, 0]} size={[0.9, 0.9]} opacity={0.4} />
      <group position={[0, pelvisY, 0]}>
        {/* bacaklar */}
        {[-0.1, 0.1].map((x, i) => (
          <group key={i} position={[x, 0, 0]} rotation={[i === 0 ? thighL : thighR, 0, 0]}>
            <Limb len={0.46} w={0.15} color={outfit.trousers} />
            <group position={[0, -0.46, 0]} rotation={[i === 0 ? shinL : shinR, 0, 0]}>
              <Limb len={0.46} w={0.13} color={outfit.trousers} />
              <Box size={[0.14, 0.08, 0.26]} pos={[0, -0.5, 0.06]} color={C.deepNight} />
            </group>
          </group>
        ))}
        {/* gövde */}
        <Box size={[0.4, 0.22, 0.23]} pos={[0, 0.06, 0]} color={outfit.trousers} />
        <group position={[0, 0.17 + breathe, 0]} rotation={[0.06 * sit * 0 - 0.08 * typing, 0, 0]}>
          <Box size={[0.44, 0.58, 0.26]} pos={[0, 0.29, 0]} color={outfit.jacket} />
          {outfit.scarf && <Box size={[0.3, 0.1, 0.3]} pos={[0, 0.62, 0]} color={outfit.scarf} />}
          {/* omuz + kollar */}
          {[-0.3, 0.3].map((x, i) => (
            <group key={i} position={[x, 0.52, 0]} rotation={[i === 0 ? armL : armR, 0, 0]}>
              <Limb len={0.3} w={0.1} color={outfit.jacket} />
              <group position={[0, -0.3, 0]} rotation={[i === 0 ? elbowL : elbowR, 0, 0]}>
                <Limb len={0.28} w={0.085} color={outfit.jacket} />
                <Box size={[0.09, 0.09, 0.09]} pos={[0, -0.31, 0]} color={outfit.skin} />
              </group>
            </group>
          ))}
          {/* baş */}
          <group position={[0, 0.78, 0]} rotation={[0, yaw, 0]}>
            <mesh position={[0, 0.0, 0]} material={mat(outfit.skin)}>
              <icosahedronGeometry args={[0.14, 0]} />
            </mesh>
            <mesh position={[0, 0.04, -0.03]} scale={[1.04, 0.9, 1.04]} material={mat(outfit.hair)}>
              <icosahedronGeometry args={[0.15, 0]} />
            </mesh>
            <mesh position={[0, 0.07, -0.17]} material={mat(outfit.hair)}>
              <icosahedronGeometry args={[0.07, 0]} />
            </mesh>
          </group>
        </group>
      </group>
      {holdingFile && (
        <group position={[0, pelvisY + 0.55 + 0.1 * (1 - hold), 0.32]}>
          <Box size={[0.3, 0.38, 0.03]} color={C.red} />
        </group>
      )}
    </group>
  );
};

export const Leyla: React.FC<{ pose: ActorSample; frame: number; holdingFile?: boolean }> = (p) => (
  <Humanoid outfit={OUTFITS.leyla} {...p} />
);
export const Mahir: React.FC<{ pose: ActorSample; frame: number }> = (p) => <Humanoid outfit={OUTFITS.mahir} {...p} />;
export const Inspector0: React.FC<{ pose: ActorSample; frame: number }> = (p) => (
  <Humanoid outfit={OUTFITS.inspector0} {...p} />
);
