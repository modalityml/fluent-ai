import { EventSourceParserStream } from "eventsource-parser/stream";
import { registry } from "~/src/job/registry";
import type { Options, ChatTool, Job } from "~/src/job/schema";

const BASE_URL = "https://openrouter.ai/api/v1";

type ChatBody = Extract<Job, { provider: "openrouter" }>["body"];

registry.register("openrouter", "chat", {
  execute: async (body: ChatBody, options?: Options) => {
    const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;
    const baseURL = options?.baseURL || BASE_URL;

    if (!apiKey) {
      throw new Error("OpenRouter API key is required");
    }

    const tools = body.input.tools?.map((tool: ChatTool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input,
      },
    }));

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.input.model,
        messages: body.input.messages,
        temperature: body.input.temperature,
        max_tokens: body.input.maxTokens,
        tools: tools,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
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
  executeStream: async function* (body: ChatBody, options?: Options) {
    const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;
    const baseURL = options?.baseURL || BASE_URL;

    if (!apiKey) {
      throw new Error("OpenRouter API key is required");
    }

    const tools = body.input.tools?.map((tool: ChatTool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input,
      },
    }));

    // TODO: shared fetch() with error handling
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.input.model,
        messages: body.input.messages,
        temperature: body.input.temperature,
        max_tokens: body.input.maxTokens,
        stream: true,
        tools: tools,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

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
      reader.releaseLock(); // TODO: necessary?
    }
  },
});
