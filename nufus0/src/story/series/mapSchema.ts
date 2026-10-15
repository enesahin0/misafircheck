// map.json (3D harita planı) şeması. Doğrulayıcı ve 3D kit bunu kullanır.
import { z } from "zod";

const rect = { x0: z.number(), x1: z.number(), z0: z.number(), z1: z.number() };
export const roadTypeSchema = z.enum(["ana", "tek", "patika"]);
export const groundSchema = z.enum(["pave", "plaza", "grass", "dirt"]);
export const fillerTypeSchema = z.enum(["house", "block", "garden", "veg", "parking", "grove", "forest", "virane"]);
export const mapSchema = z.object({
  version: z.number(),
  note: z.string(),
  bounds: z.object(rect),
  roadTypes: z.record(roadTypeSchema, z.object({ width: z.number(), lanes: z.number(), note: z.string() })),
  roads: z.array(z.object({ id: z.string(), type: roadTypeSchema, name: z.string(), ...rect })),
  parcels: z.array(
    z.object({
      id: z.string(), ...rect, ground: groundSchema, walks: z.array(z.enum(["n", "e", "s", "w"])).default([]),
      items: z.array(z.object({ venue: z.string(), pos: z.tuple([z.number(), z.number()]) })).optional(),
      filler: z.object({ type: fillerTypeSchema, color: z.string().optional(), floors: z.number().optional(), seed: z.number() }).optional(),
      deco: z.array(z.array(z.union([z.string(), z.number()]))).optional(),
      note: z.string().optional(),
    }),
  ),
  walkRoutes: z.array(z.tuple([z.number(), z.number(), z.number(), z.number()])),
});
export type MapPlan = z.infer<typeof mapSchema>;
