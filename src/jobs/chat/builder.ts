import { z } from "zod";
import { JobBuilder } from "~/jobs/builder";
import type {
  ChatJob,
  ChatStreamOptions,
  Message,
  ResponseFormat,
} from "./schema";
import type { ChatTool } from "./tool";

export abstract class ChatJobBuilder<
  Job extends ChatJob
> extends JobBuilder<Job> {
  input: Job["input"];

  constructor(model: string) {
    super();
    this.type = "chat";
    this.input = {
      model: model,
      messages: [],
    };
  }

  system(system: string) {
    this.input.system = system;
    return this;
  }

  messages(messages: Message[]) {
    this.input.messages = messages;
    return this;
  }

  temperature(temperature: number) {
    this.input.temperature = temperature;
    return this;
  }

  maxTokens(maxTokens: number) {
    this.input.maxTokens = maxTokens;
    return this;
  }

  topP(topP: number) {
    this.input.topP = topP;
    return this;
  }

  topK(topK: number) {
    this.input.topK = topK;
    return this;
  }

  tools(tools: ChatTool[]) {
    this.input.tools = tools.map((tool) => tool.params);
    return this;
  }

  tool(tool: ChatTool) {
    if (!this.input.tools) {
      this.input.tools = [];
    }
    this.input.tools.push(tool.params);
    return this;
  }

  toolChoice(toolChoice: string) {
    this.input.toolChoice = toolChoice;
    return this;
  }

  responseFormat(responseFormat: ResponseFormat) {
    this.input.responseFormat = responseFormat;
    return this;
  }

  jsonSchema(schema: z.ZodType, name: string, description?: string) {
    this.input.jsonSchema = {
      name,
      description,
      schema,
    };

    return this;
  }

  stream(streamOptions?: ChatStreamOptions) {
    this.input.stream = true;
    if (streamOptions) {
      this.input.streamOptions = streamOptions;
    }
    return this;
  }
}
