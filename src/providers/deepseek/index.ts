import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { ModelsJobSchema } from "~/jobs/models";
import type { JobOptions } from "~/jobs/schema";
import { OpenAIChatJobBuilder } from "~/providers/openai";
import { OpenAIModelsJobBuilder } from "~/providers/openai/models";

export const BaseDeepseekJobSchema = z.object({
  provider: z.literal("deepseek"),
});
export const DeepseekChatJobSchema = ChatJobSchema.extend(
  BaseDeepseekJobSchema
);
export type DeepseekChatJob = z.infer<typeof DeepseekChatJobSchema>;
export const DeepseekModelsJobSchema = ModelsJobSchema.extend(
  BaseDeepseekJobSchema
);
export type DeepseekModelsJob = z.infer<typeof DeepseekModelsJobSchema>;
export const DeepseekJobSchema = z.discriminatedUnion("type", [
  DeepseekChatJobSchema,
  DeepseekModelsJobSchema,
]);
export type DeepseekJob = z.infer<typeof DeepseekJobSchema>;

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
