import type { Job } from "~/src/job/schema";

type Options = Extract<Job, { provider: "voyage" }>["options"];
type Body = Extract<Job, { provider: "voyage" }>["body"];
type EmbeddingInput = Extract<Body, { type: "embedding" }>["input"];

const BASE_URL = "https://api.voyageai.com/v1";

export const runner = {
  embedding: async (input: EmbeddingInput, options?: Options) => {
    const apiKey = options?.apiKey || process.env.VOYAGE_API_KEY;

    const response = await fetch(`${BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        input: input.input,
      }),
    });

    if (!response.ok) {
      throw new Error(`Voyage API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      embeddings: data.data.map((item: any) => item.embedding),
    };
  },
};
