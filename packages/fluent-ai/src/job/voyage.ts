import type { EmbeddingJob } from "~/src/job/schema";
import { createHTTPJob } from "~/src/job/http";

const BASE_URL = "https://api.voyageai.com/v1";

export const runner = {
  embedding: async (
    input: EmbeddingJob["input"],
    options?: EmbeddingJob["options"],
  ) => {
    const apiKey = options?.apiKey || process.env.VOYAGE_API_KEY;

    const request = new Request(`${BASE_URL}/embeddings`, {
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

    return createHTTPJob(request, async (response: Response) => {
      const data = await response.json();

      return {
        embeddings: data.data.map((item: any) => item.embedding),
      };
    });
  },
};
