import * as z from "zod";

export const optionsSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
});

const baseSchema = {
  version: z.string().optional(),
  options: optionsSchema.optional(),
};

export const chatToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  input: z.any(), // TODO: should be valid json schema
});

const messagePartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  toolCallId: z.string().optional(),
  input: z.any().optional(),
  output: z.any().optional(),
  outputError: z.any().optional(),
});

export type MessagePart = z.infer<typeof messagePartSchema>;

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "tool"]),
  parts: z.array(messagePartSchema),
  id: z.string().optional(),
  threadId: z.string().optional(),
  createdAt: z.date().optional(),
});

export type Message = z.infer<typeof messageSchema>;

export type ChatTool = z.infer<typeof chatToolSchema>;

const chatInputSchema = z.object({
  model: z.string(),
  messages: z.array(z.any()),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  stream: z.boolean().optional(),
  tools: z.array(chatToolSchema).optional(),
});

const chatOutputSchema = z.object({
  messages: z.array(z.any()),
  usage: z
    .object({
      promptTokens: z.number(),
      completionTokens: z.number(),
      totalTokens: z.number(),
    })
    .optional(),
});

const chatSchema = z.object({
  type: z.literal("chat"),
  input: chatInputSchema,
  output: chatOutputSchema.optional(),
});

const embeddingInputSchema = z.object({
  model: z.string(),
  input: z.union([z.string(), z.array(z.string())]),
});

const embeddingOutputSchema = z.object({
  embeddings: z.array(z.array(z.number())),
});

const embeddingSchema = z.object({
  type: z.literal("embedding"),
  input: embeddingInputSchema,
  output: embeddingOutputSchema.optional(),
});

const imageInputSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  size: z.string().optional(),
  n: z.number().optional(),
});

const imageOutputSchema = z.object({
  images: z.array(
    z.object({
      url: z.string().optional(),
      b64_json: z.string().optional(),
    }),
  ),
});

const imageSchema = z.object({
  type: z.literal("image"),
  input: imageInputSchema,
  output: imageOutputSchema.optional(),
});

const modelsInputSchema = z.object({});

const modelsOutputSchema = z.object({
  models: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
    }),
  ),
});

const modelsSchema = z.object({
  type: z.literal("models"),
  input: modelsInputSchema.optional(),
  output: modelsOutputSchema.optional(),
});

const speechInputSchema = z.object({
  model: z.string(),
  input: z.string(),
  voice: z.string(),
});

const speechOutputSchema = z.object({
  audio: z.string(),
});

const speechSchema = z.object({
  type: z.literal("speech"),
  input: speechInputSchema,
  output: speechOutputSchema.optional(),
});

const providerConfig = {
  anthropic: ["chat", "models"],
  deepseek: ["chat", "models"],
  elevenlabs: ["speech"],
  fal: ["image"],
  google: ["chat"],
  luma: ["image"],
  ollama: ["chat", "embedding", "models"],
  openai: ["chat", "embedding", "image", "models", "speech"],
  openrouter: ["chat"],
  voyage: ["embedding"],
} as const;

export type ProviderName = keyof typeof providerConfig;
export type JobType = "chat" | "embedding" | "image" | "models" | "speech";

const jobTypeSchemas = {
  chat: chatSchema,
  embedding: embeddingSchema,
  image: imageSchema,
  models: modelsSchema,
  speech: speechSchema,
} as const;

const providerSchemas = Object.fromEntries(
  Object.entries(providerConfig).map(([provider, jobTypes]) => {
    const schemas = jobTypes.map((type) => jobTypeSchemas[type as JobType]);

    const schema = z
      .object({
        provider: z.literal(provider as ProviderName),
        body:
          schemas.length === 1
            ? schemas[0]
            : z.discriminatedUnion("type", schemas as any),
      })
      .extend(baseSchema);

    return [provider, schema];
  }),
) as Record<ProviderName, z.ZodObject<any>>;

export const jobSchema = z.discriminatedUnion(
  "provider",
  Object.values(providerSchemas) as any,
);

export type Job = z.infer<typeof jobSchema>;
export type Options = z.infer<typeof optionsSchema>;
