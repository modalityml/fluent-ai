import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { ModelsJobSchema } from "~/jobs/models";
import { EmbeddingJobSchema } from "~/jobs/embedding";
import { type JobOptions } from "~/jobs/schema";

export const BaseOllamaJobSchema = z.object({
  provider: z.literal("ollama"),
});

export const OllamaChatJobSchema = ChatJobSchema.merge(BaseOllamaJobSchema);
export type OllamaChatJobSchemaType = z.infer<typeof OllamaChatJobSchema>;

export const OllamaEmbeddingJobSchema =
  EmbeddingJobSchema.merge(BaseOllamaJobSchema);
export type OllamaEmbeddingJobSchemaType = z.infer<
  typeof OllamaEmbeddingJobSchema
>;

export const OllamaListModelsJobSchema =
  ModelsJobSchema.merge(BaseOllamaJobSchema);
export type OllamaListModelsJobSchemaType = z.infer<
  typeof OllamaListModelsJobSchema
>;

export const OllamaJobSchema = z.discriminatedUnion("type", [
  OllamaChatJobSchema,
  OllamaEmbeddingJobSchema,
  OllamaListModelsJobSchema,
]);
export type OllamaJobSchemaType = z.infer<typeof OllamaJobSchema>;

export function ollama(options?: JobOptions) {
  options = options || {};

  return {
    chat(model: string) {
      return new OllamaChatJob(options, model);
    },
    embedding(model: string) {
      return new OllamaEmbeddingJob(options, model);
    },
    models() {
      return new OllamaListModelsJob(options);
    },
  };
}
