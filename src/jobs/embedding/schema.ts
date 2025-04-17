import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

const EmbeddingResultSchema = z.object({
  embedding: z.array(z.number()),
  usage: z
    .object({
      prompt_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
});

export const EmbeddingJobSchema = BaseJobSchema.extend({
  type: z.literal("embedding"),
  model: z.string(),

  input: z.string().optional(),
  dimensions: z.number().optional(),
  encodingFormat: z.string().optional(),

  result: EmbeddingResultSchema.optional(),
});
