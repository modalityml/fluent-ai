import { EventSourceParserStream } from "eventsource-parser/stream";
import type { ChatJob, ChatTool, ModelsJob } from "~/src/job/schema";
import { createHTTPJob } from "~/src/job/http";

const BASE_URL = "https://api.openai.com/v1";

export const runner = {
  chat: async (input: ChatJob["input"], options?: ChatJob["options"]) => {
    const apiKey = options?.apiKey || process.env.OPENAI_API_KEY;

    const tools = input.tools?.map((tool: ChatTool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input,
      },
    }));

    const request = new Request(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        temperature: input.temperature,
        max_tokens: input.maxTokens,
        tools: tools,
        stream: input.stream,
      }),
    });

    return createHTTPJob(request, async (response: Response) => {
      if (input.stream) {
        return (async function* () {
          const eventStream = response
            .body!.pipeThrough(new TextDecoderStream())
            .pipeThrough(new EventSourceParserStream());
          const reader = eventStream.getReader();

          try {
            for (;;) {
              const { done, value } = await reader.read();
              if (done || value.data === "[DONE]") {
                break;
              }
              const chunk = JSON.parse(value.data);
              yield { raw: chunk };
            }
          } finally {
            reader.releaseLock();
          }
        })();
      }

      const data = await response.json();

      return {
        messages: [
          {
            role: data.choices[0].message.role,
            content: data.choices[0].message.content,
            tool_calls: data.choices[0].message.tool_calls,
          },
        ],
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    });
  },

  models: async (
    input?: ModelsJob["input"],
    options?: ModelsJob["options"],
  ) => {
    const apiKey = options?.apiKey || process.env.OPENAI_API_KEY;

    const request = new Request(`${BASE_URL}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    return createHTTPJob(request, async (response: Response) => {
      const data = await response.json();

      return {
        models: data.data.map((model: any) => ({
          id: model.id,
          name: model.id,
        })),
      };
    });
  },
};
