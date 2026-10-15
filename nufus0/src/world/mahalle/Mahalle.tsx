// MAHALLE sahnesi: düzensiz parseller + farklı tipte yollar (map.json) + mekânlar + sokak donanımı + ışık/mevsim.
// Deterministik: yalnızca `frame` ve props.
import React from "react";
import * as THREE from "three";
import { IsoCam, IsoCamera } from "../camera";
import { BaseBox, Box, Glow } from "../primitives";
import { mat } from "../materials";
import { Bench, Cypress, LightCtx, MCar, MLamp, MTree, PavingRect, Pot, useSeason } from "./kit";
import { MAP, Parcel, Road, STATIONS, WORLD_CX, WORLD_CZ, WORLD_D, WORLD_W, parcelById, parcelOf, parcelTop, rectCenter, rectSize, venue } from "./layout";
import { LightId, M } from "./palette";
import { SEASONS, SeasonId, lightFor } from "./seasons";
import { Ambient, CastEntry, Person, Pet } from "./People";
import { Bakkal, CayOcagi, Doner, Durak, Firin, GulApt, Kuafor, Meydan, ParcelFiller, PasajHan, Park, Teras7, YildizApt } from "./venues";
import { pulse, rand } from "../../utils/deterministic";

type VComp = React.FC<{ frame: number; market?: boolean; w: number; d: number }>;
const COMPONENTS: Record<string, VComp> = {
  meydan: Meydan, "cay-ocagi": CayOcagi, bakkal: Bakkal, doner: Doner, kuafor: Kuafor, "yildiz-apt": YildizApt, "gul-apt": GulApt,
  "pasaj-han": PasajHan, teras7: Teras7, park: Park, firin: Firin, durak: Durak,
};

export const DEFAULT_CAST: CastEntry[] = Object.keys(STATIONS).filter((id) => id !== "karabas").map((id) => ({ id }));

const ROAD_TOP = 0.03;
const inRect = (x: number, z: number, r: { x0: number; x1: number; z0: number; z1: number }, m = 0) => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
const onRoad = (x: number, z: number, m = 0) => MAP.roads.some((r) => inRect(x, z, r, m));

/* ------------------------------------------------------------------ ada tabanı */
/** Kayalık yüzen ada: üstte çim kenar, aşağı doğru daralan toprak katmanları + öndeki yüzlerde taş kayalar. */
const IslandBase: React.FC<{ cx: number; cz: number; w: number; d: number; seed?: number }> = ({ cx, cz, w, d, seed = 7 }) => {
  const S = useSeason();
  const W = w + 2.4, D = d + 2.4;
  const rocks: React.ReactNode[] = [];
  const nRocks = Math.round((W + D) / 4.2);
  for (let i = 0; i < nRocks; i++) {
    const onFront = i % 2 === 0;
    const t = (rand(seed, i) - 0.5) * 0.92;
    const layer = i % 3;
    const y = -0.9 - layer * 1.5 - rand(seed + 1, i) * 0.4;
    const r = 0.7 + rand(seed + 2, i) * 0.9;
    const inset = layer * 1.4;
    const pos: [number, number, number] = onFront ? [cx + t * (W - inset * 2), y, cz + D / 2 - inset + 0.2] : [cx + W / 2 - inset + 0.2, y, cz + t * (D - inset * 2)];
    rocks.push(
      <mesh key={i} position={pos} material={mat(["#9A8068", "#8A7059", "#A68C72"][i % 3])} scale={[1, 0.85, 1]}>
        <icosahedronGeometry args={[r, 0]} />
      </mesh>,
    );
  }
  return (
    <group>
      <BaseBox size={[W, 0.04, D]} pos={[cx, -0.08, cz]} color={S.grassDark} />
      <BaseBox size={[W, 1.52, D]} pos={[cx, -1.6, cz]} color="#8C6B4B" />
      <BaseBox size={[W - 2.8, 1.6, D - 2.8]} pos={[cx, -3.2, cz]} color="#745A40" />
      <BaseBox size={[Math.max(4, W - 7), 1.7, Math.max(4, D - 7)]} pos={[cx, -4.9, cz]} color="#5F4A35" />
      <BaseBox size={[Math.max(3, W - 13), 1.2, Math.max(3, D - 13)]} pos={[cx, -6.1, cz]} color="#4F3E2D" />
      {rocks}
    </group>
  );
};

