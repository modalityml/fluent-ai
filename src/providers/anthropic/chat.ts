import { ChatJobBuilder, convertMessages } from "~/jobs/chat";
import { type JobOptions } from "~/jobs/schema";

export class AnthropicChatJob extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
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
      requestParams.tools = this.params.tools.map((tool) => tool.toJSON?.());
      requestParams.tool_choice = this.params.toolChoice;
    }

    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options.apiKey!,
      "Content-Type": "application/json",
    };

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

  dump() {
    const obj = super.dump();
    return {
      ...obj,
    };
  }
}
