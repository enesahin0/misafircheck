// MAHALLE sahnesi: zemin + 12 mekân + sokak donanımı + ışık ön ayarı + (isteğe bağlı) karakterler / vurgu.
// Veri kaynağı: neighborhood.json (hücreler) → layout.ts. Deterministik: yalnızca `frame` ve props.
import React from "react";
import * as THREE from "three";
import { IsoCam, IsoCamera } from "../camera";
import { BaseBox, Box, Cyl, Glow } from "../primitives";
import { mat } from "../materials";
import { Bench, LightCtx, MCar, MLamp, MTree } from "./kit";
import { CELL, COLS, FILLERS, ROWS, SIDEWALK, VENUES, WORLD_D, WORLD_W, cellCenter, venue } from "./layout";
import { LIGHTS, LightId, M } from "./palette";
import { Ambient, CastEntry, Person, Pet } from "./People";
import { Bakkal, CayOcagi, Doner, Durak, FillerBlock, Firin, GulApt, Kuafor, Meydan, PasajHan, Park, Teras7, YildizApt } from "./venues";
import { STATIONS } from "./layout";
import { pulse } from "../../utils/deterministic";

const COMPONENTS: Record<string, React.FC<{ frame: number; market?: boolean }>> = {
  meydan: Meydan, "cay-ocagi": CayOcagi, bakkal: Bakkal, doner: Doner, kuafor: Kuafor, "yildiz-apt": YildizApt, "gul-apt": GulApt,
  "pasaj-han": PasajHan, teras7: Teras7, park: Park, firin: Firin, durak: Durak,
};

export const DEFAULT_CAST: CastEntry[] = Object.keys(STATIONS).filter((id) => id !== "karabas").map((id) => ({ id }));

const SLAB_TOP = 0.15;
const SLAB_COLORS: Record<string, string> = { meydan: M.plaza, park: M.grass, durak: M.pave };

const Ground: React.FC = () => {
  const cells: React.ReactNode[] = [];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const [cx, cz] = cellCenter(c, r);
      const own = VENUES.find((v) => v.cell[0] === c && v.cell[1] === r && SLAB_COLORS[v.id]);
      cells.push(<BaseBox key={`${c}-${r}`} size={[SIDEWALK, SLAB_TOP, SIDEWALK]} pos={[cx, 0, cz]} color={own ? SLAB_COLORS[own.id] : M.pave} />);
      // bordür
      cells.push(<BaseBox key={`k${c}-${r}`} size={[SIDEWALK + 0.3, 0.1, SIDEWALK + 0.3]} pos={[cx, 0, cz]} color={M.curb} />);
    }
  }
  // yol çizgileri (hücreler arası boşluklar)
  const dashes: React.ReactNode[] = [];
  for (let i = 0; i <= COLS; i++) {
    const x = -WORLD_W / 2 + i * CELL;
    for (let k = 0; k < WORLD_D / 3; k++) dashes.push(<BaseBox key={`vx${i}-${k}`} size={[0.12, 0.03, 1.2]} pos={[x, 0.02, -WORLD_D / 2 + 1.5 + k * 3]} color={M.lineYellow} />);
  }
  for (let j = 0; j <= ROWS; j++) {
    const z = -WORLD_D / 2 + j * CELL;
    for (let k = 0; k < WORLD_W / 3; k++) dashes.push(<BaseBox key={`hz${j}-${k}`} size={[1.2, 0.03, 0.12]} pos={[-WORLD_W / 2 + 1.5 + k * 3, 0.02, z]} color={M.lineYellow} />);
  }
  return (
    <group>
      <BaseBox size={[WORLD_W + 6, 2.16, WORLD_D + 6]} pos={[0, -2.2, 0]} color={M.dirt} />
      <BaseBox size={[WORLD_W + 6, 0.04, WORLD_D + 6]} pos={[0, -0.04, 0]} color={M.asphalt} />
      {dashes}
      {cells}
    </group>
  );
};

