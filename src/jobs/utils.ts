// import { parse } from "partial-json";

export async function requestObject(request: Request) {
  return {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers as any),
    body: await request.text(),
  };
}

export function chunkText(chunk: any) {
  return chunk.choices[0].delta.content;
}

// TODO:
export function chunkObject(chunk: any) {}

// TODO:
export function chunkTools(chunk: any) {}
