import { ListModelsJob } from "~/jobs/models";
import { type JobOptions } from "~/jobs/schema";
import { OPENAI_BASE_URL } from "./schema";

export class OpenAIListModelsJob extends ListModelsJob<OpenaiListModelsJobSchemaType> {
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
