// MAHALLE ortak yapı taşları: ışık bağlamı, cephe, tabela, ağaç, lamba, araç, bank, ışık zinciri...
import React, { createContext, useContext, useMemo } from "react";
import * as THREE from "three";
import { basic, mat } from "../materials";
import { BaseBox, Box, Cone, Cyl, Glow, Shadow, V3 } from "../primitives";
import { textTexture } from "../textTexture";
import { rand } from "../../utils/deterministic";
import { LIGHTS, LightPreset, M } from "./palette";

export const LightCtx = createContext<{ light: LightPreset; frame: number }>({ light: LIGHTS.ogle, frame: 0 });
export const useLight = () => useContext(LightCtx);

/* ------------------------------------------------------------------ cephe: pencereler */
/** Bir cephe (z+ veya x+) üzerine pencere ızgarası. `face`: "z" → +z yüzü, "x" → +x yüzü. */
export const Facade: React.FC<{
  w: number; d: number; floors: number; floorH?: number; y0?: number; face: "z" | "x"; seed: number;
  cols?: number; winW?: number; winH?: number; skipGround?: boolean; frameColor?: string; litBias?: number;
}> = ({ w, d, floors, floorH = 3, y0 = 0, face, seed, cols, winW = 1.0, winH = 1.3, skipGround, frameColor = M.white, litBias = 0 }) => {
  const { light } = useLight();
  const span = face === "z" ? w : d;
  const n = cols ?? Math.max(1, Math.floor(span / 2.2));
  const out: React.ReactNode[] = [];
  for (let f = skipGround ? 1 : 0; f < floors; f++) {
    for (let c = 0; c < n; c++) {
      const u = -span / 2 + (span / n) * (c + 0.5);
      const lit = rand(seed, f * 17 + c * 5 + (face === "x" ? 101 : 0)) < Math.min(1, light.windows + litBias * (light.windows > 0 ? 1 : 0));
      const y = y0 + f * floorH + floorH * 0.55;
      const pos: V3 = face === "z" ? [u, y, d / 2 + 0.04] : [w / 2 + 0.04, y, u];
      const size: V3 = face === "z" ? [winW, winH, 0.1] : [0.1, winH, winW];
      const fsize: V3 = face === "z" ? [winW + 0.22, winH + 0.22, 0.06] : [0.06, winH + 0.22, winW + 0.22];
      out.push(
        <group key={`${f}-${c}`}>
          <Box size={fsize} pos={[pos[0] - (face === "x" ? 0.02 : 0), pos[1], pos[2] - (face === "z" ? 0.02 : 0)]} color={frameColor} />
          <mesh position={pos} material={lit ? basic(M.warm) : mat(M.glass, { rough: 0.35 })}>
            <boxGeometry args={size} />
          </mesh>
        </group>,
      );
    }
  }
  return <>{out}</>;
};

/* ------------------------------------------------------------------ yazı / tabela */
const signMaterial = (key: string, text: string, w: number, h: number, bg: string, fg: string, sub?: string): THREE.Material => {
  const tex = textTexture(key, 512, Math.max(64, Math.round((512 * h) / w)), (g, cw, ch) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, cw, ch);
    g.strokeStyle = fg;
    g.globalAlpha = 0.55;
    g.lineWidth = 6;
    g.strokeRect(8, 8, cw - 16, ch - 16);
    g.globalAlpha = 1;
    g.fillStyle = fg;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const size = Math.floor(ch * (sub ? 0.5 : 0.62));
    g.font = `700 ${size}px "Barlow Condensed", "Arial Narrow", sans-serif`;
    g.fillText(text, cw / 2, ch * (sub ? 0.42 : 0.53), cw - 40);
    if (sub) {
      g.font = `600 ${Math.floor(ch * 0.22)}px "Barlow Condensed", sans-serif`;
      g.globalAlpha = 0.85;
      g.fillText(sub, cw / 2, ch * 0.8, cw - 40);
    }
  });
  return new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
};

/** Düz tabela (yüzü +z; rotY ile döner). */
export const Sign: React.FC<{ text: string; pos: V3; w?: number; h?: number; rotY?: number; bg?: string; fg?: string; sub?: string; glow?: boolean }> = ({
  text, pos, w = 3, h = 0.9, rotY = 0, bg = M.green, fg = M.white, sub, glow,
}) => {
  const { light } = useLight();
  const material = useMemo(() => signMaterial(`m|${text}|${w}|${h}|${bg}|${fg}|${sub ?? ""}`, text, w, h, bg, fg, sub), [text, w, h, bg, fg, sub]);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh material={material}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <Box size={[w + 0.16, h + 0.16, 0.08]} pos={[0, 0, -0.06]} color={M.ink} />
      {glow && light.lamps > 0.05 && <Glow pos={[0, 0, 0.12]} size={[w * 1.6, h * 2.2]} color={fg} opacity={0.22 * light.lamps} face="z" />}
    </group>
  );
};