/** Sokak donanımı: ağaçlar, lambalar, park halindeki arabalar (deterministik yerleşim). */
const StreetFurniture: React.FC = () => {
  const out: React.ReactNode[] = [];
  let n = 0;
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const [cx, cz] = cellCenter(c, r);
      n++;
      out.push(<MLamp key={`l${c}-${r}`} pos={[cx + 4.7, SLAB_TOP, cz + 4.7]} rotY={Math.PI * 0.75} />);
      if ((c + r) % 2 === 0 && !VENUES.some((v) => v.cell[0] === c && v.cell[1] === r && ["park", "meydan"].includes(v.id))) {
        out.push(<MTree key={`t${c}-${r}`} pos={[cx - 4.4, SLAB_TOP, cz + 4.4]} seed={n} tone={(n % 3) as 0 | 1 | 2} scale={0.85} />);
      }
    }
  }
  // park halindeki arabalar (yol boşluğunda)
  const zLine = (j: number) => -WORLD_D / 2 + j * CELL;
  const xLine = (i: number) => -WORLD_W / 2 + i * CELL;
  const cars: { p: [number, number]; rot: number; color?: string; taxi?: boolean }[] = [
    { p: [xLine(1) + 1.2, zLine(2) - 14], rot: 0, color: M.sky }, { p: [-22, zLine(2) + 0.6], rot: Math.PI / 2, color: M.rose },
    { p: [10, zLine(3) - 0.6], rot: -Math.PI / 2, color: M.mint }, { p: [xLine(5) - 0.6, -6], rot: 0, color: M.orange },
    { p: [30, zLine(4) - 0.6], rot: Math.PI / 2, taxi: true },
  ];
  cars.forEach((c, i) => out.push(<MCar key={`car${i}`} pos={[c.p[0], 0, c.p[1]]} rotY={c.rot} color={c.color} taxi={c.taxi} />));
  return <>{out}</>;
};

/** "Olay burada" vurgusu: ışık sütunu + yer halkası (establishing). */
const Beacon: React.FC<{ id: string; frame: number }> = ({ id, frame }) => {
  const v = venue(id);
  const k = 0.6 + 0.4 * pulse(frame, 36);
  return (
    <group position={[v.origin[0], v.top + SLAB_TOP, v.origin[1]]}>
      <mesh position={[0, 7, 0]} renderOrder={6}>
        <cylinderGeometry args={[0.9, 1.6, 14, 12, 1, true]} />
        <meshBasicMaterial color={M.warm} transparent opacity={0.14 * k} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Glow pos={[0, 0.1, 0]} size={v.place.w * 1.9} color={M.warm} opacity={0.55 * k} />
    </group>
  );
};

export type MahalleParams = {
  light: LightId;
  highlight?: string | null;
  cast?: CastEntry[] | "default" | "none";
  pets?: boolean;
  ambient?: boolean;
  market?: boolean;
};

export const Mahalle: React.FC<{ frame: number } & MahalleParams> = ({ frame, light, highlight, cast = "default", pets = true, ambient = true, market }) => {
  const lp = LIGHTS[light];
  const people = cast === "none" ? [] : cast === "default" ? DEFAULT_CAST : cast;
  const centers: Record<string, [number, number]> = {};
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) centers[`${c},${r}`] = cellCenter(c, r);
  return (
    <LightCtx.Provider value={{ light: lp, frame }}>
      <color attach="background" args={[lp.bg]} />
      <fog attach="fog" args={[lp.bg, lp.fogNear, lp.fogFar]} />
      <hemisphereLight args={[lp.hemiSky, lp.hemiGround, lp.hemiI]} />
      <directionalLight position={lp.sunPos} intensity={lp.sunI} color={lp.sun} />
      <directionalLight position={[-lp.sunPos[0], lp.sunPos[1] * 0.6, -lp.sunPos[2]]} intensity={lp.fillI} color={lp.fill} />
      <Ground />
      <StreetFurniture />
      {VENUES.map((v) => {
        const C = COMPONENTS[v.id];
        if (!C) return null;
        const y = v.id === "teras7" ? SLAB_TOP + v.top : SLAB_TOP;
        return (
          <group key={v.id} position={[v.origin[0], y, v.origin[1]]}>
            <C frame={frame} market={market} />
          </group>
        );
      })}
      {FILLERS.map((f) => {
        const [cx, cz] = cellCenter(f.cell[0], f.cell[1]);
        return (
          <group key={`f${f.cell}`} position={[cx, SLAB_TOP, cz]}>
            <FillerBlock type={f.type} floors={f.floors} color={f.color} seed={f.seed} />
          </group>
        );
      })}
      {people.map((p) => (
        <Person key={p.id} entry={p} frame={frame} />
      ))}
      {pets && cast !== "none" && (
        <>
          <Pet kind="dog" pos={[STATIONS.karabas.x, 0, STATIONS.karabas.z]} rot={STATIONS.karabas.rot} frame={frame} />
          <Pet kind="cat" pos={[STATIONS.hacer.x + 0.9, STATIONS.hacer.y, STATIONS.hacer.z]} rot={-0.4} frame={frame} />
        </>
      )}
      {ambient && cast !== "none" && <Ambient frame={frame} centers={centers} />}
      {highlight && <Beacon id={highlight} frame={frame} />}
    </LightCtx.Provider>
  );
};

export const MahalleScene: React.FC<{ frame: number; params: MahalleParams; camera: IsoCam }> = ({ frame, params, camera }) => (
  <>
    <IsoCamera {...camera} />
    <Mahalle frame={frame} {...params} />
  </>
);
