import { ChatJobBuilder } from "~/jobs/chat";
import type { JobOptions } from "~/jobs/schema";

export class GoogleChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "google";
    this.options = options;
  }

  makeRequest = () => {
    return new Request(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.input.model}:generateContent?key=${this.options.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: this.input.messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
        }),
      }
    );
  };

  handleResponse = async (response: Response) => {
    const raw = await response.json();
    this.cost = {
      promptTokens: raw.usageMetadata.promptTokenCount,
      completionTokens: raw.usageMetadata.candidatesTokenCount,
      totalTokens: raw.usageMetadata.totalTokenCount,
    };
    return { raw };
  };
}
