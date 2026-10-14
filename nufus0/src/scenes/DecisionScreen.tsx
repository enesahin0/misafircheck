// 00:38–00:49 — A / B kararı. Bedel tek bakışta okunur.
import React from "react";
import { Big, Panel, Tag, SceneOverlayProps, fadeIn } from "./ui";
import { C } from "../world/palette";
import { pulse } from "../utils/deterministic";
import { clamp } from "../utils/time";

export const DecisionScreen: React.FC<SceneOverlayProps> = ({ ep, local, frame }) => {
  const opts = ep.decision.options;
  const starts = [8, 98];
  const out = 1 - clamp((local - 318) / 10);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <Tag size={30} color={C.red} style={{ position: "absolute", left: 64, top: 262, opacity: fadeIn(local, 2, 6) }}>
        ● KARAR · {ep.dossier}
      </Tag>
      {opts.map((o, i) => (
        <div
          key={o.id}
          style={{
            position: "absolute",
            left: 64,
            top: 780 + i * 290,
            width: 880,
            height: 260,
            display: "flex",
            opacity: fadeIn(local, starts[i], 6),
            transform: `translateY(${(1 - fadeIn(local, starts[i], 9)) * 36}px)`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ width: 230, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Big size={230} color={C.bone}>{o.id}</Big>
          </div>
          <div style={{ flex: 1, background: "rgba(11,14,18,0.92)", padding: "26px 30px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Big size={74}>{o.label.toUpperCase()}</Big>
            <Tag size={26} color={C.red} style={{ marginTop: 16 }}>BEDEL</Tag>
            <Big size={50} color={C.bone} style={{ marginTop: 4 }}>{o.cost.toUpperCase()}</Big>
          </div>
        </div>
      ))}
      {local >= 190 && (
        <Panel
          border={C.amber}
          style={{ left: 64, top: 330, opacity: fadeIn(local, 190, 8), width: 880 }}
        >
          <Tag size={34} color={C.bone}>
            YORUMLARA <span style={{ color: C.red }}>A</span> YA DA <span style={{ color: C.red }}>B</span> YAZ
            <span style={{ opacity: pulse(frame, 12) > 0.5 ? 1 : 0 }}>_</span>
          </Tag>
          <Tag size={24} color={C.concreteLight} style={{ marginTop: 10, letterSpacing: 2 }}>
            ÇOĞUNLUK KAZANIR · SONUÇ YARIN 20.00
          </Tag>
        </Panel>
      )}
    </div>
  );
};
