import { EventSourceParserStream } from "eventsource-parser/stream";
import type { ChatTool, Job } from "~/src/job/schema";

type Options = Extract<Job, { provider: "openrouter" }>["options"];
type Body = Extract<Job, { provider: "openrouter" }>["body"];
type ChatInput = Extract<Body, { type: "chat" }>["input"];

const BASE_URL = "https://openrouter.ai/api/v1";

export const runner = {
  chat: async (input: ChatInput, options?: Options) => {
    const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;

    const tools = input.tools?.map((tool: ChatTool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input,
      },
    }));

    const response = await fetch(`${BASE_URL}/chat/completions`, {
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

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

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
  },
};
