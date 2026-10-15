// MAHALLE mekânları. Esnaf dükkânları "açık maket" stilindedir: arka/sol duvarlar yüksek, ön/doğu duvarlar alçak;
// kamera içeriyi (karakterleri) görür. Yerel orijin = mekânın merkezi, ön yüz +z.
import React from "react";
import { basic, mat } from "../materials";
import { BaseBox, Box, Cone, Cyl, Emissive, Glow, Shadow, V3 } from "../primitives";
import { Antenna, Awning, Bench, BladeSign, Block, Crate, Cypress, Facade, Fence, HipRoof, MCar, MLamp, MTree, Pot, RoundTable, Sign, Stool, StringLights, WallText, WaterTank, useLight, useSeason } from "./kit";
import { TBase, TBox, TexKind } from "./tex";
import { SNOW } from "./seasons";
import { M } from "./palette";
import { rand } from "../../utils/deterministic";

type VP = { frame: number };

/** Baca dumanı (sonbahar/kış): yükselen, büyüyen, solan beyaz tütmeler. */
const Smoke: React.FC<{ pos: V3; frame: number }> = ({ pos, frame }) => {
  const S = useSeason();
  if (!S.chimneySmoke) return null;
  return (
    <group position={pos}>
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame / 70 + i / 4) % 1 + 1) % 1;
        return (
          <mesh key={i} position={[0.25 * t + Math.sin(frame / 25 + i) * 0.12, 0.3 + t * 2.4, 0]} scale={[0.25 + t * 0.55, 0.25 + t * 0.55, 0.25 + t * 0.55]}>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshBasicMaterial color="#F2F4F7" transparent opacity={0.8 * (1 - t)} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Parasol: React.FC<{ pos: V3; color: string }> = ({ pos, color }) => (
  <group position={pos}>
    <Cyl r={0.04} h={2.0} color={M.greyDark} seg={4} />
    <mesh position={[0, 2.15, 0]} material={mat(color)}>
      <coneGeometry args={[1.15, 0.45, 8]} />
    </mesh>
    <mesh position={[0, 2.18, 0]} material={mat(M.white)} scale={[0.6, 1, 0.6]}>
      <coneGeometry args={[1.15, 0.47, 8]} />
    </mesh>
  </group>
);

const Pumpkin: React.FC<{ pos: V3; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos} scale={[s, s, s]}>
    <mesh position={[0, 0.2, 0]} material={mat("#E58A2D")} scale={[1.15, 0.85, 1.15]}>
      <icosahedronGeometry args={[0.24, 0]} />
    </mesh>
    <Box size={[0.05, 0.1, 0.05]} pos={[0, 0.43, 0]} color={M.greenDark} />
  </group>
);

const Snowman: React.FC<{ pos: V3 }> = ({ pos }) => (
  <group position={pos}>
    {[[0.42, 0.42], [0.31, 1.05], [0.22, 1.56]].map(([r, y], i) => (
      <mesh key={i} position={[0, y, 0]} material={mat(SNOW)}>
        <icosahedronGeometry args={[r, 1]} />
      </mesh>
    ))}
    <Cone r={0.05} h={0.3} pos={[0, 1.54, 0.3]} color={M.orange} seg={4} />
    <Box size={[0.3, 0.05, 0.3]} pos={[0, 1.8, 0]} color={M.ink} />
    <Box size={[0.2, 0.16, 0.2]} pos={[0, 1.9, 0]} color={M.ink} />
  </group>
);

/* ------------------------------------------------------------------ açık dükkân kabuğu */
const Shell: React.FC<{ w: number; d: number; h: number; wall: string; floor: string; trim?: string; low?: number; door?: number; doorAt?: number; roof?: number; awning?: [string, string]; wallTex?: TexKind; smoke?: V3; children?: React.ReactNode }> = ({
  w, d, h, wall, floor, trim = M.white, low = 1.05, door = 2.2, doorAt = 0, roof = 0, awning, wallTex = "plaster", smoke, children,
}) => {
  const { light, frame } = useLight();
  const S = useSeason();
  const left = (w - door) / 2 + doorAt;
  const right = (w - door) / 2 - doorAt;
  return (
    <group>
      <TBase size={[w + 0.4, 0.12, d + 0.4]} pos={[0, 0, 0]} color={floor} tex="floor" />
      <TBase size={[w, h, 0.25]} pos={[0, 0.12, -d / 2 + 0.125]} color={wall} tex={wallTex} />
      <TBase size={[0.25, h, d]} pos={[-w / 2 + 0.125, 0.12, 0]} color={wall} tex={wallTex} />
      <BaseBox size={[w + 0.3, 0.2, 0.4]} pos={[0, h + 0.12, -d / 2 + 0.1]} color={trim} />
      <BaseBox size={[0.4, 0.2, d + 0.1]} pos={[-w / 2 + 0.1, h + 0.12, 0]} color={trim} />
      {/* alçak ön duvar (kapı boşluklu) */}
      <TBase size={[left, low, 0.22]} pos={[-w / 2 + left / 2, 0.12, d / 2 - 0.11]} color={wall} tex={wallTex} />
      <TBase size={[right, low, 0.22]} pos={[w / 2 - right / 2, 0.12, d / 2 - 0.11]} color={wall} tex={wallTex} />
      {/* alçak doğu duvarı */}
      <TBase size={[0.22, low, d - 0.2]} pos={[w / 2 - 0.11, 0.12, -0.1]} color={wall} tex={wallTex} />
      {/* köşe sütunları */}
      <BaseBox size={[0.3, h * 0.55, 0.3]} pos={[w / 2 - 0.15, 0.12, d / 2 - 0.15]} color={trim} />
      {light.lamps > 0.05 && <Glow pos={[0, 0.3, 0]} size={Math.max(w, d) * 1.5} color={M.warm} opacity={0.38 * light.lamps} />}
      {/* kapı yanı saksıları */}
      <Pot pos={[doorAt - door / 2 - 0.55, 0.12, d / 2 + 0.55]} flower={M.rose} />
      <Pot pos={[doorAt + door / 2 + 0.55, 0.12, d / 2 + 0.55]} flower={M.yellow} scale={0.9} />
      {/* arka kiremit çatı (iç görünür kalır: yalnızca arka duvarın üstü) */}
      {roof > 0 && (
        <group>
          <TBase size={[w + 0.5, 0.26, roof]} pos={[0, h + 0.12, -d / 2 + roof / 2 - 0.2]} color={M.roofTile} tex="roof" tile={1.0} />
          <BaseBox size={[w + 0.5, 0.14, 0.3]} pos={[0, h + 0.38, -d / 2 + roof - 0.3]} color={M.terracotta} />
          {S.snow && <BaseBox size={[w + 0.4, 0.16, roof - 0.1]} pos={[0, h + 0.38, -d / 2 + roof / 2 - 0.25]} color={SNOW} />}
          <TBase size={[0.55, 1.2, 0.55]} pos={[-w / 2 + 1.0, h + 0.3, -d / 2 + 0.7]} color={M.brickDark} tex="brick" tile={1.0} />
          <Smoke pos={[-w / 2 + 1.0, h + 1.55, -d / 2 + 0.7]} frame={frame} />
        </group>
      )}
      {awning && <Awning pos={[doorAt, 2.55, d / 2 + 0.05]} w={door + 0.9} depth={1.1} c1={awning[0]} c2={awning[1]} />}
      {children}
    </group>
  );
};

