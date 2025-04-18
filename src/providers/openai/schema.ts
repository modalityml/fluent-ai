import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { EmbeddingJobSchema } from "~/jobs/embedding";
import { ImageJobSchema } from "~/jobs/image";
import { ModelsJobSchema } from "~/jobs/models";

export const OPENAI_BASE_URL = "https://api.openai.com/v1";

export const BaseOpenAIJobSchema = z.object({
  provider: z.literal("openai"),
});

export const OpenAIChatJobSchema = ChatJobSchema.extend(BaseOpenAIJobSchema);
export type OpenAIChatJob = z.infer<typeof OpenAIChatJobSchema>;

export const OpenAIEmbeddingJobSchema =
  EmbeddingJobSchema.extend(BaseOpenAIJobSchema);
export type OpenAIEmbeddingJob = z.infer<typeof OpenAIEmbeddingJobSchema>;

export const OpenAIImageJobSchema = ImageJobSchema.extend(BaseOpenAIJobSchema);
export type OpenAIImageJob = z.infer<typeof OpenAIImageJobSchema>;

export const OpenAIModelsJobSchema =
  ModelsJobSchema.extend(BaseOpenAIJobSchema);
export type OpenAIModelsJob = z.infer<typeof OpenAIModelsJobSchema>;

export const OpenAIJobSchema = z.discriminatedUnion("type", [
  OpenAIChatJobSchema,
  OpenAIEmbeddingJobSchema,
  OpenAIImageJobSchema,
  OpenAIModelsJobSchema,
]);
export type OpenAIJob = z.infer<typeof OpenAIJobSchema>;
