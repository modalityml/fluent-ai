import type { JobOptions } from "~/jobs";
import { OpenAIChatJobBuilder } from "~/providers/openai";

export function fireworks(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FIREWORKS_API_KEY;

  return {
    chat(model: string) {
      return new OpenAIChatJobBuilder(
        {
          ...options,
          baseURL: "https://api.fireworks.ai/inference/v1",
        },
        model
      );
    },
  };
}