/** Köşeye dikilmiş, kameraya dönük tabela direği (izometrikte her açıdan okunur). */
export const BladeSign: React.FC<{ text: string; pos: V3; bg?: string; fg?: string; h?: number; w?: number; sub?: string; tall?: number }> = ({
  text, pos, bg, fg, w = 3.2, h = 0.95, sub, tall = 3.6,
}) => (
  <group position={pos}>
    <Cyl r={0.07} h={tall} color={M.ink} seg={5} />
    <Sign text={text} pos={[0, tall + h / 2 - 0.1, 0]} w={w} h={h} rotY={Math.PI / 4} bg={bg} fg={fg} sub={sub} glow />
  </group>
);

/** Alçak ön duvar üzerine boyalı yazı (+z yüzü). */
export const WallText: React.FC<{ text: string; pos: V3; w: number; h?: number; bg: string; fg: string; face?: "z" | "x" }> = ({ text, pos, w, h = 0.7, bg, fg, face = "z" }) => (
  <Sign text={text} pos={pos} w={w} h={h} bg={bg} fg={fg} rotY={face === "x" ? Math.PI / 2 : 0} />
);

/* ------------------------------------------------------------------ ağaç / lamba / araç / bank */
export const MTree: React.FC<{ pos: V3; seed?: number; scale?: number; tone?: 0 | 1 | 2 }> = ({ pos, seed = 1, scale = 1, tone = 0 }) => {
  const k = scale * (0.88 + 0.24 * rand(seed, 1));
  const cols = [M.leaf, M.leaf2, M.leaf3];
  return (
    <group position={pos} scale={[k, k, k]} rotation={[0, rand(seed, 2) * 6, 0]}>
      <Cyl r={0.2} rTop={0.14} h={1.5} color={M.woodDark} seg={5} />
      <mesh position={[0, 2.5, 0]} material={mat(cols[tone])}>
        <icosahedronGeometry args={[1.25, 0]} />
      </mesh>
      <mesh position={[0.45, 3.1, -0.2]} material={mat(cols[(tone + 1) % 3])}>
        <icosahedronGeometry args={[0.85, 0]} />
      </mesh>
      <Shadow pos={[0, 0, 0]} size={[2.6, 2.6]} opacity={0.22} />
    </group>
  );
};

export const MLamp: React.FC<{ pos: V3; rotY?: number }> = ({ pos, rotY = 0 }) => {
  const { light } = useLight();
  const on = light.lamps;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Cyl r={0.07} h={3.6} color={M.ink} seg={5} />
      <Box size={[0.9, 0.08, 0.08]} pos={[0.4, 3.62, 0]} color={M.ink} />
      <mesh position={[0.8, 3.52, 0]} material={on > 0.05 ? basic(M.warm) : mat(M.grey)}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
      </mesh>
      {on > 0.05 && <Glow pos={[0.8, 0.12, 0]} size={5.5} color={M.warmDeep} opacity={0.28 * on} />}
      {on > 0.05 && <Glow pos={[0.8, 3.45, 0]} size={1.6} color={M.warm} opacity={0.5 * on} face="z" />}
    </group>
  );
};

export const MCar: React.FC<{ pos: V3; rotY?: number; color?: string; taxi?: boolean; van?: boolean }> = ({ pos, rotY = 0, color = M.sky, taxi, van }) => (
  <group position={pos} rotation={[0, rotY, 0]} scale={van ? [1, 1, 1] : [0.82, 0.82, 0.82]}>
    <Shadow pos={[0, 0, 0]} size={[2.5, van ? 6.4 : 4.9]} opacity={0.3} />
    {van ? (
      <>
        <BaseBox size={[2.0, 1.3, 5.6]} pos={[0, 0.3, 0]} color={M.white} />
        <BaseBox size={[2.02, 0.25, 5.62]} pos={[0, 0.9, 0]} color={M.blue} />
        <BaseBox size={[1.9, 0.75, 1.5]} pos={[0, 1.2, 1.9]} color={M.glassDark} />
      </>
    ) : (
      <>
        <BaseBox size={[1.9, 0.75, 4.2]} pos={[0, 0.3, 0]} color={taxi ? M.taxi : color} />
        <BaseBox size={[1.7, 0.7, 2.2]} pos={[0, 1.05, -0.2]} color={taxi ? M.taxi : color} />
        <BaseBox size={[1.72, 0.4, 2.0]} pos={[0, 1.2, -0.2]} color={M.glassDark} />
        {taxi && <BaseBox size={[0.7, 0.22, 0.3]} pos={[0, 1.75, -0.2]} color={M.white} />}
      </>
    )}
    {[[-0.95, 1.3], [0.95, 1.3], [-0.95, -1.3], [0.95, -1.3]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.36, z * (van ? 1.25 : 1)]} rotation={[0, 0, Math.PI / 2]} material={mat(M.ink)}>
        <cylinderGeometry args={[0.36, 0.36, 0.28, 8]} />
      </mesh>
    ))}
  </group>
);

