import type { JobOptions } from "~/jobs/schema";
import { OpenAIChatJobBuilder } from "../openai";

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
