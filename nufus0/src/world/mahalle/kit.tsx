// MAHALLE ortak yapı taşları: ışık bağlamı, cephe, tabela, ağaç, lamba, araç, bank, ışık zinciri...
import React, { createContext, useContext, useMemo } from "react";
import * as THREE from "three";
import { basic, mat } from "../materials";
import { BaseBox, Box, Cone, Cyl, Glow, Shadow, V3 } from "../primitives";
import { textTexture } from "../textTexture";
import { rand } from "../../utils/deterministic";
import { LIGHTS, LightPreset, M } from "./palette";
import { SEASONS, SNOW, SeasonId, SeasonVisual } from "./seasons";
import { TBase, roofCoilMaterial } from "./tex";

export const LightCtx = createContext<{ light: LightPreset; frame: number; season: SeasonId }>({ light: LIGHTS.ogle, frame: 0, season: "yaz" });
export const useLight = () => useContext(LightCtx);
export const useSeason = (): SeasonVisual => SEASONS[useContext(LightCtx).season].visual;
export const useSeasonId = (): SeasonId => useContext(LightCtx).season;

/* ------------------------------------------------------------------ cephe: pencereler */
/** Bir cephe (z+ veya x+) üzerine pencere ızgarası. `face`: "z" → +z yüzü, "x" → +x yüzü. */
export const Facade: React.FC<{
  w: number; d: number; floors: number; floorH?: number; y0?: number; face: "z" | "x"; seed: number;
  cols?: number; winW?: number; winH?: number; skipGround?: boolean; frameColor?: string; litBias?: number; shutters?: string;
}> = ({ w, d, floors, floorH = 3, y0 = 0, face, seed, cols, winW = 1.0, winH = 1.3, skipGround, frameColor = M.white, litBias = 0, shutters }) => {
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
          {/* denizlik */}
          <Box size={face === "z" ? [winW + 0.4, 0.09, 0.22] : [0.22, 0.09, winW + 0.4]} pos={[pos[0] + (face === "x" ? 0.06 : 0), pos[1] - winH / 2 - 0.12, pos[2] + (face === "z" ? 0.06 : 0)]} color={M.cream} />
          {shutters &&
            [-1, 1].map((sd) => (
              <Box key={sd} size={face === "z" ? [0.34, winH + 0.1, 0.06] : [0.06, winH + 0.1, 0.34]}
                pos={face === "z" ? [pos[0] + sd * (winW / 2 + 0.28), pos[1], pos[2] + 0.02] : [pos[0] + 0.02, pos[1], pos[2] + sd * (winW / 2 + 0.28)]} color={shutters} />
            ))}
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
  const S = useSeason();
  const k = scale * (0.88 + 0.24 * rand(seed, 1));
  const cols = S.leaves;
  if (S.bare) {
    return (
      <group position={pos} scale={[k, k, k]} rotation={[0, rand(seed, 2) * 6, 0]}>
        <Cyl r={0.2} rTop={0.12} h={2.5} color={M.woodDark} seg={5} />
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} position={[0, 1.7 + i * 0.28, 0]} rotation={[0, i * 1.3 + rand(seed, i), 0]}>
            <Box size={[0.1, 1.5 - i * 0.12, 0.1]} pos={[0.45, 0.55, 0]} rot={[0, 0, -0.75 + i * 0.05]} color={M.woodDark} />
            <mesh position={[0.95 - i * 0.05, 1.1 - i * 0.04, 0]} material={mat(SNOW)}>
              <icosahedronGeometry args={[0.2, 0]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 3.0, 0]} material={mat(SNOW)}>
          <icosahedronGeometry args={[0.32, 0]} />
        </mesh>
        <Shadow pos={[0, 0, 0]} size={[2.2, 2.2]} opacity={0.16} />
      </group>
    );
  }
  return (
    <group position={pos} scale={[k, k, k]} rotation={[0, rand(seed, 2) * 6, 0]}>
      <Cyl r={0.2} rTop={0.14} h={1.5} color={M.woodDark} seg={5} />
      <mesh position={[0, 2.5, 0]} material={mat(cols[tone])}>
        <icosahedronGeometry args={[1.25, 0]} />
      </mesh>
      <mesh position={[0.45, 3.1, -0.2]} material={mat(cols[(tone + 1) % 3])}>
        <icosahedronGeometry args={[0.85, 0]} />
      </mesh>
      {S.blossom &&
        [[-0.9, 2.9, 0.4], [0.8, 2.4, 0.8], [0.1, 3.5, 0.5], [-0.4, 2.2, -1.0]].map((p, i) => (
          <mesh key={i} position={p as V3} material={mat("#F4B6C9")}>
            <icosahedronGeometry args={[0.42, 0]} />
          </mesh>
        ))}
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

/** Kapalı bina gövdesi: dokulu duvar + taş kaide + parapet + (kışın) kar + iniş borusu. */
export const Block: React.FC<{ w: number; d: number; h: number; y0?: number; color: string; trim?: string; parapet?: boolean; tex?: import("./tex").TexKind; ac?: number }> = ({ w, d, h, y0 = 0, color, trim = M.white, parapet = true, tex = "plaster", ac = 0 }) => {
  const S = useSeason();
  return (
    <group>
      <TBase size={[w, h, d]} pos={[0, y0, 0]} color={color} tex={tex} />
      <TBase size={[w + 0.14, 1.0, d + 0.14]} pos={[0, y0, 0]} color="#CFC4AE" tex="stone" />
      {parapet && <BaseBox size={[w + 0.3, 0.35, d + 0.3]} pos={[0, y0 + h, 0]} color={trim} />}
      {S.snow && <BaseBox size={[w + 0.1, 0.18, d + 0.1]} pos={[0, y0 + h + 0.35, 0]} color={SNOW} />}
      <BaseBox size={[0.13, h, 0.13]} pos={[w / 2 + 0.09, y0, d / 2 + 0.09]} color={M.grey} />
      {Array.from({ length: ac }, (_, i) => (
        <group key={i} position={[w / 2 + 0.28, y0 + 4.4 + i * 3, -d / 4 + (i % 2) * 1.2]}>
          <Box size={[0.5, 0.45, 0.8]} color={M.white} />
          <Box size={[0.04, 0.3, 0.55]} pos={[0.26, 0, 0]} color={M.greyDark} />
        </group>
      ))}
    </group>
  );
};

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

/* ------------------------------------------------------------------ referans zenginliği: servi, kiremit çatı, tente, saksı, çit, döşeme */
export const Cypress: React.FC<{ pos: V3; seed?: number; scale?: number }> = ({ pos, seed = 1, scale = 1 }) => {
  const k = scale * (0.85 + 0.35 * rand(seed, 5));
  return (
    <group position={pos} scale={[k, k, k]}>
      <Cyl r={0.12} h={0.6} color={M.woodDark} seg={4} />
      <Cone r={0.75} h={2.2} pos={[0, 0.5, 0]} color={M.greenDark} seg={6} />
      <Cone r={0.6} h={1.9} pos={[0, 1.9, 0]} color={M.green} seg={6} />
      <Cone r={0.4} h={1.2} pos={[0, 3.2, 0]} color={M.greenDark} seg={6} />
      {useSeason().snow && <Cone r={0.34} h={0.9} pos={[0, 3.4, 0]} color={SNOW} seg={6} />}
    </group>
  );
};

/** Dört yüzlü (kırma) kiremit çatı. Taban merkezi pos, ayak izi w×d, yükseklik h. Kışın kar örtüsü. */
export const HipRoof: React.FC<{ pos: V3; w: number; d: number; h: number; color?: string; overhang?: number }> = ({ pos, w, d, h, color = M.roofTile, overhang = 0.45 }) => {
  const S = useSeason();
  const sx = (w + overhang * 2) / Math.SQRT2, sz = (d + overhang * 2) / Math.SQRT2;
  return (
    <group position={pos} scale={[sx, 1, sz]}>
      <mesh position={[0, h / 2, 0]} rotation={[0, Math.PI / 4, 0]} material={roofCoilMaterial(color)}>
        <coneGeometry args={[1, h, 4]} />
      </mesh>
      {S.snow && (
        <mesh position={[0, h * 0.18 + (h * 0.84) / 2, 0]} rotation={[0, Math.PI / 4, 0]} material={mat(SNOW)}>
          <coneGeometry args={[0.8, h * 0.84, 4]} />
        </mesh>
      )}
    </group>
  );
};

const stripeTexture = (c1: string, c2: string): THREE.CanvasTexture =>
  textTexture(`stripe|${c1}|${c2}`, 128, 128, (g, w, h) => {
    const n = 8;
    for (let i = 0; i < n; i++) {
      g.fillStyle = i % 2 ? c2 : c1;
      g.fillRect((i * w) / n, 0, w / n + 1, h);
    }
  });

const awningMats = new Map<string, THREE.Material>();
/** Çizgili tente: ön kenar aşağıda; yüzü +z'ye bakan duvarın üstüne takılır. pos = üst (duvar) kenarı. */
export const Awning: React.FC<{ pos: V3; w?: number; depth?: number; c1?: string; c2?: string }> = ({ pos, w = 3, depth = 1.0, c1 = M.red, c2 = M.white }) => {
  const key = `${c1}|${c2}`;
  let material = awningMats.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({ map: stripeTexture(c1, c2), roughness: 0.95, side: THREE.DoubleSide });
    awningMats.set(key, material);
  }
  const t = 0.5;
  return (
    <group position={pos} rotation={[0, 0, 0]}>
      <mesh position={[0, -Math.sin(t) * depth * 0.5, Math.cos(t) * depth * 0.5]} rotation={[-Math.PI / 2 + t, 0, 0]} material={material}>
        <planeGeometry args={[w, depth]} />
      </mesh>
    </group>
  );
};

