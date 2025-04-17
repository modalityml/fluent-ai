import { z } from "zod";
import { JobBuilder } from "~/jobs/builder";
import type {
  ChatJobSchema,
  ChatStreamOptions,
  Message,
  ResponseFormat,
} from "./schema";
import type { ChatTool } from "./tool";

type ChatJob = z.infer<typeof ChatJobSchema>;

export class ChatJobBuilder extends JobBuilder {
  job: ChatJob;

  constructor(model: string) {
    super();
    this.job = {
      type: "chat",
      model: model,
      messages: [],
    };
  }

  systemPrompt(systemPrompt: string) {
    this.job.systemPrompt = systemPrompt;
    return this;
  }

  messages(messages: Message[]) {
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
    this.job.tools = tools.map((tool) => tool.params);
    return this;
  }

  tool(tool: ChatTool) {
    if (!this.job.tools) {
      this.job.tools = [];
    }
    this.job.tools.push(tool.params);
    return this;
  }

  toolChoice(toolChoice: string) {
    this.job.toolChoice = toolChoice;
    return this;
  }

  responseFormat(responseFormat: ResponseFormat) {
    this.job.responseFormat = responseFormat;
    return this;
  }

  jsonSchema(schema: z.ZodType, name: string, description?: string) {
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
    return {
      ...super.dump(),
      ...this.job,
    };
  }
}
