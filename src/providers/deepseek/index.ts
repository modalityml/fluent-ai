import { z } from "zod";
import { ChatJobSchema, type JobOptions } from "~/jobs";
import { OpenAIChatJobBuilder } from "~/providers/openai";

export const BaseDeepseekJobSchema = z.object({
  provider: z.literal("deepseek"),
});
export const DeepseekChatJobSchema = ChatJobSchema.merge(BaseDeepseekJobSchema);
export const DeepseekJobSchema = z.discriminatedUnion("type", [
  DeepseekChatJobSchema,
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
  };
}
