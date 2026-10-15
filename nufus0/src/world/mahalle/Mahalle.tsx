// MAHALLE sahnesi: zemin + 12 mekân + sokak donanımı + ışık ön ayarı + (isteğe bağlı) karakterler / vurgu.
// Veri kaynağı: neighborhood.json (hücreler) → layout.ts. Deterministik: yalnızca `frame` ve props.
import React from "react";
import * as THREE from "three";
import { IsoCam, IsoCamera } from "../camera";
import { BaseBox, Box, Cyl, Glow } from "../primitives";
import { mat } from "../materials";
import { Bench, LightCtx, MCar, MLamp, MTree, Paving } from "./kit";
import { CELL, COLS, FILLERS, ROWS, SIDEWALK, VENUES, WORLD_D, WORLD_W, cellCenter, venue } from "./layout";
import { LIGHTS, LightId, M } from "./palette";
import { Ambient, CastEntry, Person, Pet } from "./People";
import { Bakkal, CayOcagi, Doner, Durak, FillerBlock, Firin, GulApt, Kuafor, Meydan, PasajHan, Park, Teras7, YildizApt } from "./venues";
import { STATIONS } from "./layout";
import { pulse, rand } from "../../utils/deterministic";

const COMPONENTS: Record<string, React.FC<{ frame: number; market?: boolean }>> = {
  meydan: Meydan, "cay-ocagi": CayOcagi, bakkal: Bakkal, doner: Doner, kuafor: Kuafor, "yildiz-apt": YildizApt, "gul-apt": GulApt,
  "pasaj-han": PasajHan, teras7: Teras7, park: Park, firin: Firin, durak: Durak,
};

export const DEFAULT_CAST: CastEntry[] = Object.keys(STATIONS).filter((id) => id !== "karabas").map((id) => ({ id }));

const SLAB_TOP = 0.15;
const SLAB_COLORS: Record<string, string> = { meydan: M.plaza, park: M.grass, durak: M.pave };

/** Kayalık yüzen ada: üstte toprak, aşağı doğru daralan katmanlar + kenarlarda taş kayalar. */
const IslandBase: React.FC = () => {
  const W = WORLD_W + 6, D = WORLD_D + 6;
  const rocks: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const onFront = i % 2 === 0;
    const t = (rand(7, i) - 0.5) * 0.92;
    const layer = i % 3;
    const y = -0.9 - layer * 1.5 - rand(8, i) * 0.4;
    const r = 0.7 + rand(9, i) * 0.9;
    const inset = layer * 1.4;
    const pos: [number, number, number] = onFront ? [t * (W - inset * 2), y, D / 2 - inset + 0.2] : [W / 2 - inset + 0.2, y, t * (D - inset * 2)];
    rocks.push(
      <mesh key={i} position={pos} material={mat(["#9A8068", "#8A7059", "#A68C72"][i % 3])} scale={[1, 0.85, 1]}>
        <icosahedronGeometry args={[r, 0]} />
      </mesh>,
    );
  }
  return (
    <group>
      <BaseBox size={[W, 1.55, D]} pos={[0, -1.6, 0]} color="#8C6B4B" />
      <BaseBox size={[W - 2.8, 1.6, D - 2.8]} pos={[0, -3.2, 0]} color="#745A40" />
      <BaseBox size={[W - 7, 1.7, D - 7]} pos={[0, -4.9, 0]} color="#5F4A35" />
      <BaseBox size={[W - 13, 1.2, D - 13]} pos={[0, -6.1, 0]} color="#4F3E2D" />
      {rocks}
    </group>
  );
};

const Ground: React.FC = () => {
  const cells: React.ReactNode[] = [];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const [cx, cz] = cellCenter(c, r);
      const own = VENUES.find((v) => v.cell[0] === c && v.cell[1] === r && SLAB_COLORS[v.id]);
      cells.push(<BaseBox key={`${c}-${r}`} size={[SIDEWALK, SLAB_TOP, SIDEWALK]} pos={[cx, 0, cz]} color={own ? SLAB_COLORS[own.id] : M.pave} />);
      cells.push(<BaseBox key={`k${c}-${r}`} size={[SIDEWALK + 0.3, 0.1, SIDEWALK + 0.3]} pos={[cx, 0, cz]} color={M.curb} />);
      if (!own || own.id === "durak") cells.push(
        <group key={`p${c}-${r}`} position={[cx, SLAB_TOP, cz]}><Paving size={SIDEWALK - 0.1} y={0.006} /></group>,
      );
    }
  }
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
      <IslandBase />
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
  /** Yalnız bu mekânın hücresini yüzen ada olarak göster ("mekân kartı"). */
  solo?: string | null;
};

