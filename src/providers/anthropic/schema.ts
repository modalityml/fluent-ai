import { z } from "zod";
import { ChatJobSchema, ModelsJobSchema } from "~/jobs";

export const AnthropicBaseJobSchema = z.object({
  provider: z.literal("anthropic"),
});

export const AnthropicChatJobSchema = ChatJobSchema.merge(
  AnthropicBaseJobSchema
);
export type AnthropicChatJob = z.infer<typeof AnthropicChatJobSchema>;

export const AnthropicModelsJobSchema = ModelsJobSchema.merge(
  AnthropicBaseJobSchema
);
export type AnthropicModelsJob = z.infer<typeof AnthropicModelsJobSchema>;

export const AnthropicJobSchema = z.discriminatedUnion("type", [
  AnthropicChatJobSchema,
  AnthropicModelsJobSchema,
]);
export type AnthropicJob = z.infer<typeof AnthropicJobSchema>;
