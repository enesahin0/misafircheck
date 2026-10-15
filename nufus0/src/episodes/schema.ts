// Bölüm ve dünya durumu şemaları (zod). Yeni bölüm = yeni veri dosyası; kod değişmez.
import { z } from "zod";

const V3 = z.tuple([z.number(), z.number(), z.number()]);
const frame = z.number().int().min(0);

export const cameraKeySchema = z.object({
  f: frame,
  target: V3,
  zoom: z.number().positive(),
  az: z.number().optional(),
  el: z.number().optional(),
});

export const sceneSchema = z.object({
  id: z.string(),
  name: z.string(),
  from: frame,
  to: frame, // son dahil değil
  camera: z.array(cameraKeySchema).min(1),
  /** küçük, deterministik el kamerası titremesi (dünya birimi) */
  sway: z.number().default(0),
  /** sahne üstü HUD bileşeni (scenes/index.ts içindeki anahtar) */
  overlay: z.string().optional(),
  transitionIn: z.enum(["none", "dip", "glitch"]).default("none"),
  /** Her sahnede 1 gizli ipucu + 2–4 küçük yaşam ayrıntısı (veri modelinde sabit; yanlışlıkla değişmesin) */
  clue: z.object({ id: z.string(), note: z.string() }),
  lifeDetails: z.array(z.string()).min(2).max(4),
});

export const captionSchema = z.object({ from: frame, to: frame, text: z.string() });

const trackKey = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.enum(["l", "s"])]),
]);

const actorKeySchema = z.object({
  f: frame,
  pos: z.tuple([z.number(), z.number()]),
  rot: z.number(),
  sit: z.number().optional(),
  reach: z.number().optional(),
  hold: z.number().optional(),
  typing: z.number().optional(),
  yaw: z.number().optional(),
});

export const audioSchema = z.object({
  /** public/audio/narration/<file>.(mp3|wav|m4a) — dosya yoksa o satır sessiz geçilir */
  narration: z.array(z.object({ id: z.string(), file: z.string(), from: frame, volume: z.number().default(1) })),
  /**
   * Üç yoldan TAM biri: `src` (public/audio/<src> yolu), `lib` (kütüphane kimliği, ör. "kenney/rpg-audio/doorClose_2" — BİTMİŞ bölümlerde bunu kullan, kütüphane büyüse de ses değişmez)
   * ya da `tag` (keşif için etiket araması; kütüphane büyüdükçe seçilen ses KAYABİLİR). `pick`: etiket sonuç sırası.
   */
  sfx: z.array(
    z
      .object({ id: z.string(), src: z.string().optional(), lib: z.string().optional(), tag: z.string().optional(), pick: z.number().int().min(0).optional(), from: frame, volume: z.number().default(0.7) })
      .refine((s) => [s.src, s.lib, s.tag].filter(Boolean).length === 1, { message: "sfx: src, lib veya tag'den TAM biri verilmeli" }),
  ),
  music: z.object({ src: z.string(), volume: z.number().default(0.35) }).optional(),
});

export const decisionSchema = z.object({
  id: z.string(),
  options: z.array(z.object({ id: z.string(), label: z.string(), cost: z.string() })).length(2),
  status: z.enum(["OPEN", "CLOSED"]),
  closesAtLocal: z.string().nullable(),
  winner: z.string().nullable(),
  votes: z.record(z.number()).nullable(),
});

export const episodeSchema = z.object({
  episodeId: z.string(),
  title: z.string(),
  dossier: z.string(), // "DOSYA 001"
  durationFrames: z.literal(1800),
  fps: z.literal(30),
  width: z.literal(1080),
  height: z.literal(1920),
  branchFromPrevious: z.string().nullable(),
  decision: decisionSchema,
  persistentClues: z.array(z.string()),
  scenes: z.array(sceneSchema).length(8),
  captions: z.array(captionSchema),
  /** 3D dünyayı süren sayısal eğriler — anahtar adları WorldScene parametreleridir */
  tracks: z.record(z.array(trackKey)),
  redCarRoute: z.enum(["belediye", "merkez"]).optional(),
  leyla: z.array(actorKeySchema).min(1),
  /** "Kayıt/düzeltme hatası" anları — glitch SADECE burada çalışır */
  glitches: z.array(z.object({ at: frame, len: z.number().int().positive(), power: z.number().min(0).max(1) })),
  hud: z.object({
    hook: z.object({ lines: z.array(z.string()).length(2), clock: z.string() }),
    announce: z.object({ label: z.string(), quote: z.string() }),
    trace: z.object({ tags: z.array(z.string()) }),
    population: z.object({ city: z.string(), believed: z.number(), official: z.number(), believedLabel: z.string(), officialLabel: z.string() }),
    archive: z.object({ title: z.string() }),
    reveal: z.object({ counterLabel: z.string(), from: z.number(), to: z.number(), name: z.string(), paradox: z.string() }),
    finalCard: z.object({ brand: z.string(), question: z.string(), when: z.string() }),
    footer: z.string(),
  }),
  audio: audioSchema,
  /** Süreklilik: bölüm başında dünyanın hangi durumda olması gerektiği / bölümün neyi değiştirdiği */
  continuity: z.object({
    requires: z.object({ streets: z.record(z.string()).default({}) }),
    sets: z.object({ streets: z.record(z.string()).default({}) }),
  }),
  publishing: z.object({
    postLocal: z.string(),
    voteClosesLocal: z.string(),
    caption: z.string(),
    story: z.array(z.string()),
  }),
});

export type Episode = z.infer<typeof episodeSchema>;
export type Scene = z.infer<typeof sceneSchema>;

/* ------------------------------------------------------------------ dünya durumu */
export const worldStateSchema = z.object({
  meta: z.object({ lastEpisode: z.string(), note: z.string() }),
  populationOfficial: z.number(),
  populationBelieved: z.number(),
  streets: z.record(
    z.object({
      name: z.string(),
      status: z.enum(["PRESENT", "ERASED"]),
      erasedAtEpisode: z.string().nullable(),
      restoredAtEpisode: z.string().nullable(),
      peopleInside: z.number().default(0),
    }),
  ),
  buildings: z.record(
    z.object({
      status: z.enum(["PRESENT", "ERASED", "DAMAGED"]),
      erasedAtEpisode: z.string().nullable().default(null),
      restoredAtEpisode: z.string().nullable().default(null),
      lightOn: z.boolean().default(false),
      note: z.string().optional(),
    }),
  ),
  props: z.object({
    redCar: z.object({ route: z.enum(["belediye", "merkez"]), t: z.number(), lastSeenEpisode: z.string() }),
    brokenLamp: z.object({ id: z.string(), broken: z.boolean(), brokenSinceEpisode: z.string().nullable(), repairedAtEpisode: z.string().nullable() }),
    streetSign14: z.object({ present: z.boolean() }),
    clockStuckAt0317: z.boolean(),
    cat: z.object({ location: z.string() }),
  }),
  characters: z.record(z.object({ status: z.string(), location: z.string(), knownSecrets: z.array(z.string()) })),
  clues: z.array(z.object({ id: z.string(), firstSeenEpisode: z.string(), where: z.string(), explained: z.boolean() })),
  decisionHistory: z.array(z.any()),
  pendingDecision: z.object({ id: z.string(), episodeId: z.string(), status: z.string() }).nullable(),
  timeline: z.array(z.object({ episode: z.string(), title: z.string(), branchesFrom: z.string().nullable(), resolvedBy: z.string().nullable() })),
});
export type WorldState = z.infer<typeof worldStateSchema>;
