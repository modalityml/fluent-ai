import type { JobOptions } from "~/jobs/schema";
import { ModelsJobBuilder } from "~/jobs/models";
import { OPENAI_BASE_URL } from "./schema";
import type { OpenAIModelsJob } from "./schema";

export class OpenAIModelsJobBuilder extends ModelsJobBuilder<OpenAIModelsJob> {
  constructor(options: JobOptions) {
    super();
    this.provider = "openai";
    this.options = options;
  }

  makeRequest() {
    const baseURL = this.options!.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/models`, {
      headers: {
        Authorization: `Bearer ${this.options!.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });
  }

  async handleResponse(response: Response) {
    return { raw: await response.json() };
  }
}
