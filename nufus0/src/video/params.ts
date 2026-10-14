// Bölüm verisi + dünya durumu + kare → WorldScene parametreleri.
import type { Episode, WorldState } from "../episodes/schema";
import { DEFAULT_PARAMS, IDLE_LEYLA, WorldParams } from "../world/WorldScene";
import { sampleActor } from "../utils/actors";
import { sampleTrack, Track } from "../utils/time";

const tr = (ep: Episode, name: string, frame: number, fallback: number) => {
  const t = ep.tracks[name];
  return t ? sampleTrack(t as unknown as Track, frame, fallback) : fallback;
};

export const resolveWorld = (ep: Episode, ws: WorldState, frame: number): WorldParams => {
  const erasedByState = ws.streets["14"]?.status === "ERASED" ? 1 : 0;
  return {
    ...DEFAULT_PARAMS,
    // Parametre bölüm eğrisinde varsa eğri; yoksa kalıcı dünya durumu (süreklilik).
    street14Erase: tr(ep, "street14Erase", frame, erasedByState),
    speakerRed: tr(ep, "speakerRed", frame, 0),
    redCar: {
      route: ep.redCarRoute ?? ws.props.redCar.route,
      t: tr(ep, "redCarT", frame, ws.props.redCar.t),
    },
    cutaway: tr(ep, "cutaway", frame, 0),
    redAlert: tr(ep, "redAlert", frame, 0),
    drawerOpen: tr(ep, "drawerOpen", frame, 0),
    holdingFile: tr(ep, "holdingFile", frame, 0) > 0.5,
    fileOnDesk: true,
    leyla: ep.leyla.length ? sampleActor(ep.leyla, frame) : IDLE_LEYLA,
    terminal: {
      mode: tr(ep, "terminalMode", frame, 0),
      reveal: tr(ep, "terminalReveal", frame, 0),
    },
  };
};

export const trackValue = tr;
