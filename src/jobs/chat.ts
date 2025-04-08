import { z, ZodSchema } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Job } from "./job";
import { JobBaseSchema } from "./schema";

export const MessageContentSchema = z.union([
  z.string(),
  z.array(
    z.object({
      type: z.literal("text"),
      text: z.string(),
    })
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
    })
  ),
]);

export const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: MessageContentSchema,
});

export const StreamOptionsSchema = z.object({
  includeUsage: z.boolean().optional(),
});

export const ResponseFormatSchema = z.object({
  type: z.enum(["json_object", "json_schema"]),
  json_schema: z.any().optional(),
});

export const ChatToolSchema = z.object({
  params: z.object({
    name: z.string(),
    description: z.string().optional(),
    parameters: z.any().optional(),
  }),
  toJSON: z.function().returns(z.any()).optional(),
});

export const JsonSchemaDefSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  schema: z.any(),
});

export const ChatJobParamsSchema = z.object({
  temperature: z.number().optional(),
  stream: z.boolean().optional(),
  streamOptions: StreamOptionsSchema.optional(),
  maxTokens: z.number().optional(),
  messages: z.array(MessageSchema),
  tools: z.array(ChatToolSchema).optional(),
  toolChoice: z.string().optional(),
  responseFormat: ResponseFormatSchema.optional(),
  topP: z.number().optional(),
  topK: z.number().optional(),
  systemPrompt: z.string().optional(),
  jsonSchema: JsonSchemaDefSchema.optional(),
});

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
        arguments: z.record(z.any()),
      })
    )
    .optional(),
});

export const ChatJobSchema = JobBaseSchema.extend({
  type: z.literal("chat"),
  model: z.string(),
  params: ChatJobParamsSchema,
  result: ChatResultSchema.optional(),
});

export type ChatJobSchemaType = z.infer<typeof ChatJobSchema>;
export type ChatJobParams = z.infer<typeof ChatJobParamsSchema>;

export function systemPrompt(content: string) {
  return { role: "system", content };
}

export type UserPromptContent = string | { image: { url: string } };

export function userPrompt(...content: UserPromptContent[]) {
  return { role: "user", content };
}

export function assistantPrompt(content: string) {
  return { role: "assistant", content };
}

export function convertMessages(messages: any[]) {
  return messages.map((message) => {
    if (message.role === "user") {
      if (Array.isArray(message.content)) {
        if (message.content.length === 1) {
          return { role: "user", content: message.content[0] };
        } else {
          return {
            role: "user",
            content: message.content.map((c: any) => {
              if (typeof c === "string") {
                return { type: "text", text: c };
              } else {
                return {
                  type: "image_url",
                  image_url: {
                    url: c.image.url,
                  },
                };
              }
            }),
          };
        }
      } else {
        return { role: "user", content: message.content };
      }
    }
    return message;
  });
}

export function audio() {
  throw new Error("Not implemented");
}

export function image() {
  throw new Error("Not implemented");
}

export function tool(name: string) {
  return new ChatTool(name);
}

export class ChatTool {
  public params: {
    name: string;
    description?: string;
    parameters?: ZodSchema;
  };

  constructor(name: string) {
    this.params = { name };
  }

  description(description: string) {
    this.params.description = description;
    return this;
  }

  parameters(parameters: ZodSchema) {
    this.params.parameters = parameters;
    return this;
  }

  toJSON() {
    return {
      type: "function",
      function: {
        name: this.params.name,
        description: this.params.description,
        parameters: zodToJsonSchema(this.params.parameters!),
      },
    };
  }
}

export interface ChatUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface ChatTextResponse {
  usage?: ChatUsage;
  text?: string;
}

export interface ChatObjectResponse {
  usage?: ChatUsage;
  object?: any;
}

export interface StreamOptions {
  includeUsage?: boolean;
}

export interface ResponseFormat {
  type: "json_object" | "json_schema";
  json_schema?: ZodSchema;
}

export type MessageContent =
  | string
  | { text: string; type: "text" }[]
  | {
      type: "image";
      image_url?: string;
      source?: {
        type: "base64";
        data: string;
        media_type: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
      };
    }[];

export interface Message {
  role: "system" | "user" | "assistant";
  content: MessageContent;
}

export class ChatJob<T extends ChatJobSchemaType> extends Job<T> {
  model: string;
  params: ChatJobParams;

  constructor(model: string) {
    super();
    this.model = model;
    this.params = {
      messages: [],
    };
  }

  async run(): Promise<z.infer<typeof ChatResultSchema>> {
    return await super.run();
  }

  systemPrompt(_systemPrompt: string) {
    this.params.systemPrompt = _systemPrompt;
    return this;
  }

  messages(messages: any[]) {
    this.params.messages = messages;
    return this;
  }

  temperature(temperature: number) {
    this.params.temperature = temperature;
    return this;
  }

  maxTokens(maxTokens: number) {
    this.params.maxTokens = maxTokens;
    return this;
  }

  topP(_topP: number) {
    this.params.topP = _topP;
    return this;
  }

  topK(_topK: number) {
    this.params.topK = _topK;
    return this;
  }

  tools(_tools: ChatTool[]) {
    this.params.tools = _tools;
    return this;
  }

  tool(tool: ChatTool) {
    if (!this.params.tools) {
      this.params.tools = [];
    }
    this.params.tools.push(tool);
    return this;
  }

  toolChoice(_toolChoice: any) {
    this.params.toolChoice = _toolChoice;
    return this;
  }

  responseFormat(_responseFormat: ResponseFormat) {
    this.params.responseFormat = _responseFormat;
    return this;
  }

  jsonSchema(schema: ZodSchema, name: string, description?: string) {
    this.params.jsonSchema = {
      name,
      description,
      schema,
    };

    return this;
  }

  stream(streamOptions?: StreamOptions) {
    this.params.stream = true;
    if (streamOptions) {
      this.params.streamOptions = streamOptions;
    }
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      type: "chat" as const,
      model: this.model,
      params: this.params,
      provider: this.provider,
    };
  }
}
