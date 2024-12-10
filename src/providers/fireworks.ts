import { OpenAIChatJob } from "./openai";

interface ProviderOptions {
  apiKey?: string;
}

export function fireworks(options?: ProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FIREWORKS_API_KEY;

  return {
    chat(model: string) {
      return new OpenAIChatJob(
        {
          ...options,
          baseURL: "https://api.fireworks.ai/inference/v1",
        },
        model
      );
    },
  };
}
