// KOMŞULAR evreni şemaları — tek doğruluk kaynağı src/story/series/*.json
import { z } from "zod";

const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const seriesSchema = z.object({
  version: z.number(),
  workingTitle: z.string(),
  format: z.string(),
  logline: z.string(),
  promise: z.array(z.string()).min(3),
  pillars: z.array(z.string()).min(3),
  audience: z.string(),
  tone: z.object({ do: z.array(z.string()), dont: z.array(z.string()) }),
  visualIdentity: z.object({ core: z.string(), note: z.string(), characters: z.string() }),
  brandSafety: z.string(),
  disclosure: z.string(),
});

export const buildingSchema = z.object({
  version: z.number(),
  id: z.string(),
  name: z.string(),
  address: z.string(),
  style: z.string(),
  cutawayRule: z.string(),
  floors: z.array(z.object({ id: z.string(), level: z.number().int(), name: z.string(), contains: z.array(z.string()).optional() })),
  flats: z.array(
    z.object({
      id: z.string(),
      floor: z.number().int(),
      side: z.string(),
      status: z.enum(["OCCUPIED", "VACANT"]),
      residents: z.array(z.string()),
      pets: z.array(z.string()).optional(),
      mood: z.string(),
      placementSlots: z.array(z.string()),
      note: z.string().optional(),
    }),
  ),
});

export const charactersSchema = z.object({
  version: z.number(),
  note: z.string(),
  tiers: z.record(z.string()),
  guardrails: z.array(z.string()),
  characters: z.array(
    z.object({
      id: z.string(), name: z.string(), age: z.number().nullable(), tier: z.enum(["CORE", "REGULAR"]), home: z.string(), role: z.string(), color: hex,
      signature: z.string(), backstory: z.string(),
      traits: z.object({ virtues: z.array(z.string()).min(1), flaws: z.array(z.string()).min(1), quirks: z.array(z.string()).min(1), catchphrase: z.string() }),
      want: z.string(), fear: z.string(), secret: z.string(), voice: z.string(), arcPotential: z.string().optional(), species: z.enum(["cat", "dog"]).optional(),
    }),
  ),
});

export const relationshipsSchema = z.object({
  version: z.number(),
  scale: z.record(z.string()),
  note: z.string(),
  edges: z.array(z.object({ from: z.string(), to: z.string(), affinity: z.number().int().min(-5).max(5), trust: z.number().int().min(0).max(5), since: z.string(), why: z.string(), volatility: z.enum(["düşük", "orta", "yüksek"]), flashpoints: z.array(z.string()) })),
  history: z.array(z.any()),
});

export const neighborhoodSchema = z.object({
  version: z.number(),
  id: z.string(),
  name: z.string(),
  note: z.string(),
  scale: z.string(),
  streets: z.array(z.object({ id: z.string(), name: z.string(), axis: z.string(), role: z.string() })),
  grid: z.object({ cols: z.number().int(), rows: z.number().int(), cellSize: z.string() }),
  venues: z.array(
    z.object({
      id: z.string(), name: z.string(), type: z.enum(["public", "venue", "residential", "commercial"]), cell: z.tuple([z.number().int(), z.number().int()]), floors: z.number().int(),
      owner: z.string().optional(), staff: z.array(z.string()).default([]), ref: z.string().optional(), elevation: z.string().optional(),
      description: z.string(), eventAffordances: z.array(z.string()).min(1), placementSlots: z.array(z.string()), props: z.array(z.string()),
    }),
  ),
  cameraGuidelines: z.object({ principle: z.string(), wide: z.string(), medium: z.string(), close: z.string(), establishing: z.string(), lighting: z.array(z.string()), lightingNote: z.string() }),
  calendar: z.object({ weekly: z.record(z.string()), rhythm: z.string() }),
});

export const eventCatalogSchema = z.object({
  version: z.number(),
  note: z.string(),
  types: z.array(
    z.object({
      id: z.string(), name: z.string(), per30: z.number(), tone: z.string(), examples: z.array(z.string()).min(2), places: z.array(z.string()).min(1),
      decisionStyle: z.string(), rarity: z.string().optional(), rules: z.array(z.string()).optional(), policy: z.string().optional(),
    }),
  ),
  rules: z.record(z.string()),
});

export const arcsSchema = z.object({
  version: z.number(),
  note: z.string(),
  guestSystem: z.object({
    tiers: z.array(z.object({ id: z.string(), name: z.string(), rule: z.string() })),
    profileCard: z.array(z.string()),
    examples: z.array(z.object({ id: z.string(), name: z.string(), tier: z.string(), hook: z.string(), arc: z.string() })),
  }),
  arcs: z.array(z.object({ id: z.string(), name: z.string(), kind: z.enum(["TEK", "KISA", "SEZONLUK"]), episodes: z.string(), where: z.array(z.string()), chars: z.array(z.string()), summary: z.string(), status: z.enum(["PLANNED", "ACTIVE", "DONE"]) })),
});

export const gundemSchema = z.object({
  version: z.number(),
  purpose: z.string(),
  principles: z.array(z.string()).min(3),
  allow: z.record(z.string()),
  maybe: z.record(z.string()),
  block: z.array(z.string()).min(5),
  method: z.array(z.object({ step: z.number(), name: z.string(), how: z.string() })).min(5),
  adaptationExamples: z.array(z.object({ news: z.string(), neighborhood: z.string(), type: z.string(), places: z.array(z.string()), decision: z.string() })).min(5),
  disclosure: z.string(),
  sources: z.array(z.object({ id: z.string(), name: z.string(), feed: z.string() })),
  notes: z.string(),
});