/* ------------------------------------------------------------------ yollar */
const isLong = (r: Road) => r.x1 - r.x0 >= r.z1 - r.z0;

const RoadMarks: React.FC<{ r: Road }> = ({ r }) => {
  if (r.type !== "ana") return null;
  const [cx, cz] = rectCenter(r);
  const long = isLong(r);
  const L = long ? r.x1 - r.x0 : r.z1 - r.z0;
  const out: React.ReactNode[] = [];
  const step = 3.4;
  for (let k = 0; k < L / step; k++) {
    const t = -L / 2 + 1.7 + k * step;
    const x = long ? cx + t : cx, z = long ? cz : cz + t;
    if (MAP.roads.some((o) => o.id !== r.id && inRect(x, z, o, 0.8))) continue;
    out.push(<BaseBox key={k} size={long ? [1.7, 0.012, 0.14] : [0.14, 0.012, 1.7]} pos={[x, ROAD_TOP, z]} color={M.lineYellow} />);
  }
  return <>{out}</>;
};

const Crosswalk: React.FC<{ x: number; z0: number; z1: number }> = ({ x, z0, z1 }) => (
  <>
    {Array.from({ length: Math.floor((z1 - z0) / 0.9) }, (_, i) => (
      <BaseBox key={i} size={[1.1, 0.012, 0.45]} pos={[x, ROAD_TOP, z0 + 0.6 + i * 0.9]} color={M.white} />
    ))}
  </>
);

const Roads: React.FC = () => {
  const S = useSeason();
  return (
    <group>
      {MAP.roads.map((r) => {
        const [cx, cz] = rectCenter(r);
        const [w, d] = rectSize(r);
        if (r.type === "patika") {
          return (
            <group key={r.id} position={[cx, 0, cz]}>
              <BaseBox size={[w, 0.14, d]} pos={[0, -0.04, 0]} color={S.pave} />
              <group position={[0, 0.1, 0]}><PavingRect w={w} d={d} y={0.005} /></group>
            </group>
          );
        }
        return (
          <group key={r.id}>
            <BaseBox size={[w, 0.07, d]} pos={[cx, -0.04, cz]} color={S.asphalt} />
            <RoadMarks r={r} />
          </group>
        );
      })}
      {/* yaya geçitleri (çift şeritli ana caddede) */}
      <Crosswalk x={-5.2} z0={-4} z1={2} />
      <Crosswalk x={12.5} z0={-4} z1={2} />
    </group>
  );
};

/* ------------------------------------------------------------------ parseller */
const groundColor = (S: ReturnType<typeof useSeason>, g: Parcel["ground"]) => (g === "plaza" ? (S.snow ? S.pave : M.plaza) : g === "grass" ? S.grass : g === "dirt" ? S.dirt : S.pave);

const ParcelSlab: React.FC<{ p: Parcel; edges?: boolean }> = ({ p, edges = true }) => {
  const S = useSeason();
  const [cx, cz] = rectCenter(p);
  const [w, d] = rectSize(p);
  const top = parcelTop(p);
  const paved = p.ground === "pave" || p.ground === "plaza";
  const walks = edges ? p.walks : [];
  const W = 1.4;
  return (
    <group>
      <BaseBox size={[w, top + 0.04, d]} pos={[cx, -0.04, cz]} color={groundColor(S, p.ground)} />
      {paved && <group position={[cx, top, cz]}><PavingRect w={w - 0.1} d={d - 0.1} y={0.006} plaza={p.ground === "plaza"} /></group>}
      {walks.map((side) => {
        const horiz = side === "n" || side === "s";
        const len = horiz ? w : d;
        const px = side === "w" ? p.x0 + W / 2 : side === "e" ? p.x1 - W / 2 : cx;
        const pz = side === "n" ? p.z0 + W / 2 : side === "s" ? p.z1 - W / 2 : cz;
        const cxE = side === "w" ? p.x0 + 0.12 : side === "e" ? p.x1 - 0.12 : cx;
        const czE = side === "n" ? p.z0 + 0.12 : side === "s" ? p.z1 - 0.12 : cz;
        return (
          <group key={side}>
            {!paved && <BaseBox size={horiz ? [len, 0.15 + 0.04, W] : [W, 0.15 + 0.04, len]} pos={[px, -0.04, pz]} color={S.pave} />}
            <BaseBox size={horiz ? [len, 0.2 + 0.04, 0.24] : [0.24, 0.2 + 0.04, len]} pos={[cxE, -0.04, czE]} color={S.curb} />
          </group>
        );
      })}
    </group>
  );
};

