import type React from "react";
import type { SceneOverlayProps } from "./ui";
import { StreetDeletion } from "./StreetDeletion";
import { Announcement } from "./Announcement";
import { TraceOverlay } from "./TraceOverlay";
import { CityArchive } from "./CityArchive";
import { ArchiveInterior } from "./ArchiveInterior";
import { DecisionScreen } from "./DecisionScreen";
import { LeylaReveal, CutAndCard } from "./LeylaReveal";
import type { OverlayKey } from "./keys";

/** Bölüm verisindeki `scene.overlay` anahtarı → bileşen */
export const SCENE_OVERLAYS: Record<OverlayKey, React.FC<SceneOverlayProps>> = {
  streetDeletion: StreetDeletion,
  announcement: Announcement,
  trace: TraceOverlay,
  population: CityArchive,
  archive: ArchiveInterior,
  decision: DecisionScreen,
  reveal: LeylaReveal,
  cut: CutAndCard,
};
