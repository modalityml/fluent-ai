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
  messages: z.array(z.any()), // TODO: fix any
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  stream: z.boolean().optional(),
  tools: z.array(chatToolSchema).optional(),
});

const chatUsageSchema = z.object({
  promptTokens: z.number(),
  completionTokens: z.number(),
  totalTokens: z.number(),
});

const chatOutputSchema = z.object({
  messages: z.array(z.any()),
  usage: chatUsageSchema.optional(),
});

const embeddingInputSchema = z.object({
  model: z.string(),
  input: z.union([z.string(), z.array(z.string())]),
});

const embeddingOutputSchema = z.object({
  embeddings: z.array(z.array(z.number())),
});

const downloadInputSchema = z.union([z.object({ local: z.string() })]);

const imageSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

const imageInputSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  size: imageSizeSchema,
  aspectRatio: z.string().optional(), // TODO: enum?
  n: z.number().optional(),
  seed: z.number().optional(),
  outputFormat: z.string().optional(),
  guidanceScale: z.number().optional(),
  download: downloadInputSchema.optional(),
});

const imageOutputSchema = z.object({
  description: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string().optional(),
      contentType: z.string().optional(),
      downloadPath: z.string().optional(),
    }),
  ),
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

// TODO: options schema per provider/job type
const optionsSchema = z.object({
  apiKey: z.string().optional(),
});

export const chatJobSchema = z.object({
  type: z.literal("chat"),
  provider: z.enum(["openrouter", "openai"]),
  options: optionsSchema.optional(),
  input: chatInputSchema,
  output: chatOutputSchema.optional(),
});

export const imageJobSchema = z.object({
  type: z.literal("image"),
  provider: z.enum(["fal"]),
  options: optionsSchema.optional(),
  input: imageInputSchema,
  output: imageOutputSchema.optional(),
});

export const modelsJobSchema = z.object({
  type: z.literal("models"),
  provider: z.enum(["openai"]),
  options: optionsSchema.optional(),
  input: modelsInputSchema.optional(),
  output: modelsOutputSchema.optional(),
});

export const embeddingJobSchema = z.object({
  type: z.literal("embedding"),
  provider: z.enum(["voyage"]),
  options: optionsSchema.optional(),
  input: embeddingInputSchema,
  output: embeddingOutputSchema.optional(),
});

export const jobSchema = z.union([
  chatJobSchema,
  imageJobSchema,
  modelsJobSchema,
  embeddingJobSchema,
]);

export type MessagePart = z.infer<typeof messagePartSchema>;
export type Message = z.infer<typeof messageSchema>;
export type ChatTool = z.infer<typeof chatToolSchema>;
export type DownloadInput = z.infer<typeof downloadInputSchema>;
export type Job = z.infer<typeof jobSchema>;
export type ImageJob = z.infer<typeof imageJobSchema>;
export type EmbeddingJob = z.infer<typeof embeddingJobSchema>;
export type ModelsJob = z.infer<typeof modelsJobSchema>;
export type ChatJob = z.infer<typeof chatJobSchema>;
export type Options = z.infer<typeof optionsSchema>;
