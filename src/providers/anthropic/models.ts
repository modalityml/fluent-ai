import { ListModelsJob } from "~/jobs/models";
import { type JobOptions } from "~/jobs/schema";

export class AnthropicListModelsJob extends ListModelsJob<AnthropicListModelsJobSchemaType> {
  constructor(options: JobOptions) {
    super();
    this.provider = "anthropic";
    this.options = options;
  }

  makeRequest = () => {
    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options.apiKey!,
      "Content-Type": "application/json",
    };

    return new Request("https://api.anthropic.com/v1/models", {
      method: "GET",
      headers: headers,
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
