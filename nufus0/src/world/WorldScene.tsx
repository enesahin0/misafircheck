// Tek, sürekli 3D dünya: şehir + 14. Sokak + belediye (arşiv kesiti). Her sahne aynı dünyayı farklı kamerayla gösterir.
import React from "react";
import { C } from "./palette";
import { CityBlock } from "./CityBlock";
import { Street14 } from "./CityStreet";
import { IsoCam, IsoCamera } from "./camera";
import { RedCar } from "./Props";
import { ROUTES, RouteId } from "./layout";
import { Municipality } from "./MunicipalArchive";
import type { TerminalState } from "./terminalScreen";
import type { ActorSample } from "../utils/actors";
import { lerp } from "../utils/time";

export type WorldParams = {
  /** 14. Sokak silinme ilerlemesi 0..1 */
  street14Erase: number;
  speakerRed: number;
  redCar: { route: RouteId; t: number };
  cutaway: number;
  redAlert: number;
  drawerOpen: number;
  holdingFile: boolean;
  fileOnDesk: boolean;
  leyla: ActorSample;
  terminal: Omit<TerminalState, "frame" | "alert">;
};

export const IDLE_LEYLA: ActorSample = {
  x: 0.5, z: -3.3, rot: 0, sit: 1, reach: 0, hold: 0, typing: 0, yaw: 0, moving: 0, walkPhase: 0,
};

export const DEFAULT_PARAMS: WorldParams = {
  street14Erase: 0,
  speakerRed: 0,
  redCar: { route: "merkez", t: 0.3 },
  cutaway: 0,
  redAlert: 0,
  drawerOpen: 0,
  holdingFile: false,
  fileOnDesk: true,
  leyla: IDLE_LEYLA,
  terminal: { mode: 0, reveal: 0 },
};

export const WorldScene: React.FC<{ frame: number; params: WorldParams; camera: IsoCam }> = ({
  frame,
  params,
  camera,
}) => {
  const route = ROUTES[params.redCar.route];
  const rx = lerp(route.from[0], route.to[0], params.redCar.t);
  const rz = lerp(route.from[1], route.to[1], params.redCar.t);
  return (
    <>
      <color attach="background" args={[C.deepNight]} />
      <fog attach="fog" args={[C.deepNight, 150, 270]} />
      <hemisphereLight args={["#74879C", "#0B0E12", 2.2]} />
      <directionalLight position={[14, 30, 22]} intensity={2.8} color="#B7C3D1" />
      <IsoCamera {...camera} />
      <CityBlock frame={frame} speakerRed={params.speakerRed} />
      <Street14 erase={params.street14Erase} frame={frame} />
      <Municipality
        frame={frame}
        cutaway={params.cutaway}
        leyla={params.leyla}
        holdingFile={params.holdingFile}
        fileOnDesk={params.fileOnDesk}
        terminal={{ ...params.terminal, frame, alert: params.redAlert }}
        redAlert={params.redAlert}
        drawerOpen={params.drawerOpen}
      />
      <RedCar pos={[rx, 0.04, rz]} rotY={route.rotY} frame={frame} />
    </>
  );
};
