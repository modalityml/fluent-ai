import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { ModelsJobSchema } from "~/jobs/models";
import { type JobOptions } from "~/jobs/schema";

export const BaseAnthropicJobSchema = z.object({
  provider: z.literal("anthropic"),
});

export const AnthropicChatJobSchema = ChatJobSchema.merge(
  BaseAnthropicJobSchema
);
export type AnthropicChatJobSchemaType = z.infer<typeof AnthropicChatJobSchema>;
export const AnthropicListModelsJobSchema = ModelsJobSchema.merge(
  BaseAnthropicJobSchema
);
export type AnthropicListModelsJobSchemaType = z.infer<
  typeof AnthropicListModelsJobSchema
>;
export const AnthropicJobSchema = z.discriminatedUnion("type", [
  AnthropicChatJobSchema,
  AnthropicListModelsJobSchema,
]);
export type AnthropicJobSchemaType = z.infer<typeof AnthropicJobSchema>;

export function anthropic(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  return {
    chat(model: string) {
      return new AnthropicChatJob(options, model);
    },
    models() {
      return new AnthropicListModelsJob(options);
    },
  };
}
