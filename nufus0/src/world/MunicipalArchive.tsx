// Belediye binası: dış model + ona bağlı kesit (cutaway/dollhouse) arşiv iç mekânı.
// cutaway 0 → kapalı bina; 1 → üst katlar kalkmış, yakın iki duvar (güney+doğu) inmiş: oda maketi.
import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { C } from "./palette";
import { basic, glowTexture, mat } from "./materials";
import { BaseBox, Box, Cyl, Glow, Shadow } from "./primitives";
import { Building } from "./Apartment";
import { Leyla } from "./Characters";
import { MUNI, ROOM_FLOOR } from "./layout";
import { TERMINAL_H, TERMINAL_W, TerminalState, drawTerminal } from "./terminalScreen";
import { textTexture } from "./textTexture";
import { flicker, pulse } from "../utils/deterministic";
import { clamp, easeIn, smooth } from "../utils/time";
import type { ActorSample } from "../utils/actors";

const Y0 = ROOM_FLOOR;
const WALL_H = 5;
const HALF = MUNI.w / 2; // 8
const IN = 7.5; // iç yüzey

/* ------------------------------------------------------------------ terminal ekranı */
const TerminalScreen: React.FC<{ state: TerminalState }> = ({ state }) => {
  const { canvas, tex } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = TERMINAL_W;
    c.height = TERMINAL_H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return { canvas: c, tex: t };
  }, []);
  useLayoutEffect(() => {
    drawTerminal(canvas.getContext("2d")!, state);
    tex.needsUpdate = true;
  });
  return (
    <mesh>
      <planeGeometry args={[1.28, 0.96]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

/* ------------------------------------------------------------------ mobilyalar */
const Cabinet: React.FC<{ z: number; open?: number }> = ({ z, open = 0 }) => (
  <group position={[-IN + 0.5, Y0, z]}>
    <BaseBox size={[1.0, 3.4, 1.5]} color={C.concrete} />
    {[0, 1, 2, 3].map((i) => {
      const out = i === 1 ? open * 0.55 : 0;
      return (
        <group key={i} position={[0.5 + out, 0.55 + i * 0.78, 0]}>
          <Box size={[0.06, 0.62, 1.3]} color={C.concreteLight} />
          <Box size={[0.07, 0.06, 0.4]} pos={[0.05, -0.1, 0]} color={C.amber} />
          <Box size={[0.02, 0.17, 0.55]} pos={[0.04, 0.16, 0]} color={C.paper} />
          {i === 1 && open > 0.05 && <Box size={[0.9 * open, 0.5, 1.2]} pos={[-0.45 * open, 0, 0]} color={C.concreteDark} />}
        </group>
      );
    })}
    <Shadow pos={[0.4, 0, 0]} size={[2.2, 2.4]} opacity={0.3} />
  </group>
);

const RedFile: React.FC<{ pos: [number, number, number]; rot?: number }> = ({ pos, rot = 0 }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <Box size={[0.62, 0.05, 0.84]} color={C.red} />
    <Box size={[0.58, 0.02, 0.8]} pos={[0, 0.035, 0]} color={C.paper} />
    <Box size={[0.2, 0.03, 0.04]} pos={[0.12, 0.052, -0.15]} color={C.red} />
  </group>
);

const Desk: React.FC<{ frame: number; fileOnDesk: boolean }> = ({ frame, fileOnDesk }) => (
  <group position={[0.5, Y0, -2.2]}>
    <Shadow pos={[0, 0, 0.1]} size={[4.2, 2.6]} opacity={0.35} />
    <Box size={[3.4, 0.1, 1.6]} pos={[0, 0.85, 0]} color={C.concreteLight} />
    {[[-1.6, -0.7], [1.6, -0.7], [-1.6, 0.7], [1.6, 0.7]].map(([x, z], i) => (
      <BaseBox key={i} size={[0.1, 0.85, 0.1]} pos={[x, 0, z]} color={C.concreteDark} />
    ))}
    <BaseBox size={[0.9, 0.7, 1.4]} pos={[1.15, 0.12, 0]} color={C.concrete} />
    {/* kâğıtlar */}
    <BaseBox size={[0.8, 0.12, 0.6]} pos={[-1.1, 0.9, 0.1]} color={C.paper} />
    <BaseBox size={[0.7, 0.07, 0.55]} pos={[-1.05, 1.02, 0.12]} color={C.bone} />
    <BaseBox size={[0.55, 0.03, 0.75]} pos={[-0.3, 0.9, 0.35]} color={C.paper} />
    {fileOnDesk && <RedFile pos={[0.35, 0.98, 0.4]} rot={0.15} />}
    {/* masa lambası */}
    <group position={[1.35, 0.9, 0.55]}>
      <Cyl r={0.25} h={0.06} color={C.concreteDark} seg={6} />
      <Box size={[0.05, 0.9, 0.05]} pos={[0, 0.5, 0]} color={C.concreteLight} rot={[0, 0, 0.15]} />
      <Box size={[0.5, 0.12, 0.3]} pos={[-0.12, 0.98, 0.0]} color={C.concreteDark} rot={[0, 0, 0.1]} />
      <mesh position={[-0.12, 0.9, 0]}>
        <boxGeometry args={[0.38, 0.03, 0.22]} />
        <meshBasicMaterial color={new THREE.Color(C.amberGlow).multiplyScalar(0.7 + 0.3 * flicker(frame, 31, 0.15))} toneMapped={false} />
      </mesh>
      <Glow pos={[-0.12, 0.05, 0.1]} size={[3.2, 3.2]} opacity={0.4} color={C.amberGlow} />
    </group>
  </group>
);

const Chair: React.FC<{ x: number; z: number; rot?: number }> = ({ x, z, rot = 0 }) => (
  <group position={[x, Y0, z]} rotation={[0, rot, 0]}>
    <Box size={[0.75, 0.09, 0.75]} pos={[0, 0.55, 0]} color={C.concreteDark} />
    <Box size={[0.75, 0.85, 0.09]} pos={[0, 1.0, -0.36]} color={C.concreteDark} />
    <Cyl r={0.05} h={0.5} color={C.concreteLight} />
    <Cyl r={0.4} rTop={0.4} h={0.05} color={C.concreteLight} seg={5} />
  </group>
);

const TerminalDesk: React.FC<{ state: TerminalState }> = ({ state }) => (
  <group position={[2.9, Y0, -6.4]}>
    <Shadow pos={[0, 0, 0.2]} size={[4, 2.6]} opacity={0.35} />
    <Box size={[3.2, 0.1, 1.3]} pos={[0, 0.9, 0]} color={C.concreteLight} />
    {[[-1.4, -0.5], [1.4, -0.5], [-1.4, 0.5], [1.4, 0.5]].map(([x, z], i) => (
      <BaseBox key={i} size={[0.1, 0.9, 0.1]} pos={[x, 0, z]} color={C.concreteDark} />
    ))}
    <group position={[0, 0.95, -0.1]} rotation={[0, 0.5, 0]}>
      <BaseBox size={[1.7, 1.45, 1.1]} color={C.concrete} />
      <BaseBox size={[1.5, 0.15, 1.25]} pos={[0, 1.45, 0.05]} color={C.concreteDark} />
      <Box size={[1.46, 1.1, 0.06]} pos={[0, 0.78, 0.56]} color={C.deepNight} />
      <group position={[0, 0.78, 0.6]}>
        <TerminalScreen state={state} />
      </group>
      <Glow pos={[0, 0.78, 0.7]} size={[2.8, 2.4]} opacity={0.22} color={C.bone} face="z" />
      <BaseBox size={[1.2, 0.07, 0.42]} pos={[0, -0.04, 1.2]} color={C.concreteDark} />
    </group>
  </group>
);

const Door0: React.FC<{ alert: number; frame: number }> = ({ alert, frame }) => (
  <group position={[-3.3, Y0, -IN + 0.1]}>
    <BaseBox size={[2.3, 3.7, 0.16]} color={C.concreteDark} />
    <BaseBox size={[1.9, 3.4, 0.14]} pos={[0, 0, 0.1]} color={C.concrete} />
    <Box size={[0.08, 0.35, 0.1]} pos={[0.7, 1.5, 0.22]} color={C.amber} />
    {/* 0 plakası: gerçek geometri (torus) */}
    <mesh position={[0, 2.35, 0.2]} scale={[0.75, 1.15, 0.4]} material={basic(C.bone)}>
      <torusGeometry args={[0.45, 0.11, 4, 10]} />
    </mesh>
    <mesh position={[0, 3.8, 0.12]}>
      <boxGeometry args={[0.28, 0.14, 0.1]} />
      <meshBasicMaterial color={new THREE.Color(C.red).multiplyScalar(0.3 + 0.7 * alert * pulse(frame, 12))} toneMapped={false} />
    </mesh>
    <Shadow pos={[0, 0, 1]} size={[2.6, 2]} opacity={0.3} />
  </group>
);

const Beacon: React.FC<{ alert: number; frame: number }> = ({ alert, frame }) => {
  const k = alert * (0.45 + 0.55 * pulse(frame, 18));
  return (
    <group position={[-IN + 0.5, Y0 + 3.4, -5.2]}>
      <Cyl r={0.28} h={0.18} color={C.concreteDark} seg={6} />
      <mesh position={[0, 0.38, 0]}>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshBasicMaterial color={new THREE.Color(C.redDark).lerp(new THREE.Color("#F0555D"), alert * (0.4 + 0.6 * pulse(frame, 18)))} toneMapped={false} />
      </mesh>
      <Glow pos={[0, 0.4, 0]} size={[3.6, 3.6]} opacity={0.75 * k} color={C.red} face="z" />
      {/* dönen ışın */}
      <group position={[0, 0.2, 0]} rotation={[0, (frame * 0.09) % (Math.PI * 2), 0]}>
        <mesh position={[3.4, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.8, 1.6]} />
          <meshBasicMaterial map={glowTexture()} color={C.red} transparent opacity={0.42 * alert} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <Glow pos={[2.2, -Y0 - 3.35, 0]} size={[9, 9]} opacity={0.14 * k} color={C.red} />
    </group>
  );
};

const CityMapBoard: React.FC = () => {
  const tex = textTexture("citymap", 512, 320, (g, w, h) => {
    g.fillStyle = "#B9B3A3";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#6C7378";
    g.lineWidth = 3;
    for (let x = 32; x < w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 32; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.fillStyle = "#39444B";
    for (let i = 0; i < 18; i++) {
      const bx = 20 + (i % 6) * 80 + (i % 3) * 6;
      const by = 18 + Math.floor(i / 6) * 96 + (i % 2) * 8;
      g.fillRect(bx, by, 44, 34);
    }
    // 14. Sokak boşluğu
    g.fillStyle = "#0B0E12";
    g.fillRect(332, 150, 108, 130);
    g.strokeStyle = "#BD373F";
    g.lineWidth = 4;
    g.strokeRect(332, 150, 108, 130);
    g.fillStyle = "#BD373F";
    g.font = '700 26px "IBM Plex Mono", monospace';
    g.fillText("14", 360, 220);
  });
  return (
    <group position={[-5.4, Y0 + 2.7, -IN + 0.1]}>
      <Box size={[2.9, 1.9, 0.08]} color={C.concreteDark} />
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.6, 1.62]} />
        <meshBasicMaterial map={tex} toneMapped={false} color="#9A978C" />
      </mesh>
    </group>
  );
};

const WallClock: React.FC = () => (
  // Saat sonsuza dek 03.17'de takılı (gizli ipucu: CLOCK_0317)
  <group position={[-IN + 0.12, Y0 + 4.1, 0.2]} rotation={[0, Math.PI / 2, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} material={mat(C.bone)}>
      <cylinderGeometry args={[0.55, 0.55, 0.1, 12]} />
    </mesh>
    <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={mat(C.deepNight)}>
      <cylinderGeometry args={[0.48, 0.48, 0.04, 12]} />
    </mesh>
    {/* 03:17 → saat kolu ~ 98.5°, dakika kolu 102° (saat yönünde, 12'den) */}
    <group position={[0, 0, 0.1]} rotation={[0, 0, -(98.5 * Math.PI) / 180]}>
      <Box size={[0.07, 0.28, 0.03]} pos={[0, 0.14, 0]} color={C.bone} />
    </group>
    <group position={[0, 0, 0.11]} rotation={[0, 0, -(102 * Math.PI) / 180]}>
      <Box size={[0.05, 0.4, 0.03]} pos={[0, 0.2, 0]} color={C.red} />
    </group>
  </group>
);

const Fluorescent: React.FC<{ x: number; frame: number; seed: number }> = ({ x, frame, seed }) => {
  const f = flicker(frame, seed, 0.2);
  const col = new THREE.Color("#D9C79B").multiplyScalar(0.45 + 0.55 * f);
  return (
    <group position={[x, Y0 + 4.5, -IN + 0.28]}>
      <Box size={[3.3, 0.16, 0.26]} color={C.concreteDark} />
      <mesh position={[0, -0.06, 0.04]}>
        <boxGeometry args={[3.1, 0.1, 0.16]} />
        <meshBasicMaterial color={col} toneMapped={false} />
      </mesh>
      <Glow pos={[0, -0.8, 0.2]} size={[7.5, 4]} opacity={0.22 * f} color="#D9C79B" face="z" />
    </group>
  );
};

const Boxes: React.FC = () => (
  <group>
    <BaseBox size={[1.1, 0.7, 0.8]} pos={[5.7, Y0, 3.2]} color={C.paper} />
    <BaseBox size={[1.0, 0.6, 0.75]} pos={[5.75, Y0 + 0.7, 3.25]} color={C.concreteLight} />
    <BaseBox size={[1.0, 0.65, 0.8]} pos={[5.6, Y0, 4.3]} color={C.concreteLight} />
    <BaseBox size={[0.7, 0.9, 0.7]} pos={[-5.6, Y0, 4.8]} color={C.concreteDark} />
    <Shadow pos={[5.7, Y0, 3.7]} size={[2.2, 3]} opacity={0.25} />
    {/* raf */}
    <group position={[6.4, Y0, -IN + 0.5]}>
      <BaseBox size={[2.0, 3.2, 0.8]} color={C.concreteDark} />
      {[0.8, 1.7, 2.6].map((y, i) => (
        <group key={i}>
          <BaseBox size={[1.9, 0.07, 0.85]} pos={[0, y, 0.02]} color={C.concrete} />
          <BaseBox size={[0.55, 0.5, 0.6]} pos={[-0.5 + (i % 2) * 0.5, y + 0.07, 0.05]} color={i === 1 ? C.paper : C.concreteLight} />
          <BaseBox size={[0.45, 0.42, 0.6]} pos={[0.35, y + 0.07, 0.05]} color={C.paper} />
        </group>
      ))}
    </group>
  </group>
);

const InteriorFloor: React.FC = () => (
  <group>
    <Box size={[16, 0.3, 16]} pos={[0, 0.15, 0]} color={C.concreteDark} />
    <Box size={[15, 0.02, 15]} pos={[0, Y0 + 0.005, 0]} color="#303A40" />
    {Array.from({ length: 7 }).map((_, i) => (
      <group key={i}>
        <Box size={[15, 0.012, 0.05]} pos={[0, Y0 + 0.015, -6 + i * 2]} color={C.slateDark} />
        <Box size={[0.05, 0.012, 15]} pos={[-6 + i * 2, Y0 + 0.015, 0]} color={C.slateDark} />
      </group>
    ))}
    {/* halı */}
    <Box size={[4.6, 0.03, 3]} pos={[0.5, Y0 + 0.02, -1.2]} color={C.slate} />
  </group>
);

/* ------------------------------------------------------------------ dış duvarlar */
const WALL = C.slateLight;
const BackWalls: React.FC = () => (
  <group>
    <BaseBox size={[16, WALL_H, 0.5]} pos={[0, 0, -HALF + 0.25]} color={WALL} />
    <BaseBox size={[0.5, WALL_H, 15.5]} pos={[-HALF + 0.25, 0, 0.25]} color={WALL} />
    {/* lambri bandı + süpürgelik */}
    <BaseBox size={[15, 0.35, 0.08]} pos={[0.2, Y0, -IN + 0.04]} color={C.concreteDark} />
    <BaseBox size={[0.08, 0.35, 15]} pos={[-IN + 0.04, Y0, 0.2]} color={C.concreteDark} />
    <BaseBox size={[15, 0.12, 0.1]} pos={[0.2, Y0 + 1.6, -IN + 0.05]} color={C.slate} />
    <BaseBox size={[0.1, 0.12, 15]} pos={[-IN + 0.05, Y0 + 1.6, 0.2]} color={C.slate} />
    <BaseBox size={[16.2, 0.14, 0.7]} pos={[0, WALL_H, -HALF + 0.3]} color={C.concreteLight} />
    <BaseBox size={[0.7, 0.14, 15.7]} pos={[-HALF + 0.3, WALL_H, 0.3]} color={C.concreteLight} />
  </group>
);

const signTex = () =>
  textTexture("muni-sign", 640, 110, (g, w, h) => {
    g.fillStyle = "#14191F";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#E0DDD4";
    g.font = '700 70px "Barlow Condensed", sans-serif';
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("ŞEHİR_0 BELEDİYESİ", w / 2, h / 2 + 4);
  });
const archiveTex = () =>
  textTexture("muni-archive", 300, 90, (g, w, h) => {
    g.fillStyle = "#967753";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#0B0E12";
    g.font = '700 58px "Barlow Condensed", sans-serif';
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("ARŞİV", w / 2, h / 2 + 3);
  });

const NearWalls: React.FC<{ drop: number }> = ({ drop }) => {
  if (drop >= 0.995) return null;
  const y = -drop * (WALL_H + 0.6);
  return (
    <group position={[0, y, 0]}>
      {/* güney (giriş cephesi) */}
      <BaseBox size={[16, WALL_H, 0.5]} pos={[0, 0, HALF - 0.25]} color={WALL} />
      {/* doğu */}
      <BaseBox size={[0.5, WALL_H, 15.0]} pos={[HALF - 0.25, 0, 0]} color={WALL} />
      <BaseBox size={[16.2, 0.14, 0.7]} pos={[0, WALL_H, HALF - 0.3]} color={C.concreteLight} />
      <BaseBox size={[0.7, 0.14, 15.7]} pos={[HALF - 0.3, WALL_H, -0.3]} color={C.concreteLight} />
      {/* güney pencereler */}
      {[-5.6, -3.2, 3.2, 5.6].map((x) => (
        <Box key={x} size={[1.5, 2.2, 0.1]} pos={[x, Y0 + 2.4, HALF + 0.03]} color={C.windowDark} />
      ))}
      {/* doğu pencereler */}
      {[-5, -2.4, 0.2, 2.8, 5.4].map((z) => (
        <Box key={z} size={[0.1, 2.2, 1.4]} pos={[HALF + 0.03, Y0 + 2.4, z]} color={C.windowDark} />
      ))}
      {/* giriş */}
      <Box size={[2.4, 3.0, 0.14]} pos={[0, Y0 + 1.5, HALF + 0.05]} color={C.windowDark} />
      <Box size={[3.4, 0.2, 1.6]} pos={[0, Y0 + 3.3, HALF + 0.8]} color={C.concreteDark} />
      <mesh position={[0, Y0 + 3.9, HALF + 0.1]}>
        <boxGeometry args={[5.6, 0.85, 0.12]} />
        <meshBasicMaterial map={signTex()} toneMapped={false} />
      </mesh>
      <mesh position={[3.6, Y0 + 2.0, HALF + 0.12]}>
        <boxGeometry args={[1.1, 0.34, 0.08]} />
        <meshBasicMaterial map={archiveTex()} toneMapped={false} />
      </mesh>
    </group>
  );
};

const Steps: React.FC = () => (
  <group>
    <BaseBox size={[3.4, 0.12, 1.2]} pos={[0, 0, HALF + 0.9]} color={C.concrete} />
    <BaseBox size={[3.2, 0.12, 0.9]} pos={[0, 0.12, HALF + 0.85]} color={C.concreteLight} />
    <BaseBox size={[3.0, 0.12, 0.6]} pos={[0, 0.24, HALF + 0.75]} color={C.concrete} />
    <Shadow pos={[0, 0, 0]} size={[18.6, 18.6]} opacity={0.4} />
  </group>
);

/* ------------------------------------------------------------------ üst katlar */
const upperSpec = {
  id: "MUNI-UP",
  x: 0,
  z: 0,
  w: 16,
  d: 16,
  floors: 2,
  floorH: 3.4,
  roof: "antenna" as const,
  seed: 77,
  tone: C.slate,
  door: false,
  // Belediyenin üçüncü katında sık sık yanan tek amber pencere (AMBER_WINDOW_3F)
  lit: [{ floor: 1, face: "z" as const, col: 4, survive: false, seed: 5 }],
};

const Upper: React.FC<{ lift: number; frame: number }> = ({ lift, frame }) => {
  if (lift >= 0.995) return null;
  const dy = easeIn(lift) * 90;
  const beat = Math.floor(frame / 24) % 2 === 0;
  return (
    <group position={[0, WALL_H + 0.35 + dy, 0]}>
      <Building spec={upperSpec} frame={frame} noShadow />
      <mesh position={[0, 2 * 3.4 + 3.45, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color={beat ? "#F0555D" : C.redDark} toneMapped={false} />
      </mesh>
      <Glow pos={[0, 2 * 3.4 + 3.45, 0]} size={[3, 3]} opacity={beat ? 0.7 : 0.1} color={C.red} face="z" />
    </group>
  );
};

/* ------------------------------------------------------------------ ana bileşen */
export type MunicipalProps = {
  frame: number;
  cutaway: number; // 0..1
  leyla: ActorSample;
  holdingFile: boolean;
  fileOnDesk: boolean;
  terminal: TerminalState;
  redAlert: number;
  drawerOpen: number;
};

export const Municipality: React.FC<MunicipalProps> = ({
  frame, cutaway, leyla, holdingFile, fileOnDesk, terminal, redAlert, drawerOpen,
}) => {
  const lift = smooth(clamp(cutaway / 0.55));
  const drop = smooth(clamp((cutaway - 0.35) / 0.65));
  const interiorVisible = cutaway > 0.3;
  return (
    <group position={[MUNI.x, 0, MUNI.z]}>
      <InteriorFloor />
      <BackWalls />
      <NearWalls drop={drop} />
      <Steps />
      <Upper lift={lift} frame={frame} />
      {interiorVisible && (
        <group>
          {[-5.2, -3.4, -1.6, 0.2, 2.0].map((z, i) => (
            <Cabinet key={z} z={z} open={i === 1 ? drawerOpen : 0} />
          ))}
          <Door0 alert={redAlert} frame={frame} />
          <CityMapBoard />
          <WallClock />
          <Fluorescent x={-2.4} frame={frame} seed={61} />
          <Fluorescent x={3.4} frame={frame} seed={62} />
          <Desk frame={frame} fileOnDesk={fileOnDesk} />
          <Chair x={0.5} z={-3.55} />
          <TerminalDesk state={terminal} />
          <Boxes />
          <Beacon alert={redAlert} frame={frame} />
          <group position={[0, Y0, 0]}>
            <Leyla pose={leyla} frame={frame} holdingFile={holdingFile} />
          </group>
        </group>
      )}
      {/* iç mekân ışıkları — sınırlı sayıda (3), yoğunluğu kesite bağlı */}
      <pointLight position={[0.4, Y0 + 2.2, -1.0]} color="#D9B070" intensity={18 * smooth(cutaway)} distance={16} decay={1.6} />
      <pointLight position={[0.5, Y0 + 4.2, -5.0]} color="#D9C79B" intensity={22 * smooth(cutaway)} distance={18} decay={1.6} />
      <pointLight position={[-IN + 1.4, Y0 + 3.8, -5.2]} color="#E24A52" intensity={26 * redAlert * pulse(frame, 18) * smooth(cutaway)} distance={14} decay={1.6} />
    </group>
  );
};

