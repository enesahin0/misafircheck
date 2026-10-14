// Okunaklı altyazı — programatik (CLAUDE.md §3). Instagram arayüzü için alt ~320px ve sağ kenar boş bırakılır.
import React from "react";
import type { Episode } from "../episodes/schema";
import { clamp } from "../utils/time";
import { FONT_HEAD } from "../utils/fonts";
import { C } from "../world/palette";

export const SUBTITLE_BOTTOM = 1580; // kutunun alt kenarı (px, üstten)

export const Subtitle: React.FC<{ ep: Episode; frame: number }> = ({ ep, frame }) => {
  const cap = ep.captions.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  const inA = clamp((frame - cap.from) / 5);
  const outA = clamp((cap.to - frame) / 5);
  const a = Math.min(inA, outA);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 900,
        top: SUBTITLE_BOTTOM - 190,
        height: 190,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        opacity: a,
        transform: `translateY(${(1 - a) * 8}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEAD,
          fontWeight: 600,
          fontSize: 60,
          lineHeight: 1.08,
          letterSpacing: 0.6,
          color: C.bone,
          background: "rgba(11,14,18,0.78)",
          borderLeft: `8px solid ${C.red}`,
          padding: "14px 24px 16px 22px",
          maxWidth: 900,
          textShadow: "0 2px 0 rgba(0,0,0,0.6)",
        }}
      >
        {cap.text}
      </div>
    </div>
  );
};
