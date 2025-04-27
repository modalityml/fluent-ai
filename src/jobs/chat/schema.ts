import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const MessageContentSchema = z.union([
  z.string(),
  z.array(
    z.object({
      type: z.literal("text"),
      text: z.string(),
    }),
  ),
  z.array(
    z.object({
      type: z.literal("image"),
      image_url: z.string().optional(),
      source: z
        .object({
          type: z.literal("base64"),
          data: z.string(),
          media_type: z.enum([
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ]),
        })
        .optional(),
    }),
  ),
]);

export const ToolCallSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  id: z.string().optional(),
  call_id: z.string().optional(),
  arguments: z.record(z.string(), z.any()),
});

export const BaseMessageSchema = z.object({
  role: z.enum(["assistant", "user", "system", "tool"]),
  content: MessageContentSchema,
});

export const AIMessageSchema = BaseMessageSchema.extend({
  role: z.literal("assistant"),
  tool_calls: z.array(ToolCallSchema).optional(),
});

export const HumanMessageSchema = BaseMessageSchema.extend({
  role: z.literal("user"),
});

export const SystemMessageSchema = BaseMessageSchema.extend({
  role: z.literal("system"),
});

export const ToolMessageSchema = BaseMessageSchema.extend({
  role: z.literal("tool"),
  call_id: z.string().optional(),
  result: z.any().optional(),
});

export const MessageSchema = z.discriminatedUnion("role", [
  AIMessageSchema,
  HumanMessageSchema,
  SystemMessageSchema,
  ToolMessageSchema,
]);

export type Message = z.infer<typeof MessageSchema>;

export const ChatStreamOptionsSchema = z.object({
  includeUsage: z.boolean().optional(),
});

export type ChatStreamOptions = z.infer<typeof ChatStreamOptionsSchema>;

export const ResponseFormatSchema = z.object({
  type: z.enum(["json_object", "json_schema"]),
  json_schema: z.any().optional(),
});

export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;

export const ChatToolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parameters: z.any().optional(),
});

export const JsonSchemaDefSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  schema: z.any(),
});

export const ChunkSchema = z.object({});

export const ChatInputSchema = z.object({
  model: z.string(),
  temperature: z.number().optional(),
  stream: z.boolean().optional(),
  streamOptions: ChatStreamOptionsSchema.optional(),
  maxTokens: z.number().optional(),
  messages: z.array(MessageSchema),
  tools: z.array(ChatToolSchema).optional(),
  toolChoice: z.string().optional(),
  responseFormat: ResponseFormatSchema.optional(),
  topP: z.number().optional(),
  topK: z.number().optional(),
  system: z.string().optional(),
  jsonSchema: JsonSchemaDefSchema.optional(),
});

// TODO: Add a schema for the output
export const ChatOutputSchema = z.object({
  message: AIMessageSchema.optional(),
  raw: z.any().optional(),
});

export const ChatJobSchema = BaseJobSchema.extend({
  type: z.literal("chat"),
  input: ChatInputSchema,
  output: ChatOutputSchema.optional(),
});

export type ChatJob = z.infer<typeof ChatJobSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
