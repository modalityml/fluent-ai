import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { ModelsJobSchema } from "~/jobs/models";

export const AnthropicBaseJobSchema = z.object({
  provider: z.literal("anthropic"),
});

export const AnthropicChatJobSchema = ChatJobSchema.extend(
  AnthropicBaseJobSchema
);

export const AnthropicModelsJobSchema = ModelsJobSchema.extend(
  AnthropicBaseJobSchema
);

export const AnthropicJobSchema = z.discriminatedUnion("type", [
  AnthropicChatJobSchema,
  AnthropicModelsJobSchema,
]);