const Shelf: React.FC<{ pos: V3; w?: number; h?: number; rotY?: number; seed?: number; goods?: string[] }> = ({ pos, w = 1.6, h = 2.3, rotY = 0, seed = 1, goods = [M.red, M.yellow, M.blue, M.white, M.green, M.orange] }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <BaseBox size={[w, h, 0.45]} pos={[0, 0, 0]} color={M.woodDark} />
    {[0.35, 0.95, 1.55].map((y, r) =>
      Array.from({ length: Math.floor(w / 0.32) }, (_, i) => (
        <BaseBox key={`${r}-${i}`} size={[0.24, 0.42, 0.2]} pos={[-w / 2 + 0.2 + i * 0.32, y, 0.16]} color={goods[Math.floor(rand(seed, r * 11 + i) * goods.length)]} />
      )),
    )}
  </group>
);

const Counter: React.FC<{ pos: V3; w: number; d?: number; top?: string; body?: string; rotY?: number }> = ({ pos, w, d = 0.8, top = M.wood, body = M.woodDark, rotY = 0 }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <BaseBox size={[w, 0.95, d]} pos={[0, 0, 0]} color={body} />
    <BaseBox size={[w + 0.12, 0.08, d + 0.12]} pos={[0, 0.95, 0]} color={top} />
  </group>
);

/* ------------------------------------------------------------------ BAKKAL */
export const Bakkal: React.FC<VP> = () => {
  const S = useSeason();
  return (
  <group>
    <Shell w={8} d={6} h={3.4} wall={M.mint} floor={M.paveDark} trim={M.cream} awning={[M.green, M.white]}>
      <Shelf pos={[-2.9, 0.12, -2.55]} seed={1} />
      <Shelf pos={[-1.0, 0.12, -2.55]} seed={2} />
      <Shelf pos={[0.9, 0.12, -2.55]} seed={3} />
      <Shelf pos={[2.8, 0.12, -2.55]} seed={4} />
      <Shelf pos={[-3.55, 0.12, 0.2]} rotY={Math.PI / 2} w={2.2} seed={5} goods={[M.yellow, M.green, M.red]} />
      <Counter pos={[1.7, 0.12, 0.2]} w={3.2} />
      <Box size={[0.4, 0.22, 0.2]} pos={[2.9, 1.2, 0.2]} color={M.red} />
      <Box size={[0.5, 0.04, 0.38]} pos={[1.2, 1.1, 0.25]} color={M.cream} />
      <BaseBox size={[0.7, 0.5, 0.5]} pos={[-0.3, 0.12, 0.3]} color={M.sand} />
    </Shell>
    <WallText text="BAKKAL" pos={[-2.5, 0.72, 3.04]} w={2.6} h={0.6} bg={M.green} fg={M.white} />
    <Crate pos={[3.4, 0.15, 3.9]} goods={M.red} />
    <Crate pos={[2.3, 0.15, 3.9]} goods={M.orange} />
    <Crate pos={[3.4, 0.15, 4.5]} goods={M.yellow} color={M.woodDark} />
    <BaseBox size={[0.9, 0.7, 0.9]} pos={[-3.2, 0.15, 3.9]} color={M.cream} />
    {S.pumpkins && [[-3.2, 4.6, 1], [-2.6, 4.3, 0.8], [-3.6, 4.2, 0.7]].map(([x, z, k], i) => <Pumpkin key={i} pos={[x, 0.15, z]} s={k} />)}
    <BladeSign text="BAKKAL" sub="NURİ AMCA" pos={[4.9, 0.15, -2.2]} bg={M.green} fg={M.white} />
  </group>
  );
};