export const Pot: React.FC<{ pos: V3; scale?: number; flower?: string }> = ({ pos, scale = 1, flower }) => (
  <group position={pos} scale={[scale, scale, scale]}>
    <Cyl r={0.26} rTop={0.3} h={0.45} color={M.terracotta} seg={7} />
    <mesh position={[0, 0.7, 0]} material={mat(M.leaf)}>
      <icosahedronGeometry args={[0.32, 0]} />
    </mesh>
    {flower && (
      <mesh position={[0.12, 0.92, 0.05]} material={mat(flower)}>
        <icosahedronGeometry args={[0.1, 0]} />
      </mesh>
    )}
  </group>
);

/** Düz çit (x veya z yönünde). */
export const Fence: React.FC<{ from: V3; to: V3; color?: string; h?: number }> = ({ from, to, color = M.ink, h = 0.9 }) => {
  const dx = to[0] - from[0], dz = to[2] - from[2];
  const len = Math.hypot(dx, dz);
  const n = Math.max(2, Math.round(len / 0.7));
  return (
    <group position={from} rotation={[0, Math.atan2(dx, dz), 0]}>
      <Box size={[0.05, 0.05, len]} pos={[0, h, len / 2]} color={color} />
      <Box size={[0.05, 0.05, len]} pos={[0, h * 0.45, len / 2]} color={color} />
      {Array.from({ length: n + 1 }, (_, i) => (
        <Box key={i} size={[0.06, h, 0.06]} pos={[0, h / 2, (len * i) / n]} color={color} />
      ))}
    </group>
  );
};

