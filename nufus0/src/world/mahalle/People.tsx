// MAHALLE karakterleri: mevcut Humanoid iskeleti + karakter başına renk/ölçek/aksesuar. Tamamen deterministik.
import React from "react";
import { Humanoid, Outfit } from "../Characters";
import { Box, Cyl, Shadow, V3 } from "../primitives";
import { mat } from "../materials";
import { M } from "./palette";
import { useSeason } from "./kit";
import { CHAR_COLORS, STATIONS } from "./layout";
import type { ActorSample } from "../../utils/actors";
import { hash } from "../../utils/deterministic";

type Acc = "cap" | "apron" | "chef" | "headband" | "glasses" | "scarf" | "beanie" | "scarfS";
type Look = { skin: string; hair: string; trousers: string; scale: number; acc?: Acc[]; jacket?: string };

// Yaş/boy/aksesuar: izometrik okunurluk için silüet farkı (boy, şapka, önlük).
export const LOOKS: Record<string, Look> = {
  hacer: { skin: M.skin1, hair: "#E6E2DA", trousers: M.navy, scale: 0.84, acc: ["glasses"] },
  hatice: { skin: M.skin2, hair: "#3B2A24", trousers: M.ink, scale: 0.88, acc: ["apron"] },
  nuri: { skin: M.skin1, hair: "#CFCBC2", trousers: M.greyDark, scale: 0.9, acc: ["apron"] },
  ferhat: { skin: M.skin2, hair: "#241A16", trousers: M.ink, scale: 0.98, acc: ["chef", "apron"] },
  nermin: { skin: M.skin1, hair: "#7A2F2F", trousers: M.ink, scale: 0.88 },
  nil: { skin: M.skin1, hair: "#1E1A22", trousers: M.ink, scale: 0.92, acc: ["scarf"], jacket: M.neon },
  koray: { skin: M.skin3, hair: "#1A1614", trousers: M.ink, scale: 1.0 },
  kerem: { skin: M.skin2, hair: "#3A2B20", trousers: M.greyDark, scale: 0.94, acc: ["headband"] },
  recep: { skin: M.skin2, hair: "#2A2420", trousers: M.navy, scale: 0.94, acc: ["cap"], jacket: M.navy },
  kemal: { skin: M.skin3, hair: "#1F1A17", trousers: M.ink, scale: 0.94, acc: ["cap"] },
  bulent: { skin: M.skin2, hair: "#2D221C", trousers: M.greyDark, scale: 0.92 },
  mert: { skin: M.skin1, hair: "#2B211B", trousers: M.ink, scale: 0.9, acc: ["apron"] },
  efe: { skin: M.skin1, hair: "#5B3A26", trousers: M.blue, scale: 0.52 },
  defne: { skin: M.skin2, hair: "#3A2A22", trousers: M.ink, scale: 0.8 },
  default: { skin: M.skin1, hair: "#352A22", trousers: M.greyDark, scale: 0.88 },
};

export const outfitFor = (id: string): Outfit => {
  if (id.startsWith("amb")) return ambientOutfit(Number(id.slice(3)));
  const l = LOOKS[id] ?? LOOKS.default;
  return { jacket: l.jacket ?? CHAR_COLORS[id] ?? M.sky, trousers: l.trousers, skin: l.skin, hair: l.hair, scale: l.scale };
};

const Accessories: React.FC<{ acc: Acc[]; sit: number }> = ({ acc, sit }) => {
  const y = -0.45 * sit;
  return (
    <group position={[0, y, 0]}>
      {acc.includes("cap") && (
        <>
          <Box size={[0.36, 0.1, 0.36]} pos={[0, 2.0, -0.02]} color={M.navy} />
          <Box size={[0.3, 0.03, 0.16]} pos={[0, 1.96, 0.2]} color={M.navy} />
        </>
      )}
      {acc.includes("chef") && <Cyl r={0.17} h={0.3} pos={[0, 1.95, -0.02]} color={M.white} seg={8} />}
      {acc.includes("headband") && <Box size={[0.34, 0.05, 0.34]} pos={[0, 1.98, -0.02]} color={M.neonCyan} />}
      {acc.includes("apron") && <Box size={[0.46, 0.55, 0.04]} pos={[0, 1.2, 0.15]} color={M.white} />}
      {acc.includes("scarf") && (
        <mesh position={[0, 1.78, 0]} material={mat(M.neon)}>
          <icosahedronGeometry args={[0.19, 0]} />
        </mesh>
      )}
      {acc.includes("glasses") && <Box size={[0.26, 0.05, 0.05]} pos={[0, 1.92, 0.15]} color={M.ink} />}
      {acc.includes("beanie") && (
        <>
          <Box size={[0.36, 0.16, 0.36]} pos={[0, 2.02, -0.02]} color={M.red} />
          <Box size={[0.1, 0.1, 0.1]} pos={[0, 2.13, -0.02]} color={M.white} />
        </>
      )}
      {acc.includes("scarfS") && <Box size={[0.34, 0.1, 0.34]} pos={[0, 1.74, 0]} color={M.orange} />}
    </group>
  );
};

export type PersonState = "idle" | "talk" | "walk" | "sit" | "point";
export type CastEntry = { id: string; pos?: [number, number]; y?: number; rot?: number; state?: PersonState; seed?: number };

