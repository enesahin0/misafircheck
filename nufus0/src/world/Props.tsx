// Tekrar kullanılabilir şehir objeleri: ağaç, araç, lamba, hoparlör, durak, kedi, çöp kutusu...
import React from "react";
import * as THREE from "three";
import { C, T } from "./palette";
import { basic, mat } from "./materials";
import { BaseBox, Box, Cone, Cyl, Glow, Shadow, V3 } from "./primitives";
import { flicker, pulse, rand } from "../utils/deterministic";
import { lerp } from "../utils/time";
import { textTexture } from "./textTexture";

export const Tree: React.FC<{ pos: V3; seed?: number; scale?: number; kind?: "cone" | "box" }> = ({
  pos,
  seed = 1,
  scale = 1,
  kind = "cone",
}) => {
  const k = scale * (0.85 + 0.3 * rand(seed, 1));
  return (
    <group position={pos} scale={[k, k, k]} rotation={[0, rand(seed, 2) * 3, 0]}>
      <BaseBox size={[0.28, 1.1, 0.28]} pos={[0, 0, 0]} color={C.concreteDark} />
      {kind === "cone" ? (
        <>
          <Cone r={1.35} h={2.3} pos={[0, 0.9, 0]} color={T.tree} />
          <Cone r={0.95} h={1.9} pos={[0, 2.4, 0]} color={T.treeDark} />
        </>
      ) : (
        <>
          <BaseBox size={[2.0, 1.7, 2.0]} pos={[0, 1.0, 0]} color={T.tree} />
          <BaseBox size={[1.3, 1.1, 1.3]} pos={[0, 2.6, 0]} color={T.treeDark} />
        </>
      )}
      <Shadow pos={[0, 0, 0]} size={[2.6, 2.6]} opacity={0.35} />
    </group>
  );
};

export const Car: React.FC<{
  pos: V3;
  rotY?: number;
  color?: string;
  roof?: string;
  lights?: boolean;
}> = ({ pos, rotY = 0, color = T.carGrey, roof, lights = false }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Shadow pos={[0, 0, 0]} size={[2.7, 5.0]} opacity={0.5} />
    <BaseBox size={[1.9, 0.75, 4.2]} pos={[0, 0.35, 0]} color={color} />
    <BaseBox size={[1.7, 0.65, 2.2]} pos={[0, 1.1, -0.2]} color={roof ?? color} />
    <BaseBox size={[1.5, 0.35, 0.05]} pos={[0, 1.25, 0.92]} color={C.windowDark} />
    {[
      [-0.95, 1.3],
      [0.95, 1.3],
      [-0.95, -1.3],
      [0.95, -1.3],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]} material={mat(C.deepNight)}>
        <cylinderGeometry args={[0.38, 0.38, 0.3, 8]} />
      </mesh>
    ))}
    <mesh position={[-0.6, 0.55, 2.11]} material={basic(lights ? "#D9C79B" : "#3A3F44")}>
      <boxGeometry args={[0.35, 0.18, 0.05]} />
    </mesh>
    <mesh position={[0.6, 0.55, 2.11]} material={basic(lights ? "#D9C79B" : "#3A3F44")}>
      <boxGeometry args={[0.35, 0.18, 0.05]} />
    </mesh>
    <mesh position={[-0.6, 0.55, -2.11]} material={basic(C.redDark)}>
      <boxGeometry args={[0.35, 0.16, 0.05]} />
    </mesh>
    <mesh position={[0.6, 0.55, -2.11]} material={basic(C.redDark)}>
      <boxGeometry args={[0.35, 0.16, 0.05]} />
    </mesh>
  </group>
);

/** Sürekli tekrarlayan KIRMIZI küçük araba (RED_CAR ipucu). */
export const RedCar: React.FC<{ pos: V3; rotY: number; frame: number }> = ({ pos, rotY, frame }) => (
  <group>
    <Car pos={pos} rotY={rotY} color={C.red} roof={C.redDark} lights />
    {/* ön far parıltısı */}
    <Glow
      pos={[pos[0] + Math.sin(rotY) * 4, 0.1, pos[2] + Math.cos(rotY) * 4]}
      size={5}
      opacity={0.18 + 0.04 * pulse(frame, 20)}
      color="#D9C79B"
    />
  </group>
);

