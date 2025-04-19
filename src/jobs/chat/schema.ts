import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.union([
    z.string(),
    z.array(
      z.union([
        z.object({ type: z.literal("text"), text: z.string() }),
        z.object({
          type: z.literal("image_url"),
          image_url: z.object({
            url: z.string(),
          }),
        }),
      ])
    ),
  ]),
});

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

export const ChatResultSchema = z.object({
  message: z.object({
    role: z.literal("assistant"),
    content: z.string().nullable(),
  }),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
  tool_calls: z
    .array(
      z.object({
        name: z.string(),
        arguments: z.record(z.string(), z.any()),
      })
    )
    .optional(),
});

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
export const ChatOutputSchema = z.any();

export const ChatJobSchema = BaseJobSchema.extend({
  type: z.literal("chat"),
  input: ChatInputSchema,
  output: ChatOutputSchema.optional(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = z.infer<typeof ChatOutputSchema>;