/* ------------------------------------------------------------------ ÇAY OCAĞI */
export const CayOcagi: React.FC<VP> = ({ frame }) => {
  const S = useSeason();
  const steam = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <group>
      <Shell w={4.6} d={3.4} h={3.0} wall={M.sky} floor={M.paveDark} trim={M.white} low={1.1} door={1.6} roof={1.3} awning={[M.blue, M.white]}>
        <Counter pos={[0.4, 0.12, -0.3]} w={3.0} d={0.7} top={M.white} body={M.blue} />
        <Cyl r={0.28} h={0.7} pos={[-0.6, 1.07, -0.3]} color={M.grey} seg={8} />
        <Cone r={0.3} h={0.28} pos={[-0.6, 1.77, -0.3]} color={M.greyDark} seg={8} />
        <Cyl r={0.12} h={0.3} pos={[0.3, 1.07, -0.3]} color={M.red} seg={6} />
        {[0.8, 1.1, 1.4].map((x) => (
          <Cyl key={x} r={0.07} h={0.13} pos={[x, 1.07, -0.3]} color={M.white} seg={6} />
        ))}
        <Glow pos={[-0.6, 2.2 + steam * 0.3, -0.3]} size={0.9} color={M.white} opacity={0.35} face="z" />
      </Shell>
      <WallText text="ÇAY" pos={[-1.55, 0.7, 1.74]} w={1.2} h={0.5} bg={M.blue} fg={M.white} />
      <BladeSign text="ÇAY OCAĞI" sub="HATİCE ABLA" pos={[3.0, 0.15, -1.2]} bg={M.blue} fg={M.white} tall={3.2} w={3} />
      {[[-1.4, 3.0], [0.4, 3.4], [2.2, 3.0]].map(([x, z], i) => (
        <group key={i}>
          {S.parasols && <Parasol pos={[x, 0.15, z]} color={[M.red, M.blue, M.mustard][i]} />}
          <RoundTable pos={[x, 0.15, z]} color={M.red} />
          <Stool pos={[x - 0.7, 0.15, z]} color={M.blue} />
          <Stool pos={[x + 0.7, 0.15, z]} color={M.blue} />
          <Stool pos={[x, 0.15, z + 0.7]} color={M.blue} />
        </group>
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ DÖNERCİ */
export const Doner: React.FC<VP> = ({ frame }) => {
  const { light } = useLight();
  const spin = frame / 14;
  const glow = 0.55 + 0.45 * Math.sin(frame / 5) ** 2;
  return (
    <group>
      <Shell w={8} d={6} h={3.4} wall={M.brick} floor={M.paveDark} trim={M.cream} roof={1.9} awning={[M.red, M.white]} wallTex="brick">
        <Counter pos={[0.8, 0.12, 0.3]} w={4.6} d={0.8} top={M.white} body={M.brickDark} />
        {/* döner mili */}
        <group position={[-0.4, 0.12, -2.0]}>
          <BaseBox size={[1.5, 1.6, 0.8]} pos={[0, 0, 0]} color={M.greyDark} />
          <group position={[0, 1.7, 0]} rotation={[0, spin, 0]}>
            <Cone r={0.55} h={1.15} pos={[0, 0, 0]} color={M.terracotta} seg={7} />
            <Cyl r={0.34} h={0.7} pos={[0, 1.1, 0]} color={M.brickDark} seg={7} />
          </group>
          <Emissive size={[0.08, 1.4, 0.7]} pos={[-0.55, 2.4, 0.05]} color={light.id === "ogle" ? M.orange : M.warmDeep} />
          <Glow pos={[-0.7, 2.4, 0.4]} size={[1.4, 2.4]} color={M.orange} opacity={0.35 * glow} face="z" />
        </group>
        {/* ayran dolabı */}
        <BaseBox size={[1.1, 1.8, 0.7]} pos={[-2.8, 0.12, -2.4]} color={M.white} />
        <BaseBox size={[0.9, 1.3, 0.05]} pos={[-2.8, 0.45, -2.02]} color={M.sky} />
        <Box size={[0.5, 0.18, 0.18]} pos={[-1.0, 1.15, 0.3]} color={M.red} />
        <Box size={[0.5, 0.18, 0.18]} pos={[0.2, 1.15, 0.3]} color={M.yellow} />
      </Shell>
      <WallText text="DÖNER" pos={[-2.5, 0.72, 3.04]} w={2.6} h={0.6} bg={M.red} fg={M.white} />
      <BladeSign text="DÖNER" sub="FERHAT USTA" pos={[4.9, 0.15, -2.2]} bg={M.red} fg={M.white} />
      {[[-2.4, 4.0], [-0.8, 4.0], [0.8, 4.0]].map(([x, z], i) => (
        <group key={i}>
          <RoundTable pos={[x, 0.15, z]} color={M.cream} />
          <Stool pos={[x - 0.6, 0.15, z]} color={M.orange} />
          <Stool pos={[x + 0.6, 0.15, z]} color={M.orange} />
        </group>
      ))}
      {/* motor (Mert'in) */}
      <group position={[3.2, 0.15, 4.4]} rotation={[0, 0.3, 0]}>
        <BaseBox size={[0.4, 0.6, 1.5]} pos={[0, 0.2, 0]} color={M.red} />
        <BaseBox size={[0.7, 0.5, 0.6]} pos={[0, 0.7, -0.7]} color={M.white} />
        <Cyl r={0.3} h={0.1} pos={[0, 0.0, 0.7]} rot={[0, 0, Math.PI / 2]} color={M.ink} seg={8} />
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ KUAFÖR */
export const Kuafor: React.FC<VP> = ({ frame }) => (
  <group>
    <Shell w={7} d={6} h={3.4} wall={M.lilac} floor={M.paveDark} trim={M.white} awning={[M.lilac, M.white]}>
      {[-2.2, 0.4, 3.0].map((x, i) => (
        <group key={i}>
          <BaseBox size={[1.4, 1.8, 0.1]} pos={[x - 0.2, 0.9, -2.8]} color={M.sky} />
          <BaseBox size={[1.7, 0.1, 0.5]} pos={[x - 0.2, 0.9, -2.55]} color={M.white} />
        </group>
      ))}
      {/* koltuklar */}
      {[-1.6, 1.0].map((x, i) => (
        <group key={i} position={[x, 0.12, -1.6]}>
          <Cyl r={0.35} h={0.3} color={M.greyDark} seg={8} />
          <BaseBox size={[0.8, 0.28, 0.75]} pos={[0, 0.3, 0]} color={i ? M.rose : M.red} />
          <BaseBox size={[0.8, 0.8, 0.14]} pos={[0, 0.5, -0.38]} color={i ? M.rose : M.red} />
        </group>
      ))}
      {/* kurutma başlığı */}
      <group position={[-2.9, 0.12, 0.6]}>
        <Cyl r={0.05} h={1.6} color={M.greyDark} seg={5} />
        <mesh position={[0, 1.5, 0]} material={mat(M.white)}>
          <icosahedronGeometry args={[0.45, 0]} />
        </mesh>
      </group>
      <Counter pos={[2.2, 0.12, 0.8]} w={2.2} d={0.6} top={M.white} body={M.rose} />
    </Shell>
    <WallText text="NERMİN" pos={[-2.3, 0.72, 3.04]} w={2.2} h={0.6} bg={M.rose} fg={M.ink} />
    <BladeSign text="KUAFÖR" sub="NERMİN" pos={[4.4, 0.15, -2.2]} bg={M.lilac} fg={M.white} />
    {/* berber direği */}
    <group position={[-3.9, 0.15, 3.3]}>
      <Cyl r={0.2} h={1.5} color={M.white} seg={8} />
      {[0.25, 0.65, 1.05].map((y) => (
        <Cyl key={y} r={0.21} h={0.16} pos={[0, y, 0]} color={M.red} seg={8} />
      ))}
      <mesh position={[0, 1.6, 0]} material={mat(M.blue)}>
        <icosahedronGeometry args={[0.24, 0]} />
      </mesh>
    </group>
  </group>
);

/* ------------------------------------------------------------------ FIRIN */
export const Firin: React.FC<VP> = ({ frame }) => {
  const smoke = (frame % 90) / 90;
  return (
    <group>
      <Shell w={7} d={6} h={3.4} wall={M.terracotta} floor={M.paveDark} trim={M.cream} roof={2.0} awning={[M.mustard, M.white]} wallTex="brick">
        <BaseBox size={[2.4, 1.8, 1.2]} pos={[-1.8, 0.12, -2.1]} color={M.ink} />
        <Emissive size={[1.6, 0.8, 0.06]} pos={[-1.8, 1.1, -1.5]} color={M.orange} />
        <Counter pos={[1.6, 0.12, 0.2]} w={3.0} d={0.8} top={M.cream} body={M.woodDark} />
        {[0.5, 1.2, 1.9].map((x, i) => (
          <Cyl key={i} r={0.2} h={0.12} pos={[x + 0.8, 1.05, 0.2]} color={M.sand} seg={8} />
        ))}
        <BaseBox size={[1.0, 2.0, 0.5]} pos={[3.0, 0.12, -2.55]} color={M.woodDark} />
      </Shell>
      <BaseBox size={[0.7, 2.2, 0.7]} pos={[-2.4, 3.5, -2.2]} color={M.brickDark} />
      <mesh position={[-2.4, 6.0 + smoke * 1.2, -2.2]} material={mat(M.white)} scale={[1 + smoke, 1 + smoke, 1 + smoke]}>
        <icosahedronGeometry args={[0.35, 0]} />
      </mesh>
      <Smoke pos={[-2.4, 6.0, -2.2]} frame={frame} />
      <WallText text="FIRIN" pos={[-2.3, 0.72, 3.04]} w={2.2} h={0.6} bg={M.sand} fg={M.brickDark} />
      <BladeSign text="FIRIN" sub="SICAK EKMEK" pos={[4.4, 0.15, -2.2]} bg={M.terracotta} fg={M.white} />
      <Crate pos={[-2.8, 0.15, 3.9]} goods={M.sand} n={6} />
      <Crate pos={[-1.7, 0.15, 3.9]} goods={M.sand} n={6} color={M.woodDark} />
    </group>
  );
};

/* ------------------------------------------------------------------ APARTMANLAR */
const Balcony: React.FC<{ pos: V3; w?: number; color: string; plants?: boolean; seed?: number; wash?: boolean }> = ({ pos, w = 2.4, color, plants, seed = 1, wash }) => (
  <group position={pos}>
    <BaseBox size={[w, 0.14, 1.1]} pos={[0, 0, 0.55]} color={color} />
    <BaseBox size={[w, 0.06, 0.08]} pos={[0, 0.88, 1.07]} color={M.white} />
    {Array.from({ length: Math.round(w / 0.22) + 1 }, (_, i) => (
      <BaseBox key={i} size={[0.04, 0.74, 0.04]} pos={[-w / 2 + (w * i) / Math.round(w / 0.22), 0.14, 1.07]} color={M.white} />
    ))}
    <BaseBox size={[0.06, 0.8, 1.1]} pos={[-w / 2 + 0.03, 0.14, 0.55]} color={M.white} />
    <BaseBox size={[0.06, 0.8, 1.1]} pos={[w / 2 - 0.03, 0.14, 0.55]} color={M.white} />
    {plants &&
      [-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0.85]} material={mat(rand(seed, i) > 0.5 ? M.leaf : M.leaf3)}>
          <icosahedronGeometry args={[0.22, 0]} />
        </mesh>
      ))}
    {wash && (
      <>
        <Box size={[w - 0.2, 0.02, 0.02]} pos={[0, 1.7, 1.0]} color={M.ink} />
        {[-0.6, 0, 0.6].map((x, i) => (
          <Box key={i} size={[0.3, 0.45, 0.02]} pos={[x, 1.45, 1.0]} color={[M.rose, M.sky, M.mustard][i]} />
        ))}
      </>
    )}
  </group>
);

export const YildizApt: React.FC<VP> = () => {
  const floors = 6;
  const w = 8, d = 8;
  return (
    <group>
      <Block w={w} d={d} h={floors * 3} color={M.sand} trim={M.cream} ac={3} />
      <Facade w={w} d={d} floors={floors} face="z" seed={31} cols={3} skipGround frameColor={M.white} />
      <Facade w={w} d={d} floors={floors} face="x" seed={32} cols={3} frameColor={M.white} />
      {/* balkonlar (kat başına 2) */}
      {Array.from({ length: floors - 1 }, (_, f) => (
        <group key={f}>
          <Balcony pos={[-2.1, (f + 1) * 3, d / 2]} color={M.cream} plants seed={f + 3} wash={f === 2} />
          <Balcony pos={[2.1, (f + 1) * 3, d / 2]} color={M.cream} plants={f % 2 === 0} seed={f + 9} />
        </group>
      ))}
      {/* giriş */}
      <BaseBox size={[1.6, 2.4, 0.12]} pos={[0, 0, d / 2 + 0.02]} color={M.woodDark} />
      <BaseBox size={[2.6, 0.18, 1.2]} pos={[0, 2.45, d / 2 + 0.5]} color={M.red} />
      <BaseBox size={[1.9, 0.5, 0.08]} pos={[0, 2.63, d / 2 + 1.1]} color={M.navy} />
      <Sign text="YILDIZ APT." pos={[0, 2.95, d / 2 + 0.9]} w={1.9} h={0.42} bg={M.navy} fg={M.warm} />
      {/* çatı */}
      <WaterTank pos={[-2.4, floors * 3 + 0.35, -1.8]} />
      <Antenna pos={[2.2, floors * 3 + 0.35, -2.2]} />
      <BaseBox size={[1.8, 1.6, 1.8]} pos={[1.6, floors * 3 + 0.35, 1.2]} color={M.cream} />
      {[-0.9, 0.9].map((x) => (
        <Box key={x} size={[1.5, 0.08, 1.0]} pos={[x - 0.2, floors * 3 + 1.0, 2.2]} rot={[-0.5, 0, 0]} color={M.navy} />
      ))}
    </group>
  );
};

export const GulApt: React.FC<VP> = () => {
  const floors = 4;
  const w = 7, d = 6;
  return (
    <group>
      <Block w={w} d={d} h={floors * 3} color={M.rose} trim={M.cream} ac={2} />
      <Facade w={w} d={d} floors={floors} face="z" seed={41} cols={3} skipGround frameColor={M.white} />
      <Facade w={w} d={d} floors={floors} face="x" seed={42} cols={2} frameColor={M.white} />
      {Array.from({ length: floors - 1 }, (_, f) => (
        <Balcony key={f} pos={[-1.8, (f + 1) * 3, d / 2]} w={2.2} color={M.cream} plants={f === 1} seed={f + 21} />
      ))}
      <BaseBox size={[1.5, 2.3, 0.12]} pos={[1.2, 0, d / 2 + 0.02]} color={M.mustard} />
      <BaseBox size={[2.4, 0.16, 1.0]} pos={[1.2, 2.35, d / 2 + 0.45]} color={M.blue} />
      <Sign text="KİRALIK" pos={[-1.8, 5.1, d / 2 + 1.2]} w={1.9} h={0.6} bg={M.yellow} fg={M.ink} sub="DAİRE 4" />
      {/* koliler (yeni taşınan) */}
      <BaseBox size={[0.9, 0.7, 0.8]} pos={[-1.0, 0.15 - 0.15, d / 2 + 1.1]} color={M.sand} />
      <BaseBox size={[0.8, 0.5, 0.7]} pos={[-1.0, 0.7, d / 2 + 1.1]} color={M.terracotta} />
      <BaseBox size={[1.0, 0.6, 0.8]} pos={[0.2, 0, d / 2 + 1.3]} color={M.sand} />
      <WaterTank pos={[2.0, floors * 3 + 0.35, -1.2]} />
    </group>
  );
};

/* ------------------------------------------------------------------ PASAJ HAN + TERAS 7 */
export const PasajHan: React.FC<VP> = () => {
  const floors = 4;
  const w = 9, d = 8;
  return (
    <group>
      <Block w={w} d={d} h={floors * 3} color={M.greyDark} trim={M.grey} tex="panel" ac={2} />
      <Facade w={w} d={d} floors={floors} face="z" seed={51} cols={4} winW={1.4} winH={1.5} skipGround frameColor={M.grey} />
      <Facade w={w} d={d} floors={floors} face="x" seed={52} cols={3} winW={1.4} winH={1.5} frameColor={M.grey} />
      {/* giriş + tabela */}
      <BaseBox size={[2.2, 2.5, 0.12]} pos={[0, 0, d / 2 + 0.02]} color={M.glassDark} />
      <BaseBox size={[3.2, 0.18, 1.2]} pos={[0, 2.6, d / 2 + 0.5]} color={M.navy} />
      <Sign text="PASAJ HAN" pos={[0, 3.35, d / 2 + 0.08]} w={4.2} h={0.7} bg={M.navy} fg={M.white} />
      <BaseBox size={[1.6, 0.9, 0.1]} pos={[3.1, 0.8, d / 2 + 0.04]} color={M.cream} />
    </group>
  );
};

export const Teras7: React.FC<VP> = ({ frame }) => {
  const { light } = useLight();
  const w = 9, d = 8;
  const beat = 0.5 + 0.5 * Math.sin(frame / 4);
  const neon = light.neon;
  return (
    <group>
      {/* güverte */}
      <TBase size={[w - 0.2, 0.18, d - 0.2]} pos={[0, 0, 0]} color={M.wood} tex="wood" />
      {/* korkuluk (ön ve doğu: alçak; arka ve sol: yüksek paravan) */}
      <BaseBox size={[w - 0.2, 0.9, 0.08]} pos={[0, 0.18, d / 2 - 0.2]} color={M.ink} />
      <BaseBox size={[0.08, 0.9, d - 0.2]} pos={[w / 2 - 0.2, 0.18, 0]} color={M.ink} />
      <BaseBox size={[w - 0.2, 1.8, 0.15]} pos={[0, 0.18, -d / 2 + 0.2]} color={M.navy} />
      <BaseBox size={[0.15, 1.8, d - 0.2]} pos={[-w / 2 + 0.2, 0.18, 0]} color={M.navy} />
      {/* merdiven kulesi */}
      <BaseBox size={[1.8, 2.4, 1.8]} pos={[3.2, 0.18, -2.8]} color={M.greyDark} />
      <BaseBox size={[0.9, 1.7, 0.06]} pos={[3.2, 0.18, -1.88]} color={M.ink} />
      {/* bar */}
      <group position={[-1.2, 0.18, -2.4]}>
        <BaseBox size={[3.6, 1.1, 0.8]} pos={[0, 0, 0]} color={M.ink} />
        <BaseBox size={[3.8, 0.08, 0.95]} pos={[0, 1.1, 0]} color={M.neon} />
        {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
          <Cyl key={i} r={0.08} h={0.45} pos={[x, 1.18, -0.1]} color={[M.neonCyan, M.rose, M.yellow, M.leaf3, M.white][i]} seg={5} />
        ))}
        <BaseBox size={[3.0, 0.9, 0.06]} pos={[0, 1.4, -0.32]} color={M.glassDark} />
      </group>
      {/* DJ masası */}
      <group position={[-3.0, 0.18, 1.2]} rotation={[0, Math.PI / 2, 0]}>
        <BaseBox size={[2.4, 1.0, 0.8]} pos={[0, 0, 0]} color={M.ink} />
        <Emissive size={[0.8, 0.05, 0.5]} pos={[-0.5, 1.03, 0]} color={neon > 0.05 ? M.neonCyan : M.greyDark} />
        <Emissive size={[0.8, 0.05, 0.5]} pos={[0.5, 1.03, 0]} color={neon > 0.05 ? M.neon : M.greyDark} />
        <BaseBox size={[0.7, 1.6, 0.6]} pos={[-1.7, 0, 0]} color={M.ink} />
        <BaseBox size={[0.7, 1.6, 0.6]} pos={[1.7, 0, 0]} color={M.ink} />
        {neon > 0.05 && <Glow pos={[0, 1.2, 0.5]} size={[3, 1.4]} color={M.neon} opacity={0.35 * neon * (0.7 + 0.3 * beat)} face="z" />}
      </group>
      {/* kanepeler */}
      {[[2.0, 2.4], [-0.6, 2.4]].map(([x, z], i) => (
        <group key={i} position={[x, 0.18, z]}>
          <BaseBox size={[2.2, 0.5, 0.9]} pos={[0, 0, 0]} color={i ? M.rose : M.lilac} />
          <BaseBox size={[2.2, 0.55, 0.22]} pos={[0, 0.5, -0.34]} color={i ? M.rose : M.lilac} />
        </group>
      ))}
      <RoundTable pos={[1.2, 0.18, 0.6]} color={M.ink} />
      {/* ışık zinciri */}
      <StringLights from={[-4.2, 3.0, 3.8]} to={[4.2, 3.0, 3.8]} n={12} frame={frame} />
      <StringLights from={[4.2, 3.0, 3.8]} to={[4.2, 3.0, -2.6]} n={10} frame={frame} />
      {[[-4.2, 3.8], [4.2, 3.8], [4.2, -2.6]].map(([x, z], i) => (
        <Cyl key={i} r={0.05} h={3.0} pos={[x, 0.18, z]} color={M.ink} seg={4} />
      ))}
      {/* neon tabela */}
      <group position={[-1.0, 0.18, -3.2]}>
        <Sign text="TERAS 7" pos={[0, 3.1, 0.1]} w={3.6} h={1.0} bg={M.ink} fg={neon > 0.05 ? M.neonCyan : M.grey} sub="GECE BENİM" />
        {neon > 0.05 && <Glow pos={[0, 3.1, 0.3]} size={[6, 2.6]} color={M.neon} opacity={0.35 * neon} face="z" />}
        <Cyl r={0.05} h={2.6} pos={[-1.6, 0, 0]} color={M.ink} seg={4} />
        <Cyl r={0.05} h={2.6} pos={[1.6, 0, 0]} color={M.ink} seg={4} />
      </group>
      <Shadow pos={[0, 0.2, 0]} size={[w, d]} opacity={0.0} />
    </group>
  );
};

/* ------------------------------------------------------------------ PARK */
export const Park: React.FC<VP> = ({ frame }) => {
  const S = useSeason();
  const sway = Math.sin(frame / 22) * 0.18;
  return (
    <group>
      <BaseBox size={[SIDEWALK_OVERRIDE, 0.04, SIDEWALK_OVERRIDE]} pos={[0, 0, 0]} color={S.grass} />
      {/* patika */}
      <BaseBox size={[1.4, 0.05, SIDEWALK_OVERRIDE]} pos={[1.5, 0, 0]} color={M.paveDark} />
      <BaseBox size={[SIDEWALK_OVERRIDE, 0.05, 1.4]} pos={[0, 0, 1.5]} color={M.paveDark} />
      {/* salıncak */}
      <group position={[-2.6, 0, -2.2]}>
        {[-1.2, 1.2].map((x) => (
          <React.Fragment key={x}>
            <Box size={[0.12, 2.6, 0.12]} pos={[x, 1.3, 0.5]} rot={[0.3, 0, 0]} color={M.red} />
            <Box size={[0.12, 2.6, 0.12]} pos={[x, 1.3, -0.5]} rot={[-0.3, 0, 0]} color={M.red} />
          </React.Fragment>
        ))}
        <Box size={[2.6, 0.12, 0.12]} pos={[0, 2.55, 0]} color={M.red} />
        {[-0.5, 0.5].map((x, i) => (
          <group key={x} position={[x, 2.5, 0]} rotation={[sway * (i ? -1 : 1), 0, 0]}>
            <Box size={[0.03, 1.8, 0.03]} pos={[-0.2, -0.9, 0]} color={M.grey} />
            <Box size={[0.03, 1.8, 0.03]} pos={[0.2, -0.9, 0]} color={M.grey} />
            <Box size={[0.55, 0.07, 0.3]} pos={[0, -1.8, 0]} color={M.yellow} />
          </group>
        ))}
      </group>
      {/* satranç masası */}
      <group position={[2.8, 0, -2.4]}>
        <BaseBox size={[1.1, 0.07, 1.1]} pos={[0, 0.75, 0]} color={M.cream} />
        <BaseBox size={[0.2, 0.75, 0.2]} pos={[0, 0, 0]} color={M.ink} />
        <Stool pos={[-0.9, 0, 0]} color={M.wood} />
        <Stool pos={[0.9, 0, 0]} color={M.wood} />
      </group>
      <Bench pos={[-2.6, 0, 3.2]} />
      <MTree pos={[-3.8, 0, 0.4]} seed={11} scale={1.2} tone={1} />
      <MTree pos={[3.6, 0, 3.4]} seed={12} tone={2} />
      <MTree pos={[0.2, 0, -4.0]} seed={13} scale={1.1} />
      {S.snow && <Snowman pos={[1.0, 0.05, -1.0]} />}
      <WallText text="ÇINAR PARKI" pos={[-3.6, 1.2, 4.6]} w={2.6} h={0.5} bg={M.greenDark} fg={M.white} />
    </group>
  );
};
const SIDEWALK_OVERRIDE = 10;

/* ------------------------------------------------------------------ DURAK + BEKÇİ KULÜBESİ */
export const Durak: React.FC<VP> = () => (
  <group>
    {/* durak barınağı */}
    <group position={[1.6, 0, 3.0]}>
      <BaseBox size={[3.4, 0.14, 1.4]} pos={[0, 2.5, 0]} color={M.blue} />
      {[-1.5, 1.5].map((x) => (
        <BaseBox key={x} size={[0.1, 2.5, 0.1]} pos={[x, 0, -0.55]} color={M.ink} />
      ))}
      <BaseBox size={[3.2, 1.6, 0.05]} pos={[0, 0.5, -0.6]} color={M.glass} />
      <Bench pos={[0, 0, -0.2]} />
      <Sign text="DURAK" pos={[0, 2.95, 0.1]} w={1.5} h={0.4} bg={M.yellow} fg={M.ink} />
    </group>
    {/* bekçi kulübesi */}
    <group position={[-2.6, 0, -2.2]}>
      <BaseBox size={[3.0, 2.4, 2.6]} pos={[0, 0, 0]} color={M.navy} />
      <BaseBox size={[3.4, 0.2, 3.0]} pos={[0, 2.4, 0]} color={M.greyDark} />
      <BaseBox size={[1.0, 1.7, 0.06]} pos={[0.6, 0.1, 1.33]} color={M.woodDark} />
      <BaseBox size={[0.9, 0.8, 0.06]} pos={[-0.8, 0.9, 1.33]} color={M.glass} />
      <Sign text="BEKÇİ" pos={[0, 2.95, 1.0]} w={1.6} h={0.45} bg={M.navy} fg={M.white} />
    </group>
    <MCar pos={[-2.6, 0, 3.2]} rotY={Math.PI / 2} taxi />
    <MCar pos={[2.8, 0, -2.6]} rotY={0} van />
    <MLamp pos={[4.2, 0, 1.0]} rotY={Math.PI} />
    <Cyl r={0.06} h={2.8} pos={[4.2, 0, 3.8]} color={M.ink} seg={4} />
  </group>
);

/* ------------------------------------------------------------------ MEYDAN (çınar, çeşme, banklar) */
export const Meydan: React.FC<VP & { market?: boolean }> = ({ frame, market }) => {
  const S = useSeason();
  const sway = Math.sin(frame / 40) * 0.03;
  return (
    <group>
      <BaseBox size={[9.6, 0.05, 9.6]} pos={[0, 0, 0]} color={S.snow ? S.pave : M.plaza} />
      {/* desenli halka */}
      <Cyl r={4.2} h={0.03} pos={[0, 0.05, 0.6]} color={S.snow ? "#CBD6E0" : M.paveDark} seg={14} />
      {/* çınar */}
      <group position={[-2.6, 0, -1.8]} rotation={[0, 0, sway]}>
        <Cyl r={0.7} rTop={0.45} h={3.2} color={M.woodDark} seg={6} />
        {[[0, 4.6, 0, 2.6], [1.6, 4.0, 0.6, 1.8], [-1.5, 4.1, 0.8, 1.7], [0.2, 5.7, -0.3, 1.8], [0.4, 4.2, -1.5, 1.7]].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} material={mat(S.leaves[i % 3])} visible={!S.bare}>
            <icosahedronGeometry args={[r, 0]} />
          </mesh>
        ))}
        {S.bare && [0, 1, 2, 3, 4, 5].map((i) => (
          <group key={i} position={[0, 3.0 + (i % 3) * 0.5, 0]} rotation={[0, i * 1.05, 0]}>
            <Box size={[0.22, 2.4, 0.22]} pos={[0.9, 1.0, 0]} rot={[0, 0, -0.85]} color={M.woodDark} />
            <mesh position={[1.9, 1.95, 0]} material={mat(SNOW)}>
              <icosahedronGeometry args={[0.4, 0]} />
            </mesh>
          </group>
        ))}
        <Shadow pos={[0, 0, 0]} size={[4.4, 4.4]} opacity={0.2} />
      </group>
      {/* çeşme */}
      <group position={[1.2, 0, 2.6]}>
        <Cyl r={0.8} h={0.5} color={M.grey} seg={8} />
        <Cyl r={0.65} h={0.08} pos={[0, 0.5, 0]} color={M.sky} seg={8} />
        <Cyl r={0.12} h={1.1} color={M.grey} seg={6} />
        <mesh position={[0, 1.2, 0]} material={mat(M.sky)}>
          <icosahedronGeometry args={[0.22, 0]} />
        </mesh>
      </group>
      <Bench pos={[-2.6, 0, 2.2]} rotY={0} />
      <Bench pos={[3.6, 0, 0.8]} rotY={Math.PI / 2} />
      {/* afiş panosu */}
      <group position={[3.8, 0, 3.7]}>
        <BaseBox size={[0.12, 1.9, 0.12]} pos={[-0.7, 0, 0]} color={M.ink} />
        <BaseBox size={[0.12, 1.9, 0.12]} pos={[0.7, 0, 0]} color={M.ink} />
        <BaseBox size={[1.9, 1.1, 0.1]} pos={[0, 0.8, 0]} color={M.cream} />
        <Box size={[0.5, 0.35, 0.03]} pos={[-0.4, 1.55, 0.08]} color={M.red} />
        <Box size={[0.5, 0.35, 0.03]} pos={[0.3, 1.4, 0.08]} color={M.blue} />
        <Box size={[0.4, 0.5, 0.03]} pos={[0.5, 1.15, 0.08]} color={M.yellow} />
      </group>
      <StringLights from={[-4.6, 3.6, 4.4]} to={[4.6, 3.6, 4.4]} n={12} frame={frame} sag={0.6} />
      <Cyl r={0.05} h={3.6} pos={[-4.6, 0, 4.4]} color={M.ink} seg={4} />
      <Cyl r={0.05} h={3.6} pos={[4.6, 0, 4.4]} color={M.ink} seg={4} />
      {market &&
        [[-1.0, 1.4], [1.6, 1.4], [-3.6, 3.6]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <BaseBox size={[2.0, 0.8, 1.0]} pos={[0, 0, 0]} color={M.wood} />
            <Crate pos={[-0.5, 0.8, 0]} goods={[M.red, M.orange, M.leaf][i % 3]} />
            <Crate pos={[0.5, 0.8, 0]} goods={[M.yellow, M.leaf3, M.red][i % 3]} />
            <BaseBox size={[2.3, 0.1, 1.5]} pos={[0, 2.4, -0.2]} color={[M.red, M.blue, M.mustard][i % 3]} />
            <BaseBox size={[0.08, 2.4, 0.08]} pos={[-1.05, 0, -0.8]} color={M.ink} />
            <BaseBox size={[0.08, 2.4, 0.08]} pos={[1.05, 0, -0.8]} color={M.ink} />
          </group>
        ))}
    </group>
  );
};

