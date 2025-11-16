import { EventSourceParserStream } from "eventsource-parser/stream";
import type { ChatTool } from "~/src/job/schema";

/**
 * Gets API key from options or environment variable
 */
export function getApiKey(
  options: { apiKey?: string } | undefined,
  envVarName: string,
): string | undefined {
  return options?.apiKey || process.env[envVarName];
}

/**
 * Transforms internal ChatTool format to OpenAI-compatible function calling format
 */
export function transformToolsToFunctions(tools?: ChatTool[]) {
  return tools?.map((tool: ChatTool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input,
    },
  }));
}

/**
 * Transforms OpenAI-style usage data to internal format
 */
export function transformUsageData(usage?: any) {
  return usage
    ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      }
    : undefined;
}

/**
 * Creates an async generator for OpenAI-compatible streaming responses
 */
export async function* createStreamingGenerator(response: Response) {
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
}
