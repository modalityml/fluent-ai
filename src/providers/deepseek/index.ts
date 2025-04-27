import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { ModelsJobSchema } from "~/jobs/models";
import type { JobOptions } from "~/jobs/schema";
import { OpenAIChatJobBuilder } from "~/providers/openai";
import { OpenAIModelsJobBuilder } from "~/providers/openai/models";

export const DeepseekBaseJobSchema = z.object({
  provider: z.literal("deepseek"),
});
export const DeepseekChatJobSchema = ChatJobSchema.extend(
  DeepseekBaseJobSchema
);
export const DeepseekModelsJobSchema = ModelsJobSchema.extend(
  DeepseekBaseJobSchema
);
export const DeepseekJobSchema = z.discriminatedUnion("type", [
  DeepseekChatJobSchema,
  DeepseekModelsJobSchema,
]);

export function deepseek(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY;

  return {
    chat(model: string) {
      return new OpenAIChatJobBuilder(
        {
          ...options,
          baseURL: "https://api.deepseek.com",
        },
        model
      );
    },

    models() {
      return new OpenAIModelsJobBuilder({
        ...options,
        baseURL: "https://api.deepseek.com",
      });
    },
  };
}
