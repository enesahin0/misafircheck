// 00:27–00:38 — Arşiv: iki çözüm, her birinin bedeli.
import React from "react";
import { Big, Panel, Tag, SceneOverlayProps, fadeIn } from "./ui";
import { C } from "../world/palette";
import { clamp } from "../utils/time";

export const ArchiveInterior: React.FC<SceneOverlayProps> = ({ ep, local }) => {
  const [a, b] = ep.decision.options;
  const out = 1 - clamp((local - 308) / 18);
  const rows = [
    { o: a, n: "1", at: 90 },
    { o: b, n: "2", at: 210 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <Tag size={30} color={C.bone} style={{ position: "absolute", left: 64, top: 262, opacity: fadeIn(local, 56, 8) }}>
        ▣ {ep.hud.archive.title}
      </Tag>
      {rows.map(({ o, n, at }, i) => (
        <Panel
          key={n}
          style={{ left: 64, top: 316 + i * 196, width: 880, opacity: fadeIn(local, at, 6), transform: `translateX(${(1 - fadeIn(local, at, 8)) * -40}px)` }}
        >
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Big size={108} color={C.red}>{n}</Big>
            <div>
              <Big size={66}>{o.label.toUpperCase()}</Big>
              <Tag size={28} color={C.red} style={{ marginTop: 10 }}>
                BEDEL ▸ <span style={{ color: C.bone }}>{o.cost.toUpperCase()}</span>
              </Tag>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
};
