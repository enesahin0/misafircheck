// ŞEHİR_0 maketi: plinth, yollar, kaldırımlar, binalar, sabit mikro detaylar.
import React from "react";
import { C } from "./palette";
import { Building } from "./Apartment";
import { BaseBox, Box, V3 } from "./primitives";
import { BusStop, Car, Cat, SpeakerPole, SteamVent, StreetLamp, TrashBin, Tree } from "./Props";
import { CITY_BUILDINGS, F, PLINTH } from "./layout";
import { mat } from "./materials";

/** Köşe koordinatlarıyla yassı levha. */
export const Slab: React.FC<{
  x0: number; x1: number; z0: number; z1: number; y0?: number; y1: number; color: string; emissive?: string; ei?: number;
}> = ({ x0, x1, z0, z1, y0 = -0.2, y1, color, emissive, ei }) => (
  <mesh
    position={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]}
    material={mat(color, { emissive, ei })}
  >
    <boxGeometry args={[x1 - x0, y1 - y0, z1 - z0]} />
  </mesh>
);

const DashLine: React.FC<{ from: V3; to: V3; n: number }> = ({ from, to, n }) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const horizontal = Math.abs(to[0] - from[0]) > Math.abs(to[2] - from[2]);
    out.push(
      <Box
        key={i}
        size={horizontal ? [1.8, 0.02, 0.16] : [0.16, 0.02, 1.8]}
        pos={[from[0] + (to[0] - from[0]) * t, 0.06, from[2] + (to[2] - from[2]) * t]}
        color={C.concreteLight}
      />,
    );
  }
  return <>{out}</>;
};

/** Plinth: 14. Sokak ayak izi dışındaki bütün zemin. Ayak izi boşluğu → silinince gerçek delik. */
const Plinth: React.FC = () => {
  const { x0, x1, z0, z1, depth } = PLINTH;
  const rects: [number, number, number, number][] = [
    [x0, F.x0, z0, z1], // sol
    [F.x1, x1, z0, z1], // sağ
    [F.x0, F.x1, z0, F.z0], // üst
    [F.x0, F.x1, F.z1, z1], // alt
  ];
  return (
    <group>
      {rects.map((r, i) => (
        <group key={i}>
          <Slab x0={r[0]} x1={r[1]} z0={r[2]} z1={r[3]} y0={-depth} y1={-0.2} color={C.concreteDark} />
          <Slab x0={r[0]} x1={r[1]} z0={r[2]} z1={r[3]} y0={-0.2} y1={0} color={C.lot} />
        </group>
      ))}
    </group>
  );
};

const Roads: React.FC = () => {
  const { x0, x1, z0, z1 } = PLINTH;
  return (
    <group>
      {/* Belediye Cad. */}
      <Slab x0={x0} x1={x1} z0={-3} z1={3} y1={0.04} color={C.asphalt} />
      {/* Merkez Sk. */}
      <Slab x0={-22} x1={-17} z0={z0} z1={-3} y1={0.04} color={C.asphalt} />
      <Slab x0={-22} x1={-17} z0={3} z1={z1} y1={0.04} color={C.asphalt} />
      {/* kaldırımlar */}
      <Slab x0={x0} x1={-24} z0={-5} z1={-3} y1={0.14} color={C.concrete} />
      <Slab x0={-15} x1={x1} z0={-5} z1={-3} y1={0.14} color={C.concrete} />
      <Slab x0={x0} x1={-24} z0={3} z1={5} y1={0.14} color={C.concrete} />
      <Slab x0={-15} x1={x1} z0={3} z1={5} y1={0.14} color={C.concrete} />
      <Slab x0={-24} x1={-22} z0={z0} z1={-5} y1={0.14} color={C.concrete} />
      <Slab x0={-17} x1={-15} z0={z0} z1={-5} y1={0.14} color={C.concrete} />
      <Slab x0={-24} x1={-22} z0={5} z1={z1} y1={0.14} color={C.concrete} />
      <Slab x0={-17} x1={-15} z0={5} z1={z1} y1={0.14} color={C.concrete} />
      {/* şerit çizgileri */}
      <DashLine from={[-32, 0, 0]} to={[-24, 0, 0]} n={4} />
      <DashLine from={[-14, 0, 0]} to={[32, 0, 0]} n={9} />
      <DashLine from={[-19.5, 0, -32]} to={[-19.5, 0, -6]} n={6} />
      <DashLine from={[-19.5, 0, 6]} to={[-19.5, 0, 32]} n={6} />
      {/* yaya geçidi */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Box key={i} size={[0.7, 0.02, 4.4]} pos={[-13.2 + i * 1.2, 0.06, 0]} color={C.concreteLight} />
      ))}
    </group>
  );
};