const Deco: React.FC<{ p: Parcel }> = ({ p }) => {
  const top = parcelTop(p);
  return (
    <>
      {(p.deco ?? []).map((d, i) => {
        const [kind, x, z, a] = d as [string, number, number, number | undefined];
        const pos: [number, number, number] = [x, top, z];
        switch (kind) {
          case "tree": return <MTree key={i} pos={pos} seed={(a as number) ?? i + 3} tone={(i % 3) as 0 | 1 | 2} />;
          case "cypress": return <Cypress key={i} pos={pos} seed={(a as number) ?? i + 1} />;
          case "pot": return <Pot key={i} pos={pos} flower={[M.rose, M.yellow, M.red][i % 3]} />;
          case "bench": return <Bench key={i} pos={pos} rotY={(a as number) ?? 0} />;
          default: return null;
        }
      })}
    </>
  );
};

/* ------------------------------------------------------------------ sokak donanımı */
const StreetFurniture: React.FC = () => {
  const S = useSeason();
  const out: React.ReactNode[] = [];
  // lambalar: yolların kenarında, dönüşümlü taraflı
  let li = 0;
  for (const r of MAP.roads) {
    if (r.type === "patika") continue;
    const long = isLong(r);
    const [cx, cz] = rectCenter(r);
    const L = long ? r.x1 - r.x0 : r.z1 - r.z0;
    const gap = r.type === "ana" ? 13 : 17;
    const half = (long ? r.z1 - r.z0 : r.x1 - r.x0) / 2 + 0.8;
    for (let k = 0; k < L / gap; k++) {
      const t = -L / 2 + gap / 2 + k * gap;
      const side = (li++ % 2) * 2 - 1;
      const x = long ? cx + t : cx + side * half, z = long ? cz + side * half : cz + t;
      if (onRoad(x, z, -0.1) || !MAP.parcels.some((p) => inRect(x, z, p))) continue;
      const rotY = long ? (side > 0 ? Math.PI * 0.75 : -Math.PI * 0.25) : side > 0 ? Math.PI * 0.75 : -Math.PI * 0.25;
      out.push(<MLamp key={`l${r.id}${k}`} pos={[x, parcelTop(MAP.parcels.find((p) => inRect(x, z, p))!), z]} rotY={rotY} />);
    }
  }
  // araçlar: çift şeritte iki yönde, tek şeritte tek araç, ayrıca park halindekiler
  const cars: { p: [number, number]; rot: number; color?: string; taxi?: boolean; van?: boolean }[] = [
    { p: [-31, 0.55], rot: Math.PI / 2, color: M.sky }, { p: [-14, 0.55], rot: Math.PI / 2, color: M.rose }, { p: [9, 0.55], rot: Math.PI / 2, taxi: true }, { p: [28, 0.55], rot: Math.PI / 2, color: M.mint },
    { p: [-27, -2.55], rot: -Math.PI / 2, color: M.orange }, { p: [-2, -2.55], rot: -Math.PI / 2, color: M.lilac }, { p: [20, -2.55], rot: -Math.PI / 2, van: true }, { p: [34, -2.55], rot: -Math.PI / 2, color: M.sand },
    { p: [19, -20], rot: Math.PI, color: M.sky }, { p: [-9, 9], rot: 0, color: M.orange }, { p: [-9, 23], rot: Math.PI, color: M.mint }, { p: [19, 8], rot: 0, color: M.rose },
    { p: [3, 16.5], rot: Math.PI / 2, color: M.lilac }, { p: [30, 11.5], rot: Math.PI / 2, color: M.sand }, { p: [-22.9, -18], rot: Math.PI, color: M.sky },
  ];
  cars.forEach((c, i) => out.push(<MCar key={`car${i}`} pos={[c.p[0], ROAD_TOP, c.p[1]]} rotY={c.rot} color={c.color} taxi={c.taxi} van={c.van} />));
  // sonbahar: kaldırım ve plazalarda dökülmüş yapraklar
  if (S.fallenLeaves) {
    const paved = MAP.parcels.filter((p) => p.ground === "pave" || p.ground === "plaza");
    for (let i = 0; i < 130; i++) {
      const p = paved[Math.floor(rand(31, i) * paved.length)];
      const x = p.x0 + 0.5 + rand(33, i) * (p.x1 - p.x0 - 1), z = p.z0 + 0.5 + rand(34, i) * (p.z1 - p.z0 - 1);
      out.push(
        <mesh key={`lf${i}`} position={[x, parcelTop(p) + 0.03, z]} rotation={[0, rand(35, i) * 6, 0]} material={mat(S.leaves[i % 3])}>
          <boxGeometry args={[0.28, 0.02, 0.2]} />
        </mesh>,
      );
    }
  }
  return <>{out}</>;
};

