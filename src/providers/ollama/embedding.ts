import { EmbeddingJobBuilder } from "~/jobs/embedding";
import type { JobOptions } from "~/jobs/schema";
import type { OllamaEmbeddingJob } from "./schema";

export class OllamaEmbeddingJobBuilder extends EmbeddingJobBuilder<OllamaEmbeddingJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest() {
    return new Request("http://localhost:11434/api/embed", {
      method: "POST",
      body: JSON.stringify({
        model: this.input.model,
        input: this.input.value,
      }),
    });
  }

  async handleResponse(response: Response) {
    const raw = await response.json();
    return { raw, embedding: raw.embedding };
  }
}
