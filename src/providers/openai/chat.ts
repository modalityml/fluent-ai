import { z } from "zod";
import { ChatJobBuilder, convertTools } from "~/jobs/chat";
import type { JobOptions } from "~/jobs/schema";
import { jobStream } from "~/jobs/stream";
import { OPENAI_BASE_URL } from "./schema";

export class OpenAIChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    const messages = this.input.messages;

    if (this.input.system) {
      messages.unshift({
        role: "system",
        content: this.input.system,
      });
    }
    const requestBody = {
      messages: messages,
      model: this.input.model,
      temperature: this.input.temperature,
      stream: this.input.stream,
      response_format: this.input.responseFormat,
    } as any;

    if (this.input.tools && this.input.tools.length) {
      requestBody.tools = convertTools(this.input.tools);
      requestBody.tool_choice = this.input.toolChoice;
    }

    if (this.input.jsonSchema) {
      const schema = z.toJSONSchema(this.input.jsonSchema.schema);
      requestBody.response_format = {
        type: "json_schema",
        json_schema: {
          name: this.input.jsonSchema.name,
          description: this.input.jsonSchema.description,
          schema: schema,
        },
      };
    }

    return new Request(`${baseURL}/chat/completions`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  };

  handleResponse = async (response: Response) => {
    if (this.input.stream) {
      return jobStream(response);
    }

    const raw = await response.json();
    this.cost = {
      promptTokens: raw.usage.prompt_tokens,
      completionTokens: raw.usage.completion_tokens,
      totalTokens: raw.usage.total_tokens,
    };
    return { raw };
  };
}
