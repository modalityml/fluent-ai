import { OpenAIChatJob } from "./openai";

interface ClientOptions {
  apiKey?: string;
}

export function perplexity(options: ClientOptions) {
  return {
    chat(model: string) {
      return new OpenAIChatJob(
        {
          ...options,
          baseURL: "https://api.perplexity.ai",
        },
        model
      );
    },
  };
}
