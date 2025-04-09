import { z } from "zod";
import { ChatJobSchema, ModelsJobSchema } from "~/jobs";

export const AnthropicBaseJobSchema = z.object({
  provider: z.literal("anthropic"),
});

export const AnthropicChatJobSchema = ChatJobSchema.merge(
  AnthropicBaseJobSchema
);
export const AnthropicModelsJobSchema = ModelsJobSchema.merge(
  AnthropicBaseJobSchema
);

export const AnthropicJobSchema = z.discriminatedUnion("type", [
  AnthropicChatJobSchema,
  AnthropicModelsJobSchema,
]);

export type AnthropicJob = z.infer<typeof AnthropicJobSchema>;
