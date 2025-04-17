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
        model: this.job.model,
        input: this.job.input,
        encoding_format: this.job.encodingFormat,
        dimensions: this.job.dimensions,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };
}
