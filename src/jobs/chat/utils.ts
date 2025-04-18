import { z } from "zod";
import type { ChatToolSchema, Message } from "./schema";
import { ChatTool } from "./tool";

export function systemPrompt(content: string): Message {
  return { role: "system", content };
}

export function userPrompt(content: string): Message {
  return { role: "user", content };
}

export function assistantPrompt(content: string): Message {
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

export function convertTools(tools: z.infer<typeof ChatToolSchema>[]) {
  return tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: z.toJSONSchema(tool.parameters),
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
  if (chunk.choices[0].delta.content) {
    return chunk.choices[0].delta.content;
  }
  return "";
}

// TODO:
export function chunkObject(chunk: any) {}

// TODO:
export function chunkTools(chunk: any) {}
