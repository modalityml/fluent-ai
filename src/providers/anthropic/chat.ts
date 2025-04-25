import { ChatJobBuilder, convertTools } from "~/jobs/chat";
import type { JobOptions } from "~/jobs/schema";
import type { AnthropicChatJob } from "./schema";

export class AnthropicChatJobBuilder extends ChatJobBuilder<AnthropicChatJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "anthropic";
    this.options = options;
  }

  makeRequest() {
    const requestParams = {
      model: this.input.model,
      max_tokens: this.input.maxTokens,
      messages: this.input.messages,
    } as any;

    if (this.input.tools && this.input.tools.length) {
      requestParams.tools = convertTools(this.input.tools);
      requestParams.tool_choice = this.input.toolChoice;
    }

    const headers = {
      "anthropic-version": "2023-06-01",
      "x-api-key": this.options!.apiKey!,
      "Content-Type": "application/json",
    };

    return new Request("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestParams),
    });
  }

  async handleResponse(response: Response) {
    const raw = await response.json();
    return { raw };
  }
}