/* ------------------------------------------------------------------ hava parçacıkları, vurgu */
/** Hava durumu parçacıkları: kar, yaprak, çiçek yaprağı. Konumlar yalnızca kareden türetilir (deterministik). */
const Particles: React.FC<{ frame: number; kind: "kar" | "yaprak" | "cicek"; leaves: string[] }> = ({ frame, kind, leaves }) => {
  const H = 34;
  const groups = kind === "kar" ? [{ n: 280, color: "#FFFFFF", size: 4.5 }] : kind === "cicek" ? [{ n: 110, color: "#F7C6D6", size: 5 }] : leaves.map((c) => ({ n: 34, color: c, size: 7 }));
  return (
    <>
      {groups.map((g, gi) => {
        const arr = new Float32Array(g.n * 3);
        for (let i = 0; i < g.n; i++) {
          const k = i + gi * 1000;
          const spd = kind === "kar" ? 0.06 + 0.05 * rand(14, k) : 0.035 + 0.035 * rand(14, k);
          const y = (((rand(13, k) * H - frame * spd) % H) + H) % H;
          arr[i * 3] = WORLD_CX + (rand(11, k) - 0.5) * (WORLD_W + 8) + Math.sin(frame / 28 + k) * 1.0;
          arr[i * 3 + 1] = y + 0.3;
          arr[i * 3 + 2] = WORLD_CZ + (rand(12, k) - 0.5) * (WORLD_D + 8) + Math.cos(frame / 33 + k * 1.7) * 1.0;
        }
        return (
          <points key={gi} frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[arr, 3]} />
            </bufferGeometry>
            <pointsMaterial color={g.color} size={g.size} sizeAttenuation={false} toneMapped={false} />
          </points>
        );
      })}
    </>
  );
};

