// Çınar İstasyonu: eski tarz küçük yerel istasyon + iki tünel ağzı + buharlı lokomotifli küçük tren.
// Tren tamamen kare-tabanlı (rail.ts): aynı kare → aynı konum. Koordinatlar dünya koordinatından mekân orijinine çevrilir.
import React from "react";
import * as THREE from "three";
import { basic, mat } from "../materials";
import { BaseBox, Box, Cone, Cyl, Glow, V3 } from "../primitives";
import { Bench, HipRoof, MLamp, MTree, Pot, Sign, useLight, useSeason } from "./kit";
import { venue } from "./layout";
import { M } from "./palette";
import { PATH_LEN, RAIL, S_PORTAL_A, S_PORTAL_B, TRAIN, pathAt, trainState } from "./rail";
import { SNOW } from "./seasons";
import { TBase } from "./tex";
import { rand } from "../../utils/deterministic";

const [OX, OZ] = (() => venue("istasyon").origin)();
const rel = (x: number, z: number): [number, number] => [x - OX, z - OZ];

/* ------------------------------------------------------------------ ray döşemesi */
const Track: React.FC = () => {
  const out: React.ReactNode[] = [];
  for (let s = 5; s <= PATH_LEN - 2; s += 0.7) {
    const p = pathAt(s);
    const [x, z] = rel(p.x, p.z);
    out.push(
      <group key={s} position={[x, 0, z]} rotation={[0, p.rot, 0]}>
        <BaseBox size={[2.3, 0.06, 0.8]} pos={[0, 0, 0]} color="#8D8A84" />
        <BaseBox size={[1.9, 0.07, 0.26]} pos={[0, 0.06, 0]} color={M.woodDark} />
        <BaseBox size={[0.1, 0.1, 0.78]} pos={[-0.62, 0.13, 0]} color="#5C6068" />
        <BaseBox size={[0.1, 0.1, 0.78]} pos={[0.62, 0.13, 0]} color="#5C6068" />
      </group>,
    );
  }
  return <>{out}</>;
};

/* ------------------------------------------------------------------ tünel ağzı (portal yüzü +z'ye bakar, yerel) */
const TunnelMound: React.FC<{ pos: V3; rotY: number; width?: number }> = ({ pos, rotY, width = 6 }) => {
  const S = useSeason();
  const w = width, depth = 4.2, hollow = 2.0, openW = 2.7, openH = 2.7;
  const grass = S.snow ? SNOW : S.grass;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* yamaç: taş gövde + çim üst */}
      <TBase size={[w, 3.0, depth]} pos={[0, 0, -depth / 2]} color="#9B9180" tex="stone" tile={2.4} />
      <BaseBox size={[w - 0.6, 0.7, depth - 0.4]} pos={[0, 3.0, -depth / 2]} color={grass} />
      <mesh position={[0, 3.9, -depth / 2 - 0.2]} material={mat(grass)} scale={[1, 0.55, 1]}>
        <icosahedronGeometry args={[w * 0.42, 0]} />
      </mesh>
      {/* portal: tuğla kemer çerçevesi (iki ayak + lento + kilit taşı) */}
      <TBase size={[(w - openW) / 2, 3.0, 0.9]} pos={[-(openW + (w - openW) / 2) / 2, 0, 0.1]} color={M.brickDark} tex="brick" tile={1.0} />
      <TBase size={[(w - openW) / 2, 3.0, 0.9]} pos={[(openW + (w - openW) / 2) / 2, 0, 0.1]} color={M.brickDark} tex="brick" tile={1.0} />
      <TBase size={[openW + 0.2, 0.3, 0.9]} pos={[0, openH, 0.1]} color={M.brickDark} tex="brick" tile={1.0} />
      <Box size={[0.5, 0.45, 0.95]} pos={[0, openH + 0.15, 0.1]} color={M.cream} />
      <Box size={[0.4, 0.4, 0.95]} pos={[-openW / 2 + 0.2, openH - 0.2, 0.1]} rot={[0, 0, 0.6]} color={M.brickDark} />
      <Box size={[0.4, 0.4, 0.95]} pos={[openW / 2 - 0.2, openH - 0.2, 0.1]} rot={[0, 0, -0.6]} color={M.brickDark} />
      {/* tünelin içi: tavan, yan duvarlar, siyah arka duvar (tren burada karanlığa karışır) */}
      <BaseBox size={[openW + 0.3, 0.3, hollow]} pos={[0, openH, -hollow / 2 - 0.35]} color="#4A4A46" />
      <BaseBox size={[0.3, openH, hollow]} pos={[-openW / 2 - 0.15, 0, -hollow / 2 - 0.35]} color="#55524B" />
      <BaseBox size={[0.3, openH, hollow]} pos={[openW / 2 + 0.15, 0, -hollow / 2 - 0.35]} color="#55524B" />
      <BaseBox size={[openW + 0.6, openH + 0.3, 0.3]} pos={[0, 0, -hollow - 0.35]} color="#07080A" />
      <BaseBox size={[openW, 0.05, hollow]} pos={[0, 0, -hollow / 2 - 0.35]} color="#222" />
      <MTree pos={[w * 0.28, 3.4, -depth / 2]} seed={31} scale={0.7} />
    </group>
  );
};

