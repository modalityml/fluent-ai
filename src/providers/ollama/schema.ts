import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { EmbeddingJobSchema } from "~/jobs/embedding";
import { ModelsJobSchema } from "~/jobs/models";

export const OllamaBaseJobSchema = z.object({
  provider: z.literal("ollama"),
});

export const OllamaChatJobSchema = ChatJobSchema.merge(OllamaBaseJobSchema);
export type OllamaChatJob = z.infer<typeof OllamaChatJobSchema>;

export const OllamaEmbeddingJobSchema =
  EmbeddingJobSchema.merge(OllamaBaseJobSchema);
export type OllamaEmbeddingJob = z.infer<typeof OllamaEmbeddingJobSchema>;

export const OllamaModelsJobSchema = ModelsJobSchema.merge(OllamaBaseJobSchema);
export type OllamaModelsJob = z.infer<typeof OllamaModelsJobSchema>;

export const OllamaJobSchema = z.discriminatedUnion("type", [
  OllamaChatJobSchema,
  OllamaEmbeddingJobSchema,
  OllamaModelsJobSchema,
]);
export type OllamaJob = z.infer<typeof OllamaJobSchema>;
