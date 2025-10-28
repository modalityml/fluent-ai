import type { Message } from "~/src/job/schema";

export function convertMessagesForChatCompletion(messages: Message[]) {
  let result = [];

  for (const message of messages) {
    if (message.role === "tool") {
      const part = message.parts[0]; // TODO: support multiple parts
      result.push({
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: part.toolCallId,
            type: "function",
            function: {
              name: part.type.substring("tool-".length),
              arguments: JSON.stringify(part.input),
            },
          },
        ],
      });

      if (part.outputError) {
        result.push({
          role: "tool",
          tool_call_id: part.toolCallId,
          content: JSON.stringify(part.outputError),
        });
      } else if (part.output) {
        result.push({
          role: "tool",
          tool_call_id: part.toolCallId,
          content: JSON.stringify(part.output),
        });
      }
    } else {
      result.push({
        role: message.role,
        content: message.parts,
      });
    }
  }

  return result;
}
