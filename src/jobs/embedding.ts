import { z } from "zod";
import { JobBaseSchema } from "./schema";
import { Job } from "./job";

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

export class EmbeddingJob<T extends EmbeddingJobSchemaType> extends Job<T> {
  model: string;
  params: EmbeddingJobParams;

  constructor(model: string) {
    super();
    this.model = model;
    this.params = {};
  }

  input(_input: string) {
    this.params.input = _input;
    return this;
  }

  dimensions(_dimensions: number) {
    this.params.dimensions = _dimensions;
    return this;
  }

  encodingFormat(_encodingFormat: string) {
    this.params.encodingFormat = _encodingFormat;
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      type: "embedding" as const,
      model: this.model,
      params: this.params,
      provider: this.provider,
    };
  }
}
