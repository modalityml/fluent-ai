import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const ModelsInputSchema = z.object({});

export const ModelsOuputSchema = z.object({
  models: z.array(
    z.object({
      id: z.string(),
      created: z.number(),
      owned_by: z.string(),
    }),
  ),
  raw: z.any(),
});

export const ModelsJobSchema = BaseJobSchema.extend({
  type: z.literal("models"),
  input: ModelsInputSchema,
  output: ModelsOuputSchema.optional(),
});

export type ModelsJob = z.infer<typeof ModelsJobSchema>;
export type ModelsInput = z.infer<typeof ModelsInputSchema>;

export type ModelsOutput = z.infer<typeof ModelsOuputSchema>;
