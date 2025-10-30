import type { Job } from "~/src/job/schema";

type Options = Extract<Job, { provider: "fal" }>["options"];
type Body = Extract<Job, { provider: "fal" }>["body"];
type ImageInput = Extract<Body, { type: "image" }>["input"];

// TODO: switch to fal queue api
const BASE_URL = "https://fal.run";

export const runner = {
  image: async (input: ImageInput, options?: Options) => {
    const apiKey = options?.apiKey || process.env.FAL_API_KEY;

    const response = await fetch(`${BASE_URL}/${input.model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input.prompt,
        image_size: input.size,
        num_images: input.n || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`FAL API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      images: data.images.map((img: any) => ({
        url: img.url,
        width: img.width,
        height: img.height,
      })),
    };
  },
};
