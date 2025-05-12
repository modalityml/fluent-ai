import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { EmbeddingJobSchema } from "~/jobs/embedding";
import { ModelsJobSchema } from "~/jobs/models";

export const OllamaBaseJobSchema = z.object({
  provider: z.literal("ollama"),
});

export const OllamaChatJobSchema = ChatJobSchema.extend(OllamaBaseJobSchema);

export const OllamaEmbeddingJobSchema =
  EmbeddingJobSchema.extend(OllamaBaseJobSchema);

export const OllamaModelsJobSchema =
  ModelsJobSchema.extend(OllamaBaseJobSchema);

export const OllamaJobSchema = z.discriminatedUnion("type", [
  OllamaChatJobSchema,
  OllamaEmbeddingJobSchema,
  OllamaModelsJobSchema,
]);

export type OllamaJob = z.infer<typeof OllamaJobSchema>;
export type OllamaChatJob = z.infer<typeof OllamaChatJobSchema>;
export type OllamaEmbeddingJob = z.infer<typeof OllamaEmbeddingJobSchema>;
export type OllamaModelsJob = z.infer<typeof OllamaModelsJobSchema>;