/** "Olay burada" vurgusu: ışık sütunu + yer halkası (establishing). */
const Beacon: React.FC<{ id: string; frame: number }> = ({ id, frame }) => {
  const v = venue(id);
  const par = parcelOf(id);
  const k = 0.6 + 0.4 * pulse(frame, 36);
  return (
    <group position={[v.origin[0], v.top + parcelTop(par), v.origin[1]]}>
      <mesh position={[0, 7, 0]} renderOrder={6}>
        <cylinderGeometry args={[0.9, 1.6, 14, 12, 1, true]} />
        <meshBasicMaterial color={M.warm} transparent opacity={0.14 * k} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Glow pos={[0, 0.1, 0]} size={Math.min(v.place.w * 1.9, 16)} color={M.warm} opacity={0.55 * k} />
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
  /** Mevsim (seasons.json). Varsayılan: yaz. */
  season?: SeasonId;
  /** Yalnız bu mekânın parselini yüzen ada olarak göster ("mekân kartı"). */
  solo?: string | null;
};

const ParcelContent: React.FC<{ p: Parcel; frame: number; market?: boolean }> = ({ p, frame, market }) => {
  const top = parcelTop(p);
  const [w, d] = rectSize(p);
  const [cx, cz] = rectCenter(p);
  return (
    <group>
      {(p.items ?? []).map((it) => {
        const C = COMPONENTS[it.venue];
        if (!C) return null;
        const v = venue(it.venue);
        return (
          <group key={it.venue} position={[it.pos[0], top + v.top, it.pos[1]]}>
            <C frame={frame} market={market} w={w} d={d} />
          </group>
        );
      })}
      {p.filler && (
        <group position={[cx, top, cz]}>
          <ParcelFiller type={p.filler.type} w={w} d={d} color={p.filler.color} floors={p.filler.floors} seed={p.filler.seed} />
        </group>
      )}
      <Deco p={p} />
    </group>
  );
};

export const Mahalle: React.FC<{ frame: number } & MahalleParams> = ({ frame, light, highlight, cast = "default", pets = true, ambient = true, market, solo, season = "yaz" }) => {
  const lp = lightFor(light, season);
  const sv = SEASONS[season].visual;
  const soloParcel = solo ? parcelById(solo) : null;
  let people = cast === "none" ? [] : cast === "default" ? DEFAULT_CAST : cast;
  if (soloParcel) {
    people = people.filter((p) => inRect(p.pos?.[0] ?? STATIONS[p.id]?.x ?? 0, p.pos?.[1] ?? STATIONS[p.id]?.z ?? 0, soloParcel));
  }
  const parcels = soloParcel ? [soloParcel] : MAP.parcels;
  const [scx, scz] = soloParcel ? rectCenter(soloParcel) : [WORLD_CX, WORLD_CZ];
  const [sw, sd] = soloParcel ? rectSize(soloParcel) : [WORLD_W, WORLD_D];
  return (
    <LightCtx.Provider value={{ light: lp, frame, season }}>
      <color attach="background" args={[lp.bg]} />
      <fog attach="fog" args={[lp.bg, lp.fogNear, lp.fogFar]} />
      <hemisphereLight args={[lp.hemiSky, lp.hemiGround, lp.hemiI]} />
      <directionalLight position={lp.sunPos} intensity={lp.sunI} color={lp.sun} />
      <directionalLight position={[-lp.sunPos[0], lp.sunPos[1] * 0.6, -lp.sunPos[2]]} intensity={lp.fillI} color={lp.fill} />
      <IslandBase cx={scx} cz={scz} w={sw} d={sd} />
      {!soloParcel && <Roads />}
      {parcels.map((p) => (
        <ParcelSlab key={`s${p.id}`} p={p} edges={!soloParcel} />
      ))}
      {parcels.map((p) => (
        <ParcelContent key={p.id} p={p} frame={frame} market={market} />
      ))}
      {!soloParcel && <StreetFurniture />}
      {people.map((p) => (
        <Person key={p.id} entry={p} frame={frame} />
      ))}
      {pets && cast !== "none" && !soloParcel && (
        <>
          <Pet kind="dog" pos={[STATIONS.karabas.x, 0.06, STATIONS.karabas.z]} rot={STATIONS.karabas.rot} frame={frame} />
          <Pet kind="cat" pos={[STATIONS.hacer.x + 0.9, STATIONS.hacer.y, STATIONS.hacer.z]} rot={-0.4} frame={frame} />
        </>
      )}
      {ambient && cast !== "none" && !soloParcel && <Ambient frame={frame} routes={MAP.walkRoutes as unknown as [number, number, number, number][]} />}
      {highlight && <Beacon id={highlight} frame={frame} />}
      {sv.particles && <Particles frame={frame} kind={sv.particles} leaves={sv.leaves} />}
    </LightCtx.Provider>
  );
};

export const MahalleScene: React.FC<{ frame: number; params: MahalleParams; camera: IsoCam }> = ({ frame, params, camera }) => (
  <>
    <IsoCamera {...camera} />
    <Mahalle frame={frame} {...params} />
  </>
);
