// 14. Sokak — ayrı aç/kapatılabilir grup (CLAUDE.md §5 kontrol listesi).
// `erase` 0..1: 03.17 düzeltmesi. Her şey kareye bağlı, deterministik.
import React from "react";
import { C } from "./palette";
import { Building } from "./Apartment";
import { Box, Glow } from "./primitives";
import { Car, StreetLamp, StreetSign, Tree } from "./Props";
import { F, STREET14_BUILDINGS, STREET14_ROWS, rowForZ } from "./layout";
import { Slab } from "./CityBlock";
import { burst, pulse, rand } from "../utils/deterministic";
import { clamp, invLerp } from "../utils/time";

const rowVisible = (erase: number, at: number) => erase < at;
const rowWarn = (erase: number, at: number, frame: number) =>
  erase < at && erase > at - 0.07 && Math.floor(frame / 2) % 2 === 0;

/** Bir ground satırı: kaldırımlar + yol + parseller */
const Row: React.FC<{ z0: number; z1: number; erase: number; at: number; frame: number; idx: number }> = ({
  z0, z1, erase, at, frame, idx,
}) => {
  if (!rowVisible(erase, at)) return null;
  const warn = rowWarn(erase, at, frame);
  const tint = (c: string) => (warn ? C.redDark : c);
  return (
    <group>
      <Slab x0={F.x0} x1={F.x1} z0={z0} z1={z1} y0={-3} y1={-0.2} color={tint(C.concreteDark)} />
      <Slab x0={F.x0} x1={12.1} z0={z0} z1={z1} y0={-0.2} y1={0} color={tint(C.lot)} />
      <Slab x0={20.9} x1={F.x1} z0={z0} z1={z1} y0={-0.2} y1={0} color={tint(C.lot)} />
      <Slab x0={12.1} x1={14} z0={z0} z1={z1} y0={-0.2} y1={0.14} color={tint(C.concrete)} />
      <Slab x0={19} x1={20.9} z0={z0} z1={z1} y0={-0.2} y1={0.14} color={tint(C.concrete)} />
      <Slab x0={14} x1={19} z0={z0} z1={z1} y0={-0.2} y1={0.04} color={tint(C.asphalt)} />
      <Box size={[0.16, 0.02, 1.8]} pos={[16.5, 0.06, (z0 + z1) / 2]} color={C.concreteLight} />
    </group>
  );
};

/** Hata sınırı: silinen alanın kenarında kırmızı kayıt izi */
const Scar: React.FC<{ erase: number; frame: number }> = ({ erase, frame }) => {
  const open = invLerp(0.4, 0.55, erase);
  if (open <= 0) return null;
  const hit = Math.max(burst(frame, 0, 12), burst(frame, 38, 10), burst(frame, 66, 8));
  const base = 0.28 + 0.12 * pulse(frame, 36);
  const k = open * clamp(base + hit * 0.7);
  const c = C.red;
  const h = 0.12;
  const t = 0.22;
  const y = -0.2;
  return (
    <group>
      <mesh position={[(F.x0 + F.x1) / 2, y, F.z0 + t / 2]}>
        <boxGeometry args={[F.x1 - F.x0, h, t]} />
        <meshBasicMaterial color={c} transparent opacity={k} toneMapped={false} />
      </mesh>
      <mesh position={[F.x0 + t / 2, y, (F.z0 + F.z1) / 2]}>
        <boxGeometry args={[t, h, F.z1 - F.z0]} />
        <meshBasicMaterial color={c} transparent opacity={k} toneMapped={false} />
      </mesh>
      <Glow pos={[(F.x0 + F.x1) / 2, 0.05, (F.z0 + F.z1) / 2]} size={[34, 36]} color={c} opacity={0.1 * open * (0.6 + hit)} />
    </group>
  );
};

/** Boşlukta süzülen kayıt parçacıkları (silinmiş geometrinin kalıntısı) */
const VoidDust: React.FC<{ erase: number; frame: number }> = ({ erase, frame }) => {
  const k = invLerp(0.25, 0.7, erase);
  if (k <= 0) return null;
  return (
    <group>
      {Array.from({ length: 26 }).map((_, i) => {
        const t = (((frame / 210 + rand(4, i)) % 1) + 1) % 1;
        const x = F.x0 + 1 + rand(5, i) * (F.x1 - F.x0 - 2);
        const z = F.z0 + 1 + rand(6, i) * (F.z1 - F.z0 - 2);
        const y = -2.5 + t * 14;
        const s = 0.12 + rand(7, i) * 0.22;
        const op = Math.sin(t * Math.PI) * 0.8 * k;
        const red = i % 4 === 0;
        return (
          <mesh key={i} position={[x, y, z]} rotation={[t * 3, t * 4, 0]}>
            <boxGeometry args={[s, s, s]} />
            <meshBasicMaterial color={red ? C.red : C.bone} transparent opacity={op * (red ? 0.9 : 0.35)} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Street14: React.FC<{ erase: number; frame: number }> = ({ erase, frame }) => {
  const goneRow = (z: number) => !rowVisible(erase, rowForZ(z).at - 0.02);
  return (
    <group>
      {STREET14_ROWS.map((r, i) => (
        <Row key={i} idx={i} z0={r.z0} z1={r.z1} erase={erase} at={r.at} frame={frame} />
      ))}

      {STREET14_BUILDINGS.map((b) => (
        <Building key={b.id} spec={b} erase={erase} frame={frame} />
      ))}

      {/* tabela, lambalar, araç, ağaçlar: bulundukları zemin satırıyla birlikte silinir */}
      {erase < 0.36 && !(erase > 0.3 && Math.floor(frame / 2) % 2 === 0) && (
        <StreetSign pos={[13.0, 0.14, 5.8]} label="14. SOKAK" />
      )}
      {!goneRow(9) && <StreetLamp pos={[19.9, 0.14, 9]} rotY={-Math.PI / 2} frame={frame} seed={21} />}
      {!goneRow(19) && <StreetLamp pos={[13.1, 0.14, 19]} rotY={Math.PI / 2} frame={frame} seed={22} broken={0.3} />}
      {!goneRow(14) && <Car pos={[17.6, 0.04, 14]} rotY={Math.PI} color="#2B363D" />}
      {!goneRow(26) && <Tree pos={[13.0, 0.14, 26.5]} seed={61} kind="box" scale={0.8} />}
      {!goneRow(22) && <Tree pos={[19.9, 0.14, 22]} seed={62} scale={0.8} />}

      <Scar erase={erase} frame={frame} />
      <VoidDust erase={erase} frame={frame} />
    </group>
  );
};

