import { EmbeddingJobBuilder, type JobOptions } from "~/jobs";

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
        model: this.job.model,
        input: this.job.input,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
