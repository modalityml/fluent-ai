import type { JobOptionsType } from "../jobs/schema";
import { OpenAIChatJob } from "./openai";

export function fireworks(options?: JobOptionsType) {
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
