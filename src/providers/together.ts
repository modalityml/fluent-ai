import { OpenAIChatJob } from "./openai";

interface ProviderOptions {
  apiKey?: string;
}

export function together(options?: ProviderOptions) {
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