/* ------------------------------------------------------------------ DOLGU BLOKLARI */
const FILL_COLORS: Record<string, string> = { cream: M.cream, lilac: M.lilac, mint: "#B9D8A8", sky: M.sky, mustard: M.mustard, rose: M.rose };

const House: React.FC<{ seed: number; color: string }> = ({ seed, color }) => {
  const S = useSeason();
  const { frame } = useLight();
  const shut = [M.green, M.blue, M.woodDark][seed % 3];
  const w = 6.2, d = 5.4, floors = 2, fh = 2.7, h = floors * fh;
  const wall = FILL_COLORS[color] ?? M.cream;
  return (
    <group>
      <BaseBox size={[10, 0.05, 10]} pos={[0, 0, 0]} color={S.grass} />
      <group position={[-0.6, 0, -1.6]}>
        <TBase size={[w + 0.2, 0.4, d + 0.2]} pos={[0, 0, 0]} color="#CFC4AE" tex="stone" />
        <TBase size={[w, h, d]} pos={[0, 0.4, 0]} color={wall} tex={rand(seed, 8) > 0.6 ? "brick" : "plaster"} />
        <group position={[0, 0.4, 0]}>
          <Facade w={w} d={d} floors={floors} floorH={fh} face="z" seed={seed} cols={2} winW={0.9} winH={1.2} skipGround frameColor={M.white} shutters={shut} />
          <Facade w={w} d={d} floors={floors} floorH={fh} face="x" seed={seed + 1} cols={2} winW={0.9} winH={1.2} frameColor={M.white} shutters={shut} />
        </group>
        <BaseBox size={[1.0, 1.9, 0.12]} pos={[-1.3, 0.4, d / 2 + 0.02]} color={M.woodDark} />
        <BaseBox size={[1.6, 0.14, 0.9]} pos={[-1.3, 2.4, d / 2 + 0.4]} color={M.roofTile} />
        <Box size={[0.9, 0.08, 0.5]} pos={[1.6, 1.3, d / 2 + 0.3]} color={M.white} />
        <HipRoof pos={[0, h + 0.4, 0]} w={w} d={d} h={2.3} color={rand(seed, 3) > 0.5 ? M.roofTile : M.terracotta} />
        <TBase size={[0.6, 1.4, 0.6]} pos={[1.4, h + 0.9, -0.8]} color={M.brickDark} tex="brick" tile={1.0} />
        <Smoke pos={[1.4, h + 2.3, -0.8]} frame={frame} />
      </group>
      <Fence from={[-4.6, 0.05, 4.6]} to={[4.6, 0.05, 4.6]} />
      <Fence from={[4.6, 0.05, 4.6]} to={[4.6, 0.05, -2.0]} />
      <Cypress pos={[3.8, 0.05, -3.8]} seed={seed} />
      <Cypress pos={[-4.0, 0.05, 3.0]} seed={seed + 1} scale={0.9} />
      <MTree pos={[3.6, 0.05, 2.6]} seed={seed + 2} scale={0.85} tone={1} />
      <Pot pos={[-3.2, 0.05, 3.7]} flower={M.red} />
      <Pot pos={[0.6, 0.05, 3.9]} flower={M.yellow} />
    </group>
  );
};

