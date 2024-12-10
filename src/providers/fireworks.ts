import type { AIProviderOptions } from "../jobs/job";
import { OpenAIChatJob } from "./openai";

export function fireworks(options?: AIProviderOptions) {
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
