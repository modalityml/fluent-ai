import type { JobOptions } from "~/jobs";
import { OpenAIChatJobBuilder } from "~/providers/openai";

export function together(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.TOGETHER_API_KEY;

  return {
    chat(model: string) {
      return new OpenAIChatJobBuilder(
        {
          ...options,
          baseURL: "https://api.together.xyz/v1",
        },
        model
      );
    },
  };
}
