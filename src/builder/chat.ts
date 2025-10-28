import * as z from "zod";
import type {
  ChatTool,
  Job,
  JobType,
  Options,
  ProviderName,
} from "~/src/job/schema";
import { registry, run } from "~/src/job/registry";

export interface ChatBuilder {
  model(model: string): this;
  messages(messages: any[]): this;
  temperature(temp: number): this;
  maxTokens(tokens: number): this;
  stream(): this;
  tool(tool: ChatTool): this;
  tools(tools: ChatTool[]): this;
  build(): Job;
  run(): Promise<any> | AsyncIterable<any>;
  dump(): string;
}

export class BaseChatBuilder implements ChatBuilder {
  private _model?: string;
  private _messages?: any[];
  private _temperature?: number;
  private _maxTokens?: number;
  private _streaming: boolean = false;
  private _tools: ChatTool[] = [];

  constructor(
    private provider: ProviderName,
    private options?: Options,
    private version?: string,
  ) {}

  model(model: string): this {
    this._model = model;
    return this;
  }

  messages(messages: any[]): this {
    this._messages = messages;
    return this;
  }

  temperature(temp: number): this {
    this._temperature = temp;
    return this;
  }

  maxTokens(tokens: number): this {
    this._maxTokens = tokens;
    return this;
  }

  stream(): this {
    this._streaming = true;
    return this;
  }

  tool(tool: ChatTool): this {
    this._tools.push(tool);
    return this;
  }

  tools(tools: ChatTool[]): this {
    this._tools.push(...tools);
    return this;
  }

  build(): Job {
    if (!this._model || !this._messages) {
      throw new Error("Model and messages are required");
    }

    return {
      provider: this.provider,
      version: this.version,
      options: this.options,
      body: {
        type: "chat",
        input: {
          model: this._model,
          messages: this._messages,
          temperature: this._temperature,
          maxTokens: this._maxTokens,
          tools: this._tools.length > 0 ? this._tools : undefined,
        },
      },
    } as Job;
  }

  dump(): string {
    return JSON.stringify(this.build(), null, 2);
  }

  run(): Promise<any> | AsyncIterable<any> {
    if (this._streaming) {
      return this._runStream();
    }
    return run(this.build());
  }

  private async *_runStream(): AsyncIterable<any> {
    const job = this.build();
    const { provider, body, options } = job;
    const handler = registry.get(
      provider as ProviderName,
      body.type as JobType,
    );

    if (!handler) {
      throw new Error(
        `Provider '${provider}' does not support job type '${body.type}'`,
      );
    }

    if (!handler.executeStream) {
      throw new Error(
        `Provider '${provider}' does not support streaming for job type '${body.type}'`,
      );
    }

    yield* handler.executeStream(body, options);
  }
}

export function user(content: string) {
  return { role: "user", content: content };
}

export function assistant(content: string) {
  return { role: "assistant", content: content };
}

export function system(content: string) {
  return { role: "system", content: content };
}

export function text(result: any) {
  if (result.raw) {
    if (result.raw.candidates) {
      return result.raw.candidates[0].content.parts[0].text;
    }

    if (result.raw.choices[0].message) {
      return result.raw.choices[0].message.content;
    }

    if (result.raw.choices[0].delta.content) {
      return result.raw.choices[0].delta.content;
    }
  }
  return "";
}

class ChatToolBuilder {
  private body: Partial<ChatTool> = {};

  constructor(name: string) {
    this.body.name = name;
  }

  description(desc: string): this {
    this.body.description = desc;
    return this;
  }

  input(schema: z.ZodObject<any>): ChatTool {
    this.body.input = z.toJSONSchema(schema);
    return this.body as ChatTool;
  }
}

export function tool(name: string) {
  return new ChatToolBuilder(name);
}
