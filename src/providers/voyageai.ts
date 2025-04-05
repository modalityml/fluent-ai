import { EmbeddingJob } from "../jobs/embedding";
import type { AIProviderOptions } from "../jobs/job";

export function voyageai(options?: AIProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.VOYAGEAI_API_KEY;

  return {
    embedding(model: string) {
      return new VoyageaiEmbeddingJob(options, model);
    },
  };
}

export class VoyageaiEmbeddingJob extends EmbeddingJob {
  constructor(options: AIProviderOptions, model: string) {
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
