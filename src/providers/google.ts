import { ChatJob, convertMessages } from "../jobs/chat";
import type { AIProviderOptions } from "../jobs/job";

export function google(options?: AIProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.GOOGLE_API_KEY;

  return {
    chat(model: string) {
      return new GoogleChatJob(options, model);
    },
  };
}

class GoogleChatJob extends ChatJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    return new Request(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.options.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: convertMessages(this.params.messages).map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
        }),
      }
    );
  };

  handleResponse = async (response: Response) => {
    const json = await response.json();
    return json;
  };
}
