import type { Job } from "./jobs/load";

export interface ClientOptions {
  url: string;
  apiKey: string;
}

export class Client {
  url: string;
  apiKey: string;

  constructor(options: ClientOptions) {
    this.url = options.url;
    this.apiKey = options.apiKey;
  }

  async createJob(job: Job) {
    // TODO: reuse fetch error handling
    const response = await fetch(`${this.url}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(job),
    });

    const data = await response.json();
    return data;
  }

  async streamJob(jobId: string) {
    const response = await fetch(`${this.url}/api/jobs/${jobId}/stream`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    async function* streamGenerator() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              yield data;
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    }

    return streamGenerator();
  }
}

export function createClient(options: ClientOptions): Client {
  return new Client(options);
}