/** Taş döşeme dokusu (kare plaka üstüne). */
let pavingMat: THREE.Material | null = null;
export const Paving: React.FC<{ size: number; y?: number; plaza?: boolean }> = ({ size, y = 0.01, plaza }) => {
  const snow = useSeason().snow;
  if (snow) {
    return (
      <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat("#E9F0F6")}>
        <planeGeometry args={[size, size]} />
      </mesh>
    );
  }
  if (!pavingMat || plaza) {
    const tex = textTexture(plaza ? "paving-plaza" : "paving", 512, 512, (g, w, h) => {
      const n = 10;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const v = 0.5 + 0.5 * rand(i * 7 + (plaza ? 40 : 0), j);
        const base = plaza ? [226, 214, 186] : [214, 200, 172];
        g.fillStyle = `rgb(${base[0] - v * 14},${base[1] - v * 14},${base[2] - v * 16})`;
        g.fillRect((i * w) / n, (j * h) / n, w / n, h / n);
      }
      g.strokeStyle = "rgba(120,104,80,0.28)";
      g.lineWidth = 2;
      for (let i = 0; i <= n; i++) {
        g.beginPath(); g.moveTo((i * w) / n, 0); g.lineTo((i * w) / n, h); g.stroke();
        g.beginPath(); g.moveTo(0, (i * h) / n); g.lineTo(w, (i * h) / n); g.stroke();
      }
    });
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
    if (plaza) return (
      <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m}>
        <planeGeometry args={[size, size]} />
      </mesh>
    );
    pavingMat = m;
  }
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={pavingMat!}>
      <planeGeometry args={[size, size]} />
    </mesh>
  );
};

/** Boyuta göre döşeme (dikdörtgen parsel). Doku dünya birimine göre tekrarlanır. */
const pavRectMats = new Map<string, THREE.MeshStandardMaterial>();
export const PavingRect: React.FC<{ w: number; d: number; y?: number; plaza?: boolean }> = ({ w, d, y = 0.006, plaza }) => {
  const snow = useSeason().snow;
  if (snow) {
    return (
      <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat("#E9F0F6")}>
        <planeGeometry args={[w, d]} />
      </mesh>
    );
  }
  const key = `${plaza ? "pz" : "pv"}|${Math.round(w * 10)}|${Math.round(d * 10)}`;
  let m = pavRectMats.get(key);
  if (!m) {
    const base = textTexture(plaza ? "paving-plaza" : "paving", 512, 512, (g, cw, ch) => {
      const n = 10;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const v = 0.5 + 0.5 * rand(i * 7 + (plaza ? 40 : 0), j);
        const b = plaza ? [226, 214, 186] : [214, 200, 172];
        g.fillStyle = `rgb(${b[0] - v * 14},${b[1] - v * 14},${b[2] - v * 16})`;
        g.fillRect((i * cw) / n, (j * ch) / n, cw / n, ch / n);
      }
      g.strokeStyle = "rgba(120,104,80,0.28)";
      g.lineWidth = 2;
      for (let i = 0; i <= n; i++) {
        g.beginPath(); g.moveTo((i * cw) / n, 0); g.lineTo((i * cw) / n, ch); g.stroke();
        g.beginPath(); g.moveTo(0, (i * ch) / n); g.lineTo(cw, (i * ch) / n); g.stroke();
      }
    });
    const tex = base.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(Math.max(1, w / 10), Math.max(1, d / 10));
    tex.needsUpdate = true;
    m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 });
    pavRectMats.set(key, m);
  }
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m}>
      <planeGeometry args={[w, d]} />
    </mesh>
  );
};
