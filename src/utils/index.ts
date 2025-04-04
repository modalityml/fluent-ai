import { parse } from "partial-json";

export function chunkText(chunk: any) {
  return chunk.choices[0].delta.content;
}

// TODO:
export function chunkObject(chunk: any) {}

// TODO:
export function chunkTools(chunk: any) {}
