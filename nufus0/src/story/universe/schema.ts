// Evren İncili şemaları — evrenin TEK doğruluk kaynağı JSON dosyalarıdır; kod bunlardan okur.
import { z } from "zod";

export const buildingSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  status: z.enum(["PRESENT", "ERASED"]),
  floors: z.array(z.object({ level: z.number().int(), id: z.string(), name: z.string(), note: z.string() })),
  units: z.array(
    z.object({
      id: z.string(),
      door: z.number().int().nullable(),
      floor: z.number().int(),
      slot: z.number().int(),
      status: z.enum(["SEALED", "OPENED", "LOST", "KNOWN"]),
      openedAtEpisode: z.string().nullable(),
      anomalySeed: z.string().nullable(),
      roomKit: z.string(),
      residents: z.array(z.string()),
      note: z.string(),
    }),
  ),
  doorNumbering: z.string(),
  notes: z.string(),
});

export const rulesSchema = z.object({
  version: z.number(),
  framing: z.string(),
  rules: z.array(z.object({ id: z.string(), name: z.string(), text: z.string() })).min(1),
  seasonMystery: z.string(),
  toneDo: z.array(z.string()),
  toneDont: z.array(z.string()),
});

export const charactersSchema = z.object({
  version: z.number(),
  note: z.string(),
  characters: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      age: z.number().nullable(),
      role: z.string(),
      silhouette: z.string(),
      location: z.string(),
      secrets: z.array(z.string()),
      outfit: z.string(),
    }),
  ),
  residentRule: z.string(),
});

export const engagementSchema = z.object({
  version: z.number(),
  goal: z.string(),
  loops: z.array(z.object({ id: z.string(), syntax: z.string(), for: z.string(), what: z.string(), rule: z.string() })),
  shareHooks: z.array(z.string()),
  ctaTemplates: z.array(z.string()),
  cadence: z.object({ post: z.string(), voteCloses: z.string(), note: z.string() }),
  metricsToTrack: z.array(z.string()),
  honesty: z.string(),
});

export const formatsSchema = z.object({
  version: z.number(),
  episodeTemplate: z.object({
    name: z.string(),
    beats: z.array(z.object({ n: z.number(), t: z.string(), name: z.string(), rule: z.string() })).length(8),
    checklist: z.array(z.string()),
  }),
  otherFormats: z.array(z.object({ id: z.string(), name: z.string(), idea: z.string() })),
});

export const roomKitsSchema = z.object({
  version: z.number(),
  note: z.string(),
  kits: z.array(z.object({ id: z.string(), name: z.string(), status: z.enum(["built", "planned"]), file: z.string(), props: z.array(z.string()) })),
});

const option = z.object({ label: z.string(), cost: z.string() });
export const seedsSchema = z.object({
  version: z.number(),
  note: z.string(),
  seeds: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      suggestedDoor: z.number().int().nullable(),
      status: z.enum(["IDEA", "USED", "REJECTED"]),
      logline: z.string(),
      anomaly: z.string(),
      humanCost: z.string(),
      decision: z.object({ A: option, B: option }),
      clue: z.string(),
      roomKit: z.string(),
      hookImage: z.string(),
      followUpQuestion: z.string(),
    }),
  ),
});
