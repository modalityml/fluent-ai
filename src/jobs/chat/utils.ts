import { z } from "zod";
import { parse } from "partial-json";
import type { ChatToolSchema, Message } from "./schema";
import { ChatTool } from "./tool";

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

export function user(content: string) {
  return { role: "user", content: content } as Message;
}

export function assistant(content: string) {
  return { role: "assistant", content: content } as Message;
}

export function system(content: string) {
  return { role: "system", content: content } as Message;
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

export function text(result: any) {
  if (result.raw) {
    // output text
    return result.raw.choices[0].message.content;
  }
  if (result.choices[0].delta.content) {
    // chunk text
    return result.choices[0].delta.content;
  }
  return "";
}

export function object(result: any) {
  return JSON.parse(result.raw.choices[0].message.content);
}

export function partialParse(content: string) {
  if (content) {
    return parse(content);
  }
  return {};
}
