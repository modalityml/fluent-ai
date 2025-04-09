import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { EmbeddingJobSchema } from "~/jobs/embedding";
import { ImageJobSchema } from "~/jobs/image";
import { ModelsJobSchema } from "~/jobs/models";
import { type JobOptions } from "~/jobs/schema";
import { OpenAIChatJob } from "~/providers/openai/chat";
import { OpenAIImageJob } from "~/providers/openai/image";
import { OpenAIEmbeddingJob } from "~/providers/openai/embedding";
import { OpenAIListModelsJob } from "~/providers/openai/models";

export const OPENAI_BASE_URL = "https://api.openai.com/v1";

export const BaseOpenaiJobSchema = z.object({
  provider: z.literal("openai"),
});

export const OpenAIChatJobSchema = ChatJobSchema.merge(BaseOpenaiJobSchema);
export type OpenAIChatJobSchemaType = z.infer<typeof OpenAIChatJobSchema>;

export const OpenAIEmbeddingJobSchema =
  EmbeddingJobSchema.merge(BaseOpenaiJobSchema);
export type OpenaiEmbeddingJobSchemaType = z.infer<
  typeof OpenAIEmbeddingJobSchema
>;

export const OpenAIImageJobSchema = ImageJobSchema.merge(BaseOpenaiJobSchema);
export type OpenAIImageJobSchemaType = z.infer<typeof OpenAIImageJobSchema>;

export const OpenAIListModelsJobSchema =
  ModelsJobSchema.merge(BaseOpenaiJobSchema);
export type OpenAIListModelsJobSchemaType = z.infer<
  typeof OpenAIListModelsJobSchema
>;

export const OpenAIJobSchema = z.discriminatedUnion("type", [
  OpenAIChatJobSchema,
  OpenAIEmbeddingJobSchema,
  OpenAIImageJobSchema,
  OpenAIListModelsJobSchema,
]);

export type OpenaiJobSchemaType = z.infer<typeof OpenAIJobSchema>;

export function openai(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.OPENAI_API_KEY;

  if (!options.apiKey) {
    throw new Error("OpenAI API key is required");
  }

  return {
    chat(model: string) {
      return new OpenAIChatJob(options, model);
    },
    image(model: string) {
      return new OpenAIImageJob(options, model);
    },
    embedding(model: string) {
      return new OpenAIEmbeddingJob(options, model);
    },
    models() {
      return new OpenAIListModelsJob(options);
    },
  };
}
