import { ChatJobBuilder, convertMessages, convertTools } from "~/jobs/chat";
import type { JobOptions } from "~/jobs/schema";

export class AnthropicChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "anthropic";
    this.options = options;
  }

  makeRequest = () => {
    const requestParams = {
      model: this.job.model,
      max_tokens: this.job.maxTokens,
      messages: convertMessages(this.job.messages),
    } as any;

    if (this.job.tools && this.job.tools.length) {
      requestParams.tools = convertTools(this.job.tools);
      requestParams.tool_choice = this.job.toolChoice;
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
    const raw = await response.json();
    return { raw };
  };
}
