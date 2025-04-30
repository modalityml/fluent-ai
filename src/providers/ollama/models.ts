import type { JobOptions } from "~/jobs/schema";
import { ModelsJobBuilder } from "~/jobs/models";
import type { OllamaModelsJob } from "./schema";

export class OllamaModelsJobBuilder extends ModelsJobBuilder<OllamaModelsJob> {
  constructor(options: JobOptions) {
    super();
    this.provider = "ollama";
    this.options = options;
  }

  makeRequest() {
    return new Request("http://localhost:11434/api/tags", { method: "GET" });
  }

  async handleResponse(response: Response) {
    const json = await response.json();
    return { raw: json, models: [] };
  }
}
