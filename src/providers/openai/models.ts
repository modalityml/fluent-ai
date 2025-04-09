import { ModelsJobBuilder, type JobOptions } from "~/jobs";
import { OPENAI_BASE_URL } from "./schema";

export class OpenAIModelsJobBuilder extends ModelsJobBuilder {
  constructor(options: JobOptions) {
    super();
    this.provider = "openai";
    this.options = options;
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/models`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };
}