export const StreetLamp: React.FC<{
  pos: V3;
  rotY?: number;
  frame: number;
  seed?: number;
  broken?: number; // 0 sağlam .. 1 çok bozuk
  on?: number;
}> = ({ pos, rotY = 0, frame, seed = 1, broken = 0, on = 1 }) => {
  const f = broken > 0 ? flicker(frame, seed, broken) : 1;
  const lvl = f * on;
  const lamp = new THREE.Color(C.amberGlow).multiplyScalar(0.25 + 0.75 * lvl);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Cyl r={0.11} h={5.4} color={C.concreteLight} seg={6} />
      <BaseBox size={[0.4, 0.3, 0.4]} pos={[0, 0, 0]} color={C.concreteDark} />
      <Box size={[0.1, 0.1, 1.5]} pos={[0, 5.35, 0.65]} color={C.concreteLight} />
      <Box size={[0.55, 0.14, 0.9]} pos={[0, 5.3, 1.35]} color={C.concreteDark} />
      <mesh position={[0, 5.2, 1.35]}>
        <boxGeometry args={[0.45, 0.06, 0.75]} />
        <meshBasicMaterial color={lamp} toneMapped={false} />
      </mesh>
      <Glow pos={[0, 0.06, 1.35]} size={8} opacity={0.42 * lvl} color={C.amberGlow} />
      <Glow pos={[0, 5.0, 1.35]} size={2.4} opacity={0.35 * lvl} color={C.amberGlow} face="z" />
    </group>
  );
};

/** Belediye hoparlör direği: 03.17 anonsu bunun üzerinden yapılır. */
export const SpeakerPole: React.FC<{ pos: V3; rotY?: number; red: number; frame: number }> = ({
  pos,
  rotY = 0,
  red,
  frame,
}) => {
  const beat = red > 0 ? 0.55 + 0.45 * pulse(frame, 14) : 0;
  const lampCol = new THREE.Color(C.redDark).lerp(new THREE.Color("#E24A52"), red * beat);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Cyl r={0.14} h={6.4} color={C.concreteLight} seg={6} />
      <BaseBox size={[0.5, 0.35, 0.5]} color={C.concreteDark} />
      <Box size={[1.9, 0.12, 0.12]} pos={[0, 5.5, 0]} color={C.concreteLight} />
      {[-0.85, 0.85].map((x, i) => (
        <group key={i} position={[x, 5.5, 0.35]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={mat(C.concrete)} position={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.38, 0.12, 0.8, 7]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={mat(C.deepNight)} position={[0, 0, 0.62]}>
            <cylinderGeometry args={[0.3, 0.3, 0.04, 7]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 6.55, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial color={lampCol} toneMapped={false} />
      </mesh>
      <Glow pos={[0, 6.55, 0]} size={4.2} opacity={0.7 * red * beat} color={C.red} face="z" />
      <Glow pos={[0, 0.06, 0]} size={7} opacity={0.35 * red * beat} color={C.red} />
    </group>
  );
};

export const BusStop: React.FC<{ pos: V3; rotY?: number }> = ({ pos, rotY = 0 }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Shadow pos={[0, 0, 0]} size={[4.2, 2.6]} opacity={0.4} />
    <BaseBox size={[3.4, 0.14, 1.7]} pos={[0, 2.5, 0]} color={C.concreteDark} />
    <BaseBox size={[0.12, 2.5, 0.12]} pos={[-1.6, 0, -0.7]} color={C.concreteLight} />
    <BaseBox size={[0.12, 2.5, 0.12]} pos={[1.6, 0, -0.7]} color={C.concreteLight} />
    <mesh position={[0, 1.3, -0.72]} material={mat(C.slateDark, { emissive: "#1B2A33", ei: 0.4 })}>
      <boxGeometry args={[3.1, 2.1, 0.06]} />
    </mesh>
    <BaseBox size={[2.4, 0.12, 0.55]} pos={[0, 0.55, -0.35]} color={C.concrete} />
    <BaseBox size={[0.1, 0.55, 0.1]} pos={[-1.0, 0, -0.35]} color={C.concreteDark} />
    <BaseBox size={[0.1, 0.55, 0.1]} pos={[1.0, 0, -0.35]} color={C.concreteDark} />
    {/* durak tabelası */}
    <Cyl r={0.06} h={3.3} pos={[2.4, 0, 0.3]} color={C.concreteLight} />
    <BaseBox size={[0.7, 0.7, 0.08]} pos={[2.4, 3.1, 0.3]} color={C.amber} />
  </group>
);

export const TrashBin: React.FC<{ pos: V3; frame: number; rotY?: number }> = ({ pos, frame, rotY = 0 }) => {
  const lid = Math.pow(Math.max(0, Math.sin(frame / 47 + 1.2)), 8) * 0.45;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Shadow pos={[0, 0, 0]} size={[1.6, 1.6]} opacity={0.4} />
      <Cyl r={0.5} rTop={0.42} h={1.05} color={C.concrete} seg={8} />
      <group position={[0.4, 1.08, 0]} rotation={[0, 0, lid]}>
        <mesh position={[-0.4, 0.04, 0]} material={mat(C.concreteLight)}>
          <cylinderGeometry args={[0.52, 0.52, 0.1, 8]} />
        </mesh>
      </group>
    </group>
  );
};

export const Cat: React.FC<{ pos: V3; rotY?: number; frame: number }> = ({ pos, rotY = 0, frame }) => {
  const tail = Math.sin(frame / 22) * 0.35;
  const blink = Math.floor(frame / 3) % 71 === 0;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <BaseBox size={[0.38, 0.42, 0.58]} pos={[0, 0, 0]} color="#171C21" />
      <BaseBox size={[0.3, 0.28, 0.3]} pos={[0, 0.4, 0.28]} color="#171C21" />
      <mesh position={[-0.1, 0.78, 0.32]} material={mat("#171C21")}>
        <coneGeometry args={[0.07, 0.16, 3]} />
      </mesh>
      <mesh position={[0.1, 0.78, 0.32]} material={mat("#171C21")}>
        <coneGeometry args={[0.07, 0.16, 3]} />
      </mesh>
      {!blink &&
        [-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0.58, 0.44]} material={basic(C.amberGlow)}>
            <boxGeometry args={[0.05, 0.05, 0.02]} />
          </mesh>
        ))}
      <group position={[0, 0.08, -0.3]} rotation={[0.3, tail, 0]}>
        <Box size={[0.08, 0.08, 0.5]} pos={[0, 0, -0.25]} color="#171C21" />
      </group>
    </group>
  );
};

