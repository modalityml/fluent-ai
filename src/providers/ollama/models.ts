import { ModelsJobBuilder } from "~/jobs/models";
import type { JobOptions } from "~/jobs/schema";

export class OllamaModelsJobBuilder extends ModelsJobBuilder {
  constructor(options: JobOptions) {
    super();
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest = () => {
    return new Request("http://localhost:11434/api/tags", { method: "GET" });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
