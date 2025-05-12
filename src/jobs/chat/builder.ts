import { z } from "zod";
import { HTTPError, JobBuilder } from "~/jobs/builder";
import type {
  ChatJob,
  ChatStreamOptions,
  ChatToolChoiceSchema,
  Message,
  ResponseFormat,
} from "./schema";
import type { ChatTool } from "./tool";

export abstract class ChatJobBuilder<
  Job extends ChatJob,
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

  async *handleStream(response: Response): AsyncGenerator<Job["output"]> {
    throw new Error("Not implemented");
  }

  async *stream(options?: ChatStreamOptions): AsyncGenerator<Job["output"]> {
    this.input.stream = true;
    this.input.streamOptions = options;
    if (!this.handleStream) {
      throw new Error("Stream not supported");
    }
    const request = this.makeRequest!();
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(
        `Fetch error: ${response.statusText}`,
        response.status,
      );
    }
    yield* this.handleStream(response);
  }

  system(system: string) {
    this.input.system = system;
    return this;
  }

  messages(messages: Message[]) {
    this.input.messages = messages;
    return this;
  }

  prompt(prompt: string) {
    this.input.messages.push({
      role: "user",
      content: prompt,
    });
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

  toolChoice(toolChoice: z.infer<typeof ChatToolChoiceSchema>) {
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
}