export const SteamVent: React.FC<{ pos: V3; frame: number; seed?: number }> = ({ pos, frame, seed = 3 }) => (
  <group position={pos}>
    <Cyl r={0.6} h={0.12} color={C.concreteDark} seg={8} />
    {Array.from({ length: 7 }).map((_, i) => {
      const t = ((frame / 110 + i / 7 + rand(seed, 0)) % 1 + 1) % 1;
      const s = 0.35 + t * 1.15;
      const drift = Math.sin(t * 5 + i) * 0.3;
      return (
        <mesh key={i} position={[drift, 0.3 + t * 4.2, drift * 0.5]} scale={[s, s, s]}>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshBasicMaterial color="#8E999E" transparent opacity={(1 - t) * 0.22} depthWrite={false} toneMapped={false} />
        </mesh>
      );
    })}
  </group>
);

/** "14. SOKAK" tabelası — silinen sokakla birlikte gerçekten kaybolur. */
export const StreetSign: React.FC<{ pos: V3; label: string; rotY?: number }> = ({ pos, label, rotY = Math.PI / 4 }) => {
  const tex = textTexture(`sign:${label}`, 512, 160, (g, w, h) => {
    g.fillStyle = "#1E252D";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#E0DDD4";
    g.lineWidth = 8;
    g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = "#E0DDD4";
    g.font = '700 92px "Barlow Condensed", sans-serif';
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(label, w / 2, h / 2 + 4);
  });
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Cyl r={0.07} h={3.6} color={C.concreteLight} seg={6} />
      <mesh position={[0, 3.35, 0.06]}>
        <boxGeometry args={[1.9, 0.6, 0.06]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.35, -0.0]} material={mat(C.deepNight)}>
        <boxGeometry args={[1.96, 0.66, 0.03]} />
      </mesh>
    </group>
  );
};

export const lerpPos = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
