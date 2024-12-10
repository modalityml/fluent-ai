import type { AIProviderOptions } from "../jobs/job";
import { OpenAIChatJob } from "./openai";

export function together(options?: AIProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.TOGETHER_API_KEY;

  return {
    chat(model: string) {
      return new TogetherChatJob(
        {
          ...options,
          baseURL: "https://api.together.xyz/v1",
        },
        model
      );
    },
  };
}

export class TogetherChatJob extends OpenAIChatJob {}
