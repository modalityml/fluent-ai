import { z } from "zod";
import type { Message } from "./schema";
import { ChatTool } from "./tool";

export function systemPrompt(content: string) {
  return { role: "system", content };
}

export type UserPromptContent = string | { image: { url: string } };

export function userPrompt(...content: UserPromptContent[]) {
  return { role: "user", content };
}

export function assistantPrompt(content: string) {
  return { role: "assistant", content };
}

export function convertMessages(messages: Message[]) {
  return messages.map((message) => {
    if (message.role === "user") {
      if (Array.isArray(message.content)) {
        if (message.content.length === 1) {
          return { role: "user", content: message.content[0] };
        } else {
          return {
            role: "user",
            content: message.content.map((c) => {
              if (typeof c === "string") {
                return { type: "text", text: c };
              } else if (c.type === "image") {
                return {
                  type: "image_url",
                  image_url: {
                    url: c.image_url,
                  },
                };
              }
            }),
          };
        }
      } else {
        return { role: "user", content: message.content };
      }
    }
    return message;
  });
}

export function convertTools(tools: ChatTool[]) {
  return tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.params.name,
      description: tool.params.description,
      parameters: z.toJSONSchema(tool.params.parameters!),
    },
  }));
}

export function audio() {
  throw new Error("Not implemented");
}

export function image() {
  throw new Error("Not implemented");
}

export function tool(name: string) {
  return new ChatTool(name);
}

export function chunkText(chunk: any) {
  return chunk.choices[0].delta.content;
}

// TODO:
export function chunkObject(chunk: any) {}

// TODO:
export function chunkTools(chunk: any) {}
