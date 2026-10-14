// Parametrik düşük poligon bina. Katlar tek tek kapanabilir → "silinme" efekti.
import React, { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { C } from "./palette";
import { basic, mat } from "./materials";
import { BaseBox, Box, Cyl, Glow, Shadow, V3 } from "./primitives";
import { flicker, rand } from "../utils/deterministic";
import { invLerp } from "../utils/time";

export type LitWindow = {
  floor: number;
  face: "x" | "z";
  col: number;
  /** Bina silindiğinde pencere havada kalır (içeridekiler). */
  survive?: boolean;
  people?: number;
  seed?: number;
};

export type RoofKind = "flat" | "tank" | "antenna" | "ac" | "slant";

export type BuildingSpec = {
  id: string;
  x: number;
  z: number;
  w: number; // x boyutu
  d: number; // z boyutu
  floors: number;
  floorH?: number;
  tone?: string;
  roof?: RoofKind;
  lit?: LitWindow[];
  seed?: number;
  /** Silinme penceresi (global erase ilerlemesinin bu aralığında silinir) */
  eraseWindow?: [number, number];
  door?: boolean;
};

export const FLOOR_H = 3.1;
const WIN_W = 1.0;
const WIN_H = 1.4;

const winPos = (spec: BuildingSpec, face: "x" | "z", col: number, cols: number, floor: number): { p: V3; s: V3 } => {
  const fh = spec.floorH ?? FLOOR_H;
  const y = floor * fh + fh * 0.58;
  if (face === "z") {
    return {
      p: [spec.x - spec.w / 2 + ((col + 0.5) * spec.w) / cols, y, spec.z + spec.d / 2 + 0.03],
      s: [WIN_W, WIN_H, 0.08],
    };
  }
  return {
    p: [spec.x + spec.w / 2 + 0.03, y, spec.z - spec.d / 2 + ((col + 0.5) * spec.d) / cols],
    s: [0.08, WIN_H, WIN_W],
  };
};

export const windowCols = (spec: BuildingSpec, face: "x" | "z") =>
  Math.max(1, Math.floor((face === "z" ? spec.w : spec.d) / 2.4));

/** Bir katın karanlık pencerelerini tek geometride birleştirir. */
const useDarkWindows = (spec: BuildingSpec, floor: number) =>
  useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    (["x", "z"] as const).forEach((face) => {
      const cols = windowCols(spec, face);
      for (let c = 0; c < cols; c++) {
        const isLit = spec.lit?.some((l) => l.floor === floor && l.face === face && l.col === c);
        if (isLit) continue;
        const { p, s } = winPos(spec, face, c, cols, floor);
        const g = new THREE.BoxGeometry(s[0], s[1], s[2]);
        g.translate(p[0], p[1], p[2]);
        geos.push(g);
      }
    });
    return geos.length ? mergeGeometries(geos) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.x, spec.z, spec.w, spec.d, spec.floorH, floor, spec.lit]);

/** Giriş kapısı + saçak (zemin kat, +z yüzü) */
const Door: React.FC<{ spec: BuildingSpec }> = ({ spec }) => (
  <group>
    <Box
      size={[1.3, 2.1, 0.12]}
      pos={[spec.x - spec.w / 2 + 1.4, 1.05, spec.z + spec.d / 2 + 0.05]}
      color={C.windowDark}
    />
    <Box
      size={[1.9, 0.14, 0.9]}
      pos={[spec.x - spec.w / 2 + 1.4, 2.35, spec.z + spec.d / 2 + 0.4]}
      color={C.concreteDark}
    />
  </group>
);

const Roof: React.FC<{ spec: BuildingSpec; top: number }> = ({ spec, top }) => {
  const { x, z, w, d } = spec;
  const kind = spec.roof ?? "flat";
  const par = C.concreteDark;
  return (
    <group>
      {/* parapet */}
      <BaseBox size={[w + 0.1, 0.45, 0.2]} pos={[x, top, z + d / 2 - 0.05]} color={par} />
      <BaseBox size={[0.2, 0.45, d]} pos={[x + w / 2 - 0.05, top, z]} color={par} />
      <BaseBox size={[w + 0.1, 0.45, 0.2]} pos={[x, top, z - d / 2 + 0.05]} color={par} />
      <BaseBox size={[0.2, 0.45, d]} pos={[x - w / 2 + 0.05, top, z]} color={par} />
      {kind === "tank" && (
        <group>
          <Cyl r={0.9} h={1.5} pos={[x - w * 0.15, top + 1.1, z - d * 0.1]} color={C.concrete} seg={7} />
          {[-0.5, 0.5].map((o) => (
            <BaseBox key={o} size={[0.14, 1.1, 0.14]} pos={[x - w * 0.15 + o, top, z - d * 0.1 + o]} color={C.concreteDark} />
          ))}
        </group>
      )}
      {kind === "ac" && (
        <group>
          <BaseBox size={[1.6, 0.8, 1.0]} pos={[x + w * 0.1, top, z]} color={C.concrete} />
          <BaseBox size={[0.9, 0.6, 0.9]} pos={[x - w * 0.2, top, z - d * 0.15]} color={C.concreteLight} />
        </group>
      )}
      {kind === "antenna" && (
        <group>
          <BaseBox size={[0.1, 3.4, 0.1]} pos={[x, top, z]} color={C.concreteLight} />
          <BaseBox size={[1.2, 0.08, 0.08]} pos={[x, top + 2.6, z]} color={C.concreteLight} />
          <BaseBox size={[0.8, 0.08, 0.08]} pos={[x, top + 3.1, z]} color={C.concreteLight} />
        </group>
      )}
      {kind === "slant" && (
        <mesh position={[x, top + 0.9, z]} material={mat(C.concreteDark)} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[Math.min(w, d) * 0.42, Math.max(w, d) * 0.6, 1.8, 4, 1]} />
        </mesh>
      )}
    </group>
  );
};

