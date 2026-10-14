// 00:00–00:04 — Sokak siliniyor. İlk karede imkânsız olay + sessiz izlenebilir iki satır.
import React from "react";
import { Big, Tag, SceneOverlayProps, fadeIn } from "./ui";
import { C } from "../world/palette";
import { clamp } from "../utils/time";
import { pulse } from "../utils/deterministic";

export const StreetDeletion: React.FC<SceneOverlayProps> = ({ ep, local }) => {
  const [l1, l2] = ep.hud.hook.lines;
  const out = 1 - clamp((local - 104) / 14);
  const bar = clamp(local / 10);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", left: 64, top: 262 }}>
        <Tag color={C.red} size={30}>
          <span style={{ opacity: pulse(local, 20) > 0.3 ? 1 : 0.25 }}>●</span> {ep.hud.hook.clock} · DÜZELTME
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 64, top: 330, width: 950 }}>
        <Big size={134} style={{ textShadow: "0 4px 0 rgba(0,0,0,0.7)" }}>
          {l1}
        </Big>
        <div style={{ height: 10, background: C.red, width: `${bar * 100}%`, marginTop: 14 }} />
        <Big
          size={134}
          color={C.red}
          style={{
            marginTop: 20,
            opacity: fadeIn(local, 16, 4),
            transform: `translateX(${(1 - fadeIn(local, 16, 5)) * -30}px)`,
            textShadow: "0 4px 0 rgba(0,0,0,0.7)",
          }}
        >
          {l2}
        </Big>
      </div>
    </div>
  );
};
