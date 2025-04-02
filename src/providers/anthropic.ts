import { ChatJob, convertMessages } from "../jobs/chat";
import { ListModelsJob } from "../jobs/models";
import type { AIProviderOptions } from "../jobs/job";

export function anthropic(options?: AIProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  return {
    chat(model: string) {
      return new AnthropicChatJob(options, model);
    },
    listModels() {
      return new AnthropicListModelsJob(options);
    }
  };
}

export class AnthropicChatJob extends ChatJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.provider = "anthropic";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    const requestParams = {
      model: this.model,
      max_tokens: this.params.maxTokens,
      messages: convertMessages(this.params.messages),
    } as any;

    if (this.params.tools && this.params.tools.length) {
      requestParams.tools = this.params.tools.map((tool) => tool.toJSON());
      requestParams.tool_choice = this.params.toolChoice;
    }

    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options.apiKey!,
      "Content-Type": "application/json",
    } as any;

    return new Request("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestParams),
    });
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}

export class AnthropicListModelsJob extends ListModelsJob {
  constructor(options: AIProviderOptions) {
    super();
    this.provider = "anthropic";
    this.options = options;
  }

  makeRequest = () => {
    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options.apiKey!,
      "Content-Type": "application/json",
    } as any;

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