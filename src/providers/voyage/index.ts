import { z } from "zod";
import { EmbeddingJobBuilder, EmbeddingJobSchema } from "~/jobs/embedding";
import type { JobOptions } from "~/jobs/schema";

export const VoyageBaseJobSchema = z.object({
  provider: z.literal("voyage"),
});

export const VoyageEmbeddingJobSchema =
  EmbeddingJobSchema.extend(VoyageBaseJobSchema);

export const VoyageJobSchema = z.discriminatedUnion("type", [
  VoyageEmbeddingJobSchema,
]);

export type VoyageJob = z.infer<typeof VoyageJobSchema>;
export type VoyageEmbeddingJob = z.infer<typeof VoyageEmbeddingJobSchema>;

export function voyage(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.VOYAGE_API_KEY;

  return {
    embedding(model: string) {
      return new VoyageEmbeddingJobBuilder(options, model);
    },
  };
}

export class VoyageEmbeddingJobBuilder extends EmbeddingJobBuilder<VoyageEmbeddingJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "voyage";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options!.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.input.model,
        input: this.input.value,
      }),
    });
  };

  async handleResponse(response: Response) {
    const json = await response.json();
    //TODO: handle raw.embedding
    return { raw: json, embedding: json.embedding };
  }
}
