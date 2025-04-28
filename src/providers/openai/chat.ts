import { z } from "zod";
import { ChatJobBuilder, type ChatOutput } from "~/jobs/chat";
import type { JobOptions } from "~/jobs/schema";
import { OPENAI_BASE_URL, type OpenAIChatJob } from "./schema";
import { EventSourceParserStream } from "eventsource-parser/stream";
import type {
  OpenAIResponse,
  OpenAIStreamResponse,
  OpenAIToolCall,
  OpenAIDelta,
  FormattedToolCall,
  OpenAIChatCompletionRequest,
  OpenAIMessageRequest,
  OpenAIResponseFormat,
  OpenAIJSONSchemaResponseFormat,
  OpenAIToolDefinition,
} from "./types";
import { convertToolChoice, convertTools } from "./utils";

export class OpenAIChatJobBuilder extends ChatJobBuilder<OpenAIChatJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }

  makeRequest = () => {
    const baseURL = this.options!.baseURL || OPENAI_BASE_URL;
    const messages = this.input.messages as unknown as OpenAIMessageRequest[];

    if (this.input.system) {
      messages.unshift({
        role: "system",
        content: this.input.system,
      });
    }

    const requestBody: OpenAIChatCompletionRequest = {
      messages,
      model: this.input.model,
      stream: this.input.stream,
    };

    if (this.input.temperature !== undefined) {
      requestBody.temperature = this.input.temperature;
    }

    if (this.input.maxTokens !== undefined) {
      requestBody.max_tokens = this.input.maxTokens;
    }

    if (this.input.topP !== undefined) {
      requestBody.top_p = this.input.topP;
    }

    if (this.input.tools && this.input.tools.length) {
      requestBody.tools = convertTools(this.input.tools);

      if (this.input.toolChoice) {
        requestBody.tool_choice = convertToolChoice(this.input.toolChoice);
      }
    }

    if (this.input.responseFormat) {
      requestBody.response_format = this.input
        .responseFormat as OpenAIResponseFormat;
    }

    if (this.input.jsonSchema) {
      const schema = z.toJSONSchema(this.input.jsonSchema.schema);
      requestBody.response_format = {
        type: "json_schema",
        schema: {
          name: this.input.jsonSchema.name,
          description: this.input.jsonSchema.description,
          ...schema,
        },
      } as OpenAIJSONSchemaResponseFormat;
    }

    return new Request(`${baseURL}/chat/completions`, {
      headers: {
        Authorization: `Bearer ${this.options!.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  };

  async handleResponse(response: Response) {
    // Handle non-streaming response
    const raw = (await response.json()) as OpenAIResponse;

    // Record cost/usage information
    if (raw.usage) {
      this.cost = {
        promptTokens: raw.usage.prompt_tokens,
        completionTokens: raw.usage.completion_tokens,
        totalTokens: raw.usage.total_tokens,
      };
    }

    // Format the response to match ChatOutput schema
    const choice = raw.choices?.[0];
    const message = choice?.message;

    const output: ChatOutput = {
      raw,
    };

    if (message) {
      output.message = {
        role: "assistant",
        content: message.content ?? "",
      };

      // Handle tool calls if present
      if (message.tool_calls && message.tool_calls.length > 0) {
        output.message.tool_calls = message.tool_calls.map(
          (call: OpenAIToolCall): FormattedToolCall => {
            const result: FormattedToolCall = {
              id: call.id,
              type: call.type,
              name: call.function?.name || "",
              arguments: {} as Record<string, unknown>,
            };

            if (call.function) {
              // Safely handle arguments
              if (call.function.arguments) {
                try {
                  result.arguments = JSON.parse(call.function.arguments);
                } catch (e) {
                  // If parsing fails, return as string
                  result.arguments = { _raw: call.function.arguments };
                }
              }
            }

            return result;
          },
        );
      }
    }

    return output;
  }

  async *handleStream(response: Response) {
    const eventStream = response
      .body!.pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());
    const reader = eventStream.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done || value.data === "[DONE]") {
        break;
      }

      const chunk = JSON.parse(value.data) as OpenAIStreamResponse;
      const delta = chunk.choices?.[0]?.delta;

      // Create a properly formatted ChatOutput object
      const output: ChatOutput = { raw: chunk };

      if (delta) {
        output.message = {
          role: "assistant",
          content: delta.content || "",
        };

        // Handle tool calls in stream
        if (delta.tool_calls && delta.tool_calls.length > 0) {
          output.message.tool_calls = delta.tool_calls.map(
            (call): FormattedToolCall => {
              const result: FormattedToolCall = {
                id: call.id || "",
                type: call.type || "",
                name: call.function?.name || "",
                arguments: {} as Record<string, unknown>,
              };

              if (call.function) {
                // Safely handle arguments which might be partial JSON in streaming
                if (call.function.arguments) {
                  try {
                    result.arguments = JSON.parse(call.function.arguments);
                  } catch (e) {
                    // If parsing fails (for partial JSON), return as string
                    result.arguments = { _raw: call.function.arguments };
                  }
                }
              }

              return result;
            },
          );
        }
      }

      yield output;
    }
  }
}
