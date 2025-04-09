import { EmbeddingJobBuilder, type EmbeddingJob } from "~/jobs/embedding";
import { type JobOptions } from "~/jobs/schema";

export class OllamaEmbeddingJob extends EmbeddingJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "ollama";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/embed", {
      method: "POST",
      body: JSON.stringify({
        model: this.model,
        input: this.job.input,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