/* ------------------------------------------------------------------ tren araçları (yerel: +z ileri) */
const Wheel: React.FC<{ x: number; z: number; r: number; ang: number; color?: string }> = ({ x, z, r, ang, color = "#B13A32" }) => (
  <group position={[x, r, z]} rotation={[ang, 0, 0]}>
    <mesh rotation={[0, 0, Math.PI / 2]} material={mat(color)}>
      <cylinderGeometry args={[r, r, 0.12, 9]} />
    </mesh>
    <Box size={[0.14, r * 1.7, 0.06]} color="#2B2F36" />
    <Box size={[0.14, 0.06, r * 1.7]} color="#2B2F36" />
  </group>
);

const Loco: React.FC<{ ang: number; steamK: number; frame: number }> = ({ ang, steamK, frame }) => {
  const { light } = useLight();
  const lamp = light.lamps > 0.05;
  return (
    <group>
      <BaseBox size={[1.35, 0.3, 2.8]} pos={[0, 0.4, 0]} color="#1B1D21" />
      <mesh position={[0, 1.15, 0.45]} rotation={[Math.PI / 2, 0, 0]} material={mat("#2F5D47")}>
        <cylinderGeometry args={[0.5, 0.5, 1.9, 10]} />
      </mesh>
      <mesh position={[0, 1.15, 1.35]} rotation={[Math.PI / 2, 0, 0]} material={mat("#2A2D31")}>
        <cylinderGeometry args={[0.52, 0.52, 0.3, 10]} />
      </mesh>
      <Cyl r={0.12} rTop={0.17} h={0.6} pos={[0, 1.5, 1.2]} color="#15171A" seg={7} />
      <Cyl r={0.24} rTop={0.1} h={0.12} pos={[0, 2.05, 1.2]} color="#15171A" seg={7} />
      <mesh position={[0, 1.7, 0.4]} material={mat("#C49A5E")}>
        <icosahedronGeometry args={[0.2, 0]} />
      </mesh>
      {/* kabin */}
      <BaseBox size={[1.35, 1.35, 0.95]} pos={[0, 0.55, -0.95]} color="#7A2F2F" />
      <BaseBox size={[1.5, 0.1, 1.15]} pos={[0, 1.9, -0.95]} color="#2A2D31" />
      {[-0.69, 0.69].map((x) => <Box key={x} size={[0.04, 0.5, 0.5]} pos={[x, 1.5, -0.95]} color={lamp ? M.warm : "#12161B"} />)}
      {/* siper */}
      <Box size={[1.1, 0.3, 0.45]} pos={[0, 0.5, 1.6]} rot={[-0.5, 0, 0]} color="#2A2D31" />
      <mesh position={[0, 1.15, 1.54]} material={lamp ? basic(M.warm) : mat(M.grey)}>
        <icosahedronGeometry args={[0.12, 0]} />
      </mesh>
      {[-0.9, 0.2, 1.0].map((z) => [-0.68, 0.68].map((x) => <Wheel key={`${x}${z}`} x={x} z={z} r={z === 0.2 ? 0.42 : 0.3} ang={ang * (z === 0.2 ? 0.7 : 1)} />))}
      <Box size={[0.06, 0.08, 1.2]} pos={[-0.8, 0.55, 0.15]} color="#8C8F95" />
      <Box size={[0.06, 0.08, 1.2]} pos={[0.8, 0.55, 0.15]} color="#8C8F95" />
      {/* baca dumanı (hareketteyken sık, dururken seyrek) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const t = ((frame / (steamK > 0.2 ? 38 : 70) + i / 5) % 1 + 1) % 1;
        return (
          <mesh key={i} position={[0.1 * t * (steamK > 0.2 ? -1 : 1), 2.2 + t * 2.4, 1.2 - t * (steamK > 0.2 ? 1.6 : 0.2)]} scale={[0.25 + t * 0.7, 0.25 + t * 0.7, 0.25 + t * 0.7]}>
            <icosahedronGeometry args={[0.5, 0]} />
            <meshBasicMaterial color="#F1F3F6" transparent opacity={0.85 * (1 - t)} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Tender: React.FC<{ ang: number }> = ({ ang }) => (
  <group>
    <BaseBox size={[1.25, 0.9, 1.4]} pos={[0, 0.4, 0]} color="#1F2A25" />
    <mesh position={[0, 1.4, 0]} material={mat("#15171A")} scale={[1.2, 0.6, 1.2]}>
      <icosahedronGeometry args={[0.55, 0]} />
    </mesh>
    {[-0.55, 0.5].map((z) => [-0.64, 0.64].map((x) => <Wheel key={`${x}${z}`} x={x} z={z} r={0.28} ang={ang} />))}
  </group>
);

const Coach: React.FC<{ ang: number }> = ({ ang }) => {
  const { light } = useLight();
  const lit = light.windows > 0.05;
  return (
    <group>
      <BaseBox size={[1.4, 1.2, 2.6]} pos={[0, 0.4, 0]} color="#E6DABA" />
      <BaseBox size={[1.42, 0.45, 2.62]} pos={[0, 0.4, 0]} color="#3F6B52" />
      <BaseBox size={[1.5, 0.12, 2.7]} pos={[0, 1.6, 0]} color="#6E5B49" />
      <BaseBox size={[1.3, 0.1, 2.5]} pos={[0, 1.72, 0]} color="#7B6853" />
      {[-0.71, 0.71].map((x) =>
        [-0.85, -0.28, 0.28, 0.85].map((z) => <Box key={`${x}${z}`} size={[0.04, 0.5, 0.42]} pos={[x, 1.2, z]} color={lit ? M.warm : "#4D6A80"} />),
      )}
      <Box size={[0.9, 0.06, 0.18]} pos={[0, 0.5, 1.4]} color="#1B1D21" />
      {[-0.8, 0.8].map((z) => [-0.64, 0.64].map((x) => <Wheel key={`${x}${z}`} x={x} z={z} r={0.28} ang={ang} color="#4A4F57" />))}
    </group>
  );
};

/** Tren: kare + offset → konum. Aracın merkezi yol üzerindeki s'ten hesaplanır; yön yolun teğetinden. */
export const Train: React.FC<{ frame: number }> = ({ frame }) => {
  const st = trainState(frame);
  if (st.front === null) return null;
  const front = st.front;
  return (
    <>
      {TRAIN.cars.map((c) => {
        const s = front - c.center;
        const half = c.len / 2 + 0.3;
        if (s < S_PORTAL_A - half || s > S_PORTAL_B + half) return null;
        const p = pathAt(s);
        const [x, z] = rel(p.x, p.z);
        const ang = (front * 1.0) / 0.3 * -0.0 + front / 0.3; // tekerlek açısı: yol / yarıçap
        return (
          <group key={c.kind} position={[x, 0.2, z]} rotation={[0, p.rot, 0]}>
            {c.kind === "loco" && <Loco ang={ang} steamK={st.speed} frame={frame} />}
            {c.kind === "tender" && <Tender ang={ang} />}
            {c.kind === "coach" && <Coach ang={ang} />}
          </group>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ istasyon binası, peron, su kulesi, geçit */
const Station: React.FC<{ frame: number }> = ({ frame }) => {
  const S = useSeason();
  const { light } = useLight();
  const st = trainState(frame);
  const near = st.phase !== "yok" || (st.frameInCycle > 90 && st.frameInCycle < 150);
  const gateDown = near || (st.frameInCycle > 100 && st.frameInCycle < 810);
  const blink = Math.floor(frame / 12) % 2 === 0;
  const bx = -34.3, bz = -22.3; // bina merkezi (dünya)
  const [bxr, bzr] = rel(bx, bz);
  const bw = 7.8, bd = 4.6, bh = 3.4;
  const lampOn = light.lamps > 0.05;
  const wall = "#D9C7A0";
  return (
    <group>
      {/* bina */}
      <group position={[bxr, 0, bzr]}>
        <TBase size={[bw + 0.2, 0.7, bd + 0.2]} pos={[0, 0, 0]} color="#8F8776" tex="stone" tile={1.6} />
        <TBase size={[bw, bh, bd]} pos={[0, 0.7, 0]} color={wall} tex="plaster" />
        {[-1, 1].map((sx) => <TBase key={sx} size={[0.5, bh, 0.55]} pos={[sx * (bw / 2 - 0.1), 0.7, bd / 2 - 0.05]} color={M.brickDark} tex="brick" tile={1.0} />)}
        <HipRoof pos={[0, bh + 0.7, 0]} w={bw} d={bd} h={1.25} color={M.roofTile} overhang={0.4} />
        <TBase size={[0.7, 1.4, 0.7]} pos={[2.4, bh + 1.0, -0.6]} color={M.brickDark} tex="brick" tile={1.0} />
        {/* ön cephe (+z): kapı, 2 kemerli pencere, bilet gişesi, saat */}
        <Box size={[1.1, 2.3, 0.14]} pos={[-1.8, 1.85, bd / 2 + 0.03]} color={M.woodDark} />
        <Box size={[1.3, 0.3, 0.16]} pos={[-1.8, 3.1, bd / 2 + 0.04]} color={M.white} />
        {[0.6, 3.0].map((x, i) => (
          <group key={i}>
            <Box size={[1.1, 1.5, 0.12]} pos={[x, 2.0, bd / 2 + 0.03]} color={lampOn ? M.warm : M.glass} />
            <Box size={[1.4, 0.16, 0.18]} pos={[x, 1.2, bd / 2 + 0.06]} color={M.cream} />
            <Box size={[1.3, 0.2, 0.16]} pos={[x, 2.85, bd / 2 + 0.04]} color={M.brickDark} />
          </group>
        ))}
        <Box size={[0.9, 0.65, 0.12]} pos={[-3.0, 1.95, bd / 2 + 0.03]} color="#1B1D21" />
        <Box size={[0.08, 0.65, 0.16]} pos={[-3.0, 1.95, bd / 2 + 0.06]} color={M.greyDark} />
        <group position={[-0.5, bh + 0.2, bd / 2 + 0.12]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={mat(M.white)}>
            <cylinderGeometry args={[0.45, 0.45, 0.14, 12]} />
          </mesh>
          <Box size={[0.05, 0.34, 0.06]} pos={[0, 0.12, 0.08]} rot={[0, 0, 0.9]} color={M.ink} />
          <Box size={[0.05, 0.26, 0.06]} pos={[0.06, -0.02, 0.08]} rot={[0, 0, -0.3]} color={M.ink} />
        </group>
        {/* peron saçağı */}
        <BaseBox size={[bw + 0.4, 0.14, 1.2]} pos={[0, 3.55, bd / 2 + 0.6]} color="#6E4B30" />
        {S.snow && <BaseBox size={[bw + 0.3, 0.14, 1.1]} pos={[0, 3.69, bd / 2 + 0.6]} color={SNOW} />}
        {[-3.5, -1.2, 1.2, 3.5].map((x) => <BaseBox key={x} size={[0.12, 2.85, 0.12]} pos={[x, 0.7, bd / 2 + 1.1]} color="#4A3524" />)}
        {/* doğu yan duvar: küçük pencere */}
        <Box size={[0.12, 1.2, 0.9]} pos={[bw / 2 + 0.03, 2.0, 0]} color={M.glass} />
      </group>
      {/* peron */}
      {(() => {
        const [px, pz] = rel(-33.8, -18.85);
        return (
          <group position={[px, 0, pz]}>
            <TBase size={[7.4, 0.42, 2.1]} pos={[0, 0, 0]} color="#B9B2A2" tex="stone" tile={1.6} />
            <BaseBox size={[7.4, 0.02, 0.14]} pos={[0, 0.42, 0.9]} color={M.white} />
            <Bench pos={[-2.3, 0.42, -0.35]} rotY={0} />
            <Bench pos={[0.4, 0.42, -0.35]} rotY={0} />
            <MLamp pos={[3.3, 0.42, -0.2]} rotY={Math.PI * 0.75} />
            <MLamp pos={[-3.4, 0.42, -0.2]} rotY={Math.PI * 0.75} />
            {/* istasyon adı levhası */}
            <group position={[-3.2, 0.42, 0.7]}>
              <Box size={[0.08, 1.7, 0.08]} pos={[0, 0.85, 0]} color={M.ink} />
              <Sign text="ÇINAR" pos={[0, 1.75, 0.06]} w={1.8} h={0.5} bg="#2F5D47" fg={M.white} sub="İSTASYONU" glow />
            </group>
            {/* bagaj arabası + süt bidonları */}
            <group position={[2.2, 0.42, 0.1]}>
              <BaseBox size={[1.3, 0.12, 0.7]} pos={[0, 0.3, 0]} color={M.wood} />
              <BaseBox size={[0.5, 0.4, 0.4]} pos={[-0.3, 0.42, 0]} color="#8A5A3C" />
              <BaseBox size={[0.4, 0.3, 0.35]} pos={[0.3, 0.42, 0.05]} color="#A27A52" />
              {[-0.5, 0.5].map((x) => <Cyl key={x} r={0.14} h={0.14} pos={[x, 0.12, 0.45]} rot={[0, 0, Math.PI / 2]} color="#2B2F36" seg={8} />)}
            </group>
            {[-1.2, -0.9, -0.6].map((x, i) => (
              <group key={i} position={[x + 5.0, 0.42, -0.6]}>
                <Cyl r={0.17} h={0.55} color="#B8BCC4" seg={8} />
                <Cyl r={0.12} h={0.12} pos={[0, 0.55, 0]} color="#B8BCC4" seg={8} />
              </group>
            ))}
          </group>
        );
      })()}
      {/* su kulesi (buharlı çağın kalıntısı) */}
      {(() => {
        const [wx, wz] = rel(-26.6, -14.9);
        return (
          <group position={[wx, 0, wz]}>
            {[[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].map(([x, z], i) => <Box key={i} size={[0.14, 4.0, 0.14]} pos={[x, 2.0, z]} rot={[0, 0, 0]} color={M.woodDark} />)}
            <Box size={[1.9, 0.1, 0.08]} pos={[0, 1.5, 0.8]} color={M.woodDark} />
            <Box size={[0.08, 0.1, 1.9]} pos={[0.8, 2.4, 0]} color={M.woodDark} />
            <Cyl r={1.2} h={1.7} pos={[0, 4.0, 0]} color="#7C5A3A" seg={10} />
            <Cone r={1.35} h={0.9} pos={[0, 5.7, 0]} color={M.roofTile} seg={10} />
            {S.snow && <Cone r={1.1} h={0.6} pos={[0, 6.0, 0]} color={SNOW} seg={10} />}
            <Box size={[0.1, 2.0, 0.1]} pos={[-1.0, 2.6, 0]} rot={[0, 0, 0.5]} color={M.ink} />
          </group>
        );
      })()}
      {/* hemzemin geçit: patika + tahta döşeme + bariyer + kırmızı lamba */}
      {(() => {
        const [cx0, cz0] = rel(-26, -22.9);
        const [pxa, pza] = rel(-23.2, -18);
        return (
          <group>
            <BaseBox size={[1.2, 0.03, 8.8]} pos={[pxa, 0.03, pza + 0.2]} color="#CDBA92" />
            <BaseBox size={[5.0, 0.03, 1.2]} pos={[pxa - 2.6, 0.03, cz0]} color="#CDBA92" />
            <BaseBox size={[1.2, 0.03, 4.4]} pos={[rel(-30, -21)[0], 0.03, rel(-30, -21)[1] + 1.9]} color="#CDBA92" />
            <BaseBox size={[2.5, 0.12, 1.3]} pos={[cx0, 0.04, cz0]} color="#5A4331" />
            {[-1.45, 1.45].map((dx, i) => (
              <group key={i} position={[cx0 + dx, 0, cz0 + (i ? -0.9 : 0.9)]}>
                <Box size={[0.1, 1.3, 0.1]} pos={[0, 0.65, 0]} color={M.white} />
                <mesh position={[0, 1.35, 0]} material={blink && near ? basic(M.red) : mat(M.red)}>
                  <icosahedronGeometry args={[0.13, 0]} />
                </mesh>
                {blink && near && <Glow pos={[0, 1.35, 0.05]} size={1.0} color={M.red} opacity={0.6} face="z" />}
                <group position={[0, 1.0, 0]} rotation={[gateDown ? 0 : -1.25, 0, 0]}>
                  <Box size={[0.08, 0.08, 1.5]} pos={[0, 0, i ? -0.75 : 0.75]} color={M.red} />
                  <Box size={[0.085, 0.085, 0.3]} pos={[0, 0, i ? -0.45 : 0.45]} color={M.white} />
                  <Box size={[0.085, 0.085, 0.3]} pos={[0, 0, i ? -1.05 : 1.05]} color={M.white} />
                </group>
              </group>
            ))}
          </group>
        );
      })()}
      {/* saksılar ve fidanlık */}
      <Pot pos={[bxr - 3.6, 0, bzr + 3.2]} flower={M.rose} />
      <Pot pos={[bxr + 3.4, 0, bzr + 3.3]} flower={M.yellow} />
    </group>
  );
};

/** Çınar İstasyonu: ray, iki tünel, bina, peron, tren. */
export const Istasyon: React.FC<{ frame: number }> = ({ frame }) => {
  const { trainFrame } = useLight() as { trainFrame?: number };
  const tf = trainFrame ?? frame;
  const [ax, az] = rel(RAIL.ax, RAIL.portalAZ);
  const [bx, bz] = rel(RAIL.portalBX, RAIL.hz);
  return (
    <group>
      <Track />
      <TunnelMound pos={[ax, 0, az]} rotY={0} />
      <TunnelMound pos={[bx, 0, bz]} rotY={Math.PI / 2} width={5} />
      <Station frame={tf} />
      <Train frame={tf} />
    </group>
  );
};
