import z from "zod";
import type { ChatToolChoiceSchema, ChatToolSchema } from "~/jobs/chat";
import type { OpenAIToolDefinition, OpenAIToolChoice } from "./types";
export function convertTools(tools: z.infer<typeof ChatToolSchema>[]): OpenAIToolDefinition[] {
  return tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: z.toJSONSchema(tool.parameters),
    },
  }));
}


export function convertToolChoice(toolChoice: z.infer<typeof ChatToolChoiceSchema>): OpenAIToolChoice {
  if (!toolChoice) return "auto";
  
  switch (toolChoice.mode) {
    case "none":
      return "none";
    case "auto":
      return "auto";
    case "any":
      // If allowed_tools is specified and has exactly one tool, specify that tool
      if (toolChoice.allowed_tools && toolChoice.allowed_tools.length === 1) {
        return {
          type: "function",
          function: { name: toolChoice.allowed_tools[0] }
        };
      }
      // Otherwise, use auto
      return "auto";
    default:
      return "auto";
  }
}