/** Tek hücrelik yüzen ada (kayalık taban + döşeme). */
const SoloBase: React.FC<{ cell: [number, number] }> = ({ cell }) => {
  const [cx, cz] = cellCenter(cell[0], cell[1]);
  const W = SIDEWALK + 1.2;
  return (
    <group position={[cx, 0, cz]}>
      <BaseBox size={[W, 1.3, W]} pos={[0, -1.35, 0]} color="#8C6B4B" />
      <BaseBox size={[W - 2.2, 1.5, W - 2.2]} pos={[0, -2.85, 0]} color="#745A40" />
      <BaseBox size={[W - 5, 1.3, W - 5]} pos={[0, -4.15, 0]} color="#5F4A35" />
      {Array.from({ length: 12 }, (_, i) => {
        const front = i % 2 === 0;
        const t = (rand(3, i) - 0.5) * 0.9;
        const layer = i % 3;
        const pos: [number, number, number] = front ? [t * (W - layer * 2), -1.0 - layer * 1.4, W / 2 - layer * 1.1 + 0.15] : [W / 2 - layer * 1.1 + 0.15, -1.0 - layer * 1.4, t * (W - layer * 2)];
        return (
          <mesh key={i} position={pos} material={mat(["#9A8068", "#8A7059", "#A68C72"][i % 3])} scale={[1, 0.85, 1]}>
            <icosahedronGeometry args={[0.55 + rand(4, i) * 0.6, 0]} />
          </mesh>
        );
      })}
      <BaseBox size={[SIDEWALK + 0.6, SLAB_TOP + 0.05, SIDEWALK + 0.6]} pos={[0, -0.05, 0]} color={M.curb} />
      <BaseBox size={[SIDEWALK, SLAB_TOP, SIDEWALK]} pos={[0, 0, 0]} color={M.pave} />
      <group position={[0, SLAB_TOP, 0]}><Paving size={SIDEWALK - 0.1} y={0.006} /></group>
    </group>
  );
};

export const Mahalle: React.FC<{ frame: number } & MahalleParams> = ({ frame, light, highlight, cast = "default", pets = true, ambient = true, market, solo }) => {
  const lp = LIGHTS[light];
  let people = cast === "none" ? [] : cast === "default" ? DEFAULT_CAST : cast;
  const soloCell = solo ? venue(solo).cell : null;
  const inSolo = (x: number, z: number) => {
    if (!soloCell) return true;
    const [cx, cz] = cellCenter(soloCell[0], soloCell[1]);
    return Math.abs(x - cx) < 6 && Math.abs(z - cz) < 6;
  };
  if (soloCell) people = people.filter((p) => inSolo(p.pos?.[0] ?? STATIONS[p.id]?.x ?? 0, p.pos?.[1] ?? STATIONS[p.id]?.z ?? 0));
  const centers: Record<string, [number, number]> = {};
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) centers[`${c},${r}`] = cellCenter(c, r);
  return (
    <LightCtx.Provider value={{ light: lp, frame }}>
      <color attach="background" args={[lp.bg]} />
      <fog attach="fog" args={[lp.bg, lp.fogNear, lp.fogFar]} />
      <hemisphereLight args={[lp.hemiSky, lp.hemiGround, lp.hemiI]} />
      <directionalLight position={lp.sunPos} intensity={lp.sunI} color={lp.sun} />
      <directionalLight position={[-lp.sunPos[0], lp.sunPos[1] * 0.6, -lp.sunPos[2]]} intensity={lp.fillI} color={lp.fill} />
      {soloCell ? <SoloBase cell={soloCell} /> : (<><Ground /><StreetFurniture /></>)}
      {VENUES.filter((v) => !soloCell || (v.cell[0] === soloCell[0] && v.cell[1] === soloCell[1])).map((v) => {
        const C = COMPONENTS[v.id];
        if (!C) return null;
        const y = v.id === "teras7" ? SLAB_TOP + v.top : SLAB_TOP;
        return (
          <group key={v.id} position={[v.origin[0], y, v.origin[1]]}>
            <C frame={frame} market={market} />
          </group>
        );
      })}
      {!soloCell && FILLERS.map((f) => {
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
      {pets && cast !== "none" && !soloCell && (
        <>
          <Pet kind="dog" pos={[STATIONS.karabas.x, 0, STATIONS.karabas.z]} rot={STATIONS.karabas.rot} frame={frame} />
          <Pet kind="cat" pos={[STATIONS.hacer.x + 0.9, STATIONS.hacer.y, STATIONS.hacer.z]} rot={-0.4} frame={frame} />
        </>
      )}
      {ambient && cast !== "none" && !soloCell && <Ambient frame={frame} centers={centers} />}
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
