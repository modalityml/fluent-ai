import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";
import { EmbeddingJobSchema } from "~/jobs/embedding";
import { ImageJobSchema } from "~/jobs/image";
import { ModelsJobSchema } from "~/jobs/models";
import { SpeechJobSchema } from "~/jobs/speech";

export const OPENAI_BASE_URL = "https://api.openai.com/v1";

export const OpenAIBaseJobSchema = z.object({
  provider: z.literal("openai"),
});

export const OpenAIChatJobSchema = ChatJobSchema.extend(OpenAIBaseJobSchema);

export const OpenAIEmbeddingJobSchema =
  EmbeddingJobSchema.extend(OpenAIBaseJobSchema);

export const OpenAIImageJobSchema = ImageJobSchema.extend(OpenAIBaseJobSchema);

export const OpenAIModelsJobSchema =
  ModelsJobSchema.extend(OpenAIBaseJobSchema);

export const OpenAISpeechJobSchema =
  SpeechJobSchema.extend(OpenAIBaseJobSchema);

export const OpenAIJobSchema = z.discriminatedUnion("type", [
  OpenAIChatJobSchema,
  OpenAIEmbeddingJobSchema,
  OpenAIImageJobSchema,
  OpenAIModelsJobSchema,
  OpenAISpeechJobSchema,
]);
