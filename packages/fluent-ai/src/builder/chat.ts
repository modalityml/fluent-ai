import * as z from "zod";
import { type ChatInput, type ChatTool } from "~/src/job/schema";

export class ChatBuilder<TProvider extends string = string> {
  private provider: TProvider;
  private options: any;
  private runner: any;
  private input: ChatInput = { model: "", messages: [] };

  constructor(provider: TProvider, options: any, runner: any, model: string) {
    this.provider = provider;
    this.options = options;
    this.runner = runner;
    this.input.model = model;
  }

  messages(messages: Array<{ role: string; content: string }>): this {
    this.input.messages = messages;
    return this;
  }

  tool(tool: ChatTool): this {
    if (!this.input.tools) {
      this.input.tools = [];
    }
    this.input.tools.push(tool);
    return this;
  }

  tools(tools: ChatTool[]): this {
    if (!this.input.tools) {
      this.input.tools = [];
    }
    this.input.tools = this.input.tools.concat(tools);
    return this;
  }

  stream() {
    this.input.stream = true;
    return this;
  }

  build() {
    return {
      provider: this.provider,
      options: this.options,
      body: {
        type: "chat" as const,
        input: this.input,
      },
    };
  }

  run() {
    const job = this.build();
    return this.runner.chat(job.body.input, job.options);
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
