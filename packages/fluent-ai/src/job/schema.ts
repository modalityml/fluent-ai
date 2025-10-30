import * as z from "zod";

const chatToolSchema = z.object({
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

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool"]),
  parts: z.array(messagePartSchema),
  id: z.string().optional(),
  threadId: z.string().optional(),
  createdAt: z.date().optional(),
});

const chatInputSchema = z.object({
  model: z.string(),
  messages: z.array(z.any()), // TODO: fix type
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

const optionsSchema = z
  .object({
    apiKey: z.string().optional(),
  })
  .optional();

export const jobSchema = z.discriminatedUnion("provider", [
  z.object({
    provider: z.literal("openrouter"),
    options: optionsSchema,
    body: z.discriminatedUnion("type", [chatSchema]),
  }),
  z.object({
    provider: z.literal("fal"),
    options: optionsSchema,
    body: z.discriminatedUnion("type", [imageSchema]),
  }),
  z.object({
    provider: z.literal("voyage"),
    options: optionsSchema,
    body: z.discriminatedUnion("type", [embeddingSchema]),
  }),
]);

export type MessagePart = z.infer<typeof messagePartSchema>;
export type Message = z.infer<typeof messageSchema>;
export type ChatTool = z.infer<typeof chatToolSchema>;
export type ChatInput = z.infer<typeof chatInputSchema>;
export type Job = z.infer<typeof jobSchema>;
