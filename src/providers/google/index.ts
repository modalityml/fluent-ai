import type { JobOptions } from "~/jobs/schema";
import { GoogleChatJobBuilder } from "./chat";

export function google(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.GOOGLE_API_KEY;

  return {
    chat(model: string) {
      return new GoogleChatJobBuilder(options, model);
    },
  };
}

export * from "./chat";
export * from "./schema";
