import { EventSourceParserStream } from "eventsource-parser/stream";
import { parse } from "partial-json";
import zodToJsonSchema from "zod-to-json-schema";
import { ChatJob, convertMessages } from "../jobs/chat";
import { EmbeddingJob } from "../jobs/embedding";
import { ImageJob } from "../jobs/image";
import { ListModelsJob } from "../jobs/models";
import type { AIProviderOptions } from "../jobs/job";

const OPENAI_BASE_URL = "https://api.openai.com/v1";

export function openai(options?: AIProviderOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.OPENAI_API_KEY;

  if (!options.apiKey) {
    throw new Error("OpenAI API key is required");
  }

  return {
    chat(model: string) {
      return new OpenAIChatJob(options, model);
    },
    listModels() {
      return new OpenAIListModelsJob(options);
    },
    image(model: string) {
      return new OpenAIImageJob(options, model);
    },
    embedding(model: string) {
      return new OpenAIEmbeddingJob(options, model);
    },
  };
}

export class OpenAIChatJob extends ChatJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    const messages = convertMessages(this.params.messages);

    if (this.params.systemPrompt) {
      messages.unshift({
        role: "system",
        content: this.params.systemPrompt,
      });
    }
    const requestBody = {
      messages: messages,
      model: this.model,
      temperature: this.params.temperature,
      stream: this.params.stream,
      response_format: this.params.responseFormat,
    } as any;

    if (this.params.tools && this.params.tools.length) {
      requestBody.tools = this.params.tools.map((tool) => tool.toJSON());
      requestBody.tool_choice = this.params.toolChoice;
    }

    if (this.params.jsonSchema) {
      const schema = zodToJsonSchema(this.params.jsonSchema.schema);
      requestBody.response_format = {
        type: "json_schema",
        json_schema: {
          name: this.params.jsonSchema.name,
          description: this.params.jsonSchema.description,
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
    if (this.params.stream) {
      return {
        stream: (async function* () {
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
        })(),

        textStream: (async function* () {
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
              const chunkText = chunk.choices[0].delta.content;
              if (chunkText) {
                yield chunkText;
              }
            }
          }
        })(),

        objectStream: (async function* () {
          const eventStream = response
            .body!.pipeThrough(new TextDecoderStream())
            .pipeThrough(new EventSourceParserStream());
          const reader = eventStream.getReader();
          let text = "";
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
              const chunkText = chunk.choices[0].delta.content;
              text += chunkText;
              if (text) {
                const result = parse(text);
                yield result;
              }
            }
          }
        })(),

        toolCallStream: (async function* () {
          const eventStream = response
            .body!.pipeThrough(new TextDecoderStream())
            .pipeThrough(new EventSourceParserStream());
          const reader = eventStream.getReader();

          let toolCalls = [];
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
              const { delta } = chunk.choices[0];
              if (delta.tool_calls) {
                for (const tool_call of delta.tool_calls) {
                  if (!toolCalls[tool_call.index]) {
                    toolCalls[tool_call.index] = tool_call;
                  } else {
                    toolCalls[tool_call.index].function.arguments +=
                      tool_call.function.arguments;
                  }
                }
              } else if (delta.content) {
              }
              const partials = toolCalls.map((toolCall) => {
                if (toolCall.function.arguments) {
                  return parse(toolCall.function.arguments);
                }
              });
              yield partials;
            }
          }
        })(),
      };
    }

    const chatCompletion = await response.json();

    if (this.params.tools && this.params.tools.length) {
      return {
        text: chatCompletion.choices[0].message.content,
        toolCalls: chatCompletion.choices[0].message.tool_calls,
      };
    } else {
      const content = chatCompletion.choices[0].message.content;
      if (this.params.jsonSchema) {
        const parsed = JSON.parse(content);
        return { text: content, object: parsed };
      }
      return { text: content };
    }
  };
}


export class OpenAIListModelsJob extends ListModelsJob {
  constructor(options: AIProviderOptions) {
    super();
    this.provider = "openai";
    this.options = options
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/models`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "GET"
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };
}

export class OpenAIImageJob extends ImageJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
    this.model = model;
  }

  prompt(_prompt: string) {
    this.params.prompt = _prompt;
    return this;
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/image/generations`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        prompt: this.params.prompt,
        model: this.model,
        n: this.params.n,
        quality: this.params.quality,
        response_format: this.params.responseFormat,
        size: this.params.size,
        style: this.params.style,
        user: this.params.user,
      }),
    });
  };
}

export class OpenAIEmbeddingJob extends EmbeddingJob {
  constructor(options: AIProviderOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options || {};
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/embeddings`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: this.model,
        input: this.params.input,
        encoding_format: this.params.encodingFormat,
        dimensions: this.params.dimensions,
      }),
    });
  };

  handleResponse = async (response: Response) => {
    return await response.json();
  };
}