/** Yanık pencere: ışıldayan kutu + parıltı + (isteğe bağlı) içerideki silüetler */
export const LitWindowMesh: React.FC<{
  pos: V3;
  face: "x" | "z";
  frame: number;
  seed: number;
  people?: number;
  tint?: string;
}> = ({ pos, face, frame, seed, people = 0, tint = C.amberGlow }) => {
  const f = flicker(frame, seed, 0.25);
  const size: V3 = face === "z" ? [WIN_W, WIN_H, 0.1] : [0.1, WIN_H, WIN_W];
  const off = face === "z" ? ([0, 0, 0.07] as V3) : ([0.07, 0, 0] as V3);
  const col = new THREE.Color(tint).multiplyScalar(0.55 + 0.45 * f);
  return (
    <group>
      <mesh position={pos}>
        <boxGeometry args={size} />
        <meshBasicMaterial color={col} toneMapped={false} />
      </mesh>
      <Glow
        pos={[pos[0] + off[0] * 1.5, pos[1], pos[2] + off[2] * 1.5]}
        size={[3.4, 3.4]}
        opacity={0.28 * f}
        face={face}
        color={tint}
      />
      {Array.from({ length: people }).map((_, i) => {
        const sway = Math.sin(frame / 40 + seed + i * 2.1) * 0.05;
        const along = (i - (people - 1) / 2) * 0.42 + sway;
        const px = face === "z" ? pos[0] + along : pos[0] + off[0];
        const pz = face === "z" ? pos[2] + off[2] : pos[2] + along;
        const h = 0.85 - 0.12 * rand(seed, i);
        return (
          <group key={i} position={[px, pos[1] - 0.45, pz]}>
            <Box size={face === "z" ? [0.26, h, 0.05] : [0.05, h, 0.26]} pos={[0, h / 2, 0]} color={C.deepNight} />
            <Box size={[0.2, 0.2, 0.2]} pos={[0, h + 0.08, 0]} color={C.deepNight} />
          </group>
        );
      })}
    </group>
  );
};

type BuildingProps = {
  spec: BuildingSpec;
  /** Global silinme ilerlemesi 0..1 (14. Sokak için). Diğer binalar için 0. */
  erase?: number;
  frame: number;
  noShadow?: boolean;
};

export const buildingTop = (s: BuildingSpec) => s.floors * (s.floorH ?? FLOOR_H);

export const Building: React.FC<BuildingProps> = React.memo(({ spec, erase = 0, frame, noShadow }) => {
  const fh = spec.floorH ?? FLOOR_H;
  const tone = spec.tone ?? C.slate;
  const seed = spec.seed ?? 1;
  const [t0, t1] = spec.eraseWindow ?? [0, 1];
  const p = erase <= 0 ? 0 : invLerp(t0, t1, erase);

  const floors = [];
  for (let i = 0; i < spec.floors; i++) {
    const thr = 0.1 + 0.82 * ((spec.floors - 1 - i) / spec.floors) + 0.05 * rand(seed, i);
    const visible = p < thr;
    const warn = visible && p > thr - 0.1 && p > 0;
    const glitchOn = warn && Math.floor(frame / 2) % 2 === 0;
    floors.push(
      <FloorBlock
        key={i}
        spec={spec}
        i={i}
        fh={fh}
        tone={tone}
        visible={visible}
        glitch={glitchOn}
        frame={frame}
      />,
    );
  }

  // Havada kalan (hayatta kalan) yanık pencereler
  const lit = (spec.lit ?? []).map((l, k) => {
    const cols = windowCols(spec, l.face);
    const { p: wp } = winPos(spec, l.face, l.col, cols, l.floor);
    const thr = 0.1 + 0.82 * ((spec.floors - 1 - l.floor) / spec.floors);
    const floorGone = p >= thr;
    if (floorGone && !l.survive) return null;
    return (
      <LitWindowMesh
        key={k}
        pos={wp}
        face={l.face}
        frame={frame}
        seed={(l.seed ?? seed) + k}
        people={floorGone ? l.people ?? 0 : 0}
      />
    );
  });

  return (
    <group>
      {!noShadow && p < 0.93 && <Shadow pos={[spec.x, 0, spec.z]} size={[spec.w + 1.6, spec.d + 1.6]} opacity={0.45} />}
      {floors}
      {lit}
    </group>
  );
});

const FloorBlock: React.FC<{
  spec: BuildingSpec;
  i: number;
  fh: number;
  tone: string;
  visible: boolean;
  glitch: boolean;
  frame: number;
}> = ({ spec, i, fh, tone, visible, glitch }) => {
  const dark = useDarkWindows(spec, i);
  if (!visible) return null;
  const body = glitch ? C.redDark : tone;
  return (
    <group>
      <BaseBox size={[spec.w, fh, spec.d]} pos={[spec.x, i * fh, spec.z]} color={body} />
      {/* kat silesi */}
      <BaseBox size={[spec.w + 0.18, 0.16, spec.d + 0.18]} pos={[spec.x, i * fh, spec.z]} color={C.concreteDark} />
      {dark && <mesh geometry={dark} material={basic(glitch ? C.red : C.windowDark)} />}
      {i === 0 && spec.door !== false && <Door spec={spec} />}
      {i === spec.floors - 1 && <Roof spec={spec} top={(i + 1) * fh} />}
      {glitch && (
        <mesh position={[spec.x, i * fh + fh / 2, spec.z]}>
          <boxGeometry args={[spec.w + 0.12, fh + 0.02, spec.d + 0.12]} />
          <meshBasicMaterial color={C.red} transparent opacity={0.35} wireframe toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

