import { z } from "zod";
import {
  ChatJobSchema,
  EmbeddingJobSchema,
  ImageJobSchema,
  ModelsJobSchema,
} from "~/jobs";

export const OPENAI_BASE_URL = "https://api.openai.com/v1";

export const BaseOpenaiJobSchema = z.object({
  provider: z.literal("openai"),
});

export const OpenAIChatJobSchema = ChatJobSchema.merge(BaseOpenaiJobSchema);
export type OpenAIChatJob = z.infer<typeof OpenAIChatJobSchema>;

export const OpenAIEmbeddingJobSchema =
  EmbeddingJobSchema.merge(BaseOpenaiJobSchema);
export type OpenaiEmbeddingJob = z.infer<typeof OpenAIEmbeddingJobSchema>;

export const OpenAIImageJobSchema = ImageJobSchema.merge(BaseOpenaiJobSchema);
export type OpenAIImageJob = z.infer<typeof OpenAIImageJobSchema>;

export const OpenAIModelsJobSchema = ModelsJobSchema.merge(BaseOpenaiJobSchema);
export type OpenAIModelsJob = z.infer<typeof OpenAIModelsJobSchema>;

export const OpenAIJobSchema = z.discriminatedUnion("type", [
  OpenAIChatJobSchema,
  OpenAIEmbeddingJobSchema,
  OpenAIImageJobSchema,
  OpenAIModelsJobSchema,
]);
export type OpenAIJob = z.infer<typeof OpenAIJobSchema>;
