import { EmbeddingJobBuilder } from "~/jobs/embedding";
import type { JobOptions } from "~/jobs/schema";
import { OPENAI_BASE_URL } from "./schema";

export class OpenAIEmbeddingJobBuilder extends EmbeddingJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options || {};
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/embeddings`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: this.input.model,
        input: this.input.value,
        encoding_format: this.input.encodingFormat,
        dimensions: this.input.dimensions,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const raw = await response.json();
    this.cost = {
      promptTokens: raw.usage.prompt_tokens,
      totalTokens: raw.usage.total_tokens,
    };
    return { embedding: raw.data[0].embedding, raw };
  };
}
