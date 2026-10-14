// Ortografik izometrik kamera. Konum her kare, props'tan hesaplanır (useFrame YOK).
import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { degToRad } from "../utils/time";
import type { V3 } from "./primitives";

export const DEFAULT_AZ = 45;
export const DEFAULT_EL = 38; // CLAUDE.md: 35–45° arası

export type IsoCam = { target: V3; zoom: number; az?: number; el?: number };

export const IsoCamera: React.FC<IsoCam> = ({ target, zoom, az = DEFAULT_AZ, el = DEFAULT_EL }) => {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera;
  useLayoutEffect(() => {
    const a = degToRad(az);
    const e = degToRad(el);
    const dist = 140;
    camera.position.set(
      target[0] + dist * Math.cos(e) * Math.sin(a),
      target[1] + dist * Math.sin(e),
      target[2] + dist * Math.cos(e) * Math.cos(a),
    );
    camera.zoom = zoom;
    camera.near = 1;
    camera.far = 420;
    camera.up.set(0, 1, 0);
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  });
  return null;
};
