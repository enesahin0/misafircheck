// 00:19–00:27 — Nüfus 0: şehir maketi kuşbakışı + az sayıda HUD rakamı.
import React from "react";
import { Big, Panel, Tag, SceneOverlayProps, fadeIn } from "./ui";
import { C } from "../world/palette";
import { clamp, easeOut } from "../utils/time";
import { pulse } from "../utils/deterministic";

const fmt = (n: number) => n.toLocaleString("de-DE"); // 18.407

export const CityArchive: React.FC<SceneOverlayProps> = ({ ep, local, frame }) => {
  const p = ep.hud.population;
  const count = Math.round(p.believed * easeOut(clamp((local - 88) / 70)));
  const zeroIn = fadeIn(local, 168, 4);
  const out = 1 - clamp((local - 222) / 14);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <Tag size={34} color={C.bone} style={{ position: "absolute", left: 64, top: 262, opacity: fadeIn(local, 6, 8) }}>
        ▣ {p.city}
      </Tag>
      {local >= 76 && (
        <div style={{ position: "absolute", left: 64, top: 318, opacity: fadeIn(local, 76, 6) }}>
          <Big size={200} style={{ textShadow: "0 4px 0 rgba(0,0,0,0.7)" }}>{fmt(count)}</Big>
          <Tag size={34} color={C.bone} style={{ marginTop: 8 }}>{p.believedLabel}</Tag>
        </div>
      )}
      {local >= 168 && (
        <Panel style={{ left: 64, top: 650, opacity: zeroIn, width: 620, padding: "14px 28px" }}>
          <Tag size={28} color={C.bone}>{p.officialLabel}</Tag>
          <Big size={190} color={C.red} style={{ opacity: pulse(frame, 30) > 0.08 ? 1 : 0.85 }}>{p.official}</Big>
        </Panel>
      )}
    </div>
  );
};
