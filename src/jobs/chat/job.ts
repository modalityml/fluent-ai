import { z, ZodSchema } from "zod";
import { Job } from "../job";
import type {
  ChatJobSchemaType,
  ChatJobParams,
  ChatResultSchema,
  ChatStreamOptions,
  ResponseFormat,
} from "./schema";
import { ChatTool } from "./tool";

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

  stream(streamOptions?: ChatStreamOptions) {
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
