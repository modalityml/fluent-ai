import { z } from "zod";
import { JobBaseSchema } from "../schema";

export const EmbeddedJobParamsSchema = z.object({
  input: z.string().optional(),
  dimensions: z.number().optional(),
  encodingFormat: z.string().optional(),
});

export type EmbeddingJobParams = z.infer<typeof EmbeddedJobParamsSchema>;

const EmbeddingResultSchema = z.object({
  embedding: z.array(z.number()),
  usage: z
    .object({
      prompt_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
});

export const EmbeddingJobSchema = JobBaseSchema.extend({
  type: z.literal("embedding"),
  model: z.string(),
  params: EmbeddedJobParamsSchema,
  result: EmbeddingResultSchema.optional(),
});
export type EmbeddingJobSchemaType = z.infer<typeof EmbeddingJobSchema>;
