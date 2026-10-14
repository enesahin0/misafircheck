// 00:04–00:11 — Anons: hoparlör kırmızı yanar, anons metni ekranda daktilo gibi yazılır.
import React from "react";
import { Panel, Tag, Big, SceneOverlayProps, fadeIn, typed } from "./ui";
import { C } from "../world/palette";
import { noise1, pulse } from "../utils/deterministic";
import { sampleTrack, Track } from "../utils/time";

export const Announcement: React.FC<SceneOverlayProps> = ({ ep, frame, local }) => {
  const red = sampleTrack(ep.tracks.speakerRed as unknown as Track, frame, 0);
  const label = ep.hud.announce.label;
  const quote = typed(ep.hud.announce.quote, local, 112, 22);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Panel style={{ left: 64, top: 262, opacity: fadeIn(local, 40, 8), width: 700 }}>
        <Tag color={C.red} size={28}>
          <span style={{ opacity: pulse(frame, 14) > 0.4 ? 1 : 0.3 }}>●</span> {label}
        </Tag>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60, marginTop: 14 }}>
          {Array.from({ length: 26 }).map((_, i) => {
            const h = 8 + 52 * noise1(frame * 0.55 + i * 3.7, 2) * red;
            return <div key={i} style={{ width: 14, height: h, background: red > 0.5 ? C.red : C.concrete }} />;
          })}
        </div>
      </Panel>
      {local >= 112 && (
        <Panel style={{ left: 64, top: 470, width: 880, opacity: fadeIn(local, 112, 6), borderLeftWidth: 10 }}>
          <Big size={84} style={{ minHeight: 170 }}>
            <span style={{ color: C.bone }}>{quote}</span>
            <span style={{ color: C.red, opacity: pulse(frame, 12) > 0.5 ? 1 : 0, fontSize: 60 }}>▌</span>
          </Big>
        </Panel>
      )}
    </div>
  );
};
