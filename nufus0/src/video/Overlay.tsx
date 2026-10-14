// Kalıcı üst katman: dosya künyesi, vinyet, tarama çizgileri, kırmızı alarm çerçevesi.
import React from "react";
import type { Episode } from "../episodes/schema";
import { FONT_MONO } from "../utils/fonts";
import { C } from "../world/palette";
import { frameClock } from "../utils/time";
import { pulse } from "../utils/deterministic";

export const Vignette: React.FC<{ alert: number; frame: number }> = ({ alert, frame }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(5,7,10,0.62) 100%)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)",
        pointerEvents: "none",
      }}
    />
    {alert > 0.25 && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 ${120 + 60 * pulse(frame, 18)}px rgba(189,55,63,${0.18 * alert + 0.1 * alert * pulse(frame, 18)})`,
          pointerEvents: "none",
        }}
      />
    )}
  </>
);

export const FileHeader: React.FC<{ ep: Episode; frame: number }> = ({ ep, frame }) => (
  <div
    style={{
      position: "absolute",
      left: 64,
      top: 196,
      width: 860,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: FONT_MONO,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: 3,
      color: C.bone,
      opacity: 0.82,
    }}
  >
    <span>
      <span style={{ color: C.red }}>■</span> {ep.dossier} · {ep.title.toUpperCase()}
    </span>
    <span style={{ opacity: 0.7 }}>{frameClock(frame)}</span>
  </div>
);
