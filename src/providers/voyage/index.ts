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

export function voyage(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.VOYAGE_API_KEY;

  return {
    embedding(model: string) {
      return new VoyageEmbeddingJobBuilder(options, model);
    },
  };
}

export class VoyageEmbeddingJobBuilder extends EmbeddingJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "voyage";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.input.model,
        input: this.input.value,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
