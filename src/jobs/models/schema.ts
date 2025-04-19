import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const ModelsInputSchema = z.object({});

export const ModelsOuputSchema = z.object({});

export const ModelsJobSchema = BaseJobSchema.extend({
  type: z.literal("models"),
  input: ModelsInputSchema,
  output: ModelsOuputSchema.optional(),
});

export type ModelsInput = z.infer<typeof ModelsInputSchema>;

export type ModelsOutput = z.infer<typeof ModelsOuputSchema>;
