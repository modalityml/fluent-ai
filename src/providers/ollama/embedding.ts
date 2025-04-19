import { EmbeddingJobBuilder } from "~/jobs/embedding";
import type { JobOptions } from "~/jobs/schema";

export class OllamaEmbeddingJobBuilder extends EmbeddingJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/embed", {
      method: "POST",
      body: JSON.stringify({
        model: this.input.model,
        input: this.input.value,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const raw = await response.json();
    return { raw, embeddings: raw.embeddings };
  };
}