/** Plinth kenarında ince açık renk bir şerit — maket hissi. */
const PlinthTrim: React.FC = () => (
  <group>
    <Slab x0={-34} x1={34} z0={33.7} z1={34} y0={-0.2} y1={0.3} color={C.concreteLight} />
    <Slab x0={33.7} x1={34} z0={-34} z1={34} y0={-0.2} y1={0.3} color={C.concreteLight} />
  </group>
);

const StaticCity: React.FC = React.memo(() => (
  <group>
    <Plinth />
    <Roads />
    <PlinthTrim />
    {/* ağaçlar: park + belediye bahçesi + güney meydan */}
    {[
      [19.5, -19.5], [29.5, -9.5], [31, -15], [26.5, -21], [14, -19], [14.5, -9.5],
      [-14, -29], [4.6, -29], [-8, -31], [-14, -8], [4.5, -7.5],
      [-3, 28.5], [-3, 10],
    ].map(([x, z], i) => (
      <Tree key={i} pos={[x, 0, z]} seed={i + 3} kind={i % 3 === 0 ? "box" : "cone"} />
    ))}
    {/* park bankı */}
    <BaseBox size={[2.2, 0.15, 0.6]} pos={[24, 0.45, -18]} color={C.concrete} />
    <BaseBox size={[0.15, 0.45, 0.5]} pos={[23.2, 0, -18]} color={C.concreteDark} />
    <BaseBox size={[0.15, 0.45, 0.5]} pos={[24.8, 0, -18]} color={C.concreteDark} />
    {/* park yolu */}
    <Slab x0={16} x1={33} z0={-18.9} z1={-17.1} y1={0.05} color={C.concrete} />
    {/* sabit park etmiş araçlar */}
    <Car pos={[-6, 0.04, -1.8]} rotY={Math.PI / 2} />
    <Car pos={[19, 0.04, 1.9]} rotY={-Math.PI / 2} color="#27323A" />
    <Car pos={[-24.2 + 0.0, 0.04, 22]} rotY={0} color="#27323A" />
  </group>
));

export const CityBlock: React.FC<{
  frame: number;
  speakerRed: number;
}> = ({ frame, speakerRed }) => (
  <group>
    <StaticCity />
    {CITY_BUILDINGS.map((b) => (
      <Building key={b.id} spec={b} frame={frame} />
    ))}
    {/* Bozuk sokak lambası — bir sonraki bölümde onarılmış görünmez (worldState.props.brokenLamp) */}
    <StreetLamp pos={[-1.0, 0.14, 4.2]} rotY={Math.PI} frame={frame} seed={5} broken={0.9} />
    <StreetLamp pos={[-9.0, 0.14, -4.2]} rotY={0} frame={frame} seed={6} />
    <StreetLamp pos={[16.5, 0.14, -4.2]} rotY={0} frame={frame} seed={7} />
    <StreetLamp pos={[-12.5, 0.14, 4.2]} rotY={Math.PI} frame={frame} seed={8} />
    <StreetLamp pos={[-19.5 + 3.2, 0.14, -14]} rotY={Math.PI / 2} frame={frame} seed={9} />
    {/* hoparlör direği */}
    <SpeakerPole pos={[3.4, 0.14, 4.2]} rotY={-0.25} red={speakerRed} frame={frame} />
    {/* durak + kedi */}
    <BusStop pos={[9.5, 0.14, -4.0]} />
    <Cat pos={[8.9, 0.74, -4.35]} rotY={0.7} frame={frame} />
    <TrashBin pos={[6.4, 0.14, 4.3]} frame={frame} />
    <SteamVent pos={[-9, 0.04, 1.9]} frame={frame} />
  </group>
);

