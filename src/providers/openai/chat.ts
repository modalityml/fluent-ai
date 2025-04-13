import { z } from "zod";
import { EventSourceParserStream } from "eventsource-parser/stream";
import {
  ChatJobBuilder,
  convertMessages,
  convertTools,
  type JobOptions,
} from "~/jobs";
import { OPENAI_BASE_URL } from "./schema";

export class OpenAIChatJobBuilder extends ChatJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    const messages = convertMessages(this.job.messages);

    if (this.job.systemPrompt) {
      messages.unshift({
        role: "system",
        content: this.job.systemPrompt,
      });
    }
    const requestBody = {
      messages: messages,
      model: this.job.model,
      temperature: this.job.temperature,
      stream: this.job.stream,
      response_format: this.job.responseFormat,
    } as any;

    if (this.job.tools && this.job.tools.length) {
      requestBody.tools = convertTools(this.job.tools);
      requestBody.tool_choice = this.job.toolChoice;
    }

    if (this.job.jsonSchema) {
      const schema = z.toJSONSchema(this.job.jsonSchema.schema);
      requestBody.response_format = {
        type: "json_schema",
        json_schema: {
          name: this.job.jsonSchema.name,
          description: this.job.jsonSchema.description,
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
    if (this.job.stream) {
      return (async function* () {
        const eventStream = response
          .body!.pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream());
        const reader = eventStream.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          if (value.data === "[DONE]") {
            break;
          }

          const chunk = JSON.parse(value.data);
          if (chunk.choices[0].finish_reason) {
          } else {
            yield chunk;
          }
        }
      })();
    }

    const chatCompletion = await response.json();

    if (this.job.tools && this.job.tools.length) {
      return {
        text: chatCompletion.choices[0].message.content,
        toolCalls: chatCompletion.choices[0].message.tool_calls,
      };
    } else {
      const content = chatCompletion.choices[0].message.content;
      if (this.job.jsonSchema) {
        const parsed = JSON.parse(content);
        return { text: content, object: parsed };
      }
      return { text: content };
    }
  };
}
