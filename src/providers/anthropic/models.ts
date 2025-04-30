import { ModelsJobBuilder } from "~/jobs/models";
import type { JobOptions } from "~/jobs/schema";
import type { AnthropicModelsJob } from "./schema";

export class AnthropicModelsJobBuilder extends ModelsJobBuilder<AnthropicModelsJob> {
  constructor(options: JobOptions) {
    super();
    this.provider = "anthropic";
    this.options = options;
  }

  makeRequest() {
    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options!.apiKey!,
      "Content-Type": "application/json",
    };

    return new Request("https://api.anthropic.com/v1/models", {
      method: "GET",
      headers: headers,
    });
  }

  async handleResponse(response: Response) {
    const json = await response.json();
    return { raw: json, models: [] };
  }
}
