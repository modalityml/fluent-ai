import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

const EmbeddingInputSchema = z.object({
  model: z.string(),
  value: z.string().optional(),
  dimensions: z.number().optional(),
  encodingFormat: z.string().optional(),
});

const EmbeddingOutputSchema = z.object({
  raw: z.any(),
  embedding: z.array(z.number()),
});

export const EmbeddingJobSchema = BaseJobSchema.extend({
  type: z.literal("embedding"),
  input: EmbeddingInputSchema,
  output: EmbeddingOutputSchema.optional(),
});

export type EmbeddingInput = z.infer<typeof EmbeddingInputSchema>;

export type EmbeddingOutput = z.infer<typeof EmbeddingOutputSchema>;
