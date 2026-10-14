import React from "react";
import * as THREE from "three";
import { basic, glowTexture, mat } from "./materials";

export type V3 = [number, number, number];

type BoxProps = {
  size: V3;
  pos?: V3;
  rot?: V3;
  color?: string;
  material?: THREE.Material;
  visible?: boolean;
};

/** Tabanı y=pos[1]'de duran kutu DEĞİL; merkezden konumlanır. */
export const Box: React.FC<BoxProps> = ({ size, pos = [0, 0, 0], rot, color = "#39444B", material, visible = true }) => (
  <mesh position={pos} rotation={rot} material={material ?? mat(color)} visible={visible}>
    <boxGeometry args={size} />
  </mesh>
);

/** Tabanı verilen y'de duran kutu (pos = taban merkezi). */
export const BaseBox: React.FC<BoxProps> = ({ size, pos = [0, 0, 0], ...rest }) => (
  <Box size={size} pos={[pos[0], pos[1] + size[1] / 2, pos[2]]} {...rest} />
);

type CylProps = {
  r: number;
  h: number;
  pos?: V3;
  rot?: V3;
  color?: string;
  material?: THREE.Material;
  seg?: number;
  rTop?: number;
};
export const Cyl: React.FC<CylProps> = ({ r, rTop, h, pos = [0, 0, 0], rot, color = "#39444B", material, seg = 6 }) => (
  <mesh position={[pos[0], pos[1] + h / 2, pos[2]]} rotation={rot} material={material ?? mat(color)}>
    <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
  </mesh>
);

export const Cone: React.FC<{ r: number; h: number; pos?: V3; color?: string; seg?: number }> = ({
  r,
  h,
  pos = [0, 0, 0],
  color = "#2A3338",
  seg = 5,
}) => (
  <mesh position={[pos[0], pos[1] + h / 2, pos[2]]} material={mat(color)}>
    <coneGeometry args={[r, h, seg]} />
  </mesh>
);

/** Yatay, kameraya bakan yumuşak parıltı. face: 'up' | 'x' | 'z' */
export const Glow: React.FC<{
  pos: V3;
  size: number | [number, number];
  color?: string;
  opacity?: number;
  face?: "up" | "x" | "z";
}> = ({ pos, size, color = "#C49A5E", opacity = 0.4, face = "up" }) => {
  const [w, h] = typeof size === "number" ? [size, size] : size;
  const rot: V3 = face === "up" ? [-Math.PI / 2, 0, 0] : face === "x" ? [0, Math.PI / 2, 0] : [0, 0, 0];
  if (opacity <= 0.003) return null;
  return (
    <mesh position={pos} rotation={rot} renderOrder={5}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        map={glowTexture()}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

/** Sahte temas gölgesi: zemine yatık, yarı saydam koyu dikdörtgen. */
export const Shadow: React.FC<{ pos: V3; size: [number, number]; opacity?: number }> = ({
  pos,
  size,
  opacity = 0.4,
}) => (
  <mesh position={[pos[0], pos[1] + 0.03, pos[2]]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
    <planeGeometry args={size} />
    <meshBasicMaterial color="#05070A" transparent opacity={opacity} depthWrite={false} toneMapped={false} />
  </mesh>
);

export const Emissive: React.FC<{ size: V3; pos: V3; color: string; rot?: V3 }> = ({ size, pos, color, rot }) => (
  <mesh position={pos} rotation={rot} material={basic(color)}>
    <boxGeometry args={size} />
  </mesh>
);