export const seasonArcSchema = z.object({
  version: z.number(),
  season: z.number(),
  title: z.string(),
  premise: z.string(),
  episodesPlanned: z.number().int(),
  acts: z.array(z.object({ act: z.number(), episodes: z.string(), goal: z.string(), reveal: z.string() })).length(3),
  suspects: z.array(z.object({ id: z.string(), motive: z.string(), alibi: z.string(), weakness: z.string() })).min(3),
  culpritPolicy: z.object({ lockEpisode: z.number().int(), rule: z.string(), honesty: z.string() }),
  subplots: z.array(z.object({ id: z.string(), chars: z.array(z.string()), payoff: z.string() })),
});

export const clueLedgerSchema = z.object({
  version: z.number(),
  note: z.string(),
  clues: z.array(z.object({ id: z.string(), text: z.string(), supports: z.array(z.string()).min(2), status: z.enum(["PLANNED", "SHOWN"]), episodeHint: z.number().int() })),
});

export const formatSchema = z.object({
  version: z.number(),
  daily: z.object({
    name: z.string(),
    beats: z.array(z.object({ n: z.number(), t: z.string(), name: z.string(), rule: z.string() })).length(6),
    checklist: z.array(z.string()),
    nextDayOpener: z.string(),
  }),
  weekly: z.object({ name: z.string(), when: z.string(), idea: z.string(), hook: z.string(), rules: z.array(z.string()), why: z.string() }),
  hookPatterns: z.array(z.object({ id: z.string(), name: z.string(), example: z.string() })).min(6),
  cliffhangerTypes: z.array(z.string()),
  hookRules: z.object({ frame0: z.string(), firstWord: z.string(), onScreenText: z.string(), variants: z.string() }),
});

export const engagementSchema = z.object({
  version: z.number(),
  goal: z.string(),
  loops: z.array(z.object({ id: z.string(), syntax: z.string(), for: z.string(), what: z.string(), rule: z.string() })),
  shareHooks: z.array(z.string()),
  ctaTemplates: z.array(z.string()),
  cadence: z.object({ daily: z.string(), weekly: z.string(), voteCloses: z.string(), note: z.string() }),
  pinnedComment: z.string(),
  metricsToTrack: z.array(z.string()),
  honesty: z.string(),
});

export const monetizationSchema = z.object({
  version: z.number(),
  stage: z.string(),
  plan: z.array(z.object({ stage: z.string(), when: z.string(), do: z.string(), price: z.string().optional() })),
  placementSlots: z.array(z.object({ id: z.string(), where: z.string(), category: z.string(), note: z.string().optional() })),
  rules: z.array(z.string()),
  audioLicenseGate: z.string(),
});

const option = z.object({ label: z.string(), cost: z.string() });
export const episodeSeedsSchema = z.object({
  version: z.number(),
  note: z.string(),
  seeds: z.array(
    z.object({
      id: z.string(), title: z.string(), suggestedOrder: z.number().int(), chars: z.array(z.string()), flats: z.array(z.string()), places: z.array(z.string()), eventType: z.string(),
      hook: z.string(), hookPattern: z.string(), conflict: z.string(), evidenceObject: z.string(),
      decision: z.object({ question: z.string(), A: option, B: option }),
      cliffhanger: z.string(), placementSlot: z.string().nullable(), clue: z.string().nullable(),
      status: z.enum(["IDEA", "USED", "REJECTED"]), notes: z.string(),
    }),
  ),
});

/* ------------------------------------------------------------------ bölüm senaryosu (episodes/*.json) */
export const episodeScriptSchema = z.object({
  version: z.number(),
  id: z.string(),
  seed: z.string(),
  title: z.string(),
  status: z.enum(["DRAFT", "APPROVED", "VOICED", "RENDERED", "PUBLISHED"]),
  cast: z.array(z.string()),
  flats: z.array(z.string()),
  premise: z.string(),
  fairness: z.string(),
  reveal: z.object({ nextDay: z.string(), note: z.string() }),
  durationFrames: z.literal(1800),
  beats: z.array(z.object({ n: z.number(), name: z.string(), from: z.number(), to: z.number(), visual: z.string(), onScreen: z.array(z.string()).max(3) })).length(6),
  narration: z.array(z.object({ id: z.string(), beat: z.number().int(), text: z.string(), note: z.string().optional() })).min(5),
  hookVariants: z.array(z.object({ id: z.string(), pattern: z.string(), text: z.string(), onScreen: z.array(z.string()) })).length(3),
  decision: z.object({ question: z.string(), A: z.object({ label: z.string(), cost: z.string() }), B: z.object({ label: z.string(), cost: z.string() }), closes: z.string() }),
  cliffhanger: z.string(),
  caption: z.string(),
  pinnedComment: z.string(),
  placementSlot: z.string().nullable(),
  clue: z.string().nullable(),
  soundPlan: z.object({ ambience: z.array(z.string()), events: z.array(z.string()), search: z.array(z.string()), note: z.string() }),
  assetNeeds: z.array(z.string()),
  risks: z.array(z.string()),
});
