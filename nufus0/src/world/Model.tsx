// Kütüphane GLB modellerini bizim sanat diline uydurarak yükler: düz gölgeleme + az doygunluk + soğuk ton.
// Kullanım: <Model tag="sofa" pos={[0,0,0]} scale={1.2} />  veya  <Model id="kenney/furniture-kit/loungeSofa" />
import React, { useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { staticFile } from "remotion";
import modelIndex from "../generated/modelIndex.json";
import { findModels, type ModelEntry } from "../utils/modelLibrary";
import type { V3 } from "./primitives";

const entries = modelIndex.entries as ModelEntry[];

export type ModelStyle = { saturation?: number; tint?: string; brightness?: number };
const DEFAULT_STYLE: Required<ModelStyle> = { saturation: 0.38, tint: "#B9C4CF", brightness: 0.95 };

const stylize = (src: THREE.Material, st: Required<ModelStyle>): THREE.Material => {
  const m = src as THREE.MeshStandardMaterial;
  const out = new THREE.MeshStandardMaterial({ map: m.map ?? null, color: m.color ?? new THREE.Color("#888"), flatShading: true, roughness: 1, metalness: 0, transparent: m.transparent, opacity: m.opacity, side: m.side });
  const tint = new THREE.Color(st.tint).multiplyScalar(st.brightness);
  out.onBeforeCompile = (shader) => {
    shader.uniforms.uSat = { value: st.saturation };
    shader.uniforms.uTint = { value: tint };
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uSat;\nuniform vec3 uTint;")
      .replace("#include <map_fragment>", "#include <map_fragment>\n float l_ = dot(diffuseColor.rgb, vec3(0.299,0.587,0.114));\n diffuseColor.rgb = mix(vec3(l_), diffuseColor.rgb, uSat) * uTint;");
  };
  out.customProgramCacheKey = () => `nufus-style-${st.saturation}-${st.tint}-${st.brightness}`;
  return out;
};

export const resolveModel = (o: { id?: string; tag?: string; pick?: number }): ModelEntry | null => {
  if (o.id) return entries.find((e) => e.id === o.id) ?? null;
  if (o.tag) {
    const hits = findModels(entries, o.tag);
    return hits.length ? hits[Math.min(o.pick ?? 0, hits.length - 1)] : null;
  }
  return null;
};

const Loaded: React.FC<{ url: string; pos: V3; rot: V3; scale: number | V3; style: Required<ModelStyle> }> = ({ url, pos, rot, scale, style }) => {
  const gltf = useLoader(GLTFLoader, url);
  const root = useMemo(() => {
    const c = gltf.scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.material = Array.isArray(mesh.material) ? mesh.material.map((x) => stylize(x, style)) : stylize(mesh.material, style);
    });
    return c;
  }, [gltf, style]);
  const s: V3 = typeof scale === "number" ? [scale, scale, scale] : scale;
  return <primitive object={root} position={pos} rotation={rot} scale={s} />;
};

export const Model: React.FC<{ id?: string; tag?: string; pick?: number; pos?: V3; rot?: V3; scale?: number | V3; style?: ModelStyle }> = ({
  id, tag, pick, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1, style,
}) => {
  const e = resolveModel({ id, tag, pick });
  const st = useMemo(() => ({ ...DEFAULT_STYLE, ...style }), [style?.saturation, style?.tint, style?.brightness]);
  if (!e) return null;
  return <Loaded url={staticFile(e.path)} pos={pos} rot={rot} scale={scale} style={st} />;
};
