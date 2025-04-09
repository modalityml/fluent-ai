import { z } from "zod";
import { EmbeddingJobBuilder, EmbeddingJobSchema } from "~/jobs/embedding";
import type { JobOptions } from "~/jobs/schema";

export const BaseVoyageaiJobSchema = z.object({
  provider: z.literal("voyageai"),
});

export type VoyageaiJobSchema = z.infer<typeof VoyageaiJobSchema>;

export const VoyageaiEmbeddingJobSchema = EmbeddingJobSchema.merge(
  BaseVoyageaiJobSchema
);
export type VoyageaiEmbeddingJobSchemaType = z.infer<
  typeof VoyageaiEmbeddingJobSchema
>;

export const VoyageaiJobSchema = z.discriminatedUnion("type", [
  VoyageaiEmbeddingJobSchema,
]);

export function voyageai(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.VOYAGEAI_API_KEY;

  return {
    embedding(model: string) {
      return new VoyageaiEmbeddingJob(options, model);
    },
  };
}

export class VoyageaiEmbeddingJob extends EmbeddingJobBuilder<VoyageaiEmbeddingJobSchemaType> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "voyageai";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    return new Request("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        input: this.params.input,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
