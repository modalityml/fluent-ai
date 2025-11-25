import { EventSourceParserStream } from "eventsource-parser/stream";
import type { ChatTool } from "~/src/job/schema";

export function getApiKey(
  options: { apiKey?: string } | undefined,
  envVarName: string,
): string | undefined {
  return options?.apiKey || process.env[envVarName];
}

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

export function transformUsageData(usage?: any) {
  return usage
    ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      }
    : undefined;
}

export async function* createStreamingGenerator(response: Response) {
  const eventStream = response
    .body!.pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream());
  const reader = eventStream.getReader();

  try {
    while (true) {
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
