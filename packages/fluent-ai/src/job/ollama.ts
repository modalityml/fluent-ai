import type { ChatJob, ModelsJob } from "~/src/job/schema";
import { createHTTPJob } from "~/src/job/http";
import {
  transformToolsToFunctions,
  createStreamingGenerator,
} from "~/src/job/utils";

const DEFAULT_BASE_URL = "http://localhost:11434";

function getBaseUrl(options?: ChatJob["options"]): string {
  return options?.baseUrl || process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL;
}

export const runner = {
  chat: async (input: ChatJob["input"], options?: ChatJob["options"]) => {
    const baseUrl = getBaseUrl(options);
    const tools = transformToolsToFunctions(input.tools);

    const request = new Request(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        messages: input.messages,
        temperature: input.temperature,
        tools: tools,
        stream: input.stream ?? false,
        options: {
          num_predict: input.maxTokens,
        },
      }),
    });

    return createHTTPJob(request, async (response: Response) => {
      if (input.stream) {
        return createStreamingGenerator(response);
      }

      const data = await response.json();

      return {
        messages: [
          {
            role: data.message.role,
            content: data.message.content,
            tool_calls: data.message.tool_calls,
          },
        ],
        usage: data.prompt_eval_count
          ? {
              promptTokens: data.prompt_eval_count || 0,
              completionTokens: data.eval_count || 0,
              totalTokens:
                (data.prompt_eval_count || 0) + (data.eval_count || 0),
            }
          : undefined,
      };
    });
  },

  models: async (
    input?: ModelsJob["input"],
    options?: ModelsJob["options"],
  ) => {
    const baseUrl = getBaseUrl(options);

    const request = new Request(`${baseUrl}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return createHTTPJob(request, async (response: Response) => {
      const data = await response.json();

      return data.models.map((model: any) => ({
        id: model.name,
        name: model.name,
      }));
    });
  },
};