export const poseFor = (state: PersonState, frame: number, seed: number): Pick<ActorSample, "sit" | "reach" | "hold" | "typing" | "yaw" | "moving" | "walkPhase"> => {
  const t = frame + seed * 31;
  switch (state) {
    case "walk": return { sit: 0, reach: 0, hold: 0, typing: 0, yaw: 0, moving: 1, walkPhase: (t / 30) * Math.PI * 2 * 1.1 };
    case "sit": return { sit: 1, reach: 0, hold: 0, typing: 0, yaw: Math.sin(t / 50) * 0.3, moving: 0, walkPhase: 0 };
    case "talk": return { sit: 0, reach: 0, hold: 0.25 + 0.25 * Math.sin(t / 9) ** 2, typing: 0, yaw: Math.sin(t / 13) * 0.35, moving: 0, walkPhase: 0 };
    case "point": return { sit: 0, reach: 1, hold: 0, typing: 0, yaw: 0, moving: 0, walkPhase: 0 };
    default: return { sit: 0, reach: 0, hold: 0, typing: 0, yaw: Math.sin(t / 70) * 0.25, moving: 0, walkPhase: 0 };
  }
};

export const Person: React.FC<{ entry: CastEntry; frame: number }> = ({ entry, frame }) => {
  const st = STATIONS[entry.id];
  const look = LOOKS[entry.id] ?? LOOKS.default;
  const seed = entry.seed ?? Math.floor(hash(entry.id.length * 7 + entry.id.charCodeAt(0)) * 100);
  const state: PersonState = entry.state ?? (st?.sit ? "sit" : "idle");
  const p = poseFor(state, frame, seed);
  const x = entry.pos?.[0] ?? st?.x ?? 0;
  const z = entry.pos?.[1] ?? st?.z ?? 0;
  const y = (entry.y ?? st?.y ?? 0) + 0.15;
  const rot = entry.rot ?? st?.rot ?? 0;
  const S = useSeason();
  const o = outfitFor(entry.id);
  const seasonal: Acc[] = S.cloth === "kalın" ? ["beanie", "scarfS"] : S.cloth === "ceketli" && seed % 2 === 0 ? ["scarfS"] : [];
  const accAll = [...(look.acc ?? []), ...seasonal.filter((a) => !(look.acc ?? []).includes("cap") || a !== "beanie")];
  const pose: ActorSample = { x: 0, z: 0, rot: 0, ...p };
  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      <Humanoid outfit={o} pose={pose} frame={frame} />
      {accAll.length > 0 && (
        <group scale={[o.scale ?? 1, o.scale ?? 1, o.scale ?? 1]}>
          <Accessories acc={accAll} sit={p.sit} />
        </group>
      )}
    </group>
  );
};

/** Hayvanlar: Paşa (kedi), Karabaş (köpek). */
export const Pet: React.FC<{ kind: "cat" | "dog"; pos: V3; rot?: number; frame: number }> = ({ kind, pos, rot = 0, frame }) => {
  const dog = kind === "dog";
  const c = dog ? "#3A322C" : "#D9A066";
  const wag = Math.sin(frame / 3) * 0.5;
  const s = dog ? 1 : 0.7;
  return (
    <group position={[pos[0], pos[1] + 0.15, pos[2]]} rotation={[0, rot, 0]} scale={[s, s, s]}>
      <Shadow pos={[0, 0, 0]} size={[1.1, 0.6]} opacity={0.3} />
      <Box size={[0.4, 0.35, 0.9]} pos={[0, 0.45, 0]} color={c} />
      <Box size={[0.32, 0.3, 0.32]} pos={[0, 0.7, 0.55]} color={c} />
      <Box size={[0.1, 0.1, 0.14]} pos={[0, 0.65, 0.75]} color={M.ink} />
      {[[-0.14, 0.3], [0.14, 0.3], [-0.14, -0.3], [0.14, -0.3]].map(([x, z], i) => (
        <Box key={i} size={[0.1, 0.3, 0.1]} pos={[x, 0.15, z]} color={c} />
      ))}
      <group position={[0, 0.6, -0.5]} rotation={[0.8, wag * (dog ? 1 : 0.4), 0]}>
        <Box size={[0.08, 0.5, 0.08]} pos={[0, 0.2, 0]} color={c} />
      </group>
    </group>
  );
};

/** Ambiyans: kaldırım rotalarında (map.json walkRoutes) gidip gelen anonim yayalar. Kadroyla karışmaz. */
const AMB_COLORS = [M.rose, M.mustard, M.sky, M.mint, M.terracotta, M.lilac, M.orange, M.blue];
export const Ambient: React.FC<{ frame: number; routes: [number, number, number, number][] }> = ({ frame, routes }) => (
  <>
    {routes.flatMap((r, ri) =>
      [0, 1].map((k) => {
        const [x1, z1, x2, z2] = r;
        const L = Math.hypot(x2 - x1, z2 - z1);
        const seed = 7 + ri * 13 + k * 29;
        const s = (frame * 0.05 + seed * 4.3) % (2 * L);
        const fwd = s < L;
        const t = (fwd ? s : 2 * L - s) / L;
        const rot = Math.atan2(x2 - x1, z2 - z1) + (fwd ? 0 : Math.PI);
        const i = ri * 2 + k;
        return <Person key={`a${i}`} entry={{ id: `amb${i % AMB_COLORS.length}`, pos: [x1 + (x2 - x1) * t, z1 + (z2 - z1) * t], y: 0, rot, state: "walk", seed }} frame={frame} />;
      }),
    )}
  </>
);

export const ambientOutfit = (i: number): Outfit => ({ jacket: AMB_COLORS[i % AMB_COLORS.length], trousers: M.greyDark, skin: M.skin1, hair: "#2B221C", scale: 0.88 });
