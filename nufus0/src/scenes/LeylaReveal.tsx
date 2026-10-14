// 00:49–00:57 — 63. kişi + 00:57–01:00 kesilme ve son kart.
import React from "react";
import { Big, Panel, Tag, SceneOverlayProps, fadeIn } from "./ui";
import { C } from "../world/palette";
import { pulse } from "../utils/deterministic";
import { clamp, sampleTrack, Track } from "../utils/time";
import { FONT_MONO } from "../utils/fonts";

export const LeylaReveal: React.FC<SceneOverlayProps> = ({ ep, frame, local }) => {
  const r = ep.hud.reveal;
  const rev = sampleTrack(ep.tracks.terminalReveal as unknown as Track, frame, 0);
  const flick = Math.floor(frame / 2) % 2 === 0;
  let count = r.from;
  if (rev > 0.25 && rev <= 0.5) count = flick ? r.to : r.from;
  if (rev > 0.5) count = r.to;
  const hot = rev > 0.25;
  const chars = rev > 0.8 ? Math.min(r.name.length, Math.ceil(((rev - 0.8) / 0.2) * r.name.length)) : 0;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Tag size={28} color={C.bone} style={{ position: "absolute", left: 64, top: 262, opacity: fadeIn(local, 4, 8) }}>
        ▣ {r.counterLabel}
      </Tag>
      <div style={{ position: "absolute", left: 64, top: 310, opacity: fadeIn(local, 4, 8) }}>
        <Big size={250} color={hot ? C.red : C.bone} style={{ textShadow: "0 5px 0 rgba(0,0,0,0.7)" }}>
          {count}
        </Big>
      </div>
      {chars > 0 && frame < 1712 && (
        <Panel
          border={C.red}
          style={{ left: 64, top: 600, width: 880, background: "rgba(189,55,63,0.92)", padding: "10px 26px" }}
        >
          <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 64, letterSpacing: 4, color: C.deepNight }}>
            063 · {r.name.slice(0, chars)}
            {chars < r.name.length ? "_" : ""}
          </div>
        </Panel>
      )}
      {frame >= 1722 && frame < 1766 && (
        <Panel border={C.red} style={{ left: 64, top: 600, width: 880, opacity: fadeIn(frame, 1722, 5), padding: "12px 24px" }}>
          <Tag size={26} color={C.red}>
            <span style={{ opacity: pulse(frame, 12) > 0.4 ? 1 : 0.3 }}>●</span> KAYIT ÇELİŞKİSİ
          </Tag>
          <Big size={64} style={{ marginTop: 6 }}>063 {r.name} · {r.paradox}</Big>
        </Panel>
      )}
    </div>
  );
};

/** Kesilme sahnesi (S8) ve son kart. LeylaReveal ile aynı ekranı paylaşır; son kart siyah üstüne biner. */
export const CutAndCard: React.FC<SceneOverlayProps> = (p) => {
  const { ep, frame } = p;
  const f = ep.hud.finalCard;
  const showCard = frame >= 1769;
  const a = clamp((frame - 1769) / 4);
  return (
    <>
      <LeylaReveal {...p} />
      {showCard && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.deepNight,
            opacity: a,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 120,
            paddingRight: 60,
          }}
        >
          <Big size={118} color={C.bone} style={{ letterSpacing: 16 }}>{f.brand}</Big>
          <div style={{ width: 520, height: 6, background: C.red, margin: "34px 0 20px" }} />
          <Big size={300} color={C.red} style={{ transform: `scale(${1 + 0.02 * pulse(frame, 15)})` }}>{f.question}</Big>
          <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 60, letterSpacing: 6, color: C.bone, marginTop: 28 }}>{f.when}</div>
          <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: C.concreteLight, marginTop: 60 }}>
            {ep.hud.footer}
          </div>
        </div>
      )}
    </>
  );
};
