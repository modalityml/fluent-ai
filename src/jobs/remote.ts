import { version } from "../../package.json";
import type { JobSchemaType } from "./load";

export interface JobRemoteOptions {
  apiKey?: string;
  baseURL?: string;
}

export async function runRemoteJob(
  payload: JobSchemaType,
  options?: JobRemoteOptions
) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FLUENT_API_KEY;
  const baseURL = options.baseURL || "http://localhost:5173/api";

  // TODO: add more api types
  const job: { id: string; stream: boolean } = await fetch(`${baseURL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `fluent-ai/${version}`,
      Authorization: `Bearer ${options?.apiKey}`,
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

  console.log("created", job);

  const stream = await fetch(`${baseURL}/jobs/${job.id}/stream`);
}