export const FillerBlock: React.FC<{ type: "block" | "house" | "garden" | "veg" | "parking" | "grove"; floors?: number; color?: string; seed: number }> = ({ type, floors = 3, color = "cream", seed }) => {
  const S = useSeason();
  if (type === "house") return <House seed={seed} color={color} />;
  if (type === "block") {
    const w = 7.5, d = 7;
    const col = FILL_COLORS[color] ?? M.cream;
    return (
      <group position={[0, 0, -0.3]}>
        <Block w={w} d={d} h={floors * 3} color={col} trim={M.white} />
        <Facade w={w} d={d} floors={floors} face="z" seed={seed} cols={3} frameColor={M.white} />
        <Facade w={w} d={d} floors={floors} face="x" seed={seed + 1} cols={3} frameColor={M.white} />
        <BaseBox size={[1.4, 2.2, 0.1]} pos={[1.2, 0, d / 2 + 0.02]} color={M.woodDark} />
        {[-1.6, 0, 1.6].map((x, i) => (
          <Box key={i} size={[1.3, 0.1, 0.5]} pos={[x, floors * 3 + 0.5, d / 2 - 0.4]} color={M.grey} />
        ))}
        <WaterTank pos={[-1.8, floors * 3 + 0.35, -1.5]} />
        <Antenna pos={[2.0, floors * 3 + 0.35, -1.8]} />
      </group>
    );
  }
  if (type === "garden") {
    return (
      <group>
        <BaseBox size={[9.4, 0.05, 9.4]} pos={[0, 0, 0]} color={S.grassDark} />
        <BaseBox size={[1.2, 0.07, 9.4]} pos={[0.6, 0, 0]} color={M.paveDark} />
        <MTree pos={[-3.2, 0, -3]} seed={seed} tone={1} scale={1.1} />
        <MTree pos={[3.4, 0, -3.4]} seed={seed + 1} tone={0} />
        <Cypress pos={[-3.4, 0, 3.0]} seed={seed + 2} />
        <Cypress pos={[-2.2, 0, -0.6]} seed={seed + 3} scale={0.8} />
        <Bench pos={[3.2, 0, 2.4]} rotY={Math.PI / 2} />
        <Pot pos={[2.2, 0, 3.8]} flower={M.rose} />
        <Fence from={[-4.6, 0, 4.6]} to={[4.6, 0, 4.6]} />
      </group>
    );
  }
  if (type === "veg") {
    return (
      <group>
        <BaseBox size={[9.4, 0.05, 9.4]} pos={[0, 0, 0]} color={S.dirt} />
        {[-2.8, -0.6, 1.6].map((z, i) => (
          <group key={i}>
            <BaseBox size={[6.4, 0.35, 1.4]} pos={[-0.6, 0.05, z - 0.8]} color={M.woodDark} />
            {Array.from({ length: 10 }, (_, k) => (
              <mesh key={k} position={[-3.4 + k * 0.62, 0.55, z - 0.8 + (k % 2 ? 0.25 : -0.25)]} material={mat([M.leaf, M.red, M.leaf3, M.orange][(i + k) % 4])}>
                <icosahedronGeometry args={[0.24, 0]} />
              </mesh>
            ))}
          </group>
        ))}
        <BaseBox size={[2.0, 1.8, 2.0]} pos={[3.2, 0.05, 2.6]} color={M.sand} />
        <HipRoof pos={[3.2, 1.85, 2.6]} w={2.0} d={2.0} h={1.1} />
        <Cypress pos={[-3.8, 0, 3.6]} seed={seed} />
        <MTree pos={[3.6, 0, -3.4]} seed={seed + 1} scale={0.9} />
        <Fence from={[-4.6, 0, 4.6]} to={[4.6, 0, 4.6]} />
      </group>
    );
  }
  if (type === "parking") {
    const cols = [M.sky, M.rose, M.mint, M.orange, M.lilac, M.sand];
    return (
      <group>
        <BaseBox size={[9.6, 0.04, 9.6]} pos={[0, 0, 0]} color={M.asphaltDark} />
        {[-3.2, -1.1, 1.0, 3.1].map((x, i) =>
          rand(seed, i) > 0.2 ? <MCar key={i} pos={[x, 0.04, -2.6]} rotY={0} color={cols[Math.floor(rand(seed, i + 9) * cols.length)]} /> : null,
        )}
        {[-3.2, -1.1, 1.0, 3.1].map((x, i) =>
          rand(seed, i + 20) > 0.3 ? <MCar key={`b${i}`} pos={[x, 0.04, 2.4]} rotY={Math.PI} color={cols[Math.floor(rand(seed, i + 40) * cols.length)]} /> : null,
        )}
        {[-3.2, -1.1, 1.0, 3.1].map((x) => (
          <BaseBox key={x} size={[0.08, 0.02, 3.2]} pos={[x + 1.05, 0.05, -2.6]} color={M.white} />
        ))}
        <MTree pos={[3.8, 0.04, 3.8]} seed={seed} scale={0.9} />
      </group>
    );
  }
  return (
    <group>
      <BaseBox size={[9.4, 0.05, 9.4]} pos={[0, 0, 0]} color={S.grass} />
      {[[-3, -3], [0.8, -3.4], [3.4, -1.6], [-2.6, 1.0], [1.2, 1.6], [-0.4, 3.6], [3.4, 3.4]].map(([x, z], i) =>
        i % 2 ? <Cypress key={i} pos={[x, 0, z]} seed={seed + i} /> : <MTree key={i} pos={[x, 0, z]} seed={seed + i} tone={(i % 3) as 0 | 1 | 2} scale={0.95} />,
      )}
    </group>
  );
};
