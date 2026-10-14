// Sahne üstü HUD için ortak atomlar (2D, programatik tipografi).
import React from "react";
import type { Episode, Scene } from "../episodes/schema";
import { FONT_HEAD, FONT_MONO } from "../utils/fonts";
import { C } from "../world/palette";
import { clamp } from "../utils/time";

export type SceneOverlayProps = { ep: Episode; scene: Scene; frame: number; local: number };

export const typed = (text: string, local: number, start: number, cps = 30) =>
  text.slice(0, Math.max(0, Math.floor(((local - start) / 30) * cps)));

export const fadeIn = (local: number, start: number, len = 6) => clamp((local - start) / len);

export const Panel: React.FC<{
  style?: React.CSSProperties;
  children: React.ReactNode;
  border?: string;
}> = ({ style, children, border = C.red }) => (
  <div
    style={{
      position: "absolute",
      background: "rgba(11,14,18,0.82)",
      borderLeft: `8px solid ${border}`,
      padding: "18px 26px",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Tag: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = C.bone,
  size = 26,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 3,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Big: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size,
  color = C.bone,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_HEAD,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.95,
      letterSpacing: 2,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
