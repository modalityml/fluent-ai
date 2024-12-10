import { ZodType } from "zod";
import { Job } from "./job";
import zodToJsonSchema, { type JsonSchema7Type } from "zod-to-json-schema";

export function systemPrompt(content: string) {
  return { role: "system", content };
}

export type UserPromptContent = string | { image: { url: string } };

export function userPrompt(...content: UserPromptContent[]) {
  return { role: "user", content };
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

export function assistant(content: string) {
  return { role: "assistant", content };
}

export function tool(name: string) {
  return new ChatTool(name);
}

export class ChatTool {
  public params: {
    name: string;
    description?: string;
    parameters?: JsonSchema7Type;
  };

  constructor(name: string) {
    this.params = { name };
  }

  description(_description: string) {
    this.params.description = _description;
    return this;
  }

  parameters(_parameters: JsonSchema7Type | ZodType<any>) {
    this.params.parameters =
      _parameters instanceof ZodType
        ? zodToJsonSchema(_parameters)
        : _parameters;
    return this;
  }

  toJSON() {
    return {
      type: "function",
      function: this.params,
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
  json_schema?: JsonSchema7Type | ZodType<any>;
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

export class ChatJob extends Job {
  params: {
    temperature?: number;
    stream?: boolean;
    streamOptions?: StreamOptions;
    maxTokens?: number;
    messages: Message[];
    tools: ChatTool[];
    toolChoice?: string;
    responseFormat?: ResponseFormat;
    topP?: number;
    topK?: number;
    systemPrompt?: string;
    jsonSchema?: {
      name: string;
      description?: string;
      schema: JsonSchema7Type;
    };
  };

  constructor() {
    super();
    this.params = {
      tools: [],
      messages: [],
    };
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
    this.params.tools.push(tool);
    return this;
  }

  toolChoice(_toolChoice: any) {
    this.params.toolChoice = _toolChoice;
    return this;
  }

  responseFormat(_responseFormat: ResponseFormat) {
    if (
      _responseFormat.json_schema &&
      _responseFormat.json_schema instanceof ZodType
    ) {
      _responseFormat.json_schema = zodToJsonSchema(
        _responseFormat.json_schema
      );
    }
    this.params.responseFormat = _responseFormat;
    return this;
  }

  jsonSchema(
    schema: JsonSchema7Type | ZodType<any>,
    name: string,
    description?: string
  ) {
    this.params.jsonSchema = {
      name,
      description,
      schema: schema instanceof ZodType ? zodToJsonSchema(schema) : schema,
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
}