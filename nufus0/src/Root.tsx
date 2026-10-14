import React from "react";
import { Composition } from "remotion";
import { CityTest5s, Debug, DebugProps } from "./video/CityTest";
import { EpisodeComposition, EpisodeProps } from "./video/Episode";
import { episode001 } from "./episodes/episode001";
import { worldStateSchema } from "./episodes/schema";
import worldStateJson from "./story/worldState.json";
import { room } from "./world/layout";

const worldState = worldStateSchema.parse(worldStateJson);

// Yeni bölüm eklemek: episodes/episode002.ts oluştur → aşağıya bir <Composition> daha ekle.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Nufus0Episode001"
      component={EpisodeComposition}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
      defaultProps={{ episode: episode001, worldState } satisfies EpisodeProps}
    />
    <Composition id="Nufus0Test5s" component={CityTest5s} width={1080} height={1920} fps={30} durationInFrames={150} />
    <Composition
      id="Nufus0Debug"
      component={Debug}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
      defaultProps={{ frame: 0, params: {}, camera: { target: room(0, 1, -2), zoom: 40 } } satisfies DebugProps}
    />
  </>
);