export const Bench: React.FC<{ pos: V3; rotY?: number }> = ({ pos, rotY = 0 }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <BaseBox size={[1.9, 0.12, 0.55]} pos={[0, 0.5, 0]} color={M.wood} />
    <BaseBox size={[1.9, 0.5, 0.1]} pos={[0, 0.62, -0.28]} color={M.wood} />
    <BaseBox size={[0.1, 0.5, 0.5]} pos={[-0.8, 0, 0]} color={M.ink} />
    <BaseBox size={[0.1, 0.5, 0.5]} pos={[0.8, 0, 0]} color={M.ink} />
  </group>
);

export const Stool: React.FC<{ pos: V3; color?: string }> = ({ pos, color = M.red }) => (
  <group position={pos}>
    <Cyl r={0.22} h={0.1} pos={[0, 0.42, 0]} color={color} seg={8} />
    <Cyl r={0.04} h={0.42} color={M.greyDark} seg={4} />
  </group>
);

export const RoundTable: React.FC<{ pos: V3; color?: string }> = ({ pos, color = M.white }) => (
  <group position={pos}>
    <Cyl r={0.5} h={0.07} pos={[0, 0.72, 0]} color={color} seg={10} />
    <Cyl r={0.06} h={0.72} color={M.greyDark} seg={4} />
  </group>
);

/** Ürün kasası: renkli küçük kutular (domates/portakal/ekmek vb.). */
export const Crate: React.FC<{ pos: V3; color?: string; goods?: string; n?: number }> = ({ pos, color = M.wood, goods = M.orange, n = 6 }) => (
  <group position={pos}>
    <BaseBox size={[0.9, 0.3, 0.6]} pos={[0, 0, 0]} color={color} />
    {Array.from({ length: n }, (_, i) => (
      <mesh key={i} position={[-0.3 + (i % 3) * 0.3, 0.42, -0.14 + Math.floor(i / 3) * 0.28]} material={mat(goods)}>
        <icosahedronGeometry args={[0.13, 0]} />
      </mesh>
    ))}
  </group>
);

/** İki direk arası ışık zinciri (gece/akşam yanar). */
export const StringLights: React.FC<{ from: V3; to: V3; n?: number; frame: number; sag?: number; colors?: string[] }> = ({ from, to, n = 8, frame, sag = 0.5, colors = [M.warm, M.warmDeep, M.rose, M.neonCyan] }) => {
  const { light } = useLight();
  const on = Math.max(light.lamps, light.neon);
  const dx = to[0] - from[0], dz = to[2] - from[2];
  const len = Math.hypot(dx, dz);
  return (
    <>
      <Box size={[0.03, 0.03, len]} pos={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 - sag * 0.2, (from[2] + to[2]) / 2]} rot={[0, Math.atan2(dx, dz), 0]} color={M.ink} />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const p: V3 = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - sag * 0.2 - 0.12, from[2] + (to[2] - from[2]) * t];
        const c = colors[i % colors.length];
        const tw = 0.6 + 0.4 * Math.sin((frame + i * 7) / 6);
        return (
          <group key={i} position={p}>
            <mesh material={on > 0.05 ? basic(c) : mat(c)}>
              <icosahedronGeometry args={[0.09, 0]} />
            </mesh>
            {on > 0.05 && <Glow pos={[0, 0, 0.05]} size={0.9} color={c} opacity={0.5 * on * tw} face="z" />}
          </group>
        );
      })}
    </>
  );
};

/** Tek/çift eğimli düşük çatı veya düz parapet ile kapalı bina gövdesi. */
export const Block: React.FC<{ w: number; d: number; h: number; y0?: number; color: string; trim?: string; parapet?: boolean }> = ({ w, d, h, y0 = 0, color, trim = M.white, parapet = true }) => (
  <group>
    <BaseBox size={[w, h, d]} pos={[0, y0, 0]} color={color} />
    {parapet && <BaseBox size={[w + 0.3, 0.35, d + 0.3]} pos={[0, y0 + h, 0]} color={trim} />}
  </group>
);

export const WaterTank: React.FC<{ pos: V3 }> = ({ pos }) => (
  <group position={pos}>
    <Cyl r={0.7} h={1.1} color={M.greyDark} seg={8} />
    <Cone r={0.75} h={0.35} pos={[0, 1.1, 0]} color={M.grey} seg={8} />
  </group>
);

export const Antenna: React.FC<{ pos: V3 }> = ({ pos }) => (
  <group position={pos}>
    <Cyl r={0.04} h={2.2} color={M.ink} seg={4} />
    <Box size={[0.9, 0.05, 0.05]} pos={[0, 1.7, 0]} color={M.ink} />
    <Box size={[0.6, 0.05, 0.05]} pos={[0, 2.0, 0]} color={M.ink} />
  </group>
);
