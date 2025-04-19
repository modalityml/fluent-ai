import type { JobOptions } from "~/jobs/schema";
import { AnthropicChatJobBuilder } from "./chat";
import { AnthropicModelsJobBuilder } from "./models";

export function anthropic(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  return {
    chat(model: string) {
      return new AnthropicChatJobBuilder(options, model);
    },
    models() {
      return new AnthropicModelsJobBuilder(options);
    },
  };
}

export * from "./chat";
export * from "./models";
export * from "./schema";
