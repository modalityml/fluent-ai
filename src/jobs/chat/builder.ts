import { ZodSchema } from "zod";
import { Job } from "../job";
import type {
  ChatJob,
  ChatResult,
  ChatStreamOptions,
  ResponseFormat,
} from "./schema";
import { ChatTool } from "./tool";

export class ChatJobBuilder extends Job {
  job: ChatJob;

  constructor(model: string) {
    super();
    this.job = {
      type: "chat",
      model: model,
      messages: [],
    };
  }

  async run(): Promise<ChatResult> {
    return await super.run();
  }

  systemPrompt(systemPrompt: string) {
    this.job.systemPrompt = systemPrompt;
    return this;
  }

  messages(messages: any[]) {
    this.job.messages = messages;
    return this;
  }

  temperature(temperature: number) {
    this.job.temperature = temperature;
    return this;
  }

  maxTokens(maxTokens: number) {
    this.job.maxTokens = maxTokens;
    return this;
  }

  topP(topP: number) {
    this.job.topP = topP;
    return this;
  }

  topK(topK: number) {
    this.job.topK = topK;
    return this;
  }

  tools(tools: ChatTool[]) {
    this.job.tools = tools;
    return this;
  }

  tool(tool: ChatTool) {
    if (!this.job.tools) {
      this.job.tools = [];
    }
    this.job.tools.push(tool);
    return this;
  }

  toolChoice(toolChoice: any) {
    this.job.toolChoice = toolChoice;
    return this;
  }

  responseFormat(responseFormat: ResponseFormat) {
    this.job.responseFormat = responseFormat;
    return this;
  }

  jsonSchema(schema: ZodSchema, name: string, description?: string) {
    this.job.jsonSchema = {
      name,
      description,
      schema,
    };

    return this;
  }

  stream(streamOptions?: ChatStreamOptions) {
    this.job.stream = true;
    if (streamOptions) {
      this.job.streamOptions = streamOptions;
    }
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      ...this.job,
    };
  }
}
