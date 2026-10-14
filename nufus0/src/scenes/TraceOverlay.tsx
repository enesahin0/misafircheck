// 00:11–00:19 — İz: kayıtlarda yok, kamerada yok, ama içeride ışık var.
import React from "react";
import { Panel, Tag, SceneOverlayProps, fadeIn, typed } from "./ui";
import { C } from "../world/palette";
import { pulse } from "../utils/deterministic";

const STARTS = [12, 68, 128];

export const TraceOverlay: React.FC<SceneOverlayProps> = ({ ep, frame, local }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {ep.hud.trace.tags.map((t, i) => {
      if (local < STARTS[i]) return null;
      const last = i === ep.hud.trace.tags.length - 1;
      return (
        <Panel
          key={i}
          border={last ? C.amber : C.red}
          style={{ left: 64, top: 262 + i * 92, opacity: fadeIn(local, STARTS[i], 5), padding: "14px 24px" }}
        >
          <Tag color={last ? C.bone : C.bone} size={32}>
            {typed(t, local, STARTS[i], 40)}
            <span style={{ opacity: pulse(frame, 10) > 0.5 ? 1 : 0, color: C.red }}>_</span>
          </Tag>
        </Panel>
      );
    })}
  </div>
);
